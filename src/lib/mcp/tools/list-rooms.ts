import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import roomData from "@/data/roomData.json";

export default defineTool({
  name: "list_rooms",
  title: "List rooms",
  description: "List the rooms (sections) of the Casa Estudio Leonora Carrington app: cocina, comedor, biblioteca, and about.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(roomData, null, 2) }],
    structuredContent: { rooms: roomData },
  }),
});
