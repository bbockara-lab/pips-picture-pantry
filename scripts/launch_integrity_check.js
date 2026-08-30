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
  const gradle = read("android/app/build.gradle");
  const releaseStatus = read("docs/ANDROID_RELEASE_STATUS.md");
  const versionCode = Number(gradle.match(/versionCode\s+(\d+)/)?.[1]);
  const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
  const lastUploadedCode = Number(
    releaseStatus.match(/Last Play Console upload: versionCode \*\*(\d+)\*\*/)?.[1],
  );
  const target = releaseStatus.match(
    /Current (?:prepared|signed) upload target: versionCode (\d+) \/ versionName ([\d.]+)\./,
  );

  if (!versionCode || !versionName || !lastUploadedCode || !target) {
    fail("Android release identity or Play Console upload ledger is incomplete");
  }
  if (versionCode <= lastUploadedCode) {
    fail(`Android versionCode ${versionCode} must be above Play Console code ${lastUploadedCode}`);
  }
  if (Number(target[1]) !== versionCode || target[2] !== versionName) {
    fail("Android build.gradle and current upload target are out of sync");
  }
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
  if (unlockCosts.length < 17 || unlockCosts.some((cost) => cost !== 0)) {
    fail("src/data/seasonShelves.js must keep every authored stage unlock cost at zero");
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
  expectIncludes("tests/stagePantryLinks.test.js", "maps all fourteen paid Pantry shelves", "Pantry-stage mapping regression test");
  expectExcludes(hub, "if (!previousShelf || !isShelfUnlocked(previousShelf)) return;", "next-locked-stage-only filter");
  expectIncludes(hub, "locked-stage-preview", "future stage silhouettes");
  expectIncludes(hub, "pack-stage-complete-badge", "completed stage badge");
  expectIncludes(hub, "getShelfTeaserKey", "stage teaser key derivation");
  expectIncludes("tests/puzzleStageRoadmap.test.js", "renders every locked stage", "full future stage roadmap regression test");
  expectIncludes(hub, '"puzzle-home-scene__title", t("views.puzzle")', "Workshop view title");
  expectIncludes("src/i18n/en.js", "Pip's Puzzle Room", "English Workshop view name");
  expectIncludes("src/i18n/ko.js", "핍\\uc758 \\ud37c\\uc990\\ubc29", "Korean Workshop view name");
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

function checkDailyLoginBonus() {
  expectIncludes("src/data/economyConfig.js", "LOGIN_BONUS: 3", "three-spoon login bonus");
  expectIncludes("src/game/save.js", "export function claimLoginBonus", "login bonus claim function");
  expectIncludes("src/game/save.js", "lastLoginBonusDate", "persisted login bonus date");
  expectIncludes("src/ui/appShell.js", "hasActivePlayer() ? claimLoginBonus() : null", "active-player login claim");
  expectIncludes("src/ui/appShell.js", 'root.dataset.introOpen === "true"', "post-intro login presentation");
  expectIncludes("src/ui/appShell.js", "globalThis.setTimeout(dismissLoginBonus, 3000)", "three-second login bubble dismissal");
  expectIncludes("src/ui/appShell.js", "greetingMessage: loginBonusMessage", "login reward reuses home greeting");
  expectIncludes("src/ui/puzzleHubView.js", "greetingMessage || t(getDailyGreetingKey())", "daily greeting restoration fallback");
  expectExcludes("src/ui/loginBonusMessage.js", "document.createElement", "duplicate login Pip popover");
  expectIncludes("src/styles.css", "v0.1.678 - daily login spoon bonus", "login bonus presentation contract");
  expectIncludes("tests/save.test.js", "grants once per local date", "login grant regression test");
}
function checkQaSaveIsolation() {
  expectIncludes("scripts/qa_target_guard.js", "LOOPBACK_HOSTS", "loopback-only QA target allowlist");
  expectIncludes("scripts/mobile_visual_check.js", "assertIsolatedQaTarget(TARGET_URL", "mobile QA storage isolation guard");
  expectIncludes("scripts/visual_review_pack.js", "assertIsolatedQaTarget(baseUrl", "visual QA storage isolation guard");
  expectIncludes("tests/save.test.js", "keeps a fresh Daily completion bounded", "fresh Daily reward and inventory regression test");
}
function checkFeaturedPantryJar() {
  expectIncludes("src/ui/featuredPantryJar.js", "getJarArtUrl(jar.id)", "approved jar artwork mapping");
  expectIncludes("src/game/save.js", "export function setFeaturedJar", "owned jar home-display setter");
  expectIncludes("src/game/save.js", "export function getFeaturedJarId", "persisted home-display jar getter");
  expectIncludes("src/game/save.js", "export function getFeaturedJar()", "shared displayed jar helper");
  expectIncludes("src/ui/pantryView.js", "setFeaturedJar(jar.id)", "Pantry jar home-display action");
  expectIncludes("src/ui/puzzleHubView.js", 'jarButton.addEventListener("click", () => onOpenFeaturedJar(featuredJar))', "Workshop jar opens its exact Pantry detail");
  expectIncludes("src/ui/puzzleHubView.js", 'keepsakeShelf.className = "home-keepsake-shelf"', "unified Workshop keepsake shelf");
  expectIncludes("src/ui/puzzleView.js", "featuredJar: isTimeAttack", "regular completion displayed jar selection");
  expectIncludes("src/ui/puzzleView.js", "getFeaturedJar()", "completion reuses the home-displayed jar");
  expectIncludes("src/ui/pipReaction.js", "if (featuredJarCard) content.push(featuredJarCard)", "completion jar optional rendering");
  expectExcludes("src/ui/pantryView.js", "setEquippedJar", "retired completion-only collectible selection");
  expectIncludes("src/styles.css", "v0.1.679 - meaningful featured Pantry jar", "featured Pantry jar presentation contract");
  expectIncludes("tests/featuredPantryJar.test.js", "Selected Pantry jar meaning", "featured jar regression test");
}
function checkPantryJarGuide() {
  expectIncludes("src/game/save.js", '"pantryJarIntro"', "persisted Pantry jar guide id");
  expectIncludes("src/ui/pantryView.js", "shouldShowPantryJarIntro()", "first jar-detail guide gate");
  expectIncludes("src/ui/pantryView.js", "onRequestJarGuide(jar)", "selected jar guide request");
  expectIncludes("src/ui/appShell.js", "initialJarDetailId: pendingPantryJarDetailId", "selected jar detail resume");
  expectIncludes("src/ui/pantryView.js", "scheduleInitialJarDetailResume({", "guide-safe jar detail resume scheduler");
  expectIncludes("src/ui/pantryView.js", "guidePending: shouldShowPantryJarIntro()", "guide-open resume gate");
  expectExcludes("src/ui/pantryView.js", "openDetail(initialJar)", "guide-reentering initial jar path");
  expectIncludes("src/ui/guideDialog.js", 'pantryJarIntro: ["guide.pantryJarIntro.step1", "guide.pantryJarIntro.step2"]', "two-step Pantry display guide");
  expectIncludes("src/data/mailboxMessages.js", '["guide-pantry-jar", "pantryJarIntro"]', "Pantry jar guide mailbox replay");
  expectIncludes("src/i18n/en.js", "Choose Display on home for an owned collectible to place it beside me in the Puzzle Room and on picture-completion screens.", "English home-display explanation");
  expectIncludes("src/i18n/ko.js", "보유한 수집품에서 ‘홈에 표시하기’를 누르면 퍼즐방과 그림 완료 화면에서 제 곁에 함께 나와요.", "Korean home-display explanation");
  expectIncludes("tests/pantryJarGuide.test.js", "resumes the exact selected jar detail", "Pantry jar guide lifecycle regression");
  expectIncludes("tests/pantryJarGuide.test.js", "does not schedule repeated frames or re-enter the guide while it is open", "Pantry guide render-loop regression test");
}
function checkHomeCollectionProgress() {
  const hub = "src/ui/puzzleHubView.js";
  expectIncludes(hub, "BADGE_MILESTONES.length", "authored badge total");
  expectIncludes(hub, "getPackBadgeStatus(completedPuzzleIds).filter", "earned badge count");
  expectIncludes(hub, "getPaidJarCount()", "owned paid Pantry jar count");
  expectRegex(hub, /artId === "pantry"[\s\S]*puzzle-home-destination__badge/, "Pantry numeric progress badge");
  expectRegex(hub, /artId === "map"[\s\S]*puzzle-home-destination__badge/, "Badges numeric progress badge");
  expectExcludes(hub, "puzzle-home-destination__badge--new", "ambiguous Pantry red dot");
  expectExcludes("src/styles.css", "puzzle-home-destination__badge--new", "retired Pantry red dot styling");
  expectIncludes("tests/puzzleHubView.test.js", "shows earned badge progress against every authored badge", "Badges progress regression test");
}
function main() {
  checkAndroidVersion();
  checkPackUnlockGuidance();
  checkReplayCleanRewardPath();
  checkSimpleOpening();
  checkPlayerFacingClarity();
  checkDailyLoginBonus();
  checkQaSaveIsolation();
  checkFeaturedPantryJar();
  checkPantryJarGuide();
  checkHomeCollectionProgress();
  console.log("Launch integrity guard passed: Android numbering, unlock guidance, replay rewards, simple opening, and player-facing clarity, and daily login rewards are locked.");
}

main();
