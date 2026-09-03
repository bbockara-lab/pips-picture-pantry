import { chromium } from "@playwright/test";

const url = process.env.PPP_URL || "http://127.0.0.1:5173/";
const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 }
];
const sizes = [5, 8, 10, 12];
const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: "domcontentloaded" });

  for (const size of sizes) {
    await page.evaluate(async (fixtureSize) => {
      const { renderBoard } = await import("/src/ui/boardView.js");
      const { createPuzzleState } = await import("/src/game/puzzleState.js");
      const alternating = Array.from({ length: fixtureSize }, (_, index) => index % 2 === 0 ? "1" : "0").join("");
      const puzzle = {
        id: "pips-first-shelf-pip-face-1",
        size: fixtureSize,
        solution: Array.from({ length: fixtureSize }, () => alternating)
      };
      const shell = document.createElement("main");
      shell.className = "app-shell app-shell--play";
      const screen = document.createElement("section");
      screen.className = "play-screen";
      screen.dataset.puzzleSize = String(fixtureSize);
      const panel = document.createElement("section");
      panel.className = "puzzle-panel";
      panel.appendChild(renderBoard(puzzle, createPuzzleState(puzzle), () => {}));
      screen.appendChild(panel);
      shell.appendChild(screen);
      document.body.replaceChildren(shell);
    }, size);
    const metrics = await page.locator(".board-wrap:not(.locked)").evaluate((board) => {
      const boardRect = board.getBoundingClientRect();
      const gridRect = board.querySelector(".puzzle-grid").getBoundingClientRect();
      const tokens = [...board.querySelectorAll(".row-clue span")].map((node) => node.getBoundingClientRect());
      return {
        viewportWidth: innerWidth,
        boardLeft: boardRect.left,
        boardRight: boardRect.right,
        boardWidth: boardRect.width,
        gridWidth: gridRect.width,
        cellWidth: board.querySelector(".puzzle-cell").getBoundingClientRect().width,
        minimumTokenLeft: Math.min(...tokens.map((rect) => rect.left)),
        maximumTokenRight: Math.max(...tokens.map((rect) => rect.right)),
        maximumRowClueCount: Math.max(...[...board.querySelectorAll(".row-clue")].map((row) => row.children.length))
      };
    });
    const clipped = metrics.boardLeft < -0.5
      || metrics.boardRight > metrics.viewportWidth + 0.5
      || metrics.minimumTokenLeft < -0.5
      || metrics.maximumTokenRight > metrics.viewportWidth + 0.5;
    // At the 360px support floor these values are the largest possible cells
    // after reserving a complete worst-case clue lane and all frame spacing.
    const minimumUsefulCell = size === 5 ? 42 : size === 8 ? 27 : size === 10 ? 20 : 16.5;
    if (clipped || metrics.cellWidth < minimumUsefulCell) {
      failures.push(`${viewport.width}px ${size}x${size}: ${JSON.stringify(metrics)}`);
    }
    console.log(`${viewport.width}px ${size}x${size}`, metrics);
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Board geometry QA passed.");

async function seedPlayer(page) {
  await page.evaluate(() => {
    const player = { id: "geometry-qa", name: "Geometry QA" };
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    localStorage.setItem("pips-picture-pantry:v0.1:language", "en");
    localStorage.setItem("pips-picture-pantry:v0.1:save:geometry-qa", JSON.stringify({
      puzzleStates: {}, completedPuzzleIds: [], rewardedPuzzleIds: [], dailyRewardedDates: [],
      unlockedPackIds: ["pips-first-shelf", "sunny-spoon-sign", "apron-drawer", "bakery-window", "village-pantry"], pantrySpoons: 500,
      pantryCompletedStoryGoalIds: ["small-jam-jar", "sunny-window-curtains", "recipe-card-shelf", "mint-check-rug", "herb-pot", "cork-board", "tiny-succulent", "spoon-wall-clock", "berry-tea-tins", "ribbon-rolling-pin"]
    }));
  });
}

async function dismissIntro(page) {
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.locator(".brand-intro__skip").click();
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 3000 });
}

async function dismissGuide(page) {
  await page.waitForTimeout(250);
  // Geometry QA is intentionally isolated from onboarding behavior.
  await page.evaluate(() => document.querySelectorAll(".guide-overlay").forEach((overlay) => overlay.remove()));
}

async function openPuzzleOfSize(page, size) {
  if (size === 5) {
    await page.locator(".puzzle-home-scene__play").click();
  } else {
    if (await page.locator('.puzzle-home-destination[data-destination="puzzle"]').count())
      await page.locator('.puzzle-home-destination[data-destination="puzzle"]').click();
    await page.locator(`.puzzle-chip[data-size="${size}"]`).first().click();
  }
  await page.locator(`.play-screen[data-puzzle-size="${size}"] .board-wrap`).waitFor({ state: "visible", timeout: 6000 });
}
