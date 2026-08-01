import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/produtos")({
  head: () =>
    buildMeta({
      title: "Catálogo de produtos",
      description:
        "Catálogo B2B AviZee organizado por segmento, aplicação, categoria e família. Estrutura em implementação.",
      provisional: true,
    }),
  component: Produtos,
});

function Produtos() {
  return (
    <PublicShell breadcrumb={[{ label: "Produtos" }]}>
      <ModulePlaceholder
        title="Catálogo de produtos"
        stage="Etapa 6"
        description="O catálogo público será organizado por segmento, aplicação, categoria e família, sem preço e sem marca de terceiros."
      />
    </PublicShell>
  );
}
