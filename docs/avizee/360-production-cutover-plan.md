# 360 — Production cutover plan

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

Plano preparado para a **futura Etapa 12**. Nada foi executado nesta etapa.

Checklist operacional em `stage-11-cutover-checklist.csv`, com responsável, evidência e critério de validação por item.

## Sequência prevista
1. Data e janela acordadas, com responsáveis designados.
2. Congelamento de conteúdo e de código.
3. Backup completo do banco e do storage, com verificação.
4. Export final e aplicação das migrations em produção.
5. Import final do catálogo autorizado e sincronização do storage.
6. Configuração de variáveis e segredos de produção.
7. Domínio, DNS e TLS.
8. Ativação dos redirects 301 do site legado.
9. `robots.txt` de produção e publicação do sitemap.
10. Monitoramento e alertas ativos antes da abertura.
11. Testes de fumaça e validação funcional.
12. Comunicação às partes interessadas.
13. Rollback disponível durante toda a janela (doc. 361).
