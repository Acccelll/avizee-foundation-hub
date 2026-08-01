# 79 — Grid, Espaçamento e Layout

Status: `PENDENTE_DE_APROVAÇÃO`. Consolida os tokens de breakpoint, container e espaçamento já
definidos em `76-design-tokens.md` (seções 6 e 12) em um sistema de grid e regras de layout,
alinhado a P-01, P-07 e P-08 de `75-design-principles.md`. Nenhum valor de breakpoint, container
ou espaçamento aqui diverge do que já está tokenizado em `76-design-tokens.md`.

## 1. Breakpoints

| Token | Largura | Referência de dispositivo | Comportamento de grid |
|---|---|---|---|
| `--breakpoint-xs` | `360px` | Celular pequeno | 4 colunas |
| `--breakpoint-sm` | `640px` | Celular grande / phablet | 4 colunas |
| `--breakpoint-md` | `768px` | Tablet retrato | 8 colunas |
| `--breakpoint-lg` | `1024px` | Tablet paisagem / notebook pequeno | 12 colunas |
| `--breakpoint-xl` | `1280px` | Desktop | 12 colunas, container no máximo |
| `--breakpoint-2xl` | `1536px` | Desktop grande | 12 colunas, container no máximo, margem lateral cresce |

Abordagem **mobile-first**: todo componente é definido a partir de `xs` e recebe sobreposição de
regra a cada breakpoint superior atingido, nunca o inverso.

## 2. Container e margens

| Token | Valor | Aplicação |
|---|---|---|
| `--container-max-width` | `1280px` | Largura máxima do conteúdo centralizado a partir de `xl` |
| `--container-padding-mobile` | `16px` | Margem lateral fixa abaixo de `md` (768px) |
| `--container-padding-desktop` | `32px` | Margem lateral fixa a partir de `lg` (1024px) |

Entre `md` (768px) e `lg` (1024px), a margem lateral interpola entre 16px e 32px, evitando salto
abrupto de respiro no breakpoint de tablet.

A partir de `2xl` (1536px), o container permanece travado em `1280px` e a margem lateral absorve
o excesso de largura da tela — o grid de conteúdo nunca se estica além de `1280px`, preservando a
medida de leitura definida em `77-typography-system.md` e evitando linhas de texto ou tabela
excessivamente largas em monitores grandes.

## 3. Grid de 12 colunas por breakpoint

O grid de referência é sempre 12 colunas nos breakpoints `lg` em diante; abaixo disso, o número de
colunas reduz para manter a coluna individual utilizável (nunca menor que ~64px úteis em `xs`).

| Breakpoint | Colunas | Gutter (`--space-*`) | Margem lateral | Largura útil de coluna (aprox.) |
|---|---|---|---|---|
| `xs` (360px) | 4 | `--space-4` (16px) | `--container-padding-mobile` (16px) | ~68px |
| `sm` (640px) | 4 | `--space-4` (16px) | `--container-padding-mobile` (16px) | ~140px |
| `md` (768px) | 8 | `--space-5` (20px) | interpolado 16→32px | ~78px |
| `lg` (1024px) | 12 | `--space-6` (24px) | `--container-padding-desktop` (32px) | ~66px |
| `xl` (1280px) | 12 | `--space-6` (24px) | `--container-padding-desktop` (32px) | ~85px |
| `2xl` (1536px) | 12 | `--space-6` (24px) | cresce, container travado em 1280px | ~85px (container fixo) |

Gutter cresce de `--space-4` a `--space-6` conforme a tela aumenta, seguindo a mesma escala de 4px
já tokenizada — nenhum valor de gutter fora da escala de `76-design-tokens.md`, seção 6.

## 4. Escala de espaçamento base 4px — uso vertical e horizontal

Reafirma a tabela de `76-design-tokens.md`, seção 6, com a aplicação separada por eixo:

### 4.1 Uso horizontal (gap entre elementos lado a lado)

| Token | Valor | Uso horizontal |
|---|---|---|
| `--space-1` | 4px | Gap entre ícone e rótulo de texto adjacente |
| `--space-2` | 8px | Gap entre badges/chips em sequência |
| `--space-3` | 12px | Padding horizontal interno de badge |
| `--space-4` | 16px | Gap entre colunas de formulário em linha, padding horizontal de card |
| `--space-6` | 24px | Gap de grid entre cards (gutter em `lg`+) |

### 4.2 Uso vertical (empilhamento e ritmo)

| Token | Valor | Uso vertical |
|---|---|---|
| `--space-2` | 8px | Espaço entre rótulo e campo de formulário |
| `--space-4` | 16px | Espaço entre linhas de especificação técnica, padding vertical de card |
| `--space-5` | 20px | Espaço entre itens de lista (ex.: itens da Lista de Cotação) |
| `--space-8` | 32px | Espaço entre blocos relacionados dentro da mesma seção |
| `--space-10` | 40px | Espaço entre subseções (ex.: bloco de especificação e bloco de aplicação na ficha de SKU) |
| `--space-12` | 48px | Espaço entre seções de página em telas de conteúdo denso |
| `--space-16` | 64px | Espaço entre seções principais da Home |
| `--space-20` | 80px | Respiro editorial amplo (banner institucional, transição hero → conteúdo) |
| `--space-24` | 96px | Respiro máximo (hero de página institucional) |

