import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const navSource = readFileSync(new URL("../src/ui/floatingNav.js", import.meta.url), "utf8");
const shellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const pickerSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Play Now floating navigation", () => {
  it("pulses only on the unseen puzzle guide entry", () => {
    expect(navSource).toContain('import { hasSeenGuide } from "../game/save.js"');
    expect(navSource).toMatch(
      /activeView === "puzzle" && !hasSeenGuide\("puzzle"\)[\s\S]*floating-nav__trigger--pulse/
    );
  });

  it("keeps quick travel visible during play and reserves control clearance", () => {
    expect(stylesSource).toMatch(
      /v0\.1\.675 - fixed quick-travel release contract[\s\S]*?\.floating-nav\s*\{[\s\S]*?position:\s*fixed !important;[\s\S]*?right:\s*max\(16px, env\(safe-area-inset-right\)\) !important;[\s\S]*?bottom:\s*max\(20px, calc\(env\(safe-area-inset-bottom, 0px\) \+ 20px\)\) !important;[\s\S]*?z-index:\s*50 !important;/
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger\s*\{[\s\S]*?width:\s*80px;[\s\S]*?height:\s*80px;/
    );
    expect(stylesSource).toMatch(
      /\.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*60px;[\s\S]*?height:\s*60px;/
    );
    const playClearanceContract = stylesSource.slice(
      stylesSource.indexOf("v0.1.718 - Keep quick travel reachable during play on iOS")
    );
    expect(playClearanceContract).toMatch(
      /\.app-shell\.app-shell--play\s*\{[\s\S]*?padding-bottom:\s*calc\(70px \+ env\(safe-area-inset-bottom, 0px\)\) !important;[\s\S]*?\.app-shell--play \.floating-nav\s*\{[\s\S]*?position:\s*fixed !important;[\s\S]*?right:\s*max\(10px, env\(safe-area-inset-right, 0px\)\) !important;[\s\S]*?bottom:\s*max\(10px, env\(safe-area-inset-bottom, 0px\)\) !important;/
    );
    expect(playClearanceContract).toMatch(
      /v0\.1\.720[\s\S]*?\.app-shell--play \.floating-nav__trigger\s*\{[\s\S]*?width:\s*54px;[\s\S]*?height:\s*54px;/
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

  it("uses the shared floating navigation on the puzzle list without a duplicate Home button", () => {
    expect(shellSource).toMatch(
      /if \(!hasBlockingOverlay && \(activeView !== "puzzle" \|\| puzzleListOpen\)\) \{\s*shell\.appendChild\(renderFloatingNav\(activeView, onSelectView\)\);/
    );
    expect(shellSource).not.toContain("onGoHome: onClosePuzzle");
    expect(pickerSource).not.toContain("puzzle-picker__home");
    expect(pickerSource).not.toContain("onGoHome");
    expect(stylesSource).not.toContain(".puzzle-picker__home");
  });

  it("uses the same shared navigation during normal and Time Attack play", () => {
    expect(shellSource).toMatch(
      /if \(\(activeView === "puzzle" \|\| activeView === "timeAttack"\) && playOpen\)[\s\S]*?if \(!hasBlockingOverlay\) \{\s*shell\.appendChild\(renderFloatingNav\(activeView, onSelectView\)\);/
    );
  });

  it("preserves an open menu across Time Attack clock redraws", () => {
    expect(navSource).toContain("let quickTravelOpen = false");
    expect(navSource).toContain("nav.dataset.open = String(quickTravelOpen)");
    expect(navSource).toMatch(/trigger\.addEventListener\("click", \(event\) => \{[\s\S]*?event\.stopPropagation\(\);/);
  });

  it("uses one compact navigation scale on every surface", () => {
    const unifiedScale = stylesSource.slice(
      stylesSource.indexOf("v0.1.721 - One quick-travel scale everywhere")
    );
    expect(unifiedScale).toMatch(
      /\.floating-nav \.floating-nav__trigger\s*\{[\s\S]*?width:\s*54px;[\s\S]*?height:\s*54px;/
    );
    expect(unifiedScale).toMatch(
      /\.floating-nav \.floating-nav__trigger \.floating-nav__trigger-icon\s*\{[\s\S]*?width:\s*42px;[\s\S]*?height:\s*42px;/
    );
    expect(unifiedScale).toMatch(
      /\.floating-nav \.floating-nav__item\s*\{[\s\S]*?min-height:\s*58px;/
    );
  });
});
