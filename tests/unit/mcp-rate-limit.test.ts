import { afterEach, describe, expect, it, vi } from "vitest";

import {
  enforceMcpRateLimit,
  isMcpRequestPath,
  resetLocalMcpRateLimitForTests,
  type McpRateLimitBinding,
} from "@/lib/mcp/rate-limit.server";

afterEach(() => {
  resetLocalMcpRateLimitForTests();
  vi.restoreAllMocks();
});

describe("MCP rate limit boundary", () => {
  it("reconhece somente superfícies MCP", () => {
    expect(isMcpRequestPath("/mcp")).toBe(true);
    expect(isMcpRequestPath("/.mcp/list-tools")).toBe(true);
    expect(isMcpRequestPath("/.mcp/invoke-tool/catalog.search")).toBe(true);
    expect(isMcpRequestPath("/produtos")).toBe(false);
    expect(isMcpRequestPath("/.well-known/oauth-protected-resource")).toBe(false);
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
