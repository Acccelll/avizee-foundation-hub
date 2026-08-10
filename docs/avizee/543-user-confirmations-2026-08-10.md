# 543 — Confirmações do Usuário para Fechamento Pré-Etapa 15

Data: 2026-08-10
Status: CONFIRMADO_COM_ACOES_EXTERNAS_PENDENTES

Este documento registra apenas decisões explicitamente confirmadas pelo usuário no fechamento das Etapas 0–14.1. Recomendações aprovadas passam a integrar a decisão; ações externas ainda não executadas permanecem claramente separadas.

## 1. Contato público — CONFIRMADO

- Endereço: Rua Diogo António Feijó, 111 — João Aranha, Paulínia/SP
- CEP: 13145-706
- E-mail comercial: comercial@avizee.com.br
- Telefone/WhatsApp: (19) 99898-2930
- Horário de atendimento: segunda a sábado, 08h–18h

Estes dados substituem referências antigas divergentes encontradas no site legado.

## 2. Dados legais — CONFIRMADO NO ESCOPO INFORMADO

- Razão social: AviZee Equipamentos LTDA
- CNPJ: 53.078.538/0001-85
- Canal público de privacidade/LGPD aprovado: privacidade@avizee.com.br

A criação efetiva da nova caixa/alias de privacidade foi deliberadamente adiada até a conclusão de todas as etapas do projeto e está coberta por lembrete específico.

## 3. E-mail comercial e transacional — APROVADO

- `comercial@avizee.com.br` permanece como endereço comercial público, destino interno das solicitações e `Reply-To`.
- Provedor transacional aprovado: Resend.
- Remetente transacional planejado: `AviZee <cotacoes@envios.avizee.com.br>`.
- Segredos do Resend serão configurados somente no ambiente server-side/secret manager.
- Desenvolvimento e testes permanecem com envio simulado.

A criação/configuração do endereço/subdomínio transacional e os registros DNS necessários são ações externas deliberadamente adiadas até o fechamento de todas as etapas do projeto.

## 4. Credencial SMTP legada — CONFIRMADO

O usuário confirmou em 2026-08-10 que a senha/app password exposta no legado já foi revogada/trocada.

Classificação documental: B11-05 / O-27 encerrado por confirmação explícita do responsável, preservando o registro histórico da exposição e proibindo reutilização da credencial anterior.

## 5. Retenção de cotações/leads — APROVADA

Regra aprovada: 24 meses após a última interação comercial.

Após esse período, os dados pessoais de lead/cotação devem ser excluídos ou anonimizados quando não houver relacionamento ativo ou outra obrigação aplicável. Registros que tenham evoluído para contrato, operação fiscal ou relacionamento comercial passam a seguir a retenção própria desses processos, fora da política de lead do site.

## 6. Prazo comercial público — CONFIRMADO

Decisão: não divulgar prazo fixo de retorno comercial.

Consequência: O-10 / B11-08 encerrado com a regra de não publicar promessa temporal fixa.

## 7. Administração inicial — CONFIRMADO COMO REGRA OPERACIONAL

- Inicialmente haverá apenas um usuário administrador: o próprio usuário responsável pelo projeto.
- O sistema deve manter capacidade de conceder acesso a outra pessoa posteriormente.
- Não criar usuários fictícios nem inferir e-mail/login do administrador inicial.
- A implementação deve preservar RBAC e permitir futura inclusão controlada de usuários/papéis.
- O provisionamento da conta concreta fica para o momento em que o e-mail/login real for informado.

## 8. Ações externas ainda necessárias antes da operação real

1. Criar/configurar `privacidade@avizee.com.br`.
2. Criar/configurar o remetente/subdomínio transacional para o Resend.
3. Configurar DNS de envio (SPF/DKIM/DMARC) e chave de API do Resend no ambiente seguro.
4. Informar/provisionar o login concreto do administrador inicial quando necessário.

Essas ações não alteram as decisões já aprovadas e não autorizam produção enquanto os demais gates de fechamento permanecerem abertos.
