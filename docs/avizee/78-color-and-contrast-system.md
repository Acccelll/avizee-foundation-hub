# 78 — Sistema de Cor e Contraste

Status: `APROVADO` (Etapa 3 aprovada com ajustes em 2026-08-01; ver `93`). Aprovação conceitual — não autoriza implementação. Este documento detalha o uso da cor a partir dos tokens já
definidos em `76-design-tokens.md` (camadas primitiva e semântica) e aplica P-06 e P-09
(`75-design-principles.md`): acessibilidade AA é piso, e nenhum grafismo ou cor nova é criado.
Nenhum HEX, HSL ou nome de token diverge do que já está registrado em `76-design-tokens.md`; este
documento apenas organiza papéis, combinações permitidas e razões de contraste medidas.

Fonte da paleta oficial: `10-brand-guidelines.md`. Achado que este documento resolve: F-15 e a
recomendação de `34-accessibility-findings.md` ("Terracota/Creme é a combinação de maior risco").

## 1. Papel semântico de cada cor oficial

A paleta oficial tem exatamente quatro cores. Cada uma tem um papel funcional fixo — nenhuma é
"decorativa sem função":

| Cor oficial | HEX | Papel semântico primário | Papel secundário |
|---|---|---|---|
| Preto (`--avizee-black`) | `#151514` | Texto de máxima ênfase, fundo institucional escuro | Base de toda a escala de neutros |
| Vinho (`--avizee-wine`) | `#690500` | Ênfase institucional, símbolo do logotipo, foco, ação secundária | Base da proposta de erro (seção 4) |
| Terracota (`--avizee-terracotta`) | `#b2592c` | Ação primária (cotação), wordmark do logotipo | Base da proposta de aviso (seção 4) |
| Creme (`--avizee-cream`) | `#fffaed` | Fundo base de página, texto sobre fundo escuro | Base de toda a escala de neutros claros |

Nenhuma cor oficial é neutra "de sobra": todas as quatro carregam significado — inclusive o creme,
que não é "branco genérico" e não deve ser substituído por `#ffffff` em nenhuma superfície.

## 2. Escalas e tints derivados

Reafirma `76-design-tokens.md`, seção 2.1: os neutros (`--neutral-950` a `--neutral-050`) são
interpolações de luminosidade entre preto e creme, mantendo o matiz quase acromático da marca
(60°). Não introduzem tom novo — são preto e creme "esticados" em degradê de leitura.

Vinho e terracota **não** recebem escala de tints/shades além do que já está descrito em
`76-design-tokens.md` (hover 8% mais escuro, info a 60% de luminosidade). Criar uma escala
completa de 9 ou 10 passos para vinho/terracota é explicitamente descartado nesta etapa: geraria
tons intermediários que se aproximam de laranja ou vinho claro "genéricos", fora do espírito de
P-09 (nenhuma cor nova). Qualquer necessidade futura de tint intermediário deve ser resolvida por
opacidade sobre o fundo, não por novo primitivo de cor.

| Necessidade | Solução aprovada | Solução rejeitada |
|---|---|---|
| Fundo de destaque sutil em vinho/terracota | Cor sólida a 8–10% de opacidade sobre `--color-bg-base` | Novo token `--wine-100`, `--terracotta-050` etc. |
| Hover de botão terracota | Terracota escurecido 8% (mistura com preto, mesmo matiz) | Terracota "mais claro" (mistura com branco puro) |
| Estado desabilitado | Opacidade reduzida do próprio token de cor (seção 6) | Cinza genérico fora da escala neutra |

## 3. Superfícies, texto e borda

Mapeamento direto de `76-design-tokens.md`, seção 3, organizado por tipo de decisão:

### 3.1 Superfícies (fundo)

| Token | Uso |
|---|---|
| `--color-bg-base` | Fundo padrão de toda página institucional e de catálogo |
| `--color-bg-inverse` | Seção institucional de destaque (ex.: rodapé, bloco "sobre a AviZee") |
| `--color-bg-surface` | Card de produto, card de família, bloco elevado sobre o fundo base |
| `--color-bg-surface-alt` | Linha zebrada de tabela de variação de SKU, fundo alternado de lista |

