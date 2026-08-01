# 91 — Checklist de Qualidade Visual e Conformidade

Status: `PENDENTE_DE_APROVAÇÃO`. Base normativa: `10-brand-guidelines.md`,
`85-public-page-prototypes.md`, `88-accessibility-design-specification.md`,
`50-quotation-journey.md`, `84-public-page-wireframes.md`. Uso obrigatório: nenhuma tela desta
etapa (ou de etapa futura de implementação) é aprovada sem passar por este checklist. Cada item
responde **Sim** ou **Não**; a regra de reprovação de cada bloco define o efeito de qualquer "Não".

Convenção: `[ ]` indica item a marcar durante a revisão. Item marcado "Não" deve ser registrado com
referência à tela e ao motivo antes de nova submissão.

## Regra geral de reprovação

Qualquer item marcado "Não" em qualquer bloco **bloqueia a aprovação da tela** até correção,
exceto quando o próprio item permitir explicitamente "N/A" (não aplicável ao tipo de tela). Não há
aprovação condicional ou "aprovar com ressalva" neste checklist — ressalva é registrada como
pendência formal em documento de decisão (`13-open-decisions.md`), não como aprovação.

## 1. Marca e identidade

| # | Item verificável | Sim/Não |
|---|---|---|
| 1.1 | O logotipo usado é a versão oficial do manual de branding, sem recriação ou aproximação | [ ] |
| 1.2 | O símbolo (galo + engrenagem) aparece sempre em traço contínuo (outline), nunca preenchido | [ ] |
| 1.3 | Sobre fundo Creme, o símbolo está em Vinho e o wordmark em Terracota | [ ] |
| 1.4 | Sobre fundo colorido (Terracota, Preto ou Vinho), o logotipo inteiro está em Creme, monocromático | [ ] |
| 1.5 | Nenhum grafismo novo foi criado fora do padrão secundário oficial já aprovado (DIV-06/D-032) | [ ] |
| 1.6 | Nenhuma marca ou logotipo de terceiro aparece em qualquer tela (R-05) | [ ] |
| 1.7 | Nenhuma referência de concorrente é exibida publicamente (dado interno, nunca publicado) | [ ] |

**Regra de reprovação**: qualquer "Não" neste bloco reprova a tela integralmente — identidade de
marca é regra não negociável (R-10).

## 2. Tokens de cor e superfície

| # | Item verificável | Sim/Não |
|---|---|---|
| 2.1 | Todas as cores usadas pertencem exclusivamente à paleta oficial: Preto `#151514`, Vinho `#690500`, Terracota `#b2592c`, Creme `#fffaed` (ou neutros matematicamente derivados aprovados) | [ ] |
| 2.2 | O fundo padrão da página é Creme `#fffaed` | [ ] |
| 2.3 | Blocos de ênfase (CTA final, "Como funciona a cotação", diferenciais) usam apenas fundo Preto ou Vinho com texto Creme | [ ] |
| 2.4 | Terracota não é usada como fundo de bloco extenso | [ ] |
| 2.5 | Terracota não é usada como cor de texto corrido sobre Creme | [ ] |
| 2.6 | Texto Creme não é aplicado sobre fundo Terracota | [ ] |
| 2.7 | CTA primário usa fundo Terracota com texto Creme | [ ] |
| 2.8 | CTA secundário usa fundo Creme, texto Terracota, borda Terracota | [ ] |
| 2.9 | Nenhum gradiente, sombra decorativa ou efeito de brilho está presente em qualquer superfície | [ ] |

**Regra de reprovação**: qualquer "Não" nos itens 2.1, 2.4, 2.5 ou 2.6 reprova a tela (risco de
contraste ou de identidade); "Não" nos demais itens exige correção antes de nova submissão.

## 3. Tipografia

| # | Item verificável | Sim/Não |
|---|---|---|
| 3.1 | A única família tipográfica usada é Montserrat | [ ] |
| 3.2 | Nenhum uso de Montserrat Alternates está presente (D-031) | [ ] |
| 3.3 | Nenhum estilo itálico sintetizado pelo navegador está presente | [ ] |
| 3.4 | `h1` usa peso 700/800 conforme o bloco (título de página) | [ ] |
| 3.5 | `h2` usa peso 700 | [ ] |
| 3.6 | Corpo de texto usa peso 400 | [ ] |
| 3.7 | Texto de botão usa peso 600/700 conforme CTA primário/secundário | [ ] |
| 3.8 | Cada página tem exatamente uma `<h1>` | [ ] |
| 3.9 | A hierarquia de cabeçalhos é sequencial, sem pular nível (h1 → h2 → h3) | [ ] |

**Regra de reprovação**: qualquer "Não" nos itens 3.1, 3.2 ou 3.8 reprova a tela; demais itens
exigem ajuste antes de nova submissão.

## 4. Espaçamento e grade

