/**
 * Login administrativo resiliente.
 *
 * Dentro do iframe de pré-visualização o `signInWithPassword` do SDK pode
 * ficar pendurado (bloqueio de `navigator.locks` / storage particionado),
 * deixando o botão preso em "Entrando…". Aqui damos um limite de tempo e,
 * se estourar, autenticamos direto na API de token e persistimos a sessão
 * no mesmo formato que o SDK espera.
 */

const TIMEOUT_MS = 8000;

function config() {
  const url = String(import.meta.env["VITE_SUPABASE_URL"] ?? "");
  const key = String(import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "");
  const ref = url.replace(/^https?:\/\//, "").split(".")[0] ?? "";
  return { url, key, storageKey: `sb-${ref}-auth-token` };
}

function timeout(ms: number): Promise<"TIMEOUT"> {
  return new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), ms));
}

async function fallbackSignIn(email: string, password: string): Promise<boolean> {
  const { url, key, storageKey } = config();
  if (!url || !key) return false;
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: key },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return false;
  const session = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!session.access_token) return false;
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...session,
        expires_at: Math.floor(Date.now() / 1000) + (session.expires_in ?? 3600),
      }),
    );
  } catch {
    return false;
  }
  return true;
}

export type SignInResult = "OK" | "OK_RELOAD" | "INVALID";

export async function signInAdmin(email: string, password: string): Promise<SignInResult> {
  const { supabase } = await import("@/integrations/supabase/client");
  const attempt = supabase.auth
    .signInWithPassword({ email, password })
    .then((result) => (result.error ? "INVALID" : "OK"))
    .catch(() => "TIMEOUT" as const);

  const outcome = await Promise.race([attempt, timeout(TIMEOUT_MS)]);
  if (outcome === "OK") return "OK";
  if (outcome === "INVALID") return "INVALID";

  // O SDK travou: autentica pela API e recarrega para o cliente reler a sessão.
  return (await fallbackSignIn(email, password)) ? "OK_RELOAD" : "INVALID";
}
