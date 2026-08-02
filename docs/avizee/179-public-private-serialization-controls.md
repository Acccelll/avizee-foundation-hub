# 179 — Controles de Serialização Pública

- `src/catalog/serializer.ts` monta a visão pública por lista branca: qualquer campo não listado
  é descartado por construção, não escondido pela interface.
- `FORBIDDEN_PUBLIC_FIELDS` e `findLeakedFields()` funcionam como verificação defensiva antes de
  qualquer resposta pública, e são exercitados por 25 testes unitários.
- Placeholder padrão quando não há imagem aprovada.
- Verificação final sobre o catálogo canônico real: 97 produtos e 31 famílias, 0 vazamentos.
- Nenhum campo de preço existe no modelo (R-04), portanto não há o que ocultar.
