# 72 — Relatório Executivo da Etapa 2.1

**Data**: 2026-08-01 · **Escopo**: resolução do bloqueio DEP-01 · **Status**: concluída como
**proposta**. Nenhuma classificação aprovada.

## 1. Resumo executivo

Os 174 SKUs do universo consolidado foram organizados em **43 famílias** distribuídas nas **6
categorias aprovadas**, com aplicação principal, aplicações secundárias, segmento, evidência
citada e nível de confiança por linha. Cobertura de associação SKU → família: **100%**.

Trinta e uma famílias (72%), cobrindo 97 SKUs, têm taxonomia suficiente para orientar a Etapa 3.
Doze permanecem bloqueadas — e a maior causa não é método, é fonte: **34 códigos chegam sem nome
de produto em nenhuma das oito fontes auditadas**.

## 2. Confirmação de preservação de DEC-05 e DEC-18

| Decisão | Estado | Registro |
|---|---|---|
| DEC-05 | **NÃO_APLICADA** | "Linhas complementares" permanece como categoria pública aprovada, com 4 famílias e 9 SKUs. O segmento coexiste como atributo e filtro. `61` §5 |
| DEC-18 | **NÃO_APLICADA** | As 7 categorias editoriais permanecem íntegras, incluindo "Curiosidades da avicultura", "Notícias e mercado" e "Produtos e aplicações". `61` §6 |

Ambas foram encerradas com motivo, impacto e arquivos afetados. Nenhuma segue aguardando
aplicação silenciosa.

## 3. Método

Família primeiro; SKU e variação herdam. Prefixo nunca é evidência única. Toda afirmação recebe
classe de evidência, citação literal e raciocínio. Inferência nasce pendente. Conflito bloqueia o
registro, não a família. Imagem é evidência de identidade, jamais de especificação.

## 4. Categorias vigentes

CAT-01 Vacinação e aplicação · CAT-02 Pulverização e sistemas de fluido · CAT-03 Pesagem, medição
e controle · CAT-04 Peças, reposição e automação · CAT-05 Manejo, alimentação e biossegurança ·
CAT-06 Linhas complementares. **Nenhuma renomeada, fundida, removida ou criada.**

## 5. Aplicações vigentes

23 termos do vocabulário controlado. **Nenhum termo novo criado.** 18 em uso como aplicação
principal; `incubação`, `inspeção`, `automação`, `ar comprimido` e `medição` aparecem apenas como
secundárias.

## 6. Segmentos vigentes

Avicultura (39 famílias, 165 SKUs) · Bovinocultura (4 famílias, 9 SKUs) · Suinocultura (0 SKUs,
permanece sob consulta).

## 7 a 12. Números

| Indicador | Valor |
|---|---|
| Famílias propostas | 43 |
| SKUs associados | 174 (100%) |
| SKUs com categoria + aplicação + segmento | 140 (80,5%) |
| SKUs candidatos à publicação | 91 |
| SKUs bloqueados | 83 |
| Famílias por categoria | 13 · 8 · 9 · 2 · 7 · 4 |
| Famílias por segmento | 39 avicultura · 4 bovinocultura |
| Famílias com aplicação principal | 40 de 43 |

## 13. Itens não classificados

34 SKUs em 3 famílias: `FAM-032` (28 `PE`), `FAM-019` (3 `CN`), `FAM-021` (3 `BO`).
Causa única: ausência de nome de produto na fonte.

## 14. Itens bloqueados

83 SKUs — 57 por dado ausente, 16 por marca de terceiro, 10 por divergência de fonte, 1 por não
ser SKU (`BI999`).

## 15. Conflitos

83 registrados em `data/taxonomy-conflicts.csv`, **todos no nível do SKU**. Nenhuma família foi
bloqueada por conflito de um item. As 10 divergências da Etapa 1 **não foram reconciliadas**.

## 16. Inferências

