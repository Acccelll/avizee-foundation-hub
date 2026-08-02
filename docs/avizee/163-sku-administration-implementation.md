# 163 — Administração de SKUs

- 97 SKUs canônicos ativos, todos vinculados a família (zero órfãos).
- Rotas `/admin/catalogo/skus` e `/admin/catalogo/skus/:id`, com prévia pública segura.
- Campos internos (marca, fabricante, referência de fornecedor, observações) existem apenas
  em colunas administrativas e nunca são serializados.
- Máquina de estados: rascunho → em revisão → bloqueado (por código, identidade, marca ou
  direitos) → pronto para publicar. A publicação é ato administrativo separado.
- Distribuição por categoria: Vacinação 36, Pesagem 22, Manejo 17, Pulverização 13,
  Linhas complementares 6, Peças 3.
