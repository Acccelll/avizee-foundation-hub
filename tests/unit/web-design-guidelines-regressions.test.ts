import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("regressões aprovadas do web-design-guidelines — Rodada 3", () => {
  it("não dispara autofocus nativo indiscriminadamente em mobile", () => {
    const searchBox = source("src/components/public/catalog/SearchBox.tsx");

    expect(searchBox).not.toContain("autoFocus={autoFocusOnMount}");
    expect(searchBox).toContain("window.matchMedia");
  });

  it("configura autocomplete e placeholder da busca conforme a guideline", () => {
    const searchBox = source("src/components/public/catalog/SearchBox.tsx");

    expect(searchBox).toContain('autoComplete="off"');
    expect(searchBox).toContain("referência (ex.: AG011)…");
  });

  it("mantém name significativo em todos os controles públicos da cotação", () => {
    const quoteForm = source("src/components/public/quotation/QuoteForm.tsx");

    for (const name of [
      "contactName",
      "contactEmail",
      "contactPhone",
      "city",
      "stateUf",
      "preferredChannel",
      "message",
      "consentMarketing",
    ]) {
      expect(quoteForm).toContain(`name="${name}"`);
    }
  });

  it("usa reticência tipográfica e spinner sem alterar a largura do botão de envio", () => {
    const quoteForm = source("src/components/public/quotation/QuoteForm.tsx");

    expect(quoteForm).toContain("Enviando…");
    expect(quoteForm).toContain("animate-spin");
    expect(quoteForm).toContain("invisible");
  });

  it("declara dimensões intrínsecas nas imagens dos cards", () => {
    const familyCard = source("src/components/public/catalog/FamilyCard.tsx");
    const articleCard = source("src/components/public/content/ArticleCard.tsx");

    expect(familyCard).toContain("width={800}");
    expect(familyCard).toContain("height={600}");
    expect(articleCard).toContain("width={960}");
    expect(articleCard).toContain("height={540}");
  });

  it("prioriza e dimensiona imagens principais candidatas a LCP", () => {
    const familyRoute = source("src/routes/produtos/$categorySlug/$familySlug.tsx");
    const articleRoute = source("src/routes/conteudos/$articleSlug.tsx");

    expect(familyRoute).toContain('fetchPriority="high"');
    expect(familyRoute).toContain("width={800}");
    expect(familyRoute).toContain("height={600}");
    expect(articleRoute).toContain('fetchPriority="high"');
    expect(articleRoute).toContain("width={1200}");
    expect(articleRoute).toContain("height={675}");
  });

  it("mantém fallbacks globais coerentes com pt-BR", () => {
    const root = source("src/routes/__root.tsx");

    expect(root).toContain("Página não encontrada");
    expect(root).toContain("Não foi possível carregar esta página");
    expect(root).toContain("Tentar novamente");
    expect(root).not.toContain("Page not found");
    expect(root).not.toContain("Try again");
  });

  it("declara theme-color compatível com o background aprovado", () => {
    const root = source("src/routes/__root.tsx");

    expect(root).toContain('{ name: "theme-color", content: "#fffaed" }');
  });

  it("reserva margem de rolagem para headings ancoráveis sob o header sticky", () => {
    const styles = source("src/styles.css");

    expect(styles).toContain("h1[id]");
    expect(styles).toContain("h2[id]");
    expect(styles).toContain("scroll-margin-top: var(--spacing-20)");
  });

  it("não usa transition-all nos primitives reutilizáveis auditados", () => {
    for (const path of [
      "src/components/ui/tabs.tsx",
      "src/components/ui/progress.tsx",
      "src/components/ui/accordion.tsx",
      "src/components/ui/input-otp.tsx",
      "src/components/ui/sidebar.tsx",
    ]) {
      expect(source(path), path).not.toContain("transition-all");
    }
  });
});