4 famílias `INFERENCE_MEDIUM` (21 SKUs, todas de conexão e pulverização). Zero `INFERENCE_HIGH`,
zero `INFERENCE_LOW`. Todas marcadas `PROPOSTA_PENDENTE_DE_APROVAÇÃO`.

## 17. Evidências

43 registros em `data/taxonomy-evidence.csv`, cada um com fonte, localização, citação literal e
raciocínio. 36 famílias (83,7%) apoiadas em `SOURCE_EXPLICIT`.

## 18. Matriz família → categoria → aplicação

`data/families-taxonomy.csv` (43 × 29). Documento: `62-family-taxonomy-proposal.md`.

## 19. Matriz SKU → família

`data/sku-family-mapping.csv` (174 × 25). Documento: `63-sku-family-mapping.md`.

## 20. Relação com categorias editoriais

`data/family-editorial-relations.csv` (123 relações, todas `RECOMENDADA`). As 7 categorias
editoriais permanecem inalteradas. Nenhum artigo criado.

## 21. Prontidão para a Etapa 3

25 `READY_FOR_STAGE_3` · 6 `READY_WITH_PENDING_CONTENT` · 1 `BLOCKED_BY_CODE` ·
4 `BLOCKED_BY_IDENTITY` · 7 `BLOCKED_BY_MISSING_DATA`.

## 22. Decisões pendentes

**DECT-01 a DECT-14** em `71-taxonomy-decisions-for-approval.md`. As críticas são **DECT-08**
(nome dos 34 códigos órfãos) e **DECT-10** (liberação parcial da Etapa 3).

## 23. Documentos criados

`60-stage-02-1-taxonomy-resolution-plan.md` · `61-approved-category-baseline.md` ·
`62-family-taxonomy-proposal.md` · `63-sku-family-mapping.md` ·
`64-family-application-matrix.md` · `65-family-segment-matrix.md` ·
`66-family-editorial-relations.md` · `67-taxonomy-evidence-register.md` ·
`68-taxonomy-conflicts.md` · `69-taxonomy-coverage-report.md` ·
`70-stage-03-readiness-by-family.md` · `71-taxonomy-decisions-for-approval.md` · este relatório.

CSVs: `families-taxonomy.csv` · `sku-family-mapping.csv` · `family-applications.csv` ·
`family-segments.csv` · `family-editorial-relations.csv` · `taxonomy-evidence.csv` ·
`taxonomy-conflicts.csv` · `stage-03-readiness.csv` · `taxonomy-decisions.csv`.

## 24. Documentos atualizados

`01-approved-decisions.md` · `04-traceability-matrix.md` · `07-product-taxonomy.md` ·
`12-risk-register.md` · `13-open-decisions.md` · `14-glossary.md` · `16-change-log.md` ·
`57-v1-scope-prioritization.md` · `README.md`.

## 25. Confirmação — nenhuma implementação

`src/` intocado. Nenhum componente, rota, layout, banco de dados, migração, redirecionamento ou
importação de produto. Nenhum produto publicado.

## 26. Confirmação — nenhum design system

Nenhum token, paleta aplicada, tipografia implementada, grid, componente ou biblioteca visual.

## 27. Confirmação — nenhuma taxonomia assumida como aprovada

As 43 famílias, as 108 relações de aplicação, as 43 atribuições de segmento e as 123 relações
editoriais estão todas em `PROPOSTA_PENDENTE_DE_APROVAÇÃO`, `BLOQUEADA` ou `NÃO_CLASSIFICADA`.
`01-approved-decisions.md` **não** recebeu nenhuma decisão nova de classificação.

## 28. Regra de liberação da Etapa 3

A Etapa 3 permanece **bloqueada**. Liberação exige: matriz família → categoria → aplicação
aprovada; segmentos aprovados; famílias estruturais aprovadas; conflitos isolados em SKUs;
taxonomia pública estável; DEC-05 e DEC-18 seguindo não aplicadas; e **aprovação expressa do
usuário**.
