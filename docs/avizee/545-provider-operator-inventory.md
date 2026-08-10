# 545 — Inventário de provedores e serviços externos

Data: 2026-08-10
Status: `TECHNICAL_INVENTORY_COMPLETE_LEGAL_REVIEW_PENDING`

## Objetivo

Consolidar os serviços externos efetivamente usados, aprovados ou condicionais na v1, sem atribuir por inferência uma qualificação jurídica definitiva de controlador, operador ou suboperador. Essa qualificação e a redação final da Política de Privacidade permanecem sujeitas à revisão jurídica.

## Inventário técnico

<!-- prettier-ignore -->
| Serviço | Estado no projeto | Dados/uso técnico | Exposição pública | Observação |
|---|---|---|---|---|
| Supabase / backend do projeto | Ativo na arquitetura da aplicação | banco, autenticação administrativa e dados necessários às funções da aplicação | indireta, por meio da aplicação | service role é server-only e não pode chegar ao navegador |
| Resend | Aprovado; ativação externa adiada | entrega de mensagens transacionais de cotação | não é chamado enquanto `EMAIL_PROVIDER` não for `resend` com configuração completa | recebe somente os dados necessários ao e-mail; chave permanece em secret manager |
| WhatsApp via link externo | Aprovado como canal secundário/contextual | continuidade do atendimento iniciada pela pessoa usuária | somente quando houver link/ação aprovada | não substitui a persistência da Lista de Cotação |
| Google Maps | Condicional; ainda desativado | localização do endereço confirmado | somente após interação explícita se o mapa for ativado | carregamento automático permanece proibido |
| Analytics | Não ativado na v1 atual | nenhum evento enviado | nenhuma | futura ativação depende de consentimento e decisão própria |
| EmbedSocial | Fora da v1 | nenhum | nenhuma | não integrar |
| SMTP/Gmail legado | Encerrado / proibido para o novo site | nenhum | nenhuma | credencial antiga confirmada como revogada/trocada; não reutilizar |

## E-mail transacional aprovado

- Provider: Resend.
- Destino comercial e `Reply-To`: `comercial@avizee.com.br`.
- Remetente planejado: `AviZee <cotacoes@envios.avizee.com.br>`.
- Em desenvolvimento/teste, o provider permanece simulado.
- Criação do endereço/subdomínio, DNS e chave real foram deliberadamente adiados até a conclusão de todas as etapas do projeto.

## Dados legais já confirmados

- Razão social: AviZee Equipamentos LTDA.
- CNPJ: 53.078.538/0001-85.
- Canal de privacidade aprovado: `privacidade@avizee.com.br`.
- Retenção aprovada de cotações/leads: 24 meses após a última interação comercial, observadas as exceções já registradas em `113-privacy-and-data-retention.md`.

## Estado de fechamento de Q-13 / B11-03

A **lacuna de inventário técnico** de provedores está encerrada por este documento. A **redação jurídica final** da Política de Privacidade e a qualificação jurídica dos terceiros não são declaradas concluídas por inferência técnica; permanecem como aceite/revisão jurídica antes da publicação definitiva do documento legal.

A página de privacidade pode continuar em `RASCUNHO`/`noindex` enquanto essa revisão estiver pendente, sem bloquear o desenvolvimento funcional das demais superfícies.
