/**
 * Etapa 11 §23/§27 — health, readiness e métricas de processo.
 */
import { beforeEach, describe, expect, it } from "vitest";

import {
  evaluate,
  httpStatusFor,
  publicBody,
  readinessBody,
  type ComponentCheck,
} from "@/observability/health";
import { increment, metricsSnapshot, resetMetricsForTests } from "@/observability/metrics";
import { evaluateSchema, REQUIRED_SCHEMA_CHECKS } from "@/routes/api/public/readiness";

const criticalHealthy: ComponentCheck[] = [
  { name: "application", status: "healthy" },
  { name: "configuration", status: "healthy" },
  { name: "database", status: "healthy" },
  { name: "migrations", status: "healthy" },
];

describe("health/readiness", () => {
  it("considera indisponível quando um componente crítico falha", () => {
    const status = evaluate([
      ...criticalHealthy.filter((c) => c.name !== "database"),
      { name: "database", status: "unavailable" },
      { name: "email", status: "degraded" },
    ]);
    expect(status).toBe("unavailable");
    expect(httpStatusFor(status)).toBe(503);
  });

  it("considera degradado quando só dependência não crítica falha", () => {
    const status = evaluate([...criticalHealthy, { name: "email", status: "degraded" }]);
    expect(status).toBe("degraded");
    expect(httpStatusFor(status)).toBe(200);
  });

  it("publica apenas estado agregado e ambiente", () => {
    expect(publicBody("healthy", "production")).toEqual({
      status: "healthy",
      environment: "production",
    });
    const body = readinessBody(
      [...criticalHealthy, { name: "email", status: "degraded" }],
      "production",
    );
    expect(Object.keys(body)).toEqual(["status", "environment"]);
    expect(body.status).toBe("degraded");
    expect(JSON.stringify(body)).not.toMatch(/database|migrations|email/i);
  });

  it("valida todas as invariantes do esquema", () => {
    const valid: Record<string, unknown> = { expected_version: "11.1" };
    for (const k of REQUIRED_SCHEMA_CHECKS) valid[k] = true;
    expect(evaluateSchema(valid)).toBe("healthy");

    const invalid = { ...valid, quotations_rls: false };
    expect(evaluateSchema(invalid)).toBe("unavailable");
    expect(evaluateSchema(null)).toBe("unavailable");
  });
});

describe("métricas", () => {
  beforeEach(() => resetMetricsForTests());

  it("incrementa contadores com labels canônicos e exporta Prometheus", () => {
    increment("quotation_failures_total", { reason: "validation" });
    increment("quotation_failures_total", { reason: "validation" }, 2);
    increment("outbox_processed_total", { status: "sent", type: "confirmation" });
    const text = metricsSnapshot();
    expect(text).toContain('quotation_failures_total{reason="validation"} 3');
    expect(text).toContain('outbox_processed_total{status="sent",type="confirmation"} 1');
  });

  it("escapa valores de label e rejeita quantidade inválida", () => {
    increment("quotation_failures_total", { reason: 'a"b\\c\n' });
    expect(metricsSnapshot()).toContain('reason="a\\"b\\\\c\\n"');
    expect(() => increment("x", {}, -1)).toThrow();
  });
});
