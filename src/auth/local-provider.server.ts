/**
 * Provedor de autenticação LOCAL — apenas desenvolvimento/preview.
 * Dados 100% sintéticos (§19). Nenhum dado pessoal real.
 * Substituível pelo provedor aprovado em DT-14 sem alterar o contrato.
 */
import { createHash, timingSafeEqual } from "node:crypto";

import type { AuthProvider, AuthResult, SessionUser } from "./contract";
import { permissionsFor, type Role } from "@/permissions/model";
import { getServerConfig } from "@/lib/env.server";

type SeedUser = { id: string; name: string; email: string; password: string; roles: Role[] };

/**
 * Seed sintético. Credenciais válidas SOMENTE em development/preview:
 * o provedor recusa qualquer autenticação em staging/production.
 */
const SEED_USERS: SeedUser[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Administrador Local",
    email: "admin@exemplo.local",
    password: "AviZee-Local-2026",
    roles: ["ADMINISTRADOR"],
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Editor Local",
    email: "editor@exemplo.local",
    password: "AviZee-Local-2026",
    roles: ["EDITOR"],
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Comercial Local",
    email: "comercial@exemplo.local",
    password: "AviZee-Local-2026",
    roles: ["COMERCIAL"],
  },
];

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function constantTimeEquals(a: string, b: string) {
  const da = digest(a);
  const db = digest(b);
  return da.length === db.length && timingSafeEqual(da, db);
}

function toSessionUser(u: SeedUser): SessionUser {
  return { id: u.id, name: u.name, email: u.email, roles: u.roles, permissions: permissionsFor(u.roles) };
}

export const localAuthProvider: AuthProvider = {
  name: "local-seed",

  async verifyCredentials(email, password): Promise<AuthResult> {
    const { APP_ENV } = getServerConfig();
    if (APP_ENV === "staging" || APP_ENV === "production") return { ok: false };

    const normalized = email.trim().toLowerCase();
    const user = SEED_USERS.find((u) => u.email === normalized);
    // Compara sempre, mesmo sem usuário, para não vazar existência por tempo.
    const reference = user?.password ?? "senha-inexistente-para-comparacao";
    const match = constantTimeEquals(reference, password);
    if (!user || !match) return { ok: false };
    return { ok: true, user: toSessionUser(user) };
  },

  async findById(id) {
    const user = SEED_USERS.find((u) => u.id === id);
    return user ? toSessionUser(user) : null;
  },
};
