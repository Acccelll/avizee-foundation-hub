# 111 — Matriz de Papéis e Permissões

Detalhe por ação em `architecture/permissions.csv`. Princípio: menor privilégio.

| Recurso / Ação | ADMIN | GESTOR_CATALOGO | EDITOR | AUTOR | REVISOR_TECNICO | COMERCIAL | AUDITOR |
|---|---|---|---|---|---|---|---|
| Configurações do sistema | CRUD | — | — | — | — | — | Leitura |
| Usuários e papéis | CRUD | — | — | — | — | — | Leitura |
| Famílias e categorias | CRUD | CRUD | Leitura | Leitura | Leitura | Leitura | Leitura |
| SKUs / variações | CRUD | CRUD | Leitura | Leitura | Leitura | Leitura | Leitura |
| Definições de especificação | CRUD | CRUD | — | — | Leitura | — | Leitura |
| Publicar produto | Sim | Sim (com gate) | — | — | — | — | — |
| Importação de catálogo | Sim | Sim | — | — | — | — | Leitura de logs |
| Upload de mídia | Sim | Sim | Sim | Sim (própria) | — | — | — |
| Aprovar/reprovar imagem | Sim | Sim | — | — | — | — | Leitura |
| Artigos | CRUD | Leitura | CRUD | CRU próprio | Leitura + comentário | Leitura | Leitura |
| Publicar/agendar artigo | Sim | — | Sim | **Não** | — | — | — |
| Aprovar tecnicamente | Sim | — | — | — | Sim | — | — |
| Páginas institucionais (blocos) | CRUD | — | CRUD | — | — | — | Leitura |
| Cotações — ver | Sim | — | — | — | — | Sim | Leitura |
| Cotações — atualizar status/nota | Sim | — | — | — | — | Sim | — |
| Dados pessoais de cotação | Sim | **Não** | **Não** | **Não** | **Não** | Sim | **Não** (mascarado) |
| Campos ADMIN_ONLY (marca/fornecedor) | Sim | Sim | **Não** | **Não** | **Não** | **Não** | Mascarado |
| Redirecionamentos e SEO técnico | CRUD | — | CRU | — | — | — | Leitura |
| Logs de auditoria | Leitura | — | — | — | — | — | Leitura |
| Exclusão física de mídia | Sim | — | — | — | — | — | — |

Regras: nenhum papel acumula publicação de conteúdo e gestão de usuários exceto ADMIN;
AUTOR nunca publica; AUDITOR nunca escreve; COMERCIAL não altera catálogo nem conteúdo.


## Atualização 2026-08-01 — DT-15 aprovada

Sete papéis confirmados (ADMINISTRADOR, GESTOR_DE_CATÁLOGO, EDITOR, AUTOR, REVISOR_TÉCNICO,
COMERCIAL, AUDITOR). **Permissões granulares são a fonte de autorização**; papéis são conjuntos
iniciais. Ocultar botão não substitui autorização no backend. Menor privilégio; segregação entre
edição, aprovação e publicação; alterações de papel auditadas; nenhum papel criado
automaticamente com acesso total; service role nunca representa usuário administrativo.
**A matriz detalhada será validada antes da criação dos usuários reais.**
