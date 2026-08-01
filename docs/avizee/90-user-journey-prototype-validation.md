# 90 — Validação das Jornadas de Usuário contra os Protótipos

Status: `PENDENTE_DE_APROVAÇÃO`. Base: `53-user-journeys.md` (J-1 a J-9), `50-quotation-journey.md`,
`84-public-page-wireframes.md` (PT-01 a PT-15, 404), `85-public-page-prototypes.md` (protótipo
navegável em `/prototipo`), `88-accessibility-design-specification.md`. Este documento não cria
jornada nova nem altera vocabulário, paleta ou escopo já aprovados (31 famílias / 97 SKUs). Ele
apenas confronta cada jornada descrita em `53` com as telas concretas do protótipo da Etapa 3 e
registra o que fica resolvido em nível de leiaute/fluxo e o que permanece dependente de
implementação em `src/` ou de decisão de backend (busca real, e-mail, persistência, CRM).

Convenção de status por jornada:
- `RESOLVIDO_NO_PROTÓTIPO` — o fluxo é navegável ponta a ponta em `/prototipo` com dados estáticos.
- `PARCIAL` — o fluxo existe no protótipo, mas depende de dado, curadoria ou decisão ainda aberta.
- `DEPENDENTE_DE_BACKEND` — o protótipo só simula; a operação real exige serviço de produção.

## J-1 — Comprador com código ("Preciso do AG011")

**Passos validados**: Home ou `/prototipo/busca` → busca por "AG011" → resultado direto na
variação, dentro de PT-11 (Busca) → PT-05 (Família) com a variação already selecionada →
"Adicionar à lista de cotação" → repetir para outro código → PT-12 (Lista de cotação) → enviar.

**Telas envolvidas**: PT-11, PT-05, PT-12, PT-13.

**Pontos de fricção identificados no protótipo**:
- Distinção visual entre "código não encontrado" e "código de item bloqueado" ainda depende de
  copy específico (ver `89-microcopy-and-content-ui-guidelines.md`); no wireframe de PT-11 o
  estado de erro é único ("Não localizamos a referência...").
- Confusão entre códigos próximos (ex. AG011/AG012) mitigada apenas por sugestão textual
  ("Você quis dizer..."), sem comparação visual lado a lado nesta etapa (`EVOLUÇÃO`, bloqueada em
  `53`).

**O que a Etapa 3 resolve**:
- Existência de URL real por variação (`?sku=AG011` equivalente em rota de família), eliminando o
  antigo padrão de modal (F-16 em `34`, corrigido em `88`).
- Estado de busca com agrupamento por tipo (Produtos primeiro) e estado de erro com alternativa de
  contato, ambos especificados em PT-11.
- Confirmação discreta de item adicionado sem tirar o usuário da página (`50`, seção 1).

**Continua dependente de backend**:
- Indexação e ranqueamento real de busca por código (o protótipo usa filtro estático sobre 97 SKUs
  embutidos, não motor de busca de produção).
- Bloqueio efetivo de itens indisponíveis (AG005/AG022 citados em `53`) exige regra de catálogo em
  banco, não simulável em dado estático.
- Persistência da lista de cotação além da sessão do navegador (30 dias, local) e envio real de
  e-mail/registro do lead (`50`, seção 4).

**Critérios de sucesso mensuráveis**:
- 100% dos SKUs do escopo aprovado (97) retornam resultado exato por código no protótipo.
- Tempo de tela até "item adicionado" ≤ 3 interações a partir da busca (buscar → abrir família →
  adicionar).
- Zero ocorrência de link `href="#"` ou modal sem página real no fluxo (corrige F-14/F-16).

## J-2 — Conhece o produto ("agulha inox 10 × 10")

**Passos validados**: busca por termo → PT-11 lista a família correspondente → PT-05 → seletor de
variação/medida na tabela → adicionar.

**Telas envolvidas**: PT-11, PT-05.

