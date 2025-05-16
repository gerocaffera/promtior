import fs from "fs";
import { DocumentInterface } from "@langchain/core/documents";

export async function loadPromtiorPDF(): Promise<DocumentInterface[]> {
  const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
  const fileBuffer = fs.readFileSync("./src/data/AI-Engineer.pdf");

  const data = await pdfParse(fileBuffer);

  return [
    {
      pageContent: data.text,
      metadata: { source: "Promtior PDF" },
    },
  ];
}
