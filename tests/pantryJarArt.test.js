import { describe, expect, it } from "vitest";
import { JAR_ART, getJarArtUrl } from "../src/data/jarArt.js";
import { PANTRY_JARS } from "../src/data/pantryJars.js";

describe("Pantry jar art catalog", () => {
  it("maps every jar to one versioned WebP asset", () => {
    expect(Object.keys(JAR_ART).sort()).toEqual(PANTRY_JARS.map((jar) => jar.id).sort());
    PANTRY_JARS.forEach((jar) => {
      expect(getJarArtUrl(jar.id)).toMatch(/jar-[a-z0-9-]+-v1\.webp$/);
    });
  });

  it("does not resolve unknown jar ids", () => {
    expect(getJarArtUrl("not-a-real-jar")).toBe("");
  });
});
