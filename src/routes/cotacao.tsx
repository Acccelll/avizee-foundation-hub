import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/cotacao")({
  head: () =>
    buildMeta({
      title: "Lista de cotação",
      description:
        "A lista de cotação AviZee substitui carrinho e checkout: você reúne itens e recebe uma proposta técnica.",
      provisional: true,
    }),
  component: Cotacao,
});

function Cotacao() {
  return (
    <PublicShell breadcrumb={[{ label: "Lista de cotação" }]}>
      <ModulePlaceholder
        title="Lista de cotação"
        stage="Etapa 7"
        description="A lista de cotação é a conversão principal do site. Não existe preço, carrinho ou checkout. O fluxo completo, com registro e protocolo, será implementado na etapa específica."
      >
        <p className="mt-6 rounded-[8px] border border-border p-4 text-[15px] text-text-secondary">
          Nesta fundação nenhuma cotação é registrada e nenhuma mensagem é enviada.
        </p>
      </ModulePlaceholder>
    </PublicShell>
  );
}
