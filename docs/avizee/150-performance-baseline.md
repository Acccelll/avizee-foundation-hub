# 150 — Baseline de Performance

Origem: `116-performance-architecture.md`.

## 1. Decisões estruturais que sustentam a meta

- Fonte self-host WOFF2 variável: um arquivo, sem requisição a CDN de terceiro.
- Nenhuma biblioteca de gráfico, mapa ou animação carregada nas rotas públicas.
- Institucionais e legais em renderização estática.
- Administrativo sem cache e sem SSR de sessão.
- Nenhuma imagem pesada de produto publicada nesta etapa.

## 2. Medição

Não há medição instrumentada de campo. O que existe é a baseline estrutural acima e a
confirmação de que todas as rotas respondem `200` no ambiente de desenvolvimento.

Não afirmo conformidade com o orçamento de performance de `116`: sem medição sintética e
de campo, essa afirmação não seria verificável. Pendência registrada em `155` (DV-05-08).

## 3. Orçamento a validar antes de produção

| Métrica | Meta |
|---|---|
| LCP | ≤ 2,5 s em 4G |
| CLS | ≤ 0,1 |
| INP | ≤ 200 ms |
| Peso da rota institucional | ≤ 350 KB comprimido |

## 4. Regras já fixadas para as próximas etapas

Paginação obrigatória em listas administrativas, thumbnails em vez de original, histórico
sob demanda, importação em lotes, limite de resultados e nenhuma requisição que carregue
o catálogo inteiro.
