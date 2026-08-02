import { describe, expect, it } from "vitest";

import {
  CONTACT_FIELDS,
  CONTACT_FORM_APPROVED,
  CTA,
  DIFFERENTIATORS,
  LEGAL_DOCUMENTS,
  LEGAL_FIELDS,
  MAP_APPROVED,
  MISSION_VISION_VALUES_APPROVED,
  PENDING,
  POSITIONING,
  PUBLISHED_ARTICLES,
  QUOTATION_STEPS,
  SOLUTION_DETAIL_PAGES_APPROVED,
} from "@/content/institutional";

/** Vocabulário proibido (doc 05 + R-03/R-04/R-11). */
const FORBIDDEN = [
  "comprar",
  "carrinho",
  "finalizar compra",
  "preço",
  "r$",
  "frete",
  "pronta-entrega",
  "pronta entrega",
  "em estoque",
  "estoque disponível",
  "promoção",
  "desconto",
  "parcelamos",
  "entrega imediata",
  "entrega rápida",
  "melhor preço",
  "ver ofertas",
  "comprar agora",
];

const ALL_TEXT = JSON.stringify({
  POSITIONING,
  DIFFERENTIATORS,
  QUOTATION_STEPS,
  CTA,
}).toLowerCase();

// Os títulos das seções legais NEGAM e-commerce ("sem preço", "ausência de pedido
// confirmado"); por isso são verificados à parte, não pelo filtro de vocabulário.
const LEGAL_TEXT = JSON.stringify(LEGAL_DOCUMENTS).toLowerCase();

describe("conteúdo institucional (Etapa 9)", () => {
  it("não usa vocabulário de e-commerce nem promessa logística", () => {
    for (const term of FORBIDDEN) {
      expect(ALL_TEXT.includes(term), `termo proibido presente: ${term}`).toBe(false);
    }
  });

  it("não publica prazo comercial (O-10 em aberto)", () => {
    expect(/em at[ée] \d/.test(ALL_TEXT)).toBe(false);
    expect(/\d+\s*(h|horas|dias|úteis)/.test(ALL_TEXT)).toBe(false);
  });

  it("não contém número institucional, ano de fundação ou certificação não comprovada", () => {
    expect(/fundad|desde \d{4}|\d{4}\s*clientes|iso \d/.test(ALL_TEXT)).toBe(false);
  });

  it("mantém o posicionamento aprovado sem ampliar o escopo", () => {
    expect(POSITIONING.statement).toContain("avicultura");
    expect(ALL_TEXT.includes("agronegócio")).toBe(false);
    expect(ALL_TEXT.includes("consumidor final")).toBe(false);
    expect(ALL_TEXT.includes("marketplace")).toBe(false);
  });

  it("usa exatamente os três diferenciais aprovados", () => {
    expect(DIFFERENTIATORS.map((d) => d.title)).toEqual([
      "Variedade especializada",
      "Atendimento ágil",
      "Atendimento consultivo",
    ]);
  });

  it("descreve a cotação em três passos, sem pedido confirmado", () => {
    expect(QUOTATION_STEPS).toHaveLength(3);
    expect(LEGAL_TEXT).toContain("ausência de pedido confirmado");
  });

  it("usa apenas CTAs aprovados", () => {
    expect(Object.values(CTA)).toEqual([
      "Conhecer produtos",
      "Solicitar cotação",
      "Falar com a equipe",
    ]);
  });

  it("não publica dado de contato ou dado legal não confirmado", () => {
    for (const field of [...CONTACT_FIELDS, ...LEGAL_FIELDS]) {
      expect(field.status).toBe(PENDING);
    }
    expect(CONTACT_FIELDS.map((f) => f.label)).toEqual([
      "Telefone",
      "WhatsApp",
      "E-mail",
      "Endereço",
      "Horário de atendimento",
    ]);
  });

  it("mantém desativado tudo que depende de decisão aberta", () => {
    expect(MISSION_VISION_VALUES_APPROVED).toBe(false);
    expect(SOLUTION_DETAIL_PAGES_APPROVED).toBe(false);
    expect(CONTACT_FORM_APPROVED).toBe(false);
    expect(MAP_APPROVED).toBe(false);
    expect(PUBLISHED_ARTICLES).toBe(0);
  });

  it("mantém as páginas legais como rascunho sem vigência", () => {
    for (const doc of Object.values(LEGAL_DOCUMENTS)) {
      expect(doc.status).toBe("RASCUNHO");
      expect(doc.effectiveDate).toBeNull();
      expect(doc.sections.length).toBeGreaterThan(3);
    }
  });
});
