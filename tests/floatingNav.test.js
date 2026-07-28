import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const navSource = readFileSync(new URL("../src/ui/floatingNav.js", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Play Now floating navigation", () => {
  it("pulses only on the unseen puzzle guide entry", () => {
    expect(navSource).toContain('import { hasSeenGuide } from "../game/save.js"');
    expect(navSource).toMatch(
      /activeView === "puzzle" && !hasSeenGuide\("puzzle"\)[\s\S]*floating-nav__trigger--pulse/
    );
  });

  it("uses the enlarged elevated trigger contract", () => {
    expect(stylesSource).toContain(
      "bottom: calc(max(14px, env(safe-area-inset-bottom)) + 32px);"
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger\s*\{[\s\S]*?width:\s*80px;[\s\S]*?height:\s*80px;/
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*60px;[\s\S]*?height:\s*60px;/
    );
    expect(stylesSource).toContain(".floating-nav__trigger--pulse");
  });
});