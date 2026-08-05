import { moveCursor, toggleCursorCell } from "../game/puzzleState.js";
import { CELL } from "../game/nonogram.js";
import { t } from "../i18n/index.js";
import { playCursorAction, playCursorMove } from "./audio.js";
import { appendPuzzleControlArt } from "./puzzleControlArt.js";

export function shouldShowCursorControls(puzzle, controlMode) {
  if (controlMode === "direct") {
    return false;
  }
  if (controlMode === "cursor") {
    return true;
  }
  return Number(puzzle.size) >= 8;
}

export function renderCursorControls(state, puzzle, update) {
  const compact = Number(puzzle.size || 0) >= 8;
  const controls = document.createElement("section");
  controls.className = compact ? "cursor-controls cursor-controls--compact" : "cursor-controls";
  controls.setAttribute("aria-label", t("controls.cursorPanel"));

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
  const actionLabels = getCursorActionDescriptors(state);
  actions.append(
    createCursorActionButton(actionLabels.fill, () => toggleSelectedCell(state, "fill", update)),
    createCursorActionButton(actionLabels.mark, () => toggleSelectedCell(state, "mark", update))
  );

  const body = document.createElement("div");
  body.className = "cursor-controls__body";
  body.append(dpad, actions);

  // The highlighted square is the useful position indicator. A second
  // Row/Column plus state report duplicated it and made the board feel busy.
  controls.append(body);
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

export function getSelectedCursorCell(state) {
  const cursor = state.cursor || { row: 0, column: 0 };
  return state.cells?.[cursor.row]?.[cursor.column] || CELL.empty;
}

export function getCursorActionLabels(state) {
  const descriptors = getCursorActionDescriptors(state);
  return {
    fill: descriptors.fill.label,
    mark: descriptors.mark.label
  };
}

export function getCursorActionDescriptors(state) {
  const value = getSelectedCursorCell(state);
  return {
    fill: value === CELL.filled
      ? { label: t("controls.cursorClearFill"), intent: "clear-fill" }
      : { label: t("controls.cursorFill"), intent: "fill" },
    mark: value === CELL.marked
      ? { label: t("controls.cursorClearMark"), intent: "clear-mark" }
      : { label: t("controls.cursorMark"), intent: "mark" }
  };
}

function createCursorActionButton(action, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-action-button cursor-action-button--" + action.intent;
  appendPuzzleControlArt(
    button,
    action.intent === "mark" || action.intent === "clear-mark" ? "mark" : "fill",
    "cursor-action-button__art"
  );
  const label = document.createElement("span");
  label.className = "cursor-action-button__label";
  label.textContent = action.label;
  button.appendChild(label);
  button.setAttribute("aria-label", action.label);
  button.addEventListener("click", onClick);
  return button;
}
