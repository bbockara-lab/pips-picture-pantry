import { readFileSync } from "node:fs";

const path = new URL("../docs/TELEGRAM_IDEA_RELEASE_GATE.md", import.meta.url);
const source = readFileSync(path, "utf8");
const required = [
  "D-pad",
  "Next Picture",
  "extra-spoon chance",
  "322 runtime audio files",
  "50-spoon gift",
  "mandatory",
  "Telegram idea gate: PASS"
];
const missing = required.filter((entry) => !source.includes(entry));
if (missing.length) {
  throw new Error(`Telegram idea release gate is incomplete: ${missing.join(", ")}`);
}
console.log("Telegram idea release gate passed for the Korean Harvest release.");
