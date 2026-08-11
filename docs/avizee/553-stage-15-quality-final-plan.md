# 553 — Etapa 15: Qualidade Final — plano e baseline

## Status

`STAGE_15_IN_PROGRESS`

## Base de entrada

- baseline aprovado e sincronizado: `b34f871ef40c14e9c9d16ac521147fdb5c8a97b3`;
- Etapas 0–14.1 consolidadas;
- roadmap 15–19 aprovado no doc. 552;
- produção e operação permanecem bloqueadas pelos gates externos já segregados.

## Objetivo

Materializar o Incremento 7 do plano original como fechamento técnico de qualidade antes do readiness produtivo. O escopo é restrito a:

1. SEO técnico e metadados;
2. readiness de Analytics, sem coleta externa antes de consentimento válido;
3. auditoria e correções de acessibilidade WCAG 2.2 AA;
4. orçamento de performance verificável no CI;
5. hardening de segurança HTTP e regressão.

## Restrições

- não alterar layout público aprovado;
- não alterar branding, taxonomia ou modelo comercial;
- não ativar provider externo de Analytics;
- não marcar e-mail, DNS, UAT, revisão jurídica, backup/storage real, RPO/RTO, MCP distribuído ou banco conectado como concluídos;
- não autorizar produção, DNS, cutover ou publicação.

## Baseline técnico encontrado

### SEO

O helper estrutural existente já controla `robots`, Open Graph e JSON-LD, mas o baseline ainda apresentava três gaps objetivos:

- metadados raiz herdados do template Lovable e `lang="en"`;
- canonical/`og:url` sem garantia de URL absoluta;
- paginação de `/produtos` canonicalizando para a primeira página.

### Analytics

A especificação do doc. 115 já define eventos permitidos e proíbe PII, porém não havia dispatcher provider-neutral com consentimento fail-closed. A Etapa 15 prepara esse contrato sem instalar ou ativar provider externo.

### Acessibilidade

A base já possui skip link, foco visível, landmarks e combobox navegável por teclado. Os gaps de fechamento identificados foram restritos a semântica não visual:

- erros do formulário de cotação sem `aria-describedby` completo;
- ausência de foco no primeiro campo inválido;
- obrigatoriedade não comunicada textualmente a tecnologia assistiva;
- sugestões assíncronas da busca sem anúncio dedicado.

### Performance

Os budgets do doc. 116 estavam definidos, mas ainda não eram gate automatizado do pipeline. A Etapa 15 passa a verificar o bundle gerado após cada build do PR.

### Segurança

O baseline já possui CSRF do TanStack, RLS, validação de entrada, hardening MCP e higiene de segredos. Faltava uma camada centralizada de headers HTTP de segurança na resposta final do servidor.

## Evidência esperada para saída

A Etapa 15 somente poderá receber `STAGE_15_QUALITY_CERTIFIED` depois de um HEAD exato passar pelo CI completo, incluindo:

- lint e Prettier;
- build e typecheck;
- orçamento de performance;
- replay limpo das migrations;
- fixture canônica 31 famílias / 97 SKUs;
- restore lógico;
- SSR das rotas públicas;
- testes unitários, integração, segurança e E2E;
- regressão explícita de ausência de mudança de layout/branding/taxonomia/modelo comercial.

A homologação humana e os gates de produção continuam pertencendo às Etapas 16–19.
