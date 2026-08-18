import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const shellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");

describe("Settings sheet scrolling", () => {
  it("uses the dialog as the only vertical scroll owner and keeps Close reachable", () => {
    const contract = stylesSource.slice(
      stylesSource.indexOf("v0.1.717 - iOS Settings has one scroll owner")
    );
    expect(contract).toMatch(
      /\.modal-backdrop--settings\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?overscroll-behavior:\s*none;[\s\S]*?touch-action:\s*pan-y;/
    );
    expect(contract).toMatch(
      /\.modal-backdrop--settings \.settings-dialog\s*\{[\s\S]*?max-height:[\s\S]*?100dvh[\s\S]*?overflow-y:\s*auto;[\s\S]*?overscroll-behavior-y:\s*contain;[\s\S]*?touch-action:\s*pan-y;/
    );
    expect(contract).toMatch(
      /\.modal-backdrop--settings \.settings-dialog \*\s*\{[\s\S]*?touch-action:\s*pan-y;/
    );
    expect(contract).toMatch(
      /\.modal-backdrop--settings \.settings-choice--close\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?bottom:\s*0;[\s\S]*?z-index:\s*4;/
    );
    expect(contract).toMatch(
      /\.modal-backdrop--settings \.settings-choice--close\s*\{[\s\S]*?background-color:\s*#f3c44e !important;[\s\S]*?opacity:\s*1 !important;/
    );
  });

  it("does not replace the settings sheet during Time Attack clock updates", () => {
    expect(shellSource).toMatch(
      /activeView === "timeAttack" && playOpen && activeTimeAttackStartedAt && !settingsOpen/
    );
    const requestSettings = shellSource.slice(
      shellSource.indexOf("function requestSettings()"),
      shellSource.indexOf("function closeSettings()")
    );
    expect(requestSettings).not.toContain("loadCozySupportProduct");
    expect(requestSettings).not.toContain("loadSpoonJarProduct");
  });
});
