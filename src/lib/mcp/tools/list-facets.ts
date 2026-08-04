import { defineTool } from "@lovable.dev/mcp-js";

import { catalogFacets } from "@/catalog/public/read.server";

export default defineTool({
  name: "list_facets",
  title: "Listar filtros disponíveis",
  description:
    "Lista as facetas públicas do catálogo AviZee: categorias, segmentos e aplicações, com a contagem de famílias de cada uma. Útil para descobrir os slugs aceitos por search_catalog.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const facets = await catalogFacets();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(facets) }],
      structuredContent: facets,
    };
  },
});
