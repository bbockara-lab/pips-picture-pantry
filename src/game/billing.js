import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { ECONOMY } from "../data/economyConfig.js";
import { grantCozySupportPack, hasCozySupportPack } from "./save.js";

export const COZY_SUPPORT_PRODUCT_ID = "pip_cozy_support";

const FALLBACK_PRODUCT = Object.freeze({
  identifier: COZY_SUPPORT_PRODUCT_ID,
  title: "Cozy Support Pack",
  priceString: "",
  spoonGrant: ECONOMY.COZY_PASS_SPOON_GRANT
});

export function isBillingRuntimeAvailable() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
}

export async function getCozySupportProduct() {
  if (!isBillingRuntimeAvailable()) {
    return {
      available: false,
      reason: "native-store-required",
      product: FALLBACK_PRODUCT,
      owned: hasCozySupportPack()
    };
  }

  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    if (!isBillingSupported) {
      return {
        available: false,
        reason: "billing-not-supported",
        product: FALLBACK_PRODUCT,
        owned: hasCozySupportPack()
      };
    }

    const { product } = await NativePurchases.getProduct({
      productIdentifier: COZY_SUPPORT_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP
    });
    return {
      available: true,
      reason: "ready",
      product: {
        ...FALLBACK_PRODUCT,
        ...product,
        identifier: product?.identifier || product?.productIdentifier || COZY_SUPPORT_PRODUCT_ID,
        priceString: product?.priceString || FALLBACK_PRODUCT.priceString
      },
      owned: hasCozySupportPack()
    };
  } catch (error) {
    return {
      available: false,
      reason: "product-unavailable",
      product: FALLBACK_PRODUCT,
      owned: hasCozySupportPack(),
      error
    };
  }
}

export async function purchaseCozySupportPack() {
  if (!isBillingRuntimeAvailable()) {
    return {
      ok: false,
      status: "native-store-required",
      grant: null
    };
  }

  try {
    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier: COZY_SUPPORT_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
      quantity: 1,
      autoAcknowledgePurchases: true
    });
    if (!isCozySupportEntitlement(transaction)) {
      return {
        ok: false,
        status: "wrong-product",
        grant: null,
        transaction
      };
    }

    return {
      ok: true,
      status: "purchased",
      grant: grantCozySupportPack("purchase"),
      transaction
    };
  } catch (error) {
    return {
      ok: false,
      status: getBillingErrorStatus(error),
      grant: null,
      error
    };
  }
}

export async function restoreCozySupportPack() {
  if (!isBillingRuntimeAvailable()) {
    return {
      ok: false,
      status: "native-store-required",
      grant: null
    };
  }

  try {
    await NativePurchases.restorePurchases();
    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP
    });
    const owned = isCozySupportEntitlement(purchases);
    if (!owned) {
      return {
        ok: false,
        status: "not-owned",
        grant: null
      };
    }

    return {
      ok: true,
      status: "restored",
      grant: grantCozySupportPack("restore")
    };
  } catch (error) {
    return {
      ok: false,
      status: getBillingErrorStatus(error),
      grant: null,
      error
    };
  }
}

export function isCozySupportEntitlement(payload) {
  if (!payload) {
    return false;
  }
  if (Array.isArray(payload)) {
    return payload.some(isCozySupportEntitlement);
  }
  if (payload.productIdentifier === COZY_SUPPORT_PRODUCT_ID) {
    return true;
  }
  if (payload.productId === COZY_SUPPORT_PRODUCT_ID || payload.productID === COZY_SUPPORT_PRODUCT_ID) {
    return true;
  }
  if (payload.identifier === COZY_SUPPORT_PRODUCT_ID) {
    return true;
  }
  if (Array.isArray(payload.products) && payload.products.includes(COZY_SUPPORT_PRODUCT_ID)) {
    return true;
  }
  return isCozySupportEntitlement(payload.transaction)
    || isCozySupportEntitlement(payload.purchase)
    || isCozySupportEntitlement(payload.purchases)
    || isCozySupportEntitlement(payload.result);
}

export function getBillingErrorStatus(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("cancel")) {
    return "cancelled";
  }
  if (
    (message.includes("already") && (message.includes("own") || message.includes("purchas")))
    || message.includes("item_already_owned")
  ) {
    return "already-owned";
  }
  if (message.includes("network") || message.includes("offline")) {
    return "network-error";
  }
  return "failed";
}
