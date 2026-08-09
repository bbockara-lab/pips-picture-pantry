import { describe, expect, it } from "vitest";
import fs from "node:fs";

const appShell = fs.readFileSync("src/ui/appShell.js", "utf8");
const popover = fs.readFileSync("src/ui/loginBonusPopover.js", "utf8");
const styles = fs.readFileSync("src/styles.css", "utf8");

describe("daily login bonus presentation", () => {
  it("claims only for an active player after app initialization", () => {
    expect(appShell).toContain("hasActivePlayer() ? claimLoginBonus() : null");
  });

  it("shows a tappable Pip speech bubble for three seconds on the puzzle hub", () => {
    expect(appShell).toContain('activeView === "puzzle" && !playOpen && !puzzleListOpen && !activeGuide');
    expect(appShell).toContain('root.dataset.introOpen === "true"');
    expect(appShell).toContain("globalThis.setTimeout(dismissLoginBonus, 3000)");
    expect(popover).toContain('pip-chrome-v2.png');
    expect(popover).toContain('t("toast.loginBonus", { count })');
    expect(popover).toContain('addEventListener("click", onDismiss, { once: true })');
    expect(styles).toContain("v0.1.678 - daily login spoon bonus");
    expect(styles).toContain(".login-bonus-popover__bubble");
    const step63Styles = styles.slice(styles.indexOf("v0.1.714 - Step 63 canonical Workshop composition"));
    expect(step63Styles).toContain("top: clamp(112px, 16dvh, 150px)");
    expect(step63Styles).toContain("#app:has(.login-bonus-popover) .puzzle-home-scene__greeting-wrap");
    expect(styles).toMatch(
      /@keyframes login-bonus-arrive\s*\{[\s\S]*?translate\(-50%, calc\(-50% - 8px\)\)[\s\S]*?translate\(-50%, -50%\)/
    );
  });
});
