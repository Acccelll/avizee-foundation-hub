# 116 — Arquitetura de Performance

## 1. Metas (móvel, 4G, p75)

| Métrica | Meta |
|---|---|
| LCP | ≤ 2,5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0,1 |
| TTFB | ≤ 800 ms |
| JS inicial (rota pública) | ≤ 170 KB comprimido |
| CSS inicial | ≤ 60 KB comprimido |
| Peso da imagem hero | ≤ 180 KB |

## 2. Fontes

Montserrat **self-host**, WOFF2, `font-display: swap`, subset latin + latin-ext,
apenas os pesos aprovados (400/500/600/700), `preload` somente do peso do texto corrente.
**Montserrat Alternates não é carregada em nenhuma hipótese** (D-031). Fallback:
`system-ui, "Segoe UI", Roboto, Arial, sans-serif`, com métricas ajustadas para reduzir CLS.

## 3. Imagens

WebP com fallback, `srcset` responsivo, `width`/`height` sempre declarados,
`loading="lazy"` exceto no hero, `fetchpriority="high"` no hero, placeholder oficial com o
mesmo aspect-ratio. **Nunca** carregar todas as imagens do catálogo: 24 itens por página com
paginação; carregamento progressivo apenas como complemento, nunca substituindo URL paginada
indexável.

## 4. Dados e cache

Cache de resposta em rotas SSR (5 min) com revalidação na publicação; consultas com projeção
mínima; keyset pagination; contagens aproximadas quando aceitável; índices conforme `101`.

## 5. Scripts e CSS

Sem biblioteca de animação pesada; sem framework de UI adicional; CSS por tokens aprovados;
code splitting por rota; painel administrativo em bundle separado, nunca carregado no público;
nenhum script de terceiro por padrão (mapa só sob clique).

## 6. Orçamento e verificação

Orçamento de performance verificado no gate de CI (`124`) por rota-tipo: Home, Categoria,
Família, SKU, Artigo. Regressão acima de 10% bloqueia o deploy.
