import { createFileRoute, Link } from "@tanstack/react-router";

import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/admin/acesso-negado")({
  ssr: false,
  head: () => buildMeta({ title: "Acesso negado", description: "Área restrita AviZee." }),
  component: Denied,
});

function Denied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-[28px] font-extrabold">Acesso negado</h1>
        <p className="mt-3 text-[16px] text-text-secondary">
          Sua conta não possui permissão para acessar o painel administrativo.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-[8px] bg-primary px-5 font-semibold text-primary-foreground"
        >
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
