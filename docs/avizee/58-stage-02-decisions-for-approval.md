# 58 — Decisões da Etapa 2 para Aprovação

Todas com status **PENDENTE_DE_APROVAÇÃO**. Dados: `data/stage-02-decisions.csv`.
Nenhuma foi executada. Nada aqui é decisão aprovada.

---

### DEC-01 — Sitemap público definitivo
**Contexto**: proposta em `42`, com 9 páginas fixas + taxonomia + editorial.
**Alternativas**: (A) sitemap proposto; (B) acrescentar hub de segmentos e páginas por segmento;
(C) reduzir à Home, Produtos, Sobre e Contato.
**Recomendação**: A. **Impacto**: define todo o trabalho da Etapa 3.
**Riscos**: B cria páginas vazias (P-7); C perde a Central de Conteúdos, aprovada em D-024.
**Dependências**: DEP-01, DEP-02.

### DEC-02 — Menu principal
**Alternativas**: (A) 5 itens + CTA + busca, sem "Início"; (B) incluir "Início";
(C) fundir Soluções dentro de Produtos.
**Recomendação**: A. **Riscos**: usuários acostumados a "Início" — mitigado pelo logotipo clicável.

### DEC-03 — Mega menu
**Alternativas**: (A) painel com 6 categorias; (B) mega menu com famílias; (C) menu simples.
**Recomendação**: A. **Impacto**: manutenção e mobile. **Riscos**: B exige nomes de família
normalizados, que não existem (RK-18).

### DEC-04 — Estrutura de URLs (endereça L-04)
**Alternativas**: (A) `/produtos/{categoria}/{familia}`; (B) `/produtos/{familia}`.
**Recomendação**: A. **Riscos**: recategorizar exige 301. **Dependências**: DEP-01.

### DEC-05 — Categoria "Linhas complementares"
**Alternativas**: (A) manter como categoria; (B) converter em filtro de segmento e distribuir os
itens `BV` nas categorias funcionais.
**Recomendação**: B. **Impacto**: altera a lista aprovada em `07-product-taxonomy.md` —
por isso exige aprovação explícita. **Riscos**: retrabalho de classificação.

### DEC-06 — Páginas individuais de SKU
**Alternativas**: (A) nenhuma na v1; (B) só por exceção, com 3+ critérios de `45` §4;
(C) uma por SKU.
**Recomendação**: B. **Riscos**: C gera ~174 páginas finas e canibalização.

### DEC-07 — Páginas de solução
**Alternativas**: (A) 3 (vacinação, pulverização, pesagem e medição); (B) 4, incluindo incubação e
ovoscopia; (C) nenhuma na v1, só filtros.
**Recomendação**: A, com B condicionada a conteúdo. **Dependências**: DEP-02.

### DEC-08 — Marca de terceiro na busca pública
**Alternativas**: (A) marca não indexada e sem sinônimo, com estado "sem correspondência" e
sugestão funcional; (B) marca como sinônimo interno que redireciona para a família.
**Recomendação**: A. **Impacto**: comprador que só conhece a marca pode não achar o item.
**Riscos**: B contraria R-05 e RK-01. Se o usuário quiser B, precisa decidir assumindo o risco.

### DEC-09 — Páginas de segmento
**Recomendação**: nenhuma na v1; segmento como filtro e selo (`48` §2), bovinocultura como
evolução, suinocultura sem página. **Riscos**: percepção de que a empresa abandonou os
complementares — mitigado por menções em `/sobre` e `/contato`.

### DEC-10 — Busca global × busca só de produtos
**Recomendação**: global, com produtos priorizados. **Riscos**: ruído editorial nos resultados.

### DEC-11 — Envio da lista inteira por WhatsApp
**Alternativas**: (A) registrar a cotação e só então abrir o WhatsApp com o protocolo;
(B) abrir o WhatsApp sem registrar; (C) não oferecer o envio da lista por WhatsApp.
**Recomendação**: A. **Riscos**: B perde o lead se a conversa não for retomada (RK-07, D-044).
**Dependências**: DEP-06.

### DEC-12 — Campos da cotação
Lista preliminar em `50` §3. **Recomendação**: aprovar o conjunto mínimo; cada campo extra é
passivo de LGPD. **Dependências**: DEP-05, D-047.

### DEC-13 — Persistência da lista
**Alternativas**: (A) local, 30 dias; (B) só na sessão; (C) vinculada a conta.
**Recomendação**: A. **Riscos**: C exige autenticação, fora de escopo na v1.

### DEC-14 — Páginas legais necessárias
**Recomendação**: Privacidade (obrigatória) + Cookies + Termos. **Dependências**: DEP-05.

### DEC-15 — Dados estruturados de produto
**Alternativas**: (A) sem `Product/Offer`, usando Organization, Breadcrumb, Article e ItemList;
(B) `Product` sem preço.
**Recomendação**: A. **Riscos**: B tende a gerar rich result incompleto e reforça a expectativa
de e-commerce (RK-14).

### DEC-16 — Autores, tags, materiais, glossário e FAQ
**Recomendação**: autores, materiais e glossário como EVOLUÇÃO; tags internas; FAQ como bloco
dentro de `/cotacao` e `/contato`, sem página própria na v1.

### DEC-17 — Estrutura do painel
**Recomendação**: agrupamento de `43` (Painel · Catálogo · Mídia · Conteúdo · Comercial ·
Operação). **Dependências**: papéis e permissões (O-08, O-09), fora desta etapa.

### DEC-18 — Categorias editoriais da v1
**Recomendação**: 3 principais + 1 condicional; "Curiosidades" vira tag; "Notícias e mercado" e
"Produtos e aplicações" não publicam como categoria (`51` §1).
**Impacto**: ajusta a lista aprovada em `08-content-strategy.md` — exige aprovação explícita.
