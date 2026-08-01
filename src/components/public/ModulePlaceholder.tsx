import type { ReactNode } from "react";

import { Info } from "lucide-react";

/**
 * Página técnica provisória (§13 da Etapa 5).
 * Não simula conteúdo definitivo, não usa produto pendente e informa
 * explicitamente que o módulo chega em etapa posterior.
 */
export function ModulePlaceholder({
  title,
  stage,
  description,
  children,
}: {
  title: string;
  stage: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="container-avizee max-w-3xl">
      <h1 className="text-[36px] font-extrabold">{title}</h1>
      <p className="mt-4 text-[18px] text-text-secondary">{description}</p>

      <div
        role="note"
        className="mt-8 flex gap-3 rounded-[8px] border border-border p-4"
        style={{ backgroundColor: "var(--feedback-info-bg)" }}
      >
        <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-info" />
        <div>
          <p className="text-[15px] font-semibold text-info">Módulo em construção</p>
          <p className="mt-1 text-[15px] text-text-secondary">
            Esta é uma página estrutural da fundação técnica. O módulo completo será implementado na{" "}
            {stage}. Nenhum produto, artigo ou dado comercial é exibido aqui.
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
