import { createFileRoute, Link } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { ConfirmedDataList, PendingNotice } from "@/components/public/PendingData";
import {
  CONTACT_DETAILS,
  CONTACT_FORM_APPROVED,
  CTA,
  MAP_APPROVED,
  NATIONAL_COVERAGE,
} from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/contato")({
  head: () =>
    buildMeta({
      title: "Contato",
      description:
        "Fale com a equipe AviZee para atendimento técnico e comercial B2B em avicultura. Monte sua lista de cotação e receba o retorno da equipe.",
      canonical: "/contato",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contato — AviZee",
          inLanguage: "pt-BR",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Contato", item: "/contato" },
          ],
        },
      ],
    }),
  component: Contato,
});

function Contato() {
  return (
    <PublicShell breadcrumb={[{ label: "Contato" }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <h1 className="text-[36px] font-extrabold md:text-[44px]">Fale com a AviZee</h1>
          <p className="mt-5 text-[18px] text-text-secondary">
            O caminho mais rápido para um retorno técnico é montar a lista de cotação com os itens
            de interesse: a equipe recebe as referências exatas e responde com as condições.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="canais" className="space-y-6">
            <h2 id="canais" className="text-[24px] font-bold">
              Canais de atendimento
            </h2>
            <ConfirmedDataList title="Dados de contato" fields={CONTACT_DETAILS} />
            {!MAP_APPROVED && (
              <PendingNotice>
                O endereço acima é a referência pública da AviZee. Nesta versão do site não é
                carregado mapa externo, evitando uma integração que não é necessária para a jornada
                comercial atual.
              </PendingNotice>
            )}
          </section>

          <section aria-labelledby="atendimento-contato" className="space-y-6">
            <h2 id="atendimento-contato" className="text-[24px] font-bold">
              Como falar com a equipe agora
            </h2>
            <div className="rounded-[12px] border border-border bg-surface p-6">
              <p className="text-[16px] text-text-secondary">
                Monte a lista de cotação com as famílias e variações desejadas. Ao enviar, você
                recebe um protocolo e a equipe confirma especificações e condições no retorno.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/cotacao"
                  className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
                >
                  {CTA.quote}
                </Link>
                <Link
                  to="/produtos"
                  className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-background"
                >
                  {CTA.catalog}
                </Link>
              </div>
            </div>

            {!CONTACT_FORM_APPROVED && (
              <PendingNotice>
                A Lista de Cotação permanece como fluxo registrado para solicitações comerciais.
                Para outros assuntos, utilize os canais de atendimento informados nesta página.
              </PendingNotice>
            )}

            <div className="rounded-[12px] border border-border p-6">
              <h3 className="text-[18px] font-semibold">{NATIONAL_COVERAGE.title}</h3>
              <p className="mt-2 text-[15px] text-text-secondary">
                {NATIONAL_COVERAGE.description}
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
