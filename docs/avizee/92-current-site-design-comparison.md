# 92 — Comparação: Site Atual (PHP) vs. Proposta da Etapa 3

Status: `PENDENTE_DE_APROVAÇÃO`. Base: `22-current-site-inventory.md`, `34-accessibility-findings.md`,
`35-performance-findings.md`, `31-seo-inventory.md`, `10-brand-guidelines.md`,
`84-public-page-wireframes.md`, `85-public-page-prototypes.md`, `88-accessibility-design-specification.md`,
`50-quotation-journey.md`, `53-user-journeys.md`. Comparação estritamente descritiva; nenhuma
decisão de negócio é tomada aqui. Ganhos e riscos citados dependem de aprovação e implementação
formal fora desta etapa.

## 1. Identidade

| Dimensão | Site atual | Proposta |
|---|---|---|
| Logotipo | Aplicado, mas sem manual de uso documentado publicamente | Uso normativo do manual de branding (símbolo em outline, wordmark condensado, regras de fundo por cor) |
| Assets vetoriais | Não confirmados no pacote recebido | Ainda **não recebidos** (O-22) — pendência preservada, não resolvida pela Etapa 3 |
| Consistência entre páginas | Logotipo repetido por include (`header.php`), sem variação documentada | Regras explícitas de aplicação sobre Creme e sobre cor (`10`, `85`) |

**Ganho esperado**: uso consistente e auditável do logotipo em todas as telas, com regra escrita
para impedir recolorização indevida.
**Risco da mudança**: nenhuma versão vetorial oficial existe ainda; qualquer implementação real
depende de receber os arquivos-fonte do logotipo (bloqueio, não risco de execução).
**Preservado deliberadamente**: o próprio logotipo e a leitura conceitual da marca (galo +
engrenagem) não são alterados.

## 2. Tipografia

| Dimensão | Site atual | Proposta |
|---|---|---|
| Família | Montserrat via Google Fonts, 3 pesos (400/600/700) | Montserrat self-host em WOFF2, pesos 400/500/600/700/800 |
| Origem do carregamento | Terceiro (Google Fonts) no caminho crítico (F-18) | Arquivo próprio, elimina dependência externa no carregamento de fonte |
| Itálico | Não usado | Continua não usado — pacote recebido não contém itálico real (`10`) |
| Variante decorativa | Não usada | Montserrat Alternates permanece proibida (D-031) |

**Ganho esperado**: redução de bloqueio de renderização por terceiro (corrige F-18) e maior
consistência de peso entre blocos.
**Risco da mudança**: conversão OTF/TTF → WOFF2 ainda pendente de execução técnica (O-24); sem
isso o ganho de performance não se realiza.
**Preservado deliberadamente**: família tipográfica única (Montserrat), sem introdução de segunda
fonte.

## 3. Cor

| Dimensão | Site atual | Proposta |
|---|---|---|
| Paleta | Aplicação de Preto/Vinho/Terracota/Creme sem verificação formal de contraste | Mesma paleta oficial, com matriz de contraste calculada e regra de uso por par (`88`) |
| Uso de Terracota como texto | Não documentado, risco não avaliado antes | Explicitamente restringido: nunca texto corrido sobre Creme, nunca fundo com texto Creme |
| Cores funcionais (erro/sucesso/aviso) | Inexistentes/não documentadas | Ainda **não definidas** (L-01) — pendência preservada |

**Ganho esperado**: primeira verificação formal de contraste do projeto, reduzindo risco de
reprovação em auditoria de acessibilidade real.
**Risco da mudança**: os cálculos são matemáticos sobre hexadecimais, não medidos em renderização
final; reconfirmação obrigatória em produção antes do lançamento (`88`, seção 14).
**Preservado deliberadamente**: as quatro cores oficiais permanecem as únicas cores de marca; nenhuma
cor nova é introduzida sem aprovação.

## 4. Layout

| Dimensão | Site atual | Proposta |
|---|---|---|
| Estrutura de página | HTML com CSS embutido repetido por página (F-19) | Tokens de espaçamento (escala 8px) e componentes reutilizáveis especificados uma única vez |
| Densidade e respiro | Não documentado | Padding e gap explícitos por contexto (card, container, bloco) alinhados à direção visual de "blocos sólidos de cor" do manual |
| Efeitos visuais | Não auditados, mas manual proíbe gradiente/sombra/animação gratuita | Proibição explícita reforçada em checklist de qualidade (`91`) |

