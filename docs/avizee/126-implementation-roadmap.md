# 126 — Plano de Implementação

Detalhe tabular em `architecture/implementation-increments.csv`.
**Nenhum incremento é iniciado nesta etapa.** Cada um termina em gate de aprovação.

## Incremento 1 — Fundação técnica
Objetivo: projeto, ambientes, banco, autenticação, tokens aprovados, rotas base, CI/CD.
Dependências: DT-01 a DT-04, DT-19. Entregáveis: migrations iniciais, papéis e permissões,
layout raiz com tokens, pipeline com gates. Aceite: login administrativo funcional, RLS ativa,
CI bloqueando falhas. Riscos: RLS mal configurada. Testes: permissões, build, smoke.

## Incremento 2 — Administração de catálogo
Taxonomia, famílias, SKUs, especificações, mídia, importação com dry run.
Aceite: importar as 31 famílias / 97 SKUs em homologação, com bloqueados preservados e
nenhum campo ADMIN_ONLY acessível a papel não autorizado.

## Incremento 3 — Catálogo público
Páginas de categoria, família, SKU, busca, filtros, relacionados, SEO por rota.
Aceite: HTML indexável, testes R-05 verdes, placeholder correto, paginação indexável.

## Incremento 4 — Cotação
Lista, formulário, persistência, protocolo, outbox, e-mail, painel comercial.
Aceite: protocolo único, idempotência, falha de e-mail não invalida a cotação, nenhum preço.

## Incremento 5 — Institucional
Home, Sobre, Soluções, Contato, mapa sob interação, blocos editáveis.
Aceite: edição por blocos sem alterar a estrutura visual aprovada.

## Incremento 6 — Central de Conteúdos
CMS, artigos, 7 categorias, autores, revisões, agendamento, SEO editorial.
Aceite: publicação agendada funcionando, falha mantém `SCHEDULED` com alerta.

## Incremento 7 — Qualidade
SEO técnico completo, analytics (sem ativar coleta sem consentimento), acessibilidade,
performance, segurança. Aceite: WCAG 2.2 AA nas rotas-tipo, orçamento cumprido.

## Incremento 8 — Migração e lançamento
Importação definitiva, redirecionamentos, testes finais, domínio, monitoramento, backup testado.
Aceite: 301 críticos funcionando, sitemap válido, alertas ativos, restauração testada.

## Sequenciamento
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8, com 5 podendo correr em paralelo a 3/4 se houver capacidade.
Documentação atualizada em `/docs/avizee/` é entregável obrigatório de cada incremento.
