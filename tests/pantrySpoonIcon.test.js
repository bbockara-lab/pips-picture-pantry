import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Pantry spoon currency rendering", () => {
  it("uses the approved spoon token asset instead of a platform emoji", () => {
    const pantrySource = readFileSync("src/ui/pantryView.js", "utf8");
    const helperSource = readFileSync("src/ui/spoonIcon.js", "utf8");
    expect(pantrySource).toContain("appendSpoonLabel");
    expect(helperSource).toContain("spoon-token-v2.png");
    expect(helperSource).toContain('dataset.assetId = "spoon-token-v2"');
  });

  it("provides one shared balance chip across every view", () => {
    const pantrySource = readFileSync("src/ui/pantryView.js", "utf8");
    const shellSource = readFileSync("src/ui/appShell.js", "utf8");
    const helperSource = readFileSync("src/ui/spoonIcon.js", "utf8");
    const stylesSource = readFileSync("src/styles.css", "utf8");
    const hubSource = readFileSync("src/ui/puzzleHubView.js", "utf8");
    expect(helperSource).toContain("export function renderSpoonBalanceChip(spoons, onTap = null)");
    expect(helperSource).toContain('element.replaceChildren(document.createTextNode(text + " "), createSpoonIcon(size))');
    expect(pantrySource).toMatch(/const result = buyJar\(jar\.id\);[\s\S]*?onRefresh\?\.\(\);/);
    expect(helperSource).toContain('t("currency.spoons"');
    expect(shellSource).not.toContain('activeView !== "pantry" && !isWorkshopHome');
    expect(helperSource).toContain('document.createElement(onTap ? "button" : "div")');
    expect(helperSource).toContain('chip.addEventListener("click", onTap)');
    expect(shellSource).toContain('onOpenSpoonStore: () => selectView("pantry", "spoonStore")');
    expect(shellSource).toContain('focusedPlayOpen ? null : onOpenSpoonStore');
    expect(pantrySource).not.toContain("pantry-jar-balance");
    expect(hubSource).not.toContain("puzzle-home-scene__currency");
    expect(stylesSource).toMatch(/\.spoon-balance-chip\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?pointer-events:\s*none;/);
    expect(stylesSource).toMatch(/\.spoon-balance-chip:is\(button\)\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?pointer-events:\s*auto;[\s\S]*?cursor:\s*pointer;/);
    expect(stylesSource).toMatch(/\.spoon-balance-chip \.spoon-icon\s*\{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;[\s\S]*?object-fit:\s*contain;/);
    expect(stylesSource).toMatch(/\.app-shell--workshop-home \.spoon-balance-chip,[\s\S]*?\.app-shell--play \.spoon-balance-chip\s*\{[\s\S]*?right:\s*max\(68px, calc\(env\(safe-area-inset-right, 0px\) \+ 68px\)\);/);
  });
});
