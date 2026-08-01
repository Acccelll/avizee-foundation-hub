/**
 * RBAC — fundação (§21 da Etapa 5).
 * Origem: docs/avizee/111-role-permission-matrix.md e architecture/permissions.csv.
 * Somente papéis aprovados. Verificação obrigatória no servidor.
 */
export const ROLES = [
  "ADMINISTRADOR",
  "GESTOR_DE_CATALOGO",
  "EDITOR",
  "AUTOR",
  "REVISOR_TECNICO",
  "COMERCIAL",
  "AUDITOR",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "admin.access",
  "catalog.read",
  "catalog.write",
  "content.read",
  "content.write",
  "content.publish",
  "quotation.read",
  "media.review",
  "settings.write",
  "users.manage",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Menor privilégio: cada papel recebe apenas o necessário. */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMINISTRADOR: PERMISSIONS,
  GESTOR_DE_CATALOGO: ["admin.access", "catalog.read", "catalog.write", "media.review"],
  EDITOR: ["admin.access", "content.read", "content.write", "content.publish", "media.review"],
  AUTOR: ["admin.access", "content.read", "content.write"],
  REVISOR_TECNICO: ["admin.access", "catalog.read", "content.read"],
  COMERCIAL: ["admin.access", "quotation.read", "catalog.read"],
  AUDITOR: ["admin.access", "audit.read", "catalog.read", "content.read"],
};

export function permissionsFor(roles: readonly Role[]): Permission[] {
  const set = new Set<Permission>();
  for (const role of roles) for (const p of ROLE_PERMISSIONS[role] ?? []) set.add(p);
  return [...set];
}

export function hasPermission(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((role) => (ROLE_PERMISSIONS[role] ?? []).includes(permission));
}
