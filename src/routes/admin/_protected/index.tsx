import { createFileRoute } from "@tanstack/react-router";

import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/admin/_protected/")({
  head: () => buildMeta({ title: "Administração", description: "Painel administrativo AviZee." }),
  component: AdminHome,
});

function AdminHome() {
  const { user } = Route.useRouteContext();
  return (
    <div>
      <h1 className="text-[28px] font-extrabold">Painel administrativo</h1>
      <p className="mt-3 text-[16px] text-text-secondary">
        Fundação técnica da Etapa 5. Os módulos de catálogo, mídia, conteúdos e cotações aparecem
        desabilitados até serem implementados nas etapas seguintes.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[8px] border border-border bg-background p-4">
          <dt className="text-[13px] uppercase tracking-wide text-text-muted">Usuário</dt>
          <dd className="mt-1 font-semibold">{user.name}</dd>
        </div>
        <div className="rounded-[8px] border border-border bg-background p-4">
          <dt className="text-[13px] uppercase tracking-wide text-text-muted">Papéis</dt>
          <dd className="mt-1 font-semibold">{user.roles.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
}
