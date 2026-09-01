import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("regressões de acessibilidade WCAG 2.2 AA", () => {
  it("não usa aria-pressed em links de filtro e expõe o estado atual como navegação", () => {
    const filterPanel = source("src/components/public/catalog/FilterPanel.tsx");

    expect(filterPanel).not.toContain("aria-pressed={active}");
    expect(filterPanel).toContain('aria-current={active ? "true" : undefined}');
  });

  it("não usa aria-pressed nos links de ordenação do catálogo", () => {
    const catalogRoute = source("src/routes/produtos/index.tsx");

    expect(catalogRoute).not.toContain("aria-pressed={");
    expect(catalogRoute).toContain("aria-current={");
  });

  it("mantém opções do combobox sem controles interativos aninhados", () => {
    const searchBox = source("src/components/public/catalog/SearchBox.tsx");

    expect(searchBox).not.toMatch(/role="option"[\s\S]{0,400}<button/);
    expect(searchBox).toContain('role="option"');
    expect(searchBox).toContain("aria-selected={index === active}");
  });

  it("anuncia a adição de uma variação à lista de cotação em live region", () => {
    const variationTable = source("src/components/public/catalog/VariationTable.tsx");

    expect(variationTable).toContain("quoteAnnouncement");
    expect(variationTable).toContain('aria-live="polite"');
    expect(variationTable).toContain('aria-atomic="true"');
  });

  it("fecha o menu mobile com Escape", () => {
    const shell = source("src/components/public/PublicShell.tsx");

    expect(shell).toContain('event.key === "Escape"');
    expect(shell).toContain("setOpen(false)");
  });
});
