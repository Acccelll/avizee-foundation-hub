import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchFamily, fetchTaxonomy, saveFamily, updateStatus } from "@/catalog/catalog.functions";
import {
  Callout,
  Field,
  PageHeader,
  QueryState,
  StatusBadge,
  Table,
  buttonClass,
  inputClass,
  readableError,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { PUBLICATION_TRANSITIONS, REVIEW_TRANSITIONS } from "@/catalog/types";

export const Route = createFileRoute("/admin/_protected/catalogo/familias_/$familyId")({
  head: () => buildMeta({ title: "Família de produtos", description: "Edição de família." }),
  component: FamilyDetail,
});

function FamilyDetail() {
  const { familyId } = Route.useParams();
  const queryClient = useQueryClient();
  const load = useServerFn(fetchFamily);
  const loadTaxonomy = useServerFn(fetchTaxonomy);
  const save = useServerFn(saveFamily);
  const changeStatus = useServerFn(updateStatus);
  const [feedback, setFeedback] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "family", familyId],
    queryFn: () => load({ data: { id: familyId } }),
  });
  const taxonomy = useQuery({ queryKey: ["admin", "taxonomy"], queryFn: () => loadTaxonomy() });

  const saveMutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      setFeedback("Alterações registradas e auditadas.");
      queryClient.invalidateQueries({ queryKey: ["admin", "family", familyId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "families"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      setFeedback("Estado atualizado.");
      queryClient.invalidateQueries({ queryKey: ["admin", "family", familyId] });
    },
  });

  const family = query.data?.family;

  return (
    <div>
      <PageHeader
        title={family?.["public_name"] ?? "Família"}
        description="Nome público, taxonomia e estado. Marca de terceiro é bloqueada em campos públicos."
        actions={
          <Link to="/admin/catalogo/familias" className={secondaryButtonClass}>
            Voltar
          </Link>
        }
      />

      <QueryState isLoading={query.isLoading} error={query.error}>
        {feedback && (
          <div className="mb-4">
            <Callout tone="success" title={feedback} />
          </div>
        )}
        {saveMutation.error && (
          <div className="mb-4">
            <Callout tone="danger" title="Alteração recusada">
              {readableError(saveMutation.error)}
            </Callout>
          </div>
        )}
        {statusMutation.error && (
          <div className="mb-4">
            <Callout tone="danger" title="Transição recusada">
              {readableError(statusMutation.error)}
            </Callout>
          </div>
        )}

        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            saveMutation.mutate({
              data: {
                id: familyId,
                public_name: String(form.get("public_name") ?? ""),
                admin_name: String(form.get("admin_name") ?? "") || null,
                slug: String(form.get("slug") ?? ""),
                category_id: String(form.get("category_id") ?? "") || null,
                summary: String(form.get("summary") ?? "") || null,
                public_description: String(form.get("public_description") ?? "") || null,
                internal_notes: String(form.get("internal_notes") ?? "") || null,
              },
            });
          }}
        >
          <Field label="Nome público" hint="Nunca pode conter marca de terceiro.">
            <input name="public_name" defaultValue={family?.["public_name"] ?? ""} className={inputClass} required />
          </Field>
          <Field label="Nome interno" hint="Uso administrativo. Pode registrar a origem.">
            <input name="admin_name" defaultValue={family?.["admin_name"] ?? ""} className={inputClass} />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={family?.["slug"] ?? ""} className={inputClass} required />
          </Field>
          <Field label="Categoria">
            <select name="category_id" defaultValue={family?.["category_id"] ?? ""} className={inputClass}>
              <option value="">Sem categoria</option>
              {taxonomy.data?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Resumo público">
            <textarea name="summary" defaultValue={family?.["summary"] ?? ""} className="min-h-20 w-full rounded-[8px] border border-border bg-background p-3 text-[14px]" />
          </Field>
          <Field label="Descrição pública">
            <textarea
              name="public_description"
              defaultValue={family?.["public_description"] ?? ""}
              className="min-h-20 w-full rounded-[8px] border border-border bg-background p-3 text-[14px]"
            />
          </Field>
          <Field label="Observações internas" hint="Nunca exibidas no site público.">
            <textarea
              name="internal_notes"
              defaultValue={family?.["internal_notes"] ?? ""}
              className="min-h-20 w-full rounded-[8px] border border-border bg-background p-3 text-[14px]"
            />
          </Field>
          <div className="md:col-span-2">
            <button type="submit" className={buttonClass} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </form>

        <section className="mt-10">
          <h2 className="text-[20px] font-bold">Estado</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge value={family?.["review_status"]} />
            <StatusBadge value={family?.["publication_status"]} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {((REVIEW_TRANSITIONS as Record<string, string[]>)[family?.["review_status"] ] ?? []).map((next: string) => (
              <button
                key={next}
                type="button"
                className={secondaryButtonClass}
                onClick={() =>
                  statusMutation.mutate({
                    data: { entity: "product_families", id: familyId, reviewStatus: next as never },
                  })
                }
              >
                Revisão → {next}
              </button>
            ))}
            {((PUBLICATION_TRANSITIONS as Record<string, string[]>)[family?.["publication_status"] ] ?? []).map((next: string) => (
              <button
                key={next}
                type="button"
                className={secondaryButtonClass}
                onClick={() =>
                  statusMutation.mutate({
                    data: { entity: "product_families", id: familyId, publicationStatus: next as never },
                  })
                }
              >
                Publicação → {next}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-[20px] font-bold">SKUs desta família</h2>
          {(query.data?.products.length ?? 0) === 0 ? (
            <p className="text-text-muted">Nenhum SKU vinculado.</p>
          ) : (
            <Table head={["SKU", "Nome", "Revisão", ""]}>
              {query.data?.products.map((product) => (
                <tr key={product["id"]} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums">{product["public_sku"]}</td>
                  <td className="px-3 py-2">{product["public_name"]}</td>
                  <td className="px-3 py-2">
                    <StatusBadge value={product["review_status"]} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to="/admin/catalogo/skus/$productId"
                      params={{ productId: String(product["id"]) }}
                      className="underline"
                    >
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </section>
      </QueryState>
    </div>
  );
}