Regra de empilhamento: `--color-bg-surface` só aparece sobre `--color-bg-base`, nunca sobre
`--color-bg-inverse` sem revisão de contraste específica (ver seção 5, combinações proibidas).

### 3.2 Texto

| Token | Sobre fundo | Uso |
|---|---|---|
| `--color-text-primary` | Creme, `neutral-100`, `neutral-200` | Corpo de texto, título, dado técnico |
| `--color-text-secondary` | Creme, `neutral-100`, `neutral-200` | Metadado, legenda de tabela, texto de apoio |
| `--color-text-muted` | Creme, `neutral-100` | Texto de baixa ênfase (nunca dado técnico crítico, por P-01) |
| `--color-text-inverse` | Preto, vinho, terracota | Texto sobre fundo escuro ou de marca |

### 3.3 Borda

| Token | Uso |
|---|---|
| `--color-border-default` | Borda de input, contorno de card, divisor de seção |
| `--color-border-subtle` | Divisor discreto entre linhas de tabela densa |

Borda nunca é a única forma de separar dois blocos com significado diferente (ver seção 8): quando
a separação comunica um estado, ela é reforçada por espaçamento e/ou rótulo de texto.

## 4. Estados interativos

Todo elemento interativo (botão, link, campo de formulário, item de lista de cotação) tem quatro
estados obrigatórios, além do estado padrão:

| Estado | Regra geral | Exemplo — ação primária (terracota) | Exemplo — ação secundária (vinho, contorno) |
|---|---|---|---|
| Padrão | Token semântico de ação, conforme `76-design-tokens.md` | Fundo `--color-action-primary`, texto `--color-action-primary-text` | Fundo transparente, borda e texto `--avizee-wine` |
| Hover | Escurecimento de 8% da própria cor (nunca troca de matiz) | Fundo `--color-action-primary-hover` | Fundo `--avizee-wine` a 8% de opacidade, texto e borda mantidos |
| Active/pressed | Escurecimento adicional (16% sobre a cor base) + leve redução de elevação (sem sombra colorida) | Fundo terracota escurecido 16% | Fundo vinho a 14% de opacidade |
| Focus | Anel de foco visível, `--color-focus-ring` (vinho), espessura `--border-width-focus` (3px), nunca removido | Anel vinho de 3px com offset de 2px sobre o fundo | Anel vinho de 3px com offset de 2px sobre o fundo |
| Disabled | Opacidade reduzida a 40% sobre a cor do estado padrão + cursor `not-allowed`; nunca vira cinza genérico | Terracota a 40% de opacidade, texto creme mantido | Vinho a 40% de opacidade |

Regra dura (P-06, P-08): o anel de foco nunca é removido por CSS (`outline: none` sem substituto é
proibido) e precisa ser visível tanto sobre `--color-bg-base` quanto sobre `--color-bg-inverse` —
por isso `--color-focus-ring` é vinho sobre fundo claro e passa a `--avizee-terracotta` sobre fundo
`--color-bg-inverse`, garantindo contraste mínimo de 3:1 do anel contra o fundo em ambos os casos
(critério AA para indicadores não textuais, 1.4.11).

## 5. Cores funcionais aprovadas — encerra L-01 (DES-02 / D-056)

Decisão do usuário em 2026-08-01: preto **não** é cor de sucesso e terracota **não** cobre aviso e
informação ao mesmo tempo. Ficam aprovadas duas cores funcionais externas à paleta institucional,
com uso restrito a feedback, alerta, estado e indicador funcional.

