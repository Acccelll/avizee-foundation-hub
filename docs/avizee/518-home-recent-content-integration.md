---
name: Etapa 14 — Integração Home e Conteúdos
description: Registro da implementação da renderização dinâmica de artigos na Home.
type: feature
---

# 518 — INTEGRAÇÃO HOME E CONTEÚDOS RECENTES

## 1. IMPLEMENTAÇÃO
- Removida dependência da constante estática `PUBLISHED_ARTICLES`.
- Atualizado o loader da Home para incluir `fetchArticles({ data: { pagina: 1 } })`.
- Renderização dinâmica de até 3 artigos utilizando o componente `ArticleCard`.
- Bloco é ocultado automaticamente se não houver artigos (`recentArticles.length > 0`).

## 2. VERIFICAÇÃO
- [x] Consulta pública via `fetchArticles` funcional.
- [x] Layout preservado conforme posição 8 (antes do Atendimento Nacional).
- [x] Mobile/Desktop seguindo wireframe.
