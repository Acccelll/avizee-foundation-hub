# 45 — Arquitetura de URLs

Status: `PENDENTE_DE_APROVAÇÃO` — endereça a recomendação **L-04**, que segue sem aprovação.

## 1. Regras gerais

Minúsculas · sem acento ou cedilha · hífen como separador · sem extensão · sem barra final ·
sem código de SKU no slug por padrão · sem marca de terceiro (R-05) · em português · sem
palavra vazia ("de", "e" mantidos apenas quando fazem parte do nome aprovado da categoria) ·
slug **imutável** após publicação (mudança exige 301).

## 2. Esquema proposto

| Entidade | Padrão | Exemplo |
|---|---|---|
| Catálogo | `/produtos` | `/produtos` |
| Categoria | `/produtos/{categoria}` | `/produtos/vacinacao-e-aplicacao` |
| Família | `/produtos/{categoria}/{familia}` | `/produtos/vacinacao-e-aplicacao/agulha-inox` |
| SKU (exceção) | `/produtos/{categoria}/{familia}/{variacao}` | `/produtos/pesagem-medicao-e-controle/balanca-de-ovos/{slug}` |
| Soluções | `/solucoes/{solucao}` | `/solucoes/vacinacao` |
| Conteúdos | `/conteudos/{categoria-editorial}` e `/conteudos/{artigo}` | `/conteudos/guias-e-boas-praticas` · `/conteudos/como-escolher-agulha-para-vacinacao` |
| Busca | `/busca?q=` | — |
| Cotação | `/cotacao` · `/cotacao/enviada` | — |
| Institucional | `/sobre` · `/contato` | — |
| Legal | `/politica-de-privacidade` · `/politica-de-cookies` · `/termos-de-uso` | — |

### Categoria dentro da URL da família: por quê
Alternativa A — `/produtos/{familia}` (plano). Mais curto e imune a recategorização.
Alternativa B — `/produtos/{categoria}/{familia}` (**recomendada**). Dá contexto semântico ao
crawler, sustenta o breadcrumb sem trilha "fantasma" e evita colisão de slug entre famílias
homônimas de categorias diferentes. Custo: recategorizar exige 301 — aceitável, porque as 6
categorias são estáveis por decisão (`07-product-taxonomy.md`).

**Subcategoria não entra na URL.** Se surgir, vira faceta, não segmento de caminho.

## 3. Slug da família

Derivado do **nome funcional público** (D-035), nunca do código nem da marca.
Ex.: grupo interno "SOCOREX" → `/produtos/vacinacao-e-aplicacao/seringa-automatica-repetidora`.
Colisão de slug resolve-se por qualificador funcional (`...-inox`, `...-para-aplicador`), nunca
por sufixo numérico.

## 4. Variações: sem URL por padrão

`LOVABLE_RECOMMENDATION` — **Variação de medida não gera URL.** 174 SKUs virariam 174 páginas
quase idênticas, sem dado técnico próprio (RK-18) — exatamente o conteúdo fino que o P-7 proíbe.

Seleção da variação por **query string não indexável**:
`/produtos/vacinacao-e-aplicacao/agulha-inox?sku=AG011`

| Aspecto | Regra |
|---|---|
| Canônica | Sempre a URL da família, sem parâmetro |
| Indexação | Parâmetro `?sku=` nunca indexado |
| Compartilhamento | O link com `?sku=` abre a família com a variação pré-selecionada e rolagem até a tabela |
| Busca por código | `AG011` resolve para a família + parâmetro (jornada J-1) |
| Fragmento (`#`) | Rejeitado: não chega ao servidor, quebra SSR e compartilhamento por WhatsApp |

### Exceção — quando um SKU ganha URL própria
Precisa cumprir **três ou mais** critérios: (a) tecnicamente distinto, não é uma medida da família;
(b) especificação exclusiva substancial; (c) imagem própria aprovada; (d) documentação própria;
(e) demanda de busca orgânica demonstrada; (f) aplicação exclusiva. Casos candidatos hoje:
balanças e termômetros com modelos realmente distintos. Nenhum aprovado — `DECISÃO_NECESSÁRIA`
(DEC-06 em `58`).

## 5. Parâmetros

| Parâmetro | Uso | Indexável |
|---|---|---|
| `?sku=` | variação selecionada | Não |
| `?q=` | busca | Não |
| `?categoria=` `?aplicacao=` `?segmento=` | filtros em `/produtos` | Não |
| `?pagina=` | paginação | Sim, com `rel` de sequência e canônica própria |
| `?utm_*` | campanhas | Não; canônica ignora |

Ordem dos parâmetros normalizada alfabeticamente para evitar variantes da mesma URL.
