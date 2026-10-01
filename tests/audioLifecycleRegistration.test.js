import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mainSource = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

describe("native and web audio lifecycle registration", () => {
  it("handles native app state, document visibility, and page transitions", () => {
    expect(mainSource).toContain('from "@capacitor/app"');
    expect(mainSource).toContain('document.addEventListener("visibilitychange"');
    expect(mainSource).toContain('window.addEventListener("pagehide"');
    expect(mainSource).toContain('window.addEventListener("pageshow"');
    expect(mainSource).toContain('App.addListener("appStateChange"');
  });
});
