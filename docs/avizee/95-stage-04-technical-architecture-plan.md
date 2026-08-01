# 95 — Etapa 4: Plano de Arquitetura Técnica

**Data**: 2026-08-01 · **Escopo**: PLANEJAMENTO E MODELAGEM · **Status global**: `PENDENTE_DE_APROVAÇÃO`

## 1. Confirmação de pré-condições

| Pré-condição | Situação |
|---|---|
| Etapa 3 aprovada expressamente | **Sim** — D-056 a D-061 (`01-approved-decisions.md`), com quatro correções |
| Aprovação parcial? | **Sim, na taxonomia** — D-052: 31 famílias / 97 SKUs aprovados; 12 famílias e 34 SKUs pendentes |
| Design system e fluxos principais pendentes? | **Não** — `76`–`89` aprovados; a Etapa 4 prossegue |
| Numeração | D-055: Etapa 4 ocupa `95`–`130` (deslocamento +6 sobre os `89`–`124` do prompt) |

**Consequência do escopo parcial**: a arquitetura é modelada para o universo completo
(43 famílias / 174 SKUs), mas o **conteúdo real** e a importação da v1 são limitados às
31 famílias / 97 SKUs. Os demais registros permanecem em fila de normalização (D-054),
representados no modelo por estados `BLOCKED_*` e `UNDER_REVIEW`.

## 2. O que esta etapa entrega

Arquitetura de aplicação, renderização e SEO, modelo de dados, classificação pública/privada,
modelo de catálogo e especificações, busca, cotação, CMS, mídia, autenticação, permissões,
segurança, privacidade, e-mail, analytics, performance, acessibilidade técnica, ambientes,
migrations, backup, observabilidade, importação, testes, CI/CD, dependências, roadmap,
rastreabilidade, riscos e decisões para aprovação.

## 3. O que esta etapa NÃO faz

Nenhum código produtivo, nenhuma alteração em `src/`, nenhuma tabela criada, nenhum produto
importado, nenhuma rota publicada, nenhum domínio configurado, nenhum segredo armazenado,
nenhum e-mail ou cotação enviada, nenhum serviço externo ativado, nenhum token aplicado no
código e nenhuma alteração de layout, cor, tipografia, componente ou jornada aprovados.

## 4. Restrições herdadas que governam todas as decisões técnicas

1. Sem e-commerce: sem preço, carrinho, checkout, pagamento, estoque, frete ou botão "Comprar".
   A conversão é a **Lista de Cotação** (R-04).
2. Marca de terceiro nunca pública, em nenhuma superfície (R-05) — ver `103` e `112`.
3. Branding intocado: Montserrat convencional self-host, Alternates proibida, paleta oficial
   mais as duas cores funcionais de D-056.
4. Taxonomia SEGMENTO → SOLUÇÃO/APLICAÇÃO → CATEGORIA → FAMÍLIA → SKU; 6 categorias públicas;
   7 categorias editoriais.
5. Imagem reprovada nunca chega ao frontend; ausência de imagem não bloqueia produto confiável.
6. SKU **não** é chave primária; identificador interno imutável (UUID) — D-034.
7. WCAG 2.2 AA obrigatório (D-058).

## 5. Método

Levantamento de capacidades reais do ambiente (`96`) → alternativas comparadas (`97`) →
recomendação (`98`) → detalhamento por domínio (`99`–`127`) → riscos (`128`) → decisões
DT-01 a DT-21 para aprovação (`129`) → relatório executivo (`130`).

## 6. Índice da Etapa 4

`95` plano · `96` capacidades · `97` alternativas · `98` arquitetura recomendada ·
`99` diagramas · `100` renderização e SEO · `101` modelo de dados · `102` dicionário ·
`103` classificação · `104` catálogo · `105` especificações · `106` busca · `107` cotação ·
`108` CMS · `109` mídia · `110` autenticação · `111` permissões · `112` segurança ·
`113` privacidade e retenção · `114` e-mail · `115` analytics · `116` performance ·
`117` acessibilidade · `118` ambientes · `119` migrations · `120` backup ·
`121` observabilidade · `122` importação e migração · `123` testes · `124` CI/CD ·
`125` dependências · `126` roadmap · `127` rastreabilidade · `128` riscos ·
`129` decisões · `130` relatório executivo.

Estruturados: `architecture/entities.csv`, `fields-classification.csv`, `permissions.csv`,
`api-contracts-provisional.csv`, `external-services.csv`, `events.csv`, `environments.csv`,
`implementation-increments.csv`, `technical-decisions.csv`, `risk-controls.csv`.


## 7. Situação após a decisão do cliente (2026-08-01)

**ETAPA 4 APROVADA COM AJUSTES.** As 21 decisões deixam de estar pendentes e passam aos estados
registrados em `129`. As condições, ajustes e complementos foram incorporados aos documentos
`96`–`130`. Permanecem abertas apenas DEP-T1, DEP-T3 e DEP-T5.

**ETAPA 5 LIBERADA CONDICIONALMENTE À VERIFICAÇÃO DA STACK** — verificação executada e registrada
em `architecture/stack-verification.md` (TanStack Start confirmado). A liberação **não** autoriza
alteração do layout aprovado, ativação de produção nem de serviços reais.
