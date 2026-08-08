import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import http from "node:http";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { APP_VERSION } from "../src/data/appVersion.js";

const ROOT = process.cwd();
const PORT = 5197;
const BASE_URL = `http://127.0.0.1:${PORT}/`;
const OUT = resolve(ROOT, "store-assets", "store-media", APP_VERSION);
const RAW = resolve(OUT, "raw");
const VIDEO = resolve(RAW, "video");
const isWindows = process.platform === "win32";

const targets = [
  { id: "google-play", viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, expected: [1080, 1920] },
  { id: "app-store-6.9", viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, expected: [1290, 2796] },
  { id: "app-store-ipad-13", viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 2, expected: [2048, 2732] },
];

const manifest = {
  appVersion: APP_VERSION,
  androidVersionCode: 37,
  androidVersionName: "1.1.9",
  generatedAt: new Date().toISOString(),
  source: "Live Playwright render of the current local app; no legacy store screenshots used.",
  captures: [],
  videos: [],
};

function wait(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

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

async function dismissIntro(page, playerName = "Mina") {
  if (!(await page.locator(".brand-intro").count())) return;
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 7000 });
  await page.locator(".brand-intro__skip").first().click();
  const input = page.locator("#player-intro-name");
  try {
    await input.waitFor({ state: "visible", timeout: 1000 });
    await input.fill(playerName);
    await page.locator(".player-intro-form .brand-intro__skip").click();
  } catch {
    // Returning players skip name entry.
  }
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 4000 });
}

async function dismissGuide(page) {
  const overlay = page.locator(".guide-overlay").first();
  try {
    await overlay.waitFor({ state: "visible", timeout: 1000 });
    for (let step = 0; step < 5 && await overlay.isVisible(); step += 1) {
      const practice = page.locator(".guide-practice");
      if (await practice.count()) {
        const cells = practice.locator(".guide-practice__cell");
        const guideStep = Number(await page.locator(".guide-dialog").getAttribute("data-step"));
        const indices = guideStep === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];
        for (const index of indices) await cells.nth(index).click({ force: true });
      }
      await page.locator(".guide-dialog__next").first().click({ force: true });
    }
    await overlay.waitFor({ state: "detached", timeout: 3500 });
  } catch {
    // Some routes have no guide.
  }
}

async function seedPlayer(page, language, id) {
  await page.evaluate(({ language, id }) => {
    localStorage.clear();
    localStorage.setItem("pip-picture-pantry-language", language);
    const name = language === "ko" ? "하늘" : "Mina";
    const player = { id, name };
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    localStorage.setItem(`pips-picture-pantry:v0.1:save:${id}`, JSON.stringify({
      completedPuzzleIds: [
        "pips-first-shelf-pip-face-1",
        "pips-first-shelf-stew-pot-2",
        "pips-first-shelf-wooden-spoon-3",
      ],
      rewardedPuzzleIds: [
        "pips-first-shelf-pip-face-1",
        "pips-first-shelf-stew-pot-2",
        "pips-first-shelf-wooden-spoon-3",
      ],
      unlockedPackIds: ["pips-first-shelf", "bakery-window", "village-pantry"],
      pantrySpoons: 82,
      dailyRewardedDates: [],
      replayDailyCounts: [],
      timeAttackDailyCounts: [],
      pantryOwnedDecorationIds: ["starter-counter-cloth", "small-jam-jar", "linen-curtain"],
      pantryDisplayedDecorationIds: ["starter-counter-cloth", "small-jam-jar", "linen-curtain"],
      pantryCompletedStoryGoalIds: [],
      seenGuideIds: ["firstPuzzle", "pantryFirstPurchase", "timeAttackIntro"],
    }));
  }, { language, id });
}

async function openView(page, view) {
  await dismissGuide(page);
  const selector = { album: ".album-panel", pantry: ".pantry-panel", puzzle: ".pack-block", timeAttack: ".time-attack-panel" }[view];
  if (!(await page.locator(".floating-nav__trigger").count())) {
    const directButton = page.locator(`button[data-destination="${view}"]`).first();
    if (await directButton.count()) {
      await directButton.scrollIntoViewIfNeeded();
      await directButton.click();
      await page.locator(selector).first().waitFor({ state: "visible", timeout: 6000 });
      return;
    }
  }
  if (!(await page.locator(".floating-nav__trigger").count()) && await page.locator(".play-screen__back").count()) {
    await page.locator(".play-screen__back").first().click();
    await page.locator(".app-shell").first().waitFor({ state: "visible", timeout: 6000 });
    const directButton = page.locator(`button[data-destination="${view}"]`).first();
    if (await directButton.count()) {
      await directButton.scrollIntoViewIfNeeded();
      await directButton.click();
      await page.locator(selector).first().waitFor({ state: "visible", timeout: 6000 });
      return;
    }
  }
  await page.locator(".floating-nav__trigger").first().waitFor({ state: "visible", timeout: 6000 });
  await page.locator(".floating-nav__trigger").first().click();
  await page.locator(`.floating-nav__item[data-view='${view}']`).click();
  await page.locator(selector).first().waitFor({ state: "visible", timeout: 6000 });
}

