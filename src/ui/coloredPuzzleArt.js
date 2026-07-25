import { getCompletionPaletteId, getPackCompletionPalette } from "../data/completionPalettes.js";

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

  puzzle.solution.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      const tile = document.createElement("span");
      const accentColor = getCompletionAccentColor(puzzle, rowIndex, columnIndex, cell);
      tile.className = cell === "1" || accentColor ? "stamp-cell filled colored" : "stamp-cell";
      if (cell === "1") {
        tile.style.setProperty("--cell-color", getPuzzleCellColor(puzzle, rowIndex, columnIndex));
      } else if (accentColor) {
        tile.style.setProperty("--cell-color", accentColor);
      }
      stamp.appendChild(tile);
    });
  });

  return stamp;
}

export function getPuzzleCellColor(puzzle, rowIndex, columnIndex) {
  const paletteId = getCompletionPaletteId(puzzle);
  if (paletteId === "pip-face") {
    if (rowIndex === 0 && (columnIndex === 0 || columnIndex === 4)) return "#8f5639";
    if (rowIndex === 2 && columnIndex === 2) return "#7a4e35";
    if (rowIndex === 3 && columnIndex === 2) return "#6c3f32";
    if (rowIndex === 4) return "#ffe0a0";
    return "#e89045";
  }
  if (paletteId === "soup-bowl") {
    return rowIndex <= 1 ? "#ef9d4c" : rowIndex === 2 ? "#f7d07b" : "#76a96b";
  }
  if (paletteId === "golden-spoon") {
    return rowIndex < 2 ? "#ffd66c" : "#d79a2e";
  }
  const namedColor = getNamedCompletionColor(paletteId, rowIndex, columnIndex);
  if (namedColor) {
    return namedColor;
  }
  const packRegionColor = getPackRegionColor(paletteId, rowIndex, columnIndex, Number(puzzle?.size || 5));
  if (packRegionColor) {
    return packRegionColor;
  }
  const packPalette = getPackCompletionPalette(paletteId);
  return getCellColor(packPalette || getPuzzlePalette(puzzle), rowIndex, columnIndex, Number(puzzle?.size || 5));
}

export function getNamedCompletionColor(paletteId, rowIndex, columnIndex) {
  if (paletteId === "recipe-card") {
    const border = rowIndex === 0 || rowIndex === 4 || columnIndex === 0 || columnIndex === 4;
    return border ? "#d78b4b" : columnIndex >= 2 ? "#78aa72" : "#f3d58a";
  }
  if (paletteId === "berry-bow") {
    return rowIndex === 2 ? "#8f4d63" : columnIndex < 2 ? "#e76f73" : "#f5a0a4";
  }
  if (paletteId === "mint-teacup") {
    if (rowIndex === 4) return "#f0c45d";
    return columnIndex === 4 ? "#6f7f68" : "#77b9a6";
  }
  if (paletteId === "honey-cookie") {
    const chip = (rowIndex + columnIndex) % 3 === 0;
    return chip ? "#8c5936" : "#d9913d";
  }
  if (paletteId === "bread-loaf") {
    return rowIndex <= 1 ? "#f3ca79" : rowIndex === 4 ? "#c9793d" : "#eaa454";
  }
  if (paletteId === "tiny-house") {
    if (rowIndex <= 1) return "#c55d4d";
    return (rowIndex === 3 && (columnIndex === 1 || columnIndex === 3)) ? "#7fa16a" : "#ed9b55";
  }
  if (paletteId === "apple") {
    return rowIndex === 0 ? "#6f9c59" : rowIndex === 4 ? "#b94343" : "#d9574f";
  }
  return "";
}

function getPackRegionColor(paletteId, rowIndex, columnIndex, size) {
  const edge = rowIndex === 0 || columnIndex === 0 || rowIndex === size - 1 || columnIndex === size - 1;
  const center = rowIndex >= Math.floor(size / 3) && rowIndex < Math.ceil(size * 2 / 3)
    && columnIndex >= Math.floor(size / 3) && columnIndex < Math.ceil(size * 2 / 3);
  if (paletteId === "sunny-sign") {
    if (edge) return "#8a5639";
    if (center) return "#65a88f";
    return rowIndex < size / 2 ? "#f2b84d" : "#e88743";
  }
  if (paletteId === "apron-drawer") {
    if (edge) return "#7b5877";
    if (center) return "#df7d68";
    return rowIndex < size / 2 ? "#e9c96f" : "#78b7a3";
  }
  if (paletteId === "bakery-window") {
    if (edge) return "#b45e4d";
    if (center) return "#f0c36d";
    return rowIndex < size / 2 ? "#739063" : "#d68a49";
  }
  if (paletteId === "village-pantry") {
    if (edge) return "#7f6250";
    if (center) return "#e7a85c";
    return rowIndex < size / 2 ? "#719a72" : "#cb704f";
  }
  return "";
}

function getCompletionAccentColor(puzzle, rowIndex, columnIndex, cell) {
  if (
    getCompletionPaletteId(puzzle) === "pip-face" &&
    cell === "0" &&
    rowIndex === 2 &&
    (columnIndex === 1 || columnIndex === 3)
  ) {
    return "#3f302c";
  }
  return "";
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
