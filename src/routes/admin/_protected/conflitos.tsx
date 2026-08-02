import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { decideConflict, fetchConflicts } from "@/catalog/catalog.functions";
import {
  Callout,
  PageHeader,
  QueryState,
  StatusBadge,
  Table,
  buttonClass,
  inputClass,
  readableError,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/conflitos")({
  head: () =>
    buildMeta({ title: "Conflitos de código", description: "Resolução de códigos duplicados." }),
  component: ConflictsPage,
});

function ConflictsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const load = useServerFn(fetchConflicts);
  const decide = useServerFn(decideConflict);

  const query = useQuery({
    queryKey: ["admin", "conflicts"],
    queryFn: () => load({ data: { status: null } }),
  });

  const mutation = useMutation({
    mutationFn: decide,
    onSuccess: () => {
      setFeedback("Conflito resolvido e registrado na auditoria.");
      queryClient.invalidateQueries({ queryKey: ["admin", "conflicts"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Conflitos de código"
        description="Um código repetido bloqueia apenas os registros afetados. Nada é sobrescrito automaticamente."
      />

      {feedback && (
        <div className="mb-4">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {mutation.error && (
        <div className="mb-4">
          <Callout tone="danger" title="Decisão recusada">
            {readableError(mutation.error)}
          </Callout>
        </div>
      )}

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.length ?? 0) === 0}
        emptyLabel="Nenhum conflito de código registrado."
      >
        <Table head={["Código", "Situação", "Impacto", "Decisão"]}>
          {query.data?.map((row) => (
            <tr key={row["id"]} className="border-t border-border align-top">
              <td className="px-3 py-2 font-semibold tabular-nums">{row["code"]}</td>
              <td className="px-3 py-2">
                <StatusBadge value={row["status"]} />
              </td>
              <td className="px-3 py-2">{row["impact"] ?? "—"}</td>
              <td className="px-3 py-2">
                {row["status"] === "RESOLVED" ? (
                  <span>{row["decision"]}</span>
                ) : (
                  <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      mutation.mutate({
                        data: {
                          id: String(row["id"]),
                          decision: String(form.get("decision") ?? ""),
                        },
                      });
                    }}
                  >
                    <input
                      name="decision"
                      className={inputClass}
                      placeholder="Descreva a decisão"
                      required
                      minLength={3}
                    />
                    <button type="submit" className={buttonClass}>
                      Resolver
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </QueryState>
    </div>
  );
}
