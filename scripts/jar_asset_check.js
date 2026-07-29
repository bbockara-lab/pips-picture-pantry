import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { PANTRY_JARS } from "../src/data/pantryJars.js";

const assetDir = resolve("src/assets/jars");
const artSource = readFileSync(resolve("src/data/jarArt.js"), "utf8");
const expectedNames = PANTRY_JARS.map((jar) => `jar-${jar.id}-v1.webp`);
const actualNames = readdirSync(assetDir).filter((name) => name.endsWith(".webp")).sort();
const errors = [];

if (PANTRY_JARS.length !== 24) errors.push(`expected 24 catalog jars, found ${PANTRY_JARS.length}`);
if (actualNames.length !== 24) errors.push(`expected 24 runtime WebP assets, found ${actualNames.length}`);

for (const name of expectedNames) {
  const path = resolve(assetDir, name);
  if (!existsSync(path)) {
    errors.push(`missing ${name}`);
    continue;
  }
  if (statSync(path).size < 20_000) errors.push(`${name} is unexpectedly small`);
  if (!artSource.includes(name)) errors.push(`${name} is not imported by src/data/jarArt.js`);
}

for (const name of actualNames) {
  if (!expectedNames.includes(name)) errors.push(`unexpected runtime jar asset ${name}`);
}

if (errors.length) {
  console.error("Jar asset check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Jar asset check passed: 24 catalog entries, 24 mapped runtime WebP assets.");
