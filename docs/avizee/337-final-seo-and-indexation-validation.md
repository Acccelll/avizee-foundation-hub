# 337 — Final seo and indexation validation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Validação sobre HTML renderizado
Cada rota pública foi verificada no HTML entregue pelo servidor, não apenas na presença de campos.

| Item | Resultado |
|---|---|
| Title e description únicos por rota | Conforme |
| H1 único e hierarquia de headings | Conforme |
| Canonical | Conforme, relativo enquanto não há domínio definitivo |
| Open Graph e Twitter card | Conforme |
| JSON-LD | `Organization`, `BreadcrumbList`, `ItemList`, `Product` sem oferta/preço, `Article`, `FAQPage` |
| Breadcrumbs visíveis e estruturados | Conforme |
| Conteúdo essencial no HTML do servidor | Conforme — não depende de JS cliente |
| Status HTTP | 200 nas rotas válidas; 404 real em inexistentes |
| Imagens com alt | Conforme; placeholders com texto alternativo próprio |
| Páginas órfãs | Nenhuma |
| `noindex` por ambiente | Ativo em desenvolvimento, preview e homologação |

Detalhe por rota em `stage-11-indexation.csv`.

## Cache e invalidação
Publicação e despublicação de artigo invalidam listagem, categoria e sitemap.
