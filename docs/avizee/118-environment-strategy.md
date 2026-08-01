# 118 — Estratégia de Ambientes

Detalhe em `architecture/environments.csv`.

| Ambiente | Finalidade | URL | Banco | Storage | Segredos | Indexação | E-mail | Dados |
|---|---|---|---|---|---|---|---|---|
| Desenvolvimento | Construção | local | Instância de dev | Buckets de dev | Valores de dev | Bloqueada | Simulado | Sintéticos |
| Preview | Revisão por alteração | URL de preview do projeto | Dev | Dev | Dev | `Disallow: /` + `noindex` | Simulado | Sintéticos |
| Homologação | Aceite antes de produção | Projeto/branch dedicado | Homologação | Homologação | Homologação | `Disallow: /` + `noindex` + proteção de acesso | Caixa de teste | Anonimizados |
| Produção | Público | Domínio oficial | Produção | Produção | Produção | Permitida | Real | Reais |

## Regras

- Ambientes não produtivos: **nunca** indexáveis, **nunca** com dado pessoal real, **nunca**
  com envio real de e-mail sem controle, **nunca** recebem cotação comercial real.
- Segredos por ambiente, sem reuso; rotação registrada.
- Usuários administrativos de produção não existem em homologação.
- Logs e backup existem em produção e homologação; em dev são descartáveis.
- Migração de dados produção → homologação exige anonimização automatizada.
- Nenhum ambiente é criado nesta etapa.
