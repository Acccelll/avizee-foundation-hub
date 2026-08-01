# 01 — Decisões Aprovadas

Somente decisões **aprovadas**. Recomendações vivem em `13-open-decisions.md`.
Toda alteração aqui deve ser registrada em `16-change-log.md`.

| ID | Decisão | Origem | Data |
|---|---|---|---|
| D-001 | Foco principal do negócio é **avicultura**. | USER_DECISION | 2026-07-31 |
| D-002 | Suinocultura e bovinocultura são linhas **complementares e pontuais**, sem o mesmo destaque da avicultura na Home, navegação principal ou comunicação institucional. | USER_DECISION | 2026-07-31 |
| D-003 | Suinocultura entra inicialmente **sob consulta**. | USER_DECISION | 2026-07-31 |
| D-004 | Público-alvo é **B2B**; linguagem, formulários e jornadas empresariais. Pessoa física não é bloqueada tecnicamente. | USER_DECISION | 2026-07-31 |
| D-005 | Atendimento a empresas em **todo o Brasil**, sem restrição regional definida. | USER_DECISION | 2026-07-31 |
| D-006 | O site **não é loja virtual**: sem preços públicos, checkout, pagamento, carrinho comercial, pedido automático, frete definitivo, disponibilidade automática, parcelamento, descontos ou promoção por preço. | USER_DECISION | 2026-07-31 |
| D-007 | Conversão principal = **Solicitação de Cotação**, com fluxo de 10 passos (localizar → escolher família/variação → quantidade → adicionar à lista → continuar navegando → revisar → dados da empresa → enviar → confirmação → aguardar contato). | USER_DECISION | 2026-07-31 |
| D-008 | O agrupador de itens chama-se **Lista de Cotação** — nunca "carrinho de compras". | USER_DECISION | 2026-07-31 |
| D-009 | O envio da cotação **não** representa pedido, reserva de estoque, aceite comercial, preço, prazo ou frete garantidos. | USER_DECISION | 2026-07-31 |
| D-010 | Diferenciais oficiais: **variedade especializada**, **atendimento ágil**, **atendimento consultivo** (com as interpretações registradas em `05-business-positioning.md`). | USER_DECISION | 2026-07-31 |
| D-011 | Nenhuma **marca de terceiro** pode aparecer publicamente em qualquer superfície do site. A marca AviZee pode e deve aparecer. | USER_DECISION | 2026-07-31 |
| D-012 | Marcas de terceiros podem existir apenas em **campos administrativos privados** (`marca_interna`, `fabricante_interno`, `referencia_original`, `fornecedor`, `descricao_original`), nunca enviados ao frontend, HTML, APIs públicas, atributos, nomes de arquivos ou logs acessíveis. | USER_DECISION | 2026-07-31 |
| D-013 | Produtos identificados por marca recebem **nome público funcional e neutro**, com normalização registrada e rastreável. | USER_DECISION | 2026-07-31 |
| D-014 | Paleta oficial: Preto `#151514`, Vinho `#690500`, Terracota `#b2592c`, Creme `#fffaed`. | BRANDING / USER_DECISION | 2026-07-31 |
| D-015 | Tipografia oficial: **Montserrat**, com pesos definidos por uso (títulos 700/800, subtítulos 600/700, corpo 400, botões 600, códigos e especificações 500/600). | BRANDING / USER_DECISION | 2026-07-31 |
| D-016 | Elementos oficiais: logotipo AviZee, símbolo gráfico, grafismos inspirados na letra "V", imagens de avicultura, combinações de terracota/vinho/preto/creme. | BRANDING | 2026-07-31 |
| D-017 | Direção visual: moderna, técnica, limpa, profissional, B2B, conectada à avicultura; sem estética de marketplace/loja, sem excesso de efeitos, sem animações gratuitas, sem gradientes genéricos. | BRANDING / USER_DECISION | 2026-07-31 |
| D-018 | Estrutura conceitual do catálogo: **Segmento → Solução/Aplicação → Categoria → Família → Variação/SKU**. | USER_DECISION | 2026-07-31 |
| D-019 | Famílias com variações visual e funcionalmente semelhantes são **agrupadas** em página de família com seletor de variações — não um card público por medida. | USER_DECISION | 2026-07-31 |
| D-020 | A busca pública deve permitir localizar por nome, código, categoria, aplicação, medida, capacidade, especificação e termo relacionado. | USER_DECISION | 2026-07-31 |
| D-021 | Política de imagens com 8 estados definidos e regras de edição permitida/proibida (ver `09-image-policy.md`). | USER_DECISION | 2026-07-31 |
| D-022 | Produtos sem imagem adequada podem ser publicados com **placeholder oficial** (fundo creme, símbolo AviZee, grafismo discreto, Montserrat, "Imagem em atualização") desde que os dados técnicos sejam confiáveis. Sem imagem **e** sem dados confiáveis → rascunho. | USER_DECISION | 2026-07-31 |
| D-023 | Uma imagem pode representar uma família inteira quando as variações forem visualmente semelhantes, com aviso discreto de imagem ilustrativa. | USER_DECISION | 2026-07-31 |
| D-024 | O site terá **Central de Conteúdos**, com o artigo completo nascendo prioritariamente no site e derivando peças para Instagram, LinkedIn, WhatsApp e newsletter futura. | USER_DECISION | 2026-07-31 |
| D-025 | Distribuição editorial: 60% educativo, 20% curiosidades e mercado, 15% produtos e aplicações, 5% segmentos complementares. | USER_DECISION | 2026-07-31 |
| D-026 | Conteúdo e catálogo são interligados (artigo ↔ produto/família/categoria/solução ↔ CTA de cotação). Fluxo: Conteúdo atrai → Catálogo esclarece → Lista de cotação organiza → Atendimento converte. | USER_DECISION | 2026-07-31 |
| D-027 | O site não pode prometer frete gratuito, disponibilidade imediata, prazo uniforme, pronta-entrega geral ou cobertura logística sem confirmação. | USER_DECISION | 2026-07-31 |
| D-028 | Escopo funcional previsto e fora de escopo conforme `11-scope-and-out-of-scope.md`. | USER_DECISION | 2026-07-31 |
| D-029 | Documentação permanente obrigatória em `/docs/avizee/`, consultada antes de qualquer execução posterior. | USER_DECISION | 2026-07-31 |
| D-030 | Ordem de precedência de fontes conforme `README.md`; recomendação do Lovable nunca substitui decisão do usuário automaticamente. | USER_DECISION | 2026-07-31 |
| D-031 | **Montserrat Alternates é proibida na v1.** Só a família Montserrat padrão pode ser usada, nos pesos de D-015. (resolve L-08) | USER_DECISION | 2026-08-01 |
| D-032 | **Nenhum grafismo novo será criado.** O vocabulário gráfico usa apenas o **padrão secundário oficial**, aplicado **separado do símbolo** (nunca fundido ao galo+engrenagem). A menção a "grafismos inspirados na letra V" em D-016 fica **superada**. (resolve L-09 / DIV-06) | USER_DECISION | 2026-08-01 |
| D-033 | Produto cuja única imagem exponha marca de terceiro **permanece na v1** com **placeholder oficial** e pendência registrada de nova fotografia — não é removido nem publicado com a marca visível. (resolve L-10) | USER_DECISION | 2026-08-01 |
| D-034 | A escolha da imagem é feita **por SKU/família**, avaliando qualidade item a item. **Nenhum acervo prevalece globalmente** (site, PNG raiz ou JPG `A/`). (resolve L-11) | USER_DECISION | 2026-08-01 |
| D-035 | Itens com marca de terceiro no nome (grupo "SOCOREX", `BV005`, `LM001`, `LM002`, códigos de bico) são **renomeados por função**. A marca original vive **somente em campo interno** (D-012), inclusive para busca administrativa — nunca em superfície pública. (resolve L-12) | USER_DECISION | 2026-08-01 |
| D-036 | A chave primária do catálogo é **UUID**; o código do fabricante é atributo, não chave. Conflitos de código **bloqueiam apenas o registro afetado** (fica em rascunho), sem travar o catálogo inteiro. (resolve L-13) | USER_DECISION | 2026-08-01 |
| D-037 | Os **55 SKUs do catálogo complementar** (CN, PE, BO, BT) **entram na v1 quando os dados forem confiáveis**; enquanto não forem, permanecem em rascunho — conforme D-022. (resolve L-14) | USER_DECISION | 2026-08-01 |
| D-038 | O PDF atual do catálogo é **aposentado**: `/assets/docs/catalogo.pdf` recebe **301 para `/produtos`**. (resolve L-15) | USER_DECISION | 2026-08-01 |
| D-039 | Na família **BI**, a especificação do catálogo (cor, jato, leque/cone, ângulo, referência) **prevalece** sobre o rótulo genérico do CSV, que fica como nome histórico. (resolve Q-04) | USER_DECISION | 2026-08-01 |
| D-040 | **`BI999` não é SKU real** — é marcador de consulta. Não vira produto nem item de cotação; é substituído por CTA "Não encontrou o bico necessário?". (resolve Q-05) | USER_DECISION | 2026-08-01 |
| D-041 | **Completude progressiva**: o bloqueio de publicação é por campo e por registro. Mínimo publicável = nome funcional + SKU confiável + família + categoria + variação + cotação + imagem/placeholder. Campo ausente fica oculto, nunca preenchido com texto genérico. (resolve Q-06) | USER_DECISION | 2026-08-01 |
| D-042 | Segmento e aplicação são definidos **na família** e **herdados** pelos SKUs, com exceções individuais revisáveis no painel. **PE e VR são heterogêneas e devem ser subdivididas antes da herança.** (resolve Q-07) | USER_DECISION | 2026-08-01 |
| D-043 | Backlog editorial: mantidas as pautas de **vacinação** e **pesagem** (reescritas integralmente, com revisão técnica); a pauta de atendimento/vendas sai da Central de Conteúdos. (resolve Q-09) | USER_DECISION | 2026-08-01 |
| D-044 | **Lista de Cotação é o canal principal**; **WhatsApp é secundário e contextual**. Produto: "Adicionar à cotação" (primário) + "Consultar pelo WhatsApp" (secundário). O histórico nunca depende só do WhatsApp. (resolve Q-10) | USER_DECISION | 2026-08-01 |
| D-045 | Usar **apenas as versões de logo/símbolo já existentes** no branding e nos ativos atuais. Derivados técnicos para web são permitidos como cópia fiel; **redesenho, reinterpretação e vetorização por traçado são proibidos**. Pacote vetorial original vira pendência não bloqueante. (resolve Q-11 e **O-26**) | USER_DECISION | 2026-08-01 |
| D-046 | Autorizadas a conversão da **Montserrat convencional para WOFF2** e o **self-host**, com subset seguro, `preload` só dos pesos críticos e fallback de sistema. Alternates segue proibida (D-031). Licença **SIL OFL 1.1** preservada. (resolve Q-12 e **O-24**) | USER_DECISION | 2026-08-01 |
| D-047 | Base legal da cotação: **procedimentos preliminares relacionados a contrato, a pedido do titular** (LGPD art. 7º, V). Consentimento separado e desmarcado apenas para marketing e cookies opcionais. Política final depende de dados legais da empresa e revisão jurídica. (resolve Q-13 conceitualmente) | USER_DECISION | 2026-08-01 |
| D-048 | Os **6 arquivos de imagem sem código** vão para **quarentena interna** com status `PENDENTE_IDENTIFICAÇÃO` — nem publicados, nem descartados; exclusão só após revisão formal. (resolve Q-14) | USER_DECISION | 2026-08-01 |
| D-049 | **EmbedSocial não faz parte da v1.** O **Google Maps** fica só na página Contato e carrega **apenas após interação**, com link externo alternativo. (resolve Q-15) | USER_DECISION | 2026-08-01 |
| D-050 | **Direito de uso condicional das imagens**: publicar somente imagem própria, contratada com direitos ou autorizada pelo fornecedor. Marketplace/anúncio sem autorização, origem desconhecida ou marca visível → `PENDENTE_DIREITO_DE_USO` + placeholder. A imagem bloqueada não bloqueia o produto. (responde Q-02, sujeito à confirmação da origem) | USER_DECISION | 2026-08-01 |
| D-051 | Divergências de medida: **`AG019 = 12 × 10`** (DIV-0103 encerrada como falso positivo) e **`AG016 = 06 × 10`** confirmado, com a linha `10 × 10` bloqueada até informação do código correto — sem criar código por inferência. **AG005 e AG022 permanecem em rascunho** até decisão. (resolve Q-03 parcialmente) | USER_DECISION | 2026-08-01 |

