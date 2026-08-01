# 84 — Wireframes das Páginas Públicas

Status: `PENDENTE_DE_APROVAÇÃO`. Wireframes de estrutura (baixa fidelidade), sem cor final e sem
tipografia aplicada — a aplicação visual está em `85-public-page-prototypes.md`. Este documento
cobre todos os tipos de página definidos em `47-page-type-definitions.md`, respeitando o sitemap
de `42`, o modelo de navegação de `44`, a descoberta de produto de `48`, a busca de `49`, a
jornada de cotação de `50` e os requisitos de mobile de `54`.

Convenção dos wireframes: caixas ASCII representam blocos, não componentes visuais definitivos.
`[CTA]` indica ação primária; `(cta)` indica ação secundária; `···` indica repetição de item.
Nenhum wireframe contém preço, prazo, carrinho, checkout ou marca de terceiro — essas exclusões
não são redesenhadas em cada bloco porque são regra fixa do projeto (`02-non-negotiable-rules.md`).

Exemplos de conteúdo usam apenas famílias aprovadas: Agulhas descartáveis, Seringas automáticas
de fluxo contínuo, Balanças eletrônicas para aves, Bebedouros pendulares para aves, Termômetros,
Bicos pulverizadores.

---

## PT-01 — Home

**Objetivo**: apresentar a AviZee como especialista em avicultura, orientar para os três caminhos
de entrada (busca, categoria, solução) e converter em Lista de cotação.

