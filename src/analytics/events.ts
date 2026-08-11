export interface AnalyticsPayloadMap {
  page_view: { path: string; template: string };
  search_performed: { query?: string; result_count: number };
  filter_applied: { filter_type: string; filter_value: string };
  family_viewed: { family_slug: string };
  sku_selected: { sku: string };
  quotation_item_added: { sku: string; quantity: number };
  quotation_started: { item_count: number };
  quotation_submitted: { protocol: string };
  whatsapp_clicked: { protocol: string; origin: string };
  content_viewed: { article_slug: string; category_slug: string };
  document_downloaded: { document_id: string; document_type: string };
}

export type AnalyticsEventName = keyof AnalyticsPayloadMap;
export type AnalyticsPayloadValue = string | number;

export interface PreparedAnalyticsEvent {
  name: AnalyticsEventName;
  payload: Record<string, AnalyticsPayloadValue>;
}

const SAFE_TOKEN = /^[a-zA-Z0-9._:/?=&%+-]{1,180}$/;
const SAFE_SLUG = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i;
const EMAIL_LIKE = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/i;
const PHONE_LIKE = /(?:\+?\d[\s().-]*){8,}/;

function safeToken(value: string, maxLength = 180): string | null {
  const normalized = value.trim().slice(0, maxLength);
  return normalized && SAFE_TOKEN.test(normalized) ? normalized : null;
}

function safeSlug(value: string): string | null {
  const normalized = value.trim().slice(0, 120);
  return normalized && SAFE_SLUG.test(normalized) ? normalized : null;
}

function safeCount(value: number): number | null {
  return Number.isInteger(value) && value >= 0 && value <= 1_000_000 ? value : null;
}

/**
 * Query de busca é opcional no analytics. Se houver indício de contato pessoal,
 * o termo inteiro é descartado em vez de tentar anonimização heurística.
 */
export function normalizeAnalyticsSearchQuery(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.normalize("NFKC").replace(/\s+/g, " ").trim().slice(0, 80);
  if (!normalized || EMAIL_LIKE.test(normalized) || PHONE_LIKE.test(normalized)) return undefined;
  return normalized;
}

export function prepareAnalyticsEvent<N extends AnalyticsEventName>(
  name: N,
  input: AnalyticsPayloadMap[N],
): PreparedAnalyticsEvent | null {
  switch (name) {
    case "page_view": {
      const payload = input as AnalyticsPayloadMap["page_view"];
      const path = safeToken(payload.path);
      const template = safeSlug(payload.template);
      return path && template ? { name, payload: { path, template } } : null;
    }
    case "search_performed": {
      const payload = input as AnalyticsPayloadMap["search_performed"];
      const resultCount = safeCount(payload.result_count);
      if (resultCount === null) return null;
      const query = normalizeAnalyticsSearchQuery(payload.query);
      return {
        name,
        payload: query ? { query, result_count: resultCount } : { result_count: resultCount },
      };
    }
    case "filter_applied": {
      const payload = input as AnalyticsPayloadMap["filter_applied"];
      const filterType = safeSlug(payload.filter_type);
      const filterValue = safeSlug(payload.filter_value);
      return filterType && filterValue
        ? { name, payload: { filter_type: filterType, filter_value: filterValue } }
        : null;
    }
    case "family_viewed": {
      const value = safeSlug((input as AnalyticsPayloadMap["family_viewed"]).family_slug);
      return value ? { name, payload: { family_slug: value } } : null;
    }
    case "sku_selected": {
      const value = safeToken((input as AnalyticsPayloadMap["sku_selected"]).sku, 80);
      return value ? { name, payload: { sku: value } } : null;
    }
    case "quotation_item_added": {
      const payload = input as AnalyticsPayloadMap["quotation_item_added"];
      const sku = safeToken(payload.sku, 80);
      const quantity = safeCount(payload.quantity);
      return sku && quantity !== null ? { name, payload: { sku, quantity } } : null;
    }
    case "quotation_started": {
      const count = safeCount((input as AnalyticsPayloadMap["quotation_started"]).item_count);
      return count !== null ? { name, payload: { item_count: count } } : null;
    }
    case "quotation_submitted": {
      const protocol = safeToken(
        (input as AnalyticsPayloadMap["quotation_submitted"]).protocol,
        100,
      );
      return protocol ? { name, payload: { protocol } } : null;
    }
    case "whatsapp_clicked": {
      const payload = input as AnalyticsPayloadMap["whatsapp_clicked"];
      const protocol = safeToken(payload.protocol, 100);
      const origin = safeSlug(payload.origin);
      return protocol && origin ? { name, payload: { protocol, origin } } : null;
    }
    case "content_viewed": {
      const payload = input as AnalyticsPayloadMap["content_viewed"];
      const articleSlug = safeSlug(payload.article_slug);
      const categorySlug = safeSlug(payload.category_slug);
      return articleSlug && categorySlug
        ? { name, payload: { article_slug: articleSlug, category_slug: categorySlug } }
        : null;
    }
    case "document_downloaded": {
      const payload = input as AnalyticsPayloadMap["document_downloaded"];
      const documentId = safeToken(payload.document_id, 100);
      const documentType = safeSlug(payload.document_type);
      return documentId && documentType
        ? { name, payload: { document_id: documentId, document_type: documentType } }
        : null;
    }
    default:
      return null;
  }
}
