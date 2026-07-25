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
  expectRegex("android/app/build.gradle", /versionCode\s+28\b/, "Android versionCode 28");
  expectRegex("android/app/build.gradle", /versionName\s+"1\.1\.0"/, "Android versionName 1.1.0");
  expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "current prepared upload code is 28", "prepared upload code 28 note");
  expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "versionName \"1.1.0\"", "launch versionName note");
}

function checkPackUnlockGuidance() {
  const hub = "src/ui/puzzleHubView.js";
  [
    "unlockPlanNeedSpoons",
    "unlockPlanNeedPantry",
    "unlockPlanNeedBoth",
    "unlockGateNeedSpoons",
    "unlockGateNeedPantry",
    "unlockGateNeedBoth",
    "stage-gate-link",
    "t(\"packs.visitPantry\")",
    "t(\"packs.needPantryRoom\")"
  ].forEach((needle) => expectIncludes(hub, needle));
  expectRegex(hub, /roomRequirement\.met\s*\?\s*t\("packs\.needMore"[\s\S]*:\s*t\("packs\.needPantryRoom"\)/, "Pantry-step lock button copy branch");
  expectOrder(hub, "!roomRequirement.met", "t(\"packs.visitPantry\")", "Pantry CTA appears only when Pantry progress is blocking");

  ["src/i18n/en.js", "src/i18n/ko.js"].forEach((file) => {
    [
      "needPantryRoom",
      "visitPantry",
      "unlockPlanNeedSpoons",
      "unlockPlanNeedPantry",
      "unlockPlanNeedBoth",
      "unlockGateNeedSpoons",
      "unlockGateNeedPantry",
      "unlockGateNeedBoth"
    ].forEach((needle) => expectIncludes(file, needle));
  });
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
