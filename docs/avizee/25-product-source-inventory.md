# 25 — Inventário das Fontes de Produto

## Fontes e volumes

| Fonte | Códigos | Observação |
|---|---|---|
| `produtos.csv` (S-02) | 117 | base do site atual; colunas `COD.`, `Nome`, `GRUPO`, `VARIAÇÕES`, `UN` |
| Catálogo publicado (S-03a, 10 p.) | 116 | catálogo comercial em circulação |
| Catálogo complementar (S-03b, 11 p.) | 106 | inclui famílias ausentes do site |
| **Universo consolidado** | **174** | ver `data/products-provisional.csv` |

## Cobertura cruzada

| Situação | Qtd. | Exemplos |
|---|---|---|
| Presente nas 3 fontes | 51 | AG001, BA001, SR001 |
| CSV + catálogo publicado | 58 | — |
| Somente catálogo complementar | 50 | CN001–CN026, BO001–BO003, BT001–BT002, PE004… |
| Somente CSV | 8 | AG025, BA011, BI007, TE003, TE004, VR011, VR012, VR013 |
| Somente catálogo publicado | 2 | AG026, SR029 |
| Catálogo publicado + complementar | 5 | — |

## Famílias provisórias (prefixo do código)

| Prefixo | SKUs | Sem imagem |
|---|---|---|
| AG | 26 | 16 |
| AR | 4 | 0 |
| AZ | 6 | 0 |
| BA | 12 | 0 |
| BB | 4 | 0 |
| BI | 8 | 6 |
| BO | 3 | 3 |
| BT | 2 | 2 |
| BV | 9 | 0 |
| CN | 22 | 22 |
| CO | 4 | 3 |
| LM | 3 | 0 |
| PE | 28 | 24 |
| SE | 5 | 4 |
| SR | 16 | 0 |
| TB | 5 | 0 |
| TE | 4 | 0 |
| VR | 13 | 0 |
| **Total** | **174** | **80** |

`TECHNICAL_INFERENCE` — Raciocínio: o prefixo alfabético de duas letras é o único agrupador
presente em todas as fontes, por isso foi adotado como **família provisória**. Ele não substitui
a taxonomia aprovada em `07-product-taxonomy.md`; a classificação definitiva
(Segmento → Solução → Categoria → Família) depende da Etapa de modelagem.

## Campos ausentes em todas as fontes

Descrição técnica, aplicação declarada, segmento declarado, material, compatibilidade, norma,
peso, dimensões de embalagem e conteúdo por caixa. Nenhuma fonte traz esses dados — por isso
104 SKUs ficam em confiança `ALTA` apenas quanto a **código e nome**, nunca quanto a
especificação técnica.

## Preços

Nenhuma coluna de preço foi criada, lida ou registrada em qualquer artefato desta auditoria (R-04).
