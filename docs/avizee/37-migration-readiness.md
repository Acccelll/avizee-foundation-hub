# 37 — Prontidão para Migração

## Semáforo por frente

| Frente | Estado | Justificativa |
|---|---|---|
| URLs e redirecionamentos | **VERDE** | 5 URLs, nenhuma página de SKU indexada; plano de 301 pronto (`19-url-inventory.md`) |
| Dados transacionais | **VERDE** | não existe banco nem histórico de leads: migração zero |
| Textos institucionais | **AMARELO** | aproveitáveis apenas após reescrita sob D-001/D-002 e R-11 |
| Catálogo — identificação | **AMARELO** | 174 SKUs consolidados, 10 bloqueados por divergência |
| Catálogo — dados técnicos | **VERMELHO** | nenhuma fonte traz descrição, aplicação, material ou segmento |
| Imagens | **VERMELHO** | 46% dos SKUs sem imagem e **0 imagens** com direito de uso confirmado |
| Marca (assets) | **AMARELO** | só a versão colorida existe; faltam mono, negativa, símbolo e favicon (O-26) |
| Tipografia | **AMARELO** | pesos completos, mas sem WOFF2 e sem licença documentada (O-24) |
| Conteúdo editorial | **VERMELHO** | o blog é maquete: nenhum artigo real a migrar |
| Segurança | **VERMELHO** | credenciais expostas ainda não revogadas (F-01, F-02 / O-27) |
| Conformidade legal | **VERMELHO** | sem política de privacidade nem base legal para os leads (RK-11) |

## O que já pode começar sem novas informações

1. Design system a partir da paleta oficial, do lockup colorido e da Montserrat.
2. Arquitetura de rotas e do modelo de dados com UUID como chave (D-036).
3. Estrutura da Lista de Cotação (D-007) e persistência do lead antes do envio (RK-07).
4. Camada de SEO por rota (title, description, canonical, OG, JSON-LD sem preço).
5. Importação dos 174 SKUs em estado **rascunho**, com os 10 divergentes bloqueados.

## O que não pode começar

1. Publicação de qualquer produto — depende de dados técnicos e de imagem aprovada.
2. Qualquer superfície pública com imagem — nenhuma tem direito de uso confirmado.
3. Central de Conteúdos — não há artigo escrito.
4. Aplicação do logotipo em fundo escuro — a versão negativa não existe.

## Sequência recomendada

`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

1. Revogar as credenciais expostas (O-27) — ação imediata, independente do projeto.
2. Fechar as 10 divergências de catálogo (`36-duplicates-and-divergences.md`).
3. Confirmar direito de uso das imagens e definir o placeholder oficial.
4. Completar os assets de marca (O-26) e converter as fontes (O-24).
5. Só então iniciar a Etapa 2 (arquitetura de informação e design system).
