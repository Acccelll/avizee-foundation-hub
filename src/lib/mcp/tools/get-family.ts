import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { getPublicFamily } from "@/catalog/public/read.server";

export const getFamilyInputSchema = {
  categoria: z.string().trim().max(100).describe("Slug da categoria pública da família."),
  familia: z.string().trim().max(100).describe("Slug da família."),
};

const familyDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
  categorySlug: z.string(),
  categoryName: z.string(),
  segments: z.array(z.string()),
  applications: z.array(z.string()),
  image: z.object({
    url: z.string(),
    alt: z.string(),
    is_placeholder: z.boolean(),
  }),
  variations: z.array(
    z.object({
      id: z.string(),
      sku: z.string(),
      name: z.string(),
      variationLabel: z.string().nullable(),
      measure: z.string().nullable(),
      capacity: z.string().nullable(),
      unit: z.string().nullable(),
      description: z.string().nullable(),
      isOnRequest: z.boolean(),
      specifications: z.array(
        z.object({
          code: z.string(),
          label: z.string(),
          value: z.string(),
          unit: z.string().nullable(),
        }),
      ),
    }),
  ),
  related: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      summary: z.string().nullable(),
      categorySlug: z.string(),
      categoryName: z.string(),
      variationCount: z.number(),
    }),
  ),
});

export default defineTool({
  name: "get_family",
  title: "Detalhar família de produtos",
  description:
    "Retorna o detalhe público de uma família de produtos da AviZee: descrição, aplicações, imagem e todas as variações com SKU e especificações técnicas. Sem preço e sem marca de terceiro.",
  inputSchema: getFamilyInputSchema,
  outputSchema: familyDetailSchema.shape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ categoria, familia }) => {
    const family = await getPublicFamily(categoria, familia);
    if (!family) {
      throw new ToolError(`Família não encontrada ou não publicada: ${categoria}/${familia}`);
    }

    const parsed = familyDetailSchema.parse(family);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed,
    };
  },
});
