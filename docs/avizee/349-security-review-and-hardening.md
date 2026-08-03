# 349 — Security review and hardening

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

| Controle | Estado | Evidência |
|---|---|---|
| Autenticação | Gerenciada, sem cadastro anônimo | Testes de sessão |
| MFA | Disponível; exigência para papéis privilegiados pendente de ativação operacional | Doc. 337 da Etapa 6 |
| Sessão | TTL configurável, limite de tentativas | `env.server.ts` |
| RBAC | 7 papéis, 32 permissões, validação sempre no servidor | `tests/security` |
| RLS | Habilitada em todas as tabelas públicas com GRANTs explícitos | Migrations |
| CSRF | Server functions same-origin, sem formulário cross-site | Revisão |
| XSS | Blocos editoriais sanitizados por schema; sem HTML livre | `src/content/blocks.ts` |
| SQL injection | Acesso por PostgREST/funções parametrizadas | Revisão |
| IDOR | Acesso por RLS e escopo de papel, nunca por id opaco | `tests/security` |
| Mass assignment | Validação Zod com allowlist de campos | Revisão |
| Uploads | Tipo, tamanho e destino restritos; quarentena por direito | Política de imagens |
| SSRF / path traversal | Sem fetch por URL de usuário; caminhos derivados de UUID | Revisão |
| Rate limiting | Cotação: 5/10 min e 20/dia por hash de IP | `submit_quotation` |
| Enumeração | Protocolo aleatório de 8 caracteres em alfabeto sem ambiguidade | Revisão |
| Cache | Rotas administrativas `no-store` | Revisão |
| Headers / CORS | Same-origin; sem CORS aberto | Revisão |
| Segredos e logs | Redação obrigatória; nenhum segredo no bundle | `logger.ts` |

## Pendência crítica herdada
**O-27 / RK-15**: credencial SMTP exposta no código legado sem prova de revogação — classificada P0 (B11-05). Não é resolvível dentro do repositório novo.
