import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mdPath = path.join(repoRoot, "docs", "PRIVACY_POLICY.md");
const htmlPath = path.join(repoRoot, "store-assets", "privacy-policy.html");
const listingPath = path.join(repoRoot, "docs", "PLAY_CONSOLE_STORE_LISTING.md");

const markdown = fs.readFileSync(mdPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");
const listing = fs.readFileSync(listingPath, "utf8");
const combined = markdown + "\n" + html;
const errors = [];

function requireInBoth(label, pattern) {
  if (!pattern.test(markdown)) errors.push(`Markdown privacy policy missing ${label}`);
  if (!pattern.test(html)) errors.push(`Hosted privacy policy missing ${label}`);
}

function requireText(label, text, pattern) {
  if (!pattern.test(text)) errors.push(`${label} missing`);
}

requireInBoth("current date", /2026-07-15/);
requireInBoth("no collection statement", /does not collect, transmit, sell, or share personal information/);
requireInBoth("local-only storage statement", /stored locally on your device|stored only on your device/);
requireInBoth("no advertising or analytics SDKs", /does not include third-party advertising SDKs, analytics SDKs, or tracking SDKs/);
requireInBoth("no data sharing statement", /do not share user data with third parties/);
requireInBoth("data deletion guidance", /delete it by using the reset option in the app or by uninstalling the app/);
requireInBoth("contact email", /sunnyspoonstudios@gmail.com/);
requireText("Play listing privacy URL", listing, /https:\/\/sunny-spoon-pantry\.web\.app\/privacy-policy\.html/);

const forbiddenRuntimeClaims = [
  /account creation/i,
  /cloud save/i,
  /analytics provider/i,
  /advertising identifier/i,
  /location data/i,
  /contacts/i
];
for (const pattern of forbiddenRuntimeClaims) {
  const match = combined.match(pattern);
  if (match) errors.push(`Privacy policy mentions unsupported runtime claim: "${match[0]}"`);
}

if (errors.length > 0) {
  console.error("Privacy policy check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Privacy policy check passed: Markdown and hosted HTML policy are aligned.");
