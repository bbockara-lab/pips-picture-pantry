import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getFeaturedBadgeId, saveGame, setFeaturedBadge } from "../src/game/save.js";

const mapSource = readFileSync(new URL("../src/ui/mapView.js", import.meta.url), "utf8");
const hubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

class LocalStorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
}

describe("featured Badge keepsake", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
  });

  it("persists one featured badge id", () => {
    saveGame({ completedPuzzleIds: [] });
    expect(getFeaturedBadgeId()).toBeNull();
    setFeaturedBadge("badge-pips-first-shelf");
    expect(getFeaturedBadgeId()).toBe("badge-pips-first-shelf");
    setFeaturedBadge("badge-sunny-spoon-sign");
    expect(getFeaturedBadgeId()).toBe("badge-sunny-spoon-sign");
  });

  it("offers the action only for earned badge details", () => {
    expect(mapSource).toContain("if (status.earned)");
    expect(mapSource).toContain("setFeaturedBadge(status.badge.id)");
    expect(mapSource).toContain("action.disabled = Boolean(options.featured)");
  });

  it("renders only an earned featured badge on home and opens Badges on tap", () => {
    expect(hubSource).toContain("status.earned && status.badge.id === featuredBadgeId");
    expect(hubSource).toContain("getBadgeArtUrl(featuredBadgeStatus.badge.id)");
    expect(hubSource).toContain('onSelectView("map")');
    expect(styles).toContain("v0.1.681 - featured Badge keepsake");
    expect(styles).toContain(".puzzle-home-scene__featured-badge");
  });
  it("aligns the featured jar and badge as independent keepsakes above Play Now", () => {
    const jarRule = styles.match(/\.app-shell--workshop-home \.puzzle-home-scene__featured-jar \{([\s\S]*?)\}/)?.[1] || "";
    const badgeRule = styles.match(/\.app-shell--workshop-home \.puzzle-home-scene__featured-badge \{([\s\S]*?)\}/)?.[1] || "";
    expect(jarRule).toContain("top: auto");
    expect(jarRule).toContain("left: max(16px, env(safe-area-inset-left, 0px))");
    expect(jarRule).toContain("+ 124px");
    expect(badgeRule).toContain("top: auto");
    expect(badgeRule).toContain("right: max(16px, env(safe-area-inset-right, 0px))");
    expect(badgeRule).toContain("+ 124px");
    expect(styles).toContain(".puzzle-home-destination--map");
    expect(styles).toContain("bottom: 25%");
    expect(styles).toContain("bottom: 28%");
    expect(hubSource).toContain("if (featuredJarCard) scene.appendChild(featuredJarCard)");
    expect(hubSource).toContain("if (featuredBadgeStatus)");
  });
});