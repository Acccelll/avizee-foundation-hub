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


## Atualização 2026-08-01 — DT-18 aprovada com alteração estrutural

Quatro níveis lógicos confirmados, **sem presumir** que um único projeto Lovable Cloud novo
ofereça bancos Test e Live independentes.

| Ambiente | Backend | Dados | Serviços externos | Observações |
|---|---|---|---|---|
| Desenvolvimento | Execução local | Sintéticos | Nenhum envio real | Segredos de desenvolvimento |
| Preview | Backend **não produtivo** | Sintéticos | Nenhum envio real | Frontend temporário, `noindex`, **sem acesso a dados de produção** |
| Homologação | **Projeto ou instância de backend separada** | Dados de teste, usuários de teste | Sandbox | Validação de migrations e releases |
| Produção | Projeto ou instância própria | Reais | Reais | Backup, monitoramento, acesso restrito, deploy aprovado |

**É proibido utilizar a base de produção como base de preview.** Caso a separação exija projetos
Lovable Cloud distintos ou instância gerenciada separada, documentar antes: custos, sincronização
de migrations e procedimento de promoção. Risco associado: RK-51.
