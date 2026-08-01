# 104 — Modelo de Dados do Catálogo

## 1. Requisitos atendidos

Família com vários SKUs · SKU com medida/capacidade/variação · várias aplicações por família
com uma principal · vários segmentos · categoria pública e subcategoria funcional · imagem de
família e imagem específica com placeholder · documentos · especificações comuns e específicas ·
relacionados · artigos relacionados · status de publicação e de validação · aliases internos ·
códigos históricos · conflitos de código · produto sob consulta · produto não publicável.

## 2. Estados

| Status | Significado | Público? |
|---|---|---|
| DRAFT | Em preenchimento | Não |
| UNDER_REVIEW | Aguardando validação de dados | Não |
| BLOCKED_BY_CODE | Conflito de código não resolvido (D-037) | Não |
| BLOCKED_BY_IDENTITY | Sem nome público funcional ou identidade (34 SKUs, D-054) | Não |
| BLOCKED_BY_RIGHTS | Direito de imagem/documento negado ou desconhecido e obrigatório | Não |
| READY_TO_PUBLISH | Dados confiáveis, aguardando gate | Não |
| PUBLISHED | Visível, indexável | Sim |
| UNPUBLISHED | Retirado, URL tratada por redirect ou 410 | Não |
| ARCHIVED | Histórico, preservado para cotações antigas | Não |

Regras: bloqueio é por **registro**, nunca por família inteira (D-037); imagem ausente **não**
bloqueia produto com dados confiáveis — usa placeholder oficial (D-033/R-07); produto
`is_on_request = true` aparece com CTA de cotação e sem qualquer indicação de preço.

## 3. Herança

Especificações e aplicações declaradas na família valem para todos os SKUs; o SKU pode
sobrescrever. A resolução ocorre em view materializada, com precedência SKU > família > categoria.

## 4. Imagens

`product_images(product_id | family_id, media_asset_id, papel: PRIMARY/GALLERY, ordem)`.
Resolução na exibição: imagem específica aprovada → imagem de família aprovada → placeholder.
Ativo com `review_status != APPROVED` nunca entra na resolução.

## 5. Escopo de conteúdo real na v1

31 famílias / 97 SKUs (D-052/D-053) migram como `READY_TO_PUBLISH`. Os demais entram como
`UNDER_REVIEW` ou `BLOCKED_*` — importados, **nunca excluídos** (D-054), invisíveis ao público
e não pesquisáveis publicamente.
