"use strict";

const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret, defineString } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { GoogleAuth } = require("google-auth-library");
const {
  createAppleJwt,
  fingerprint,
  formatSnapshot,
  normalizeApplePurchase,
  normalizeAppleVersion,
  normalizeGoogleRelease,
} = require("./monitor-core");

initializeApp();

const telegramBotToken = defineSecret("STORE_MONITOR_TELEGRAM_BOT_TOKEN");
const applePrivateKey = defineSecret("APP_STORE_CONNECT_PRIVATE_KEY");
const appleIssuerId = defineString("APP_STORE_CONNECT_ISSUER_ID", { default: "" });
const appleKeyId = defineString("APP_STORE_CONNECT_KEY_ID", { default: "" });
const appBundleId = defineString("STORE_MONITOR_BUNDLE_ID", {
  default: "com.sunnyspoonstudios.pipspicturepantry",
});

const STATE_PATH = "storeReleaseMonitor/current";
const ERROR_REPEAT_MS = 6 * 60 * 60 * 1000;

exports.storeReleaseMonitor = onSchedule(
  {
    schedule: "every 30 minutes",
    timeZone: "America/New_York",
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "256MiB",
    retryCount: 0,
    secrets: [telegramBotToken, applePrivateKey],
  },
  async () => {
    const stateRef = getFirestore().doc(STATE_PATH);
    const previousDoc = await stateRef.get();
    const previous = previousDoc.exists ? previousDoc.data() : {};
    let targetChatId = previous.telegramChatId || null;

    try {
      validateConfiguration();
      if (!targetChatId) {
        targetChatId = await discoverTelegramChatId();
        await stateRef.set({ telegramChatId: targetChatId }, { merge: true });
      }
      const [googlePlay, appStore] = await Promise.all([
        fetchGooglePlayState(),
        fetchAppStoreState(),
      ]);
      const snapshot = {
        bundleId: appBundleId.value(),
        googlePlay,
        appStore,
      };
      const stateFingerprint = fingerprint(snapshot);
      const changed = previous.fingerprint !== stateFingerprint;

      await stateRef.set({
        snapshot,
        fingerprint: stateFingerprint,
        checkedAt: FieldValue.serverTimestamp(),
        lastSuccessfulAt: FieldValue.serverTimestamp(),
        lastErrorFingerprint: null,
        lastErrorNotifiedAtMs: null,
      }, { merge: true });

      if (changed) {
        const prefix = previous.fingerprint ? "🔔 상태 변경 감지\n" : "✅ 스토어 감시 시작\n";
        await sendTelegramMessage(targetChatId, `${prefix}${formatSnapshot(snapshot)}`);
      }

      logger.info("Store release monitor completed", { changed, stateFingerprint });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const errorFingerprint = fingerprint({ message });
      const lastNotifiedAt = Number(previous.lastErrorNotifiedAtMs || 0);
      const shouldNotify = previous.lastErrorFingerprint !== errorFingerprint
        || Date.now() - lastNotifiedAt >= ERROR_REPEAT_MS;

      await stateRef.set({
        checkedAt: FieldValue.serverTimestamp(),
        lastError: message,
        lastErrorFingerprint: errorFingerprint,
        ...(shouldNotify ? { lastErrorNotifiedAtMs: Date.now() } : {}),
      }, { merge: true });

      if (shouldNotify && targetChatId) {
        await sendTelegramMessage(targetChatId, `⚠️ Sunny Spoon 스토어 감시 오류\n${message}`);
      }
      logger.error("Store release monitor failed", { message, errorFingerprint });
    }
  },
);

function validateConfiguration() {
  const missing = [];
  if (!appleIssuerId.value()) missing.push("APP_STORE_CONNECT_ISSUER_ID");
  if (!appleKeyId.value()) missing.push("APP_STORE_CONNECT_KEY_ID");
  if (!applePrivateKey.value()) missing.push("APP_STORE_CONNECT_PRIVATE_KEY");
  if (!telegramBotToken.value()) missing.push("STORE_MONITOR_TELEGRAM_BOT_TOKEN");
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(", ")}`);
}

async function discoverTelegramChatId() {
  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken.value()}/getUpdates?offset=-1&limit=1&timeout=0`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram getUpdates ${response.status}: ${body.slice(0, 500)}`);
  }
  const body = await response.json();
  const update = body.result?.[0];
  const message = update?.message || update?.channel_post;
  const chatId = message?.chat?.id;
  if (!chatId) {
    throw new Error("Telegram chat not registered. Open the dedicated bot and send /start, then run the monitor again.");
  }
  return String(chatId);
}

async function fetchGooglePlayState() {
  const packageName = encodeURIComponent(appBundleId.value());
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/androidpublisher"] });
  const client = await auth.getClient();
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/tracks/production/releases`;
  const response = await client.request({ url, method: "GET" });
  return {
    track: "production",
    releases: (response.data.releases || []).map(normalizeGoogleRelease),
  };
}

async function fetchAppStoreState() {
  const token = createAppleJwt({
    issuerId: appleIssuerId.value(),
    keyId: appleKeyId.value(),
    privateKey: applePrivateKey.value(),
  });
  const headers = { Authorization: `Bearer ${token}` };
  const apps = await appleGet(`/v1/apps?filter[bundleId]=${encodeURIComponent(appBundleId.value())}&limit=1`, headers);
  const app = apps.data?.[0];
  if (!app?.id) throw new Error(`App Store app not found for ${appBundleId.value()}`);

  const [versions, purchases] = await Promise.all([
    appleGet(`/v1/apps/${app.id}/appStoreVersions?filter[platform]=IOS&sort=-createdDate&limit=10&fields[appStoreVersions]=versionString,appStoreState,createdDate`, headers),
    appleGet(`/v1/apps/${app.id}/inAppPurchasesV2?limit=200&fields[inAppPurchases]=name,productId,inAppPurchaseType,state`, headers),
  ]);
  return {
    appId: app.id,
    versions: (versions.data || []).map(normalizeAppleVersion),
    purchases: (purchases.data || []).map(normalizeApplePurchase)
      .sort((a, b) => a.productId.localeCompare(b.productId)),
  };
}

async function appleGet(path, headers) {
  const response = await fetch(`https://api.appstoreconnect.apple.com${path}`, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`App Store Connect ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

async function sendTelegramMessage(chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken.value()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram ${response.status}: ${body.slice(0, 500)}`);
  }
}
