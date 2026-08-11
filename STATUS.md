# AviZee — Status corrente

Status: **PRE_STAGE_15_BASELINE_CONSOLIDATED**

Este arquivo é a ponte curta para o estado vigente do projeto. Relatórios de etapas e release candidates anteriores permanecem como histórico.

Fontes vigentes:

- `docs/avizee/541-pre-stage-15-closure-matrix.md` — matriz integral de fechamento;
- `docs/avizee/542-current-status-pre-stage-15.md` — status corrente;
- `docs/avizee/543-user-confirmations-2026-08-10.md` — dados e decisões confirmados;
- `docs/avizee/547-mcp-request-hardening.md` — hardening da superfície MCP;
- `docs/avizee/549-approved-functional-decisions-pre-stage-15.md` — decisões funcionais finais aprovadas;
- `docs/avizee/550-pre-stage-15-functional-closure-recertification.md` — recertificação funcional do PR #2;
- `docs/avizee/551-post-lovable-recertification.md` — auditoria e recertificação do primeiro bloco pós-merge feito pelo Lovable.

O PR #3 foi aprovado e squash-mergeado na `main` no commit `cb7324918aa212edd64e5cd184457c3f703730bd`, consolidando o primeiro checkpoint pós-Lovable.

Após esse merge, o Lovable aplicou um novo ajuste técnico em três commits, encerrando em `523877545fd67a13d4d2f0cfe61a26ae454277ca`. O efeito líquido adiciona um middleware cliente de autenticação tolerante à indisponibilidade da configuração pública do Supabase e passa a usá-lo nas server functions, evitando falha total das rotas públicas quando não há sessão/configuração cliente disponível.

Esse ajuste foi recertificado integralmente no HEAD `8c4c895c0644c507f75f985f1f12be580754517a` pelo CI #230 (`31484961340`), com lint, Prettier, build, typecheck, replay limpo das migrations, fixture 31 famílias / 97 SKUs, restore lógico, SSR e suíte integral de testes verdes.

As Etapas 0–14.1 estão funcional e tecnicamente consolidadas no baseline pré-Etapa 15. Não resta fechamento interno conhecido dessas etapas. A Etapa 15 ainda não foi iniciada formalmente, mas está liberada para início em branch própria após a integração deste housekeeping.

Produção e operação continuam bloqueadas pelos gates externos aplicáveis. Este arquivo não autoriza deploy, publicação, DNS ou migração para produção.
