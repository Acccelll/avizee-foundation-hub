# 88 — Especificação de Acessibilidade

Status: `PENDENTE_DE_APROVAÇÃO`. Base normativa: `02-non-negotiable-rules.md`,
`34-accessibility-findings.md`, `75-design-principles.md` (P-06, P-08), `10-brand-guidelines.md`,
`47-page-type-definitions.md`. Meta de aceite: **WCAG 2.1 nível AA** em todas as páginas públicas
e em toda tela de protótipo (`85`, `86`) desta etapa.

Este documento não substitui auditoria em navegador real com leitor de tela — nenhuma foi
executada até o momento (achado F-15, `34`). Toda medida de contraste aqui declarada é calculada
sobre valores hexadecimais da paleta oficial e deve ser reconfirmada em ambiente de produção antes
do lançamento.

## 1. Correção item a item de `34-accessibility-findings.md`

| ID achado | Achado original | Correção proposta na Etapa 3 | Status |
|---|---|---|---|
| F-14 | Links de ação com `href="#"` ("Detalhes" nos produtos, títulos do blog) | Toda família e todo SKU tem URL real e navegável (`45-url-architecture.md`); nenhum link de ação usa `href="#"` ou `javascript:void(0)`; artigos do blog levam a URL de artigo real, nunca a âncora vazia | PENDENTE_DE_APROVAÇÃO — depende de implementação em `src/`, fora desta etapa |
| F-16 | Modal de produto sem gestão de foco, `role="dialog"`/`aria-modal`, fechamento por `Esc` | O modal de produto é **eliminado** como padrão de navegação principal; página de família e página de SKU passam a ser páginas reais (`47`). Onde um modal ainda for necessário (ex.: zoom de imagem, confirmação de item removido), ele deve: receber foco no primeiro elemento interativo ao abrir, devolver foco ao elemento que o abriu ao fechar, usar `role="dialog"` e `aria-modal="true"`, fechar com `Esc`, e prender o foco (focus trap) dentro de si enquanto aberto | RESOLVIDO por arquitetura, sujeito a verificação em implementação |
| F-17 | `<img id="modal-image" alt="">` com alt preenchido só por script | Todo `alt` é definido no marcado (SSR ou dado estático do catálogo), nunca exclusivamente por JavaScript no cliente; se a imagem depender de carregamento assíncrono, o `alt` já existe antes da imagem carregar | PENDENTE_DE_APROVAÇÃO |
| F-15 | Contraste e indicador de foco não verificados | Ver seção 2 (contraste) e seção 3 (foco visível) deste documento — primeira verificação formal do projeto | EM VERIFICAÇÃO NESTA ETAPA |

## 2. Contraste

Cálculo de razão de contraste (WCAG) sobre a paleta oficial fixa: Preto `#151514`, Vinho `#690500`,
Terracota `#b2592c`, Creme `#fffaed`. Nenhuma cor fora dessas quatro (e de neutros
matematicamente derivados, conforme `76-design-tokens.md`) é usada como cor de texto ou de fundo.

| Par | Uso proposto | Razão aproximada | Resultado AA (texto normal ≥ 4.5:1 / texto grande ≥ 3:1) |
|---|---|---|---|
| Preto `#151514` sobre Creme `#fffaed` | Texto de corpo, títulos | ~17.9:1 | Aprovado para qualquer tamanho |
| Creme `#fffaed` sobre Preto `#151514` | Texto sobre fundo escuro (rodapé, seções de destaque) | ~17.9:1 | Aprovado para qualquer tamanho |
| Vinho `#690500` sobre Creme `#fffaed` | Títulos de destaque, links, texto de ênfase | ~9.9:1 | Aprovado para qualquer tamanho |
| Creme `#fffaed` sobre Vinho `#690500` | Texto sobre botão primário/fundo vinho | ~9.9:1 | Aprovado para qualquer tamanho |
| Terracota `#b2592c` sobre Creme `#fffaed` | **Risco identificado em `34`** — proposto apenas para elementos gráficos, ícones e bordas, nunca para texto corrido | ~4.1:1 | **Reprovado para texto normal** (abaixo de 4.5:1); aceitável apenas para texto grande (≥ 18pt ou 14pt negrito) em uso pontual, com preferência por evitar |
| Preto `#151514` sobre Terracota `#b2592c` | Texto sobre superfície terracota (badge, tag) | ~4.4:1 | Limítrofe — usar somente em texto grande/negrito ou reduzir uso a rótulos curtos com peso 700 |
| Creme `#fffaed` sobre Terracota `#b2592c` | Texto claro sobre superfície terracota | ~4.0:1 | **Reprovado para texto normal**; não usar |

