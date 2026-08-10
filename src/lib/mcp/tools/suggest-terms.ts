import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { autocomplete } from "@/catalog/public/read.server";

export const suggestTermsInputSchema = {
  q: z.string().trim().min(2).max(50).describe("Termo parcial com pelo menos 2 caracteres."),
};

const suggestTermsResultSchema = z.object({
  suggestions: z.array(
    z.object({
      kind: z.enum(["sku", "family"]),
      label: z.string(),
      sublabel: z.string().nullable(),
      familySlug: z.string(),
      sku: z.string().nullable(),
    }),
  ),
});

export default defineTool({
  name: "suggest_terms",
  title: "Sugerir termos e códigos",
  description:
    "Autocomplete do catálogo público da AviZee: devolve sugestões de famílias e códigos (SKU) a partir de um termo parcial, tolerante a acentos e erros de digitação.",
  inputSchema: suggestTermsInputSchema,
  outputSchema: suggestTermsResultSchema.shape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ q }) => {
    const result = await autocomplete(q);
    const parsed = suggestTermsResultSchema.parse(result);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed,
    };
  },
});
