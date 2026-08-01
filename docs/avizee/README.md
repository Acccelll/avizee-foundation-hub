# Memória Permanente do Projeto AviZee

Fonte única de verdade do novo site institucional e catálogo B2B da AviZee.

> **Protocolo obrigatório**: antes de iniciar QUALQUER etapa futura, ler nesta ordem:
> 1. este README
> 2. `01-approved-decisions.md`
> 3. `02-non-negotiable-rules.md`
> 4. `16-change-log.md`
> 5. `13-open-decisions.md`
>
> Depois: identificar o escopo da etapa atual, verificar conflitos com decisões anteriores,
> registrar novas decisões aprovadas e **nunca** substituir documentação anterior silenciosamente.

## Índice

| Arquivo | Conteúdo |
|---|---|
| `00-project-charter.md` | Visão, propósito, objetivos, critérios de sucesso |
| `01-approved-decisions.md` | Decisões aprovadas (somente aprovadas) |
| `02-non-negotiable-rules.md` | Regras não negociáveis |
| `03-source-inventory.md` | Inventário e status das fontes |
| `04-traceability-matrix.md` | Matriz decisão → requisito → fonte → etapa |
| `05-business-positioning.md` | Posicionamento e tom de comunicação |
| `06-personas-and-audiences.md` | Personas preliminares (hipóteses marcadas) |
| `07-product-taxonomy.md` | Segmento → Solução → Categoria → Família → SKU |
| `08-content-strategy.md` | Central de Conteúdos e pilares editoriais |
| `09-image-policy.md` | Estados de imagem e regras de publicação |
| `10-brand-guidelines.md` | Paleta, tipografia, logotipo, grafismos |
| `11-scope-and-out-of-scope.md` | Escopo previsto e fora de escopo |
| `12-risk-register.md` | Riscos identificados |
| `13-open-decisions.md` | Decisões operacionais em aberto |
| `14-glossary.md` | Glossário de termos do projeto |
| `15-acceptance-criteria.md` | Critérios de aceite da Etapa 0 e adiante |
| `16-change-log.md` | Histórico de mudanças |
| `17-image-inventory.md` | Inventário e triagem das imagens de produto (3 acervos) |
| `18-catalog-audit.md` | Auditoria do catálogo: ~172 SKUs, divergências e cobertura |
| `19-url-inventory.md` | URLs do site atual, SEO e plano de redirecionamento 301 |
| `20-resolved-recommendations.md` | Textos normativos de L-08 a L-15 (D-031 a D-038) — encerram a Etapa 0 |

### Etapa 1 — Auditoria e Inventário (documentos 21 a 39)

| Arquivo | Conteúdo |
|---|---|
| `21-stage-01-audit-plan.md` | Plano, método e regras da auditoria |
| `22-current-site-inventory.md` | Site publicado: stack, páginas, terceiros, contatos |
| `23-codebase-inventory.md` | Código-fonte e reaproveitamento |
| `24-page-and-content-inventory.md` | Páginas, seções e textos atuais |
| `25-product-source-inventory.md` | Fontes de produto e cobertura cruzada |
| `26-provisional-product-matrix.md` | Matriz provisória de 174 SKUs |
| `27-image-inventory.md` | 188 imagens, status e duplicidades |
| `28-product-image-matrix.md` | Relação produto × imagem |
| `29-brand-asset-inventory.md` | Logotipo, paleta e lacunas de asset |
| `30-font-inventory.md` | Pesos, formatos e licença da tipografia |
| `31-seo-inventory.md` | SEO atual e oportunidades |
| `32-functional-inventory.md` | O que existe e o que não existe |
| `33-security-findings.md` | Achados de segurança |
| `34-accessibility-findings.md` | Achados de acessibilidade |
| `35-performance-findings.md` | Achados de performance |
| `36-duplicates-and-divergences.md` | Duplicidades e divergências não reconciliadas |
| `37-migration-readiness.md` | Semáforo de prontidão para migração |
| `38-stage-01-open-questions.md` | 15 perguntas abertas |
| `39-stage-01-executive-report.md` | Relatório executivo e critérios de aceite |
| `40-stage-01-answers.md` | Respostas Q-01 a Q-15 e decisões D-039 a D-051 |
| `data/*.csv` | Dados tabulares da auditoria (fontes, arquivos, páginas, produtos, imagens, relações, duplicidades, divergências, achados) |

