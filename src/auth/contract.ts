/**
 * Contrato de sessão administrativa.
 * Etapa 6: o provedor sintético (DV-05-01) foi substituído pelo provedor
 * gerenciado real; o contrato consumido pela interface permanece o mesmo.
 */
import type { Role, Permission } from "@/permissions/model";

export interface SessionUser {
  /** Identificador interno imutável (UUID) — nunca o e-mail. */
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
}

export type AdminSession = { authenticated: false } | { authenticated: true; user: SessionUser };
