import { describe, expect, it } from "vitest";

import {
  contentSecurityPolicy,
  securityHeaders,
  withSecurityHeaders,
} from "@/lib/security-headers";

describe("headers de segurança da Etapa 15", () => {
  it("define as proteções independentes de ambiente", () => {
    const headers = securityHeaders(false);
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("cross-origin-opener-policy")).toBe("same-origin");
    expect(headers.get("permissions-policy")).toContain("camera=()");
    expect(headers.get("permissions-policy")).toContain("geolocation=()");
    expect(headers.get("strict-transport-security")).toBeNull();
  });

  it("ativa HSTS somente em produção", () => {
    expect(securityHeaders(true).get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });

  it("bloqueia framing e objetos na CSP", () => {
    const csp = contentSecurityPolicy(true);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("preserva status e headers funcionais da resposta", async () => {
    const secured = withSecurityHeaders(
      new Response("ok", {
        status: 202,
        headers: { "content-type": "text/plain", "x-existing": "preserved" },
      }),
      false,
    );

    expect(secured.status).toBe(202);
    expect(secured.headers.get("content-type")).toBe("text/plain");
    expect(secured.headers.get("x-existing")).toBe("preserved");
    expect(secured.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await secured.text()).toBe("ok");
  });
});
