/**
 * Guarda de autorização e escrita privilegiada para as funções de servidor
 * do núcleo administrativo (§37 da Etapa 6).
 *
 * A leitura acontece como o próprio usuário (RLS aplica-se);
 * a escrita usa o cliente de serviço apenas DEPOIS da verificação de permissão.
 */
import { loadRoles, requirePermission } from "@/auth/authorize.server";
import type { Permission, Role } from "@/permissions/model";

import type { AnyClient } from "@/lib/supabase-types";

export type { AnyClient };

export interface AuthContext {
  supabase: AnyClient;
  userId: string;
  claims?: { email?: string };
}

export interface Authorized extends AuthContext {
  roles: Role[];
  email: string | null;
  /** Cliente privilegiado — usar somente para escritas já autorizadas. */
  admin: AnyClient;
}

export async function authorize(
  context: unknown,
  permission: Permission,
): Promise<Authorized> {
  const ctx = context as AuthContext;
  const roles = await loadRoles(ctx.supabase, ctx.userId);
  requirePermission(roles, permission);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return {
    ...ctx,
    roles,
    email: ctx.claims?.email ?? null,
    admin: supabaseAdmin as unknown as AnyClient,
  };
}