**Hierarquia de blocos** (ordem fixa, conforme `47`):
1. Header + proposta de valor + CTA duplo
2. Busca por nome ou código
3. As 6 categorias
4. Soluções por necessidade
5. Diferenciais (variedade especializada, agilidade, atendimento consultivo)
6. Famílias em destaque (curadoria manual, só aparece com ≥ 4 famílias publicáveis)
7. Como funciona a cotação (3 passos)
8. Conteúdos recentes
9. Atendimento em todo o Brasil
10. CTA final
11. Footer

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [logo]     Produtos  Soluções  Conteúdos  Sobre  Contato   🔍  [Cotação·0]│
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ESPECIALISTA EM EQUIPAMENTOS PARA AVICULTURA                           │
│   Texto curto de posicionamento (05-business-positioning)                │
│                                                                            │
│   [ Ver produtos ]        ( Solicitar cotação )                          │
│                                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│   🔍  Buscar por nome ou código (ex.: AG011)                    [Buscar] │
├──────────────────────────────────────────────────────────────────────────┤
│   NOSSAS CATEGORIAS                                                       │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│   │Categ. 1│ │Categ. 2│ │Categ. 3│ │Categ. 4│ │Categ. 5│ │Categ. 6│      │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘      │
├──────────────────────────────────────────────────────────────────────────┤
│   SOLUÇÕES POR NECESSIDADE                                                │
│   [ Vacinação ]  [ Pulverização ]  [ Pesagem e medição ]  ···            │
├──────────────────────────────────────────────────────────────────────────┤
│   POR QUE A AVIZEE                                                        │
│   ( ícone ) Variedade      ( ícone ) Agilidade    ( ícone ) Consultivo    │
├──────────────────────────────────────────────────────────────────────────┤
│   FAMÍLIAS EM DESTAQUE               (bloco oculto se < 4 famílias)      │
│   ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐               │
│   │ Agulhas   │ │ Seringas  │ │ Balanças  │ │ Bebedouros│               │
│   │ descart.  │ │ automát.  │ │ eletrôn.  │ │ pendulares│               │
│   └───────────┘ └───────────┘ └───────────┘ └───────────┘               │
├──────────────────────────────────────────────────────────────────────────┤
│   COMO FUNCIONA A COTAÇÃO                                                 │
│   1 Escolha os itens → 2 Monte sua lista → 3 Envie e receba retorno      │
├──────────────────────────────────────────────────────────────────────────┤
│   CONTEÚDOS RECENTES                                                      │
│   [ artigo 1 ]   [ artigo 2 ]   [ artigo 3 ]           ( Ver todos )     │
├──────────────────────────────────────────────────────────────────────────┤
│   ATENDIMENTO EM TODO O BRASIL — texto curto                             │
├──────────────────────────────────────────────────────────────────────────┤
│   Pronto para montar sua cotação?          [ Solicitar cotação ]         │
├──────────────────────────────────────────────────────────────────────────┤
│ FOOTER: institucional · produtos · soluções · conteúdos · atendimento ·  │
│ legal · redes · copyright                                                │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [logo]   🔍  [🛒·0]   ☰    │
├────────────────────────────┤
│ ESPECIALISTA EM AVICULTURA │
│ texto curto                │
│ [ Ver produtos ]            │
│ ( Solicitar cotação )       │
├────────────────────────────┤
│ 🔍 Buscar nome ou código    │
├────────────────────────────┤
│ CATEGORIAS                  │
│ [ Categ.1 ] [ Categ.2 ]     │
│ [ Categ.3 ] [ Categ.4 ]     │
│ [ Categ.5 ] [ Categ.6 ]     │
├────────────────────────────┤
│ SOLUÇÕES                    │
│ [ Vacinação ]                │
│ [ Pulverização ]             │
│ [ Pesagem e medição ]        │
├────────────────────────────┤
│ POR QUE A AVIZEE             │
│ Variedade                    │
│ Agilidade                    │
│ Consultivo                   │
├────────────────────────────┤
│ FAMÍLIAS EM DESTAQUE         │
│ [ Agulhas descartáveis ]     │
│ [ Seringas automáticas ]     │
│ ···  (carrossel horizontal)  │
├────────────────────────────┤
│ COMO FUNCIONA A COTAÇÃO      │
│ 1 · 2 · 3 (empilhado)        │
├────────────────────────────┤
│ CONTEÚDOS RECENTES           │
│ [ artigo 1 ]                 │
│ [ artigo 2 ]                 │
├────────────────────────────┤
│ ATENDIMENTO NACIONAL         │
├────────────────────────────┤
│ [ Solicitar cotação ]        │
├────────────────────────────┤
│ FOOTER em acordeão           │
└────────────────────────────┘
```

**CTAs**: "Ver produtos" (primário) · "Solicitar cotação" (primário, repetido) · CTAs de solução
(secundários) · "Ver todos" conteúdos (secundário).

**Nunca aparece**: preço, prazo de entrega, estoque, marca de terceiro, depoimento não aprovado,
contador de vendas, selo de urgência, carrossel de banners promocionais sem curadoria.

---

## PT-02 — Produtos (catálogo, `/produtos`)

**Objetivo**: permitir exploração e filtragem do catálogo completo por categoria, sem hierarquia
de preço, culminando em famílias.

**Hierarquia de blocos**: introdução curta · busca · categorias · filtros gerais (`49` §5) ·
contador de resultados · ordenação (relevância · nome · categoria) · grade de cards de família ·
paginação acessível · estado sem resultado · CTA de cotação persistente.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ Início › Produtos                                                         │
│ NOSSOS PRODUTOS — introdução curta (2-3 linhas)                          │
├───────────────┬────────────────────────────────────────────────────────┤
│ FILTROS        │ 🔍 Buscar nesta lista        Ordenar: [Relevância ▾]   │
│ ▸ Categoria    │ 24 resultados                                          │
│  [ ] Categ.1   ├─────────────────────────────────────────────────────── │
│  [ ] Categ.2   │ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│  ···           │ │ imagem    │ │ imagem    │ │ imagem    │              │
│ ▸ Família      │ │ Agulhas   │ │ Seringas  │ │ Balanças  │              │
│  (por categ.)  │ │ descart.  │ │ automát.  │ │ eletrôn.  │              │
│ ▸ Aplicação*   │ │ Categ. X  │ │ Categ. X  │ │ Categ. X  │              │
│  (condicional) │ │ 5 variaç. │ │ 3 variaç. │ │ 4 variaç. │              │
│                │ └───────────┘ └───────────┘ └───────────┘              │
│ [Limpar        │ ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│  filtros]      │ │ ···       │ │ ···       │ │ ···       │              │
│                │ └───────────┘ └───────────┘ └───────────┘              │
│                │              [ Carregar mais ]                         │
│                │        ( Ir para a página 2 — fallback acessível )     │
├───────────────┴────────────────────────────────────────────────────────┤
│ Não encontrou o que procura?           ( Fale com um especialista )     │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
   ▲ barra de cotação persistente flutua no canto quando há itens na lista
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header compacto]           │
│ Início › Produtos           │
│ NOSSOS PRODUTOS             │
│ introdução curta            │
├────────────────────────────┤
│ 🔍 Buscar nesta lista        │
│ [ Filtros (2) ]  [Ordenar▾] │  ← abre drawer, ver 87
├────────────────────────────┤
│ 24 resultados                │
│ ┌──────────────────────────┐│
│ │ imagem                    ││
│ │ Agulhas descartáveis      ││
│ │ Categoria X · 5 variações ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ ···                       ││
│ └──────────────────────────┘│
│ [ Carregar mais ]            │
├────────────────────────────┤
│ Não encontrou o que procura? │
│ ( Fale com um especialista ) │
├────────────────────────────┤
│ [footer acordeão]            │
├────────────────────────────┤
│ ▓ N itens · Solicitar cotação│ ← barra inferior persistente (se houver itens)
└────────────────────────────┘
```

