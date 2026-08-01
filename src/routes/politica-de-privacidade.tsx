import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/public/ModulePlaceholder";
import { PublicShell } from "@/components/public/PublicShell";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    buildMeta({
      title: "Política de privacidade",
      description:
        "Como a AviZee trata dados pessoais coletados em contatos e listas de cotação, conforme a LGPD.",
      provisional: true,
    }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <PublicShell breadcrumb={[{ label: "Política de privacidade" }]}>
      <ModulePlaceholder
        title="Política de privacidade"
        stage="Etapa 8"
        description="O texto definitivo depende de revisão jurídica e da política de retenção aprovada. Nenhum tratamento de dados pessoais ocorre nesta fundação."
      />
    </PublicShell>
  );
}
