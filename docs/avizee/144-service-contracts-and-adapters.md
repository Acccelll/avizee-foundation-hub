# 144 — Contratos de Serviço e Adaptadores

Arquivos: `src/services/contracts.ts`, `src/services/adapters.server.ts`.

## 1. Princípio

Todo serviço externo entra por uma interface. A implementação desta etapa é **simulada e
identificada**, nunca disfarçada de real.

## 2. Adaptadores

| Contrato | Implementação | Comportamento |
|---|---|---|
| `EmailProvider` | `dev-log` | registra a intenção de envio; **lança exceção se `APP_ENV=production`** |
| `StorageProvider` | `local-private` | tudo nasce privado; nunca emite URL pública para objeto privado |
| `CaptchaProvider` | `null` | **recusa por padrão** em vez de aprovar silenciosamente |
| `AnalyticsProvider` | `disabled` | nenhum evento sai da aplicação |
| `MapProvider` | `disabled` | nenhum embed de terceiro |
| `NotificationProvider` | `null` | WhatsApp não ativado |

## 3. Escolhas defensivas

Duas decisões merecem registro porque invertem o default habitual:

- O captcha simulado **reprova**. Um mock que aprova criaria falsa sensação de proteção.
- O e-mail simulado **quebra em produção**. Impede que um deploy produtivo saia enviando
  nada silenciosamente.

## 4. Dependências que travam a substituição

| Contrato | Dependência |
|---|---|
| E-mail | DEP-T1 — fornecedor não definido |
| Storage | DEP-T3 — estrutura e custo não definidos |
| Retenção de dados | DEP-T5 — prazos legais não definidos |

Nenhuma dessas foi contornada com escolha própria.