| Estado | Token | Valor | Justificativa | Mitigação obrigatória |
|---|---|---|---|---|
| Erro | `--color-feedback-error` | `#690500` (Vinho da marca) | Tom sério da paleta, usado quando contraste e contexto forem adequados | Ícone de erro + texto explícito; nunca só borda colorida |
| Aviso | `--color-feedback-warning` | `#b2592c` (Terracota da marca) | Cor de atenção da marca | Rótulo "Atenção" visível; nunca na mesma área visual de um CTA terracota ativo |
| Sucesso | `--color-feedback-success` | `#1f6b3c` (verde funcional) | Confirmação positiva precisa ser distinta de texto, superfície escura e neutralidade — papéis que o preto já exerce | Ícone de confirmação + texto; verde nunca fora de feedback |
| Informação | `--color-feedback-info` | `#12557e` (azul funcional) | Informação neutra precisa ser distinguível de aviso; variações de terracota ficariam visualmente próximas | Bloco informativo não acionável; azul nunca fora de feedback |

O verde e o azul **não passam a integrar a paleta da marca**, não aparecem em banner
institucional, não são cores promocionais, não substituem vinho ou terracota em CTA e não são
usados como decoração. As restrições completas estão em `76-design-tokens.md` §4.1.

Regra permanente: nenhum estado funcional depende exclusivamente da cor (P-06). Toda mensagem
carrega ícone, texto e título ou rótulo.

## 6. Tabela de razões de contraste (WCAG 2.2 AA)

Valores calculados pela fórmula de luminância relativa do WCAG 2.2 (idêntica à de 2.1), a partir
dos HEX/HSL oficiais
de `76-design-tokens.md`. Critério AA: **4.5:1** para texto normal, **3:1** para texto grande
(≥ 24px regular ou ≥ 19px bold) e para componentes de interface/gráficos (1.4.11).

### 6.1 Combinações permitidas — texto sobre fundo

| Primeiro plano | Fundo | Razão | Uso permitido |
|---|---|---|---|
| `--avizee-black` | `--avizee-cream` | 17,53:1 | Texto de qualquer tamanho, inclusive corpo pequeno |
| `--avizee-wine` | `--avizee-cream` | 12,42:1 | Texto de qualquer tamanho |
| `--avizee-cream` | `--avizee-black` | 17,53:1 | Texto sobre fundo institucional escuro |
| `--avizee-cream` | `--avizee-wine` | 12,42:1 | Texto sobre superfície vinho |
| `--neutral-800` | `--avizee-cream` | 11,97:1 | Texto secundário |
| `--neutral-600` | `--avizee-cream` | 5,80:1 | Texto de apoio, legenda — ainda acima do piso de corpo (4,5:1) |
| `--avizee-black` | `--neutral-100` | 16,14:1 | Texto sobre card |
| `--avizee-black` | `--neutral-200` | 14,24:1 | Texto sobre zebra de tabela |
| `--avizee-wine` | `--neutral-100` | 11,43:1 | Ênfase institucional sobre card |
| `--avizee-wine` | `--neutral-200` | 10,09:1 | Ênfase institucional sobre zebra |
| `--avizee-terracotta` | `--avizee-cream` | **4,62:1** | Texto normal no limite superior do AA — usar em texto **regular ou maior**, nunca em corpo abaixo de 16px sem peso 600+ |
| `--avizee-cream` | `--avizee-terracotta` | **4,62:1** | Texto sobre botão de ação primária — aprovado só a partir de `--font-weight-semibold` (600) em diante, conforme 6.3 |
| `--avizee-terracotta` | `--neutral-100` | 4,26:1 | **Abaixo do piso de texto normal (4,5:1)**; permitido apenas como texto grande (≥ 24px) ou como borda/ícone (piso 3:1) |

### 6.2 Combinações permitidas — apenas elementos não textuais (piso 3:1)

Válido para bordas de estado, ícones funcionais e indicadores de foco, conforme critério 1.4.11:

| Primeiro plano | Fundo | Razão | Uso permitido |
|---|---|---|---|
| `--avizee-terracotta` | `--avizee-black` | 3,79:1 | Ícone, borda de destaque sobre fundo institucional escuro |
| `--avizee-terracotta` | `--neutral-200` | 3,76:1 | Borda de card ativo, indicador de seleção |
| `--neutral-400` | `--neutral-100` | 2,62:1 | **Reprovado até para uso não textual** — ver seção 7 |

### 6.3 Regra de peso mínimo para terracota como texto

