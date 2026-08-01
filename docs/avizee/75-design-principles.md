# 75 — Princípios de Design

Status: `PENDENTE_DE_APROVAÇÃO`. Estes princípios orientam todas as decisões visuais das etapas
74 a 94 e devem ser citados nas justificativas de `76` a `94`. Derivam de `02`, `05`, `06`, `10`
e `47`.

Cada princípio traz: enunciado, motivo, implicação de interface, antipadrão a evitar.

---

## P-01 — Clareza técnica acima de estética

**Enunciado**: quando clareza técnica e refinamento estético entram em conflito, a clareza
técnica vence.

**Motivo**: o público (`06-personas-and-audiences.md`) é comprador técnico B2B — veterinário,
encarregado de granja, comprador de insumo — decidindo com base em especificação, não em
impressão de marca. Erro de leitura de uma medida ou capacidade tem custo operacional real.

**Implicação de interface**: tabela de variação sempre visível e legível antes de qualquer
elemento decorativo; unidade de medida nunca abreviada de forma ambígua; nenhum dado técnico
reduzido a ícone sem texto de apoio.

**Antipadrão**: comprimir a tabela de variações em carrossel para "ficar mais bonito"; usar
tipografia condensada decorativa em dado numérico; ocultar especificação atrás de "saiba mais"
quando ela cabe na primeira dobra.

---

## P-02 — O código do produto é dado de primeira classe

**Enunciado**: o código AviZee (SKU público) tem o mesmo peso visual e funcional que o nome do
produto, em toda superfície onde o produto aparece.

**Motivo**: o comprador recorrente busca e confirma pedido por código, não por nome comercial
(`48-product-discovery-architecture.md`, `49-search-and-filter-architecture.md`). Confundir ou
esconder o código gera erro de cotação.

**Implicação de interface**: código sempre visível, nunca só ao expandir; busca por código é
caminho de primeira classe, com correspondência exata priorizada; código usa tratamento
tipográfico tabular (`77-typography-system.md`) para não ser confundido (`0`/`O`, `1`/`l`).

**Antipadrão**: mostrar o código apenas em tooltip; usar fonte decorativa no código; permitir que
o código quebre linha de forma que separe letra de número.

---

## P-03 — Cotação sem fricção

**Enunciado**: o caminho entre "encontrei o item" e "está na minha lista de cotação" é o mais
curto possível, sempre disponível, sempre visível.

**Motivo**: a conversão do site é a Lista de Cotação, não a venda (R-08, `50-quotation-journey.md`).
Fricção aqui é a métrica de fracasso mais crítica do projeto.

**Implicação de interface**: botão "Adicionar à lista de cotação" com contraste AA garantido em
toda tela de família e de SKU; contador de itens na lista sempre visível no cabeçalho; WhatsApp
como ação secundária, nunca competindo visualmente com a ação primária.

**Antipadrão**: esconder a ação de cotação atrás de rolagem longa; usar WhatsApp como botão
principal; exigir cadastro antes de montar a lista.

---

## P-04 — Ausência de dado é omissão, não invenção

**Enunciado**: quando uma informação não existe ou não é confiável, a interface a omite. Nunca
preenche com texto genérico, estimativa ou frase de preenchimento.

**Motivo**: regra direta de D-041 e R-12. Inventar peso, capacidade ou aplicação é erro técnico
com consequência comercial e reputacional.

**Implicação de interface**: todo layout de ficha de produto e de tabela de variação precisa
funcionar visualmente com campos ausentes — sem "grid quebrado" quando uma linha tem menos
colunas preenchidas que outra.

**Antipadrão**: campo "descrição" preenchido com "produto de alta qualidade para sua granja";
capacidade estimada por semelhança com outro SKU; texto de aplicação genérico copiado entre
famílias distintas.

---

## P-05 — Imagem nunca mente

**Enunciado**: toda imagem publicada representa fielmente o item, ou é substituída pelo
placeholder oficial. Nenhuma imagem é editada de forma que altere a percepção do produto.

**Motivo**: `09-image-policy.md`, R-05, D-033. Marca de terceiro visível, produto incorreto ou
edição enganosa não são riscos estéticos — são riscos de confiança e de conformidade.

**Implicação de interface**: o placeholder oficial ("Imagem em atualização") é tratado como
estado de primeira classe em todo componente de imagem, com o mesmo cuidado de layout dado à
imagem real; aviso de "imagem ilustrativa" (I-4) sempre visível quando aplicável, nunca em texto
minúsculo de rodapé.

