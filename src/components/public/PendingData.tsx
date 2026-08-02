import { Info } from "lucide-react";

import type { PendingField } from "@/content/institutional";

/**
 * Exibe publicamente a AUSÊNCIA de um dado, sem inventar valor (P-04 / doc 75).
 * Usado para Q-08 (contato) e Q-13 (dados legais).
 */
export function PendingDataList({ fields, title }: { fields: PendingField[]; title: string }) {
  return (
    <div className="rounded-[12px] border border-border p-5">
      <h3 className="text-[17px] font-bold">{title}</h3>
      <dl className="mt-4 space-y-3">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-wrap items-baseline gap-2">
            <dt className="text-[15px] font-semibold">{field.label}</dt>
            <dd className="text-[15px] text-text-muted">
              informação em confirmação
              <span className="sr-only"> (decisão {field.decision} pendente)</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PendingNotice({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-[8px] border border-border p-4"
      style={{ backgroundColor: "var(--feedback-info-bg)" }}
    >
      <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-info" />
      <p className="text-[15px] text-text-secondary">{children}</p>
    </div>
  );
}
