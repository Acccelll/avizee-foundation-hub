# 44 — Modelo de Navegação (menu, rodapé, breadcrumbs, links internos)

Status: `PENDENTE_DE_APROVAÇÃO`

## 1. Menu principal — desktop

| Ordem | Rótulo | Destino | Comportamento | Justificativa |
|---|---|---|---|---|
| 1 | Produtos | `/produtos` | **Painel de categorias** ao abrir (6 categorias + atalho "Ver todos") | Entrada principal do catálogo; clicável, não só hover |
| 2 | Soluções | `/solucoes` | Lista simples das 3-4 soluções publicadas | Poucas páginas, não justifica painel |
| 3 | Conteúdos | `/conteudos` | Link direto | Categoria editorial se descobre dentro da página |
| 4 | Sobre | `/sobre` | Link direto | — |
| 5 | Contato | `/contato` | Link direto | — |
| — | **Solicitar cotação** | `/cotacao` | **CTA principal**, botão com contador de itens | Conversão única do projeto (D-044) |
| — | Busca | `/busca` | Ícone que abre campo | Jornadas J-1 e J-4 dependem dela |

"Início" **não** ocupa item de menu: a função é do logotipo, padrão consolidado, e libera espaço
no primeiro nível (5 itens + CTA + busca). Total de itens de primeiro nível: 5.

### Mega menu
`LOVABLE_RECOMMENDATION` — **Não usar mega menu com famílias.** Um painel de **6 categorias com
uma linha de descrição cada** é suficiente e sustentável. Um mega menu com famílias precisaria de
manutenção a cada nova família (P-6), teria rótulos ainda não normalizados (RK-18) e é hostil no
mobile. Decisão em `58` (DEC-03).

### Riscos do menu
- Rotular "Soluções" e "Produtos" lado a lado pode confundir quem busca por peça. Mitigação: a
  descrição no painel de Produtos diz "por tipo de item"; Soluções diz "por necessidade".
- "Conteúdos" tem baixa taxa de clique em B2B; aceito, porque o tráfego editorial chega por busca
  orgânica, não pelo menu.

## 2. Menu principal — mobile

- Barra fixa: logotipo · ícone de busca · ícone da Lista de cotação com contador · botão do menu.
- Menu em painel de tela cheia, com o campo de busca no topo.
- Ordem: **Solicitar cotação** (primeiro, como bloco destacado) · Produtos · Soluções ·
  Conteúdos · Sobre · Contato · WhatsApp · dados de atendimento.
- Produtos abre um segundo nível **dentro do painel** (acordeão), com as 6 categorias e
  "Ver todos os produtos". Sem terceiro nível.
- Fechar o menu não perde o estado da lista de cotação.

## 3. Rodapé

| Grupo | Itens |
|---|---|
| Institucional | Logotipo · frase curta de posicionamento · Sobre · Contato |
| Produtos | As 6 categorias · Ver todos |
| Soluções | Soluções publicadas |
| Conteúdos | Central de Conteúdos · categorias editoriais principais |
| Atendimento | Telefone `DADO_PENDENTE` · WhatsApp `DADO_PENDENTE` · e-mail `DADO_PENDENTE` · horário `DADO_PENDENTE` · endereço `DADO_PENDENTE` · "Atendimento em todo o Brasil" |
| Legal | Política de Privacidade · Política de Cookies · Termos de Uso · razão social e CNPJ `DADO_PENDENTE` |
| Redes | Instagram `DADO_PENDENTE` · LinkedIn `DADO_PENDENTE` (`rel="noopener noreferrer"`) |
| Linha final | Copyright com ano · atalho "Solicitar cotação" |

Todos os `DADO_PENDENTE` dependem de Q-08 e Q-13. Nenhum valor foi inventado. O rodapé **não**
exibe preço, marca de terceiro, prazo ou promessa comercial (R-11, RK-12).

## 4. Breadcrumbs

| Tipo de página | Trilha |
|---|---|
| Categoria | Início › Produtos › {Categoria} |
| Família | Início › Produtos › {Categoria} › {Família} |
| SKU (exceção) | Início › Produtos › {Categoria} › {Família} › {Variação} |
| Solução | Início › Soluções › {Solução} |
| Categoria editorial | Início › Conteúdos › {Categoria editorial} |
| Artigo | Início › Conteúdos › {Categoria editorial} › {Título} |
| Autor | Início › Conteúdos › Autores › {Nome} |
| Institucional e legal | Início › {Página} |

Regras: máximo de 5 níveis; o último item não é link; o título do artigo é truncado visualmente
sem truncar o dado estruturado.

**Hierarquia quando há múltiplas aplicações**: prevalece sempre a **categoria canônica** da
família, nunca a solução de origem. A solução é caminho de descoberta, não de hierarquia — isso
mantém uma única trilha por família e evita conteúdo duplicado (ver `55`).

## 5. Navegação contextual e links internos

| Origem | Bloco | Regra de seleção |
|---|---|---|
| Home | Categorias principais | Fixo: as 6 categorias |
| Categoria | Famílias · Soluções relacionadas · Artigos | Relação declarada, nunca automática |
| Solução | Categorias · Famílias · Artigos | Curadoria manual |
| Família | "Você também pode precisar" | **Complemento funcional declarado** (ex.: agulha ↔ seringa), status `CONFIRMADA` ou `RECOMENDADA` em `data/product-content-relations.csv` |
| Família | "Conteúdos recomendados" | Artigo que cita a família |
| Artigo | "Produtos citados" | Somente famílias efetivamente mencionadas |
| Lista de cotação | "Continue sua cotação" | Volta para a última categoria visitada |
| Busca vazia | "Não encontrou o que procura?" | Leva ao pedido de item não catalogado (D-040) |

**Proibido**: recomendar por prefixo de SKU, por proximidade alfabética ou por ordem de importação.
Sem relação declarada, o bloco **não é renderizado** — nunca preenchido aleatoriamente.
