# 151 — Ativação do Banco e Prontidão de Dados

## 1. Situação

O banco gerenciado (Postgres) foi **ativado** ao final da Etapa 5, após a aprovação de
DT-02 (D-064). Antes disso a fundação operava sem persistência, o que motivou os
adaptadores temporários de autenticação e auditoria.

## 2. O que a ativação entrega

| Recurso | Estado |
|---|---|
| Postgres gerenciado | disponível |
| Cliente de navegador (chave publicável, RLS aplicada) | gerado |
| Cliente autenticado de servidor (middleware bearer) | gerado |
| Cliente administrativo de servidor (bypassa RLS) | gerado, uso restrito |
| Storage privado | disponível, sem bucket criado |
| Migrations versionadas | mecanismo disponível |

## 3. O que **não** foi feito nesta etapa

Nenhuma tabela foi criada. Nenhuma RLS foi escrita. Nenhum dado foi inserido. Nenhum
bucket foi criado. Isso é deliberado: o esquema do catálogo pertence à Etapa 6 e criá-lo
aqui contrariaria o escopo aprovado.

## 4. Regras obrigatórias já fixadas para a primeira migration

1. RLS habilitada em **toda** tabela exposta, com política **deny-by-default**.
2. `GRANT` explícito na mesma migration de cada `CREATE TABLE`.
3. Papel em tabela separada (`user_roles`), nunca coluna de perfil; verificação por
   função `security definer`.
4. SKU é atributo, **nunca** chave primária (D-034). Chave é UUID imutável.
5. Nenhuma coluna de preço, desconto, frete, total ou estoque (R-04).
6. Separação física entre dados públicos e administrativos via views públicas que
   simplesmente não contêm as colunas internas (R-05).
7. Chave de serviço restrita ao servidor, jamais enviada ao navegador.
8. Soft delete e auditoria conforme `101`.

## 5. Efeito sobre desvios da Etapa 5

Com o banco disponível, DV-05-01 (provedor de autenticação sintético), DV-05-05 (sem
revogação de sessão) e DV-05-06 (auditoria só em log) deixam de ser inevitáveis e passam
a ser dívida a quitar na Etapa 6.
