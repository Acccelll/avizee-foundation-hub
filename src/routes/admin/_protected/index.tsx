import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { buildMeta } from "@/seo/meta";
import { fetchDashboard } from "@/catalog/catalog.functions";
import { PageHeader, QueryState } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/")({
  head: () => buildMeta({ title: "Administração", description: "Painel administrativo AviZee." }),
  component: AdminHome,
});

const CARDS = [
  { key: "families", label: "Famílias", to: "/admin/catalogo/familias" },
  { key: "products", label: "SKUs", to: "/admin/catalogo/skus" },
  { key: "blocked", label: "Registros bloqueados", to: "/admin/catalogo/skus" },
  { key: "pendingMedia", label: "Imagens pendentes", to: "/admin/midia" },
  { key: "tasks", label: "Fila de normalização", to: "/admin/normalizacao" },
  { key: "conflicts", label: "Conflitos de código", to: "/admin/conflitos" },
] as const;

function AdminHome() {
  const { user } = Route.useRouteContext();
  const load = useServerFn(fetchDashboard);
  const query = useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => load() });

  return (
    <div>
      <PageHeader
        title="Painel administrativo"
        description={`Sessão de ${user.name}. Papéis ativos: ${user.roles.join(", ") || "nenhum"}.`}
      />
      <QueryState isLoading={query.isLoading} error={query.error}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              className="rounded-[8px] border border-border bg-background p-4 hover:bg-surface-alt"
            >
              <dt className="text-[13px] uppercase tracking-wide text-text-muted">{card.label}</dt>
              <dd className="mt-1 text-[24px] font-extrabold tabular-nums">
                {query.data?.[card.key] ?? 0}
              </dd>
            </Link>
          ))}
        </dl>
      </QueryState>
    </div>
  );
}
