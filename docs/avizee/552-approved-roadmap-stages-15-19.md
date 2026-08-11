# 552 — Roadmap aprovado das Etapas 15–19

> Aprovação: 2026-08-11  
> Baseline de origem: `96b9a5b5c5311ddc6b44ce402abd7b4e4f38be4d`  
> Estado do baseline: `PRE_STAGE_15_BASELINE_CONSOLIDATED`

## 1. Objetivo

Registrar a progressão aprovada para concluir a v1 do projeto AviZee após o fechamento funcional e técnico das Etapas 0–14.1.

Este documento organiza o restante do trabalho em desenvolvimento final, readiness de produção, homologação, lançamento e operação assistida. Ele não autoriza produção, DNS, publicação, envio real de e-mail ou qualquer alteração de layout público.

## 2. Relação com o roadmap original

O plano original do doc. `126-implementation-roadmap.md` encerra o desenvolvimento em dois incrementos finais:

- **Incremento 7 — Qualidade:** SEO técnico, analytics, acessibilidade, performance e segurança;
- **Incremento 8 — Migração e lançamento:** importação definitiva, redirects, testes finais, domínio, monitoramento e backup testado.

As Etapas 15–19 detalham esses dois incrementos sem alterar seu propósito:

- Etapa 15 materializa o Incremento 7;
- Etapas 16–19 decompõem o Incremento 8 em gates operacionais verificáveis.

## 3. Etapa 15 — Qualidade Final

### Objetivo

Encerrar a qualidade técnica do produto antes da preparação efetiva de produção.

### Escopo

- SEO técnico e indexação final das rotas públicas;
- analytics e mensuração em modo de readiness, sem ativar coleta que dependa de consentimento antes da configuração aplicável;
- auditoria final de acessibilidade com referência WCAG 2.2 AA nas rotas-tipo;
- performance e orçamento técnico nas superfícies representativas;
- revisão final de segurança de aplicação e regressões;
- recertificação de build, typecheck, migrations, SSR e testes sobre o HEAD final da etapa.

### Gate de saída

`STAGE_15_QUALITY_CERTIFIED`

A saída da Etapa 15 encerra o produto em termos de desenvolvimento/qualidade, mas não autoriza produção.

## 4. Etapa 16 — Readiness de Produção e Gates Externos

### Objetivo

Converter os atuais `CLOSED_DEFERRED_LAUNCH_GATE` em configuração e evidência do ambiente real antes de montar a release candidate final.

### Escopo

- ambiente produtivo e configuração canônica de domínio/URL;
- Resend, domínio remetente, SPF/DKIM/DMARC e credenciais reais;
- criação/validação dos canais de e-mail aprovados;
- provisionamento do administrador real e controles de acesso/MFA aplicáveis;
- revisão jurídica final e canais de privacidade;
- backup real de banco e storage, RPO/RTO e procedimento de restore;
- binding distribuído `MCP_RATE_LIMITER` quando MCP produtivo for habilitado;
- verificação direta do banco/ambiente conectado;
- observabilidade, health checks, alertas e responsáveis operacionais;
- confirmação dos pré-requisitos de cutover e rollback.

### Gate de saída

`PRODUCTION_READINESS_EVIDENCED`

Enquanto esse gate não for atingido, permanecem válidos `PRODUCTION_BLOCKED` e `OPERATION_BLOCKED`.

## 5. Etapa 17 — Release Candidate Final, Migração e UAT

### Objetivo

Congelar e homologar a versão que efetivamente poderá ser levada a produção.

### Escopo

- criação da release candidate final sobre o baseline aprovado;
- ensaio/reconciliação da importação definitiva de catálogo, conteúdo, mídia e dados necessários;
- regressão integral e E2E das jornadas críticas;
- validação de URLs, redirects, sitemap, robots e canonical no ambiente de homologação;
- homologação dos fluxos administrativos e comerciais;
- UAT humano com registro de aceite e defeitos;
- tratamento dos bloqueadores encontrados antes da decisão de lançamento;
- preparação final do pacote de cutover e rollback.

### Gate de saída

`FINAL_RC_ACCEPTED_FOR_CUTOVER`

O aceite da RC habilita a Etapa 18, mas não substitui o GO/NO-GO do lançamento.

## 6. Etapa 18 — Cutover e Go-Live

### Objetivo

Executar a transição controlada do site vigente para a nova v1.

### Escopo

- GO/NO-GO formal imediatamente antes do corte;
- backup pré-cutover e validação de rollback;
- aplicação das migrations e importações produtivas aprovadas;
- configuração/publicação de domínio e DNS quando aplicável;
- ativação dos redirects críticos;
- validação de sitemap, robots, canonical e indexação produtiva;
- ativação e teste dos serviços produtivos aprovados, inclusive e-mail;
- smoke tests pós-publicação;
- monitoramento intensivo da janela de mudança;
- rollback se os critérios de segurança/estabilidade não forem atendidos.

### Gate de saída

`PRODUCTION_ACTIVE_UNDER_HYPERCARE`

## 7. Etapa 19 — Hypercare, Aceite e Encerramento v1

### Objetivo

Comprovar estabilidade operacional, encerrar a implantação e transferir o produto para manutenção normal.

### Escopo

- janela de operação assistida/hypercare;
- acompanhamento de erros, disponibilidade, catálogo, busca, Lista de Cotação, e-mail, CMS e administração;
- validação de entregabilidade e eventos operacionais relevantes;
- correção dos defeitos de lançamento dentro do controle de mudança;
- confirmação dos backups e capacidade de recuperação operacional;
- retirada segura do legado somente quando os critérios de estabilidade permitirem;
- aceite final da v1;
- handoff, runbooks e documentação operacional final;
- criação de backlog separado para melhorias/evoluções futuras.

### Gate de saída

`V1_OPERATIONALLY_ACCEPTED_AND_CLOSED`

Após esse gate, melhorias deixam de fazer parte do fechamento da v1 e passam ao backlog evolutivo.

## 8. Sequenciamento aprovado

`15 → 16 → 17 → 18 → 19`

Regras de passagem:

1. uma etapa não usa evidência futura para declarar seu próprio gate;
2. CI e ensaios locais não substituem UAT ou evidência do ambiente real;
3. readiness não equivale a autorização de produção;
4. cutover só ocorre após a RC final aceita e GO/NO-GO explícito;
5. go-live não encerra o projeto: a v1 só é encerrada após hypercare e aceite operacional;
6. documentos históricos das Etapas 11–13 são reutilizados como base de runbooks/checklists, mas seus vereditos antigos não são tratados como evidência de execução no novo ambiente;
7. branding, taxonomia, modelo comercial e layout aprovado permanecem protegidos; qualquer proposta de mudança futura depende de aprovação prévia.

## 9. Estado corrente

- Etapas 0–14.1: encerradas no baseline consolidado;
- Roadmap 15–19: **APROVADO**;
- Etapa 15: **NÃO INICIADA**;
- Produção: **BLOQUEADA** até os gates aplicáveis das Etapas 16–18;
- operação regular: **NÃO INICIADA**.
