import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import amigos from "@/data/amigosData.json";

export default defineTool({
  name: "list_friends",
  title: "List Leonora's friends",
  description: "List the friends (amigos) featured in the Comedor section of the Casa Estudio Leonora Carrington.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(amigos, null, 2) }],
    structuredContent: { friends: amigos as unknown },
  }),
});
