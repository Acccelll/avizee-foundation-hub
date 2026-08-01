# 33 — Achados de Segurança

Fonte: leitura do código-fonte recebido (S-02). Detalhe tabular em `data/findings.csv`.

> Nenhum segredo é reproduzido nesta documentação. Os valores foram vistos apenas para
> confirmar a exposição e permanecem fora do repositório.

## Críticos

| ID | Achado | Onde | Ação |
|---|---|---|---|
| **F-01** | Usuário e **senha de aplicativo Gmail** em texto claro | `send_email.php:82-85` | **Revogar a senha de aplicativo agora** na conta Google. O pacote trafegou por canal comum: considere a credencial comprometida. |
| **F-02** | **Chave secreta do reCAPTCHA** literal no código | `send_email.php:24` | Gerar novo par de chaves e guardar como segredo de servidor |

Ambos correspondem a **RK-15** / **O-27**, que permanecem ativos e dependem de ação do usuário.

## Altos e médios

| ID | Achado | Onde | Efeito |
|---|---|---|---|
| F-03 | `display_errors = 1` e `error_reporting(E_ALL)` em produção | `send_email.php:3-4` | vaza caminho absoluto e stack trace |
| F-04 | Remetente em conta Gmail de terceiro (`acelerador.to@gmail.com`) | `send_email.php:98` | entregabilidade e confiança do domínio |
| F-05 | Sem rate limit no endpoint de envio | `send_email.php` | abuso e spam de leads |
| F-26 | Sem política de privacidade nem consentimento no formulário | `contato.php` | LGPD (RK-11) |

## Pontos corretos do sistema atual

- Honeypot (`website`) e reCAPTCHA presentes no formulário.
- `filter_var` para e-mail e `htmlspecialchars` nos campos de texto.
- `rel="noopener noreferrer"` nos links externos do rodapé.
- Nenhum banco de dados exposto (não existe banco).

## Regras para a v1

1. Nenhum segredo em código ou repositório — sempre segredo de servidor.
2. Validação server-side de todo input, além do reCAPTCHA.
3. Persistir a cotação antes de qualquer envio de e-mail (RK-07).
4. Nunca expor campo interno de marca, dado de lead ou log com PII (RK-08, RK-11).
5. Erros logados no servidor, nunca renderizados ao visitante.
