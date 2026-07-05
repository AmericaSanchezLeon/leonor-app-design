import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import recetas from "@/data/recetas.json";

export default defineTool({
  name: "list_recipes",
  title: "List recipes",
  description: "List the recipes from the Cocina (kitchen) section of the Casa Estudio Leonora Carrington.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(recetas, null, 2) }],
    structuredContent: { recipes: recetas as unknown },
  }),
});
