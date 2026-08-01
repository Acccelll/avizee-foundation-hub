# 15 — Critérios de Aceite

## Etapa 0 — Constituição do Projeto

| # | Critério | Situação |
|---|---|---|
| 1 | Todos os anexos relevantes inventariados | **Atendido com ressalva** — inventariados e com status registrado; 6 fontes marcadas `NÃO_RECEBIDO` (`03-source-inventory.md`) |
| 2 | Decisões aprovadas documentadas | Atendido — `01-approved-decisions.md` (D-001…D-030) |
| 3 | Recomendações separadas de decisões | Atendido — recomendações isoladas em `13-open-decisions.md` com status `PENDENTE_DE_APROVAÇÃO` |
| 4 | Fontes rastreadas | Atendido — `03` e `04` |
| 5 | Regras não negociáveis explícitas | Atendido — `02-non-negotiable-rules.md` (R-01…R-13) |
| 6 | Branding documentado | Atendido — `10-brand-guidelines.md` (com pendências de asset registradas) |
| 7 | Restrição de marcas documentada | Atendido — R-05, D-011/D-012/D-013 |
| 8 | Política de imagens documentada | Atendido — `09-image-policy.md` |
| 9 | Estrutura conceitual do catálogo documentada | Atendido — `07-product-taxonomy.md` |
| 10 | Posicionamento documentado | Atendido — `05-business-positioning.md` |
| 11 | Blog e função estratégica documentados | Atendido — `08-content-strategy.md` |
| 12 | Escopo e fora de escopo separados | Atendido — `11-scope-and-out-of-scope.md` |
| 13 | Riscos registrados | Atendido — `12-risk-register.md` (RK-01…RK-14) |
| 14 | Decisões abertas listadas | Atendido — `13-open-decisions.md` |
| 15 | Memória permanente criada | Atendido — `/docs/avizee/` com protocolo de consulta no `README.md` |
| 16 | Nenhum código funcional implementado | Atendido |
| 17 | Nenhuma alteração visual aplicada | Atendido |

**Conclusão**: Etapa 0 concluída, condicionada ao reconhecimento pelo usuário de que os itens
O-21…O-25 (`13-open-decisions.md`) permanecem bloqueando a Etapa 1.

## Etapa 1 — Auditoria e Inventário

Critérios e situação em `39-stage-01-executive-report.md` (15 critérios, todos atendidos).

## Critérios permanentes (todas as etapas seguintes)
1. Nenhuma marca de terceiro em qualquer superfície pública.
2. Nenhum preço, valor ou faixa em qualquer superfície pública.
3. Nenhuma promessa de prazo, frete ou disponibilidade.
4. Vocabulário de "Lista de Cotação" respeitado em toda a interface.
5. Paleta oficial e Montserrat como únicas fontes de estilo.
6. Avicultura com destaque superior aos segmentos complementares.
7. Toda decisão nova registrada em `01` e em `16`.

## Etapa 1 — Auditoria e Inventário: **CONCLUÍDA** (2026-08-01)

| Critério | Status |
|---|---|
| Todas as fontes auditadas (9) | Atendido |
| Matriz provisória de produtos (174 SKUs) | Atendido — `26` e `data/products-provisional.csv` |
| Inventário de imagens (188) com status | Atendido — `27` e `data/images.csv` |
| Duplicidades e divergências sem reconciliação silenciosa | Atendido — `36` |
| Achados de segurança, SEO, acessibilidade e performance | Atendido — `33` a `35`, `31` |
| Perguntas abertas registradas e respondidas | Atendido — `38` e `40` (D-039 a D-051) |
| Nenhuma implementação, layout ou banco de dados | Atendido |

## Etapa 2 — Arquitetura de Informação: **CONCLUÍDA COMO PROPOSTA** (2026-08-01)