**Ganho esperado**: leiaute previsível e auditável, menor CSS duplicado, mais fácil de manter.
**Risco da mudança**: exige disciplina de implementação em `src/` para não recriar CSS ad hoc por
página, repetindo o padrão hoje encontrado no PHP.
**Preservado deliberadamente**: a estética "moderna, técnica, limpa, B2B" já aprovada (`10`)
continua sendo a direção; não há reformulação de posicionamento de marca.

## 5. Navegação

| Dimensão | Site atual | Proposta |
|---|---|---|
| Páginas públicas | 5 URLs (Home, Produtos, Sobre, Contato, Blog) | 15+ tipos de página (PT-01 a PT-15 + 404), incluindo Categoria, Solução, Família, Busca, Conteúdos, Cotação |
| Página de produto individual | Inexistente — modal sobre a listagem | Página real por família (PT-05), eliminando o modal como padrão principal |
| Menu/submenu | Não detalhado no inventário atual além do essencial | Especificado com requisitos de teclado e `aria-expanded` (`88`, seção 4) |

**Ganho esperado**: navegação de cauda longa (categoria → família → variação), eliminação do beco
sem saída do modal, coerência com jornadas J-1 a J-9.
**Risco da mudança**: aumento real de superfície de páginas a manter e testar; exige processo de
curadoria de conteúdo (Soluções, Artigos) inexistente hoje.
**Preservado deliberadamente**: WhatsApp continua como canal de conversão contextual complementar,
não substituído.

## 6. Catálogo

| Dimensão | Site atual | Proposta |
|---|---|---|
| Fonte de dados | CSV lido em runtime a cada requisição (`produtos-data.php`, 117 linhas, F-21) | Dado estático aprovado (31 famílias / 97 SKUs) embutido no protótipo; produção dependeria de banco/CMS fora desta etapa |
| Página por produto | Inexistente | Página de Família com tabela de variação estruturada (referência, medida, unidade, quantidade, ação) |
| Itens sem imagem/atributo | 22 SKUs `CN` sem imagem e sem atributo, sem tratamento documentado | Caminho de consulta assistida sempre visível na categoria correspondente (mitigação de leiaute, não resolve a causa raiz) |
| Comparação entre famílias diferentes | Inexistente | Continua `EVOLUÇÃO`, não resolvida nesta etapa |

**Ganho esperado**: URL indexável por família, filtro e agrupamento por categoria, tabela
acessível de variações.
**Risco da mudança**: 22 SKUs permanecem sem imagem/atributo até fotografia e curadoria serem
executadas; escopo real (31/97) é menor que o total histórico do CSV (117 linhas), exigindo
comunicação clara do recorte ao negócio.
**Preservado deliberadamente**: nenhum preço é exibido, mantendo o modelo consultivo já vigente no
site atual (que também não exibe preço).

## 7. Conversão

| Dimensão | Site atual | Proposta |
|---|---|---|
| Mecanismo | WhatsApp direto por produto, sem registro de lead estruturado | Lista de cotação persistida localmente + formulário estruturado + WhatsApp contextual complementar |
| Registro de lead | Apenas o que chega ao WhatsApp/e-mail de quem atende, sem protocolo | Persistência antes do envio, protocolo gerado, confirmação em `/cotacao/enviada` (L-03/RK-07) |
| Vocabulário | Não usa termos de e-commerce (compatível) | Vocabulário fixado: "Lista de cotação", "Solicitar cotação"; proibido carrinho/checkout/comprar |
| E-mail de notificação | PHPMailer com credencial em texto claro (F-01) | Mecanismo de envio e credencial ficam `DEPENDENTE_DE_BACKEND`, fora do escopo desta etapa |

**Ganho esperado**: nenhum lead depende exclusivamente do aplicativo pessoal de quem atende;
rastreabilidade por protocolo.
**Risco da mudança**: exige decisão de arquitetura de persistência e envio (endereço de destino,
provedor de e-mail, base legal LGPD) ainda em aberto (O-05, O-06, D-047, Q-13).
**Preservado deliberadamente**: ausência de preço, checkout e conta de usuário — o modelo
permanece consultivo/B2B, não vira loja virtual.

