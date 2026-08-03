# 356 — Defect register and release blockers

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Defeitos
Registro em `stage-11-defects.csv`. Nenhum defeito funcional novo foi introduzido pela Etapa 11.

| Severidade | Quantidade |
|---|---|
| P0 | 1 (B11-05, credencial legada sem prova de revogação — externo ao repositório) |
| P1 | 6 (B11-01, B11-02, B11-03, B11-04, B11-06, B11-07) |
| P2 | 1 (B11-08) |
| P3 | 0 |

## Bloqueios de release

| ID | Bloqueio | Classe | Evidência | Responsável |
|---|---|---|---|---|
| B11-01 | DEP-T1 pendente: provedor de e-mail, domínio remetente, SPF/DKIM/DMARC e destinatários internos não definidos | P1 | `EMAIL_PROVIDER` limitado a `null`/`log`; outbox entrega apenas simulada | Cliente |
| B11-02 | DEP-T5 pendente: política final de retenção sem aprovação operacional/jurídica | P1 | Jobs destrutivos permanecem desativados | Cliente / Jurídico |
| B11-03 | Q-13 pendente: razão social, CNPJ, controlador e canal do titular ausentes nos textos legais | P1 | `stage-09-pending-fields.csv` (bloqueia_publicacao=sim) | Jurídico |
| B11-04 | Q-08 pendente: endereço, telefone, e-mail, WhatsApp e horário não confirmados | P1 | `/contato` exibe "informação em confirmação" | Cliente |
| B11-05 | O-27 aberto: credencial SMTP exposta no site legado ainda sem prova de revogação | P0 | RK-15 no registro de riscos | Cliente / TI |
| B11-06 | UAT não executada: sem aceite formal dos perfis | P1 | `355-user-acceptance-test-results.md` sem aceites | Cliente |
| B11-07 | Backup/restore gerenciados pela plataforma, sem teste de restauração executado em ambiente isolado | P1 | Sem instância isolada disponível nesta etapa | Operação |
| B11-08 | O-10 pendente: prazo comercial não confirmado — nenhuma promessa exibida | P2 | Copy sem SLA público | Cliente |


P0 e P1 em aberto ⇒ **GO_LIVE_BLOCKED**.
