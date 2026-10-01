import { describe, expect, it } from "vitest";
import { puzzles } from "../src/data/puzzles.js";
import { puzzlePacks } from "../src/data/packs.js";
import { seasonShelves } from "../src/data/seasonShelves.js";
import { getPackCompletionPalette } from "../src/data/completionPalettes.js";

describe("Korean Harvest runtime gate", () => {
  it("publishes every approved event catalog layer together", () => {
    expect(puzzles.filter((puzzle) => puzzle.packId === "korean-harvest")).toHaveLength(16);
    expect(puzzlePacks.filter((pack) => pack.id === "korean-harvest")).toHaveLength(1);
    expect(seasonShelves.filter((shelf) => shelf.artPackId === "korean-harvest")).toHaveLength(4);
  });

  it("has a dedicated readable completion palette ready for activation", () => {
    expect(getPackCompletionPalette("korean-harvest-001")).toEqual([
      "#24385f",
      "#79917a",
      "#f4e4bd",
      "#d8764e",
      "#b58a3a"
    ]);
  });
});
