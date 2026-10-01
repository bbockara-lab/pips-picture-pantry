import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Pantry jar shelf layout", () => {
  it("reserves two name lines while keeping price and status on one line", () => {
    expect(stylesSource).toMatch(
      /\.pantry-jar__name\s*\{[\s\S]*?display:\s*-webkit-box;[\s\S]*?-webkit-line-clamp:\s*2;/
    );
    expect(stylesSource).toMatch(
      /\.pantry-jar__name\s*\{[\s\S]*?white-space:\s*normal;[\s\S]*?min-height:\s*calc\(0\.68rem \* 1\.2 \* 2\);/
    );
    expect(stylesSource).toMatch(
      /\.pantry-jar__price,\s*\.pantry-jar__status\s*\{[\s\S]*?white-space:\s*nowrap;/
    );
  });

  it("stretches shelf cells and reserves enough card height for two-line names", () => {
    expect(stylesSource).toMatch(
      /\.pantry-shelf__jars\s*\{[\s\S]*?align-items:\s*stretch;/
    );
    expect(stylesSource).toMatch(
      /\.pantry-jar-panel \.pantry-jar\s*\{[\s\S]*?justify-content:\s*space-between !important;[\s\S]*?min-height:\s*128px !important;/
    );
    expect(stylesSource).toMatch(
      /@media \(max-width:\s*380px\)\s*\{[\s\S]*?\.pantry-jar__name\s*\{[\s\S]*?font-size:\s*0\.62rem;[\s\S]*?min-height:\s*calc\(0\.62rem \* 1\.2 \* 2\);/
    );
  });
});
