import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const errors = [];

const jsScanRoots = ["src", "scripts", "tests"];
const runtimeHtmlScanRoots = ["src/ui", "src/game", "src/data"];
const qaHtmlFixtureFiles = ["scripts/mobile_visual_check.js"];
const textFiles = [
  "src/styles.css",
  "package.json",
  "docs/ANDROID_RELEASE_STATUS.md"
];

function collectFiles(dir, predicate, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectFiles(fullPath, predicate, files);
      continue;
    }
    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function toProjectPath(filePath) {
  return relative(root, filePath).replace(/\\/g, "/");
}

function containsFragment(source, fragments) {
  return fragments.some((fragment) => source.includes(fragment));
}

for (const scanRoot of jsScanRoots) {
  const base = resolve(root, scanRoot);
  const files = collectFiles(base, (filePath) => filePath.endsWith(".js"));
  for (const filePath of files) {
    const bytes = readFileSync(filePath);
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      errors.push(`${toProjectPath(filePath)}: UTF-8 BOM is not allowed in source files`);
    }
    const source = bytes.toString("utf8");
    const projectPath = toProjectPath(filePath);
    if (/(\bwindow|\bglobalThis)\.confirm\s*\(/.test(source)) {
      errors.push(`${projectPath}: native confirm dialogs are not allowed in runtime or QA code`);
    }
  }
}

for (const scanRoot of runtimeHtmlScanRoots) {
  const base = resolve(root, scanRoot);
  const files = collectFiles(base, (filePath) => filePath.endsWith(".js"));
  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");
    const projectPath = toProjectPath(filePath);
    if (/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/.test(source)) {
      errors.push(`${projectPath}: runtime HTML string insertion is not allowed; use createElement/textContent/replaceChildren`);
    }
  }
}

for (const file of qaHtmlFixtureFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (/\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/.test(source)) {
    errors.push(file + ": QA fixtures must use createElement/textContent/append instead of HTML string insertion");
  }
}

for (const file of textFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (source.charCodeAt(0) === 0xfeff) {
    errors.push(`${file}: UTF-8 BOM is not allowed`);
  }
}

const koreanSourcePath = "src/i18n/ko.js";
const koreanSource = readFileSync(resolve(root, koreanSourcePath), "utf8");
const koreanMojibakeFragments = [
  "\u5a9b\ub6b0\u317d\uafa9\uc496\uc1f1\ubadc\uf9de\u6e72\u7570"
];
if (containsFragment(koreanSource, koreanMojibakeFragments)) {
  errors.push(`${koreanSourcePath}: Korean copy contains common mojibake fragments`);
}


const releaseDocMojibakeFiles = ["docs/ANDROID_RELEASE_STATUS.md"];
const releaseDocMojibakeFragments = [
  "\u613f\u6d39\uc496\ud283\uf9cd\ub349\ub085\uc908\u6fe1\uafa9\uc29c\uf9de\uafaa\ubefe\u8adb\uc10e\ubc76\u5ac4\uacd5\u6028\ub4e6\ucefb\u8e30\uafa9\uc7fe\u6c85\ub6af\uc623\u5bc3\u0080\uf9dd"
];
for (const file of releaseDocMojibakeFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (containsFragment(source, releaseDocMojibakeFragments)) {
    errors.push(`${file}: release notes contain common mojibake fragments`);
  }
}
const retiredStageLockReportSources = [
  ["src/ui/puzzleHubView.js", /unlock(?:Plan|Gate)|unlock-panel__(?:plan|gate)/],
  ["src/i18n/en.js", /unlock(?:Plan|Gate)/],
  ["src/i18n/ko.js", /unlock(?:Plan|Gate)/]
];
for (const [file, pattern] of retiredStageLockReportSources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": stage locks must show cost, Pantry step, and direct action without duplicate reports");
  }
}

const retiredCompactCopySources = [
  ["src/i18n/en.js", /daily:\s*\{[\s\S]{0,500}\breward:|timeAttack:\s*\{[\s\S]{0,900}\b(?:hubBody|coach(?:Body|Eyebrow|Title|Earn|Spend|Record)|noRecord):/],
  ["src/i18n/ko.js", /daily:\s*\{[\s\S]{0,500}\breward:|timeAttack:\s*\{[\s\S]{0,900}\b(?:hubBody|coach(?:Body|Eyebrow|Title|Earn|Spend|Record)|noRecord):/]
];
for (const [file, pattern] of retiredCompactCopySources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": compact hub and Time Attack copy must not restore retired reward or empty-state reports");
  }
}

const retiredQuickTravelCopySources = [
  ["src/ui/floatingNav.js", /(?:views\.(?:puzzleHint|albumHint|pantryHint|timeAttackHint|mapHint|quickJump)|floating-nav__trigger-(?:label|cue)|itemHint)/],
  ["src/i18n/en.js", /(?:puzzleHint|albumHint|pantryHint|timeAttackHint|mapHint|quickJump):/],
  ["src/i18n/ko.js", /(?:puzzleHint|albumHint|pantryHint|timeAttackHint|mapHint|quickJump):/]
];
for (const [file, pattern] of retiredQuickTravelCopySources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": quick travel must show destinations without report-style helper copy");
  }
}