`LOVABLE_RECOMMENDATION` — Status: `PENDENTE_DE_APROVAÇÃO`. Regra derivada: **Terracota nunca é
cor de texto corrido sobre Creme nem cor de fundo com texto Creme sobre ela**. Terracota é
reservado a: ícones, bordas, divisores, indicadores de estado ativo (com apoio de forma, não só
cor), e texto grande/negrito em título curto, sempre com verificação individual antes do uso.
Cor de texto de corpo é sempre Preto ou Vinho sobre Creme, ou Creme sobre Preto/Vinho.

Estados de foco, hover, ativo e desabilitado herdam esta mesma restrição; nenhuma variação de
opacidade pode reduzir um par já aprovado abaixo do limiar AA.

## 3. Foco visível

- Todo elemento interativo (link, botão, campo de formulário, item de menu, linha de tabela
  clicável, controle de carrossel, item de lista de cotação) tem indicador de foco visível
  perceptível sem depender apenas de cor — contorno (`outline`) sólido com espessura mínima de
  2px e contraste mínimo de 3:1 contra o fundo adjacente, nunca `outline: none` sem substituto
  equivalente.
- O indicador de foco nunca é removido por estética (contradiz P-06 em `75`).
- A ordem de foco segue a ordem visual e lógica de leitura (DOM order = ordem visual); nenhum
  `tabindex` positivo é usado; elementos puramente decorativos recebem `tabindex="-1"` ou são
  removidos da árvore de foco.
- Componentes customizados (seletor de variação, filtro, autocomplete de busca) implementam
  gestão de foco equivalente a um controle nativo: `Tab` move entre controles, setas movem dentro
  de um grupo (ex.: opções de variação), `Enter`/`Espaço` ativam, `Esc` fecha painéis flutuantes.

## 4. Navegação por teclado em todos os componentes

| Componente | Requisito mínimo de teclado |
|---|---|
| Menu principal e submenu | Abrir/fechar com `Enter`/`Espaço`, navegar itens com setas ou `Tab`, fechar com `Esc`, sem armadilha de foco |
| Busca com autocomplete | Setas para navegar sugestões, `Enter` para selecionar, `Esc` para fechar sugestões sem perder o texto digitado |
| Filtro de catálogo (painel) | Abrir com `Enter`/`Espaço`, todos os controles internos alcançáveis por `Tab`, botão "aplicar" alcançável e ativável, fechar com `Esc` devolve foco ao botão que abriu |
| Tabela de variação | Navegável por `Tab` entre controles de quantidade e ação de cada linha; leitura por leitor de tela coerente com cabeçalho de coluna (ver seção 6) |
| Seletor de variação (tamanho/medida) | Se implementado como grupo de botões, navegável por setas dentro do grupo; se como `select` nativo, comportamento padrão do navegador é preservado |
| Botão "Adicionar à lista de cotação" | Alcançável por `Tab`, ativável por `Enter`/`Espaço`, com confirmação anunciada a leitor de tela (seção 8) |
| Contador da lista de cotação (cabeçalho) | Alcançável por `Tab`, leva à página `/cotacao` ao ativar |
| Modal/diálogo (quando existir) | Foco preso dentro do diálogo, `Esc` fecha, foco retorna ao elemento de origem |
| Carrossel (se existir) | Controles anterior/próximo alcançáveis e rotulados; pausa automática ao receber foco; nenhuma rotação automática sem controle de pausa acessível |
| Formulário de cotação e contato | Ordem de campos por `Tab` segue ordem visual; envio possível via `Enter` no último campo ou botão dedicado |
| Rodapé com links sociais | Alcançável por `Tab`, cada link com `aria-label` descritivo (mantendo o padrão já correto do site atual, ver seção 9) |

## 5. Semântica e landmarks

- Cada página usa exatamente uma `<h1>`, correspondente ao nome da família, categoria, artigo ou
  título da página.
- Hierarquia de cabeçalhos sequencial, sem pular nível (h1 → h2 → h3), inclusive dentro de cartões
  de produto e blocos repetidos.
- Landmarks obrigatórias em toda página pública: `<header>` com `role` implícito de banner,
  `<nav aria-label="...">` para navegação principal e para breadcrumb (rótulos distintos),
  `<main>` único por página, `<footer>` com `role` implícito de contentinfo.
- Listas de produtos e de itens da lista de cotação usam `<ul>`/`<li>` reais, nunca `<div>`
  estilizada para parecer lista.
- Tabela de variação usa elemento `<table>` real com `<caption>` ou título associado, nunca
  `<div>` em grade simulando tabela (ver seção 6).
