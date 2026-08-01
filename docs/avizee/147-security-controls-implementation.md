# 147 — Controles de Segurança Implementados

Origem: `112-security-architecture.md`, `33-security-findings.md`.

## 1. Controles ativos

| Controle | Implementação |
|---|---|
| Segredo fora do cliente | leitura só em `*.server.ts`; validação fail-fast |
| Segredo fraco em ambiente sério | exceção quando `APP_ENV` é staging/produção sem `AUTH_SESSION_SECRET` |
| Sessão | cookie HttpOnly assinado (HMAC), comparação em tempo constante |
| CSRF | middleware global para server functions |
| Rate limiting | 5 tentativas / 15 min em `/api/auth/login` |
| Não enumeração de contas | resposta idêntica para todos os casos de falha |
| Validação de entrada | `zod` no servidor, não apenas no formulário |
| Redação de log | senha, token, cookie, segredo; e-mail mascarado |
| Erro sem vazamento | `AppError` com mensagens neutras |
| Indexação | negada fora de produção, sem exceção configurável |
| Storage | objeto nasce privado; nenhuma URL pública emitida para privado |
| Serviço externo | tudo desligado por padrão; captcha simulado reprova |

## 2. Achado herdado

**RK-15 / Q-01** — senha SMTP em texto claro no site PHP legado. O novo projeto não
contém a credencial. A **revogação** da credencial antiga permanece pendente com o
cliente (RK-42) e bloqueia o cutover, não esta etapa.

## 3. Limitações honestas

| Limitação | Efeito | Registro |
|---|---|---|
| Rate limit em memória | contagem por instância; múltiplos workers diluem o limite | DV-05-03 |
| Sem revogação de sessão por `jti` | logout não invalida cookie de outro dispositivo | DV-05-05 |
| Sem MFA | exigido para papéis privilegiados em produção | `110` |
| Sem cabeçalhos CSP/HSTS próprios | dependem da camada de publicação | DV-05-07 |

## 4. Não implementado (correto para esta etapa)

Validação de upload, MIME real, prevenção de path traversal, limite de linhas de
importação e prevenção de injeção de fórmula em CSV. Nenhum upload ou importação existe
ainda; esses controles nascem junto com o recurso na Etapa 6.
