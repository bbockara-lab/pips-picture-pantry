import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { ECONOMY } from "../data/economyConfig.js";
import { grantCozySupportPack, grantSpoonJarPurchase } from "./save.js";

export const COZY_SUPPORT_PRODUCT_ID = "pip_cozy_support";
export const SPOON_JAR_SMALL_PRODUCT_ID = "pip_spoon_jar_small";
export const BILLING_PRODUCT_IDS = Object.freeze([
  COZY_SUPPORT_PRODUCT_ID,
  SPOON_JAR_SMALL_PRODUCT_ID
]);
export const BILLING_PRICE_CACHE_KEY = "pips-picture-pantry:v0.1:billing-product-cache";

let billingCatalogMemory = null;
let billingCatalogRequest = null;

const FALLBACK_SUPPORT_PRODUCT = Object.freeze({
  identifier: COZY_SUPPORT_PRODUCT_ID,
  title: "Cozy Support Pack",
  priceString: "",
  spoonGrant: ECONOMY.COZY_PASS_SPOON_GRANT
});

const FALLBACK_SPOON_JAR_SMALL_PRODUCT = Object.freeze({
  identifier: SPOON_JAR_SMALL_PRODUCT_ID,
  title: "Small Spoon Jar",
  priceString: "",
  spoonGrant: ECONOMY.SPOON_JAR_SMALL_GRANT
});

export function isBillingRuntimeAvailable() {
  return Capacitor.isNativePlatform() && isSupportedBillingPlatform(Capacitor.getPlatform());
}

export function isSupportedBillingPlatform(platform) {
  return platform === "android" || platform === "ios";
}

export function getNativeStoreName(platform = Capacitor.getPlatform()) {
  if (platform === "ios") return "App Store";
  if (platform === "android") return "Google Play";
  return "Store";
}

export async function getCozySupportProduct() {
  return getBillingProduct(COZY_SUPPORT_PRODUCT_ID);
}

export async function getSpoonJarSmallProduct() {
  return getBillingProduct(SPOON_JAR_SMALL_PRODUCT_ID);
}

export function getCachedBillingProduct(productIdentifier, {
  storage = getBillingCacheStorage(),
  platform = Capacitor.getPlatform()
} = {}) {
  const catalog = readBillingProductCache(storage, platform);
  return catalog?.products?.[productIdentifier] || null;
}

export async function getBillingProducts({ forceRefresh = false } = {}) {
  if (!isBillingRuntimeAvailable()) {
    return createUnavailableBillingCatalog("native-store-required");
  }

  if (!forceRefresh && billingCatalogMemory) return billingCatalogMemory;
  if (billingCatalogRequest) return billingCatalogRequest;

  const platform = Capacitor.getPlatform();
  const cachedCatalog = readBillingProductCache(getBillingCacheStorage(), platform);
  if (!forceRefresh && cachedCatalog) {
    billingCatalogMemory = cachedCatalog;
    return cachedCatalog;
  }

  billingCatalogRequest = queryBillingProducts(platform, cachedCatalog || billingCatalogMemory);
  try {
    return await billingCatalogRequest;
  } finally {
    billingCatalogRequest = null;
  }
}

async function getBillingProduct(productIdentifier) {
  const catalog = await getBillingProducts({ forceRefresh: true });
  return catalog.products?.[productIdentifier]
    || createUnavailableBillingProduct(productIdentifier, catalog.reason || "product-unavailable");
}

async function queryBillingProducts(platform, cachedCatalog) {
  const storeName = getNativeStoreName(platform);

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    if (!isBillingSupported) {
      return cachedCatalog || createUnavailableBillingCatalog("billing-not-supported", storeName);
    }

    const { products = [] } = await NativePurchases.getProducts({
      productIdentifiers: [...BILLING_PRODUCT_IDS],
      productType: PURCHASE_TYPE.INAPP
    });
    const results = Object.fromEntries(BILLING_PRODUCT_IDS.map((productIdentifier) => {
      const fallbackProduct = getFallbackBillingProduct(productIdentifier);
      const product = products.find((candidate) => getObjectProductId(candidate) === productIdentifier);
      return [productIdentifier, product
        ? {
          available: true,
          reason: "ready",
          storeName,
          product: {
            ...fallbackProduct,
            ...product,
            identifier: getObjectProductId(product) || productIdentifier,
            priceString: product.priceString || fallbackProduct.priceString
          }
        }
        : createUnavailableBillingProduct(productIdentifier, "product-unavailable", storeName)];
    }));
    const catalog = {
      available: BILLING_PRODUCT_IDS.every((productIdentifier) => results[productIdentifier].available),
      reason: "ready",
      storeName,
      platform,
      updatedAt: Date.now(),
      products: results
    };
    billingCatalogMemory = catalog;
    writeBillingProductCache(catalog, getBillingCacheStorage());
    return catalog;
  } catch (error) {
    if (cachedCatalog) {
      billingCatalogMemory = cachedCatalog;
      return { ...cachedCatalog, reason: "cached", error };
    }
    return { ...createUnavailableBillingCatalog("product-unavailable", storeName), error };
  }
}

