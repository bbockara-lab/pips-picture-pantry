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
const shelvesSource = read("src/data/seasonShelves.js");
const bonusPackIds = [...packsSource.matchAll(/id: "([^"]+-plus)"[\s\S]*?access: "bonus-pack"[\s\S]*?monetizationRole: "future-theme-pack"/g)].map((match) => match[1]);

if (bonusPackIds.length !== 5) {
  failures.push("src/data/packs.js: expected 5 hidden future bonus packs, found " + bonusPackIds.length + ".");
}

for (const packId of bonusPackIds) {
  if (puzzleSource.includes(`packId: "${packId}"`)) {
    failures.push("src/data/puzzles.js: hidden bonus pack " + packId + " has authored launch puzzles.");
  }
  if (shelvesSource.includes(`artPackId: "${packId}"`)) {
    failures.push("src/data/seasonShelves.js: hidden bonus pack " + packId + " leaked into the launch shelf journey.");
  }
}

const hubSource = expectIncludes(
  "src/ui/puzzleHubView.js",
  "seasonShelves.forEach((shelf) => {",
  "launch puzzle picker must render only the curated season shelves."
);

if (hubSource.includes("puzzlePacks")) {
  failures.push("src/ui/puzzleHubView.js: launch puzzle picker must not enumerate legacy packs, which can expose future bonus packs.");
}

expectIncludes("src/game/save.js", "seasonShelves.find", "save unlock checks must accept only known season shelves.");
expectIncludes("src/ui/appShell.js", "getSeasonShelfForPuzzle", "puzzle selection must resolve through the curated season shelf journey.");
expectIncludes("scripts/mobile_visual_check.js", "expectHiddenBonusPacks", "mobile QA must guard against bonus pack preview leaks.");
expectIncludes("scripts/release_candidate_check.js", '["bonus pack visibility", "npm run qa:bonus-pack"]', "candidate gate must include bonus pack visibility QA.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Bonus pack visibility QA passed for " + bonusPackIds.length + " hidden future packs.");
