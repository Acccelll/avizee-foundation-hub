/**
 * Funções de servidor PÚBLICAS do catálogo (Etapa 7).
 * Wrapper fino: sem autenticação (rotas públicas fazem prerender/SSR),
 * toda a lógica vive em `read.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  autocomplete,
  catalogFacets,
  getPublicCategory,
  getPublicFamily,
  listPublicCategories,
  publicSitemapEntries,
  searchCatalog,
} from "@/catalog/public/read.server";

const slug = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/);

const catalogQuery = z.object({
  q: z.string().trim().max(120).nullable().optional(),
  categoria: slug.nullable().optional(),
  segmento: slug.nullable().optional(),
  aplicacao: slug.nullable().optional(),
  ordem: z.enum(["relevance", "name", "category"]).optional(),
  pagina: z.number().int().min(1).max(200).optional(),
});

export const fetchCatalog = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => catalogQuery.parse(input ?? {}))
  .handler(async ({ data }) => searchCatalog(data));

export const fetchFacets = createServerFn({ method: "GET" }).handler(async () => catalogFacets());

export const fetchCategories = createServerFn({ method: "GET" }).handler(async () =>
  listPublicCategories(),
);

export const fetchCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug }).parse(input))
  .handler(async ({ data }) => getPublicCategory(data.slug));

export const fetchFamily = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ categorySlug: slug, familySlug: slug }).parse(input),
  )
  .handler(async ({ data }) => getPublicFamily(data.categorySlug, data.familySlug));

export const fetchSuggestions = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ q: z.string().trim().max(80) }).parse(input))
  .handler(async ({ data }) => autocomplete(data.q));

export const fetchSitemapEntries = createServerFn({ method: "GET" }).handler(async () =>
  publicSitemapEntries(),
);
