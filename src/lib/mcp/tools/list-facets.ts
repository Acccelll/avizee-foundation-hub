import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { catalogFacets } from "@/catalog/public/read.server";

const listFacetsResultSchema = z.object({
  categories: z.array(z.any()),
  segments: z.array(z.any()),
  applications: z.array(z.any()),
});

export default defineTool({
  name: "list_facets",
  title: "Listar filtros disponíveis",
  description:
    "Lista as facetas públicas do catálogo AviZee: categorias, segmentos e aplicações, com a contagem de famílias de cada uma. Útil para descobrir os slugs aceitos por search_catalog.",
  inputSchema: {},
  outputSchema: listFacetsResultSchema.shape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const facets = await catalogFacets();
    const parsed = listFacetsResultSchema.parse(facets);
    
    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed as any,
    };
  },
});