## 5. Ritmo vertical entre seções

Regra geral: o espaço vertical entre dois blocos cresce com o nível hierárquico da transição, não
com preferência estética pontual.

| Transição | Espaço aplicado |
|---|---|
| Entre dois campos do mesmo formulário | `--space-4` |
| Entre dois itens da mesma lista (variação de SKU, item de cotação) | `--space-2` a `--space-5`, conforme densidade (seção 6) |
| Entre bloco de especificação e bloco de aplicação, dentro da mesma ficha | `--space-8` a `--space-10` |
| Entre duas seções distintas de uma página de conteúdo denso (catálogo, família) | `--space-12` |
| Entre duas seções principais da Home ou de página institucional | `--space-16` |
| Antes/depois de um bloco hero ou banner de abertura | `--space-20` a `--space-24` |

Em mobile (`xs`/`sm`), cada valor de ritmo entre seções pode reduzir um degrau na escala (por
exemplo, `--space-16` cai para `--space-12`) para não desperdiçar viewport limitado, mas nunca cai
abaixo de `--space-8` entre seções distintas — abaixo disso, a hierarquia visual de "seção nova"
se perde (P-01).

## 6. Densidade das tabelas de variação de SKU

A tabela de variação (P-01, P-02, P-07: sempre visível, código como dado de primeira classe,
densidade adulta) segue uma densidade própria, mais compacta que o restante da página:

| Elemento | Padding vertical | Padding horizontal | Observação |
|---|---|---|---|
| Célula de cabeçalho | `--space-2` (8px) | `--space-4` (16px) | Peso 600, conforme `77-typography-system.md` |
| Célula de dado (linha padrão) | `--space-3` (12px) | `--space-4` (16px) | Altura mínima de linha compatível com alvo de toque quando a linha for interativa |
| Célula de código de SKU | `--space-3` (12px) | `--space-4` (16px) | `white-space: nowrap`, tabular-nums (ver `77`, seção 5) |
| Divisor entre linhas | `--border-width-hairline` (1px), cor `--color-border-subtle` | — | Nunca removido; zebra (`--color-bg-surface-alt`) é reforço, não substituto do divisor |

Em telas abaixo de `md` (768px), a tabela de variações não é comprimida em carrossel (antipadrão
explícito de P-01): converte-se em lista de cartões empilhados, um por SKU, mantendo os mesmos
padding tokens (`--space-3`/`--space-4`) internamente, com `--space-4` de separação vertical entre
cartões — densidade reduzida apenas no agrupamento visual, nunca na quantidade de dado exibido.

Alvo de toque (P-08): quando a linha ou cartão da tabela for clicável/selecionável (ex.: escolher
variação para adicionar à Lista de Cotação), a área tocável tem no mínimo 44×44px mesmo que o
conteúdo textual seja menor — o padding compensa a diferença.

## 7. Arquétipos de página — layout

Larguras referem-se ao container em `lg`/`xl` (1024–1280px, grid de 12 colunas, gutter 24px).

### 7.1 Home

| Bloco | Ocupação de colunas (desktop) | Observação |
|---|---|---|
| Hero institucional | 12/12 | Fundo `--color-bg-inverse` ou imagem de avicultura com logotipo sobreposto |
| Destaques de família (cards) | 4/12 por card, 3 cards por linha | Em `md`, 2 cards por linha (4/8); em `xs`/`sm`, 1 card por linha (4/4) |
| Bloco institucional (missão/diferenciais) | 8/12 centralizado, texto a 60–75 caracteres por linha | Respeita measure de `77-typography-system.md` |
| CTA de cotação/contato | 12/12, faixa de destaque | Nunca compete com hero em peso visual (P-03) |

### 7.2 Listagem de catálogo

| Bloco | Ocupação de colunas (desktop) | Observação |
|---|---|---|
| Filtros (sidebar) | 3/12 | Colapsa para painel/drawer em `md` e abaixo |
| Grade de resultados | 9/12 | Cards de família/SKU, 3 por linha em `lg`+, 2 em `md`, 1 em `xs`/`sm` |
| Contagem de resultados e ordenação | 9/12, acima da grade | Sempre visível, nunca escondida atrás de scroll (P-07) |

### 7.3 Página de família

| Bloco | Ocupação de colunas (desktop) | Observação |
|---|---|---|
| Galeria de imagem | 5/12 | Placeholder oficial tratado como estado de primeira classe (P-05) |
| Informação de família + CTA de cotação | 7/12 | CTA primário visível sem rolagem (P-03) |
| Tabela de variações de SKU | 12/12 | Sempre em largura total, nunca comprimida em coluna estreita (P-01, P-07) |
| Especificação técnica estruturada | 12/12, dividida em 2 colunas de 6/12 em `lg`+ | 1 coluna em `md` e abaixo |

### 7.4 Artigo (institucional/blog)

