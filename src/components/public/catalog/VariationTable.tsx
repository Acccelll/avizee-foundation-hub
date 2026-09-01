import { useState } from "react";

import type { FamilyVariation } from "@/catalog/public/read.server";
import { useQuoteList } from "@/quotation/cart";

/**
 * Tabela de variações da família. SKU em Montserrat com `tabular-nums`
 * (D-058). Sem preço, sem estoque, sem marca — apenas atributos públicos.
 * A seleção prepara a Lista de Cotação, implementada na Etapa 8.
 */
export function VariationTable({
  variations,
  preselected,
  familyName,
  familySlug,
  categorySlug,
}: {
  variations: FamilyVariation[];
  preselected?: string | undefined;
  familyName: string;
  familySlug: string;
  categorySlug: string;
}) {
  const [selected, setSelected] = useState<string | null>(preselected ?? null);
  const quote = useQuoteList();

  const hasMeasure = variations.some((v) => v.measure);
  const hasCapacity = variations.some((v) => v.capacity);
  const hasUnit = variations.some((v) => v.unit);

  return (
    <div className="overflow-x-auto rounded-[12px] border border-border">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">
          Variações disponíveis desta família, com referência pública e atributos técnicos.
        </caption>
        <thead className="bg-surface text-[13px] uppercase tracking-wide text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Referência
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Variação
            </th>
            {hasMeasure && (
              <th scope="col" className="px-4 py-3 font-semibold">
                Medida
              </th>
            )}
            {hasCapacity && (
              <th scope="col" className="px-4 py-3 font-semibold">
                Capacidade
              </th>
            )}
            {hasUnit && (
              <th scope="col" className="px-4 py-3 font-semibold">
                Unidade
              </th>
            )}
            <th scope="col" className="px-4 py-3 font-semibold">
              <span className="sr-only">Seleção para cotação</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {variations.map((variation) => {
            const selectedHere = selected === variation.sku;
            const inList = quote.has(variation.id);
            const active = selectedHere || inList;

            const handleAction = () => {
              if (inList) return;

              if (!selectedHere) {
                setSelected(variation.sku);
                return;
              }

              quote.add({
                productId: variation.id,
                sku: variation.sku,
                name: variation.name,
                familyName,
                familySlug,
                categorySlug,
                variation: variation.variationLabel,
              });
            };

            return (
              <tr
                key={variation.id}
                className={`border-t border-border-subtle ${active ? "bg-surface" : ""}`}
              >
                <th scope="row" className="px-4 py-3 font-semibold tabular-nums">
                  {variation.sku}
                </th>
                <td className="px-4 py-3 text-text-secondary">
                  {variation.variationLabel ?? variation.name}
                </td>
                {hasMeasure && (
                  <td className="px-4 py-3 tabular-nums text-text-secondary">
                    {variation.measure ?? "—"}
                  </td>
                )}
                {hasCapacity && (
                  <td className="px-4 py-3 tabular-nums text-text-secondary">
                    {variation.capacity ?? "—"}
                  </td>
                )}
                {hasUnit && (
                  <td className="px-4 py-3 text-text-secondary">{variation.unit ?? "—"}</td>
                )}
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={handleAction}
                    aria-pressed={active}
                    className={`inline-flex min-h-11 items-center rounded-[8px] border px-4 text-[14px] font-semibold ${
                      active
                        ? "border-emphasis bg-surface text-emphasis"
                        : "border-border hover:bg-surface"
                    }`}
                  >
                    {inList ? "Na lista" : selectedHere ? "Adicionar à lista" : "Selecionar"}
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
        A montagem e o envio da Lista de Cotação são liberados na próxima etapa. Nenhum preço é
        exibido no site.
      </p>
    </div>
  );
}
