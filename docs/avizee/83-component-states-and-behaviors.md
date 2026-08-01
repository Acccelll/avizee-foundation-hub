# 83 — Estados e Comportamentos dos Componentes

Status: `APROVADO` (Etapa 3 aprovada com ajustes em 2026-08-01; ver `93`). Aprovação conceitual — não autoriza implementação. Complementa `82-component-inventory.md`, detalhando estados de
interação e estados de conteúdo, conforme `47-page-type-definitions.md` (acessibilidade),
`49-search-and-filter-architecture.md` (estados de busca) e `50-quotation-journey.md` (estados
de cotação). Nenhum estado descrito aqui revela ou simula produto pendente.

## 1. Estados de interação (aplicáveis por componente)

Todo componente interativo (CMP-01 a CMP-30, exceto os puramente exibitivos) é especificado
para os seguintes estados, quando aplicáveis à sua natureza:

| Estado | Definição | Regra visual |
|---|---|---|
| Default | Estado de repouso | Cores da paleta oficial, sem decoração |
| Hover | Ponteiro sobre o elemento (dispositivos com mouse) | Alteração sutil de cor/contraste dentro da paleta, sem sombra |
| Focus visível | Elemento recebeu foco via teclado ou leitor de tela | Contorno de foco sempre visível, nunca removido (`outline: none` sem substituto é proibido) |
| Active | Elemento pressionado/acionado | Alteração momentânea de cor dentro da paleta |
| Disabled | Ação indisponível no momento | Contraste reduzido, `aria-disabled`, não recebe foco por tab quando totalmente inoperante |
| Loading | Processamento em andamento | Rótulo textual do estado ("Enviando…") + bloqueio de reenvio; usa CMP-10/CMP-41 |
| Error | Falha de validação ou de operação | Texto de erro associado ao campo/ação, nunca só cor; foco movido ao primeiro erro |
| Empty | Ausência de conteúdo a exibir | Usa CMP-39, texto explicativo e saída acionável |
| Selected | Elemento marcado como escolhido (variação, filtro, aba) | Indicação visual e semântica (`aria-selected`/`aria-checked`), nunca só cor |

Regra transversal: nenhum estado é comunicado exclusivamente por cor. Todo estado com
significado (erro, selecionado, desabilitado) tem reforço textual ou de ícone com rótulo
acessível.

## 2. Estados de conteúdo (regra de não revelação)

Estes estados tratam a fronteira entre o catálogo publicável e o que está fora de escopo
(famílias pendentes, SKUs sem identidade, SKUs sem nome público, itens em rascunho ou
bloqueados por divergência). Regra geral vinculante: **nenhum destes estados exibe nome,
código, imagem, especificação ou qualquer indício de existência de um item pendente**. A
interface trata o item pendente como se não existisse.

### 2.1 Item em revisão
Contexto: um item passou por validação interna e está temporariamente fora da listagem
enquanto aguarda confirmação (ex.: divergência de dado sendo checada).
Comportamento: o item simplesmente não aparece em grade, busca, filtro ou tabela de variações.
Não há rótulo "em revisão" visível ao público. Se o usuário chegar por link direto/código, o
comportamento é o de "item não encontrado" (2.4), nunca uma mensagem que indique revisão em
andamento.

### 2.2 Produto indisponível
Regra vinculante (`49` §4): o vocabulário "indisponível" **não é usado** para produto/variação
pendente, pois sugere controle de estoque, que o site não pratica (R-03). Quando um item
existente e publicado deixa de estar disponível para cotação (ex.: removido do catálogo após
ter sido adicionado por um usuário à lista), o item da lista de cotação (CMP-29) é marcado como
"não disponível para cotação" (`50` §2), mantendo referência e nome já conhecidos pelo usuário,
sem impedir o envio dos demais itens da lista. Este é o único contexto em que o termo
"disponibilidade" aparece, e apenas dentro da lista de cotação já iniciada pelo próprio usuário,
nunca no catálogo público para um item nunca publicado.

### 2.3 Produto sem imagem
Comportamento: aparece normalmente, nunca despriorizado em ordenação ou busca (D-050, R-09),
com o placeholder oficial (`81-image-and-placeholder-specification.md`) ocupando o espaço da
imagem. Não é tratado como um estado de "erro" ou "problema"; é um estado normal do catálogo.

### 2.4 Item não encontrado
Contexto: busca por código, nome ou URL direta que não corresponde a nenhum item publicado —
seja porque o item nunca existiu, está em rascunho, está em revisão ou foi bloqueado por
divergência (2.5). Todos esses casos convergem para o mesmo comportamento público.
Comportamento: mensagem "Não localizamos a referência [X]" + sugestão de famílias do mesmo
prefixo (quando aplicável) + CTA de consulta direta (`49` §4). Nunca diferencia, para o público,
entre "nunca existiu", "está em rascunho" e "está bloqueado" — a resposta é idêntica em todos os
casos, para não vazar informação sobre o catálogo interno.

