import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { catalogFacets, publicSitemapEntries } from "@/catalog/public/read.server";
import { contentSitemapEntries } from "@/content/public/read.server";
import { getServerConfig } from "@/lib/env.server";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
}

/** Rotas jamais indexáveis (§15). Verificado por teste. */
export const SITEMAP_EXCLUDED_PREFIXES = [
  "/busca",
  "/cotacao",
  "/admin",
  "/api",
  "/preview",
  "/politica-de-privacidade",
  "/termos-de-uso",
] as const;

/** Monta as entradas a partir do catálogo publicado e do conteúdo publicado. */
export function buildSitemapPaths(
  categories: string[],
  families: { slug: string; categorySlug: string }[],
  content: { categories: string[]; articles: string[] },
  applications: string[] = [],
): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/produtos", changefreq: "weekly", priority: "0.9" },
    { path: "/solucoes", changefreq: "monthly", priority: "0.6" },
    ...applications.map((slug) => ({
      path: `/solucoes/${slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
    { path: "/sobre", changefreq: "monthly", priority: "0.5" },
    { path: "/contato", changefreq: "monthly", priority: "0.5" },
    { path: "/conteudos", changefreq: "weekly", priority: "0.6" },
    ...categories.map((slug) => ({
      path: `/produtos/${slug}`,
      changefreq: "weekly" as const,
      priority: "0.8",
    })),
    ...families.map((family) => ({
      path: `/produtos/${family.categorySlug}/${family.slug}`,
      changefreq: "weekly" as const,
      priority: "0.7",
    })),
    ...content.categories.map((slug) => ({
      path: `/conteudos/categoria/${slug}`,
      changefreq: "weekly" as const,
      priority: "0.5",
    })),
    ...content.articles.map((slug) => ({
      path: `/conteudos/${slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
    })),
  ];

  return entries.filter(
    (entry) => !SITEMAP_EXCLUDED_PREFIXES.some((prefix) => entry.path.startsWith(prefix)),
  );
}

/** Serializa em XML com `loc` SEMPRE absoluto (§15). */
export function renderSitemap(baseUrl: string, entries: SitemapEntry[]): string {
  const base = baseUrl.replace(/\/+$/, "");
  const urls = entries.map((entry) =>
    [
      `  <url>`,
      `    <loc>${base}${encodeURI(entry.path)}</loc>`,
      entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
      entry.priority ? `    <priority>${entry.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

/**
 * Sitemap gerado por rota de servidor (doc 100 §4; corrigido na Etapa 11.1 §15).
 * `lastmod` é omitido — não existe timestamp confiável por página nesta etapa
 * e jamais deve ser derivado da data de build.
 *
 * Fora de produção o documento continua sendo gerado (teste técnico), porém
 * marcado como `noindex` e nunca submetido a buscadores.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { APP_ENV, APP_PUBLIC_URL } = getServerConfig();

        const [{ categories, families }, content, facets] = await Promise.all([
          publicSitemapEntries(),
          contentSitemapEntries(),
          catalogFacets(),
        ]);

        const xml = renderSitemap(
          APP_PUBLIC_URL,
          buildSitemapPaths(
            categories,
            families,
            content,
            facets.applications.map((application) => application.slug),
          ),
        );

        return new Response(xml, {
          headers: {
            "content-type": "application/xml",
            "cache-control": APP_ENV === "production" ? "public, max-age=3600" : "no-store",
            "x-robots-tag": APP_ENV === "production" ? "all" : "noindex, nofollow",
          },
        });
      },
    },
  },
});
