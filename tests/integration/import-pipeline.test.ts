/**
 * FASE D — pipeline de importação controlada contra o banco real:
 * simulação obrigatória, execução amarrada por assinatura, bloqueio sem
 * descarte e rollback.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { authorize } from "@/catalog/guard.server";
import { getImportJob, runDryRun, runExecute, runRollback } from "@/catalog/import/runner.server";
import { IMPORT_COLUMNS, IMPORT_SCHEMA_VERSION } from "@/catalog/import/schema";
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

const HEADER = IMPORT_COLUMNS.join(",");
const familySlug = `${TEST_PREFIX}familia-import-${Date.now()}`;
const skuA = `${TEST_PREFIX}IMP1`;
const skuB = `${TEST_PREFIX}IMP2`;

function csv(...rows: string[]) {
  return [HEADER, ...rows].join("\n");
}

const linhaA = `${skuA},Bebedouro sintético A,${familySlug},,,,,,Descrição sintética A,nao,ORIG-A,,`;
const linhaB = `${skuB},Bebedouro sintético B,${familySlug},,,,,,Descrição sintética B,nao,,,`;

let gestor: TestUser;
let auditor: TestUser;
let familyId: string;

beforeAll(async () => {
  await cleanupSyntheticCatalog();
  gestor = await createTestUser("gestor-import", ["GESTOR_DE_CATALOGO"]);
  auditor = await createTestUser("auditor-import", ["AUDITOR"]);
  const { data, error } = await adminClient()
    .from("product_families")
    .insert({
      public_name: "Família de importação sintética",
      admin_name: "Família de importação sintética",
      slug: familySlug,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  familyId = (data as { id: string }).id;
}, 90_000);

afterAll(async () => {
  await cleanupSyntheticCatalog();
  await deleteTestUsers();
}, 90_000);

describe("permissão da importação", () => {
  it("auditor não pode simular nem executar", async () => {
    await expect(authorize(authContext(auditor), "import.execute")).rejects.toBeInstanceOf(
      AppError,
    );
    await expect(authorize(authContext(auditor), "import.rollback")).rejects.toBeInstanceOf(
      AppError,
    );
  });
});

describe("simulação obrigatória", () => {
  it("recusa versão de contrato divergente", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    await expect(
      runDryRun(auth, {
        filename: `${TEST_PREFIX}versao.csv`,
        content: csv(linhaA),
        schemaVersion: "0.9.0",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("recusa cabeçalho fora do contrato", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    await expect(
      runDryRun(auth, {
        filename: `${TEST_PREFIX}cabecalho.csv`,
        content: "sku,nome\nA,B",
        schemaVersion: IMPORT_SCHEMA_VERSION,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("simula sem alterar o catálogo e registra o job", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    const antes = await adminClient()
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("family_id", familyId);

    const dry = await runDryRun(auth, {
      filename: `${TEST_PREFIX}simulacao.csv`,
      content: csv(linhaA, linhaB),
      schemaVersion: IMPORT_SCHEMA_VERSION,
    });

    expect(dry.plan.summary.create).toBe(2);
    expect(dry.errors).toHaveLength(0);
    expect(dry.signature).toMatch(/^v1-/);

    const depois = await adminClient()
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("family_id", familyId);
    expect(depois.count).toBe(antes.count);

    const { job, rows } = await getImportJob(auth, dry.jobId);
    expect(job["mode"]).toBe("DRY_RUN");
    expect(job["status"]).toBe("SIMULATED");
    expect(rows).toHaveLength(2);
  });

  it("registra erros de linha inválida sem abortar o lote", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    const dry = await runDryRun(auth, {
      filename: `${TEST_PREFIX}invalida.csv`,
      content: csv(linhaA, `,,${familySlug},,,,,,,,,,`),
      schemaVersion: IMPORT_SCHEMA_VERSION,
    });
    expect(dry.errors.length).toBeGreaterThan(0);
    const { errors } = await getImportJob(auth, dry.jobId);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("bloqueia linha fora do escopo aprovado, sem descartar", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    const dry = await runDryRun(auth, {
      filename: `${TEST_PREFIX}escopo.csv`,
      content: csv(linhaA, linhaB),
      schemaVersion: IMPORT_SCHEMA_VERSION,
      allowedSkus: [skuA],
    });
    expect(dry.plan.summary.blocked).toBe(1);
    const bloqueada = dry.plan.items.find((i) => i.sku === skuB.toUpperCase());
    expect(bloqueada?.operation).toBe("BLOCK");
    expect(dry.plan.items).toHaveLength(2);
  });
});

describe("execução amarrada à simulação", () => {
  let dryRunJobId: string;
  let signature: string;
  let executeJobId: string;

  it("recusa executar com assinatura divergente", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    const dry = await runDryRun(auth, {
      filename: `${TEST_PREFIX}execucao.csv`,
      content: csv(linhaA, linhaB),
      schemaVersion: IMPORT_SCHEMA_VERSION,
    });
    dryRunJobId = dry.jobId;
    signature = dry.signature;

    await expect(
      runExecute(auth, { dryRunJobId, signature: "v1-0-falsa", content: csv(linhaA, linhaB) }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("recusa executar com conteúdo diferente do simulado", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    await expect(
      runExecute(auth, { dryRunJobId, signature, content: csv(linhaA) }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("executa e cria os SKUs em revisão, nunca publicados direto", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    const result = await runExecute(auth, {
      dryRunJobId,
      signature,
      content: csv(linhaA, linhaB),
    });
    executeJobId = result.jobId;
    expect(result.summary.create).toBe(2);

    const { data } = await adminClient()
      .from("products")
      .select("public_sku, review_status, publication_status, internal_brand")
      .eq("family_id", familyId)
      .order("public_sku");
    expect((data ?? []).length).toBe(2);
    for (const row of data ?? []) {
      expect(row["review_status"]).toBe("UNDER_REVIEW");
      expect(row["publication_status"]).toBe("NOT_PUBLISHED");
    }
  });

  it("guarda o código de origem como código interno não público", async () => {
    const produto = await adminClient()
      .from("products")
      .select("id")
      .eq("public_sku", skuA.toUpperCase())
      .single();
    const { data } = await adminClient()
      .from("product_codes")
      .select("code, code_type, is_public")
      .eq("product_id", (produto.data as { id: string }).id);
    expect(data?.[0]).toMatchObject({ code: "ORIG-A", code_type: "ORIGINAL", is_public: false });
  });

  it("registra auditoria de simulação e de execução", async () => {
    const { data } = await adminClient()
      .from("audit_logs")
      .select("action")
      .in("entity_id", [dryRunJobId, executeJobId]);
    const acoes = (data ?? []).map((r: { action: string }) => r.action);
    expect(acoes).toContain("import.dry_run");
    expect(acoes).toContain("import.execute");
  });

  it("recusa reexecutar a mesma simulação", async () => {
    const auth = await authorize(authContext(gestor), "import.execute");
    await expect(
      runExecute(auth, { dryRunJobId, signature, content: csv(linhaA, linhaB) }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("reverte o lote por soft delete e marca o job", async () => {
    const auth = await authorize(authContext(gestor), "import.rollback");
    const result = await runRollback(auth, executeJobId);
    expect(result.reverted).toBe(2);

    const { data } = await adminClient()
      .from("products")
      .select("public_sku, deleted_at")
      .eq("family_id", familyId);
    expect((data ?? []).length).toBe(2);
    for (const row of data ?? []) expect(row["deleted_at"]).not.toBeNull();

    const job = await adminClient()
      .from("import_jobs")
      .select("status, rolled_back_at")
      .eq("id", executeJobId)
      .single();
    expect(job.data).toMatchObject({ status: "ROLLED_BACK" });
  });

  it("recusa reverter duas vezes", async () => {
    const auth = await authorize(authContext(gestor), "import.rollback");
    await expect(runRollback(auth, executeJobId)).rejects.toBeInstanceOf(AppError);
  });
});
