/**
 * Detalhe da solicitação de cotação (Etapa 8).
 * Somente leitura comercial + ações de situação, responsável, notas internas
 * e reenfileiramento de notificação. Nenhum valor, preço ou condição comercial.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import {
  addInternalNote,
  fetchQuotation,
  requeueNotification,
  setQuotationOwner,
  updateQuotationStatus,
} from "@/quotation/admin.functions";
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
import {
  STATUS_LABEL,
  STATUS_TRANSITIONS,
  type QuotationStatus,
} from "@/quotation/model";

interface DetailItem {
  id: string;
  sku: string;
  name: string;
  variation: string | null;
  family: string | null;
  category: string | null;
  quantity: number;
  note: string | null;
  wasAvailable: boolean;
  stillPublished: boolean;
}

interface DetailEvent {
  id: string;
  type: string;
  fromStatus: string | null;
  toStatus: string | null;
  actorLabel: string | null;
  note: string | null;
  createdAt: string;
}

interface DetailNotification {
  id: string;
  type: string;
  status: string;
  attempts: number;
  nextAttemptAt: string | null;
  processedAt: string | null;
  lastError: string | null;
}

interface QuotationDetail {
  id: string;
  protocol: string;
  status: QuotationStatus;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string | null;
  stateUf: string | null;
  message: string | null;
  preferredChannel: string | null;
  assignedTo: string | null;
  itemCount: number;
  unavailableItemCount: number;
  createdAt: string;
  updatedAt: string;
  items: DetailItem[];
  events: DetailEvent[];
  source: Record<string, string | null> | null;
  notifications: DetailNotification[];
}

const EVENT_LABEL: Record<string, string> = {
  CREATED: "Solicitação registrada",
  STATUS_CHANGE: "Mudança de situação",
  ASSIGNMENT: "Responsável",
  NOTE: "Nota interna",
  NOTIFICATION: "Notificação",
};

export const Route = createFileRoute("/admin/_protected/cotacoes_/$quotationId")({
  head: () =>
    buildMeta({
      title: "Detalhe da cotação",
      description: "Solicitação de cotação recebida pelo site.",
    }),
  component: QuotationDetailPage,
});

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("pt-BR") : "—";
}

function QuotationDetailPage() {
  const { quotationId } = Route.useParams();
  const queryClient = useQueryClient();

  const load = useServerFn(fetchQuotation);
  const changeStatus = useServerFn(updateQuotationStatus);
  const setOwner = useServerFn(setQuotationOwner);
  const addNote = useServerFn(addInternalNote);
  const requeue = useServerFn(requeueNotification);

  const [note, setNote] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [nextStatus, setNextStatus] = useState<QuotationStatus | "">("");

  const query = useQuery({
    queryKey: ["admin", "quotation", quotationId],
    queryFn: () => load({ data: { id: quotationId } }),
  });
  const quotation = query.data as QuotationDetail | undefined;

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["admin", "quotation", quotationId] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "quotations"] });
  }

  const statusMutation = useMutation({
    mutationFn: () =>
      changeStatus({
        data: {
          id: quotationId,
          toStatus: nextStatus as QuotationStatus,
          note: statusNote.trim() || null,
        },
      }),
    onSuccess: () => {
      setNextStatus("");
      setStatusNote("");
      invalidate();
    },
  });

  const ownerMutation = useMutation({
    mutationFn: (assign: boolean) =>
      setOwner({ data: { id: quotationId, userId: assign ? null : null } }),
  });

  const noteMutation = useMutation({
    mutationFn: () => addNote({ data: { id: quotationId, note: note.trim() } }),
    onSuccess: () => {
      setNote("");
      invalidate();
    },
  });

  const requeueMutation = useMutation({
    mutationFn: (id: string) => requeue({ data: { id } }),
    onSuccess: invalidate,
  });

  const allowed = quotation ? STATUS_TRANSITIONS[quotation.status] : [];

  return (
    <div>
      <PageHeader
        title={quotation ? `Cotação ${quotation.protocol}` : "Cotação"}
        description="Registro da solicitação. O site não gera preço, proposta, prazo nem confirmação de estoque."
        actions={
          <Link to="/admin/cotacoes" className={secondaryButtonClass}>
            Voltar
          </Link>
        }
      />

      <QueryState isLoading={query.isLoading} error={query.error}>
        {quotation && (
          <>
            <dl className="mb-8 grid gap-4 sm:grid-cols-4">
              <div className="rounded-[8px] border border-border p-4">
                <dt className="text-[13px] uppercase text-text-muted">Situação</dt>
                <dd className="mt-1">
                  <StatusBadge value={STATUS_LABEL[quotation.status]} />
                </dd>
              </div>
              <div className="rounded-[8px] border border-border p-4">
                <dt className="text-[13px] uppercase text-text-muted">Itens</dt>
                <dd className="mt-1 text-[22px] font-extrabold tabular-nums">
                  {quotation.itemCount}
                </dd>
              </div>
              <div className="rounded-[8px] border border-border p-4">
                <dt className="text-[13px] uppercase text-text-muted">Recebida em</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatDate(quotation.createdAt)}
                </dd>
              </div>
              <div className="rounded-[8px] border border-border p-4">
                <dt className="text-[13px] uppercase text-text-muted">Atualizada em</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatDate(quotation.updatedAt)}
                </dd>
              </div>
            </dl>

            {quotation.unavailableItemCount > 0 && (
              <div className="mb-6">
                <Callout tone="warning" title="Itens fora de publicação">
                  {quotation.unavailableItemCount} item(ns) desta lista não estavam publicados no
                  momento do envio. O texto gravado é o snapshot enviado pelo solicitante.
                </Callout>
              </div>
            )}

            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[8px] border border-border p-4">
                <h2 className="mb-3 text-[18px] font-bold">Solicitante</h2>
                <dl className="grid gap-2 text-[14px]">
                  <Row label="Empresa" value={quotation.companyName} />
                  <Row label="Contato" value={quotation.contactName} />
                  <Row label="E-mail" value={quotation.contactEmail} />
                  <Row label="Telefone" value={quotation.contactPhone} />
                  <Row
                    label="Localidade"
                    value={
                      [quotation.city, quotation.stateUf].filter(Boolean).join(" / ") || "—"
                    }
                  />
                  <Row label="Canal preferido" value={quotation.preferredChannel ?? "—"} />
                </dl>
                {quotation.message && (
                  <p className="mt-4 whitespace-pre-wrap rounded-[6px] bg-surface-alt p-3 text-[14px]">
                    {quotation.message}
                  </p>
                )}
              </div>

              <div className="rounded-[8px] border border-border p-4">
                <h2 className="mb-3 text-[18px] font-bold">Origem</h2>
                <dl className="grid gap-2 text-[14px]">
                  <Row label="Página" value={quotation.source?.["origin_page"] ?? "—"} />
                  <Row label="Referrer" value={quotation.source?.["referrer"] ?? "—"} />
                  <Row label="utm_source" value={quotation.source?.["utm_source"] ?? "—"} />
                  <Row label="utm_medium" value={quotation.source?.["utm_medium"] ?? "—"} />
                  <Row label="utm_campaign" value={quotation.source?.["utm_campaign"] ?? "—"} />
                </dl>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-[20px] font-bold">Itens solicitados</h2>
              <Table head={["SKU", "Item", "Variação", "Quantidade", "Observação", "Situação"]}>
                {quotation.items.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-3 py-2 font-semibold tabular-nums">{item.sku}</td>
                    <td className="px-3 py-2">
                      {item.name}
                      {item.family && (
                        <span className="block text-[12px] text-text-muted">{item.family}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{item.variation ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{item.quantity}</td>
                    <td className="px-3 py-2">{item.note ?? "—"}</td>
                    <td className="px-3 py-2">
                      <StatusBadge
                        value={
                          !item.wasAvailable
                            ? "PENDENTE — fora de publicação"
                            : item.stillPublished
                              ? "PUBLISHED"
                              : "PENDENTE — despublicado depois"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </Table>
            </section>

            <section className="mb-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[8px] border border-border p-4">
                <h2 className="mb-3 text-[18px] font-bold">Mudar situação</h2>
                {allowed.length === 0 ? (
                  <p className="text-[14px] text-text-secondary">
                    Situação final: nenhuma transição disponível.
                  </p>
                ) : (
                  <form
                    className="grid gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (nextStatus) statusMutation.mutate();
                    }}
                  >
                    <label className="block text-[14px] font-semibold" htmlFor="nova-situacao">
                      Nova situação
                    </label>
                    <select
                      id="nova-situacao"
                      className={inputClass}
                      value={nextStatus}
                      onChange={(event) =>
                        setNextStatus(event.target.value as QuotationStatus | "")
                      }
                    >
                      <option value="">Selecione</option>
                      {allowed.map((value) => (
                        <option key={value} value={value}>
                          {STATUS_LABEL[value]}
                        </option>
                      ))}
                    </select>
                    <label className="block text-[14px] font-semibold" htmlFor="nota-situacao">
                      Nota interna (opcional)
                    </label>
                    <input
                      id="nota-situacao"
                      className={inputClass}
                      value={statusNote}
                      onChange={(event) => setStatusNote(event.target.value)}
                      maxLength={2000}
                    />
                    <button
                      type="submit"
                      className={buttonClass}
                      disabled={!nextStatus || statusMutation.isPending}
                    >
                      {statusMutation.isPending ? "Aplicando…" : "Aplicar"}
                    </button>
                    {statusMutation.error && (
                      <p role="alert" className="text-[13px] text-error">
                        {readableError(statusMutation.error)}
                      </p>
                    )}
                  </form>
                )}
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-[13px] text-text-secondary">
                    Responsável atual: {quotation.assignedTo ? "definido" : "não atribuído"}.
                  </p>
                  {quotation.assignedTo && (
                    <button
                      type="button"
                      className={`${secondaryButtonClass} mt-2`}
                      disabled={ownerMutation.isPending}
                      onClick={() =>
                        ownerMutation.mutate(true, { onSuccess: () => invalidate() })
                      }
                    >
                      Remover responsável
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-[8px] border border-border p-4">
                <h2 className="mb-3 text-[18px] font-bold">Nota interna</h2>
                <form
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (note.trim().length >= 2) noteMutation.mutate();
                  }}
                >
                  <label className="sr-only" htmlFor="nova-nota">
                    Nota interna
                  </label>
                  <textarea
                    id="nova-nota"
                    className="min-h-[120px] w-full rounded-[8px] border border-border bg-background p-3 text-[14px]"
                    value={note}
                    maxLength={2000}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Registro interno. Não é enviado ao solicitante."
                  />
                  <button
                    type="submit"
                    className={buttonClass}
                    disabled={note.trim().length < 2 || noteMutation.isPending}
                  >
                    {noteMutation.isPending ? "Registrando…" : "Registrar nota"}
                  </button>
                  {noteMutation.error && (
                    <p role="alert" className="text-[13px] text-error">
                      {readableError(noteMutation.error)}
                    </p>
                  )}
                </form>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 text-[20px] font-bold">Notificações</h2>
              <Table
                head={["Tipo", "Situação", "Tentativas", "Próxima tentativa", "Erro", ""]}
              >
                {quotation.notifications.map((message) => (
                  <tr key={message.id} className="border-t border-border">
                    <td className="px-3 py-2">{message.type}</td>
                    <td className="px-3 py-2">
                      <StatusBadge value={message.status} />
                    </td>
                    <td className="px-3 py-2 tabular-nums">{message.attempts}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatDate(message.nextAttemptAt)}
                    </td>
                    <td className="px-3 py-2 text-[13px] text-text-muted">
                      {message.lastError ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        className="font-semibold underline disabled:opacity-50"
                        disabled={requeueMutation.isPending || message.status === "SENT"}
                        onClick={() => requeueMutation.mutate(message.id)}
                      >
                        Reenfileirar
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            </section>

            <section>
              <h2 className="mb-3 text-[20px] font-bold">Histórico</h2>
              <ol className="grid gap-3">
                {quotation.events.map((event) => (
                  <li key={event.id} className="rounded-[8px] border border-border p-3">
                    <p className="text-[14px] font-semibold">
                      {EVENT_LABEL[event.type] ?? event.type}
                      {event.toStatus && (
                        <span className="font-normal">
                          {" "}
                          — {event.fromStatus ? `${STATUS_LABEL[event.fromStatus as QuotationStatus] ?? event.fromStatus} → ` : ""}
                          {STATUS_LABEL[event.toStatus as QuotationStatus] ?? event.toStatus}
                        </span>
                      )}
                    </p>
                    {event.note && (
                      <p className="mt-1 whitespace-pre-wrap text-[14px]">{event.note}</p>
                    )}
                    <p className="mt-1 text-[12px] text-text-muted tabular-nums">
                      {formatDate(event.createdAt)}
                      {event.actorLabel ? ` · ${event.actorLabel}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </QueryState>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
