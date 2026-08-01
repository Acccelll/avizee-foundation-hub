# 148 — Validação de Acessibilidade da Fundação

Meta obrigatória: **WCAG 2.2 AA** (D-058). Não regride para 2.1.

## 1. Verificado nesta etapa

| Item | Estado |
|---|---|
| Idioma da página declarado (`pt-BR`) | conforme |
| Skip link em ambos os shells | conforme |
| Marcos semânticos (`header`/`nav`/`main`/`footer`) | conforme |
| `h1` único por página | conforme |
| Navegação por teclado nas rotas existentes | conforme |
| Foco visível com anel tokenizado | conforme |
| Estado não dependente apenas de cor | conforme |
| Contraste de texto e componentes | conforme, contra `design/color-contrast-matrix.csv` |
| Rótulo associado a cada campo do formulário de login | conforme |
| Erro de formulário anunciado e associado ao campo | conforme |
| Alvo de interação com área mínima adequada | conforme |
| Item de menu desabilitado comunicado por texto | conforme |

## 2. Critérios 2.2 relevantes

- **Foco não obscurecido**: nenhum elemento fixo cobre o foco nos layouts atuais.
- **Alvo mínimo**: botões e links de navegação com altura de 40px ou mais.
- **Ajuda consistente**: os canais de contato aparecem sempre na mesma posição do rodapé.
- **Entrada redundante**: não há fluxo de múltiplas etapas nesta fundação.

## 3. Ainda não avaliável

Tabelas extensas, filtros, upload, progresso, modal, drawer, abas, histórico e comparação
de valores — nenhum existe ainda. São o núcleo da validação de acessibilidade da Etapa 6
(documento `182`).

## 4. Método

Verificação manual estrutural e por teclado. Não houve auditoria automatizada
instrumentada; instituí-la é parte de `152`/`153` e está registrada como pendência.
