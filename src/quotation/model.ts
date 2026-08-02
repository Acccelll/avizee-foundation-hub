/**
 * Modelo compartilhado da Lista de Cotação (Etapa 8).
 * Seguro para o cliente: nenhum acesso a banco, nenhum segredo.
 *
 * Regras estruturais (R-03/R-04/R-11): não existe preço, subtotal, total,
 * frete, prazo, disponibilidade de estoque, pagamento ou checkout.
 */

export const QUOTE_STORAGE_KEY = "avizee.quote.v1";
export const QUOTE_MAX_ITEMS = 50;
export const QUOTE_MAX_QUANTITY = 999999;
export const QUOTE_NOTE_MAX = 300;
/** TTL de 30 dias (doc 107 §5). */
export const QUOTE_TTL_DAYS = 30;
/** Tempo mínimo de preenchimento do formulário, em milissegundos. */
export const MIN_FILL_TIME_MS = 3000;
/** Versão do texto de consentimento registrado com a cotação. */
export const CONSENT_POLICY_VERSION = "v1-2026-08";

export const QUOTATION_STATUSES = [
  "RECEIVED",
  "IN_REVIEW",
  "WAITING_INFORMATION",
  "IN_SERVICE",
  "RESPONDED",
  "CONVERTED",
  "CLOSED",
  "SPAM",
  "CANCELLED",
] as const;

export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

/** Rótulos em português (doc 102). Nenhum rótulo sugere pedido ou venda. */
export const STATUS_LABEL: Record<QuotationStatus, string> = {
  RECEIVED: "Recebida",
  IN_REVIEW: "Em análise",
  WAITING_INFORMATION: "Aguardando informação",
  IN_SERVICE: "Em atendimento",
  RESPONDED: "Respondida",
  CONVERTED: "Convertida",
  CLOSED: "Encerrada",
  SPAM: "Spam",
  CANCELLED: "Cancelada",
};

/** Máquina de estados (doc 107 §4). Transição fora do mapa é recusada. */
export const STATUS_TRANSITIONS: Record<QuotationStatus, readonly QuotationStatus[]> = {
  RECEIVED: ["IN_REVIEW", "IN_SERVICE", "SPAM", "CANCELLED"],
  IN_REVIEW: ["WAITING_INFORMATION", "IN_SERVICE", "SPAM", "CANCELLED"],
  WAITING_INFORMATION: ["IN_REVIEW", "IN_SERVICE", "CANCELLED"],
  IN_SERVICE: ["WAITING_INFORMATION", "RESPONDED", "CANCELLED"],
  RESPONDED: ["WAITING_INFORMATION", "CONVERTED", "CLOSED"],
  CONVERTED: ["CLOSED"],
  CLOSED: [],
  SPAM: [],
  CANCELLED: [],
};

export function canTransition(from: QuotationStatus, to: QuotationStatus): boolean {
  return (STATUS_TRANSITIONS[from] ?? []).includes(to);
}

export const QUOTATION_EVENT_TYPES = [
  "CREATED",
  "STATUS_CHANGE",
  "ASSIGNMENT",
  "NOTE",
  "NOTIFICATION",
] as const;
export type QuotationEventType = (typeof QUOTATION_EVENT_TYPES)[number];

export const OUTBOX_STATUSES = ["PENDING", "SENT", "FAILED", "DEAD_LETTER", "SIMULATED"] as const;
export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];

/** Backoff aprovado (doc 114 §1), em minutos por tentativa. */
export const OUTBOX_BACKOFF_MINUTES = [1, 5, 15, 60, 240];
export const OUTBOX_MAX_ATTEMPTS = 5;

/** Item como guardado no navegador — sem qualquer dado pessoal. */
export interface QuoteItem {
  productId: string;
  sku: string;
  name: string;
  familyName: string | null;
  familySlug: string | null;
  categorySlug: string | null;
  variation: string | null;
  quantity: number;
  note: string | null;
}

export interface QuoteListState {
  version: 1;
  updatedAt: string;
  items: QuoteItem[];
}

/** Item já reconciliado pelo servidor contra o catálogo canônico. */
export interface ReconciledItem extends QuoteItem {
  available: boolean;
  familyId: string | null;
  categoryName: string | null;
}

export const BRAZIL_UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export const CONSENT_TEXT_CONTACT =
  "Autorizo a AviZee a utilizar os dados informados exclusivamente para responder a esta solicitação de cotação.";
export const CONSENT_TEXT_MARKETING =
  "Aceito receber comunicações técnicas e comerciais da AviZee. Posso revogar a qualquer momento.";

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(QUOTE_MAX_QUANTITY, Math.max(1, Math.trunc(value)));
}