**Pontos de fricção identificados no protótipo**: o nome público normalizado da família (ex.
"Agulhas descartáveis") pode não coincidir com o vocabulário coloquial do cliente ("agulha inox").
A busca estática do protótipo não implementa dicionário de sinônimos; apenas casa por
substring/termo exato dos dados de exemplo.

**O que a Etapa 3 resolve**: estrutura da tabela de variação com colunas
Referência/Medida/Unidade/Quantidade/Ação (PT-05, seção 5 de `85`), permitindo que o usuário
confirme visualmente a medida antes de adicionar, reduzindo o custo do erro de nomenclatura.

**Continua dependente de backend**: dicionário de sinônimos neutros (`49`, §2) e busca tolerante a
termos coloquiais — ambos exigem motor de busca real e curadoria de dados, fora do escopo estático
do protótipo.

**Critérios de sucesso mensuráveis**: taxa simulada de acerto de busca por termo coloquial (a
medir em teste de usabilidade fora desta etapa); no protótipo, meta mínima de que os termos de
exemplo documentados em `85` (ex. "termômetro") retornem a família correta em 100% dos casos
testados manualmente.

## J-3 — Conhece só a aplicação ("itens para vacinação")

**Passos validados**: menu Soluções → PT-04 (`/prototipo/solucoes/vacinacao`) → famílias
relacionadas (Agulhas descartáveis, Seringas automáticas de fluxo contínuo) → PT-05 → adicionar.

**Telas envolvidas**: PT-04, PT-05.

**Pontos de fricção identificados no protótipo**: a associação "aplicação → família" é curadoria
manual, não deduzida por atributo de SKU (RK-18 em `53`); o protótipo demonstra a solução
"Vacinação" com dado estático aprovado, mas não generaliza automaticamente para outras soluções
sem curadoria equivalente.

**O que a Etapa 3 resolve**: leiaute de página de Solução com lista de famílias associadas e texto
de contexto (PT-04), suficiente para validar a navegação e a hierarquia visual.

**Continua dependente de backend**: cadastro real de todas as páginas de Solução aprovadas, com
curadoria de família por página mantida em painel administrativo — inexistente nesta etapa.

**Critérios de sucesso mensuráveis**: cada página de Solução publicada tem no mínimo uma família
`CONFIRMADA` associada (regra também aplicável a J-6); zero página de Solução vazia.

## J-4 — Manutenção, sem saber o nome ("tenho essa conexão")

**Passos validados**: `/prototipo/produtos/pecas-reposicao-e-automacao` → filtro visual por
família → comparação por imagem → estado "Não encontrou?" → WhatsApp simulado ou formulário com
anexo.

**Telas envolvidas**: PT-03 (Categoria), PT-02 (Produtos, se aplicável), estado vazio de busca.

**Pontos de fricção identificados no protótipo — maior fricção do projeto**: 22 SKUs da família
`CN` não têm imagem nem atributo, portanto a comparação visual proposta não pode ser demonstrada
com dado real para esses itens; o protótipo usa placeholder oficial ("imagem em atualização") para
simular o caminho, mas não resolve a causa raiz (falta de foto/atributo).

**O que a Etapa 3 resolve**: caminho de consulta assistida sempre visível na categoria de peças e
automação (link para WhatsApp ou formulário com campo de anexo), conforme leiaute de PT-03/PT-15;
placeholder de imagem padronizado com `alt` que comunica o estado (`88`, seção 7).

**Continua dependente de backend**: fotografia real dos 22 SKUs `CN` e/ou atributo estruturado que
permita filtro técnico (RK-18); envio real de anexo de foto pelo formulário (upload em produção).

**Critérios de sucesso mensuráveis**: 0% de SKU `CN` sem caminho de consulta assistida visível;
100% dos SKUs sem imagem exibem placeholder com `alt` descritivo do estado (não vazio).

