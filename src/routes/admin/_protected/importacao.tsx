import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import {
  executeImport,
  fetchImportJobs,
  rollbackImport,
  simulateImport,
} from "@/catalog/import.functions";
import {
  Callout,
  PageHeader,
  QueryState,
  StatusBadge,
  Table,
  buttonClass,
  inputClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { IMPORT_COLUMNS, IMPORT_SCHEMA_VERSION } from "@/catalog/import/schema";

export const Route = createFileRoute("/admin/_protected/importacao")({
  head: () =>
    buildMeta({ title: "Importação controlada", description: "Simulação, execução e rollback." }),
  component: ImportPage,
});

interface Simulation {
  jobId: string;
  signature: string;
  summary: { total: number; create: number; update: number; unchanged: number; blocked: number };
  errors: { line: number; column: string | null; message: string }[];
  items: { line: number; sku: string; operation: string; blockReason: string | null }[];
}

function ImportPage() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadJobs = useServerFn(fetchImportJobs);
  const simulate = useServerFn(simulateImport);
  const execute = useServerFn(executeImport);
  const rollback = useServerFn(rollbackImport);

  const jobs = useQuery({ queryKey: ["admin", "import-jobs"], queryFn: () => loadJobs() });

  const simulateMutation = useMutation({
    mutationFn: simulate,
    onSuccess: (result) => {
      setFeedback(null);
      setSimulation({
        jobId: result.jobId,
        signature: result.signature,
        summary: result.plan.summary,
        errors: result.errors,
        items: result.plan.items.map((item) => ({
          line: item.line,
          sku: item.sku,
          operation: item.operation,
          blockReason: item.blockReason,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "import-jobs"] });
    },
  });

  const executeMutation = useMutation({
    mutationFn: execute,
    onSuccess: (result) => {
      setFeedback(`Importação concluída. Lote ${result.jobId}.`);
      setSimulation(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "import-jobs"] });
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: rollback,
    onSuccess: (result) => {
      setFeedback(`Rollback aplicado em ${result.reverted} registros.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "import-jobs"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Importação controlada"
        description="Nenhuma execução acontece sem simulação prévia. A execução só é liberada se o arquivo e o plano forem idênticos aos simulados."
      />

      <div className="mb-6">
        <Callout tone="info" title={`Contrato de arquivo — versão ${IMPORT_SCHEMA_VERSION}`}>
          Colunas aceitas: {IMPORT_COLUMNS.join(", ")}. Arquivos em outra versão são recusados.
        </Callout>
      </div>

      {feedback && (
        <div className="mb-4">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {(simulateMutation.error || executeMutation.error || rollbackMutation.error) && (
        <div className="mb-4">
          <Callout tone="danger" title="Operação recusada">
            {readableError(
              simulateMutation.error ?? executeMutation.error ?? rollbackMutation.error,
            )}
          </Callout>
        </div>
      )}

      <section className="mb-10 rounded-[8px] border border-border p-4">
        <h2 className="text-[20px] font-bold">1. Simulação obrigatória</h2>
        <label className="mt-3 block">
          <span className="text-[13px] font-semibold">Arquivo CSV</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className={inputClass}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setFilename(file.name);
              setContent(await file.text());
              setSimulation(null);
            }}
          />
        </label>
        <button
          type="button"
          className={`${buttonClass} mt-4`}
          disabled={!content || simulateMutation.isPending}
          onClick={() =>
            simulateMutation.mutate({
              data: { filename, content, schemaVersion: IMPORT_SCHEMA_VERSION },
            })
          }
        >
          {simulateMutation.isPending ? "Simulando…" : "Simular importação"}
        </button>
      </section>

      {simulation && (
        <section className="mb-10 rounded-[8px] border border-border p-4">
          <h2 className="text-[20px] font-bold">2. Resultado da simulação</h2>
          <p className="mt-2 text-[14px] text-text-secondary">
            {simulation.summary.total} linhas · {simulation.summary.create} novas ·{" "}
            {simulation.summary.update} atualizações · {simulation.summary.unchanged} sem alteração
            · {simulation.summary.blocked} bloqueadas · {simulation.errors.length} erros de
            validação.
          </p>

          {simulation.errors.length > 0 && (
            <div className="mt-4">
              <Table head={["Linha", "Coluna", "Erro"]}>
                {simulation.errors.slice(0, 100).map((error) => (
                  <tr
                    key={`${error.line}-${error.column}-${error.message}`}
                    className="border-t border-border"
                  >
                    <td className="px-3 py-2 tabular-nums">{error.line}</td>
                    <td className="px-3 py-2">{error.column ?? "—"}</td>
                    <td className="px-3 py-2">{error.message}</td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          <div className="mt-4">
            <Table head={["Linha", "SKU", "Operação", "Bloqueio"]}>
              {simulation.items.slice(0, 200).map((item) => (
                <tr key={item.line} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums">{item.line}</td>
                  <td className="px-3 py-2 tabular-nums">{item.sku}</td>
                  <td className="px-3 py-2">
                    <StatusBadge value={item.operation} />
                  </td>
                  <td className="px-3 py-2">{item.blockReason ?? "—"}</td>
                </tr>
              ))}
            </Table>
          </div>

          <button
            type="button"
            className={`${buttonClass} mt-4`}
            disabled={executeMutation.isPending}
            onClick={() =>
              executeMutation.mutate({
                data: { dryRunJobId: simulation.jobId, signature: simulation.signature, content },
              })
            }
          >
            {executeMutation.isPending ? "Executando…" : "Confirmar e executar"}
          </button>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-[20px] font-bold">Histórico de lotes</h2>
        <QueryState
          isLoading={jobs.isLoading}
          error={jobs.error}
          isEmpty={(jobs.data?.length ?? 0) === 0}
          emptyLabel="Nenhuma importação registrada."
        >
          <Table head={["Arquivo", "Modo", "Situação", "Resumo", "Ações"]}>
            {jobs.data?.map((job) => (
              <tr key={job["id"]} className="border-t border-border">
                <td className="px-3 py-2">{job["filename"]}</td>
                <td className="px-3 py-2">{job["mode"]}</td>
                <td className="px-3 py-2">
                  <StatusBadge value={job["status"]} />
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {job["new_rows"] ?? 0} novos / {job["updated_rows"] ?? 0} atualizados /{" "}
                  {job["blocked_rows"] ?? 0} bloqueados
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/admin/importacao/$jobId"
                      params={{ jobId: String(job["id"]) }}
                      className={secondaryButtonClass}
                    >
                      Detalhes
                    </Link>
                    {job["mode"] === "EXECUTE" && job["status"] === "EXECUTED" && (
                      <button
                        type="button"
                        className={secondaryButtonClass}
                        onClick={() => rollbackMutation.mutate({ data: { id: String(job["id"]) } })}
                      >
                        Reverter lote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </QueryState>
      </section>
    </div>
  );
}
