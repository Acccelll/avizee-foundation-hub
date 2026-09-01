import fs from "node:fs";
import path from "node:path";

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  getServerConfig,
  resetServerConfigCache,
} from "@/lib/env.server";
import { contentSecurityPolicy } from "@/lib/security-headers";
import {
  readinessBody,
  type ComponentCheck,
} from "@/observability/health";
import {
  createTestUser,
  deleteTestUsers,
  type TestUser,
} from "../helpers/db";

const ORIGINAL_ENV = { ...process.env };

function strictProductionEnv() {
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("APP_PUBLIC_URL", "https://avizee.example");
  vi.stubEnv("QUOTATION_HASH_SALT", "x".repeat(48));
}

afterEach(() => {
  vi.unstubAllEnvs();
  process.env = { ...ORIGINAL_ENV };
  resetServerConfigCache();
});

describe("OWASP hardening — configuração e exposição", () => {
  it("falha fechado em produção enquanto o hardening de rate limit do Supabase Auth não estiver verificado", () => {
    strictProductionEnv();
    vi.stubEnv("SUPABASE_AUTH_RATE_LIMIT_VERIFIED", "false");
    resetServerConfigCache();

    expect(() => getServerConfig()).toThrow(/SUPABASE_AUTH_RATE_LIMIT_VERIFIED/);
  });

  it("não mantém knobs legados de sessão que não controlam a autenticação atual", () => {
    const source = fs.readFileSync(path.resolve("src/lib/env.server.ts"), "utf8");
    expect(source).not.toMatch(/AUTH_SESSION_TTL_MINUTES|AUTH_MAX_ATTEMPTS/);
  });

  it("usa nonce na CSP de produção e não libera script inline irrestrito", () => {
    const factory = contentSecurityPolicy as unknown as (
      production: boolean,
      nonce?: string,
    ) => string;
    const csp = factory(true, "test-nonce");

    expect(csp).toContain("'nonce-test-nonce'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("não expõe a decomposição interna dos componentes no readiness público", () => {
    const checks: ComponentCheck[] = [
      { name: "application", status: "healthy" },
      { name: "configuration", status: "healthy" },
      { name: "database", status: "healthy" },
      { name: "authentication", status: "configured" },
      { name: "storage", status: "degraded" },
      { name: "outbox", status: "healthy" },
      { name: "email", status: "degraded" },
      { name: "migrations", status: "healthy" },
    ];

    const body = readinessBody(checks, "production") as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(["environment", "status"]);
    expect(JSON.stringify(body)).not.toMatch(/database|migrations|outbox|storage|email/i);
  });

  it("não confia em X-Forwarded-For como identidade de segurança da cotação", () => {
    const source = fs.readFileSync(
      path.resolve("src/quotation/quotation.functions.ts"),
      "utf8",
    );

    expect(source).toContain("cf-connecting-ip");
    expect(source).not.toContain('headers.get("x-forwarded-for")');
  });
});

describe("OWASP hardening — helpers editoriais", () => {
  let editor: TestUser;
  let comercial: TestUser;

  beforeAll(async () => {
    editor = await createTestUser("owasp-editor", ["EDITOR"]);
    comercial = await createTestUser("owasp-comercial", ["COMERCIAL"]);
  }, 60_000);

  afterAll(async () => {
    await deleteTestUsers();
  }, 60_000);

  it("usuário autenticado não consegue sondar a permissão editorial de outro UUID", async () => {
    const result = await (comercial.client as any).rpc("can_publish_content", {
      _user_id: editor.id,
    });

    expect(result.error).not.toBeNull();
  });

  it("helper sem argumento continua avaliando somente o próprio usuário", async () => {
    const result = await (editor.client as any).rpc("can_publish_content");

    expect(result.error).toBeNull();
    expect(result.data).toBe(true);
  });
});