## J-5 — Gestor de incubatório ("ovoscopia e controle")

**Passos validados**: Soluções → Incubação e ovoscopia (se publicada) ou
`/prototipo/produtos/pesagem-medicao-e-controle` → famílias → conteúdo de apoio → cotação
consultiva com mensagem.

**Telas envolvidas**: PT-04 (se a solução existir), PT-03, PT-05, PT-12 (campo de observação/
mensagem).

**Pontos de fricção identificados no protótipo**: dependência de a página de Solução "Incubação e
ovoscopia" estar de fato aprovada e publicada; se não estiver, o caminho cai para a Categoria
genérica, perdendo o contexto consultivo.

**O que a Etapa 3 resolve**: campo de observação por item e mensagem geral no formulário de
cotação (PT-12, `50` seção 3), permitindo que o usuário registre a necessidade consultiva mesmo
sem página de Solução dedicada.

**Continua dependente de backend**: decisão de negócio sobre publicar ou não a Solução "Incubação
e ovoscopia" nesta fase; roteamento do lead consultivo para o time comercial certo (CRM/e-mail).

**Critérios de sucesso mensuráveis**: campo de mensagem/observação presente e funcional (mesmo que
simulado) em 100% das telas de cotação do protótipo.

## J-6 — Vindo do Google por artigo

**Passos validados**: `/prototipo/conteudos/{categoria}/{artigo}` → bloco "Produtos citados" →
PT-05 → adicionar ou WhatsApp.

**Telas envolvidas**: PT-09 (Artigo), PT-05.

