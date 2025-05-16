import express from "express";
import { createRAGChain } from "./ragChain.js";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());

const start = async () => {

  const chain = await createRAGChain();

  app.post("/invoke", async (req, res) => {
    const input = req.body.input;

    try {
      const result = await chain.invoke(input);
      res.json({ result: result.content ?? result }); 
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`RAG API ready at http://localhost:${port}/invoke`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
});
