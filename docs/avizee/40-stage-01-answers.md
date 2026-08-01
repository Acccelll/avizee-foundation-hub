# 40 — Respostas da Etapa 1 (Q-01 a Q-15)

`USER_DECISION` — 2026-08-01. Este documento encerra `38-stage-01-open-questions.md`.
Cada resposta vira decisão aprovada (D-039 a D-051) em `01-approved-decisions.md`, salvo as que
permanecem explicitamente **aguardando confirmação factual do usuário**.

## Quadro-resumo

| ID | Resposta | Situação |
|---|---|---|
| Q-01 | Não confirmado; credenciais tratadas como comprometidas | **Aberta** — aguarda evidência de revogação |
| Q-02 | Publicar só imagem própria ou autorizada; origem desconhecida → placeholder | **Aberta** — aguarda confirmação de origem |
| Q-03 | Resolver SKU a SKU (abaixo) | **Parcial** — AG005, 2ª ocorrência de AG016 e AG022 pendentes |
| Q-04 | Especificação do catálogo prevalece na família BI | Encerrada → D-039 |
| Q-05 | `BI999` não é SKU; vira CTA de consulta | Encerrada → D-040 |
| Q-06 | Sem planilha técnica; completude progressiva por campo | Encerrada → D-041 |
| Q-07 | Classificação na família, herdada pelos SKUs | Encerrada → D-042 |
| Q-08 | Dados de contato propostos | **Aberta** — aguarda confirmação |
| Q-09 | Duas pautas técnicas mantidas; pauta de atendimento retirada | Encerrada → D-043 |
| Q-10 | Lista de Cotação principal; WhatsApp secundário | Encerrada → D-044 |
| Q-11 | Usar as versões existentes no branding; não redesenhar | Encerrada → D-045 (encerra **O-26**) |
| Q-12 | WOFF2 + self-host da Montserrat convencional | Encerrada → D-046 (encerra **O-24**) |
| Q-13 | Base legal: procedimentos preliminares a contrato | Encerrada conceitualmente → D-047 |
| Q-14 | Seis imagens sem código vão para quarentena | Encerrada → D-048 |
| Q-15 | EmbedSocial removido; Maps só por interação | Encerrada → D-049 |

---

## Q-01 — Credenciais SMTP e reCAPTCHA — **NÃO CONFIRMADO**

As credenciais SMTP e a chave secreta do reCAPTCHA são consideradas **comprometidas** até que a
revogação e a substituição sejam confirmadas.

O fechamento de **RK-15 / O-27** exige o registro de:
- data da revogação;
- segredo substituído;
- responsável pela ação;
- confirmação de que o novo segredo **não está no repositório**;
- confirmação de uso por variável de ambiente ou cofre de segredos.

Nenhum valor antigo será reutilizado na nova aplicação.

## Q-02 — Direito de uso das imagens — **CONDICIONAL** (D-050)

Somente imagens próprias ou expressamente autorizadas podem ser publicadas.

| Origem | Tratamento |
|---|---|
| Fotografia feita pela AviZee | publicar |
| Fotografia contratada com direitos de uso entregues | publicar |
| Imagem de fabricante/fornecedor com autorização comercial | publicar |
| Imagem de marketplace, anúncio ou site sem autorização identificada | **não publicar** |
| Origem desconhecida | placeholder (`PENDENTE_DIREITO_DE_USO`) |
| Imagem com marca visível | placeholder, mesmo com autorização |

A falta de autorização **não bloqueia o produto**, apenas a publicação daquela imagem (coerente
com D-033 e a regra I-3 de `09-image-policy.md`).

**Pendente**: confirmar se o acervo é fotografia própria, arquivo autorizado por fornecedor ou
imagem obtida de anúncios/marketplaces.

## Q-03 — Medidas divergentes (D-051, parcial)

| SKU | Fontes | Situação |
|---|---|---|
| **AG005** | CSV `25 × 8` · catálogo antigo `25 × 8` · catálogo novo `8 × 25` | **Pendente** — inversão não pode ser presumida |
| **AG016** | CSV `06 × 10` · catálogo antigo `06 × 10` · catálogo novo `06 × 10` **e** `10 × 10` | `06 × 10` **confirmado**; a linha `10 × 10` fica **bloqueada** até o código correto ser informado. Nenhum código novo será criado por inferência |
| **AG019** | Todas as fontes acessíveis: `12 × 10` | **Encerrada** — `AG019 = 12 × 10`. DIV-0103 é falso positivo de formatação (`12 X 10 AGULHA APLICADOR` é o mesmo valor com sufixo descritivo) |
| **AG022** | CSV `04 × 08` · catálogo antigo `04 × 08` · catálogo novo `10 × 08` | **Pendente** — decisão necessária |

