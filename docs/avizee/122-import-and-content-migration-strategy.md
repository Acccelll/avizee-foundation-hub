# 122 — Importação de Catálogo e Migração de Conteúdo

## 1. Fonte de importação

A base normalizada aprovada (`data/products-provisional.csv` + mapeamentos de família,
aplicação e segmento das Etapas 1 e 2.1), **não o PDF**. O PDF é evidência de origem, nunca
fonte automática de produção (D-038).

## 2. Pipeline

1. Upload de arquivo estruturado (CSV/JSON) com hash e identificação do operador.
2. Validação de esquema (colunas, tipos, enums, obrigatoriedade).
3. Validação semântica: família existente, categoria entre as 6, aplicação válida,
   unidade conhecida, SKU sem conflito, nome público sem marca de terceiro.
4. **Dry run obrigatório** com pré-visualização: criações, atualizações, ignorados, erros,
   duplicidades, conflitos.
5. Relatório revisado e confirmação explícita.
6. Aplicação por lote transacional, com `import_job` e `import_errors` persistidos.
7. Rollback por lote disponível.
8. Histórico permanente com operador, data, arquivo e resumo.

## 3. Regras

- Importação **nunca** sobrescreve silenciosamente: mudança de campo já validado exige marcação
  explícita de atualização e gera registro de histórico.
- Códigos iguais para produtos distintos → `BLOCKED_BY_CODE`, importados e não publicados.
- Códigos distintos para o mesmo item → **não** consolidados automaticamente; ficam em fila.
- Campos de marca/fornecedor entram apenas em colunas ADMIN_ONLY.
- Escopo da v1: as 31 famílias / 97 SKUs entram como `READY_TO_PUBLISH`; os demais como
  `UNDER_REVIEW` ou `BLOCKED_*` (D-054), nunca excluídos.

## 4. Migração de conteúdo do site atual

| Conteúdo | Ação |
|---|---|
| Textos institucionais | **Reescrever** (headline atual dá peso indevido a suinocultura) |
| Dados de contato | Migrar após conferência |
| Páginas de produto | Não existem individualmente — construir a partir da base normalizada |
| Imagens | Migrar apenas as aprovadas com direito confirmado |
| URLs | Migrar via tabela de redirecionamentos (`46-url-migration-map.md`) |
| Blog | Avaliar item a item; posts fictícios ou incompletos descartados |
| Documentos | Somente com direito de publicação; catálogo PDF antigo **não** é republicado |

**Nunca migrar**: credenciais, dependências inseguras, marcas públicas, imagens sem direito,
PDF antigo, textos incompletos, posts fictícios, metadados duplicados, arquivos temporários.

## 5. Redirecionamentos (planejados, não aplicados)

`/index.php → /` · `/produtos.php → /produtos` · `/produtos.html → /produtos` ·
`/sobre.php → /sobre` · `/contato.php → /contato` · `/blog.php → /conteudos` ·
`/assets/docs/catalogo.pdf → /produtos`.
Todos 301, mantidos em tabela, com prevenção de loop (validação de cadeia máxima 1 salto),
monitoramento de 404 e criação automática ao alterar slug. **Nada aplicado nesta etapa.**
