/**
 * FASE D — integração do núcleo administrativo contra o banco real
 * (instância não produtiva). Cobre autorização de servidor, CRUD de família e
 * SKU, máquina de estados persistida, revisão de imagem e auditoria.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { authorize } from "@/catalog/guard.server";
import {
  changeStatus,
  getFamily,
  getProduct,
  listProducts,
  reviewMedia,
  upsertFamily,
  upsertProduct,
} from "@/catalog/catalog.server";
import { AppError } from "@/lib/errors";
import {
  TEST_PREFIX,
  adminClient,
  authContext,
  cleanupSyntheticCatalog,
  createTestUser,
  deleteTestUsers,
  type TestUser,
} from "../helpers/db";

let gestor: TestUser;
let auditor: TestUser;
let familyId: string;
let productId: string;
const mediaIds: string[] = [];

const slug = `${TEST_PREFIX}familia-integracao-${Date.now()}`;
const sku = `${TEST_PREFIX}SKU1`;

beforeAll(async () => {
  await cleanupSyntheticCatalog();
  gestor = await createTestUser("gestor", ["GESTOR_DE_CATALOGO"]);
  auditor = await createTestUser("auditor", ["AUDITOR"]);
}, 90_000);

afterAll(async () => {
  const admin = adminClient();
  if (mediaIds.length > 0) {
    await admin.from("image_review_events").delete().in("media_asset_id", mediaIds);
    await admin.from("media_assets").delete().in("id", mediaIds);
  }
  if (productId) await admin.from("publication_history").delete().eq("entity_id", productId);
  if (familyId) await admin.from("publication_history").delete().eq("entity_id", familyId);
  await cleanupSyntheticCatalog();
  await deleteTestUsers();
}, 90_000);

describe("autorização de servidor", () => {
  it("concede escrita ao gestor de catálogo", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    expect(auth.roles).toContain("GESTOR_DE_CATALOGO");
    expect(auth.userId).toBe(gestor.id);
  });

  it("nega escrita ao auditor mesmo se o frontend pedir", async () => {
    await expect(authorize(authContext(auditor), "catalog.write")).rejects.toBeInstanceOf(AppError);
  });

  it("nega importação ao auditor", async () => {
    await expect(authorize(authContext(auditor), "import.execute")).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("permite leitura de auditoria ao auditor", async () => {
    const auth = await authorize(authContext(auditor), "audit.read");
    expect(auth.roles).toEqual(["AUDITOR"]);
  });

  it("papéis vêm do banco, não do contexto informado", async () => {
    const forjado = { ...authContext(auditor), roles: ["ADMINISTRADOR"] };
    await expect(authorize(forjado, "catalog.write")).rejects.toBeInstanceOf(AppError);
  });
});

describe("CRUD de família e SKU", () => {
  it("cria família com auditoria", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    const saved = await upsertFamily(auth, {
      public_name: "Família de integração",
      admin_name: "Família de integração (teste)",
      slug,
      summary: "Registro sintético da suíte automatizada.",
    });
    familyId = saved.id;
    expect(familyId).toBeTruthy();

    const { data } = await adminClient()
      .from("audit_logs")
      .select("action, entity, entity_id")
      .eq("entity_id", familyId)
      .eq("action", "catalog.create");
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it("recusa nome público com marca de terceiro (R-05)", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    await expect(
      upsertFamily(auth, {
        public_name: "Comedouro Walmur",
        admin_name: "teste",
        slug: `${TEST_PREFIX}bloqueado`,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("cria SKU vinculado à família", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    const saved = await upsertProduct(auth, {
      family_id: familyId,
      public_sku: sku,
      public_name: "Produto sintético de integração",
      public_description: "Registro sintético da suíte automatizada.",
    });
    productId = saved.id;
    const { product } = await getProduct(auth, productId);
    expect(product["public_sku"]).toBe(sku);
    expect(product["review_status"]).toBe("DRAFT");
    expect(product["publication_status"]).toBe("NOT_PUBLISHED");
  });

  it("registra mudança de nome em evento próprio de auditoria", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    await upsertProduct(auth, {
      id: productId,
      family_id: familyId,
      public_sku: sku,
      public_name: "Produto sintético renomeado",
    });
    const { data } = await adminClient()
      .from("audit_logs")
      .select("action")
      .eq("entity_id", productId)
      .eq("action", "catalog.name.change");
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it("lista o SKU pela família e pela busca", async () => {
    const auth = await authorize(authContext(gestor), "catalog.read");
    const byFamily = await listProducts(auth, { familyId });
    expect(byFamily.rows.map((r) => r["id"])).toContain(productId);
    const bySearch = await listProducts(auth, { search: sku });
    expect(bySearch.total).toBeGreaterThan(0);
  });

  it("expõe o SKU na visão da família", async () => {
    const auth = await authorize(authContext(gestor), "catalog.read");
    const { products } = await getFamily(auth, familyId);
    expect(products.map((p) => p["id"])).toContain(productId);
  });

  it("retorna NOT_FOUND para SKU inexistente", async () => {
    const auth = await authorize(authContext(gestor), "catalog.read");
    await expect(
      getProduct(auth, "00000000-0000-0000-0000-000000000000"),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("máquina de estados persistida", () => {
  it("recusa publicar SKU que não está apto", async () => {
    const auth = await authorize(authContext(gestor), "catalog.publish");
    await expect(
      changeStatus(auth, {
        entity: "products",
        id: productId,
        publicationStatus: "PUBLISHED",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("recusa transição de revisão inválida", async () => {
    const auth = await authorize(authContext(gestor), "catalog.write");
    await expect(
      changeStatus(auth, {
        entity: "products",
        id: productId,
        reviewStatus: "READY_TO_PUBLISH",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("percorre DRAFT → UNDER_REVIEW → READY_TO_PUBLISH → PUBLISHED", async () => {
    const auth = await authorize(authContext(gestor), "catalog.publish");
    await changeStatus(auth, { entity: "products", id: productId, reviewStatus: "UNDER_REVIEW" });
    await changeStatus(auth, {
      entity: "products",
      id: productId,
      reviewStatus: "READY_TO_PUBLISH",
    });
    const result = await changeStatus(auth, {
      entity: "products",
      id: productId,
      publicationStatus: "PUBLISHED",
      reason: "teste de integração",
    });
    expect(result.publication_status).toBe("PUBLISHED");

    const history = await adminClient()
      .from("publication_history")
      .select("to_status")
      .eq("entity_id", productId);
    expect((history.data ?? []).length).toBe(3);
  });

  it("grava auditoria de publicação", async () => {
    const { data } = await adminClient()
      .from("audit_logs")
      .select("action")
      .eq("entity_id", productId)
      .eq("action", "catalog.publish");
    expect((data ?? []).length).toBeGreaterThan(0);
  });
});

describe("revisão de imagem", () => {
  async function createAsset(overrides: Record<string, unknown>) {
    const { data, error } = await adminClient()
      .from("media_assets")
      .insert({
        bucket: "catalog-private",
        private_path: `${TEST_PREFIX}${Math.random().toString(36).slice(2)}.jpg`,
        mime_type: "image/jpeg",
        internal_title: `${TEST_PREFIX}ativo`,
        rights_status: "OWNED",
        review_status: "PENDENTE_IDENTIFICACAO",
        source: "produção própria",
        alt_text: "Imagem sintética de teste",
        ...overrides,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const id = (data as { id: string }).id;
    mediaIds.push(id);
    return id;
  }

  it("aprova imagem própria, com origem, alt e correspondência", async () => {
    const auth = await authorize(authContext(gestor), "media.review");
    const id = await createAsset({});
    await expect(
      reviewMedia(auth, { id, toStatus: "APROVADA", matchesProduct: true }),
    ).resolves.toMatchObject({ ok: true });
    const { data } = await adminClient()
      .from("media_assets")
      .select("review_status, in_quarantine")
      .eq("id", id)
      .single();
    expect(data).toMatchObject({ review_status: "APROVADA", in_quarantine: false });
  });

  it("recusa aprovação sem direito confirmado", async () => {
    const auth = await authorize(authContext(gestor), "media.review");
    const id = await createAsset({ rights_status: "RIGHTS_UNCONFIRMED" });
    await expect(
      reviewMedia(auth, { id, toStatus: "APROVADA", matchesProduct: true }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("recusa aprovação com marca visível", async () => {
    const auth = await authorize(authContext(gestor), "media.review");
    const id = await createAsset({ detected_brand: "walmur" });
    await expect(
      reviewMedia(auth, { id, toStatus: "APROVADA", matchesProduct: true }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("recusa aprovação sem texto alternativo", async () => {
    const auth = await authorize(authContext(gestor), "media.review");
    const id = await createAsset({ alt_text: null });
    await expect(
      reviewMedia(auth, { id, toStatus: "APROVADA", matchesProduct: true }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("reprovação mantém a imagem em quarentena e gera evento", async () => {
    const auth = await authorize(authContext(gestor), "media.review");
    const id = await createAsset({});
    await reviewMedia(auth, {
      id,
      toStatus: "PENDENTE_MARCA_VISIVEL",
      reason: "marca aparente",
    });
    const asset = await adminClient()
      .from("media_assets")
      .select("in_quarantine")
      .eq("id", id)
      .single();
    expect(asset.data).toMatchObject({ in_quarantine: true });
    const events = await adminClient()
      .from("image_review_events")
      .select("to_status")
      .eq("media_asset_id", id);
    expect((events.data ?? []).length).toBe(1);
  });
});
