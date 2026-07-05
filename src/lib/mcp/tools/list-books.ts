import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import booksData from "@/data/booksData.json";

export default defineTool({
  name: "list_books",
  title: "List library books",
  description: "List the books available in the Biblioteca (library) of the Casa Estudio Leonora Carrington.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(booksData, null, 2) }],
    structuredContent: { books: booksData as unknown },
  }),
});
