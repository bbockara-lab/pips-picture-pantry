import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const errors = [];

const jsScanRoots = ["src", "scripts", "tests"];
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

for (const file of textFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (source.charCodeAt(0) === 0xfeff) {
    errors.push(`${file}: UTF-8 BOM is not allowed`);
  }
}

const koreanSourcePath = "src/i18n/ko.js";
const koreanSource = readFileSync(resolve(root, koreanSourcePath), "utf8");
const mojibakeFragments = /[媛뚰ㅽ꾩쒖쇱뫜吏湲異]/;
if (mojibakeFragments.test(koreanSource)) {
  errors.push(`${koreanSourcePath}: Korean copy contains common mojibake fragments`);
}


const releaseDocMojibakeFiles = ["docs/ANDROID_RELEASE_STATUS.md"];
const releaseDocMojibakeFragments = /[愿洹쒖튃留덉낅줈濡꾩슜吏꾪뻾諛섎뱶嫄곕怨듦컻踰꾩쟾沅뚯옣寃利]/;
for (const file of releaseDocMojibakeFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (releaseDocMojibakeFragments.test(source)) {
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
