import { mkdirSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";
import { chromium } from "@playwright/test";
import { seasonShelves } from "../src/data/seasonShelves.js";

const ROOT = process.cwd();
const PORT = 5198;
const URL = `http://127.0.0.1:${PORT}/`;
const OUT = resolve(ROOT, "store-assets/store-media/v0.1.708/raw/premium-trailer");

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const status = await new Promise((done) => {
      const request = http.request(URL, { method: "HEAD", timeout: 800 }, (response) => {
        response.resume();
        done(response.statusCode || 0);
      });
      request.on("error", () => done(0));
      request.on("timeout", () => { request.destroy(); done(0); });
      request.end();
    });
    if (status) return;
    await sleep(250);
  }
  throw new Error("Trailer capture server did not start.");
}

async function dismissIntro(page) {
  const intro = page.locator(".brand-intro");
  if (!(await intro.count())) return;
  await page.locator(".brand-intro__skip").first().click();
  const input = page.locator("#player-intro-name");
  if (await input.count()) {
    await input.fill("Mina");
    await page.locator(".player-intro-form .brand-intro__skip").click();
  }
  await intro.waitFor({ state: "detached", timeout: 5000 });
}

async function dismissGuide(page) {
  const overlay = page.locator(".guide-overlay").first();
  if (!(await overlay.count())) return;
  for (let step = 0; step < 6 && await overlay.isVisible(); step += 1) {
    const practice = page.locator(".guide-practice__cell");
    if (await practice.count()) {
      for (let index = 0; index < Math.min(5, await practice.count()); index += 1) {
        await practice.nth(index).click({ force: true });
      }
    }
    await page.locator(".guide-dialog__next").first().click({ force: true });
    await page.waitForTimeout(150);
  }
}

async function openFloatingView(page, view, expected) {
  await page.locator(".floating-nav__trigger").click();
  await page.locator(`.floating-nav__item[data-view='${view}']`).click();
  await page.locator(expected).first().waitFor({ state: "visible", timeout: 6000 });
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn(process.execPath, [
    resolve(ROOT, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1",
    "--port", String(PORT), "--strictPort"
  ], { cwd: ROOT, stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 430, height: 932 },
      locale: "en-US",
      colorScheme: "light",
      recordVideo: { dir: OUT, size: { width: 430, height: 932 } }
    });
    const page = await context.newPage();
    const video = page.video();
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.evaluate((completedPuzzleIds) => {
      localStorage.clear();
      localStorage.setItem("pip-picture-pantry-language", "en");
      const player = { id: "premium-trailer", name: "Mina" };
      localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
      localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
      localStorage.setItem("pips-picture-pantry:v0.1:save:premium-trailer", JSON.stringify({
        completedPuzzleIds,
        rewardedPuzzleIds: completedPuzzleIds,
        completedShelfIds: ["shelf-pips-first"],
        unlockedShelfIds: ["shelf-pips-first", "shelf-sunny-counter"],
        pantrySpoons: 180,
        seenGuideIds: ["puzzle", "timeAttack", "map", "spoonRunIntro", "pantryFirstPurchase", "pantryRoomStory"],
        ownedJarIds: ["plain-olive-oil", "strawberry-jam", "lavender-honey"],
        featuredBadgeId: "badge-pips-first-shelf"
      }));
    }, seasonShelves[0].puzzleIds);
    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissIntro(page);
    await page.locator(".puzzle-home-scene").waitFor({ state: "visible", timeout: 6000 });
    await page.waitForTimeout(3200);

    await page.locator(".puzzle-home-scene__play").click();
    await dismissGuide(page);
    await page.locator(".puzzle-grid .puzzle-cell").first().waitFor({ state: "visible", timeout: 6000 });
    await page.waitForTimeout(1800);
    const cells = page.locator(".puzzle-grid .puzzle-cell");
    for (const index of [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14]) {
      await cells.nth(index).click();
      await page.waitForTimeout(360);
    }
    await page.waitForTimeout(2200);

    await page.locator(".play-screen__back").click();
    await page.locator(".play-pause-menu").waitFor({ state: "visible", timeout: 3000 });
    await page.waitForTimeout(900);
    await page.locator(".play-pause-menu__action--pantry").click();
    await page.locator(".pantry-panel").waitFor({ state: "visible", timeout: 6000 });
    await page.waitForTimeout(4600);

    await openFloatingView(page, "map", ".badge-view");
    await page.waitForTimeout(4600);
    const earned = page.locator(".badge-slot.earned").first();
    if (await earned.count()) {
      await earned.click();
      await page.waitForTimeout(2800);
    }

    await openFloatingView(page, "puzzle", ".puzzle-home-scene");
    await page.waitForTimeout(3200);
    await context.close();
    renameSync(await video.path(), resolve(OUT, "gameplay-en-premium-v1.webm"));
  } finally {
    await browser?.close();
    server.kill();
  }
  console.log(resolve(OUT, "gameplay-en-premium-v1.webm"));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
