import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { publicSitemapEntries } from "@/catalog/public/read.server";
import { contentSitemapEntries } from "@/content/public/read.server";
import { getServerConfig } from "@/lib/env.server";

// TODO: substituir pela URL definitiva quando o domínio de produção for aprovado.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
}

/**
 * Sitemap gerado por rota de servidor (doc 100 §4).
 * Contém apenas rotas públicas indexáveis: busca, filtros, cotação e painel
 * ficam de fora. `lastmod` é omitido — não há timestamp específico e
 * confiável por página nesta etapa (jamais usar data de build).
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { APP_ENV } = getServerConfig();
        if (APP_ENV !== "production") {
          return new Response("Sitemap indisponível fora de produção.\n", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        const [{ categories, families }, content] = await Promise.all([
          publicSitemapEntries(),
          contentSitemapEntries(),
        ]);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/produtos", changefreq: "weekly", priority: "0.9" },
          { path: "/solucoes", changefreq: "monthly", priority: "0.6" },
          { path: "/sobre", changefreq: "monthly", priority: "0.5" },
          { path: "/contato", changefreq: "monthly", priority: "0.5" },
          { path: "/conteudos", changefreq: "weekly", priority: "0.6" },
          // Páginas legais em RASCUNHO (Q-13) ficam fora do sitemap até a publicação.
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

        const urls = entries.map((entry) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${entry.path}</loc>`,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "content-type": "application/xml",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
