import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Suíte automatizada da Etapa 6.1 (quita DV-05-09).
 * Projetos separados para permitir execução seletiva:
 *  - unit        → módulos puros, sem rede e sem banco
 *  - integration → banco isolado não produtivo (migrations reais)
 *  - security    → RLS, RBAC, não vazamento, formula injection
 *  - e2e         → superfícies HTTP servidas pelo dev server
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // Sem paralelismo entre arquivos que tocam o banco: determinismo primeiro.
    fileParallelism: false,
    reporters: ["default", ["junit", { outputFile: "reports/tests/junit.xml" }]],
    coverage: {
      provider: "v8",
      reportsDirectory: "reports/coverage",
      reporter: ["text-summary", "json-summary", "html"],
      include: [
        "src/catalog/**/*.ts",
        "src/permissions/**/*.ts",
        "src/auth/authorize.server.ts",
        "src/lib/audit.server.ts",
      ],
      exclude: ["src/catalog/**/*.functions.ts"],
    },
  },
});