## 8. Acessibilidade

| Dimensão | Site atual | Proposta |
|---|---|---|
| Links de ação | `href="#"` em "Detalhes" e títulos de blog (F-14, ALTA) | URL real e navegável em toda família/SKU/artigo (`45`) |
| Modal de produto | Sem gestão documentada de foco/`role="dialog"`/`Esc` (F-16) | Modal eliminado como padrão principal; regras de foco especificadas para os casos residuais |
| `alt` de imagem | Preenchido por script em alguns casos (F-17) | `alt` definido no marcado, nunca só por JavaScript |
| Contraste | Não verificado (F-15) | Primeira verificação matemática formal, com regra de uso por par de cor (`88`) |
| Pontos já corretos | `lang="pt-BR"`, `aria-label`/`aria-expanded`/`aria-required` já presentes | Mantidos e ampliados (skip link, `aria-live` em confirmações, tabelas semânticas) |
| Meta de conformidade | Não declarada | WCAG 2.1 nível AA declarado como meta de aceite |

**Ganho esperado**: correção dos quatro achados formais (F-14 a F-17) e elevação a padrão de
conformidade declarado.
**Risco da mudança**: nenhum teste real com leitor de tela foi executado; a conformidade descrita é
projetada, não auditada em produção (pendência explícita em `88`, seção 14).
**Preservado deliberadamente**: as boas práticas já existentes no PHP atual (ARIA, `lang`, ícones
decorativos ocultos) são mantidas, não descartadas por serem "legado".

## 9. Performance

| Dimensão | Site atual | Proposta |
|---|---|---|
| Fonte | Google Fonts no caminho crítico (F-18) | Self-host WOFF2 |
| CSS | Embutido e repetido por página (F-19) | Tokens centralizados, sem duplicação por página |
| Imagens | Só JPG/PNG, sem WebP/AVIF, sem `srcset` (F-20) | Não especificado nesta etapa como implementação; meta de LCP<2,5s pressupõe otimização de imagem, `DEPENDENTE_DE_BACKEND`/build |
| Dados de catálogo | CSV parseado a cada requisição (F-21) | Dado estático embutido no protótipo; produção real depende de banco, fora do escopo |
| Terceiros | EmbedSocial, Google Maps, reCAPTCHA carregados sem interação (F-22) | Protótipo não carrega nenhum terceiro real (isolamento técnico, `85` seção 6.6); comportamento de produção ainda a decidir |
| Pontos já corretos | `loading="lazy"`, `preload`+`onload` de fonte, `defer`, sem framework pesado | Preservados como referência de boa prática a manter na implementação real |

**Ganho esperado**: eliminação de gargalo de terceiro no carregamento de fonte e de reprocessamento
de CSV por requisição.
**Risco da mudança**: metas de LCP/CLS/INP (`35`) são projetadas; nenhuma medição de campo existe
ainda para o site atual nem para a proposta, tornando a comparação numérica aspiracional até
implementação e medição real.
**Preservado deliberadamente**: ausência de framework JS pesado como princípio — a proposta não
introduz complexidade de bundle apenas por preferência estética.

## 10. SEO

| Dimensão | Site atual | Proposta |
|---|---|---|
| URLs públicas | 5, nenhuma de produto/SKU (F-10) | URL por categoria, solução, família e artigo — cauda longa antes inexistente |
| `<title>`/`meta description` | Duplicados/conflitantes (F-12, F-13) | Únicos por rota, gerados por tipo de página |
| `canonical`/`twitter:card` | Ausentes (F-07) | A implementar por rota, fora do escopo desta etapa de documentação |
| `robots.txt`/`sitemap.xml` | Ausentes (F-09) | Especificado ao menos para o protótipo (`Disallow: /prototipo`); geração real para o site público é `DEPENDENTE_DE_BACKEND` |
| JSON-LD | Ausente (F-11) | Recomendado `Organization` + `ItemList` sem preço (R-04), não implementado nesta etapa |
| Autoridade de URL a preservar | Nenhuma (nunca existiu página de produto indexada) | Plano de 301 permanece o de `19-url-inventory.md`, sem novidade desta etapa |

