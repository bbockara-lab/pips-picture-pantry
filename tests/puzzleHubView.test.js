import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import { getBadgeHomeProgress, getDailyGreetingKey, getPantryHomeProgress, getPuzzleHubOpenDecision, getShelfCollapsedState, isDailyCompleteForDate } from "../src/ui/puzzleHubView.js";

const styles = readFileSync("src/styles.css", "utf8");
const hubSource = readFileSync("src/ui/puzzleHubView.js", "utf8");
const shellSource = readFileSync("src/ui/appShell.js", "utf8");
const preferencesSource = readFileSync("src/ui/preferences.js", "utf8");

describe("Workshop daily greeting", () => {
  it("keeps one greeting for the local day and rotates on the next day", () => {
    const morning = new Date(2026, 6, 28, 8, 0);
    const evening = new Date(2026, 6, 28, 22, 30);
    const tomorrow = new Date(2026, 6, 29, 8, 0);

    expect(getDailyGreetingKey(morning)).toBe(getDailyGreetingKey(evening));
    expect(getDailyGreetingKey(tomorrow)).not.toBe(getDailyGreetingKey(morning));
    expect(getDailyGreetingKey(morning)).toMatch(/^home\.greetingMessages\.\d$/);
  });

  it("keeps the Workshop greeting Pip conversation-sized despite the shared greeting class", () => {
    expect(styles).toMatch(
      /\.app-shell--workshop-home \.puzzle-home-scene__greeting-pip\s*\{[\s\S]*?width:\s*clamp\(90px,\s*22vw,\s*120px\)\s*!important;[\s\S]*?height:\s*auto\s*!important;/
    );
  });
});

describe("Daily completion status", () => {
  it("is complete only when the saved date matches today", () => {
    expect(isDailyCompleteForDate("2026-07-29", "2026-07-29")).toBe(true);
    expect(isDailyCompleteForDate("2026-07-28", "2026-07-29")).toBe(false);
    expect(isDailyCompleteForDate(null, "2026-07-29")).toBe(false);
  });
  it("renders completed Daily cards as disabled and without a click handler", () => {
    expect(hubSource).toContain('button.textContent = completed ? t("daily.completed")');
    expect(hubSource).toContain("button.disabled = completed || selected");
    expect(hubSource).toContain("if (!completed && !selected) {");
  });
});

describe("Workshop destination collection progress", () => {
  const jars = [
    { id: "starter", cost: 0 },
    { id: "common", cost: 15 },
    { id: "rare", cost: 40 }
  ];

  it("shows paid Pantry jar progress without counting the free starter jar", () => {
    expect(getPantryHomeProgress(jars, 0)).toEqual({ current: 0, total: 2 });
    expect(getPantryHomeProgress(jars, 1)).toEqual({ current: 1, total: 2 });
  });

  it("clamps Pantry progress to the authored paid-jar total", () => {
    expect(getPantryHomeProgress(jars, 999)).toEqual({ current: 2, total: 2 });
  });

  it("shows earned badge progress against every authored badge", () => {
    const empty = getBadgeHomeProgress([]);
    expect(empty.current).toBe(0);
    expect(empty.total).toBe(12);
    const firstBadgePuzzleIds = getSeasonShelfPuzzles(seasonShelves[0]).map((puzzle) => puzzle.id);
    expect(getBadgeHomeProgress(firstBadgePuzzleIds)).toEqual({ current: 1, total: 12 });
  });

  it("renders Pantry and Badges as flat numeric progress, never the old red dot", () => {
    expect(hubSource).toContain('artId === "pantry"');
    expect(hubSource).toContain('artId === "map"');
    expect(hubSource).toContain("getBadgeHomeProgress(completedIds)");
    expect(hubSource).not.toContain("puzzle-home-destination__badge--new");
    expect(styles).not.toContain("puzzle-home-destination__badge--new");
  });
});

describe("Workshop Play Now shelf completion routing", () => {
  const currentShelf = seasonShelves[0];
  const nextShelf = seasonShelves[1];
  const currentPuzzles = getSeasonShelfPuzzles(currentShelf);
  const nextPuzzles = getSeasonShelfPuzzles(nextShelf);

  it("opens the current puzzle while the shelf is unfinished", () => {
    const decision = getPuzzleHubOpenDecision(currentPuzzles[0], [currentPuzzles[0].id], () => false);
    expect(decision).toEqual({ type: "open", puzzle: currentPuzzles[0] });
  });

  it("shows the unlock guide when the completed shelf is followed by a locked shelf", () => {
    const decision = getPuzzleHubOpenDecision(currentPuzzles[0], currentPuzzles.map(({ id }) => id), () => false);
    expect(decision.type).toBe("unlock-guide");
    expect(decision.currentShelf.id).toBe(currentShelf.id);
    expect(decision.nextShelf.id).toBe(nextShelf.id);
  });

  it("advances to the next shelf when that shelf is already unlocked", () => {
    const decision = getPuzzleHubOpenDecision(currentPuzzles[0], currentPuzzles.map(({ id }) => id), () => true);
    expect(decision).toEqual({ type: "open", puzzle: nextPuzzles[0] });
  });
});

describe("Workshop Play Now layout", () => {
  it("keeps the primary action visibly dominant inside one canonical composition", () => {
    const step63Styles = styles.slice(styles.indexOf("v0.1.714 - Step 63 canonical Workshop composition"));
    expect(step63Styles).toContain("--workshop-destination-size: clamp(74px, 20vw, 92px)");
    expect(step63Styles).toContain("--workshop-play-size: clamp(130px, 36vw, 164px)");
    expect(step63Styles).toContain("bottom: var(--workshop-nav-clearance) !important");
    expect(step63Styles).toContain("width: min(90%, 120px) !important");
    expect(step63Styles).toContain("top: clamp(250px, 32%, 300px) !important");
    expect(step63Styles).toContain("top: clamp(370px, 48%, 450px) !important");
    expect(step63Styles).toContain("left: 50% !important");
    expect(step63Styles).toContain("background: transparent !important");
    expect(step63Styles).toContain("color: #fffdf4");
    expect(step63Styles).toContain("text-shadow: 0 2px 1px rgba(61, 43, 46, 0.88)");
  });

  it("connects Pip to the greeting used for both idle and login-reward copy", () => {
    const step63Styles = styles.slice(styles.indexOf("v0.1.714 - Step 63 canonical Workshop composition"));
    expect(step63Styles).toContain("margin-right: -22px");
    expect(step63Styles).toContain(".puzzle-home-scene__greeting::before");
    expect(step63Styles).toContain("top: clamp(92px, 12%, 116px) !important");
    expect(step63Styles).toContain("max-width: calc(100% - 170px) !important");
    expect(hubSource).toContain("greetingMessage || t(getDailyGreetingKey())");
    expect(styles).not.toContain(".login-bonus-popover");
  });
});

describe("Per-shelf puzzle picker collapse", () => {
  it("defaults completed shelves closed and unfinished shelves open", () => {
    expect(getShelfCollapsedState("complete", true)).toBe(true);
    expect(getShelfCollapsedState("unfinished", false)).toBe(false);
  });

  it("keeps explicit expand and collapse choices in the session override map", () => {
    const overrides = new Map([["complete", false], ["unfinished", true]]);
    expect(getShelfCollapsedState("complete", true, overrides)).toBe(false);
    expect(getShelfCollapsedState("unfinished", false, overrides)).toBe(true);
  });

  it("removes the retired stage-art mosaic from every shelf", () => {
    expect(hubSource).not.toContain("createStagePreview");
    expect(hubSource).not.toContain("createStageTileMosaic");
    expect(hubSource).not.toContain("createStageFallbackMosaic");
    expect(hubSource).not.toContain("getStageArtUrl");
    expect(styles).not.toContain(".stage-tile-mosaic");
    expect(styles).not.toContain(".pip-tile-mosaic");
    expect(styles).not.toContain(".stage-preview");
  });

  it("retires the global persisted filter and renders accessible shelf toggles", () => {
    expect(hubSource).not.toContain("createStageFilterBar");
    expect(shellSource).not.toContain("hideCompletedStages");
    expect(preferencesSource).not.toContain("HIDE_COMPLETED_STAGES_KEY");
    expect(hubSource).toContain('button.setAttribute("aria-expanded", String(!collapsed))');
    expect(hubSource).toContain('content.hidden = collapsed');
    expect(styles).toMatch(/\.shelf-collapse-toggle\s*\{[\s\S]*?min-width:\s*44px;[\s\S]*?height:\s*44px;/);
  });
});
