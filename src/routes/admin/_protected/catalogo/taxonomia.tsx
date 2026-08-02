import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { buildMeta } from "@/seo/meta";
import { fetchTaxonomy } from "@/catalog/catalog.functions";
import { PageHeader, QueryState, Table } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_protected/catalogo/taxonomia")({
  head: () => buildMeta({ title: "Taxonomia", description: "Categorias, segmentos e aplicações." }),
  component: TaxonomyPage,
});

function TaxonomyPage() {
  const load = useServerFn(fetchTaxonomy);
  const query = useQuery({ queryKey: ["admin", "taxonomy"], queryFn: () => load() });

  const blocks = [
    { title: "Categorias públicas", rows: query.data?.categories ?? [] },
    { title: "Subcategorias funcionais", rows: query.data?.subcategories ?? [] },
    { title: "Segmentos", rows: query.data?.segments ?? [] },
    { title: "Aplicações", rows: query.data?.applications ?? [] },
    { title: "Soluções", rows: query.data?.solutions ?? [] },
  ];

  return (
    <div>
      <PageHeader
        title="Taxonomia do catálogo"
        description="Estrutura aprovada. Criar, renomear ou desativar exige permissão de gestão de taxonomia e fica auditado."
      />
      <QueryState isLoading={query.isLoading} error={query.error}>
        {blocks.map((block) => (
          <section key={block.title} className="mb-8">
            <h2 className="mb-3 text-[20px] font-bold">{block.title}</h2>
            {block.rows.length === 0 ? (
              <p className="text-text-muted">Nenhum registro cadastrado.</p>
            ) : (
              <Table head={["Código", "Nome", "Slug", "Ativo"]}>
                {block.rows.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-3 py-2">{row.code ?? "—"}</td>
                    <td className="px-3 py-2 font-semibold">{row.name}</td>
                    <td className="px-3 py-2">{row.slug}</td>
                    <td className="px-3 py-2">{row.is_active ? "sim" : "não"}</td>
                  </tr>
                ))}
              </Table>
            )}
          </section>
        ))}
      </QueryState>
    </div>
  );
}
