import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchMedia, reviewMediaAsset } from "@/catalog/catalog.functions";
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
import { IMAGE_STATUSES } from "@/catalog/types";

export const Route = createFileRoute("/admin/_protected/midia")({
  head: () =>
    buildMeta({ title: "Imagens", description: "Curadoria e direitos de uso de imagens." }),
  component: MediaPage,
});

function MediaPage() {
  const [reviewStatus, setReviewStatus] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const load = useServerFn(fetchMedia);
  const review = useServerFn(reviewMediaAsset);

  const query = useQuery({
    queryKey: ["admin", "media", { reviewStatus, page }],
    queryFn: () => load({ data: { reviewStatus: reviewStatus || null, page } }),
  });

  const mutation = useMutation({
    mutationFn: review,
    onSuccess: () => {
      setFeedback("Revisão registrada.");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Imagens e direitos de uso"
        description="Toda imagem nasce em quarentena. A aprovação exige origem, direito confirmado, ausência de marca visível, correspondência com o produto e texto alternativo."
      />

      <div className="mb-4">
        <Callout tone="info" title="Ausência de imagem não bloqueia o produto">
          Registros sem imagem aprovada usam o placeholder oficial e entram no relatório de
          pendências.
        </Callout>
      </div>

      {feedback && (
        <div className="mb-4">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {mutation.error && (
        <div className="mb-4">
          <Callout tone="danger" title="Revisão recusada">
            {readableError(mutation.error)}
          </Callout>
        </div>
      )}

      <label className="mb-5 block max-w-xs">
        <span className="text-[13px] font-semibold">Estado</span>
        <select
          className={inputClass}
          value={reviewStatus}
          onChange={(e) => {
            setReviewStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos</option>
          {IMAGE_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.rows.length ?? 0) === 0}
        emptyLabel="Nenhum ativo de imagem cadastrado."
      >
        <Table head={["Título interno", "Estado", "Direitos", "Marca detectada", "Ações"]}>
          {query.data?.rows.map((row) => (
            <tr key={row["id"]} className="border-t border-border">
              <td className="px-3 py-2">{row["internal_title"] ?? row["original_filename"]}</td>
              <td className="px-3 py-2">
                <StatusBadge value={row["review_status"]} />
              </td>
              <td className="px-3 py-2">{row["rights_status"]}</td>
              <td className="px-3 py-2">{row["detected_brand"] ?? "—"}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={() =>
                      mutation.mutate({
                        data: { id: String(row["id"]), toStatus: "APROVADA", matchesProduct: true },
                      })
                    }
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={() =>
                      mutation.mutate({
                        data: {
                          id: String(row["id"]),
                          toStatus: "NAO_PUBLICAR",
                          reason: "Reprovada na curadoria",
                        },
                      })
                    }
                  >
                    Reprovar
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
