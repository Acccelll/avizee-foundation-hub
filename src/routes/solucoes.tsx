import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/solucoes")({
  head: () =>
    buildMeta({
      title: "Soluções por aplicação",
      description:
        "Soluções AviZee organizadas por aplicação e segmento produtivo da avicultura. Estrutura em implementação.",
      provisional: true,
    }),
  component: Solucoes,
});

function Solucoes() {
  return (
    <PublicShell breadcrumb={[{ label: "Soluções" }]}>
      <ModulePlaceholder
        title="Soluções"
        stage="Etapa 6"
        description="As soluções serão apresentadas por aplicação e segmento, conectando necessidade produtiva às famílias do catálogo."
      />
    </PublicShell>
  );
}
