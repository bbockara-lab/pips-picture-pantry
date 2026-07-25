import { describe, expect, it } from "vitest";
import { puzzlePacks } from "../src/data/packs.js";
import { puzzles } from "../src/data/puzzles.js";
import { computeClues } from "../src/game/nonogram.js";
import { getNamedCompletionColor } from "../src/ui/coloredPuzzleArt.js";

describe("puzzle data", () => {
  it("keeps the first puzzle shaped like Pip instead of a hollow face", () => {
    const firstPuzzle = puzzles.find((puzzle) => puzzle.id === "pips-first-shelf-pip-face-1");

    expect(firstPuzzle?.size).toBe(5);
    expect(firstPuzzle?.solution).toEqual([
      "11011",
      "11111",
      "10101",
      "11111",
      "01110"
    ]);
  });

  it("authors completion palettes for the first three reveals", () => {
    expect(puzzles.slice(0, 3).map((puzzle) => puzzle.completionPalette)).toEqual([
      "pip-face",
      "soup-bowl",
      "golden-spoon"
    ]);
  });

  it("authors a completion palette for every first-shelf puzzle", () => {
    expect(puzzles.slice(0, 20).every((puzzle) => (
      typeof puzzle.completionPalette === "string" && puzzle.completionPalette.length > 0
    ))).toBe(true);
  });

  it("uses motif regions instead of diagonal palette cycling", () => {
    expect(getNamedCompletionColor("recipe-card", 0, 2)).toBe("#d78b4b");
    expect(getNamedCompletionColor("recipe-card", 2, 2)).toBe("#78aa72");
    expect(getNamedCompletionColor("berry-bow", 2, 2)).toBe("#8f4d63");
    expect(getNamedCompletionColor("mint-teacup", 4, 2)).toBe("#f0c45d");
    expect(getNamedCompletionColor("tiny-house", 0, 2)).toBe("#c55d4d");
    expect(getNamedCompletionColor("apple", 0, 2)).toBe("#6f9c59");
  });

  it("keeps every solution row aligned to puzzle size", () => {
    puzzles.forEach((puzzle) => {
      expect(puzzle.solution).toHaveLength(puzzle.size);
      puzzle.solution.forEach((row) => {
        expect(row).toHaveLength(puzzle.size);
        expect(row).toMatch(/^[01]+$/);
      });
    });
  });

  it("gives Apron Drawer its own twenty solved silhouettes", () => {
    const sunnySolutions = new Set(
      puzzles
        .filter((puzzle) => puzzle.packId === "sunny-spoon-sign")
        .map((puzzle) => puzzle.solution.join("/"))
    );
    const apronPuzzles = puzzles.filter((puzzle) => puzzle.packId === "apron-drawer");
    const apronSolutions = new Set(apronPuzzles.map((puzzle) => puzzle.solution.join("/")));

    expect(apronPuzzles).toHaveLength(20);
    expect(apronSolutions).toHaveLength(20);
    apronSolutions.forEach((solution) => expect(sunnySolutions.has(solution)).toBe(false));
  });

  it("starts the bakery and village stages with distinct themed silhouettes", () => {
    const openingPuzzles = puzzles.filter((puzzle) =>
      ["bakery-window", "village-pantry"].includes(puzzle.packId)
      && Number(puzzle.id.match(/-(\d+)$/)?.[1]) <= 10
    );
    const solutions = openingPuzzles.map((puzzle) => puzzle.solution.join("/"));

    expect(openingPuzzles).toHaveLength(20);
    expect(new Set(solutions)).toHaveLength(20);
    expect(openingPuzzles.find((puzzle) => puzzle.id === "bakery-window-pip-face-1")?.title)
      .toBe("Little Bakery Window");
    expect(openingPuzzles.find((puzzle) => puzzle.id === "village-pantry-pip-face-1")?.title)
      .toBe("Pantry Cottage");
  });

  it("keeps the first twenty Village Pantry pictures separate from earlier stages", () => {
    const villagePuzzles = puzzles.filter((puzzle) => puzzle.packId === "village-pantry").slice(0, 20);
    const earlierSolutions = new Set(
      puzzles
        .filter((puzzle) => ["sunny-spoon-sign", "apron-drawer", "bakery-window"].includes(puzzle.packId))
        .slice(0, 60)
        .map((puzzle) => puzzle.solution.join("/"))
    );
    const villageSolutions = villagePuzzles.map((puzzle) => puzzle.solution.join("/"));

    expect(villagePuzzles).toHaveLength(20);
    expect(new Set(villageSolutions)).toHaveLength(20);
    villageSolutions.forEach((solution) => expect(earlierSolutions.has(solution)).toBe(false));
  });

  it("keeps the first twenty Bakery Window pictures separate from the earlier shelves", () => {
    const bakeryPuzzles = puzzles.filter((puzzle) => puzzle.packId === "bakery-window").slice(0, 20);
    const earlierSolutions = new Set(
      puzzles
        .filter((puzzle) => ["sunny-spoon-sign", "apron-drawer"].includes(puzzle.packId))
        .map((puzzle) => puzzle.solution.join("/"))
    );
    const bakerySolutions = bakeryPuzzles.map((puzzle) => puzzle.solution.join("/"));

    expect(bakeryPuzzles).toHaveLength(20);
    expect(new Set(bakerySolutions)).toHaveLength(20);
    bakerySolutions.forEach((solution) => expect(earlierSolutions.has(solution)).toBe(false));
  });

  it("ships a scalable free progression catalog", () => {
    const progressionPacks = puzzlePacks.filter((pack) => pack.monetizationRole !== "future-theme-pack");
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
        .filter((pack) => pack.monetizationRole !== "future-theme-pack")
        .map((pack) => [pack.id, pack])
    );
    const progressionPuzzles = puzzles.filter((puzzle) => progressionPacksById.has(puzzle.packId));

    expect(progressionPuzzles.some((puzzle) => puzzle.size >= 10)).toBe(true);
    expect(progressionPuzzles.filter((puzzle) => puzzle.size >= 12).length).toBeGreaterThanOrEqual(93);
    progressionPuzzles.forEach((puzzle) => {
      const pack = progressionPacksById.get(puzzle.packId);
      expect(puzzle.size).toBeLessThanOrEqual(pack.size);
      if (puzzle.packId === "bakery-window") {
        expect(progressionPuzzles.filter((candidate) => candidate.packId === "bakery-window" && candidate.size === 12).length).toBeGreaterThanOrEqual(93);
      }
      if (puzzle.size > 8) {
        expect(pack.size).toBeGreaterThanOrEqual(10);
      }
    });
  });

  it("keeps each progression pack aligned to its declared max board size", () => {
    puzzlePacks
      .filter((pack) => pack.monetizationRole !== "future-theme-pack")
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

    expect(largeBoardPuzzles.length).toBeGreaterThanOrEqual(197);
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

    expect(recentReadablePuzzles.length).toBeGreaterThanOrEqual(133);
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
    const bonusPacks = puzzlePacks.filter((pack) => pack.access === "bonus-pack");
    expect(bonusPacks).toHaveLength(5);
    bonusPacks.forEach((pack) => {
      expect(pack.monetizationRole).toBe("future-theme-pack");
      expect(puzzles.filter((puzzle) => puzzle.packId === pack.id)).toHaveLength(0);
      expect(pack.id.endsWith("-plus")).toBe(true);
    });
    expect(puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait")).toHaveLength(5);
    puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait").forEach((pack) => {
      expect(pack.badge?.id).toMatch(/^badge-/);
      expect(pack.badge?.titleKey).toMatch(/^badges\./);
    });
  });
});
