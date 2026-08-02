# 181 — Controles de Segurança do Catálogo

| Controle | Estado |
|---|---|
| RLS habilitada em todas as tabelas do catálogo | Sim |
| GRANT explícito por tabela e papel | Sim |
| Escrita apenas após verificação de permissão no servidor | Sim |
| Auditoria imutável | Sim, por gatilho |
| Injeção de fórmula em CSV | Neutralizada |
| Segredos no bundle | Nenhum; chaves de serviço só no servidor |
| Enumeração de usuário no login | Não ocorre |
| Redação de segredo em log | Sim; e-mail mascarado |
| Exposição de código de origem | Nenhuma (`is_public = false`) |

Advertências do linter de banco: quatro funções `SECURITY DEFINER` executáveis por usuários
autenticados (`has_role`, `has_any_role`, `can_read_catalog`, `can_read_internal`). São
pré-existentes e necessárias para as próprias políticas de RLS; recebem apenas o identificador
do usuário e devolvem booleano. Mantidas de forma consciente.
