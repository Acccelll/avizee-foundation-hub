# 16 — Change Log

Formato: data · etapa · alteração · documentos afetados · origem.

---

## 2026-07-31 — Etapa 0: Constituição do Projeto e Memória Permanente

**Alteração**: criação da memória permanente do projeto AviZee.

**Origem**: `USER_DECISION` — prompt "ETAPA 0 — CONSTITUIÇÃO DO PROJETO E MEMÓRIA PERMANENTE".

**Documentos criados**:
- `README.md`
- `00-project-charter.md`
- `01-approved-decisions.md` (D-001 a D-030)
- `02-non-negotiable-rules.md` (R-01 a R-13)
- `03-source-inventory.md` (S-01 a S-08, DIV-01 a DIV-05)
- `04-traceability-matrix.md` (T-01 a T-16)
- `05-business-positioning.md`
- `06-personas-and-audiences.md` (P-01 a P-06)
- `07-product-taxonomy.md`
- `08-content-strategy.md`
- `09-image-policy.md`
- `10-brand-guidelines.md`
- `11-scope-and-out-of-scope.md`
- `12-risk-register.md` (RK-01 a RK-14)
- `13-open-decisions.md` (O-01 a O-25, L-01 a L-07)
- `14-glossary.md`
- `15-acceptance-criteria.md`
- `16-change-log.md`

**Notas**:
- Nenhum código funcional foi implementado.
- Nenhuma alteração visual foi aplicada ao projeto.
- Nenhum banco de dados ou migração foi criado.
- Fontes `catalogo.pdf`, `avizee.pdf`, `Mercado Livre.zip`, arquivos Montserrat, logotipos e
  código-fonte do site atual **não estavam disponíveis** no ambiente; registradas como
  `NÃO_RECEBIDO` e como bloqueios O-21…O-25.
- O site atual (`https://avizee.com.br/`) foi analisado apenas na Home; divergências registradas
  em `03-source-inventory.md`, sem reconciliação.

---

## 2026-07-31 — Recebimento de fontes: branding, imagens e tipografia

**Alteração**: análise de três anexos recebidos após a Etapa 0 e atualização da documentação.

**Origem**: `BRANDING`, `IMAGE_ASSET` — arquivos enviados pelo usuário.

**Fontes analisadas**:
- `avizee.pdf` ("PROPOSTA DE BRANDING — AVIZEE V.01", 10 páginas) → S-04 passa a `ANALISADO`
- `Mercado Livre.zip` (110 imagens) → S-05 passa a `ANALISADO`
- `Montserrat.zip` (Montserrat 11 pesos OTF + 2 TTF; Montserrat Alternates 11 pesos) → S-06 passa a `ANALISADO`

**Documentos alterados**:
- `03-source-inventory.md` — S-04/S-05/S-06 atualizados; S-07 redefinido para "assets vetoriais"; bloqueios revistos; DIV-06 a DIV-09 adicionadas
- `10-brand-guidelines.md` — reescrito com a construção verificada do logotipo, versões de aplicação, definição da marca e observações sobre o pacote tipográfico
- `13-open-decisions.md` — O-21/O-22/O-25 marcados como ATIVOS, O-23 resolvido, O-24 reformulado; L-08 a L-11 adicionadas
- `17-image-inventory.md` — **criado**

**Achados relevantes**:
- Paleta oficial **confirmada** contra o manual: `#151514`, `#690500`, `#b2592c`, `#fffaed`.
- Símbolo da marca é uma **cabeça de galo em traço contínuo fundida a meia engrenagem** — não há grafismo em "V" no manual (DIV-06).
- Pacote Montserrat **sem itálicos e sem WOFF2**.
- Cerca de **11 códigos de imagem com marca de terceiro visível** — não publicáveis sob R-05.
- **4 grupos de imagens idênticas** servindo códigos diferentes, confirmando o agrupamento por família.

**Notas**: nenhuma decisão aprovada foi alterada. Nenhum código funcional implementado, nenhum
layout alterado, nenhum asset copiado para o projeto.

