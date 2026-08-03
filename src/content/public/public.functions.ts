/**
 * Funções de servidor públicas da Central de Conteúdos.
 * Wrapper fino: apenas declarações; a lógica vive em `read.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  articlesForFamily,
  getArticle,
  getContentCategory,
  listArticles,
  listContentCategories,
  resolveArticleRedirect,
} from "@/content/public/read.server";

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{2,160}$/);

const listInput = z.object({
  q: z.string().trim().max(120).nullable().optional(),
  categoria: slugSchema.nullable().optional(),
  pagina: z.number().int().min(1).max(200).optional(),
});

export const fetchArticles = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ data }) => listArticles(data));

export const fetchContentCategories = createServerFn({ method: "GET" }).handler(async () =>
  listContentCategories(),
);

export const fetchContentCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: slugSchema }).parse(input))
  .handler(async ({ data }) => getContentCategory(data.slug));

export const fetchArticle = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: slugSchema }).parse(input))
  .handler(async ({ data }) => {
    const article = await getArticle(data.slug);
    if (article) return { article, redirectTo: null as string | null };
    const redirectTo = await resolveArticleRedirect(data.slug);
    return { article: null, redirectTo };
  });

export const fetchArticlesForFamily = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ familySlug: slugSchema }).parse(input))
  .handler(async ({ data }) => articlesForFamily(data.familySlug));
