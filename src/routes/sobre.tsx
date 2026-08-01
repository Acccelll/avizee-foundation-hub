import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/sobre")({
  head: () =>
    buildMeta({
      title: "Sobre a AviZee",
      description:
        "Quem é a AviZee: atuação técnica em avicultura, atendimento B2B e compromisso com informação verificável.",
      provisional: true,
    }),
  component: Sobre,
});

function Sobre() {
  return (
    <PublicShell breadcrumb={[{ label: "Sobre" }]}>
      <ModulePlaceholder
        title="Sobre a AviZee"
        stage="Etapa 8"
        description="O conteúdo institucional definitivo será redigido e aprovado antes da publicação; nesta fundação existe apenas a estrutura da página."
      />
    </PublicShell>
  );
}
