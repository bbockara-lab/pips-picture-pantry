import { describe, expect, it } from "vitest";
import { KOREAN_HARVEST_PUZZLES } from "../src/data/koreanHarvestPuzzles.js";
import { puzzles } from "../src/data/puzzles.js";

describe("Korean Harvest candidate puzzle catalog", () => {
  it("contains four directly-authored puzzles at every supported event size", () => {
    expect(KOREAN_HARVEST_PUZZLES).toHaveLength(16);
    expect(Object.fromEntries([5, 8, 10, 12].map((size) => [
      size,
      KOREAN_HARVEST_PUZZLES.filter((puzzle) => puzzle.size === size).length
    ]))).toEqual({ 5: 4, 8: 4, 10: 4, 12: 4 });
  });

  it("keeps every solution square, binary, non-empty and unique", () => {
    const fingerprints = new Set();
    for (const puzzle of KOREAN_HARVEST_PUZZLES) {
      expect(puzzle.solution).toHaveLength(puzzle.size);
      expect(puzzle.solution.every((row) => row.length === puzzle.size && /^[01]+$/.test(row))).toBe(true);
      expect(puzzle.solution.some((row) => row.includes("1"))).toBe(true);
      const fingerprint = `${puzzle.size}:${puzzle.solution.join("/")}`;
      expect(fingerprints.has(fingerprint)).toBe(false);
      fingerprints.add(fingerprint);
    }
  });

  it("ships localized titles and remains gated as candidate content", () => {
    for (const puzzle of KOREAN_HARVEST_PUZZLES) {
      expect(puzzle.title).toBeTruthy();
      expect(puzzle.titleKo).toBeTruthy();
      expect(puzzle.packId).toBe("korean-harvest");
      expect(puzzle.releaseStatus).toBe("candidate");
    }
  });

  it("does not repeat any solution from the current 600-picture catalog", () => {
    const liveFingerprints = new Set(puzzles.map((puzzle) => `${puzzle.size}:${puzzle.solution.join("/")}`));
    for (const puzzle of KOREAN_HARVEST_PUZZLES) {
      expect(liveFingerprints.has(`${puzzle.size}:${puzzle.solution.join("/")}`)).toBe(false);
    }
  });
});
