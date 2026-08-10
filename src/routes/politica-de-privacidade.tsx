import { createFileRoute } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { ConfirmedDataList, PendingDataList, PendingNotice } from "@/components/public/PendingData";
import { LEGAL_DETAILS, LEGAL_DOCUMENTS, LEGAL_FIELDS } from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

const DOC = LEGAL_DOCUMENTS.privacy;

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    buildMeta({
      title: "Política de privacidade",
      description:
        "Estrutura da política de privacidade da AviZee: dados tratados na lista de cotação, finalidade, retenção e direitos do titular conforme a LGPD.",
      // Documento em rascunho: não indexável até o fechamento do conteúdo jurídico.
      noindex: true,
    }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <PublicShell breadcrumb={[{ label: "Política de privacidade" }]}>
      <article className="container-avizee max-w-3xl">
        <h1 className="text-[34px] font-extrabold">{DOC.title}</h1>
        <p className="mt-3 text-[14px] text-text-muted">
          Versão {DOC.version} · situação: {DOC.status} · vigência: a definir
        </p>

        <div className="mt-8">
          <PendingNotice>
            Este documento permanece em rascunho enquanto o inventário final de operadores e a
            revisão jurídica do texto não forem concluídos. Os dados confirmados abaixo já refletem
            as decisões atuais da AviZee.
          </PendingNotice>
        </div>

        <section aria-labelledby="estrutura" className="mt-10">
          <h2 id="estrutura" className="text-[22px] font-bold">
            Estrutura prevista
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-[16px] text-text-secondary">
            {DOC.sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="dados-legais" className="mt-10">
          <h2 id="dados-legais" className="text-[22px] font-bold">
            Informações legais e de privacidade
          </h2>
          <div className="mt-4 space-y-4">
            <ConfirmedDataList title="Dados confirmados" fields={LEGAL_DETAILS} />
            {LEGAL_FIELDS.length > 0 && (
              <PendingDataList title="Dados ainda em fechamento" fields={LEGAL_FIELDS} />
            )}
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
