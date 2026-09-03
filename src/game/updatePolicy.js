import { Capacitor } from "@capacitor/core";
import { RELEASE_BUILD } from "../data/releaseBuild.js";

export const UPDATE_POLICY_URL = "https://sunny-spoon-pantry.web.app/app-update-policy.json";
const CACHE_KEY = "pip-picture-pantry-update-policy-v1";
const OPTIONAL_DISMISS_KEY = "pip-picture-pantry-update-dismissed-v1";
const MANDATORY_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const OPTIONAL_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function validateUpdatePolicy(value) {
  if (!value || value.schemaVersion !== 1) return null;
  const normalized = { schemaVersion: 1, publishedAt: String(value.publishedAt || "") };
  for (const platform of ["android", "ios"]) {
    const entry = value[platform];
    if (!entry || !Number.isInteger(entry.latestBuild) || !Number.isInteger(entry.minimumSupportedBuild)) return null;
    if (entry.latestBuild < 1 || entry.minimumSupportedBuild < 1 || entry.minimumSupportedBuild > entry.latestBuild) return null;
    let storeUrl;
    try {
      storeUrl = new URL(String(entry.storeUrl));
    } catch {
      return null;
    }
    if (storeUrl.protocol !== "https:") return null;
    normalized[platform] = {
      latestBuild: entry.latestBuild,
      latestVersion: String(entry.latestVersion || entry.latestBuild),
      minimumSupportedBuild: entry.minimumSupportedBuild,
      storeUrl: storeUrl.href
    };
  }
  return normalized;
}

export function evaluateUpdatePolicy(policy, platform, currentBuild, dismissedBuild = 0) {
  const entry = policy?.[platform];
  if (!entry || !Number.isInteger(currentBuild)) return { kind: "none" };
  if (currentBuild < entry.minimumSupportedBuild) return { kind: "mandatory", ...entry, platform };
  if (currentBuild < entry.latestBuild && dismissedBuild !== entry.latestBuild) return { kind: "optional", ...entry, platform };
  return { kind: "none" };
}

export async function resolveUpdateDecision(options = {}) {
  const platform = options.platform || Capacitor.getPlatform();
  if (!options.platform && !Capacitor.isNativePlatform()) return { kind: "none" };
  if (!RELEASE_BUILD[platform]) return { kind: "none" };
  const storage = options.storage || globalThis.localStorage;
  const now = Number(options.now || Date.now());
  const fetchPolicy = options.fetchPolicy || fetchRemotePolicy;
  let policy = null;
  try {
    policy = validateUpdatePolicy(await fetchPolicy());
    if (policy) storage?.setItem(CACHE_KEY, JSON.stringify({ savedAt: now, policy }));
  } catch {
    policy = null;
  }
  if (!policy) {
    const cached = readCache(storage);
    if (!cached) return { kind: "none" };
    const age = now - cached.savedAt;
    const tentative = evaluateUpdatePolicy(cached.policy, platform, RELEASE_BUILD[platform].build, readDismissedBuild(storage, platform));
    const maxAge = tentative.kind === "mandatory" ? MANDATORY_CACHE_MAX_AGE_MS : OPTIONAL_CACHE_MAX_AGE_MS;
    if (age < 0 || age > maxAge) return { kind: "none" };
    return tentative;
  }
  return evaluateUpdatePolicy(policy, platform, RELEASE_BUILD[platform].build, readDismissedBuild(storage, platform));
}

export function dismissOptionalUpdate(platform, build, storage = globalThis.localStorage) {
  const values = readDismissed(storage);
  values[platform] = Number(build) || 0;
  storage?.setItem(OPTIONAL_DISMISS_KEY, JSON.stringify(values));
}

export function openUpdateStore(storeUrl) {
  globalThis.location?.assign(storeUrl);
}

async function fetchRemotePolicy() {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(UPDATE_POLICY_URL, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`Update policy HTTP ${response.status}`);
    return response.json();
  } finally {
    globalThis.clearTimeout(timer);
  }
}

function readCache(storage) {
  try {
    const value = JSON.parse(storage?.getItem(CACHE_KEY) || "null");
    const policy = validateUpdatePolicy(value?.policy);
    return policy && Number.isFinite(value.savedAt) ? { savedAt: value.savedAt, policy } : null;
  } catch {
    return null;
  }
}

function readDismissed(storage) {
  try { return JSON.parse(storage?.getItem(OPTIONAL_DISMISS_KEY) || "{}") || {}; } catch { return {}; }
}

function readDismissedBuild(storage, platform) {
  return Number(readDismissed(storage)[platform]) || 0;
}
