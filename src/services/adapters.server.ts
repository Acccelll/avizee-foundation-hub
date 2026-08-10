/**
 * Adaptadores externos desacoplados do fluxo de negócio.
 * Em desenvolvimento/homologação, e-mail permanece simulado.
 * O provider Resend só opera quando explicitamente configurado.
 */
import { logger } from "@/lib/logger";
import { getServerConfig } from "@/lib/env.server";
import type {
  AnalyticsProvider,
  CaptchaProvider,
  EmailProvider,
  MapProvider,
  NotificationProvider,
  StorageProvider,
} from "./contracts";

/** Registra a intenção de envio; nunca chama rede. */
export const devEmailProvider: EmailProvider = {
  name: "dev-log",
  async send(message) {
    const { APP_ENV } = getServerConfig();
    if (APP_ENV === "production") {
      throw new Error("Provedor de e-mail de desenvolvimento não pode operar em produção.");
    }
    logger.info("email.simulated", {
      to: message.to,
      subject: message.subject,
      template: message.template,
    });
    return { queued: true, providerMessageId: null };
  },
};

/**
 * Provider transacional aprovado para produção.
 * Credenciais e remetentes são sempre lidos de configuração server-only.
 */
export const resendEmailProvider: EmailProvider = {
  name: "resend",
  async send(message) {
    const config = getServerConfig();
    if (
      config.EMAIL_PROVIDER !== "resend" ||
      !config.RESEND_API_KEY ||
      !config.RESEND_FROM ||
      !config.EMAIL_REPLY_TO
    ) {
      throw new Error("Provider Resend não está completamente configurado.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "avizee-foundation-hub/1.0",
      },
      body: JSON.stringify({
        from: config.RESEND_FROM,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        reply_to: config.EMAIL_REPLY_TO,
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha no provedor de e-mail (${response.status}).`);
    }

    const payload = (await response.json()) as { id?: string };
    if (!payload.id) {
      throw new Error("Provedor de e-mail não retornou identificador da mensagem.");
    }

    return { queued: true, providerMessageId: payload.id };
  },
};

/** Storage local: tudo nasce privado; nenhuma URL pública é emitida. */
export const localStorageProvider: StorageProvider = {
  name: "local-private",
  async put(input) {
    logger.info("storage.put.simulated", {
      key: input.key,
      contentType: input.contentType,
      size: input.size,
    });
    return {
      key: input.key,
      visibility: "private",
      contentType: input.contentType,
      size: input.size,
    };
  },
  async urlFor(object) {
    return object.visibility === "public" ? `/media/${object.key}` : null;
  },
};

/** Captcha não aprovado: recusa por padrão em vez de aprovar silenciosamente. */
export const nullCaptchaProvider: CaptchaProvider = {
  name: "null",
  async verify() {
    logger.warn("captcha.not_configured");
    return false;
  },
};

/** Analytics desligado (§4): nenhum evento sai da aplicação. */
export const disabledAnalyticsProvider: AnalyticsProvider = {
  name: "disabled",
  async track(event) {
    logger.debug("analytics.disabled", { event });
  },
};

/** Mapa não ativado nesta etapa. */
export const disabledMapProvider: MapProvider = {
  name: "disabled",
  embedUrl() {
    return null;
  },
};

export const nullNotificationProvider: NotificationProvider = {
  name: "null",
  async notify(channel) {
    logger.info("notification.simulated", { channel });
  },
};

export function getEmailProvider(): EmailProvider {
  return getServerConfig().EMAIL_PROVIDER === "resend" ? resendEmailProvider : devEmailProvider;
}

export function getStorageProvider(): StorageProvider {
  return localStorageProvider;
}
