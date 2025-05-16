# Promtior RAG Chatbot

This is a Retrieval-Augmented Generation (RAG) chatbot that answers questions about Promtior based on content from:
- The official [Promtior website](https://www.promtior.ai)
- A supplementary PDF provided in the challenge

Built using LangChain (JavaScript), OpenAI API, and deployed via Railway.

---

## 💡 Features

- Uses LangChain’s official JavaScript SDK
- Embeds both website and PDF content
- Exposes an `/invoke` endpoint that replicates LangServe functionality
- Responds to natural language queries like:
  - “What services does Promtior offer?”
  - “When was the company founded?”

---

## 🛠 Technologies

- **LangChain JS**
- **OpenAI API**
- **Express** (custom API wrapper for RAG chain)
- **MemoryVectorStore**
- **Deployed on Railway**

---

## 🚀 Running Locally

1. **Clone the repo**
```bash
git clone https://github.com/gerocaffera/promtior.git
cd promtior
