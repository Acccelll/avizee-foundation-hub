# 125 — Governança de Dependências

## 1. Critérios de admissão

Finalidade real e não trivial · licença permissiva (MIT/Apache-2.0/ISC) · manutenção ativa ·
tamanho proporcional · sem dependência nativa (incompatível com o runtime Worker) ·
alternativa nativa avaliada. Dependência sem justificativa registrada é rejeitada.

## 2. Dependências previstas

| Pacote | Finalidade | Licença | Tamanho | Alternativa | Necessidade |
|---|---|---|---|---|---|
| `zod` | Validação de entrada no servidor e no cliente | MIT | Pequeno | Validação manual | **Alta** |
| `@tanstack/react-query` | Cache de dados no painel | MIT | Médio | Estado próprio | Alta |
| `lucide-react` | Ícones (DES-06, validação técnica pendente) | ISC | Tree-shakeable | SVG próprio | Média |
| `date-fns` | Formatação de datas pt-BR | MIT | Pequeno (modular) | `Intl` nativo | **Baixa** — preferir `Intl` |
| `slugify` | Slugs | MIT | Mínimo | Função própria | **Baixa** — implementar |
| Editor de blocos | Corpo editorial | a avaliar | Grande | JSON + componentes próprios | Média — DT-16 |
| Codificador WebP WASM | Derivados no upload | a avaliar | Médio | Transformação do storage | Média |

## 3. Proibições

Nenhuma biblioteca de UI adicional (o design system aprovado é a base); nenhuma biblioteca de
animação pesada; nenhuma dependência com binário nativo; **nenhum código do site antigo
incorporado automaticamente**; nenhum polyfill desnecessário.

## 4. Manutenção

Auditoria de vulnerabilidade em cada CI; atualização de patch mensal; atualização major
avaliada trimestralmente com teste completo; inventário de licenças no repositório.