Registros pendentes permanecem em rascunho (D-036), sem travar o catálogo.

## Q-04 — Família BI — **APROVADO** (D-039)

A descrição detalhada do catálogo (cor, formato do jato, leque/cone, ângulo, referência técnica
confirmada) prevalece sobre o rótulo genérico do CSV, que fica como **nome histórico**.

Nomes públicos: *Bico pulverizador verde — leque* · *amarelo — leque* · *azul — cone cheio* ·
*vermelho* · *laranja — leque*. Referências que possam ser marca ou linha comercial ficam
**apenas em campo interno** até a natureza ser verificada (D-035).

## Q-05 — `BI999` — **ENCERRADO** (D-040)

`BI999` é marcador comercial de consulta, não SKU vendável. Não será criado como produto nem
poderá ser adicionado à cotação. Em seu lugar: CTA **"Não encontrou o bico necessário?"** com
envio de descrição, medida, foto ou referência, registrado internamente como consulta de bico não
catalogado.

## Q-06 — Planilha técnica — **ENCERRADO** (D-041)

Não existe planilha única com descrição técnica, material, aplicação e compatibilidade. A
publicação usa **completude progressiva**: o bloqueio é por campo e por registro, nunca do catálogo.

**Mínimo para publicar**: nome público funcional · SKU confiável · família · categoria · variação
ou especificação principal · possibilidade de cotação · imagem aprovada ou placeholder.

**Opcionais enquanto não confirmados**: material · compatibilidade · benefícios · instruções de
uso · aplicação detalhada · descrição técnica extensa. Campo ausente fica **oculto** — nunca
preenchido com texto genérico (reforça RK-18 e a regra I-2).

## Q-07 — Segmento e aplicação — **ENCERRADO** (D-042)

Regra: classificar a **família** → SKUs **herdam** → exceções registradas individualmente →
revisão possível no painel.

| Prefixo/família | Segmento | Aplicações iniciais |
|---|---|---|
| AG | Avicultura | Vacinação e aplicação |
| AZ · SR · SE | Avicultura | Vacinação e aplicação |
| BI · BT | Avicultura | Pulverização |
| BO | Avicultura | Circulação, pulverização e sistemas de fluido |
| CN · TB | Avicultura | Tubulações, manutenção e sistemas de fluido |
| BA | Avicultura | Pesagem e medição |
| TE | Avicultura | Temperatura e controle |
| LM | Avicultura | Debicagem, manutenção e reposição |
| BB | Avicultura | Hidratação |
| CO | Avicultura | Alimentação |
| AR | Avicultura | Biossegurança e controle de pragas |
| BV | Bovinocultura | Linha complementar |
| PE | depende da família | Reposição, automação, medição, incubação ou manutenção |
| VR | depende do produto | Medição, ambiente, manejo ou incubação |

**PE** e **VR** são heterogêneas (controladores, filtros, fotocélulas, motores, termômetros) e
**precisam ser subdivididas antes da herança**.

## Q-08 — Dados de contato — **AGUARDA CONFIRMAÇÃO**

Proposta para a v1, conforme publicado hoje:

- **Endereço**: Rua Ada Caroline Scarano, 259 — João Aranha, Paulínia/SP
- **CEP**: 13145-794
- **E-mail**: comercial@avizee.com.br
- **Telefone / WhatsApp**: (19) 99898-2930
- **Horário**: segunda a sábado, das 8h às 18h

## Q-09 — Pautas do blog — **ENCERRADO** (D-043)

| Pauta | Destino |
|---|---|
| Como garantir a eficiência da vacinação em aves | **Mantida** no backlog editorial — artigo novo, completo, revisado e com fontes |
| Importância da pesagem correta das aves | **Mantida** — produção nova com revisão técnica |
| Como construir valor desde o primeiro contato com o cliente | **Retirada** da Central de Conteúdos; reaproveitável apenas em comunicação institucional no LinkedIn |

## Q-10 — Canais de conversão — **ENCERRADO** (D-044)

Lista de Cotação é o canal **principal** e estruturado; WhatsApp é **secundário** e contextual.

Página de produto: botão principal **"Adicionar à cotação"**, secundário **"Consultar pelo
WhatsApp"**. Na lista: envio pelo formulário; abertura opcional no WhatsApp **após** o registro da
cotação. O histórico nunca depende só do WhatsApp (mitiga RK-07).

## Q-11 — Versões do logotipo — **ENCERRADO** (D-045, encerra O-26)

