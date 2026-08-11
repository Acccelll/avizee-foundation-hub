import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const ASSETS_DIR = ".output/public/assets";
const INITIAL_JS_BUDGET_KB = 170;
const ADDITIONAL_JS_BUDGET_KB = 60;
const CSS_BUDGET_KB = 60;

interface AssetSize {
  path: string;
  gzipBytes: number;
}

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function sizes(extension: ".js" | ".css"): AssetSize[] {
  return walk(ASSETS_DIR)
    .filter((path) => extname(path) === extension)
    .map((path) => ({
      path: relative(ASSETS_DIR, path),
      gzipBytes: gzipSync(readFileSync(path)).byteLength,
    }))
    .sort((a, b) => b.gzipBytes - a.gzipBytes);
}

function kb(bytes: number): number {
  return Math.round((bytes / 1024) * 100) / 100;
}

if (!existsSync(ASSETS_DIR)) {
  throw new Error(`Diretório de assets não encontrado: ${ASSETS_DIR}. Execute o build antes.`);
}

const javascript = sizes(".js");
const styles = sizes(".css");
if (javascript.length === 0) throw new Error("Nenhum asset JavaScript encontrado no build.");

const failures: string[] = [];
const [largestJavascript, ...additionalJavascript] = javascript;

if (largestJavascript && kb(largestJavascript.gzipBytes) > INITIAL_JS_BUDGET_KB) {
  failures.push(
    `JS inicial candidato ${largestJavascript.path}: ${kb(largestJavascript.gzipBytes)} KB gzip > ${INITIAL_JS_BUDGET_KB} KB`,
  );
}

for (const asset of additionalJavascript) {
  if (kb(asset.gzipBytes) > ADDITIONAL_JS_BUDGET_KB) {
    failures.push(
      `Chunk adicional ${asset.path}: ${kb(asset.gzipBytes)} KB gzip > ${ADDITIONAL_JS_BUDGET_KB} KB`,
    );
  }
}

const totalCssBytes = styles.reduce((total, asset) => total + asset.gzipBytes, 0);
if (kb(totalCssBytes) > CSS_BUDGET_KB) {
  failures.push(`CSS total: ${kb(totalCssBytes)} KB gzip > ${CSS_BUDGET_KB} KB`);
}

console.log("Performance budget — Etapa 15");
console.log(
  `JS maior (candidato ao bundle inicial): ${largestJavascript?.path ?? "n/a"} — ${kb(
    largestJavascript?.gzipBytes ?? 0,
  )} KB gzip / ${INITIAL_JS_BUDGET_KB} KB`,
);
console.log(
  `Maior chunk adicional: ${additionalJavascript[0]?.path ?? "n/a"} — ${kb(
    additionalJavascript[0]?.gzipBytes ?? 0,
  )} KB gzip / ${ADDITIONAL_JS_BUDGET_KB} KB`,
);
console.log(`CSS total: ${kb(totalCssBytes)} KB gzip / ${CSS_BUDGET_KB} KB`);

if (failures.length > 0) {
  throw new Error(`Orçamento de performance excedido:\n- ${failures.join("\n- ")}`);
}