**CTAs**: "Fale com um especialista" (estado vazio) · CTA de cotação persistente · cards levam à
Família.

**Nunca aparece**: preço, ordenação por preço, disponibilidade/estoque, marca no card, badge de
"mais vendido", SKU bloqueado ou em rascunho.

---

## PT-03 — Categoria (`/produtos/{categoria}`)

**Objetivo**: apresentar uma das 6 categorias com contexto próprio, evitando página fina (sem
descrição própria, não indexa — regra `55`).

**Hierarquia de blocos**: nome · descrição própria (2-4 parágrafos) · aplicações da categoria ·
famílias da categoria · soluções relacionadas · artigos relacionados · CTA de cotação · FAQ
(condicional, só com 3+ perguntas reais).

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Produtos › {Categoria}                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ {NOME DA CATEGORIA}                                                       │
│ Descrição própria da categoria — 2 a 4 parágrafos de contexto técnico    │
│ e aplicação, sem repetir o catálogo.                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ APLICAÇÕES DESTA CATEGORIA                                                │
│ [ Vacinação ]  [ Pulverização ]  ···                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ FAMÍLIAS                                             Ordenar: [Nome ▾]   │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                 │
│ │ Agulhas   │ │ Termôm.   │ │ ···       │ │ ···       │                 │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘                 │
├──────────────────────────────────────────────────────────────────────────┤
│ SOLUÇÕES RELACIONADAS         │ ARTIGOS RELACIONADOS                     │
│ [ Vacinação ]                  │ [ artigo 1 ]  [ artigo 2 ]              │
├──────────────────────────────────────────────────────────────────────────┤
│ PERGUNTAS FREQUENTES (condicional, ≥ 3 perguntas)                        │
│ ▸ Pergunta 1     ▸ Pergunta 2     ▸ Pergunta 3                           │
├──────────────────────────────────────────────────────────────────────────┤
│ Precisa de ajuda para escolher?         [ Solicitar cotação ]            │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header]                     │
│ ‹ Produtos                   │
│ {NOME DA CATEGORIA}          │
│ descrição própria            │
├────────────────────────────┤
│ APLICAÇÕES                   │
│ [Vacinação] [Pulverização]   │
├────────────────────────────┤
│ FAMÍLIAS                     │
│ [ Agulhas ]                  │
│ [ Termômetros ]              │
│ ···                          │
├────────────────────────────┤
│ SOLUÇÕES RELACIONADAS        │
│ ARTIGOS RELACIONADOS         │
├────────────────────────────┤
│ FAQ (acordeão)                │
├────────────────────────────┤
│ [ Solicitar cotação ]         │
├────────────────────────────┤
│ [footer]                      │
└────────────────────────────┘
```

**CTAs**: "Solicitar cotação" · cards de família e solução levam às respectivas páginas.

**Nunca aparece**: descrição genérica copiada de outra categoria, FAQ com menos de 3 perguntas
reais, preço, marca.

---

## PT-04 — Solução (`/solucoes/{slug}`)

**Objetivo**: organizar a oferta por problema do cliente, atravessando categorias, com tom
consultivo — distinto da Categoria, que organiza por tipo de item (`47`).

**Hierarquia de blocos**: problema/necessidade em linguagem do cliente · contexto e boas práticas
· o que costuma ser necessário (categorias e famílias curadas) · artigos · CTA consultivo duplo.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Soluções › {Solução}                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ {SOLUÇÃO EM LINGUAGEM DO CLIENTE — ex.: "Vacinação"}                     │
│ Contexto e boas práticas — parágrafos explicando o problema real         │
├──────────────────────────────────────────────────────────────────────────┤
│ O QUE COSTUMA SER NECESSÁRIO                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                                │
│ │ Agulhas   │ │ Seringas  │ │ ···       │   (famílias curadas, podem     │
│ │ descart.  │ │ automát.  │ │           │    vir de categorias distintas)│
│ └───────────┘ └───────────┘ └───────────┘                                │
├──────────────────────────────────────────────────────────────────────────┤
│ CONTEÚDOS SOBRE {SOLUÇÃO}                                                 │
│ [ artigo 1 ]   [ artigo 2 ]                                              │
├──────────────────────────────────────────────────────────────────────────┤
│ Precisa de orientação técnica?                                           │
│ [ Fale com um especialista ]      ( Solicitar cotação )                  │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header]                     │
│ ‹ Soluções                   │
│ {SOLUÇÃO}                    │
│ contexto e boas práticas     │
├────────────────────────────┤
│ O QUE COSTUMA SER NECESSÁRIO │
│ [ Agulhas descartáveis ]     │
│ [ Seringas automáticas ]     │
├────────────────────────────┤
│ CONTEÚDOS                    │
│ [ artigo 1 ]                 │
├────────────────────────────┤
│ [ Fale com um especialista ] │
│ ( Solicitar cotação )        │
├────────────────────────────┤
│ [footer]                      │
└────────────────────────────┘
```

