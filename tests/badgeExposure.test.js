import fs from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = fs.readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const appChromeSource = fs.readFileSync(new URL("../src/ui/appChrome.js", import.meta.url), "utf8");
const mapViewSource = fs.readFileSync(new URL("../src/ui/mapView.js", import.meta.url), "utf8");

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
});
