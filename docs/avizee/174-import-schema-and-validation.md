# 174 — Contrato e Validação da Importação

Versão do contrato: **1.0.0**. Arquivo fora da versão é recusado.

Colunas: `sku_publico`, `nome_publico`, `familia_slug`, `categoria_slug`, `variacao`, `medida`,
`capacidade`, `unidade`, `descricao_publica`, `sob_consulta`, `codigo_original`, `marca_interna`,
`observacao_interna`.

Validações aplicadas:
- cabeçalho exato; colunas ausentes ou extras são erro;
- SKU e nome público obrigatórios; nome com no mínimo 3 caracteres;
- família precisa existir no banco, senão a linha é bloqueada;
- limite de tamanho por campo;
- neutralização de injeção de fórmula (`=`, `+`, `-`, `@`, tabulação, retorno de carro);
- `marca_interna` e `observacao_interna` só alimentam colunas administrativas;
- termos de marca em campo público reprovam a linha (R-05).

Erros são persistidos em `import_errors` sem abortar o lote inteiro.
