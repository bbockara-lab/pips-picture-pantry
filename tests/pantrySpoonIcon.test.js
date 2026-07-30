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

  it("provides one shared balance chip outside Pantry and Workshop home", () => {
    const shellSource = readFileSync("src/ui/appShell.js", "utf8");
    const helperSource = readFileSync("src/ui/spoonIcon.js", "utf8");
    const stylesSource = readFileSync("src/styles.css", "utf8");
    expect(helperSource).toContain("export function renderSpoonBalanceChip(spoons)");
    expect(helperSource).toContain('t("currency.spoons"');
    expect(shellSource).toContain('activeView !== "pantry" && !isWorkshopHome');
    expect(shellSource).toContain("renderSpoonBalanceChip(getPantrySpoons())");
    expect(stylesSource).toMatch(/\.spoon-balance-chip\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?pointer-events:\s*none;/);
  });
});