## Etapa 2 — nenhuma decisão aprovada

A Etapa 2 (arquitetura de informação) **não gerou decisão aprovada**. Todas as 18 propostas
estão em `58-stage-02-decisions-for-approval.md` com status `PENDENTE_DE_APROVAÇÃO`
(DEC-01 a DEC-18). Este registro existe para deixar explícito que nada da Etapa 2 foi assumido
como aprovado. Duas propostas **alteram material já aprovado** e só podem ser aplicadas com
manifestação explícita: **DEC-05** (categoria "Linhas complementares", altera
`07-product-taxonomy.md`) e **DEC-18** (categorias editoriais, altera `08-content-strategy.md`).

## Etapa 2.1 — DEC-05 e DEC-18 encerradas como NÃO APLICADAS

| Proposta | Decisão do usuário | Data | Efeito |
|---|---|---|---|
| DEC-05 | **Rejeitada.** "Linhas complementares" **permanece categoria aprovada**; não vira filtro de segmento. | 2026-08-01 | `07-product-taxonomy.md` mantém as 6 categorias; CAT-06 recebe 4 famílias e 9 SKUs |
| DEC-18 | **Rejeitada.** As **7 categorias editoriais aprovadas permanecem**; nenhuma redução a 3 + 1 transversal. | 2026-08-01 | `08-content-strategy.md` mantido íntegro |