Usar somente as variações presentes no manual de branding e nos ativos atuais (principal,
negativa, símbolo isolado, aplicações sobre os fundos oficiais). Extrair versões exatas do PDF
quando o conteúdo for vetorial; usar os rasters existentes quando bastarem; gerar favicon e
tamanhos web **a partir do símbolo aprovado**.

Proibido: redesenhar, reinterpretar ou vetorizar automaticamente por traçado. O pacote vetorial
original completo permanece pendência **não bloqueante**.

## Q-12 — Tipografia — **APROVADO** (D-046, encerra O-24)

Autorizados: conversão da Montserrat convencional para **WOFF2**, **self-host** no próprio
domínio, subset de caracteres quando tecnicamente seguro, `preload` apenas dos pesos críticos e
fallback para fontes de sistema. Pesos: 400, 500, 600, 700 e, eventualmente, 800 só para títulos.

**Montserrat Alternates permanece proibida** (D-031) e não será convertida nem carregada.
A licença **SIL OFL 1.1** deve acompanhar a documentação e os arquivos distribuídos.

## Q-13 — Privacidade e base legal — **ENCERRADO CONCEITUALMENTE** (D-047)

Base principal da cotação: **execução de procedimentos preliminares relacionados a contrato, a
pedido do titular** (LGPD, art. 7º, V).

| Finalidade | Base |
|---|---|
| Receber e responder cotação | Procedimentos preliminares a contrato |
| Confirmar especificações | Procedimentos preliminares a contrato |
| Histórico de atendimento | Execução contratual, obrigação legal ou legítimo interesse, conforme o caso |
| Segurança e prevenção de abuso | Legítimo interesse, com necessidade e salvaguardas documentadas |
| Newsletter e marketing | **Consentimento** separado e opcional |
| Cookies analíticos não essenciais | Consentimento ou outra base avaliada e documentada |
| Cookies estritamente necessários | Necessidade operacional, com transparência |

Aviso no formulário (sem checkbox de consentimento para processar a cotação):

> Utilizaremos os dados informados para analisar sua solicitação, confirmar especificações e
> entrar em contato sobre a cotação. Para saber como tratamos e protegemos seus dados, consulte
> nossa Política de Privacidade.

Checkbox separado, **desmarcado por padrão**, apenas para: *"Desejo receber conteúdos, novidades e
comunicações da AviZee por e-mail ou WhatsApp."*

Conteúdo mínimo da política: identificação legal · CNPJ · endereço · contato de privacidade ·
dados coletados · finalidades · bases legais · origem · compartilhamentos · provedores ·
armazenamento · segurança · retenção · eliminação · direitos dos titulares · canal para
solicitações · cookies · transferências internacionais (se houver) · data e versão.

**Pendências**: razão social exata · CNPJ · responsável por privacidade · prazo de retenção das
cotações · provedores que receberão dados · eventual CRM · analytics e publicidade · revisão
jurídica antes da publicação.

## Q-14 — Seis imagens sem código — **ENCERRADO** (D-048)

Não descartar. Quarentena interna com status **`PENDENTE_IDENTIFICAÇÃO`**: uso público impedido,
hash, nome original e origem preservados, comparação futura com SKUs sem imagem, associação manual
no painel e exclusão apenas após revisão formal.

## Q-15 — Widgets de terceiros — **ENCERRADO** (D-049)

**EmbedSocial removido da v1** — não é essencial à conversão, replica conteúdo social, adiciona
dependência externa, prejudica desempenho e cria tratamento por terceiro sem valor proporcional.
Permanecem apenas links para Instagram e LinkedIn.

**Google Maps** só na página Contato e **sem carregamento automático**: bloco/imagem estática →
botão "Carregar mapa" → iframe apenas após interação → link externo alternativo para abrir a rota.

---

## Pendências remanescentes após este documento

| Item | Estado |
|---|---|
| **O-24** | **ENCERRADA** por Q-12 / D-046 |
| **O-26** | **ENCERRADA** por Q-11 / D-045 |
| **O-27 / RK-15** | **ABERTA** — depende de Q-01 |
| **Q-02** | Aguarda confirmação de origem e direito das imagens |
| **Q-03** | Aguarda AG005, a 2ª ocorrência de AG016 e AG022 |
| **Q-08** | Aguarda confirmação dos dados de contato |
| **Q-13** | Arquitetura encerrada; faltam razão social, CNPJ, canal de privacidade e retenção |
| **L-01 a L-07** | Continuam PENDENTE_DE_APROVAÇÃO (`13-open-decisions.md`) |
