import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const errors = [];

const jsScanRoots = ["src", "scripts", "tests"];
const runtimeHtmlScanRoots = ["src/ui", "src/game", "src/data"];
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
const styles = readFileSync(resolve(root, "src/styles.css"), "utf8");
const staleCssRules = [
  {
    label: "legacy unlockable puzzle chip dot",
    pattern: /\.puzzle-chip\[data-access=["']unlockable["']\]::after/
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
