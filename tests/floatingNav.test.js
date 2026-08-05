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
      /v0\.1\.675 - fixed quick-travel release contract[\s\S]*?\.floating-nav\s*\{[\s\S]*?position:\s*fixed !important;[\s\S]*?right:\s*max\(16px, env\(safe-area-inset-right\)\) !important;[\s\S]*?bottom:\s*max\(20px, calc\(env\(safe-area-inset-bottom, 0px\) \+ 20px\)\) !important;[\s\S]*?z-index:\s*50 !important;/
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger\s*\{[\s\S]*?width:\s*80px;[\s\S]*?height:\s*80px;/
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*60px;[\s\S]*?height:\s*60px;/
    );
    expect(stylesSource).toMatch(
      /\.app-shell--play \.floating-nav\s*\{[\s\S]*?bottom:\s*max\(86px, calc\(env\(safe-area-inset-bottom, 0px\) \+ 86px\)\);/
    );
    expect(stylesSource).toMatch(
      /\.app-shell--play \.floating-nav__trigger\s*\{[\s\S]*?grid-template-columns:\s*40px minmax\(0, 1fr\);[\s\S]*?min-height:\s*68px;/
    );
    expect(stylesSource).toMatch(
      /\.app-shell--play \.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*40px;[\s\S]*?height:\s*40px;/
    );
    expect(stylesSource).toContain(".floating-nav__trigger--pulse");
    expect(stylesSource).toMatch(
      /v0\.1\.689 - Step 45 recovered navigation[\s\S]*?\.floating-nav\s*\{[\s\S]*?bottom:\s*max\(20px, calc\(env\(safe-area-inset-bottom, 0px\) \+ 20px\)\) !important;[\s\S]*?\.app-shell--play \.floating-nav\s*\{[\s\S]*?bottom:\s*max\(86px, calc\(env\(safe-area-inset-bottom, 0px\) \+ 86px\)\) !important;[\s\S]*?\.app-shell--play \.floating-nav__trigger\s*\{[\s\S]*?min-height:\s*68px;[\s\S]*?\.app-shell--play \.floating-nav__trigger \.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*40px;[\s\S]*?height:\s*40px;/
    );
  });

  it("keeps all seven destinations, including Settings, inside a scrollable menu", () => {
    const step52Styles = stylesSource.slice(
      stylesSource.indexOf("v0.1.697 - Step 52 floating-navigation menu containment")
    );
    expect(step52Styles).toMatch(
      /\.floating-nav__menu\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);[\s\S]*?max-height:\s*80dvh;[\s\S]*?padding:\s*10px;[\s\S]*?overflow-y:\s*auto;/
    );
    expect(step52Styles).toContain("overscroll-behavior: contain");
  });
});