| Bloco | Ocupação de colunas (desktop) | Observação |
|---|---|---|
| Título e metadado | 8/12 centralizado | Alinhado à medida de leitura de `77-typography-system.md` |
| Corpo de texto | 8/12 centralizado | 60–75 caracteres por linha |
| Imagem de apoio | 8/12 (mesma coluna do corpo) ou 12/12 (imagem de destaque) | Aviso de "imagem ilustrativa" sempre visível quando aplicável (P-05) |
| Bloco relacionado/CTA de fechamento | 12/12 | Ao final do artigo |

### 7.5 Formulário de cotação (Lista de Cotação)

| Bloco | Ocupação de colunas (desktop) | Observação |
|---|---|---|
| Lista de itens selecionados | 7/12 | Cada item mantém código de SKU visível (P-02) |
| Formulário de dados do solicitante | 5/12 | Campos curtos, autopreenchimento habilitado (P-08) |
| Ação de envio | Alinhada à coluna do formulário (5/12), fixa/sticky em mobile | Nunca disputa espaço com WhatsApp secundário (P-03) |

Em `md` e abaixo, as colunas de lista e formulário empilham verticalmente (12/12 cada), lista
sempre antes do formulário na ordem de leitura.

## 8. Regras de alinhamento

- Alinhamento padrão de texto: à esquerda, sempre. Centralização é reservada a blocos hero curtos
  (título + subtítulo institucional) e nunca aplicada a corpo de texto, tabela ou formulário.
- Elementos de uma mesma linha de grid alinham pela borda superior (top-align) quando o conteúdo
  tem alturas variáveis (ex.: cards com descrição de tamanho diferente).
- Ações primárias de card (ex.: "Adicionar à lista de cotação") alinham sempre na mesma posição
  vertical relativa ao card, independentemente da altura do texto acima — evita que o botão
  "pule" de posição entre cards vizinhos.
- Números e códigos em coluna de tabela alinham à direita quando representam magnitude comparável
  (medida, capacidade); código de SKU alinha à esquerda, por ser identificador, não quantidade.
- Ícone e rótulo textual sempre alinham pelo centro vertical do texto, nunca pela base ou topo do
  ícone.

## 9. Largura máxima de leitura

Reforço direto de `77-typography-system.md`, seção 4, transposto para o grid:

- Bloco de texto corrido (artigo, descrição institucional, texto de missão): `max-width` entre
  60 e 75 caracteres, aplicado ao bloco de texto (`ch` como unidade), nunca ao container de página
  inteiro. Na prática de grid, isso corresponde a ocupar 7 a 8 colunas de 12 em `lg`/`xl`, nunca
  as 12 colunas completas.
- Tabela de variação de SKU e ficha de especificação: sem limite de measure — ocupa a largura
  total disponível do container (12/12), porque a legibilidade aqui depende do alinhamento de
  colunas de dado, não do comprimento de linha de prosa (P-01, P-07).
- Título (H1 a H4, `--text-display` a `--text-h4`): sem limite de measure aplicado; quebra natural
  pelo container do bloco em que está inserido.

## 10. Diagramas ASCII de grid

### 10.1 Grid `xs`/`sm` — 4 colunas

```
|<16>|[col][col][col][col]|<16>|
     |<-------- container -------->|
margem   gutter 16px entre colunas   margem
```

### 10.2 Grid `md` — 8 colunas

```
|<16-32>|[c][c][c][c][c][c][c][c]|<16-32>|
        |<---- container 768px ---->|
margem interpolada     gutter 20px      margem interpolada
```

### 10.3 Grid `lg`/`xl`/`2xl` — 12 colunas

```
|<32>|[1][2][3][4][5][6][7][8][9][10][11][12]|<32>|
     |<---------- container até 1280px ---------->|
margem 32px         gutter 24px entre colunas       margem 32px (cresce em 2xl)
```

### 10.4 Página de família (desktop, `lg`+) — composição de 12 colunas

```
+------------------------------------------------------------+
| [1][2][3][4][5]         galeria         [6..12] info + CTA |
+------------------------------------------------------------+
| [1..............................12] tabela de variações    |
+------------------------------------------------------------+
| [1....6] especificação A   | [7....12] especificação B     |
+------------------------------------------------------------+
```

### 10.5 Formulário de cotação (desktop, `lg`+)

```
+------------------------------------------------------------+
| [1..........7] lista de itens   | [8........12] formulário |
|                                  |    + ação de envio       |
+------------------------------------------------------------+
```

### 10.6 Formulário de cotação (mobile, `xs`/`sm`) — empilhado

```
+----------------------+
| [1][2][3][4] lista    |
+----------------------+
| [1][2][3][4] formul.  |
+----------------------+
| [1][2][3][4] envio    |  <- sticky ao rodapé, alvo mínimo 44x44px
+----------------------+
```

## 11. O que este documento não faz

Não altera nenhum valor de `--breakpoint-*`, `--container-*` ou `--space-*` já registrado em
`76-design-tokens.md`. Não define componentes visuais específicos (isso é tratado nos documentos
de wireframe/protótipo desta etapa). Não aprova a implementação em `src/`: é proposta de
organização de layout, sujeita a aprovação conforme P-10.
