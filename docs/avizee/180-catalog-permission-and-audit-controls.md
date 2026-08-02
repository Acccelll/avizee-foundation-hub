# 180 — Permissões e Auditoria do Catálogo

- 21 permissões finas e 7 papéis; `ADMINISTRADOR` recebe todas, os demais por menor privilégio.
- A autorização ocorre no servidor antes de cada escrita (`authorize()`), e só então o cliente
  privilegiado é usado. A leitura ocorre como o próprio usuário, sob RLS.
- Papéis vivem em `user_roles`, nunca no perfil, e são lidos por funções `SECURITY DEFINER`.
- `audit_logs` é imutável por gatilho; guarda ator mascarado, ação, entidade, campos alterados,
  valores anteriores e novos, resultado e contexto.
- Toda operação de importação (simulação, execução, rollback) está auditada.
