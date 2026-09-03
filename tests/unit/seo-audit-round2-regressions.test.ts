import { afterEach, describe, expect, it, vi } from "vitest";

type HeadResult = {
  meta?: Array<Record<string, string>>;
  links?: Array<Record<string, string>>;
  scripts?: Array<{ type: string; children: string }>;
};

function metaContent(result: HeadResult, name: string): string | undefined {
  return result.meta?.find((entry) => entry["name"] === name)?.["content"];
}

function titleContent(result: HeadResult): string | undefined {
  return result.meta?.find((entry) => typeof entry["title"] === "string")?.["title"];
}

async function productionEnv() {
  vi.resetModules();
  vi.stubEnv("VITE_APP_ENV", "production");
  vi.stubEnv("VITE_APP_PUBLIC_URL", "https://avizee.com.br");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("regressões aprovadas do seo-audit — Rodada 2", () => {
  it("mantém title e description da família dentro do contrato SEO", async () => {
    await productionEnv();
    const { Route } = await import("@/routes/produtos/$categorySlug/$familySlug");
    const head = Route.options.head as (context: unknown) => HeadResult;

    const result = head({
      loaderData: {
        family: {
          name: "Balanças suspensas e dinamômetros para aves",
          categoryName: "Pesagem, medição e controle",
          summary: "Pesagem técnica para manejo avícola.",
          variations: [],
        },
      },
      params: {
        categorySlug: "pesagem-medicao-e-controle",
        familySlug: "balancas-suspensas-e-dinamometros-para-aves",
      },
    });

    const title = titleContent(result);
    const description = metaContent(result, "description");

    expect(title).toBeDefined();
    expect(title?.length).toBeLessThanOrEqual(60);
    expect(description).toBeDefined();
    expect(description?.length).toBeGreaterThanOrEqual(140);
    expect(description?.length).toBeLessThanOrEqual(160);
  });

  it("marca o login administrativo como noindex", async () => {
    await productionEnv();
    const { Route } = await import("@/routes/admin/login");
    const head = Route.options.head as (context: unknown) => HeadResult;

    const result = head({});
    expect(metaContent(result, "robots")).toBe("noindex, follow");
  });

  it("protege toda a árvore administrativa autenticada com X-Robots-Tag", async () => {
    await productionEnv();
    const { Route } = await import("@/routes/admin/_protected");
    const headers = Route.options.headers as
      | ((context: unknown) => Record<string, string>)
      | undefined;

    expect(headers).toBeTypeOf("function");
    if (!headers) return;
    expect(headers({})["X-Robots-Tag"]).toBe("noindex, nofollow");
  });

  it("usa canonical próprio na paginação limpa da Central de Conteúdos", async () => {
    await productionEnv();
    const { Route } = await import("@/routes/conteudos/index");
    const head = Route.options.head as (context: unknown) => HeadResult;

    const result = head({ loaderData: { search: { pagina: 2 } } });
    const canonical = result.links?.find((entry) => entry["rel"] === "canonical")?.["href"];

    expect(canonical).toBe("https://avizee.com.br/conteudos?pagina=2");
  });

  it("mantém filtros editoriais noindex e canonicalizados para a Central", async () => {
    await productionEnv();
    const { Route } = await import("@/routes/conteudos/index");
    const head = Route.options.head as (context: unknown) => HeadResult;

    const result = head({ loaderData: { search: { q: "vacinação", pagina: 2 } } });
    const canonical = result.links?.find((entry) => entry["rel"] === "canonical")?.["href"];

    expect(metaContent(result, "robots")).toBe("noindex, follow");
    expect(canonical).toBe("https://avizee.com.br/conteudos");
  });

  it("absolutiza URLs estruturais dentro do JSON-LD", async () => {
    await productionEnv();
    const { buildMeta } = await import("@/seo/meta");

    const result = buildMeta({
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Produtos", item: "/produtos" },
          ],
        },
      ],
    });

    const block = JSON.parse(result.scripts[0]?.children ?? "{}") as {
      itemListElement?: Array<{ item?: string }>;
    };

    expect(block.itemListElement?.[0]?.item).toBe("https://avizee.com.br/");
    expect(block.itemListElement?.[1]?.item).toBe("https://avizee.com.br/produtos");
  });
});
