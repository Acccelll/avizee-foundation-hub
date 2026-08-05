import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { getPublicFamily } from "@/catalog/public/read.server";

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
  image: z.any(),
  variations: z.array(z.any()),
  related: z.array(z.any()),
});

export default defineTool({
  name: "get_family",
  title: "Detalhar família de produtos",
  description:
    "Retorna o detalhe público de uma família de produtos da AviZee: descrição, aplicações, imagem e todas as variações com SKU e especificações técnicas. Sem preço e sem marca de terceiro.",
  inputSchema: {
    categoria: z.string().trim().max(100).describe("Slug da categoria pública da família."),
    familia: z.string().trim().max(100).describe("Slug da família."),
  },
  outputSchema: familyDetailSchema,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ categoria, familia }) => {
    const family = await getPublicFamily(categoria, familia);
    if (!family) {
      throw new ToolError(`Família não encontrada ou não publicada: ${categoria}/${familia}`);
    }
    
    const parsed = familyDetailSchema.parse(family);
    
    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed as any,
    };
  },
});
