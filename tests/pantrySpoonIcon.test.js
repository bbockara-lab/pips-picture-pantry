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
});
