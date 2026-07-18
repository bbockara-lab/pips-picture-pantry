import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { ECONOMY } from "../data/economyConfig.js";
import { grantCozySupportPack, grantSpoonJarPurchase, hasCozySupportPack } from "./save.js";

export const COZY_SUPPORT_PRODUCT_ID = "pip_cozy_support";
export const SPOON_JAR_SMALL_PRODUCT_ID = "pip_spoon_jar_small";

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
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
}

export async function getCozySupportProduct() {
  const result = await getBillingProduct(COZY_SUPPORT_PRODUCT_ID, FALLBACK_SUPPORT_PRODUCT);
  return { ...result, owned: hasCozySupportPack() };
}

export async function getSpoonJarSmallProduct() {
  return getBillingProduct(SPOON_JAR_SMALL_PRODUCT_ID, FALLBACK_SPOON_JAR_SMALL_PRODUCT);
}

async function getBillingProduct(productIdentifier, fallbackProduct) {
  if (!isBillingRuntimeAvailable()) {
    return { available: false, reason: "native-store-required", product: fallbackProduct };
  }

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    if (!isBillingSupported) {
      return { available: false, reason: "billing-not-supported", product: fallbackProduct };
    }

    const { product } = await NativePurchases.getProduct({ productIdentifier, productType: PURCHASE_TYPE.INAPP });
    return {
      available: true,
      reason: "ready",
      product: {
        ...fallbackProduct,
        ...product,
        identifier: product?.identifier || product?.productIdentifier || productIdentifier,
        priceString: product?.priceString || fallbackProduct.priceString
      }
    };
  } catch (error) {
    return { available: false, reason: "product-unavailable", product: fallbackProduct, error };
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
      autoAcknowledgePurchases: true
    });
    if (!isCozySupportEntitlement(transaction)) {
      return { ok: false, status: "wrong-product", grant: null, transaction };
    }

    return { ok: true, status: "purchased", grant: grantCozySupportPack("purchase"), transaction };
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

export async function restoreCozySupportPack() {
  if (!isBillingRuntimeAvailable()) {
    return { ok: false, status: "native-store-required", grant: null };
  }

  try {
    await NativePurchases.restorePurchases();
    const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
    const owned = isCozySupportEntitlement(purchases);
    if (!owned) {
      return { ok: false, status: "not-owned", grant: null };
    }

    return { ok: true, status: "restored", grant: grantCozySupportPack("restore") };
  } catch (error) {
    return { ok: false, status: getBillingErrorStatus(error), grant: null, error };
  }
}

export async function syncCozySupportEntitlement() {
  if (hasCozySupportPack()) {
    return { ok: true, status: "already-owned", grant: null };
  }
  return restoreCozySupportPack();
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
