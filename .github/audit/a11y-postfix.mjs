import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:8080";
const outDir = path.resolve("audit-results/accessibility-postfix");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { axe: [], search: {}, quote: {}, mobileMenu: {} };

async function gotoReady(page, route) {
  await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 7000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function scan(context, name, route) {
  const page = await context.newPage();
  await gotoReady(page, route);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  report.axe.push({
    name,
    route,
    violations: result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({ target: node.target, html: node.html })),
    })),
  });
  await page.close();
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await scan(desktop, "home", "/");
await scan(desktop, "produtos", "/produtos");
await scan(desktop, "busca", "/busca?q=AG011");

const page = await desktop.newPage();
await gotoReady(page, "/");
const search = page.locator("input[role='combobox']").first();
await search.focus();
await page.keyboard.type("AG011", { delay: 50 });
await page.waitForTimeout(1200);
report.search.value = await search.inputValue();
report.search.options = await page.locator("[role='listbox'] [role='option']").count();
report.search.nestedInteractive = await page.locator("[role='option'] button, [role='option'] a, [role='option'] input").count();
report.search.liveTexts = (await page.locator("[role='status'][aria-live]").allTextContents())
  .map((text) => text.trim().replace(/\s+/g, " "))
  .filter(Boolean);
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(100);
report.search.activeDescendant = await search.getAttribute("aria-activedescendant");
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
report.search.urlAfterEnter = page.url();

await gotoReady(page, "/busca?q=AG011");
const href = await page
  .locator("a[href*='/produtos/'][href*='sku=AG011']")
  .first()
  .getAttribute("href");
if (!href) throw new Error("Não foi possível localizar o SKU AG011 para validar a cotação.");
const product = new URL(href, baseURL);
product.search = "";
await gotoReady(page, product.pathname);
await scan(desktop, "familia", product.pathname);

const select = page.getByRole("button", { name: "Selecionar", exact: true }).first();
if (!(await select.count())) throw new Error("Botão Selecionar não encontrado.");
await select.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(250);
const add = page.getByRole("button", { name: "Adicionar à lista", exact: true }).first();
report.quote.selectedByEnter = Boolean(await add.count());
if (!(await add.count())) throw new Error("Enter não ativou a seleção da variação.");
await add.focus();
await page.keyboard.press("Space");
await page.waitForTimeout(350);
report.quote.addedBySpace = Boolean(
  await page.getByRole("button", { name: "Na lista", exact: true }).first().count(),
);
report.quote.liveTexts = (await page.locator("[role='status'],[aria-live]").allTextContents())
  .map((text) => text.trim().replace(/\s+/g, " "))
  .filter(Boolean);
report.quote.additionAnnounced = report.quote.liveTexts.some((text) => /AG011.*adicionado.*lista/i.test(text));
await page.close();
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobilePage = await mobile.newPage();
await gotoReady(mobilePage, "/");
const menu = mobilePage.getByRole("button", { name: "Abrir menu" });
await menu.focus();
await page?.waitForTimeout?.(0).catch?.(() => {});
await mobilePage.keyboard.press("Enter");
await mobilePage.waitForTimeout(250);
const menuButton = mobilePage.locator("button[aria-controls='menu-mobile']");
report.mobileMenu.expandedAfterEnter = await menuButton.getAttribute("aria-expanded");
report.mobileMenu.presentAfterEnter = Boolean(await mobilePage.locator("#menu-mobile").count());
await mobilePage.keyboard.press("Escape");
await mobilePage.waitForTimeout(250);
report.mobileMenu.expandedAfterEscape = await menuButton.getAttribute("aria-expanded");
report.mobileMenu.presentAfterEscape = Boolean(await mobilePage.locator("#menu-mobile").count());
await mobilePage.close();
await mobile.close();
await browser.close();

const severe = report.axe.flatMap((entry) => entry.violations).filter((v) => v.impact === "critical" || v.impact === "serious");
const assertions = {
  noCriticalOrSeriousAxe: severe.length === 0,
  noNestedInteractiveOption: report.search.nestedInteractive === 0,
  searchKeyboardWorks: report.search.value === "AG011" && report.search.options > 0 && Boolean(report.search.activeDescendant),
  quoteKeyboardWorks: report.quote.selectedByEnter && report.quote.addedBySpace,
  quoteAdditionAnnounced: report.quote.additionAnnounced,
  mobileMenuOpens: report.mobileMenu.expandedAfterEnter === "true" && report.mobileMenu.presentAfterEnter,
  mobileMenuClosesWithEscape: report.mobileMenu.expandedAfterEscape === "false" && !report.mobileMenu.presentAfterEscape,
};
report.assertions = assertions;

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
const summary = [
  "# Accessibility post-fix audit",
  "",
  `- Axe critical/serious: ${severe.length}`,
  `- Opções com controle interativo aninhado: ${report.search.nestedInteractive}`,
  `- Busca por teclado: ${assertions.searchKeyboardWorks}`,
  `- Seleção/cotação por teclado: ${assertions.quoteKeyboardWorks}`,
  `- Adição anunciada por live region: ${assertions.quoteAdditionAnnounced}`,
  `- Menu abriu por Enter: ${assertions.mobileMenuOpens}`,
  `- Menu fechou por Escape: ${assertions.mobileMenuClosesWithEscape}`,
  "",
].join("\n");
fs.writeFileSync(path.join(outDir, "SUMMARY.md"), summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);

const failed = Object.entries(assertions).filter(([, value]) => !value);
if (failed.length > 0) {
  throw new Error(`Falhas de acessibilidade pós-correção: ${failed.map(([key]) => key).join(", ")}`);
}
