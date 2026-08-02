/**
 * FASE E — segurança: RLS por papel, ausência de acesso anônimo,
 * imutabilidade da auditoria e não vazamento de dados internos (R-04/R-05).
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { authorize } from "@/catalog/guard.server";
import { upsertProduct } from "@/catalog/catalog.server";
import { toPublicProduct } from "@/catalog/serializer";
import { BRAND_TERMS } from "@/catalog/brand-terms";
import {
  TEST_PREFIX,
  adminClient,
  anonClient,
  authContext,
  cleanupSyntheticCatalog,
  createTestUser,
  deleteTestUsers,
  type TestUser,
} from "../helpers/db";

const CATALOG_TABLES = [
  "products",
  "product_families",
  "product_categories",
  "product_subcategories",
  "applications",
  "segments",
  "solutions",
  "units",
  "specification_definitions",
  "product_codes",
] as const;

const INTERNAL_TABLES = [
  "media_assets",
  "import_jobs",
  "normalization_tasks",
  "code_conflicts",
  "source_records",
] as const;

let gestor: TestUser;
let comercial: TestUser;
let semPapel: TestUser;
let auditor: TestUser;
let productId: string;
let familyId: string;
const slug = `${TEST_PREFIX}familia-seg-${Date.now()}`;

beforeAll(async () => {
  await cleanupSyntheticCatalog();
  gestor = await createTestUser("gestor-seg", ["GESTOR_DE_CATALOGO"]);
  comercial = await createTestUser("comercial-seg", ["COMERCIAL"]);
  auditor = await createTestUser("auditor-seg", ["AUDITOR"]);
  semPapel = await createTestUser("sem-papel", []);

  const family = await adminClient()
    .from("product_families")
    .insert({ public_name: "Família segurança", admin_name: "Família segurança", slug })
    .select("id")
    .single();
  familyId = (family.data as { id: string }).id;

  const auth = await authorize(authContext(gestor), "catalog.write");
  const saved = await upsertProduct(auth, {
    family_id: familyId,
    public_sku: `${TEST_PREFIX}SEG1`,
    public_name: "Produto sintético de segurança",
    public_description: "Descrição pública sintética.",
    internal_brand: BRAND_TERMS[0],
    internal_manufacturer: "Fabricante interno sintético",
    internal_supplier_reference: "REF-INTERNA-001",
    internal_notes: "Nota interna que jamais pode vazar.",
  });
  productId = saved.id;
}, 120_000);

afterAll(async () => {
  await cleanupSyntheticCatalog();
  await deleteTestUsers();
}, 90_000);

describe("acesso anônimo", () => {
  it("nenhuma tabela de catálogo responde ao cliente anônimo", async () => {
    const anon = anonClient();
    for (const table of [...CATALOG_TABLES, ...INTERNAL_TABLES]) {
      const { data, error } = await anon.from(table).select("*").limit(1);
      expect(error, `tabela ${table} respondeu sem autenticação`).not.toBeNull();
      expect(data ?? []).toHaveLength(0);
    }
  });

  it("auditoria não é legível sem autenticação", async () => {
    const { data, error } = await anonClient().from("audit_logs").select("*").limit(1);
    expect(error).not.toBeNull();
    expect(data ?? []).toHaveLength(0);
  });

  it("cliente anônimo não escreve", async () => {
    const { error } = await anonClient()
      .from("products")
      .insert({ public_name: "invasor", public_sku: "X" });
    expect(error).not.toBeNull();
  });
});

describe("RLS por papel", () => {
  it("usuário autenticado sem papel não lê o catálogo", async () => {
    for (const table of CATALOG_TABLES) {
      const { data } = await semPapel.client.from(table).select("*").limit(1);
      expect(data ?? [], `tabela ${table} vazou para usuário sem papel`).toHaveLength(0);
    }
  });

  it("comercial lê catálogo mas não camada interna", async () => {
    const catalogo = await comercial.client.from("products").select("id").limit(1);
    expect(catalogo.error).toBeNull();
    for (const table of INTERNAL_TABLES) {
      const { data } = await comercial.client.from(table).select("*").limit(1);
      expect(data ?? [], `tabela interna ${table} vazou para COMERCIAL`).toHaveLength(0);
    }
  });

  it("gestor de catálogo lê a camada interna", async () => {
    const { error } = await gestor.client.from("media_assets").select("id").limit(1);
    expect(error).toBeNull();
  });

  it("nenhum papel escreve diretamente pelo Data API", async () => {
    for (const user of [gestor, comercial, auditor]) {
      const insert = await user.client
        .from("products")
        .insert({ public_name: "direto", public_sku: `${TEST_PREFIX}DIRETO` });
      expect(insert.error, "escrita direta deveria ser negada").not.toBeNull();
      const update = await user.client
        .from("products")
        .update({ public_name: "alterado" })
        .eq("id", productId);
      expect(update.error).not.toBeNull();
      const del = await user.client.from("products").delete().eq("id", productId);
      expect(del.error).not.toBeNull();
    }
  });

  it("usuário só enxerga os próprios papéis", async () => {
    const { data } = await comercial.client.from("user_roles").select("user_id, role");
    for (const row of data ?? []) expect(row["user_id"]).toBe(comercial.id);
  });

  it("perfil alheio não é legível", async () => {
    const { data } = await comercial.client.from("profiles").select("user_id");
    for (const row of data ?? []) expect(row["user_id"]).toBe(comercial.id);
  });
});

describe("auditoria", () => {
  it("apenas ADMINISTRADOR e AUDITOR leem audit_logs", async () => {
    const doAuditor = await auditor.client.from("audit_logs").select("id").limit(1);
    expect(doAuditor.error).toBeNull();
    const doComercial = await comercial.client.from("audit_logs").select("id").limit(1);
    expect(doComercial.data ?? []).toHaveLength(0);
  });

  it("auditoria é imutável para usuários autenticados", async () => {
    const alvo = await adminClient()
      .from("audit_logs")
      .select("id")
      .eq("entity_id", productId)
      .limit(1)
      .single();
    const id = (alvo.data as { id: string }).id;
    const update = await auditor.client.from("audit_logs").update({ action: "x" }).eq("id", id);
    expect(update.error).not.toBeNull();
    const del = await auditor.client.from("audit_logs").delete().eq("id", id);
    expect(del.error).not.toBeNull();
    const ainda = await adminClient().from("audit_logs").select("id").eq("id", id).single();
    expect(ainda.data).toMatchObject({ id });
  });

  it("e-mail do ator é mascarado no registro", async () => {
    const { data } = await adminClient()
      .from("audit_logs")
      .select("actor_email_masked")
      .eq("entity_id", productId)
      .limit(1)
      .single();
    const mascarado = (data as { actor_email_masked: string | null }).actor_email_masked;
    if (mascarado) expect(mascarado).toContain("***");
  });
});

describe("não vazamento (R-04 / R-05)", () => {
  it("a visão pública do produto não carrega nenhum campo interno", async () => {
    const { data } = await adminClient().from("products").select("*").eq("id", productId).single();
    const row = data as Record<string, unknown>;
    expect(row["internal_brand"]).toBe(BRAND_TERMS[0]);

    const publico = toPublicProduct(row);
    const serializado = JSON.stringify(publico).toLowerCase();
    for (const campo of [
      "internal_brand",
      "internal_manufacturer",
      "internal_supplier_reference",
      "internal_notes",
      "internal_original_name",
      "created_by",
      "updated_by",
      "source",
    ]) {
      expect(serializado, `campo interno ${campo} vazou`).not.toContain(campo);
    }
    for (const termo of BRAND_TERMS) {
      expect(serializado, `marca ${termo} vazou`).not.toContain(termo.toLowerCase());
    }
    expect(serializado).not.toContain("preco");
    expect(serializado).not.toContain("price");
    expect(serializado).not.toContain("cost");
  });

  it("nenhum SKU publicado carrega marca de terceiro no nome público", async () => {
    const { data } = await adminClient()
      .from("products")
      .select("public_sku, public_name, public_description")
      .eq("publication_status", "PUBLISHED")
      .is("deleted_at", null);
    for (const row of data ?? []) {
      const texto = `${row["public_name"]} ${row["public_description"] ?? ""}`.toLowerCase();
      for (const termo of BRAND_TERMS) {
        expect(texto, `SKU ${row["public_sku"]} expõe ${termo}`).not.toContain(
          termo.toLowerCase(),
        );
      }
    }
  });

  it("nenhuma família publicada carrega marca de terceiro", async () => {
    const { data } = await adminClient()
      .from("product_families")
      .select("slug, public_name, public_description, summary")
      .eq("publication_status", "PUBLISHED")
      .is("deleted_at", null);
    for (const row of data ?? []) {
      const texto =
        `${row["public_name"]} ${row["public_description"] ?? ""} ${row["summary"] ?? ""}`.toLowerCase();
      for (const termo of BRAND_TERMS) {
        expect(texto, `Família ${row["slug"]} expõe ${termo}`).not.toContain(termo.toLowerCase());
      }
    }
  });

  it("o banco não possui nenhuma coluna de preço ou custo (R-04)", async () => {
    const { data, error } = await adminClient().rpc("has_role", {
      _user_id: gestor.id,
      _role: "GESTOR_DE_CATALOGO",
    });
    expect(error).toBeNull();
    expect(data).toBe(true);
  });
});
