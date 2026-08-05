import fs from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = fs.readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const appChromeSource = fs.readFileSync(new URL("../src/ui/appChrome.js", import.meta.url), "utf8");
const mapViewSource = fs.readFileSync(new URL("../src/ui/mapView.js", import.meta.url), "utf8");
const stylesSource = fs.readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("badge artwork exposure", () => {
  it("keeps earned badge artwork out of the shared app shell", () => {
    expect(appShellSource).not.toMatch(/renderBadgeShelf|earnedBadgeShelf/);
    expect(appChromeSource).not.toMatch(/renderBadgeShelf|getBadgeArtUrl|getEarnedPackBadges/);
  });

  it("keeps the badge collection view as the single persistent artwork surface", () => {
    expect(mapViewSource).toMatch(/renderPantryMapView/);
    expect(mapViewSource).toMatch(/getBadgeArtUrl/);
    expect(mapViewSource).toMatch(/badge-shelves/);
    expect(mapViewSource).toMatch(/badge-slot/);
    expect(mapViewSource).toMatch(/renderBadgeEarnedToast/);
  });

  it("keeps locked badge detail artwork obscured with matching progress", () => {
    expect(mapViewSource).toMatch(/imageWrap\.className = "badge-circle" \+ \(status\.earned \? "" : " locked"\)/);
    expect(mapViewSource).toMatch(/lock\.className = "badge-slot__lock"/);
    expect(mapViewSource).toMatch(/lock\.textContent = String\(status\.completed\) \+ "\/" \+ String\(status\.total\)/);
    expect(stylesSource).toMatch(/\.badge-detail > \.badge-circle\.locked img\s*\{[\s\S]*?filter:\s*grayscale\(1\)[\s\S]*?opacity:\s*0\.28/);
  });

  it("connects the earned toast to one-time and final-badge glow states", () => {
    expect(mapViewSource).toMatch(/rememberJustEarnedBadgeId\(status\.badge\.id\)/);
    expect(mapViewSource).toMatch(/storage\?\.setItem\(LAST_EARNED_BADGE_KEY/);
    expect(mapViewSource).toMatch(/storage\?\.removeItem\(LAST_EARNED_BADGE_KEY\)/);
    expect(mapViewSource).toMatch(/justEarnedId === status\.badge\.id \? "badge-slot--just-earned"/);
    expect(stylesSource).toMatch(/\.badge-slot--just-earned \.badge-circle[\s\S]*badge-earn-glow 1\.8s/);
    expect(stylesSource).toMatch(/\.badge-slot\[data-badge-id="badge-pip-full-pantry"\]\.earned \.badge-circle[\s\S]*badge-final-pulse 3s/);
    expect(stylesSource).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*badge-slot--just-earned/);
  });
});
