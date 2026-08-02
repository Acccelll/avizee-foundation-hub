/**
 * Etapa 7 — camada pública do catálogo.
 * Verifica: isolamento anônimo, conteúdo das views, ranking da busca,
 * filtros, paginação e ausência de qualquer campo interno.
 */
import { beforeAll, describe, expect, it } from "vitest";

import { anonClient, assertNonProduction } from "../helpers/db";
import { FORBIDDEN_PUBLIC_FIELDS } from "@/catalog/serializer";

const anon = anonClient();

beforeAll(() => assertNonProduction());

describe("isolamento do papel anônimo", () => {
  const tabelasInternas = [
    "products",
    "product_families",
    "source_records",
    "import_jobs",
    "audit_logs",
    "media_assets",
    "user_roles",
    "profiles",
  ];

  for (const table of tabelasInternas) {
    it(`bloqueia leitura anônima de ${table}`, async () => {
      const { data, error } = await anon.from(table).select("*").limit(1);
      expect(error !== null || (data ?? []).length === 0).toBe(true);
    });
  }
});

describe("views públicas", () => {
  it("expõe as 31 famílias e os 97 SKUs aprovados", async () => {
    const families = await anon.from("public_families").select("slug", { count: "exact" });
    const products = await anon.from("public_products").select("public_sku", { count: "exact" });
    expect(families.count).toBe(31);
    expect(products.count).toBe(97);
  });

  it("não expõe nenhum campo proibido", async () => {
    const { data } = await anon.from("public_products").select("*").limit(5);
    const keys = new Set((data ?? []).flatMap((row) => Object.keys(row as object)));
    for (const forbidden of FORBIDDEN_PUBLIC_FIELDS) {
      expect(keys.has(forbidden)).toBe(false);
    }
  });

  it("toda família pública tem categoria, slug e ao menos uma variação", async () => {
    const { data } = await anon
      .from("public_families")
      .select("slug, category_slug, variation_count");
    for (const family of data ?? []) {
      const row = family as { slug: string; category_slug: string; variation_count: number };
      expect(row.slug.length).toBeGreaterThan(0);
      expect(row.category_slug.length).toBeGreaterThan(0);
      expect(row.variation_count).toBeGreaterThan(0);
    }
  });

  it("categorias públicas somam as 31 famílias", async () => {
    const { data } = await anon.from("public_categories").select("family_count");
    const total = (data ?? []).reduce(
      (sum, row) => sum + ((row as { family_count: number }).family_count ?? 0),
      0,
    );
    expect(total).toBe(31);
  });
});

async function search(args: Record<string, unknown>) {
  const { data, error } = await anon.rpc("search_public_catalog", args);
  expect(error).toBeNull();
  return (data ?? []) as {
    family_slug: string;
    public_name: string;
    matched_sku: string | null;
    rank: number;
    total_count: number;
    category_slug: string;
    skus: string[];
  }[];
}

describe("busca pública", () => {
  it("prioriza correspondência exata de SKU", async () => {
    const rows = await search({ q: "BI999", p_limit: 5 });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.matched_sku).toBe("BI999");
  });

  it("trata separadores e caixa no código (bi-999 = BI999)", async () => {
    const rows = await search({ q: "bi 999", p_limit: 5 });
    expect(rows[0]?.matched_sku).toBe("BI999");
  });

  it("ignora acento no termo", async () => {
    const comAcento = await search({ q: "vacinação", p_limit: 5 });
    const semAcento = await search({ q: "vacinacao", p_limit: 5 });
    expect(semAcento.map((r) => r.family_slug)).toEqual(comAcento.map((r) => r.family_slug));
  });

  it("tolera erro leve de digitação no termo", async () => {
    const rows = await search({ q: "agulahs", p_limit: 5 });
    expect(rows.length).toBeGreaterThan(0);
  });

  it("não retorna nada para consulta com marca de terceiro", async () => {
    const rows = await search({ q: "walmur", p_limit: 5 });
    expect(rows).toHaveLength(0);
  });

  it("aplica filtro de categoria e devolve o total correto", async () => {
    const rows = await search({ p_category: "linhas-complementares", p_limit: 48 });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.category_slug === "linhas-complementares")).toBe(true);
    expect(Number(rows[0]?.total_count)).toBe(rows.length);
  });

  it("pagina sem repetir famílias", async () => {
    const p1 = await search({ p_limit: 12, p_offset: 0, p_sort: "name" });
    const p2 = await search({ p_limit: 12, p_offset: 12, p_sort: "name" });
    const overlap = p1.filter((a) => p2.some((b) => b.family_slug === a.family_slug));
    expect(overlap).toHaveLength(0);
    expect(Number(p1[0]?.total_count)).toBe(31);
  });

  it("nenhum resultado da busca carrega campo interno", async () => {
    const rows = await search({ q: "agulha", p_limit: 5 });
    const keys = new Set(rows.flatMap((row) => Object.keys(row)));
    for (const forbidden of FORBIDDEN_PUBLIC_FIELDS) {
      expect(keys.has(forbidden)).toBe(false);
    }
  });
});

describe("autocomplete público", () => {
  it("sugere SKU por prefixo", async () => {
    const { data, error } = await anon.rpc("public_autocomplete", { q: "AG0", p_limit: 8 });
    expect(error).toBeNull();
    const rows = (data ?? []) as { kind: string; label: string }[];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((r) => r.kind === "sku" && r.label.startsWith("AG"))).toBe(true);
  });

  it("sugere família por termo parcial", async () => {
    const { data } = await anon.rpc("public_autocomplete", { q: "agulh", p_limit: 8 });
    const rows = (data ?? []) as { kind: string }[];
    expect(rows.some((r) => r.kind === "family")).toBe(true);
  });
});
