# 74 — Plano da Etapa 3: Sistema Visual e Protótipos

Status: `PENDENTE_DE_APROVAÇÃO`. Este documento é plano de trabalho, não decisão de produto.
Nada aqui publica, altera código de produção ou substitui `src/`.

## 1. Pré-condições atendidas

A Etapa 3 estava bloqueada por `73-stage-03-blocked.md` (bloqueios B-01 a B-03). O bloqueio foi
levantado parcialmente por decisão `USER_DECISION` de 2026-08-01:

| Decisão | Conteúdo | Efeito sobre o bloqueio |
|---|---|---|
| **DECT-01 (parcial)** | Aprovação do conjunto de 31 famílias com dados e identidade confiáveis, dentre as 43 propostas em `62-family-taxonomy-proposal.md` | Resolve B-01 apenas para essas 31 famílias |
| **DECT-10 (escopo controlado)** | Liberação da Etapa 3 restrita a essas 31 famílias / 97 SKUs e às 6 categorias públicas + 7 categorias editoriais já vigentes (`61-approved-category-baseline.md`) | Define o perímetro exato desta etapa |

Permanecem **fora de escopo e fora de qualquer conteúdo real** desta etapa, por não terem
identidade ou dado confiável (`73-stage-03-blocked.md`, B-02, B-03):

- As **12 famílias pendentes** (fora do bloco DECT-01 aprovado).
- Os **34 SKUs sem identidade** (`PE`, `CN`, `BO`) sem nome público em nenhuma fonte auditada.
- Os **16 SKUs sem nome público funcional** (FAM-010, FAM-011, FAM-012, FAM-041).
- Os **7 conflitos individuais de código** ainda sem resolução comercial (`20-resolved-recommendations.md`, D-036).

Nenhum desses itens pode aparecer em wireframe, protótipo, texto de exemplo ou tabela de
variação desta etapa — nem como "exemplo ilustrativo". Onde um layout precisar de conteúdo de
demonstração, ele deve usar exclusivamente famílias do conjunto aprovado, ou dado explicitamente
rotulado como fictício e nunca navegável.

Renumeração adotada (proposta em `73`, seção 4): a Etapa 3 ocupa `74` a `94`, preservando o
deslocamento de +6 sobre a numeração original do prompt-mãe, para não sobrescrever `68` a `73`
(Etapa 2.1).

## 2. Objetivo da Etapa 3

Produzir o **sistema de design** (fundações visuais) e os **protótipos navegáveis isolados**
necessários para validar, antes de qualquer implementação em `src/`, que a AviZee tem:

1. um vocabulário visual único, coerente com `10-brand-guidelines.md`, aplicável a todos os
   tipos de página definidos em `47-page-type-definitions.md`;
2. páginas de catálogo B2B que funcionam com dado real do conjunto aprovado (31 famílias / 97
   SKUs), sem preço, sem invenção e sem marca de terceiro visível;
3. evidência de acessibilidade AA e de uso em campo (galpão, luz direta, luva, conexão instável)
   antes de qualquer decisão de biblioteca de componentes ou de código de produção.

## 3. Escopo — o que será produzido

### 3.1 Documentação (74 a 94)

| Doc | Conteúdo |
|---|---|
| 74 | Este plano |
| 75 | Princípios de design |
| 76 | Tokens de design |
| 77 | Sistema tipográfico |
| 78 | Sistema de cor e contraste |
| 79 | Grid, espaçamento e layout |
| 80 | Iconografia |
| 81 | Imagem e placeholder aplicados a layout |
| 82 | Inventário de componentes |
| 83 | Estados de componente |
| 84 | Wireframes das páginas públicas |
| 85 | Protótipos de páginas públicas |
| 86 | Protótipos de interface administrativa |
| 87 | Comportamento responsivo |
| 88 | Especificação de acessibilidade |
| 89 | Diretrizes de microcopy |
| 90 | Validação de jornada em protótipo |
| 91 | Checklist de qualidade visual |
| 92 | Comparação com o site atual |
| 93 | Decisões para aprovação |
| 94 | Relatório executivo da Etapa 3 |

Este documento (74) trata apenas dos seis primeiros (74 a 79), objeto da entrega atual. Os
demais (80 a 94) seguem o mesmo método e serão produzidos em lotes subsequentes, sob o mesmo
escopo controlado.

### 3.2 Protótipos

Os protótipos previstos em 85 e 86 são isolados em **rota não indexável** `/prototipo/*`,
totalmente fora da árvore pública indexada em `45-url-architecture.md`. Requisitos:

- `noindex, nofollow` em toda a rota;
- nenhum link de navegação pública aponta para `/prototipo`;
- nenhuma chamada de rede real: dados mockados em arquivo estático, sem `fetch` para backend;
- nenhum envio real de formulário: qualquer "Solicitar cotação" ou "Enviar" no protótipo é
  simulado em memória, sem persistência, sem e-mail, sem webhook;
- aviso visível no rodapé do protótipo: "Protótipo interno — não é o site publicado".

## 4. Fora de escopo desta etapa

