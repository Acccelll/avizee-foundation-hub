import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import {
  fetchAdminArticles,
  fetchContentDashboard,
  fetchEditorialCategories,
  upsertArticle,
} from "@/content/editorial.functions";
import {
  Callout,
  PageHeader,
  Pagination,
  QueryState,
  StatusBadge,
  Table,
  inputClass,
  buttonClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { CONTENT_STATUSES, CONTENT_STATUS_LABEL } from "@/content/workflow";

export const Route = createFileRoute("/admin/_protected/conteudos")({
  head: () =>
    buildMeta({
      title: "Conteúdos",
      description: "CMS editorial da Central de Conteúdos.",
    }),
  component: ContentListPage,
});

function ContentListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [newTitle, setNewTitle] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const load = useServerFn(fetchAdminArticles);
  const loadCategories = useServerFn(fetchEditorialCategories);
  const loadDashboard = useServerFn(fetchContentDashboard);
  const create = useServerFn(upsertArticle);

  const query = useQuery({
    queryKey: ["admin", "content", { search, status, page }],
    queryFn: () =>
      load({
        data: {
          search: search || null,
          status: (status || null) as never,
          page,
        },
      }),
  });

  const categories = useQuery({
    queryKey: ["admin", "content", "categories"],
    queryFn: () => loadCategories(),
  });

  const dashboard = useQuery({
    queryKey: ["admin", "content", "dashboard"],
    queryFn: () => loadDashboard(),
  });

  const mutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      setFeedback("Rascunho criado. Abra o artigo para escrever o conteúdo.");
      setNewTitle("");
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });

  const categoryName = (id: string | null) =>
    ((categories.data ?? []) as Array<{ id: string; name: string }>).find((c) => c.id === id)
      ?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Central de Conteúdos"
        description="Fluxo editorial completo: rascunho, revisão técnica, revisão editorial, publicação e preparação manual para Instagram e LinkedIn."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/admin/conteudos/autores" className={secondaryButtonClass}>
          Gerenciar autores
        </Link>
      </div>

      <div className="mb-4">
        <Callout tone="info" title="Nenhuma publicação automática em rede social">
          As variantes de Instagram e LinkedIn são preparadas aqui e copiadas manualmente pela
          equipe. O sistema não se conecta a nenhuma plataforma externa.
        </Callout>
      </div>

      {dashboard.data && (
        <p className="mb-5 text-[14px] text-text-secondary">
          {dashboard.data.total} artigo(s) no total ·{" "}
          {Object.entries(dashboard.data.byStatus)
            .map(([key, value]) => `${CONTENT_STATUS_LABEL[key as never] ?? key}: ${value}`)
            .join(" · ") || "nenhum registro"}
        </p>
      )}

      {feedback && (
        <div className="mb-4">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {mutation.error && (
        <div className="mb-4">
          <Callout tone="danger" title="Não foi possível criar o rascunho">
            {readableError(mutation.error)}
          </Callout>
        </div>
      )}

      <form
        className="mb-6 flex flex-wrap items-end gap-3 rounded-[12px] border border-border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ data: { title: newTitle, blocks: [] } });
        }}
      >
        <label className="min-w-[280px] flex-1">
          <span className="text-[13px] font-semibold">Título do novo artigo</span>
          <input
            className={inputClass}
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            minLength={5}
            required
          />
        </label>
        <button type="submit" className={buttonClass} disabled={mutation.isPending}>
          Criar rascunho
        </button>
      </form>

      <div className="mb-5 flex flex-wrap gap-3">
        <label className="min-w-[240px] flex-1">
          <span className="text-[13px] font-semibold">Buscar</span>
          <input
            className={inputClass}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Título ou endereço"
          />
        </label>
        <label className="min-w-[220px]">
          <span className="text-[13px] font-semibold">Situação</span>
          <select
            className={inputClass}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas</option>
            {CONTENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {CONTENT_STATUS_LABEL[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <QueryState
        isLoading={query.isLoading}
        error={query.error}
        isEmpty={(query.data?.items.length ?? 0) === 0}
        emptyLabel="Nenhum artigo encontrado com estes filtros."
      >
        <Table head={["Título", "Categoria", "Situação", "Versão", "Atualizado"]}>
          {(query.data?.items ?? []).map(
            (article: {
              id: string;
              title: string;
              slug: string;
              status: string;
              category_id: string | null;
              version: number;
              updated_at: string;
            }) => (
              <tr key={article.id} className="border-b border-border-subtle">
                <td className="px-3 py-2">
                  <Link
                    to="/admin/conteudos/$articleId"
                    params={{ articleId: article.id }}
                    className="font-semibold hover:underline"
                  >
                    {article.title}
                  </Link>
                  <span className="block text-[12px] text-text-muted">/{article.slug}</span>
                </td>
                <td className="px-3 py-2">{categoryName(article.category_id)}</td>
                <td className="px-3 py-2">
                  <StatusBadge value={article.status} />
                </td>
                <td className="px-3 py-2 tabular-nums">{article.version}</td>
                <td className="px-3 py-2 text-[13px] text-text-muted">
                  {new Date(article.updated_at).toLocaleString("pt-BR")}
                </td>
              </tr>
            ),
          )}
        </Table>
      </QueryState>

      <Pagination
        page={query.data?.page ?? 1}
        total={query.data?.total ?? 0}
        pageSize={query.data?.pageSize ?? 20}
        onChange={setPage}
      />
    </div>
  );
}