- Botões que executam ação usam `<button>`; links que navegam usam `<a href>` com destino real
  (corrige F-14).

## 6. Tabelas de variação acessíveis

Requisito derivado de P-01 e P-02 (`75`) e da centralidade da tabela de variação no fluxo de
cotação (`50-quotation-journey.md`).

- `<table>` com `<caption>` visível ou associado via `aria-labelledby`, identificando a família a
  que a tabela pertence (ex.: "Variações — Agulha inox").
- `<th scope="col">` em cada cabeçalho de coluna (código, medida/capacidade, unidade, quantidade,
  ação) e `<th scope="row">` quando a primeira coluna identificar a variação da linha.
- Nenhuma informação comunicada só pela posição visual da célula; toda célula de dado tem
  associação programática com seu cabeçalho.
- Em layout mobile em cartões (`54-mobile-navigation-requirements.md`, J-9 em `53`), cada cartão
  mantém a mesma associação rótulo/valor de forma explícita (ex.: `<dt>`/`<dd>` ou texto visível
  "Medida: 10 × 10 mm"), nunca apenas o valor solto sem rótulo.
- Campo de quantidade em cada linha tem `<label>` associado (visível ou `aria-label` quando o
  rótulo visual repetir a coluna), com `type="number"` e `inputmode="numeric"` para teclado
  adequado em mobile.
- Código do produto (P-02) nunca é truncado por CSS de forma que o leitor de tela leia um valor
  diferente do exibido; `aria-label` nunca diverge do texto visível para o mesmo dado.
- Item marcado como "não disponível para cotação" (`50`, seção 2) comunica o estado por texto
  visível, não apenas por opacidade reduzida ou tachado, e o controle de quantidade correspondente
  fica desabilitado com `aria-disabled="true"` e motivo acessível ao leitor de tela.

## 7. Imagens e texto alternativo

- Toda imagem de produto tem `alt` descritivo com nome da família e, quando aplicável, a variação
  (ex.: "Agulha inox 10 × 10 mm"), nunca `alt=""` deixado para preenchimento por script (corrige
  F-17).
- Placeholder oficial de imagem ("Imagem em atualização", ver `81-image-and-placeholder-specification.md`)
  tem `alt` que comunica o estado, não um `alt` vazio nem um `alt` idêntico ao de uma imagem real.
- Ícones puramente decorativos mantêm `aria-hidden="true"` e `focusable="false"`, preservando a
  prática já correta do site atual (`34`, seção "pontos corretos").
- Imagens de conteúdo editorial (blog, institucional) têm `alt` descritivo do conteúdo da imagem,
  não do arquivo ou de metadado técnico.
- Nenhuma informação essencial é comunicada só por imagem sem equivalente textual (ex.: ícone de
  disponibilidade sem rótulo).

## 8. Formulários e mensagens de erro

Aplica-se ao formulário de cotação (`50`), contato e "não encontrou o item" (`53`, J-8).

- Todo campo tem `<label>` associado por `for`/`id`, nunca apenas `placeholder` como rótulo.
- Campos obrigatórios mantêm `aria-required="true"` (prática já correta do site atual) e indicação
  visual textual, não apenas asterisco sem explicação (explicar "* campo obrigatório" uma vez no
  topo do formulário).
- Validação ocorre por campo, no evento de saída do campo (`blur`) e no envio, conforme `50`.
- Mensagem de erro por campo é associada ao campo via `aria-describedby`, aparece em texto (nunca
  só pela cor da borda) e o foco move para o primeiro campo com erro após tentativa de envio.
- Mensagem de erro descreve o problema e a correção esperada (ver `89-microcopy-and-content-ui-guidelines.md`
  para o texto padronizado), nunca apenas "campo inválido".
- Estado de envio em andamento é anunciado a tecnologia assistiva (`aria-live="polite"` na região
  de status) e o botão de envio fica com `aria-disabled="true"` durante o processamento, evitando
  duplo envio sem impedir leitura do estado.
- Confirmação de sucesso (`/cotacao/enviada`) é anunciada como região de status ao carregar,
  incluindo o número de protocolo.
- Erro de indisponibilidade (`50`, seção 2) é anunciado do mesmo modo, com os canais alternativos
  (WhatsApp, telefone) alcançáveis por teclado imediatamente após a mensagem.

## 9. Leitores de tela e idioma

- `lang="pt-BR"` mantido em todas as páginas (prática já correta, preservar).
- Textos em outro idioma dentro do conteúdo (raro, ex.: termo técnico em inglês) recebem `lang`
  específico no trecho, quando isso evitar pronúncia incorreta relevante.
