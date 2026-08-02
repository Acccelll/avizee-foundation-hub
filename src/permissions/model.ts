/**
 * RBAC — Etapa 5 (§21) estendido na Etapa 6 (§37).
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
  // Catálogo
  "catalog.read",
  "catalog.write",
  "catalog.publish",
  "catalog.internal.read",
  "taxonomy.write",
  "spec.write",
  "conflict.resolve",
  // Mídia e documentos
  "media.read",
  "media.write",
  "media.approve",
  "document.write",
  // Importação
  "import.execute",
  "import.rollback",
  // Conteúdo e comercial
  "content.read",
  "content.write",
  "content.publish",
  "quotation.read",
  "quotation.write",
  "quotation.assign",
  "quotation.export",
  "outbox.manage",
  // Governança
  "settings.write",
  "users.manage",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Menor privilégio: cada papel recebe apenas o necessário (§37). */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMINISTRADOR: PERMISSIONS,
  GESTOR_DE_CATALOGO: [
    "admin.access",
    "catalog.read",
    "catalog.write",
    "catalog.publish",
    "catalog.internal.read",
    "taxonomy.write",
    "spec.write",
    "conflict.resolve",
    "media.read",
    "media.write",
    "media.approve",
    "document.write",
    "import.execute",
    "import.rollback",
  ],
  EDITOR: [
    "admin.access",
    "catalog.read",
    "content.read",
    "content.write",
    "content.publish",
    "media.read",
    "media.write",
  ],
  AUTOR: ["admin.access", "content.read", "content.write", "media.read"],
  REVISOR_TECNICO: ["admin.access", "catalog.read", "content.read", "media.read"],
  COMERCIAL: [
    "admin.access",
    "quotation.read",
    "quotation.write",
    "quotation.assign",
    "quotation.export",
    "catalog.read",
  ],
  AUDITOR: [
    "admin.access",
    "audit.read",
    "catalog.read",
    "content.read",
    "media.read",
    "quotation.read",
  ],
};

export function permissionsFor(roles: readonly Role[]): Permission[] {
  const set = new Set<Permission>();
  for (const role of roles) for (const p of ROLE_PERMISSIONS[role] ?? []) set.add(p);
  return [...set];
}

export function hasPermission(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((role) => (ROLE_PERMISSIONS[role] ?? []).includes(permission));
}

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
