import { readFileSync } from "node:fs";
import { describe, expect, it, afterEach } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { createPuzzleState, setCursor, toggleCell } from "../src/game/puzzleState.js";
import { setActiveLocale, t } from "../src/i18n/index.js";
import {
  applyCursorAction,
  createCursorControlSession,
  getCursorActionDescriptors,
  getCursorActionLabels,
  getSelectedCursorCell,
  moveSelectedCell,
  shouldShowCursorControls,
  shouldUseCompactCursorLayout
} from "../src/ui/puzzleCursorControls.js";

const puzzle = { id: "cursor-label-puzzle", size: 3 };
const cursorControlsSource = readFileSync("src/ui/puzzleCursorControls.js", "utf8");
const stylesSource = readFileSync("src/styles.css", "utf8");

describe("cursor control action labels", () => {
  afterEach(() => {
    setActiveLocale("en");
  });

  it("labels an empty selected cell as color or blank check", () => {
    const state = createPuzzleState(puzzle);

    expect(getSelectedCursorCell(state)).toBe(CELL.empty);
    expect(getCursorActionLabels(state)).toEqual({ fill: "Color", mark: "Blank" });
    expect(getCursorActionDescriptors(state).fill.intent).toBe("fill");
    expect(getCursorActionDescriptors(state).mark.intent).toBe("mark");
  });

  it("labels a filled selected cell as a clear-color action", () => {
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 0, 0, "fill");

    expect(getSelectedCursorCell(state)).toBe(CELL.filled);
    expect(getCursorActionLabels(state).fill).toBe("Clear Color");
    expect(getCursorActionDescriptors(state).fill.intent).toBe("clear-fill");
  });

  it("labels a marked selected cell as a clear-X action", () => {
    let state = createPuzzleState(puzzle);
    state = setCursor(state, 1, 1, puzzle.size);
    state = toggleCell(state, 1, 1, "mark");

    expect(getSelectedCursorCell(state)).toBe(CELL.marked);
    expect(getCursorActionLabels(state).mark).toBe("Clear X");
    expect(getCursorActionDescriptors(state).mark.intent).toBe("clear-mark");
  });

  it("keeps Korean clear-action labels readable", () => {
    setActiveLocale("ko");
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 0, 0, "fill");

    expect(getCursorActionLabels(state).fill).toBe("\uc0c9 \uc9c0\uc6b0\uae30");
  });
});

describe("automatic large-board controls", () => {
  it("keeps 5×5 direct and enables the D-pad from 8×8", () => {
    expect(shouldShowCursorControls({ size: 5 }, "auto")).toBe(false);
    expect(shouldShowCursorControls({ size: 8 }, "auto")).toBe(true);
    expect(shouldShowCursorControls({ size: 12 }, "auto")).toBe(true);
  });

  it("respects explicit tap and cursor preferences", () => {
    expect(shouldShowCursorControls({ size: 12 }, "direct")).toBe(false);
    expect(shouldShowCursorControls({ size: 5 }, "cursor")).toBe(false);
    expect(shouldShowCursorControls({ size: 5 }, "cursor", true)).toBe(true);
  });

  it("introduces Time Attack cursor controls at 8×8 even when already unlocked", () => {
    expect(shouldShowCursorControls({ size: 5 }, "cursor", true, { isTimeAttack: true })).toBe(false);
    expect(shouldShowCursorControls({ size: 8 }, "auto", false, { isTimeAttack: true })).toBe(true);
  });
});

describe("cursor control layout", () => {
  it("uses the balanced compact arrangement for unlocked 5×5 boards and larger", () => {
    expect(shouldUseCompactCursorLayout({ size: 5 })).toBe(true);
    expect(shouldUseCompactCursorLayout({ size: 8 })).toBe(true);
  });

  it("uses the same player-facing names as Settings", () => {
    setActiveLocale("ko");
    expect(t("settings.controlsDirectShort")).toBe("칸 직접 누르기");
    expect(t("settings.controlsCursorShort")).toBe("방향키 사용");
  });
});

describe("continuous cursor painting", () => {
  it("starts enabled without rendering an in-puzzle Trail Paint toggle", () => {
    expect(createCursorControlSession({}).trailEnabled).toBe(true);
    expect(createCursorControlSession({}, false).trailEnabled).toBe(false);
    expect(cursorControlsSource).not.toContain('className = "cursor-trail-toggle"');
  });

  it("keeps quick direction taps move-only and paints only explicit held repeats", () => {
    let state = createPuzzleState(puzzle);
    const session = createCursorControlSession(state);
    const update = (next) => {
      state = next;
    };

    applyCursorAction(state, "fill", update, session);
    moveSelectedCell(state, 0, 1, puzzle.size, update, session);
    expect(state.cells[0][1]).toBe(CELL.empty);

    moveSelectedCell(state, 1, 0, puzzle.size, update, session, { paintTrail: true });

    expect(state.cells[0][0]).toBe(CELL.filled);
    expect(state.cells[0][1]).toBe(CELL.empty);
    expect(state.cells[1][1]).toBe(CELL.filled);

    applyCursorAction(state, "mark", update, session);
    moveSelectedCell(state, 0, 1, puzzle.size, update, session, { paintTrail: true });
    expect(state.cells[1][2]).toBe(CELL.marked);

    session.trailEnabled = false;
    moveSelectedCell(state, 1, 0, puzzle.size, update, session);
    expect(state.cursor).toEqual({ row: 2, column: 2 });
    expect(state.cells[2][2]).toBe(CELL.empty);
  });

  it("owns long-press pointer input without triggering browser text selection", () => {
    expect(cursorControlsSource).toContain("button.setPointerCapture?.(event.pointerId)");
    expect(cursorControlsSource).toContain('button.addEventListener("lostpointercapture", stop)');
    expect(cursorControlsSource).toContain('button.addEventListener("contextmenu", (event) => event.preventDefault())');
    expect(cursorControlsSource).toContain('button.addEventListener("selectstart", (event) => event.preventDefault())');
    expect(cursorControlsSource).toContain("const shouldMoveOnce = commitTap && activePointerId !== null && !holdActivated");
    expect(cursorControlsSource).toContain("repeatTimer = setInterval(isTrailEnabled() ? onTrailMove : onMove, 105)");
    expect(stylesSource).toMatch(/v0\.1\.718[\s\S]*?-webkit-user-select:\s*none;[\s\S]*?-webkit-touch-callout:\s*none;[\s\S]*?\.app-shell--play \.cursor-move\s*\{[\s\S]*?touch-action:\s*none;/);
  });
});


