# 549 — Decisões funcionais finais antes da Etapa 15

Data: 2026-08-10
Status: `USER_APPROVED`

Este registro fecha o lote de decisões funcionais que permanecia aberto no fechamento das Etapas 0–14.1. As escolhas foram apresentadas como recomendações e aprovadas explicitamente pelo usuário.

## 1. DEC-07 / DECT-12 — páginas de Soluções

Decisão aprovada: **criar páginas consultivas próprias por aplicação**.

Regras preservadas:

- rota canônica `/solucoes/{aplicacao}`;
- uso apenas de aplicações e famílias já publicadas na taxonomia vigente;
- famílias atravessam categorias conforme a relação de aplicação já existente;
- artigos só podem aparecer por relação editorial declarada artigo ↔ família, nunca por inferência de palavra-chave;
- sem preço, estoque, prazo, checkout, marca de terceiro ou promessa técnica não comprovada;
- componentes, tokens e hierarquia visual seguem os padrões públicos já aprovados, sem novo design system.

## 2. DEC-10 — busca global

Decisão aprovada: **busca global em Produtos + Soluções + Conteúdos publicados**.

Regras preservadas do documento 49:

- resultados agrupados por tipo;
- Produtos aparecem primeiro;
- referências/SKUs e famílias continuam usando o mecanismo público existente;
- Soluções são obtidas das aplicações públicas vigentes;
- Conteúdos usam apenas artigos publicados;
- autocomplete limitado e agrupado, sem indexar campos internos ou marcas de terceiros;
- `/busca` continua `noindex`.

## 3. Formulário geral de Contato

Decisão aprovada: **não ativar na v1**.

A Lista de Cotação permanece o fluxo registrado para solicitações comerciais. Para outros assuntos, permanecem os canais públicos já confirmados na página Contato.

Esta escolha evita um segundo fluxo redundante de lead, sem remover ou reposicionar blocos do layout público aprovado.

## 4. Mapa

Decisão aprovada: **não ativar na v1**.

O endereço público confirmado permanece visível. Nenhum Google Maps ou outro serviço externo de mapa deve ser carregado nesta versão.

## 5. Efeito no fechamento pré-Etapa 15

As quatro decisões deixam de ter estado `OPEN_USER_INPUT`.

- DEC-07 / DECT-12: `CLOSED_USER_DECISION`, com implementação no PR #2;
- DEC-10: `CLOSED_USER_DECISION`, com implementação no PR #2;
- formulário geral: `CLOSED_USER_DECISION` como fora da v1;
- mapa: `CLOSED_USER_DECISION` como fora da v1.

O encerramento técnico das duas primeiras depende da recertificação do HEAD que contém a implementação. Produção continua sujeita aos gates operacionais externos e não é autorizada por este documento.
