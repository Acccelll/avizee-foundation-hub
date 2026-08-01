# 141 — Autenticação Implementada

Arquivos: `src/auth/contract.ts`, `src/auth/local-provider.server.ts`,
`src/routes/api/auth/*`.

## 1. Contrato estável

`AuthProvider` expõe `verifyCredentials` e `findById`, devolvendo `SessionUser`
(`id` UUID imutável, nome, e-mail, papéis, permissões). Trocar o provedor não altera
nenhum consumidor.

## 2. Provedor atual — adaptador temporário

O provedor local usa usuários administrativos **sintéticos** definidos no servidor.
Nenhum dado pessoal real, nenhuma senha de terceiro, nenhum segredo em código do cliente.

Motivo: DT-14 (provedor definitivo) não estava decidida quando a fundação foi construída.
Registrado como desvio DV-05-01 em `155`. Com o banco agora ativo (`151`), a substituição
pelo provedor gerenciado é o primeiro item de fundação a revisitar.

## 3. Não enumeração de contas

Formato inválido, e-mail inexistente e senha incorreta produzem **a mesma** resposta
`UNAUTHENTICATED`. A mensagem não distingue os casos.

## 4. Limitação de tentativas

Cinco tentativas por janela de 15 minutos, por combinação origem + e-mail. Excedido,
responde `RATE_LIMITED` e registra evento de auditoria. Limitação conhecida: contador em
memória por instância (DV-05-03).

## 5. Eventos auditados

`auth.login.success`, `auth.login.failure`, `auth.rate_limited`, `auth.logout`.
A senha nunca chega ao log: o redator do `logger` a substitui antes da emissão.

## 6. Ausente por decisão

Autocadastro público, recuperação de senha por e-mail (depende de DEP-T1) e MFA/AAL2
(planejado em `110`, exigido apenas para papéis privilegiados em produção).
