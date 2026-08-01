# 93 — Decisões da Etapa 3 para Aprovação

Todas com status **`PENDENTE_DE_APROVAÇÃO`**. Nenhuma foi executada: `src/` permanece intocado,
nenhum token foi aplicado, nenhum componente foi codificado, nenhuma rota foi criada.

A liberação da Etapa 3 (D-052 e D-053) autorizou **produzir** estas propostas. Ela **não** as
aprova antecipadamente.

---

### DES-01 — Conjunto de tokens de design
**Documento**: `76-design-tokens.md`.
**Proposta**: adotar o inventário completo de tokens (cor, tipografia, espaçamento base 4px,
raio, sombra, borda, z-index, duração, breakpoints) em HSL, nomeado semanticamente.
**Alternativas**: (A) aprovar o conjunto; (B) aprovar só os tokens derivados diretamente da
marca e adiar os derivados; (C) rejeitar e usar valores ad hoc por tela.
**Recomendação**: A. **Riscos**: C reintroduz cor fora da marca a cada tela nova.
**Impacto**: base de tudo que vier depois; é a única decisão que trava as demais.

### DES-02 — Cores funcionais derivadas da paleta (encerra L-01) — **crítica**
**Documento**: `76` §4 e `78` §§ de feedback.
**Proposta**: erro = Vinho; aviso = Terracota; informação = Terracota clareado; sucesso = Preto,
sem introduzir verde. Nenhuma cor nova entra na marca.
**Alternativas**: (A) aprovar a derivação proposta; (B) autorizar duas cores funcionais fora da
paleta (verde e azul) restritas a mensagens de sistema; (C) não usar cor de feedback, apenas
ícone e texto.
**Recomendação**: A, reforçada pela regra de nunca usar cor como único portador de informação.
**Riscos**: A faz "erro" e "marca" compartilharem o Vinho — o usuário precisa aceitar
expressamente esse risco de leitura; B viola a paleta aprovada; C reduz a legibilidade de
formulário longo. **Depende de decisão expressa.**

### DES-03 — Sistema tipográfico
**Documento**: `77-typography-system.md`.
**Proposta**: escala tipográfica, pesos utilizados, entrelinhas, tratamento monoespaçado do
código de SKU e self-host WOFF2 com preload dos pesos críticos (D-046).
**Alternativas**: (A) aprovar a escala; (B) reduzir o número de pesos carregados.
**Recomendação**: A. **Riscos**: pesos demais penalizam a performance — `77` já limita o conjunto.

### DES-04 — Sistema de cor, contraste e combinações proibidas
**Documento**: `78-color-and-contrast-system.md`.
**Proposta**: papéis semânticos por cor, superfícies, estados interativos, tabela de contraste
WCAG 2.1 AA e lista explícita de combinações proibidas. Tema escuro fora da v1.
**Recomendação**: aprovar. **Impacto**: qualquer combinação fora da tabela passa a ser defeito.

### DES-05 — Grid, espaçamento e layout
**Documento**: `79-grid-spacing-and-layout.md`.
**Proposta**: grid de 12 colunas, containers e gutters por breakpoint, escala de espaçamento
base 4px, ritmo vertical e densidade das tabelas de variação.
**Recomendação**: aprovar.

### DES-06 — Iconografia e linguagem gráfica
**Documento**: `80-iconography-and-graphic-language.md`.
**Proposta**: `lucide-react` como biblioteca base, regras de traço, tamanho e cor, ícone nunca
isolado como único rótulo, e uso do símbolo oficial restrito à identidade — sem criar grafismo
novo (D-032).
**Alternativas**: (A) lucide; (B) conjunto ilustrado próprio.
**Recomendação**: A. **Riscos**: B exige produção e manutenção sem ganho para um catálogo técnico.

### DES-07 — Especificação de imagem e placeholder
**Documento**: `81-image-and-placeholder-specification.md`.
**Proposta**: proporções, recortes, formatos, carregamento e a especificação visual do
placeholder oficial para SKU sem imagem aprovada (D-041, D-050).
**Recomendação**: aprovar. **Impacto**: o placeholder é visível em parte relevante do catálogo;
sua qualidade determina a percepção de completude.

### DES-08 — Inventário de componentes
**Documento**: `82-component-inventory.md`.
**Proposta**: catálogo de componentes do design system (navegação, busca, filtro, card de
produto, tabela de variações, lista de cotação, formulário, blocos institucionais e editoriais).
**Recomendação**: aprovar o inventário como escopo de construção da Etapa 4.