---

## 2026-08-01 — Recebimento das fontes finais: catálogo, logotipo vetorial e código-fonte

**Alteração**: análise dos três últimos anexos pendentes e encerramento de todos os bloqueios de material.

**Origem**: `CATALOG`, `BRANDING`, `CURRENT_SITE`.

**Fontes analisadas**:
- Logotipo vetorial (SVG/PDF/PNG/JPG, versão colorida) → S-07 passa a `ANALISADO`
- Código-fonte do site atual (ZIP, 174 arquivos, PHP + cPanel) → S-02 passa a `ANALISADO`
- Catálogo em PDF, 11 páginas (complementar) + `catalogo.pdf` de 10 páginas dentro do site → S-03 passa a `ANALISADO`

**Documentos alterados**:
- `18-catalog-audit.md` — **criado**: auditoria completa do catálogo
- `19-url-inventory.md` — **criado**: URLs, SEO atual e plano de 301
- `03-source-inventory.md` — S-02/S-03/S-07 atualizados; seção de bloqueios substituída por "Estado das fontes"; DIV-05 e DIV-08 resolvidas; DIV-10 a DIV-17 adicionadas
- `13-open-decisions.md` — O-21/O-22/O-25 **resolvidos**; O-26 e O-27 criados; L-12 a L-15 adicionadas
- `12-risk-register.md` — RK-03/RK-06/RK-13 atualizados; RK-15, RK-16 e RK-17 criados
- `17-image-inventory.md` — terceiro acervo (72 JPG do site) e cobertura real registrados
- `README.md` — índice e estado atual atualizados

**Achados relevantes**:
- O catálogo real tem **~172 SKUs**, não 117: o PDF de 11 páginas traz **55 códigos exclusivos**
  (conexões CN, peças PE, bombas BO, bateria BT) que não estão no site nem no CSV.
- **Violação estrutural de R-05**: o grupo inteiro **"SOCOREX"** (15 SKUs) e os nomes `BV005`,
  `LM001`, `LM002` carregam marca de terceiro. Registrado como L-12 / RK-16.
- **Colisões de código** entre as fontes (AG016 duplicado, AG022 conflitante, PE006/VR010,
  PE075/VR011, PE076/VR012, PE079/VR013). Registrado como L-13 / RK-17.
- O site atual **não tem páginas de produto** nem banco de dados: PHP lendo um CSV, 5 URLs
  públicas. O risco de perda de SEO cai substancialmente.
- **Credencial SMTP em texto claro** no código-fonte recebido — RK-15 / O-27, ação imediata.
- Logotipo vetorial confirma a paleta: símbolo `#690500`, wordmark `#b2592c`; lockup horizontal.

**Notas**: nenhuma decisão aprovada foi alterada. Nenhum código funcional implementado, nenhum
layout alterado. Únicos arquivos fora de `/docs`: os assets do logotipo guardados em
`src/assets/brand/` (não referenciados por nenhuma tela).


## 2026-08-01 — Encerramento das recomendações L-08 a L-15

**Origem**: `USER_DECISION` — decisões finais informadas pelo usuário.

**Documentos alterados**:
- `01-approved-decisions.md` — **D-031 a D-038** criadas
- `13-open-decisions.md` — L-08 a L-15 marcadas como RESOLVIDAS com o D correspondente
- `03-source-inventory.md` — DIV-06 e DIV-17 resolvidas; DIV-10 a DIV-16 com tratamento definido
- `10-brand-guidelines.md` — Montserrat Alternates proibida; DIV-06 encerrada
- `18-catalog-audit.md` — impacto de R-05 e divergências com tratamento aprovado
- `19-url-inventory.md` — `/assets/docs/catalogo.pdf` passa a 301 para `/produtos`

**Efeitos**:
- D-016 fica **superada** na parte "grafismos inspirados na letra V" (D-032).
- A modelagem do catálogo está **destravada**: chave UUID, código como atributo.

**Permanecem abertas**: L-01 a L-07, O-01 a O-20, O-24 (WOFF2), O-26 (versões do logotipo),
O-27 (credencial SMTP exposta).

