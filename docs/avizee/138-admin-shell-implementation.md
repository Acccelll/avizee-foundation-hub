# 138 — Shell Administrativo

Arquivo: `src/components/admin/AdminShell.tsx`. Origem: `43-admin-information-architecture.md`
e protótipos `86`.

## 1. Estrutura

Cabeçalho invertido (identidade + ambiente + usuário + papéis + sair) e navegação lateral
com os grupos aprovados: Início · Catálogo · Mídia · Conteúdos · Cotações · Configurações.

## 2. Módulos desabilitados

Todos os grupos exceto "Início" aparecem com `aria-disabled` e o sufixo "em breve".
São marcados como não implementados em vez de levarem a telas vazias. A Etapa 6 habilita
Catálogo e Mídia.

## 3. Identidade visível

O cabeçalho mostra nome do usuário e papéis ativos, condição para auditoria compreensível
e para o operador saber sob qual permissão está agindo.

## 4. Acessibilidade

Skip link próprio, navegação rotulada, alvos de toque adequados, foco visível, estado
desabilitado comunicado por texto e não apenas por cor.

## 5. Saída

O botão "Sair" chama `POST /api/auth/logout`, que expira o cookie no servidor, e então
navega para `/admin/login` com substituição de histórico.
