# 14 — Glossário

| Termo | Definição |
|---|---|
| **Segmento** | Nível mais alto da taxonomia; setor produtivo atendido (Avicultura, Bovinocultura, Suinocultura). |
| **Solução / Aplicação** | Necessidade operacional que agrupa produtos por finalidade (vacinação, ovoscopia, pesagem, biossegurança...). |
| **Categoria** | Agrupamento de famílias por natureza do produto (ex.: "Vacinação e aplicação"). |
| **Família** | Conjunto de variações visual e funcionalmente semelhantes, apresentado em uma única página pública com seletor (ex.: "Agulha inox"). |
| **Variação / SKU** | Item individual comercializável, identificado por código e atributos diferenciadores (medida, capacidade, unidade). Ex.: `10 × 10 — AG011`. |
| **Lista de Cotação** | Agrupador de itens que o visitante monta no site antes de enviar a solicitação. **Nunca** chamado de carrinho. |
| **Cotação** | Solicitação enviada pelo visitante com itens, quantidades e dados da empresa. Não é pedido, reserva, aceite, preço, prazo ou frete garantidos. |
| **Produto público** | Conjunto de dados exibíveis: nome público neutro, código, especificações, aplicação, imagem aprovada. |
| **Produto interno** | Registro administrativo completo, incluindo campos privados. Nunca serializado para o cliente. |
| **Marca interna** | Marca de terceiro registrada apenas em campo administrativo privado (`marca_interna`, `fabricante_interno`, `referencia_original`, `fornecedor`, `descricao_original`). |
| **Nome público funcional** | Denominação neutra do produto, sem marca de terceiro. Ex.: "Seringa automática 0,5 ml". |
| **Normalização** | Processo rastreável de conversão do nome interno com marca para o nome público neutro. |
| **Imagem aprovada** | Imagem com status `APROVADA`, apta a publicação sem ressalvas. |
| **Imagem ilustrativa** | Imagem `APROVADA_PARA_FAMÍLIA`, publicada com aviso discreto de que representa a família e não a variação específica. |
| **Placeholder oficial** | Substituto visual da AviZee (fundo creme, símbolo, grafismo, Montserrat, "Imagem em atualização"). |
| **Conteúdo relacionado** | Vínculo entre artigo e produto/família/categoria/solução, em ambas as direções. |
| **Rascunho** | Registro não visível publicamente, por falta de imagem e de dados confiáveis, ou por decisão editorial. |
| **Publicado** | Registro visível publicamente, aderente a todas as regras não negociáveis. |
| **PENDENTE_DE_APROVAÇÃO** | Status obrigatório de toda recomendação do Lovable até aprovação explícita do usuário. |

## Termos incorporados na Etapa 2
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

| Termo | Definição |
|---|---|
| **Página canônica do produto** | A página de **família**. Variação de medida não tem URL própria (`45` §4). |
| **Porta de entrada** | Caminho pelo qual o visitante chega ao produto: código, nome, aplicação, categoria ou conteúdo. |
| **Filtro contextual** | Filtro que só existe dentro de uma família ou categoria (medida, capacidade, rosca). |
| **Estado da relação** | `CONFIRMADA` · `PROVISÓRIA` · `RECOMENDADA` · `NÃO_CONFIRMADA`. Só `CONFIRMADA` é renderizada. |
| **Consulta assistida** | Fluxo para quem não encontrou o item: descrição, foto ou WhatsApp, gerando oportunidade sem SKU. |
| **DADO_PENDENTE** | Marcação de campo cujo valor real ainda não foi confirmado pelo usuário. Nunca é preenchido por inferência. |
| **Conteúdo mínimo publicável** | Conjunto de campos sem o qual uma página não é indexada (`55`). |
| **Protocolo de cotação** | Identificador gerado no envio da solicitação, apresentado em `/cotacao/enviada`. |