**CTAs**: "Fale com um especialista" (primário, tom consultivo) · "Solicitar cotação" (secundário
nesta página, pois o tom é consultivo antes de comercial).

**Nunca aparece**: listagem completa de categoria (a solução é curadoria, não índice), preço,
prazo, promessa de resultado técnico não comprovado.

---

## PT-05 — Família (página canônica do produto, `/produtos/{categoria}/{familia}`)

**Objetivo**: página de conversão principal do catálogo — apresenta a família, permite selecionar
variação e adicionar à Lista de cotação.

**Hierarquia de blocos**: breadcrumb · nome funcional · imagem principal (com aviso "imagem
ilustrativa" quando aplicável) ou placeholder oficial · descrição · seletor de variação · tabela
de variações · especificações comuns · especificações variáveis · aplicações · documentos
(condicional) · produtos complementares · conteúdos relacionados · CTA "Adicionar à lista de
cotação" + WhatsApp secundário.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Produtos › {Categoria} › Agulhas descartáveis                   │
├───────────────────────────────┬──────────────────────────────────────────┤
│                                │ Agulhas descartáveis                     │
│      [ imagem principal ]      │ * imagem ilustrativa (quando aplicável) │
│      "imagem ilustrativa"      │                                          │
│      ou placeholder oficial    │ Descrição funcional da família —        │
│                                │ 2 a 3 parágrafos.                        │
│                                │                                          │
│                                │ SELECIONE A VARIAÇÃO                     │
│                                │ ( ) 10 x 10   ( ) 12 x 12   ( ) 15 x 15  │
│                                │                                          │
│                                │ Quantidade: [   12   ]                   │
│                                │                                          │
│                                │ [ Adicionar à lista de cotação ]         │
│                                │ ( Falar no WhatsApp sobre este item )    │
├───────────────────────────────┴──────────────────────────────────────────┤
│ TABELA DE VARIAÇÕES                                                       │
│ ┌──────────┬───────────────┬────────┬────────────┬──────────┐            │
│ │Referência│ Medida         │Unidade │ Quantidade │  Ação    │            │
│ ├──────────┼───────────────┼────────┼────────────┼──────────┤            │
│ │ AG010    │ 10 x 10        │ cx 100 │ [  ]        │ [Add]    │            │
│ │ AG011    │ 12 x 12        │ cx 100 │ [  ]        │ [Add]    │            │
│ │ AG012    │ 15 x 15        │ cx 100 │ [  ]        │ [Add]    │            │
│ └──────────┴───────────────┴────────┴────────────┴──────────┘            │
├──────────────────────────────────────────────────────────────────────────┤
│ ESPECIFICAÇÕES COMUNS         │ ESPECIFICAÇÕES VARIÁVEIS (por variação)  │
├──────────────────────────────────────────────────────────────────────────┤
│ APLICAÇÕES: [ Vacinação ]                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ DOCUMENTOS (condicional — omitido se não houver)                         │
├──────────────────────────────────────────────────────────────────────────┤
│ VOCÊ TAMBÉM PODE PRECISAR                                                 │
│ ┌───────────┐ ┌───────────┐                                              │
│ │ Seringas  │ │ ···       │      (relação declarada, nunca automática)   │
│ └───────────┘ └───────────┘                                              │
├──────────────────────────────────────────────────────────────────────────┤
│ CONTEÚDOS RELACIONADOS                                                    │
│ [ artigo 1 ]                                                              │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header]                     │
│ ‹ {Categoria}                 │
│ [ imagem principal ]          │
│ "imagem ilustrativa"          │
│ Agulhas descartáveis          │
│ descrição curta               │
├────────────────────────────┤
│ SELECIONE A VARIAÇÃO          │
│ ( ) 10x10 ( ) 12x12 ( ) 15x15 │  ← lista rolável, nunca tabela horizontal
│ Quantidade: [ 12 ]             │
│ [ Adicionar à lista ]          │
│ ( WhatsApp sobre este item )   │
├────────────────────────────┤
│ VARIAÇÕES (cartões, não tabela)│
│ ┌──────────────────────────┐ │
│ │ AG011 · 12x12 · cx 100    │ │
│ │ Qtd [  ]      [Adicionar] │ │
│ └──────────────────────────┘ │
│ ···                            │
├────────────────────────────┤
│ ESPECIFICAÇÕES (lista rótulo/  │
│ valor, sem tabela)              │
├────────────────────────────┤
│ APLICAÇÕES                     │
├────────────────────────────┤
│ VOCÊ TAMBÉM PODE PRECISAR       │
│ [ Seringas automáticas ]        │
├────────────────────────────┤
│ CONTEÚDOS RELACIONADOS          │
├────────────────────────────┤
│ [footer]                        │
├────────────────────────────┤
│ ▓ N itens · Solicitar cotação   │ ← barra inferior persistente
└────────────────────────────┘
```

**CTAs**: "Adicionar à lista de cotação" (primário) · WhatsApp sobre o item (secundário).

**Nunca aparece**: preço, prazo de entrega, estoque, variação bloqueada por divergência, campo
técnico vazio preenchido com texto genérico, marca de terceiro no `alt` da imagem.

---

## PT-07 a PT-10 — Central de Conteúdos

Detalhamento estrutural completo em `51-content-hub-architecture.md`. Wireframes:

### PT-07 — Central (`/conteudos`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Conteúdos                                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ CENTRAL DE CONTEÚDOS — introdução curta                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ DESTAQUE                                                                  │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ [imagem]  Como escolher agulha para vacinação                       │  │
│ └────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────┤
│ CATEGORIAS (com contagem, só ≥ 2 artigos)                                 │
│ [ Guias e boas práticas (4) ] [ Vacinação e aplicação (3) ] ···          │
├──────────────────────────────────────────────────────────────────────────┤
│ ÚLTIMOS ARTIGOS                                                           │
│ [ artigo ] [ artigo ] [ artigo ]                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ [ Solicitar cotação ]                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: mesma ordem, colunas viram pilha única; destaque em card único no topo.

### PT-08 — Categoria editorial (`/conteudos/{categoria}`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Início › Conteúdos › {Categoria editorial}                               │
│ {NOME}  — descrição própria                                              │
│ Categorias de produto relacionadas: [ Categ. A ] [ Categ. B ]            │
├──────────────────────────────────────────────────────────────────────────┤
│ ARTIGOS DESTA CATEGORIA                                                   │
│ [ artigo ] [ artigo ] [ artigo ]                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: pilha única, filtro de categoria relacionada vira chips roláveis horizontalmente.

### PT-09 — Artigo (`/conteudos/{categoria}/{artigo}`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Início › Conteúdos › {Categoria} › {Título}                              │
├───────────────────────────────┬──────────────────────────────────────────┤
│ SUMÁRIO (se ≥ 4 seções)        │ {TÍTULO DO ARTIGO}                       │
│ ▸ Seção 1                      │ Autor · Revisor técnico · Data · Tempo   │
│ ▸ Seção 2                      │ de leitura                               │
│ ▸ Seção 3                      │                                           │
│                                │ [ imagem de capa ]                       │
│                                │                                           │
│                                │ Corpo do artigo — seções com h2/h3       │
│                                │                                           │
│                                │ PRODUTOS CITADOS                         │
│                                │ [ Agulhas descartáveis ]                 │
│                                │                                           │
│                                │ Fontes                                    │
│                                │                                           │
│                                │ [ Solicitar cotação ]                    │
│                                │                                           │
│                                │ ARTIGOS RELACIONADOS                      │
├───────────────────────────────┴──────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: sumário recolhido em acordeão no topo; coluna única.

### PT-10 — Autor (`/conteudos/autores/{autor}`, `EVOLUÇÃO`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Início › Conteúdos › Autores › {Nome}                                    │
│ [foto] {Nome} — função/credencial                                        │
│ ARTIGOS DO AUTOR                                                          │
│ [ artigo ] [ artigo ]                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

**CTAs (PT-07 a PT-10)**: "Solicitar cotação" · links de artigo e categoria levam à leitura;
"Produtos citados" leva à Família.

**Nunca aparece**: marca de terceiro no corpo, imagem ou `alt`; promessa comercial; artigo sem
revisor técnico; categoria editorial com menos de 2 artigos listada publicamente.

---

## PT-11 — Busca (`/busca`, `noindex`)

**Objetivo**: resolver as portas de entrada por código, nome e termo genérico (`49`).

**Hierarquia de blocos**: campo de busca · resultados agrupados por tipo (Produtos · Soluções ·
Conteúdos, produtos sempre primeiro) · filtros rápidos · estados (vazio inicial, sem resultado,
código não encontrado, resultado bloqueado tratado como não encontrado).

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│         🔍  [  AG011                                    ] [Buscar]       │
│         Sugestões: AG011 · AG012 · Agulhas descartáveis                  │
├──────────────────────────────────────────────────────────────────────────┤
│ PRODUTOS (3)                                                              │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │ Agulhas descartáveis — variação 12 x 12 (AG011)     [Ver produto]   │   │
│ └───────────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│ SOLUÇÕES (1)                                                              │
│ [ Vacinação ]                                                             │
├──────────────────────────────────────────────────────────────────────────┤
│ CONTEÚDOS (2)                                                             │
│ [ artigo ] [ artigo ]                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ ESTADO — código não encontrado:                                          │
│ "Não localizamos a referência AG099."                                    │
│ Você quis dizer: Agulhas descartáveis (família AG)?                     │
│ ( Fale com um especialista )                                             │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header] busca em tela cheia │
│ 🔍 [ AG011           ]       │
│ Sugestões (até 8, agrupadas) │
├────────────────────────────┤
│ PRODUTOS (3)                 │
│ [ Agulhas — AG011 ]           │
├────────────────────────────┤
│ SOLUÇÕES (1)                  │
├────────────────────────────┤
│ CONTEÚDOS (2)                 │
├────────────────────────────┤
│ estado vazio / não encontrado │
│ ( Fale com um especialista )  │
└────────────────────────────┘
```

