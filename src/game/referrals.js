import { getReferralMailboxMessages, mergeReferralMailboxMessages } from "./save.js";
import { t } from "../i18n/index.js";
import { Capacitor, registerPlugin } from "@capacitor/core";

const IDENTITY_KEY = "pips-picture-pantry:v0.1:referral-identity";
const PENDING_CODE_KEY = "pips-picture-pantry:v0.1:pending-referral-code";
const API_URL = "https://us-central1-sunny-spoon-pantry.cloudfunctions.net/referralApi";
const INVITE_BASE_URL = "https://sunny-spoon-pantry.web.app/invite/";
const InstallReferrer = registerPlugin("InstallReferrer");

export function parseReferralCode(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "pipspicturepantry:" && parsed.hostname !== "invite") return null;
    if (parsed.protocol.startsWith("http") && !parsed.pathname.startsWith("/invite")) return null;
    const code = String(parsed.searchParams.get("ref") || "").trim().toUpperCase();
    return /^[A-Z2-9]{8}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

export function rememberReferralUrl(url, storage = globalThis.localStorage) {
  const code = parseReferralCode(url);
  if (code) storage?.setItem(PENDING_CODE_KEY, code);
  return code;
}

export async function syncReferralMailbox({ fetchImpl = globalThis.fetch, storage = globalThis.localStorage } = {}) {
  if (!fetchImpl || !storage) return { messages: [], newCount: 0 };
  const identity = getOrCreateIdentity(storage);
  const registration = await callApi("register", identity, {}, fetchImpl);
  const pendingCode = storage.getItem(PENDING_CODE_KEY);
  if (pendingCode) {
    const result = await callApi("redeem", identity, { referralCode: pendingCode }, fetchImpl);
    if (result.accepted || result.reason === "already-redeemed" || result.reason === "self-referral") {
      storage.removeItem(PENDING_CODE_KEY);
    }
  }
  const inbox = await callApi("inbox", identity, {}, fetchImpl);
  const before = new Set(getReferralMailboxMessages().map((message) => message.id));
  const messages = mergeReferralMailboxMessages(inbox.messages || []);
  return { referralCode: registration.referralCode, messages, newCount: messages.filter((message) => !before.has(message.id)).length };
}

export async function captureAndroidInstallReferral(storage = globalThis.localStorage) {
  if (Capacitor.getPlatform() !== "android") return null;
  try {
    const { referrer } = await InstallReferrer.getInstallReferrer();
    const params = new URLSearchParams(referrer || "");
    const code = String(params.get("referral_code") || "").toUpperCase();
    if (!/^[A-Z2-9]{8}$/.test(code)) return null;
    storage?.setItem(PENDING_CODE_KEY, code);
    return code;
  } catch {
    return null;
  }
}

export async function claimReferralRewardRemote(messageId, claimNonce, { fetchImpl = globalThis.fetch, storage = globalThis.localStorage } = {}) {
  const identity = getOrCreateIdentity(storage);
  return callApi("claim", identity, { messageId, claimNonce }, fetchImpl);
}

export async function shareReferralInvite({ fetchImpl = globalThis.fetch, storage = globalThis.localStorage } = {}) {
  const identity = getOrCreateIdentity(storage);
  const registration = await callApi("register", identity, {}, fetchImpl);
  const url = `${INVITE_BASE_URL}?ref=${encodeURIComponent(registration.referralCode)}`;
  const shareData = { title: t("referral.shareTitle"), text: t("referral.shareText"), url };
  if (globalThis.navigator?.share) {
    await globalThis.navigator.share(shareData);
    return { shared: true, url };
  }
  await globalThis.navigator?.clipboard?.writeText?.(`${shareData.text}\n${url}`);
  return { shared: false, copied: true, url };
}

function getOrCreateIdentity(storage) {
  try {
    const existing = JSON.parse(storage.getItem(IDENTITY_KEY) || "null");
    if (existing?.deviceId && existing?.deviceSecret) return existing;
  } catch { /* create a new identity */ }
  const identity = { deviceId: randomToken(16), deviceSecret: randomToken(32) };
  storage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  return identity;
}

async function callApi(action, identity, data, fetchImpl) {
  const response = await fetchImpl(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...identity, ...data })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Referral service ${response.status}`);
  return body;
}

function randomToken(bytes) {
  const values = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}
