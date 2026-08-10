/**
 * FASE F — superfícies HTTP servidas pela aplicação (dev server).
 * Verifica indexação, saúde, proteção do painel e ausência de vazamento no HTML.
 */
import { describe, expect, it } from "vitest";
import { BRAND_TERMS } from "@/catalog/brand-terms";

const BASE = process.env["E2E_BASE_URL"] ?? "http://localhost:8080";

async function get(path: string) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const body = await response.text();
  return { response, body };
}

async function post(path: string, headers?: HeadersInit) {
  const response = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    redirect: "manual",
  });
  const body = await response.text();
  return { response, body };
}

const PUBLIC_ROUTES = [
  "/",
  "/produtos",
  "/solucoes",
  "/conteudos",
  "/sobre",
  "/contato",
  "/cotacao",
  "/politica-de-privacidade",
  "/termos-de-uso",
];

describe("saúde e indexação", () => {
  it("health responde sem revelar detalhes internos", async () => {
    const { response, body } = await get("/api/public/health");
    expect(response.status).toBe(200);
    const json = JSON.parse(body) as Record<string, unknown>;
    expect(json["status"]).toBe("ok");
    expect((json["checks"] as Record<string, string>)["database"]).toBe("ok");
    expect(body).not.toMatch(/supabase\.co|postgres|service_role|password/i);
  });

  it("robots bloqueia indexação enquanto o site não é público", async () => {
    const { response, body } = await get("/robots.txt");
    expect(response.status).toBe(200);
    expect(body).toContain("Disallow: /");
  });
});

describe("rotas internas protegidas", () => {
  it("worker de retenção recusa requisição sem credencial e não vaza configuração", async () => {
    const { response, body } = await post("/api/internal/quotation-retention");
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body).toContain("unauthorized");
    expect(body).not.toMatch(/RETENTION_WORKER_SECRET|service_role|sb_secret|postgres/i);
  });
});

describe("rotas públicas", () => {
  it.each(PUBLIC_ROUTES)("%s responde 200 com título próprio", async (path) => {
    const { response, body } = await get(path);
    expect(response.status).toBe(200);
    const title = /<title>([^<]*)<\/title>/.exec(body)?.[1] ?? "";
    expect(title.length).toBeGreaterThan(5);
    expect(title).not.toMatch(/Lovable/i);
  });

  it("nenhuma rota pública expõe marca de terceiro ou segredo", async () => {
    for (const path of PUBLIC_ROUTES) {
      const { body } = await get(path);
      const lower = body.toLowerCase();
      for (const termo of BRAND_TERMS) {
        expect(lower, `${path} expõe ${termo}`).not.toContain(termo.toLowerCase());
      }
      expect(lower, `${path} expõe chave de serviço`).not.toContain("service_role");
      expect(lower).not.toContain("sb_secret");
      expect(lower).not.toMatch(/internal_brand|internal_notes|supplier_reference/);
    }
  });

  it("página inexistente não vaza stack trace", async () => {
    const { body } = await get("/rota-que-nao-existe-zzt");
    expect(body).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(body.toLowerCase()).not.toContain("service_role");
  });
});

describe("painel administrativo", () => {
  it("a área protegida não entrega conteúdo administrativo sem sessão", async () => {
    const { body } = await get("/admin");
    expect(body.toLowerCase()).not.toContain("importação controlada");
    expect(body.toLowerCase()).not.toContain("service_role");
  });

  it("a tela de login existe e não é indexável", async () => {
    const { response, body } = await get("/admin/login");
    expect(response.status).toBe(200);
    expect(body).toMatch(/noindex/i);
  });
});

/** Etapa 9 — camada institucional pública. */
describe("páginas institucionais", () => {
  const ECOMMERCE = [
    "comprar agora",
    "adicionar ao carrinho",
    "finalizar compra",
    "ver ofertas",
    "pronta-entrega",
    "frete grátis",
    "r$&nbsp;",
  ];

  it("Home entrega os blocos aprovados na ordem do wireframe", async () => {
    const { body } = await get("/");
    for (const heading of [
      "Nossas categorias",
      "Soluções por necessidade",
      "Por que a AviZee",
      "Como funciona a cotação",
      "Atendimento em todo o Brasil",
      "Pronto para montar sua cotação?",
    ]) {
      expect(body, `bloco ausente: ${heading}`).toContain(heading);
    }
  });

  it("Home, Sobre, Soluções e Contato não usam vocabulário de e-commerce", async () => {
    for (const path of ["/", "/sobre", "/solucoes", "/contato"]) {
      const lower = (await get(path)).body.toLowerCase();
      for (const term of ECOMMERCE) {
        expect(lower, `${path} contém "${term}"`).not.toContain(term);
      }
    }
  });

  it("Contato publica apenas os dados confirmados e não carrega mapa automaticamente", async () => {
    const { body } = await get("/contato");
    expect(body).toContain("(19) 99898-2930");
    expect(body).toContain("comercial@avizee.com.br");
    expect(body).toContain("Rua Diogo António Feijó, 111");
    expect(body).toContain("13145-706");
    expect(body).toContain("Seg - Sáb, 08h - 18h");
    expect(body).not.toMatch(/google\.com\/maps|maps\.googleapis|embedsocial/i);
    expect(body).not.toMatch(/wa\.me\/\d/);
  });

  it("páginas legais em rascunho não são indexáveis", async () => {
    for (const path of ["/politica-de-privacidade", "/termos-de-uso"]) {
      const { body } = await get(path);
      expect(body).toContain("RASCUNHO");
      expect(body).toMatch(/name="robots" content="noindex/);
    }
  });

  it("Sobre não publica missão, visão, valores nem história não aprovada", async () => {
    const { body } = await get("/sobre");
    expect(body).not.toMatch(/Nossa missão|Nossa visão|Fundada em|desde 19|desde 20/i);
  });
});
