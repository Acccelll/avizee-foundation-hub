import { expect, test } from "@playwright/test";

const STORAGE_KEY = "avizee.quote.v1";

test("selecionar uma variação e depois adicionar persiste a referência na lista de cotação", async ({ page }) => {
  await page.goto("/busca?q=AG011");
  await page.waitForLoadState("networkidle");

  const resultLink = page.locator('a[href*="sku=AG011"]').first();
  await expect(resultLink).toBeVisible();
  const href = await resultLink.getAttribute("href");
  expect(href).toBeTruthy();

  const target = new URL(href!, "http://127.0.0.1:8080");
  target.search = "";
  await page.goto(target.pathname);
  await page.waitForLoadState("networkidle");

  const row = page.getByRole("row").filter({ hasText: "AG011" });
  await expect(row).toBeVisible();

  const action = row.getByRole("button");
  await expect(action).toHaveText("Selecionar");
  await action.click();

  await expect(action).toHaveText("Adicionar à lista");
  expect(await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY)).toBeNull();

  await action.click();
  await expect(action).toHaveText("Na lista");

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
  expect(stored).not.toBeNull();
  const state = JSON.parse(stored ?? "{}") as { items?: Array<{ sku?: string; quantity?: number }> };
  expect(state.items?.some((item) => item.sku === "AG011" && item.quantity === 1)).toBe(true);

  await page.goto("/cotacao");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("rowheader", { name: "AG011", exact: true })).toBeVisible();
});
