import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { PendingNotice } from "@/components/public/PendingData";
import { CTA } from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

interface Application {
  slug: string;
  name: string;
  count: number;
}

export const Route = createFileRoute("/solucoes/")({
  loader: async () => {
    const facets = await fetchFacets();
    return { applications: facets.applications as unknown as Application[] };
  },
  head: () =>
    buildMeta({
      title: "Soluções por aplicação",
      description:
        "Soluções AviZee organizadas pelas aplicações da produção avícola: vacinação, pulverização, pesagem, manejo e reposição. Fale com a equipe e monte sua cotação.",
      canonical: "/solucoes",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Soluções", item: "/solucoes" },
          ],
        },
      ],
    }),
  component: Solucoes,
});

function Solucoes() {
  const { applications } = Route.useLoaderData();

  return (
    <PublicShell breadcrumb={[{ label: "Soluções" }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <h1 className="text-[36px] font-extrabold md:text-[44px]">Soluções por necessidade</h1>
          <p className="mt-5 text-[18px] text-text-secondary">
            As soluções organizam o catálogo pela necessidade da operação, atravessando categorias.
            Cada aplicação abaixo mostra as famílias que costumam ser necessárias naquele contexto.
          </p>
        </header>

        <section aria-labelledby="aplicacoes" className="mt-12">
          <h2 id="aplicacoes" className="text-[24px] font-bold">
            Aplicações atendidas
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(applications as Application[]).map((application) => (
              <li key={application.slug}>
                <Link
                  to="/solucoes/$applicationSlug"
                  params={{ applicationSlug: application.slug }}
                  className="flex h-full flex-col rounded-[12px] border border-border p-5 hover:border-emphasis"
                >
                  <span className="text-[18px] font-semibold">{application.name}</span>
                  <span className="mt-3 text-[14px] text-text-muted tabular-nums">
                    {application.count} famílias no catálogo
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 max-w-3xl">
          <PendingNotice>
            Cada aplicação abre uma página consultiva própria, reunindo apenas famílias publicadas
            associadas àquela necessidade e conteúdos ligados a essas famílias por relação editorial
            declarada.
          </PendingNotice>
        </div>

        <section
          aria-labelledby="cta-solucoes"
          className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[12px] border border-border bg-surface p-8"
        >
          <h2 id="cta-solucoes" className="text-[22px] font-bold">
            Precisa de orientação técnica?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contato"
              className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
            >
              {CTA.talk}
            </Link>
            <Link
              to="/cotacao"
              className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-background"
            >
              {CTA.quote}
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