| # | Item verificável | Sim/Não |
|---|---|---|
| 4.1 | Todo espaçamento usado pertence à escala base 8px (4·8·16·24·32·48·64·96) | [ ] |
| 4.2 | Padding interno de card é 24px | [ ] |
| 4.3 | Gap entre cards na grade é 24px desktop / 16px mobile | [ ] |
| 4.4 | Padding vertical entre blocos de página é 64px desktop / 40px mobile | [ ] |
| 4.5 | Padding lateral do container é 64px desktop / 16px mobile | [ ] |
| 4.6 | Padding do botão (CTA) é 16px vertical / 32px horizontal | [ ] |
| 4.7 | Nenhum elemento usa valor de espaçamento fora da escala definida | [ ] |

**Regra de reprovação**: "Não" no item 4.1 ou 4.7 reprova a tela; os demais são ajuste antes de
nova submissão.

## 5. Cor e contraste (acessibilidade)

| # | Item verificável | Sim/Não |
|---|---|---|
| 5.1 | Todo texto de corpo/normal atinge razão de contraste mínima de 4,5:1 contra o fundo | [ ] |
| 5.2 | Todo texto grande (≥18pt ou 14pt negrito) atinge razão mínima de 3:1 | [ ] |
| 5.3 | Nenhum par de texto usa Terracota sobre Creme para texto normal (reprovado, ~4,1:1) | [ ] |
| 5.4 | Nenhum par de texto usa Creme sobre Terracota (reprovado, ~4,0:1) | [ ] |
| 5.5 | Uso de Preto sobre Terracota (badge/tag) está restrito a texto grande/negrito, peso 700 | [ ] |
| 5.6 | Indicador de foco visível tem espessura mínima 2px e contraste mínimo 3:1 contra o fundo | [ ] |
| 5.7 | Nenhum `outline: none` foi aplicado sem substituto de foco equivalente | [ ] |
| 5.8 | Nenhuma informação de estado é comunicada apenas por cor (ex. erro, item indisponível) | [ ] |

**Regra de reprovação**: qualquer "Não" neste bloco reprova a tela — contraste é critério de
aceite obrigatório (meta WCAG 2.1 AA, `88`).

## 6. Acessibilidade estrutural e de interação

| # | Item verificável | Sim/Não |
|---|---|---|
| 6.1 | Todo link de ação tem `href` real; nenhum `href="#"` ou `javascript:void(0)` | [ ] |
| 6.2 | Todo botão de ação usa `<button>`; todo link de navegação usa `<a href>` | [ ] |
| 6.3 | Landmarks obrigatórias presentes: `header`, `nav` rotulado, `main` único, `footer` | [ ] |
| 6.4 | Tabela de variação usa `<table>` real com `<caption>`/título associado e `<th scope>` | [ ] |
| 6.5 | Em cartão mobile, todo valor tem rótulo explícito visível (nunca valor solto) | [ ] |
| 6.6 | Todo elemento interativo é alcançável e operável por teclado (`Tab`, `Enter`/`Espaço`, `Esc`) | [ ] |
| 6.7 | Ordem de foco segue a ordem visual/lógica; nenhum `tabindex` positivo | [ ] |
| 6.8 | Skip link ("Pular para o conteúdo") é o primeiro elemento focável da página | [ ] |
| 6.9 | Todo campo de formulário tem `<label>` associado por `for`/`id` (nunca só `placeholder`) | [ ] |
| 6.10 | Alvo de toque mínimo 44×44px em todo elemento interativo mobile | [ ] |
| 6.11 | Animações respeitam `prefers-reduced-motion: reduce`; nenhum autoplay sem controle de pausa | [ ] |
| 6.12 | Modal/diálogo (se existir) tem `role="dialog"`, `aria-modal`, foco preso e retorno de foco | [ ] |

**Regra de reprovação**: qualquer "Não" neste bloco reprova a tela — corresponde a correções
obrigatórias de F-14, F-16 e F-17 (`34`, `88`).

## 7. Imagens

| # | Item verificável | Sim/Não |
|---|---|---|
| 7.1 | Toda imagem de produto tem `alt` descritivo com nome da família e variação, quando aplicável | [ ] |
| 7.2 | Nenhum `alt` é preenchido exclusivamente por script no cliente | [ ] |
| 7.3 | Placeholder oficial ("imagem em atualização") é usado em todo SKU sem foto, com `alt` que comunica o estado | [ ] |
| 7.4 | Toda imagem ilustrativa (não fotografia exata do item) exibe o selo "imagem ilustrativa" | [ ] |
| 7.5 | Nenhuma fotografia de produto de terceiro ou marca visível na imagem é usada | [ ] |
| 7.6 | Ícones puramente decorativos têm `aria-hidden="true"` e `focusable="false"` | [ ] |
| 7.7 | Nenhuma imagem carrega sem dimensão intrínseca definida (risco de CLS) | [ ] |

