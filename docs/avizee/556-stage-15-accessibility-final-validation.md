# 556 — Etapa 15: validação técnica de acessibilidade

## Veredito

`ACCESSIBILITY_TECHNICAL_VALIDATED`

## Fechamento executado

Sem alteração de layout público, foram reforçados requisitos não visuais do WCAG 2.2 AA:

- erros de campos associados por `aria-describedby`;
- indicação textual de obrigatoriedade para tecnologia assistiva;
- foco no primeiro campo inválido após tentativa de envio;
- resumo de erros oculto visualmente com `role="alert"`;
- orientação da mensagem associada semanticamente ao campo;
- sugestões assíncronas da busca anunciadas por região `aria-live`;
- `lang="pt-BR"` definido no documento raiz.

Skip link, foco visível, landmarks, labels e navegação por teclado existentes foram preservados.

## Evidência automatizada

O HEAD de código `fd9de79250ebf4db6e11411072b69ca56c1c5c11` passou no CI #249 (`31499412669`). A suíte inclui testes unitários da semântica do formulário e E2E das rotas públicas, incluindo um único landmark `main` por rota.

## Limites

Esta certificação é técnica/automatizada. Ela não substitui auditoria manual assistiva nem UAT humano, que permanecem no fluxo de homologação posterior.
