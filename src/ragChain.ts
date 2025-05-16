import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createVectorStore } from "./vectorStore.js";
import { config } from "dotenv";

config();

export async function createRAGChain() {

  const vectorStore = await createVectorStore();

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant for Promtior. Use the following context to answer the user's question.
If the answer is not in the context, say you don't know.

Context:
{context}`,
    ],
    ["human", "{question}"],
  ]);

  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const chain = RunnableSequence.from([
    {
      question: (input: string) => input,
      context: async (input: string) => {
        const allDocs = await vectorStore.similaritySearch(input, 20);
      
        const pdfChunks = allDocs.filter(doc => doc.metadata?.source === "pdf").slice(0, 3);
        const webChunks = allDocs.filter(doc => doc.metadata?.source === "website").slice(0, 3);
      
        const selectedChunks = [...pdfChunks, ...webChunks];
      
        return selectedChunks.map(doc => doc.pageContent).join("\n---\n");
      }
    },
    prompt,
    model,
  ]);

  return chain;
}
