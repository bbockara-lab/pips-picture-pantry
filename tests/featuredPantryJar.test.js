import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const featuredSource = readFileSync(new URL("../src/ui/featuredPantryJar.js", import.meta.url), "utf8");
const hubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const puzzleSource = readFileSync(new URL("../src/ui/puzzleView.js", import.meta.url), "utf8");
const reactionSource = readFileSync(new URL("../src/ui/pipReaction.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

 describe("Selected Pantry jar meaning", () => {
  it("uses approved jar art and localized name copy", () => {
    expect(featuredSource).toContain("getJarArtUrl(jar.id)");
    expect(featuredSource).toContain('t("pantry.jar.todaysPantry")');
    expect(featuredSource).toContain("t(jar.nameKey)");
  });

  it("shows the current stage jar on Workshop home and opens Pantry on tap", () => {
    expect(hubSource).toContain("getEquippedJarForCurrentStage(activeShelf)");
    expect(hubSource).toContain('onSelect: () => onSelectView("pantry")');
    expect(hubSource).toContain('className: "puzzle-home-scene__featured-jar"');
  });

  it("shows the jar only on regular puzzle completion", () => {
    expect(puzzleSource).toContain("equippedJar: isTimeAttack");
    expect(puzzleSource).toContain("getEquippedJarForCurrentStage(getSeasonShelfForPuzzle(puzzle))");
    expect(reactionSource).toContain('className: "completion-banner__featured-jar"');
    expect(reactionSource).toContain("if (featuredJar) content.push(featuredJar)");
  });

  it("keeps compact home and full-width completion presentation contracts", () => {
    expect(styles).toContain("v0.1.679 - meaningful featured Pantry jar");
    expect(styles).toContain(".app-shell--workshop-home .puzzle-home-scene__featured-jar");
    expect(styles).toContain(".completion-banner__featured-jar");
  });
});