# 447 — Database And Storage Backup Operations

> Registro original: 2026-08-04 · Release Candidate histórica: **RC-AVIZEE-02**  
> Atualização de fechamento: 2026-08-10  
> Status operacional corrente: **OPERATION_BLOCKED**

## 1. Contexto histórico

A operação regular não foi iniciada na Etapa 13 porque a Etapa 12 permanecia `PRODUCTION_BLOCKED`. Esse fato histórico continua válido e não é substituído pela validação técnica local descrita abaixo.

## 2. Banco — estado técnico atualizado

A recertificação pré-Etapa 15 registrada em `546-pre-stage-15-ci-recertification.md` comprovou, no GitHub Actions CI run #83, que o schema da aplicação pode ser:

1. reconstruído a partir de todas as migrations em um Supabase local limpo;
2. populado com a coorte canônica de teste correspondente às 31 famílias / 97 SKUs aprovados;
3. exportado logicamente com `pg_dump -Fc --schema=public`;
4. restaurado em banco isolado com `pg_restore --exit-on-error`;
5. reconciliado por contagens críticas de tabelas da aplicação.

Estado técnico desta camada:

`LOCAL_APPLICATION_SCHEMA_RESTORE_VERIFIED`

Essa evidência encerra a lacuna de **capacidade técnica local de exportar/restaurar o schema da aplicação**, mas não constitui prova de backup do ambiente conectado ou de produção.

## 3. Banco — pendências operacionais ainda abertas

Continuam sem evidência operacional suficiente:

- política/snapshots gerenciados do banco conectado ao projeto;
- cópia lógica periódica independente/off-platform;
- retenção real dos backups;
- criptografia, acesso e custódia da cópia externa;
- restauração a partir de um backup real do ambiente operacional;
- medição real de RPO/RTO.

O conector disponível ao projeto não permite consulta direta ao banco Lovable/Supabase conectado, portanto permanece:

`DATABASE_NOT_DIRECTLY_VERIFIED`

## 4. Storage — estado atual

Nenhuma evidência nova do run #83 certifica objetos de storage. Backup do banco e backup de storage são camadas distintas.

Permanecem pendentes:

- inventário operacional dos buckets usados no ambiente real;
- política de backup/versionamento dos objetos;
- cópia independente quando aplicável;
- ensaio de restauração de arquivo/objeto;
- verificação de metadados, permissões e vínculo dos objetos restaurados aos registros da aplicação.

Status desta camada:

`STORAGE_BACKUP_RESTORE_NOT_OPERATIONALLY_VERIFIED`

## 5. Referência de política

O contrato de planejamento permanece em `120-backup-and-disaster-recovery.md`. Frequências ou valores de RPO/RTO ali apresentados como proposta não devem ser tratados como aprovados ou comprovados enquanto não houver decisão/evidência operacional correspondente.

## 6. Conclusão

A camada técnica de restore lógico do schema da aplicação está validada em ambiente efêmero reproduzível. As camadas de backup real do provedor, cópia off-platform, storage e RPO/RTO continuam bloqueando qualquer certificação de disaster recovery de produção.

Portanto permanecem válidos:

- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.
