import { createFileRoute, Link } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/")({
  head: () =>
    buildMeta({
      title: "Soluções para avicultura",
      description:
        "AviZee: equipamentos, insumos e soluções técnicas para avicultura, com atendimento B2B por lista de cotação.",
    }),
  component: Home,
});

function Home() {
  return (
    <PublicShell>
      <div className="container-avizee">
        <section className="max-w-3xl">
          <p className="text-[14px] font-semibold uppercase tracking-widest text-emphasis">
            Avicultura
          </p>
          <h1 className="mt-3 text-[36px] font-extrabold md:text-[48px]">
            Soluções técnicas para produção avícola
          </h1>
          <p className="mt-5 text-[18px] text-text-secondary">
            Catálogo B2B, conteúdo técnico e atendimento por lista de cotação. Sem preço público,
            sem carrinho: você monta a lista e a equipe AviZee responde com a proposta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/produtos"
              className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
            >
              Ver catálogo
            </Link>
            <Link
              to="/cotacao"
              className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
            >
              Lista de cotação
            </Link>
          </div>
        </section>

        <section aria-labelledby="fundacao" className="mt-16 border-t border-border-subtle pt-8">
          <h2 id="fundacao" className="text-[22px] font-bold">
            Estado da implementação
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] text-text-secondary">
            Esta versão contém apenas a fundação técnica (Etapa 5): shell público, shell
            administrativo, rotas base, tokens, tipografia, segurança e testes. Catálogo, cotação e
            Central de Conteúdos serão implementados nas etapas seguintes.
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
