import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { fetchProduct, saveProduct, updateStatus } from "@/catalog/catalog.functions";
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
import { toPublicProduct } from "@/catalog/serializer";

export const Route = createFileRoute("/admin/_protected/catalogo/skus_/$productId")({
  head: () => buildMeta({ title: "SKU", description: "Edição de SKU e variação." }),
  component: ProductDetail,
});

const TABS = ["Identidade", "Interno", "Códigos", "Especificações", "Imagens", "Prévia"] as const;

function ProductDetail() {
  const { productId } = Route.useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Identidade");
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useServerFn(fetchProduct);
  const save = useServerFn(saveProduct);
  const changeStatus = useServerFn(updateStatus);

  const query = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => load({ data: { id: productId } }),
  });

  const saveMutation = useMutation({
    mutationFn: save,
    onSuccess: () => {
      setFeedback("Alterações registradas e auditadas.");
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      setFeedback("Estado atualizado.");
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    },
  });

  const product = query.data?.product;

  return (
    <div>
      <PageHeader
        title={product ? `${product["public_sku"]} · ${product["public_name"]}` : "SKU"}
        description="Identidade pública, dados internos, códigos, especificações e imagens."
        actions={
          <Link to="/admin/catalogo/skus" className={secondaryButtonClass}>
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
        {(saveMutation.error || statusMutation.error) && (
          <div className="mb-4">
            <Callout tone="danger" title="Operação recusada">
              {readableError(saveMutation.error ?? statusMutation.error)}
            </Callout>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge value={product?.["review_status"]} />
          <StatusBadge value={product?.["publication_status"]} />
          {(REVIEW_TRANSITIONS[product?.["review_status"] as never] ?? []).map((next: string) => (
            <button
              key={next}
              type="button"
              className={secondaryButtonClass}
              onClick={() =>
                statusMutation.mutate({
                  data: { entity: "products", id: productId, reviewStatus: next as never },
                })
              }
            >
              Revisão → {next}
            </button>
          ))}
          {(PUBLICATION_TRANSITIONS[product?.["publication_status"] as never] ?? []).map((next: string) => (
            <button
              key={next}
              type="button"
              className={secondaryButtonClass}
              onClick={() =>
                statusMutation.mutate({
                  data: { entity: "products", id: productId, publicationStatus: next as never },
                })
              }
            >
              Publicação → {next}
            </button>
          ))}
        </div>

        <div role="tablist" aria-label="Seções do SKU" className="mb-5 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              role="tab"
              type="button"
              aria-selected={tab === item}
              className={
                tab === item
                  ? "rounded-[8px] bg-primary px-3 py-2 text-[14px] font-semibold text-primary-foreground"
                  : "rounded-[8px] border border-border px-3 py-2 text-[14px]"
              }
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {(tab === "Identidade" || tab === "Interno") && product && (
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const text = (key: string) => String(form.get(key) ?? "") || null;
              saveMutation.mutate({
                data: {
                  id: productId,
                  family_id: String(product["family_id"]),
                  public_sku: String(form.get("public_sku") ?? product["public_sku"]),
                  public_name: String(form.get("public_name") ?? product["public_name"]),
                  slug: text("slug"),
                  variation_label: text("variation_label"),
                  measure: text("measure"),
                  capacity: text("capacity"),
                  unit: text("unit"),
                  public_description: text("public_description"),
                  is_on_request: form.get("is_on_request") === "on",
                  internal_brand: text("internal_brand"),
                  internal_manufacturer: text("internal_manufacturer"),
                  internal_supplier_reference: text("internal_supplier_reference"),
                  internal_original_name: text("internal_original_name"),
                  internal_notes: text("internal_notes"),
                },
              });
            }}
          >
            {tab === "Identidade" ? (
              <>
                <Field label="SKU público">
                  <input name="public_sku" defaultValue={product["public_sku"] ?? ""} className={inputClass} required />
                </Field>
                <Field label="Nome público" hint="Marca de terceiro é recusada automaticamente.">
                  <input name="public_name" defaultValue={product["public_name"] ?? ""} className={inputClass} required />
                </Field>
                <Field label="Slug">
                  <input name="slug" defaultValue={product["slug"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Variação">
                  <input name="variation_label" defaultValue={product["variation_label"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Medida">
                  <input name="measure" defaultValue={product["measure"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Capacidade">
                  <input name="capacity" defaultValue={product["capacity"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Unidade">
                  <input name="unit" defaultValue={product["unit"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Descrição pública">
                  <textarea
                    name="public_description"
                    defaultValue={product["public_description"] ?? ""}
                    className="min-h-20 w-full rounded-[8px] border border-border bg-background p-3 text-[14px]"
                  />
                </Field>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_on_request" defaultChecked={Boolean(product["is_on_request"])} />
                  <span className="text-[14px] font-semibold">Produto sob consulta</span>
                </label>
              </>
            ) : (
              <>
                <Callout tone="warning" title="Campos internos">
                  Visíveis apenas na administração. Nunca são serializados para o site público.
                </Callout>
                <div />
                <Field label="Marca (interna)">
                  <input name="internal_brand" defaultValue={product["internal_brand"] ?? ""} className={inputClass} />
                </Field>
                <Field label="Fabricante (interno)">
                  <input
                    name="internal_manufacturer"
                    defaultValue={product["internal_manufacturer"] ?? ""}
                    className={inputClass}
                  />
                </Field>
                <Field label="Referência do fornecedor">
                  <input
                    name="internal_supplier_reference"
                    defaultValue={product["internal_supplier_reference"] ?? ""}
                    className={inputClass}
                  />
                </Field>
                <Field label="Nome original de origem">
                  <input
                    name="internal_original_name"
                    defaultValue={product["internal_original_name"] ?? ""}
                    className={inputClass}
                  />
                </Field>
                <Field label="Observações internas">
                  <textarea
                    name="internal_notes"
                    defaultValue={product["internal_notes"] ?? ""}
                    className="min-h-20 w-full rounded-[8px] border border-border bg-background p-3 text-[14px]"
                  />
                </Field>
              </>
            )}
            <div className="md:col-span-2">
              <button type="submit" className={buttonClass} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando…" : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}

        {tab === "Códigos" && (
          <Table head={["Código", "Tipo", "Origem", "Válido", "Público"]}>
            {query.data?.codes.map((code) => (
              <tr key={code["id"]} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{code["code"]}</td>
                <td className="px-3 py-2">{code["code_type"]}</td>
                <td className="px-3 py-2">{code["source"] ?? "—"}</td>
                <td className="px-3 py-2">{code["is_valid"] ? "sim" : "não"}</td>
                <td className="px-3 py-2">{code["is_public"] ? "sim" : "não"}</td>
              </tr>
            ))}
          </Table>
        )}

        {tab === "Especificações" && (
          <Table head={["Definição", "Valor", "Pública", "Sobrescrita"]}>
            {query.data?.specifications.map((spec) => (
              <tr key={spec["id"]} className="border-t border-border">
                <td className="px-3 py-2">{spec["specification_definitions"]?.label ?? spec["definition_id"]}</td>
                <td className="px-3 py-2">
                  {spec["value_text"] ?? spec["value_num"] ?? String(spec["value_bool"] ?? "—")}
                </td>
                <td className="px-3 py-2">{spec["specification_definitions"]?.is_public ? "sim" : "não"}</td>
                <td className="px-3 py-2">{spec["is_override"] ? "sim" : "herdada"}</td>
              </tr>
            ))}
          </Table>
        )}

        {tab === "Imagens" && (
          <Table head={["Ativo", "Papel", "Revisão", "Direitos", "Texto alternativo"]}>
            {query.data?.images.map((image) => (
              <tr key={image["id"]} className="border-t border-border">
                <td className="px-3 py-2">{image["media_assets"]?.internal_title ?? "—"}</td>
                <td className="px-3 py-2">{image["role"]}</td>
                <td className="px-3 py-2">
                  <StatusBadge value={image["media_assets"]?.review_status} />
                </td>
                <td className="px-3 py-2">{image["media_assets"]?.rights_status ?? "—"}</td>
                <td className="px-3 py-2">{image["media_assets"]?.alt_text ?? "—"}</td>
              </tr>
            ))}
          </Table>
        )}

        {tab === "Prévia" && product && (
          <section>
            <Callout tone="info" title="Prévia segura">
              Renderiza exatamente os campos que o site público receberia. Campos internos são
              descartados na serialização, não escondidos no frontend.
            </Callout>
            <pre className="mt-4 overflow-x-auto rounded-[8px] border border-border bg-surface-alt p-4 text-[13px]">
              {JSON.stringify(
                toPublicProduct({
                  product,
                  family: product["product_families"] ?? null,
                  specifications: (query.data?.specifications ?? [])
                    .filter((spec) => spec["specification_definitions"]?.is_public)
                    .map((spec) => ({
                      code: spec["specification_definitions"]?.code ?? "",
                      label: spec["specification_definitions"]?.label ?? "",
                      value: String(spec["value_text"] ?? spec["value_num"] ?? spec["value_bool"] ?? ""),
                      unit: null,
                    })),
                }),
                null,
                2,
              )}
            </pre>
          </section>
        )}
      </QueryState>
    </div>
  );
}
