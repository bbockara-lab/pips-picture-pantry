import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const requiredFiles = [
  "store-assets/index.html",
  "store-assets/site/styles.css",
  "store-assets/site/app.js",
  "store-assets/site/sunny-spoon-studios-social-v1.png",
  "store-assets/privacy-policy.html",
  "store-assets/social-campaigns/launch-2026/01-meet-pip.png",
  "store-assets/social-campaigns/launch-2026/02-hidden-picture.png",
  "store-assets/social-campaigns/launch-2026/04-nine-keepsakes.png",
  "store-assets/social-campaigns/launch-2026/05-grandpa-clock.png",
  "store-assets/social-campaigns/launch-2026/06-quiet-puzzle-break.png",
  "store-assets/youtube/sunny-spoon-studios-youtube-avatar-v1.png",
];

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing required studio-site file: ${file}`);
}

const html = read("store-assets/index.html");
const css = read("store-assets/site/styles.css");
const js = read("store-assets/site/app.js");

for (const marker of [
  "Studio site v0.1.8",
  "privacy-policy.html",
  "./site/styles.css?v=018",
  "./site/app.js?v=018",
  "@SunnySpoonStudios",
  "sunnyspoonstudios@gmail.com",
  'class="language-toggle"',
  'class="site-header"',
  'class="hero-art"',
  'class="phone-gallery"',
  'id="support"',
  "support.google.com/googleplay/workflow/9813244",
  "reportaproblem.apple.com",
]) {
  assert(html.includes(marker), `Missing HTML marker: ${marker}`);
}

for (const marker of ["333", "48+", "9"]) {
  assert(html.includes(marker), `Missing product metric: ${marker}`);
}

for (const marker of [
  "@media (max-width: 820px)",
  "prefers-reduced-motion",
  ".hero-art",
  ".phone-gallery",
  ".support-grid",
  ".support-card",
]) {
  assert(css.includes(marker), `Missing CSS marker: ${marker}`);
}

for (const marker of [
  "sunny-spoon-language",
  "data-i18n",
  "한국어",
  "포근한 퍼즐",
  "applyLanguage",
]) {
  assert(js.includes(marker), `Missing language marker: ${marker}`);
}

const translationKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
for (const key of new Set(translationKeys)) {
  assert(js.includes(`"${key}"`) || js.includes(`${key}:`), `Missing translation key: ${key}`);
}

const localSources = [...html.matchAll(/\bsrc="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((source) => !/^(?:https?:|data:|\/\/)/.test(source));
for (const source of localSources) {
  const normalized = source.replace(/^\.\//, "").split("?")[0];
  assert(
    fs.existsSync(path.join(root, "store-assets", normalized)),
    `HTML references a missing local asset: ${source}`,
  );
}

for (const staleReference of [
  "site/images/pip-hero.png",
  "phone-puzzle.png",
  "phone-shelves.png",
  "03-fill-the-shelves.png",
]) {
  assert(!html.includes(staleReference), `Stale or rejected asset reference remains: ${staleReference}`);
}

assert(!/google-analytics|googletagmanager|facebook\.net|pixel/i.test(html), "Unexpected tracking code found");

console.log(`Studio site check passed: ${requiredFiles.length} files, ${new Set(translationKeys).size} translation keys, ${localSources.length} local image references.`);

for (const staleClass of ["section-shell", "stats-grid", "status-row", "Production release under review", "Coming soon"]) {
  assert(!html.includes(staleClass), `Stale studio-site contract remains: ${staleClass}`);
}
assert(css.includes(".header-inner"), "Missing centered header contract");
assert(css.includes(".feature-section__inner"), "Missing centered feature-section inner contract");
assert(css.includes(".studio-section { display: block; }"), "Studio section must not reserve an empty grid column");
assert(css.includes(".connect-copy"), "Connect copy must be grouped into one grid column");
assert(css.includes('.feature-list li::before { content: "✦"'), "Broken feature bullet CSS");
assert(!/[?]쒓|[?]ш렐|寃뚯엫/.test(html + js), "Corrupted Korean text remains");
