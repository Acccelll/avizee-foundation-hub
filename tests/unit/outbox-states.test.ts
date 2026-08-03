/**
 * Etapa 11.1 §10 — estados da outbox e semântica de entrega.
 */
import { describe, expect, it } from "vitest";

import {
  OUTBOX_DELIVERY_SEMANTICS,
  OUTBOX_REQUIRED_STATUSES,
  OUTBOX_STATUSES,
  OUTBOX_LEASE_SECONDS,
} from "@/quotation/model";
import { backoffFor } from "@/quotation/outbox.server";
import { evaluateSchema, REQUIRED_SCHEMA_CHECKS } from "@/routes/api/public/readiness";

describe("estados da outbox", () => {
  it("contém todos os estados mínimos exigidos", () => {
    for (const required of OUTBOX_REQUIRED_STATUSES) {
      expect(OUTBOX_STATUSES).toContain(required);
    }
  });

  it("declara semântica at-least-once, nunca exactly-once", () => {
    expect(OUTBOX_DELIVERY_SEMANTICS).toBe("AT_LEAST_ONCE+CONSUMIDOR_IDEMPOTENTE");
    expect(OUTBOX_DELIVERY_SEMANTICS).not.toMatch(/exactly/i);
  });

  it("mantém lease positivo e finito", () => {
    expect(OUTBOX_LEASE_SECONDS).toBeGreaterThan(0);
    expect(OUTBOX_LEASE_SECONDS).toBeLessThanOrEqual(600);
  });

  it("aplica backoff crescente por tentativa", () => {
    const t1 = new Date(backoffFor(1)).getTime();
    const t3 = new Date(backoffFor(3)).getTime();
    const t9 = new Date(backoffFor(9)).getTime();
    expect(t3).toBeGreaterThan(t1);
    expect(t9).toBeGreaterThanOrEqual(t3);
  });
});

describe("verificação de migrations (§24)", () => {
  const ok = Object.fromEntries(REQUIRED_SCHEMA_CHECKS.map((k) => [k, true]));

  it("aprova apenas quando a versão esperada e todos os itens conferem", () => {
    expect(evaluateSchema({ expected_version: "11.1", ...ok })).toBe("healthy");
  });

  it("reprova quando falta um item obrigatório", () => {
    expect(
      evaluateSchema({ expected_version: "11.1", ...ok, outbox_claim_columns: false }),
    ).toBe("unavailable");
  });

  it("reprova quando a versão do esquema diverge", () => {
    expect(evaluateSchema({ expected_version: "11.0", ...ok })).toBe("unavailable");
  });

  it("reprova quando não há resposta do banco", () => {
    expect(evaluateSchema(null)).toBe("unavailable");
  });
});
