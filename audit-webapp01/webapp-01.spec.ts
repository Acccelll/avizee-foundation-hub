import { expect, test, type Page } from "@playwright/test";

const BASE = "http://127.0.0.1:8080";
const STORAGE_KEY = "avizee.quote.v1";

function watchRuntime(page: Page) {
  const consoleErrors: string[] = [];
  const requestFailures: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    requestFailures.push(
      `${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "failed"}`,
    );
  });

  return { consoleErrors, requestFailures };
}

test("home e navegação desktop funcionam sem erros de runtime", async ({ page }) => {
  const runtime = watchRuntime(page);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Produtos" })
    .click();
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/produtos\/?$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Catálogo de produtos" }),
  ).toBeVisible();
  expect(runtime.consoleErrors, "erros no console").toEqual([]);
  expect(runtime.requestFailures, "requests falhos").toEqual([]);
});

test("menu mobile abre, navega e não cria overflow horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const runtime = watchRuntime(page);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const menu = page.getByRole("button", { name: "Abrir menu" });
  await expect(menu).toBeVisible();
  await menu.click();

  const mobileNavigation = page.getByRole("navigation", { name: "Navegação mobile" });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Soluções" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/solucoes\/?$/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  expect(overflow).toBe(false);
  expect(runtime.consoleErrors, "erros no console").toEqual([]);
  expect(runtime.requestFailures, "requests falhos").toEqual([]);
});

test("busca global por SKU AG011 leva à família e pré-seleciona a referência", async ({ page }) => {
  const runtime = watchRuntime(page);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const search = page.getByRole("combobox", { name: "Buscar no site" });
  await search.fill("AG011");
  await search.press("Enter");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/busca\?q=AG011/);
  const resultLink = page.locator('a[href*="sku=AG011"]').first();
  await expect(resultLink).toBeVisible();
  await resultLink.click();
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/produtos\/[^/]+\/[^/?]+\?sku=AG011/);
  const row = page.getByRole("row").filter({ hasText: "AG011" });
  await expect(row).toBeVisible();
  const action = row.getByRole("button");
  await expect(action).toHaveText("Adicionar à lista");
  await expect(action).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  expect(runtime.consoleErrors, "erros no console").toEqual([]);
  expect(runtime.requestFailures, "requests falhos").toEqual([]);
});

test("selecionar e adicionar uma variação persiste a referência na lista de cotação", async ({
  page,
}) => {
  await page.goto(`${BASE}/produtos/vacinacao-e-aplicacao/agulhas-descartaveis`, {
    waitUntil: "networkidle",
  });

  const row = page.locator("tbody tr").first();
  await expect(row).toBeVisible();
  const sku = (await row.locator("th[scope='row']").innerText()).trim();
  const action = row.getByRole("button");

  await expect(action).toHaveText("Selecionar");
  await action.click();
  await expect(action).toHaveText("Adicionar à lista");
  expect(await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY)).toBeNull();

  await action.click();
  await expect(action).toHaveText("Na lista");

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
  expect(stored, "a ação Adicionar à lista precisa persistir a cotação").not.toBeNull();
  const state = JSON.parse(stored ?? "{}") as {
    items?: Array<{ sku?: string; quantity?: number }>;
  };
  expect(
    state.items?.some((item) => item.sku === sku && item.quantity === 1),
    `SKU ${sku} ausente da lista persistida`,
  ).toBe(true);
});

test("item adicionado permanece disponível ao abrir a lista de cotação", async ({ page }) => {
  await page.goto(`${BASE}/produtos/vacinacao-e-aplicacao/agulhas-descartaveis`, {
    waitUntil: "networkidle",
  });

  const row = page.locator("tbody tr").first();
  await expect(row).toBeVisible();
  const sku = (await row.locator("th[scope='row']").innerText()).trim();
  const action = row.getByRole("button");

  await action.click();
  await expect(action).toHaveText("Adicionar à lista");
  await action.click();
  await expect(action).toHaveText("Na lista");

  await page.getByRole("link", { name: "Solicitar cotação desta família" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/cotacao$/);
  await expect(page.getByRole("rowheader", { name: sku, exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sua lista de cotação está vazia" })).toHaveCount(
    0,
  );
});

test("404 pública não vaza stack trace e oferece retorno ao catálogo", async ({ page }) => {
  const runtime = watchRuntime(page);
  await page.goto(`${BASE}/produtos/vacinacao-e-aplicacao/familia-inexistente-audit`, {
    waitUntil: "networkidle",
  });

  await expect(page.getByRole("heading", { name: "Família não encontrada" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ir para o catálogo" })).toBeVisible();

  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/at .*\(.*:\d+:\d+\)/);
  const unexpectedConsoleErrors = runtime.consoleErrors.filter(
    (message) => !/Failed to load resource: the server responded with a status of 404/.test(message),
  );
  expect(unexpectedConsoleErrors, "erros inesperados no console").toEqual([]);
  expect(runtime.requestFailures, "requests falhos").toEqual([]);
});

test("admin sem sessão não expõe conteúdo protegido", async ({ page }) => {
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });

  await expect(page).toHaveURL(/\/admin\/login|\/admin\/acesso-negado/);
  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body).not.toContain("importação controlada");
  expect(body).not.toContain("service_role");
});
