import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import http from "node:http";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const PORT = 5198;
const BASE_URL = `http://127.0.0.1:${PORT}/`;
const BASE = resolve(ROOT, "store-assets", "store-media", "app-store-1.1.21-final");
const TARGET = { viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, expected: [1290, 2796] };
const captures = [];

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

function probe() {
  return new Promise((done) => {
    const request = http.request(BASE_URL, { method: "HEAD", timeout: 1000 }, (response) => {
      response.resume();
      done(response.statusCode || 0);
    });
    request.on("error", () => done(0));
    request.on("timeout", () => { request.destroy(); done(0); });
    request.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await probe()) return;
    await wait(400);
  }
  throw new Error(`Vite did not respond at ${BASE_URL}`);
}

async function dismissGuide(page) {
  const overlay = page.locator(".guide-overlay").first();
  try {
    await overlay.waitFor({ state: "visible", timeout: 700 });
    for (let step = 0; step < 8 && await overlay.isVisible(); step += 1) {
      const practice = page.locator(".guide-practice");
      if (await practice.count()) {
        const cells = practice.locator(".guide-practice__cell");
        for (let index = 0; index < await cells.count(); index += 1) await cells.nth(index).click({ force: true });
      }
      await page.locator(".guide-dialog__next").first().click({ force: true });
    }
  } catch {
    // This route has no guide or it has already been dismissed.
  }
}

async function dismissIntro(page, playerName) {
  if (!(await page.locator(".brand-intro").count())) return;
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 10000 });
  await page.locator(".brand-intro__skip").first().click();
  const input = page.locator("#player-intro-name");
  try {
    await input.waitFor({ state: "visible", timeout: 1200 });
    await input.fill(playerName);
    await page.locator(".player-intro-form .brand-intro__skip").click();
  } catch {
    // Returning players skip name entry.
  }
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 5000 });
}

async function seed(page, language) {
  await page.evaluate(({ language }) => {
    localStorage.clear();
    localStorage.setItem("pip-picture-pantry-language", language);
    const id = `app-store-1.1.21-${language}`;
    const player = { id, name: language === "ko" ? "하늘" : "Mina" };
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    localStorage.setItem(`pips-picture-pantry:v0.1:save:${id}`, JSON.stringify({
      completedPuzzleIds: ["pips-first-shelf-pip-face-1", "pips-first-shelf-stew-pot-2", "pips-first-shelf-wooden-spoon-3"],
      rewardedPuzzleIds: ["pips-first-shelf-pip-face-1", "pips-first-shelf-stew-pot-2", "pips-first-shelf-wooden-spoon-3"],
      unlockedPackIds: ["pips-first-shelf", "bakery-window", "village-pantry", "summer-pantry"],
      pantrySpoons: 85,
      dailyRewardedDates: [], replayDailyCounts: [], timeAttackDailyCounts: [],
      pantryOwnedDecorationIds: ["starter-counter-cloth", "small-jam-jar", "linen-curtain"],
      pantryDisplayedDecorationIds: ["starter-counter-cloth", "small-jam-jar", "linen-curtain"],
      pantryCompletedStoryGoalIds: [],
      seenGuideIds: ["firstPuzzle", "pantryFirstPurchase", "timeAttackIntro", "cursorControlsIntro"],
    }));
  }, { language });
}

async function shot(page, locale, order, name) {
  const directory = resolve(BASE, "upload", "app-store", "iphone-6.9", locale);
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, `${String(order).padStart(2, "0")}-${name}.png`);
  await page.waitForTimeout(400);
  await page.screenshot({ path, fullPage: false });
  const dimensions = await page.evaluate(() => [window.innerWidth, window.innerHeight, window.devicePixelRatio]);
  captures.push({ locale, order, name, path: path.slice(ROOT.length + 1), dimensions, sha256: createHash("sha256").update(readFileSync(path)).digest("hex") });
}

async function openFloatingView(page, view, selector) {
  if (!(await page.locator(".floating-nav__trigger").count()) && await page.locator(".play-screen__back").count()) {
    await page.locator(".play-screen__back").first().click();
    await page.locator(".play-pause-menu__action--home").first().click();
  }
  await page.locator(".floating-nav__trigger").first().waitFor({ state: "visible", timeout: 6000 });
  await page.locator(".floating-nav__trigger").first().click();
  await page.locator(`.floating-nav__item[data-view='${view}']`).click();
  await page.locator(selector).first().waitFor({ state: "visible", timeout: 6000 });
}

async function captureLocale(browser, language, locale) {
  const context = await browser.newContext({ viewport: TARGET.viewport, deviceScaleFactor: TARGET.deviceScaleFactor, locale, colorScheme: "light" });
  const page = await context.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await seed(page, language);
    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissIntro(page, language === "ko" ? "하늘" : "Mina");
    await dismissGuide(page);

    await page.locator(".puzzle-home-scene__play").click();
    await dismissGuide(page);
    const cells = page.locator(".puzzle-grid .puzzle-cell");
    await cells.first().waitFor({ state: "visible", timeout: 6000 });
    for (const index of [0, 1, 3, 4, 5, 6, 7, 8, 9]) await cells.nth(index).click();
    await shot(page, locale, 3, "puzzle-in-progress");

    for (const index of [10, 12, 14, 15, 16, 17, 18, 19, 21, 22, 23]) await cells.nth(index).click();
    await page.locator(".completion-banner").waitFor({ state: "visible", timeout: 6000 });
    await shot(page, locale, 4, "puzzle-complete");

    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissIntro(page, language === "ko" ? "하늘" : "Mina");
    if (!(await page.locator(".floating-nav__trigger").count()) && await page.locator(".play-screen__back").count()) {
      await page.locator(".play-screen__back").first().click();
      await page.locator(".play-pause-menu__action--home").first().click();
    }
    await page.locator(".puzzle-home-destination--timeAttack").waitFor({ state: "visible", timeout: 6000 });
    await shot(page, locale, 1, "home-with-time-attack");

    await page.locator(".puzzle-home-destination--timeAttack").click();
    await page.locator(".time-attack-panel").first().waitFor({ state: "visible", timeout: 6000 });
    await dismissGuide(page);
    await shot(page, locale, 2, "time-attack");

    await openFloatingView(page, "album", ".album-panel");
    await shot(page, locale, 5, "picture-album");

    await openFloatingView(page, "pantry", ".pantry-panel");
    await shot(page, locale, 6, "pantry");
  } finally {
    await context.close();
  }
}

async function main() {
  const server = spawn(process.execPath, [resolve(ROOT, "node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], { cwd: ROOT, stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    await captureLocale(browser, "en", "en-US");
    await captureLocale(browser, "ko", "ko-KR");
  } finally {
    await browser?.close();
    server.kill();
  }
  const manifest = { version: "1.1.21", build: 4, generatedAt: new Date().toISOString(), source: "Current local app render", expectedPixels: TARGET.expected, captures };
  mkdirSync(BASE, { recursive: true });
  writeFileSync(resolve(BASE, "capture-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Captured ${captures.length} current 1.1.21 screenshots.`);
}

main().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
