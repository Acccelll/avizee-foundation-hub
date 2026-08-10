/**
 * Operação controlada do lote canônico da Etapa 6.1 (31 famílias / 97 SKUs).
 *
 * Uso:
 *   bun scripts/ops/canonical-import.ts dry-run
 *   bun scripts/ops/canonical-import.ts execute <dryRunJobId> <signature>
 *   bun scripts/ops/canonical-import.ts rollback <jobId>
 *   bun scripts/ops/canonical-import.ts verify
 *   APP_ENV=test bun scripts/ops/canonical-import.ts ci-seed
 *
 * Nunca executa sem simulação prévia: a assinatura é validada pelo runner.
 * O operador é um usuário nomeado e persistente, para rastreabilidade da auditoria.
 * `ci-seed` existe apenas para o banco efêmero da suíte e nunca é aceito fora de APP_ENV=test.
 */
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { runDryRun, runExecute, runRollback } from "@/catalog/import/runner.server";
import type { Authorized } from "@/catalog/guard.server";
import type { AnyClient } from "@/lib/supabase-types";

const CSV_PATH = "docs/avizee/data/canonical/import-products-v1.csv";
const OPERATOR_EMAIL = "operacao.catalogo@avizee.invalid";
const EXPECTED_FAMILIES = 31;
const EXPECTED_SKUS = 97;
const COHORT_CODE = "V1-31-97";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
}

function admin(): SupabaseClient {
  if ((process.env["APP_ENV"] ?? "development") === "production") {
    throw new Error("Operação bloqueada em produção sem aprovação explícita.");
  }
  return createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Garante o operador nomeado com papel de administrador do catálogo. */
async function operator(): Promise<Authorized> {
  const service = admin();
  const password = required("SUPABASE_SERVICE_ROLE_KEY").slice(0, 24) + "!Aa1";
  const list = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list.data.users.find((u) => u.email === OPERATOR_EMAIL);
  if (!user) {
    const created = await service.auth.admin.createUser({
      email: OPERATOR_EMAIL,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Operação de catálogo AviZee" },
    });
    if (created.error || !created.data.user) {
      throw new Error(`Falha ao criar operador: ${created.error?.message}`);
    }
    user = created.data.user;
  }
  await service
    .from("profiles")
    .upsert(
      { user_id: user.id, full_name: "Operação de catálogo AviZee", email: OPERATOR_EMAIL },
      { onConflict: "user_id" },
    );
  await service
    .from("user_roles")
    .upsert({ user_id: user.id, role: "ADMINISTRADOR" }, { onConflict: "user_id,role" });

  return {
    supabase: service as unknown as AnyClient,
    admin: service as unknown as AnyClient,
    userId: user.id,
    claims: { email: OPERATOR_EMAIL },
    email: OPERATOR_EMAIL,
    roles: ["ADMINISTRADOR"],
  };
}

function batch() {
  const content = readFileSync(CSV_PATH, "utf8");
  const skus = content
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => line.split(",")[0] as string);
  return { content, skus };
}

async function verify() {
  const service = admin();
  const counts: Record<string, number> = {};
  for (const table of ["product_families", "products", "product_codes", "import_jobs"]) {
    const { count } = await service.from(table).select("*", { count: "exact", head: true });
    counts[table] = count ?? 0;
  }
  const { data } = await service
    .from("products")
    .select("public_sku, public_name, review_status, family_id")
    .is("deleted_at", null)
    .order("public_sku");
  const semFamilia = (data ?? []).filter((p) => !p.family_id).length;
  console.log(JSON.stringify({ counts, produtosAtivos: data?.length ?? 0, semFamilia }, null, 2));
}

/**
 * Fixture estrito da suíte integral.
 * Usa exclusivamente o CSV canônico aprovado e o pipeline dry-run → execute.
 * A publicação posterior só existe para reproduzir em CI a coorte pública já aprovada.
 */
