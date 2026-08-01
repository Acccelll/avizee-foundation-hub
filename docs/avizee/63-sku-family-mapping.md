# 63 — Mapeamento SKU → Família

Dados: **`data/sku-family-mapping.csv`** — 174 linhas, uma por SKU, 25 colunas.

## 1. Cobertura

| Indicador | Valor |
|---|---|
| SKUs no universo consolidado | 174 |
| SKUs associados a uma família | **174 (100%)** |
| SKUs sem família | 0 |
| SKUs em mais de uma família | 0 |
| SKUs candidatos à publicação | 91 |
| SKUs bloqueados individualmente | 83 |

Nenhum SKU ficou órfão. Estar em uma família **não** significa estar publicável: 57 registros
estão em famílias-contêiner sem dado de origem.

## 2. Regra de herança aplicada

`SOURCE_DERIVED` — Cada SKU herda da família:

- `categoria_herdada`
- `aplicacao_principal_herdada`
- `segmento_herdado`

As colunas `excecao_de_segmento`, `excecao_de_categoria` e `excecao_de_aplicacao` existem e estão
vazias em todos os 174 registros: **nenhuma exceção individual foi necessária** com o
desmembramento adotado. Se o usuário aprovar fusões de família, exceções podem aparecer.

## 3. Motivos de bloqueio

| Motivo | SKUs | Regra |
|---|---|---|
| Sem nome em qualquer fonte | 57 | `PE` (28), `CN` (22 → 3 sem medida + 19 só com rosca), `BO` (3), `BT` (2), `AG026`, `SR029` |
| Marca de terceiro no nome original | 16 | R-05 / D-035 — 15 `SR` + `BV005` |
| Divergência entre fontes | 10 | D-036 — DIV-0101 a DIV-0110 |
| Item que não é SKU | 1 | `BI999` "DIVERSOS — CONSULTAR" → CTA (D-040) |

Os totais se sobrepõem: alguns registros acumulam mais de um motivo. O CSV traz o texto completo
em `motivo_do_bloqueio`.

## 4. Conflitos deliberadamente não resolvidos

Conforme §10 do prompt, **nada foi reconciliado sem evidência**:

| Caso | Situação | Tratamento |
|---|---|---|
| `AG005` | 25 X 8 (CSV) × 8 X 25 (catálogo) | Família FAM-001 atribuída; SKU bloqueado |
| `AG016` | 06 X 10 × 10 X 10 | Família FAM-002 atribuída; SKU bloqueado |
| `AG019` | 12 X 10 × "12 X10 AGULHA APLICADOR" — pode pertencer a FAM-004 | Mantido em FAM-002 como provisório; SKU bloqueado |
| `AG022` | 04 X 08 × "04 X 08 PARA VACINA" × 10 X 08 | Família FAM-002 atribuída; SKU bloqueado |
| `AG025` × `AG026` | Mesma medida 10 X 08; `AG026` sem nome | Ambos em FAM-003; `AG026` bloqueado |
| `BI002`–`BI006` | Nome genérico no CSV × descrição de cor/ângulo no catálogo | FAM-014 atribuída; SKUs bloqueados |
| `BI999` | "DIVERSOS — CONSULTAR" | Não é SKU (D-040) |
| `PE` e `VR` potencialmente duplicados | Não há evidência de duplicidade real de código; a lacuna é de nome | Nenhuma reconciliação feita |

## 5. Códigos públicos

`codigo_publico_proposto` = `sku_original` em 173 registros. A única exceção é `BI999`, que não
recebe código público por não ser produto. A chave técnica de persistência continua sendo **UUID**
(D-037); o código alfanumérico é apenas rótulo público e campo de busca.

## 6. Imagens

`status_imagem` assume dois valores nesta etapa:

- `EM_QUARENTENA` — imagem localizada no acervo, **nenhuma aprovada** (D-048, Q-02 aberta): 94 SKUs.
- `AUSENTE_USA_PLACEHOLDER` — 80 SKUs, conforme D-033 (placeholder nunca bloqueia o produto).
