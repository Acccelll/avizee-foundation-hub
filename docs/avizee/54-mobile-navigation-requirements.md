# 54 — Requisitos Arquiteturais de Mobile

Status: `PENDENTE_DE_APROVAÇÃO`. Sem estilos, dimensões ou protótipos.

| Componente | Requisito no mobile | Difere do desktop? |
|---|---|---|
| Menu | Painel de tela cheia; cotação no topo; Produtos em acordeão de 1 nível | **Sim** |
| Busca | Ícone no cabeçalho abre campo em tela cheia com sugestões | **Sim** |
| Filtros | Painel sobreposto com "aplicar" e "limpar"; contador de filtros ativos no botão | **Sim** |
| Cards | Uma coluna; imagem, nome, categoria, nº de variações | Não |
| Seletor de variação | Lista rolável ou seletor nativo; nunca tabela horizontal com rolagem | **Sim** |
| Tabela de especificações | Vira lista de pares rótulo/valor | **Sim** |
| Lista de cotação | Barra inferior persistente "N itens · Solicitar cotação" | **Sim** |
| Formulário | Um campo por linha; teclado por tipo; sem etapas artificiais; erro acima do campo | Parcial |
| WhatsApp | Ação de um toque, sempre na área de alcance do polegar | **Sim** |
| Breadcrumbs | Reduzido ao nível pai ("‹ Vacinação e aplicação") | **Sim** |
| Artigos | Coluna única; sumário recolhido | Parcial |
| Imagens | Formatos modernos, tamanhos responsivos, carregamento diferido abaixo da dobra, dimensão reservada para não deslocar o conteúdo | Não |
| Mapa | Só após interação (D-049) | Não |
| CTA persistente | **Recomendado**: barra inferior nas páginas de família, categoria e cotação; ausente em institucionais e legais | **Sim** |

Componentes que exigem comportamento distinto e devem ser desenhados como tal na Etapa 3:
menu, busca, filtros, seletor de variação, tabela de variações, barra de cotação e breadcrumb.
