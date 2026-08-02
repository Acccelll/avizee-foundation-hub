# 183 — Linha de Base de Desempenho

- Suíte completa (174 testes, 10 arquivos) em ~67 s, sem paralelismo entre arquivos que tocam
  o banco.
- Simulação de 97 linhas: ~1,5 s, incluindo carga de contexto do catálogo.
- Execução de 97 linhas: ~7 s, dominada por escritas linha a linha.
- Listagens administrativas limitadas e ordenadas no servidor.
- **Limitação:** medição de Lighthouse e orçamento de performance de páginas públicas não se
  aplica nesta etapa; permanece para a Etapa 7. Registrada como desvio DV-06-04.
