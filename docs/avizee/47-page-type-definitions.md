# 47 — Tipos de Página

Status: `PENDENTE_DE_APROVAÇÃO`. Estrutura informacional, não layout.

## PT-01 — Home
Blocos, em ordem: (1) proposta de valor com foco em avicultura + CTA duplo (Ver produtos ·
Solicitar cotação); (2) busca por nome ou código; (3) as 6 categorias; (4) soluções por
necessidade; (5) diferenciais — variedade especializada, agilidade, atendimento consultivo
(`05-business-positioning.md`); (6) famílias em destaque, com curadoria manual; (7) como funciona
a cotação, em 3 passos; (8) conteúdos recentes; (9) atendimento em todo o Brasil; (10) CTA final.
Sem preço, sem prazo, sem marca. Bloco 6 só aparece com ≥ 4 famílias publicáveis.

## PT-02 — Produtos (catálogo)
Introdução curta · busca · categorias · filtros gerais (`49`) · contador de resultados ·
ordenação (relevância · nome · categoria — **nunca preço**) · grade de cards de **família** ·
carregamento progressivo com paginação acessível como fallback · estado sem resultado com
"Não encontrou o que procura?" · CTA de cotação persistente.
Card de família: nome funcional · imagem ou placeholder · categoria · nº de variações ·
faixa de medidas quando existir. Nunca marca, nunca preço.

## PT-03 — Categoria
Nome · descrição própria obrigatória (2 a 4 parágrafos) · aplicações da categoria ·
famílias · soluções relacionadas · artigos relacionados · CTA de cotação ·
FAQ apenas quando houver 3+ perguntas reais. **Sem descrição própria, não indexa** (`55`).

## PT-04 — Solução
Problema ou necessidade em linguagem do cliente · contexto e boas práticas · o que costuma ser
necessário (categorias e famílias, com curadoria) · artigos · CTA consultivo ("Fale com um
especialista" + "Solicitar cotação"). **Não é cópia da categoria**: a categoria organiza por
*tipo de item*, a solução organiza por *problema* e pode atravessar várias categorias.

## PT-05 — Família (página canônica do produto)
Nome funcional · breadcrumb · imagem principal com aviso "imagem ilustrativa" quando
`APROVADA_PARA_FAMÍLIA` (I-4) ou placeholder oficial (D-050) · descrição · seletor de variação ·
**tabela de variações** (referência · medida/capacidade · unidade · quantidade · adicionar) ·
especificações comuns · especificações variáveis · aplicações · documentos (quando houver) ·
produtos complementares · conteúdos relacionados · CTA "Adicionar à lista de cotação" +
WhatsApp secundário.
Regras: campo sem dado é **omitido**, nunca preenchido com texto genérico (D-041); variação em
rascunho por divergência **não aparece** (D-036, AG005/AG022); família com todas as variações
bloqueadas não é publicada.

## PT-06 — SKU (excepcional)
Só existe sob os critérios de `45` §4. Herda PT-05, acrescentando especificação exclusiva,
documentação própria e imagem própria. Canônica aponta para si; a família a lista.

## PT-07 — Central de Conteúdos · PT-08 Categoria editorial · PT-09 Artigo · PT-10 Autor
Detalhados em `51-content-hub-architecture.md`.

## PT-11 — Busca (`/busca`)
Campo · resultados agrupados por tipo (Produtos · Soluções · Conteúdos) · filtros rápidos ·
estados: vazio inicial, sem resultado, código não encontrado, resultado bloqueado. `noindex`.

## PT-12 — Lista de cotação (`/cotacao`) · PT-13 — Confirmação (`/cotacao/enviada`)
Detalhados em `50-quotation-journey.md`. Ambas `noindex`.

## PT-14 — Sobre
Quem é a AviZee · especialização em avicultura · públicos atendidos · abrangência nacional ·
forma de atendimento (consultiva) · diferenciais · segmentos complementares · missão, visão e
valores. História, ano de fundação e números **não são escritos** sem fonte — `DADO_PENDENTE`.

## PT-15 — Contato
Telefone · WhatsApp · e-mail · endereço · horário (todos `DADO_PENDENTE`, Q-08) · mapa carregado
**apenas após interação** (D-049) · formulário com motivo do contato e contexto de origem
(produto/página) · aviso de privacidade com link e base legal (D-047).

## PT-16 — Páginas legais
Privacidade (obrigatória, D-047) · Cookies · Termos. Conteúdo jurídico é `DADO_PENDENTE` (Q-13).

## PT-17 — 404
Explicação · busca · atalho para categorias · atalho para a lista de cotação. `noindex`.

## Acessibilidade e semântica (aplicável a todos)
Um único `h1` por página; hierarquia de heading sem salto · landmarks `header`, `nav`, `main`,
`aside`, `footer` · navegação completa por teclado com foco visível e "pular para o conteúdo" ·
link descritivo, nunca "clique aqui" · breadcrumb em `nav` com `aria-label` · resultados de busca
anunciados por região `aria-live` · filtro como grupo rotulado, com estado e "limpar filtros" ·
estado vazio com texto e saída acionável · erro de formulário associado ao campo, com texto e não
só cor · modal com foco preso e retorno ao gatilho · tabela de variações com `th` e escopo, e
versão em cartões no mobile · `alt` funcional sem marca (I-6) · placeholder com `alt` que informa
"imagem em atualização" · seletor de variação como grupo de rádio acessível, não `div` clicável.
