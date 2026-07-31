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
