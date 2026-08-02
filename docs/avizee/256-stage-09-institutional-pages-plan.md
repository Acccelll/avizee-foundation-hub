# 256 — Etapa 9: Plano de Implementação da Camada Institucional

Status: `IMPLEMENTADO` (código) / `PENDENTE_DE_APROVAÇÃO` (R-10).
Escopo: Home (PT-01), Sobre (PT-14), Soluções (PT-04 — listagem), Contato (PT-15),
Política de Privacidade e Termos de Uso (rascunho), reforço da camada pública de confiança.

## 1. O que foi implementado

| Rota | Tipo | Situação |
|---|---|---|
| `/` | PT-01 Home | Completa, conectada ao catálogo real (31 famílias / 97 SKUs) |
| `/sobre` | PT-14 | Completa, apenas conteúdo aprovado em `05-business-positioning.md` |
| `/solucoes` | PT-04 (listagem) | Lista aplicações reais e direciona ao catálogo filtrado |
| `/contato` | PT-15 | Estrutura completa; canais marcados como "informação em confirmação" |
| `/politica-de-privacidade` | Legal | Rascunho estruturado, `noindex`, fora do sitemap |
| `/termos-de-uso` | Legal | Rascunho estruturado, `noindex`, fora do sitemap |

## 2. Fonte única de conteúdo

`src/content/institutional.ts` concentra posicionamento, diferenciais, passos da cotação,
CTAs, campos pendentes (Q-08 e Q-13) e a estrutura dos documentos legais. Nenhuma rota
institucional escreve texto de posicionamento diretamente: todas consomem esse módulo, o que
permite auditoria automatizada de vocabulário (`tests/unit/institutional-content.test.ts`).

## 3. Regras aplicadas

- R-03/R-04/R-11: nenhuma menção a preço, carrinho, checkout, estoque, frete ou prazo.
- R-05: nenhuma marca de terceiro; verificação automatizada contra `BRAND_TERMS` em todas as
  rotas públicas.
- R-06: nenhum dado inventado. Telefone, WhatsApp, e-mail, endereço, horário, razão social,
  CNPJ e endereço do controlador aparecem como **informação em confirmação**, nunca preenchidos.
- R-10: nada foi publicado; ambiente permanece `noindex` global via `robots.txt`.
- WCAG 2.2 AA: hierarquia de títulos única por página, foco visível, alvo mínimo de 44 px nos
  CTAs, `aria-labelledby` em todas as seções, sem dependência exclusiva de cor.

## 4. O que NÃO foi implementado (dependência de decisão aberta)

| Item | Decisão bloqueante |
|---|---|
| Missão, visão e valores | Sem texto aprovado (`05`) |
| Páginas de detalhe por solução | DEC-07 / DECT-12 |
| Formulário de contato genérico | Q-08 + política de retenção |
| Mapa e endereço | Q-08 |
| Prazo de resposta comercial | O-10 |
| Central de Conteúdos com artigos | Etapa posterior; 0 artigos aprovados |