### 2.5 SKU bloqueado (por divergência)
Comportamento: idêntico ao item não encontrado (2.4), sem qualquer sinalização pública adicional
(AG005/AG022, `49` §4). Internamente o bloqueio é registrado e rastreável (R-13), mas nenhuma
rota, mensagem, atributo de acessibilidade ou dado estruturado público distingue esse SKU de um
código que nunca existiu.

### 2.6 Conteúdo pendente
Contexto: uma família, SKU, artigo ou dado (ex.: especificação, imagem, dado institucional
marcado `DADO_PENDENTE`) ainda não está aprovado para publicação.
Comportamento: o campo/atributo pendente é omitido da interface (D-041) em vez de preenchido
com texto genérico ("em breve", "consulte-nos" fora de contexto, "a confirmar"); o item inteiro
(família/SKU/artigo) pendente não é listado, seguindo o mesmo princípio de 2.1 e 2.4.

## 3. Comportamentos de teclado e foco

- Toda ação disponível ao mouse tem equivalente por teclado (Tab, Shift+Tab, Enter, Espaço,
  Setas em grupos de rádio/tabs, Esc para fechar modal/drawer).
- Ordem de tabulação segue a ordem visual e lógica do conteúdo; nenhum componente cria uma
  armadilha de foco (focus trap) fora de modal/drawer explicitamente aberto.
- Modal e drawer (CMP-28) prendem o foco enquanto abertos e retornam o foco ao elemento que os
  acionou ao fechar (`47` "Acessibilidade").
- Foco visível é obrigatório em todo elemento interativo, com contraste suficiente sobre fundo
  Creme, Preto, Vinho e Terracota; nunca é removido via CSS sem substituto equivalente.
- Erro de formulário move o foco para o primeiro campo inválido ao tentar enviar (`47`, `50` §2).
- "Pular para o conteúdo" é o primeiro elemento focável de toda página (`47` "Acessibilidade").
- Seletor de variação (CMP-06/CMP-23) responde a setas dentro do grupo, com `Home`/`End` para
  primeiro/último item, seguindo o padrão de grupo de rádio acessível.

## 4. Anúncio para leitor de tela

| Situação | Comportamento de anúncio |
|---|---|
| Resultado de busca atualizado | Região `aria-live="polite"` anuncia a contagem de resultados (`47`) |
| Item adicionado à lista de cotação | Anúncio `aria-live="polite"` com o texto do toast (CMP-38) |
| Erro de formulário no envio | Anúncio `aria-live="assertive"` resumindo a quantidade de erros, além do foco no primeiro campo |
| Filtro aplicado/removido | Anúncio `aria-live="polite"` com o novo total de resultados |
| Estado de carregamento iniciado/concluído | Anúncio textual do início e fim do carregamento, não apenas indicação visual |
| Modal/drawer aberto | Título do modal anunciado ao receber foco automático |
| Item não encontrado / sem correspondência | Anúncio da mensagem de estado vazio, não apenas exibição visual |

Nenhuma região `aria-live` anuncia informação sobre item pendente, em revisão ou bloqueado além
da mensagem pública padrão de "não encontrado" (2.4/2.5); o anúncio para leitor de tela segue a
mesma regra de não revelação aplicada visualmente.

## 5. Transições

- Transições visuais são discretas e funcionais (aparecer/desaparecer, expandir/recolher),
  nunca decorativas, coerentes com a direção visual "sem gradientes, sombras e efeitos" (`10`).
- Duração curta (na ordem de 150–250ms) para não atrasar a percepção de resposta em ações
  críticas (adicionar à cotação, aplicar filtro, abrir modal).
- Toast (CMP-38) entra e sai com transição simples de opacidade/posição, sem sobrepor conteúdo
  interativo por tempo suficiente para atrapalhar a leitura.
- Skeleton (CMP-10) é substituído pelo conteúdo final sem "salto" de layout (dimensões
  reservadas antecipadamente, coerente com `81` §6 sobre CLS).
- Transição nunca é usada para simular carregamento de dado que não existe (ex.: skeleton
  indefinido para um item que na verdade está bloqueado): quando o item não será exibido, o
  fluxo vai direto ao estado "não encontrado" (2.4), sem etapa intermediária enganosa.
- Respeita a preferência do sistema por movimento reduzido (`prefers-reduced-motion`),
  suprimindo transições não essenciais quando ativada.

## 6. Status

Documento `PENDENTE_DE_APROVAÇÃO` (R-10). Aplica-se apenas ao escopo de 31 famílias e 97 SKUs
aprovados; qualquer referência a item fora deste escopo em implementação futura deve seguir os
estados de "não encontrado" (2.4) e "conteúdo pendente" (2.6) descritos aqui.