| Critério de aceite | Status |
|---|---|
| Documentação anterior consultada | Atendido — `41` §1 |
| Sitemap público completo | Atendido — `42`, `data/sitemap.csv` |
| Arquitetura administrativa conceitual | Atendido — `43` |
| Menu desktop e mobile como proposta | Atendido — `44` §1 e §2 |
| Rodapé estruturado, com `DADO_PENDENTE` | Atendido — `44` §3 |
| Tipos de página definidos | Atendido — `47` (PT-01 a PT-17) |
| Jornadas principais mapeadas | Atendido — `53` (J-1 a J-9) |
| Fluxo de cotação mapeado | Atendido — `50` |
| Busca especificada | Atendido — `49` |
| Filtros classificados | Atendido — `49` §5 e §6 |
| Produtos, soluções e conteúdos relacionados | Atendido — `52` |
| URLs propostas | Atendido — `45` |
| Redirecionamentos mapeados | Atendido — `46`, `data/url-migrations.csv` |
| Estratégia de indexação documentada | Atendido — `55` |
| V1 priorizada | Atendido — `57` |
| Decisões pendentes separadas | Atendido — `58` (DEC-01 a DEC-18) |
| Recomendações não aplicadas | Atendido |
| Nenhum layout, código, produto importado ou normalização definitiva | Atendido |
| Documentação permanente atualizada | Atendido — 10 documentos |


## Critérios adicionais após a aprovação da Etapa 3 (2026-08-01)

1. **Acessibilidade**: WCAG **2.2 AA** obrigatória como gate de qualidade; nenhuma tela é aceita
   sem os critérios de 2.2 aplicáveis (2.4.11, 2.4.13, 2.5.7, 2.5.8, 3.3.7, 3.3.8).
2. **Cor funcional**: apenas os quatro tokens de feedback aprovados; verde e azul somente em
   feedback, alerta, estado e indicador. Qualquer par abaixo do contraste mínimo é defeito.
3. **Tipografia**: uma única família (Montserrat). Carregar segunda família, inclusive
   monoespaçada, reprova a entrega.
4. **Tokens**: nenhuma cor institucional ou funcional literal em componente quando houver token.
5. **Protótipos**: cada tipo de página passa por revisão visual antes da implementação produtiva.
6. **Checklist**: evidência verificável, não confirmação declaratória; dispensa de item crítico
   exige justificativa, registro, aprovação e plano de correção.


## Etapa 4 — Critérios de Aceite

| # | Critério | Situação |
|---|---|---|
| 1 | Etapa 3 aprovada | Atendido — D-056 a D-061 |
| 2 | Design aprovado preservado | Atendido — nenhuma alteração de token, cor, tipografia, componente, protótipo ou jornada |
| 3 | Capacidades do Lovable verificadas | Atendido — `96` com matriz necessidade → capacidade |
| 4 | Alternativas comparadas | Atendido — `97`, três alternativas |
| 5 | Arquitetura recomendada apresentada | Atendido — `98`, `99` |
| 6 | Modelo de dados completo | Atendido — `101`, `102`, `architecture/entities.csv` |
| 7 | SKU não é chave primária | Atendido — UUID; SKU como código com histórico |
| 8 | Campos públicos e privados classificados | Atendido — `103`, `fields-classification.csv` |
| 9 | Marcas internas protegidas | Atendido — controle estrutural + suite de testes R-05 |
| 10 | Catálogo modelado | Atendido — `104` |
| 11 | Especificações dinâmicas modeladas | Atendido — `105`, modelo híbrido |
| 12 | Busca especificada | Atendido — `106` |
| 13 | Cotação especificada | Atendido — `107` |
| 14 | Central de Conteúdos especificada | Atendido — `108` |
| 15 | Imagens e documentos especificados | Atendido — `109` |
| 16 | Autenticação e permissões planejadas | Atendido — `110`, `111` |
| 17 | Segurança documentada | Atendido — `112` |
| 18 | Privacidade e retenção documentadas | Atendido com ressalva — depende de DEP-T5 |
| 19 | Ambientes definidos | Atendido — `118` |
| 20 | Backup definido | Atendido — `120`; teste ainda não executado (RK-41) |
| 21 | Monitoramento definido | Atendido — `121` |
| 22 | Testes definidos | Atendido — `123`, 15 fluxos E2E |
| 23 | CI/CD definido | Atendido — `124` |
| 24 | Importação e migração planejadas | Atendido — `122` |
| 25 | Plano incremental completo | Atendido — `126`, 8 incrementos com gate |
| 26 | Riscos atualizados | Atendido — `128`, RK-33 a RK-50 |
| 27 | Decisões pendentes separadas | Atendido — `129`, DT-01 a DT-21 |
| 28 | Nenhum código produtivo implementado | Atendido — `src/` intocado |
| 29 | Nenhum banco produtivo criado | Atendido |
| 30 | Nenhuma integração real ativada | Atendido |
| 31 | Nenhum layout aprovado alterado | Atendido |
