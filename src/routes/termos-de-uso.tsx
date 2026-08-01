import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/termos-de-uso")({
  head: () =>
    buildMeta({
      title: "Termos de uso",
      description: "Condições de uso do site institucional e do catálogo B2B da AviZee.",
      provisional: true,
    }),
  component: Termos,
});

function Termos() {
  return (
    <PublicShell breadcrumb={[{ label: "Termos de uso" }]}>
      <ModulePlaceholder
        title="Termos de uso"
        stage="Etapa 8"
        description="O texto definitivo depende de revisão jurídica. A estrutura da página já segue o layout aprovado."
      />
    </PublicShell>
  );
}
