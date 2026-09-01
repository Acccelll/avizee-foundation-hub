import { beforeEach, describe, expect, it } from "vitest";

import {
  evaluate,
  httpStatusFor,
  readinessBody,
  type ComponentCheck,
} from "../../src/observability/health";
import {
  increment,
  observe,
  resetMetrics,
  sanitizeLabels,
  setGauge,
  snapshot,
} from "../../src/observability/metrics";

describe("health — classificação (Etapa 11 §27)", () => {
  const base: ComponentCheck[] = [
    { name: "application", status: "healthy" },
    { name: "configuration", status: "healthy" },
    { name: "database", status: "healthy" },
    { name: "migrations", status: "healthy" },
  ];

  it("saudável quando todos os componentes críticos estão saudáveis", () => {
    expect(evaluate(base)).toBe("healthy");
  });

  it("degradado quando dependência não crítica falha, sem derrubar o fluxo principal", () => {
    const checks = [...base, { name: "email", status: "unavailable" } as ComponentCheck];
    expect(evaluate(checks)).toBe("degraded");
    expect(httpStatusFor(evaluate(checks))).toBe(200);
  });

  it("indisponível quando o banco está fora", () => {
    const checks = base.map((c) =>
      c.name === "database" ? ({ ...c, status: "unavailable" } as ComponentCheck) : c,
    );
    expect(evaluate(checks)).toBe("unavailable");
    expect(httpStatusFor(evaluate(checks))).toBe(503);
  });

  it("não expõe detalhe interno no corpo de readiness", () => {
    const body = readinessBody(base, "staging");
    const serialized = JSON.stringify(body);
    expect(serialized).not.toMatch(/supabase|postgres|database|migrations|https?:\/\//i);
    expect(Object.keys(body)).toEqual(["status", "environment"]);
  });
});

describe("métricas — sem PII e cardinalidade controlada (Etapa 11 §28)", () => {
  beforeEach(() => resetMetrics());

  it("descarta rótulos não permitidos, incluindo dados pessoais", () => {
    const labels = sanitizeLabels({
      route: "/produtos",
      status: "200",
      // @ts-expect-error rótulo proibido, validado em runtime
      email: "cliente@empresa.com",
      // @ts-expect-error rótulo proibido, validado em runtime
      protocol: "AVZ-2026-ABCD1234",
    });
    expect(labels).toEqual({ route: "/produtos", status: "200" });
  });

  it("acumula contadores, gauges e histogramas por série", () => {
    increment("http_requests_total", { route: "/produtos", status: "200" });
    increment("http_requests_total", { route: "/produtos", status: "200" });
    setGauge("outbox_pending", 3);
    observe("http_request_duration_ms", 120, { route: "/produtos" });
    observe("http_request_duration_ms", 80, { route: "/produtos" });

    const samples = snapshot();
    const counter = samples.find((s) => s.type === "counter");
    const gauge = samples.find((s) => s.type === "gauge");
    const histogram = samples.find((s) => s.type === "histogram");

    expect(counter && counter.type === "counter" && counter.value).toBe(2);
    expect(gauge && gauge.type === "gauge" && gauge.value).toBe(3);
    expect(histogram && histogram.type === "histogram" && histogram.count).toBe(2);
    expect(histogram && histogram.type === "histogram" && histogram.sum).toBe(200);
  });

  it("nenhum rótulo de métrica carrega texto livre longo", () => {
    increment("search_queries_total", { reason: "x".repeat(200) });
    const sample = snapshot()[0];
    expect(sample?.labels["reason"]?.length).toBeLessThanOrEqual(64);
  });
});
