import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];

function readProjectFile(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function requireIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    errors.push(label + " is missing `" + needle + "`.");
  }
}

function requirePattern(source, pattern, label) {
  if (!pattern.test(source)) {
    errors.push(label + " does not match " + pattern + ".");
  }
}

const packageJson = JSON.parse(readProjectFile("package.json"));
const billingSource = readProjectFile("src/game/billing.js");
const manifest = readProjectFile("android/app/src/main/AndroidManifest.xml");
const saveSource = readProjectFile("src/game/save.js");
const economySource = readProjectFile("src/data/economyConfig.js");
const english = readProjectFile("src/i18n/en.js");
const korean = readProjectFile("src/i18n/ko.js");
const monetizationPlan = readProjectFile("docs/MONETIZATION_PLAN.md");
const releaseStatus = readProjectFile("docs/ANDROID_RELEASE_STATUS.md");
const privacyPolicy = readProjectFile("docs/PRIVACY_POLICY.md");
const storeListing = readProjectFile("docs/PLAY_CONSOLE_STORE_LISTING.md");

if (!packageJson.dependencies?.["@capgo/native-purchases"]) {
  errors.push("package.json must include @capgo/native-purchases for Android Billing.");
}

requireIncludes(billingSource, "COZY_SUPPORT_PRODUCT_ID = \"pip_cozy_support\"", "src/game/billing.js");
requireIncludes(billingSource, "@capgo/native-purchases", "src/game/billing.js");
requireIncludes(billingSource, "NativePurchases.purchaseProduct", "src/game/billing.js");
requireIncludes(billingSource, "NativePurchases.restorePurchases", "src/game/billing.js");
requireIncludes(billingSource, "grantCozySupportPack(\"purchase\")", "src/game/billing.js");
requireIncludes(billingSource, "grantCozySupportPack(\"restore\")", "src/game/billing.js");
requireIncludes(manifest, "com.android.vending.BILLING", "AndroidManifest.xml");
requireIncludes(saveSource, "cozyPassPurchased", "src/game/save.js");
requireIncludes(saveSource, "grantCozySupportPack", "src/game/save.js");
requireIncludes(economySource, "COZY_PASS_SPOON_GRANT: 250", "src/data/economyConfig.js");

const requiredI18nKeys = [
  "supportTitle",
  "supportBody",
  "supportOwnedBody",
  "supportOwned",
  "supportChecking",
  "supportAndroidOnly",
  "supportReady",
  "supportCancelled",
  "supportNotFound",
  "supportRestore",
  "supportBuy",
  "supportPricePending"
];

for (const key of requiredI18nKeys) {
  requirePattern(english, new RegExp("\\b" + key + "\\b"), "src/i18n/en.js");
  requirePattern(korean, new RegExp("\\b" + key + "\\b"), "src/i18n/ko.js");
}

const userVisibleSupportCopy = [
  english.match(/settings:\s*{[\s\S]*?\n  },\n  badges:/)?.[0] || "",
  korean.match(/settings:\s*{[\s\S]*?\n  },\n  badges:/)?.[0] || ""
].join("\n");

const forbiddenCopy = /\bpaid\b|\bfree\b|유료|무료/i;
if (forbiddenCopy.test(userVisibleSupportCopy)) {
  errors.push("Support Pack user-facing copy must not say paid/free/유료/무료.");
}

for (const [label, source] of [
  ["docs/MONETIZATION_PLAN.md", monetizationPlan],
  ["docs/ANDROID_RELEASE_STATUS.md", releaseStatus],
  ["docs/PRIVACY_POLICY.md", privacyPolicy],
  ["docs/PLAY_CONSOLE_STORE_LISTING.md", storeListing]
]) {
  requireIncludes(source, "pip_cozy_support", label);
}

requireIncludes(monetizationPlan, "USD 0.99", "docs/MONETIZATION_PLAN.md");
requireIncludes(monetizationPlan, "KRW 1,100", "docs/MONETIZATION_PLAN.md");
requirePattern(releaseStatus, /Play Console setup required[\s\S]*managed product/i, "docs/ANDROID_RELEASE_STATUS.md");
requirePattern(releaseStatus, /purchase\/restore/i, "docs/ANDROID_RELEASE_STATUS.md");

if (errors.length) {
  console.error("Billing release check failed:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exit(1);
}

console.log("Billing release check passed.");
console.log("Product: pip_cozy_support / one-time support pack / 250 spoons.");
