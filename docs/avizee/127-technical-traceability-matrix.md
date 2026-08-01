# 127 — Matriz de Rastreabilidade Técnica

| Requisito | Decisão | Entidade | Componente | API | Página | Teste | Risco | Incremento |
|---|---|---|---|---|---|---|---|---|
| Nenhuma marca de terceiro pública (R-05) | D-004, D-035 | `products.internal_brand`, `product_codes` | View pública + serializer | `v_public_products` | Todas as públicas | Suite R-05 (API, HTML, busca, sitemap, JSON-LD, WhatsApp) | RK-05 | 2, 3 |
| Sem e-commerce (R-04) | D-006 | `quotations` sem preço | Lista de cotação | `submitQuotation` | Família, SKU, /cotacao | E2E 4, 5, 6 | RK-09 | 4 |
| SKU não é chave primária | D-034 | `products.id uuid`, `product_codes` | — | — | — | Integração de importação | RK-13 | 1, 2 |
| Conflito bloqueia só o registro | D-037 | `product_code_conflicts` | Badge de indisponível | — | Família | E2E 12 | RK-23 | 2 |
| Imagem reprovada nunca pública | D-033, R-07 | `media_assets.review_status` | Resolver de imagem | Storage privado | Todas | E2E 10 | RK-11 | 2 |
| Placeholder não bloqueia produto | D-033 | `product_images` | Placeholder oficial | — | Família, SKU | Unitário de resolução | RK-12 | 3 |
| Montserrat convencional self-host | D-031, D-036 | — | Layout raiz | — | Todas | Teste de rede (sem Alternates) | RK-18 | 1 |
| Cores funcionais restritas | D-056 | — | Tokens semânticos | — | Todas | Contraste + revisão visual | RK-31 | 1, 7 |
| WCAG 2.2 AA | D-058 | — | Todos | — | Todas | axe-core + manual | RK-20 | 7 |
| 6 categorias públicas | DEC/D-052 | `product_categories` | Navegação | `v_public_categories` | /produtos | Integração de taxonomia | RK-25 | 2 |
| 7 categorias editoriais | DEC-18 rejeitada | `editorial_categories` | Navegação editorial | — | /conteudos | Seed test | — | 6 |
| Banco é fonte da cotação | — | `quotations` | Painel comercial | `submitQuotation` | /cotacao | E2E 5, 6 | RK-09 | 4 |
| Mapa só após interação | D-051 | `settings` | Bloco de mapa | — | /contato | E2E 15 | RK-19 | 5 |
| Sem credencial antiga | Q-01/O-27 | Secrets manager | — | — | — | Scan de segredo | RK-15 | 1 |
| Retenção e consentimento | `113` | `consent_records` | Checkbox opcional | `submitQuotation` | /cotacao | Integração de consentimento | RK-21 | 4 |
| PDF antigo não publicado | D-038 | `redirects` | — | — | /produtos | E2E 13 | RK-14 | 8 |
