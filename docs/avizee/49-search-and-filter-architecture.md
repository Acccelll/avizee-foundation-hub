# 49 — Arquitetura de Busca e Filtros

Status: `PENDENTE_DE_APROVAÇÃO`

## 1. Escopo da busca

**Busca global** (produtos + soluções + conteúdos), com resultados agrupados por tipo e produtos
sempre em primeiro lugar. Alternativa descartada: busca só de produtos — deixaria a Central de
Conteúdos sem porta de entrada interna.

## 2. Campos indexados

Público: nome funcional público · referência/SKU · código antigo validado · medida · capacidade ·
unidade · categoria · família · aplicação · descrição · sinônimos neutros · termos técnicos.

**Nunca indexado publicamente**: marca de terceiro (mesmo em campo interno), fornecedor, custo,
observação interna, nível de confiança (R-05, RK-08).

Sinônimos são um **dicionário curado** e neutro (ex.: "bico" ↔ "esguicho"; "balança" ↔ "peso").
Nome de marca **não** entra como sinônimo público, nem mesmo redirecionando: isso reintroduziria a
marca no comportamento público. Consulta com marca cai no estado "sem correspondência" com
sugestão funcional. Decisão DEC-08 em `58`.

## 3. Comportamento

| Recurso | Regra |
|---|---|
| Correspondência exata por código | Prioridade máxima; `AG011` resolve direto |
| Autocomplete | A partir de 2 caracteres, agrupado por tipo, com no máx. 8 sugestões |
| Tolerância a erro | Distância de edição baixa (1 a 2) apenas em termos, **nunca em código** — "AG012" não pode virar "AG011" |
| Prefixo | `AG` lista a família de agulhas, não 25 resultados soltos |
| Ordem | código exato › nome de família › variação › categoria/solução › conteúdo |
| Histórico local | Últimas 5 buscas, apenas no dispositivo, com opção de limpar (`EVOLUÇÃO`) |

Exemplo canônico — busca `AG011`: abre a família "Agulha inox" com a variação 10 × 10
pré-selecionada (`?sku=AG011`), rolando até a tabela, com quantidade e "Adicionar à lista".

## 4. Estados

| Estado | Comportamento |
|---|---|
| Código não encontrado | "Não localizamos a referência X" + famílias do mesmo prefixo + CTA de consulta |
| Produto pendente (rascunho) | Não aparece. Trata-se como não encontrado — nunca exibir "indisponível", que sugeriria estoque |
| Bloqueado por divergência | Idem, sem qualquer sinalização pública (AG005, AG022) |
| Produto sem imagem | Aparece normalmente com placeholder; **nunca é despriorizado** (D-050, R-09) |
| Termo genérico ("agulha") | Mostra a família antes das variações |
| Sem correspondência | Categorias mais próximas + busca por aplicação + CTA "Não encontrou?" |

## 5. Filtros gerais em `/produtos`

| Filtro | Classificação | Nota |
|---|---|---|
| Categoria | **VIÁVEL_COM_DADOS_ATUAIS** | 6 valores fixos |
| Família | VIÁVEL_COM_DADOS_ATUAIS | Útil dentro da categoria |
| Aplicação | **DEPENDE_DE_NORMALIZAÇÃO** | `aplicacao_confirmada = NAO_CONFIRMADA` em 100% do CSV; viabiliza-se com a herança por família (D-042) |
| Segmento | DEPENDE_DE_NORMALIZAÇÃO | Só bovinocultura tem base clara (`BV`) |
| Disponível para cotação | NÃO_VIÁVEL na v1 | Todo item publicado é cotável; filtro sem função |
| Possui imagem | **EVOLUÇÃO** | Se existir, é opt-in e **nunca oculta por padrão** |
| Tipo (família/SKU) | NÃO_VIÁVEL | Distinção interna, sem valor para o cliente |

## 6. Filtros contextuais

| Contexto | Filtros | Classificação |
|---|---|---|
| Agulhas | tipo · medida · material · embalagem | medida **VIÁVEL** (campo `medida` presente); tipo, material, embalagem **DEPENDE_DE_NORMALIZAÇÃO** |
| Balanças | capacidade · resolução · tipo de uso | **DEPENDE_DE_NORMALIZAÇÃO** — capacidade só parcialmente preenchida |
| Conexões | formato · rosca · diâmetro · material | **DEPENDE_DE_NORMALIZAÇÃO** — 22 SKUs `CN` sem categoria nem atributo |
| Tubulações | material · diâmetro · unidade | **DEPENDE_DE_NORMALIZAÇÃO** |
| Seringas | capacidade · tipo · aplicação · simples/dupla | **DEPENDE_DE_NORMALIZAÇÃO** |
| Bicos | cor · tipo de jato · ângulo | **DEPENDE_DE_NORMALIZAÇÃO** — dado existe no catálogo (D-039), falta estruturar |
| Termômetros | faixa · tipo | **NÃO_VIÁVEL** hoje |

Regra: **filtro só é publicado quando ≥ 80% dos itens do contexto tiverem o atributo preenchido.**
Abaixo disso, o filtro esconde catálogo em vez de revelá-lo. Filtro nunca zera a lista sem oferecer
"limpar filtros", e todo filtro reflete-se em `?parametro=` não indexável (`45` §5).
