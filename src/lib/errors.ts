/**
 * Taxonomia central de erros (§28 da Etapa 5).
 * Respostas públicas nunca expõem stack, SQL, tabela, caminho ou segredo.
 */
export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "SESSION_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

const STATUS: Record<AppErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  SESSION_EXPIRED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

/** Mensagens públicas genéricas — sem detalhe interno e sem enumeração. */
const PUBLIC_MESSAGE: Record<AppErrorCode, string> = {
  VALIDATION_ERROR: "Não foi possível validar os dados enviados.",
  UNAUTHENTICATED: "Faça login para continuar.",
  SESSION_EXPIRED: "Sua sessão expirou. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para acessar este recurso.",
  NOT_FOUND: "Recurso não encontrado.",
  CONFLICT: "A operação conflita com o estado atual do registro.",
  RATE_LIMITED: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  SERVICE_UNAVAILABLE: "Serviço temporariamente indisponível.",
  INTERNAL_ERROR: "Ocorreu um erro inesperado.",
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly occurrenceId: string;
  readonly internal?: Record<string, unknown> | undefined;

  constructor(code: AppErrorCode, internal?: Record<string, unknown>) {
    super(PUBLIC_MESSAGE[code]);
    this.name = "AppError";
    this.code = code;
    this.status = STATUS[code];
    this.occurrenceId = crypto.randomUUID();
    this.internal = internal;
  }

  /** Corpo público: código + mensagem genérica + id de ocorrência. */
  toPublicJSON() {
    return { error: this.code, message: this.message, occurrenceId: this.occurrenceId };
  }

  toResponse() {
    return Response.json(this.toPublicJSON(), { status: this.status });
  }
}

export function toAppError(error: unknown): AppError {
  return error instanceof AppError ? error : new AppError("INTERNAL_ERROR");
}
