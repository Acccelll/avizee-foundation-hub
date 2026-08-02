import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchFamilies, fetchTaxonomy } from "@/catalog/catalog.functions";
import {
  PageHeader,
  Pagination,
  QueryState,
  StatusBadge,
  Table,
  inputClass,
} from "@/components/admin/ui";
import { PUBLICATION_STATUSES, REVIEW_STATUSES } from "@/catalog/types";

export const Route = createFileRoute("/admin/_protected/catalogo/familias")({
  head: () =>
    buildMeta({ title: "Famílias de produtos", description: "Gestão administrativa de famílias." }),
  component: FamiliesPage,
});

function FamiliesPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [publicationStatus, setPublicationStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useServerFn(fetchFamilies);
  const loadTaxonomy = useServerFn(fetchTaxonomy);

  const taxonomy = useQuery({ queryKey: ["admin", "taxonomy"], queryFn: () => loadTaxonomy() });
  const query = useQuery({
    queryKey: ["admin", "families", { search, categoryId, reviewStatus, publicationStatus, page }],
    queryFn: () =>
      load({
        data: {
          search: search || null,
          categoryId: categoryId || null,
          reviewStatus: reviewStatus || null,
          publicationStatus: publicationStatus || null,
          page,
        },
      }),
  });

  return (
    <div>
      <PageHeader
        title="Famílias de produtos"
        description="Lista, busca e filtros por categoria e estado. Nenhuma família é excluída: use arquivamento."
      />

      <form
        className="mb-5 grid gap-3 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
        }}
      >
        <label className="block">
          <span className="text-[13px] font-semibold">Buscar</span>
          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nome público"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold">Categoria</span>
          <select
            className={inputClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Todas</option>
            {taxonomy.data?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold">Revisão</span>
          <select
            className={inputClass}
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value)}
          >
            <option value="">Todos</option>
            {REVIEW_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold">Publicação</span>
          <select
            className={inputClass}
            value={publicationStatus}
            onChange={(e) => setPublicationStatus(e.target.value)}
          >
            <option value="">Todos</option>
            {PUBLICATION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </form>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.rows.length ?? 0) === 0}
        emptyLabel="Nenhuma família encontrada com os filtros atuais."
      >
        <Table head={["Nome público", "Categoria", "Revisão", "Publicação", ""]}>
          {query.data?.rows.map((row) => (
            <tr key={row["id"]} className="border-t border-border">
              <td className="px-3 py-2 font-semibold">{row["public_name"]}</td>
              <td className="px-3 py-2">{row["product_categories"]?.name ?? "—"}</td>
              <td className="px-3 py-2">
                <StatusBadge value={row["review_status"]} />
              </td>
              <td className="px-3 py-2">
                <StatusBadge value={row["publication_status"]} />
              </td>
              <td className="px-3 py-2 text-right">
                <Link
                  to="/admin/catalogo/familias/$familyId"
                  params={{ familyId: String(row["id"]) }}
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
