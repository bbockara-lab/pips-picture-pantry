import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCompletionRewardRows, isFirstPipFacePuzzle, isReplayExhausted } from "../src/ui/pipReaction.js";

const pipReactionSource = readFileSync("src/ui/pipReaction.js", "utf8");
const stylesSource = readFileSync("src/styles.css", "utf8");

describe("Pip completion scene", () => {
  it("reserves the first-completion scene for the first Pip puzzle id", () => {
    expect(isFirstPipFacePuzzle({
      id: "pips-first-shelf-pip-face-1",
      completionPalette: "pip-face"
    })).toBe(true);
    expect(isFirstPipFacePuzzle({
      id: "pips-first-shelf-pip-face-2-11",
      completionPalette: "pip-face"
    })).toBe(false);
  });

  it("switches only the exhausted replay completion to the spoon-run action", () => {
    expect(pipReactionSource).toContain("actions.append(actionButton)");
    expect(pipReactionSource).not.toContain("albumButton");
    expect(pipReactionSource).not.toContain("onViewAlbum");
    expect(pipReactionSource).not.toContain('t("completion.menu")');
    expect(pipReactionSource).not.toMatch(/replayChallenge\s*\?\s*t\("playScreen\.back"\)/);
    expect(pipReactionSource).toContain("remaining: options.replayResult.remaining || 0");
  });

  it("exhausts replays only after a rewarded completion uses the final daily slot", () => {
    expect(isReplayExhausted(true, { rewardAllowed: true, remaining: 0 })).toBe(true);
    expect(isReplayExhausted(true, { rewardAllowed: false, remaining: 0 })).toBe(false);
    expect(isReplayExhausted(true, { rewardAllowed: true, remaining: 1 })).toBe(false);
    expect(isReplayExhausted(false, { rewardAllowed: true, remaining: 0 })).toBe(false);
    expect(pipReactionSource).toContain('? "completion.backToSpoonRun"');
    expect(pipReactionSource).toContain('? "completion.confirm"');
    expect(pipReactionSource).toContain('return t("completion.replayExhausted")');
  });
  it("returns Daily completion to Spoon Run with one confirmation action", () => {
    expect(pipReactionSource).toContain("replayExhausted || isDailyPuzzle");
    expect(pipReactionSource).toContain('return t("completion.dailyDone")');
    expect(pipReactionSource).toContain('? "completion.confirm"');
    expect(pipReactionSource).toContain(': "completion.nextPicture"');
  });
  it("centers the single completion action in a bounded one-column layout", () => {
    expect(stylesSource).toMatch(
      /\.completion-actions\s*\{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?max-width:\s*320px;[\s\S]*?margin-left:\s*auto;[\s\S]*?margin-right:\s*auto;/
    );
  });

  it("keeps puzzle, Daily, and shelf rewards as separate positive rows", () => {
    expect(getCompletionRewardRows({ puzzleReward: 3, dailyBonus: 8, stageBonus: 80 })).toEqual([
      { key: "completion.puzzleReward", count: 3 },
      { key: "completion.dailyBonus", count: 8 },
      { key: "completion.stageBonus", count: 80 }
    ]);
    expect(getCompletionRewardRows({ puzzleReward: 3, dailyBonus: 0, stageBonus: 0 })).toEqual([
      { key: "completion.puzzleReward", count: 3 }
    ]);
  });
});
