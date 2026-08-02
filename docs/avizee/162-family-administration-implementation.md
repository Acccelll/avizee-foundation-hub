# 162 — Administração de Famílias

- 31 famílias canônicas, cada uma com categoria, subcategoria, segmento principal,
  aplicação principal, aplicações secundárias e solução.
- Rotas `/admin/catalogo/familias` e `/admin/catalogo/familias/:id`.
- Estado inicial: `UNDER_REVIEW` + `NOT_PUBLISHED`. Nenhuma família nasce publicada.
- Origem registrada em `source = matriz-aprovada:D-052`, garantindo rastreabilidade.
- Soft delete apenas; nenhuma exclusão física.
