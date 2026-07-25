import { pathToFileURL } from "node:url";
import { puzzles } from "../src/data/puzzles.js";

function solutionSignature(puzzle) {
  return (puzzle.solution || []).join("/");
}

function getDensity(puzzle) {
  const cells = (puzzle.solution || []).join("");
  if (!cells.length) return 0;
  return [...cells].filter((cell) => cell === "1").length / cells.length;
}

function getBlankEdgeCount(puzzle) {
  const solution = puzzle.solution || [];
  if (!solution.length) return 4;
  const top = solution[0];
  const bottom = solution.at(-1);
  const left = solution.map((row) => row[0]).join("");
  const right = solution.map((row) => row.at(-1)).join("");
  return [top, right, bottom, left].filter((edge) => !edge.includes("1")).length;
}

function hasReadableBrief(puzzle) {
  const brief = puzzle.artReadability;
  return Boolean(
    brief?.silhouette?.trim()
      && brief?.colorMood?.trim()
      && Array.isArray(brief?.tags)
      && brief.tags.length >= 2
  );
}

export function buildPuzzleArtAudit({ puzzleList = puzzles, packIds = ["bakery-window", "village-pantry"] } = {}) {
  const audited = puzzleList.filter((puzzle) => packIds.includes(puzzle.packId));
  const signatureGroups = new Map();
  const titleGroups = new Map();

  for (const puzzle of audited) {
    const signature = solutionSignature(puzzle);
    const title = String(puzzle.runtimeTitle || puzzle.title || "").trim().toLowerCase();
    if (!signatureGroups.has(signature)) signatureGroups.set(signature, []);
    if (!titleGroups.has(title)) titleGroups.set(title, []);
    signatureGroups.get(signature).push(puzzle.id);
    titleGroups.get(title).push(puzzle.id);
  }

  const duplicateSolutions = [...signatureGroups.values()].filter((ids) => ids.length > 1);
  const duplicateTitles = [...titleGroups.values()].filter((ids) => ids.length > 1);
  const duplicatedIds = new Set(duplicateSolutions.flat());
  const repeatedTitleIds = new Set(duplicateTitles.flat());

  const candidates = audited.map((puzzle) => {
    const density = getDensity(puzzle);
    const blankEdges = getBlankEdgeCount(puzzle);
    const reasons = [];
    let score = 0;
    if (duplicatedIds.has(puzzle.id)) {
      score += 100;
      reasons.push("duplicate silhouette");
    }
    if (repeatedTitleIds.has(puzzle.id)) {
      score += 20;
      reasons.push("repeated title");
    }
    if (density < 0.16 || density > 0.78) {
      score += 30;
      reasons.push(`extreme density ${Math.round(density * 100)}%`);
    }
    if (blankEdges >= 2) {
      score += blankEdges * 5;
      reasons.push(`${blankEdges} blank edges`);
    }
    if (puzzle.size >= 10 && !hasReadableBrief(puzzle)) {
      score += 25;
      reasons.push("missing art brief");
    }
    return {
      id: puzzle.id,
      title: puzzle.runtimeTitle || puzzle.title,
      packId: puzzle.packId,
      size: puzzle.size,
      density,
      blankEdges,
      score,
      reasons
    };
  }).filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));

  return {
    totals: {
      puzzles: audited.length,
      duplicateSolutionGroups: duplicateSolutions.length,
      duplicateTitleGroups: duplicateTitles.length,
      candidates: candidates.length
    },
    duplicateSolutions,
    duplicateTitles,
    candidates
  };
}

export function formatPuzzleArtAudit(report = buildPuzzleArtAudit(), limit = 30) {
  const lines = [
    "Puzzle Art Quality Audit",
    `Audited puzzles: ${report.totals.puzzles}`,
    `Duplicate silhouette groups: ${report.totals.duplicateSolutionGroups}`,
    `Repeated title groups: ${report.totals.duplicateTitleGroups}`,
    `Review candidates: ${report.totals.candidates}`,
    "",
    `Top ${Math.min(limit, report.candidates.length)} candidates:`
  ];
  report.candidates.slice(0, limit).forEach((candidate, index) => {
    lines.push(`${index + 1}. ${candidate.id} (${candidate.size}x${candidate.size}) - ${candidate.reasons.join(", ")}`);
  });
  return lines.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(formatPuzzleArtAudit());
}
