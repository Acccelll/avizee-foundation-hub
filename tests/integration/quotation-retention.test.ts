import { afterAll, describe, expect, it } from "vitest";

import { adminClient } from "../helpers/db";

const createdQuotationIds: string[] = [];

function oldDate(months: number) {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - months);
  return date.toISOString();
}

async function createQuotation(status: "CLOSED" | "CONVERTED") {
  const admin = adminClient();
  const id = crypto.randomUUID();
  const protocol = `AVZ-ZZT-RET-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  const { error } = await admin.from("quotations").insert({
    id,
    protocol,
    client_request_id: crypto.randomUUID(),
    status,
    company_name: "Empresa sintética retenção",
    contact_name: "Pessoa sintética retenção",
    contact_email: "retencao@teste.avizee.invalid",
    contact_phone: "(00) 00000-0000",
    city: "Cidade Teste",
    state_uf: "SP",
    message: "Mensagem sintética que deve ser removida.",
    preferred_channel: "email",
    last_event_at: oldDate(25),
    ip_hash: "hash-sintetico-ip",
    user_agent_hash: "hash-sintetico-ua",
  });
  if (error) throw new Error(error.message);

  createdQuotationIds.push(id);
  return { id, protocol };
}

afterAll(async () => {
  const admin = adminClient();
  for (const id of createdQuotationIds) {
    await admin.from("consent_records").delete().eq("quotation_id", id);
    await admin.from("quotation_sources").delete().eq("quotation_id", id);
    await admin.from("quotation_items").delete().eq("quotation_id", id);
    await admin.from("outbox_messages").delete().eq("quotation_id", id);
    await admin.from("quotations").delete().eq("id", id);
  }
});

describe("retenção de cotações/leads", () => {
  it("anonimiza lead terminal após 24 meses e preserva o snapshot técnico", async () => {
    const admin = adminClient();
    const quotation = await createQuotation("CLOSED");

    const item = await admin.from("quotation_items").insert({
      quotation_id: quotation.id,
      snapshot_sku: "ZZT-RET-01",
      snapshot_name: "Produto sintético",
      snapshot_variation: "Variação teste",
      snapshot_family: "Família teste",
      snapshot_category: "Categoria teste",
      quantity: 2,
      note: "Observação livre que deve ser removida.",
      was_available: true,
      position: 1,
    });
    expect(item.error).toBeNull();

    const source = await admin.from("quotation_sources").insert({
      quotation_id: quotation.id,
      origin_page: "/produtos",
      referrer: "https://referencia.invalid/com-identificador",
      utm_source: "teste",
    });
    expect(source.error).toBeNull();

    const consent = await admin.from("consent_records").insert({
      quotation_id: quotation.id,
      subject_email: "retencao@teste.avizee.invalid",
      purpose: "quotation",
      legal_basis: "pre_contractual",
      policy_version: "test",
      consent_text: "Registro sintético de teste.",
      accepted: true,
    });
    expect(consent.error).toBeNull();

    const cutoff = oldDate(24);
    const { data, error } = await admin.rpc("anonymize_expired_quotations", {
      p_before: cutoff,
      p_limit: 20,
    });
    expect(error).toBeNull();
    expect((data ?? []).some((row: { id: string }) => row.id === quotation.id)).toBe(true);

    const { data: stored } = await admin
      .from("quotations")
      .select(
        "company_name,contact_name,contact_email,contact_phone,message,preferred_channel,ip_hash,user_agent_hash,anonymized_at,city,state_uf",
      )
      .eq("id", quotation.id)
      .single();

    expect(stored).toMatchObject({
      company_name: "[ANONIMIZADO]",
      contact_name: "[ANONIMIZADO]",
      contact_email: "",
      contact_phone: "",
      message: null,
      preferred_channel: null,
      ip_hash: null,
      user_agent_hash: null,
      city: "Cidade Teste",
      state_uf: "SP",
    });
    expect(stored?.anonymized_at).toBeTruthy();

    const { data: storedItem } = await admin
      .from("quotation_items")
      .select("snapshot_sku,snapshot_name,quantity,note")
      .eq("quotation_id", quotation.id)
      .single();
    expect(storedItem).toMatchObject({
      snapshot_sku: "ZZT-RET-01",
      snapshot_name: "Produto sintético",
      quantity: 2,
      note: null,
    });

    const { data: storedSource } = await admin
      .from("quotation_sources")
      .select("origin_page,referrer,utm_source")
      .eq("quotation_id", quotation.id)
      .single();
    expect(storedSource).toMatchObject({
      origin_page: "/produtos",
      referrer: null,
      utm_source: "teste",
    });

    const { data: storedConsent } = await admin
      .from("consent_records")
      .select("subject_email,purpose")
      .eq("quotation_id", quotation.id)
      .single();
    expect(storedConsent).toMatchObject({ subject_email: null, purpose: "quotation" });
  });

  it("não anonimiza cotação convertida, mesmo antiga", async () => {
    const admin = adminClient();
    const quotation = await createQuotation("CONVERTED");

    const { error } = await admin.rpc("anonymize_expired_quotations", {
      p_before: oldDate(24),
      p_limit: 20,
    });
    expect(error).toBeNull();

    const { data } = await admin
      .from("quotations")
      .select("contact_email,anonymized_at")
      .eq("id", quotation.id)
      .single();
    expect(data?.contact_email).toBe("retencao@teste.avizee.invalid");
    expect(data?.anonymized_at).toBeNull();
  });
});
