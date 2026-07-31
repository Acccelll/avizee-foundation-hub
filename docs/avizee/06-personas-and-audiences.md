# 06 — Personas e Públicos

> **Aviso**: as personas abaixo são **preliminares**. Comportamentos, dores e objeções marcados como
> `HIPÓTESE` não foram validados com clientes reais e devem ser confirmados em pesquisa futura
> (ver `13-open-decisions.md`). Os públicos em si são `USER_DECISION`.

## P-01 — Responsável por Compras
- **Contexto** `USER_DECISION`: setor de compras de empresa da cadeia avícola.
- **Objetivo** `HIPÓTESE`: obter cotação rápida de vários itens de uma vez, com códigos corretos.
- **Dores** `HIPÓTESE`: falta de código/especificação clara; precisar montar a lista por e-mail ou WhatsApp manualmente.
- **O que o site precisa oferecer** `TECHNICAL_INFERENCE`: busca por código, lista de cotação multi-item, dados de empresa no formulário, confirmação por e-mail. Raciocínio: o fluxo aprovado (D-007) é literalmente o processo de trabalho dessa persona.

## P-02 — Responsável por Manutenção
- **Contexto** `USER_DECISION`: manutenção de equipamentos em granja/incubatório.
- **Objetivo** `HIPÓTESE`: identificar a peça de reposição correta a partir de uma medida ou de um componente em mãos.
- **Dores** `HIPÓTESE`: não saber o nome comercial da peça; risco de comprar medida errada.
- **O que o site precisa oferecer** `TECHNICAL_INFERENCE`: filtro por medida/capacidade, página de família com seletor de variações, conteúdo de manutenção relacionado. Raciocínio: D-019 e D-020 existem para atender exatamente esse tipo de busca.

## P-03 — Gestor de Granja
- **Contexto** `USER_DECISION`: gestão operacional de produção avícola.
- **Objetivo** `HIPÓTESE`: melhorar manejo, biossegurança e resultados operacionais.
- **Dores** `HIPÓTESE`: escolher entre soluções sem apoio técnico.
- **O que o site precisa oferecer**: navegação por solução/aplicação e Central de Conteúdos educativa.

## P-04 — Responsável por Incubatório
- **Contexto** `USER_DECISION`: incubação, ovoscopia, controle de temperatura.
- **Objetivo** `HIPÓTESE`: equipamentos de medição, controle e ovoscopia confiáveis.
- **O que o site precisa oferecer**: agrupamento por aplicação (incubação, ovoscopia, controle de temperatura) e especificações técnicas visíveis.

## P-05 — Profissional Técnico
- **Contexto** `USER_DECISION`: veterinário/zootecnista/consultor que especifica equipamentos.
- **Objetivo** `HIPÓTESE`: comparar especificações e indicar a solução ao cliente.
- **O que o site precisa oferecer**: ficha técnica completa, conteúdo com profundidade, ausência de linguagem promocional.

## P-06 — Produtor Empresarial
- **Contexto** `USER_DECISION`: produtor que opera como empresa.
- **Objetivo** `HIPÓTESE`: fornecedor confiável para reposição recorrente.
- **O que o site precisa oferecer**: institucional sólido, contato direto, cotação simples.

## Público não prioritário
`USER_DECISION` — Pessoa física. Não é bloqueada tecnicamente, mas nenhuma jornada, copy ou
formulário é desenhado para ela.
