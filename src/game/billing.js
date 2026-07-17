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
    if (!isCozySupportTransaction(transaction)) {
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
    const owned = Array.isArray(purchases) && purchases.some(isCozySupportTransaction);
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

function isCozySupportTransaction(transaction) {
  return transaction?.productIdentifier === COZY_SUPPORT_PRODUCT_ID;
}

function getBillingErrorStatus(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("cancel")) {
    return "cancelled";
  }
  if (message.includes("network") || message.includes("offline")) {
    return "network-error";
  }
  return "failed";
}
