import fs from "node:fs";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function fail(message) {
  throw new Error(message);
}

function expectIncludes(file, needle, label = needle) {
  const text = read(file);
  if (!text.includes(needle)) {
    fail(file + " is missing " + label);
  }
}

function expectRegex(file, regex, label) {
  const text = read(file);
  if (!regex.test(text)) {
    fail(file + " is missing " + label);
  }
}

function expectExcludes(file, needle, label = needle) {
  if (read(file).includes(needle)) {
    fail(file + " still contains " + label);
  }
}

function expectOrder(file, beforeNeedle, afterNeedle, label) {
  const text = read(file);
  const before = text.indexOf(beforeNeedle);
  const after = text.indexOf(afterNeedle);
  if (before < 0 || after < 0 || before > after) {
    fail(file + " has invalid order for " + label);
  }
}

function checkAndroidVersion() {
  expectRegex("android/app/build.gradle", /versionCode\s+33\b/, "Android versionCode 33");
  expectRegex("android/app/build.gradle", /versionName\s+"1\.1\.5"/, "Android versionName 1.1.5");
  expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "current prepared upload code is 33", "prepared upload code 33 note");
  expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "versionCode 33 / versionName 1.1.5", "prepared Android release version note");
}

function checkPackUnlockGuidance() {
  const hub = "src/ui/puzzleHubView.js";
  [
    "stage-gate-link",
    "getShelfLockConditions",
    "getPantryShelfForSeasonShelf",
    "getPaidJarProgressForPantryShelf",
    "t(\"shelf.requiresPantryShelf\"",
    "t(\"shelf.pantryProgress\"",
    "appendLockCondition(requirements, \"Puzzle\"",
    "appendLockCondition(requirements, \"Pantry\"",
    "isSeasonShelfComplete(previousShelf",
    "if (!lockConditions.pantry.met)",
    "t(\"packs.visitPantry\")"
  ].forEach((needle) => expectIncludes(hub, needle));
  [
    "unlockPlanNeedSpoons",
    "unlockPlanNeedPantry",
    "unlockPlanNeedBoth",
    "unlockGateNeedSpoons",
    "unlockGateNeedPantry",
    "unlockGateNeedBoth",
    "unlock-panel__plan",
    "unlock-panel__gate",
    "unlock-panel__cost",
    "onUnlockShelf",
    "createSpoonIcon",
    "t(\"packs.openStage\")",
    "t(\"packs.needMore\""
  ].forEach((needle) => expectExcludes(hub, needle, "retired manual stage unlock UI"));
  expectOrder(hub, "if (!lockConditions.pantry.met)", "t(\"packs.visitPantry\")", "Pantry CTA appears only when Pantry progress is blocking");

  ["src/i18n/en.js", "src/i18n/ko.js"].forEach((file) => {
    [
      "visitPantry",
      "lockConditionPuzzle",
      "lockConditionPuzzleDone",
      "lockConditionPantry",
      "lockConditionPantryDone",
      "requiresPantryShelf",
      "pantryProgress",
      "shelfUnlocksStage",
      "shelfStageUnlocked"
    ].forEach((needle) => expectIncludes(file, needle));
    ["unlockCostPrefix", "openStage"].forEach((needle) => expectExcludes(file, needle, "retired stage spoon unlock translation"));
  });

  const shelfSource = read("src/data/seasonShelves.js");
  const unlockCosts = [...shelfSource.matchAll(/unlockCost:\s*(\d+)/g)].map((match) => Number(match[1]));
  if (unlockCosts.length !== 15 || unlockCosts.some((cost) => cost !== 0)) {
    fail("src/data/seasonShelves.js must keep all 15 stage unlock costs at zero");
  }
  expectIncludes("src/data/economyConfig.js", "5: 2", "5x5 reward 2");
  expectIncludes("src/data/economyConfig.js", "8: 4", "8x8 reward 4");
  expectIncludes("src/data/economyConfig.js", "10: 6", "10x10 reward 6");
  expectIncludes("src/data/economyConfig.js", "12: 10", "12x12 reward 10");
  expectExcludes("src/game/save.js", "getPantrySpoons() >= Number(shelf.unlockCost", "stage spoon balance gate");
  expectExcludes("src/game/save.js", "export function unlockShelf", "manual shelf unlock mutation");
  expectExcludes("src/game/save.js", "export function canUnlockShelf", "retired manual shelf unlock predicate");
  expectRegex("src/game/save.js", /isSeasonShelfComplete\(previousShelf, getCompletedPuzzleIds\(\)\)[\s\S]*getShelfPantryRoomRequirement\(shelf\)\.met/, "automatic puzzle and Pantry shelf gate");
  expectExcludes("src/ui/appShell.js", "onUnlockShelf", "manual stage unlock callback");
  expectIncludes("src/ui/pantryView.js", "getSeasonShelvesForPantryShelf", "Pantry shelf stage mapping");
  expectIncludes("src/ui/pantryView.js", "linkedStages.every(isShelfUnlocked)", "Pantry shelf open-state badge");
  expectIncludes("src/ui/pantryView.js", "pantry.shelfStageUnlocked", "opened stage badge copy");
  expectIncludes("src/data/stagePantryLinks.js", "PAID_JARS_PER_SHELF = 5", "five paid jars per Pantry shelf mapping");
  expectIncludes("tests/stagePantryLinks.test.js", "maps all eight paid Pantry shelves", "Pantry-stage mapping regression test");
  expectExcludes(hub, "if (!previousShelf || !isShelfUnlocked(previousShelf)) return;", "next-locked-stage-only filter");
  expectIncludes(hub, "locked-stage-preview", "future stage silhouettes");
  expectIncludes(hub, "pack-stage-complete-badge", "completed stage badge");
  expectIncludes(hub, "getShelfTeaserKey", "stage teaser key derivation");
  expectIncludes("tests/puzzleStageRoadmap.test.js", "renders every locked stage", "full future stage roadmap regression test");
  expectIncludes("src/styles.css", "v0.1.675 - fixed quick-travel release contract", "fixed quick-travel release contract");
  expectRegex("src/styles.css", /v0\.1\.675 - fixed quick-travel release contract[\s\S]*position:\s*fixed !important;[\s\S]*z-index:\s*50 !important;/, "fixed quick-travel positioning");
}
function checkReplayCleanRewardPath() {
  expectIncludes("src/ui/puzzleView.js", "clean: isReplayClean(replayCleanStatus)", "replay reward clean parameter");
  expectIncludes("src/game/replayChallenge.js", "usedHint", "hint usage tracked in replay clean state");
  expectRegex("src/game/replayChallenge.js", /Math\.max\(0,\s*Number\(state\?\.hintsUsed \|\| 0\)\) > 0/, "hintsUsed makes replay unclean");
  expectIncludes("tests/replayChallenge.test.js", "blocks replay spoon rewards after a hinted completion", "hinted replay reward regression test");
  expectIncludes("tests/replayChallenge.test.js", "keeps replay unclean after a hint is undone", "hint undo remains unclean regression test");
}