**CTAs**: "Fale com um especialista" (estado sem correspondência) · resultado leva à Família,
Solução ou Artigo correspondente.

**Nunca aparece**: resultado por marca de terceiro, redirecionamento por nome de marca, SKU
bloqueado ou em rascunho, indicação de "indisponível" (sugere estoque).

---

## PT-12 — Lista de cotação (`/cotacao`, `noindex`)

**Objetivo**: revisar itens, informar dados de contato e enviar a solicitação — conforme jornada
completa em `50-quotation-journey.md`.

**Hierarquia de blocos**: itens agrupados por família (imagem/placeholder, referência,
quantidade) · edição de quantidade e observação por item · formulário de contato (mesma página,
sem etapas artificiais) · aceite de privacidade · envio.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Lista de cotação                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ SUA LISTA DE COTAÇÃO (4 itens)                                           │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ [img] Agulhas descartáveis — 12 x 12 (AG011)                         │  │
│ │       Qtd: [ 12 ]   Observação: [                    ]   [Remover]   │  │
│ ├────────────────────────────────────────────────────────────────────┤  │
│ │ [img] Balanças eletrônicas para aves — 5 kg (BA003)                  │  │
│ │       Qtd: [ 2 ]    Observação: [                    ]   [Remover]   │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│ ( Continue sua cotação → volta à última categoria )                     │
├──────────────────────────────────────────────────────────────────────────┤
│ SEUS DADOS                                                                │
│ Nome*        [                    ]   Empresa*  [                    ]  │
│ E-mail*      [                    ]   Telefone/WhatsApp* [            ] │
│ Cidade*      [                    ]   Estado*   [ UF ▾ ]                │
│ CNPJ         [                    ]   Cargo/setor [                  ]  │
│ Mensagem     [                                              ]           │
│ [ ] Li e aceito a Política de Privacidade*                              │
│                                                                            │
│                                    [ Enviar solicitação de cotação ]     │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Estado vazio (sem itens):