**Complemento (mesmo dia)**: criado `20-resolved-recommendations.md` com os textos normativos
integrais de L-08 a L-15, incluindo a tabela de normalização de nomes públicos (SOCOREX, LM001–LM003),
a ordem de prioridade para nova fotografia, os 8 critérios de seleção de imagem, os campos
obrigatórios do registro de produto (`id`/`sku_publico`/`codigo_original`/`fonte_codigo`/
`aliases_internos`/`status_validacao`) e o tratamento do PDF aposentado. Índice do `README.md` atualizado.

## 2026-08-01 — Etapa 1: Auditoria dos Materiais e Inventário Geral

**Origem**: `USER_DECISION` (prompt da Etapa 1) + `TECHNICAL_INFERENCE`.

**Documentos criados** (faixa 21–39, para não colidir com os documentos 00–20 da Etapa 0):
`21-stage-01-audit-plan.md`, `22-current-site-inventory.md`, `23-codebase-inventory.md`,
`24-page-and-content-inventory.md`, `25-product-source-inventory.md`,
`26-provisional-product-matrix.md`, `27-image-inventory.md`, `28-product-image-matrix.md`,
`29-brand-asset-inventory.md`, `30-font-inventory.md`, `31-seo-inventory.md`,
`32-functional-inventory.md`, `33-security-findings.md`, `34-accessibility-findings.md`,
`35-performance-findings.md`, `36-duplicates-and-divergences.md`, `37-migration-readiness.md`,
`38-stage-01-open-questions.md`, `39-stage-01-executive-report.md`.

**Dados criados** em `docs/avizee/data/`: `sources.csv` (9), `files.csv` (174), `pages.csv` (7),
`products-provisional.csv` (174), `images.csv` (188), `product-image-relations.csv` (261),
`duplicates.csv` (5), `divergences.csv` (10), `findings.csv` (27).

**Principais achados**: universo de 174 SKUs (50 exclusivos do catálogo complementar);
188 imagens, **nenhuma** com direito de uso confirmado; 80 SKUs sem imagem; 16 SKUs com marca de
terceiro no nome; 10 divergências de alta severidade; **duas credenciais em texto claro**
(SMTP e reCAPTCHA); blog sem nenhum artigo real; nenhuma fonte com dado técnico por SKU.

**Efeitos no registro de riscos**: RK-15 ampliado (inclui reCAPTCHA); RK-01, RK-02, RK-03 e RK-05
quantificados; RK-07 e RK-11 confirmados; RK-06 mantido reduzido. Criado **RK-18**.

**Nenhum código funcional, nenhuma alteração visual e nenhuma migração foram executados.**

## 2026-08-01 — Respostas da Etapa 1 (Q-01 a Q-15)

**Origem**: `USER_DECISION`.

**Documento criado**: `40-stage-01-answers.md`, com o texto normativo das 15 respostas.

**Decisões aprovadas**: **D-039** (família BI: catálogo prevalece) · **D-040** (BI999 vira CTA de
consulta) · **D-041** (completude progressiva) · **D-042** (segmento/aplicação herdados da família;
PE e VR subdivididas) · **D-043** (backlog editorial) · **D-044** (Lista de Cotação principal,
WhatsApp secundário) · **D-045** (usar as versões de logo existentes — encerra **O-26**) ·
**D-046** (WOFF2 + self-host da Montserrat convencional — encerra **O-24**) · **D-047** (base legal:
procedimentos preliminares a contrato) · **D-048** (quarentena das 6 imagens sem código) ·
**D-049** (EmbedSocial removido; Maps por interação) · **D-050** (direito de uso condicional das
imagens) · **D-051** (AG019 = 12 × 10; AG016 = 06 × 10 com a 2ª linha bloqueada).

**Riscos atualizados**: RK-02 mitigado por política; RK-03 reduzido (8 das 10 divergências
encerradas); RK-15 reforçado com o protocolo de encerramento de Q-01; RK-18 vinculado a D-041.

