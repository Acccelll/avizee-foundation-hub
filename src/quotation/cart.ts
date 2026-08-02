/**
 * Lista de cotação no navegador (Etapa 8).
 *
 * - `localStorage` com TTL de 30 dias e teto de 50 itens;
 * - nenhum dado pessoal, nenhum preço, nenhum identificador de sessão;
 * - hidratação só depois da montagem (evita divergência de SSR);
 * - o servidor é a autoridade: este módulo apenas antecipa a experiência.
 */
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  QUOTE_MAX_ITEMS,
  QUOTE_NOTE_MAX,
  QUOTE_STORAGE_KEY,
  QUOTE_TTL_DAYS,
  clampQuantity,
  type QuoteItem,
  type QuoteListState,
} from "./model";

const CHANGE_EVENT = "avizee:quote-changed";

function emptyState(): QuoteListState {
  return { version: 1, updatedAt: new Date().toISOString(), items: [] };
}

function isExpired(state: QuoteListState): boolean {
  const updated = Date.parse(state.updatedAt);
  if (Number.isNaN(updated)) return true;
  return Date.now() - updated > QUOTE_TTL_DAYS * 24 * 60 * 60 * 1000;
}

function sanitizeItem(raw: unknown): QuoteItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const productId = typeof item["productId"] === "string" ? item["productId"] : "";
  const sku = typeof item["sku"] === "string" ? item["sku"] : "";
  if (!productId || !sku) return null;
  const note = typeof item["note"] === "string" ? item["note"].slice(0, QUOTE_NOTE_MAX) : null;
  return {
    productId,
    sku,
    name: typeof item["name"] === "string" ? item["name"] : sku,
    familyName: typeof item["familyName"] === "string" ? item["familyName"] : null,
    familySlug: typeof item["familySlug"] === "string" ? item["familySlug"] : null,
    categorySlug: typeof item["categorySlug"] === "string" ? item["categorySlug"] : null,
    variation: typeof item["variation"] === "string" ? item["variation"] : null,
    quantity: clampQuantity(Number(item["quantity"] ?? 1)),
    note: note || null,
  };
}

/** Leitura defensiva: qualquer conteúdo inválido vira lista vazia. */
export function readQuoteList(): QuoteListState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as QuoteListState;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) return emptyState();
    if (isExpired(parsed)) {
      window.localStorage.removeItem(QUOTE_STORAGE_KEY);
      return { ...emptyState(), items: [] };
    }
    const items = parsed.items
      .map(sanitizeItem)
      .filter((i): i is QuoteItem => i !== null)
      .slice(0, QUOTE_MAX_ITEMS);
    return { version: 1, updatedAt: parsed.updatedAt, items };
  } catch {
    return emptyState();
  }
}

function writeQuoteList(items: QuoteItem[]): QuoteListState {
  const state: QuoteListState = {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: items.slice(0, QUOTE_MAX_ITEMS),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível: a lista segue apenas em memória */
    }
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
  return state;
}

export function clearQuoteList() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(QUOTE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export type AddResult = "added" | "updated" | "full";

/** Estado reativo da lista. Retorna vazio no SSR e hidrata após a montagem. */
export function useQuoteList() {
  const [state, setState] = useState<QuoteListState>(() => emptyState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readQuoteList());
    setHydrated(true);
    const sync = () => setState(readQuoteList());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: Omit<QuoteItem, "quantity" | "note"> & { quantity?: number }) => {
    const current = readQuoteList().items;
    const existing = current.find((i) => i.productId === item.productId);
    if (existing) {
      const next = current.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: clampQuantity(i.quantity + (item.quantity ?? 1)) }
          : i,
      );
      setState(writeQuoteList(next));
      return "updated" as AddResult;
    }
    if (current.length >= QUOTE_MAX_ITEMS) return "full" as AddResult;
    setState(writeQuoteList([...current, { ...item, quantity: clampQuantity(item.quantity ?? 1), note: null }]));
    return "added" as AddResult;
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const next = readQuoteList().items.map((i) =>
      i.productId === productId ? { ...i, quantity: clampQuantity(quantity) } : i,
    );
    setState(writeQuoteList(next));
  }, []);

  const setNote = useCallback((productId: string, note: string) => {
    const next = readQuoteList().items.map((i) =>
      i.productId === productId ? { ...i, note: note.slice(0, QUOTE_NOTE_MAX) || null } : i,
    );
    setState(writeQuoteList(next));
  }, []);

  const remove = useCallback((productId: string) => {
    setState(writeQuoteList(readQuoteList().items.filter((i) => i.productId !== productId)));
  }, []);

  const clear = useCallback(() => {
    clearQuoteList();
    setState(emptyState());
  }, []);

  const has = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items],
  );

  return useMemo(
    () => ({
      items: state.items,
      count: state.items.length,
      hydrated,
      isFull: state.items.length >= QUOTE_MAX_ITEMS,
      add,
      setQuantity,
      setNote,
      remove,
      clear,
      has,
    }),
    [state.items, hydrated, add, setQuantity, setNote, remove, clear, has],
  );
}
