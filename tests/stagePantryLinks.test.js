import { describe, expect, it } from "vitest";
import { JAR_SHELVES, getJarsByShelf } from "../src/data/pantryJars.js";
import { seasonShelves } from "../src/data/seasonShelves.js";
import {
  getPaidJarProgressForPantryShelf,
  getPantryShelfForSeasonShelf,
  getSeasonShelvesForPantryShelf
} from "../src/data/stagePantryLinks.js";

describe("Pantry shelf and puzzle stage links", () => {
  it("maps all eight paid Pantry shelves to the authored stage gates", () => {
    expect(JAR_SHELVES.map((shelf) => ({
      shelf: shelf.id,
      stages: getSeasonShelvesForPantryShelf(shelf.id).map((stage) => stage.id)
    }))).toEqual([
      { shelf: "jam", stages: ["shelf-sunny-counter"] },
      { shelf: "honey", stages: ["shelf-apron-drawer"] },
      { shelf: "herb", stages: ["shelf-market-counter", "shelf-window-table"] },
      { shelf: "spice", stages: ["shelf-morning-bakery", "shelf-pastry-corner"] },
      { shelf: "pickle", stages: ["shelf-tin-row", "shelf-bakery-window"] },
      { shelf: "fruit", stages: ["shelf-village-square", "shelf-market-table"] },
      { shelf: "oil", stages: ["shelf-clock-corner", "shelf-bakery-walk"] },
      { shelf: "tea", stages: ["shelf-garden-path", "shelf-village-pantry"] }
    ]);
    expect(getPantryShelfForSeasonShelf(seasonShelves[0])).toBeNull();
  });

  it("reports shelf-local paid jar progress rather than cumulative progress", () => {
    const paidJamJars = getJarsByShelf("jam").filter((jar) => jar.cost > 0);
    expect(getPaidJarProgressForPantryShelf("jam", paidJamJars.slice(0, 3).map((jar) => jar.id)))
      .toEqual({ current: 3, total: 5, complete: false });
    expect(getPaidJarProgressForPantryShelf("jam", paidJamJars.map((jar) => jar.id)))
      .toEqual({ current: 5, total: 5, complete: true });
  });
});