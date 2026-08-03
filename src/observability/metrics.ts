/**
 * Métricas operacionais da Etapa 11 (§28).
 *
 * Contadores e latências em memória do worker, expostos apenas por endpoint
 * autenticado/administrativo ou por log estruturado. Regras:
 *  - nenhum rótulo pode conter PII (e-mail, telefone, nome, protocolo, id de usuário);
 *  - o conjunto de nomes é fechado — métricas ad hoc são rejeitadas;
 *  - o estado é volátil por worker e nunca substitui a auditoria em banco.
 */

export const METRIC_NAMES = [
  "http_requests_total",
  "http_errors_total",
  "http_request_duration_ms",
  "search_queries_total",
  "search_zero_results_total",
  "quotation_submissions_total",
  "quotation_failures_total",
  "quotation_duplicates_prevented_total",
  "outbox_pending",
  "outbox_delivered_total",
  "outbox_failed_total",
  "outbox_processing_duration_ms",
  "content_publications_total",
  "content_publication_failures_total",
  "storage_uploads_total",
  "storage_failures_total",
  "jobs_total",
  "backups_total",
] as const;

export type MetricName = (typeof METRIC_NAMES)[number];

/** Rótulos permitidos. Qualquer outro é descartado (§28: sem PII em labels). */
const ALLOWED_LABELS = [
  "env",
  "route",
  "method",
  "status",
  "outcome",
  "reason",
  "entity",
] as const;

export type MetricLabels = Partial<Record<(typeof ALLOWED_LABELS)[number], string>>;

/** Valores de rótulo são normalizados para cardinalidade baixa e sem dados livres. */
export function sanitizeLabels(labels: MetricLabels = {}): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(labels)) {
    if (!ALLOWED_LABELS.includes(key as (typeof ALLOWED_LABELS)[number])) continue;
    if (typeof value !== "string" || value.length === 0) continue;
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9/_:.-]/g, "")
      .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27}/g, "/:id")
      .slice(0, 64);
    if (normalized) out[key] = normalized;
  }
  return out;
}

function seriesKey(name: MetricName, labels: Record<string, string>) {
  const parts = Object.keys(labels)
    .sort()
    .map((k) => `${k}=${labels[k]}`);
  return parts.length ? `${name}{${parts.join(",")}}` : name;
}

type Counter = { type: "counter"; name: MetricName; labels: Record<string, string>; value: number };
type Gauge = { type: "gauge"; name: MetricName; labels: Record<string, string>; value: number };
type Histogram = {
  type: "histogram";
  name: MetricName;
  labels: Record<string, string>;
  count: number;
  sum: number;
  max: number;
};

export type MetricSample = Counter | Gauge | Histogram;

const registry = new Map<string, MetricSample>();

export function increment(name: MetricName, labels: MetricLabels = {}, by = 1) {
  const safe = sanitizeLabels(labels);
  const key = seriesKey(name, safe);
  const current = registry.get(key);
  if (current && current.type === "counter") current.value += by;
  else registry.set(key, { type: "counter", name, labels: safe, value: by });
}

export function setGauge(name: MetricName, value: number, labels: MetricLabels = {}) {
  const safe = sanitizeLabels(labels);
  registry.set(seriesKey(name, safe), { type: "gauge", name, labels: safe, value });
}

export function observe(name: MetricName, durationMs: number, labels: MetricLabels = {}) {
  const safe = sanitizeLabels(labels);
  const key = seriesKey(name, safe);
  const current = registry.get(key);
  if (current && current.type === "histogram") {
    current.count += 1;
    current.sum += durationMs;
    current.max = Math.max(current.max, durationMs);
  } else {
    registry.set(key, {
      type: "histogram",
      name,
      labels: safe,
      count: 1,
      sum: durationMs,
      max: durationMs,
    });
  }
}

export function snapshot(): MetricSample[] {
  return [...registry.values()].map((s) => ({ ...s }));
}

export function resetMetrics() {
  registry.clear();
}
