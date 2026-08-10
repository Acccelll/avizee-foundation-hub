import { afterEach, describe, expect, it, vi } from "vitest";

import {
  enforceMcpCanonicalOrigin,
  enforceMcpRateLimit,
  isMcpOriginProtectedPath,
  isMcpRequestPath,
  resetLocalMcpRateLimitForTests,
  type McpRateLimitBinding,
} from "@/lib/mcp/rate-limit.server";

afterEach(() => {
  resetLocalMcpRateLimitForTests();
  vi.restoreAllMocks();
});

describe("MCP request boundary", () => {
  it("reconhece somente superfícies de execução MCP para rate limit", () => {
    expect(isMcpRequestPath("/mcp")).toBe(true);
    expect(isMcpRequestPath("/.mcp/list-tools")).toBe(true);
    expect(isMcpRequestPath("/.mcp/invoke-tool/catalog.search")).toBe(true);
    expect(isMcpRequestPath("/mcp-extra")).toBe(false);
    expect(isMcpRequestPath("/produtos")).toBe(false);
    expect(isMcpRequestPath("/.well-known/oauth-protected-resource")).toBe(false);
  });

  it("protege também a origem do endpoint de metadados MCP", () => {
    expect(isMcpOriginProtectedPath("/mcp")).toBe(true);
    expect(isMcpOriginProtectedPath("/.mcp/list-tools")).toBe(true);
    expect(isMcpOriginProtectedPath("/.well-known/oauth-protected-resource")).toBe(true);
    expect(isMcpOriginProtectedPath("/produtos")).toBe(false);
  });

  it("não aplica a validação de origem fora das superfícies MCP", () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://host-nao-canonico.invalid/produtos"),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );
    expect(result).toBeNull();
  });

  it("aceita a origem canônica configurada em produção", () => {
    const result = enforceMcpCanonicalOrigin(new Request("https://avizee.example/mcp"), {
      appEnv: "production",
      publicUrl: "https://avizee.example",
    });
    expect(result).toBeNull();
  });

  it("aceita forwarded host e proto somente quando coerentes com a origem canônica", () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://avizee.example/mcp", {
        headers: {
          "x-forwarded-host": "avizee.example",
          "x-forwarded-proto": "https",
        },
      }),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );
    expect(result).toBeNull();
  });

  it("recusa origem de request divergente mesmo com forwarded host canônico", async () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://host-nao-canonico.invalid/mcp", {
        headers: { "x-forwarded-host": "avizee.example" },
      }),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );

    expect(result?.status).toBe(421);
    await expect(result?.json()).resolves.toEqual({ ok: false, error: "invalid_origin" });
  });

  it("recusa forwarded host divergente mesmo quando a URL do request é canônica", async () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://avizee.example/mcp", {
        headers: { "x-forwarded-host": "host-nao-canonico.invalid" },
      }),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );

    expect(result?.status).toBe(421);
    await expect(result?.json()).resolves.toEqual({ ok: false, error: "invalid_origin" });
  });

  it("recusa forwarded proto não HTTPS em produção", async () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://avizee.example/mcp", {
        headers: { "x-forwarded-proto": "http" },
      }),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );

    expect(result?.status).toBe(421);
    await expect(result?.json()).resolves.toEqual({ ok: false, error: "invalid_origin" });
  });

  it("recusa origem divergente também no metadata endpoint", async () => {
    const result = enforceMcpCanonicalOrigin(
      new Request("https://host-nao-canonico.invalid/.well-known/oauth-protected-resource"),
      { appEnv: "production", publicUrl: "https://avizee.example" },
    );

    expect(result?.status).toBe(421);
    await expect(result?.json()).resolves.toEqual({ ok: false, error: "invalid_origin" });
  });

  it("falha fechado em produção quando a origem canônica não está válida", async () => {
    const result = enforceMcpCanonicalOrigin(new Request("https://avizee.example/mcp"), {
      appEnv: "production",
      publicUrl: "http://avizee.example",
    });

    expect(result?.status).toBe(503);
    await expect(result?.json()).resolves.toEqual({
      ok: false,
      error: "mcp_origin_not_configured",
    });
  });

  it("não interfere em rotas públicas normais", async () => {
    const result = await enforceMcpRateLimit(
      new Request("https://avizee.invalid/produtos"),
      {},
      { appEnv: "production" },
    );
    expect(result).toBeNull();
  });

  it("falha fechado em produção sem binding distribuído", async () => {
    const result = await enforceMcpRateLimit(
      new Request("https://avizee.invalid/mcp"),
      {},
      { appEnv: "production" },
    );

    expect(result?.status).toBe(503);
    expect(result?.headers.get("cache-control")).toContain("no-store");
    await expect(result?.json()).resolves.toEqual({
      ok: false,
      error: "rate_limit_not_configured",
    });
  });

  it("permite quando o binding distribuído aceita a chave", async () => {
    const limit = vi.fn(async () => ({ success: true }));
    const binding: McpRateLimitBinding = { limit };
    const request = new Request("https://avizee.invalid/.mcp/list-tools", {
      headers: { "cf-connecting-ip": "203.0.113.10" },
    });

    const result = await enforceMcpRateLimit(
      request,
      { MCP_RATE_LIMITER: binding },
      { appEnv: "production" },
    );

    expect(result).toBeNull();
    expect(limit).toHaveBeenCalledWith({ key: "ip:203.0.113.10" });
  });

  it("devolve 429 sem vazar a chave quando o limite é excedido", async () => {
    const limit = vi.fn(async () => ({ success: false }));
    const request = new Request("https://avizee.invalid/mcp", {
      headers: {
        "cf-connecting-ip": "203.0.113.11",
        "x-forwarded-for": "198.51.100.9",
      },
    });

    const result = await enforceMcpRateLimit(
      request,
      { MCP_RATE_LIMITER: { limit } },
      { appEnv: "production" },
    );

    expect(result?.status).toBe(429);
    const body = await result?.text();
    expect(body).toContain("rate_limited");
    expect(body).not.toContain("203.0.113.11");
    expect(body).not.toContain("198.51.100.9");
    expect(limit).toHaveBeenCalledWith({ key: "ip:203.0.113.11" });
  });

  it("falha fechado quando o binding distribuído fica indisponível", async () => {
    const limit = vi.fn(async () => {
      throw new Error("provider unavailable");
    });

    const result = await enforceMcpRateLimit(
      new Request("https://avizee.invalid/mcp"),
      { MCP_RATE_LIMITER: { limit } },
      { appEnv: "production" },
    );

    expect(result?.status).toBe(503);
    await expect(result?.json()).resolves.toEqual({
      ok: false,
      error: "rate_limit_unavailable",
    });
  });

  it("mantém fallback local fora de produção", async () => {
    const request = new Request("http://localhost:8080/mcp");
    const result = await enforceMcpRateLimit(request, {}, { appEnv: "test", now: 1_000 });
    expect(result).toBeNull();
  });
});
