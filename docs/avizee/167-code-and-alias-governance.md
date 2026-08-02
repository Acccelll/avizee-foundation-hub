# 167 — Governança de Códigos e Aliases

- Tipos: `PUBLIC_SKU`, `ORIGINAL`, `LEGACY`, `ALIAS`, `INTERNAL`.
- Na carga canônica foram gravados 97 códigos de origem como `ORIGINAL` com `is_public = false`:
  nenhum código de origem é exposto publicamente.
- Índice único parcial garante um único produto ativo por código público.
- Códigos iguais para produtos distintos permanecem bloqueados e fora do escopo canônico;
  códigos distintos para o mesmo item não são consolidados automaticamente.
