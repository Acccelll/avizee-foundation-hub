import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/env.server";

/**
 * robots.txt por ambiente (§16). Somente produção é indexável; apenas em
 * produção o sitemap é anunciado — e sempre com URL ABSOLUTA.
 */
export function renderRobots(appEnv: string, publicUrl: string): string {
  const base = publicUrl.replace(/\/+$/, "");
  if (appEnv !== "production") {
    return "User-agent: *\nDisallow: /\n";
  }
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /busca",
    "Disallow: /cotacao",
    "Disallow: /admin",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { APP_ENV, APP_PUBLIC_URL } = getServerConfig();
        return new Response(renderRobots(APP_ENV, APP_PUBLIC_URL), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "x-robots-tag": APP_ENV === "production" ? "all" : "noindex, nofollow",
          },
        });
      },
    },
  },
});
