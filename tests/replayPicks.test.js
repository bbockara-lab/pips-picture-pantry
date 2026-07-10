import { describe, expect, it } from "vitest";
import { getDailyReplayPicks } from "../src/game/replayPicks.js";

const samplePuzzles = [
  { id: "one", packId: "starter" },
  { id: "two", packId: "starter" },
  { id: "three", packId: "starter" },
  { id: "four", packId: "starter" }
];

describe("daily replay picks", () => {
  it("returns no picks before any completed pictures exist", () => {
    expect(getDailyReplayPicks({ allPuzzles: samplePuzzles, completedPuzzleIds: [], limit: 3, isUnlocked: () => true })).toEqual([]);
  });

  it("uses completed and unlocked pictures only", () => {
    const picks = getDailyReplayPicks({
      allPuzzles: samplePuzzles,
      completedPuzzleIds: ["one", "two", "three"],
      limit: 3,
      now: new Date("2026-07-06T12:00:00Z"),
      isUnlocked: (puzzle) => puzzle.id !== "two"
    });

    expect(picks.map((puzzle) => puzzle.id)).toEqual(expect.arrayContaining(["one", "three"]));
    expect(picks).toHaveLength(2);
  });

  it("is stable for the same date and capped by the daily limit", () => {
    const first = getDailyReplayPicks({
      allPuzzles: samplePuzzles,
      completedPuzzleIds: samplePuzzles.map((puzzle) => puzzle.id),
      limit: 3,
      now: new Date("2026-07-06T01:00:00Z"),
      isUnlocked: () => true
    });
    const second = getDailyReplayPicks({
      allPuzzles: samplePuzzles,
      completedPuzzleIds: samplePuzzles.map((puzzle) => puzzle.id),
      limit: 3,
      now: new Date("2026-07-06T20:00:00Z"),
      isUnlocked: () => true
    });

    expect(first.map((puzzle) => puzzle.id)).toEqual(second.map((puzzle) => puzzle.id));
    expect(first).toHaveLength(3);
  });
});