**Ganho esperado**: superfície indexável de cauda longa antes inexistente, correção de duplicação
de metatags.
**Risco da mudança**: nenhum, do ponto de vista de perda de autoridade — não há página de produto
histórica a preservar (`31`).
**Preservado deliberadamente**: monolinguismo do site (`hreflang` não aplicável) e `lang="pt-BR"`.

## 11. Mobile

| Dimensão | Site atual | Proposta |
|---|---|---|
| Listagem de produtos | Não documentada como adaptada a cartão/tabela específica | Tabela de variação convertida em cartão com rótulo/valor explícito |
| Filtro | Não documentado | Painel dedicado com botão "aplicar" |
| Ação de conversão | Botão flutuante de WhatsApp | Barra inferior persistente com contador de itens + WhatsApp contextual mantido |
| Teclado/digitação | Não documentado | `inputmode` adequado por campo, autocomplete tolerante (implementação futura) |

**Ganho esperado**: fluxo mobile específico para os pontos de maior fricção já mapeados em J-9
(`53`).
**Risco da mudança**: comportamento real de teclado e autocomplete só é validável em implementação
e teste em dispositivo físico, não no protótipo estático.
**Preservado deliberadamente**: botão de WhatsApp continua acessível a um toque como hoje.

## 12. Manutenção

| Dimensão | Site atual | Proposta |
|---|---|---|
| Stack | PHP puro, sem framework, sem banco de dados; 174 arquivos incluindo `vendor/` | Não definida nesta etapa de documentação (fora de escopo); pressupõe dado estruturado (banco/CMS) para catálogo, mencionado como necessidade, não como decisão de stack |
| Dependência externa | `phpmailer/phpmailer` única dependência via Composer | Não especificada nesta etapa |
| Dados de contato | Literais repetidos em `contato.php` e `footer.php`, sem fonte única (risco de divergência) | Recomendação de configuração central (ainda `DADO_PENDENTE` até confirmação, `22`) |
| Credencial de e-mail | Texto claro no código (F-01) | Tratamento seguro de credencial é requisito a resolver na implementação real, não documentado como resolvido aqui |
| Protótipo desta etapa | — | Isolado tecnicamente: sem credencial real, sem webhook, sem compartilhamento de estado com produção (`85`, seção 6.6) |

**Ganho esperado**: fonte única de verdade para dados de contato e catálogo, reduzindo divergência
entre páginas.
**Risco da mudança**: qualquer nova stack ou serviço adicionado precisa ser avaliado quanto a custo
de manutenção; esta etapa não decide arquitetura de backend, portanto o ganho de manutenção só se
concretiza em etapa de implementação.
**Preservado deliberadamente**: simplicidade como valor — a proposta não recomenda adicionar
complexidade além do necessário para resolver os achados já documentados (F-01, F-19, F-21).

## Síntese de riscos transversais da mudança

- Toda meta numérica (performance, contraste calculado, taxa de acerto de busca) é projetada, não
  medida em produção; exige validação após implementação real (`88` seção 14, `35`).
- O escopo de catálogo (31 famílias / 97 SKUs) é menor que o total histórico do CSV atual (117
  linhas); a diferença precisa ser comunicada e justificada ao negócio antes do lançamento.
- Assets vetoriais oficiais do logotipo continuam pendentes (O-22); qualquer implementação real
  depende de recebê-los.
- Persistência, envio de e-mail, CRM, upload de anexo e busca real permanecem `DEPENDENTE_DE_BACKEND`
  em todas as dimensões desta comparação — a Etapa 3 entrega leiaute, fluxo e conteúdo estático de
  exemplo, não um sistema em produção.

## Síntese do que é deliberadamente preservado

- Paleta oficial de quatro cores, sem introdução de cor nova.
- Família tipográfica única (Montserrat), sem itálico e sem Montserrat Alternates.
- Ausência de preço, carrinho, checkout ou conta de usuário.
- WhatsApp como canal de conversão contextual complementar à Lista de cotação.
- Boas práticas de acessibilidade já existentes no código PHP atual.
- Ausência de framework JavaScript pesado como princípio de simplicidade técnica.
- Monolinguismo (`pt-BR`) e ausência de `hreflang`.
