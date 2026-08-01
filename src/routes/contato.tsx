import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/contato")({
  head: () =>
    buildMeta({
      title: "Contato",
      description: "Canais de contato da AviZee para atendimento técnico e comercial B2B.",
      provisional: true,
    }),
  component: Contato,
});

function Contato() {
  return (
    <PublicShell breadcrumb={[{ label: "Contato" }]}>
      <ModulePlaceholder
        title="Contato"
        stage="Etapa 8"
        description="O formulário de contato e o mapa só serão ativados após aprovação dos provedores de e-mail e mapa. Nenhum envio real ocorre nesta fundação."
      />
    </PublicShell>
  );
}
