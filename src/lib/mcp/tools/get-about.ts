import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import about from "@/data/aboutData.json";

export default defineTool({
  name: "get_about",
  title: "About the project",
  description: "Get the About content for the Casa Estudio Leonora Carrington project (project info and authors).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(about, null, 2) }],
    structuredContent: { about: about as unknown },
  }),
});
