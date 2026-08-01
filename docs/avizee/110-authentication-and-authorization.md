# 110 — Autenticação e Autorização

## 1. Escopo

Somente usuários administrativos. **Não há cadastro público de cliente na v1** — a cotação é
anônima e não cria conta.

## 2. Autenticação

- Provedor nativo do Lovable Cloud; e-mail/senha com verificação obrigatória de e-mail.
- Proteção contra senha vazada (HIBP) habilitada.
- Política de senha: mínimo 12 caracteres, verificação de vazamento, sem expiração compulsória.
- MFA (TOTP) obrigatório para ADMINISTRADOR quando suportado; recomendado aos demais.
- Sessão: expiração por inatividade (30 min no painel) e absoluta (12 h); refresh rotativo.
- Revogação de sessão pelo próprio usuário e pelo administrador.
- Recuperação de senha por link de uso único e curta validade; resposta genérica para evitar
  enumeração de usuários.
- Bloqueio progressivo após tentativas falhas (backoff + bloqueio temporário), registrado em
  `audit_logs`.
- Logout: cancelar consultas em voo, limpar cache do cliente, encerrar sessão, navegar com
  `replace` para a rota de acesso.

## 3. Autorização

- Papéis em **tabela separada** `user_roles` — nunca no perfil (prevenção de escalonamento).
- Função `has_role(user_id, role)` `SECURITY DEFINER` `STABLE` com `search_path` fixo,
  usada nas policies para evitar recursão de RLS.
- RLS habilitada em todas as tabelas; `GRANT` explícito por papel; `anon` recebe `SELECT`
  apenas nas views públicas.
- Verificação de papel **sempre no servidor**; o cliente apenas oculta controles.
- Nenhuma decisão de acesso baseada em `localStorage`, querystring ou credencial embutida.

## 4. Separação de superfícies

Rotas administrativas sob `_authenticated`, `noindex`, sem SSR de dado sensível para usuário
anônimo. Funções de servidor administrativas usam middleware de autenticação; funções públicas
são explicitamente marcadas como públicas e revisadas.
