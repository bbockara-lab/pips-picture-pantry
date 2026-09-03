import { describe, expect, it } from "vitest";
import fs from "node:fs";

const appShell = fs.readFileSync("src/ui/appShell.js", "utf8");
const message = fs.readFileSync("src/ui/loginBonusMessage.js", "utf8");
const hub = fs.readFileSync("src/ui/puzzleHubView.js", "utf8");
const styles = fs.readFileSync("src/styles.css", "utf8");

describe("daily login bonus presentation", () => {
  it("claims only for an active player after app initialization", () => {
    expect(appShell).toContain("hasActivePlayer() ? claimLoginBonus() : null");
  });

  it("temporarily replaces the existing Pip greeting for three seconds", () => {
    expect(appShell).toContain('activeView === "puzzle" && !playOpen && !puzzleListOpen && !activeGuide');
    expect(appShell).toContain('root.dataset.introOpen === "true"');
    expect(appShell).toContain("globalThis.setTimeout(dismissLoginBonus, 3000)");
    expect(appShell).toContain("loginBonusMessage: loginBonusVisible ? getLoginBonusMessage(loginBonus) : null");
    expect(appShell).toContain("greetingMessage: loginBonusMessage");
    expect(appShell).toContain("draw();");
    expect(message).toContain('t("toast.loginBonus", { count })');
    expect(hub).toContain("greetingMessage || t(getDailyGreetingKey())");
    expect(styles).toContain("v0.1.678 - daily login spoon bonus");
    expect(styles).not.toContain(".login-bonus-popover");
    expect(message).not.toContain("document.createElement");
  });

  it("retries presentation after the first-player intro closes", () => {
    expect(appShell).toContain("introDismissedHandler = draw");
    expect(appShell).toContain('window.addEventListener("ppp:intro-dismissed", introDismissedHandler)');
    expect(appShell).toContain("scheduleLoginBonusPresentation()");
  });
});
