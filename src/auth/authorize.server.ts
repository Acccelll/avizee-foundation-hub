/**
 * Autorização de servidor (§37 da Etapa 6).
 * Nenhuma ação administrativa confia no frontend: papéis vêm sempre do banco.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors";
import { hasPermission, isRole, permissionsFor, type Permission, type Role } from "@/permissions/model";
import type { SessionUser } from "./contract";

type AnyClient = SupabaseClient<never, never, never>;

/** Lê papéis do usuário autenticado (RLS permite ler os próprios papéis). */
export async function loadRoles(supabase: AnyClient, userId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
  return (data ?? [])
    .map((row: { role: string }) => row.role)
    .filter(isRole);
}

export async function loadSessionUser(
  supabase: AnyClient,
  userId: string,
  claims: { email?: string; user_metadata?: { full_name?: string } },
): Promise<SessionUser> {
  const roles = await loadRoles(supabase, userId);
  return {
    id: userId,
    name: claims.user_metadata?.full_name || claims.email?.split("@")[0] || "Usuário",
    email: claims.email ?? "",
    roles,
    permissions: permissionsFor(roles),
  };
}

/** Exige uma permissão; lança FORBIDDEN sem revelar detalhes internos. */
export function requirePermission(roles: readonly Role[], permission: Permission) {
  if (!hasPermission(roles, permission)) {
    throw new AppError("FORBIDDEN", { permission });
  }
}

export async function requirePermissionFor(
  supabase: AnyClient,
  userId: string,
  permission: Permission,
): Promise<Role[]> {
  const roles = await loadRoles(supabase, userId);
  requirePermission(roles, permission);
  return roles;
}
