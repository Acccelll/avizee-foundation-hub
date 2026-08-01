# 106 — Arquitetura de Busca

## 1. Escolha (DT-06)

Postgres nativo: `tsvector` (configuração `portuguese`) + `unaccent` + `pg_trgm`.
Sem serviço externo na v1 — volume de ~174 SKUs, 43 famílias e dezenas de artigos não
justifica índice dedicado. A arquitetura permanece evoluível: o índice é uma view/materialized
view alimentada pelas views públicas, substituível por motor externo sem alterar o modelo.

## 2. Índice

`search_index` (materialized view ou tabela mantida por trigger):

| Coluna | Conteúdo |
|---|---|
| `entity_type` | FAMILY, PRODUCT, ARTICLE, SOLUTION |
| `entity_id` | uuid |
| `title` | nome público |
| `subtitle` | família/categoria |
| `body` | resumo, aplicações, valores de especificação **públicos** |
| `codes` | apenas `public_sku` **validado** |
| `synonyms` | sinônimos neutros curados (sem marca) |
| `tsv` | `to_tsvector('portuguese', unaccent(...))` com pesos A/B/C/D |
| `url` | rota canônica |

**Fonte exclusiva**: views públicas. Marca interna, fornecedor, custo, código original,
alias interno e qualquer campo ADMIN_ONLY **não existem** no índice. Somente registros
`PUBLISHED`.

## 3. Comportamento

- Normalização: minúsculas, remoção de acento, remoção de separadores em códigos
  (`bi-999`, `bi 999`, `bi999` equivalentes).
- Ranking: `ts_rank_cd` com pesos (título A, código A, família B, especificação C, corpo D),
  desempate por completude do registro e por presença de imagem aprovada.
- Tolerância a erro: `similarity()` via `pg_trgm` com limiar, aplicada quando o full-text
  retorna poucos resultados.
- Autocomplete: endpoint com `limit 8`, debounce 250 ms, mínimo 2 caracteres, cache curto.
- Filtros: categoria, aplicação, segmento, família e especificações filtráveis — combinados
  por `AND` entre dimensões e `OR` dentro da dimensão.
- Paginação: keyset por `(rank, id)`; 24 itens por página.
- Zero resultado: sugestão de categorias, CTA "não encontrou? solicite cotação" e evento
  `product_not_found_requested`.

## 4. Busca administrativa (separada)

Endpoint distinto, autenticado, que **pode** pesquisar código original, alias interno,
código antigo e marca — nunca compartilha índice, rota, cache ou serializer com a busca pública.

## 5. Página de busca e SEO

`/busca?q=` é `noindex,follow`, sem canonical para si e sem link em sitemap.
