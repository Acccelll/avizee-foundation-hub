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
