import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import rutas from "@/data/rutasData.json";

export default defineTool({
  name: "list_routes",
  title: "List map routes",
  description: "List the walking/travel routes (rutas) featured in the Comedor > Mapas section, grouped by state.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(rutas, null, 2) }],
    structuredContent: { routes: rutas as unknown },
  }),
});