Como a razão terracota/creme (4,62:1) e cream/terracota (4,62:1) fica no limiar do critério de
texto normal, este documento normatiza uma margem de segurança adicional, alinhada a P-06 e P-08
(uso em campo, sob sol direto):

- Texto em `--avizee-terracotta` sobre `--avizee-cream`: permitido a partir de 16px com peso
  `--font-weight-semibold` (600) ou superior. Peso 400 em terracota sobre creme é **proibido** em
  qualquer tamanho abaixo de 24px, por margem de segurança abaixo do recomendável para uso a céu
  aberto.
- Texto em `--avizee-cream` sobre fundo `--avizee-terracotta` (rótulo de botão): permitido a
  partir de peso 600 (`--font-weight-semibold`), conforme já usado no botão de ação primária.

## 7. Combinações proibidas

| Primeiro plano | Fundo | Razão | Motivo da proibição |
|---|---|---|---|
| `--avizee-wine` | `--avizee-black` | 1,41:1 | Muito abaixo do piso AA para qualquer uso, textual ou não |
| `--avizee-terracotta` | `--avizee-black` (texto) | 3,79:1 | Insuficiente para texto (piso 4,5:1); permitido só como ícone/borda (seção 6.2) |
| `--neutral-400` | `--neutral-100` | 2,62:1 | Abaixo até do piso de 3:1 para elementos não textuais; proibido como borda de card sobre `--color-bg-surface` |
| `--avizee-cream` | `--neutral-100`, `--neutral-200`, `--avizee-cream` | ~1:1 | Fundo e texto do mesmo tom, ilegível |
| `--avizee-terracotta` | `--neutral-100` (texto normal) | 4,26:1 | Abaixo do piso 4,5:1 para texto normal; só permitido como texto grande ou elemento não textual |
| Qualquer cor de estado funcional (seção 5) | Qualquer fundo, isoladamente | — | Proibido usar cor de estado sem texto e ícone de apoio (regra da seção 8), independentemente do contraste medido |

Nenhuma combinação fora das seções 6.1 e 6.2 é considerada válida por padrão: qualquer par novo
precisa ser medido e adicionado a este documento antes do uso em componente.

## 8. Cor nunca é o único portador de informação

Reforço direto de P-06 e do achado de `34-accessibility-findings.md`. Regra dura, sem exceção:

- Erro de campo de formulário: borda vinho **e** ícone **e** mensagem de texto abaixo do campo.
  Nunca só a borda muda de cor.
- Item selecionado em filtro: mudança de cor de fundo **e** ícone de marcação (check) **e**
  mudança de peso da fonte do rótulo.
- Destaque de termo buscado no código de SKU: peso tipográfico 700 (já normatizado em
  `77-typography-system.md`, seção 5), nunca só cor de destaque.
- Disponibilidade de item na Lista de Cotação (adicionado/não adicionado): ícone que muda de forma
  (contorno para preenchido) **e** texto do botão que muda ("Adicionar" para "Adicionado") **e**
  cor. A cor é reforço, nunca o único sinal.
- Gráfico ou indicador visual que use cor de estado funcional (seção 5): sempre acompanhado de
  rótulo textual ou padrão de textura/ícone equivalente.

## 9. Uso de cor no logotipo

Reforço normativo de `10-brand-guidelines.md`, sem alteração:

- Sobre fundo `--color-bg-base` (creme): símbolo em `--avizee-wine`, wordmark em
  `--avizee-terracotta`. Esta é a única combinação de duas cores permitida dentro do próprio
  logotipo.
- Sobre qualquer fundo de cor (terracota, preto ou vinho): logotipo inteiro em `--avizee-cream`,
  monocromático — símbolo e wordmark na mesma cor, sem exceção.
- Proibido: recolorir símbolo e wordmark com cores diferentes sobre fundo colorido; aplicar o
  símbolo preenchido (é sempre traço/outline); usar qualquer cor fora da paleta oficial no
  logotipo, inclusive em versões de baixo contraste ou marca d'água.
- O símbolo isolado (sem wordmark) segue a mesma regra de cor: vinho sobre creme, ou creme sobre
  fundo de cor.

## 10. Tema claro (v1) e ausência de tema escuro

