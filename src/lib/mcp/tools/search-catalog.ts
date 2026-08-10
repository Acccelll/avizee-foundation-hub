import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { searchCatalog } from "@/catalog/public/read.server";

export const searchCatalogInputSchema = {
  q: z.string().trim().max(100).optional().describe("Termo livre, nome do produto ou código/SKU."),
  categoria: z.string().trim().max(100).optional().describe("Slug da categoria pública."),
  segmento: z.string().trim().max(100).optional().describe("Slug do segmento (ex.: avicultura)."),
  aplicacao: z.string().trim().max(100).optional().describe("Slug da aplicação/necessidade."),
  pagina: z.number().int().min(1).max(200).optional().describe("Página começando em 1."),
};

const searchCatalogResultSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      summary: z.string().nullable(),
      categorySlug: z.string(),
      categoryName: z.string(),
      segments: z.array(z.string()),
      applications: z.array(z.string()),
      variationCount: z.number(),
      skus: z.array(z.string()),
      matchedSku: z.string().nullable(),
      image: z.object({
        url: z.string(),
        alt: z.string(),
        is_placeholder: z.boolean(),
      }),
    }),
  ),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
});

export default defineTool({
  name: "search_catalog",
  title: "Buscar no catálogo AviZee",
  description:
    "Busca famílias de produtos publicadas no catálogo público da AviZee por termo, código (SKU), categoria, segmento ou aplicação. Não retorna preços nem marcas de terceiros.",
  inputSchema: searchCatalogInputSchema,
  outputSchema: searchCatalogResultSchema.shape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ q, categoria, segmento, aplicacao, pagina }) => {
    const page = Math.min(Math.max(Math.trunc(pagina ?? 1), 1), 200);
    const result = await searchCatalog({
      q: q ?? null,
      categoria: categoria ?? null,
      segmento: segmento ?? null,
      aplicacao: aplicacao ?? null,
      ordem: q ? "relevance" : "category",
      pagina: page,
    });

    const parsed = searchCatalogResultSchema.parse(result);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed,
    };
  },
});
