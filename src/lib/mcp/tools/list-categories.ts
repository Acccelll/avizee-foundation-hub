import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { listPublicCategories } from "@/catalog/public/read.server";

const listCategoriesResultSchema = z.object({
  categories: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    familyCount: z.number(),
    productCount: z.number(),
  })),
});

export default defineTool({
  name: "list_categories",
  title: "Listar categorias do catálogo",
  description:
    "Lista as categorias públicas do catálogo AviZee, com contagem de famílias e de produtos publicados.",
  inputSchema: {},
  outputSchema: listCategoriesResultSchema,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const categories = await listPublicCategories();
    const result = { categories };
    const parsed = listCategoriesResultSchema.parse(result);
    
    return {
      content: [{ type: "text" as const, text: JSON.stringify(parsed) }],
      structuredContent: parsed as any,
    };
  },
});
