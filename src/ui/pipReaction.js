import pipCompleteStickerUrl from "../assets/characters/pip-completion-v2.png";
import { getCompletionPaletteId } from "../data/completionPalettes.js";
import { puzzleAlbumText, puzzleImageName, puzzleTitle, t } from "../i18n/index.js";

export const FIRST_PIP_FACE_PUZZLE_ID = "pips-first-shelf-pip-face-1";

export function isFirstPipFacePuzzle(puzzle) {
  return puzzle?.id === FIRST_PIP_FACE_PUZZLE_ID;
}

export function getCompletionMessage(puzzle) {
  return t("completion.saved", {
    imageName: puzzleImageName(puzzle)
  });
}

export function renderCompletionBanner(puzzle, { onViewAlbum, onNextPuzzle, replayChallenge = false, replayResult = null } = {}) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";
  const isFirstPipFace = isFirstPipFacePuzzle(puzzle);
  if (isFirstPipFace) {
    banner.classList.add("completion-banner--first-pip-face");
  }

  const reaction = document.createElement("img");
  reaction.className = "completion-pip";
  reaction.src = pipCompleteStickerUrl;
  reaction.alt = "";

  const copy = document.createElement("div");
  copy.className = "completion-copy";

  const message = document.createElement("p");
  message.textContent = getCompletionBannerMessage(puzzle, { replayChallenge, replayResult });

  copy.appendChild(message);

  const reveal = renderSolvedReveal(puzzle);

  const actions = document.createElement("div");
  actions.className = "completion-actions";

  const albumButton = document.createElement("button");
  albumButton.type = "button";
  albumButton.className = "tool-button";
  albumButton.textContent = replayChallenge ? t("playScreen.back") : t("completion.menu");
  albumButton.addEventListener("click", () => onViewAlbum?.());

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "tool-button";
  nextButton.textContent = t("completion.nextPicture");
  nextButton.addEventListener("click", () => onNextPuzzle?.());

  actions.append(albumButton, nextButton);
  if (isFirstPipFace) {
    banner.append(copy, reveal, actions);
  } else {
    banner.append(reaction, copy, reveal, actions);
  }
  return banner;
}

function getCompletionBannerMessage(puzzle, options = {}) {
  if (!options.replayChallenge) {
    return getCompletionMessage(puzzle);
  }
  if (options.replayResult?.rewardAllowed) {
    return t("completion.replayReward", { count: options.replayResult.reward || 0 });
  }
  return t("completion.replayNoReward");
}

function renderSolvedReveal(puzzle) {
  const card = document.createElement("div");
  card.className = "completion-reveal-card";
  const isFirstPipFace = isFirstPipFacePuzzle(puzzle);
  if (isFirstPipFace) {
    card.classList.add("completion-reveal-card--pip-face");
  }

  const reveal = document.createElement("div");
  reveal.className = "completion-reveal";
  const paletteId = getCompletionPaletteId(puzzle);
  if (paletteId) {
    reveal.classList.add(`completion-reveal--${paletteId}`);
  }
  if (isFirstPipFace) {
    reveal.classList.add("completion-reveal--pip-face");
  }
  reveal.setAttribute("aria-label", puzzleImageName(puzzle));
  reveal.style.setProperty("--reveal-size", puzzle.size);

  puzzle.solution.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      const tile = document.createElement("span");
      tile.className = cell === "1" ? "reveal-cell filled" : "reveal-cell";
      tile.dataset.row = String(rowIndex);
      tile.dataset.column = String(columnIndex);
      reveal.appendChild(tile);
    });
  });

  if (isFirstPipFace) {
    const character = document.createElement("img");
    character.className = "completion-reveal__character";
    character.src = pipCompleteStickerUrl;
    character.alt = puzzleImageName(puzzle);
    card.append(character, reveal);
  } else {
    card.appendChild(reveal);
  }
  return card;
}
