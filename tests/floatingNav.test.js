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

  it("keeps quick travel fixed above the mobile edge", () => {
    expect(stylesSource).toMatch(
      /v0\.1\.675 - fixed quick-travel release contract[\s\S]*?\.floating-nav\s*\{[\s\S]*?position:\s*fixed !important;[\s\S]*?right:\s*max\(16px, env\(safe-area-inset-right\)\) !important;[\s\S]*?bottom:\s*max\(20px, env\(safe-area-inset-bottom\)\) !important;[\s\S]*?z-index:\s*50 !important;/
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