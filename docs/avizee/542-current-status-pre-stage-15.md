# 542 — Status corrente pré-Etapa 15

## Fonte corrente de status

Este documento consolida o estado atual do projeto durante o fechamento das Etapas 0–14.1. Documentos anteriores de release candidate e relatórios de etapas permanecem como histórico e não devem ser interpretados isoladamente como status corrente.

A matriz de fechamento detalhada está em `541-pre-stage-15-closure-matrix.md`. A recertificação automatizada mais recente está em `546-pre-stage-15-ci-recertification.md`.

## Estado funcional

- Etapas de fundação, catálogo aprovado, catálogo público, cotação, institucional-base e Central de Conteúdos foram implementadas em nível funcional compatível com continuidade de desenvolvimento.
- Etapa 14.1 foi integrada à `main` pelo PR #1.
- A coorte pública aprovada permanece limitada às 31 famílias / 97 SKUs; registros sem identidade/nome confiável permanecem fora da publicação.
- Retenção de cotações/leads foi aprovada em 24 meses e a automação correspondente foi implementada e testada neste fechamento.
- Nenhuma mudança de layout público, branding, taxonomia aprovada ou modelo comercial está autorizada por este fechamento.

## Estado de qualidade

O HEAD do fechamento foi recertificado com sucesso no GitHub Actions:

- workflow: **CI**;
- run: **#83** (`31430252090`);
- commit certificado: `63b763b80023e60286e19de836ecd7d1c792b992`;
- conclusão: `success`.

Foram observados verdes no mesmo job:

- lint;
- Prettier;
- build Vite/TanStack Start/Nitro;
- TypeScript/typecheck;
- inicialização de Supabase local;
- replay integral das migrations em banco limpo;
- fixture canônico de teste equivalente à coorte aprovada 31 famílias / 97 SKUs;
- ensaio de dump/restore lógico isolado do schema da aplicação;
- inicialização do servidor SSR de teste;
- suíte integral `bun run test`.

A evidência e seus limites estão em `546-pre-stage-15-ci-recertification.md`.

## Estado de backup/restore

A capacidade técnica local de restaurar o schema da aplicação foi comprovada no CI e passa a ser classificada como:

`LOCAL_APPLICATION_SCHEMA_RESTORE_VERIFIED`

Isso não certifica:

- banco conectado/ao vivo;
- snapshots gerenciados do provedor;
- cópia off-platform;
- objetos de storage;
- RPO/RTO reais;
- disaster recovery de produção.

Os detalhes estão em `447-database-and-storage-backup-operations.md` e `448-periodic-restore-validation.md`.

## Estado operacional

As decisões já fornecidas pelo usuário estão registradas em `543-user-confirmations-2026-08-10.md`. Ainda permanecem ações externas, entre elas configuração real de Resend/DNS, criação do canal de privacidade, provisionamento concreto do administrador inicial, backup/storage operacional, UAT e revisão legal final.

O banco Lovable/Supabase conectado também continua sem verificação direta pelo conector disponível:

`DATABASE_NOT_DIRECTLY_VERIFIED`

Até que os gates operacionais aplicáveis sejam encerrados e evidenciados, permanecem válidos:

- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.

## Decisões funcionais ainda abertas

Quatro itens continuam deliberadamente sem inferência e serão solicitados em um único lote após o fechamento técnico interno:

1. páginas consultivas detalhadas de solução (`DEC-07 / DECT-12`);
2. busca global completa ou busca restrita ao catálogo na v1 (`DEC-10`);
3. ativação do formulário geral de contato dentro do layout aprovado;
4. ativação do mapa sob interação dentro do layout aprovado.

## Próxima etapa

A Etapa 15 não será iniciada enquanto o PR de fechamento integral pré-Etapa 15 estiver aberto. O próximo bloco é o hardening técnico interno remanescente e a reconciliação documental mínima.

## Status

`PRE_STAGE_15_CLOSURE_IN_PROGRESS`
