import { describe, expect, it } from "vitest";
import { z } from "zod";

import { getFamilyInputSchema } from "../../src/lib/mcp/tools/get-family";
import { searchCatalogInputSchema } from "../../src/lib/mcp/tools/search-catalog";
import { suggestTermsInputSchema } from "../../src/lib/mcp/tools/suggest-terms";

describe("MCP Tools Hardening", () => {
  describe("search_catalog", () => {
    const schema = z.object(searchCatalogInputSchema);

    it("rejeita termos de busca excessivamente longos", () => {
      expect(schema.safeParse({ q: "a".repeat(101) }).success).toBe(false);
    });

    it("rejeita páginas fora do intervalo permitido", () => {
      expect(schema.safeParse({ pagina: 0 }).success).toBe(false);
      expect(schema.safeParse({ pagina: 201 }).success).toBe(false);
    });

    it("aceita consulta pública dentro dos limites", () => {
      expect(schema.safeParse({ q: "agulha", pagina: 1 }).success).toBe(true);
    });
  });

  describe("get_family", () => {
    const schema = z.object(getFamilyInputSchema);

    it("rejeita slugs excessivamente longos", () => {
      expect(
        schema.safeParse({ categoria: "a".repeat(101), familia: "familia-publica" }).success,
      ).toBe(false);
    });

    it("exige os dois slugs públicos", () => {
      expect(schema.safeParse({ categoria: "vacina" }).success).toBe(false);
    });
  });

  describe("suggest_terms", () => {
    const schema = z.object(suggestTermsInputSchema);

    it("rejeita termos menores que dois caracteres", () => {
      expect(schema.safeParse({ q: "a" }).success).toBe(false);
    });

    it("rejeita termos maiores que cinquenta caracteres", () => {
      expect(schema.safeParse({ q: "a".repeat(51) }).success).toBe(false);
    });
  });
});
