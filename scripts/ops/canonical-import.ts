/**
 * Operação controlada do lote canônico da Etapa 6.1 (31 famílias / 97 SKUs).
 *
 * Uso:
 *   bun scripts/ops/canonical-import.ts dry-run
 *   bun scripts/ops/canonical-import.ts execute <dryRunJobId> <signature>
 *   bun scripts/ops/canonical-import.ts rollback <jobId>
 *   bun scripts/ops/canonical-import.ts verify
 *
 * Nunca executa sem simulação prévia: a assinatura é validada pelo runner.
 * O operador é um usuário nomeado e persistente, para rastreabilidade da auditoria.
 */
import { readFileSync } from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { runDryRun, runExecute, runRollback } from "@/catalog/import/runner.server";
import type { Authorized } from "@/catalog/guard.server";
import type { AnyClient } from "@/lib/supabase-types";

const CSV_PATH = "docs/avizee/data/canonical/import-products-v1.csv";
const OPERATOR_EMAIL = "operacao.catalogo@avizee.invalid";

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
} else {
  console.error("Modo inválido. Use: dry-run | execute | rollback | verify");
  process.exit(1);
}
