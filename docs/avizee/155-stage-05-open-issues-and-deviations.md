# 155 — Etapa 5: Desvios e Pendências

Cada desvio registra requisito original, limitação, impacto, alternativa adotada, risco e
plano de correção. Nenhum foi contornado silenciosamente.

## DV-05-01 — Provedor de autenticação sintético

- **Requisito**: autenticação administrativa real.
- **Limitação**: DT-14 indefinida e banco inexistente no momento da construção.
- **Alternativa**: provedor local com usuários sintéticos atrás de contrato estável.
- **Impacto**: não há gestão de usuários, nem redefinição de senha, nem MFA.
- **Risco**: médio. Não pode chegar a homologação.
- **Correção**: migrar para o provedor gerenciado na Etapa 6, com `user_roles` em tabela
  separada. Banco já disponível (`151`).

## DV-05-02 — Ausência de itálico

- **Requisito**: tipografia completa.
- **Limitação**: acervo Montserrat recebido sem itálicos; itálico sintético proibido.
- **Alternativa**: ênfase por peso.
- **Risco**: baixo.
- **Correção**: obter o eixo itálico ou confirmar formalmente a ausência.

## DV-05-03 — Rate limiting em memória

- **Impacto**: com múltiplas instâncias o limite efetivo se multiplica.
- **Risco**: médio para força bruta.
- **Correção**: mover o contador para o banco ou store compartilhado.

## DV-05-04 — Instâncias de homologação e produção não provisionadas

- **Requisito**: DT-18 exige instâncias separadas e proíbe preview sobre banco de produção.
- **Estado**: apenas a instância de desenvolvimento existe.
- **Correção**: provisionar antes de qualquer homologação.

## DV-05-05 — Sem revogação de sessão

- **Impacto**: sair em um dispositivo não invalida a sessão em outro.
- **Correção**: tabela de sessões revogadas indexada por `jti`.

## DV-05-06 — Auditoria apenas em log

- **Requisito**: trilha de auditoria consultável e retida.
- **Impacto**: sem consulta por entidade, sem retenção garantida, sem imutabilidade.
- **Risco**: alto para a Etapa 6, que exige auditar catálogo e importação.
- **Correção**: persistir em `audit_logs` na primeira migration da Etapa 6. **Bloqueante
  para o aceite da Etapa 6.**

## DV-05-07 — Cabeçalhos de segurança HTTP

- **Estado**: CSP, HSTS e `X-Content-Type-Options` dependem da camada de publicação.
- **Correção**: definir e verificar antes de produção.

## DV-05-08 — Performance não medida

- **Estado**: baseline estrutural sem medição sintética nem de campo.
- **Correção**: instrumentar antes de declarar conformidade com `116`.

## DV-05-09 — Sem testes automatizados

- **Requisito**: testes na fundação.
- **Estado**: nenhuma suíte existe.
- **Risco**: alto.
- **Correção**: criar a suíte na primeira fatia da Etapa 6, priorizando não vazamento e
  permissões. **Bloqueante para o aceite da Etapa 6.**

## Dependências externas (sem prazo definido pela equipe técnica)

| ID | Dependência | Bloqueia |
|---|---|---|
| DEP-T1 | Fornecedor de e-mail transacional | envio real, redefinição de senha, cotação |
| DEP-T3 | Estrutura e custo de storage | upload de mídia em produção |
| DEP-T5 | Prazos legais de retenção | política de expurgo |
| RK-42 / Q-01 | Evidência de revogação das credenciais antigas | cutover do site atual |
