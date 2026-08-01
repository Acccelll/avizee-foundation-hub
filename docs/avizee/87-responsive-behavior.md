# 87 — Comportamento Responsivo

Status: `PENDENTE_DE_APROVAÇÃO`. Este documento é proposta de comportamento responsivo do site
institucional e catálogo B2B da AviZee. Não altera código em `src/`; nenhuma implementação é
autorizada a partir deste documento isoladamente. Baseia-se nos wireframes de
`84-public-page-wireframes.md`, no inventário de `82-component-inventory.md`, nos estados de
`83-component-states-and-behaviors.md`, nos tokens de `76-design-tokens.md`
(§12 breakpoints, §6 espaçamento, §11 duração/easing), nos requisitos de mobile de
`54-mobile-navigation-requirements.md` e no modelo de navegação de `44-navigation-model.md`. Todas
as exclusões de conteúdo (preço, prazo, estoque, marca de terceiro) valem em qualquer largura de
tela e não são repetidas em cada seção deste documento.

## 1. Princípio geral e estratégia mobile-first

1.1. A estratégia é **mobile-first**: todo estilo base é definido para a menor largura suportada
(360px) e progressivamente sobreposto por regras de largura mínima (`min-width`) nos breakpoints
maiores, nunca o inverso. Nenhum componente é "encolhido" a partir de uma versão desktop; a
versão mobile é a base, e a versão desktop é o enriquecimento.

1.2. Conteúdo e função nunca são removidos ao aumentar a largura de tela — apenas reorganizados,
condensados ou expandidos. O inverso também vale: nenhuma informação obrigatória do desktop pode
desaparecer no mobile; o que muda é a forma de acesso (ex.: filtro vira painel sobreposto em vez
de coluna fixa), nunca a existência da função.

1.3. Toda decisão responsiva individual deste documento é `PENDENTE_DE_APROVAÇÃO` e não substitui
decisão de implementação futura; author deve tratar valores de breakpoint e alvo de toque como
ponto de partida técnico, não como especificação final de pixel.

1.4. Testabilidade: cada regra de transformação de componente (seção 3) é redigida como condição
observável (o quê muda, em qual breakpoint, de que forma), permitindo verificação por inspeção
visual ou teste automatizado de layout, sem depender de julgamento subjetivo.

## 2. Breakpoints

Fonte normativa dos valores: `76-design-tokens.md` §12. Este documento reaproveita os mesmos
tokens, sem propor novos valores de breakpoint.

| Faixa | Token | Largura | Rótulo de uso |
|---|---|---|---|
| Base (mobile) | — | `< 360px` até `639px` | Celular padrão, projetado a partir de 360px |
| SM | `--breakpoint-sm` | `≥ 640px` | Celular grande / phablet em paisagem |
| MD | `--breakpoint-md` | `≥ 768px` | Tablet retrato |
| LG | `--breakpoint-lg` | `≥ 1024px` | Tablet paisagem / notebook pequeno — limiar em que o layout passa a "desktop" |
| XL | `--breakpoint-xl` | `≥ 1280px` | Desktop — largura de conteúdo atinge `--container-max-width` |
| 2XL | `--breakpoint-2xl` | `≥ 1536px` | Desktop grande — conteúdo permanece centralizado em `--container-max-width`, sem esticar indefinidamente |

2.1. Convenção de nomenclatura usada no restante do documento: **mobile** = base até SM
(`< 768px`); **tablet** = MD e LG (`768px`–`1279px`); **desktop** = XL e 2XL (`≥ 1280px`). Onde um
componente se comporta de forma idêntica em tablet e desktop, o documento diz apenas "desktop" e
declara explicitamente quando tablet é uma faixa intermediária distinta.

2.2. Nenhum breakpoint depende de detecção de dispositivo (user agent); toda transformação é
disparada por largura de viewport (media query) ou por container query quando o componente é
usado em contextos de largura variável (ex.: card de família dentro de bloco de destaque menor
que a grade principal).

2.3. Orientação (retrato/paisagem) não substitui breakpoint de largura; um tablet em paisagem em
`1024px` segue as regras de LG independentemente da proporção da tela.

