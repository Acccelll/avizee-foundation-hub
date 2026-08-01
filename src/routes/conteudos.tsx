import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/conteudos")({
  head: () =>
    buildMeta({
      title: "Central de Conteúdos",
      description:
        "Conteúdo técnico AviZee para avicultura, organizado em sete categorias editoriais aprovadas. Estrutura em implementação.",
      provisional: true,
    }),
  component: Conteudos,
});

function Conteudos() {
  return (
    <PublicShell breadcrumb={[{ label: "Conteúdos" }]}>
      <ModulePlaceholder
        title="Central de Conteúdos"
        stage="Etapa 7"
        description="A Central de Conteúdos reunirá material técnico em sete categorias editoriais aprovadas, relacionado às famílias do catálogo."
      />
    </PublicShell>
  );
}
