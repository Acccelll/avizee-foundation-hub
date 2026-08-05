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
  Trash2
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
    next[index] = { ...next[index], ...patch } as ContentBlock;
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
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addBlock = (type: (typeof BLOCK_TYPES)[number]) => {
    const newBlock: any = { type };
    switch (type) {
      case 'heading': newBlock.level = 2; newBlock.text = ""; break;
      case 'paragraph': newBlock.text = ""; break;
      case 'list': newBlock.ordered = false; newBlock.items = [""]; break;
      case 'quote': newBlock.text = ""; newBlock.attribution = ""; break;
      case 'image': newBlock.alt = ""; newBlock.url = ""; break;
      case 'callout': newBlock.tone = "info"; newBlock.text = ""; break;
      case 'table': newBlock.headers = [""]; newBlock.rows = [[""]]; break;
      case 'faq': newBlock.items = [{ question: "", answer: "" }]; break;
      case 'product_relation': newBlock.familySlug = ""; break;
    }
    onChange([...blocks, newBlock]);
    setExpanded(prev => ({ ...prev, [blocks.length]: true }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={index} className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 border-b border-border">
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  className="p-1 hover:bg-muted rounded" 
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  className="p-1 hover:bg-muted rounded" 
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-wider text-text-muted">
                  {block.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-muted rounded text-text-secondary"
                  onClick={() => toggleExpand(index)}
                >
                  {expanded[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-danger/10 text-danger rounded"
                  onClick={() => removeBlock(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expanded[index] && (
              <div className="p-4 space-y-4">
                {block.type === 'heading' && (
                  <div className="flex gap-4">
                    <select 
                      className={inputClass} 
                      value={block.level}
                      onChange={e => updateBlock(index, { level: parseInt(e.target.value) as 2 | 3 })}
                    >
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                    </select>
                    <input 
                      className={inputClass} 
                      value={block.text}
                      onChange={e => updateBlock(index, { text: e.target.value })}
                      placeholder="Título da seção"
                    />
                  </div>
                )}

                {block.type === 'paragraph' && (
                  <textarea 
                    className={`${inputClass} min-h-[100px]`}
                    value={block.text}
                    onChange={e => updateBlock(index, { text: e.target.value })}
                    placeholder="Escreva seu texto aqui..."
                  />
                )}

                {block.type === 'product_relation' && (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-xs font-semibold">Slug da Família</span>
                      <input 
                        className={inputClass}
                        value={block.familySlug}
                        onChange={e => updateBlock(index, { familySlug: e.target.value })}
                        placeholder="ex: comedouro-automatico-bi999"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold">Nota Editorial (opcional)</span>
                      <input 
                        className={inputClass}
                        value={block.note || ""}
                        onChange={e => updateBlock(index, { note: e.target.value })}
                        placeholder="Por que este produto é relevante?"
                      />
                    </label>
                  </div>
                )}
                
                {['list', 'quote', 'image', 'callout', 'table', 'faq', 'divider'].includes(block.type) && (
                   <div className="p-4 bg-muted/20 rounded border border-dashed border-border text-center text-sm text-text-muted">
                      Editor especializado para {block.type} em implementação. Use o modo JSON para este bloco.
                   </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <button type="button" onClick={() => addBlock('heading')} className={secondaryButtonClass}><Heading2 className="w-4 h-4 mr-2" /> Título</button>
        <button type="button" onClick={() => addBlock('paragraph')} className={secondaryButtonClass}><Type className="w-4 h-4 mr-2" /> Parágrafo</button>
        <button type="button" onClick={() => addBlock('product_relation')} className={secondaryButtonClass}><Box className="w-4 h-4 mr-2" /> Produto</button>
        <button type="button" onClick={() => addBlock('list')} className={secondaryButtonClass}><ListIcon className="w-4 h-4 mr-2" /> Lista</button>
        <button type="button" onClick={() => addBlock('quote')} className={secondaryButtonClass}><Quote className="w-4 h-4 mr-2" /> Citação</button>
        <button type="button" onClick={() => addBlock('image')} className={secondaryButtonClass}><ImageIcon className="w-4 h-4 mr-2" /> Imagem</button>
        <button type="button" onClick={() => addBlock('callout')} className={secondaryButtonClass}><AlertCircle className="w-4 h-4 mr-2" /> Destaque</button>
        <button type="button" onClick={() => addBlock('table')} className={secondaryButtonClass}><TableIcon className="w-4 h-4 mr-2" /> Tabela</button>
        <button type="button" onClick={() => addBlock('faq')} className={secondaryButtonClass}><HelpCircle className="w-4 h-4 mr-2" /> FAQ</button>
        <button type="button" onClick={() => addBlock('divider')} className={secondaryButtonClass}><Minus className="w-4 h-4 mr-2" /> Divisor</button>
      </div>
    </div>
  );
}
