import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchNormalizationTasks, saveNormalizationTask } from "@/catalog/catalog.functions";
import {
  Callout,
  PageHeader,
  Pagination,
  QueryState,
  StatusBadge,
  Table,
  inputClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/normalizacao")({
  head: () =>
    buildMeta({ title: "Fila de normalização", description: "Pendências de dados do catálogo." }),
  component: NormalizationPage,
});

const STATUSES = ["OPEN", "IN_PROGRESS", "BLOCKED", "RESOLVED", "DISCARDED"];

function NormalizationPage() {
  const [status, setStatus] = useState("OPEN");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const load = useServerFn(fetchNormalizationTasks);
  const save = useServerFn(saveNormalizationTask);

  const query = useQuery({
    queryKey: ["admin", "tasks", { status, page }],
    queryFn: () => load({ data: { status: status || null, page } }),
  });

  const mutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      setFeedback("Tarefa atualizada.");
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Fila de normalização"
        description="Nenhum dado é descartado. Cada pendência aparece aqui com motivo, evidência e histórico de decisão."
      />

      {feedback && (
        <div className="mb-4">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {mutation.error && (
        <div className="mb-4">
          <Callout tone="danger" title="Atualização recusada">
            {readableError(mutation.error)}
          </Callout>
        </div>
      )}

      <label className="mb-5 block max-w-xs">
        <span className="text-[13px] font-semibold">Situação</span>
        <select
          className={inputClass}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas</option>
          {STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.rows.length ?? 0) === 0}
        emptyLabel="Nenhuma pendência nesta situação."
      >
        <Table head={["Motivo", "Título", "Prioridade", "Situação", "Ações"]}>
          {query.data?.rows.map((row) => (
            <tr key={row["id"]} className="border-t border-border align-top">
              <td className="px-3 py-2">{row["reason"]}</td>
              <td className="px-3 py-2">
                <p className="font-semibold">{row["title"]}</p>
                <p className="text-[13px] text-text-muted">{row["description"] ?? ""}</p>
              </td>
              <td className="px-3 py-2">{row["priority"]}</td>
              <td className="px-3 py-2">
                <StatusBadge value={row["status"]} />
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={() =>
                      mutation.mutate({ data: { id: String(row["id"]), status: "IN_PROGRESS" } })
                    }
                  >
                    Assumir
                  </button>
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={() =>
                      mutation.mutate({
                        data: { id: String(row["id"]), status: "RESOLVED", decision: "Normalizado" },
                      })
                    }
                  >
                    Resolver
                  </button>
                </div>
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
