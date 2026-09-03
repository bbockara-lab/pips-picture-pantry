import { describe, expect, it } from "vitest";
import { pantryDecorations } from "../src/data/decorations.js";
import { getPantryOverlayUrl } from "../src/data/pantryOverlayArt.js";

describe("Pantry room v2 overlay art", () => {
  it("provides a master-canvas overlay for every purchasable decoration", () => {
    expect(pantryDecorations).toHaveLength(25);
    for (const decoration of pantryDecorations) {
      expect(getPantryOverlayUrl(decoration.assetId)).toMatch(/room-v2-(counter|window|shelf|floor|wall)-\d{2}\.png$/);
    }
  });

  it("does not resolve an overlay for an unknown decoration asset", () => {
    expect(getPantryOverlayUrl("not-a-pantry-decoration")).toBe("");
  });
});
