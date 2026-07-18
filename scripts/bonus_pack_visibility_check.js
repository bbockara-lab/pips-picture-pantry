import fs from "node:fs";

const failures = [];

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function expectIncludes(path, needle, message) {
  const source = read(path);
  if (!source.includes(needle)) {
    failures.push(path + ": " + message);
  }
  return source;
}

const packsSource = read("src/data/packs.js");
const puzzleSource = read("src/data/puzzles.js");
const bonusPackIds = [...packsSource.matchAll(/id: "([^"]+-plus)"[\s\S]*?access: "bonus-pack"[\s\S]*?monetizationRole: "future-theme-pack"/g)].map((match) => match[1]);

if (bonusPackIds.length !== 5) {
  failures.push("src/data/packs.js: expected 5 hidden future bonus packs, found " + bonusPackIds.length + ".");
}

for (const packId of bonusPackIds) {
  if (puzzleSource.includes(`packId: "${packId}"`)) {
    failures.push("src/data/puzzles.js: hidden bonus pack " + packId + " has authored launch puzzles.");
  }
}

const hubSource = expectIncludes(
  "src/ui/puzzleHubView.js",
  'if (pack.access === "bonus-pack") {\n      // Future theme packs stay hidden until their art, puzzles, and store path are ready.\n      return;',
  "launch puzzle picker must explicitly return before rendering bonus packs."
);

const bonusReturnIndex = hubSource.indexOf('if (pack.access === "bonus-pack") {');
const packBlockIndex = hubSource.indexOf('const packBlock = document.createElement("article");', bonusReturnIndex);
if (bonusReturnIndex < 0 || packBlockIndex < 0 || bonusReturnIndex > packBlockIndex) {
  failures.push("src/ui/puzzleHubView.js: bonus-pack return must happen before creating a pack block.");
}

expectIncludes("src/ui/pantryStoryCards.js", 'pack.access !== "bonus-pack"', "pantry story goals must ignore hidden future packs.");
expectIncludes("src/ui/pantryView.js", 'pack.access !== "bonus-pack"', "pantry progress cards must ignore hidden future packs.");
expectIncludes("src/game/save.js", 'pack?.access !== "bonus-pack"', "save unlock checks must keep future bonus packs locked.");
expectIncludes("src/ui/appShell.js", 'pack.access === "bonus-pack"', "unlock action must ignore future bonus packs.");
expectIncludes("scripts/mobile_visual_check.js", "expectHiddenBonusPacks", "mobile QA must guard against bonus pack preview leaks.");
expectIncludes("scripts/release_candidate_check.js", '["bonus pack visibility", "npm run qa:bonus-pack"]', "candidate gate must include bonus pack visibility QA.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Bonus pack visibility QA passed for " + bonusPackIds.length + " hidden future packs.");