**Antipadrão**: recortar marca de terceiro digitalmente e publicar como se fosse original;
usar imagem de outro SKU da mesma família sem aviso; tratar placeholder como "erro" visual em vez
de estado normal do sistema.

---

## P-06 — Acessibilidade AA é piso, não meta

**Enunciado**: WCAG 2.2 AA é o requisito mínimo de qualquer tela entregue, não um objetivo a
alcançar depois.

**Motivo**: usuário em campo, com luva, sol direto, tela suja ou baixa visão não é exceção — é
uso típico (P-08). `47-page-type-definitions.md` já lista requisitos de acessibilidade
obrigatórios para todo tipo de página.

**Implicação de interface**: contraste calculado antes de aprovar qualquer par de cor
(`78-color-and-contrast-system.md`); foco visível obrigatório em todo elemento interativo; nenhum
estado comunicado só por cor.

**Antipadrão**: aprovar uma paleta de tela sem checar contraste; remover o anel de foco por
estética; usar apenas cor para indicar erro de formulário.

---

## P-07 — Densidade informacional adulta

**Enunciado**: a interface assume um usuário profissional capaz de ler tabela, filtro e
especificação técnica. Simplificação que remove informação relevante para "limpar a tela" é
retrocesso, não refinamento.

**Motivo**: contraste deliberado com estética de e-commerce de consumo massivo (R-05, direção
visual em `10-brand-guidelines.md`: "usos inadequados — estética de marketplace"). O comprador
técnico prefere mais dado organizado a menos dado bonito.

**Implicação de interface**: tabela de variações completa por padrão no desktop, não escondida
atrás de acordeão; filtros com contagem de resultados visível; especificação técnica em lista
estruturada, não em parágrafo corrido decorativo.

**Antipadrão**: reduzir a ficha técnica a três "destaques" e esconder o resto; substituir tabela
por carrossel de imagens com texto mínimo; usar linguagem de vendas em vez de especificação.

---

## P-08 — Mobile é o dispositivo do galpão, não da sala

**Enunciado**: o uso mobile principal ocorre em ambiente de granja ou campo — luz direta forte
ou sombra profunda, luva ou mão suja, conexão instável ou intermitente, tela pequena segurada com
uma mão.

**Motivo**: personas de `06-personas-and-audiences.md` operam predominantemente em campo, não em
escritório. Ignorar essa condição é assumir um contexto de uso que não existe para o público
real.

**Implicação de interface**: alvo de toque mínimo 44×44px; contraste reforçado além do mínimo AA
em textos críticos de ação; estados de carregamento e erro de rede explícitos e recuperáveis;
formulário curto, com autopreenchimento e sem exigência de digitação fina; interface funcional
com JavaScript degradado quando a conexão cair no meio do carregamento.

**Antipadrão**: texto pequeno com contraste no limiar mínimo; ação que depende de gesto preciso
(arrastar, pressionar e segurar); tela que trava sem feedback quando a rede cai; dependência de
paleta de cor viva sob luz solar direta sem teste de legibilidade.

---

## P-09 — Nenhum grafismo novo, nenhuma cor nova

**Enunciado**: o sistema visual usa exclusivamente os quatro elementos da paleta oficial, a
tipografia Montserrat convencional e o vocabulário gráfico já existente no branding. Nenhuma
etapa de design cria elemento visual novo sem aprovação expressa.

**Motivo**: D-031, D-032, R-06, R-07 — regras não negociáveis, não preferências de estilo.

**Implicação de interface**: toda decisão de cor remete a um dos quatro tons oficiais ou a um
neutro matematicamente derivado deles (`76-design-tokens.md`); todo uso do padrão secundário
segue estritamente os limites de D-032 (subordinado ao logotipo, nunca como novo ícone).

**Antipadrão**: criar um ícone customizado com estilo próprio "inspirado" na marca; introduzir
uma quinta cor "neutra" fora da derivação documentada; usar Montserrat Alternates em um título
"só para dar destaque".

---

## P-10 — Toda proposta nasce pendente

**Enunciado**: nenhum artefato desta etapa é tratado como aprovado só por estar documentado. Todo
token, componente ou wireframe carrega o status `PENDENTE_DE_APROVAÇÃO` até manifestação
explícita do usuário.

**Motivo**: R-10, R-13. Design sem esse selo tende a ser implementado por atalho, pulando a
aprovação.

**Implicação de interface**: cabeçalho de cada documento de 74 a 94 declara o status; qualquer
protótipo entregue exibe aviso "protótipo interno — não publicado".

**Antipadrão**: tratar um wireframe aprovado internamente pela equipe de design como suficiente
para iniciar implementação em `src/`.
