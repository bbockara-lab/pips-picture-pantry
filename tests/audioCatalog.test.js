import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("authored audio runtime", () => {
  const source = fs.readFileSync("src/ui/audio.js", "utf8");
  const catalog = fs.readFileSync("src/ui/audioCatalog.js", "utf8");

  it("uses authored seasonal and evergreen music for every screen family", () => {
    for (const cue of ["home", "puzzle", "pantry", "spoonRun", "timeAttack", "albumMap", "dialogue"]) {
      expect(catalog).toContain(`${cue}:`);
    }
    expect(catalog).toContain("YEAR_ROUND_MUSIC_CUES");
    expect(source).toContain("isKoreanHarvestEventVisible");
    expect(source).toContain("setMusicScene");
  });

  it("switches to evergreen music after the seasonal visibility window", async () => {
    const { resolveMusicCueId } = await import("../src/ui/audio.js");
    expect(resolveMusicCueId("home", true)).toBe("bgm_harvest_home");
    expect(resolveMusicCueId("home", false)).toBe("bgm_evergreen_home_v1");
    expect(resolveMusicCueId("puzzle", false)).toBe("bgm_evergreen_puzzle_v1");
    expect(resolveMusicCueId("albumMap", false)).toBe("bgm_evergreen_collection_v1");
    expect(resolveMusicCueId("timeAttack", false)).toBe("bgm_evergreen_time_attack_v1");
  });

  it("replaces oscillator placeholders with authored cue playback and variations", () => {
    expect(source).not.toContain("createOscillator");
    expect(source).toContain('playCue("sfx_ui_tap_soft"');
    expect(source).toContain('playCue("sfx_cursor_move"');
    expect(source).toContain('playCue("stinger_puzzle_complete"');
    expect(source).toContain("pickVariation");
  });
});