## 3. Transformação por componente

Cada subseção segue o formato: **Mobile** (base–SM) → **Tablet** (MD–LG) → **Desktop** (XL–2XL).

### 3.1 Cabeçalho e menu (CMP-11 Header, CMP-12 Menu mobile)

- **Mobile**: barra fixa de altura reduzida com logotipo à esquerda, ícone de busca, indicador da
  lista de cotação (CMP-27, com contador) e botão de menu (☰) à direita, nessa ordem, conforme
  `44` §2. Toque no botão de menu abre painel de tela cheia (CMP-12) com foco preso; a busca abre
  em campo de tela cheia (não em popover), conforme `54`. Nenhum item de nível 2 é exibido sem
  interação explícita.
- **Tablet (MD)**: mesmo comportamento do mobile até o fim de MD (`< 1024px`); o painel de menu
  pode ocupar largura parcial (ex.: 70–80% da tela) em vez de tela cheia, mantendo foco preso.
- **Tablet (LG) / Desktop**: cabeçalho expande para menu horizontal completo (Produtos · Soluções
  · Conteúdos · Sobre · Contato), busca como campo inline ou ícone com painel suspenso (não tela
  cheia), botão "Solicitar cotação" com contador sempre visível como CTA, conforme `44` §1. O item
  "Produtos" abre painel de categorias ao clique (nunca só hover), conforme `44` §1.
- **Regra de transição de layout**: a mudança de menu em acordeão/tela cheia para menu horizontal
  ocorre exatamente no breakpoint LG (`1024px`); não há estado híbrido (parte do menu horizontal,
  parte em painel) em nenhuma largura.
- **Sticky**: o cabeçalho é fixo (`--z-sticky`) em todas as larguras; em mobile, ao rolar para
  baixo, pode reduzir de altura (comportamento de "compactar"), nunca desaparecer sem meio de
  retorno ao topo.

### 3.2 Busca (CMP-03 aplicado à busca, painel de sugestões)

- **Mobile**: ícone no cabeçalho abre campo de busca em tela cheia com sugestões abaixo do campo,
  teclado do sistema operacional assume o espaço inferior; botão de fechar sempre visível no topo
  do overlay.
- **Tablet**: campo de busca pode aparecer inline no cabeçalho em LG ou permanecer como ícone com
  painel suspenso (não tela cheia) ancorado ao ícone, com largura mínima de 320px.
- **Desktop**: campo de busca inline no cabeçalho (conforme wireframe de `84`, PT-01) ou ícone com
  painel suspenso largo (`--z-dropdown`), sugestões em lista com no mínimo 4 itens visíveis sem
  rolagem antes de exigir `scroll` interno do painel.
- **Regra comum a todas as larguras**: resultado de busca atualizado é anunciado via
  `aria-live="polite"` (`83` §4), independentemente do formato do container.

### 3.3 Filtros de catálogo (CMP-19 Painel de filtros, CMP-20 Chips de filtro ativo, CMP-21 Ordenação)

- **Mobile**: filtros e ordenação não ocupam coluna fixa; ficam atrás de dois controles em linha
  logo abaixo da busca da página: botão "Filtros (N)" (N = contador de filtros ativos) e seletor
  "Ordenar". Toque em "Filtros" abre painel sobreposto (bottom sheet ou tela cheia) com ações
  fixas "Aplicar" e "Limpar filtros" sempre visíveis na parte inferior do painel, conforme `54`.
  Chips de filtro ativo (CMP-20), quando existentes, aparecem em lista horizontal rolável acima da
  grade de resultados, fora do painel.
- **Tablet (MD)**: mesmo padrão de painel sobreposto do mobile é aceitável até o fim de MD; a
  diferença aceitável nesta faixa é o painel ocupar no máximo 60% da largura da tela como painel
  lateral deslizante, em vez de tela cheia.
- **Tablet (LG) / Desktop**: painel de filtros vira coluna fixa à esquerda da grade (conforme
  wireframe desktop de PT-02 em `84`), sempre visível, sem necessidade de abrir/fechar. Chips de
  filtro ativo aparecem no topo da área de resultados, ao lado do contador e do controle de
  ordenação.
