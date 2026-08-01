# 117 — Requisitos Técnicos de Acessibilidade

Meta obrigatória: **WCAG 2.2 AA** (D-058). Tradução técnica de `88-accessibility-design-specification.md`.

## 1. Estrutura

HTML semântico; landmarks (`header`, `nav`, `main`, `aside`, `footer`); **um único H1** por
página; hierarquia de headings sem salto; `lang="pt-BR"`; skip link para o conteúdo principal;
listas reais para listas; tabelas com `caption`, `th` e `scope`.

## 2. Formulários

`label` associado a todo campo; `aria-describedby` para ajuda e erro; erro descrito em texto
(nunca só por cor); `aria-invalid`; foco movido para o primeiro erro; resumo de erros no topo;
campos de quantidade com `inputmode` adequado; honeypot com `aria-hidden` e fora da ordem de foco.

## 3. Interação

Foco visível com contraste ≥ 3:1 (2.2 AA — `Focus Not Obscured`); ordem de tabulação lógica;
todo controle operável por teclado; alvo mínimo de 24×24 px (2.2 AA — `Target Size (Minimum)`);
sem armadilha de foco; arrastar sempre com alternativa (`Dragging Movements`);
autenticação sem teste cognitivo (`Accessible Authentication`); ajuda em posição consistente
(`Consistent Help`); nenhuma reentrada redundante de informação já fornecida (`Redundant Entry`).

## 4. Componentes dinâmicos

Modal e drawer: `role="dialog"`, `aria-modal`, foco preso, retorno do foco à origem, fechamento
por `Esc`. Tabs com `role="tablist"` e navegação por setas. Filtros e busca anunciam a contagem
de resultados por `aria-live="polite"`. Adição à lista de cotação anuncia confirmação por live
region. Toasts não roubam o foco.

## 5. Conteúdo

Texto alternativo obrigatório para toda imagem publicada; placeholder é decorativo
(`alt=""`) quando acompanhado de nome visível; contraste de texto ≥ 4,5:1 e de componente
≥ 3:1, validado em `design/color-contrast-matrix.csv`; `prefers-reduced-motion` respeitado;
zoom até 200% sem perda de conteúdo; sem dependência exclusiva de cor.

## 6. Testes

Automático em CI: axe-core em todas as rotas-tipo (violação crítica bloqueia o deploy) e
verificação de contraste dos tokens. Manual por release: navegação completa por teclado,
leitor de tela (NVDA e VoiceOver) nos fluxos de busca, seleção de variação, adição à lista e
envio de cotação, zoom 200% e modo de contraste alto.
