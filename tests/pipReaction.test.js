import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isFirstPipFacePuzzle } from "../src/ui/pipReaction.js";

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

  it("offers only the next-picture action for standard and replay completions", () => {
    expect(pipReactionSource).toContain("actions.append(nextButton)");
    expect(pipReactionSource).not.toContain("albumButton");
    expect(pipReactionSource).not.toContain("onViewAlbum");
    expect(pipReactionSource).not.toContain('t("completion.menu")');
    expect(pipReactionSource).not.toMatch(/replayChallenge\s*\?\s*t\("playScreen\.back"\)/);
    expect(pipReactionSource).toContain("remaining: options.replayResult.remaining || 0");
  });

  it("centers the single completion action in a bounded one-column layout", () => {
    expect(stylesSource).toMatch(
      /\.completion-actions\s*\{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?max-width:\s*320px;[\s\S]*?margin-left:\s*auto;[\s\S]*?margin-right:\s*auto;/
    );
  });
});
