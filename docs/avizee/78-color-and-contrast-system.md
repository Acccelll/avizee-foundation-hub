# 78 — Sistema de Cor e Contraste

Status: `PENDENTE_DE_APROVAÇÃO`. Este documento detalha o uso da cor a partir dos tokens já
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

## 5. Cores funcionais propostas — resposta a L-01

`34-accessibility-findings.md` e `76-design-tokens.md` (seção 4) registram que nenhuma cor
funcional foi aprovada (recomendação L-01, `PENDENTE_DE_APROVAÇÃO`). Este documento não aprova a
tabela abaixo — apenas a organiza para decisão, com a razão de cada escolha e a mitigação de risco
de uma paleta de quatro cores para comunicar quatro estados funcionais distintos.

| Estado | Token proposto | Cor base | Justificativa | Mitigação obrigatória |
|---|---|---|---|---|
| Erro | `--color-feedback-error` | `--avizee-wine` | Único tom "sério"/escuro fora do preto na paleta; associação natural a alerta crítico | Sempre acompanhado de ícone de erro e texto explícito (nunca só a borda vermelha do campo) |
| Aviso | `--color-feedback-warning` | `--avizee-terracotta` | Já é a cor de ação primária; reuso deliberado exige que aviso nunca compartilhe tela com um CTA terracota ativo, para não gerar ambiguidade | Rótulo textual "Atenção" sempre visível; nunca usado simultaneamente ao botão de ação primária na mesma área visual |
| Sucesso | `--color-feedback-success` | `--avizee-black` | Não há verde na paleta; preto comunica "confirmado/consolidado" por peso visual, não por associação cromática universal | Sempre acompanhado de ícone de confirmação (check) e texto; nunca depende da cor para significar "certo" |
| Informação | `--color-feedback-info` | `--avizee-terracotta` a 60% de luminosidade | Variação clara de terracota que não colide com o botão de ação primária (mais clara, menor saturação percebida) | Uso restrito a blocos informativos não acionáveis (nota de rodapé de tabela, aviso de imagem ilustrativa) |

Consequência direta de ter só quatro cores: **erro reaproveita vinho** e **aviso reaproveita
terracota**, a mesma cor da ação primária de cotação. Isso é um risco de ambiguidade reconhecido —
por isso a mitigação de "aviso" acima proíbe a cor de aviso na mesma área visual de um botão
"Adicionar à lista de cotação". Esta tensão é o motivo principal pelo qual a tabela permanece
`PENDENTE_DE_APROVAÇÃO`: a aprovação precisa decidir explicitamente se esse risco é aceitável ou
se justifica abrir exceção controlada de paleta (fora do escopo desta etapa).

Regra que vale independentemente da aprovação da tabela: nenhum estado funcional é implementado
antes de decisão expressa sobre L-01. Até lá, mensagens de erro, sucesso e aviso no protótipo
usam apenas texto, ícone e `--color-text-primary`/`--color-bg-surface`, sem cor de estado dedicada.

## 6. Tabela de razões de contraste (WCAG 2.1 AA)

Valores calculados pela fórmula de luminância relativa do WCAG 2.1, a partir dos HEX/HSL oficiais
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
