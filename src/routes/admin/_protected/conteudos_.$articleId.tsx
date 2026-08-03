import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { buildMeta } from "@/seo/meta";
import {
  Callout,
  PageHeader,
  StatusBadge,
  Table,
  buttonClass,
  inputClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";
import {
  exportSocialText,
  fetchAdminArticle,
  fetchAuthors,
  fetchEditorialCategories,
  transitionArticle,
  upsertArticle,
  upsertSocialVariant,
} from "@/content/editorial.functions";
import { blocksSchema, readingMinutes, type ContentBlock } from "@/content/blocks";
import {
  CONTENT_STATUS_LABEL,
  transitionsFrom,
  type ContentStatus,
} from "@/content/workflow";
import {
  CHANNEL_LABEL,
  CHANNEL_LIMITS,
  SOCIAL_CHANNELS,
  normalizeHashtags,
  validateSocialDraft,
  type SocialChannel,
} from "@/content/social";

export const Route = createFileRoute("/admin/_protected/conteudos_/$articleId")({
  head: () => buildMeta({ title: "Editor de conteúdo", description: "Edição editorial AviZee." }),
  component: ArticleEditor,
});

interface RefRow {
  label: string;
  url: string | null;
  note: string | null;
}

function ArticleEditor() {
  const { articleId } = Route.useParams();
  const queryClient = useQueryClient();

  const load = useServerFn(fetchAdminArticle);
  const loadCategories = useServerFn(fetchEditorialCategories);
  const loadAuthors = useServerFn(fetchAuthors);
  const save = useServerFn(upsertArticle);
  const transition = useServerFn(transitionArticle);
  const saveSocial = useServerFn(upsertSocialVariant);
  const exportSocial = useServerFn(exportSocialText);

  const query = useQuery({
    queryKey: ["admin", "content", "article", articleId],
    queryFn: () => load({ data: { id: articleId } }),
  });

  const categories = useQuery({
    queryKey: ["admin", "content", "categories"],
    queryFn: () => loadCategories(),
  });
  const authors = useQuery({
    queryKey: ["admin", "content", "authors"],
    queryFn: () => loadAuthors(),
  });

  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    categoryId: "",
    authorId: "",
    technicalReviewerId: "",
    seoTitle: "",
    seoDescription: "",
    noindex: false,
    internalNotes: "",
    note: "",
  });
  const [blocksText, setBlocksText] = useState("[]");
  const [references, setReferences] = useState<RefRow[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  const data = query.data;
  const row = data?.article as Record<string, unknown> | undefined;

  useEffect(() => {
    if (!data || !row) return;
    setForm({
      title: String(row["title"] ?? ""),
      slug: String(row["slug"] ?? ""),
      subtitle: String(row["subtitle"] ?? ""),
      excerpt: String(row["excerpt"] ?? ""),
      categoryId: String(row["category_id"] ?? ""),
      authorId: String(row["author_id"] ?? ""),
      technicalReviewerId: String(row["technical_reviewer_id"] ?? ""),
      seoTitle: String(row["seo_title"] ?? ""),
      seoDescription: String(row["seo_description"] ?? ""),
      noindex: Boolean(row["noindex"]),
      internalNotes: String(row["internal_notes"] ?? ""),
      note: "",
    });
    setBlocksText(JSON.stringify(data.blocks, null, 2));
    setReferences(
      (data.references ?? []).map((reference: Record<string, unknown>) => ({
        label: String(reference["label"] ?? ""),
        url: (reference["url"] as string | null) ?? null,
        note: (reference["note"] as string | null) ?? null,
      })),
    );
  }, [data, row]);

  const parsedBlocks = useMemo(() => {
    try {
      return blocksSchema.safeParse(JSON.parse(blocksText));
    } catch {
      return { success: false as const, error: null };
    }
  }, [blocksText]);

  const blocks: ContentBlock[] = parsedBlocks.success ? parsedBlocks.data : [];

  const mutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      setFeedback("Nova versão salva.");
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: transition,
    onSuccess: () => {
      setFeedback("Situação atualizada.");
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });

  if (query.isLoading) return <p className="text-[15px]">Carregando…</p>;
  if (query.error || !data || !row)
    return <Callout tone="danger" title="Artigo não encontrado">{readableError(query.error)}</Callout>;

  const status = String(row["status"] ?? "DRAFT") as ContentStatus;
  const compliance = data.compliance;

  return (
    <div className="space-y-8">
      <PageHeader
        title={form.title || "Artigo sem título"}
        description={`Versão ${String(row["version"] ?? 1)} · ${CONTENT_STATUS_LABEL[status]} · ${readingMinutes(blocks)} min de leitura`}
      />

      {feedback && <Callout tone="success" title={feedback} />}
      {mutation.error && (
        <Callout tone="danger" title="Não foi possível salvar">
          {readableError(mutation.error)}
        </Callout>
      )}
      {statusMutation.error && (
        <Callout tone="danger" title="Transição recusada">
          {readableError(statusMutation.error)}
        </Callout>
      )}

      {compliance.length > 0 && (
        <Callout tone="danger" title="Pendências de conformidade">
          <ul className="list-disc pl-5">
            {compliance.map((issue, index) => (
              <li key={`${issue.code}-${index}`}>
                {issue.code}: {issue.detail}
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {/* ---------------- Metadados ---------------- */}
      <form
        className="space-y-4 rounded-[12px] border border-border p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!parsedBlocks.success) {
            setFeedback(null);
            return;
          }
          mutation.mutate({
            data: {
              id: articleId,
              title: form.title,
              slug: form.slug || null,
              subtitle: form.subtitle || null,
              excerpt: form.excerpt || null,
              categoryId: form.categoryId || null,
              authorId: form.authorId || null,
              technicalReviewerId: form.technicalReviewerId || null,
              seoTitle: form.seoTitle || null,
              seoDescription: form.seoDescription || null,
              noindex: form.noindex,
              internalNotes: form.internalNotes || null,
              blocks,
              references: references.filter((reference) => reference.label.trim().length > 1),
              note: form.note || null,
            },
          });
        }}
      >
        <h2 className="text-[20px] font-bold">Conteúdo e metadados</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-[13px] font-semibold">Título</span>
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
              minLength={5}
            />
          </label>
          <label>
            <span className="text-[13px] font-semibold">Endereço (slug)</span>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
          </label>
          <label>
            <span className="text-[13px] font-semibold">Subtítulo</span>
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
            />
          </label>
          <label>
            <span className="text-[13px] font-semibold">Categoria editorial</span>
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            >
              <option value="">Selecione</option>
              {((categories.data ?? []) as Array<{ id: string; name: string }>).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[13px] font-semibold">Autor</span>
            <select
              className={inputClass}
              value={form.authorId}
              onChange={(event) => setForm({ ...form, authorId: event.target.value })}
            >
              <option value="">Selecione</option>
              {((authors.data ?? []) as Array<{ id: string; display_name: string }>).map(
                (author) => (
                  <option key={author.id} value={author.id}>
                    {author.display_name}
                  </option>
                ),
              )}
            </select>
          </label>
          <label>
            <span className="text-[13px] font-semibold">Revisor técnico</span>
            <select
              className={inputClass}
              value={form.technicalReviewerId}
              onChange={(event) => setForm({ ...form, technicalReviewerId: event.target.value })}
            >
              <option value="">Selecione</option>
              {((authors.data ?? []) as Array<{ id: string; display_name: string }>).map(
                (author) => (
                  <option key={author.id} value={author.id}>
                    {author.display_name}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold">Resumo (excerpt)</span>
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={form.excerpt}
            onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
            maxLength={600}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold">
            Blocos estruturados (JSON validado — sem HTML arbitrário)
          </span>
          <textarea
            className={`${inputClass} min-h-[260px] font-mono text-[13px]`}
            value={blocksText}
            onChange={(event) => setBlocksText(event.target.value)}
            spellCheck={false}
          />
        </label>
        {!parsedBlocks.success && (
          <Callout tone="danger" title="Blocos inválidos">
            Corrija a estrutura antes de salvar. Apenas os tipos de bloco previstos são aceitos.
          </Callout>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-[13px] font-semibold">Título SEO</span>
            <input
              className={inputClass}
              value={form.seoTitle}
              onChange={(event) => setForm({ ...form, seoTitle: event.target.value })}
              maxLength={120}
            />
          </label>
          <label>
            <span className="text-[13px] font-semibold">Descrição SEO</span>
            <input
              className={inputClass}
              value={form.seoDescription}
              onChange={(event) => setForm({ ...form, seoDescription: event.target.value })}
              maxLength={200}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.noindex}
            onChange={(event) => setForm({ ...form, noindex: event.target.checked })}
          />
          Não indexar este artigo
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold">Notas internas (nunca publicadas)</span>
          <textarea
            className={`${inputClass} min-h-[70px]`}
            value={form.internalNotes}
            onChange={(event) => setForm({ ...form, internalNotes: event.target.value })}
            maxLength={2000}
          />
        </label>

        <fieldset className="rounded-[10px] border border-border-subtle p-4">
          <legend className="px-1 text-[14px] font-semibold">Referências consultadas</legend>
          <div className="space-y-3">
            {references.map((reference, index) => (
              <div key={index} className="flex flex-wrap gap-2">
                <input
                  className={`${inputClass} min-w-[220px] flex-1`}
                  value={reference.label}
                  placeholder="Descrição da fonte"
                  onChange={(event) => {
                    const next = [...references];
                    next[index] = { ...reference, label: event.target.value };
                    setReferences(next);
                  }}
                />
                <input
                  className={`${inputClass} min-w-[220px] flex-1`}
                  value={reference.url ?? ""}
                  placeholder="Endereço (opcional)"
                  onChange={(event) => {
                    const next = [...references];
                    next[index] = { ...reference, url: event.target.value || null };
                    setReferences(next);
                  }}
                />
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={() => setReferences(references.filter((_, i) => i !== index))}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => setReferences([...references, { label: "", url: null, note: null }])}
            >
              Adicionar referência
            </button>
          </div>
        </fieldset>

        <label className="block">
          <span className="text-[13px] font-semibold">Nota desta versão</span>
          <input
            className={inputClass}
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            maxLength={300}
          />
        </label>

        <button type="submit" className={buttonClass} disabled={mutation.isPending}>
          Salvar nova versão
        </button>
      </form>

      {/* ---------------- Workflow ---------------- */}
      <section className="rounded-[12px] border border-border p-5">
        <h2 className="text-[20px] font-bold">Fluxo editorial</h2>
        <p className="mt-1 text-[14px] text-text-secondary">
          Situação atual: <StatusBadge value={status} />
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {transitionsFrom(status).map((item) => (
            <button
              key={item.to}
              type="button"
              className={secondaryButtonClass}
              disabled={statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate({ data: { id: articleId, to: item.to, note: null } })
              }
            >
              {item.label}
            </button>
          ))}
          {transitionsFrom(status).length === 0 && (
            <p className="text-[14px] text-text-muted">Nenhuma transição disponível.</p>
          )}
        </div>

        <h3 className="mt-6 text-[16px] font-bold">Histórico de situação</h3>
        <div className="mt-3">
          <Table head={["De", "Para", "Nota", "Quando"]}>
            {(data.events ?? []).map((event: Record<string, unknown>) => (
              <tr key={String(event["id"])} className="border-b border-border-subtle">
                <td className="px-3 py-2">{String(event["from_status"] ?? "—")}</td>
                <td className="px-3 py-2">{String(event["to_status"] ?? "")}</td>
                <td className="px-3 py-2">{String(event["note"] ?? "—")}</td>
                <td className="px-3 py-2 text-[13px] text-text-muted">
                  {new Date(String(event["created_at"])).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <h3 className="mt-6 text-[16px] font-bold">Versões</h3>
        <div className="mt-3">
          <Table head={["Versão", "Título", "Situação", "Nota", "Quando"]}>
            {(data.revisions ?? []).map((revision: Record<string, unknown>) => (
              <tr key={String(revision["id"])} className="border-b border-border-subtle">
                <td className="px-3 py-2 tabular-nums">{String(revision["version"])}</td>
                <td className="px-3 py-2">{String(revision["title"] ?? "")}</td>
                <td className="px-3 py-2">{String(revision["status"] ?? "")}</td>
                <td className="px-3 py-2">{String(revision["note"] ?? "—")}</td>
                <td className="px-3 py-2 text-[13px] text-text-muted">
                  {new Date(String(revision["created_at"])).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </section>

      {/* ---------------- Social ---------------- */}
      <section className="rounded-[12px] border border-border p-5">
        <h2 className="text-[20px] font-bold">Preparação para Instagram e LinkedIn</h2>
        <Callout tone="info" title="Exportação manual">
          O sistema não publica em nenhuma rede social. O texto abaixo é preparado, validado e
          copiado manualmente pela equipe.
        </Callout>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {SOCIAL_CHANNELS.map((channel) => (
            <SocialPanel
              key={channel}
              channel={channel}
              articleId={articleId}
              existing={
                (data.socialVariants ?? []).find(
                  (variant: Record<string, unknown>) => variant["channel"] === channel,
                ) as Record<string, unknown> | undefined
              }
              onSave={(payload) =>
                saveSocial({ data: payload }).then(() => {
                  setFeedback("Variante social salva.");
                  queryClient.invalidateQueries({ queryKey: ["admin", "content", "article"] });
                })
              }
              onExport={() =>
                exportSocial({ data: { articleId, channel, articleUrl: null } }).then(
                  (result: { text: string }) => {
                    setExported(result.text);
                    queryClient.invalidateQueries({ queryKey: ["admin", "content", "article"] });
                  },
                )
              }
            />
          ))}
        </div>

        {exported && (
          <div className="mt-5">
            <h3 className="text-[16px] font-bold">Texto para copiar</h3>
            <textarea
              readOnly
              className={`${inputClass} mt-2 min-h-[200px] font-mono text-[13px]`}
              value={exported}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function SocialPanel({
  channel,
  articleId,
  existing,
  onSave,
  onExport,
}: {
  channel: SocialChannel;
  articleId: string;
  existing: Record<string, unknown> | undefined;
  onSave: (payload: {
    articleId: string;
    channel: SocialChannel;
    headline: string;
    caption: string;
    hashtags: string[];
    callToAction: string | null;
    ready: boolean;
  }) => Promise<unknown>;
  onExport: () => Promise<unknown>;
}) {
  const limits = CHANNEL_LIMITS[channel];
  const [headline, setHeadline] = useState(String(existing?.["headline"] ?? ""));
  const [caption, setCaption] = useState(String(existing?.["caption"] ?? ""));
  const [hashtags, setHashtags] = useState(
    Array.isArray(existing?.["hashtags"]) ? (existing["hashtags"] as string[]).join(" ") : "",
  );
  const [callToAction, setCallToAction] = useState(String(existing?.["call_to_action"] ?? ""));

  const draft = {
    channel,
    headline,
    caption,
    hashtags: normalizeHashtags(hashtags.split(/[\s,]+/).filter(Boolean), channel),
    callToAction,
  };
  const issues = validateSocialDraft(draft);

  return (
    <div className="rounded-[10px] border border-border-subtle p-4">
      <h3 className="text-[16px] font-bold">{CHANNEL_LABEL[channel]}</h3>
      <p className="text-[13px] text-text-muted">
        Legenda até {limits.caption} caracteres · até {limits.hashtags} hashtags
      </p>

      <label className="mt-3 block">
        <span className="text-[13px] font-semibold">Chamada</span>
        <input
          className={inputClass}
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
        />
      </label>
      <label className="mt-3 block">
        <span className="text-[13px] font-semibold">Legenda</span>
        <textarea
          className={`${inputClass} min-h-[140px]`}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        <span className="text-[12px] text-text-muted">
          {caption.length}/{limits.caption}
        </span>
      </label>
      <label className="mt-3 block">
        <span className="text-[13px] font-semibold">Hashtags</span>
        <input
          className={inputClass}
          value={hashtags}
          onChange={(event) => setHashtags(event.target.value)}
        />
      </label>
      <label className="mt-3 block">
        <span className="text-[13px] font-semibold">Chamada para ação</span>
        <input
          className={inputClass}
          value={callToAction}
          onChange={(event) => setCallToAction(event.target.value)}
        />
      </label>

      {issues.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-[13px] text-danger">
          {issues.map((issue, index) => (
            <li key={index}>
              {issue.field}: {issue.detail}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() =>
            onSave({
              articleId,
              channel,
              headline,
              caption,
              hashtags: draft.hashtags,
              callToAction: callToAction || null,
              ready: issues.length === 0,
            })
          }
        >
          Salvar variante
        </button>
        <button
          type="button"
          className={secondaryButtonClass}
          disabled={issues.length > 0}
          onClick={() => void onExport()}
        >
          Gerar texto para copiar
        </button>
      </div>
    </div>
  );
}
