# AviZee — Projeto de Catálogo B2B e Site Institucional

Status corrente: **STAGE_15_QUALITY_CERTIFIED**

> Este arquivo aponta para o estado vigente. Relatórios de RC e etapas anteriores permanecem como histórico e não devem ser usados isoladamente como status atual.

## Estado atual

- Etapa 14.1 foi integrada à `main` no PR #1.
- O fechamento integral das Etapas 0–14.1 foi aprovado e mergeado pelo PR #2 no commit `41579eac0d853201bdd10868d9df81402d8ffeab`.
- O checkpoint pós-Lovable foi aprovado e squash-mergeado pelo PR #3 no commit `cb7324918aa212edd64e5cd184457c3f703730bd`.
- O housekeeping final pré-Etapa 15 foi squash-mergeado pelo PR #4 no commit `96b9a5b5c5311ddc6b44ce402abd7b4e4f38be4d`.
- O roadmap das Etapas 15–19 foi aprovado e integrado pelo PR #5 no commit `b34f871ef40c14e9c9d16ac521147fdb5c8a97b3`.
- A coorte pública continua restrita às 31 famílias / 97 SKUs aprovados; registros sem dados confiáveis permanecem contidos e não publicados.
- Páginas consultivas de Soluções e busca global permanecem implementadas e recertificadas.
- Formulário geral de Contato e mapa permanecem fora da v1 por decisão explícita.
- Resend continua aprovado como provider transacional, mas configuração real permanece gate posterior.
- A Etapa 15 — Qualidade Final está tecnicamente certificada no PR #6, aguardando recertificação documental final e merge aprovado.
- Produção e operação permanecem bloqueadas pelos gates externos aplicáveis.

## Fonte corrente de governança

- [541-pre-stage-15-closure-matrix.md](541-pre-stage-15-closure-matrix.md) — matriz integral de fechamento das Etapas 0–14.1.
- [552-approved-roadmap-stages-15-19.md](552-approved-roadmap-stages-15-19.md) — roadmap aprovado para concluir a v1.
- [553-stage-15-quality-final-plan.md](553-stage-15-quality-final-plan.md) — plano, baseline e fechamento da Etapa 15.
- [554-stage-15-seo-final-validation.md](554-stage-15-seo-final-validation.md) — validação técnica de SEO.
- [555-stage-15-analytics-readiness.md](555-stage-15-analytics-readiness.md) — readiness de Analytics consent-first.
- [556-stage-15-accessibility-final-validation.md](556-stage-15-accessibility-final-validation.md) — validação técnica de acessibilidade.
- [557-stage-15-performance-budget-evidence.md](557-stage-15-performance-budget-evidence.md) — evidência de performance.
- [558-stage-15-security-final-validation.md](558-stage-15-security-final-validation.md) — validação técnica de segurança.
- [559-stage-15-executive-report.md](559-stage-15-executive-report.md) — relatório executivo da Etapa 15.

## Governança histórica

Os documentos das Etapas 0–14.1, incluindo release candidates e relatórios de remediação, continuam versionados para rastreabilidade. Quando houver divergência de status entre um documento histórico e os arquivos correntes acima, prevalece `STATUS.md` e a documentação mais recente, sem apagar o registro histórico.

## Progressão restante

Após o merge aprovado da Etapa 15, a sequência da v1 é:

`16 — Readiness de Produção e Gates Externos → 17 — Release Candidate Final, Migração e UAT → 18 — Cutover e Go-Live → 19 — Hypercare, Aceite e Encerramento v1`.

A homologação humana, ambiente produtivo, DNS/e-mail real, revisão jurídica, backups reais, cutover e operação não são antecipados pela certificação técnica da Etapa 15.

## Sobre o projeto

Plataforma B2B para avicultura, focada em catálogo técnico, conteúdo consultivo e geração de solicitações por Lista de Cotação, sem preços públicos, estoque, checkout ou pagamento.

## Change Log

Veja o histórico completo em [16-change-log.md](16-change-log.md).
