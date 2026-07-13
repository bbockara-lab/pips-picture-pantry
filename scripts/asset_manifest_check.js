import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { assetRegistry } from "../src/data/assetManifest.js";
import { pantryDecorations, pantrySlots } from "../src/data/decorations.js";
import { puzzlePacks } from "../src/data/packs.js";

const root = process.cwd();
const errors = [];
const warnings = [];
const styles = readFileSync(resolve(root, "src/styles.css"), "utf8");
const brandIntroSource = readFileSync(resolve(root, "src/ui/brandIntro.js"), "utf8");
const runtimeArtSource = readFileSync(resolve(root, "src/data/runtimeArt.js"), "utf8");
const pantryViewSource = readFileSync(resolve(root, "src/ui/pantryView.js"), "utf8");

for (const asset of assetRegistry) {
  const label = `${asset.id} (${asset.usage})`;
  if (!asset.id || !asset.usage || !asset.path) {
    errors.push(`${label}: missing id, usage, or path`);
    continue;
  }
  if (asset.sourceType !== "raster") {
    errors.push(`${label}: player-facing assets must be raster PNG/WebP/JPG, not ${asset.sourceType}`);
  }
  if (asset.visible && asset.approval === "placeholder") {
    errors.push(`${label}: visible placeholder art is blocked`);
  }
  if (asset.visible && asset.approval === "candidate") {
    errors.push(`${label}: visible candidate art must be explicitly approved before wiring to UI`);
  }
  if (asset.visible && String(asset.identityStatus || "").startsWith("rejected")) {
    errors.push(`${label}: rejected character identity asset cannot be visible`);
  }
  if (asset.visible && ["guide-art", "stage-reward-art", "opening-key-visual"].includes(asset.usage) && asset.identityStatus && asset.identityStatus !== "baseline-sunny-spoon-pip" && asset.identityStatus !== "approved-character-continuity") {
    errors.push(`${label}: visible character/guide art must carry approved Sunny Spoon character continuity status`);
  }
  if (!existsSync(resolve(root, asset.path))) {
    errors.push(`${label}: missing file ${asset.path}`);
  }
  if (asset.visible && asset.usage === "studio-bumper" && asset.identityStatus !== "approved-studio-continuity") {
    errors.push(`${label}: visible studio bumper art must carry approved Sunny Spoon studio continuity status`);
  }
  if (asset.visible && asset.mustReplaceBeforeMajorArtPass) {
    warnings.push(`${label}: temporary visible asset, replace during major art pass`);
  }
}

const approvedStudioBumperAssets = assetRegistry.filter((asset) => asset.usage === "studio-bumper" && asset.visible && asset.approval === "approved");
if (approvedStudioBumperAssets.length !== 1) {
  errors.push("src/data/assetManifest.js: exactly one approved visible studio-bumper asset is required for the launch studio stage");
} else {
  const studioBumperAsset = approvedStudioBumperAssets[0];
  const basename = studioBumperAsset.path.split(/[\\/]/).pop();
  if (!brandIntroSource.includes(basename)) {
    errors.push("src/ui/brandIntro.js: approved studio bumper asset is not imported by the launch studio stage");
  }
  if (!brandIntroSource.includes("isRuntimeStudioBumperArtApproved") || !runtimeArtSource.includes(studioBumperAsset.id)) {
    errors.push("src/ui/brandIntro.js: studio bumper art must be guarded by the approved runtime art allowlist");
  }
}

// Opening seal must use the current approved Pip chrome asset, not the older app-icon crop.
if (brandIntroSource.includes("../assets/app-icons/app-icon-192.png") || brandIntroSource.includes("../assets/app-icons/app-icon-512.png")) {
  errors.push("src/ui/brandIntro.js: opening seal must not import old app-icon crops; use approved Pip character chrome art");
}
if (!brandIntroSource.includes("pip-chrome-v2.png")) {
  errors.push("src/ui/brandIntro.js: opening seal must import approved pip-chrome-v2 art");
}
if (!brandIntroSource.includes("pipSealUrl")) {
  errors.push("src/ui/brandIntro.js: opening seal image should be explicit and easy to update during the final icon swap");
}

