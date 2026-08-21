import { describe, expect, it } from "vitest";
import { puzzles } from "../src/data/puzzles.js";
import { puzzlePacks } from "../src/data/packs.js";
import { seasonShelves } from "../src/data/seasonShelves.js";
import { getPackCompletionPalette } from "../src/data/completionPalettes.js";

describe("Korean Harvest runtime gate", () => {
  it("keeps every candidate catalog entry out of the current live game", () => {
    expect(puzzles.some((puzzle) => puzzle.packId === "korean-harvest")).toBe(false);
    expect(puzzlePacks.some((pack) => pack.id === "korean-harvest")).toBe(false);
    expect(seasonShelves.some((shelf) => shelf.artPackId === "korean-harvest")).toBe(false);
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
