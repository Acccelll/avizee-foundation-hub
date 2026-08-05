import { describe, it, expect, vi } from "vitest";
import { getServerConfig, DEV_ONLY_QUOTATION_SALT } from "../../src/lib/env.server";

describe("Home Page Security Regression", () => {
  it("should not contain internal operational markers in the homepage", async () => {
    // Simulating a fetch or reading the file content to check for forbidden strings
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(path.resolve(__dirname, "../../src/routes/index.tsx"), "utf-8");

    const forbidden = [
      "PRODUCTION_BLOCKED",
      "OPERATION_BLOCKED",
      "STAGE_14_BLOCKED",
      "Execute esta instrucao no projeto",
      "ETAPA 13.1",
    ];

    forbidden.forEach((term) => {
      expect(content).not.toContain(term);
    });
  });
});

describe("Server Config Security", () => {
  it("should fail strict config when variables are missing", () => {
    vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("APP_PUBLIC_URL", "");
    vi.stubEnv("QUOTATION_HASH_SALT", "");
    resetServerConfigCache();
    
    expect(() => getServerConfig()).toThrow(/Configuração ausente|Variáveis com problema/);
    
    vi.unstubAllEnvs();
  });

  it("should use dev salt only in development", () => {
    vi.stubEnv("APP_ENV", "development");
    vi.stubEnv("QUOTATION_HASH_SALT", "");
    resetServerConfigCache();
    const config = getServerConfig();
    expect(config.QUOTATION_HASH_SALT).toBe(DEV_ONLY_QUOTATION_SALT);
    vi.unstubAllEnvs();
  });
});
