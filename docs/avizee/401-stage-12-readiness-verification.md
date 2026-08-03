# 401 — Etapa 12: verificação de prontidão (avaliação atualizada)

> Data: 2026-08-03 · Release candidate vigente: **RC-AVIZEE-02** (congelada, 279 testes verdes).
> **Nenhuma alteração produtiva foi executada. DNS, domínio, robots de produção e site legado intactos.**

## 1. Gate de entrada da Etapa 12

A Etapa 12 exige o veredito formal **GO_LIVE_READY** (§1 do prompt). O veredito vigente,
registrado no doc. 364 e mantido após a Etapa 11.1 (doc. 365), é **GO_LIVE_BLOCKED**.

Consequência aplicada literalmente: produziu-se apenas esta avaliação de prontidão e o registro
de decisão NO_GO (doc. 402). Não foram executados: cutover, migrations produtivas, migração final,
publicação, DNS, TLS, robots de produção, submissão de sitemap ou desativação do legado.

## 2. Estado por critério obrigatório (§1)

| Critério | Estado | Evidência |
|---|---|---|
| Etapa 11 concluída / substituída pela 11.1 | ATENDIDO | docs. 325–364, 365 |
| Etapa 11.1 concluída | ATENDIDO | doc. 365 |
| Release candidate congelada | ATENDIDO | `stage-11-release-candidates.csv` (RC-AVIZEE-02) |
| Veredito GO_LIVE_READY | **NÃO ATENDIDO** | veredito vigente GO_LIVE_BLOCKED |
| P0 = 0 | **NÃO ATENDIDO** | B11-05 (O-27, credencial SMTP legada sem prova de revogação) |
| P1 = 0 | **NÃO ATENDIDO** | B11-01, B11-02, B11-03, B11-04, B11-06, B11-07 |
| P2 aprovados formalmente | PENDENTE | B11-08 (O-10) sem aceite registrado |
| UAT aprovada | **NÃO ATENDIDO** | doc. 355 sem aceites |
| Textos jurídicos aprovados | **NÃO ATENDIDO** | Q-13 aberta |
| Dados de contato confirmados | **NÃO ATENDIDO** | Q-08 aberta |
| Política de retenção aprovada | **NÃO ATENDIDO** | DEP-T5 aberta |
| E-mail produtivo aprovado ou dispensado | **NÃO ATENDIDO** | DEP-T1 aberta; `EMAIL_PROVIDER` em `null`/`log` |
| Storage produtivo homologado | **NÃO ATENDIDO** | `stage-11-backups.csv`: cópia de objetos não provisionada |
| MFA administrativo ativo | PARCIAL | política definida; ativação produtiva não verificável sem projeto de produção |
| Backup de banco validado | PARCIAL | snapshot da plataforma ativo; export lógico pendente |
| Backup de storage validado | **NÃO ATENDIDO** | não provisionado |
| Restore executado | **NÃO ATENDIDO** | B11-07, sem ambiente isolado |
| Sitemap absoluto validado | ATENDIDO | Etapa 11.1 §14; testes em `tests/unit/environment-and-seo.test.ts` |
| Robots por ambiente validado | ATENDIDO | `src/routes/robots[.]txt.ts` + testes |
| URL pública canônica definida | PARCIAL | `APP_PUBLIC_URL` obrigatória fora de dev; domínio produtivo ainda não fornecido |
| Outbox concorrente validada | ATENDIDO | `tests/integration/outbox-claim.test.ts` |
| Idempotência da cotação validada | ATENDIDO | `tests/unit/quotation-payload-hash.test.ts`, `tests/integration/quotation-flow.test.ts` |
| Observabilidade funcional | ATENDIDO em homologação | docs. 341–344; readiness real |
| Alertas funcionais | PARCIAL | matriz definida (`stage-11-alerts.csv`); canal produtivo inexistente |
| Runbooks completos | ATENDIDO | doc. 357, `stage-11-runbooks.csv` |
| Cutover aprovado | PENDENTE | doc. 360 preparado, sem aprovação |
| Rollback aprovado | PENDENTE | doc. 361 preparado, sem aprovação |
| Checklist de go-live aprovado | **NÃO ATENDIDO** | doc. 362 com 7 blocos bloqueados |
| Responsáveis disponíveis na janela | **NÃO ATENDIDO** | matriz de responsáveis sem nomes designados (§6) |

## 3. Bloqueios ativos

| ID | Bloqueio | Sev. | Responsável | Ação necessária |
|---|---|---|---|---|
| B11-05 | O-27: credencial SMTP exposta no site legado sem prova de revogação | P0 | Cliente / TI | Revogar e apresentar evidência |
| B11-01 | DEP-T1: provedor de e-mail, domínio remetente, SPF/DKIM/DMARC, destinatários | P1 | Cliente | Definir e aprovar, ou dispensar formalmente |
| B11-02 | DEP-T5: política de retenção sem aprovação | P1 | Cliente / Jurídico | Aprovar política |
| B11-03 | Q-13: razão social, CNPJ, controlador, canal do titular | P1 | Jurídico | Fornecer e aprovar textos legais |
| B11-04 | Q-08: endereço, telefone, e-mail, WhatsApp, horário | P1 | Cliente | Confirmar dados |
| B11-06 | UAT não executada | P1 | Cliente | Executar e registrar aceites |
| B11-07 | Restore não testado; backup de storage não provisionado | P1 | Operação | Testar restore em ambiente isolado |
| B11-08 | O-10: prazo comercial não confirmado | P2 | Cliente | Confirmar ou manter sem SLA público |

## 4. Pré-requisitos externos ausentes para o cutover

Além dos bloqueios acima, o cutover é materialmente impossível hoje porque não foram fornecidos:
domínio produtivo e acesso ao DNS, projeto/instância de produção separado do preview (DT-18),
provedor de e-mail, nomes dos responsáveis da matriz de GO/NO-GO e janela de mudança acordada.

## 5. Recomendação

Manter **PRODUCTION_BLOCKED**. Reabrir a Etapa 12 somente após: (a) evidência de revogação da
credencial legada; (b) quitação de B11-01 a B11-04, B11-06 e B11-07; (c) aceite formal de B11-08;
(d) designação nominal dos responsáveis e da janela.
