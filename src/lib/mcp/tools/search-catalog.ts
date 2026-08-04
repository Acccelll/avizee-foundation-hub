import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { searchCatalog } from "@/catalog/public/read.server";

export default defineTool({
  name: "search_catalog",
  title: "Buscar no catálogo AviZee",
  description:
    "Busca famílias de produtos publicadas no catálogo público da AviZee por termo, código (SKU), categoria, segmento ou aplicação. Não retorna preços nem marcas de terceiros.",
  inputSchema: {
    q: z.string().trim().optional().describe("Termo livre, nome do produto ou código/SKU."),
    categoria: z.string().trim().optional().describe("Slug da categoria pública."),
    segmento: z.string().trim().optional().describe("Slug do segmento (ex.: avicultura)."),
    aplicacao: z.string().trim().optional().describe("Slug da aplicação/necessidade."),
    pagina: z.number().int().optional().describe("Página começando em 1."),
  },
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
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  },
});