function checkSimpleOpening() {
  const intro = "src/ui/brandIntro.js";
  expectIncludes(intro, "buildKeyVisual(false)", "opening key visual");
  expectIncludes(intro, "brand-intro__skip", "single Start action");
  expectExcludes(intro, "buildPromiseChip", "pre-start mode cards");
  expectIncludes("scripts/mobile_visual_check.js", "brand-intro__promise-strip", "removed mode-card regression guard");
}

function checkPlayerFacingClarity() {
  expectExcludes("src/ui/appShell.js", "renderFooter", "player-facing version footer");
  expectExcludes("src/ui/pipReaction.js", "completion-reveal__meta", "completion reveal double label");
  expectExcludes("src/ui/pantryView.js", "shopLimitSummary", "shop item-count explainer");
  expectExcludes("src/ui/pantryView.js", "pantry.jar.eyebrow", "duplicate Pantry eyebrow");
  expectExcludes("src/ui/puzzleHubView.js", "t(\"replayPicks.body\")", "replay explainer paragraph");
  expectExcludes("src/ui/puzzleHubView.js", "t(\"replayPicks.eyebrow\")", "replay duplicate eyebrow");
  expectExcludes("src/ui/puzzleHubView.js", "t(\"replayPicks.challenge\")", "repeated replay button label");
  expectIncludes("src/ui/settingsView.js", "localizedPlaceholder !== \"Jay\"", "localized legacy-name display guard");
  expectIncludes("src/i18n/en.js", "Add {spoons} spoons when you need them.", "concise spoon jar copy");
}

function main() {
  checkAndroidVersion();
  checkPackUnlockGuidance();
  checkReplayCleanRewardPath();
  checkSimpleOpening();
  checkPlayerFacingClarity();
  console.log("Launch integrity guard passed: Android numbering, unlock guidance, replay rewards, simple opening, and player-facing clarity are locked.");
}

main();
