# 82 — Inventário de Componentes

Status: `APROVADO` (Etapa 3 aprovada com ajustes em 2026-08-01; ver `93`). Aprovação conceitual — não autoriza implementação. Inventário conceitual do design system do AviZee, derivado de
`10-brand-guidelines.md`, `47-page-type-definitions.md`, `49-search-and-filter-architecture.md`
e `50-quotation-journey.md`. Este documento não implementa componentes em `src/`; descreve
função, props conceituais, variantes, uso e restrições para orientar implementação futura sob
aprovação. Numeração de identificador: `CMP-01` a `CMP-NN`, contínua entre grupos.

Convenções: "props conceituais" descrevem dados/comportamento esperado, não uma API de código
específica. Cor sempre restrita à paleta oficial (Preto `#151514`, Vinho `#690500`, Terracota
`#b2592c`, Creme `#fffaed`); tipografia sempre Montserrat.

## Grupo A — Primitivos

### CMP-01 — Botão
Função: ação primária, secundária ou terciária.
Props conceituais: rótulo (texto obrigatório) · variante (primário/secundário/terciário/link) ·
ícone opcional (posição início/fim) · estado (default/hover/focus/active/disabled/loading) ·
tamanho (padrão/compacto) · tipo (botão de ação/link de navegação).
Variantes: primário (Terracota preenchido, texto Creme) · secundário (contorno, texto Vinho ou
Preto) · terciário/link (texto sublinhado ou com ícone, sem fundo).
Onde é usado: CTAs de home, "Adicionar à lista de cotação", "Solicitar cotação", navegação,
formulários.
Regras: rótulo nunca é só ícone em ação crítica (`80` §4) · nunca usa vocabulário de compra
("Comprar", "Finalizar compra") · nunca exibe preço.
Proibições: gradiente, sombra projetada, cor fora da paleta, texto genérico "Clique aqui".

### CMP-02 — Link
Função: navegação textual inline ou de bloco.
Props conceituais: destino · rótulo descritivo · estado visitado (opcional) · ícone opcional.
Variantes: inline (dentro de texto corrido) · bloco (cartão/lista clicável).
Onde é usado: corpo de texto, breadcrumb, rodapé, cartões.
Regras: rótulo sempre descritivo do destino (nunca "clique aqui", `47` "Acessibilidade").
Proibições: link disfarçado de botão sem foco visível; área clicável sem indicação visual.

### CMP-03 — Input de texto
Função: captura de texto livre (nome, e-mail, busca, observação).
Props conceituais: rótulo visível · placeholder (auxiliar, nunca substitui rótulo) · tipo ·
obrigatoriedade · mensagem de erro associada · estado (default/focus/disabled/error).
Onde é usado: formulário de cotação, contato, busca.
Regras: rótulo sempre visível e associado via `label`/`for`; erro exibido em texto, não só cor.
Proibições: placeholder como único rótulo; campo de preço ou desconto.

### CMP-04 — Select
Função: escolha única entre opções predefinidas (estado, unidade).
Props conceituais: rótulo · lista de opções · valor selecionado · obrigatoriedade · erro.
Onde é usado: formulário de cotação/contato, ordenação do catálogo.
Regras: nunca inclui opção "preço" como critério; opções sempre em linguagem funcional.

### CMP-05 — Checkbox
Função: escolha múltipla ou aceite (privacidade).
Props conceituais: rótulo · estado marcado/desmarcado/indeterminado · obrigatoriedade · erro.
Onde é usado: filtros de múltipla escolha, aceite de privacidade no formulário de cotação.
Regras: aceite de privacidade nunca vem pré-marcado.

### CMP-06 — Radio / Grupo de rádio
Função: escolha única exclusiva.
Props conceituais: rótulo do grupo (`aria-label`/`legend`) · opções · valor selecionado.
Onde é usado: seletor de variação na página de família (grupo de rádio acessível, nunca `div`
clicável, conforme `47`).
Regras: sempre agrupado com rótulo de grupo audível por leitor de tela.

