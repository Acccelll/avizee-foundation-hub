import {
  prepareAnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsPayloadMap,
  type PreparedAnalyticsEvent,
} from "./events";

export type AnalyticsConsent = "unknown" | "granted" | "denied";
export type AnalyticsSink = (event: PreparedAnalyticsEvent) => void | Promise<void>;

let consent: AnalyticsConsent = "unknown";
let sink: AnalyticsSink | null = null;

/**
 * Configura o adapter do provider somente quando ele existir e estiver aprovado.
 * A Etapa 15 não instala nem ativa provider externo.
 */
export function configureAnalyticsSink(nextSink: AnalyticsSink | null): void {
  sink = nextSink;
}

/** Consentimento é explícito; `unknown` e `denied` nunca enviam nem enfileiram eventos. */
export function setAnalyticsConsent(nextConsent: AnalyticsConsent): void {
  consent = nextConsent;
}

export function getAnalyticsConsent(): AnalyticsConsent {
  return consent;
}

export async function trackAnalytics<N extends AnalyticsEventName>(
  name: N,
  payload: AnalyticsPayloadMap[N],
): Promise<boolean> {
  if (consent !== "granted" || !sink) return false;

  const event = prepareAnalyticsEvent(name, payload);
  if (!event) return false;

  try {
    await sink(event);
    return true;
  } catch {
    // Analytics nunca pode quebrar a jornada pública ou comercial.
    return false;
  }
}

/** Utilitário isolado para testes; não deve ser usado para simular consentimento em produção. */
export function resetAnalyticsForTests(): void {
  consent = "unknown";
  sink = null;
}
