import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("authored audio runtime", () => {
  const source = fs.readFileSync("src/ui/audio.js", "utf8");
  const catalog = fs.readFileSync("src/ui/audioCatalog.js", "utf8");

  it("uses authored seasonal music for every screen family", () => {
    for (const cue of ["home", "puzzle", "pantry", "spoonRun", "timeAttack", "albumMap", "dialogue", "yearRound"]) {
      expect(catalog).toContain(`${cue}:`);
    }
    expect(source).toContain("isKoreanHarvestContentRuntimeReady");
    expect(source).toContain("setMusicScene");
  });

  it("replaces oscillator placeholders with authored cue playback and variations", () => {
    expect(source).not.toContain("createOscillator");
    expect(source).toContain('playCue("sfx_ui_tap_soft"');
    expect(source).toContain('playCue("sfx_cursor_move"');
    expect(source).toContain('playCue("stinger_puzzle_complete"');
    expect(source).toContain("pickVariation");
  });
});
