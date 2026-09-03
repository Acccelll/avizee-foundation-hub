import fs from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEV_ONLY_QUOTATION_SALT,
  getServerConfig,
  resetServerConfigCache,
} from "../../src/lib/env.server";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  vi.unstubAllEnvs();
  process.env = { ...ORIGINAL_ENV };
  resetServerConfigCache();
});

describe("Home Page Security Regression", () => {
  it("não contém marcadores operacionais internos na Home", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "../../src/routes/index.tsx"), "utf-8");

    const forbidden = [
      "PRODUCTION_BLOCKED",
      "OPERATION_BLOCKED",
      "STAGE_14_BLOCKED",
      "Execute esta instrucao no projeto",
      "ETAPA 13.1",
    ];

    for (const term of forbidden) {
      expect(content).not.toContain(term);
    }
  });
});

describe("Server Config Security", () => {
  it("recusa configuração estrita quando variáveis obrigatórias estão ausentes", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("APP_PUBLIC_URL", "");
    vi.stubEnv("QUOTATION_HASH_SALT", "");
    resetServerConfigCache();

    expect(() => getServerConfig()).toThrow(/QUOTATION_HASH_SALT|APP_PUBLIC_URL/);
  });

  it("usa o sal local exclusivamente em desenvolvimento", () => {
    vi.stubEnv("APP_ENV", "development");
    vi.stubEnv("APP_PUBLIC_URL", "http://localhost:8080");
    vi.stubEnv("QUOTATION_HASH_SALT", "");
    resetServerConfigCache();

    expect(getServerConfig().QUOTATION_HASH_SALT).toBe(DEV_ONLY_QUOTATION_SALT);
  });

  it("nunca usa o sal local em produção", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("APP_PUBLIC_URL", "https://avizee.example");
    vi.stubEnv("QUOTATION_HASH_SALT", "production-salt-with-more-than-thirty-two-characters");
    vi.stubEnv("SUPABASE_AUTH_RATE_LIMIT_VERIFIED", "true");
    resetServerConfigCache();

    expect(getServerConfig().QUOTATION_HASH_SALT).not.toBe(DEV_ONLY_QUOTATION_SALT);
  });
});

describe("Repository Secret Hygiene", () => {
  it("mantém arquivos .env fora do checkout versionado do CI", () => {
    if (process.env["CI"] !== "true") return;

    const envPath = path.resolve(__dirname, "../../.env");
    const gitignorePath = path.resolve(__dirname, "../../.gitignore");
    const gitignore = fs.readFileSync(gitignorePath, "utf-8");

    expect(fs.existsSync(envPath)).toBe(false);
    expect(gitignore).toMatch(/^\.env$/m);
    expect(gitignore).toMatch(/^\.env\.\*$/m);
    expect(gitignore).toMatch(/^!\.env\.example$/m);
  });
});
