# 340 — Cookie consent and third party inventory

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Inventário real

| Item | Tipo | Finalidade | Duração | Essencial |
|---|---|---|---|---|
| Sessão de autenticação (Supabase) | localStorage | Login administrativo | até expirar/sair | Sim |
| `avizee.quote-list` | localStorage | Lista de cotação do visitante | 30 dias | Sim (função solicitada) |
| Preferência de mapa | localStorage | Lembrar consentimento de carregar o Maps | até revogação | Sim |

Nenhum cookie de rastreamento, publicidade ou analytics está ativo. Nenhum script de terceiro é carregado sem interação explícita.

## Banner
Não há cookies opcionais ativos, portanto **nenhum banner genérico foi criado** — criar banner sem inventário seria incorreto. Se e quando o Analytics for aprovado, o mecanismo de consentimento com bloqueio prévio, revogação, registro de preferência e acessibilidade passa a ser obrigatório e a política deve ser atualizada (PENDENTE_DE_APROVAÇÃO).

## Google Maps
Carregamento apenas após interação, com botão acessível por teclado, rótulo claro, fallback textual com endereço pendente e link externo. Bloqueio de terceiros não quebra a página.