- Qualquer alteração em `src/` fora da própria rota de protótipo, quando esta existir.
- Implementação de backend, banco de dados, autenticação ou envio de e-mail.
- Publicação de qualquer página em ambiente de produção ou em URL indexável.
- Conteúdo editorial definitivo (artigos, textos institucionais) — object de outra frente.
- Resolução dos bloqueios remanescentes (12 famílias, 34 SKUs, 16 SKUs, 7 conflitos): não é
  papel do design resolver taxonomia ou identidade de produto.
- Definição de cores funcionais (erro, sucesso, aviso, informação): aguardam L-01. Qualquer
  proposta nesta etapa nasce `PENDENTE_DE_APROVAÇÃO`, derivada estritamente da paleta oficial
  (ver `76-design-tokens.md`, `78-color-and-contrast-system.md`).

## 5. Método

1. **Base normativa**: cada documento cita a regra que o origina (`02`, `09`, `10`, `47`) antes
   de propor. Nenhuma proposta contradiz regra não negociável.
2. **Token antes de componente**: tokens (76, 77, 78, 79) são definidos antes de qualquer
   inventário de componente (82) ou wireframe (84), para que todo componente referencie token
   nomeado, nunca valor solto.
3. **Conteúdo real, nunca fictício**: todo exemplo de família, SKU, categoria ou aplicação usado
   em wireframe e protótipo vem do conjunto aprovado (31 famílias / 97 SKUs, 6 categorias
   públicas, 7 categorias editoriais). Texto de preenchimento genérico ("lorem ipsum") é
   permitido apenas em blocos de texto livre (parágrafo editorial) explicitamente marcados como
   placeholder de redação, nunca em nome de produto, categoria ou código.
4. **Revisão cruzada de regras**: antes de qualquer entrega, checagem contra `02` (13 regras) e
   contra `15-acceptance-criteria.md`.
5. **Status explícito**: todo artefato desta etapa nasce e permanece `PENDENTE_DE_APROVAÇÃO` até
   manifestação expressa do usuário, registrada em `16-change-log.md`.

## 6. Critérios de aceite da Etapa 3

A Etapa 3 é considerada tecnicamente completa quando:

- [ ] Existem tokens nomeados para cor, tipografia, espaçamento, raio, sombra, borda, z-index,
  duração/easing, breakpoint e container — nenhum valor solto em wireframe ou protótipo.
- [ ] A paleta usada em qualquer artefato é estritamente `#151514`, `#690500`, `#b2592c`,
  `#fffaed`, e neutros matematicamente derivados dela; nenhuma cor funcional é usada sem a
  etiqueta `PENDENTE_DE_APROVAÇÃO`.
- [ ] A única família tipográfica usada é Montserrat convencional; Montserrat Alternates não
  aparece em nenhum artefato (D-031).
- [ ] Nenhum grafismo novo é criado; o padrão secundário oficial é usado apenas nos termos de
  D-032.
- [ ] Todos os 17 tipos de página de `47-page-type-definitions.md` têm ao menos um wireframe ou
  nota de layout equivalente em `79` e `84`.
- [ ] Nenhuma tela, protótipo ou exemplo contém preço, carrinho, checkout, marca de terceiro
  visível ou promessa logística.
- [ ] A conversão proposta em toda tela de produto é "Adicionar à lista de cotação", com
  WhatsApp como ação secundária (R-08).
- [ ] Todo par de cor texto/fundo usado tem contraste calculado e documentado em `78`.
- [ ] Nenhum protótipo está acessível por link público indexável nem processa dado real de
  cliente.
- [ ] Todo documento desta etapa está rastreável a uma regra, decisão ou fonte (R-13).

## 7. Restrições explícitas desta entrega

- **Nada é publicado.** Todo artefato é documento markdown ou protótipo isolado; nenhuma
  alteração de layout entra em produção nesta etapa.
- **Sem backend.** Nenhuma tela depende de API real, banco de dados ou serviço externo.
- **Sem formulário real.** Todo formulário de protótipo (cotação, contato, busca) é simulado;
  nenhum dado inserido por um avaliador é armazenado, enviado ou processado de fato.
- **Sem novas cores, fontes ou grafismos** além dos já documentados em `10-brand-guidelines.md`.
- **Sem conteúdo fora do escopo liberado**: nenhuma das 12 famílias pendentes, dos 34 SKUs sem
  identidade, dos 16 SKUs sem nome público ou dos 7 conflitos individuais aparece como exemplo,
  rascunho ou placeholder de conteúdo real.

## 8. Dependências e próximos passos

- Documentos 80 a 94 seguem após aprovação de 75 a 79, pois dependem dos tokens e princípios
  aqui fixados.
- Resolução de DECT-02 a DECT-09 e DECT-11 a DECT-14 (famílias específicas) pode correr em
  paralelo, sem impacto no sistema visual, pois trata de conteúdo e não de layout.
- Cores funcionais (L-01) devem ser aprovadas antes que 78 e 83 avancem para estado final;
  enquanto isso, todo estado de erro/sucesso/aviso/info documentado é proposta reversível.