- **Regra de contagem de filtros**: em qualquer largura, "Limpar filtros" é sempre acessível sem
  exigir rolagem adicional além da já necessária para ver o painel (`82`, CMP-19).
- **Anúncio**: aplicação/remoção de filtro sempre anuncia novo total via `aria-live="polite"`
  (`83` §4), no painel sobreposto e na coluna fixa igualmente.

### 3.4 Grade de produtos (CMP-17 Card de família, CMP-18 Grade de catálogo)

- **Mobile**: 1 coluna. Cada card ocupa a largura útil do container (menos `--container-padding-mobile`
  de cada lado), com imagem/placeholder, nome funcional, categoria e número de variações
  empilhados verticalmente, conforme `54`.
- **Tablet (MD)**: 2 colunas.
- **Tablet (LG)**: 3 colunas.
- **Desktop (XL/2XL)**: 3 colunas (conforme wireframe de `84`, PT-02); 4 colunas é aceitável apenas
  se o número de cards por página comportar múltiplos de 4 sem linha incompleta recorrente — a
  contagem de colunas é decisão de implementação, mas nunca ultrapassa 4 colunas em nenhuma
  largura, para não reduzir a área de leitura do nome funcional.
- **Regra comum**: a proporção da imagem/placeholder do card é fixa entre breakpoints (mesma
  proporção de aspecto), evitando distorção ao mudar o número de colunas; espaçamento entre cards
  segue `--space-4` no mobile e `--space-6` a partir de MD.
- **Carregamento**: "Carregar mais" (botão) é o padrão em todas as larguras; paginação numerada
  (CMP-14) é o fallback acessível idêntico em mobile e desktop, sempre disponível mesmo quando o
  carregamento progressivo funciona.

### 3.5 Tabela de variações de SKU (CMP-22 Tabela de variações, CMP-23 Seletor de variação)

- **Mobile**: a tabela nunca é exibida como tabela com rolagem horizontal (proibido por `54`).
  Cada variação vira um cartão empilhado com pares rótulo/valor (referência, medida/capacidade,
  unidade) e controle de quantidade e botão "Adicionar à lista de cotação" (CMP-26) dentro do
  próprio cartão. Seletor de variação (CMP-23) usa lista rolável vertical ou controle nativo de
  seleção única, nunca grade horizontal de botões que exija rolagem lateral.
- **Tablet (MD)**: cartões empilhados (como mobile) ou tabela compacta com rolagem vertical apenas,
  dependendo do número de colunas de dado disponíveis; rolagem horizontal continua proibida.
- **Tablet (LG) / Desktop**: tabela HTML semântica completa (`th` com escopo definido, conforme
  `82` CMP-22), colunas fixas (referência · medida/capacidade · unidade · quantidade · adicionar),
  sem rolagem horizontal necessária para a largura mínima de LG (`1024px`) — se o número de
  colunas exigir mais espaço, o excesso é resolvido por redução de padding interno da célula, não
  por rolagem lateral.
- **Regra comum**: campo sem dado confiável é omitido em qualquer largura (D-041, `82` CMP-22);
  variação em rascunho/bloqueada não aparece em nenhuma largura (`83` §2.5).

### 3.6 Ficha de família (CMP-24 Bloco de especificações, CMP-25 Galeria de imagens, PT-05)

- **Mobile**: ordem vertical única: breadcrumb reduzido (`54`, "‹ nível pai") → nome da família →
  galeria de imagens (imagem principal em largura total, miniaturas em carrossel horizontal
  abaixo) → seletor de variação → tabela de variações em cartões (3.5) → bloco de especificações
  em lista de pares rótulo/valor (nunca tabela) → conteúdo relacionado → CTA de cotação. Galeria
  usa `swipe` horizontal para miniaturas com indicador de posição.
- **Tablet (MD)**: galeria e especificações permanecem empilhadas verticalmente (uma coluna),
  como no mobile, mas com miniaturas em grade de 2-3 colunas fixas abaixo da imagem principal em
  vez de carrossel, quando a largura comportar.