function getFallbackBillingProduct(productIdentifier) {
  return productIdentifier === SPOON_JAR_SMALL_PRODUCT_ID
    ? FALLBACK_SPOON_JAR_SMALL_PRODUCT
    : FALLBACK_SUPPORT_PRODUCT;
}

function createUnavailableBillingProduct(productIdentifier, reason, storeName = getNativeStoreName()) {
  return {
    available: false,
    reason,
    storeName,
    product: getFallbackBillingProduct(productIdentifier)
  };
}

function createUnavailableBillingCatalog(reason, storeName = getNativeStoreName()) {
  return {
    available: false,
    reason,
    storeName,
    platform: Capacitor.getPlatform(),
    updatedAt: 0,
    products: Object.fromEntries(BILLING_PRODUCT_IDS.map((productIdentifier) => [
      productIdentifier,
      createUnavailableBillingProduct(productIdentifier, reason, storeName)
    ]))
  };
}

function getBillingCacheStorage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function readBillingProductCache(storage, platform) {
  if (!storage || !isSupportedBillingPlatform(platform)) return null;
  try {
    const parsed = JSON.parse(storage.getItem(BILLING_PRICE_CACHE_KEY) || "null");
    if (parsed?.version !== 1 || parsed.platform !== platform) return null;
    const products = Object.fromEntries(BILLING_PRODUCT_IDS.map((productIdentifier) => {
      const cached = parsed.products?.[productIdentifier];
      if (!cached?.priceString) return [productIdentifier, null];
      return [productIdentifier, {
        available: true,
        reason: "cached",
        storeName: parsed.storeName || getNativeStoreName(platform),
        product: {
          ...getFallbackBillingProduct(productIdentifier),
          ...cached,
          identifier: productIdentifier
        }
      }];
    }));
    if (BILLING_PRODUCT_IDS.some((productIdentifier) => !products[productIdentifier])) return null;
    return {
      available: true,
      reason: "cached",
      storeName: parsed.storeName || getNativeStoreName(platform),
      platform,
      updatedAt: Number(parsed.updatedAt) || 0,
      products
    };
  } catch {
    return null;
  }
}

function writeBillingProductCache(catalog, storage) {
  if (!storage || !catalog?.available) return false;
  try {
    storage.setItem(BILLING_PRICE_CACHE_KEY, JSON.stringify({
      version: 1,
      platform: catalog.platform,
      storeName: catalog.storeName,
      updatedAt: catalog.updatedAt,
      products: Object.fromEntries(BILLING_PRODUCT_IDS.map((productIdentifier) => {
        const product = catalog.products?.[productIdentifier]?.product || {};
        return [productIdentifier, {
          title: product.title || getFallbackBillingProduct(productIdentifier).title,
          priceString: product.priceString || ""
        }];
      }))
    }));
    return true;
  } catch {
    return false;
  }
}

export async function purchaseCozySupportPack() {
  if (!isBillingRuntimeAvailable()) {
    return { ok: false, status: "native-store-required", grant: null };
  }

  try {
    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier: COZY_SUPPORT_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
      quantity: 1,
      isConsumable: true,
      autoAcknowledgePurchases: true
    });
    if (!isCozySupportEntitlement(transaction)) {
      return { ok: false, status: "wrong-product", grant: null, transaction };
    }

    const purchaseKey = getPurchaseKey(transaction, COZY_SUPPORT_PRODUCT_ID);
    const grant = grantCozySupportPack(purchaseKey, "purchase");
    if (!grant.granted && !grant.duplicate) {
      return { ok: false, status: grant.reason || "failed", grant, transaction };
    }

    return { ok: true, status: grant.duplicate ? "already-processed" : "purchased", grant, transaction };
  } catch (error) {
    return { ok: false, status: getBillingErrorStatus(error), grant: null, error };
  }
}

export async function purchaseSpoonJarSmall() {
  if (!isBillingRuntimeAvailable()) {
    return { ok: false, status: "native-store-required", grant: null };
  }

  try {
    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier: SPOON_JAR_SMALL_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
      quantity: 1,
      isConsumable: true,
      autoAcknowledgePurchases: true
    });
    if (!isSpoonJarSmallPurchase(transaction)) {
      return { ok: false, status: "wrong-product", grant: null, transaction };
    }

    const purchaseKey = getPurchaseKey(transaction, SPOON_JAR_SMALL_PRODUCT_ID);
    const grant = grantSpoonJarPurchase(purchaseKey, "purchase");
    if (!grant.granted && !grant.duplicate) {
      return { ok: false, status: grant.reason || "failed", grant, transaction };
    }

    return { ok: true, status: grant.duplicate ? "already-processed" : "purchased", grant, transaction };
  } catch (error) {
    return { ok: false, status: getBillingErrorStatus(error), grant: null, error };
  }
}

