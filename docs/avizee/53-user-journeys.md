# 53 — Jornadas de Usuário

Status: `PENDENTE_DE_APROVAÇÃO` · Dados: `data/user-journeys.csv`
Eventos de análise listados como **futuros** (O-15 em aberto): nada é instrumentado agora.

## J-1 — Comprador com código ("Preciso do AG011")
Origem: acesso direto ou Google. Intenção: recompra rápida.
Caminho: Home ou `/produtos` → busca "AG011" → família Agulha inox com `?sku=AG011` →
quantidade → adicionar → repetir → `/cotacao` → enviar.
Dados: referência, quantidade, contato. CTA: Adicionar à lista.
Erros: código inexistente · código de item bloqueado (AG005/AG022) · confusão entre códigos
próximos. Resultado: cotação com múltiplos itens. Eventos futuros: `busca_codigo`,
`item_adicionado`, `cotacao_enviada`.

## J-2 — Conhece o produto ("agulha inox 10 × 10")
Caminho: busca por termo → família → seletor de medida → adicionar.
Fricção principal: nome público normalizado (D-035) pode não bater com o vocabulário do cliente.
Mitigação: dicionário de sinônimos neutros (`49` §2).

## J-3 — Conhece só a aplicação ("itens para vacinação")
Caminho: menu Soluções → `/solucoes/vacinacao` → categorias e famílias → família → adicionar.
Fricção: aplicação não confirmada por SKU (RK-18) — a solução depende de curadoria manual na v1.

## J-4 — Manutenção, sem saber o nome ("tenho essa conexão")
Caminho: `/produtos/pecas-reposicao-e-automacao` → filtro visual por família → comparação por
imagem → se não achar, "Não encontrou?" → WhatsApp com foto ou formulário com anexo.
Maior fricção do projeto: 22 SKUs `CN` sem imagem e sem atributo. Mitigação de v1: caminho de
consulta assistida sempre visível nessa categoria.

## J-5 — Gestor de incubatório ("ovoscopia e controle")
Caminho: Soluções → Incubação e ovoscopia (se publicada) ou `/produtos/pesagem-medicao-e-controle`
→ famílias → conteúdo de apoio → cotação consultiva com mensagem.

## J-6 — Vindo do Google por artigo
Origem: orgânica. Caminho: artigo → bloco "Produtos citados" → família → adicionar ou WhatsApp.
Requisito arquitetural: todo artigo precisa de ao menos uma família relacionada `CONFIRMADA`,
senão vira beco sem saída.

## J-7 — Vindo do Instagram ou LinkedIn
Origem: social, alta taxa de saída. Caminho: link direto para a **família** (nunca para a Home) →
adicionar ou WhatsApp. Requisito: cada post tem URL-alvo definida; parâmetros `utm_*` não
indexáveis.

## J-8 — Não encontrou o item
Caminho: busca sem resultado → "Não encontrou o que procura?" → formulário curto (descrição,
foto, referência do concorrente em campo interno) ou WhatsApp. Resultado: oportunidade registrada
mesmo sem SKU — alimenta o backlog de catálogo. Regra: a referência de terceiro informada pelo
cliente é dado **interno**, nunca publicada (R-05).

## J-9 — Usuário mobile (transversal)
Ações: buscar, comparar, adicionar, enviar. Fricções: tabela de variações larga, filtro ocupando
tela, formulário longo, digitação de código. Mitigações arquiteturais: tabela em cartões, filtro
em painel com "aplicar", barra inferior persistente com contador, teclado adequado por campo,
autocomplete tolerante, WhatsApp a um toque.

## Jornada bloqueada nesta etapa
Comparação lado a lado entre variações de famílias diferentes: `EVOLUÇÃO` — depende de atributo
normalizado (RK-18).
