import { puzzleText, t } from "../i18n/index.js";

export function getCompletionMessage(puzzle) {
  return t("completion.saved", {
    imageName: puzzleText(puzzle.id, "imageName")
  });
}

export function renderCompletionBanner(puzzle, { onViewAlbum, onNextPuzzle } = {}) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";

  const spark = document.createElement("span");
  spark.className = "spark";
  spark.textContent = "+";

  const message = document.createElement("p");
  message.textContent = getCompletionMessage(puzzle);

  const actions = document.createElement("div");
  actions.className = "completion-actions";

  const albumButton = document.createElement("button");
  albumButton.type = "button";
  albumButton.className = "tool-button";
  albumButton.textContent = t("completion.viewAlbum");
  albumButton.addEventListener("click", () => onViewAlbum?.());

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "tool-button";
  nextButton.textContent = t("completion.nextPicture");
  nextButton.addEventListener("click", () => onNextPuzzle?.());

  actions.append(albumButton, nextButton);
  banner.append(spark, message, actions);
  return banner;
}
