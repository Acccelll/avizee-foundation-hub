# 02 — Regras Não Negociáveis

Estas regras só mudam por solicitação expressa do usuário, registrada em `16-change-log.md`.

## R-01 — Foco em avicultura
`USER_DECISION` A avicultura é o eixo do site. Bovinocultura e suinocultura aparecem como linhas
complementares, com destaque visivelmente menor na Home, navegação e institucional.

## R-02 — B2B
`USER_DECISION` Linguagem, formulários, jornadas e posicionamento são empresariais.
Formulários de cotação pedem dados de empresa (razão social/nome fantasia, CNPJ opcional, cidade/UF,
contato responsável). Pessoa física não é impedida tecnicamente.

## R-03 — Sem venda online
`USER_DECISION` Proibido: checkout, pagamento, pedido automático, reserva de estoque,
cálculo definitivo de frete, parcelamento, cupom, promoção por preço.

## R-04 — Sem preços públicos
`USER_DECISION` Nenhum valor, faixa de valor, "a partir de", custo, desconto ou comparação de
preço em qualquer superfície pública (HTML, JSON, APIs, dados estruturados, OG, feeds).

## R-05 — Sem marcas de terceiros no público
`USER_DECISION` Proibido em: nomes de produto, títulos, descrições, categorias, filtros, URLs,
slugs, breadcrumbs, textos alternativos, títulos SEO, meta descriptions, Open Graph, dados
estruturados, mensagens de WhatsApp, documentos públicos, nomes públicos de arquivos, páginas de
marcas, logos, selos, banners, imagens publicadas e conteúdo editorial promocional.
Permitido apenas em campos administrativos privados (D-012), jamais serializados para o cliente.

## R-06 — Branding obrigatório
`BRANDING` Paleta oficial (`#151514`, `#690500`, `#b2592c`, `#fffaed`), logotipo, símbolo e
grafismos "V" da AviZee. Nenhuma cor, fonte ou elemento fora do sistema oficial.

## R-07 — Montserrat
`BRANDING` Montserrat é a única família tipográfica do projeto, com os pesos definidos em
`10-brand-guidelines.md`.

## R-08 — Lista de cotação
`USER_DECISION` O agrupador de itens é sempre "Lista de Cotação". Nunca "carrinho", "sacola",
"comprar", "finalizar compra". O envio nunca é apresentado como pedido confirmado.

## R-09 — Imagens pendentes não bloqueiam o lançamento
`USER_DECISION` Produto com dados técnicos confiáveis pode ir ao ar com placeholder oficial.
Produto sem imagem e sem dados confiáveis permanece como rascunho.

## R-10 — Nenhuma mudança relevante sem aprovação
`USER_DECISION` Alterações de escopo, taxonomia, branding, posicionamento, arquitetura ou
funcionalidade exigem aprovação explícita. Recomendações nascem como `PENDENTE_DE_APROVAÇÃO`.

## R-11 — Sem promessas logísticas
`USER_DECISION` Proibido prometer frete grátis, entrega imediata, prazo uniforme, pronta-entrega
geral ou cobertura logística. Tudo é "confirmado na cotação".

## R-12 — Integridade de conteúdo
`USER_DECISION` Proibido inventar fatos, publicar notícia sem fonte, copiar artigos de terceiros,
publicar recomendação técnica não revisada ou afirmar parceria/representação sem autorização.

## R-13 — Rastreabilidade
`USER_DECISION` Toda informação documentada carrega etiqueta de origem. Decisões aprovadas e
recomendações nunca são misturadas no mesmo bloco.
