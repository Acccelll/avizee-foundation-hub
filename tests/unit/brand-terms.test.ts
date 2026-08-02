/**
 * FASE C — detecção de marcas de terceiros (R-05).
 */
import { describe, expect, it } from "vitest";
import { assertNoBrandInPublicFields, BRAND_TERMS, checkBrandTerms } from "@/catalog/brand-terms";

describe("detecção de marca", () => {
  it("detecta termo exato", () => {
    expect(checkBrandTerms("Aplicador walmur").clean).toBe(false);
  });

  it("é insensível a caixa", () => {
    expect(checkBrandTerms("APLICADOR WALMUR").matches).toContain("walmur");
    expect(checkBrandTerms("Walmur").matches).toContain("walmur");
  });

  it("ignora acentuação", () => {
    expect(checkBrandTerms("seringa sócorex").matches).toContain("socorex");
  });

  it("detecta termo separado por hífen ou espaço", () => {
    expect(checkBrandTerms("bico-ecomatic").clean).toBe(false);
    expect(checkBrandTerms("bico eco matic").clean).toBe(false);
  });

  it("detecta em texto longo e múltiplos termos", () => {
    const check = checkBrandTerms("Seringa socorex compatível com bico ecovet");
    expect(check.matches.sort()).toEqual(["ecovet", "socorex"]);
  });

  it("não gera falso positivo em coincidência parcial", () => {
    expect(checkBrandTerms("walmura").clean).toBe(true);
    expect(checkBrandTerms("idealizado").clean).toBe(true);
    expect(checkBrandTerms("prematuro").clean).toBe(true);
  });

  it("não detecta plural colado (limitação conhecida, exige revisão humana)", () => {
    // Documentado em 181: a detecção automática é auxiliar, não substitui revisão.
    expect(checkBrandTerms("walmurs").clean).toBe(true);
  });

  it("trata valor nulo ou vazio como limpo", () => {
    expect(checkBrandTerms(null).clean).toBe(true);
    expect(checkBrandTerms("").clean).toBe(true);
  });

  it("cobre toda a lista de termos", () => {
    for (const term of BRAND_TERMS) {
      expect(checkBrandTerms(`produto ${term} teste`).clean).toBe(false);
    }
  });
});

describe("campos públicos", () => {
  it("acusa marca em campo público", () => {
    const problems = assertNoBrandInPublicFields({
      public_name: "Bico walmur",
      public_description: "linha kaeso",
    });
    expect(problems).toHaveLength(2);
  });

  it("permite marca em campo interno", () => {
    const problems = assertNoBrandInPublicFields({
      public_name: "Bico pulverizador cônico",
      internal_brand: "walmur",
      internal_notes: "fornecedor kaeso",
    });
    expect(problems).toEqual([]);
  });

  it("ignora campos não textuais", () => {
    expect(assertNoBrandInPublicFields({ public_name: 42 as unknown as string })).toEqual([]);
  });
});