A v1 do projeto define **apenas tema claro**, com `--color-bg-base` (creme) como fundo padrão de
toda a experiência, e `--color-bg-inverse` (preto) reservado a blocos institucionais pontuais —
não a um "modo" alternativo selecionável pelo usuário.

Justificativa para não escopar tema escuro na v1:

1. **Ausência de necessidade documentada**: nenhuma persona de `06-personas-and-audiences.md`
   nem princípio de `75-design-principles.md` aponta uso noturno ou preferência de tema escuro
   como relevante para o comprador técnico B2B em campo (P-08 descreve sol direto, não ambiente
   escuro).
2. **Risco de contraste não coberto**: a proposta de cores funcionais (seção 5) já está pendente
   de aprovação sobre fundo claro; dobrar esse trabalho para um segundo fundo (preto como base,
   não como acento) multiplicaria combinações a validar sem demanda comprovada.
3. **Coerência de marca**: `10-brand-guidelines.md` define o creme como "fundo base, respiro,
   aplicação do logo sobre cor" — não há registro no manual de uma variante de marca pensada para
   fundo escuro predominante em toda a interface (o preto é usado como bloco de ênfase pontual,
   não como padrão de tela inteira).
4. **Escopo e custo**: implementar tema escuro exige tokens duplicados, alternância de estado
   persistida, e nova rodada de verificação de contraste completa — fora do orçamento desta etapa
   documental e sem aprovação de escopo prévia.

Se tema escuro for solicitado em etapa futura, este documento deve ser revisado e uma seção 11
("Tema escuro — proposta") deve ser criada com sua própria tabela de contraste, mantendo a mesma
paleta de quatro cores oficiais (P-09) — nunca introduzindo tom novo "para funcionar no escuro".

## 11. O que este documento não faz

Não aprova as cores funcionais da seção 5 (L-01 permanece aberta). Não define tema escuro (seção
10). Não altera `src/styles.css` nem qualquer token de `76-design-tokens.md`. Toda razão de
contraste aqui apresentada é calculada a partir dos valores HEX/HSL já registrados como propostos
— não constitui aprovação de paleta, apenas evidência técnica para a decisão de aprovação.

## 10. Contraste das cores funcionais aprovadas (WCAG 2.2 AA)

| Primeiro plano | Fundo | Razão | Uso permitido |
|---|---|---|---|
| `--color-feedback-success` `#1f6b3c` | `--avizee-cream` `#fffaed` | 6,24:1 | Texto e ícone de sucesso sobre fundo base |
| `--color-feedback-success` `#1f6b3c` | `--color-feedback-success-bg` `#e8f3ec` | 5,72:1 | Texto e ícone dentro do bloco de sucesso |
| `--avizee-black` `#151514` | `--color-feedback-success-bg` `#e8f3ec` | 16,06:1 | Corpo da mensagem de sucesso |
| `--avizee-cream` `#fffaed` | `--color-feedback-success` `#1f6b3c` | 6,24:1 | Texto sobre selo sólido de sucesso |
| `--color-feedback-info` `#12557e` | `--avizee-cream` `#fffaed` | 7,67:1 | Texto e ícone de informação sobre fundo base |
| `--color-feedback-info` `#12557e` | `--color-feedback-info-bg` `#eaf2f8` | 7,06:1 | Texto e ícone dentro do bloco informativo |
| `--avizee-black` `#151514` | `--color-feedback-info-bg` `#eaf2f8` | 16,15:1 | Corpo da mensagem informativa |
| `--avizee-cream` `#fffaed` | `--color-feedback-info` `#12557e` | 7,67:1 | Texto sobre selo sólido de informação |

Combinações proibidas: verde e azul funcionais **sobre `--color-bg-inverse`** (2,81:1 e 2,29:1 —
abaixo do piso de 3:1 para elementos não textuais). Em fundo escuro, o feedback usa apenas
`--color-text-inverse` com ícone e rótulo textual.

Qualquer combinação que não alcance o contraste mínimo aplicável é tratada como **defeito**, não
como escolha estética. Tema escuro permanece fora da v1.
