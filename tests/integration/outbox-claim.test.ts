/**
 * Etapa 11.1 §9 — claim atômico da outbox em banco real.
 * Verifica que dois workers nunca reivindicam o mesmo evento, que a conclusão
 * exige o claim_token correto e que lease expirado retorna à fila.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { adminClient, assertNonProduction } from "../helpers/db";

const admin = adminClient();
const criados: string[] = [];

async function criarEvento(tipo = "zzt-TEST_MESSAGE", quando = new Date(Date.now() - 1000)) {
  const { data, error } = await admin
    .from("outbox_messages")
    .insert({
      message_type: tipo,
      dedupe_key: `zzt-${crypto.randomUUID()}`,
      payload: { teste: true },
      status: "PENDING",
      next_attempt_at: quando.toISOString(),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const id = (data as { id: string }).id;
  criados.push(id);
  return id;
}

async function estado(id: string) {
  const { data } = await admin
    .from("outbox_messages")
    .select("status, worker_id, claim_token, lease_until, attempts")
    .eq("id", id)
    .single();
  return data as {
    status: string;
    worker_id: string | null;
    claim_token: string | null;
    lease_until: string | null;
    attempts: number;
  };
}

beforeAll(() => assertNonProduction());
afterAll(async () => {
  if (criados.length > 0) await admin.from("outbox_messages").delete().in("id", criados.splice(0));
  await admin.from("outbox_messages").delete().like("dedupe_key", "zzt-%");
});

describe("claim atômico", () => {
  it("marca o evento como PROCESSING com worker, token e lease", async () => {
    const id = await criarEvento();
    const { data, error } = await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-1",
      p_limit: 50,
      p_lease_seconds: 120,
    });
    expect(error).toBeNull();
    const reivindicados = (data ?? []) as { id: string; claim_token: string }[];
    expect(reivindicados.some((r) => r.id === id)).toBe(true);

    const atual = await estado(id);
    expect(atual.status).toBe("PROCESSING");
    expect(atual.worker_id).toBe("zzt-worker-1");
    expect(atual.claim_token).toBeTruthy();
    expect(new Date(atual.lease_until!).getTime()).toBeGreaterThan(Date.now());
  });

  it("dois workers concorrentes nunca reivindicam o mesmo evento", async () => {
    const ids = [await criarEvento(), await criarEvento(), await criarEvento()];

    const [a, b] = await Promise.all([
      admin.rpc("claim_outbox_messages", {
        p_worker_id: "zzt-worker-a",
        p_limit: 50,
        p_lease_seconds: 120,
      }),
      admin.rpc("claim_outbox_messages", {
        p_worker_id: "zzt-worker-b",
        p_limit: 50,
        p_lease_seconds: 120,
      }),
    ]);

    const idsA = ((a.data ?? []) as { id: string }[]).map((r) => r.id).filter((i) => ids.includes(i));
    const idsB = ((b.data ?? []) as { id: string }[]).map((r) => r.id).filter((i) => ids.includes(i));
    const intersecao = idsA.filter((i) => idsB.includes(i));
    expect(intersecao).toHaveLength(0);
    expect(new Set([...idsA, ...idsB]).size).toBe(ids.length);
  });

  it("recusa conclusão com claim_token inválido", async () => {
    const id = await criarEvento();
    await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-x",
      p_limit: 50,
      p_lease_seconds: 120,
    });

    const errado = await admin.rpc("complete_outbox_message", {
      p_id: id,
      p_claim_token: crypto.randomUUID(),
      p_status: "DELIVERED",
      p_attempts: 1,
    });
    expect(errado.data).toBe(false);
    expect((await estado(id)).status).toBe("PROCESSING");
  });

  it("aceita conclusão com o token correto e libera a reserva", async () => {
    const id = await criarEvento();
    const { data } = await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-y",
      p_limit: 50,
      p_lease_seconds: 120,
    });
    const token = ((data ?? []) as { id: string; claim_token: string }[]).find((r) => r.id === id)
      ?.claim_token;
    expect(token).toBeTruthy();

    const ok = await admin.rpc("complete_outbox_message", {
      p_id: id,
      p_claim_token: token,
      p_status: "DELIVERED",
      p_attempts: 1,
    });
    expect(ok.data).toBe(true);
    const atual = await estado(id);
    expect(atual.status).toBe("DELIVERED");
    expect(atual.claim_token).toBeNull();
    expect(atual.lease_until).toBeNull();
  });

  it("reagenda tentativa com backoff sem perder o evento", async () => {
    const id = await criarEvento();
    const { data } = await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-z",
      p_limit: 50,
      p_lease_seconds: 120,
    });
    const token = ((data ?? []) as { id: string; claim_token: string }[]).find((r) => r.id === id)
      ?.claim_token;

    const futuro = new Date(Date.now() + 60_000).toISOString();
    await admin.rpc("complete_outbox_message", {
      p_id: id,
      p_claim_token: token,
      p_status: "RETRY_SCHEDULED",
      p_attempts: 1,
      p_next_attempt_at: futuro,
      p_last_error: "falha simulada do provedor",
    });

    const atual = await estado(id);
    expect(atual.status).toBe("RETRY_SCHEDULED");
    expect(atual.attempts).toBe(1);

    // Ainda não vencido: não deve ser reivindicado agora.
    const novo = await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-w",
      p_limit: 50,
      p_lease_seconds: 120,
    });
    expect(((novo.data ?? []) as { id: string }[]).some((r) => r.id === id)).toBe(false);
  });

  it("recoloca lease vencido na fila (worker interrompido)", async () => {
    const id = await criarEvento();
    await admin.rpc("claim_outbox_messages", {
      p_worker_id: "zzt-worker-morto",
      p_limit: 50,
      p_lease_seconds: 120,
    });
    // Simula worker interrompido: lease vencido.
    await admin
      .from("outbox_messages")
      .update({ lease_until: new Date(Date.now() - 60_000).toISOString() })
      .eq("id", id);

    const liberados = await admin.rpc("release_expired_outbox_leases");
    expect(typeof liberados.data).toBe("number");
    const atual = await estado(id);
    expect(["RETRY_SCHEDULED", "PENDING"]).toContain(atual.status);
    expect(atual.claim_token).toBeNull();
  });

  it("recusa estado inválido na conclusão", async () => {
    const id = await criarEvento();
    const r = await admin.rpc("complete_outbox_message", {
      p_id: id,
      p_claim_token: crypto.randomUUID(),
      p_status: "ENVIADO_DE_QUALQUER_JEITO",
      p_attempts: 1,
    });
    expect(r.error?.message ?? "").toContain("INVALID_OUTBOX_STATUS");
  });
});

describe("compatibilidade de estados entre código e banco (§10)", () => {
  it("o enum do PostgreSQL contém os estados mínimos", async () => {
    const { data, error } = await admin.rpc("schema_readiness");
    expect(error).toBeNull();
    expect((data as Record<string, unknown>)["outbox_states"]).toBe(true);
  });
});