### CMP-07 — Badge
Função: rótulo curto de estado ou classificação, não interativo.
Props conceituais: texto · tom (neutro/informativo) · ícone opcional.
Onde é usado: aviso "Imagem ilustrativa" (`81` §3), contador de itens, "Novo" em conteúdo.
Proibições: badge de preço, desconto, "mais vendido" com conotação comercial de estoque/urgência.

### CMP-08 — Tag / Chip
Função: rótulo de categorização ou filtro selecionável.
Props conceituais: texto · removível (booleano) · estado selecionado.
Onde é usado: chip de filtro ativo em `/produtos` (`49`), tags de aplicação.
Regras: chip removível sempre com alvo de toque adequado e rótulo acessível "Remover filtro X".

### CMP-09 — Tooltip
Função: informação complementar não crítica, sob interação de foco/hover.
Props conceituais: gatilho · conteúdo · posição.
Onde é usado: explicação de termo técnico, abreviação de unidade.
Regras: nunca é o único meio de acessar informação obrigatória (ex.: aviso de imagem ilustrativa
não pode depender só de tooltip); acessível via teclado (foco), não só hover.

### CMP-10 — Skeleton (estado de carregamento)
Função: indicar carregamento de conteúdo antes da renderização final.
Props conceituais: forma (linha/bloco/card) · quantidade de repetições.
Onde é usado: grade de catálogo, galeria, tabela de variações durante carregamento.
Regras: nunca simula dado real (preço, nome específico); usa apenas blocos neutros.

## Grupo B — Navegação

### CMP-11 — Header
Função: navegação principal e identidade.
Props conceituais: logotipo · itens de menu · busca · contador da lista de cotação · CTA de
cotação.
Regras: logotipo conforme `80` §7; contador de cotação sempre visível (`50` §4).

### CMP-12 — Menu mobile
Função: navegação principal em telas estreitas.
Props conceituais: itens de menu · estado aberto/fechado · foco preso enquanto aberto.
Regras: foco preso e retorno ao gatilho ao fechar (`47` "Acessibilidade").

### CMP-13 — Breadcrumb
Função: indicar a posição hierárquica da página.
Props conceituais: lista ordenada de nível → rótulo → link.
Onde é usado: PT-03 a PT-06, PT-08, PT-09.
Regras: contido em `nav` com `aria-label` (`47`).

### CMP-14 — Paginação
Função: navegação entre páginas de resultado, como fallback acessível ao carregamento
progressivo em `/produtos` (`47` PT-02).
Props conceituais: página atual · total de páginas · aria-current.

### CMP-15 — Tabs
Função: alternar entre blocos de conteúdo relacionado sem navegar de página (ex.: especificações
comuns vs. variáveis, quando aplicável).
Props conceituais: lista de abas · aba ativa · painel associado.
Regras: navegável por teclado (setas), papel `tablist`/`tab`/`tabpanel`.

### CMP-16 — Footer
Função: navegação secundária, institucional e legal.
Props conceituais: logotipo (monocromático em creme) · colunas de links · contato · redes
(quando aprovadas) · links legais (PT-16).
Regras: nunca exibe marca de terceiro (selo de parceiro, bandeira de pagamento).

## Grupo C — Catálogo

### CMP-17 — Card de família
Função: representar uma família de produto na grade do catálogo (`47` PT-02).
Props conceituais: nome funcional · imagem ou placeholder · categoria · número de variações ·
faixa de medidas (quando existir) · aviso de imagem ilustrativa (quando aplicável).
Regras: nunca exibe marca, nunca exibe preço; sempre leva à página de família (PT-05).

### CMP-18 — Grade de catálogo
Função: organizar cards de família em grade responsiva com carregamento progressivo.
Props conceituais: lista de famílias · contador de resultados · estado vazio · fallback de
paginação.

### CMP-19 — Painel de filtros
Função: aplicar filtros gerais e contextuais (`49`).
Props conceituais: grupo de filtros rotulado · valores disponíveis · contagem por valor
(opcional) · ação "limpar filtros".
Regras: filtro só é publicado quando ≥ 80% dos itens tiverem o atributo preenchido (`49` §6);
nunca zera lista sem oferecer "limpar filtros"; grupo com rótulo acessível.

