# 26 — Matriz Provisória de Produtos

Arquivo de dados: **`data/products-provisional.csv`** — 174 registros, 25 colunas.

> Provisório significa: nenhum registro está aprovado para publicação. A matriz é um retrato
> das fontes, não um catálogo.

## Colunas

`audit_id` · `source_id` · `source_location` · `sku_original` · `nome_original` ·
`nome_publico_atual` · `campo_interno_marca` · `marca_publicamente_exposta` ·
`categoria_original` · `familia_provisoria` · `variacao` · `medida` · `capacidade` · `unidade` ·
`aplicacao_confirmada` · `segmento_confirmado` · `imagem_encontrada` · `imagem_id` ·
`dados_completos` · `duplicidade_suspeita` · `divergencia` · `nivel_confianca` ·
`publicar_no_futuro` · `requer_revisao` · `observacoes`

Não existe coluna de preço (R-04). A marca de terceiro observada fica **exclusivamente** em
`campo_interno_marca` (D-035).

## Situação agregada

| Indicador | Valor |
|---|---|
| SKUs | 174 |
| Com imagem localizada | 94 (54%) |
| Sem imagem | 80 (46%) |
| Confiança ALTA | 104 |
| Confiança MÉDIA | 60 |
| Confiança BAIXA | 10 |
| Candidatos a publicação | 76 |
| Pendentes | 98 |
| Com marca de terceiro exposta no nome | 16 |
| Com divergência entre fontes | 10 |
| `aplicacao_confirmada` | 0 |
| `segmento_confirmado` | 0 |

`TECHNICAL_INFERENCE` — Raciocínio: `aplicacao_confirmada` e `segmento_confirmado` são zero em
todos os 174 registros porque **nenhuma fonte declara** aplicação ou segmento por SKU. Inferir
"avicultura" a partir do nome do produto seria invenção de dado e foi recusado.

## SKUs com marca de terceiro no nome público (R-05 / D-035)

`BV005` e o grupo `SR001`–`SR012`, `SR025`, `SR026`, `SR027` (15 itens). Todos marcados
`marca_publicamente_exposta = SIM` e `publicar_no_futuro = PENDENTE`. A renomeação funcional
segue a tabela normativa de `20-resolved-recommendations.md`.

## Regra de bloqueio aplicada

Conforme D-036, cada divergência bloqueia **apenas o registro afetado**. Os 10 SKUs listados em
`data/divergences.csv` estão com `requer_revisao = SIM` e `publicar_no_futuro = PENDENTE`; os
demais registros seguem o fluxo normal.
