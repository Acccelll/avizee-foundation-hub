/**
 * Leitura pública da Central de Conteúdos (Etapa 10).
 *
 * Regras por construção:
 * - lê exclusivamente as views `public_*`;
 * - nunca lê tabela administrativa e nunca usa chave de serviço;
 * - toda resposta passa por `findLeakedFields()` (R-04 / R-05).
 */
import { createClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors";
import { findLeakedFields } from "@/catalog/serializer";
import { blocksSchema, type ContentBlock } from "@/content/blocks";

/* eslint-disable @typescript-eslint/no-explicit-any */

let cached: any = null;

function db(): any {
  if (cached) return cached;
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["SUPABASE_ANON_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new AppError("SERVICE_UNAVAILABLE", { cause: "supabase-public-config" });
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  return cached;
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return (result.data ?? []) as T;
}

function guard<T>(payload: T): T {
  const leaked = findLeakedFields(payload);
  if (leaked.length > 0) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: `public-leak:${leaked.join(",")}` });
  }
  return payload;
}

/** Segunda barreira: o bloco só chega ao navegador se ainda for válido. */
function safeBlocks(value: unknown): ContentBlock[] {
  const parsed = blocksSchema.safeParse(value ?? []);
  return parsed.success ? parsed.data : [];
}

export const ARTICLES_PAGE_SIZE = 9;

export interface ArticleCardData {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  categorySlug: string;
  categoryName: string;
  authorName: string | null;
  publishedAt: string | null;
  readingMinutes: number;
  cover: { url: string; alt: string } | null;
}

function toCard(row: any): ArticleCardData {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? null,
    excerpt: row.excerpt ?? null,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    authorName: row.author_name ?? null,
    publishedAt: row.published_at ?? null,
    readingMinutes: row.reading_minutes ?? 1,
    cover: row.cover_url ? { url: row.cover_url, alt: row.cover_alt ?? "" } : null,
  };
}

const CARD_FIELDS =
  "slug, title, subtitle, excerpt, category_slug, category_name, author_name, published_at, reading_minutes, cover_url, cover_alt";

export interface ArticleQuery {
  q?: string | null | undefined;
  categoria?: string | null | undefined;
  pagina?: number | undefined;
}

/** Listagem paginada com busca simples por título/resumo. */
export async function listArticles(query: ArticleQuery) {
  const page = Math.max(1, query.pagina ?? 1);
  const from = (page - 1) * ARTICLES_PAGE_SIZE;

  let builder = db()
    .from("public_articles")
    .select(CARD_FIELDS, { count: "exact" })
    .order("published_at", { ascending: false });

  if (query.categoria) builder = builder.eq("category_slug", query.categoria);

  const term = query.q?.trim();
  if (term && term.length >= 2) {
    const escaped = term.replace(/[%,()]/g, " ");
    builder = builder.or(
      `title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%,subtitle.ilike.%${escaped}%`,
    );
  }

  const result = await builder.range(from, from + ARTICLES_PAGE_SIZE - 1);
  if (result.error) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  }

  const total = Number(result.count ?? 0);
  return guard({
    items: (result.data ?? []).map(toCard),
    total,
    page,
    pageSize: ARTICLES_PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / ARTICLES_PAGE_SIZE)),
  });
}

export async function listContentCategories() {
  const rows = unwrap<any[]>(
    await db()
      .from("public_content_categories")
      .select("slug, name, description, sort_order, article_count")
      .order("sort_order"),
  );
  return guard(
    rows.map((c) => ({
      slug: c.slug as string,
      name: c.name as string,
      description: (c.description ?? null) as string | null,
      articleCount: (c.article_count ?? 0) as number,
    })),
  );
}

export async function getContentCategory(slug: string) {
  const rows = unwrap<any[]>(
    await db()
      .from("public_content_categories")
      .select("slug, name, description, article_count")
      .eq("slug", slug)
      .limit(1),
  );
  const row = rows[0];
  if (!row) return null;
  return guard({
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description ?? null) as string | null,
    articleCount: (row.article_count ?? 0) as number,
  });
}

