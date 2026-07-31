# 09 — Política de Imagens

## Princípio
`USER_DECISION` — Usar as imagens existentes sempre que forem adequadas. Cada imagem recebe
obrigatoriamente **um** status.

## Estados

| Status | Significado | Publicável? |
|---|---|---|
| `APROVADA` | Representa corretamente o SKU, qualidade adequada, sem marca de terceiro visível | Sim |
| `APROVADA_PARA_FAMÍLIA` | Representa a família; variações visualmente semelhantes | Sim, com aviso de imagem ilustrativa |
| `PENDENTE_MARCA_VISÍVEL` | Marca de terceiro visível na imagem | Não |
| `PENDENTE_BAIXA_QUALIDADE` | Resolução, foco, recorte ou iluminação insuficientes | Não |
| `PENDENTE_IMAGEM_INCORRETA` | Não corresponde ao produto | Não |
| `PENDENTE_DIREITO_DE_USO` | Origem/licença não confirmada | Não |
| `SEM_IMAGEM` | Não há arquivo disponível | Placeholder |
| `NÃO_PUBLICAR` | Descartada definitivamente | Não |

## Edições permitidas
`USER_DECISION` — recorte · enquadramento · ajuste de proporção · compressão · conversão para WebP ·
otimização técnica · padronização de fundo (somente quando não alterar o produto).

## Edições proibidas
`USER_DECISION` — Não remover digitalmente marcas quando isso modificar a aparência real, gerar
representação enganosa ou comprometer a fidelidade do item. Nesse caso a imagem fica
`PENDENTE_MARCA_VISÍVEL` e aguarda nova foto.

## Placeholder oficial
`USER_DECISION` — fundo creme (`#fffaed`) · símbolo AviZee · grafismo discreto (linha "V") ·
tipografia Montserrat · texto "Imagem em atualização".

## Regras de publicação
`USER_DECISION`
- **I-1**: dados técnicos confiáveis + sem imagem adequada → **publicar com placeholder**.
- **I-2**: sem imagem **e** sem dados confiáveis → **rascunho**.
- **I-3**: imagens pendentes **não bloqueiam** o lançamento (R-09).
- **I-4**: uma imagem pode representar a família inteira quando as variações forem visualmente
  semelhantes; nesse caso o sistema informa discretamente que a imagem é ilustrativa.
- **I-5**: nomes públicos de arquivo de imagem nunca contêm marca de terceiro (R-05).
- **I-6**: texto alternativo é funcional, descritivo e sem marca de terceiro.

## Estado da classificação
`IMAGE_ASSET` — **Não executada**. Os acervos (`Mercado Livre.zip`, logotipos e ícones) não estavam
disponíveis no ambiente. As imagens do site atual (`https://avizee.com.br/assets/img/products/<codigo>.jpg`)
foram identificadas como acervo existente, mas **não classificadas**, pois exigem inspeção visual
item a item contra o catálogo. Ver T-16 em `04-traceability-matrix.md`.
