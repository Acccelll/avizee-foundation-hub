# 123 — Estratégia de Testes

## 1. Camadas

| Camada | Alvo | Ferramenta prevista |
|---|---|---|
| Unitário | Validadores, normalizadores, geração de protocolo, resolução de imagem, herança de especificação | Vitest |
| Componente | Componentes do design system e estados | Vitest + Testing Library |
| Integração | Funções de servidor, RLS, permissões, importação | Vitest com banco de teste |
| API | Contratos públicos e administrativos | Testes de contrato |
| E2E | Jornadas completas | Playwright |
| SEO | Head, canonical, JSON-LD, sitemap, redirects | Testes de asserção sobre HTML |
| Acessibilidade | axe-core por rota-tipo + manual | Automático + checklist |
| Performance | Orçamento por rota-tipo | Lighthouse CI |
| Segurança | Vazamento R-05, segredo no bundle, dependências | Suite dedicada bloqueante |

## 2. Testes obrigatórios do requisito R-05

Para cada superfície (API pública, HTML SSR, busca, sitemap, JSON-LD, OG, WhatsApp, export):
asserção de ausência de todos os termos da lista de marcas internas e dos campos
`internal_brand`, `supplier`, `original_code`, `internal_notes`.

## 3. Fluxos E2E mínimos

1. Busca por SKU · 2. Busca por aplicação · 3. Seleção de variação ·
4. Adicionar à cotação · 5. Enviar cotação · 6. Falha de cotação (servidor indisponível) ·
7. Artigo relacionado a produto · 8. Publicação de artigo · 9. Upload de imagem ·
10. Imagem reprovada não publicada · 11. Usuário sem permissão ·
12. Importação com conflito · 13. Redirecionamento antigo · 14. Página 404 ·
15. Mapa carregado apenas por interação.

## 4. Dados de teste

Sintéticos e anonimizados; nenhum dado pessoal real; catálogo reduzido representativo com
pelo menos um caso de cada estado (`PUBLISHED`, `BLOCKED_BY_CODE`, `BLOCKED_BY_IDENTITY`,
sem imagem, sob consulta).

## 5. Cobertura

Meta: 80% em validação, cotação, permissões e importação; 100% dos testes R-05 e dos 15
fluxos E2E executando em cada release.
