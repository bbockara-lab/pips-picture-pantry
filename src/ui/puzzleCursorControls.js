import { moveCursor, toggleCursorCell } from "../game/puzzleState.js";
import { t } from "../i18n/index.js";
import { playCursorAction, playCursorMove } from "./audio.js";

export function shouldShowCursorControls(puzzle, controlMode) {
  if (controlMode === "direct") {
    return false;
  }
  if (controlMode === "cursor") {
    return true;
  }
  return Number(puzzle.size) >= 10;
}

export function renderCursorControls(state, puzzle, update) {
  const controls = document.createElement("section");
  controls.className = "cursor-controls";
  controls.setAttribute("aria-label", t("controls.cursorPanel"));

  const hint = document.createElement("p");
  hint.className = "cursor-controls__hint";
  hint.textContent = t("controls.cursorHint");

  const position = document.createElement("p");
  position.className = "cursor-controls__position";
  position.textContent = t("controls.cursorPosition", {
    row: Math.max(1, Number(state.cursor?.row || 0) + 1),
    column: Math.max(1, Number(state.cursor?.column || 0) + 1)
  });

  const lineHint = document.createElement("p");
  lineHint.className = "cursor-controls__hint cursor-controls__hint--secondary";
  lineHint.textContent = t("controls.lineCompleteHint");

  const dpad = document.createElement("div");
  dpad.className = "cursor-dpad";
  dpad.append(
    createCursorMoveButton("up", "\u2191", t("controls.cursorUp"), () => moveSelectedCell(state, -1, 0, puzzle.size, update)),
    createCursorMoveButton("left", "\u2190", t("controls.cursorLeft"), () => moveSelectedCell(state, 0, -1, puzzle.size, update)),
    createCursorMoveButton("right", "\u2192", t("controls.cursorRight"), () => moveSelectedCell(state, 0, 1, puzzle.size, update)),
    createCursorMoveButton("down", "\u2193", t("controls.cursorDown"), () => moveSelectedCell(state, 1, 0, puzzle.size, update))
  );

  const actions = document.createElement("div");
  actions.className = "cursor-actions";
  actions.append(
    createCursorActionButton(t("controls.cursorFill"), () => toggleSelectedCell(state, "fill", update)),
    createCursorActionButton(t("controls.cursorMark"), () => toggleSelectedCell(state, "mark", update))
  );

  const body = document.createElement("div");
  body.className = "cursor-controls__body";
  body.append(dpad, actions);

  controls.append(hint, position, lineHint, body);
  return controls;
}

export function moveSelectedCell(state, rowDelta, columnDelta, size, update) {
  playCursorMove();
  update(moveCursor(state, rowDelta, columnDelta, size));
}

export function toggleSelectedCell(state, mode, update) {
  playCursorAction();
  update(toggleCursorCell(state, mode));
}

function createCursorMoveButton(position, label, ariaLabel, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-move cursor-move--" + position;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.addEventListener("click", onClick);
  return button;
}

function createCursorActionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-action-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}
