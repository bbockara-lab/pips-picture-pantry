import { puzzlePacks } from "../src/data/packs.js";
import { puzzles } from "../src/data/puzzles.js";
import { en } from "../src/i18n/en.js";
import { ko } from "../src/i18n/ko.js";
import { pathToFileURL } from "node:url";

export const LAUNCH_CATALOG_TARGET = 333;
export const LAUNCH_QUALITY_PIVOT_BUFFER = 50;

function incrementCounter(counter, key) {
  counter[key] = (counter[key] || 0) + 1;
}

function getByPath(source, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((current, segment) => current?.[segment], source);
}

function hasPuzzleCopy(dictionary, titleKey) {
  const copy = getByPath(dictionary, titleKey);
  return Boolean(copy?.title && copy?.imageName);
}

function hasReadableArtBrief(puzzle) {
  const brief = puzzle?.artReadability;
  return Boolean(
    brief
      && typeof brief.silhouette === "string"
      && brief.silhouette.trim().length >= 12
      && typeof brief.colorMood === "string"
      && brief.colorMood.trim().length >= 6
      && Array.isArray(brief.tags)
      && brief.tags.length >= 2
      && brief.tags.every((tag) => typeof tag === "string" && tag.trim())
  );
}

export function buildPuzzleCatalogReport({ puzzleList = puzzles, packList = puzzlePacks, dictionaries = { en, ko } } = {}) {
  const byAccess = {};
  const bySize = {};
  const duplicateIds = [];
  const seenIds = new Set();

  for (const puzzle of puzzleList) {
    incrementCounter(byAccess, puzzle.access);
    incrementCounter(bySize, String(puzzle.size));

    if (seenIds.has(puzzle.id)) {
      duplicateIds.push(puzzle.id);
    }
    seenIds.add(puzzle.id);
  }

  const byPack = packList.map((pack) => {
    const packPuzzles = puzzleList.filter((puzzle) => puzzle.packId === pack.id);
    const sizeCounts = {};

    for (const puzzle of packPuzzles) {
      incrementCounter(sizeCounts, String(puzzle.size));
    }

    const sizes = packPuzzles.map((puzzle) => puzzle.size);
    const largestPuzzleSize = sizes.length ? Math.max(...sizes) : 0;

    return {
      id: pack.id,
      access: pack.access,
      monetizationRole: pack.monetizationRole,
      declaredSize: pack.size || null,
      puzzleCount: packPuzzles.length,
      freeCount: packPuzzles.filter((puzzle) => puzzle.access === "free").length,
      largeBoardCount: packPuzzles.filter((puzzle) => puzzle.size >= 10).length,
      twelveByTwelveCount: packPuzzles.filter((puzzle) => puzzle.size >= 12).length,
      largestPuzzleSize,
      sizeCounts,
    };
  });

  const warningMessages = [];
  for (const pack of byPack) {
    if (pack.access !== "bonus-pack" && pack.puzzleCount === 0) {
      warningMessages.push(`${pack.id} is a playable pack with no authored puzzles`);
    }
    if (pack.declaredSize && pack.largestPuzzleSize > pack.declaredSize) {
      warningMessages.push(`${pack.id} has ${pack.largestPuzzleSize}x${pack.largestPuzzleSize} puzzles but declares ${pack.declaredSize}x${pack.declaredSize}`);
    }
  }
  for (const duplicateId of duplicateIds) {
    warningMessages.push(`duplicate puzzle id: ${duplicateId}`);
  }

  for (const puzzle of puzzleList) {
    if (puzzle.access !== "free" || puzzle.size < 10) {
      continue;
    }
    const expectedTitleKey = `puzzles.${puzzle.id}`;
    if (puzzle.titleKey !== expectedTitleKey) {
      warningMessages.push(`${puzzle.id} missing titleKey ${expectedTitleKey}`);
      continue;
    }
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      if (!hasPuzzleCopy(dictionary, puzzle.titleKey)) {
        warningMessages.push(`${puzzle.id} missing ${locale} puzzle title/imageName copy`);
      }
    }
    if (puzzle.size >= 10 && Number(puzzle.id.split("-").at(-1)) >= 40 && !hasReadableArtBrief(puzzle)) {
      warningMessages.push(`${puzzle.id} missing readable artReadability brief`);
    }
  }

  const largeBoardPuzzles = puzzleList.filter((puzzle) => puzzle.size >= 10);
  const readableLargeBoards = largeBoardPuzzles.filter(hasReadableArtBrief);

  return {
    totals: {
      puzzles: puzzleList.length,
      packs: packList.length,
      freePuzzles: byAccess.free || 0,
      largeBoards: largeBoardPuzzles.length,
      twelveByTwelveBoards: puzzleList.filter((puzzle) => puzzle.size >= 12).length,
      readableLargeBoards: readableLargeBoards.length,
    },
    launchTarget: {
      targetFreePuzzles: LAUNCH_CATALOG_TARGET,
      remainingFreePuzzles: Math.max(0, LAUNCH_CATALOG_TARGET - (byAccess.free || 0)),
      progressPercent: Math.min(100, Math.round(((byAccess.free || 0) / LAUNCH_CATALOG_TARGET) * 100)),
      shouldPrioritizePolish: (byAccess.free || 0) >= LAUNCH_CATALOG_TARGET - LAUNCH_QUALITY_PIVOT_BUFFER,
    },
    byAccess,
    bySize,
    byPack,
    warningMessages,
  };
}

export function formatPuzzleCatalogReport(report = buildPuzzleCatalogReport()) {
  const lines = [
    "Puzzle Catalog Report",
    `Total puzzles: ${report.totals.puzzles}`,
    `Free puzzles: ${report.totals.freePuzzles}`,
    `Large boards 10x10+: ${report.totals.largeBoards}`,
    `Large boards 12x12+: ${report.totals.twelveByTwelveBoards}`,
    `Readable large-board briefs: ${report.totals.readableLargeBoards}`,
    `Launch target: ${report.totals.freePuzzles}/${report.launchTarget.targetFreePuzzles} free puzzles (${report.launchTarget.progressPercent}%, ${report.launchTarget.remainingFreePuzzles} remaining)`,
    `Launch quality pivot: ${report.launchTarget.shouldPrioritizePolish ? "yes - prioritize first-session polish alongside any new puzzles" : "not yet - continue curated puzzle growth"}`,
    "",
    "By pack:",
  ];

  for (const pack of report.byPack) {
    const sizes = Object.entries(pack.sizeCounts)
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([size, count]) => `${size}x${size}:${count}`)
      .join(", ");
    lines.push(`- ${pack.id}: ${pack.puzzleCount} puzzles (${sizes || "no authored puzzles"})`);
  }

  if (report.warningMessages.length) {
    lines.push("", "Warnings:");
    for (const warning of report.warningMessages) {
      lines.push(`- ${warning}`);
    }
  }

  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = buildPuzzleCatalogReport();
  console.log(formatPuzzleCatalogReport(report));
  if (report.warningMessages.length) {
    process.exitCode = 1;
  }
}