**Pontos de fricção identificados no protótipo**: requisito arquitetural explícito em `53` —
"todo artigo precisa de ao menos uma família relacionada `CONFIRMADA`, senão vira beco sem saída".
O protótipo demonstra o bloco "Produtos citados" apenas para o artigo de exemplo ("Manutenção de
bicos pulverizadores" → família Bicos pulverizadores).

**O que a Etapa 3 resolve**: leiaute do bloco "Produtos citados" dentro de PT-09, com link direto
à família, eliminando o beco sem saída por leiaute (a garantia de conteúdo continua sendo
processo editorial).

**Continua dependente de backend**: validação editorial de que **todo** artigo publicado em
produção de fato tem família relacionada preenchida — regra de processo, não verificável em dado
estático do protótipo além do exemplo demonstrado.

**Critérios de sucesso mensuráveis**: 0% de artigo publicado sem bloco "Produtos citados"
preenchido (a auditar em produção antes do lançamento, fora desta etapa).

## J-7 — Vindo do Instagram ou LinkedIn

**Passos validados**: link direto de rede social apontando diretamente para a página de Família
(nunca para a Home) → adicionar ou WhatsApp.

**Telas envolvidas**: PT-05.

**Pontos de fricção identificados no protótipo**: o protótipo não simula UTM nem origem de tráfego
real; a validação possível nesta etapa é apenas estrutural — a página de Família existe como
destino direto navegável e não depende de navegação prévia por Home ou categoria.

**O que a Etapa 3 resolve**: existência de URL de família estável e completa por si só (título,
imagem, tabela de variação, CTA), sem exigir contexto de navegação anterior — pré-requisito para
qualquer link de entrada direta.

**Continua dependente de backend**: definição e manutenção de URL-alvo por post nas redes sociais
(processo editorial/marketing) e configuração de parâmetros `utm_*` não indexáveis no ambiente de
produção real.

**Critérios de sucesso mensuráveis**: página de Família carrega com todos os blocos essenciais
(título, imagem/placeholder, tabela, CTA) sem depender de estado de navegação herdado de outra
página, verificável por acesso direto à URL no protótipo.

## J-8 — Não encontrou o item

**Passos validados**: busca sem resultado (PT-11) → "Não encontrou o que procura?" → formulário
curto (descrição, foto, referência do concorrente em campo interno) ou WhatsApp.

**Telas envolvidas**: PT-11 (estado vazio), formulário de contato/busca.

**Pontos de fricção identificados no protótipo**: a referência de concorrente informada pelo
cliente precisa ser tratada como dado interno, nunca publicado (R-05); o protótipo não tem
back-office para demonstrar esse tratamento, apenas o campo de captura no formulário simulado.

**O que a Etapa 3 resolve**: estado vazio de busca com CTA "Fale com um especialista" e caminho
alternativo de formulário (PT-11), estrutura de campo para descrição/foto/referência.

**Continua dependente de backend**: registro real da oportunidade sem SKU no backlog de catálogo;
garantia técnica (não apenas de leiaute) de que o campo de referência de terceiro nunca é exposto
publicamente — regra de acesso a dado, não de tela.

**Critérios de sucesso mensuráveis**: 100% das buscas sem resultado no protótipo exibem CTA de
contato alternativo; nenhum dado de referência de concorrente aparece em qualquer tela pública do
protótipo (auditoria de conteúdo).

## J-9 — Usuário mobile (transversal)

**Passos validados**: buscar, comparar, adicionar, enviar — replicado em todas as telas do
protótipo em viewport mobile (wireframes mobile de PT-01 a PT-15).

**Telas envolvidas**: todas.

**Pontos de fricção identificados no protótipo**: tabela de variações larga (mitigada por
conversão em cartões, ver `88` seção 6), filtro ocupando a tela inteira, formulário longo,
digitação de código. O protótipo demonstra o padrão de cartão para variação e o painel de filtro
com botão "aplicar", mas a validação de usabilidade real de digitação/teclado depende de teste em
dispositivo físico, não replicável em protótipo estático.

**O que a Etapa 3 resolve**: tabela em cartões com rótulo/valor explícito (nunca valor solto),
painel de filtro com "aplicar", barra inferior persistente com contador ("N itens · Solicitar
cotação"), alvo de toque mínimo 44×44px (`88`, seções 6 e 11).

**Continua dependente de backend**: comportamento real de teclado por tipo de campo
(`inputmode="numeric"` etc.) e autocomplete tolerante exigem implementação em `src/`, não
simulável apenas em wireframe/protótipo estático de leiaute.

**Critérios de sucesso mensuráveis**: 100% das telas com tabela de variação convertem para cartão
abaixo do breakpoint definido; barra inferior persistente presente em toda tela com item na lista
de cotação, em viewport mobile.

## Jornada bloqueada nesta etapa

Comparação lado a lado entre variações de famílias diferentes permanece `EVOLUÇÃO`, dependente de
atributo normalizado (RK-18); nenhuma tela desta etapa tenta resolver esse comparativo.

## Síntese de status por jornada

| Jornada | Status nesta etapa | Bloqueio principal para produção |
|---|---|---|
| J-1 | PARCIAL | busca real, catálogo em banco, persistência/envio de lead |
| J-2 | PARCIAL | dicionário de sinônimos, busca tolerante |
| J-3 | PARCIAL | curadoria e publicação real de todas as Soluções |
| J-4 | PARCIAL | fotografia/atributo dos 22 SKUs `CN`, upload real de anexo |
| J-5 | PARCIAL | decisão de publicar Solução dedicada, roteamento de CRM |
| J-6 | PARCIAL | garantia editorial de família relacionada em 100% dos artigos |
| J-7 | RESOLVIDO_NO_PROTÓTIPO (estrutural) | definição operacional de URL por post |
| J-8 | PARCIAL | back-office de tratamento de dado interno |
| J-9 | PARCIAL | comportamento real de teclado/autocomplete em implementação |

Nenhuma jornada está `RESOLVIDO_NO_PROTÓTIPO` de ponta a ponta incluindo backend; a Etapa 3 resolve
exclusivamente leiaute, fluxo de tela e conteúdo estático de exemplo, conforme o isolamento técnico
descrito em `85`, seção 6.6.
