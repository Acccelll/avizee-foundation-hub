import { describe, expect, it } from "vitest";

import { normalizeClientPublicUrl, toAbsolutePublicUrl } from "@/lib/env";
import { catalogCanonical, isCatalogFiltered } from "@/seo/catalog-meta";

describe("SEO absoluto da Etapa 15", () => {
  it("normaliza a origem pública cliente sem query, hash ou credenciais", () => {
    expect(normalizeClientPublicUrl("https://avizee.com.br/")).toBe("https://avizee.com.br");
    expect(normalizeClientPublicUrl("https://avizee.com.br/site/")).toBe(
      "https://avizee.com.br/site",
    );
    expect(normalizeClientPublicUrl("https://avizee.com.br/?utm=x")).toBeNull();
    expect(normalizeClientPublicUrl("javascript:alert(1)")).toBeNull();
  });

  it("converte caminhos canônicos em URLs absolutas", () => {
    expect(toAbsolutePublicUrl("/produtos?pagina=2", "https://avizee.com.br")).toBe(
      "https://avizee.com.br/produtos?pagina=2",
    );
  });
});

describe("canonical do catálogo", () => {
  it("mantém canonical próprio para paginação sem filtros", () => {
    expect(catalogCanonical({ pagina: 2 })).toBe("/produtos?pagina=2");
    expect(catalogCanonical({ pagina: 8, ordem: "name" })).toBe("/produtos?pagina=8");
  });

  it("canonicaliza filtros para a raiz e os marca como filtrados", () => {
    const search = { categoria: "vacinacao", pagina: 2 };
    expect(isCatalogFiltered(search)).toBe(true);
    expect(catalogCanonical(search)).toBe("/produtos");
  });

  it("mantém a raiz para catálogo sem filtro e para ordenação isolada", () => {
    expect(catalogCanonical({})).toBe("/produtos");
    expect(catalogCanonical({ ordem: "name" })).toBe("/produtos");
  });
});
