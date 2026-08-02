import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchProducts } from "@/catalog/catalog.functions";
import {
  PageHeader,
  Pagination,
  QueryState,
  StatusBadge,
  Table,
  inputClass,
} from "@/components/admin/ui";
import { REVIEW_STATUSES } from "@/catalog/types";

export const Route = createFileRoute("/admin/_protected/catalogo/skus")({
  head: () =>
    buildMeta({ title: "SKUs", description: "Gestão administrativa de SKUs e variações." }),
  component: SkusPage,
});

function SkusPage() {
  const [search, setSearch] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const load = useServerFn(fetchProducts);
  const query = useQuery({
    queryKey: ["admin", "products", { search, reviewStatus, blockedOnly, page }],
    queryFn: () =>
      load({
        data: {
          search: search || null,
          reviewStatus: reviewStatus || null,
          blockedOnly,
          page,
        },
      }),
  });

  return (
    <div>
      <PageHeader
        title="SKUs e variações"
        description="Cada SKU pertence a uma família. Bloqueio é sempre por registro, nunca por família inteira."
      />

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-[13px] font-semibold">Buscar</span>
          <input
            className={inputClass}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="SKU ou nome público"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold">Revisão</span>
          <select
            className={inputClass}
            value={reviewStatus}
            onChange={(e) => {
              setReviewStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos</option>
            {REVIEW_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={blockedOnly}
            onChange={(e) => {
              setBlockedOnly(e.target.checked);
              setPage(1);
            }}
          />
          <span className="text-[14px] font-semibold">Somente bloqueados</span>
        </label>
      </div>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.rows.length ?? 0) === 0}
        emptyLabel="Nenhum SKU encontrado com os filtros atuais."
      >
        <Table head={["SKU", "Nome público", "Família", "Revisão", "Publicação", ""]}>
          {query.data?.rows.map((row) => (
            <tr key={row["id"]} className="border-t border-border">
              <td className="px-3 py-2 font-semibold tabular-nums">{row["public_sku"]}</td>
              <td className="px-3 py-2">{row["public_name"]}</td>
              <td className="px-3 py-2">{row["product_families"]?.public_name ?? "—"}</td>
              <td className="px-3 py-2">
                <StatusBadge value={row["review_status"]} />
              </td>
              <td className="px-3 py-2">
                <StatusBadge value={row["publication_status"]} />
              </td>
              <td className="px-3 py-2 text-right">
                <Link
                  to="/admin/catalogo/skus/$productId"
                  params={{ productId: String(row["id"]) }}
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
          total={query.data?.total ?? 0}
          pageSize={query.data?.pageSize ?? 25}
          onChange={setPage}
        />
      </QueryState>
    </div>
  );
}
