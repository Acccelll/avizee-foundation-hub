# 35 — Achados de Performance

Base: análise estática do código e dos assets. **Nenhuma medição de campo (Core Web Vitals) foi
executada** — não há dados de PageSpeed, RUM ou analytics disponíveis.

## Achados

| ID | Achado | Evidência | Impacto |
|---|---|---|---|
| F-18 | Montserrat via Google Fonts (3 pesos) no caminho crítico | head de todas as páginas | render bloqueado por terceiro |
| F-19 | CSS embutido extenso e repetido por página | `contato.php`, `blog.php`, `header.php` | HTML pesado, sem cache |
| F-20 | Imagens só em JPG/PNG, sem WebP/AVIF, sem `srcset`, sem dimensões intrínsecas | `assets/img/products/` (72 arquivos) | LCP e banda |
| F-21 | CSV lido, parseado e agrupado a cada requisição | `includes/produtos-data.php` | TTFB cresce com o catálogo |
| F-22 | Três terceiros carregados sem interação: EmbedSocial, iframe do Google Maps, reCAPTCHA | `blog.php`, `contato.php` | peso, requisições e privacidade |

## Pontos corretos do sistema atual

- `loading="lazy"` nas imagens de produto e no iframe do mapa.
- `loading="eager"` com `width`/`height` no logotipo.
- `preload` + `onload` na folha de fontes.
- `defer` nos scripts próprios.
- CSS externo dividido em `style`, `responsive` e `footer`.
- Nenhuma biblioteca JS pesada: todo o comportamento é JS nativo.

`TECHNICAL_INFERENCE` — Raciocínio: o gargalo do site atual **não é JavaScript** (não há
framework nem bundle), e sim mídia não otimizada, terceiros e processamento de CSV em runtime.
Na v1, com dados em banco e imagens processadas no build, o LCP passa a depender essencialmente
da imagem principal de cada página.

## Metas propostas

`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

| Métrica | Meta |
|---|---|
| LCP | < 2,5 s em 4G |
| CLS | < 0,1 |
| INP | < 200 ms |
| Peso da home | < 1 MB no primeiro carregamento |
| Fontes | self-host WOFF2, no máximo 3 pesos (O-24) |
| Terceiros | carregados sob interação, nunca no load |
