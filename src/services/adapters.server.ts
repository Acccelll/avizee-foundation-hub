/**
 * Adaptadores da Etapa 5 — MOCK CONTROLADO E IDENTIFICADO.
 * Nenhum envio externo, nenhum dado real, nenhuma coleta.
 * Substituir pelos provedores aprovados (DT-11, DT-12, DT-17) sem alterar o
 * fluxo de negócio.
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
    logger.info("email.simulated", { to: message.to, subject: message.subject, template: message.template });
    return { queued: true, providerMessageId: null };
  },
};

/** Storage local: tudo nasce privado; nenhuma URL pública é emitida. */
export const localStorageProvider: StorageProvider = {
  name: "local-private",
  async put(input) {
    logger.info("storage.put.simulated", { key: input.key, contentType: input.contentType, size: input.size });
    return { key: input.key, visibility: "private", contentType: input.contentType, size: input.size };
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
  return devEmailProvider;
}

export function getStorageProvider(): StorageProvider {
  return localStorageProvider;
}
