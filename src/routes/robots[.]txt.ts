import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/env.server";

/**
 * robots.txt por ambiente (§16/§30). Somente produção é indexável.
 * Nenhum sitemap é publicado nesta etapa.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { APP_ENV } = getServerConfig();
        const body =
          APP_ENV === "production"
            ? "User-agent: *\nAllow: /\n"
            : "User-agent: *\nDisallow: /\n";
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "x-robots-tag": APP_ENV === "production" ? "all" : "noindex, nofollow",
          },
        });
      },
    },
  },
});
