# 128 — Riscos Técnicos da Etapa 4

Controles em `architecture/risk-controls.csv`. Escala: Baixa/Média/Alta.

| ID | Risco | Prob. | Impacto | Prevenção | Detecção | Resposta | Responsável | Status |
|---|---|---|---|---|---|---|---|---|
| RK-33 | Vazamento de marca interna em superfície pública | Média | **Alto** | Views públicas sem a coluna, serializer allowlist | Suite R-05 em CI | Bloquear release, corrigir view | Técnico | Aberto — controlado |
| RK-34 | Limitação de SEO por renderização inadequada | Baixa | Alto | SSR/SSG definidos em `100` | Auditoria de HTML em CI | Ajustar estratégia da rota | Técnico | Controlado |
| RK-35 | Importação incorreta corromper catálogo | Média | Alto | Dry run + rollback por lote | Relatório de importação | Rollback e reimportar | Catálogo | Aberto |
| RK-36 | Conflito de SKU publicado indevidamente | Média | Alto | Estado `BLOCKED_BY_CODE` | Teste de integração | Despublicar e bloquear | Catálogo | Aberto |
| RK-37 | Imagem sem direito publicada | Média | Alto | `rights_status` obrigatório para publicar | Revisão + teste E2E 10 | Remover e reprovar | Conteúdo | Aberto |
| RK-38 | Falha de cotação perder lead | Baixa | **Alto** | Transação + idempotência + lista preservada | Alerta de erro | Reprocessar, contatar | Técnico | Controlado |
| RK-39 | Falha de e-mail sem percepção | Média | Médio | Outbox com retry e dead letter | Alerta de fila | Reenvio manual pelo painel | Técnico | Controlado |
| RK-40 | Dependência de serviço externo indisponível | Média | Médio | Degradação graciosa | Health check | Fallback documentado | Técnico | Aberto |
| RK-41 | Perda de dados sem backup testado | Baixa | **Alto** | Backup + teste trimestral | Checklist mensal | Restaurar e revisar | Técnico | **Aberto** |
| RK-42 | Credenciais antigas ainda válidas | **Alta** | Alto | Revogação e rotação | Evidência documental | Revogar imediatamente | AviZee | **Aberto (Q-01/O-27)** |
| RK-43 | Publicação indevida de rascunho | Média | Médio | Gate de publicação + `noindex` | Teste de SEO | Despublicar + redirect | Editorial | Controlado |
| RK-44 | Conteúdo técnico sem revisão | Média | Médio | `TECHNICAL_REVIEW` obrigatório | Fluxo do CMS | Despublicar | Editorial | Controlado |
| RK-45 | Exposição de dado pessoal em log/analytics | Média | **Alto** | Proibição explícita + redaction | Revisão de código + teste | Purgar e corrigir | Técnico | Controlado |
| RK-46 | Baixa performance no mobile | Média | Médio | Orçamento + paginação + WebP | Lighthouse CI | Otimizar antes do release | Técnico | Controlado |
| RK-47 | Falha no agendamento de artigo | Média | Baixo | `pg_cron` + fallback manual | Alerta de job | Publicar manualmente | Editorial | Controlado |
| RK-48 | Redirecionamento incorreto ou em loop | Média | Médio | Validação de cadeia e teste | Monitor de 404 | Corrigir tabela | Técnico | Controlado |
| RK-49 | `pg_cron` indisponível no plano contratado | Média | Médio | Verificar antes do Incremento 1 | Teste de ambiente | Publicação manual + worker por health check | Técnico | **Aberto (DEP-T2)** |
| RK-50 | Processamento de imagem inviável no runtime | Média | Médio | Pré-processar no upload (WASM) | Teste de upload | Transformação do storage | Técnico | Aberto |
