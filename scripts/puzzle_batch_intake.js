import { puzzlePacks } from "../src/data/packs.js";
import { en } from "../src/i18n/en.js";
import { ko } from "../src/i18n/ko.js";

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

export function validatePuzzleBatch({
  candidates = [],
  existingPuzzles = [],
  packList = puzzlePacks,
  dictionaries = { en, ko }
} = {}) {
  const errors = [];
  const existingIds = new Set(existingPuzzles.map((puzzle) => puzzle.id));
  const seenCandidateIds = new Set();
  const packsById = new Map(packList.map((pack) => [pack.id, pack]));

  for (const puzzle of candidates) {
    const label = puzzle?.id || "(missing id)";
    const pack = packsById.get(puzzle?.packId);

    if (!puzzle?.id) {
      errors.push("candidate missing id");
      continue;
    }
    if (existingIds.has(puzzle.id)) {
      errors.push(`${label} duplicates an existing puzzle id`);
    }
    if (seenCandidateIds.has(puzzle.id)) {
      errors.push(`${label} duplicates another candidate id`);
    }
    seenCandidateIds.add(puzzle.id);

    if (!pack) {
      errors.push(`${label} references unknown pack ${puzzle.packId}`);
    } else if (pack.size && puzzle.size > pack.size) {
      errors.push(`${label} is ${puzzle.size}x${puzzle.size} but pack ${pack.id} allows ${pack.size}x${pack.size}`);
    }

    if (!Number.isInteger(puzzle.size) || puzzle.size <= 0) {
      errors.push(`${label} has invalid size ${puzzle.size}`);
      continue;
    }
    if (!Array.isArray(puzzle.solution) || puzzle.solution.length !== puzzle.size) {
      errors.push(`${label} solution should have ${puzzle.size} rows`);
    } else {
      puzzle.solution.forEach((row, index) => {
        if (typeof row !== "string" || row.length !== puzzle.size || !/^[01]+$/.test(row)) {
          errors.push(`${label} row ${index + 1} should be ${puzzle.size} binary cells`);
        }
      });
    }

    if (puzzle.size >= 10 && puzzle.access === "free") {
      const expectedTitleKey = `puzzles.${puzzle.id}`;
      if (puzzle.titleKey !== expectedTitleKey) {
        errors.push(`${label} titleKey should be ${expectedTitleKey}`);
      }
      for (const [locale, dictionary] of Object.entries(dictionaries)) {
        if (!hasPuzzleCopy(dictionary, expectedTitleKey)) {
          errors.push(`${label} missing ${locale} title/imageName copy`);
        }
      }
      if (!hasReadableArtBrief(puzzle)) {
        errors.push(`${label} missing readable artReadability brief`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    candidateCount: candidates.length
  };
}

export function formatPuzzleBatchValidation(result) {
  const lines = [`Puzzle Batch Intake: ${result.ok ? "passed" : "failed"}`, `Candidates: ${result.candidateCount}`];
  if (result.errors.length) {
    lines.push("", "Errors:");
    result.errors.forEach((error) => lines.push(`- ${error}`));
  }
  return lines.join("\n");
}