### Etapa 2 — Arquitetura de Informação (documentos 41 a 59) — `PENDENTE_DE_APROVAÇÃO`

> **Mapa de numeração**: a Etapa 2 foi solicitada como documentos 36 a 54, mas esses números já
> pertencem à Etapa 1. Equivalência: 36→41 · 37→42 · 38→43 · 39→44 · 40→45 · 41→46 · 42→47 ·
> 43→48 · 44→49 · 45→50 · 46→51 · 47→52 · 48→53 · 49→54 · 50→55 · 51→56 · 52→57 · 53→58 · 54→59.

| Arquivo | Conteúdo |
|---|---|
| `41-stage-02-information-architecture-plan.md` | Plano, princípios e modelo conceitual |
| `42-public-sitemap-proposal.md` | Sitemap público e classificação das páginas |
| `43-admin-information-architecture.md` | Painel administrativo conceitual |
| `44-navigation-model.md` | Menu desktop, mobile, rodapé, breadcrumbs e links internos |
| `45-url-architecture.md` | Esquema de URLs, slugs, variações e parâmetros |
| `46-url-migration-map.md` | Mapa de 301/410 do site atual |
| `47-page-type-definitions.md` | 17 tipos de página e requisitos de acessibilidade |
| `48-product-discovery-architecture.md` | Segmentos, soluções, categorias e famílias |
| `49-search-and-filter-architecture.md` | Busca, sinônimos, estados e classificação de filtros |
| `50-quotation-journey.md` | Lista de cotação, estados, campos e WhatsApp |
| `51-content-hub-architecture.md` | Central de Conteúdos e modelo de artigo |
| `52-product-content-relationship-model.md` | Grafo produto × conteúdo × solução |
| `53-user-journeys.md` | 9 jornadas mapeadas |
| `54-mobile-navigation-requirements.md` | Requisitos arquiteturais de mobile |
| `55-indexation-and-canonical-strategy.md` | Indexação, canônicas e dados estruturados |
| `56-page-objective-matrix.md` | Matriz página × objetivo (24 páginas) |
| `57-v1-scope-prioritization.md` | Priorização da v1 e dependências DEP-01 a DEP-08 |
| `58-stage-02-decisions-for-approval.md` | DEC-01 a DEC-18 |
| `59-stage-02-executive-report.md` | Relatório executivo da Etapa 2 |
| `data/sitemap.csv`, `pages-proposed.csv`, `url-migrations.csv`, `user-journeys.csv`, `page-relationships.csv`, `product-content-relations.csv`, `stage-02-decisions.csv` | Dados tabulares da arquitetura |

### Etapa 2.1 — Consolidação Taxonômica (documentos 60 a 72) — `PENDENTE_DE_APROVAÇÃO`

| Arquivo | Conteúdo |
|---|---|
| `60-stage-02-1-taxonomy-resolution-plan.md` | Plano, método e regras de evidência |
| `61-approved-category-baseline.md` | Baseline aprovado; registro de DEC-05 e DEC-18 rejeitadas |
| `62-family-taxonomy-proposal.md` | 43 famílias em 6 blocos de aprovação |
| `63-sku-family-mapping.md` | 174 SKUs → família, com variação e bloqueios |
| `64-family-application-matrix.md` | Aplicação principal e secundárias |
| `65-family-segment-matrix.md` | Segmento por família e coexistência com CAT-06 |
| `66-family-editorial-relations.md` | 123 relações com as 7 categorias editoriais |
| `67-taxonomy-evidence-register.md` | Evidência citada por família |
| `68-taxonomy-conflicts.md` | 83 conflitos, todos no nível do SKU |
| `69-taxonomy-coverage-report.md` | Cobertura e lacunas |
| `70-stage-03-readiness-by-family.md` | Prontidão por família |
| `71-taxonomy-decisions-for-approval.md` | DECT-01 a DECT-14 |
| `72-stage-02-1-executive-report.md` | Relatório executivo da Etapa 2.1 |
| `73-stage-03-blocked.md` | **Registro do bloqueio de início da Etapa 3** e proposta de renumeração `74`–`94` |
| `data/families-taxonomy.csv`, `sku-family-mapping.csv`, `family-applications.csv`, `family-segments.csv`, `family-editorial-relations.csv`, `taxonomy-evidence.csv`, `taxonomy-conflicts.csv`, `stage-03-readiness.csv`, `taxonomy-decisions.csv` | Dados da consolidação |


