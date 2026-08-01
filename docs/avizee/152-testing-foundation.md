# 152 — Fundação de Testes

Origem: `123-testing-strategy.md`.

## 1. Estado real

**Não há suíte de testes automatizados no repositório.** Nenhum arquivo de teste,
nenhum executor configurado.

Isso é uma lacuna da Etapa 5, não uma decisão de escopo: o prompt da Etapa 5 pedia
"testes" entre os requisitos fundacionais. Registrada como DV-05-09 em `155`.

## 2. O que foi verificado, e como

| Verificação | Método | Resultado |
|---|---|---|
| Type checking | `tsgo --noEmit` | sem erro |
| Lint e formatação | `eslint .` | 0 erros, 6 avisos (`react-refresh` em primitivos de UI) |
| Disponibilidade das rotas públicas | requisição HTTP a cada rota | todas `200` |
| Sessão sem cookie | `GET /api/auth/session` | `{"authenticated":false}` |
| Credencial inválida | `POST /api/auth/login` | `401`, sem distinguir o motivo |
| Indexação fora de produção | `GET /robots.txt` | `User-agent: * / Disallow: /` |

São verificações reais e reproduzíveis, mas manuais. Não substituem teste automatizado.

## 3. Suíte mínima a criar na Etapa 6

Prioridade, na ordem:

1. **Não vazamento** — nenhum campo interno (marca, fabricante, fornecedor, custo,
   nome original, notas, conflito, fonte) em API, HTML, JSON ou metadado público.
   Qualquer falha aqui é defeito bloqueante.
2. **Permissões no backend** — cada ação negada para cada papel sem direito.
3. **Transições de status** — as permitidas passam, as proibidas falham.
4. **Importação** — validação de esquema, dry run que não altera dados, idempotência,
   rollback.
5. **Sessão e autenticação** — assinatura, expiração, não enumeração, rate limit.

## 4. Ferramenta

`vitest` para unidade e integração; verificação de navegador para os fluxos ponta a
ponta. A configuração acompanha a primeira fatia da Etapa 6.
