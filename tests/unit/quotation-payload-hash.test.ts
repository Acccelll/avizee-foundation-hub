/**
 * Etapa 11.1 §8 — hash canônico do payload da cotação.
 * Módulo puro: sem rede, sem banco, sem segredo.
 */
import { describe, expect, it } from "vitest";

import { canonicalPayload, payloadHash, VOLATILE_FIELDS } from "@/quotation/payload-hash";

const base = {
  companyName: "Granja Modelo LTDA",
  contactName: "Maria Souza",
  contactEmail: "Contato@Granja.Invalid",
  contactPhone: "(11) 98888-7777",
  city: "Bastos",
  stateUf: "SP",
  message: "Precisamos de proposta técnica.",
  preferredChannel: "email",
  consentMarketing: false,
  items: [
    { productId: "11111111-1111-4111-8111-111111111111", quantity: 2, note: "  granulado " },
    { productId: "22222222-2222-4222-8222-222222222222", quantity: 5, note: null },
  ],
};

describe("hash canônico do payload", () => {
  it("é determinístico para o mesmo conteúdo", async () => {
    expect(await payloadHash(base)).toBe(await payloadHash({ ...base }));
  });

  it("independe da ordem dos itens", async () => {
    const invertido = { ...base, items: [...base.items].reverse() };
    expect(await payloadHash(invertido)).toBe(await payloadHash(base));
  });

  it("normaliza caixa, espaços e formatação de telefone", async () => {
    const variante = {
      ...base,
      companyName: "  granja   modelo ltda ",
      contactEmail: "contato@granja.invalid",
      contactPhone: "11988887777",
    };
    expect(await payloadHash(variante)).toBe(await payloadHash(base));
  });

  it("muda quando a quantidade muda", async () => {
    const alterado = {
      ...base,
      items: [{ ...base.items[0]!, quantity: 3 }, base.items[1]!],
    };
    expect(await payloadHash(alterado)).not.toBe(await payloadHash(base));
  });

  it("muda quando a observação muda", async () => {
    const alterado = {
      ...base,
      items: [{ ...base.items[0]!, note: "outra observação" }, base.items[1]!],
    };
    expect(await payloadHash(alterado)).not.toBe(await payloadHash(base));
  });

  it("muda quando o consentimento de marketing muda", async () => {
    expect(await payloadHash({ ...base, consentMarketing: true })).not.toBe(
      await payloadHash(base),
    );
  });

  it("não inclui campos voláteis na forma canônica", () => {
    const canonical = canonicalPayload(base);
    for (const field of VOLATILE_FIELDS) {
      expect(canonical).not.toContain(field);
    }
  });

  it("produz digest hexadecimal de 64 caracteres", async () => {
    expect(await payloadHash(base)).toMatch(/^[0-9a-f]{64}$/);
  });
});
