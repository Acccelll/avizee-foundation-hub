import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchQuotationDashboard, fetchQuotations } from "@/quotation/admin.functions";
import { PageHeader, Pagination, QueryState, StatusBadge, Table, inputClass } from "@/components/admin/ui";
import { QUOTATION_STATUSES, STATUS_LABEL, type QuotationStatus } from "@/quotation/model";

export const Route = createFileRoute("/admin/_protected/cotacoes")({
  head: () =>
    buildMeta({ title: "Cotações", description: "Painel comercial de listas de cotação." }),
  component: Cotacoes,
});

function Cotacoes() {
  const load = useServerFn(fetchQuotations);
  const loadDashboard = useServerFn(fetchQuotationDashboard);
  const [status, setStatus] = useState<QuotationStatus | "">("");
  const [assigned, setAssigned] = useState<"" | "mine" | "none">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const dashboard = useQuery({
    queryKey: ["admin", "quotations", "dashboard"],
    queryFn: () => loadDashboard(),
  });

  const query = useQuery({
    queryKey: ["admin", "quotations", status, assigned, search, page],
    queryFn: () =>
      load({
        data: {
          status: status || null,
          assigned: assigned || null,
          search: search || null,
          page,
        },
      }),
  });

  return (
    <div>
      <PageHeader
        title="Cotações"
        description="Listas de cotação recebidas. Nenhum valor, preço ou condição comercial é registrado pelo site."
      />

      <dl className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Em aberto", value: dashboard.data?.open },
          { label: "Minhas", value: dashboard.data?.mine },
          { label: "Notificações pendentes", value: dashboard.data?.pendingNotifications },
          { label: "Dead-letter", value: dashboard.data?.deadLetter },
        ].map((card) => (
          <div key={card.label} className="rounded-[8px] border border-border bg-background p-4">
            <dt className="text-[13px] uppercase tracking-wide text-text-muted">{card.label}</dt>
            <dd className="mt-1 text-[24px] font-extrabold tabular-nums">{card.value ?? 0}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="filtro-status" className="text-[13px] font-semibold">
            Situação
          </label>
          <select
            id="filtro-status"
            className={inputClass}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as QuotationStatus | "");
              setPage(1);
            }}
          >
            <option value="">Todas</option>
            {QUOTATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABEL[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtro-responsavel" className="text-[13px] font-semibold">
            Responsável
          </label>
          <select
            id="filtro-responsavel"
            className={inputClass}
            value={assigned}
            onChange={(e) => {
              setAssigned(e.target.value as "" | "mine" | "none");
              setPage(1);
            }}
          >
            <option value="">Todos</option>
            <option value="mine">Atribuídas a mim</option>
            <option value="none">Sem responsável</option>
          </select>
        </div>
        <div>
          <label htmlFor="filtro-busca" className="text-[13px] font-semibold">
            Protocolo ou empresa
          </label>
          <input
            id="filtro-busca"
            className={inputClass}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <QueryState isLoading={query.isLoading} error={query.error}>
        <Table head={["Protocolo", "Empresa", "Situação", "Itens", "Recebida em", ""]}>
          {(query.data?.items ?? []).map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="px-4 py-3 font-semibold tabular-nums">{row.protocol}</td>
              <td className="px-4 py-3">
                {row.companyName}
                <span className="block text-[13px] text-text-muted">
                  {row.contactName}
                  {row.location ? ` — ${row.location}` : ""}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge value={STATUS_LABEL[row.status]} />
              </td>
              <td className="px-4 py-3 tabular-nums">
                {row.itemCount}
                {row.unavailableItemCount > 0 && (
                  <span className="block text-[12px] text-text-muted">
                    {row.unavailableItemCount} fora de publicação
                  </span>
                )}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {new Date(row.createdAt).toLocaleString("pt-BR")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to="/admin/cotacoes/$quotationId"
                  params={{ quotationId: row.id }}
                  className="font-semibold underline"
                >
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
        </Table>
        <Pagination
          page={query.data?.page ?? 1}
          pageCount={query.data?.pageCount ?? 1}
          onChange={setPage}
        />
      </QueryState>
    </div>
  );
}
