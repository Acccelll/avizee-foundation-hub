# 68 — Conflitos Taxonômicos

Dados: **`data/taxonomy-conflicts.csv`** — 83 conflitos registrados, todos no nível do SKU.

## 1. Princípio

**Nenhuma família foi bloqueada por conflito de SKU** (D-036). Conflito bloqueia o registro
afetado; a família segue seu curso com os demais SKUs.

Exceção: quando **todos** os SKUs de uma família estão sem nome, a família inteira fica
`NÃO_CLASSIFICADA` — não por conflito, mas por ausência de fonte.

## 2. Tipos de conflito

| Tipo | Qtd | Severidade | Bloqueia família? |
|---|---|---|---|
| `DADO_AUSENTE` — sem nome em qualquer fonte | 57 | MÉDIO | Só quando é 100% da família |
| `MARCA_DE_TERCEIRO` — nome público viola R-05 | 16 | ALTO | Não |
| `DIVERGENCIA_DE_FONTE` — valores conflitantes | 10 | ALTO | Não |
| `ITEM_NAO_E_SKU` — `BI999` | 1 (dentro dos acima) | MÉDIO | Não |

## 3. Divergências herdadas da Etapa 1 — não reconciliadas

| ID | SKU | Conflito | Ação nesta etapa |
|---|---|---|---|
| DIV-0101 | AG005 | 25 X 8 × 8 X 25 | Família atribuída, SKU bloqueado. Q-03 aberta |
| DIV-0102 | AG016 | 06 X 10 × 10 X 10 | Família atribuída, SKU bloqueado |
| DIV-0103 | AG019 | 12 X 10 × "12 X10 AGULHA APLICADOR" | Família FAM-002 provisória; pode ser FAM-004 |
| DIV-0104 | AG022 | 04 X 08 × "PARA VACINA" × 10 X 08 | Família atribuída, SKU bloqueado. Q-03 aberta |
| DIV-0105 | BI002 | nome genérico × "VERDE LEQUE 80015 BD" | Família FAM-014; SKU bloqueado |
| DIV-0106 | BI003 | nome genérico × "VERMELHO TX-VK6°" | Família FAM-014; SKU bloqueado |
| DIV-0107 | BI004 | nome genérico × "LARANJA LEQUE 8001 BD" | Família FAM-014; SKU bloqueado |
| DIV-0108 | BI005 | nome genérico × "AMARELO LEQUE 8002 BD" | Família FAM-014; SKU bloqueado |
| DIV-0109 | BI006 | "AZUL CONE CHEIO" × "LARANJA RC 80°" | Família FAM-014; SKU bloqueado |
| DIV-0110 | BI999 | "DIVERSOS — CONSULTAR" | Não é SKU (D-040) — vira CTA |

**Nada foi reconciliado.** Toda decisão de medida ou nome exige confirmação documental do usuário.

## 4. Conflito de identidade adicional

`AG025` × `AG026`: mesma medida `10 X 08`, `AG026` sem nome e sem grupo. Podem ser o mesmo
produto com dois códigos, ou dois produtos distintos. Ambos permanecem em FAM-003, ambos
bloqueados. Isso torna FAM-003 `BLOCKED_BY_CODE`: dos seus 3 SKUs, apenas `AG020` está limpo,
o que é pouco para sustentar uma página de família.

## 5. Marcas de terceiros

16 SKUs com marca no nome original: `SR001`–`SR012`, `SR025`, `SR026`, `SR027` e `BV005`.

Tratamento: o nome público proposto nas famílias FAM-010, FAM-011, FAM-012 e FAM-041 é
**funcional e neutro** ("Seringas automáticas de precisão", "Cilindros graduados para seringas
automáticas", "Monitores e analisadores portáteis"). A marca fica **exclusivamente** em
`campo_interno_marca` (D-035).

Cada SKU ainda precisa de nome público individual, conforme a tabela normativa de
`20-resolved-recommendations.md`. Enquanto essa renomeação não for confirmada item a item, as
quatro famílias ficam `BLOCKED_BY_IDENTITY`.

`SR029` merece nota: não expõe marca (não tem nome nenhum), mas está na família por prefixo.
Bloqueado por `DADO_AUSENTE`.

## 6. Conflitos que **não** existem

Verificado e descartado:

- Nenhum SKU aparece em duas famílias.
- Nenhuma família aparece em duas categorias.
- Nenhuma categoria aprovada ficou vazia (CAT-04 tem 1 família publicável — pouco, mas não vazia).
- Nenhum item "diversos — consultar" foi convertido em SKU.
- Nenhum nome público proposto contém marca de terceiro.
