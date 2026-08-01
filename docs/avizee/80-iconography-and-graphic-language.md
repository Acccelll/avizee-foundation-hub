# 80 — Iconografia e Linguagem Gráfica

Status: `PENDENTE_DE_APROVAÇÃO`. Documento normativo derivado de `10-brand-guidelines.md`
(paleta, logotipo, tipografia) e `02-non-negotiable-rules.md` (R-06, R-07). Nenhum ícone,
símbolo ou grafismo novo é criado por este documento: apenas se organiza o uso do que já é
oficial ou de bibliotecas neutras de terceiros aprovadas para uso técnico (não de marca).

## 1. Princípio geral

O sistema de ícones é um recurso funcional de apoio à leitura da interface — nunca um
elemento decorativo autônomo, nunca um substituto do vocabulário gráfico da marca
(símbolo galo + engrenagem, padrão secundário "V"). Ícone e grafismo de marca não se
confundem e não se combinam livremente: o símbolo oficial só aparece nos usos descritos em
`10-brand-guidelines.md` (lockup, símbolo isolado sobre cor); ícones de interface nunca
reutilizam ou reinterpretam a cabeça de galo, a engrenagem ou a crista.

## 2. Biblioteca-base

`LOVABLE_RECOMMENDATION` — **lucide-react** é adotada como biblioteca-base de ícones de
interface por ser vetorial, de traço único (stroke), licença permissiva e ausência de
qualquer carga de marca. Nenhuma outra biblioteca de ícones é usada na mesma tela sem
justificativa registrada, para não misturar espessuras e proporções de traço.

Proibido: ícones com preenchimento sólido de marca (brand packs), emojis como substituto
funcional de ícone, ícones de terceiros com identidade visual própria (ex.: logotipos de
bandeiras de cartão, redes sociais com cor de marca fixa) e qualquer ícone de rede social ou
aplicativo de terceiro fora do WhatsApp funcional já previsto em `50-quotation-journey.md`.

## 3. Regras de traço, tamanho e cor

| Atributo | Regra |
|---|---|
| Estilo | Traço (`stroke`), nunca preenchido (`fill`), coerente com o símbolo oficial que também é outline |
| Espessura | Uma única espessura de traço por escala de uso; não misturar traço fino e grosso na mesma tela |
| Tamanhos | Escala fixa: 16px (inline com texto/rótulo), 20px (padrão em botão e item de lista), 24px (navegação e cabeçalhos de bloco), 32px (estado vazio, destaque institucional) |
| Área de toque | Ícone interativo isolado nunca tem alvo de toque menor que 44×44px, mesmo que o traço visual seja menor |
| Cor | Somente a paleta oficial: Preto `#151514`, Vinho `#690500`, Terracota `#b2592c`, Creme `#fffaed`. Ícone nunca recebe cor funcional (erro/sucesso/aviso) fora da paleta enquanto essas cores não forem aprovadas (ver L-01 em `13-open-decisions.md`) |
| Contraste | Ícone sobre fundo colorido segue a mesma regra de monocromia do logotipo: nunca duas cores da paleta no mesmo ícone |
| Consistência | Mesmo conceito (ex.: "adicionar", "buscar", "remover") usa sempre o mesmo ícone em todo o site |

## 4. Ícone nunca sozinho em ação crítica

Regra vinculante para todas as ações que alteram estado, navegam para fora do fluxo atual ou
têm efeito comercial (adicionar à lista de cotação, remover item, enviar formulário, abrir
WhatsApp, aplicar/limpar filtro, editar quantidade, confirmar exclusão): o ícone é sempre
acompanhado de rótulo textual visível ou, quando o espaço não permitir texto visível, de texto
acessível equivalente (`aria-label` ou `sr-only`) associado ao elemento interativo. Ícone puro
sem qualquer rótulo (visível ou acessível) é proibido em ações críticas; é tolerado apenas em
ações reversíveis e universalmente reconhecíveis de suporte (ex.: fechar um modal, expandir um
acordeão), e mesmo assim com `aria-label` obrigatório.

## 5. Linguagem gráfica permitida

