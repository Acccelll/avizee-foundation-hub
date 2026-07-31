# 04 — Matriz de Rastreabilidade

| ID | Decisão | Requisito derivado | Fonte | Evidência | Impacto | Etapa responsável | Status |
|---|---|---|---|---|---|---|---|
| T-01 | D-001/D-002 | Home, navegação e institucional priorizam avicultura; complementares em nível secundário | USER_DECISION | Prompt Etapa 0, §4.1 | Arquitetura de informação, Home, menu | Etapa 2 (AI) / Etapa 4 (UI) | Documentado |
| T-02 | D-004 | Formulários e textos B2B; campos de empresa na cotação | USER_DECISION | §4.2 | Formulários, copy | Etapa 3 / Etapa 5 | Documentado |
| T-03 | D-006/R-03/R-04 | Nenhum componente de preço, carrinho ou checkout no sistema | USER_DECISION | §4.4 | Modelo de dados e UI | Etapa 2+ | Documentado |
| T-04 | D-007/D-008 | Módulo "Lista de Cotação" com persistência local + envio | USER_DECISION | §4.5 | Feature core | Etapa 5 | Documentado |
| T-05 | D-009/D-027/R-11 | Textos de aviso obrigatórios em confirmação e páginas de produto | USER_DECISION | §4.3, §4.5 | Copy legal/comercial | Etapa 5 | Documentado |
| T-06 | D-010 | Bloco de diferenciais com os 3 itens aprovados | USER_DECISION | §4.6 | Home, Sobre | Etapa 4 | Documentado |
| T-07 | D-011/D-012/D-013/R-05 | Separação estrita entre campos públicos e internos; auditoria automatizada de marcas | USER_DECISION | §6 | Modelo de dados, API, SEO, build | Etapa 2 e Etapa 6 | Documentado |
| T-08 | D-014/D-015/D-016/D-017/R-06/R-07 | Design system com tokens semânticos da paleta oficial + Montserrat | BRANDING | §7 | Design system | Etapa 4 | Documentado |
| T-09 | D-018/D-019/D-020 | Modelo Segmento/Solução/Categoria/Família/SKU + busca multicritério | USER_DECISION | §8, §9 | Modelo de dados, busca, rotas | Etapa 2 e Etapa 3 | Documentado |
| T-10 | D-021/D-022/D-023 | Campo de status de imagem, placeholder oficial, aviso de imagem ilustrativa | USER_DECISION | §10 | Modelo de dados, UI | Etapa 3 e Etapa 4 | Documentado |
| T-11 | D-024/D-025/D-026 | Central de Conteúdos com relacionamentos artigo↔catálogo | USER_DECISION | §11, §12 | Módulo de conteúdo | Etapa 7 | Documentado |
| T-12 | D-028 | Escopo funcional e fora de escopo congelados para a v1 | USER_DECISION | §13, §14 | Planejamento | Etapa 1 | Documentado |
| T-13 | D-029/D-030/R-13 | `/docs/avizee/` como fonte única de verdade, lida antes de cada etapa | USER_DECISION | §1, §3, §19 | Processo | Todas | **Implementado nesta etapa** |
| T-14 | DIV-05 | Plano de redirecionamento 301 e preservação de SEO na migração | CURRENT_SITE | Site atual em `.html` | SEO | Etapa de migração | Bloqueado por S-02 |
| T-15 | S-03 ausente | Auditoria detalhada do catálogo | CATALOG | `03-source-inventory.md` | Catálogo completo | Etapa 1 | **Bloqueado** |
| T-16 | S-05/S-07 ausentes | Classificação de imagens nos 8 estados | IMAGE_ASSET | `03-source-inventory.md` | Publicação de produtos | Etapa 3 | **Bloqueado** |
