/**
 * Etapa 11.1 §11/§13/§14/§15/§16 — ambiente canônico, URL pública,
 * sitemap e robots. Módulos puros.
 */
import { afterEach, describe, expect, it } from "vitest";

import {
  APP_ENVIRONMENTS,
  DEV_ONLY_QUOTATION_SALT,
  assertEnvironmentCoherence,
  getServerConfig,
  normalizePublicUrl,
  requiresStrictConfig,
  resetServerConfigCache,
} from "@/lib/env.server";
import {
  buildSitemapPaths,
  renderSitemap,
  SITEMAP_EXCLUDED_PREFIXES,
} from "@/routes/sitemap[.]xml";
import { renderRobots } from "@/routes/robots[.]txt";

const ORIGINAL = { ...process.env };

function withEnv(patch: Record<string, string | undefined>) {
  resetServerConfigCache();
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

afterEach(() => {
  process.env = { ...ORIGINAL };
  resetServerConfigCache();
});

describe("fonte única de ambiente (§13)", () => {
  it("aceita apenas os ambientes previstos", () => {
    expect([...APP_ENVIRONMENTS]).toEqual([
      "development",
      "preview",
      "staging",
      "production",
      "test",
    ]);
  });

  it("exige configuração estrita fora de desenvolvimento e teste", () => {
    expect(requiresStrictConfig("development")).toBe(false);
    expect(requiresStrictConfig("test")).toBe(false);
    expect(requiresStrictConfig("preview")).toBe(true);
    expect(requiresStrictConfig("staging")).toBe(true);
    expect(requiresStrictConfig("production")).toBe(true);
  });

  it("falha quando APP_ENV e VITE_APP_ENV divergem", () => {
    expect(() => assertEnvironmentCoherence("staging", "production")).toThrow();
    expect(() => assertEnvironmentCoherence("staging", "staging")).not.toThrow();
    expect(() => assertEnvironmentCoherence("staging", undefined)).not.toThrow();
  });
});

describe("salt antiabuso (§11)", () => {
  it("recusa a inicialização sem QUOTATION_HASH_SALT fora de desenvolvimento", () => {
    withEnv({
      APP_ENV: "staging",
      QUOTATION_HASH_SALT: undefined,
      APP_PUBLIC_URL: "https://homologacao.exemplo.invalid",
    });
    expect(() => getServerConfig()).toThrow(/QUOTATION_HASH_SALT/);
  });

  it("usa valor explicitamente local apenas em desenvolvimento", () => {
    withEnv({ APP_ENV: "development", QUOTATION_HASH_SALT: undefined, APP_PUBLIC_URL: undefined });
    expect(getServerConfig().QUOTATION_HASH_SALT).toBe(DEV_ONLY_QUOTATION_SALT);
  });

  it("nunca embute o valor de desenvolvimento em ambiente estrito", () => {
    withEnv({
      APP_ENV: "production",
      QUOTATION_HASH_SALT: "salt-de-homologacao-forte-0001-xx",
      APP_PUBLIC_URL: "https://exemplo.invalid",
    });
    expect(getServerConfig().QUOTATION_HASH_SALT).not.toBe(DEV_ONLY_QUOTATION_SALT);
  });
});

describe("URL pública canônica (§14)", () => {
  it("remove barra final e preserva o protocolo", () => {
    expect(normalizePublicUrl("https://exemplo.invalid/")).toBe("https://exemplo.invalid");
    expect(normalizePublicUrl("https://exemplo.invalid///")).toBe("https://exemplo.invalid");
  });

  it("exige APP_PUBLIC_URL fora de desenvolvimento", () => {
    withEnv({
      APP_ENV: "staging",
      QUOTATION_HASH_SALT: "salt-de-homologacao-forte-0001-xx",
      APP_PUBLIC_URL: undefined,
    });
    expect(() => getServerConfig()).toThrow(/APP_PUBLIC_URL/);
  });

  it("recusa URL sem HTTPS em produção", () => {
    withEnv({
      APP_ENV: "production",
      QUOTATION_HASH_SALT: "salt-de-homologacao-forte-0001-xx",
      APP_PUBLIC_URL: "http://exemplo.invalid",
    });
    expect(() => getServerConfig()).toThrow(/APP_PUBLIC_URL/);
  });
});

describe("sitemap (§15)", () => {
  const paths = buildSitemapPaths(["nutricao"], [{ slug: "familia-a", categorySlug: "nutricao" }], {
    categories: ["manejo"],
    articles: ["artigo-a"],
  });

  it("gera apenas URLs absolutas", () => {
    const xml = renderSitemap("https://exemplo.invalid", paths);
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(locs.length).toBeGreaterThan(5);
    for (const loc of locs) expect(loc.startsWith("https://exemplo.invalid/")).toBe(true);
    expect(xml).not.toContain("<loc>/");
  });

  it("não inclui busca, cotação, painel, prévias nem páginas legais em rascunho", () => {
    const xml = renderSitemap("https://exemplo.invalid", paths);
    for (const prefix of SITEMAP_EXCLUDED_PREFIXES) {
      expect(xml).not.toContain(`https://exemplo.invalid${prefix}`);
    }
  });

  it("omite lastmod — nenhum timestamp de build é publicado", () => {
    expect(renderSitemap("https://exemplo.invalid", paths)).not.toContain("<lastmod>");
  });
});

describe("robots (§16)", () => {
  it("bloqueia indexação em desenvolvimento, preview e homologação", () => {
    for (const env of ["development", "preview", "staging", "test"]) {
      const body = renderRobots(env, "https://exemplo.invalid");
      expect(body).toContain("Disallow: /");
      expect(body).not.toContain("Sitemap:");
    }
  });

  it("anuncia o sitemap com URL absoluta somente em produção", () => {
    const body = renderRobots("production", "https://exemplo.invalid/");
    expect(body).toContain("Sitemap: https://exemplo.invalid/sitemap.xml");
    expect(body).not.toMatch(/Sitemap: \//);
  });
});
