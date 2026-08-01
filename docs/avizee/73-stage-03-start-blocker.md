# 73 — Etapa 3: Bloqueio de Início

**Data**: 2026-08-01 · **Status**: **ETAPA 3 NÃO INICIADA** · **Motivo**: pré-condição §1.5/§1.6
não satisfeita.

Este documento existe porque o próprio prompt da Etapa 3 determina, em §1.6 e §2, que a execução
seja **interrompida** quando a Etapa 2.1 não estiver aprovada. Nenhum token, componente,
wireframe, protótipo ou documento `68` a `88` foi criado.

---

## 1. Bloqueio B-01 — Etapa 2.1 não aprovada (impeditivo)

§1.5 exige aprovação expressa de sete itens. Estado real:

| Item exigido por §1.5 | Estado | Onde |
|---|---|---|
| Matriz família → categoria → aplicação | **PENDENTE** — DECT-01 | `71` |
| Segmentação das famílias | **PENDENTE** — implícita em DECT-01 | `65` |
| Famílias estruturais | **PENDENTE** — DECT-02, DECT-03, DECT-06, DECT-07 | `62` |
| Categorias públicas | **APROVADAS desde a Etapa 0** — únicas já firmes | `07` |
| Aplicações principais | **PENDENTE** — DECT-04, DECT-05, DECT-09 | `64` |
| Isolamento dos SKUs conflitantes | **PENDENTE** — 7 casos individuais | `71` |
| Liberação da Etapa 3 | **PENDENTE** — DECT-10 | `71` |

As 14 decisões DECT-01 a DECT-14 estão com status `PENDENTE_DE_APROVACAO` em
`data/taxonomy-decisions.csv`. `01-approved-decisions.md` **não** contém nenhuma decisão de
classificação aprovada.

§7 do prompt é explícito: **"Não desenhe sobre taxonomia provisória."** Desenhar página de
categoria, filtro por aplicação, badge de segmento e tabela de SKUs sobre 43 famílias não
aprovadas produziria um design system que precisaria ser refeito assim que uma família mudasse
de categoria.

## 2. Bloqueio B-02 — 34 SKUs sem identidade (DECT-08 / RK-23 / DEP-09)

28 códigos `PE`, 3 `CN` e 3 `BO` não têm nome de produto em nenhuma das 8 fontes auditadas.
São **19,5% do catálogo**. A Etapa 3 precisaria inventar nomes para prototipar card de produto,
resultado de busca e tabela de SKUs dessas famílias — o que §23 proíbe.

Não é impeditivo absoluto: DECT-14 propõe mantê-los fora da v1. Mas depende de decisão.

## 3. Bloqueio B-03 — 16 SKUs sem nome público funcional (DECT-11)

FAM-010, FAM-011, FAM-012 e FAM-041. O nome de **família** já é neutro; o nome público de cada
SKU não foi validado. Prototipar a tabela de variações dessas famílias hoje exigiria exibir o
nome com marca de terceiro — violação direta de R-05 e do §4.6 deste prompt, e gatilho de
interrupção previsto em §2 ("dados de marcas internas sendo enviados ao frontend").

## 4. Conflito de numeração dos documentos (§1.4 e §32)

O prompt referencia a Etapa 2.1 como documentos **55 a 67** e manda criar a Etapa 3 como
**68 a 88**. Ambos os intervalos já estão ocupados:

| Prompt diz | Realidade |
|---|---|
| `55` a `67` = Etapa 2.1 | `55` a `59` são da Etapa 2 (indexação, matriz de objetivo, escopo v1, DEC-01–18, relatório); a Etapa 2.1 está em **`60` a `72`** |
| `68` a `88` = Etapa 3 | `68` a `72` já são da Etapa 2.1 (conflitos, cobertura, prontidão, DECT, relatório) |

Criar `68-stage-03-design-plan.md` **sobrescreveria** `68-taxonomy-conflicts.md`, destruindo o
registro dos 83 conflitos.

**Proposta de renumeração** (`LOVABLE_RECOMMENDATION`, PENDENTE_DE_APROVAÇÃO): a Etapa 3 ocupa
**`74` a `94`**, preservando o deslocamento de +6 sobre a numeração pedida.

| Pedido | Proposto | Pedido | Proposto |
|---|---|---|---|
| 68 design-plan | **74** | 79 public-page-prototypes | **85** |
| 69 design-principles | **75** | 80 admin-interface-prototypes | **86** |
| 70 design-tokens | **76** | 81 responsive-behavior | **87** |
| 71 typography-system | **77** | 82 accessibility-design-spec | **88** |
| 72 color-and-contrast | **78** | 83 microcopy-guidelines | **89** |
| 73 grid-spacing-layout | **79** | 84 journey-prototype-validation | **90** |
| 74 iconography | **80** | 85 visual-quality-checklist | **91** |
| 75 image-and-placeholder | **81** | 86 current-site-comparison | **92** |
| 76 component-inventory | **82** | 87 decisions-for-approval | **93** |
| 77 component-states | **83** | 88 executive-report | **94** |
| 78 public-page-wireframes | **84** | — | — |

Os arquivos de `docs/avizee/design/` não têm conflito e ficam como pedidos.

## 5. O que **não** bloqueia

- Ausência de fotografia de produto — resolvida pelo placeholder (§2 do prompt, D-041).
- Branding: paleta, tipografia e logotipo estão disponíveis e íntegros
  (`src/assets/brand/avizee-logo-colorido.svg`, `10-brand-guidelines.md`, `29`, `30`).
- Isolamento do protótipo: viável em rota não indexável, sem formulário real.
- DEC-05 e DEC-18: rejeitadas e registradas; não há risco de aplicação indevida.

## 6. Caminho mínimo para desbloquear

Basta a manifestação sobre **duas** decisões — não é necessário resolver as 14:

1. **DECT-01** — aprovar as 43 famílias (recomendado por blocos A–F, em `62`).
2. **DECT-10** — liberar a Etapa 3 com as **31 famílias prontas** (97 SKUs), mantendo as 12
   restantes em fila.

Com isso, e com a renumeração de §4 aceita, a Etapa 3 pode começar cobrindo as 6 categorias
públicas e todos os tipos de página. DECT-02 a DECT-09 e DECT-11 a DECT-14 podem ser respondidas
em paralelo, pois afetam famílias específicas, não o sistema visual.

Alternativa: autorizar expressamente o desenho sobre taxonomia provisória — o que contraria §1.7
deste mesmo prompt e é **não recomendado**.