```text
│ Sua lista de cotação está vazia.                                         │
│ Adicione itens navegando pelo catálogo.                                  │
│ [ Ver produtos ]                                                          │
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header]                     │
│ SUA LISTA (4 itens)           │
│ ┌──────────────────────────┐ │
│ │[img] Agulhas — 12x12       │ │
│ │ Qtd [12]  Obs [        ]   │ │
│ │ [Remover]                   │ │
│ └──────────────────────────┘ │
│ ···                            │
├────────────────────────────┤
│ SEUS DADOS (um campo/linha)   │
│ Nome*        [            ]  │
│ Empresa*     [            ]  │
│ E-mail*      [            ]  │
│ Telefone*    [            ]  │
│ Cidade*      [            ]  │
│ Estado*      [   UF ▾    ]  │
│ CNPJ         [            ]  │
│ Cargo/setor  [            ]  │
│ Mensagem     [            ]  │
│ [ ] Aceito a Política*        │
│ [ Enviar solicitação ]        │
├────────────────────────────┤
│ [footer]                      │
└────────────────────────────┘
```

**CTAs**: "Enviar solicitação de cotação" (primário) · "Ver produtos" (estado vazio) · "Continue
sua cotação" (secundário).

**Nunca aparece**: preço, subtotal, forma de pagamento, prazo de entrega, botão "finalizar
compra", campo de endereço completo.

