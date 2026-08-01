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

---

# 7. DECISÃO DO USUÁRIO — 2026-08-01 · Etapa 3 liberada com escopo controlado

`USER_DECISION`. O diagnóstico deste documento foi **aceito**: a interrupção da Etapa 3 foi
correta. O desbloqueio veio por **aprovação parcial e expressamente delimitada**, não por
aprovação em bloco.

| Item | Estado após a decisão |
|---|---|
| **B-01** taxonomia não aprovada | **RESOLVIDO para o escopo aprovado** (31 famílias / 97 SKUs) |
| **B-02** 34 SKUs sem identidade | **CONTIDO, não encerrado** — fora da v1 e fora dos protótipos |
| **B-03** 16 SKUs sem nome público | **CONTIDO, não encerrado** — fora dos dados reais dos protótipos |
| **DECT-01** | **APROVADA_PARCIALMENTE — 31 FAMÍLIAS / 97 SKUs** |
| **DECT-10** | **APROVADA_COM_ESCOPO_CONTROLADO** |
| Renumeração | **APROVADA** — Etapa 3 = `74`–`94`; Etapa 4 = `95`–`130` |
| Etapa 3 | **LIBERADA** apenas para o escopo definido |

## 7.1 O que DECT-01 aprovou

Para cada uma das **31 famílias prontas**: nome funcional, associação dos SKUs, categoria
pública, segmento, aplicação principal, aplicações secundárias confirmadas, relação
família → categoria → aplicação e enquadramento nas 6 categorias públicas aprovadas.

As **43 famílias NÃO** foram aprovadas integralmente. As 12 restantes seguem
`PENDENTE_DE_APROVAÇÃO`.

### 31 famílias aprovadas (97 SKUs)

| Família | Nome | Categoria | SKUs |
|---|---|---|---|
| FAM-001 | Agulhas descartáveis | Vacinação e aplicação | 10 |
| FAM-002 | Agulhas inox reutilizáveis | Vacinação e aplicação | 12 |
| FAM-004 | Agulhas para aplicador de vacina | Vacinação e aplicação | 1 |
| FAM-005 | Seringas automáticas de fluxo contínuo | Vacinação e aplicação | 2 |
| FAM-006 | Seringas automáticas duplas | Vacinação e aplicação | 1 |
| FAM-007 | Vacinadoras com porta-frasco | Vacinação e aplicação | 1 |
| FAM-008 | Kits de reparo para seringas automáticas | Vacinação e aplicação | 2 |
| FAM-009 | Seringas descartáveis | Vacinação e aplicação | 5 |
| FAM-013 | Equipos para aplicação e infusão | Vacinação e aplicação | 2 |
| FAM-014 | Bicos pulverizadores | Pulverização e sistemas de fluido | 8 |
| FAM-015 | Tubulações e mangueiras | Pulverização e sistemas de fluido | 5 |
| FAM-022 | Balanças suspensas e dinamômetros para aves | Pesagem, medição e controle | 3 |
| FAM-023 | Balanças eletrônicas para aves | Pesagem, medição e controle | 5 |
| FAM-024 | Balanças para ovos | Pesagem, medição e controle | 3 |
| FAM-025 | Balanças de precisão de bolso | Pesagem, medição e controle | 1 |
| FAM-026 | Termômetros | Pesagem, medição e controle | 4 |
| FAM-027 | Medidores e testes de qualidade da água | Pesagem, medição e controle | 3 |
| FAM-028 | Testes de qualidade do ambiente | Pesagem, medição e controle | 1 |
| FAM-029 | Equipamentos para ovoscopia | Pesagem, medição e controle | 1 |
| FAM-030 | Câmeras termográficas | Pesagem, medição e controle | 1 |
| FAM-031 | Lâminas para debicagem | Peças, reposição e automação | 3 |
| FAM-033 | Bebedouros pendulares para aves | Manejo, alimentação e biossegurança | 4 |
| FAM-034 | Comedouros para aves | Manejo, alimentação e biossegurança | 4 |
| FAM-035 | Niples para bebedouro | Manejo, alimentação e biossegurança | 1 |
| FAM-036 | Armadilhas para roedores | Manejo, alimentação e biossegurança | 2 |
| FAM-037 | Adesivos e colas para captura | Manejo, alimentação e biossegurança | 2 |
| FAM-038 | Contadores manuais para aves | Manejo, alimentação e biossegurança | 1 |
| FAM-039 | Consumíveis de assepsia e apoio | Manejo, alimentação e biossegurança | 3 |
| FAM-040 | Conjunto para aplicação de tuberculina | Linhas complementares | 4 |
| FAM-042 | Seringas para insulina | Linhas complementares | 1 |
| FAM-043 | Imãs intra-ruminais | Linhas complementares | 1 |

