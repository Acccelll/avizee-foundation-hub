import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { useQuoteList } from "@/quotation/cart";
import type { QuoteItem } from "@/quotation/model";

/**
 * Adiciona uma variação à Lista de Cotação. Nunca exibe preço nem
 * disponibilidade de estoque; a ação é "adicionar à lista", não "comprar".
 */
export function AddToQuoteButton({
  item,
  size = "default",
}: {
  item: Omit<QuoteItem, "quantity" | "note">;
  size?: "default" | "compact";
}) {
  const quote = useQuoteList();
  const [feedback, setFeedback] = useState<string | null>(null);
  const inList = quote.has(item.productId);

  const handleClick = () => {
    const result = quote.add(item);
    setFeedback(
      result === "full"
        ? "Lista cheia: máximo de 50 itens."
        : result === "updated"
          ? "Quantidade atualizada na lista."
          : "Adicionado à lista de cotação.",
    );
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={quote.isFull && !inList}
        className={`inline-flex min-h-11 items-center gap-2 rounded-[8px] border font-semibold ${
          size === "compact" ? "px-3 text-[14px]" : "px-4 text-[15px]"
        } ${
          inList
            ? "border-emphasis bg-surface text-emphasis"
            : "border-primary bg-primary text-primary-foreground hover:opacity-90"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {inList ? (
          <Check aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Plus aria-hidden="true" className="h-4 w-4" />
        )}
        {inList ? "Na lista" : "Adicionar à lista"}
      </button>
      <span role="status" aria-live="polite" className="text-[12px] text-text-muted">
        {feedback}
      </span>
    </div>
  );
}
