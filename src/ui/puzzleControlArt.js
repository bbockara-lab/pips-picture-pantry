import { getPuzzleControlArt } from "../data/puzzleControlArt.js";

export function createPuzzleControlArtImage(control, className = "") {
  const art = getPuzzleControlArt(control);
  if (!art) {
    return null;
  }

  const image = document.createElement("img");
  image.src = art.src;
  image.alt = "";
  image.dataset.assetId = art.assetId;
  if (className) {
    image.className = className;
  }
  return image;
}

export function appendPuzzleControlArt(parent, control, className = "") {
  const image = createPuzzleControlArtImage(control, className);
  if (image) {
    parent.appendChild(image);
  }
  return image;
}
