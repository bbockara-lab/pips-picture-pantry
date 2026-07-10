import { describe, expect, it } from "vitest";
import { puzzlePacks } from "../src/data/packs.js";
import { puzzles } from "../src/data/puzzles.js";
import { computeClues } from "../src/game/nonogram.js";

describe("puzzle data", () => {
  it("keeps every solution row aligned to puzzle size", () => {
    puzzles.forEach((puzzle) => {
      expect(puzzle.solution).toHaveLength(puzzle.size);
      puzzle.solution.forEach((row) => {
        expect(row).toHaveLength(puzzle.size);
        expect(row).toMatch(/^[01]+$/);
      });
    });
  });

  it("ships a scalable free progression catalog", () => {
    const progressionPacks = puzzlePacks.filter((pack) => pack.monetizationRole !== "paid-theme-pack");
    const progressionPuzzles = puzzles.filter((puzzle) =>
      progressionPacks.some((pack) => pack.id === puzzle.packId)
    );

    expect(progressionPuzzles.length).toBeGreaterThanOrEqual(100);
    expect(progressionPacks.length).toBeGreaterThanOrEqual(5);
    progressionPacks.forEach((pack) => {
      expect(puzzles.filter((puzzle) => puzzle.packId === pack.id).length).toBeGreaterThanOrEqual(20);
    });
  });

  it("keeps larger boards limited to larger-board progression packs", () => {
    const progressionPacksById = new Map(
      puzzlePacks
        .filter((pack) => pack.monetizationRole !== "paid-theme-pack")
        .map((pack) => [pack.id, pack])
    );
    const progressionPuzzles = puzzles.filter((puzzle) => progressionPacksById.has(puzzle.packId));

    expect(progressionPuzzles.some((puzzle) => puzzle.size >= 10)).toBe(true);
    expect(progressionPuzzles.filter((puzzle) => puzzle.size >= 12).length).toBeGreaterThanOrEqual(55);
    progressionPuzzles.forEach((puzzle) => {
      const pack = progressionPacksById.get(puzzle.packId);
      expect(puzzle.size).toBeLessThanOrEqual(pack.size);
      if (puzzle.packId === "bakery-window") {
        expect(progressionPuzzles.filter((candidate) => candidate.packId === "bakery-window" && candidate.size === 12).length).toBeGreaterThanOrEqual(53);
      }
      if (puzzle.size > 8) {
        expect(pack.size).toBeGreaterThanOrEqual(10);
      }
    });
  });

  it("keeps each progression pack aligned to its declared max board size", () => {
    puzzlePacks
      .filter((pack) => pack.monetizationRole !== "paid-theme-pack")
      .forEach((pack) => {
        const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
        const packSizes = packPuzzles.map((puzzle) => puzzle.size);
        expect(Math.max(...packSizes)).toBe(pack.size);
        expect(packSizes).toContain(pack.size);
      });
  });

  it("supports stacked multi-number column clues", () => {
    const cluePuzzle = puzzles.find((puzzle) => {
      const clues = computeClues(puzzle.solution);
      return clues.columns.some((clue) => clue.length > 1);
    });
    expect(cluePuzzle).toBeTruthy();
  });

  it("keeps large-board translated catalog metadata explicit", () => {
    const largeBoardPuzzles = puzzles.filter((puzzle) => puzzle.size >= 10 && puzzle.access === "free");

    expect(largeBoardPuzzles.length).toBeGreaterThanOrEqual(121);
    largeBoardPuzzles.forEach((puzzle) => {
      expect(puzzle.titleKey).toBe(`puzzles.${puzzle.id}`);
    });
  });

  it("keeps late-stage translated catalog metadata explicit", () => {
    const translatedVillageIds = [
      "village-pantry-flour-sack-27",
      "village-pantry-spice-rack-28",
      "village-pantry-hanging-herbs-29",
      "village-pantry-checkered-napkin-30",
      "village-pantry-candle-shelf-31",
      "village-pantry-wicker-tray-32"
    ];

    translatedVillageIds.forEach((id) => {
      const puzzle = puzzles.find((candidate) => candidate.id === id);
      expect(puzzle?.titleKey).toBe(`puzzles.${id}`);
    });
  });

  it("keeps recent readable silhouettes off fully blank board edges", () => {
    const recentReadablePuzzles = puzzles.filter((puzzle) => {
      const suffix = Number(String(puzzle.id).split("-").at(-1));
      return puzzle.access === "free" && puzzle.size >= 10 && puzzle.artReadability && suffix >= 48;
    });

    expect(recentReadablePuzzles.length).toBeGreaterThanOrEqual(57);
    recentReadablePuzzles.forEach((puzzle) => {
      expect(puzzle.solution[0]).not.toMatch(/^0+$/);
      expect(puzzle.solution[puzzle.solution.length - 1]).not.toMatch(/^0+$/);
    });
  });


  it("keeps recent readable large-board puzzle titles unique", () => {
    const recentReadablePuzzles = puzzles.filter((puzzle) => {
      const suffix = Number(String(puzzle.id).split("-").at(-1));
      return puzzle.access === "free" && puzzle.size >= 10 && puzzle.artReadability && suffix >= 48;
    });
    const titlesByName = new Map();

    recentReadablePuzzles.forEach((puzzle) => {
      const titleKey = puzzle.title.trim().toLowerCase();
      const existing = titlesByName.get(titleKey) || [];
      existing.push(puzzle.id);
      titlesByName.set(titleKey, existing);
    });

    titlesByName.forEach((ids) => {
      expect(ids).toHaveLength(1);
    });
  });

  it("keeps reward and access metadata explicit", () => {
    const supportedAccess = new Set(["free", "unlockable", "bonus-pack"]);

    puzzles.forEach((puzzle) => {
      expect(supportedAccess.has(puzzle.access)).toBe(true);
      expect(puzzle.reward).toBeGreaterThan(0);
    });

    expect(puzzles.filter((puzzle) => puzzle.access === "free").length).toBeGreaterThanOrEqual(133);
    expect(puzzlePacks.filter((pack) => pack.access === "unlockable")).toHaveLength(4);
    expect(puzzlePacks.filter((pack) => pack.access === "bonus-pack")).toHaveLength(5);
    expect(puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait")).toHaveLength(5);
    puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait").forEach((pack) => {
      expect(pack.badge?.id).toMatch(/^badge-/);
      expect(pack.badge?.titleKey).toMatch(/^badges\./);
    });
  });
});
