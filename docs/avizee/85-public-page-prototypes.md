# 85 — Protótipo Visual das Páginas Públicas

Status: `PENDENTE_DE_APROVAÇÃO`. Aplica tokens visuais sobre a estrutura definida em
`84-public-page-wireframes.md`. Nenhuma decisão de conteúdo é criada aqui; apenas aplicação
visual e a especificação técnica do protótipo navegável em `/prototipo`.

## 1. Tokens

| Token | Valor | Uso |
|---|---|---|
| `cor.preto` | `#151514` | texto principal, fundo header/footer em versões escuras |
| `cor.vinho` | `#690500` | símbolo, títulos institucionais, hover de link |
| `cor.terracota` | `#b2592c` | CTA primário, wordmark, destaque de preço-livre (badges) |
| `cor.creme` | `#fffaed` | fundo base de todas as páginas públicas |
| `fonte` | Montserrat | única família tipográfica, pesos 400/500/600/700/800 |

Regra de superfície: fundo padrão é sempre Creme `#fffaed`; blocos de ênfase (CTA final, "Como
funciona a cotação", diferenciais) podem usar fundo Preto `#151514` ou Vinho `#690500` com texto
em Creme. Terracota nunca é usada como fundo de bloco extenso — é cor de ação e destaque pontual,
para preservar contraste (`34-accessibility-findings.md`).

## 2. Tipografia por bloco

| Bloco | Elemento | Peso/tamanho relativo | Cor |
|---|---|---|---|
| Header/logo | wordmark | 700, fixo pelo asset de marca | Vinho/Terracota conforme fundo |
| Título de página (`h1`) | Montserrat 800 | grande | Preto sobre Creme; Creme sobre Vinho/Preto |
| Título de bloco (`h2`) | Montserrat 700 | médio-grande | Preto |
| Subtítulo/lead | Montserrat 500 | médio | Preto 80% opacidade |
| Corpo de texto | Montserrat 400 | base | Preto |
| Rótulo de campo/filtro | Montserrat 600 | pequeno, caixa-alta leve | Preto |
| CTA primário (texto do botão) | Montserrat 700 | base | Creme sobre fundo Terracota |
| CTA secundário (texto do botão) | Montserrat 600 | base | Terracota sobre fundo Creme, borda Terracota |
| Breadcrumb | Montserrat 500 | pequeno | Preto 70%, último item Preto 100% sem link |
| Microtexto (aviso, legenda) | Montserrat 400 | menor | Preto 60% |

## 3. Cores por superfície e componente

| Componente | Fundo | Texto/ícone | Borda/divisor |
|---|---|---|---|
| Header | Creme | Preto (nav), Terracota (CTA cotação) | 1px Preto 10% |
| CTA primário (botão) | Terracota | Creme | nenhuma |
| CTA secundário (botão) | Creme | Terracota | 1px Terracota |
| Card de família/categoria | Creme | Preto | 1px Preto 8%, hover Terracota |
| Bloco "Como funciona a cotação" | Preto | Creme | — |
| Bloco "Diferenciais" | Vinho | Creme | — |
| Tabela de variações | Creme | Preto | linhas 1px Preto 8%, header Preto/Creme invertido |
| Barra de cotação persistente (mobile) | Preto | Creme, botão em Terracota | — |
| Footer | Preto | Creme | link hover Terracota |
| Estado vazio/erro | Creme | Preto, ícone Vinho | 1px tracejado Preto 15% |
| Aviso "imagem ilustrativa" | Creme 80% sobre imagem | Preto | — |

Contraste mínimo AA verificado para Terracota `#b2592c` sobre Creme `#fffaed` apenas em textos
grandes/negrito (achado de `34`); textos de corpo pequenos usam Preto, nunca Terracota.

## 4. Espaçamento

Escala base 8px: `4 · 8 · 16 · 24 · 32 · 48 · 64 · 96`.

| Contexto | Espaçamento |
|---|---|
| Padding interno de card | 24px |
| Gap entre cards na grade | 24px desktop / 16px mobile |
| Padding vertical entre blocos de página | 64px desktop / 40px mobile |
| Padding do container (margem lateral) | 64px desktop / 16px mobile |
| Gap entre rótulo e campo de formulário | 8px |
| Altura mínima de área clicável | 44px (ver `87`) |
| Padding do CTA (botão) | 16px vertical, 32px horizontal |

## 5. Aplicação por página — conteúdo real de exemplo

### Home (PT-01)
- `h1`: "Especialista em equipamentos para avicultura".
- Bloco categorias: as 6 categorias aprovadas, cada card com nome funcional e ícone linear (sem
  fotografia de terceiro).
- Bloco famílias em destaque: exemplo aprovado — Agulhas descartáveis, Seringas automáticas de
  fluxo contínuo, Balanças eletrônicas para aves, Bebedouros pendulares para aves.
- Microtexto sob o CTA duplo: "Sem preço público. Solicite sua cotação personalizada."

### Produtos (PT-02)
- Contador de resultados em Montserrat 600, Preto: "24 resultados".
- Card de família (exemplo Balanças eletrônicas para aves): imagem 4:3, nome, categoria em
  Terracota pequena, "4 variações", sem preço.

### Categoria (PT-03)
- Exemplo de categoria com famílias reais: agrupa Agulhas descartáveis e Seringas automáticas de
  fluxo contínuo quando pertencentes à mesma categoria aprovada.

### Solução (PT-04)
- Exemplo "Vacinação": lista Agulhas descartáveis e Seringas automáticas de fluxo contínuo como
  "o que costuma ser necessário", com texto de contexto (parágrafo ilustrativo, a redigir por
  time editorial — `DADO_PENDENTE`).

### Família (PT-05)
- Exemplo integral: "Agulhas descartáveis" — imagem principal com selo "imagem ilustrativa" em
  Creme sobre a foto, canto inferior esquerdo, Montserrat 400 12px; tabela de variações com
  colunas Referência/Medida/Unidade/Quantidade/Ação; especificações comuns (material, uso) e
  variáveis (medida) separadas.
- Microtexto junto ao botão "Adicionar à lista de cotação": "Item incluído na sua lista. Você
  pode ajustar a quantidade a qualquer momento."

### Central de Conteúdos e Artigo (PT-07 a PT-10)
- Exemplo de artigo: "Manutenção de bicos pulverizadores", categoria editorial "Equipamentos e
  manutenção", produto citado "Bicos pulverizadores".

### Busca (PT-11)
- Exemplo: consulta "termômetro" retorna família Termômetros; consulta "AG011" abre diretamente
  a variação na Família de Agulhas descartáveis.

### Cotação (PT-12/13)
- Exemplo de item: "Agulhas descartáveis — 12 x 12 (AG011)", quantidade padrão 1, campo de
  observação opcional.
- Microtexto de privacidade: "Seus dados são usados apenas para retorno comercial, conforme nossa
  Política de Privacidade." (texto placeholder, jurídico pendente — Q-13).

### Sobre (PT-14) e Contato (PT-15)
- Sem números não confirmados; todos os campos de contato exibidos como rótulo com aviso
  `DADO_PENDENTE` até aprovação.

### 404
- Título: "Página não encontrada". Corpo: "O endereço acessado não existe ou foi movido."

## 6. Especificação técnica do protótipo navegável `/prototipo`

### 6.1 Objetivo
Protótipo navegável apenas para validação interna de fluxo e leiaute, sem qualquer efeito
colateral em produção, banco de dados ou serviços externos.

### 6.2 Rota e indexação
- Namespace único: `/prototipo` e subrotas (`/prototipo/home`, `/prototipo/produtos`,
  `/prototipo/produtos/{categoria}`, `/prototipo/produtos/{categoria}/{familia}`,
  `/prototipo/solucoes/{slug}`, `/prototipo/conteudos`, `/prototipo/conteudos/{artigo}`,
  `/prototipo/busca`, `/prototipo/cotacao`, `/prototipo/cotacao/enviada`, `/prototipo/sobre`,
  `/prototipo/contato`, `/prototipo/404`).
- Meta `noindex, nofollow` em todas as subrotas, sem exceção.
- Excluída de `sitemap.xml` e bloqueada em `robots.txt` (`Disallow: /prototipo`).
- Sem link de entrada a partir de qualquer página pública real; acesso só por URL direta,
  documentada internamente.

### 6.3 Dados
- Exclusivamente dados estáticos aprovados (as 31 famílias/97 SKUs e 6 categorias já validados),
  embutidos em arquivo local de protótipo — nunca consulta a API real, nunca lê/escreve em banco
  de produção.
- Nenhum dado de lead real é criado, lido ou armazenado.

### 6.4 Interações permitidas e proibidas
| Interação | Comportamento no protótipo |
|---|---|
| Navegar entre páginas | Permitido, roteamento local |
| Selecionar variação | Permitido, muda estado visual |
| "Adicionar à lista de cotação" | Simula adição em estado local de memória (não persiste após recarregar) |
| Preencher formulário de cotação/contato | Campos são editáveis, mas **não há envio real**: botão "Enviar" mostra estado de sucesso simulado sem chamada de rede |
| Busca | Filtra os dados estáticos locais, sem chamada a serviço de busca real |
| WhatsApp | Link desabilitado ou aponta para estado simulado, nunca abre conversa real |
| Mapa (Contato) | Placeholder estático, nunca carrega serviço de mapa real |

### 6.5 Aviso visual obrigatório
Faixa fixa no topo de toda página do protótipo, fora da hierarquia de `h1`, com texto:
"Protótipo interno — não indexável, sem envio real de dados." Fundo Preto, texto Creme,
Montserrat 600.

### 6.6 Isolamento técnico
- Nenhum componente do protótipo compartilha estado, formulário ou serviço com o ambiente de
  produção.
- Nenhuma credencial, chave de API real ou webhook é referenciada.
- Encerramento da Etapa 3 não implica ativação: o protótipo permanece desligado do fluxo real até
  aprovação e implementação formal em etapa própria.