## Etiquetas de origem (rastreabilidade)

`USER_DECISION` · `BRANDING` · `CATALOG` · `CURRENT_SITE` · `IMAGE_ASSET` · `TECHNICAL_INFERENCE` · `LOVABLE_RECOMMENDATION`

- Todo item `TECHNICAL_INFERENCE` traz o raciocínio explícito.
- Todo item `LOVABLE_RECOMMENDATION` recebe status **PENDENTE_DE_APROVAÇÃO** e nunca substitui uma decisão do usuário.

## Ordem de precedência das fontes

1. Decisões explícitas do usuário
2. Branding oficial AviZee
3. Catálogo e dados técnicos
4. Imagens e arquivos de produto
5. Conteúdo do site atual
6. Recomendações do Lovable

## Estado atual

**Etapa 0 — Constituição do Projeto**: concluída.
**Etapa 1 — Auditoria e Inventário**: concluída em 2026-08-01. Nenhuma implementação, nenhum
layout alterado, nenhum banco de dados criado.

**Materiais recebidos e analisados**: manual de branding, acervo de imagens e tipografia
(2026-07-31); **catálogo em PDF, logotipo vetorial e código-fonte do site atual** (2026-08-01).
**Todas as 8 fontes previstas foram analisadas — não há mais bloqueio de material.**

**Resultado da Etapa 1**: 174 SKUs consolidados, 188 imagens inventariadas (nenhuma aprovada),
10 divergências de alta severidade e 27 achados registrados. Ver `39-stage-01-executive-report.md`.

**Respostas da Etapa 1** (2026-08-01): Q-01 a Q-15 respondidas em `40-stage-01-answers.md`,
gerando as decisões **D-039 a D-051**. O-24 e O-26 encerradas.

**Etapa 2 — Arquitetura de Informação**: concluída em 2026-08-01 como **proposta**. 19 documentos
(41 a 59) e 7 CSVs. **Nenhuma decisão aprovada**: DEC-01 a DEC-18 aguardam manifestação em
`58-stage-02-decisions-for-approval.md`. Nenhum código, layout, rota, banco ou redirecionamento
foi criado.

**Etapa 2.1 — Consolidação Taxonômica**: concluída em 2026-08-01 como **proposta**. 13 documentos
(60 a 72) e 9 CSVs. **DEC-05 e DEC-18 foram rejeitadas pelo usuário** — "Linhas complementares"
segue como categoria e as 7 categorias editoriais seguem íntegras. 174 SKUs organizados em
**43 famílias**; 31 famílias (97 SKUs) prontas para a Etapa 3. DECT-01 a DECT-14 aguardam
manifestação em `71-taxonomy-decisions-for-approval.md`.

**Bloqueio para a Etapa 3**: **DEP-01** resolvido como proposta — encerramento formal depende de
DECT-01 e DECT-10. Novo bloqueio **DEP-09 / DECT-08**: 34 SKUs (`PE`×28, `CN`×3, `BO`×3) não têm
nome de produto em nenhuma das 8 fontes e não podem ser classificados sem uma lista da AviZee.

**Pendências ainda abertas**:
- **O-27 / RK-15 / Q-01** — revogação e rotação das credenciais SMTP e reCAPTCHA (não confirmada)
- **Q-02** — origem e direito de uso do acervo de imagens
- **Q-03** — medidas de **AG005** e **AG022** e o código correto da 2ª linha `AG016`
- **Q-08** — confirmação dos dados de contato
- **Q-13** — razão social, CNPJ, canal de privacidade e prazo de retenção
- **L-01 a L-07** — recomendações ainda sem aprovação
- **DEC-01 a DEC-18** — decisões da Etapa 2 (DEC-05 e DEC-18 encerradas como rejeitadas)
- **DECT-01 a DECT-14** — decisões da Etapa 2.1
- **DEP-09** — lista código × nome × função dos 34 SKUs órfãos

**Etapa 3 — não iniciada.** Interrompida na pré-condição em 2026-08-01. Ver `73-stage-03-blocked.md`.

