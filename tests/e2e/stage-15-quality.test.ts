import { describe, expect, it } from "vitest";

const BASE = process.env["E2E_BASE_URL"] ?? "http://localhost:8080";
const PUBLIC_ROUTES = [
  "/",
  "/produtos",
  "/solucoes",
  "/solucoes/vacinacao",
  "/conteudos",
  "/sobre",
  "/contato",
  "/cotacao",
];

async function get(path: string) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const body = await response.text();
  return { response, body };
}

describe("Etapa 15 — segurança HTTP", () => {
  it("aplica headers de segurança na superfície pública", async () => {
    const { response } = await get("/");

    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("cross-origin-opener-policy")).toBe("same-origin");
    expect(response.headers.get("permissions-policy")).toContain("camera=()");

    const csp = response.headers.get("content-security-policy") ?? "";
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});

describe("Etapa 15 — idioma, branding técnico e orçamento HTML", () => {
  it.each(PUBLIC_ROUTES)("%s usa pt-BR e não herda metadata Lovable", async (path) => {
    const { response, body } = await get(path);
    expect(response.status).toBe(200);
    expect(body).toMatch(/<html[^>]+lang=["']pt-BR["']/i);
    expect(body).not.toMatch(/Lovable App|@Lovable|lovable\.app-\d+\.png/i);
  });

  it.each(PUBLIC_ROUTES)("%s mantém HTML inicial dentro de 100 KB", async (path) => {
    const { body } = await get(path);
    expect(Buffer.byteLength(body, "utf8"), `${path} excedeu 100 KB de HTML`).toBeLessThanOrEqual(
      100 * 1024,
    );
  });

  it.each(PUBLIC_ROUTES)("%s mantém um único landmark main", async (path) => {
    const { body } = await get(path);
    expect((body.match(/<main\b/gi) ?? []).length).toBe(1);
  });
});
