import { createFileRoute, Link } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { PendingNotice } from "@/components/public/PendingData";
import {
  AUDIENCES,
  COMPLEMENTARY_SEGMENTS,
  CTA,
  DIFFERENTIATORS,
  MISSION_VISION_VALUES_APPROVED,
  NATIONAL_COVERAGE,
  POSITIONING,
} from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/sobre")({
  head: () =>
    buildMeta({
      title: "Sobre a AviZee",
      description:
        "A AviZee é especializada em equipamentos, componentes, peças e soluções para avicultura, com atendimento consultivo B2B para empresas de todo o Brasil.",
      canonical: "/sobre",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre a AviZee",
          inLanguage: "pt-BR",
          about: { "@type": "Organization", name: "AviZee", description: POSITIONING.statement },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Sobre", item: "/sobre" },
          ],
        },
      ],
    }),
  component: Sobre,
});

function Sobre() {
  return (
    <PublicShell breadcrumb={[{ label: "Sobre" }]}>
      <article className="container-avizee">
        <header className="brand-rule max-w-3xl pt-8">
          <h1 className="text-h1 font-extrabold">Sobre a AviZee</h1>
          <p className="mt-5 text-body-lg text-text-secondary">{POSITIONING.statement}</p>
        </header>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section aria-labelledby="publicos" className="border-t-2 border-emphasis pt-6">
            <h2 id="publicos" className="text-h3 font-bold">
              Públicos atendidos
            </h2>
            <ul className="mt-4 space-y-2 text-body text-text-secondary">
              {AUDIENCES.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="abrangencia" className="border-t-2 border-primary pt-6">
            <h2 id="abrangencia" className="text-h3 font-bold">
              {NATIONAL_COVERAGE.title}
            </h2>
            <p className="mt-4 text-body text-text-secondary">{NATIONAL_COVERAGE.description}</p>
          </section>
        </div>

        <section
          aria-labelledby="como-atendemos"
          className="mt-12 max-w-3xl border-l-4 border-primary pl-6"
        >
          <h2 id="como-atendemos" className="text-h2 font-bold">
            Como atendemos
          </h2>
          <p className="mt-4 text-body text-text-secondary">
            O atendimento é consultivo e B2B: identificamos a necessidade, ajudamos a definir o
            produto, a medida ou o componente adequado à aplicação apresentada e preparamos a
            cotação. O site não exibe preço nem realiza venda on-line — as condições são confirmadas
            no retorno da equipe.
          </p>
        </section>

        <section aria-labelledby="diferenciais-sobre" className="mt-12">
          <h2 id="diferenciais-sobre" className="text-h2 font-bold">
            Diferenciais
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {DIFFERENTIATORS.map((item) => (
              <li key={item.id} className="border-t-2 border-emphasis pt-5">
                <h3 className="text-h4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-body-sm text-text-secondary">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="complementares" className="mt-12 max-w-3xl bg-surface p-6">
          <h2 id="complementares" className="text-h2 font-bold">
            {COMPLEMENTARY_SEGMENTS.title}
          </h2>
          <p className="mt-4 text-body text-text-secondary">{COMPLEMENTARY_SEGMENTS.description}</p>
        </section>

        {!MISSION_VISION_VALUES_APPROVED && (
          <div className="mt-12 max-w-3xl">
            <PendingNotice>
              Missão, visão e valores ainda não têm texto aprovado e, por isso, não são publicados.
              Nenhuma história, data de fundação ou número institucional é exibido sem fonte
              confirmada.
            </PendingNotice>
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/cotacao"
            className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
          >
            {CTA.quote}
          </Link>
        </div>
      </article>
    </PublicShell>
  );
}
