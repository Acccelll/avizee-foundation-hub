# 69 — Relatório de Cobertura Taxonômica

## 1. Métricas gerais

| Indicador | Valor |
|---|---|
| Total de SKUs no universo | 174 |
| SKUs associados a uma família | 174 (100%) |
| SKUs sem família | 0 |
| SKUs com classificação utilizável (categoria + aplicação + segmento) | 140 (80,5%) |
| SKUs sem aplicação atribuída | 34 (19,5%) |
| SKUs bloqueados individualmente | 83 (47,7%) |
| SKUs candidatos à publicação | 91 (52,3%) |
| Total de famílias propostas | 43 |
| Famílias com categoria atribuída | 43 (100%) |
| Famílias com aplicação principal | 40 (93%) |
| Famílias com segmento | 43 (100%) |

## 2. Famílias e SKUs por categoria aprovada

| Categoria | Famílias | SKUs | Famílias publicáveis na v1 |
|---|---|---|---|
| CAT-01 Vacinação e aplicação | 13 | 55 | 10 |
| CAT-02 Pulverização e sistemas de fluido | 8 | 40 | 2 |
| CAT-03 Pesagem, medição e controle | 9 | 22 | 9 |
| CAT-04 Peças, reposição e automação | 2 | 31 | 1 |
| CAT-05 Manejo, alimentação e biossegurança | 7 | 17 | 7 |
| CAT-06 **Linhas complementares** | 4 | 9 | 3 |
| **Total** | **43** | **174** | **32** |

Nenhuma categoria aprovada ficou vazia. "Linhas complementares" foi preservada com conteúdo real.

## 3. Famílias e SKUs por segmento

| Segmento | Famílias | SKUs |
|---|---|---|
| Avicultura | 39 | 165 |
| Bovinocultura | 4 | 9 |
| Suinocultura | 0 | 0 |

## 4. Famílias por status de classificação

| Status | Famílias |
|---|---|
| CONFIRMADA_POR_FONTE | 27 |
| PROPOSTA_PENDENTE_DE_APROVAÇÃO | 9 |
| BLOQUEADA | 4 |
| NÃO_CLASSIFICADA | 3 |

## 5. Famílias por prontidão para a Etapa 3

| Prontidão | Famílias | SKUs |
|---|---|---|
| READY_FOR_STAGE_3 | 25 | 62 |
| READY_WITH_PENDING_CONTENT | 6 | 30 |
| BLOCKED_BY_CODE | 1 | 3 |
| BLOCKED_BY_IDENTITY | 4 | 19 |
| BLOCKED_BY_MISSING_DATA | 7 | 60 |

**31 de 43 famílias (72%)** têm taxonomia suficiente para orientar a Etapa 3. Elas cobrem
92 SKUs, o suficiente para desenhar todos os tipos de página de catálogo sem hipóteses.

## 6. Cobertura de evidência

| Classe | Famílias | % |
|---|---|---|
| SOURCE_EXPLICIT | 36 | 83,7% |
| INFERENCE_MEDIUM | 4 | 9,3% |
| UNCLASSIFIED | 3 | 7,0% |

Nenhuma classificação `INFERENCE_LOW` foi emitida.

## 7. Cobertura de imagem

| Situação | SKUs |
|---|---|
| Imagem localizada, em quarentena (nenhuma aprovada) | 94 |
| Sem imagem — usará placeholder (D-033) | 80 |
| Imagem aprovada para publicação | **0** |

Ausência de imagem **não bloqueia** nenhuma família (§14).

## 8. Checklist de validação de cobertura (§15)

| Verificação | Resultado |
|---|---|
| Todos os SKUs candidatos à v1 ligados a uma família | OK — 174/174 |
| Todas as famílias ligadas a uma categoria | OK — 43/43 |
| Todas as famílias com aplicação principal | **Parcial — 40/43**; 3 sem fonte |
| Todas as famílias com segmento | OK — 43/43 |
| Nenhum SKU em duas famílias incompatíveis | OK |
| Nenhuma família em duas categorias sem justificativa | OK |
| Nenhuma categoria vazia | OK |
| "Linhas complementares" preservada | OK — categoria mantida, 4 famílias |
| `PE` e `VR` subdivididos adequadamente | **`VR` OK** (13 SKUs → 8 famílias em 4 categorias). **`PE` NÃO** — impossível sem nome na fonte (DECT-08) |
| Itens "diversos — consultar" não convertidos em SKU | OK — `BI999` tratado como CTA |
| Marcas de terceiros ausentes dos nomes públicos propostos | OK — 43/43 nomes neutros |

## 9. Leitura da lacuna

Os 34 SKUs sem aplicação (`PE` 28, `CN` 3, `BO` 3) representam **19,5% do catálogo e 34,5% dos
SKUs bloqueados**. Não são um problema de método: são um problema de **fonte**. Nenhuma das oito
fontes auditadas nomeia esses códigos. A única saída é a AviZee fornecer a lista código × nome —
registrada como decisão **DECT-08** e como a única dependência real remanescente para 100% de
cobertura.
