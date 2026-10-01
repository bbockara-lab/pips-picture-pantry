import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import http from "node:http";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const PORT = 5199;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT = resolve(ROOT, "store-assets", "social", "next-move-8x8");
const PUZZLE_ID = "apron-drawer-cupcake-2-18";

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    const ok = await new Promise((done) => {
      const req = http.request(URL, { method: "HEAD", timeout: 500 }, (res) => {
        res.resume(); done(Boolean(res.statusCode));
      });
      req.on("error", () => done(false));
      req.on("timeout", () => { req.destroy(); done(false); });
      req.end();
    });
    if (ok) return;
    await wait(300);
  }
  throw new Error("Vite server did not start");
}

async function dismissIntro(page) {
  if (!(await page.locator(".brand-intro").count())) return;
  await page.locator(".brand-intro__skip").first().click();
  const input = page.locator("#player-intro-name");
  if (await input.count()) {
    await input.fill("Mina");
    await page.locator(".player-intro-form .brand-intro__skip").click();
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn(process.execPath, [resolve(ROOT, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT, stdio: "ignore"
  });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, locale: "en-US" });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.evaluate(({ puzzleId }) => {
      localStorage.clear();
      localStorage.setItem("pip-picture-pantry-language", "en");
      const player = { id: "social-next-move", name: "Mina" };
      localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
      localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
      const E = "empty", F = "filled", M = "marked";
      const cells = Array.from({ length: 8 }, () => Array(8).fill(E));
      // Start from a genuine mid-game state so the bow-like picture is already
      // emerging. Every seeded cell agrees with the authored solution.
      const prefilled = [0, 1, 6, 7, 8, 9, 13, 14, 15, 17, 18, 19, 24, 26, 27, 28];
      const premarked = [2, 3, 4, 5, 10, 11, 12, 16, 23, 25, 30, 31];
      for (const index of prefilled) cells[Math.floor(index / 8)][index % 8] = F;
      for (const index of premarked) cells[Math.floor(index / 8)][index % 8] = M;
      const state = {
        puzzleId, mode: "fill", cursor: { row: 3, column: 2 }, cells,
        history: [], hintsUsed: 0, paidHintsUsed: 0, completed: false,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`pips-picture-pantry:v0.1:save:${player.id}`, JSON.stringify({
        completedPuzzleIds: [], rewardedPuzzleIds: [], unlockedPackIds: ["pips-first-shelf", "sunny-spoon-sign"],
        unlockedShelfIds: ["shelf-pips-first", "shelf-sunny-counter", "shelf-apron-drawer", "shelf-window-table"], pantrySpoons: 85,
        dailyRewardedDates: [], replayDailyCounts: [], timeAttackDailyCounts: [],
        seenGuideIds: ["firstPuzzle", "puzzle", "cursorControlsIntro", "timeAttack", "timeAttackIntro"],
        puzzleStates: { [puzzleId]: JSON.stringify(state) }
      }));
    }, { puzzleId: PUZZLE_ID });
    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissIntro(page);
    await page.locator('.puzzle-home-destination[data-destination="puzzle"]').click();
    await page.locator(`.puzzle-chip[data-puzzle-id="${PUZZLE_ID}"]`).waitFor({ state: "attached" });
    await page.evaluate((puzzleId) => {
      document.querySelector(`.puzzle-chip[data-puzzle-id="${puzzleId}"]`)?.click();
    }, PUZZLE_ID);
    await page.locator('.play-screen[data-puzzle-size="8"] .board-wrap').waitFor({ state: "visible" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: resolve(OUT, "hard-sequence-00.png"), fullPage: false });
    // Four more correct cells make the picture feel close, then we stop before
    // the reveal and ask the viewer to choose the next move.
    const forcedMoves = [20, 29, 41, 42];
    for (let step = 0; step < forcedMoves.length; step += 1) {
      await page.locator(".puzzle-grid .puzzle-cell").nth(forcedMoves[step]).click();
      await page.getByRole("button", { name: "Color", exact: true }).click();
      await page.waitForTimeout(260);
      await page.screenshot({ path: resolve(OUT, `hard-sequence-${String(step + 1).padStart(2, "0")}.png`), fullPage: false });
    }
    await context.close();
  } finally {
    await browser?.close();
    server.kill();
  }
}

main().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