## PT-13 — Confirmação (`/cotacao/enviada`, `noindex`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│                     ✓ Solicitação enviada com sucesso                    │
│                     Protocolo: {PROTOCOLO}                               │
│                                                                            │
│                     Resumo: 4 itens · dados de contato confirmados      │
│                     Nossa equipe entrará em contato pelos canais         │
│                     informados. Sem promessa de prazo.                   │
│                                                                            │
│                     [ Voltar ao catálogo ]   ( Falar no WhatsApp )       │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: mesmo conteúdo, empilhado, sem colunas.

**CTAs**: "Voltar ao catálogo" (primário) · WhatsApp (secundário).

**Nunca aparece**: prazo de entrega prometido, valor estimado, status de pedido.

---

## PT-14 — Sobre (`/sobre`)

**Objetivo**: apresentar a AviZee institucionalmente, sem dado não confirmado.

**Hierarquia de blocos**: quem é a AviZee · especialização em avicultura · públicos atendidos ·
abrangência nacional · forma de atendimento (consultiva) · diferenciais · segmentos
complementares · missão, visão e valores. Sem história, fundação ou números não confirmados.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Sobre                                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ SOBRE A AVIZEE                                                            │
│ Texto institucional — quem somos, especialização em avicultura           │
├──────────────────────────────────────────────────────────────────────────┤
│ PÚBLICOS ATENDIDOS      │ ABRANGÊNCIA NACIONAL                            │
├──────────────────────────────────────────────────────────────────────────┤
│ COMO ATENDEMOS — consultivo, não transacional                            │
├──────────────────────────────────────────────────────────────────────────┤
│ DIFERENCIAIS                                                              │
│ Variedade · Agilidade · Consultivo                                       │
├──────────────────────────────────────────────────────────────────────────┤
│ SEGMENTOS COMPLEMENTARES — bovinocultura, suinocultura sob consulta      │
├──────────────────────────────────────────────────────────────────────────┤
│ MISSÃO · VISÃO · VALORES                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ [ Solicitar cotação ]                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: pilha única, mesma ordem.

