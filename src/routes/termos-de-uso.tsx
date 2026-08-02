import { createFileRoute } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { PendingNotice } from "@/components/public/PendingData";
import { LEGAL_DOCUMENTS } from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

const DOC = LEGAL_DOCUMENTS.terms;

export const Route = createFileRoute("/termos-de-uso")({
  head: () =>
    buildMeta({
      title: "Termos de uso",
      description:
        "Estrutura dos termos de uso do site institucional e do catálogo B2B da AviZee, incluindo a natureza informativa da lista de cotação.",
      noindex: true,
    }),
  component: Termos,
});

function Termos() {
  return (
    <PublicShell breadcrumb={[{ label: "Termos de uso" }]}>
      <article className="container-avizee max-w-3xl">
        <h1 className="text-[34px] font-extrabold">{DOC.title}</h1>
        <p className="mt-3 text-[14px] text-text-muted">
          Versão {DOC.version} · situação: {DOC.status} · vigência: a definir
        </p>

        <div className="mt-8">
          <PendingNotice>
            Documento em rascunho, sem efeito jurídico. O texto definitivo depende de revisão
            jurídica e da confirmação da razão social e do CNPJ (decisão Q-13).
          </PendingNotice>
        </div>

        <section aria-labelledby="estrutura-termos" className="mt-10">
          <h2 id="estrutura-termos" className="text-[22px] font-bold">
            Estrutura prevista
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-[16px] text-text-secondary">
            {DOC.sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ol>
        </section>
      </article>
    </PublicShell>
  );
}
