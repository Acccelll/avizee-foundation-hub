import { afterEach, describe, expect, it, vi } from "vitest";

import {
  configureAnalyticsSink,
  resetAnalyticsForTests,
  setAnalyticsConsent,
  trackAnalytics,
} from "@/analytics/client";
import { normalizeAnalyticsSearchQuery, prepareAnalyticsEvent } from "@/analytics/events";

afterEach(() => resetAnalyticsForTests());

describe("analytics consent-first", () => {
  it("não envia nem enfileira antes do consentimento", async () => {
    const sink = vi.fn();
    configureAnalyticsSink(sink);

    expect(await trackAnalytics("page_view", { path: "/produtos", template: "catalog" })).toBe(false);
    expect(sink).not.toHaveBeenCalled();
  });

  it("envia apenas após consentimento explícito e com sink configurado", async () => {
    const sink = vi.fn();
    configureAnalyticsSink(sink);
    setAnalyticsConsent("granted");

    expect(await trackAnalytics("quotation_submitted", { protocol: "AVZ-2026-0001" })).toBe(
      true,
    );
    expect(sink).toHaveBeenCalledWith({
      name: "quotation_submitted",
      payload: { protocol: "AVZ-2026-0001" },
    });
  });

  it("não deixa falha de analytics quebrar a jornada pública", async () => {
    configureAnalyticsSink(() => {
      throw new Error("provider indisponível");
    });
    setAnalyticsConsent("granted");

    expect(await trackAnalytics("family_viewed", { family_slug: "agulhas" })).toBe(false);
  });
});

describe("minimização de dados de analytics", () => {
  it("descarta query com aparência de e-mail ou telefone", () => {
    expect(normalizeAnalyticsSearchQuery("cliente@example.com")).toBeUndefined();
    expect(normalizeAnalyticsSearchQuery("(19) 99898-2930")).toBeUndefined();
    expect(normalizeAnalyticsSearchQuery("  agulha   vacinação  ")).toBe("agulha vacinação");
  });

  it("não permite payload livre no evento de cotação", () => {
    const event = prepareAnalyticsEvent("quotation_submitted", {
      protocol: "AVZ-2026-0002",
    });
    expect(event).toEqual({
      name: "quotation_submitted",
      payload: { protocol: "AVZ-2026-0002" },
    });
    expect(event?.payload).not.toHaveProperty("email");
    expect(event?.payload).not.toHaveProperty("phone");
  });
});
