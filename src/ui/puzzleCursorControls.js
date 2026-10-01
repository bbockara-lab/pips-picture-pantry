import { moveCursor, paintCells, setMode, toggleCursorCell } from "../game/puzzleState.js";
import { CELL } from "../game/nonogram.js";
import { t } from "../i18n/index.js";
import { playCursorAction, playCursorMove } from "./audio.js";
import { appendPuzzleControlArt } from "./puzzleControlArt.js";

export function shouldShowCursorControls(puzzle, controlMode, cursorControlsUnlocked = false, options = {}) {
  if (options.isTimeAttack && Number(puzzle.size) < 8) {
    return false;
  }
  if (controlMode === "direct") {
    return false;
  }
  if (controlMode === "cursor") {
    return Number(puzzle.size) >= 8 || cursorControlsUnlocked;
  }
  return Number(puzzle.size) >= 8;
}

export function createCursorControlSession(state = {}, trailEnabled = true) {
  return {
    trailEnabled: Boolean(trailEnabled),
    brushMode: state.mode === "mark" ? "mark" : "fill"
  };
}

export function shouldUseCompactCursorLayout(puzzle) {
  return Number(puzzle?.size || 0) >= 5;
}

export function renderCursorControls(state, puzzle, update, options = {}) {
  const session = options.session || createCursorControlSession(state);
  const getState = options.getState || (() => state);
  const redraw = options.redraw || (() => {});
  const compact = shouldUseCompactCursorLayout(puzzle);
  const controls = document.createElement("section");
  controls.className = compact ? "cursor-controls cursor-controls--compact" : "cursor-controls";
  controls.setAttribute("aria-label", t("controls.cursorPanel"));

  const dpad = document.createElement("div");
  dpad.className = "cursor-dpad";
  const createMoveControl = (position, label, ariaLabel, rowDelta, columnDelta) => createCursorMoveButton(
    position,
    label,
    ariaLabel,
    () => moveSelectedCell(getState(), rowDelta, columnDelta, puzzle.size, update, session),
    () => moveSelectedCell(getState(), rowDelta, columnDelta, puzzle.size, update, session, { paintTrail: true }),
    () => session.trailEnabled
  );
  dpad.append(
    createMoveControl("up", "\u2191", t("controls.cursorUp"), -1, 0),
    createMoveControl("left", "\u2190", t("controls.cursorLeft"), 0, -1),
    createMoveControl("right", "\u2192", t("controls.cursorRight"), 0, 1),
    createMoveControl("down", "\u2193", t("controls.cursorDown"), 1, 0)
  );

  const actions = document.createElement("div");
  actions.className = "cursor-actions";
  const actionLabels = session.trailEnabled ? getTrailActionDescriptors(session) : getCursorActionDescriptors(state);
  actions.append(
    createCursorActionButton(actionLabels.fill, () => applyCursorAction(getState(), "fill", update, session), session.brushMode === "fill" && session.trailEnabled),
    createCursorActionButton(actionLabels.mark, () => applyCursorAction(getState(), "mark", update, session), session.brushMode === "mark" && session.trailEnabled)
  );
  if (options.controlModeToggle) {
    actions.appendChild(options.controlModeToggle);
  }

  const body = document.createElement("div");
  body.className = "cursor-controls__body";
  body.append(dpad, actions);

  // The highlighted square is the useful position indicator. A second
  // Row/Column plus state report duplicated it and made the board feel busy.
  controls.append(body);
  return controls;
}

export function moveSelectedCell(state, rowDelta, columnDelta, size, update, session = null, options = {}) {
  const priorCursor = state.cursor || { row: 0, column: 0 };
  const movedState = moveCursor(state, rowDelta, columnDelta, size);
  if (movedState.cursor.row === priorCursor.row && movedState.cursor.column === priorCursor.column) return;
  if (session?.trailEnabled && options.paintTrail) {
    const mode = session.brushMode || "fill";
    playCursorAction(mode, { trail: true });
    const value = mode === "mark" ? CELL.marked : CELL.filled;
    const nextState = setMode(movedState, mode);
    update(paintCells(nextState, [{ row: nextState.cursor.row, column: nextState.cursor.column }], value));
    return;
  }
  playCursorMove();
  update(movedState);
}

export function toggleSelectedCell(state, mode, update) {
  playCursorAction(mode);
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
  playCursorAction(mode);
  update(paintCells(nextState, [{ row: nextState.cursor.row, column: nextState.cursor.column }], value));
}

function createCursorMoveButton(position, label, ariaLabel, onMove, onTrailMove, isTrailEnabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cursor-move cursor-move--" + position;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  let holdTimer = null;
  let repeatTimer = null;
  let activePointerId = null;
  let holdActivated = false;
  const stop = (commitTap = false) => {
    const shouldMoveOnce = commitTap && activePointerId !== null && !holdActivated;
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    document.removeEventListener("pointerup", finishTap);
    document.removeEventListener("pointercancel", stop);
    if (activePointerId !== null && button.hasPointerCapture?.(activePointerId)) {
      button.releasePointerCapture(activePointerId);
    }
    holdTimer = null;
    repeatTimer = null;
    activePointerId = null;
    holdActivated = false;
    if (shouldMoveOnce) onMove();
  };
  const finishTap = () => stop(true);
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    stop();
    activePointerId = event.pointerId;
    button.setPointerCapture?.(event.pointerId);
    // Delay the single move until release so a deliberate hold can take the
    // separate trail-paint path without painting an ordinary navigation tap.
    holdTimer = setTimeout(() => {
      holdActivated = true;
      repeatTimer = setInterval(isTrailEnabled() ? onTrailMove : onMove, 105);
    }, 320);
    document.addEventListener("pointerup", finishTap);
    document.addEventListener("pointercancel", stop);
  });
  button.addEventListener("pointerup", finishTap);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("lostpointercapture", stop);
  button.addEventListener("contextmenu", (event) => event.preventDefault());
  button.addEventListener("selectstart", (event) => event.preventDefault());
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
