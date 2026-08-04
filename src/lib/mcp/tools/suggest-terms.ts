import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { autocomplete } from "@/catalog/public/read.server";

export default defineTool({
  name: "suggest_terms",
  title: "Sugerir termos e códigos",
  description:
    "Autocomplete do catálogo público da AviZee: devolve sugestões de famílias e códigos (SKU) a partir de um termo parcial, tolerante a acentos e erros de digitação.",
  inputSchema: {
    q: z.string().trim().describe("Termo parcial com pelo menos 2 caracteres."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ q }) => {
    const result = await autocomplete(q);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  },
});
