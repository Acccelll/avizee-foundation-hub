# 28 — Matriz Produto × Imagem

Arquivo de dados: **`data/product-image-relations.csv`** — 261 relações.

## Tipos de relação

| Tipo | Critério |
|---|---|
| `EXATA` | nome do arquivo corresponde ao código do SKU |
| `FAMILIA` | arquivo de outro SKU do mesmo prefixo, candidato a uso na família |

## Cobertura

| Indicador | Valor |
|---|---|
| SKUs com ao menos uma imagem | 94 de 174 (54%) |
| SKUs sem nenhuma imagem | 80 (46%) |
| Famílias 100% sem imagem | `CN` (22), `BO` (3), `BT` (2) |
| Famílias com maior lacuna absoluta | `PE` (24 de 28), `AG` (16 de 26) |
| Famílias com cobertura total | `AR`, `AZ`, `BA`, `BB`, `BV`, `LM`, `SR`, `TB`, `TE`, `VR` |

`TECHNICAL_INFERENCE` — Raciocínio: as três famílias sem nenhuma imagem (`CN`, `BO`, `BT`) são
exatamente as introduzidas pelo catálogo complementar, que nunca esteve no site. A lacuna é
consequência direta da origem do dado, não de perda de arquivo.

## Uso recomendado

Todas as 261 relações estão com `uso_recomendado = REVISAR` e pendência registrada, porque
nenhuma imagem tem direito de uso confirmado. Nenhuma imagem foi promovida a "principal".

## Tratamento das lacunas

Conforme D-033 (L-10), os 80 SKUs sem imagem **permanecem na v1** com placeholder oficial e
pendência de nova fotografia — não são removidos do catálogo. A seleção de imagem é feita por
SKU/família e nenhum acervo prevalece globalmente (D-034 / L-11).
