import { defineTool } from "@lovable.dev/mcp-js";

import { listPublicCategories } from "@/catalog/public/read.server";

export default defineTool({
  name: "list_categories",
  title: "Listar categorias do catálogo",
  description:
    "Lista as categorias públicas do catálogo AviZee, com contagem de famílias e de produtos publicados.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const categories = await listPublicCategories();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(categories) }],
      structuredContent: { categories } as unknown as Record<string, unknown>,
    };
  },
});