- **Tablet (LG) / Desktop**: layout de duas colunas — galeria de imagens à esquerda (imagem
  principal com miniaturas em coluna vertical ao lado ou abaixo) e bloco de nome + seletor de
  variação + ação de adicionar à direita; tabela de variações completa abaixo, ocupando a largura
  total do container; bloco de especificações (comuns/variáveis) abaixo da tabela.
- **Regra comum**: breadcrumb completo (`44` §4, até 5 níveis) só aparece a partir de tablet LG;
  em mobile o breadcrumb é reduzido ao nível pai, conforme `54`.

### 3.7 Lista de cotação (CMP-27 a CMP-31, PT: `/cotacao`)

- **Mobile**: barra inferior persistente fixa "N itens · Solicitar cotação" (CMP-27) em páginas de
  família, categoria e cotação, ausente em páginas institucionais/legais, conforme `54`. Dentro da
  página `/cotacao`, cada item (CMP-29) é um cartão com imagem/placeholder, nome, referência,
  campo de quantidade e observação empilhados, botão de remover com alvo de toque adequado (3.9).
  Drawer de visão rápida (CMP-28), quando aberto a partir de outra página, ocupa tela cheia ou
  painel inferior (bottom sheet).
- **Tablet**: cartões de item podem usar layout de duas colunas internas (imagem à esquerda, dados
  à direita) mantendo empilhamento vertical da lista; drawer (CMP-28) como painel lateral parcial.
- **Desktop**: barra de cotação persistente flutua como indicador discreto no canto (conforme
  wireframe de `84`, PT-02) em vez de barra de largura total; itens da lista em `/cotacao` podem
  usar layout tabular (linha por item) com colunas para imagem, nome/referência, quantidade,
  observação e remoção; drawer (CMP-28) como painel lateral deslizante fixo.
- **Regra comum**: contador de itens (CMP-27) está sempre visível durante a navegação, em qualquer
  largura (`50` §4, `82` CMP-27); item "não disponível para cotação" nunca bloqueia o envio dos
  demais, em nenhuma largura (`83` §2.2).

### 3.8 Formulário (CMP-03 a CMP-06, CMP-30 Formulário de cotação)

- **Mobile**: um campo por linha, largura total do container, teclado do sistema ajustado por tipo
  de campo (numérico, e-mail, telefone), sem etapas artificiais (wizard) mesmo com muitos campos —
  rolagem vertical contínua é preferida a paginação de etapas, conforme `54`. Mensagem de erro
  aparece acima do campo correspondente (`54`), com foco movido ao primeiro campo inválido no
  envio (`83` §3).
- **Tablet**: campos podem se agrupar em pares por linha (ex.: nome e telefone lado a lado) quando
  logicamente relacionados e cada campo individual mantiver largura mínima confortável (≥ 280px);
  campos de texto longo (observação) permanecem em largura total mesmo em pares.
- **Desktop**: mesmo agrupamento em pares do tablet é aceitável; layout de formulário nunca excede
  duas colunas de campos, preservando leitura linear e ordem de tabulação previsível (`83` §3).
- **Regra comum**: aceite de privacidade nunca pré-marcado (`82` CMP-05) em nenhuma largura; botão
  de envio bloqueado durante o estado "enviando", sem duplo envio, em qualquer breakpoint
  (`50` §2, `83` §1).

### 3.9 Rodapé (CMP-16 Footer)

- **Mobile**: grupos do rodapé (`44` §3: institucional, produtos, soluções, conteúdos,
  atendimento, legal, redes) em acordeão — cada grupo é um cabeçalho expansível, apenas um ou
  nenhum grupo aberto por padrão, mantendo a página curta. Linha final (copyright + atalho
  "Solicitar cotação") sempre visível, fora do acordeão.
- **Tablet (MD)**: grupos podem aparecer em 2 colunas fixas (sem acordeão) ou manter acordeão,
  dependendo da altura total resultante; se expandido, todos os links são alcançáveis sem
  interação adicional.
- **Tablet (LG) / Desktop**: todas as colunas do rodapé visíveis simultaneamente lado a lado
  (conforme wireframe de `84`), sem acordeão, com logotipo monocromático em creme e link legal e
  redes na base.
