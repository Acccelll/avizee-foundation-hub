import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { QuoteForm, type QuoteFormValues } from "@/components/public/quotation/QuoteForm";
import { QuoteItemsTable } from "@/components/public/quotation/QuoteItemsTable";
import { useQuoteList } from "@/quotation/cart";
import type { ReconciledItem } from "@/quotation/model";
import { reconcileQuoteList, sendQuotation } from "@/quotation/quotation.functions";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/cotacao")({
  head: () =>
    buildMeta({
      title: "Lista de cotação",
      description:
        "Reúna referências técnicas AviZee e envie sua lista de cotação. Sem preço, sem carrinho e sem checkout: você recebe um protocolo e a resposta da equipe.",
      noindex: true,
    }),
  component: Cotacao,
});

interface SubmittedState {
  protocol: string;
  idempotent: boolean;
  itemCount: number;
}

function Confirmation({ result }: { result: SubmittedState }) {
  return (
    <div className="container-avizee max-w-2xl">
      <div className="rounded-[12px] border border-border bg-surface p-8">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-success" />
        <h1 className="mt-4 text-[32px] font-extrabold">Lista de cotação registrada</h1>
        <p className="mt-4 text-[17px] text-text-secondary">
          {result.idempotent
            ? "Esta solicitação já havia sido registrada. O protocolo é o mesmo."
            : "Recebemos sua solicitação. Nossa equipe técnica analisa os itens e retorna pelo canal informado."}
        </p>
        <p className="mt-6 text-[14px] uppercase tracking-widest text-text-muted">Protocolo</p>
        <p className="text-[28px] font-extrabold tabular-nums">{result.protocol}</p>
        <p className="mt-2 text-[15px] text-text-secondary">
          {result.itemCount} {result.itemCount === 1 ? "item registrado" : "itens registrados"}.
          Guarde o protocolo para acompanhamento.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/produtos"
            className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
          >
            Continuar navegando
          </Link>
          <Link
            to="/contato"
            className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface-alt"
          >
            Falar com a equipe
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyList() {
  return (
    <div className="container-avizee max-w-2xl text-center">
      <ClipboardList aria-hidden="true" className="mx-auto h-12 w-12 text-text-muted" />
      <h1 className="mt-4 text-[32px] font-extrabold">Sua lista de cotação está vazia</h1>
      <p className="mt-4 text-[17px] text-text-secondary">
        Navegue pelo catálogo técnico e adicione as referências que deseja cotar. Nenhum preço é
        exibido no site: a resposta é uma proposta técnica da equipe AviZee.
      </p>
      <Link
        to="/produtos"
        className="mt-8 inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
      >
        Ver catálogo
      </Link>
    </div>
  );
}

function Cotacao() {
  const quote = useQuoteList();
  const reconcile = useServerFn(reconcileQuoteList);
  const submit = useServerFn(sendQuotation);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmittedState | null>(null);
  const requestId = useRef<string>(crypto.randomUUID());

  const productIds = useMemo(() => quote.items.map((i) => i.productId).join(","), [quote.items]);

  const reconciliation = useQuery({
    queryKey: ["quote", "reconcile", productIds],
    enabled: quote.hydrated && quote.items.length > 0 && !result,
    queryFn: () =>
      reconcile({
        data: {
          items: quote.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        },
      }),
  });

  const reconciled: ReconciledItem[] | null = reconciliation.data?.items ?? null;
  const unavailable = reconciled?.filter((i) => !i.available).length ?? 0;
  const allUnavailable = Boolean(
    reconciled && reconciled.length > 0 && unavailable === reconciled.length,
  );

  const mutation = useMutation({
    mutationFn: (values: QuoteFormValues) =>
      submit({
        data: {
          clientRequestId: requestId.current,
          companyName: values.companyName.trim(),
          contactName: values.contactName.trim(),
          contactEmail: values.contactEmail.trim(),
          contactPhone: values.contactPhone.trim(),
          city: values.city.trim() || null,
          stateUf: (values.stateUf || null) as never,
          message: values.message.trim() || null,
          preferredChannel: values.preferredChannel,
          consentMarketing: values.consentMarketing,
          honeypot: values.honeypot,
          elapsedMs: values.elapsedMs,
          items: quote.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            note: i.note,
            fallbackSku: i.sku,
            fallbackName: i.name,
          })),
          origin: {
            page: typeof window === "undefined" ? null : window.location.pathname,
            referrer: typeof document === "undefined" ? null : document.referrer || null,
          },
        },
      }),
    onSuccess: (data) => {
      // A lista local só é limpa depois da confirmação do servidor.
      setResult({
        protocol: data.protocol,
        idempotent: data.idempotent,
        itemCount: data.itemCount,
      });
      quote.clear();
    },
    onError: () => {
      setSubmitError(
        "Não foi possível registrar a lista agora. Seus itens foram preservados — tente novamente em instantes.",
      );
    },
  });

  useEffect(() => {
    if (mutation.isPending) setSubmitError(null);
  }, [mutation.isPending]);

  const validate = (values: QuoteFormValues) => {
    const next: Record<string, string> = {};
    if (values.companyName.trim().length < 2) next["companyName"] = "Informe o nome da empresa.";
    if (values.contactName.trim().length < 2) next["contactName"] = "Informe o nome do contato.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail.trim()))
      next["contactEmail"] = "Informe um e-mail válido.";
    if (values.contactPhone.trim().length < 8) next["contactPhone"] = "Informe um telefone válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  if (result) {
    return (
      <PublicShell breadcrumb={[{ label: "Lista de cotação" }]}>
        <Confirmation result={result} />
      </PublicShell>
    );
  }

  if (quote.hydrated && quote.items.length === 0) {
    return (
      <PublicShell breadcrumb={[{ label: "Lista de cotação" }]}>
        <EmptyList />
      </PublicShell>
    );
  }

  return (
    <PublicShell breadcrumb={[{ label: "Lista de cotação" }]}>
      <div className="container-avizee grid gap-12">
        <header className="max-w-3xl">
          <h1 className="text-[34px] font-extrabold md:text-[40px]">Lista de cotação</h1>
          <p className="mt-4 text-[18px] text-text-secondary">
            Revise os itens, ajuste as quantidades estimadas e envie. A AviZee responde com uma
            proposta técnica: o site não exibe preço, não processa pagamento e não reserva estoque.
          </p>
        </header>

        {unavailable > 0 && (
          <div
            role="status"
            className="flex gap-3 rounded-[8px] border border-emphasis bg-surface p-4"
          >
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-emphasis" />
            <p className="text-[15px]">
              {unavailable === 1
                ? "1 item saiu de publicação e está sinalizado como indisponível para cotação."
                : `${unavailable} itens saíram de publicação e estão sinalizados como indisponíveis.`}{" "}
              Você pode removê-los; os demais seguem normalmente.
            </p>
          </div>
        )}

        <QuoteItemsTable
          items={quote.items}
          reconciled={reconciled}
          onQuantity={quote.setQuantity}
          onNote={quote.setNote}
          onRemove={quote.remove}
        />

        <div className="flex flex-wrap gap-3">
          <Link
            to="/produtos"
            className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
          >
            Continuar navegando
          </Link>
          <button
            type="button"
            onClick={quote.clear}
            className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
          >
            Limpar lista
          </button>
        </div>

        <section aria-labelledby="dados-contato" className="max-w-3xl">
          <h2 id="dados-contato" className="text-[24px] font-bold">
            Dados para retorno
          </h2>
          <p className="mt-2 text-[16px] text-text-secondary">
            Pedimos apenas o necessário para responder à sua solicitação.
          </p>

          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-[8px] border border-emphasis bg-surface p-4 text-[15px]"
            >
              {submitError}
            </div>
          )}

          <div className="mt-6">
            <QuoteForm
              disabled={allUnavailable || quote.items.length === 0}
              submitting={mutation.isPending}
              errors={errors}
              onSubmit={(values) => {
                if (!validate(values)) return;
                mutation.mutate(values);
              }}
            />
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
