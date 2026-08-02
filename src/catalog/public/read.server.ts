/**
 * Camada de leitura pública do catálogo (Etapa 7).
 *
 * Regras aplicadas por construção:
 * - lê exclusivamente as views públicas (`public_*`) e as funções de busca;
 * - nunca acessa tabela administrativa, nunca usa chave de serviço;
 * - toda resposta passa por `findLeakedFields()` antes de sair (R-04/R-05).
 */
import { createClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors";
import { PLACEHOLDER_IMAGE, findLeakedFields } from "@/catalog/serializer";

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

/** Verificação defensiva: nenhuma resposta pública sai com campo proibido. */
function guard<T>(payload: T): T {
  const leaked = findLeakedFields(payload);
  if (leaked.length > 0) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: `public-leak:${leaked.join(",")}` });
  }
  return payload;
}

export interface PublicImage {
  url: string;
  alt: string;
  is_placeholder: boolean;
}

export interface FamilyCard {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  categorySlug: string;
  categoryName: string;
  segments: string[];
  applications: string[];
  variationCount: number;
  skus: string[];
  matchedSku: string | null;
  image: PublicImage;
}

export interface CatalogFacets {
  categories: { slug: string; name: string; description: string | null; count: number }[];
  segments: { slug: string; name: string; count: number }[];
  applications: { slug: string; name: string; count: number }[];
}

export interface CatalogQuery {
  q?: string | null | undefined;
  categoria?: string | null | undefined;
  segmento?: string | null | undefined;
  aplicacao?: string | null | undefined;
  ordem?: "relevance" | "name" | "category" | undefined;
  pagina?: number | undefined;
}

export const PAGE_SIZE = 12;

function imageFor(row: any): PublicImage {
  if (row?.url) {
    return { url: String(row.url), alt: String(row.alt_text ?? ""), is_placeholder: false };
  }
  return { ...PLACEHOLDER_IMAGE };
}

async function familyImages(familyIds: string[]) {
  if (familyIds.length === 0) return new Map<string, any>();
  const rows = unwrap<any[]>(
    await db()
      .from("public_media")
      .select("family_id, url, alt_text, sort_order")
      .in("family_id", familyIds)
      .order("sort_order"),
  );
  const map = new Map<string, any>();
  for (const row of rows) if (!map.has(row.family_id)) map.set(row.family_id, row);
  return map;
}

/** Busca + filtros + paginação. Fonte única: `search_public_catalog`. */
export async function searchCatalog(query: CatalogQuery) {
  const page = Math.max(1, query.pagina ?? 1);
  const rows = unwrap<any[]>(
    await db().rpc("search_public_catalog", {
      q: query.q?.trim() || null,
      p_category: query.categoria || null,
      p_segment: query.segmento || null,
      p_application: query.aplicacao || null,
      p_family: null,
      p_sort: query.ordem ?? (query.q ? "relevance" : "category"),
      p_limit: PAGE_SIZE,
      p_offset: (page - 1) * PAGE_SIZE,
    }),
  );

  const images = await familyImages(rows.map((r) => r.family_id));
  const items: FamilyCard[] = rows.map((r) => ({
    id: r.family_id,
    slug: r.family_slug,
    name: r.public_name,
    summary: r.summary ?? null,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
    segments: r.segments ?? [],
    applications: r.applications ?? [],
    variationCount: r.variation_count ?? 0,
    skus: r.skus ?? [],
    matchedSku: r.matched_sku ?? null,
    image: imageFor(images.get(r.family_id)),
  }));

  const total = Number(rows[0]?.total_count ?? 0);
  return guard({
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  });
}

/** Facetas calculadas sobre o índice público (31 famílias — custo desprezível). */
export async function catalogFacets(): Promise<CatalogFacets> {
  const [categories, index] = await Promise.all([
    db().from("public_categories").select("slug, name, description, family_count").order("sort_order"),
    db()
      .from("public_search_index")
      .select("category_slug, segments, segment_slugs, applications, application_slugs"),
  ]);

  const rows = unwrap<any[]>(index);
  const tally = (slugKey: string, nameKey: string) => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const row of rows) {
      const slugs: string[] = row[slugKey] ?? [];
      const names: string[] = row[nameKey] ?? [];
      slugs.forEach((slug, i) => {
        const current = map.get(slug);
        if (current) current.count += 1;
        else map.set(slug, { slug, name: names[i] ?? slug, count: 1 });
      });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  };

  return guard({
    categories: unwrap<any[]>(categories)
      .filter((c) => (c.family_count ?? 0) > 0)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description ?? null,
        count: c.family_count ?? 0,
      })),
    segments: tally("segment_slugs", "segments"),
    applications: tally("application_slugs", "applications"),
  });
}

export async function listPublicCategories() {
  const rows = unwrap<any[]>(
    await db()
      .from("public_categories")
      .select("slug, name, description, family_count, product_count, sort_order")
      .order("sort_order"),
  );
  return guard(
    rows.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description ?? null,
      familyCount: c.family_count ?? 0,
      productCount: c.product_count ?? 0,
    })),
  );
}

export async function getPublicCategory(slug: string) {
  const rows = unwrap<any[]>(
    await db()
      .from("public_categories")
      .select("slug, name, description, family_count, product_count")
      .eq("slug", slug)
      .limit(1),
  );
  const row = rows[0];
  if (!row || (row.family_count ?? 0) === 0) return null;
  return guard({
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    familyCount: row.family_count ?? 0,
    productCount: row.product_count ?? 0,
  });
}

export interface FamilyVariation {
  id: string;
  sku: string;
  name: string;
  variationLabel: string | null;
  measure: string | null;
  capacity: string | null;
  unit: string | null;
  description: string | null;
  isOnRequest: boolean;
  specifications: { code: string; label: string; value: string; unit: string | null }[];
}

