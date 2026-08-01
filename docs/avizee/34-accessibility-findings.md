# 34 — Achados de Acessibilidade

Base: análise estática do markup recebido. **Nenhuma auditoria em navegador foi executada** —
contraste, ordem de foco e leitura por leitor de tela permanecem não verificados.

## Achados

| ID | Achado | Onde | Severidade |
|---|---|---|---|
| F-14 | Links de ação com `href="#"` ("Detalhes" nos produtos, títulos dos artigos do blog) | `index.php`, `produtos.php`, `blog.php` | ALTA |
| F-16 | Modal de produto sem gestão documentada de foco, `role="dialog"`/`aria-modal` e fechamento por `Esc` | `index.php:205-214` | MÉDIA |
| F-17 | `<img id="modal-image" alt="">` com alt preenchido por script | `index.php:209` | BAIXA |
| F-15 | Contraste e indicador de foco não verificados | `assets/css/style.css` | MÉDIA |

## Pontos corretos do sistema atual

- `lang="pt-BR"` em todas as páginas.
- `aria-labelledby` nas seções da home e `aria-label` na navegação principal.
- Botão de menu mobile com `aria-expanded` atualizado por JS.
- `aria-label` nos botões do carrossel, no botão de fechar do modal e nos links sociais.
- `aria-required` nos campos obrigatórios do formulário e `label` associado a cada input.
- Ícones SVG decorativos com `aria-hidden="true"` e `focusable="false"`.
- Alt descritivo gerado a partir do nome do produto nos cards de destaque.
- Logotipo com `width`/`height` explícitos, evitando deslocamento de layout.

`TECHNICAL_INFERENCE` — Raciocínio: o markup atual demonstra preocupação real com ARIA, o que é
incomum e favorável. Os problemas restantes são de **destino de link** e de **componente modal**,
ambos naturalmente resolvidos ao substituir o modal por páginas de produto reais na v1.

## Meta para a v1

`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

Adotar **WCAG 2.1 nível AA** como critério de aceite, com verificação obrigatória de contraste
da paleta oficial: Terracota `#b2592c` e Vinho `#690500` sobre Creme `#fffaed` precisam ser
medidos antes de virarem cor de texto — a combinação Terracota/Creme é a de maior risco.
