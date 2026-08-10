# 448 — Periodic Restore Validation

> Registro original: 2026-08-04 · Release Candidate histórica: **RC-AVIZEE-02**  
> Atualização de fechamento: 2026-08-10  
> Status operacional corrente: **OPERATION_BLOCKED**

## 1. Contexto histórico

Na Etapa 13 não existia evidência executada de restore e a operação permanecia bloqueada pela Etapa 12. Esse histórico continua preservado.

## 2. Primeira validação técnica reproduzível

O fechamento pré-Etapa 15 adicionou ao pipeline de CI um ensaio automático de restore lógico do **schema da aplicação**. A evidência de referência é `546-pre-stage-15-ci-recertification.md`.

No GitHub Actions CI run #83, commit `63b763b80023e60286e19de836ecd7d1c792b992`, foram observados com sucesso:

- replay integral das migrations em Supabase local limpo;
- carregamento do fixture canônico de teste da coorte 31 famílias / 97 SKUs;
- dump lógico somente do schema `public`;
- criação de banco isolado de restauração;
- reconstrução das dependências mínimas externas necessárias ao contrato do schema;
- restore com falha imediata habilitada (`--exit-on-error`);
- reconciliação de tabelas críticas entre origem e restore;
- descarte do banco restaurado após a validação;
- continuidade do mesmo job até build/typecheck/testes integrais verdes.

Resultado:

`LOCAL_APPLICATION_SCHEMA_RESTORE_VERIFIED`

## 3. O que esta validação não cobre

Esta validação não é um teste de disaster recovery de produção. Não foi restaurado um snapshot real do ambiente conectado e não foram medidos incidentes ou indisponibilidade reais.

Permanecem fora da evidência atual:

- snapshot/backup gerenciado do banco real;
- restore a partir de cópia off-platform;
- restore de storage;
- chaves/segredos externos necessários à retomada operacional;
- DNS/e-mail/provedores externos;
- medição de RPO real;
- medição de RTO real;
- UAT pós-restore em ambiente operacional autorizado.

## 4. Periodicidade

O documento `120-backup-and-disaster-recovery.md` prevê validação periódica, inclusive teste trimestral de restauração, como política planejada. Essa cadência não deve ser apresentada como operação já estabelecida até que exista ambiente, responsável, rotina e evidência operacional correspondentes.

O ensaio atual em CI pode funcionar como regressão técnica contínua do mecanismo de restore do schema da aplicação, mas não substitui o teste periódico de desastre com backup real.

## 5. Critério para fechamento operacional futuro

O item operacional de restore somente poderá ser encerrado quando houver evidência verificável de, no mínimo:

1. backup real identificado e com política de retenção conhecida;
2. restauração em ambiente isolado autorizado;
3. validação de banco e storage aplicáveis;
4. teste funcional mínimo pós-restore;
5. registro dos tempos observados e comparação com RPO/RTO aprovados;
6. responsável e data da execução.

## 6. Estado

A dívida técnica de restore lógico local está encerrada. A dívida operacional de disaster recovery permanece aberta.

- `LOCAL_APPLICATION_SCHEMA_RESTORE_VERIFIED`
- `PRODUCTION_DR_NOT_VERIFIED`
- `PRODUCTION_BLOCKED`
- `OPERATION_BLOCKED`
