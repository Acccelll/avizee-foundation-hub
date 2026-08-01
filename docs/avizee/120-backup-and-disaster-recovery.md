# 120 — Backup e Recuperação

## 1. Escopo

Banco de dados, storage (`private-media` e `public-media`), configuração, segredos
(inventário, não valores) e migrations no repositório.

## 2. Política proposta

| Item | Frequência | Retenção | Criptografia |
|---|---|---|---|
| Snapshot do banco | Diário automático (gerenciado) | 7–30 dias conforme plano | Em repouso |
| Export lógico do banco | Semanal, para armazenamento independente | 90 dias | Em repouso + em trânsito |
| Storage | Semanal (inventário + cópia dos aprovados) | 90 dias | Em repouso |
| Configuração e migrations | Por commit (repositório) | Permanente | — |

## 3. Objetivos

RPO ≤ 24 h (banco) · RTO ≤ 8 h (site público) e ≤ 24 h (painel). Valores propostos,
`PENDENTE_DE_APROVAÇÃO`.

## 4. Teste de restauração

Trimestral, em ambiente de homologação, com relatório: tempo real de restauração,
integridade referencial, contagem de registros por tabela, amostragem de imagens.
**Backup não testado não é considerado backup.** Nenhuma evidência de backup do site atual
existe hoje — RK aberto.

## 5. Cenários cobertos

| Cenário | Resposta |
|---|---|
| Erro humano (exclusão/edição) | Soft delete + auditoria + restauração pontual |
| Importação incorreta | Rollback do `import_job` por lote |
| Exclusão de mídia | Retenção do arquivo privado + histórico |
| Comprometimento de conta | Revogação de sessões, rotação de segredos, auditoria |
| Falha do provedor | Export independente permite reconstrução |
| Release defeituosa | Rollback de deploy + migration de reversão |

## 6. Responsabilidade

Responsável técnico designado pela AviZee (a definir). Verificação mensal do sucesso dos
backups registrada em checklist de manutenção (`126`).


## Atualização 2026-08-01 — DT-19 aprovada com complemento

Aprovados: backup/snapshot diário do banco, exportação lógica semanal, cópia fora do ambiente
principal, teste de restauração trimestral, registro de evidência e definição de RPO e RTO.

**Complemento obrigatório — o backup do banco não cobre os objetos de storage.** Implementar
também: inventário de arquivos; backup dos arquivos públicos; backup dos arquivos privados;
backup dos metadados; backup dos documentos; teste de restauração do storage; validação de
correspondência banco × arquivo.

Escopo total do backup: banco, autenticação aplicável, storage, configurações documentadas,
migrations e segredos por procedimento seguro (**nunca** exportados em texto aberto).
“Backup executado” não conta sem teste de restauração. Risco associado: RK-52.
