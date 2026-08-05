---
name: Etapa 14 — Relações Recíprocas Catálogo-Conteúdo
description: Registro da implementação das relações bidirecionais entre famílias e artigos.
type: feature
---

# 519 — RELAÇÕES RECÍPROCAS CATÁLOGO-CONTEÚDO

## 1. IMPLEMENTAÇÃO
- **Artigo -> Família:** Mantido o bloco `product_relation` como fonte de verdade editorial.
- **Família -> Artigo:** Adicionada consulta reversa `fetchArticlesForFamily` na página pública da família.
- **Sincronização:** `saveArticle` atualiza a tabela `content_article_families` baseada nos blocos.

## 2. VERIFICAÇÃO
- [x] Artigos aparecem na página da família (`/produtos/category/family`).
- [x] Somente artigos `PUBLISHED` são exibidos publicamente.
- [x] Bloco oculto se não houver artigos relacionados.