- **Regra comum**: nenhuma versão do rodapé exibe marca de terceiro, preço ou promessa comercial
  (`44` §3); links de rede social sempre com `rel="noopener noreferrer"` em qualquer largura.

## 4. Regras de toque e tamanho de alvo

4.1. Todo elemento interativo (botão, link em bloco, checkbox, radio, chip removível, item de
menu, controle de quantidade) tem área de toque mínima de **44×44px** em telas com ponteiro do
tipo toque (mobile e tablet), independentemente do tamanho visual do ícone ou texto interno —
espaçamento adicional invisível (padding) compensa ícones menores.

4.2. Espaçamento mínimo de **8px** (`--space-2`) entre alvos de toque adjacentes, para reduzir
toque acidental em listas densas (chips de filtro, itens de menu em acordeão, botões de remoção
em cartões de item da lista de cotação).

4.3. Nenhuma ação crítica (adicionar à cotação, remover item, enviar formulário, aplicar/limpar
filtros, fechar modal/drawer) depende de gesto avançado (arrastar, pressionar longo, multitoque)
como único meio de acionamento; todo gesto avançado tem alternativa de toque simples.

4.4. Componentes com `swipe` (carrossel de miniaturas, carrossel de famílias em destaque no
mobile, conforme `84` PT-01) sempre expõem controles de avanço/retrocesso alcançáveis por toque
simples e por teclado (setas), nunca dependem exclusivamente do gesto de arrastar.

