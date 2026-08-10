import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertCircle,
  Box,
  ChevronDown,
  ChevronUp,
  Heading2,
  HelpCircle,
  Image as ImageIcon,
  List as ListIcon,
  Minus,
  Plus,
  Quote,
  Table as TableIcon,
  Trash2,
  Type,
} from "lucide-react";

import { fetchCatalog } from "@/catalog/public/public.functions";
import { inputClass, secondaryButtonClass } from "@/components/admin/ui";
import { BLOCK_TYPES, type ContentBlock } from "@/content/blocks";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

type CalloutTone = Extract<ContentBlock, { type: "callout" }>["tone"];

interface FamilyOption {
  slug: string;
  name: string;
  categoryName: string;
  variationCount: number;
}

function moveItem<T>(items: T[], index: number, direction: "up" | "down"): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const current = next[index];
  const targetItem = next[target];
  if (current === undefined || targetItem === undefined) return items;
  next[index] = targetItem;
  next[target] = current;
  return next;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [familySearch, setFamilySearch] = useState<Record<number, string>>({});
  const loadCatalog = useServerFn(fetchCatalog);

  const familyOptionsQuery = useQuery({
    queryKey: ["admin", "content", "public-family-options"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<FamilyOption[]> => {
      const first = await loadCatalog({ data: { ordem: "category", pagina: 1 } });
      const remainingPages = Array.from(
        { length: Math.max(0, first.pageCount - 1) },
        (_, index) => index + 2,
      );
      const remaining = await Promise.all(
        remainingPages.map((page) => loadCatalog({ data: { ordem: "category", pagina: page } })),
      );
      const options = [first, ...remaining].flatMap((page) =>
        page.items.map((family) => ({
          slug: family.slug,
          name: family.name,
          categoryName: family.categoryName,
          variationCount: family.variationCount,
        })),
      );
      return [...new Map(options.map((option) => [option.slug, option])).values()].sort(
        (a, b) =>
          a.categoryName.localeCompare(b.categoryName, "pt-BR") ||
          a.name.localeCompare(b.name, "pt-BR"),
      );
    },
  });

  const toggleExpand = (index: number) => {
    setExpanded((previous) => ({ ...previous, [index]: !previous[index] }));
  };

  const updateBlock = (index: number, patch: Partial<ContentBlock>) => {
    const next = [...blocks];
    const current = next[index];
    if (!current) return;
    next[index] = { ...current, ...patch } as ContentBlock;
    onChange(next);
  };

  const removeBlock = (index: number) => {
    if (confirm("Remover este bloco?")) {
      onChange(blocks.filter((_, itemIndex) => itemIndex !== index));
    }
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    onChange(moveItem(blocks, index, direction));
  };

  const addBlock = (type: (typeof BLOCK_TYPES)[number]) => {
    let newBlock: ContentBlock;
    switch (type) {
      case "heading":
        newBlock = { type, level: 2, text: "" };
        break;
      case "paragraph":
        newBlock = { type, text: "" };
        break;
      case "list":
        newBlock = { type, ordered: false, items: [""] };
        break;
      case "quote":
        newBlock = { type, text: "", attribution: "" };
        break;
      case "image":
        newBlock = { type, url: null, alt: "", caption: null, credit: null };
        break;
      case "callout":
        newBlock = { type, tone: "info", text: "", title: "" };
        break;
      case "table":
        newBlock = { type, caption: null, headers: [""], rows: [[""]] };
        break;
      case "faq":
        newBlock = { type, items: [{ question: "", answer: "" }] };
        break;
      case "product_relation":
        newBlock = { type, familySlug: "", note: "" };
        break;
      case "divider":
        newBlock = { type };
        break;
    }
    onChange([...blocks, newBlock]);
    setExpanded((previous) => ({ ...previous, [blocks.length]: true }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
          >
            <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded p-1 hover:bg-muted"
                  onClick={() => moveBlock(index, "up")}
                  disabled={index === 0}
                  aria-label={`Mover bloco ${index + 1} para cima`}
                >
                  <ChevronUp aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-1 hover:bg-muted"
                  onClick={() => moveBlock(index, "down")}
                  disabled={index === blocks.length - 1}
                  aria-label={`Mover bloco ${index + 1} para baixo`}
                >
                  <ChevronDown aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted/60">
                  {block.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded p-1.5 text-text-secondary hover:bg-muted"
                  onClick={() => toggleExpand(index)}
                  aria-expanded={Boolean(expanded[index])}
                  aria-label={`${expanded[index] ? "Recolher" : "Expandir"} bloco ${index + 1}`}
                >
                  {expanded[index] ? (
                    <ChevronUp aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 text-danger hover:bg-danger/10"
                  onClick={() => removeBlock(index)}
                  aria-label={`Remover bloco ${index + 1}`}
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expanded[index] && (
              <div className="space-y-4 p-4">
                {block.type === "heading" && (
                  <div className="flex gap-4">
                    <label className="w-24">
                      <span className="sr-only">Nível do título</span>
                      <select
                        className={`${inputClass} w-24`}
                        value={block.level}
                        onChange={(event) =>
                          updateBlock(index, { level: Number(event.target.value) as 2 | 3 })
                        }
                      >
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                      </select>
                    </label>
                    <label className="flex-1">
                      <span className="sr-only">Texto do título</span>
                      <input
                        className={inputClass}
                        value={block.text}
                        onChange={(event) => updateBlock(index, { text: event.target.value })}
                        placeholder="Título da seção"
                      />
                    </label>
                  </div>
                )}

                {block.type === "paragraph" && (
                  <label className="block">
                    <span className="sr-only">Parágrafo</span>
                    <textarea
                      className={`${inputClass} min-h-[120px] font-body leading-relaxed`}
                      value={block.text}
                      onChange={(event) => updateBlock(index, { text: event.target.value })}
                      placeholder="Escreva seu texto aqui..."
                    />
                  </label>
                )}

                {block.type === "list" && (
                  <div className="space-y-2">
                    <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={block.ordered}
                        onChange={(event) => updateBlock(index, { ordered: event.target.checked })}
                      />
                      Lista numerada
                    </label>
                    {block.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <label className="flex-1">
                          <span className="sr-only">Item {itemIndex + 1}</span>
                          <input
                            className={inputClass}
                            value={item}
                            onChange={(event) => {
                              const nextItems = [...block.items];
                              nextItems[itemIndex] = event.target.value;
                              updateBlock(index, { items: nextItems });
                            }}
                            placeholder={`Item ${itemIndex + 1}`}
                          />
                        </label>
                        <button
                          type="button"
                          className="p-2 text-text-muted hover:text-text-primary"
                          onClick={() =>
                            updateBlock(index, {
                              items: moveItem(block.items, itemIndex, "up"),
                            })
                          }
                          disabled={itemIndex === 0}
                          aria-label={`Mover item ${itemIndex + 1} para cima`}
                        >
                          <ChevronUp aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-text-muted hover:text-text-primary"
                          onClick={() =>
                            updateBlock(index, {
                              items: moveItem(block.items, itemIndex, "down"),
                            })
                          }
                          disabled={itemIndex === block.items.length - 1}
                          aria-label={`Mover item ${itemIndex + 1} para baixo`}
                        >
                          <ChevronDown aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-text-muted hover:text-danger"
                          onClick={() =>
                            updateBlock(index, {
                              items: block.items.filter(
                                (_, currentIndex) => currentIndex !== itemIndex,
                              ),
                            })
                          }
                          disabled={block.items.length === 1}
                          aria-label={`Remover item ${itemIndex + 1}`}
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-terracota hover:underline"
                      onClick={() => updateBlock(index, { items: [...block.items, ""] })}
                    >
                      <Plus aria-hidden="true" className="h-3 w-3" /> Adicionar item
                    </button>
                  </div>
                )}

                {block.type === "quote" && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="sr-only">Texto da citação</span>
                      <textarea
                        className={`${inputClass} min-h-[80px] italic`}
                        value={block.text}
                        onChange={(event) => updateBlock(index, { text: event.target.value })}
                        placeholder="Texto da citação..."
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Atribuição da citação</span>
                      <input
                        className={inputClass}
                        value={block.attribution ?? ""}
                        onChange={(event) =>
                          updateBlock(index, { attribution: event.target.value })
                        }
                        placeholder="Autor/Fonte"
                      />
                    </label>
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[11px] font-semibold text-text-muted">URL HTTPS</span>
                      <input
                        className={inputClass}
                        value={block.url ?? ""}
                        onChange={(event) =>
                          updateBlock(index, { url: event.target.value || null })
                        }
                        placeholder="https://..."
                      />
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label>
                        <span className="text-[11px] font-semibold text-text-muted">
                          Texto alternativo
                        </span>
                        <input
                          className={inputClass}
                          value={block.alt}
                          onChange={(event) => updateBlock(index, { alt: event.target.value })}
                          placeholder="Descrição objetiva da imagem"
                        />
                      </label>
                      <label>
                        <span className="text-[11px] font-semibold text-text-muted">Legenda</span>
                        <input
                          className={inputClass}
                          value={block.caption ?? ""}
                          onChange={(event) => updateBlock(index, { caption: event.target.value })}
                          placeholder="Legenda (opcional)"
                        />
                      </label>
                      <label>
                        <span className="text-[11px] font-semibold text-text-muted">Crédito</span>
                        <input
                          className={inputClass}
                          value={block.credit ?? ""}
                          onChange={(event) => updateBlock(index, { credit: event.target.value })}
                          placeholder="Crédito (opcional)"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {block.type === "callout" && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[11px] font-semibold text-text-muted">Tom</span>
                      <select
                        className={inputClass}
                        value={block.tone}
                        onChange={(event) =>
                          updateBlock(index, { tone: event.target.value as CalloutTone })
                        }
                      >
                        <option value="info">Informação</option>
                        <option value="warning">Aviso</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="sr-only">Título do destaque</span>
                      <input
                        className={`${inputClass} font-bold`}
                        value={block.title ?? ""}
                        onChange={(event) => updateBlock(index, { title: event.target.value })}
                        placeholder="Título do destaque (opcional)"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">Conteúdo do destaque</span>
                      <textarea
                        className={inputClass}
                        value={block.text}
                        onChange={(event) => updateBlock(index, { text: event.target.value })}
                        placeholder="Conteúdo do destaque..."
                      />
                    </label>
                  </div>
                )}

                {block.type === "table" && (
                  <div className="space-y-3 overflow-x-auto p-1">
                    <label className="block">
                      <span className="text-[11px] font-semibold text-text-muted">Legenda</span>
                      <input
                        className={inputClass}
                        value={block.caption ?? ""}
                        onChange={(event) => updateBlock(index, { caption: event.target.value })}
                        placeholder="Legenda da tabela (opcional)"
                      />
                    </label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded bg-muted px-2 py-1 text-[10px] font-bold hover:bg-muted/80"
                        onClick={() =>
                          updateBlock(index, {
                            headers: [...block.headers, ""],
                            rows: block.rows.map((row) => [...row, ""]),
                          })
                        }
                        disabled={block.headers.length >= 6}
                      >
                        + Coluna
                      </button>
                      <button
                        type="button"
                        className="rounded bg-muted px-2 py-1 text-[10px] font-bold hover:bg-muted/80"
                        onClick={() =>
                          updateBlock(index, {
                            headers: block.headers.slice(0, -1),
                            rows: block.rows.map((row) => row.slice(0, -1)),
                          })
                        }
                        disabled={block.headers.length <= 1}
                      >
                        − Coluna
                      </button>
                      <button
                        type="button"
                        className="rounded bg-muted px-2 py-1 text-[10px] font-bold hover:bg-muted/80"
                        onClick={() =>
                          updateBlock(index, {
                            rows: [...block.rows, block.headers.map(() => "")],
                          })
                        }
                        disabled={block.rows.length >= 40}
                      >
                        + Linha
                      </button>
                      <button
                        type="button"
                        className="rounded bg-muted px-2 py-1 text-[10px] font-bold hover:bg-muted/80"
                        onClick={() => updateBlock(index, { rows: block.rows.slice(0, -1) })}
                        disabled={block.rows.length <= 1}
                      >
                        − Linha
                      </button>
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {block.headers.map((header, headerIndex) => (
                            <th key={headerIndex} className="border border-border p-1">
                              <label>
                                <span className="sr-only">Cabeçalho {headerIndex + 1}</span>
                                <input
                                  className="w-full border-none bg-transparent text-center text-[11px] font-bold focus:ring-0"
                                  value={header}
                                  onChange={(event) => {
                                    const next = [...block.headers];
                                    next[headerIndex] = event.target.value;
                                    updateBlock(index, { headers: next });
                                  }}
                                />
                              </label>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-border p-1">
                                <label>
                                  <span className="sr-only">
                                    Linha {rowIndex + 1}, coluna {cellIndex + 1}
                                  </span>
                                  <input
                                    className="w-full border-none bg-transparent text-[11px] focus:ring-0"
                                    value={cell}
                                    onChange={(event) => {
                                      const nextRows = block.rows.map((currentRow) => [
                                        ...currentRow,
                                      ]);
                                      const targetRow = nextRows[rowIndex];
                                      if (targetRow) {
                                        targetRow[cellIndex] = event.target.value;
                                        updateBlock(index, { rows: nextRows });
                                      }
                                    }}
                                  />
                                </label>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {block.type === "faq" && (
                  <div className="space-y-4">
                    {block.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2 rounded-md bg-muted/20 p-3">
                        <label className="block">
                          <span className="sr-only">Pergunta {itemIndex + 1}</span>
                          <input
                            className={`${inputClass} font-semibold`}
                            value={item.question}
                            onChange={(event) => {
                              const next = [...block.items];
                              next[itemIndex] = { ...item, question: event.target.value };
                              updateBlock(index, { items: next });
                            }}
                            placeholder="Pergunta"
                          />
                        </label>
                        <label className="block">
                          <span className="sr-only">Resposta {itemIndex + 1}</span>
                          <textarea
                            className={inputClass}
                            value={item.answer}
                            onChange={(event) => {
                              const next = [...block.items];
                              next[itemIndex] = { ...item, answer: event.target.value };
                              updateBlock(index, { items: next });
                            }}
                            placeholder="Resposta"
                          />
                        </label>
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="rounded p-1.5 text-text-muted hover:bg-muted"
                            onClick={() =>
                              updateBlock(index, {
                                items: moveItem(block.items, itemIndex, "up"),
                              })
                            }
                            disabled={itemIndex === 0}
                            aria-label={`Mover pergunta ${itemIndex + 1} para cima`}
                          >
                            <ChevronUp aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1.5 text-text-muted hover:bg-muted"
                            onClick={() =>
                              updateBlock(index, {
                                items: moveItem(block.items, itemIndex, "down"),
                              })
                            }
                            disabled={itemIndex === block.items.length - 1}
                            aria-label={`Mover pergunta ${itemIndex + 1} para baixo`}
                          >
                            <ChevronDown aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1.5 text-danger hover:bg-danger/10"
                            onClick={() =>
                              updateBlock(index, {
                                items: block.items.filter(
                                  (_, currentIndex) => currentIndex !== itemIndex,
                                ),
                              })
                            }
                            disabled={block.items.length === 1}
                            aria-label={`Remover pergunta ${itemIndex + 1}`}
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs font-bold text-terracota hover:underline"
                      onClick={() =>
                        updateBlock(index, {
                          items: [...block.items, { question: "", answer: "" }],
                        })
                      }
                      disabled={block.items.length >= 15}
                    >
                      <Plus aria-hidden="true" className="h-3 w-3" /> Adicionar pergunta
                    </button>
                  </div>
                )}

                {block.type === "product_relation" &&
                  (() => {
                    const search = (familySearch[index] ?? "").trim().toLocaleLowerCase("pt-BR");
                    const usedSlugs = new Set(
                      blocks
                        .filter(
                          (
                            candidate,
                          ): candidate is Extract<ContentBlock, { type: "product_relation" }> =>
                            candidate.type === "product_relation",
                        )
                        .map((candidate) => candidate.familySlug)
                        .filter(Boolean),
                    );
                    const options = (familyOptionsQuery.data ?? []).filter((option) => {
                      if (!search) return true;
                      return [option.name, option.slug, option.categoryName].some((value) =>
                        value.toLocaleLowerCase("pt-BR").includes(search),
                      );
                    });
                    const currentExists = (familyOptionsQuery.data ?? []).some(
                      (option) => option.slug === block.familySlug,
                    );

                    return (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                            Buscar família pública
                          </span>
                          <input
                            className={inputClass}
                            value={familySearch[index] ?? ""}
                            onChange={(event) =>
                              setFamilySearch((previous) => ({
                                ...previous,
                                [index]: event.target.value,
                              }))
                            }
                            placeholder="Nome, categoria ou slug"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                            Família relacionada
                          </span>
                          <select
                            className={inputClass}
                            value={block.familySlug}
                            disabled={familyOptionsQuery.isLoading || familyOptionsQuery.isError}
                            onChange={(event) => {
                              updateBlock(index, { familySlug: event.target.value });
                              setFamilySearch((previous) => ({ ...previous, [index]: "" }));
                            }}
                          >
                            <option value="">
                              {familyOptionsQuery.isLoading
                                ? "Carregando famílias…"
                                : familyOptionsQuery.isError
                                  ? "Não foi possível carregar as famílias"
                                  : "Selecione uma família"}
                            </option>
                            {block.familySlug && !currentExists && (
                              <option value={block.familySlug}>
                                {block.familySlug} — referência inválida
                              </option>
                            )}
                            {options.map((option) => (
                              <option
                                key={option.slug}
                                value={option.slug}
                                disabled={
                                  option.slug !== block.familySlug && usedSlugs.has(option.slug)
                                }
                              >
                                {option.name} — {option.categoryName} ({option.variationCount}{" "}
                                variações)
                              </option>
                            ))}
                          </select>
                        </label>
                        {block.familySlug && !currentExists && !familyOptionsQuery.isLoading && (
                          <p className="text-[12px] text-danger" role="alert">
                            A família informada não está disponível na camada pública do catálogo.
                          </p>
                        )}
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                            Nota editorial
                          </span>
                          <input
                            className={inputClass}
                            value={block.note ?? ""}
                            onChange={(event) => updateBlock(index, { note: event.target.value })}
                            placeholder="Por que esta família é relevante para o artigo..."
                          />
                        </label>
                      </div>
                    );
                  })()}

                {block.type === "divider" && (
                  <div className="flex items-center justify-center py-8" aria-label="Divisor">
                    <div className="h-px w-1/2 bg-border" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 sm:grid-cols-5">
        <button type="button" onClick={() => addBlock("heading")} className={secondaryButtonClass}>
          <Heading2 aria-hidden="true" className="mr-2 h-4 w-4" /> Título
        </button>
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className={secondaryButtonClass}
        >
          <Type aria-hidden="true" className="mr-2 h-4 w-4" /> Texto
        </button>
        <button type="button" onClick={() => addBlock("list")} className={secondaryButtonClass}>
          <ListIcon aria-hidden="true" className="mr-2 h-4 w-4" /> Lista
        </button>
        <button type="button" onClick={() => addBlock("quote")} className={secondaryButtonClass}>
          <Quote aria-hidden="true" className="mr-2 h-4 w-4" /> Citação
        </button>
        <button type="button" onClick={() => addBlock("image")} className={secondaryButtonClass}>
          <ImageIcon aria-hidden="true" className="mr-2 h-4 w-4" /> Imagem
        </button>
        <button type="button" onClick={() => addBlock("callout")} className={secondaryButtonClass}>
          <AlertCircle aria-hidden="true" className="mr-2 h-4 w-4" /> Destaque
        </button>
        <button type="button" onClick={() => addBlock("table")} className={secondaryButtonClass}>
          <TableIcon aria-hidden="true" className="mr-2 h-4 w-4" /> Tabela
        </button>
        <button type="button" onClick={() => addBlock("faq")} className={secondaryButtonClass}>
          <HelpCircle aria-hidden="true" className="mr-2 h-4 w-4" /> FAQ
        </button>
        <button
          type="button"
          onClick={() => addBlock("product_relation")}
          className={secondaryButtonClass}
        >
          <Box aria-hidden="true" className="mr-2 h-4 w-4" /> Produto
        </button>
        <button type="button" onClick={() => addBlock("divider")} className={secondaryButtonClass}>
          <Minus aria-hidden="true" className="mr-2 h-4 w-4" /> Divisor
        </button>
      </div>
    </div>
  );
}
