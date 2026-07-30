import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import { getDailyGreetingKey, getPuzzleHubOpenDecision, getShelfCollapsedState, hasAffordableUnownedPantryJar, isDailyCompleteForDate } from "../src/ui/puzzleHubView.js";

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

describe("Workshop Pantry notification", () => {
  const jars = [
    { id: "starter", cost: 0 },
    { id: "common", cost: 15 },
    { id: "rare", cost: 40 }
  ];

  it("ignores free starter jars and unaffordable jars", () => {
    expect(hasAffordableUnownedPantryJar(jars, [], 0)).toBe(false);
    expect(hasAffordableUnownedPantryJar(jars, ["starter"], 14)).toBe(false);
  });

  it("lights only when an unowned paid jar is affordable", () => {
    expect(hasAffordableUnownedPantryJar(jars, ["starter"], 15)).toBe(true);
    expect(hasAffordableUnownedPantryJar(jars, ["starter", "common"], 39)).toBe(false);
    expect(hasAffordableUnownedPantryJar(jars, ["starter", "common"], 40)).toBe(true);
  });

  it("stays off after every affordable jar is owned", () => {
    expect(hasAffordableUnownedPantryJar(jars, jars.map((jar) => jar.id), 999)).toBe(false);
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