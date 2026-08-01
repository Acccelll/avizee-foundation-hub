/**
 * Contrato de autenticação (§20 da Etapa 5).
 *
 * ADAPTADOR LOCAL: DT-02 (banco) e DT-14 (provedor de autenticação) seguem
 * PENDENTE_DE_APROVAÇÃO. Esta fundação define o contrato estável e um provedor
 * local seguro; a troca pelo provedor aprovado não altera o consumo.
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

export interface AuthResult {
  ok: boolean;
  user?: SessionUser;
}

export interface AuthProvider {
  readonly name: string;
  /** Nunca revela se o e-mail existe: falha sempre genérica. */
  verifyCredentials(email: string, password: string): Promise<AuthResult>;
  findById(id: string): Promise<SessionUser | null>;
}
