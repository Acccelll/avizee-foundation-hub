/**
 * Infraestrutura de testes de integração (FASE D/E).
 *
 * Ambiente: instância NÃO PRODUTIVA do Lovable Cloud usada pelo preview.
 * Nenhum dado pessoal real: todos os usuários e registros são sintéticos e
 * prefixados, e cada arquivo de teste limpa o que criou.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Role } from "@/permissions/model";

export const TEST_PREFIX = "zzt-";
export const TEST_EMAIL_DOMAIN = "teste.avizee.invalid";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente para testes: ${name}`);
  return value;
}

export const SUPABASE_URL = required("SUPABASE_URL");
export const PUBLISHABLE_KEY = required("SUPABASE_PUBLISHABLE_KEY");
const SERVICE_ROLE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");

/** Guarda de segurança: nunca rodar a suíte contra produção. */
export function assertNonProduction() {
  const env = process.env["APP_ENV"] ?? "development";
  if (env === "production") throw new Error("Suíte bloqueada: ambiente de produção.");
}

export function adminClient(): SupabaseClient {
  assertNonProduction();
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function anonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  roles: Role[];
  /** Cliente autenticado como o usuário (RLS aplica-se). */
  client: SupabaseClient;
  accessToken: string;
}

const created: string[] = [];

/** Cria usuário sintético confirmado, com papéis, e devolve cliente autenticado. */
export async function createTestUser(label: string, roles: Role[]): Promise<TestUser> {
  const admin = adminClient();
  const email = `${TEST_PREFIX}${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@${TEST_EMAIL_DOMAIN}`;
  const password = `Teste!${Math.random().toString(36).slice(2, 12)}A1`;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `Usuário sintético ${label}` },
  });
  if (error || !data.user) throw new Error(`Falha ao criar usuário de teste: ${error?.message}`);
  const id = data.user.id;
  created.push(id);

  await admin.from("profiles").upsert(
    { user_id: id, full_name: `Usuário sintético ${label}`, email },
    { onConflict: "user_id" },
  );
  if (roles.length > 0) {
    await admin.from("user_roles").insert(roles.map((role) => ({ user_id: id, role })));
  }

  const client = anonClient();
  const signIn = await client.auth.signInWithPassword({ email, password });
  if (signIn.error) throw new Error(`Falha ao autenticar usuário de teste: ${signIn.error.message}`);

  return {
    id,
    email,
    password,
    roles,
    client,
    accessToken: signIn.data.session?.access_token ?? "",
  };
}

export async function deleteTestUsers() {
  const admin = adminClient();
  for (const id of created.splice(0)) {
    await admin.from("user_roles").delete().eq("user_id", id);
    await admin.from("profiles").delete().eq("user_id", id);
    await admin.auth.admin.deleteUser(id);
  }
}

/** Contexto no formato esperado por `authorize()` das funções de servidor. */
export function authContext(user: TestUser) {
  return { supabase: user.client, userId: user.id, claims: { email: user.email } };
}

/** Remove registros sintéticos criados pela suíte (idempotente). */
export async function cleanupSyntheticCatalog() {
  const admin = adminClient();
  const jobs = await admin.from("import_jobs").select("id").ilike("filename", `${TEST_PREFIX}%`);
  const jobIds = (jobs.data ?? []).map((j: { id: string }) => j.id);
  if (jobIds.length > 0) {
    await admin.from("import_job_rows").delete().in("import_job_id", jobIds);
    await admin.from("import_errors").delete().in("import_job_id", jobIds);
  }
  await admin.from("normalization_tasks").delete().ilike("title", `%${TEST_PREFIX}%`);
  const prods = await admin.from("products").select("id").ilike("public_sku", `${TEST_PREFIX}%`);
  const prodIds = (prods.data ?? []).map((p: { id: string }) => p.id);
  if (prodIds.length > 0) {
    await admin.from("product_codes").delete().in("product_id", prodIds);
    await admin.from("products").delete().in("id", prodIds);
  }
  await admin.from("product_families").delete().ilike("slug", `${TEST_PREFIX}%`);
  if (jobIds.length > 0) await admin.from("import_jobs").delete().in("id", jobIds);
}

export async function countRows(table: string): Promise<number> {
  const { count, error } = await adminClient()
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`Falha ao contar ${table}: ${error.message}`);
  return count ?? 0;
}