export async function restorePendingPurchases() {
  if (!isBillingRuntimeAvailable()) {
    return { restored: [], consumed: [], failed: [] };
  }

  try {
    const { purchases = [] } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP,
      onlyCurrentEntitlements: true
    });
    return restorePendingPurchaseRecords(purchases, {
      consumePurchase: (purchaseToken) => NativePurchases.consumePurchase({ purchaseToken })
    });
  } catch (error) {
    return { restored: [], consumed: [], failed: [], error };
  }
}

export async function restorePendingPurchaseRecords(purchases, { consumePurchase } = {}) {
  const restored = [];
  const consumed = [];
  const failed = [];

  for (const purchase of Array.isArray(purchases) ? purchases : []) {
    const productId = getObjectProductId(purchase);
    const purchaseToken = firstString(purchase?.purchaseToken, purchase?.token, purchase?.transactionId);
    if (!isCompletedAndroidPurchase(purchase) || !purchaseToken) continue;

    let grant = null;
    if (productId === COZY_SUPPORT_PRODUCT_ID) {
      grant = grantCozySupportPack(getPurchaseKey(purchase, productId), "restore");
    } else if (productId === SPOON_JAR_SMALL_PRODUCT_ID) {
      grant = grantSpoonJarPurchase(getPurchaseKey(purchase, productId), "restore");
    } else {
      continue;
    }

    if (!grant.granted && !grant.duplicate) {
      failed.push(productId);
      continue;
    }

    restored.push(productId);
    try {
      await consumePurchase?.(purchaseToken);
      consumed.push(productId);
    } catch {
      failed.push(productId);
    }
  }

  return { restored, consumed, failed };
}

function isCompletedAndroidPurchase(purchase) {
  return purchase?.purchaseState === undefined || String(purchase.purchaseState) === "1";
}
export function isCozySupportEntitlement(payload) {
  return hasProductId(payload, COZY_SUPPORT_PRODUCT_ID);
}

export function isSpoonJarSmallPurchase(payload) {
  return hasProductId(payload, SPOON_JAR_SMALL_PRODUCT_ID);
}

function hasProductId(payload, productId) {
  if (!payload) return false;
  if (payload === productId) return true;
  if (Array.isArray(payload)) return payload.some((item) => hasProductId(item, productId));
  if (getObjectProductId(payload) === productId) return true;
  if (Array.isArray(payload.products)) {
    return payload.products.includes(productId) || payload.products.some((item) => hasProductId(item, productId));
  }
  return hasProductId(payload.transaction, productId)
    || hasProductId(payload.purchase, productId)
    || hasProductId(payload.purchases, productId)
    || hasProductId(payload.result, productId);
}

function getObjectProductId(payload) {
  return payload?.productIdentifier || payload?.productId || payload?.productID || payload?.identifier || "";
}

export function getPurchaseKey(payload, productId = SPOON_JAR_SMALL_PRODUCT_ID) {
  const purchase = findPurchaseObject(payload, productId);
  const uniqueId = firstString(
    purchase?.transactionId,
    purchase?.transactionID,
    purchase?.transactionIdentifier,
    purchase?.orderId,
    purchase?.orderID,
    purchase?.purchaseToken,
    purchase?.token
  );
  return uniqueId ? productId + ":" + uniqueId : "";
}

function findPurchaseObject(payload, productId) {
  if (!payload) return null;
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findPurchaseObject(item, productId);
      if (found) return found;
    }
    return null;
  }
  if (getObjectProductId(payload) === productId) return payload;
  if (Array.isArray(payload.products) && payload.products.includes(productId)) return payload;
  return findPurchaseObject(payload.transaction, productId)
    || findPurchaseObject(payload.purchase, productId)
    || findPurchaseObject(payload.purchases, productId)
    || findPurchaseObject(payload.result, productId)
    || findPurchaseObject(payload.products, productId);
}

function firstString(...values) {
  return values.map((value) => String(value || "").trim()).find(Boolean) || "";
}

export function getBillingErrorStatus(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("cancel")) return "cancelled";
  if ((message.includes("already") && (message.includes("own") || message.includes("purchas"))) || message.includes("item_already_owned")) {
    return "already-owned";
  }
  if (message.includes("network") || message.includes("offline")) return "network-error";
  return "failed";
}
