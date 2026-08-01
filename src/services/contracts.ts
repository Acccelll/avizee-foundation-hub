/**
 * Contratos de serviços externos (§25 da Etapa 5).
 * Nenhum provedor real é ativado nesta etapa. O código de negócio depende
 * apenas destas interfaces.
 */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  template?: string;
}

export interface EmailProvider {
  readonly name: string;
  /** Nesta etapa nenhuma implementação envia mensagem externa. */
  send(message: EmailMessage): Promise<{ queued: boolean; providerMessageId: string | null }>;
}

export interface StoredObject {
  key: string;
  visibility: "private" | "public";
  contentType: string;
  size: number;
}

export interface StorageProvider {
  readonly name: string;
  /** Upload sempre nasce privado (política de mídia da Etapa 4). */
  put(input: { key: string; contentType: string; size: number; visibility?: "private" }): Promise<StoredObject>;
  urlFor(object: StoredObject): Promise<string | null>;
}

export interface CaptchaProvider {
  readonly name: string;
  verify(token: string): Promise<boolean>;
}

export interface AnalyticsProvider {
  readonly name: string;
  track(event: string, payload?: Record<string, unknown>): Promise<void>;
}

export interface MapProvider {
  readonly name: string;
  /** Carregamento só sob interação explícita (DT-17). */
  embedUrl(query: string): string | null;
}

export interface NotificationProvider {
  readonly name: string;
  notify(channel: string, payload: Record<string, unknown>): Promise<void>;
}