**Permanecem abertas**: Q-01, Q-02, parte da Q-03 (AG005 e AG022), Q-08, os dados legais da Q-13 e
as recomendações L-01 a L-07.

**Nenhum código funcional, nenhuma alteração visual e nenhuma migração foram executados.**

## 2026-08-01 — Etapa 2: Arquitetura de Informação, Sitemap e Jornadas

**Origem**: `LOVABLE_RECOMMENDATION`. **Status global**: `PENDENTE_DE_APROVAÇÃO`.

**Numeração**: a etapa foi solicitada como documentos 36 a 54, números já ocupados pela Etapa 1.
Para não sobrescrever registro histórico, a Etapa 2 ocupa **41 a 59**. Mapa de equivalência no
`README.md`.

**Documentos criados** (19): `41-stage-02-information-architecture-plan.md` ·
`42-public-sitemap-proposal.md` · `43-admin-information-architecture.md` ·
`44-navigation-model.md` · `45-url-architecture.md` · `46-url-migration-map.md` ·
`47-page-type-definitions.md` · `48-product-discovery-architecture.md` ·
`49-search-and-filter-architecture.md` · `50-quotation-journey.md` ·
`51-content-hub-architecture.md` · `52-product-content-relationship-model.md` ·
`53-user-journeys.md` · `54-mobile-navigation-requirements.md` ·
`55-indexation-and-canonical-strategy.md` · `56-page-objective-matrix.md` ·
`57-v1-scope-prioritization.md` · `58-stage-02-decisions-for-approval.md` ·
`59-stage-02-executive-report.md`.

**Dados criados** (7): `data/sitemap.csv` (28 nós) · `data/pages-proposed.csv` (24 páginas ×
20 colunas) · `data/url-migrations.csv` (17) · `data/user-journeys.csv` (9) ·
`data/page-relationships.csv` (14) · `data/product-content-relations.csv` (20) ·
`data/stage-02-decisions.csv` (18).

**Documentos atualizados**: `01-approved-decisions.md` (nota de que nada foi aprovado) ·
`04-traceability-matrix.md` (T-17 a T-24) · `07-product-taxonomy.md` ·
`08-content-strategy.md` · `11-scope-and-out-of-scope.md` · `12-risk-register.md`
(RK-19 a RK-22) · `13-open-decisions.md` · `14-glossary.md` · `README.md`.

**Escolhas estruturais propostas**: família como página canônica do produto (sem URL por
variação) · categoria organiza por tipo e solução por problema · página só indexa com conteúdo
próprio · segmento como filtro e selo, sem hub · busca global sem marca de terceiro ·
cotação persistida antes de qualquer envio.

**Bloqueio para a Etapa 3**: DEP-01 — a classificação família → categoria → aplicação não existe
em nenhuma fonte e precisa ser executada antes do design system.

**Nenhuma decisão foi aprovada. Nenhum código, rota, componente, banco de dados, importação,
redirecionamento real ou alteração de layout foi produzido nesta etapa.**

---

## 2026-08-01 — Etapa 2.1: Consolidação taxonômica e resolução do DEP-01

**Decisões do usuário registradas**: **DEC-05 rejeitada** — "Linhas complementares" permanece
categoria aprovada. **DEC-18 rejeitada** — as 7 categorias editoriais permanecem. Confirmado o
bloqueio da Etapa 3 até existir matriz aprovada de família → categoria → aplicação → segmento.

**Documentos criados**: `60-stage-02-1-taxonomy-resolution-plan.md` ·
`61-approved-category-baseline.md` · `62-family-taxonomy-proposal.md` ·
`63-sku-family-mapping.md` · `64-family-application-matrix.md` · `65-family-segment-matrix.md` ·
`66-family-editorial-relations.md` · `67-taxonomy-evidence-register.md` ·
`68-taxonomy-conflicts.md` · `69-taxonomy-coverage-report.md` ·
`70-stage-03-readiness-by-family.md` · `71-taxonomy-decisions-for-approval.md` ·
`72-stage-02-1-executive-report.md`.

