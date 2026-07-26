import { afterEach, describe, expect, it } from "vitest";
import {
  getActiveLocale,
  getLanguagePreference,
  puzzleAlbumText,
  puzzleText,
  puzzleTitle,
  setActiveLocale,
  setLanguagePreference,
  t
} from "../src/i18n/index.js";
import { ko } from "../src/i18n/ko.js";

const KOREAN_MOJIBAKE_PATTERN = /[\u3400-\u4DBF\u4E00-\u9FFF\uFFFD]|\?{2,}/;

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
    expect(t("daily.eyebrow")).toBe("Today's picture");
    expect(t("views.map")).toBe("Badges");
    expect(t("puzzlePicker.size", { size: 5 })).toBe("5×5");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - Complete");
    expect(t("album.completed", { completed: 1 })).toBe("1 pictures");
    expect(t("badges.progressAria", { title: "First Shelf Badge", completed: 1, total: 20 }))
      .toBe("First Shelf Badge badge progress 1 of 20");
    expect(t("settings.playerName")).toBe("Player name");
    expect(t("currency.spoons", { count: 7 })).toBe("Spoons 7");
    expect(t("packs.preview")).toBe("Preview");
    expect(t("packs.catalogProgress", { completed: 3, total: 12 })).toBe("3/12 done");
    expect(t("packs.catalogLarge", { count: 7 })).toBe("7 large");
    expect(t("packs.catalogLargest", { size: 12 })).toBe("up to 12x12");
    expect(t("packs.pricePreview")).toBe("Preview set");
    expect(t("brandIntro.launchNote")).toBe("Season 0 opens with 333 cozy pictures, pantry goals, and spoon rewards.");
    expect(t("brandIntro.promisePuzzleAction")).toBe("Solve");
    expect(t("brandIntro.promiseDecorateAction")).toBe("Decorate");
    expect(t("brandIntro.promiseTimeAttackAction")).toBe("Challenge");
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

  it("uses the localized image name in generic Korean album copy", () => {
    setActiveLocale("ko");
    const copy = puzzleAlbumText({
      id: "pips-first-shelf-soup-bowl-2",
      title: "Soup Bowl"
    });
    expect(copy).toContain("\uc218\ud504 \uadf8\ub987");
    expect(copy).not.toContain("Soup Bowl");
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
    expect(t("guide.next")).toBe("\ub2e4\uc74c");

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
      "guide.pantryRoomStory.title",
      "guide.pantryRoomStory.step1",
      "guide.pantryRoomStory.step2",
      "guide.pantryRoomStory.step3",
      "guide.pantryNeighborMrPark.title",
      "guide.pantryNeighborMrPark.step1",
      "guide.pantryNeighborMrPark.step2",
      "guide.pantryNeighborMrPark.step3",
      "guide.pantryNeighborLily.title",
      "guide.pantryNeighborLily.step1",
      "guide.pantryNeighborLily.step2",
      "guide.pantryNeighborLily.step3",
      "guide.pantryNeighborMateo.title",
      "guide.pantryNeighborMateo.step1",
      "guide.pantryNeighborMateo.step2",
      "guide.pantryNeighborMateo.step3",
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
    expect(t("playerIntro.placeholder")).toBe("하늘");
    expect(t("playerIntro.defaultName")).toBe("친구");
    expect(t("playerIntro.placeholder")).not.toBe("Jay");
    expect(t("playerIntro.defaultName")).not.toBe("Friend");
    expect(t("guide.speaker")).toContain("Pip");
    expect(t("guide.puzzle.step1")).toContain("\uc774\uc5b4");
    expect(t("guide.timeAttack.step2")).toBe("\uB9C9\uD790 \uB54C\uB9CC \uD78C\uD2B8\uB97C \uACE8\uB77C\uC694.");
    expect(t("guide.pantryFirstPurchase.step3")).toContain("\uC2A4\uD47C");
    expect(t("guide.pantryNeighborMrPark.title")).toContain("시계 할아버지");
    expect(t("guide.pantryNeighborMrPark.step2")).toContain("\uB530\uB73B\uD55C \uC218\uD504");
    expect(t("guide.pantryNeighborMrPark.step2")).not.toContain("\uC2DC\uACC4 \uD560\uC544\uBC84\uC9C0");
    expect(t("guide.pantryNeighborLily.title")).toContain("릴리");
    expect(t("guide.pantryNeighborMateo.title")).toContain("마테오");
    [
      "guide.pantryNeighborMrPark.title",
      "guide.pantryNeighborMrPark.step1",
      "guide.pantryNeighborLily.title",
      "guide.pantryNeighborLily.step1",
      "guide.pantryNeighborMateo.title",
      "guide.pantryNeighborMateo.step1"
    ].forEach((key) => expect(t(key)).not.toMatch(/Mr\.? Park|Lily|Mateo/));
    expect(t("controls.hintRemaining", { count: 1, limit: 3 })).toBe("\uD78C\uD2B8 1/3");
    expect(t("howToPlay.pipLine")).toContain("Pip");
    expect(t("controls.lineCompleteHint")).toContain("\uc548\uc804\ud55c \ube48\uce78");
    expect(t("controls.lineCompleteHint")).toContain("\uc790\ub3d9");
    expect(t("controls.paidHintIntro", { cost: 9, count: 5, balance: 20 })).toContain("\uC2A4\uD47C 9\uAC1C");
    expect(t("controls.paidHintIntro", { cost: 9, count: 5, balance: 20 })).not.toContain("\uBB34\uB8CC");
    expect(t("controls.timeAttackHintIntro", { cost: 9, balance: 20 })).not.toContain("\uBB34\uB8CC");
    expect(t("controls.timeAttackHintIntro", { cost: 9, balance: 20 })).toContain("\uC2A4\uD47C 9\uAC1C");
    expect(t("replayPicks.title")).toBe("\uB2E4\uC2DC \uD480\uAE30");
    expect(t("replayPicks.cleanRule")).toContain("\uC2A4\uD47C 1\uAC1C");
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

    expect(t("pantry.story.startTitle", { slot: "\uCE74\uC6B4\uD130" })).toBe(
      "\uCE74\uC6B4\uD130 \uC790\uB9AC\uB97C \uBA3C\uC800 \uB530\uB73B\uD558\uAC8C \uD574\uBCFC\uAE4C\uC694?"
    );
    expect(t("pantry.storyNextArrivalAction", { item: "\uD5C8\uBE0C \uD654\uBD84" })).toBe("허브 화분 보기");
    expect(t("pantry.storyDeliveryNeed", { slot: "카운터", needed: 17 })).toBe("카운터 · 스푼 17개 더");
    expect(t("pantry.storyDeliveryEarn")).toBe("\uC2A4\uD47C \uBC8C\uB7EC \uAC00\uAE30");
    expect(t("pantry.feedbackBuyTitle", { item: "\uC791\uC740 \uC7BC \uBCD1" })).toBe("\uC791\uC740 \uC7BC \uBCD1\uC774 \uD32C\uD2B8\uB9AC\uC5D0 \uC654\uC5B4\uC694");
    expect(t("pantry.availability.canBuy")).toBe("\uC0B4 \uC218 \uC788\uC74C");
    expect(t("pantry.shopLimitAction")).toBe("\uC7A5\uC2DD \uB354 \uBCF4\uAE30");
  });

  it("keeps Billing readiness copy launch-facing instead of test-build wording", () => {
    setActiveLocale("en");

    expect(t("settings.supportAndroidOnly")).toBe("Store connection is being prepared.");
    expect(t("settings.supportFactAndroid")).toBe("Store preparing");
    expect(t("settings.supportPricePending")).toBe("Check price");
    expect(t("settings.supportAndroidOnly")).not.toMatch(/Android test build|Google Play app|Google Play price/i);
    expect(t("settings.supportFactAndroid")).not.toMatch(/Android test build|Google Play app|Google Play price/i);
    expect(t("settings.supportPricePending")).not.toMatch(/Android test build|Google Play app|Google Play price/i);

    setActiveLocale("ko");

    expect(t("settings.supportAndroidOnly")).toContain("Play \uC2A4\uD1A0\uC5B4");
    expect(t("settings.supportFactAndroid")).toBe("\uC2A4\uD1A0\uC5B4 \uC900\uBE44 \uC911");
    expect(t("settings.supportPricePending")).toBe("\uAC00\uACA9 \uD655\uC778");
    expect(t("settings.supportAndroidOnly")).not.toMatch(/Android \uD14C\uC2A4\uD2B8|Google Play \uC571|Google Play \uAC00\uACA9/);
    expect(t("settings.supportFactAndroid")).not.toMatch(/Android \uD14C\uC2A4\uD2B8|Google Play \uC571|Google Play \uAC00\uACA9/);
  });

  it("keeps Time Attack results compact in both languages", () => {
    setActiveLocale("en");
    expect(t("timeAttack.recordLine", { size: 8, progress: 42, time: "1:23" })).toBe("8x8 \u00b7 42 cells \u00b7 1:23");
    expect(t("timeAttack.lastScore", { progress: 42, time: "1:23" })).toBe("42 cells \u00b7 1:23");

    setActiveLocale("ko");
    expect(t("timeAttack.recordLine", { size: 8, progress: 42, time: "1:23" })).toBe("8x8 \u00b7 42\uce78 \u00b7 1:23");
    expect(t("timeAttack.lastScore", { progress: 42, time: "1:23" })).toBe("42\uce78 \u00b7 1:23");
  });

  it("supports system language default and in-app overrides", () => {
    setLanguagePreference("system", "ko-KR");
    expect(getLanguagePreference()).toBe("system");
    expect(t("views.album")).toBe("\uc568\ubc94");
    expect(t("controls.fill")).toBe("\uce60\ud558\uae30");
    expect(t("controls.mark")).toBe("\ube48\uce78 \uccb4\ud06c");
    expect(t("views.map")).toBe("\ubc30\uc9c0");
    expect(t("progress.lineGuided", { count: 1 })).toBe("1\uc904");
    expect(t("progress.linesGuided", { count: 3 })).toBe("3\uc904");
    expect(t("pantry.equipToSlot", { slot: "\uce74\uc6b4\ud130" })).toBe("\uce74\uc6b4\ud130\uc5d0 \ub193\uae30");
    expect(t("pantry.needMore", { count: 7 })).toBe("\uc2a4\ud47c 7\uac1c \ubd80\uc871");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - \uc644\ub8cc");
    expect(t("packs.preview")).toBe("\uc608\uace0");
    expect(t("packs.catalogProgress", { completed: 3, total: 12 })).toBe("3/12 \uc644\ub8cc");
    expect(t("packs.catalogLarge", { count: 7 })).toBe("\ud070 \ud37c\uc990 7\uac1c");
    expect(t("packs.catalogLargest", { size: 12 })).toBe("\ucd5c\ub300 12x12");
    expect(t("badges.pipPortrait")).toBe("Pip \ucd08\uc0c1\ud654");

    setLanguagePreference("en", "ko-KR");
    expect(getLanguagePreference()).toBe("en");
    expect(t("views.album")).toBe("Album");
  });

  it("localizes early stage picture names in Korean", () => {
    setActiveLocale("ko");
    expect(puzzleTitle({ id: "sunny-spoon-sign-cafe-window-1", title: "Cafe Window" })).toBe("카페 창가");
    expect(puzzleTitle({ id: "apron-drawer-rolling-pin-2-20", title: "Rolling Pin 2" })).toBe("두 번째 밀대");
    setActiveLocale("en");
  });

  it("lets intentionally replaced puzzle art use its new localized title", () => {
    setActiveLocale("ko");
    expect(puzzleTitle({
      id: "village-pantry-jam-jar-15",
      title: "Jam Jar",
      runtimeTitle: "Jam Shelf"
    })).toBe("잼 선반");
    setActiveLocale("en");
  });
});