### CMP-20 — Chips de filtro ativo
Função: exibir e permitir remoção individual dos filtros aplicados.
Props conceituais: lista de filtros ativos · ação remover · ação "limpar todos".
Reaproveita CMP-08 (Tag/Chip).

### CMP-21 — Controle de ordenação
Função: ordenar resultados do catálogo.
Props conceituais: critério atual · opções (relevância, nome, categoria).
Proibições: nenhuma opção de ordenação por preço (`47` PT-02).

### CMP-22 — Tabela de variações
Função: listar as variações de uma família com dados para cotação (PT-05).
Props conceituais: colunas (referência · medida/capacidade · unidade · quantidade · adicionar) ·
linhas por variação · versão em cartões para mobile.
Regras: campo sem dado é omitido, nunca preenchido com texto genérico (D-041); variação em
rascunho ou bloqueada por divergência não aparece (D-036); `th` com escopo definido.

### CMP-23 — Seletor de variação
Função: destacar/selecionar a variação de interesse antes de adicionar à cotação.
Reaproveita CMP-06 (grupo de rádio acessível). Integra-se com a busca por código exato (`49` §3,
exemplo `AG011`).

### CMP-24 — Bloco de especificações
Função: exibir especificações comuns e variáveis da família/SKU.
Props conceituais: lista de pares atributo/valor · seção "comuns" e "variáveis" separadas.
Regras: atributo sem valor confiável é omitido, não preenchido com "a confirmar" genérico.

### CMP-25 — Galeria de imagens
Função: exibir imagem principal e miniaturas de uma família/SKU.
Props conceituais: imagem principal · miniaturas · aviso de imagem ilustrativa (quando aplicável)
· fallback de placeholder.
Regras: segue integralmente `81-image-and-placeholder-specification.md`.

## Grupo D — Cotação

### CMP-26 — Botão "Adicionar à lista de cotação"
Função: adicionar uma variação com quantidade à lista de cotação local.
Props conceituais: variação de referência · quantidade · estado (default/adicionando/adicionado).
Regras: confirmação discreta sem retirar o usuário da página (`50` §1, passo 4); nunca usa
"comprar" ou "adicionar ao carrinho" (R-08).

### CMP-27 — Indicador da lista de cotação
Função: contador persistente no cabeçalho e barra inferior mobile.
Props conceituais: número de itens/famílias · link para `/cotacao`.
Regras: sempre visível durante a navegação (`50` §4).

### CMP-28 — Drawer/painel da lista
Função: visão rápida do conteúdo da lista sem sair da página atual (complementar a `/cotacao`).
Props conceituais: itens resumidos · ação editar/remover · CTA "Ir para a lista de cotação".

### CMP-29 — Item da lista de cotação
Função: representar uma linha da lista com edição de quantidade e observação.
Props conceituais: família · referência/variação · imagem/placeholder · quantidade editável ·
observação · estado "não disponível para cotação" (item removido do catálogo, `50` §2).
Regras: item indisponível é marcado sem bloquear o envio dos demais.

### CMP-30 — Formulário de cotação
Função: capturar dados do solicitante e finalizar o envio.
Props conceituais: campos do solicitante (`50` §3) · validação por campo · aceite de
privacidade · estado de envio.
Regras: validação no blur e no envio, foco no primeiro erro (`47`); botão bloqueado durante
envio, sem duplo envio (`50` §2).

### CMP-31 — Resumo da cotação
Função: exibir o conjunto de itens e dados antes/depois do envio.
Props conceituais: lista de itens · totais por família (contagem, nunca valor monetário).

### CMP-32 — Confirmação de envio
Função: página/estado `/cotacao/enviada` com protocolo.
Props conceituais: número de protocolo · resumo dos itens · próximos passos.
Regras: nunca promete prazo (RK-12); nunca linguagem de pedido confirmado (R-08).

## Grupo E — Conteúdo

### CMP-33 — Card de artigo
Função: representar um conteúdo editorial em listagens.
Props conceituais: título · imagem/placeholder · resumo · categoria editorial · data.

