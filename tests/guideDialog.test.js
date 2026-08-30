import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guideSource = readFileSync(new URL("../src/ui/guideDialog.js", import.meta.url), "utf8");
const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const settingsSource = readFileSync(new URL("../src/ui/settingsView.js", import.meta.url), "utf8");
const englishSource = readFileSync(new URL("../src/i18n/en.js", import.meta.url), "utf8");
const koreanSource = readFileSync(new URL("../src/i18n/ko.js", import.meta.url), "utf8");
const mobileQaSource = readFileSync(new URL("../scripts/mobile_visual_check.js", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("guide dialog character and badge wiring", () => {
  it("assigns the approved Mr. Park art to Time Attack", () => {
    expect(guideSource).toMatch(
      /timeAttack:\s*\{\s*className:\s*"mr-park",\s*assetId:\s*"story-friend-mr-park-v1"/
    );
  });

  it("registers and automatically opens the unseen map guide", () => {
    expect(guideSource).toContain(
      'map: ["guide.map.step1", "guide.map.step2", "guide.map.step3"]'
    );
    expect(appShellSource).toMatch(
      /activeView === "map" && !hasSeenGuide\("map"\)[\s\S]*?activeGuide = "map"/
    );
  });

  it("opens the two-step Pip guide only for an unseen Spoon Run intro", () => {
    expect(guideSource).toContain(
      'spoonRunIntro: ["guide.spoonRunIntro.step1", "guide.spoonRunIntro.step2"]'
    );
    expect(guideSource).toContain('spoonRunIntro: "guide.spoonRunIntro.speakerName"');
    expect(appShellSource).toMatch(
      /activeView === "spoonRun" && !hasSeenGuide\("spoonRunIntro"\)[\s\S]*?activeGuide = "spoonRunIntro"/
    );
  });
  it("opens the real cursor-control intro once on the first 8x8 puzzle", () => {
    expect(guideSource).toContain(
      'cursorControlsIntro: ["guide.cursorControlsIntro.step1", "guide.cursorControlsIntro.step2", "guide.cursorControlsIntro.step3"]'
    );
    expect(guideSource).toContain('cursorControlsIntro: "guide.cursorControlsIntro.speakerName"');
    expect(guideSource).toContain('renderCursorControls } from "./puzzleCursorControls.js"');
    expect(guideSource).toContain("function createCursorControlsPreview()");
    expect(guideSource).toContain("renderCursorControls(state, puzzle");
    expect(guideSource).toContain('trailDemo.className = "guide-cursor-trail-demo"');
    expect(guideSource).toContain('cell.classList.toggle("is-filled", state.cells[0]?.[index] === "filled")');
    expect(stylesSource).toContain(".guide-cursor-trail-demo__cell.is-filled");
    expect(appShellSource).toMatch(
      /!hasSeenGuide\("puzzle"\)[\s\S]*?\(activeView === "puzzle" \|\| activeView === "timeAttack"\)[\s\S]*?Number\(activePuzzle\?\.size\) === 8 && !hasSeenGuide\("cursorControlsIntro"\)[\s\S]*?activeGuide = "cursorControlsIntro"/
    );
  });
  it("verifies and dismisses the Spoon Run intro in mobile candidate QA", () => {
    expect(mobileQaSource).toContain("expectSpoonRunFirstVisitGuide(page, viewport.name)");
    expect(mobileQaSource).toContain(".guide-dialog--spoonRunIntro");
  });
  it("checks that the real cursor-control preview stays inside the mobile guide", () => {
    expect(mobileQaSource).toContain("expectCursorControlsGuideContained");
    expect(mobileQaSource).toContain('document.querySelectorAll(".guide-cursor-preview").length');
    expect(mobileQaSource).toContain('preview?.querySelectorAll(".cursor-move").length || 0');
  });
  it("keeps launch guides above the gesture safe area without changing neighbour dialogs", () => {
    expect(stylesSource).toContain(
      "padding: 48px 0 max(48px, calc(env(safe-area-inset-bottom, 0px) + 24px)) !important;"
    );
    expect(stylesSource).toMatch(
      /\.guide-overlay--pantryNeighborMrPark,[\s\S]*?padding:\s*16px !important;/
    );
  });

  it("locks background scrolling while any guide is active", () => {
    expect(appShellSource).toContain(
      'document.body.classList.toggle("guide-open", Boolean(activeGuide || allPuzzlesDonePromptOpen))'
    );
  });

  it("forces a completed-shelf player toward the Pantry gate", () => {
    expect(guideSource).toContain("export function renderAllPuzzlesDoneDialog");
    expect(guideSource).toContain('t("guide.allPuzzlesDone")');
    expect(guideSource).toContain('t("guide.unlockNextHint")');
    expect(guideSource).toContain('pantryButton.addEventListener("click", onPantry)');
    expect(guideSource).not.toContain('spoonRunButton.addEventListener("click", onSpoonRun)');
    expect(appShellSource).toContain("getPuzzleHubOpenDecision(activePuzzle");
    expect(appShellSource).toContain('onAllPuzzlesDonePantry: () => selectView("pantry")');
    expect(appShellSource).not.toContain('onAllPuzzlesDoneSpoonRun: () => selectView("spoonRun")');
  });

  it("adds localized speaker name tags only to the character-led launch guides", () => {
    expect(guideSource).toContain('puzzle: "guide.puzzle.speakerName"');
    expect(guideSource).toContain('timeAttack: "guide.timeAttack.speakerName"');
    expect(guideSource).toContain('map: "guide.map.speakerName"');
    expect(guideSource).toContain('nameTag.className = "guide-dialog__name-tag"');
  });
  it("opens a real puzzle from the empty Album action", () => {
    expect(appShellSource).toContain("renderAlbumView(onNextPuzzle)");
    expect(appShellSource).not.toContain('renderAlbumView(() => onSelectView("puzzle"))');
  });

  it("archives the map guide in Pip's Mailbox", () => {
    const mailboxSource = readFileSync(new URL("../src/data/mailboxMessages.js", import.meta.url), "utf8");
    expect(mailboxSource).toContain('["guide-map", "map"]');
    expect(settingsSource).not.toContain("createGuideReplayCard");
  });
  it("offers the D-pad guide again from the mailbox and explains that controls remain changeable", () => {
    const mailboxSource = readFileSync(new URL("../src/data/mailboxMessages.js", import.meta.url), "utf8");
    expect(mailboxSource).toContain('["guide-cursor", "cursorControlsIntro"]');
    expect(englishSource).toContain('guideReplayCursorAction: "D-pad guide"');
    expect(englishSource).toContain("Use the switch beside Color and Blank to change between the D-pad and direct taps anytime.");
    expect(koreanSource).toContain('guideReplayCursorAction: "방향키 가이드"');
    expect(koreanSource).toContain("칠하기와 빈칸 버튼 가까이에 있는 전환 버튼으로 방향키와 칸 직접 누르기를 바로 바꿀 수 있어요.");
  });
  it("registers the jar display guide and offers it again from the mailbox", () => {
    expect(guideSource).toContain(
      'pantryJarIntro: ["guide.pantryJarIntro.step1", "guide.pantryJarIntro.step2"]'
    );
    expect(guideSource).toContain('pantryJarIntro: "guide.pantryJarIntro.speakerName"');
    const mailboxSource = readFileSync(new URL("../src/data/mailboxMessages.js", import.meta.url), "utf8");
    expect(mailboxSource).toContain('["guide-pantry-jar", "pantryJarIntro"]');
    expect(englishSource).toContain('guideReplayPantryJarAction: "Home display bonus guide"');
    expect(englishSource).toContain("Choose Display on home for an owned collectible");
    expect(englishSource).not.toContain("Activate effect is a separate choice");
    expect(koreanSource).toContain('guideReplayPantryJarAction: "홈 전시와 보너스 가이드"');
    expect(koreanSource).toContain("‘홈에 표시하기’를 누르면 퍼즐방과 그림 완료 화면에서 제 곁에 함께 나와요.");
    expect(koreanSource).not.toContain("효과 활성화는 또 다른 선택이에요");
  });
  it("centers and separates every non-puzzle Pip guide bubble", () => {
    for (const guideId of ["map", "spoonRunIntro", "pantryFirstPurchase"]) {
      expect(stylesSource).toContain(`.guide-overlay--${guideId} .guide-dialog__line`);
      expect(stylesSource).toContain(`.guide-overlay--${guideId} .guide-dialog__art`);
      expect(stylesSource).toContain(`.guide-overlay--${guideId} .guide-dialog__bubble`);
      expect(stylesSource).toContain(`.guide-overlay--${guideId} .guide-dialog__name-tag`);
    }
    expect(stylesSource).toContain("text-align: center !important;");
    expect(stylesSource).toContain("padding-bottom: 36px !important;");
    expect(stylesSource).toContain("align-content: center !important;");
    expect(stylesSource).toContain("bottom: 32px !important;");
  });

  it("retires obsolete Pantry room and neighbour popups from runtime and mailbox", () => {
    const mailboxSource = readFileSync(new URL("../src/data/mailboxMessages.js", import.meta.url), "utf8");
    for (const guideId of ["pantryRoomStory", "pantryNeighborMrPark", "pantryNeighborLily", "pantryNeighborMateo"]) {
      expect(guideSource).not.toContain(`${guideId}: [`);
      expect(mailboxSource).not.toContain(`\"${guideId}\"`);
    }
    expect(guideSource).not.toContain("story-friend-lily-v1");
    expect(guideSource).not.toContain("story-friend-mateo-v1");
  });

  it("keeps every mobile puzzle guide page inside the viewport", () => {
    expect(stylesSource).toContain(
      "grid-template-rows: minmax(0, 48fr) minmax(0, 52fr) !important;"
    );
    expect(stylesSource).toContain(
      "padding: max(20px, env(safe-area-inset-top, 0px)) 20px 48px !important;"
    );
    expect(mobileQaSource).toContain("expectPuzzleGuidePageContained");
    expect(mobileQaSource).toContain("Puzzle guide step");
  });
});
