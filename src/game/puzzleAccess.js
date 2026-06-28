export function isPuzzleUnlocked(puzzle, completedPuzzleIds = []) {
  if (!puzzle || puzzle.access !== "unlockable") {
    return true;
  }

  const requirement = puzzle.unlockRequirement;
  if (!requirement) {
    return true;
  }

  if (requirement.type === "completed-count") {
    return getCompletedCount(completedPuzzleIds) >= requirement.count;
  }

  return true;
}

export function getUnlockRequirementProgress(puzzle, completedPuzzleIds = []) {
  const requirement = puzzle?.unlockRequirement;
  if (!requirement || requirement.type !== "completed-count") {
    return null;
  }

  const completed = getCompletedCount(completedPuzzleIds);
  return {
    type: requirement.type,
    completed,
    required: requirement.count,
    remaining: Math.max(0, requirement.count - completed)
  };
}

function getCompletedCount(completedPuzzleIds) {
  return new Set(completedPuzzleIds).size;
}