if (/\.spoon-icon::(?:before|after)\s*\{[^}]*content\s*:\s*[\"'][^\"']+[\"']/s.test(styles)) {
  errors.push("src/styles.css: .spoon-icon pseudo-elements still draw CSS currency art");
}


const cssArtSelectors = [
  /\.decoration-icon(?:\s|::)/,
  /\.badge-icon::/,
  /\.menu-icon::/,
  /\.floating-nav-icon::/
];

for (const pattern of cssArtSelectors) {
  if (pattern.test(styles)) {
    errors.push("src/styles.css: " + pattern + " suggests CSS-drawn player-facing art");
  }
}


const runtimeFiles = [
  "src/main.js",
  "src/styles.css",
  ...collectRuntimeFiles(resolve(root, "src/ui")),
  ...collectRuntimeFiles(resolve(root, "src/data")).filter((file) => !file.endsWith("assetManifest.js")),
  ...collectRuntimeFiles(resolve(root, "src/game"))
];


const pantrySlotIds = new Set(pantrySlots.map((slot) => slot.id));
const decorationIds = new Set();
const decorationAssetIds = new Set();
const pantryDecorationAssets = new Map(
  assetRegistry
    .filter((asset) => asset.usage === "pantry-decoration")
    .map((asset) => [asset.id, asset])
);
const rarityCostRanges = {
  starter: [0, 0],
  common: [18, 60],
  cozy: [80, 160],
  rare: [200, 380],
  premium: [500, 900]
};

if (pantrySlots.length !== 5) {
  errors.push("src/data/decorations.js: Pantry MVP must keep exactly 5 physical room slots unless the room layout is redesigned");
}

for (const decoration of pantryDecorations) {
  const label = decoration?.id || "unknown-decoration";
  if (!decoration?.id || !decoration.assetId || !decoration.slot || !decoration.rarity) {
    errors.push(label + ": decoration must declare id, assetId, slot, and rarity");
    continue;
  }
  if (decorationIds.has(decoration.id)) {
    errors.push(label + ": duplicate decoration id");
  }
  decorationIds.add(decoration.id);
  if (decorationAssetIds.has(decoration.assetId)) {
    errors.push(label + ": duplicate decoration assetId " + decoration.assetId);
  }
  decorationAssetIds.add(decoration.assetId);
  if (!pantrySlotIds.has(decoration.slot)) {
    errors.push(label + ": invalid pantry slot " + decoration.slot);
  }
  const range = rarityCostRanges[decoration.rarity];
  if (!range) {
    errors.push(label + ": unknown decoration rarity " + decoration.rarity);
  } else {
    const cost = Number(decoration.cost);
    const passOnlyPremium = decoration.rarity === "premium" && cost === 0;
    if (!Number.isFinite(cost) || cost < 0 || (!passOnlyPremium && (cost < range[0] || cost > range[1]))) {
      errors.push(label + ": cost " + decoration.cost + " is outside " + decoration.rarity + " range " + range[0] + "-" + range[1]);
    }
  }
  const artAsset = pantryDecorationAssets.get(decoration.assetId);
  if (!artAsset) {
    errors.push(label + ": assetId " + decoration.assetId + " is not registered as pantry-decoration art");
  } else if (!artAsset.visible || artAsset.approval !== "approved") {
    errors.push(label + ": assetId " + decoration.assetId + " must be approved visible pantry-decoration art");
  }
}

const starterDecorations = pantryDecorations.filter((decoration) => decoration.rarity === "starter");
if (starterDecorations.length < 1 || starterDecorations.some((decoration) => Number(decoration.cost) !== 0)) {
  errors.push("src/data/decorations.js: Pantry must include at least one free starter decoration for onboarding");
}

const approvedPantryDecorationCount = assetRegistry.filter((asset) => asset.usage === "pantry-decoration" && asset.visible && asset.approval === "approved").length;
if (approvedPantryDecorationCount === 0) {
  if (!pantryViewSource.includes("pantry-panel-paused")) {
    errors.push("src/ui/pantryView.js: Pantry must stay visibly paused until approved decoration art exists");
  }
  if (/buyDecoration|equipDecoration|pantry-shop/.test(pantryViewSource)) {
    errors.push("src/ui/pantryView.js: shop/equip UI must not open while no approved decoration art exists");
  }
}

const stageArtSource = readFileSync(resolve(root, "src/data/stageArt.js"), "utf8");
const stageRewardAssets = new Map(
  assetRegistry
    .filter((asset) => asset.usage === "stage-reward-art")
    .map((asset) => [asset.stagePackId, asset])
);
const freeProgressionPacks = puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait");
for (const pack of freeProgressionPacks) {
  const label = "stage reward art for " + pack.id;
  const asset = stageRewardAssets.get(pack.id);
  if (!asset) {
    errors.push(label + ": missing approved asset manifest record");
    continue;
  }
  if (!asset.visible || asset.approval !== "approved" || asset.identityStatus !== "approved-character-continuity") {
    errors.push(label + ": must be approved, visible, and character-continuity gated");
  }
  if (!stageArtSource.includes(`"${pack.id}":`) || !stageArtSource.includes(asset.path.split(/[\\/]/).pop())) {
    errors.push(label + ": stageArt.js does not expose approved runtime art");
  }
}

const guideDialogSource = readFileSync(resolve(root, "src/ui/guideDialog.js"), "utf8");
if (guideDialogSource.includes("pip-cast-redesign-concept-v1-web.jpg") && !guideDialogSource.includes("isRuntimeGuideArtApproved")) {
  errors.push("src/ui/guideDialog.js: guide art imports must be guarded by the approved runtime art allowlist");
}
if (!guideDialogSource.includes("pip-chrome-v2.png")) {
  errors.push("src/ui/guideDialog.js: guide dialogs must use approved pip-chrome-v2 art for Pip continuity");
}
if (!guideDialogSource.includes('GUIDE_ART_ASSET_ID = "pip-chrome-v2"') || !runtimeArtSource.includes('"pip-chrome-v2"')) {
  errors.push("src/ui/guideDialog.js: guide dialog art must be guarded by the pip-chrome-v2 runtime allowlist");
}

const approvedVisiblePaths = new Set(
  assetRegistry
    .filter((asset) => asset.visible && ["approved", "temporary-approved"].includes(asset.approval))
    .map((asset) => normalizeAssetPath(asset.path))
);
const blockedRuntimeAssets = assetRegistry.filter((asset) => {
  const normalizedPath = normalizeAssetPath(asset.path);
  if (approvedVisiblePaths.has(normalizedPath)) {
    return false;
  }
  return asset.approval === "candidate" || asset.approval === "rejected" || asset.visible === false;
});

for (const file of runtimeFiles) {
  const source = readFileSync(file, "utf8");
  const relativeFile = normalizeAssetPath(file.slice(root.length + 1));
  if (/assetManifest\.js/.test(source)) {
    errors.push(`${relativeFile}: imports assetManifest into runtime; use a small approved runtime allowlist instead`);
  }
  for (const asset of blockedRuntimeAssets) {
    const basename = asset.path.split(/[\\/]/).pop();
    if (source.includes(basename)) {
      errors.push(`${relativeFile}: imports or references blocked asset ${asset.id} (${asset.approval}, visible=${asset.visible})`);
    }
  }
}

function collectRuntimeFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return collectRuntimeFiles(fullPath);
    }
    return /\.(js|css)$/.test(entry.name) ? [fullPath] : [];
  });
}

function normalizeAssetPath(value) {
  return String(value || "").replace(/\\/g, "/");
}
const playerCopyFiles = [
  "src/i18n/en.js",
  "src/i18n/ko.js"
];
const blockedCopyTerms = [
  /prototype/i,
  /asset rule/i,
  /PNG\/WebP/i,
  /candidate art/i,
  /\uC2E4\uD5D8/,
  /\uC5D0\uC14B/,
  /\uD6C4\uBCF4/
];

for (const file of playerCopyFiles) {
  const copy = readFileSync(resolve(root, file), "utf8");
  for (const term of blockedCopyTerms) {
    if (term.test(copy)) {
      errors.push(file + ": player-facing copy contains blocked development term " + term);
    }
  }
}

if (warnings.length) {
  console.warn(["Asset manifest warnings:", ...warnings.map((item) => `- ${item}`)].join("\n"));
}
if (errors.length) {
  console.error(["Asset manifest check failed:", ...errors.map((item) => `- ${item}`)].join("\n"));
  process.exit(1);
}
console.log(`Asset manifest check passed: ${assetRegistry.length} assets registered.`);

