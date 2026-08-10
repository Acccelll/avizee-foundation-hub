import { afterEach, describe, expect, it, vi } from "vitest";

import { getServerConfig, resetServerConfigCache } from "@/lib/env.server";
import { getEmailProvider, resendEmailProvider } from "@/services/adapters.server";

const ORIGINAL = { ...process.env };
const ORIGINAL_FETCH = globalThis.fetch;

function withEnv(patch: Record<string, string | undefined>) {
  resetServerConfigCache();
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

afterEach(() => {
  process.env = { ...ORIGINAL };
  globalThis.fetch = ORIGINAL_FETCH;
  resetServerConfigCache();
  vi.restoreAllMocks();
});

describe("provider Resend", () => {
  it("exige configuração completa quando selecionado", () => {
    withEnv({
      APP_ENV: "test",
      EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: undefined,
      RESEND_FROM: undefined,
      EMAIL_REPLY_TO: undefined,
    });

    expect(() => getServerConfig()).toThrow(/RESEND_API_KEY/);
  });

  it("mantém provider de log em testes por padrão", () => {
    withEnv({ APP_ENV: "test", EMAIL_PROVIDER: "log" });
    expect(getEmailProvider().name).toBe("dev-log");
  });

  it("envia somente pelos parâmetros server-side aprovados", async () => {
    withEnv({
      APP_ENV: "test",
      EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM: "AviZee <cotacoes@envios.avizee.com.br>",
      EMAIL_REPLY_TO: "comercial@avizee.com.br",
    });

    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ id: "email_123" }),
    })) as unknown as typeof fetch;
    globalThis.fetch = fetchMock;

    const result = await resendEmailProvider.send({
      to: "cliente@example.com",
      subject: "Cotação recebida",
      text: "Mensagem de teste",
      template: "quotation-confirmation",
    });

    expect(result).toEqual({ queued: true, providerMessageId: "email_123" });
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, init] = vi.mocked(fetchMock).mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer re_test_key",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      from: "AviZee <cotacoes@envios.avizee.com.br>",
      to: ["cliente@example.com"],
      subject: "Cotação recebida",
      text: "Mensagem de teste",
      reply_to: "comercial@avizee.com.br",
    });
  });

  it("não expõe resposta do provedor ao falhar", async () => {
    withEnv({
      APP_ENV: "test",
      EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM: "AviZee <cotacoes@envios.avizee.com.br>",
      EMAIL_REPLY_TO: "comercial@avizee.com.br",
    });

    globalThis.fetch = vi.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ message: "detalhe sensível do provedor" }),
    })) as unknown as typeof fetch;

    await expect(
      resendEmailProvider.send({
        to: "cliente@example.com",
        subject: "Cotação recebida",
        text: "Mensagem de teste",
      }),
    ).rejects.toThrow("Falha no provedor de e-mail (401).");
  });
});