### DES-09 — Estados de componente, incluindo conteúdo bloqueado
**Documento**: `83-component-states-and-behaviors.md`.
**Proposta**: estados de carregamento, vazio, erro, foco, desabilitado e os estados genéricos de
"item em revisão", "sem imagem" e "conteúdo pendente", que **não revelam nem simulam** os
produtos das 12 famílias pendentes (D-053, D-054).
**Recomendação**: aprovar. **Riscos**: RK-28 — a redação de cada estado precisa ser conferida
para não vazar código ou nome de registro bloqueado.

### DES-10 — Wireframes e protótipos das páginas públicas
**Documentos**: `84-public-page-wireframes.md`, `85-public-page-prototypes.md`.
**Proposta**: estrutura e aplicação visual de todos os tipos de página públicos aprovados,
usando como conteúdo real apenas as 31 famílias e 97 SKUs.
**Recomendação**: aprovar por tipo de página, não em bloco — o mesmo método que funcionou na
Etapa 2.1.

### DES-11 — Protótipos da interface administrativa
**Documento**: `86-admin-interface-prototypes.md`.
**Proposta**: telas de catálogo, revisão de registros bloqueados, imagens e cotações recebidas.
**Alternativas**: (A) aprovar o conjunto; (B) reduzir a v1 do painel a catálogo e cotações.
**Recomendação**: A, porque a fila de normalização (D-054) precisa de uma superfície própria.
**Dependências**: O-08 e O-09 (usuários, papéis e permissões) seguem abertas.

### DES-12 — Comportamento responsivo
**Documento**: `87-responsive-behavior.md`.
**Proposta**: estratégia mobile-first, transformação componente a componente e critérios de
aceite por breakpoint.
**Recomendação**: aprovar. **Impacto**: a tabela de variações de SKU é o ponto crítico em telas
pequenas e concentra o risco de usabilidade.

### DES-13 — Especificação de acessibilidade WCAG 2.1 AA
**Documento**: `88-accessibility-design-specification.md`.
**Proposta**: adotar AA como meta obrigatória e não como aspiração, com checklist por
componente, corrigindo os achados de `34-accessibility-findings.md`.
**Alternativas**: (A) AA obrigatório; (B) AA como meta não bloqueante.
**Recomendação**: A. **Riscos**: B faz a dívida de acessibilidade voltar exatamente como está no
site atual.

### DES-14 — Diretrizes de microcopy
**Documento**: `89-microcopy-and-content-ui-guidelines.md`.
**Proposta**: voz, tom, rótulos canônicos de botão, textos de estado e a lista de textos
proibidos (preço, prazo, marca de terceiro, superlativo).
**Recomendação**: aprovar. **Impacto**: é o que impede que a interface prometa prazo comercial
antes de O-10 ser decidido.

### DES-15 — Checklist de qualidade visual como critério de aceite
**Documento**: `91-visual-quality-checklist.md`.
**Proposta**: nenhuma tela é considerada pronta sem passar pelo checklist.
**Recomendação**: aprovar. **Riscos**: sem isso, a conformidade depende de inspeção informal.

### DES-16 — Aplicação dos tokens em `src/styles.css` na Etapa 4
**Proposta**: quando a Etapa 4 for autorizada, o bloco CSS de `76` §Implementação é a **única**
fonte de valores; nenhuma cor literal em componente.
**Alternativas**: (A) aprovar a regra agora; (B) decidir na Etapa 4.
**Recomendação**: A — a regra custa nada agora e evita retrabalho depois.
**Observação**: aprovar DES-16 **não** inicia a Etapa 4.

---

## O que esta etapa deliberadamente não decidiu

| Tema | Por quê | Onde continua |
|---|---|---|
| Nome público dos 16 SKUs com marca | Depende do usuário | DECT-11 |
| Identidade dos 34 SKUs órfãos | Depende de material externo | DECT-08 / DEP-09 |
| Categoria das 12 famílias pendentes | Fora do escopo liberado | DECT-02 a DECT-09 |
| Páginas de solução por aplicação | Depende de DEC-07 | DECT-12 |
| Prazo comercial divulgado | Decisão de negócio | O-10 |
| Provedor de e-mail e destino das cotações | Decisão operacional | O-05, O-06 |
| Papéis e permissões do painel | Decisão operacional | O-08, O-09 |
| Tema escuro | Fora da v1 | `78` |

## Caminho mínimo de aprovação

Para liberar a Etapa 4 basta manifestação sobre **DES-01**, **DES-02** e **DES-10**. As demais
podem ser respondidas em paralelo, pois detalham o sistema sem alterar sua base.
