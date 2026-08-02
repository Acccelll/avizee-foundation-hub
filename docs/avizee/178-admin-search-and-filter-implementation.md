# 178 — Busca e Filtros Administrativos

- Listagens de famílias e SKUs com busca por nome e código e filtros por categoria, estado de
  revisão e estado de publicação, executados no servidor.
- A busca administrativa alcança campos internos (marca, fabricante, referência), restrita a
  quem possui `catalog.internal.read`; esses campos nunca chegam à serialização pública.
- Busca pública não foi implementada nesta etapa (pertence à Etapa 7).
