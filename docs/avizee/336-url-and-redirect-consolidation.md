# 336 — Url and redirect consolidation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Matriz
Consolidada em `stage-11-redirects.csv` a partir de `19-url-inventory.md`: URL antiga, URL nova, tipo, status, canonical, motivo e aprovação.

## Validações
| Verificação | Resultado |
|---|---|
| Loops de redirecionamento | Nenhum |
| Cadeias (chains) | Nenhuma; todo destino é final |
| Destino 404 | Nenhum |
| Query strings preservadas | Sim |
| Maiúsculas/minúsculas | Normalizadas para minúsculas |
| Barra final | Normalizada sem barra final |
| Caracteres especiais e acentos | Slugs sem acento, normalizados |
| Slugs históricos de artigo | Resolvidos por `content_article_slugs` com 301 |

## Restrição
Nenhum redirect foi ativado no domínio atual. A configuração está preparada para a Etapa 12.
