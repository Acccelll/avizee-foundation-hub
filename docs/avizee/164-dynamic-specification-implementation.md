# 164 — Especificações Dinâmicas

- Modelo por definição (`specification_definitions`), escopo (`specification_scopes`) e valor
  (`family_specifications`, `product_specifications`), com tipos TEXT, NUMBER, DECIMAL, MEASURE,
  CAPACITY, ENUM_SINGLE, ENUM_MULTI, BOOLEAN e REFERENCE.
- Nenhuma especificação foi inferida: o lote canônico traz apenas medida e variação presentes
  na matriz aprovada. Definições dinâmicas ficam disponíveis para preenchimento administrativo.
- Valores herdados da família podem ser sobrescritos por SKU com marcação `is_override`.
