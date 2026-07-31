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
