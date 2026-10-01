import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Korean Harvest App Store event deep link", () => {
  it("registers the iOS URL scheme used by App Store Connect", () => {
    const plist = fs.readFileSync("ios/App/App/Info.plist", "utf8");
    expect(plist).toContain("<string>pipspicturepantry</string>");
  });

  it("opens the seasonal event for launch and foreground URL events", () => {
    const main = fs.readFileSync("src/main.js", "utf8");
    const shell = fs.readFileSync("src/ui/appShell.js", "utf8");
    expect(main).toContain('App.addListener("appUrlOpen"');
    expect(main).toContain("App.getLaunchUrl()");
    expect(main).toContain("pipspicturepantry://event/korean-harvest-2026");
    expect(shell).toContain('root.dataset.openKoreanHarvestEvent === "true"');
  });
});