O usuário também confirmou o **bloqueio da Etapa 3** até existir matriz aprovada de
família → categoria → aplicação → segmento. A Etapa 2.1 produziu essa matriz como **proposta**
(`62` a `72`); ela **não** está aprovada e não consta como decisão aqui.

A Etapa 2.1 **não gerou nenhuma decisão aprovada de classificação**. As 14 propostas estão em
`71-taxonomy-decisions-for-approval.md` (DECT-01 a DECT-14), todas `PENDENTE_DE_APROVAÇÃO`.

## Etapa 3 — decisões aprovadas em 2026-08-01 (liberação controlada)

| ID | Decisão | Origem | Data |
|---|---|---|---|
| D-052 | **DECT-01 aprovada parcialmente**: ficam aprovadas as **31 famílias prontas / 97 SKUs** — nome funcional, associação de SKUs, categoria pública, segmento, aplicação principal, aplicações secundárias confirmadas e a relação família → categoria → aplicação, dentro das 6 categorias públicas. As **12 famílias restantes** (FAM-003, 010, 011, 012, 016 a 021, 032, 041) permanecem `PENDENTE_DE_APROVAÇÃO`. **Não registrar as 43 famílias como aprovadas.** Lista nominal em `73-stage-03-start-blocker.md` §7.1 | USER_DECISION | 2026-08-01 |
| D-053 | **DECT-10 aprovada com escopo controlado**: a Etapa 3 está liberada para criar o design system e todos os tipos de página, usando como **conteúdo real** apenas as 31 famílias, os 97 SKUs, as 6 categorias públicas, as 7 categorias editoriais, as aplicações aprovadas e as imagens aprovadas ou o placeholder oficial. Proibido usar taxonomia provisória como conteúdo real | USER_DECISION | 2026-08-01 |
| D-054 | **Fila de normalização**: os 34 SKUs sem identidade (`PE`×28, `CN`×3, `BO`×3), os 16 SKUs sem nome público funcional, os 7 conflitos individuais e todo registro `BLOCKED`/`UNCLASSIFIED` **não são excluídos** — permanecem em fila, sem publicação e sem uso como dado real. B-02 e B-03 seguem **contidos, não encerrados** | USER_DECISION | 2026-08-01 |
| D-055 | **Numeração documental**: Etapa 3 ocupa `74`–`94`; Etapa 4 ocupa `95`–`130` (deslocamento de +6 sobre os `89`–`124` do prompt original); `73-stage-03-start-blocker.md` é o registro do bloqueio; `docs/avizee/design/` mantém os nomes originais | USER_DECISION | 2026-08-01 |

