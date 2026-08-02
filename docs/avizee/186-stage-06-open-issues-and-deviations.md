# 186 — Pendências e Desvios da Etapa 6

| ID | Desvio | Impacto | Encaminhamento |
|---|---|---|---|
| DV-06-01 | 11 nomes públicos repetidos entre SKUs da mesma família (29 registros), por ausência de atributo diferenciador na matriz aprovada | Baixo no admin; impeditivo para publicação individual | Resolução administrativa caso a caso; proibido inferir atributo |
| DV-06-02 | Reaplicação após rollback mantém 97 linhas soft-deleted no banco | Contagem bruta de `products` = 194, sendo 97 ativas | Aceito como histórico; limpeza opcional futura |
| DV-06-03 | Auditoria de acessibilidade automatizada (axe-core) não executada no catálogo | Risco de regressão não detectada | Executar na Etapa 7 |
| DV-06-04 | Medição de performance com Lighthouse não executada | Sem linha de base pública | Executar na Etapa 7 |
| DV-06-05 | Nenhuma imagem aprovada vinculada; 97 SKUs com placeholder | Catálogo publicável, porém visualmente incompleto | Depende de Q-02 (direitos de imagem) |
| DV-06-06 | 77 SKUs e 12 famílias fora do canônico | Escopo aprovado; não é falha | Fila de normalização documental |
| DV-06-07 | Descrição pública vazia em 97 SKUs | Conteúdo pendente | Redação editorial, nunca inferida |

Advertências do linter de banco sobre funções `SECURITY DEFINER` permanecem aceitas e
justificadas no documento 181.
