import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { responsiveImageProps } from "@/lib/responsive-image";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("regressões aprovadas do impeccable — Rodada 3", () => {
  it("reduz apenas superfícies que optaram por motion sem kill switch global de 0.01ms", () => {
    const styles = source("src/styles.css");

    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).not.toContain("0.01ms");
    expect(styles).toContain('[class*="animate-"]');
    expect(styles).toContain('[class*="transition"]');
  });

  it("substitui valores equivalentes pelos tokens tipográficos e de raio existentes", () => {
    const expectations: Record<string, string[]> = {
      "src/components/admin/AdminShell.tsx": ["rounded-[8px]"],
      "src/components/public/PublicShell.tsx": ["rounded-[8px]"],
      "src/components/public/catalog/FamilyCard.tsx": ["rounded-[12px]"],
      "src/components/public/catalog/FilterPanel.tsx": [
        "rounded-[8px]",
        "text-[14px]",
        "text-[16px]",
      ],
      "src/components/public/catalog/SearchBox.tsx": [
        "rounded-[8px]",
        "text-[14px]",
        "text-[16px]",
      ],
      "src/components/public/content/ArticleCard.tsx": ["rounded-[12px]", "text-[12px]"],
      "src/components/public/quotation/QuoteForm.tsx": [
        "rounded-[8px]",
        "text-[14px]",
        "text-[16px]",
      ],
      "src/routes/index.tsx": ["rounded-[8px]", "rounded-[12px]"],
      "src/routes/conteudos/$articleSlug.tsx": ["rounded-[8px]", "rounded-[12px]"],
      "src/routes/produtos/$categorySlug/$familySlug.tsx": ["rounded-[8px]", "rounded-[12px]"],
    };

    for (const [path, forbidden] of Object.entries(expectations)) {
      const file = source(path);
      for (const literal of forbidden) expect(file, `${path}: ${literal}`).not.toContain(literal);
    }
  });

  it("encapsula os overlays inversos em tokens sem mudar seus valores visuais", () => {
    const styles = source("src/styles.css");
    const home = source("src/routes/index.tsx");
    const shell = source("src/components/public/PublicShell.tsx");
    const adminShell = source("src/components/admin/AdminShell.tsx");

    expect(styles).toContain("--color-inverse-border:");
    expect(styles).toContain("--color-inverse-hover:");
    expect(styles).toContain("--color-inverse-divider:");
    expect(home).not.toContain("border-white/30");
    expect(home).not.toContain("bg-white/10");
    expect(shell).not.toContain("border-white/10");
    expect(adminShell).not.toContain("border-white/30");
  });

  it("prepara imagens públicas para srcset responsivo com fallback ao src original", () => {
    const familyCard = source("src/components/public/catalog/FamilyCard.tsx");
    const articleCard = source("src/components/public/content/ArticleCard.tsx");
    const familyRoute = source("src/routes/produtos/$categorySlug/$familySlug.tsx");
    const articleRoute = source("src/routes/conteudos/$articleSlug.tsx");

    for (const file of [familyCard, articleCard, familyRoute, articleRoute]) {
      expect(file).toContain("responsiveImageProps");
      expect(file).toContain("srcSet");
      expect(file).toContain("sizes");
      expect(file).toContain("fallbackToOriginalImage");
    }
  });

  it("gera variantes apenas para URLs públicas Supabase e preserva fallback para demais origens", () => {
    const publicUrl =
      "https://example.supabase.co/storage/v1/object/public/public-media/families/demo.webp";
    const responsive = responsiveImageProps(publicUrl, {
      widths: [320, 640],
      sizes: "100vw",
    });

    expect(responsive.srcSet).toContain("/storage/v1/render/image/public/public-media/");
    expect(responsive.srcSet).toContain("width=320");
    expect(responsive.srcSet).toContain("320w");
    expect(responsive.srcSet).toContain("640w");
    expect(responsive.sizes).toBe("100vw");
    expect(
      responsiveImageProps("https://cdn.example.com/image.webp", {
        widths: [320, 640],
        sizes: "100vw",
      }),
    ).toEqual({});
  });

  it("mantém o cliente Supabase de navegador apenas em imports dinâmicos", () => {
    const staticImport = 'from "@/integrations/supabase/client"';
    for (const path of [
      "src/auth/sign-in-admin.ts",
      "src/routes/admin/_protected.tsx",
      "src/components/admin/AdminShell.tsx",
    ]) {
      expect(source(path), path).not.toContain(staticImport);
      expect(source(path), path).toContain('import("@/integrations/supabase/client")');
    }

    const middleware = source("src/lib/supabase-auth.middleware.ts");
    expect(middleware).toContain('import("@/integrations/supabase/client")');
  });
});