- Confirmação de "item adicionado à lista de cotação" é anunciada por região `aria-live="polite"`
  não disruptiva, sem mover o foco do usuário (conforme `50`, "confirmação discreta, sem tirar a
  pessoa da página").
- Contador de itens da lista de cotação no cabeçalho atualiza de forma perceptível a leitor de
  tela (texto associado, não apenas número dentro de ícone).
- `aria-label` em botões de ação repetidos (ex.: "Adicionar à lista" em múltiplos cartões) inclui
  o nome da família/variação para diferenciação (ex.: `aria-label="Adicionar Agulha inox 10 × 10 mm à lista de cotação"`).
- Manter os padrões já corretos do site atual (`34`): `aria-labelledby` em seções, `aria-label` na
  navegação, `aria-expanded` no menu mobile, `aria-label` no carrossel e no fechamento de modal.

## 10. Movimento reduzido

- Toda animação de transição (abertura de menu, painel de filtro, troca de imagem) respeita a
  preferência do sistema `prefers-reduced-motion: reduce`, substituindo transição animada por
  mudança instantânea de estado.
- Nenhuma animação de rolagem automática, autoplay de carrossel ou efeito de paralaxe é usada sem
  controle de pausa acessível por teclado, independentemente da preferência de movimento (alinhado
  a P-09 e à vedação de "animações gratuitas" em `10-brand-guidelines.md`).
- Indicadores de carregamento (spinner) usam animação discreta e não piscante, sem risco de gatilho
  fotossensível.

## 11. Tamanho de alvo

- Alvo de toque mínimo de 44×44px CSS para qualquer elemento interativo em telas mobile, conforme
  P-08 (`75`), incluindo botões de ícone, controles de quantidade, itens de menu e checkbox/radio
  de filtro.
- Espaçamento mínimo entre alvos adjacentes suficiente para evitar toque acidental, especialmente
  em tabela de variação convertida em cartões (`53`, J-9) e em painel de filtro mobile.
- Botões de ação primária (Adicionar à lista de cotação, Enviar) nunca menores que o alvo mínimo,
  mesmo em densidade informacional alta (P-07).

## 12. Skip link

- Toda página pública tem link de pular para o conteúdo principal ("Pular para o conteúdo") como
  primeiro elemento focável da página, visível ao receber foco por teclado, levando diretamente ao
  `<main>`.
- Página com barra de filtro ou tabela extensa antes do conteúdo textual pode oferecer skip link
  adicional para o conteúdo textual/formulário, quando a rolagem até ele for excessiva no teclado.

## 13. Checklist de verificação por componente

Uso obrigatório antes de aprovar qualquer componente do inventário (`82-component-inventory.md`)
para implementação. Cada linha responde sim/não; qualquer "não" bloqueia aprovação do componente.

| Componente | Contraste AA verificado | Foco visível | Operável por teclado | Rótulo/nome acessível | Estado comunicado sem depender só de cor | Alvo ≥ 44×44px (mobile) |
|---|---|---|---|---|---|---|
| Botão primário (Adicionar à lista) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Botão secundário (WhatsApp) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Campo de formulário | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Menu principal/submenu | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Busca com autocomplete | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Filtro de catálogo | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Tabela de variação (desktop) | [ ] | [ ] | [ ] | [ ] | [ ] | n/a |
| Cartão de variação (mobile) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cartão de produto/família em listagem | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Contador da lista de cotação | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Diálogo/modal (se existir) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Mensagem de erro de formulário | [ ] | n/a | n/a | [ ] | [ ] | n/a |
| Mensagem de sucesso/protocolo | [ ] | n/a | n/a | [ ] | [ ] | n/a |
| Placeholder de imagem | [ ] | n/a | n/a | [ ] | [ ] | n/a |
| Breadcrumb | [ ] | [ ] | [ ] | [ ] | n/a | [ ] |
| Rodapé com links sociais | [ ] | [ ] | [ ] | [ ] | n/a | [ ] |

## 14. Pendências explícitas

- Nenhum teste real com leitor de tela (NVDA, JAWS, VoiceOver, TalkBack) foi executado; obrigatório
  antes da aprovação final de produção.
- Contraste calculado matematicamente, não medido por ferramenta em navegador sobre a
  renderização final; reconfirmação obrigatória em `src/` antes do lançamento.
- Cores funcionais de erro/sucesso/aviso (L-01, `74`) ainda não aprovadas; qualquer par usado
  nesta especificação para exemplificar mensagens é hipotético e depende de aprovação separada.