**Dados criados**: `families-taxonomy.csv` (43) · `sku-family-mapping.csv` (174) ·
`family-applications.csv` (108) · `family-segments.csv` (43) ·
`family-editorial-relations.csv` (123) · `taxonomy-evidence.csv` (43) ·
`taxonomy-conflicts.csv` (83) · `stage-03-readiness.csv` (43) · `taxonomy-decisions.csv` (14).

**Documentos atualizados**: `01-approved-decisions.md` · `04-traceability-matrix.md` (T-25 a T-30
e correção de T-24) · `07-product-taxonomy.md` · `12-risk-register.md` (RK-23 a RK-26) ·
`13-open-decisions.md` · `14-glossary.md` · `57-v1-scope-prioritization.md` · `README.md`.

**Resultado**: 174 SKUs → 43 famílias, 100% associados; 140 SKUs (80,5%) com categoria,
aplicação e segmento; 31 famílias `READY_FOR_STAGE_3`; 83 conflitos registrados no nível do SKU;
34 SKUs sem nome em nenhuma fonte (DECT-08 / RK-23 / DEP-09).

**Nenhuma decisão foi aprovada. Nenhum código, componente, rota, banco de dados, design system,
token, importação de produto ou alteração de layout foi produzido nesta etapa.**

---

## 2026-08-01 — Etapa 3 solicitada e **interrompida na pré-condição**

Solicitação da Etapa 3 (design system, arquitetura de interface e protótipos). Execução
**interrompida** conforme §1.6 e §2 do próprio prompt: a Etapa 2.1 não está aprovada
(DECT-01 a DECT-14 seguem `PENDENTE_DE_APROVAÇÃO`).

Registro em `73-stage-03-blocked.md`: bloqueios B-01 (taxonomia não aprovada), B-02 (34 SKUs sem
nome), B-03 (16 SKUs sem nome público funcional) e o conflito de numeração — os intervalos
`55`–`67` e `68`–`88` citados no prompt já estão ocupados; proposta de a Etapa 3 usar `74`–`94`.

Corrigido defeito de dados em `data/taxonomy-decisions.csv` (campo `riscos` de DECT-08 sem aspas
deslocava as colunas seguintes).

**Nenhum documento da Etapa 3 foi criado. Nenhum token, componente, wireframe ou protótipo foi
produzido. `src/` permanece intocado.**

---

## 2026-08-01 — Etapa 3 **liberada** com escopo controlado

`USER_DECISION`. O diagnóstico de `73` foi aceito e o bloqueio foi resolvido por aprovação
parcial, não por aprovação em bloco:

- **DECT-01 → APROVADA_PARCIALMENTE** — 31 famílias / 97 SKUs. As 12 famílias restantes seguem
  pendentes. As 43 famílias **não** foram aprovadas integralmente.
- **DECT-10 → APROVADA_COM_ESCOPO_CONTROLADO** — protótipos só com dados reais aprovados.
- **B-01 resolvido** para o escopo aprovado; **B-02 e B-03 contidos**, não encerrados.
- **Renumeração aprovada**: Etapa 3 = `74`–`94`; **Etapa 4 = `95`–`130`** (+6 sobre `89`–`124`).
- `73-stage-03-blocked.md` renomeado para **`73-stage-03-start-blocker.md`**, com a decisão
  registrada em §7.
- Decisões **D-052 a D-055** registradas em `01-approved-decisions.md`.
- `data/taxonomy-decisions.csv` e `data/stage-03-readiness.csv` atualizados com o novo status.
- DEC-05 e DEC-18 reconfirmadas como **NÃO APLICADAS**.

## 2026-08-01 — Etapa 3 executada como proposta

Criados os documentos `74` a `94` (design system, tokens, tipografia, cor, grid, iconografia,
imagem, componentes, estados, wireframes, protótipos públicos e administrativos,
responsividade, acessibilidade, microcopy, validação de jornadas, checklist, comparação com o
site atual, decisões e relatório executivo).

