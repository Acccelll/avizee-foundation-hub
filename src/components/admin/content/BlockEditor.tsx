import { useState } from "react";
import { 
  ChevronUp, 
  ChevronDown,
  Heading2,
  Type,
  List as ListIcon,
  Quote,
  Image as ImageIcon,
  AlertCircle,
  Table as TableIcon,
  HelpCircle,
  Box,
  Minus,
  Trash2,
  Plus
} from "lucide-react";
import { type ContentBlock, BLOCK_TYPES } from "@/content/blocks";
import { inputClass, secondaryButtonClass } from "@/components/admin/ui";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
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
      onChange(blocks.filter((_, i) => i !== index));
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const next = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    
    const current = next[index];
    const targetBlock = next[target];
    if (current === undefined || targetBlock === undefined) return;
    
    next[index] = targetBlock;
    next[target] = current;
    onChange(next);
  };

  const addBlock = (type: (typeof BLOCK_TYPES)[number]) => {
    let newBlock: ContentBlock;
    switch (type) {
      case 'heading': newBlock = { type, level: 2, text: "" }; break;
      case 'paragraph': newBlock = { type, text: "" }; break;
      case 'list': newBlock = { type, ordered: false, items: [""] }; break;
      case 'quote': newBlock = { type, text: "", attribution: "" }; break;
      case 'image': newBlock = { type, url: "", alt: "", caption: "" }; break;
      case 'callout': newBlock = { type, tone: "info", text: "", title: "" }; break;
      case 'table': newBlock = { type, headers: [""], rows: [[""]] }; break;
      case 'faq': newBlock = { type, items: [{ question: "", answer: "" }] }; break;
      case 'product_relation': newBlock = { type, familySlug: "", note: "" }; break;
      case 'divider': newBlock = { type }; break;
    }
    onChange([...blocks, newBlock]);
    setExpanded(prev => ({ ...prev, [blocks.length]: true }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={index} className="rounded-lg border border-border bg-surface overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 hover:bg-muted rounded" onClick={() => moveBlock(index, 'up')} disabled={index === 0}>
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:bg-muted rounded" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1}>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 bg-muted/50 px-1.5 py-0.5 rounded">
                  {block.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="p-1.5 hover:bg-muted rounded text-text-secondary" onClick={() => toggleExpand(index)}>
                  {expanded[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button type="button" className="p-1.5 hover:bg-danger/10 text-danger rounded" onClick={() => removeBlock(index)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expanded[index] && (
              <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                {block.type === 'heading' && (
                  <div className="flex gap-4">
                    <select className={`${inputClass} w-24`} value={block.level} onChange={e => updateBlock(index, { level: parseInt(e.target.value) as 2 | 3 })}>
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                    </select>
                    <input className={inputClass} value={block.text} onChange={e => updateBlock(index, { text: e.target.value })} placeholder="Título da seção" />
                  </div>
                )}

                {block.type === 'paragraph' && (
                  <textarea className={`${inputClass} min-h-[120px] font-body leading-relaxed`} value={block.text} onChange={e => updateBlock(index, { text: e.target.value })} placeholder="Escreva seu texto aqui..." />
                )}

                {block.type === 'list' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                       <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                         <input type="checkbox" checked={block.ordered} onChange={e => updateBlock(index, { ordered: e.target.checked })} />
                         Lista Numerada
                       </label>
                    </div>
                    {block.items.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input className={inputClass} value={item} onChange={e => {
                          const nextItems = [...block.items];
                          nextItems[i] = e.target.value;
                          updateBlock(index, { items: nextItems });
                        }} placeholder={`Item ${i + 1}`} />
                        <button type="button" className="p-2 text-text-muted hover:text-danger" onClick={() => {
                          updateBlock(index, { items: block.items.filter((_, idx) => idx !== i) });
                        }} disabled={block.items.length === 1}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="flex items-center gap-1.5 text-xs font-bold text-terracota hover:underline mt-2" onClick={() => updateBlock(index, { items: [...block.items, ""] })}>
                      <Plus className="w-3 h-3" /> Adicionar Item
                    </button>
                  </div>
                )}

                {block.type === 'quote' && (
                  <div className="space-y-3">
                    <textarea className={`${inputClass} min-h-[80px] italic`} value={block.text} onChange={e => updateBlock(index, { text: e.target.value })} placeholder="Texto da citação..." />
                    <input className={inputClass} value={block.attribution ?? ""} onChange={e => updateBlock(index, { attribution: e.target.value })} placeholder="Autor/Fonte" />
                  </div>
                )}

                {block.type === 'image' && (
                  <div className="space-y-3">
                    <input className={inputClass} value={block.url} onChange={e => updateBlock(index, { url: e.target.value })} placeholder="URL da Imagem" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputClass} value={block.alt} onChange={e => updateBlock(index, { alt: e.target.value })} placeholder="Texto alternativo (Acessibilidade)" />
                      <input className={inputClass} value={block.caption ?? ""} onChange={e => updateBlock(index, { caption: e.target.value })} placeholder="Legenda (opcional)" />
                    </div>
                  </div>
                )}

                {block.type === 'callout' && (
                  <div className="space-y-3">
                    <select className={inputClass} value={block.tone} onChange={e => updateBlock(index, { tone: e.target.value as any })}>
                      <option value="info">Informação (Azul)</option>
                      <option value="warning">Aviso (Terracota)</option>
                      <option value="danger">Crítico (Vinho)</option>
                      <option value="success">Sucesso (Verde)</option>
                    </select>
                    <input className={`${inputClass} font-bold`} value={block.title ?? ""} onChange={e => updateBlock(index, { title: e.target.value })} placeholder="Título do Destaque (opcional)" />
                    <textarea className={inputClass} value={block.text} onChange={e => updateBlock(index, { text: e.target.value })} placeholder="Conteúdo do destaque..." />
                  </div>
                )}

                {block.type === 'table' && (
                  <div className="space-y-3 overflow-x-auto p-1">
                    <div className="flex gap-2 mb-2">
                       <button type="button" className="text-[10px] font-bold px-2 py-1 bg-muted rounded hover:bg-muted/80" onClick={() => {
                         updateBlock(index, { headers: [...block.headers, ""], rows: block.rows.map(r => [...r, ""]) });
                       }}>+ Coluna</button>
                       <button type="button" className="text-[10px] font-bold px-2 py-1 bg-muted rounded hover:bg-muted/80" onClick={() => {
                         updateBlock(index, { rows: [...block.rows, block.headers.map(() => "")] });
                       }}>+ Linha</button>
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {block.headers.map((h, i) => (
                            <th key={i} className="p-1 border border-border">
                              <input className="w-full bg-transparent border-none text-[11px] font-bold text-center focus:ring-0" value={h} onChange={e => {
                                const next = [...block.headers]; next[i] = e.target.value; updateBlock(index, { headers: next });
                              }} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-1 border border-border">
                                <input className="w-full bg-transparent border-none text-[11px] focus:ring-0" value={cell} onChange={e => {
                                  const nextRows = [...block.rows]; nextRows[ri][ci] = e.target.value; updateBlock(index, { rows: nextRows });
                                }} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {block.type === 'faq' && (
                  <div className="space-y-4">
                    {block.items.map((item, i) => {
                      if (!item || item === undefined) return null;
                      return (
                      <div key={i} className="p-3 bg-muted/20 rounded-md space-y-2 relative group">
                        <input className={`${inputClass} font-semibold`} value={item.question} onChange={e => {
                          const next = [...block.items]; 
                          const currentItem = next[i];
                          if (currentItem) {
                            next[i] = { ...currentItem, question: e.target.value }; 
                            updateBlock(index, { items: next });
                          }
                        }} placeholder="Pergunta" />
                        <textarea className={inputClass} value={item.answer} onChange={e => {
                          const next = [...block.items]; 
                          const currentItem = next[i];
                          if (currentItem) {
                            next[i] = { ...currentItem, answer: e.target.value }; 
                            updateBlock(index, { items: next });
                          }
                        }} placeholder="Resposta" />
                        <button type="button" className="absolute -right-2 -top-2 p-1 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                          updateBlock(index, { items: block.items.filter((_, idx) => idx !== i) });
                        }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )})}
                    <button type="button" className="flex items-center gap-1.5 text-xs font-bold text-terracota hover:underline" onClick={() => updateBlock(index, { items: [...block.items, { question: "", answer: "" }] })}>
                      <Plus className="w-3 h-3" /> Adicionar Pergunta
                    </button>
                  </div>
                )}

                {block.type === 'product_relation' && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-muted mb-1 block">Slug da Família</span>
                      <input className={inputClass} value={block.familySlug} onChange={e => updateBlock(index, { familySlug: e.target.value })} placeholder="ex: comedouro-automatico-bi999" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-muted mb-1 block">Nota Editorial</span>
                      <input className={inputClass} value={block.note ?? ""} onChange={e => updateBlock(index, { note: e.target.value })} placeholder="Destaque por que este produto é relevante..." />
                    </label>
                  </div>
                )}
                
                {block.type === 'divider' && (
                   <div className="py-8 flex items-center justify-center">
                      <div className="w-1/2 h-px bg-border"></div>
                   </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-border">
        <button type="button" onClick={() => addBlock('heading')} className={secondaryButtonClass}><Heading2 className="w-4 h-4 mr-2" /> Título</button>
        <button type="button" onClick={() => addBlock('paragraph')} className={secondaryButtonClass}><Type className="w-4 h-4 mr-2" /> Texto</button>
        <button type="button" onClick={() => addBlock('list')} className={secondaryButtonClass}><ListIcon className="w-4 h-4 mr-2" /> Lista</button>
        <button type="button" onClick={() => addBlock('quote')} className={secondaryButtonClass}><Quote className="w-4 h-4 mr-2" /> Citação</button>
        <button type="button" onClick={() => addBlock('image')} className={secondaryButtonClass}><ImageIcon className="w-4 h-4 mr-2" /> Imagem</button>
        <button type="button" onClick={() => addBlock('callout')} className={secondaryButtonClass}><AlertCircle className="w-4 h-4 mr-2" /> Destaque</button>
        <button type="button" onClick={() => addBlock('table')} className={secondaryButtonClass}><TableIcon className="w-4 h-4 mr-2" /> Tabela</button>
        <button type="button" onClick={() => addBlock('faq')} className={secondaryButtonClass}><HelpCircle className="w-4 h-4 mr-2" /> FAQ</button>
        <button type="button" onClick={() => addBlock('product_relation')} className={secondaryButtonClass}><Box className="w-4 h-4 mr-2" /> Produto</button>
        <button type="button" onClick={() => addBlock('divider')} className={secondaryButtonClass}><Minus className="w-4 h-4 mr-2" /> Divisor</button>
      </div>
    </div>
  );
}
