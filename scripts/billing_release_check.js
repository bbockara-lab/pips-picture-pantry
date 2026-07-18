import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { en as englishCopy } from "../src/i18n/en.js";
import { ko as koreanCopy } from "../src/i18n/ko.js";

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
const pantrySource = readProjectFile("src/ui/pantryView.js");
const english = readProjectFile("src/i18n/en.js");
const korean = readProjectFile("src/i18n/ko.js");
const monetizationPlan = readProjectFile("docs/MONETIZATION_PLAN.md");
const economyDesignSpec = readProjectFile("docs/ECONOMY_DESIGN_SPEC.md");
const billingSetup = readProjectFile("docs/PLAY_CONSOLE_BILLING_SETUP.md");
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
requireIncludes(billingSource, "isCozySupportEntitlement", "src/game/billing.js");
requireIncludes(billingSource, "already-owned", "src/game/billing.js");
requireIncludes(billingSource, "grantCozySupportPack(\"purchase\")", "src/game/billing.js");
requireIncludes(billingSource, "grantCozySupportPack(\"restore\")", "src/game/billing.js");
const settingsSource = readProjectFile("src/ui/settingsView.js");
requireIncludes(settingsSource, "canPurchaseSupportPack", "src/ui/settingsView.js");
requireIncludes(settingsSource, "canRestoreSupportPack", "src/ui/settingsView.js");
requireIncludes(settingsSource, "product-unavailable", "src/ui/settingsView.js");
requireIncludes(manifest, "com.android.vending.BILLING", "AndroidManifest.xml");
requireIncludes(saveSource, "cozyPassPurchased", "src/game/save.js");
requireIncludes(saveSource, "grantCozySupportPack", "src/game/save.js");
requireIncludes(economySource, "COZY_PASS_SPOON_GRANT: 250", "src/data/economyConfig.js");
requireIncludes(pantrySource, "onOpenSupportPack", "src/ui/pantryView.js");
requireIncludes(pantrySource, "pantry-earning-support", "src/ui/pantryView.js");
requireIncludes(pantrySource, "pantry.earningSupportAction", "src/ui/pantryView.js");
requireIncludes(pantrySource, "pantry.earningSupportNote", "src/ui/pantryView.js");
requirePattern(pantrySource, /if\s*\(\s*needed\s*>\s*0\s*\)[\s\S]*pantry-earning-support/, "src/ui/pantryView.js");

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
  "supportNetworkError",
  "supportAlreadyOwned",
  "supportFailed",
  "supportFactSpoons",
  "supportFactStore",
  "supportFactAndroid",
  "supportFactRestore",
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
  korean.match(/settings:\s*{[\s\S]*?\n  },\n  badges:/)?.[0] || "",
  englishCopy.pantry.earningSupportAction,
  englishCopy.pantry.earningSupportNote,
  koreanCopy.pantry.earningSupportAction,
  koreanCopy.pantry.earningSupportNote
].join("\n");

const forbiddenCopy = /\bpaid\b|\bfree\b|유료|무료/i;
if (forbiddenCopy.test(userVisibleSupportCopy)) {
  errors.push("Support Pack user-facing copy must not say paid/free/유료/무료.");
}

const futurePackCopy = [
  englishCopy.packs.free,
  englishCopy.packs.bonusPack,
  englishCopy.packs.pricePreview,
  englishCopy.packs.paidPackHint,
  englishCopy.packs["cafe-window-plus"]?.note,
  englishCopy.packs["bakery-morning-plus"]?.note,
  englishCopy.packs["seasonal-pantry-plus"]?.note,
  englishCopy.packs["village-picnic-plus"]?.note,
  englishCopy.packs["sunny-festival-plus"]?.note,
  koreanCopy.packs.free,
  koreanCopy.packs.bonusPack,
  koreanCopy.packs.pricePreview,
  koreanCopy.packs.paidPackHint,
  koreanCopy.packs["cafe-window-plus"]?.note,
  koreanCopy.packs["bakery-morning-plus"]?.note,
  koreanCopy.packs["seasonal-pantry-plus"]?.note,
  koreanCopy.packs["village-picnic-plus"]?.note,
  koreanCopy.packs["sunny-festival-plus"]?.note
].filter(Boolean).join("\n");

if (forbiddenCopy.test(futurePackCopy)) {
  errors.push("Future pack player-facing copy must stay in included/optional-set language, not paid/free/유료/무료.");
}

for (const [label, source] of [
  ["docs/MONETIZATION_PLAN.md", monetizationPlan],
  ["docs/ECONOMY_DESIGN_SPEC.md", economyDesignSpec],
  ["docs/PLAY_CONSOLE_BILLING_SETUP.md", billingSetup],
  ["docs/ANDROID_RELEASE_STATUS.md", releaseStatus],
  ["docs/PRIVACY_POLICY.md", privacyPolicy],
  ["docs/PLAY_CONSOLE_STORE_LISTING.md", storeListing]
]) {
  requireIncludes(source, "pip_cozy_support", label);
}

requireIncludes(monetizationPlan, "USD 0.99", "docs/MONETIZATION_PLAN.md");
requireIncludes(monetizationPlan, "KRW 1,100", "docs/MONETIZATION_PLAN.md");
requireIncludes(economyDesignSpec, "Pip Support Pack", "docs/ECONOMY_DESIGN_SPEC.md");
requireIncludes(economyDesignSpec, "USD 0.99", "docs/ECONOMY_DESIGN_SPEC.md");
requireIncludes(economyDesignSpec, "KRW 1,100", "docs/ECONOMY_DESIGN_SPEC.md");
requireIncludes(economyDesignSpec, "@capgo/native-purchases", "docs/ECONOMY_DESIGN_SPEC.md");
requirePattern(economyDesignSpec, /COZY_SUPPORT_PRODUCT_ID[\s\S]*pip_cozy_support/, "docs/ECONOMY_DESIGN_SPEC.md");
for (const legacyNeedle of [
  "com.sunnyspoonstudios.pipspicturepantry.cozy_pass",
  "pips_spoons_150",
  "pips_spoons_400",
  "pips_spoons_950",
  "@capacitor-community/in-app-purchases",
  "cordova-plugin-purchase",
  "Tiny Jar",
  "Cookie Tin",
  "Full Pantry"
]) {
  if (economyDesignSpec.includes(legacyNeedle)) {
    errors.push("docs/ECONOMY_DESIGN_SPEC.md still references legacy Billing product `" + legacyNeedle + "`.");
  }
}
requireIncludes(billingSetup, "managed product", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "non-consumable", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "250 spoons", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "USD 0.99", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "KRW 1,100", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "English title: Pip Support Pack", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requireIncludes(billingSetup, "Korean title: Pip 응원팩", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requirePattern(billingSetup, /internal tester[\s\S]*purchase\/restore/i, "docs/PLAY_CONSOLE_BILLING_SETUP.md");
requirePattern(releaseStatus, /Play Console setup required[\s\S]*managed product/i, "docs/ANDROID_RELEASE_STATUS.md");
requirePattern(releaseStatus, /PLAY_CONSOLE_BILLING_SETUP\.md/, "docs/ANDROID_RELEASE_STATUS.md");
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
