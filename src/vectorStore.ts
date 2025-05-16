import { config } from "dotenv";
config();

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { loadPromtiorPagesFromSitemap } from "./loadSitemapPages.js";
import { loadPromtiorPDF } from "./loadPdf.js";

export async function createVectorStore() {
  const [webDocs, pdfDocs] = await Promise.all([
    loadPromtiorPagesFromSitemap(),
    loadPromtiorPDF(),
  ]);

  const taggedDocs = [
    ...webDocs.map((doc) => ({
      ...doc,
      metadata: { ...(doc.metadata || {}), source: "website" },
    })),
    ...pdfDocs.map((doc) => ({
      ...doc,
      metadata: { ...(doc.metadata || {}), source: "pdf" },
    })),
  ];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1800,     
    chunkOverlap: 200,   
  });

  const splitDocs = await splitter.splitDocuments(taggedDocs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings()
  );

  return vectorStore;
}
