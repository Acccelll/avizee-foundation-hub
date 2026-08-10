import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import {
  Callout,
  PageHeader,
  QueryState,
  Table,
  buttonClass,
  inputClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { fetchAuthorsForManagement } from "@/content/authors.functions";
import type { AuthorManagementRow } from "@/content/authors.server";
import { upsertAuthor } from "@/content/editorial.functions";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/admin/_protected/conteudos_/autores")({
  head: () =>
    buildMeta({
      title: "Autores",
      description: "Gestão de autores da Central de Conteúdos AviZee.",
    }),
  component: AuthorsPage,
});

interface AuthorForm {
  id: string | null;
  displayName: string;
  roleTitle: string;
  bio: string;
  isActive: boolean;
}

const EMPTY_FORM: AuthorForm = {
  id: null,
  displayName: "",
  roleTitle: "",
  bio: "",
  isActive: true,
};

function AuthorsPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<AuthorForm>(EMPTY_FORM);
  const [feedback, setFeedback] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const loadAuthors = useServerFn(fetchAuthorsForManagement);
  const saveAuthor = useServerFn(upsertAuthor);

  const query = useQuery({
    queryKey: ["admin", "content", "authors", "management"],
    queryFn: () => loadAuthors(),
  });

  const mutation = useMutation({
    mutationFn: saveAuthor,
    onSuccess: () => {
      setFeedback(form.id ? "Autor atualizado." : "Autor cadastrado.");
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "authors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "article"] });
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return query.data ?? [];
    return (query.data ?? []).filter((author) =>
      [author.displayName, author.roleTitle ?? "", author.bio ?? ""].some((value) =>
        value.toLocaleLowerCase("pt-BR").includes(term),
      ),
    );
  }, [query.data, search]);

  const editAuthor = (author: AuthorManagementRow) => {
    setFeedback(null);
    setForm({
      id: author.id,
      displayName: author.displayName,
      roleTitle: author.roleTitle ?? "",
      bio: author.bio ?? "",
      isActive: author.isActive,
    });
  };

  const toggleAuthor = (author: AuthorManagementRow) => {
    setFeedback(null);
    mutation.mutate({
      data: {
        id: author.id,
        displayName: author.displayName,
        roleTitle: author.roleTitle,
        bio: author.bio,
        isActive: !author.isActive,
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Autores"
        description="Cadastro e manutenção dos responsáveis editoriais da Central de Conteúdos. Autores inativos permanecem vinculados ao histórico existente."
      />

      <div>
        <Link to="/admin/conteudos" className="text-[14px] font-semibold underline">
          Voltar para conteúdos
        </Link>
      </div>

      {feedback && <Callout tone="success" title={feedback} />}
      {mutation.error && (
        <Callout tone="danger" title="Não foi possível salvar o autor">
          {readableError(mutation.error)}
        </Callout>
      )}

      <form
        className="space-y-4 rounded-[12px] border border-border p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setFeedback(null);
          mutation.mutate({
            data: {
              id: form.id,
              displayName: form.displayName,
              roleTitle: form.roleTitle || null,
              bio: form.bio || null,
              isActive: form.isActive,
            },
          });
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[20px] font-bold">{form.id ? "Editar autor" : "Novo autor"}</h2>
          {form.id && (
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setForm(EMPTY_FORM)}
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-[13px] font-semibold">Nome</span>
            <input
              className={inputClass}
              value={form.displayName}
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              minLength={3}
              maxLength={120}
              required
            />
          </label>
          <label>
            <span className="text-[13px] font-semibold">Função/cargo</span>
            <input
              className={inputClass}
              value={form.roleTitle}
              onChange={(event) => setForm({ ...form, roleTitle: event.target.value })}
              maxLength={120}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold">Biografia</span>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
            maxLength={600}
          />
        </label>

        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
          />
          Autor ativo para novas associações
        </label>

        <button type="submit" className={buttonClass} disabled={mutation.isPending}>
          {form.id ? "Salvar alterações" : "Cadastrar autor"}
        </button>
      </form>

      <section className="space-y-4 rounded-[12px] border border-border p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold">Autores cadastrados</h2>
            <p className="mt-1 text-[13px] text-text-muted">
              Não há exclusão física: use a desativação para preservar autoria e histórico.
            </p>
          </div>
          <label className="min-w-[260px]">
            <span className="text-[13px] font-semibold">Buscar autor</span>
            <input
              className={inputClass}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, função ou biografia"
            />
          </label>
        </div>

        <QueryState
          isLoading={query.isLoading}
          error={query.error}
          isEmpty={filtered.length === 0}
          emptyLabel="Nenhum autor encontrado."
        >
          <Table head={["Autor", "Função", "Artigos", "Situação", "Ações"]}>
            {filtered.map((author) => (
              <tr key={author.id} className="border-b border-border-subtle">
                <td className="px-3 py-2">
                  <span className="font-semibold">{author.displayName}</span>
                  {author.bio && (
                    <span className="mt-1 block max-w-xl text-[12px] text-text-muted">
                      {author.bio}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">{author.roleTitle ?? "—"}</td>
                <td className="px-3 py-2 tabular-nums">{author.articleCount}</td>
                <td className="px-3 py-2">{author.isActive ? "Ativo" : "Inativo"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={secondaryButtonClass}
                      onClick={() => editAuthor(author)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={secondaryButtonClass}
                      disabled={mutation.isPending}
                      onClick={() => toggleAuthor(author)}
                    >
                      {author.isActive ? "Desativar" : "Ativar"}
                    </button>
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
