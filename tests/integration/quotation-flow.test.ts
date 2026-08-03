/**
 * Etapa 11.1 §8/§17 — cotação: transação, idempotência vinculada ao payload,
 * conflito controlado e concorrência. Banco real, ambiente NÃO produtivo.
 * Todos os dados são sintéticos e removidos ao final.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { adminClient, assertNonProduction } from "../helpers/db";
import { payloadHash } from "@/quotation/payload-hash";

const admin = adminClient();
const criados: string[] = [];

async function produtoPublico() {
  const { data } = await admin
    .from("public_products")
    .select("id, public_sku, public_name, family_id")
    .limit(1)
    .maybeSingle();
  if (!data) throw new Error("Catálogo público sem produtos para o teste.");
  return data as { id: string; public_sku: string; public_name: string; family_id: string };
}


function payloadBase(clientRequestId: string, hash: string, quantidade = 3) {
  return {
    client_request_id: clientRequestId,
    payload_hash: hash,
    company_name: "zzt-Granja Sintética",
    contact_name: "zzt-Contato",
    contact_email: "zzt-contato@teste.avizee.invalid",
    contact_phone: "11900000000",
    city: "Bastos",
    state_uf: "SP",
    message: null,
    preferred_channel: "email",
    ip_hash: null,
    user_agent_hash: null,
    items: [
      {
        product_id: null,
        family_id: null,
        snapshot_sku: "zzt-SKU",
        snapshot_name: "zzt-Item sintético",
        snapshot_variation: null,
        snapshot_family: null,
        snapshot_category: null,
        quantity: quantidade,
        note: null,
        was_available: true,
      },
    ],
    consents: [
      {
        purpose: "Resposta à solicitação de cotação",
        legal_basis: "Procedimentos preliminares a pedido do titular",
        policy_version: "v1-2026-08",
        consent_text: "aviso",
        accepted: true,
      },
      {
        purpose: "Comunicações técnicas e comerciais",
        legal_basis: "Consentimento",
        policy_version: "marketing-v1-2026-08",
        consent_text: "marketing",
        accepted: false,
      },
    ],
  };
}

async function limpar() {
  for (const protocolo of criados.splice(0)) {
    const { data } = await admin.from("quotations").select("id").eq("protocol", protocolo);
    for (const row of data ?? []) {
      const id = (row as { id: string }).id;
      await admin.from("quotation_items").delete().eq("quotation_id", id);
      await admin.from("quotation_sources").delete().eq("quotation_id", id);
      await admin.from("consent_records").delete().eq("quotation_id", id);
      await admin.from("quotation_events").delete().eq("quotation_id", id);
      await admin.from("outbox_messages").delete().eq("quotation_id", id);
      await admin.from("quotations").delete().eq("id", id);
    }
  }
}

beforeAll(() => assertNonProduction());
afterAll(limpar);

describe("registro transacional da cotação", () => {
  it("grava cotação, itens, consentimentos, evento inicial e outbox na mesma operação", async () => {
    const key = crypto.randomUUID();
    const hash = await payloadHash({
      companyName: "zzt",
      contactName: "zzt",
      contactEmail: "zzt@teste.avizee.invalid",
      contactPhone: "11900000000",
      consentMarketing: false,
      items: [{ productId: "a", quantity: 3, note: null }],
    });
    const { data, error } = await admin.rpc("submit_quotation", {
      p: payloadBase(key, hash),
    });
    expect(error).toBeNull();
    const resultado = data as { protocol: string; idempotent: boolean };
    criados.push(resultado.protocol);

    expect(resultado.idempotent).toBe(false);
    expect(resultado.protocol).toMatch(/^AVZ-\d{4}-[A-Z0-9]{8}$/);

    const { data: cotacao } = await admin
      .from("quotations")
      .select("id, payload_hash, item_count")
      .eq("protocol", resultado.protocol)
      .single();
    expect((cotacao as { payload_hash: string }).payload_hash).toBe(hash);
    expect((cotacao as { item_count: number }).item_count).toBe(1);

    const id = (cotacao as { id: string }).id;
    const consentimentos = await admin
      .from("consent_records")
      .select("legal_basis, accepted")
      .eq("quotation_id", id);
    expect(consentimentos.data).toHaveLength(2);
    // Marketing recusado não impede o registro da cotação.
    expect(
      (consentimentos.data ?? []).some(
        (c) => (c as { legal_basis: string }).legal_basis === "Consentimento" && !(c as { accepted: boolean }).accepted,
      ),
    ).toBe(true);

    const outbox = await admin
      .from("outbox_messages")
      .select("status, dedupe_key")
      .eq("quotation_id", id);
    expect(outbox.data).toHaveLength(2);
    for (const row of outbox.data ?? []) {
      expect((row as { status: string }).status).toBe("PENDING");
      expect((row as { dedupe_key: string }).dedupe_key).toBeTruthy();
    }
  });

  it("nunca grava preço, total, frete ou prazo (R-03/R-04/R-11)", async () => {
    const colunas = await admin.from("quotations").select("*").limit(1);
    const chaves = Object.keys((colunas.data ?? [{}])[0] ?? {});
    for (const proibida of ["price", "total", "amount", "shipping", "freight", "deadline"]) {
      expect(chaves.join(",")).not.toContain(proibida);
    }
  });
});

describe("idempotência vinculada ao payload (§8)", () => {
  it("mesma chave + mesmo payload devolve o mesmo protocolo, sem duplicar", async () => {
    const key = crypto.randomUUID();
    const hash = "a".repeat(64);
    const primeiro = await admin.rpc("submit_quotation", { p: payloadBase(key, hash) });
    const protocolo = (primeiro.data as { protocol: string }).protocol;
    criados.push(protocolo);

    const segundo = await admin.rpc("submit_quotation", { p: payloadBase(key, hash) });
    const repetido = segundo.data as { protocol: string; idempotent: boolean };
    expect(repetido.protocol).toBe(protocolo);
    expect(repetido.idempotent).toBe(true);

    const { count } = await admin
      .from("quotations")
      .select("id", { count: "exact", head: true })
      .eq("client_request_id", key);
    expect(count).toBe(1);

    const { data: cot } = await admin
      .from("quotations")
      .select("id")
      .eq("protocol", protocolo)
      .single();
    const outbox = await admin
      .from("outbox_messages")
      .select("id", { count: "exact", head: true })
      .eq("quotation_id", (cot as { id: string }).id);
    expect(outbox.count).toBe(2);
  });

  it("mesma chave + payload diferente é recusada com conflito controlado", async () => {
    const key = crypto.randomUUID();
    const primeiro = await admin.rpc("submit_quotation", { p: payloadBase(key, "b".repeat(64)) });
    const protocolo = (primeiro.data as { protocol: string }).protocol;
    criados.push(protocolo);

    const conflito = await admin.rpc("submit_quotation", {
      p: payloadBase(key, "c".repeat(64), 9),
    });
    expect(conflito.error?.message ?? "").toContain("IDEMPOTENCY_CONFLICT");

    // A cotação existente não foi alterada.
    const { data: cot } = await admin
      .from("quotations")
      .select("payload_hash, item_count")
      .eq("protocol", protocolo)
      .single();
    expect((cot as { payload_hash: string }).payload_hash).toBe("b".repeat(64));
    expect((cot as { item_count: number }).item_count).toBe(1);
  });

  it("requisições concorrentes idênticas criam uma única cotação", async () => {
    const key = crypto.randomUUID();
    const hash = "d".repeat(64);
    const resultados = await Promise.all(
      Array.from({ length: 4 }, () => admin.rpc("submit_quotation", { p: payloadBase(key, hash) })),
    );
    const protocolos = new Set(
      resultados.map((r) => (r.data as { protocol?: string } | null)?.protocol).filter(Boolean),
    );
    expect(protocolos.size).toBe(1);
    const protocolo = [...protocolos][0] as string;
    criados.push(protocolo);

    for (const r of resultados) {
      // Nenhuma requisição concorrente pode falhar com erro interno genérico.
      expect(r.error).toBeNull();
    }

    const { count } = await admin
      .from("quotations")
      .select("id", { count: "exact", head: true })
      .eq("client_request_id", key);
    expect(count).toBe(1);

    const { data: cot } = await admin
      .from("quotations")
      .select("id")
      .eq("protocol", protocolo)
      .single();
    const outbox = await admin
      .from("outbox_messages")
      .select("id", { count: "exact", head: true })
      .eq("quotation_id", (cot as { id: string }).id);
    expect(outbox.count).toBe(2);
  });

  it("recusa lista vazia", async () => {
    const vazio = { ...payloadBase(crypto.randomUUID(), "e".repeat(64)), items: [] };
    const r = await admin.rpc("submit_quotation", { p: vazio });
    expect(r.error?.message ?? "").toContain("INVALID_ITEMS");
  });
});

describe("catálogo público continua íntegro para reconciliação", () => {
  it("expõe produto público com família associada", async () => {
    const produto = await produtoPublico();
    expect(produto.public_sku).toBeTruthy();
    expect(produto.family_id).toBeTruthy();
  });
});
