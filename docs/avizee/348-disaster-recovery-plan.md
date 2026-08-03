# 348 — Disaster recovery plan

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

Runbooks de recuperação, cada um com detecção, classificação, contenção, recuperação, comunicação, verificação e pós-incidente. Índice em `stage-11-runbooks.csv`.

| Cenário | Detecção | Contenção | Recuperação |
|---|---|---|---|
| Perda de banco | readiness `unavailable`, alerta de banco | Congelar escrita, página de indisponibilidade | Restaurar snapshot, aplicar migrations, reconciliar |
| Perda de storage | Falha de upload/leitura | Placeholder e leitura degradada | Restaurar objetos e conferir hash |
| Deploy defeituoso | Erro elevado após deploy | Rollback imediato do frontend/backend | Republicar versão anterior da RC |
| Migration defeituosa | Falha na aplicação | Interromper a janela | Nova migration corretiva; nunca editar aplicada |
| Vazamento de segredo | Alerta ou denúncia | Revogar credencial | Rotacionar, auditar uso, registrar incidente |
| Falha de e-mail | Outbox acumulando | Manter registro em banco | Reprocessar após restabelecer provider |
| Acúmulo da outbox | Métrica `outbox_pending` acima do limite | Aumentar processamento | Investigar provider, reprocessar |
| Indisponibilidade de autenticação | Falha de login | Comunicar operação | Aguardar provedor; catálogo público segue |
| Conta administrativa comprometida | Auditoria anômala | Revogar sessões e papéis | Redefinir credencial, exigir MFA, auditar |
| Publicação indevida | Revisão ou denúncia | Despublicar | Invalidar cache e sitemap, registrar |
| Indexação indevida | Verificação de robots | Restaurar `noindex` | Solicitar remoção, revalidar |
| Perda de domínio | Falha de resolução | Comunicar | Recuperar registro; site legado permanece |
| Incidente de privacidade | Denúncia, auditoria | Conter acesso | Fluxo específico do doc. 359 |
