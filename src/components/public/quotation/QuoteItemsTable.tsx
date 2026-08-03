import { Link } from "@tanstack/react-router";
import { AlertTriangle, Trash2 } from "lucide-react";

import { QUOTE_MAX_QUANTITY, QUOTE_NOTE_MAX, type ReconciledItem } from "@/quotation/model";
import type { QuoteItem } from "@/quotation/model";

/**
 * Tabela editável da Lista de Cotação. Sem preço, sem subtotal, sem total,
 * sem frete e sem disponibilidade de estoque (R-03/R-04/R-11).
 */
export function QuoteItemsTable({
  items,
  reconciled,
  onQuantity,
  onNote,
  onRemove,
}: {
  items: QuoteItem[];
  reconciled: ReconciledItem[] | null;
  onQuantity: (productId: string, quantity: number) => void;
  onNote: (productId: string, note: string) => void;
  onRemove: (productId: string) => void;
}) {
  const statusOf = (productId: string) =>
    reconciled?.find((r) => r.productId === productId)?.available ?? null;

  return (
    <div className="overflow-x-auto rounded-[12px] border border-border">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">
          Itens reunidos na sua lista de cotação, com quantidade estimada e observação.
        </caption>
        <thead className="bg-surface text-[13px] uppercase tracking-wide text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Referência
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Item
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Quantidade estimada
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Observação
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              <span className="sr-only">Remover</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const available = statusOf(item.productId);
            return (
              <tr key={item.productId} className="border-t border-border-subtle align-top">
                <th scope="row" className="px-4 py-4 font-semibold tabular-nums">
                  {item.sku}
                  {available === false && (
                    <span className="mt-2 flex items-center gap-1 text-[12px] font-medium text-emphasis">
                      <AlertTriangle aria-hidden="true" className="h-4 w-4" />
                      Indisponível para cotação
                    </span>
                  )}
                </th>
                <td className="px-4 py-4">
                  {item.categorySlug && item.familySlug ? (
                    <Link
                      to="/produtos/$categorySlug/$familySlug"
                      params={{ categorySlug: item.categorySlug, familySlug: item.familySlug }}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {item.variation && (
                    <span className="block text-[14px] text-text-secondary">{item.variation}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <label className="sr-only" htmlFor={`qtd-${item.productId}`}>
                    Quantidade estimada de {item.sku}
                  </label>
                  <input
                    id={`qtd-${item.productId}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={QUOTE_MAX_QUANTITY}
                    value={item.quantity}
                    onChange={(e) => onQuantity(item.productId, Number(e.target.value))}
                    className="h-11 w-28 rounded-[8px] border border-border bg-background px-3 tabular-nums"
                  />
                </td>
                <td className="px-4 py-4">
                  <label className="sr-only" htmlFor={`obs-${item.productId}`}>
                    Observação para {item.sku}
                  </label>
                  <input
                    id={`obs-${item.productId}`}
                    type="text"
                    maxLength={QUOTE_NOTE_MAX}
                    value={item.note ?? ""}
                    placeholder="Opcional"
                    onChange={(e) => onNote(item.productId, e.target.value)}
                    className="h-11 w-full min-w-[12rem] rounded-[8px] border border-border bg-background px-3"
                  />
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(item.productId)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-border px-3 text-[14px] font-semibold hover:bg-surface"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    Remover
                    <span className="sr-only">{item.sku}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p
        role="note"
        className="border-t border-border-subtle px-4 py-3 text-[14px] text-text-muted"
      >
        Esta lista não é um pedido e não contém preço, prazo ou condição comercial. A equipe AviZee
        responde com uma proposta técnica.
      </p>
    </div>
  );
}
