import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const listingPath = path.join(repoRoot, "docs", "PLAY_CONSOLE_STORE_LISTING.md");
const listing = fs.readFileSync(listingPath, "utf8");
const normalizedListing = listing.replace(/\r\n/g, "\n");

const errors = [];

function requireText(label, pattern) {
  if (!pattern.test(listing)) {
    errors.push(`${label} is missing from PLAY_CONSOLE_STORE_LISTING.md`);
  }
}

function sectionAfter(label) {
  const marker = `${label}:\n\n`;
  const start = normalizedListing.indexOf(marker);
  if (start === -1) {
    return "";
  }
  const rest = normalizedListing.slice(start + marker.length);
  const end = rest.search(/\n\n[A-Z][^\n]+:\n/);
  return (end === -1 ? rest : rest.slice(0, end)).trim();
}

requireText("current update date", /^Last updated: 2026-07-15$/m);
requireText("app name", /^Pip's Picture Pantry$/m);
requireText("Sunny Spoon Studios", /Sunny Spoon Studios/);
requireText("Season 0 catalog positioning", /Season 0/);
requireText("333 launch puzzle positioning", /333/);
requireText("Pantry progression", /Pantry goals?|Pantry room/i);
requireText("Time Attack positioning", /Time Attack/);
requireText("spoon reward economy", /spoon rewards?|spoons/i);
requireText("no ads statement", /No third-party ads or tracking SDKs/);
requireText("privacy policy URL", /https:\/\/sunny-spoon-pantry\.web\.app\/privacy-policy\.html/);
requireText("store asset QA command", /npm run qa:store/);

const shortDescription = sectionAfter("Short description");
if (!shortDescription) {
  errors.push("Short description body is missing");
} else if (shortDescription.length > 80) {
  errors.push(`Short description is ${shortDescription.length} characters, expected <= 80`);
}

const screenshotMatches = listing.match(/store-assets\/play-console\/(?:phone-screenshots|tablet-[^/]+-screenshots)\/[^\s]+\.png/g) || [];
if (screenshotMatches.length < 12) {
  errors.push(`Only ${screenshotMatches.length} screenshot paths are listed, expected at least 12`);
}

const forbiddenTerms = [
  /\bpaid\b/i,
  /\bIAP\b/i,
  /\bgacha\b/i,
  /\bforced ads?\b/i,
  /\bthird-party tracking\b(?! SDKs)/i
];
for (const pattern of forbiddenTerms) {
  const match = listing.match(pattern);
  if (match) {
    errors.push(`Avoid store-listing wording "${match[0]}"`);
  }
}

if (errors.length > 0) {
  console.error("Play Store listing check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Play Store listing check passed: current launch copy and policy notes verified.");