async function seedCiApprovedCatalog() {
  if (process.env["APP_ENV"] !== "test") {
    throw new Error("ci-seed é permitido exclusivamente com APP_ENV=test.");
  }

  const auth = await operator();
  const service = admin();
  const { content, skus } = batch();
  if (skus.length !== EXPECTED_SKUS || new Set(skus).size !== EXPECTED_SKUS) {
    throw new Error(`CSV canônico divergente: esperados ${EXPECTED_SKUS} SKUs únicos.`);
  }

  const { count: familyCount, error: familyCountError } = await service
    .from("product_families")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);
  if (familyCountError || familyCount !== EXPECTED_FAMILIES) {
    throw new Error(
      `Base de teste divergente: esperadas ${EXPECTED_FAMILIES} famílias canônicas, encontradas ${familyCount ?? 0}.`,
    );
  }

  const dryRun = await runDryRun(auth, {
    filename: "import-products-v1.csv",
    content,
    schemaVersion: "1.0.0",
    allowedSkus: skus,
  });
  if (
    dryRun.errors.length !== 0 ||
    dryRun.plan.summary.total !== EXPECTED_SKUS ||
    dryRun.plan.summary.blocked !== 0
  ) {
    throw new Error(
      `Dry-run canônico inválido: ${JSON.stringify({ errors: dryRun.errors.length, summary: dryRun.plan.summary })}`,
    );
  }

  const executed = await runExecute(auth, {
    dryRunJobId: dryRun.jobId,
    signature: dryRun.signature,
    content,
    allowedSkus: skus,
  });
  if (executed.summary.blocked !== 0) {
    throw new Error(`Execução canônica contém ${executed.summary.blocked} linhas bloqueadas.`);
  }

  const { data: products, error: productsError } = await service
    .from("products")
    .select("id, public_sku, review_status, publication_status")
    .in("public_sku", skus)
    .is("deleted_at", null);
  if (productsError || (products ?? []).length !== EXPECTED_SKUS) {
    throw new Error(
      `Importação canônica incompleta: esperados ${EXPECTED_SKUS} produtos, encontrados ${(products ?? []).length}.`,
    );
  }

  const publicationRows = (products ?? []).map((product) => ({
    entity: "products",
    entity_id: product.id,
    from_status: `${product.review_status}/${product.publication_status}`,
    to_status: "READY_TO_PUBLISH/PUBLISHED",
    reason: "CI fixture - coorte canônica aprovada V1-31-97",
    actor_id: auth.userId,
  }));
  const publicationHistory = await service.from("publication_history").insert(publicationRows);
  if (publicationHistory.error) {
    throw new Error(
      `Falha ao registrar publicação do fixture: ${publicationHistory.error.message}`,
    );
  }

  const publish = await service
    .from("products")
    .update({
      review_status: "READY_TO_PUBLISH",
      publication_status: "PUBLISHED",
      updated_by: auth.userId,
      updated_at: new Date().toISOString(),
    })
    .in("public_sku", skus)
    .is("deleted_at", null);
  if (publish.error) {
    throw new Error(`Falha ao publicar fixture canônico: ${publish.error.message}`);
  }

  const cohortRows = (products ?? []).map((product) => ({
    cohort_code: COHORT_CODE,
    entity: "PRODUCT",
    entity_id: product.id,
    approved_by: auth.userId,
    approval_reference: "D-052/D-053",
  }));
  const cohort = await service
    .from("public_release_cohort")
    .upsert(cohortRows, { onConflict: "cohort_code,entity,entity_id" });
  if (cohort.error) {
    throw new Error(`Falha ao materializar coorte no CI: ${cohort.error.message}`);
  }

  const refresh = await service.rpc("refresh_public_search_index");
  if (refresh.error) {
    throw new Error(`Falha ao atualizar índice público: ${refresh.error.message}`);
  }

  const [publicFamilies, publicProducts] = await Promise.all([
    service.from("public_families").select("id", { count: "exact", head: true }),
    service.from("public_products").select("id", { count: "exact", head: true }),
  ]);
  if (publicFamilies.count !== EXPECTED_FAMILIES || publicProducts.count !== EXPECTED_SKUS) {
    throw new Error(
      `Coorte pública de CI divergente: famílias=${publicFamilies.count ?? 0}, SKUs=${publicProducts.count ?? 0}.`,
    );
  }

  console.log(
    JSON.stringify(
      {
        fixture: COHORT_CODE,
        source: CSV_PATH,
        dryRunJobId: dryRun.jobId,
        executeJobId: executed.jobId,
        families: publicFamilies.count,
        skus: publicProducts.count,
      },
      null,
      2,
    ),
  );
}

const [mode, arg1, arg2] = process.argv.slice(2);

if (mode === "dry-run") {
  const auth = await operator();
  const { content, skus } = batch();
  const result = await runDryRun(auth, {
    filename: "import-products-v1.csv",
    content,
    schemaVersion: "1.0.0",
    allowedSkus: skus,
  });
  console.log(
    JSON.stringify(
      {
        jobId: result.jobId,
        signature: result.signature,
        errors: result.errors.slice(0, 20),
        totalErros: result.errors.length,
        summary: result.plan.summary,
        bloqueados: result.plan.items
          .filter((i) => i.operation === "BLOCK")
          .map((i) => ({ sku: i.sku, motivo: i.blockReason })),
      },
      null,
      2,
    ),
  );
} else if (mode === "execute") {
  const auth = await operator();
  const { content, skus } = batch();
  const result = await runExecute(auth, {
    dryRunJobId: String(arg1),
    signature: String(arg2),
    content,
    allowedSkus: skus,
  });
  console.log(JSON.stringify(result, null, 2));
} else if (mode === "rollback") {
  console.log(JSON.stringify(await runRollback(await operator(), String(arg1)), null, 2));
} else if (mode === "verify") {
  await verify();
} else if (mode === "ci-seed") {
  await seedCiApprovedCatalog();
} else {
  console.error("Modo inválido. Use: dry-run | execute | rollback | verify | ci-seed");
  process.exit(1);
}