**Todo o resultado é PROPOSTA, com status `PENDENTE_DE_APROVAÇÃO`.** Nada publicado, nenhum
backend, nenhum formulário ativo, nenhum produto importado, nenhuma alteração no site atual.


## 2026-08-01 — Etapa 3 aprovada com ajustes; Etapa 4 liberada para planejamento técnico

- **DES-01 a DES-16 aprovadas**, com quatro correções do usuário:
  1. sucesso e informação **não** usam preto e terracota — passam a verde funcional `#1f6b3c` e
     azul funcional `#12557e`, externos à marca e restritos a feedback (**D-056**, encerra L-01);
  2. **nenhuma segunda família monoespaçada** para SKU — Montserrat 500/600 com
     `tabular-nums` (**D-057**);
  3. acessibilidade permanece em **WCAG 2.2 AA**, sem regressão para 2.1 (**D-058**);
  4. a Etapa 4 é de **arquitetura técnica**, não de construção de componentes (**D-059**).
- **D-060** consolida os demais vereditos; **D-061** libera a Etapa 4 apenas para planejamento.
- Atualizados: `01`, `04`, `10`, `12`, `13`, `15`, `76`, `77`, `78`, `82`, `88`, `93`, `94`,
  `README.md`, `data/stage-03-decisions.csv`.
- Criados: `design/tokens.json`, `design/color-contrast-matrix.csv`,
  `design/prototype-decisions.csv`.
- **Nada implementado**: `src/` intocado, nenhum token aplicado, nenhum componente codificado,
  nenhuma rota criada, nenhum banco de produção, nenhum serviço externo ativado.


## 2026-08-01 — Etapa 4: arquitetura técnica, modelagem, segurança e plano de implementação

- **Criados 36 documentos**: `95-stage-04-technical-architecture-plan.md` a
  `130-stage-04-executive-report.md` (numeração D-055, deslocamento +6 sobre os `89`–`124`
  do prompt).
- **Criada a pasta `architecture/`** com `entities.csv`, `fields-classification.csv`,
  `permissions.csv`, `api-contracts-provisional.csv`, `external-services.csv`, `events.csv`,
  `environments.csv`, `implementation-increments.csv`, `technical-decisions.csv`,
  `risk-controls.csv`.
- **Atualizados**: `01`, `02`, `04`, `11`, `12`, `13`, `14`, `15`, `16`, `README.md`.
- **Registrado D-062** (execução da Etapa 4 como planejamento).
- **21 decisões técnicas DT-01 a DT-21** apresentadas em `PENDENTE_DE_APROVAÇÃO`.
- **18 riscos técnicos** RK-33 a RK-50 registrados.
- **Nada implementado**: `src/` intocado, nenhuma tabela criada, nenhum produto importado,
  nenhuma rota publicada, nenhum domínio, nenhum segredo armazenado, nenhum e-mail ou cotação
  enviada, nenhum serviço externo ativado, nenhum layout alterado.


## 2026-08-01 — Etapa 4 aprovada com ajustes; Etapa 5 liberada condicionalmente

- **Verificação de stack (DT-01)** executada e registrada em
  `architecture/stack-verification.md`: TanStack Start com SSR nativo confirmado; nenhuma
  migração ou recriação de projeto.
- **DT-01 a DT-21 deliberadas**: estados finais em `129` e em
  `architecture/technical-decisions.csv`.
- **Atualizados**: `01`, `04`, `12`, `13`, `16`, `95`, `96`, `97`, `98`, `100`, `101`, `105`,
  `106`, `107`, `108`, `109`, `110`, `111`, `113`, `114`, `115`, `118`, `120`, `124`, `129`,
  `130`, `README.md`, `architecture/technical-decisions.csv`.
- **Registrados D-063 a D-065** em `01-approved-decisions.md`.
- **Novos riscos** RK-51 a RK-55 em `12-risk-register.md`.
- **Pendências mantidas**: DEP-T1, DEP-T3, DEP-T5.
- **Nada ativado**: nenhuma produção, nenhum serviço externo real, nenhum layout alterado.
