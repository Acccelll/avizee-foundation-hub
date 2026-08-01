# 112 — Arquitetura de Segurança

## 1. Ameaças e controles

| Ameaça | Controle |
|---|---|
| SQL injection | Consultas parametrizadas; sem SQL concatenado; validação Zod |
| XSS | Sem `dangerouslySetInnerHTML` com conteúdo de usuário; corpo editorial em JSON estruturado renderizado por componentes permitidos; sanitização no servidor |
| CSRF | Cookies `SameSite=Lax`, mutações apenas por função de servidor autenticada, sem endpoint GET com efeito colateral |
| SSRF | Nenhuma requisição de servidor a URL fornecida por usuário; allowlist se necessário no futuro |
| Upload malicioso | Allowlist de MIME (jpeg, png, webp, pdf), validação de assinatura do arquivo, limite de tamanho, **SVG proibido**, upload só autenticado |
| Enumeração de usuários | Respostas genéricas em login e recuperação |
| Força bruta | Backoff progressivo, bloqueio temporário, log de falhas |
| Spam de formulário | Honeypot, tempo mínimo, rate limit, validação semântica, captcha se necessário |
| Vazamento de dado interno | Views públicas sem colunas ADMIN_ONLY, serializer allowlist, testes automáticos |
| Exposição de storage | Bucket privado por padrão, RLS em `storage.objects`, URL assinada de curta duração |
| IDOR | Toda leitura por ID valida papel e propriedade no servidor |
| Mass assignment | Schemas de entrada com allowlist de campos; nunca `spread` do body |
| Acesso admin indevido | `has_role` no servidor + RLS; painel não confia no cliente |
| Scripts incorporados | CSP restritiva; sem script inline sem nonce; sem tag de terceiro por padrão |
| Dependências vulneráveis | Auditoria em CI, política de `125` |
| Segredo no frontend | Nada de `process.env` no cliente; apenas `VITE_*` publicáveis; scan de bundle no gate |

## 2. Cabeçalhos

`Content-Security-Policy` (default-src 'self'; img-src 'self' data: storage; font-src 'self';
frame-src apenas Google Maps **após interação**; connect-src 'self' + API do Cloud),
`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
`Permissions-Policy` restritiva.

## 3. Transporte e sessão

HTTPS obrigatório; cookies `Secure`, `HttpOnly`, `SameSite=Lax`; CORS fechado (mesma origem),
exceto endpoints públicos explicitamente definidos.

## 4. Credenciais legadas

Nenhuma credencial do site antigo é reutilizada. **RK-15 (senha SMTP exposta) só é encerrada
com evidência de revogação** — Q-01/O-27 permanecem abertos.

## 5. Testes de segurança do requisito R-05

Suite obrigatória e bloqueante: API pública, HTML SSR, resposta de busca, sitemap, JSON-LD,
feed de imagens, mensagem de WhatsApp e export público não contêm nenhum termo da lista de
marcas internas (lista mantida em tabela ADMIN_ONLY, usada apenas em teste).