**Limite expresso**: D-052 e D-053 liberam o trabalho. Não aprovam antecipadamente tokens,
componentes, wireframes, protótipos nem direção visual — todos dependem de aprovação ao fim da
Etapa 3. A Etapa 4 não é iniciada automaticamente.


## Etapa 3 — aprovação das decisões DES em 2026-08-01

**ETAPA 3 APROVADA COM AJUSTES. ETAPA 4 LIBERADA EXCLUSIVAMENTE PARA PLANEJAMENTO TÉCNICO.**

| ID | Decisão | Origem | Data |
|---|---|---|---|
| D-056 | **DES-02 aprovada com alteração — cores funcionais restritas** (encerra **L-01**): erro = Vinho `#690500` quando contraste e contexto forem adequados; aviso = Terracota `#b2592c`; **sucesso = verde funcional `#1f6b3c`**; **informação = azul funcional `#12557e`**. Preto **não** é cor de sucesso e terracota **não** cobre aviso e informação ao mesmo tempo. Verde e azul **não integram a paleta da marca**, não aparecem em banner institucional, não são promocionais, não substituem vinho/terracota em CTA, não são decoração e ficam restritos a feedback, alerta, estado e indicador funcional, com tokens semânticos próprios e contraste validado | USER_DECISION | 2026-08-01 |
| D-057 | **DES-03 aprovada com alteração — SKU em Montserrat**: proibida a introdução de segunda família monoespaçada. Código de SKU em Montserrat 500/600, espaçamento controlado, `font-variant-numeric: tabular-nums` quando suportado, diferenciação por peso, tamanho, fundo ou borda. Alternates permanece proibida (D-031) | USER_DECISION | 2026-08-01 |
| D-058 | **DES-13 aprovada com correção — WCAG 2.2 AA obrigatória**, sem regressão para 2.1. Acessibilidade é gate de qualidade, não objetivo opcional | USER_DECISION | 2026-08-01 |
| D-059 | **DES-08 aprovada com correção de escopo**: `82-component-inventory.md` é **inventário de referência para a arquitetura técnica e para a futura etapa de implementação**. A Etapa 4 **não constrói componentes**; define arquitetura, contratos, modelo de dados, segurança, dependências e plano de implementação | USER_DECISION | 2026-08-01 |
| D-060 | **DES-01, DES-05, DES-07, DES-09, DES-11, DES-12, DES-14 e DES-15 aprovadas**; **DES-04** aprovada com ajuste decorrente de D-056; **DES-06** aprovada conceitualmente (Lucide como referência; instalar `lucide-react` só após validação técnica na Etapa 4); **DES-10** aprovada para arquitetura técnica com **revisão visual obrigatória por tipo de página** antes da implementação; **DES-16** aprovada com ajuste técnico (o caminho físico da fonte única de tokens é definido na Etapa 4) | USER_DECISION | 2026-08-01 |
| D-061 | **Etapa 4 liberada exclusivamente para planejamento e arquitetura técnica** (documentos `95`–`130`). **Não autoriza**: implementação produtiva, alteração do site atual, aplicação de tokens no código, codificação de componentes, criação de rotas, publicação de páginas, conexão com banco de produção, envio real de formulários ou cotações, criação de banco de produção e ativação de serviços externos | USER_DECISION | 2026-08-01 |