async function fillPuzzle(page, delay = 0) {
  const solution = ["11011", "11111", "10101", "11111", "01110"];
  const cells = page.locator(".puzzle-grid .puzzle-cell");
  for (let row = 0; row < solution.length; row += 1) {
    for (let column = 0; column < solution[row].length; column += 1) {
      if (solution[row][column] === "1") {
        await cells.nth(row * solution[row].length + column).click();
        if (delay) await page.waitForTimeout(delay);
      }
    }
  }
  await page.locator(".completion-banner").waitFor({ state: "visible", timeout: 5000 });
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function screenshot(page, target, language, order, scene) {
  const directory = resolve(RAW, target.id, language);
  mkdirSync(directory, { recursive: true });
  const path = resolve(directory, `${String(order).padStart(2, "0")}-${scene}.png`);
  await page.waitForTimeout(350);
  await page.screenshot({ path, fullPage: false });
  manifest.captures.push({
    target: target.id,
    language,
    order,
    scene,
    viewportCss: target.viewport,
    deviceScaleFactor: target.deviceScaleFactor,
    expectedPixels: target.expected,
    path: path.slice(ROOT.length + 1).replaceAll("\\", "/"),
    sha256: sha256(path),
  });
}

async function captureSet(browser, target, language) {
  const context = await browser.newContext({
    viewport: target.viewport,
    deviceScaleFactor: target.deviceScaleFactor,
    locale: language === "ko" ? "ko-KR" : "en-US",
    colorScheme: "light",
  });
  const page = await context.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await seedPlayer(page, language, `${target.id}-${language}`);
    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissIntro(page, language === "ko" ? "하늘" : "Mina");
    await dismissGuide(page);

    await page.locator(".puzzle-home-scene__play").click();
    await dismissGuide(page);
    await page.locator(".puzzle-grid .puzzle-cell").first().waitFor({ state: "visible", timeout: 5000 });
    const cells = page.locator(".puzzle-grid .puzzle-cell");
    for (const index of [0, 1, 3, 4, 5, 6, 7, 8, 9]) await cells.nth(index).click();
    await screenshot(page, target, language, 1, "puzzle-in-progress");

    for (const index of [10, 12, 14, 15, 16, 17, 18, 19, 21, 22, 23]) await cells.nth(index).click();
    await page.locator(".completion-banner").waitFor({ state: "visible", timeout: 5000 });
    await screenshot(page, target, language, 2, "puzzle-complete");

    await page.locator(".completion-actions button").first().click();
    await page.locator(".puzzle-grid .puzzle-cell").first().waitFor({ state: "visible", timeout: 5000 });
    await page.locator(".play-screen__back").first().click();
    await page.locator(".puzzle-home-scene, .pack-block").first().waitFor({ state: "visible", timeout: 5000 });
    await screenshot(page, target, language, 3, "puzzle-library");

    await openView(page, "album");
    await screenshot(page, target, language, 4, "picture-album");

    await openView(page, "pantry");
    await screenshot(page, target, language, 5, "pantry-room");
  } finally {
    await context.close();
  }
}

async function recordGameplay(browser, language) {
  const directory = resolve(VIDEO, language);
  mkdirSync(directory, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    locale: language === "ko" ? "ko-KR" : "en-US",
    colorScheme: "light",
    recordVideo: { dir: directory, size: { width: 430, height: 932 } },
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate((language) => {
      localStorage.clear();
      localStorage.setItem("pip-picture-pantry-language", language);
    }, language);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 7000 });
    await page.waitForTimeout(900);
    await dismissIntro(page, language === "ko" ? "하늘" : "Mina");
    await page.waitForTimeout(700);
    await page.locator(".puzzle-home-scene__play").click();
    await dismissGuide(page);
    await page.locator(".puzzle-grid .puzzle-cell").first().waitFor({ state: "visible", timeout: 5000 });
    await page.waitForTimeout(700);
    await fillPuzzle(page, 135);
    await page.waitForTimeout(1700);
    await page.locator(".completion-actions button").first().click();
    await page.waitForTimeout(900);
    await openView(page, "album");
    await page.waitForTimeout(1500);
    await openView(page, "pantry");
    await page.waitForTimeout(1800);
  } finally {
    await context.close();
  }
  const temporaryPath = await video.path();
  const finalPath = resolve(directory, `gameplay-${language}.webm`);
  renameSync(temporaryPath, finalPath);
  manifest.videos.push({
    language,
    viewportCss: { width: 430, height: 932 },
    path: finalPath.slice(ROOT.length + 1).replaceAll("\\", "/"),
    sha256: sha256(finalPath),
  });
}

async function main() {
  mkdirSync(RAW, { recursive: true });
  const server = isWindows
    ? spawn("cmd.exe", ["/d", "/s", "/c", `npm run dev -- --port ${PORT} --strictPort`], { cwd: ROOT, stdio: "ignore", windowsHide: true })
    : spawn(process.execPath, [resolve(ROOT, "node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], { cwd: ROOT, stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    if (!process.argv.includes("--video-only")) {
      for (const target of targets) {
        for (const language of ["en", "ko"]) await captureSet(browser, target, language);
      }
    }
    for (const language of ["en", "ko"]) await recordGameplay(browser, language);
  } finally {
    await browser?.close();
    if (isWindows && server.pid) spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
    else server.kill();
  }
  const manifestPath = resolve(OUT, "capture-manifest.json");
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Captured ${manifest.captures.length} current-app screenshots and ${manifest.videos.length} gameplay videos.`);
  console.log(manifestPath);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