**Regra de reprovação**: "Não" nos itens 7.1, 7.2, 7.3, 7.4 ou 7.5 reprova a tela; 7.6 e 7.7 exigem
ajuste antes de nova submissão.

## 8. Conteúdo proibido e vocabulário

| # | Item verificável | Sim/Não |
|---|---|---|
| 8.1 | Nenhum preço, faixa de preço ou "a partir de" aparece em qualquer tela | [ ] |
| 8.2 | Nenhuma palavra do vocabulário de e-commerce proibido aparece: carrinho, checkout, finalizar compra, pedido, comprar | [ ] |
| 8.3 | O termo de conversão usado é sempre "Lista de cotação" / "Solicitar cotação" / "Itens para cotação" | [ ] |
| 8.4 | Nenhuma indicação de estoque/disponibilidade não confirmada aparece (ex. "indisponível", "esgotado") | [ ] |
| 8.5 | Nenhuma marca de terceiro é citada em texto, imagem ou metadado | [ ] |
| 8.6 | O escopo de catálogo exibido corresponde às 31 famílias / 97 SKUs aprovados — nenhum item fora do escopo real | [ ] |
| 8.7 | Nenhum dado de contato, endereço ou número não confirmado é publicado sem marcação `DADO_PENDENTE` | [ ] |
| 8.8 | Mensagem de WhatsApp simulada não contém marca interna, custo, fornecedor ou dado administrativo | [ ] |
| 8.9 | Nenhuma promessa de prazo de resposta é feita na confirmação de envio | [ ] |

**Regra de reprovação**: qualquer "Não" neste bloco reprova a tela — vocabulário e conteúdo
proibido são regras não negociáveis (R-02, R-04, R-05, D-044).

## 9. Responsividade

| # | Item verificável | Sim/Não |
|---|---|---|
| 9.1 | A tela foi revisada em ao menos três larguras: mobile, tablet e desktop | [ ] |
| 9.2 | Tabela de variação converte para cartões abaixo do breakpoint mobile definido | [ ] |
| 9.3 | Filtro de catálogo em mobile abre em painel com botão "aplicar", sem ocupar a navegação principal | [ ] |
| 9.4 | Barra inferior persistente ("N itens · Solicitar cotação") aparece em mobile quando há item na lista | [ ] |
| 9.5 | Nenhum texto é cortado, sobreposto ou ilegível em nenhuma das larguras testadas | [ ] |
| 9.6 | Área clicável mínima de 44×44px é mantida em todas as larguras | [ ] |

**Regra de reprovação**: qualquer "Não" reprova a tela para o breakpoint correspondente.

## 10. Estados de interface

| # | Item verificável | Sim/Não |
|---|---|---|
| 10.1 | Estado vazio (busca, lista de cotação) tem texto explicativo sem tom de erro e caminho de ação | [ ] |
| 10.2 | Estado de carregamento é explícito e não gera duplo envio (botão bloqueado durante envio) | [ ] |
| 10.3 | Estado de sucesso exibe protocolo/resumo, sem prometer prazo | [ ] |
| 10.4 | Estado de erro preserva os dados preenchidos e oferece alternativa (WhatsApp/telefone) | [ ] |
| 10.5 | Estado de indisponibilidade nunca descarta a solicitação em silêncio | [ ] |
| 10.6 | Item removido do catálogo aparece marcado como "não disponível para cotação" sem bloquear o restante do envio | [ ] |
| 10.7 | Confirmação de "item adicionado" é discreta, não move o foco nem tira o usuário da página | [ ] |

**Regra de reprovação**: qualquer "Não" reprova a tela — estados de cotação são regra crítica
(L-03/RK-07 em `50`).

## 11. Microcopy

| # | Item verificável | Sim/Não |
|---|---|---|
| 11.1 | Todo texto de botão descreve a ação de forma específica (nunca "clique aqui" ou "saiba mais" isolado) | [ ] |
| 11.2 | Mensagem de erro de campo descreve o problema e a correção esperada, nunca apenas "campo inválido" | [ ] |
| 11.3 | Texto de privacidade/consentimento está presente no formulário de cotação | [ ] |
| 11.4 | Nenhum texto usa tom de urgência artificial ou gatilho de venda agressivo, incompatível com o posicionamento B2B técnico | [ ] |
| 11.5 | Todo campo obrigatório é explicado uma vez no topo do formulário ("* campo obrigatório") | [ ] |
| 11.6 | Nenhum texto está em `DADO_PENDENTE` sem marcação visível para revisão interna | [ ] |

**Regra de reprovação**: "Não" nos itens 11.2, 11.3 ou 11.6 reprova a tela; os demais exigem
revisão editorial antes de nova submissão.

## Registro de revisão

Toda revisão formal deve registrar: nome da tela, versão/data, nome de quem revisou, lista de itens
marcados "Não" com referência ao número do item, e decisão final (aprovado / reprovado / aprovado
com pendência registrada em `13-open-decisions.md`, nunca "aprovado com ressalva" neste próprio
checklist).
