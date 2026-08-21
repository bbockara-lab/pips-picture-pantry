import { moveCursor, paintCells, setMode, toggleCursorCell } from "../game/puzzleState.js";
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

export function createCursorControlSession(state = {}) {
  return {
    trailEnabled: true,
    brushMode: state.mode === "mark" ? "mark" : "fill"
  };
}

export function renderCursorControls(state, puzzle, update, options = {}) {
  const session = options.session || createCursorControlSession(state);
  const getState = options.getState || (() => state);
  const redraw = options.redraw || (() => {});
  const compact = Number(puzzle.size || 0) >= 8;
  const controls = document.createElement("section");
  controls.className = compact ? "cursor-controls cursor-controls--compact" : "cursor-controls";
  controls.setAttribute("aria-label", t("controls.cursorPanel"));

  const dpad = document.createElement("div");
  dpad.className = "cursor-dpad";
  dpad.append(
    createCursorMoveButton("up", "\u2191", t("controls.cursorUp"), () => moveSelectedCell(getState(), -1, 0, puzzle.size, update, session)),
    createCursorMoveButton("left", "\u2190", t("controls.cursorLeft"), () => moveSelectedCell(getState(), 0, -1, puzzle.size, update, session)),
    createCursorMoveButton("right", "\u2192", t("controls.cursorRight"), () => moveSelectedCell(getState(), 0, 1, puzzle.size, update, session)),
    createCursorMoveButton("down", "\u2193", t("controls.cursorDown"), () => moveSelectedCell(getState(), 1, 0, puzzle.size, update, session))
  );

  const actions = document.createElement("div");
  actions.className = "cursor-actions";
  const actionLabels = session.trailEnabled ? getTrailActionDescriptors(session) : getCursorActionDescriptors(state);
  actions.append(
    createCursorActionButton(actionLabels.fill, () => applyCursorAction(getState(), "fill", update, session), session.brushMode === "fill" && session.trailEnabled),
    createCursorActionButton(actionLabels.mark, () => applyCursorAction(getState(), "mark", update, session), session.brushMode === "mark" && session.trailEnabled)
  );

  const trailToggle = document.createElement("button");
  trailToggle.type = "button";
  trailToggle.className = "cursor-trail-toggle";
  trailToggle.classList.toggle("is-active", session.trailEnabled);
  trailToggle.textContent = t(session.trailEnabled ? "controls.cursorTrailOn" : "controls.cursorTrailOff");
  trailToggle.setAttribute("aria-pressed", String(session.trailEnabled));
  trailToggle.addEventListener("click", () => {
    session.trailEnabled = !session.trailEnabled;
    redraw();
  });
  actions.appendChild(trailToggle);

  const body = document.createElement("div");
  body.className = "cursor-controls__body";
  body.append(dpad, actions);

  // The highlighted square is the useful position indicator. A second
  // Row/Column plus state report duplicated it and made the board feel busy.
  controls.append(body);
  return controls;
}

export function moveSelectedCell(state, rowDelta, columnDelta, size, update, session = null) {
  const priorCursor = state.cursor || { row: 0, column: 0 };
  const movedState = moveCursor(state, rowDelta, columnDelta, size);
  if (movedState.cursor.row === priorCursor.row && movedState.cursor.column === priorCursor.column) return;
  playCursorMove();
  if (session?.trailEnabled) {
    const mode = session.brushMode || "fill";
    const value = mode === "mark" ? CELL.marked : CELL.filled;
    const nextState = setMode(movedState, mode);
    update(paintCells(nextState, [{ row: nextState.cursor.row, column: nextState.cursor.column }], value));
    return;
  }
  update(movedState);
}

export function toggleSelectedCell(state, mode, update) {
  playCursorAction();
  update(toggleCursorCell(state, mode));
}

export function applyCursorAction(state, mode, update, session = null) {
  if (!session?.trailEnabled) {
    toggleSelectedCell(state, mode, update);
    return;
  }
  session.brushMode = mode;
  const value = mode === "mark" ? CELL.marked : CELL.filled;
  const nextState = setMode(state, mode);
  playCursorAction();
  update(paintCells(nextState, [{ row: nextState.cursor.row, column: nextState.cursor.column }], value));
}

function createCursorMoveButton(position, label, ariaLabel, onMove) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-move cursor-move--" + position;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  let holdTimer = null;
  let repeatTimer = null;
  const stop = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  };
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    stop();
    onMove();
    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(onMove, 105);
    }, 320);
    document.addEventListener("pointerup", stop, { once: true });
    document.addEventListener("pointercancel", stop, { once: true });
  });
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !event.repeat) onMove();
  });
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

function getTrailActionDescriptors(session) {
  return {
    fill: { label: t("controls.cursorFill"), intent: "fill" },
    mark: { label: t("controls.cursorMark"), intent: "mark" }
  };
}

function createCursorActionButton(action, onClick, active = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-action-button cursor-action-button--" + action.intent;
  button.classList.toggle("is-active", active);
  button.setAttribute("aria-pressed", String(active));
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
