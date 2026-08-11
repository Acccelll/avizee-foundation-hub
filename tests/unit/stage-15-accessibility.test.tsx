import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { QuoteForm } from "@/components/public/quotation/QuoteForm";

describe("Etapa 15 — formulário de cotação acessível", () => {
  it("relaciona erros aos campos e comunica obrigatoriedade semanticamente", () => {
    const html = renderToStaticMarkup(
      <QuoteForm
        disabled={false}
        submitting={false}
        errors={{
          companyName: "Informe a empresa.",
          contactEmail: "Informe um e-mail válido.",
        }}
        onSubmit={() => undefined}
      />,
    );

    expect(html).toContain('id="companyName-error"');
    expect(html).toContain('aria-describedby="companyName-error"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("(obrigatório)");
    expect(html).toContain('role="alert"');
    expect(html).toContain("Há campos que precisam ser corrigidos antes do envio.");
  });

  it("relaciona a orientação da mensagem por aria-describedby", () => {
    const html = renderToStaticMarkup(
      <QuoteForm disabled={false} submitting={false} errors={{}} onSubmit={() => undefined} />,
    );

    expect(html).toContain('id="message-hint"');
    expect(html).toContain('aria-describedby="message-hint"');
  });
});
