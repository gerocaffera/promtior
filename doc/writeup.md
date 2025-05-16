# Promtior RAG Chatbot – Technical Documentation

## Project Overview

This project implements a Retrieval-Augmented Generation (RAG) chatbot that answers questions about Promtior using content from both their official website and a supplementary PDF presentation.

The project was built using TypeScript and LangChain’s official JavaScript SDK. Since LangServe is a Python-only tool, a custom Express API was implemented to replicate its behavior and expose the RAG chain.

Initially, the chatbot was only returning generic answers or "I don’t know" — especially when the relevant information (such as the founding date) came solely from the PDF. This issue was caused by the retriever favoring website content due to higher embedding similarity.

To address this, the retriever results were manually filtered to include a balanced mix of top-ranked chunks from both the website and the PDF. This allowed the model to answer all target questions correctly, regardless of where the information was sourced.

## Implementation Logic

1. **Data Collection**
   - **Website**: Parsed and scraped via sitemap using Playwright to handle SPA rendering.
   - **PDF**: Loaded using `pdf-parse` and parsed into a single text document.

2. **Text Chunking**
   - All documents were split using `RecursiveCharacterTextSplitter` (chunk size: 1800, overlap: 200) to prepare them for embedding.

3. **Vector Embedding**
   - Chunks were embedded using `OpenAIEmbeddings` and stored in a `MemoryVectorStore`.

4. **Retriever**
   - The vector store is queried using `.similaritySearch`.
   - A custom filter was applied to mix top results from both the website and the PDF before sending them to the LLM.

5. **RAG Chain**
   - Built with `RunnableSequence`, combining the selected context, a system prompt, and the user question before calling `ChatOpenAI`.

6. **API Exposure**
   - An Express server exposes a single route: `POST /invoke`, which takes the user input and returns the chatbot’s response.

## Main Challenges and How They Were Solved

### 1. Scraping an SPA Website

Promtior’s site is a JavaScript-heavy Single Page Application. Basic HTML scrapers like `Cheerio` couldn’t extract meaningful content. To solve this, Playwright was used to render pages dynamically before scraping.

### 2. Missing PDF-based Answers

The model initially failed to answer "When was the company founded?" because this information only existed in the PDF and wasn't being retrieved. The retriever heavily favored website chunks due to embedding similarity.

**Solution**: After retrieving the top results, chunks were filtered by source (`pdf` vs `website`) and manually mixed to ensure diverse context for the model.

### 3. LangServe is Python-only

Since LangServe is not available for JavaScript, the project used Express to expose the RAG chain through an API endpoint, mimicking LangServe’s behavior in a Node.js environment.

### 4. Framework Choice – TypeScript vs Python

Although the prompt referenced Python examples, this solution was implemented in TypeScript using the official LangChain JavaScript SDK. This decision was based on developer experience and the maturity of LangChain JS, which provides full RAG and embedding functionality.

## Deployment

The solution is deployed on [Railway](https://railway.app) for simplicity and rapid setup. Although the instructions suggest using AWS or Azure, Railway provides a fully functional cloud environment for Node.js applications and supports all required functionality for this RAG chatbot.

- Public endpoint: `https://promtior-production.up.railway.app/invoke`
- Method: `POST`
- Request body: `{ "input": "<your question>" }`
- Environment variable: `OPENAI_API_KEY` and `PORT` is configured via Railway settings

## Questions Successfully Answered

| Question                                | Answered |
|----------------------------------------|----------|
| When was the company founded?          | Yes      |
| What services does Promtior offer?     | Yes      |
| What does Promtior specialize in?      | Yes      |
| Who are Promtior’s clients?            | Yes      |

## Diagram

See `diagram.png` for a visual representation of the system flow.