const retiredReplayCopySources = [
  ["src/ui/puzzleHubView.js", /replayPicks\.(?:eyebrow|body|challenge)\b/],
  ["src/i18n/en.js", /eyebrow:\s*"Pip's replay picks"|body:\s*"Completed pictures|challenge:\s*"Replay"/],
  ["src/i18n/ko.js", /replayPicks:[\s\S]{0,500}(?:eyebrow|body|challenge):/]
];
for (const [file, pattern] of retiredReplayCopySources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": replay picks must keep one title, count, and direct picture choices");
  }
}

const retiredCollectionCopySources = [
  ["src/ui/albumView.js", /album\.note|album-note/],
  ["src/ui/appChrome.js", /t\("badges\.earned"\)/],
  ["src/ui/mapView.js", /badge-card__state|badges\.earned/],
  ["src/i18n/en.js", /earned:\s*"Badge earned"|note:\s*"Finished cards appear here\."/],
  ["src/i18n/ko.js", /earned:\s*"\u|note:\s*"\u/],
];
for (const [file, pattern] of retiredCollectionCopySources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": redundant Album note or earned-badge label must stay removed");
  }
}

const retiredChromeSources = [
  ["src/ui/appChrome.js", /renderPipStrip|renderFooter|getPipPuzzleLine/],
  ["src/i18n/en.js", /\bpipStrip\s*:|versionLabel\s*:/],
  ["src/i18n/ko.js", /\bpipStrip\s*:|versionLabel\s*:/]
];
for (const [file, pattern] of retiredChromeSources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": retired player-facing Pip strip or version footer must stay removed");
  }
}

const retiredSeasonSources = [
  ["src/ui/puzzleHubView.js", /createSeasonProgressCard|season-next-card/],
  ["src/i18n/en.js", /\bseasonProgress\s*:/],
  ["src/i18n/ko.js", /\bseasonProgress\s*:/]
];
for (const [file, pattern] of retiredSeasonSources) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (pattern.test(source)) {
    errors.push(file + ": retired season progress report UI must stay removed");
  }
}

const styles = readFileSync(resolve(root, "src/styles.css"), "utf8");
const staleCssRules = [
  {
    label: "legacy unlockable puzzle chip dot",
    pattern: /\.puzzle-chip\[data-access=["']unlockable["']\]::after/
  },
  {
    label: "retired Pantry planning and report styles",
    pattern: /\.pantry-(?:placement-advisor|savings-goal|earning-plan|earning-action|progress-board|progress-mission|progress-slot|display-plan|planning-deck)/
  },
  {
    label: "retired Pantry decoration card report styles",
    pattern: /\.pantry-(?:item-status|item-rarity|slot-note|swap-note|track-goal|item-savings(?:-meter)?)/
  },
  {
    label: "retired season progress report styles",
    pattern: /\.season-(?:progress|next-card)/
  },
  {
    label: "retired player-facing intro and Pip-strip styles",
    pattern: /\.(?:pip-strip|app-footer|brand-intro__(?:seal|launch-note|promise-strip|version|cast))/
  },
  {
    label: "retired replay glare and explainer styles",
    pattern: /\.replay-(?:picks-card::after|pick-button::before|picks-card__body)/
  },
  {
    label: "retired duplicate stage-lock report styles",
    pattern: /\.unlock-panel__(?:plan|gate)/
  },
  {
    label: "retired daily reward-note styles",
    pattern: /\.daily-reward-(?:note|amount)/
  },
  {
    label: "retired Time Attack coach card styles",
    pattern: /\.time-attack-coach-card/
  }
];

for (const rule of staleCssRules) {
  if (rule.pattern.test(styles)) {
    errors.push(`src/styles.css: remove ${rule.label}`);
  }
}

if (errors.length) {
  console.error("Source hygiene check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Source hygiene check passed.");
