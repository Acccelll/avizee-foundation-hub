/**
 * Middleware de cliente que anexa o token do usuário às chamadas de server fn.
 *
 * Substitui o `attachSupabaseAuth` gerado porque este projeto tem rotas
 * públicas (catálogo, home, busca) que chamam server functions sem sessão.
 * Se a configuração do cliente estiver indisponível, a chamada segue sem
 * cabeçalho em vez de derrubar a página inteira (tela branca em /produtos).
 */
import { createMiddleware } from "@tanstack/react-start";

export const attachSupabaseAuthSafe = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {
      token = undefined;
    }
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