**Limite expresso**: a aprovação considera os princípios resumidos em `93`. Ela **não valida
silenciosamente** valores HSL, cálculos de contraste ou detalhes visuais não apresentados no chat.


## Etapa 4 — registro em 2026-08-01 (planejamento técnico)

| ID | Decisão | Origem | Data |
|---|---|---|---|
| D-062 | **Etapa 4 executada como planejamento e arquitetura técnica**, produzindo os documentos `95`–`130` e os estruturados em `docs/avizee/architecture/`. Nenhuma implementação produtiva, nenhum banco criado, nenhum serviço ativado, nenhum layout alterado | USER_DECISION (D-061) | 2026-08-01 |

**As 21 decisões técnicas DT-01 a DT-21 (`129-stage-04-decisions-for-approval.md`) NÃO são
decisões aprovadas.** Estão todas em `PENDENTE_DE_APROVAÇÃO` e não podem ser tratadas como
aprovadas nem aplicadas antes de aprovação expressa item a item.


## Etapa 4 — deliberação das DT em 2026-08-01

**ETAPA 4 APROVADA COM AJUSTES. ETAPA 5 LIBERADA CONDICIONALMENTE À VERIFICAÇÃO DA STACK.**

| ID | Decisão | Origem | Data |
|---|---|---|---|
| D-063 | **DT-01 a DT-21 deliberadas** com os estados finais registrados em `129-stage-04-decisions-for-approval.md`: aprovadas (DT-02, DT-05, DT-06, DT-07, DT-08, DT-09, DT-12, DT-14, DT-15, DT-17, DT-20, DT-21); com ajuste (DT-03, DT-04); com controles (DT-10); em princípio (DT-11); condicionalmente (DT-01, DT-16); condicionada a prova técnica (DT-13); com alteração estrutural (DT-18); com complemento (DT-19). A aprovação **não autoriza** aplicação silenciosa de alternativas, serviços ou dependências não confirmados | USER_DECISION | 2026-08-01 |
| D-064 | **Verificação de stack (condição de DT-01) concluída**: o repositório é TanStack Start (`@tanstack/react-start`, roteamento por arquivos, SSR nativo, build Vite oficial), conforme `architecture/stack-verification.md`. Mantida a stack; proibida migração artesanal, recriação silenciosa do projeto ou substituição sem aprovação. Dependência do ambiente aceita como risco controlado | USER_DECISION | 2026-08-01 |
| D-065 | **Etapa 5 liberada condicionalmente**, atendidas as seis condições da §23: verificação da stack, atualização dos documentos técnicos, arquitetura de ambientes corrigida (homologação separada), backup de storage registrado, manutenção de DEP-T1/DEP-T3/DEP-T5 e confirmação de que a Etapa 5 **não ativa produção nem serviços reais**. A liberação **não autoriza alteração do layout aprovado** | USER_DECISION | 2026-08-01 |
