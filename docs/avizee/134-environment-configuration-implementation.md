# 134 — Ambientes e Configuração

Origem normativa: `118-environment-strategy.md` (D-063, DT-18 com alteração).

## 1. Quatro níveis lógicos

| Nível | `APP_ENV` | Indexável | Banco | Serviços externos |
|---|---|---|---|---|
| Desenvolvimento | `development` | não | instância de desenvolvimento | simulados |
| Preview | `preview` | não | instância de desenvolvimento | simulados |
| Homologação | `staging` | não | instância própria | homologação |
| Produção | `production` | sim | instância própria | reais |

Regra aprovada e implementada: **preview nunca aponta para o banco de produção**.

## 2. Leitura de configuração

- Cliente: `src/lib/env.ts` — só `import.meta.env.VITE_*`. Default seguro:
  nunca assume `production`.
- Servidor: `src/lib/env.server.ts` — validação `zod` fail-fast; a mensagem de erro
  cita apenas **nomes** de variáveis, jamais valores.

## 3. Variáveis

| Variável | Escopo | Obrigatória | Observação |
|---|---|---|---|
| `VITE_APP_ENV` | cliente | não | default derivado do modo de build |
| `VITE_APP_VERSION` | cliente | não | exibida em diagnóstico |
| `APP_ENV` | servidor | não | default `development` |
| `AUTH_SESSION_SECRET` | servidor | **sim em staging/produção** | mínimo 32 caracteres |
| `AUTH_SESSION_TTL_MINUTES` | servidor | não | default 480 |
| `AUTH_MAX_ATTEMPTS` | servidor | não | default 5 |
| `EMAIL_PROVIDER` / `STORAGE_PROVIDER` / `CAPTCHA_PROVIDER` | servidor | não | apenas valores simulados aceitos nesta etapa |
| `LOG_LEVEL` | servidor | não | default `info` |
| `SUPABASE_*` / `VITE_SUPABASE_*` | ambos | sim | gerenciadas pela plataforma (`151`) |

## 4. Proteção contra segredo fraco

Existe um segredo de sessão de desenvolvimento embutido. Ele é **recusado com exceção**
quando `APP_ENV` é `staging` ou `production`, o que impede subir ambiente sério com
segredo conhecido.

## 5. Pendência

A separação física de instâncias entre homologação e produção exigida por DT-18 depende
de provisionamento. Registrada em `155` como DV-05-04.