Onze destas famílias contêm SKUs individualmente bloqueados (AG005, AG016, AG019, AG022,
BI002–BI006, BI999). A **família** está aprovada; o **SKU bloqueado** continua fora — D-036.

### 12 famílias que permanecem `PENDENTE_DE_APROVAÇÃO`

| Família | Nome | Motivo |
|---|---|---|
| FAM-003 | Agulhas quadradas | BLOCKED_BY_CODE |
| FAM-010 | Seringas automáticas de precisão (linha importada) | BLOCKED_BY_IDENTITY (R-05) |
| FAM-011 | Cilindros graduados para seringas automáticas | BLOCKED_BY_IDENTITY (R-05) |
| FAM-012 | Componentes e reposição para seringas automáticas | BLOCKED_BY_IDENTITY (R-05) |
| FAM-016 | Conexões em L | BLOCKED_BY_MISSING_DATA |
| FAM-017 | Conexões retas e passa-muros | BLOCKED_BY_MISSING_DATA |
| FAM-018 | Conexões em T | BLOCKED_BY_MISSING_DATA |
| FAM-019 | Conexões não identificadas | BLOCKED_BY_MISSING_DATA |
| FAM-020 | Sistemas de pulverização (carrinho e galpão) | BLOCKED_BY_MISSING_DATA |
| FAM-021 | Bombas | BLOCKED_BY_MISSING_DATA |
| FAM-032 | Peças e componentes — não identificados | BLOCKED_BY_MISSING_DATA (28 `PE`) |
| FAM-041 | Monitores e analisadores portáteis | BLOCKED_BY_IDENTITY (R-05) |

Nada disso foi excluído: permanece em **fila de normalização**, sem publicação e sem uso como
dado real.

## 7.2 O que DECT-10 liberou

A Etapa 3 pode criar o design system completo e todos os tipos de página aprovados, usando como
conteúdo real **apenas**: as 31 famílias, os 97 SKUs, as 6 categorias públicas, as 7 categorias
editoriais, as aplicações aprovadas dessas famílias, imagens aprovadas (por SKU ou por família)
e o placeholder oficial.

**Proibido nos protótipos, como conteúdo real**: códigos sem identidade, nomes com marca de
terceiro, famílias pendentes, SKUs conflitantes, especificações inferidas, marcas internas,
dados administrativos.

Os componentes **podem** prever estados genéricos — item em revisão, produto indisponível,
produto sem imagem, item não encontrado, SKU bloqueado, conteúdo pendente — desde que **não
revelem nem simulem** os produtos pendentes.

## 7.3 DEC-05 e DEC-18 — mantidas como NÃO APLICADAS

"Linhas complementares" continua categoria pública; as 7 categorias editoriais continuam
íntegras. Reconfirmado nesta decisão.

## 7.4 Numeração aprovada

- `73-stage-03-start-blocker.md` — este documento (renomeado de `73-stage-03-blocked.md`).
- **Etapa 3**: `74` a `94`, conforme a tabela de §4.
- **Etapa 4**: `95` a `130` — deslocamento de **+6** sobre os `89`–`124` previstos no prompt da
  Etapa 4. Exemplos: `89-stage-04-technical-architecture-plan.md` → **`95`**;
  `90-lovable-capability-assessment.md` → **`96`**; `123-stage-04-decisions-for-approval.md` →
  **`129`**; `124-stage-04-executive-report.md` → **`130`**. A Etapa 4 **não** é executada agora;
  o registro existe apenas para impedir conflito futuro.
- `docs/avizee/design/` mantém os nomes originais.

## 7.5 Limites da liberação

A liberação **não** aprova antecipadamente tokens, componentes, wireframes, protótipos, direção
visual ou novas decisões de interface. Todo resultado visual da Etapa 3 depende de aprovação
posterior. **Não avançar para a Etapa 4** ao concluir a Etapa 3.
