import { afterEach, describe, expect, it } from "vitest";
import {
  getActiveLocale,
  getLanguagePreference,
  puzzleText,
  puzzleTitle,
  setActiveLocale,
  setLanguagePreference,
  t
} from "../src/i18n/index.js";
import { ko } from "../src/i18n/ko.js";

const KOREAN_MOJIBAKE_PATTERN = /[揶쏅슦쎄쑴뽰눘維쒙쭪疫꿰빊吏紐]/;

function collectStrings(source, path = [], strings = []) {
  Object.entries(source || {}).forEach(([key, value]) => {
    const nextPath = [...path, key];
    if (value && typeof value === "object") {
      collectStrings(value, nextPath, strings);
      return;
    }
    if (typeof value === "string") {
      strings.push([nextPath.join("."), value]);
    }
  });
  return strings;
}

describe("i18n", () => {
  afterEach(() => {
    setActiveLocale("en");
  });

  it("detects supported launch locales", () => {
    expect(getActiveLocale("ko-KR")).toBe("ko");
    expect(getActiveLocale("en-US")).toBe("en");
    expect(getActiveLocale("es-ES")).toBe("en");
  });

  it("formats translated strings", () => {
    expect(t("progress.filled", { count: 3 })).toBe("3 filled");
    expect(t("progress.filledOf", { count: 3, target: 12 })).toBe("3/12 colored");
    expect(t("progress.revisitOf", { count: 5, target: 12, mistakes: 1 })).toBe("5/12 colored - 1 to revisit");
    expect(t("progress.lineGuided", { count: 1 })).toBe("1 line");
    expect(t("progress.linesGuided", { count: 3 })).toBe("3 lines");
    expect(t("controls.fill")).toBe("Color");
    expect(t("controls.mark")).toBe("Blank Check");
    expect(t("controls.undo")).toBe("Undo last move");
    expect(t("daily.eyebrow")).toBe("Today's pick");
    expect(t("views.map")).toBe("Badges");
    expect(t("views.pantryHint")).toBe("Shop/decorate");
    expect(t("pantry.progressMissionBody", { remaining: 2, stage: "Sunny Spoon Sign" })).toContain("2 more Pip requests");
    expect(t("pantry.progressMissionPlanRequest")).toBe("Plan next request");
    expect(t("pipStrip.puzzleLine", { player: "Jay" })).toBe("Jay, use the numbers to color the picture.");
    expect(t("puzzlePicker.sizeReward", { size: 5, count: 3 })).toBe("5x5 +3");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - Complete");
    expect(t("album.count", { completed: 1, total: 100 })).toBe("1/100 pictures");
    expect(t("settings.playerName")).toBe("Player name");
    expect(t("currency.spoons", { count: 7 })).toBe("Spoons 7");
    expect(t("packs.preview")).toBe("Preview");
    expect(t("packs.catalogProgress", { completed: 3, total: 12 })).toBe("3/12 done");
    expect(t("packs.catalogLarge", { count: 7 })).toBe("7 large");
    expect(t("packs.catalogLargest", { size: 12 })).toBe("up to 12x12");
    expect(t("packs.pricePreview")).toBe("Preview set");
    expect(t("seasonProgress.catalogStat", { completed: 3, total: 333 })).toBe("3/333 pictures");
    expect(t("seasonProgress.stageStat", { unlocked: 2, total: 5 })).toBe("2/5 stages open");
    expect(t("seasonProgress.goalReadyTitle", { pack: "Bakery Window" })).toBe("Bakery Window is ready");
    expect(t("seasonProgress.goalOpenAction")).toBe("Open stage");
    expect(t("seasonProgress.goalSpoonAction")).toBe("Plan spoons");
    expect(t("brandIntro.launchNote")).toBe("Season 0 opens with 333 cozy pictures, pantry goals, and spoon rewards.");
    expect(t("brandIntro.promisePuzzleAction")).toBe("Solve");
    expect(t("brandIntro.promiseDecorateAction")).toBe("Decorate");
    expect(t("brandIntro.promiseTimeAttackAction")).toBe("Challenge");
    expect(t("packs.unlockPlanNeedBoth", { count: 12, completed: 2, required: 3 })).toBe("Earn 12 more spoons and finish Pantry requests 2/3 to open this stage.");
    expect(t("packs.unlockGateNeedPantry", { completed: 2, required: 3 })).toBe("Blocked by Pantry requests: 2/3 done.");
    expect(t("badges.progress", { completed: 3, total: 100 })).toBe("3/100 cards");
    expect(t("map.sets.cozy-cafe-room")).toBe("Cozy cafe room");
  });

  it("resolves explicit and data-backed puzzle copy", () => {
    expect(puzzleText("pips-first-shelf-pip-face-1", "title")).toBe("Pip Face");
    expect(puzzleTitle({ id: "custom-puzzle-1", title: "Custom Puzzle" })).toBe("Custom Puzzle");
  });

  it("resolves Village Pantry catalog names in supported locales", () => {
    expect(puzzleTitle({ id: "village-pantry-candle-shelf-31", title: "Candle Shelf" })).toBe("Candle Shelf");
    expect(puzzleText("village-pantry-wicker-tray-32", "imageName")).toBe("Wicker Tray");

    setActiveLocale("ko");
    expect(puzzleTitle({ id: "village-pantry-candle-shelf-31", title: "Candle Shelf" })).toBe("\uc591\ucd08 \uc120\ubc18");
    expect(puzzleText("village-pantry-wicker-tray-32", "imageName")).toBe("\ub77c\ud0c4 \uc7c1\ubc18");
    expect(puzzleTitle({ id: "bakery-window-glow-21", title: "Bakery Window Glow" })).toBe("\ubca0\uc774\ucee4\ub9ac \ucc3d\uac00\uc758 \ubc18\uc9dd\uc784");
    expect(puzzleTitle({ id: "village-pantry-market-basket-21", title: "Market Basket" })).toBe("\uc2dc\uc7a5 \ubc14\uad6c\ub2c8");
  });

  it("keeps newest Korean large-board puzzle names readable", () => {
    setActiveLocale("ko");

    const newestNames = [
      ["village-pantry-copper-funnel-69", "\uAD6C\uB9AC \uAE54\uB54C\uAE30"],
      ["village-pantry-embroidered-napkin-70", "\uC790\uC218 \uB0C5\uD0A8"],
      ["bakery-window-orange-brioche-knot-70", "\uC624\uB80C\uC9C0 \uBE0C\uB9AC\uC624\uC288 \uB9E4\uB4ED"],
      ["bakery-window-cream-horn-71", "\uD06C\uB9BC \uD638\uB978"],
      ["village-pantry-linen-bread-bag-71", "\uB9B0\uB128 \uBE75 \uC8FC\uBA38\uB2C8"],
      ["village-pantry-porcelain-butter-dish-72", "\uB3C4\uC790\uAE30 \uBC84\uD130 \uADF8\uB987"],
      ["bakery-window-honey-cruller-ring-72", "\uAFC0 \uD06C\uB7EC\uB7EC \uB9C1"],
      ["bakery-window-raspberry-linzer-frame-73", "\uB77C\uC988\uBCA0\uB9AC \uB9B0\uC800 \uD504\uB808\uC784"],
      ["village-pantry-ceramic-measuring-cup-73", "\uB3C4\uC790\uAE30 \uACC4\uB7C9\uCEF5"],
      ["village-pantry-herb-drying-rack-74", "\uD5C8\uBE0C \uAC74\uC870 \uB799"]
    ];

    newestNames.forEach(([id, expected]) => {
      const title = puzzleTitle({ id, title: "Fallback Title" });
      const imageName = puzzleText(id, "imageName");
      expect(title).toBe(expected);
      expect(imageName).toBe(expected);
      expect(title).not.toMatch(/[?]{2,}/);
      expect(title).not.toContain("\uFFFD");
      expect(title).not.toContain("\u5360");
    });
  });

  it("uses a cached active locale", () => {
    setActiveLocale("ko");

    expect(t("views.puzzle")).toBe("\ud37c\uc990");
    expect(t("brandIntro.promisePuzzle")).toBe("\uadf8\ub9bc 333\uac1c");
    expect(t("brandIntro.promiseAction")).toBe("\uc5f4\uae30");
    expect(t("brandIntro.promisePuzzleAction")).toBe("\ud480\uae30");
    expect(t("brandIntro.promiseDecorateAction")).toBe("\uafb8\ubbf8\uae30");
    expect(t("brandIntro.promiseTimeAttackAction")).toBe("\ub3c4\uc804");
    expect(t("playerIntro.pipCue")).toBe("\ud32c\ud2b8\ub9ac \uce74\ub4dc\ub294 Pip\uc774 \uae54\ub054\ud558\uac8c \uc815\ub9ac\ud574\ub458\uac8c\uc694.");

    setActiveLocale("unsupported");
    expect(t("views.puzzle")).toBe("Puzzle");
  });


  it("keeps Korean guide and hint copy readable", () => {
    setActiveLocale("ko");

    const keys = [
      "guide.eyebrow",
      "guide.speaker",
      "guide.skip",
      "guide.next",
      "guide.done",
      "guide.puzzle.title",
      "guide.puzzle.step1",
      "guide.puzzle.step2",
      "guide.puzzle.step3",
      "guide.timeAttack.title",
      "guide.timeAttack.step1",
      "guide.timeAttack.step2",
      "guide.timeAttack.step3",
      "guide.pantryFirstPurchase.title",
      "guide.pantryFirstPurchase.step1",
      "guide.pantryFirstPurchase.step2",
      "guide.pantryFirstPurchase.step3",
      "timeAttack.coachEyebrow",
      "timeAttack.coachTitle",
      "timeAttack.coachBody",
      "timeAttack.coachEarn",
      "timeAttack.coachSpend",
      "timeAttack.coachRecord",
      "playerIntro.pipCue",
      "timeAttack.ladderAria",
      "timeAttack.ladderRound1",
      "timeAttack.ladderRound2",
      "timeAttack.ladderRound3",
      "timeAttack.ladderWarmup",
      "timeAttack.ladderTempo",
      "timeAttack.ladderFinal",
      "timeAttack.timeUp",
      "timeAttack.timeoutReward",
      "timeAttack.timeoutNoReward",
      "timeAttack.resultMeta",
      "timeAttack.boardProgress",
      "timeAttack.boardProgressFallback",
      "timeAttack.remaining",
      "controls.hint",
      "controls.hintWithCost",
      "controls.hintConfirmTitle",
      "controls.hintConfirmBody",
      "controls.hintCancel",
      "controls.hintConfirmAction",
      "controls.hintCostLabel",
      "controls.hintRemaining",
      "controls.extraHintTitle",
      "controls.timeAttackHintTitle",
      "howToPlay.pipLine",
      "controls.lineCompleteHint",
      "controls.hintIntro",
      "controls.hintIntroMulti",
      "controls.timeAttackHintIntro",
      "controls.timeAttackHintNeedMore",
      "controls.paidHintIntro",
      "controls.paidHintNeedMore",
      "controls.hintEmpty"
    ];

    keys.forEach((key) => {
      const value = t(key, { count: 1, limit: 3 });
      expect(value).not.toMatch(/[?]{2,}/);
      expect(value).not.toMatch(/[媛뚰ㅽ꾩쒖쇱뫜吏湲異]/);
      expect(value).not.toContain("\uFFFD");
      expect(value).not.toContain("\u5360");
    });
    expect(t("guide.eyebrow")).toBe("Pip\uc758 \uc791\uc740 \uc548\ub0b4");
    expect(t("guide.speaker")).toContain("Pip");
    expect(t("guide.puzzle.step1")).toContain("\uc81c\uac00");
    expect(t("guide.timeAttack.step2")).toContain("\uc2a4\ud47c");
    expect(t("guide.pantryFirstPurchase.step3")).toContain("\ud32c\ud2b8\ub9ac");
    expect(t("controls.hintRemaining", { count: 1, limit: 3 })).toBe("\uD78C\uD2B8 1/3");
    expect(t("controls.hintIntroMulti", { count: 5 })).toContain("5");
    expect(t("howToPlay.pipLine")).toContain("Pip");
    expect(t("controls.lineCompleteHint")).toContain("\uc548\uc804\ud55c \ube48\uce78");
    expect(t("controls.lineCompleteHint")).toContain("\uc790\ub3d9");
    expect(t("controls.paidHintIntro", { cost: 9, count: 5, balance: 20 })).toContain("\uAE30\uBCF8 \uD78C\uD2B8\uB97C \uB2E4 \uC37C\uC5B4\uC694");
    expect(t("controls.paidHintIntro", { cost: 9, count: 5, balance: 20 })).not.toContain("\uBB34\uB8CC");
    expect(t("controls.timeAttackHintIntro", { cost: 9, balance: 20 })).not.toContain("\uBB34\uB8CC");
    expect(t("controls.timeAttackHintIntro", { cost: 9, balance: 20 })).toContain("\uC2A4\uD47C 9\uAC1C");
    expect(t("replayPicks.eyebrow")).toBe("Pip\uC758 \uB2E4\uC2DC \uD480\uAE30 \uCD94\uCC9C");
    expect(t("replayPicks.title")).toBe("\uAE54\uB054\uD55C \uB2E4\uC2DC \uD480\uAE30 \uB3C4\uC804");
  });

  it("keeps all non-puzzle Korean UI copy free of mojibake fragments", () => {
    const strings = collectStrings(ko).filter(([key]) => !key.startsWith("puzzles."));

    strings.forEach(([key, value]) => {
      expect(value, key).not.toMatch(KOREAN_MOJIBAKE_PATTERN);
      expect(value, key).not.toContain("\uFFFD");
      expect(value, key).not.toContain("\u5360");
    });
  });

  it("keeps Korean pantry story request copy out of English fallback", () => {
    setActiveLocale("ko");

    expect(t("pantry.storyEyebrow")).toBe("Pip\uC758 \uBD80\uD0C1");
    expect(t("pantry.storyTarget", { item: "\uCCAB \uCE74\uC6B4\uD130 \uBCF4", slot: "\uCE74\uC6B4\uD130" })).toBe(
      "\uBD80\uD0C1\uD55C \uC18C\uD488: \uCE74\uC6B4\uD130 \uC790\uB9AC\uC5D0 \uCCAB \uCE74\uC6B4\uD130 \uBCF4"
    );
    expect(t("pantry.story.startTitle", { slot: "\uCE74\uC6B4\uD130" })).toBe(
      "\uCE74\uC6B4\uD130 \uC790\uB9AC\uB97C \uBA3C\uC800 \uB530\uB73B\uD558\uAC8C \uD574\uBCFC\uAE4C\uC694?"
    );
    expect(t("pantry.story.completeTitle")).toBe("\uCCAB \uBD80\uD0C1 \uC644\uB8CC");
    expect(t("pantry.storyMilestoneEyebrow")).toBe("\uD32C\uD2B8\uB9AC \uCE5C\uBC00\uB3C4");
    expect(t("pantry.storyNextArrivalAction", { item: "\uD5C8\uBE0C \uD654\uBD84" })).toBe("\uD5C8\uBE0C \uD654\uBD84 \uBAA9\uD45C \uBCF4\uAE30");
    expect(t("pantry.storyDeliveryEyebrow")).toBe("Pip\uC758 \uBC30\uC1A1 \uBA54\uBAA8");
    expect(t("pantry.storyDeliveryEarn")).toBe("\uC2A4\uD47C \uBC8C\uB7EC \uAC00\uAE30");
    expect(t("pantry.storyArchiveEyebrow")).toBe("Pip\uC758 \uBD80\uD0C1 \uAE30\uB85D");
    expect(t("pantry.feedbackStoryCompleteEyebrow")).toBe("\uBC30\uC1A1 \uC644\uB8CC");
    expect(t("pantry.feedbackBuyTitle", { item: "\uC791\uC740 \uC7BC \uBCD1" })).toBe("\uC791\uC740 \uC7BC \uBCD1\uC774 \uD32C\uD2B8\uB9AC\uC5D0 \uC654\uC5B4\uC694");
    expect(t("pantry.feedbackPlacedBody", { item: "\uD5C8\uBE0C \uD654\uBD84", slot: "\uCC3D\uBB38" })).toContain("Pip\uC774 \uD5C8\uBE0C \uD654\uBD84\uC744 \uCC3D\uBB38 \uC790\uB9AC\uC5D0 \uB193\uC558\uC5B4\uC694");
    expect(t("pantry.earningEyebrow")).toBe("\uC2A4\uD47C \uACC4\uD68D");
    expect(t("pantry.earningTitle", { item: "\uB9AC\uBCF8 \uBC00\uB300" })).toBe("\uB9AC\uBCF8 \uBC00\uB300\uAE4C\uC9C0 \uAC00\uB294 \uAE38");
    expect(t("pantry.earningSupportNote")).toContain("\uD37C\uC990\uC744 \uD480\uC5B4 \uBAA8\uC73C\uB294 \uAC83\uC774 \uAE30\uBCF8 \uAE38");
    expect(t("pantry.displayPlanAllTitle")).toBe("\uD55C \uC790\uB9AC\uB97C \uACE8\uB77C \uACC4\uD68D\uD558\uAE30");
    expect(t("pantry.displayPlanNextBody", { item: "\uD5C8\uBE0C \uD654\uBD84", cost: 32, needed: 9 })).toBe("\uD5C8\uBE0C \uD654\uBD84\uC740 32 \uC2A4\uD47C\uC774\uACE0, \uC9C0\uAE08\uC740 9 \uC2A4\uD47C\uC774 \uB354 \uD544\uC694\uD574\uC694.");
    expect(t("pantry.availability.canBuy")).toBe("\uC0B4 \uC218 \uC788\uC74C");
    expect(t("pantry.itemStatus.equipped")).toBe("\uC804\uC2DC \uC911");
    expect(t("pantry.shopLimitAction")).toBe("\uC7A5\uC2DD \uB354 \uBCF4\uAE30");
    expect(t("pantry.planningDeckAria")).toBe("\uD32C\uD2B8\uB9AC \uBC29 \uACC4\uD68D\uACFC \uC2A4\uD47C \uBAA9\uD45C");
  });

  it("supports system language default and in-app overrides", () => {
    setLanguagePreference("system", "ko-KR");
    expect(getLanguagePreference()).toBe("system");
    expect(t("views.album")).toBe("\uc568\ubc94");
    expect(t("controls.fill")).toBe("\uce60\ud558\uae30");
    expect(t("controls.mark")).toBe("\ube48\uce78 \uccb4\ud06c");
    expect(t("views.map")).toBe("\ubc30\uc9c0");
    expect(t("views.pantryHint")).toBe("\uc0c1\uc810/\uafb8\ubbf8\uae30");
    expect(t("pantry.progressMissionRequests", { count: 1, target: 3 })).toBe("\ubd80\ud0c1 1/3\uac1c");
    expect(t("progress.lineGuided", { count: 1 })).toBe("1\uc904");
    expect(t("progress.linesGuided", { count: 3 })).toBe("3\uc904");
    expect(t("pantry.progressMissionPlanRequest")).toBe("\ub2e4\uc74c \ubd80\ud0c1 \uacc4\ud68d\ud558\uae30");
    expect(t("pantry.equipToSlot", { slot: "\uce74\uc6b4\ud130" })).toBe("\uce74\uc6b4\ud130\uc5d0 \ub193\uae30");
    expect(t("pantry.needMore", { count: 7 })).toBe("\uc2a4\ud47c 7\uac1c \ubd80\uc871");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - \uc644\ub8cc");
    expect(t("packs.preview")).toBe("\uc608\uace0");
    expect(t("packs.catalogProgress", { completed: 3, total: 12 })).toBe("3/12 \uc644\ub8cc");
    expect(t("packs.catalogLarge", { count: 7 })).toBe("\ud070 \ud37c\uc990 7\uac1c");
    expect(t("packs.catalogLargest", { size: 12 })).toBe("\ucd5c\ub300 12x12");
    expect(t("seasonProgress.catalogStat", { completed: 3, total: 333 })).toBe("3/333 \uADF8\uB9BC");
    expect(t("seasonProgress.stageStat", { unlocked: 2, total: 5 })).toBe("2/5 \uC2A4\uD14C\uC774\uC9C0 \uC5F4\uB9BC");
    expect(t("seasonProgress.goalSpoonAction")).toBe("\uC2A4\uD47C \uACC4\uD68D \uBCF4\uAE30");
    expect(t("packs.unlockPlanNeedBoth", { count: 12, completed: 2, required: 3 })).toBe("\uC2A4\uD47C 12\uAC1C\uB97C \uB354 \uBAA8\uC73C\uACE0 \uD32C\uD2B8\uB9AC \uBD80\uD0C1 2/3\uAC1C\uB97C \uB9C8\uCE58\uBA74 \uC5F4\uB9B4 \uAC70\uC608\uC694.");
    expect(t("packs.unlockGateNeedPantry", { completed: 2, required: 3 })).toBe("\ud32c\ud2b8\ub9ac \ubd80\ud0c1\uc774 \uc544\uc9c1 2/3\uac1c\uc608\uc694.");
    expect(t("badges.pipPortrait")).toBe("Pip \ucd08\uc0c1\ud654");

    setLanguagePreference("en", "ko-KR");
    expect(getLanguagePreference()).toBe("en");
    expect(t("views.album")).toBe("Album");
  });
});