**CTAs**: "Solicitar cotação" (único, ao final).

**Nunca aparece**: ano de fundação, número de clientes, faturamento ou qualquer estatística sem
fonte aprovada (`DADO_PENDENTE`).

---

## PT-15 — Contato (`/contato`)

**Objetivo**: oferecer canais diretos e formulário de contato, com mapa carregado só após
interação (D-049).

**Hierarquia de blocos**: telefone · WhatsApp · e-mail · endereço · horário (todos
`DADO_PENDENTE`) · mapa sob interação · formulário com motivo do contato e contexto de origem ·
aviso de privacidade.

### Wireframe desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│ Início › Contato                                                          │
├───────────────────────────────┬──────────────────────────────────────────┤
│ FALE COM A AVIZEE               │ FORMULÁRIO DE CONTATO                    │
│ 📞 Telefone: DADO_PENDENTE      │ Motivo: [ Selecione ▾ ]                  │
│ 💬 WhatsApp: DADO_PENDENTE      │ Nome*   [                    ]           │
│ ✉  E-mail: DADO_PENDENTE        │ E-mail* [                    ]           │
│ 📍 Endereço: DADO_PENDENTE      │ Telefone [                   ]           │
│ 🕒 Horário: DADO_PENDENTE       │ Mensagem* [                            ] │
│                                  │ [ ] Li e aceito a Política de           │
│ [ Carregar mapa ]  (clique)      │     Privacidade*                        │
│ (mapa só após interação)         │                                          │
│                                  │ [ Enviar mensagem ]                     │
├───────────────────────────────┴──────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Wireframe mobile

```text
┌────────────────────────────┐
│ [header]                     │
│ FALE COM A AVIZEE             │
│ 📞 💬 ✉ 📍 🕒 (empilhados,    │
│ todos DADO_PENDENTE)          │
│ [ Carregar mapa ]              │
├────────────────────────────┤
│ FORMULÁRIO                    │
│ Motivo   [ Selecione ▾ ]      │
│ Nome*    [            ]       │
│ E-mail*  [            ]       │
│ Telefone [            ]       │
│ Mensagem*[            ]       │
│ [ ] Aceito a Política*         │
│ [ Enviar mensagem ]            │
├────────────────────────────┤
│ [footer]                      │
└────────────────────────────┘
```

**CTAs**: "Enviar mensagem" (primário) · WhatsApp como link direto (secundário) · "Carregar mapa"
(ação explícita).

**Nunca aparece**: mapa carregado automaticamente, dado de contato inventado, formulário com
etapas artificiais.

---

## 404 (não indexável)

**Objetivo**: recuperar a navegação sem beco sem saída.

**Hierarquia de blocos**: explicação · busca · atalho para categorias · atalho para a lista de
cotação.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [header + nav]                                                            │
│                                                                            │
│                     Página não encontrada                                │
│         O endereço acessado não existe ou foi movido.                    │
│                                                                            │
│                     🔍 [ Buscar por nome ou código ]                     │
│                                                                            │
│         [ Ver categorias ]        ( Ir para minha cotação )              │
├──────────────────────────────────────────────────────────────────────────┤
│ [footer]                                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: mesmo conteúdo, centralizado, empilhado.

**CTAs**: "Ver categorias" (primário) · "Ir para minha cotação" (secundário) · busca embutida.

**Nunca aparece**: link externo, mensagem de erro técnica (código HTTP cru), imagem decorativa
sem função.

---

## Regras transversais de acessibilidade e semântica

Aplicáveis a todos os wireframes acima, conforme `47` §"Acessibilidade e semântica": um único
`h1` por página, hierarquia sem salto, landmarks (`header`, `nav`, `main`, `aside`, `footer`),
navegação por teclado com foco visível, "pular para o conteúdo", breadcrumb em `nav` com
`aria-label`, resultados de busca anunciados por `aria-live`, filtro como grupo rotulado com
"limpar filtros", tabela de variações com `th`/escopo e versão em cartões no mobile, seletor de
variação como grupo de rádio acessível (nunca `div` clicável).