/** Detalhe de família com suas variações públicas. */
export async function getPublicFamily(categorySlug: string, familySlug: string) {
  const families = unwrap<any[]>(
    await db()
      .from("public_families")
      .select(
        "id, slug, public_name, summary, public_description, category_slug, category_name, segments, applications, variation_count",
      )
      .eq("slug", familySlug)
      .limit(1),
  );
  const family = families[0];
  if (!family || family.category_slug !== categorySlug) return null;

  const [productRows, mediaRows] = await Promise.all([
    db()
      .from("public_products")
      .select(
        "id, public_sku, public_name, variation_label, measure, capacity, unit, public_description, is_on_request, sort_order",
      )
      .eq("family_id", family.id)
      .order("sort_order")
      .order("public_sku"),
    db()
      .from("public_media")
      .select("family_id, product_id, url, alt_text, sort_order")
      .eq("family_id", family.id)
      .order("sort_order"),
  ]);

  const products = unwrap<any[]>(productRows);
  const specRows =
    products.length > 0
      ? unwrap<any[]>(
          await db()
            .from("public_specifications")
            .select("product_id, family_id, code, label, value, unit, display_order")
            .in(
              "product_id",
              products.map((p) => p.id),
            )
            .order("display_order"),
        )
      : [];

  const variations: FamilyVariation[] = products.map((p) => ({
    id: p.id,
    sku: p.public_sku,
    name: p.public_name,
    variationLabel: p.variation_label ?? null,
    measure: p.measure ?? null,
    capacity: p.capacity ?? null,
    unit: p.unit ?? null,
    description: p.public_description ?? null,
    isOnRequest: Boolean(p.is_on_request),
    specifications: specRows
      .filter((s) => s.product_id === p.id)
      .map((s) => ({ code: s.code, label: s.label, value: s.value, unit: s.unit ?? null })),
  }));

  const related = unwrap<any[]>(
    await db()
      .from("public_families")
      .select("slug, public_name, summary, category_slug, category_name, variation_count")
      .eq("category_slug", family.category_slug)
      .neq("slug", family.slug)
      .limit(4),
  );

  return guard({
    id: family.id,
    slug: family.slug,
    name: family.public_name,
    summary: family.summary ?? null,
    description: family.public_description ?? null,
    categorySlug: family.category_slug,
    categoryName: family.category_name,
    segments: family.segments ?? [],
    applications: family.applications ?? [],
    image: imageFor(unwrap<any[]>(mediaRows)[0]),
    variations,
    related: related.map((r) => ({
      slug: r.slug,
      name: r.public_name,
      summary: r.summary ?? null,
      categorySlug: r.category_slug,
      categoryName: r.category_name,
      variationCount: r.variation_count ?? 0,
    })),
  });
}

export async function autocomplete(term: string) {
  const q = term.trim();
  if (q.length < 2) return { suggestions: [] };
  const rows = unwrap<any[]>(await db().rpc("public_autocomplete", { q, p_limit: 8 }));
  return guard({
    suggestions: rows.map((r) => ({
      kind: r.kind as "sku" | "family",
      label: r.label as string,
      sublabel: (r.sublabel ?? null) as string | null,
      familySlug: r.family_slug as string,
      sku: (r.sku ?? null) as string | null,
    })),
  });
}

/** Entradas indexáveis para o sitemap: apenas registros públicos. */
export async function publicSitemapEntries() {
  const [categories, families] = await Promise.all([
    db().from("public_categories").select("slug, family_count").order("sort_order"),
    db().from("public_families").select("slug, category_slug").order("sort_order"),
  ]);
  return {
    categories: unwrap<any[]>(categories)
      .filter((c) => (c.family_count ?? 0) > 0)
      .map((c) => c.slug as string),
    families: unwrap<any[]>(families).map((f) => ({
      slug: f.slug as string,
      categorySlug: f.category_slug as string,
    })),
  };
}

export interface ReconciledProduct {
  productId: string;
  familyId: string | null;
  sku: string;
  name: string;
  variation: string | null;
  familyName: string | null;
  familySlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
}

/**
 * Reconciliação da Lista de Cotação (Etapa 8): confirma, contra as views
 * públicas, quais produtos ainda estão publicados e devolve o snapshot
 * oficial de nome/SKU/variação. Nunca lê tabela administrativa.
 */
export async function reconcileProducts(productIds: string[]): Promise<ReconciledProduct[]> {
  const ids = [...new Set(productIds)].slice(0, 50);
  if (ids.length === 0) return [];

  const products = unwrap<any[]>(
    await db()
      .from("public_products")
      .select("id, family_id, public_sku, public_name, variation_label")
      .in("id", ids),
  );
  if (products.length === 0) return [];

  const families = unwrap<any[]>(
    await db()
      .from("public_families")
      .select("id, slug, public_name, category_slug, category_name")
      .in("family_id" in (products[0] ?? {}) ? "id" : "id", [
        ...new Set(products.map((p) => p.family_id).filter(Boolean)),
      ]),
  );
  const familyById = new Map(families.map((f) => [f.id, f]));

  return guard(
    products.map((p) => {
      const family = familyById.get(p.family_id);
      return {
        productId: p.id as string,
        familyId: (p.family_id ?? null) as string | null,
        sku: p.public_sku as string,
        name: p.public_name as string,
        variation: (p.variation_label ?? null) as string | null,
        familyName: (family?.public_name ?? null) as string | null,
        familySlug: (family?.slug ?? null) as string | null,
        categoryName: (family?.category_name ?? null) as string | null,
        categorySlug: (family?.category_slug ?? null) as string | null,
      };
    }),
  );
}
