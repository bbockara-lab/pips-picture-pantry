import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds } from "../game/save.js";

export function renderAlbumView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const section = document.createElement("section");
  section.className = "album-panel";

  const completedCount = completedIds.size;
  section.innerHTML = `
    <div class="album-header">
      <div>
        <p class="section-label">Pantry Album</p>
        <h2>${completedCount}/${puzzles.length} pictures</h2>
      </div>
      <p class="album-note">Pip keeps finished cards here.</p>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "album-grid";

  puzzles.forEach((puzzle) => {
    const isComplete = completedIds.has(puzzle.id);
    const card = document.createElement("article");
    card.className = isComplete ? "album-card complete" : "album-card locked";
    card.innerHTML = `
      <div class="album-stamp" aria-hidden="true">${isComplete ? getStampPattern(puzzle) : "?"}</div>
      <div>
        <h3>${isComplete ? puzzle.reward.imageName : "Hidden picture"}</h3>
        <p>${isComplete ? puzzle.reward.albumText : "Finish the puzzle to save this card."}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function getStampPattern(puzzle) {
  if (puzzle.id.includes("soup")) return "bowl";
  if (puzzle.id.includes("spoon")) return "spoon";
  if (puzzle.id.includes("bow")) return "bow";
  if (puzzle.id.includes("card")) return "card";
  if (puzzle.id.includes("window")) return "win";
  if (puzzle.id.includes("jar")) return "jar";
  return "pip";
}