### CMP-34 — Sumário do artigo
Função: navegação interna por seções de um artigo longo.
Props conceituais: lista de âncoras correspondentes aos títulos do artigo.

### CMP-35 — Bloco de autor
Função: atribuição do conteúdo.
Props conceituais: nome · função/credencial · foto opcional.
Regras: sem afirmação de parceria/representação não autorizada (R-12).

### CMP-36 — Conteúdos relacionados
Função: sugerir artigos/soluções relacionados ao contexto atual.
Props conceituais: lista de itens relacionados · critério de relação (categoria/solução/tema).

## Grupo F — Feedback

### CMP-37 — Alerta
Função: comunicar informação importante não bloqueante (ex.: aviso de privacidade, aviso
"imagem ilustrativa" quando usado fora do badge de imagem).
Props conceituais: tom (informativo/atenção) · texto · ícone opcional · ação opcional.

### CMP-38 — Toast
Função: confirmação temporária e não bloqueante (ex.: "Item adicionado à lista de cotação").
Props conceituais: texto · duração · ação opcional (ex.: "Ver lista").
Regras: nunca é o único meio de confirmar uma ação crítica; some sem apagar o estado real (item
continua na lista mesmo após o toast desaparecer).

### CMP-39 — Estado vazio
Função: comunicar ausência de conteúdo com saída acionável.
Props conceituais: texto explicativo · CTA de saída (ex.: "Ver produtos", "Limpar filtros").
Onde é usado: lista de cotação vazia (`50` §2), catálogo sem resultado, busca sem correspondência.
Regras: nunca em tom de erro quando a ausência é esperada (ex.: lista de cotação vazia).

### CMP-40 — Erro
Função: comunicar falha e caminho alternativo.
Props conceituais: texto do erro · ação de retry · canal alternativo (WhatsApp/telefone).
Onde é usado: falha de envio de cotação (`50` §2), erro de formulário por campo.
Regras: dados preservados após erro; nunca descarta o preenchimento do usuário.

### CMP-41 — Carregando
Função: indicar processamento em andamento.
Props conceituais: rótulo textual associado · uso de CMP-10 (skeleton) quando aplicável.
Regras: botão em estado "enviando" fica bloqueado e comunica o estado explicitamente (`50` §2).

## Grupo G — Institucional

### CMP-42 — Hero
Função: abertura de página com proposta de valor.
Props conceituais: título · texto de apoio · imagem institucional/placeholder · CTA duplo.
Onde é usado: PT-01 Home, PT-14 Sobre.
Regras: sem preço, sem prazo, sem marca (`47` PT-01).

### CMP-43 — Bloco de diferenciais
Função: comunicar variedade especializada, agilidade e atendimento consultivo.
Props conceituais: lista de itens (ícone + título + texto curto).
Regras: ícone segue `80`; nenhuma promessa logística não aprovada (R-11).

### CMP-44 — FAQ
Função: perguntas e respostas frequentes por página.
Props conceituais: lista de pares pergunta/resposta · componente acordeão acessível.
Regras: só aparece com 3+ perguntas reais (PT-03); conteúdo sem fonte não é inventado (R-12).

### CMP-45 — CTA institucional
Função: chamada final de conversão (cotação) ao fim de blocos de conteúdo.
Props conceituais: texto · botão primário (CMP-01) · botão secundário WhatsApp (quando aplicável).
Regras: WhatsApp sempre secundário à Lista de Cotação (`50` §5).

## 9. Status e uso

**Escopo (DES-08 / D-059)**: este inventário é o **inventário de referência para a arquitetura
técnica e para a futura etapa de implementação**. Não é escopo de construção da Etapa 4 — a Etapa 4
define arquitetura, contratos, modelo de dados, segurança, dependências e plano de implementação.
A construção dos componentes ocorre em etapa posterior à aprovação da arquitetura técnica.


Todos os componentes listados são propostas conceituais `PENDENTE_DE_APROVAÇÃO` (R-10). A
implementação em código segue este inventário apenas após aprovação explícita; nenhum componente
aqui descrito autoriza, por si, alteração em `src/`.