`BRANDING` / `USER_DECISION` (D-032) — o vocabulário gráfico do site é limitado a:

- **Logotipo** (lockup símbolo + wordmark), nas aplicações descritas em `10`;
- **Símbolo isolado** (cabeça de galo + meia engrenagem), aplicado em creme sobre terracota,
  preto ou vinho, nos usos institucionais previstos (favicon, marca d'água discreta,
  splash/loading da marca, seção "Sobre");
- **Padrão secundário oficial** ("grafismo V"), sempre **separado** do símbolo galo+engrenagem,
  usado como recurso de composição (fundo de seção, divisor, elemento do placeholder oficial de
  imagem definido em `09-image-policy.md` e detalhado em `81-image-and-placeholder-specification.md`);
- **Blocos sólidos de cor** da paleta oficial, sem gradiente, sombra ou textura.

### 5.1 Proibições de linguagem gráfica

- Nenhum grafismo novo além do padrão secundário oficial (D-032): proibido criar formas,
  padrões geométricos, ilustrações abstratas ou texturas adicionais para preencher vazios de
  layout.
- Proibido preencher o símbolo (ele é sempre outline).
- Proibido recolorir símbolo e wordmark com cores diferentes sobre fundo colorido.
- Proibido usar o padrão secundário sobreposto ou fundido ao símbolo galo+engrenagem.
- Proibido gradiente, sombra projetada, brilho, glassmorphism, efeito 3D ou qualquer decoração
  não prevista na direção visual aprovada (blocos chapados, respiro amplo, contraste por cor e
  peso tipográfico).
- Proibido introduzir qualquer marca, logotipo, selo ou ícone de terceiro no frontend (R-05).

## 6. Ilustração e fotografia

- Não há linha de ilustração própria aprovada. Nenhuma ilustração customizada é criada nesta
  etapa; qualquer necessidade de ilustração é registrada como pendência de aprovação, nunca
  resolvida com um asset genérico de estoque.
- Fotografia segue exclusivamente o acervo de avicultura descrito em `10-brand-guidelines.md`:
  aves adultas, pintinhos, manejo humano, ambiente de granja, em planos fechados, com
  possibilidade de logotipo sobreposto em composições institucionais (hero, Sobre).
- Fotografia de produto segue `09-image-policy.md` e `81-image-and-placeholder-specification.md`,
  nunca a linguagem institucional de granja.
- Proibido usar banco de imagens genérico "corporativo" (mãos apertando, gráficos de crescimento
  abstratos, escritório internacional) que não tenha relação direta com avicultura ou com o
  produto documentado.

## 7. Tratamento do logotipo em header, footer e favicon

| Contexto | Aplicação |
|---|---|
| Header (fundo creme) | Lockup completo; símbolo em Vinho `#690500`, wordmark em Terracota `#b2592c` |
| Header (variação sobre cor, se existir) | Logotipo inteiro monocromático em Creme `#fffaed` |
| Footer (fundo escuro/preto ou vinho) | Logotipo inteiro em Creme `#fffaed`, monocromático |
| Favicon | Símbolo isolado (cabeça de galo + meia engrenagem), nunca a wordmark isolada, nunca o lockup completo espremido |
| Splash/carregamento da marca | Símbolo isolado, sem preenchimento, sem animação de rotação ou distorção da forma |

Regras de proteção: manter proporção original do lockup em qualquer escala; não distorcer,
inclinar, espelhar ou rotacionar o logotipo; não sobrepor texto, ícone ou grafismo sobre o
logotipo; respiro mínimo ao redor do logotipo segue a maior área livre praticável até que a
área de respiro oficial seja definida pelo manual (pendência registrada em `10`, "Pendências de
branding"). Assets vetoriais (SVG) ainda não foram recebidos (O-22); até a entrega, qualquer
uso do logotipo depende de vetorização aprovada antes de produção.

## 8. Status

Todas as definições deste documento são `PENDENTE_DE_APROVAÇÃO` até validação formal, conforme
R-10. Nenhuma implementação em `src/` decorre automaticamente deste documento.
