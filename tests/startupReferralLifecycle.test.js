import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mainSource = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

describe("startup referral lifecycle", () => {
  it("defers referral redraws until the brand intro dismisses normally", () => {
    expect(mainSource).toContain('if (root.dataset.introOpen === "true")');
    expect(mainSource).toContain('window.addEventListener("ppp:intro-dismissed"');
    expect(mainSource).toContain("referralRefreshQueuedAfterIntro");
  });
});
