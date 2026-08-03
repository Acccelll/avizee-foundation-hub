/**
 * Templates de mensagem versionados no repositório (doc 114 §3).
 * Texto puro, sem HTML de terceiro, sem marca de terceiro, sem preço,
 * sem prazo de entrega e sem qualquer dado além do necessário.
 */

export interface QuotationMessageData {
  protocol: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string | null;
  stateUf: string | null;
  message: string | null;
  items: {
    sku: string;
    name: string;
    variation: string | null;
    quantity: number;
    note: string | null;
    available: boolean;
  }[];
  adminUrl: string;
}

export const TEMPLATE_VERSION = "v1";

function itemLines(data: QuotationMessageData): string {
  return data.items
    .map((item) => {
      const variation = item.variation ? ` — ${item.variation}` : "";
      const note = item.note ? ` | obs.: ${item.note}` : "";
      const flag = item.available ? "" : " [item fora de publicação]";
      return `- ${item.sku} ${item.name}${variation} | quantidade estimada: ${item.quantity}${note}${flag}`;
    })
    .join("\n");
}

export function internalNoticeTemplate(data: QuotationMessageData) {
  return {
    subject: `Nova lista de cotação ${data.protocol}`,
    text: [
      `Protocolo: ${data.protocol}`,
      `Empresa: ${data.companyName}`,
      `Contato: ${data.contactName} — ${data.contactEmail} — ${data.contactPhone}`,
      data.city || data.stateUf
        ? `Localidade: ${[data.city, data.stateUf].filter(Boolean).join(" / ")}`
        : null,
      "",
      "Itens solicitados:",
      itemLines(data),
      data.message ? `\nMensagem do solicitante:\n${data.message}` : null,
      "",
      `Abrir no painel comercial: ${data.adminUrl}`,
      "",
      "Esta mensagem não contém preço, prazo ou condição comercial.",
    ]
      .filter((line) => line !== null)
      .join("\n"),
  };
}

export function confirmationTemplate(data: QuotationMessageData) {
  return {
    subject: `Recebemos sua lista de cotação — ${data.protocol}`,
    text: [
      `Olá, ${data.contactName}.`,
      "",
      `Recebemos sua lista de cotação. Guarde o protocolo ${data.protocol} para acompanhamento.`,
      "",
      "Itens registrados:",
      itemLines(data),
      "",
      "Nossa equipe técnica vai analisar a solicitação e retornar pelo canal informado.",
      "Este é um registro de solicitação: não é pedido, não é compra e não contém valores.",
      "",
      "AviZee — soluções técnicas para avicultura.",
    ].join("\n"),
  };
}
