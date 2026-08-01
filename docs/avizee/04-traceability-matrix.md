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

## Etapa 2 — arquitetura de informação

| ID | Origem | Requisito derivado | Tipo | Onde impacta | Etapa | Status |
|---|---|---|---|---|---|---|
| T-17 | D-018/D-019/D-020 · DEC-01/DEC-04 | Sitemap público e esquema de URLs com a família como página canônica | LOVABLE_RECOMMENDATION | Rotas, SEO, navegação | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-18 | R-05 · RK-01 · DEC-08 | Busca pública sem marca de terceiro, com dicionário de sinônimos funcionais | LOVABLE_RECOMMENDATION | Busca, indexação | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-19 | D-044 · L-03 · RK-07 · DEC-11/DEC-12 | Cotação persistida antes do envio, com protocolo visível e WhatsApp secundário | LOVABLE_RECOMMENDATION | Fluxo de cotação | Etapa 5 | **PENDENTE_DE_APROVAÇÃO** |
| T-20 | RK-08 | DTO público explícito por tipo de página e teste de payload | LOVABLE_RECOMMENDATION | Modelo de dados, API | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-21 | D-042 · RK-18 | Classificação família → categoria → aplicação (DEP-01) antes do catálogo navegável | USER_DECISION | Catálogo, filtros, soluções | **Pré-requisito da Etapa 3** | **Bloqueante** |
| T-22 | D-050 · Q-02 | Placeholder como caminho padrão de imagem, sem bloquear busca nem cotação | USER_DECISION | Catálogo, mídia | Etapa 4 | Documentado |
| T-23 | D-038 · DIV-05 | Mapa de 301 do site atual, incluindo o PDF aposentado | USER_DECISION | Migração, SEO | Etapa de migração | **PENDENTE_DE_APROVAÇÃO** |
| T-24 | D-024 · DEC-18 | Central de Conteúdos com 3 categorias principais e relação artigo ↔ família | LOVABLE_RECOMMENDATION | Módulo de conteúdo | Etapa 7 | **PENDENTE_DE_APROVAÇÃO** |

## Etapa 2.1 — consolidação taxonômica

| ID | Origem | Requisito derivado | Tipo | Onde impacta | Etapa | Status |
|---|---|---|---|---|---|---|
| T-25 | T-21 · DEP-01 · DECT-01 | Matriz família → categoria → aplicação → segmento para 43 famílias | LOVABLE_RECOMMENDATION | Catálogo, filtros, soluções, design system | **Pré-requisito da Etapa 3** | **PENDENTE_DE_APROVAÇÃO** |
| T-26 | R-AG-1 a R-AG-4 · DECT-02/DECT-03 | Desmembramento dos prefixos `AG` e `VR` em famílias funcionais | LOVABLE_RECOMMENDATION | Páginas de família, filtros | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-27 | DECT-08 | Lista código × nome × função dos 34 SKUs órfãos (`PE`, `CN`, `BO`) | USER_DECISION | Catálogo | Bloqueante para 100% de cobertura | **Bloqueado — depende do usuário** |
| T-28 | R-05 · D-035 · DECT-11 | Nome público funcional item a item dos 16 SKUs com marca de terceiro | USER_DECISION | Catálogo, busca, indexação | Etapa 3 | **Bloqueado — depende do usuário** |
| T-29 | DEC-05 rejeitada · DECT-13 | Regras de coexistência entre CAT-06 e o atributo de segmento | LOVABLE_RECOMMENDATION | Navegação, indexação | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-30 | DEC-18 rejeitada · `66` | 123 relações família ↔ categoria editorial sobre as 7 categorias mantidas | LOVABLE_RECOMMENDATION | Central de Conteúdos | Etapa 7 | **PENDENTE_DE_APROVAÇÃO** |

**Correção de T-24**: a redação anterior citava "3 categorias" por antecipar DEC-18. Com DEC-18
rejeitada, T-24 passa a ler **"Central de Conteúdos com as 7 categorias aprovadas e relação
artigo ↔ família"**.

## Etapa 3 — rastreabilidade

| ID | Origem | Requisito derivado | Tipo | Onde impacta | Etapa | Status |
|---|---|---|---|---|---|---|
| T-31 | D-052 (DECT-01 parcial) | Taxonomia estável de 31 famílias / 97 SKUs como única base de conteúdo real dos protótipos | USER_DECISION | Catálogo, protótipos | Etapa 3 | **Aprovado** |
| T-32 | D-053 (DECT-10 controlado) | Design system completo e todos os tipos de página, sem taxonomia provisória | USER_DECISION | Interface | Etapa 3 | **Aprovado** |
| T-33 | D-054 | Fila de normalização para 34 + 16 SKUs e 7 conflitos, sem exclusão definitiva | USER_DECISION | Painel administrativo | Etapas 3 e 4 | **Aprovado** |
| T-34 | D-055 | Numeração `74`–`94` (Etapa 3) e `95`–`130` (Etapa 4) | USER_DECISION | Documentação | Todas | **Aprovado** |
| T-35 | L-01 · `76`/`78` | Cores funcionais derivadas da paleta oficial | LOVABLE_RECOMMENDATION | Formulários, estados | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
| T-36 | `82`/`83` | Inventário de componentes e estados de conteúdo bloqueado que não revelam produtos pendentes | LOVABLE_RECOMMENDATION | Design system | Etapa 3 | **PENDENTE_DE_APROVAÇÃO** |
