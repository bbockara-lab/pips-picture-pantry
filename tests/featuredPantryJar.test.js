import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const featuredSource = readFileSync(new URL("../src/ui/featuredPantryJar.js", import.meta.url), "utf8");
const hubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const pantrySource = readFileSync(new URL("../src/ui/pantryView.js", import.meta.url), "utf8");
const puzzleSource = readFileSync(new URL("../src/ui/puzzleView.js", import.meta.url), "utf8");
const reactionSource = readFileSync(new URL("../src/ui/pipReaction.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Selected Pantry jar meaning", () => {
  it("uses approved jar art and localized completion copy", () => {
    expect(featuredSource).toContain("getJarArtUrl(jar.id)");
    expect(featuredSource).toContain('t("pantry.jar.todaysPantry")');
    expect(featuredSource).toContain("t(jar.nameKey)");
  });

  it("offers a separate home-display action for owned jars", () => {
    expect(pantrySource).toContain("getFeaturedJarId() === jar.id");
    expect(pantrySource).toContain("setFeaturedJar(jar.id)");
    expect(pantrySource).toContain('className = "pantry-jar-detail__btn-feature"');
  });

  it("shows the directly selected jar on Workshop home and opens Pantry on tap", () => {
    expect(hubSource).toContain("const featuredJarId = getFeaturedJarId()");
    expect(hubSource).toContain("getJarById(featuredJarId)");
    expect(hubSource).toContain('className = "home-keepsake-jar"');
    expect(hubSource).toContain('onSelectView("pantry")');
  });

  it("keeps stage-equipped jar behavior on regular puzzle completion", () => {
    expect(puzzleSource).toContain("equippedJar: isTimeAttack");
    expect(puzzleSource).toContain("getEquippedJarForCurrentStage(getSeasonShelfForPuzzle(puzzle))");
    expect(reactionSource).toContain('className: "completion-banner__featured-jar"');
    expect(reactionSource).toContain("if (featuredJar) content.push(featuredJar)");
  });

  it("renders the home jar as image-only inside the unified keepsake shelf", () => {
    const step46Styles = styles.slice(styles.indexOf("v0.1.690 - Step 46 unified Workshop keepsake shelf"));
    expect(hubSource).toContain('keepsakeShelf.className = "home-keepsake-shelf"');
    expect(hubSource).not.toContain("if (featuredJarCard) scene.appendChild(featuredJarCard)");
    expect(step46Styles).toContain(".home-keepsake-shelf");
    expect(step46Styles).toContain(".home-keepsake-jar");
    expect(step46Styles).toContain("background: none");
  });
});
