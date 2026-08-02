import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchAuditLogs } from "@/catalog/catalog.functions";
import { PageHeader, Pagination, QueryState, Table, inputClass } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/auditoria")({
  head: () => buildMeta({ title: "Auditoria", description: "Trilha de auditoria administrativa." }),
  component: AuditPage,
});

function AuditPage() {
  const [entity, setEntity] = useState("");
  const [page, setPage] = useState(1);
  const load = useServerFn(fetchAuditLogs);

  const query = useQuery({
    queryKey: ["admin", "audit", { entity, page }],
    queryFn: () => load({ data: { entity: entity || null, page } }),
  });

  return (
    <div>
      <PageHeader
        title="Trilha de auditoria"
        description="Registro imutável de quem fez o quê, quando e sobre qual registro. Dados sensíveis aparecem redigidos."
      />

      <label className="mb-5 block max-w-xs">
        <span className="text-[13px] font-semibold">Entidade</span>
        <input
          className={inputClass}
          value={entity}
          onChange={(e) => {
            setEntity(e.target.value);
            setPage(1);
          }}
          placeholder="products, media_assets…"
        />
      </label>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.rows.length ?? 0) === 0}
        emptyLabel="Nenhum evento registrado."
      >
        <Table head={["Quando", "Ator", "Ação", "Entidade", "Campos alterados"]}>
          {query.data?.rows.map((row) => (
            <tr key={row["id"]} className="border-t border-border align-top">
              <td className="px-3 py-2 tabular-nums">
                {new Date(String(row["occurred_at"])).toLocaleString("pt-BR")}
              </td>
              <td className="px-3 py-2">
                {row["actor_email_masked"] ?? row["actor_id"] ?? "sistema"}
              </td>
              <td className="px-3 py-2">{row["action"]}</td>
              <td className="px-3 py-2">
                {row["entity"]}
                <span className="block text-[12px] text-text-muted">{row["entity_id"] ?? ""}</span>
              </td>
              <td className="px-3 py-2">
                {(row["changed_fields"] as string[] | null)?.join(", ") || "—"}
              </td>
            </tr>
          ))}
        </Table>
        <Pagination
          page={query.data?.page ?? 1}
          total={query.data?.total ?? 0}
          pageSize={query.data?.pageSize ?? 25}
          onChange={setPage}
        />
      </QueryState>
    </div>
  );
}
