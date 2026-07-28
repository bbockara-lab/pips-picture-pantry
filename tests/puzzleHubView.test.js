import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDailyGreetingKey } from "../src/ui/puzzleHubView.js";

const styles = readFileSync("src/styles.css", "utf8");

describe("Workshop daily greeting", () => {
  it("keeps one greeting for the local day and rotates on the next day", () => {
    const morning = new Date(2026, 6, 28, 8, 0);
    const evening = new Date(2026, 6, 28, 22, 30);
    const tomorrow = new Date(2026, 6, 29, 8, 0);

    expect(getDailyGreetingKey(morning)).toBe(getDailyGreetingKey(evening));
    expect(getDailyGreetingKey(tomorrow)).not.toBe(getDailyGreetingKey(morning));
    expect(getDailyGreetingKey(morning)).toMatch(/^home\.greetingMessages\.\d$/);
  });

  it("keeps the Workshop greeting Pip conversation-sized despite the shared greeting class", () => {
    expect(styles).toMatch(
      /\.app-shell--workshop-home \.puzzle-home-scene__greeting-pip\s*\{[\s\S]*?width:\s*clamp\(90px,\s*22vw,\s*120px\)\s*!important;[\s\S]*?height:\s*auto\s*!important;/
    );
  });
});