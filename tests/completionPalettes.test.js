import { describe, expect, it } from "vitest";
import { getCompletionPaletteId, getPackCompletionPalette } from "../src/data/completionPalettes.js";

describe("completion palettes", () => {
  it("prefers authored puzzle palettes over stage defaults", () => {
    expect(getCompletionPaletteId({
      packId: "pips-first-shelf",
      completionPalette: "pip-face"
    })).toBe("pip-face");
  });

  it("gives each launch progression stage a documented palette", () => {
    expect(getCompletionPaletteId({ packId: "sunny-spoon-sign" })).toBe("sunny-sign");
    expect(getCompletionPaletteId({ packId: "apron-drawer" })).toBe("apron-drawer");
    expect(getCompletionPaletteId({ packId: "bakery-window" })).toBe("bakery-window");
    expect(getCompletionPaletteId({ packId: "village-pantry" })).toBe("village-pantry");
    expect(getPackCompletionPalette("sunny-sign")).toHaveLength(4);
    expect(getPackCompletionPalette("apron-drawer")).toHaveLength(4);
  });
});
