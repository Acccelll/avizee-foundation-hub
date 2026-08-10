# 546 — Recertificação técnica de CI pré-Etapa 15

> Data: 2026-08-10  
> Branch: `pre-stage-15-close-previous-stages`  
> PR: #2 — Fechamento integral das Etapas 0–14.1 antes da Etapa 15  
> Commit certificado: `63b763b80023e60286e19de836ecd7d1c792b992`  
> GitHub Actions: workflow **CI**, run **#83**, run id `31430252090`  
> Resultado observado: **SUCCESS**

## 1. Escopo desta evidência

Esta evidência registra a recertificação técnica automatizada do HEAD indicado acima em ambiente efêmero de CI. Ela não representa homologação humana, certificação do banco Lovable/Supabase ao vivo, aceite de produção ou validação de infraestrutura externa.

Nenhuma alteração de layout público, branding, taxonomia aprovada ou modelo comercial foi necessária para obter este resultado.

## 2. Gates observados como verdes

No job `validate` do run #83 foram concluídos com sucesso:

1. instalação congelada de dependências;
2. lint semântico dos arquivos TypeScript alterados;
3. verificação de Prettier dos arquivos alterados;
4. build completo Vite/TanStack Start/Nitro;
5. TypeScript com `tsc --noEmit`;
6. inicialização de Supabase local;
7. replay integral das migrations versionadas em banco limpo;
8. carregamento controlado da coorte canônica aprovada de catálogo;
9. ensaio de backup/restore lógico isolado do schema da aplicação;
10. inicialização do servidor SSR de teste;
11. execução integral de `bun run test`;
12. limpeza dos serviços locais.

O workflow e o job terminaram com conclusão `success`. Esta documentação não replica uma contagem numérica de testes porque o relatório JUnit do runner não é um artefato versionado do repositório; o fato certificável aqui é o gate integral `Tests = success` do run identificado acima.

## 3. Coorte canônica de catálogo no CI

Para que o banco efêmero represente o contrato público já aprovado, o CI utiliza exclusivamente:

- fonte: `docs/avizee/data/canonical/import-products-v1.csv`;
- coorte aprovada: `V1-31-97`;
- expectativa: 31 famílias / 97 SKUs;
- pipeline oficial: `runDryRun` → `runExecute`;
- modo dedicado: `APP_ENV=test bun scripts/ops/canonical-import.ts ci-seed`.

O modo `ci-seed` é explicitamente bloqueado fora de `APP_ENV=test`. Ele não é migration, seed de produção nem mecanismo de publicação real. Sua finalidade é reproduzir em CI o catálogo público já aprovado para que testes de views, busca, autocomplete e cotação sejam executados contra dados coerentes com a decisão vigente.

## 4. Ensaio de backup e restore lógico

O run #83 validou tecnicamente um ensaio isolado do schema da aplicação:

1. `pg_dump -Fc --schema=public` da base Supabase local após migrations e fixture;
2. criação de banco de restore separado;
3. reconstrução somente das dependências externas mínimas necessárias ao contrato do schema público (`extensions`, `unaccent`, `pg_trgm`, contrato mínimo de `auth.users` e `auth.uid()`);
4. cópia somente dos UUIDs de usuários necessários às FKs — sem credenciais ou dados de autenticação;
5. `pg_restore --no-owner --no-acl --exit-on-error`;
6. validação da quantidade mínima de tabelas públicas;
7. reconciliação das contagens de `product_families`, `products`, `quotations`, `content_articles` e `audit_logs` entre origem e restore;
8. descarte do banco de ensaio.

Resultado desta camada:

`LOCAL_APPLICATION_SCHEMA_RESTORE_VERIFIED`

## 5. Limites explícitos da certificação

O run #83 **não** comprova:

- aplicação das migrations no banco Lovable/Supabase conectado ao projeto;
- estado ou integridade do banco ao vivo;
- snapshots gerenciados do provedor;
- cópia off-platform de backup;
- backup/restore de objetos de storage;
- RPO/RTO reais em ambiente operacional;
- restauração completa dos subsistemas gerenciados do Supabase;
- UAT/aceite humano;
- configuração real de Resend, DNS ou demais provedores externos;
- prontidão para produção.

Portanto permanecem válidos:

- `DATABASE_NOT_DIRECTLY_VERIFIED` para o ambiente conectado;
- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.

## 6. Conclusão

A dívida anterior de **recertificação técnica integral do HEAD em ambiente local reproduzível** fica encerrada para o commit certificado neste documento.

O item de backup/restore deixa de ser uma lacuna técnica absoluta: o restore lógico do schema da aplicação está comprovado em CI. Permanecem como pendências operacionais distintas a estratégia real do provedor, cópia independente/off-platform, storage, RPO/RTO real e teste em ambiente operacional autorizado.

Status desta evidência:

`PRE_STAGE_15_CI_RECERTIFIED`
