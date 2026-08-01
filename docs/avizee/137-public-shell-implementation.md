# 137 — Shell Público

Arquivos: `src/components/public/PublicShell.tsx`,
`src/components/public/ModulePlaceholder.tsx`, `src/routes/__root.tsx`.

## 1. Estrutura

Cabeçalho com logotipo oficial e navegação principal → `<main>` identificado →
rodapé institucional com links legais. Segue `44-navigation-model.md` e os protótipos
`85`.

## 2. Acessibilidade estrutural

- Link "Ir para o conteúdo principal" como primeiro elemento focável.
- Marcos semânticos: `header`, `nav` com rótulo, `main`, `footer`.
- Um único `h1` por página.
- Ordem de foco igual à ordem visual.

## 3. Faixa de ambiente

Fora de produção o shell exibe rótulo do ambiente corrente. Serve para impedir que
preview ou homologação seja confundido com o site publicado.

## 4. `ModulePlaceholder`

Componente honesto para módulos ainda não implementados: informa o que existirá, em que
etapa, e **não** simula funcionalidade. Não há formulário que não persiste nem botão sem
regra — requisito explícito contra implementação fictícia.

## 5. Conversão

Nenhuma Lista de Cotação funcional foi criada. A rota `/cotacao` apresenta apenas o
placeholder. WhatsApp permanece como canal secundário e não está ativado.
