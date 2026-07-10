const PALETTES = [
  ["#f8c655", "#f28b4b", "#8f5639", "#ffe9a8"],
  ["#88d7c4", "#4fae95", "#f3c35f", "#7a4e35"],
  ["#f49b91", "#e66054", "#ffd47a", "#8f5639"],
  ["#9cc7f0", "#5f97d1", "#ffe39a", "#6d5a7c"],
  ["#b7dd77", "#72aa5a", "#f8c655", "#7a4e35"],
  ["#d7b7f0", "#9b72c8", "#ffd47a", "#6b4b65"]
];

export function renderColoredPuzzleArt(puzzle, options = {}) {
  const stamp = document.createElement("div");
  const size = Number(puzzle?.size || 5);
  stamp.className = options.className || "colored-puzzle-art";
  stamp.style.setProperty("--stamp-size", size);
  stamp.setAttribute("aria-hidden", "true");

  const palette = getPuzzlePalette(puzzle);
  puzzle.solution.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      const tile = document.createElement("span");
      tile.className = cell === "1" ? "stamp-cell filled colored" : "stamp-cell";
      if (cell === "1") {
        tile.style.setProperty("--cell-color", getCellColor(palette, rowIndex, columnIndex, size));
      }
      stamp.appendChild(tile);
    });
  });

  return stamp;
}

export function getPuzzleCellColor(puzzle, rowIndex, columnIndex) {
  return getCellColor(getPuzzlePalette(puzzle), rowIndex, columnIndex, Number(puzzle?.size || 5));
}

function getPuzzlePalette(puzzle) {
  const seed = hashString(`${puzzle?.packId || ""}:${puzzle?.id || ""}:${puzzle?.title || ""}`);
  return PALETTES[seed % PALETTES.length];
}

function getCellColor(palette, rowIndex, columnIndex, size) {
  const center = (size - 1) / 2;
  const distance = Math.abs(rowIndex - center) + Math.abs(columnIndex - center);
  const ring = Math.round(distance) % palette.length;
  const shimmer = (rowIndex * 3 + columnIndex * 5) % palette.length;
  return palette[(ring + shimmer) % palette.length];
}

function hashString(value) {
  return [...String(value)].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 0);
}
