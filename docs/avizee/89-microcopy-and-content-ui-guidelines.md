# 89 — Diretrizes de Microcopy e Conteúdo de Interface

Status: `PENDENTE_DE_APROVAÇÃO`. Base: `05-business-positioning.md`, `02-non-negotiable-rules.md`,
`50-quotation-journey.md`, `75-design-principles.md`.

## 1. Voz e tom
Consultivo, técnico, direto, sem superlativo publicitário. Frases curtas, verbo no infinitivo em
instruções ("Adicionar à lista"), sem exclamação, sem urgência artificial ("últimas unidades",
"aproveite"). Tom nunca íntimo demais nem informal com o cliente B2B.

## 2. Pessoa verbal
Interface em segunda pessoa do singular indireta ("você") ou imperativo neutro ("Informe a
quantidade"). Nunca primeira pessoa do plural ("nós recomendamos") em rótulo de UI; permitido em
texto institucional assinado. Evitar terceira pessoa impessoal excessiva ("o usuário deve").

## 3. Glossário de termos de interface padronizados
| Termo canônico | Nunca usar |
|---|---|
| Lista de cotação | carrinho, sacola, meus pedidos |
| Solicitar cotação / Enviar cotação | finalizar compra, fazer pedido, comprar |
| Itens para cotação | itens do pedido |
| Adicionar à lista de cotação | comprar, adicionar ao carrinho |
| Família | categoria de produto (usar apenas quando referir-se à categoria de fato) |
| Variação | modelo, opção (usar apenas para variação dentro da família) |
| Referência / código | SKU (interno; nunca exibir a sigla ao cliente) |
| Protocolo | número do pedido |
| Disponibilidade sob consulta | em estoque, pronta-entrega |
| Fale conosco / WhatsApp | compre agora |

## 4. Rótulos de botão canônicos
- Ação primária de produto: **"Adicionar à lista de cotação"**.
- Ação de revisão: **"Ver lista de cotação"** / **"Revisar cotação"**.
- Ação de envio: **"Enviar cotação"** (nunca "Finalizar" ou "Confirmar pedido").
- Ação secundária de contato: **"Falar no WhatsApp"**.
- Ação de busca: **"Buscar"**.
- Ação de filtro: **"Aplicar filtros"** / **"Limpar filtros"**.
- Ação de formulário genérico: **"Enviar"**.
- Nunca usar: "Comprar", "Finalizar compra", "Ir para pagamento", "Confirmar pedido".

## 5. Estados de conteúdo

### Vazio
- Lista de cotação vazia: "Sua lista de cotação está vazia. Adicione itens do catálogo para
  montar sua solicitação." + link para `/produtos`. Tom explicativo, nunca de erro (`50`).
- Busca sem resultado: "Não encontramos itens para "{termo}". Você pode revisar o código digitado
  ou nos contar o que procura." + caminho para formulário/WhatsApp (`53`, J-8).
- Categoria/família sem itens publicados: "Esta seção está em atualização." — nunca "em breve"
  com promessa de prazo (R-11).

### Erro
- Erro de campo obrigatório: "Informe {nome do campo}."
- Erro de formato: "Verifique o formato de {nome do campo}." (ex.: e-mail, telefone).
- Erro de envio (indisponibilidade): "Não conseguimos registrar sua cotação agora. Tente novamente
  ou fale conosco pelo WhatsApp ou telefone." — nunca "erro 500" ou linguagem técnica exposta.
- Item indisponível na lista: "Este item não está disponível para cotação no momento." — sem
  bloquear o envio dos demais.

### Carregando
- "Carregando..." genérico é aceitável apenas como rótulo acessível de spinner; preferir contexto:
  "Buscando produtos...", "Enviando cotação...".
- Botão em processamento de envio: manter o rótulo da ação com indicação de estado ("Enviando
  cotação...") em vez de trocar por "Aguarde".

### Sucesso
- Item adicionado: confirmação discreta, ex.: "Adicionado à lista de cotação." (sem navegar a
  pessoa para outra página).
- Envio de cotação: "Cotação enviada. Protocolo {número}. Nossa equipe vai analisar sua
  solicitação e entrar em contato." — nunca prometer prazo (RK-12).

## 6. Microcopy da lista de cotação
- Cabeçalho da lista: "Lista de cotação ({n} itens)".
- Campo de quantidade: rótulo "Quantidade" com unidade quando aplicável.
- Campo de observação por item: rótulo "Observação (opcional)".
- Remoção de item: ação rotulada "Remover" com confirmação textual, nunca só ícone de lixeira sem
  rótulo acessível.
- Aviso de privacidade: "Ao enviar, você concorda com o uso dos seus dados para retorno comercial,
  conforme nossa política de privacidade." — link para a política, sem linguagem jurídica densa
  na tela.

## 7. Microcopy do formulário
- Introdução do formulário: "Complete seus dados para que nossa equipe possa preparar sua
  cotação."
- Campos de empresa (R-02): "Razão social ou nome fantasia", "CNPJ (opcional)", "Cidade/UF",
  "Nome do responsável", "Telefone/WhatsApp", "E-mail".
- Texto de ajuda quando aplicável, nunca como único meio de entender o campo obrigatório.

## 8. Texto de placeholder de imagem
- Rótulo visível sobre a imagem substituta: "Imagem em atualização".
- `alt` correspondente: "Imagem em atualização — {nome da família ou produto}".
- Nunca usar "sem imagem", "imagem indisponível" com tom de falha, nem ícone de erro (imagem
  ausente é estado normal do catálogo, conforme R-09 e P-05 de `75`).

## 9. Textos proibidos
- Qualquer preço, faixa de preço, "a partir de", desconto, parcelamento, cupom, promoção (R-04).
- Qualquer prazo de entrega, "entrega rápida", "pronta-entrega", "frete grátis" (R-11).
- Qualquer marca de terceiro em nome de produto, categoria, imagem ou texto editorial (R-05).
- Superlativos publicitários: "o melhor", "líder de mercado", "número 1", "revolucionário",
  "incrível". Substituir por descrição técnica objetiva (`05`).
- Linguagem de e-commerce de consumo: "compre já", "não perca", "oferta imperdível".
- Garantia de resultado técnico não revisado ("resolve 100% dos problemas de biossegurança").

## 10. Padrão de títulos e metadados
- Título de página (title tag): "{Nome da família ou página} | AviZee" — sem preço, sem marca de
  terceiro, sem superlativo.
- Meta description: frase objetiva descrevendo a família/aplicação, sem CTA comercial agressivo,
  sem dado técnico não confirmado.
- H1 sempre corresponde ao nome público da família/categoria/artigo, sem variação de redação em
  relação ao breadcrumb e ao menu.

## 11. Capitalização, números e unidades
- Títulos e rótulos de botão: apenas a primeira letra maiúscula ("Adicionar à lista de cotação"),
  nunca Title Case nem caixa alta decorativa, exceto sigla técnica própria do produto.
- Nome de família e categoria: capitalização de nome próprio, consistente com `62-family-taxonomy-proposal.md`.
- Números: unidades de medida sempre por extenso ou abreviação padrão do Inmetro (mm, cm, kg, L),
  nunca abreviação ambígua; separador decimal por vírgula (padrão pt-BR); código de produto nunca
  formatado com separador de milhar.
- Datas em formato dia/mês/ano; nenhuma data de "prazo de entrega" é exibida (R-11).