4.5. Em dispositivos com ponteiro de precisão (mouse), o alvo mínimo de 44×44px não é obrigatório,
mas a área clicável nunca é menor que a área visualmente delimitada do elemento (nenhum "alvo
fantasma" menor que o visual).

4.6. Todo alvo de toque mantém contraste e foco visível idênticos aos definidos em
`83` §3, independentemente do tamanho da área de toque.

## 5. Ordem de conteúdo e prioridade em telas pequenas

5.1. Princípio: a ordem do DOM em mobile é a ordem de prioridade de leitura, nunca reorganizada
apenas visualmente via CSS de forma a divergir da ordem lógica/semântica — o que aparece primeiro
na tela é o que aparece primeiro no código, preservando a experiência de leitores de tela e
navegação por teclado.

5.2. Prioridade fixa em página de tipo catálogo/família (PT-02, PT-05): identificação do item
(nome, imagem) → ação principal (seletor de variação, adicionar à cotação) → dados de suporte
(especificações, conteúdo relacionado). A ação de adicionar à lista de cotação nunca fica abaixo
da dobra em telas de 360px sem que o usuário tenha primeiro visto a identificação do item.

5.3. Em Home (PT-01), a ordem de blocos é idêntica entre mobile e desktop (`84` §"Hierarquia de
blocos"); mobile não reordena, apenas empilha e comprime cada bloco na mesma sequência de 11
blocos.

5.4. Elementos de suporte secundário (rodapé completo, FAQ, conteúdos relacionados, bloco de
autor) sempre ficam ao final do fluxo em mobile, mesmo quando no desktop ocupam posição lateral —
nunca aparecem antes do conteúdo principal da página.

5.5. Navegação persistente (cabeçalho, barra de cotação inferior) não é contada como parte da
"ordem de leitura" de conteúdo; é estrutura fixa e permanece acessível a qualquer ponto da rolagem.

5.6. Quando um bloco tem CTA duplo (primário + secundário, ex.: hero da Home), a ordem visual em
mobile mantém o botão primário acima do secundário, empilhados verticalmente, nunca lado a lado
espremidos abaixo da largura mínima de toque confortável (~150px por botão).

## 6. Imagens responsivas e placeholder

6.1. Toda imagem de produto (galeria CMP-25, card de família CMP-17) usa conjunto de fontes
responsivas (`srcset`/`sizes` ou equivalente), servindo a resolução adequada à largura real de
exibição em cada breakpoint, nunca a imagem de maior resolução disponível em telas pequenas.

6.2. Formatos modernos (ex.: WebP/AVIF com fallback) são o padrão, conforme `54`; dimensão do
espaço da imagem é sempre reservada antecipadamente (via proporção de aspecto fixa) para eliminar
deslocamento de layout (CLS) durante o carregamento, coerente com `81-image-and-placeholder-specification.md`
§6 e `83` §5.

6.3. Placeholder oficial (produto sem imagem, `83` §2.3) mantém a mesma proporção de aspecto da
imagem real em qualquer breakpoint — o placeholder nunca é menor, cortado ou tratado como
elemento de segunda classe em relação ao card com imagem real; card sem imagem nunca é
despriorizado em ordenação.

6.4. Carregamento diferido (`loading="lazy"`) é aplicado a toda imagem abaixo da dobra inicial em
qualquer largura; a primeira imagem visível de cada página de família/card em destaque carrega de
forma eager para reduzir a percepção de espera.

6.5. Imagens institucionais (hero de Home, Sobre) seguem a mesma regra de reserva de espaço e
`srcset`, com foco de corte (`object-position`) ajustado por breakpoint quando a proporção de
aspecto do hero mudar entre mobile (mais vertical) e desktop (mais horizontal).

6.6. O aviso "Imagem ilustrativa" (badge, CMP-07) permanece legível e visível em qualquer largura,
nunca escondido atrás de interação exclusiva de hover em telas de toque (`82` CMP-09, regra de
tooltip não pode ser único meio).

## 7. Performance percebida

7.1. Skeleton (CMP-10) reserva exatamente as dimensões do conteúdo final esperado (grade de
cards, tabela de variações, galeria), em todas as larguras, para eliminar salto de layout ao
concluir o carregamento (`83` §5).

7.2. Estado de carregamento é sempre anunciado textualmente para leitor de tela, além do
indicador visual, em qualquer breakpoint (`83` §4).

7.3. Transições seguem as durações de `76-design-tokens.md` §11 (`--duration-instant` a
`--duration-slow`) em todas as larguras; nenhuma transição é alongada artificialmente em telas
maiores. `prefers-reduced-motion` suprime transições não essenciais independentemente do
breakpoint (`83` §5).

7.4. Em conexões mais lentas (mais comuns em acesso móvel de campo, contexto B2B rural/industrial
do agronegócio), a ordem de carregamento prioriza: cabeçalho e navegação → conteúdo textual acima
da dobra → imagem principal acima da dobra → demais imagens (diferidas) → conteúdo abaixo da
dobra. Nenhum script não essencial bloqueia a renderização do conteúdo textual principal.

7.5. Ações críticas (adicionar à lista de cotação, aplicar filtro) mostram feedback imediato
(dentro de `--duration-instant`/`--duration-fast`) mesmo antes da confirmação definitiva do
servidor, sem contradizer a regra de nunca simular dado que não existe (`83` §5) — o feedback é de
processamento em andamento, não de resultado definitivo antecipado.

7.6. Carregamento progressivo da grade de catálogo ("Carregar mais") busca o próximo lote antes
de o usuário atingir o fim absoluto da lista atual (pré-carregamento antecipado por proximidade de
rolagem), em qualquer largura, para reduzir espera percebida.

## 8. Diagramas ASCII por breakpoint

### 8.1 PT-02 Produtos — mobile (< 768px)

```text
┌────────────────────┐
│ [logo] 🔍 [🛒·0] ☰ │  ← header fixo, --z-sticky
├────────────────────┤
│ Início › Produtos   │
│ NOSSOS PRODUTOS      │
├────────────────────┤
│ 🔍 Buscar nesta lista│
│ [Filtros(2)] [Ordenar▾] │
├────────────────────┤
│ 24 resultados         │
│ ┌──────────────────┐│
│ │ imagem/placeholder ││
│ │ Nome da família    ││
│ │ Categoria · N var. ││
│ └──────────────────┘│  ← 1 coluna
│ ┌──────────────────┐│
│ │ ···                ││
│ └──────────────────┘│
│ [ Carregar mais ]     │
├────────────────────┤
│ [footer em acordeão]  │
├────────────────────┤
│▓ N itens·Solicitar cot│  ← barra inferior fixa
└────────────────────┘
```

### 8.2 PT-02 Produtos — tablet (768–1023px)

```text
┌──────────────────────────────────────┐
│ [header: logo · ícones · ☰ ou menu]  │
├──────────────────────────────────────┤
│ Início › Produtos                     │
│ NOSSOS PRODUTOS                       │
├────────────────┬─────────────────────┤
│ [Filtros(2)]▾  │ 24 resultados  [Ordenar▾]│
│ (painel lateral│ ┌─────────┐┌─────────┐│
│  parcial ao     │ │ card    ││ card    ││  ← 2 colunas
│  abrir)         │ └─────────┘└─────────┘│
│                 │ ┌─────────┐┌─────────┐│
│                 │ │ ···     ││ ···     ││
│                 │ └─────────┘└─────────┘│
│                 │      [ Carregar mais ]│
├────────────────┴─────────────────────┤
│ [footer em 2 colunas ou acordeão]     │
└──────────────────────────────────────┘
```

### 8.3 PT-02 Produtos — desktop (≥ 1280px)

```text
┌────────────────────────────────────────────────────────────────┐
│ [logo]  Produtos  Soluções  Conteúdos  Sobre  Contato  🔍 [Cot·0]│
├────────────────────────────────────────────────────────────────┤
│ Início › Produtos                                                │
│ NOSSOS PRODUTOS — introdução curta                              │
├───────────────┬──────────────────────────────────────────────┤
│ FILTROS (fixo) │ 🔍 Buscar   Ordenar:[Relevância▾]  24 result. │
│ ▸ Categoria    │ ┌───────┐┌───────┐┌───────┐                  │
│ ▸ Família      │ │ card  ││ card  ││ card  │  ← 3 colunas      │
│ ▸ Aplicação*   │ └───────┘└───────┘└───────┘                  │
│ [Limpar filtros]│ ┌───────┐┌───────┐┌───────┐                 │
│                │ │ ···   ││ ···   ││ ···   │                  │
│                │ └───────┘└───────┘└───────┘                  │
│                │        [ Carregar mais ]                      │
├───────────────┴──────────────────────────────────────────────┤
│ [footer completo, colunas lado a lado]                          │
└────────────────────────────────────────────────────────────────┘
   ▲ indicador de cotação flutuante no canto (não barra de largura total)
```

### 8.4 PT-05 Família — mobile (< 768px)

```text
┌────────────────────┐
│ [header fixo]       │
│ ‹ Vacinação          │  ← breadcrumb reduzido
├────────────────────┤
│ imagem principal     │
│ ◦ ◦ ◦ (miniaturas)   │  ← carrossel
├────────────────────┤
│ Nome da família       │
│ ( ) Variação A        │
│ ( ) Variação B        │  ← seletor de variação
├────────────────────┤
│ Variação A            │
│ Ref · Medida · Unid.  │
│ Qtd [  ] [Adicionar]  │  ← cartão de variação
│ ─────────────────────│
│ Variação B ···        │
├────────────────────┤
│ ESPECIFICAÇÕES        │
│ Atributo: valor        │
│ ···  (lista, não tabela)│
├────────────────────┤
│ Você também precisa   │
├────────────────────┤
│ [footer acordeão]     │
├────────────────────┤
│▓ N itens·Solicitar cot│
└────────────────────┘
```

### 8.5 PT-05 Família — desktop (≥ 1280px)

```text
┌────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                   │
│ Início › Produtos › Categoria › Família                          │
├─────────────────────────────┬────────────────────────────────┤
│ [galeria]                    │ Nome da família                 │
│ imagem principal              │ ( ) Variação A                  │
│ [mini][mini][mini]            │ ( ) Variação B                  │
│                               │ Qtd [  ]  [Adicionar à cotação] │
├─────────────────────────────┴────────────────────────────────┤
│ TABELA DE VARIAÇÕES (colunas: ref · medida · unidade · qtd · +)│
├────────────────────────────────────────────────────────────────┤
│ ESPECIFICAÇÕES (comuns | variáveis, em colunas)                 │
├────────────────────────────────────────────────────────────────┤
│ Você também pode precisar / Conteúdos recomendados               │
├────────────────────────────────────────────────────────────────┤
│ [footer completo]                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 9. Critérios de aceite verificáveis

Cada critério é observável por inspeção de tela em cada breakpoint listado (360px, 640px, 768px,
1024px, 1280px, 1536px) ou por teste automatizado de layout/DOM.

1. Em nenhuma largura entre 360px e 1536px a tabela de variações (3.5) apresenta rolagem
   horizontal abaixo de `1024px`; abaixo desse limite, a variação é exibida em formato de cartão.
2. O menu principal exibe itens horizontais completos apenas a partir de `1024px` (LG); abaixo
   disso, exibe botão de menu (☰) que abre painel com foco preso.
3. O indicador da lista de cotação (contador) está presente e visível em 100% das capturas de
   tela em qualquer largura testada, em qualquer página que não seja institucional/legal.
4. A barra inferior persistente de cotação aparece em páginas de família, categoria e cotação
   apenas em larguras `< 1024px`; em `≥ 1024px` a mesma função aparece como indicador flutuante no
   cabeçalho, nunca ambos simultaneamente.
5. O painel de filtros aparece como coluna fixa visível sem interação em larguras `≥ 1024px` e
   como painel sobreposto acionado por botão em larguras `< 1024px`; não existe largura em que
   ambos os formatos coexistam.
6. A grade de catálogo exibe exatamente 1 coluna em `< 768px`, 2 colunas em `768–1023px`, e 3 (ou
   4, se adotado) colunas em `≥ 1024px`, sem coluna incompleta sistemática causada por proporção
   incorreta.
7. Todo elemento interativo medido em viewport `< 1024px` possui área de toque ≥ 44×44px e
   espaçamento ≥ 8px do próximo alvo interativo.
8. Nenhuma imagem de produto carrega em resolução superior à necessária para a largura de exibição
   real do card/galeria no breakpoint corrente (verificável por tamanho de arquivo servido vs.
   dimensão renderizada).
9. Toda imagem, incluindo placeholder, reserva espaço com proporção de aspecto fixa antes do
   carregamento, resultando em CLS (Cumulative Layout Shift) mensurável igual a zero para blocos
   de imagem em teste automatizado, em qualquer breakpoint.
10. A ordem de blocos da Home é idêntica em DOM entre mobile e desktop (mesma sequência de 11
    blocos, verificável por comparação de ordem de elementos, independentemente do CSS de
    apresentação).
11. Skeleton de carregamento (grade, galeria, tabela) ocupa dimensão igual à do conteúdo final
    correspondente, em qualquer breakpoint, sem diferença de altura/largura mensurável superior a
    a tolerância de borda (`--border-width-emphasis`).
12. Formulário de cotação/contato exibe um campo por linha em `< 768px` e, quando implementado em
    pares, nunca reduz a largura de um campo individual abaixo de 280px em nenhuma largura.
13. Rodapé exibe todos os grupos definidos em `44` §3 em qualquer breakpoint — em acordeão
    (`< 1024px`, colapsado por padrão) ou expandido lado a lado (`≥ 1024px`) — sem omitir nenhum
    grupo em nenhuma largura.
14. `prefers-reduced-motion: reduce` ativo suprime toda transição não essencial (skeleton→conteúdo,
    abertura de painel) em qualquer breakpoint, verificável por ausência de propriedades de
    transição/animação não essenciais no cálculo de estilo computado.
15. Nenhum teste de largura entre 360px e 1536px produz elemento de conteúdo obrigatório (nome de
    produto, ação de adicionar à cotação, CTA de envio de formulário) fora da área visível sem
    rolagem vertical padrão (ou seja, nenhum elemento cortado horizontalmente exigindo rolagem
    lateral da página).

## 10. Status

Documento `PENDENTE_DE_APROVAÇÃO` (R-10). Descreve comportamento responsivo proposto para o
escopo de páginas e componentes definidos em `47-page-type-definitions.md`,
`82-component-inventory.md` e `84-public-page-wireframes.md`. Nenhuma regra aqui autoriza, por si,
alteração em `src/`; implementação depende de aprovação explícita e de tarefa técnica específica.
