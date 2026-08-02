import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { buildMeta } from "@/seo/meta";
import { fetchImportJob } from "@/catalog/import.functions";
import {
  PageHeader,
  QueryState,
  StatusBadge,
  Table,
  secondaryButtonClass,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/importacao_/$jobId")({
  head: () => buildMeta({ title: "Lote de importação", description: "Detalhe do lote importado." }),
  component: ImportJobDetail,
});

function ImportJobDetail() {
  const { jobId } = Route.useParams();
  const load = useServerFn(fetchImportJob);
  const query = useQuery({
    queryKey: ["admin", "import-job", jobId],
    queryFn: () => load({ data: { id: jobId } }),
  });

  const job = query.data?.job;

  return (
    <div>
      <PageHeader
        title="Lote de importação"
        description="Registro linha a linha do que entrou, do que mudou e do que foi bloqueado."
        actions={
          <Link to="/admin/importacao" className={secondaryButtonClass}>
            Voltar
          </Link>
        }
      />

      <QueryState isLoading={query.isLoading} error={query.error}>
        <dl className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[8px] border border-border p-4">
            <dt className="text-[13px] uppercase text-text-muted">Arquivo</dt>
            <dd className="mt-1 font-semibold">{job?.["filename"]}</dd>
          </div>
          <div className="rounded-[8px] border border-border p-4">
            <dt className="text-[13px] uppercase text-text-muted">Modo</dt>
            <dd className="mt-1 font-semibold">{job?.["mode"]}</dd>
          </div>
          <div className="rounded-[8px] border border-border p-4">
            <dt className="text-[13px] uppercase text-text-muted">Situação</dt>
            <dd className="mt-1">
              <StatusBadge value={job?.["status"]} />
            </dd>
          </div>
        </dl>

        {(query.data?.errors.length ?? 0) > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[20px] font-bold">Erros de validação</h2>
            <Table head={["Linha", "Coluna", "Mensagem"]}>
              {query.data?.errors.map((error) => (
                <tr key={error["id"]} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums">{error["row_number"]}</td>
                  <td className="px-3 py-2">{error["column_name"] ?? "—"}</td>
                  <td className="px-3 py-2">{error["message"]}</td>
                </tr>
              ))}
            </Table>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-[20px] font-bold">Linhas processadas</h2>
          <Table head={["Linha", "Referência", "Resultado", "Mensagens"]}>
            {query.data?.rows.map((row) => (
              <tr key={row["id"]} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{row["row_number"]}</td>
                <td className="px-3 py-2 tabular-nums">{row["source_reference"]}</td>
                <td className="px-3 py-2">
                  <StatusBadge value={row["outcome"]} />
                </td>
                <td className="px-3 py-2 text-[13px] text-text-muted">
                  {JSON.stringify(row["messages"] ?? {})}
                </td>
              </tr>
            ))}
          </Table>
        </section>
      </QueryState>
    </div>
  );
}