export interface ArticleDetail extends ArticleCardData {
  authorRole: string | null;
  revisedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  noindex: boolean;
  blocks: ContentBlock[];
  references: { label: string; url: string | null; note: string | null }[];
  relatedFamilies: {
    slug: string;
    name: string;
    summary: string | null;
    categorySlug: string;
    categoryName: string;
    variationCount: number;
  }[];
  relatedArticles: ArticleCardData[];
}

export async function getArticle(slug: string): Promise<ArticleDetail | null> {
  const rows = unwrap<any[]>(
    await db()
      .from("public_articles")
      .select(
        `id, ${CARD_FIELDS}, author_role, revised_at, seo_title, seo_description, noindex, blocks`,
      )
      .eq("slug", slug)
      .limit(1),
  );
  const row = rows[0];
  if (!row) return null;

  const [references, relations, related] = await Promise.all([
    db()
      .from("public_article_references")
      .select("label, url, note, sort_order")
      .eq("article_id", row.id)
      .order("sort_order"),
    db()
      .from("public_article_relations")
      .select(
        "family_slug, family_name, family_summary, category_slug, category_name, variation_count, sort_order",
      )
      .eq("article_id", row.id)
      .order("sort_order"),
    db()
      .from("public_articles")
      .select(CARD_FIELDS)
      .eq("category_slug", row.category_slug)
      .neq("slug", row.slug)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return guard({
    ...toCard(row),
    authorRole: row.author_role ?? null,
    revisedAt: row.revised_at ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    noindex: Boolean(row.noindex),
    blocks: safeBlocks(row.blocks),
    references: unwrap<any[]>(references).map((r) => ({
      label: r.label as string,
      url: (r.url ?? null) as string | null,
      note: (r.note ?? null) as string | null,
    })),
    relatedFamilies: unwrap<any[]>(relations).map((r) => ({
      slug: r.family_slug as string,
      name: r.family_name as string,
      summary: (r.family_summary ?? null) as string | null,
      categorySlug: r.category_slug as string,
      categoryName: r.category_name as string,
      variationCount: (r.variation_count ?? 0) as number,
    })),
    relatedArticles: unwrap<any[]>(related).map(toCard),
  });
}

/** Endereço antigo → endereço atual, para redirecionamento 301 lógico. */
export async function resolveArticleRedirect(oldSlug: string): Promise<string | null> {
  const rows = unwrap<any[]>(
    await db().from("public_article_slugs").select("current_slug").eq("old_slug", oldSlug).limit(1),
  );
  return (rows[0]?.current_slug as string | undefined) ?? null;
}

/** Artigos publicados relacionados a uma família — usado na página da família. */
export async function articlesForFamily(familySlug: string) {
  const relations = unwrap<any[]>(
    await db()
      .from("public_article_relations")
      .select("article_id")
      .eq("family_slug", familySlug)
      .limit(3),
  );
  if (relations.length === 0) return [];
  const rows = unwrap<any[]>(
    await db()
      .from("public_articles")
      .select(CARD_FIELDS)
      .in(
        "id",
        relations.map((r) => r.article_id),
      )
      .order("published_at", { ascending: false }),
  );
  return guard(rows.map(toCard));
}

/** Entradas indexáveis da Central para o sitemap. */
export async function contentSitemapEntries() {
  const [categories, articles] = await Promise.all([
    db().from("public_content_categories").select("slug, article_count").order("sort_order"),
    db().from("public_articles").select("slug, noindex, published_at"),
  ]);
  return {
    categories: unwrap<any[]>(categories)
      .filter((c) => (c.article_count ?? 0) > 0)
      .map((c) => c.slug as string),
    articles: unwrap<any[]>(articles)
      .filter((a) => !a.noindex)
      .map((a) => a.slug as string),
  };
}
