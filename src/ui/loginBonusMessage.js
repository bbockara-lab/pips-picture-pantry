import { t } from "../i18n/index.js";

export function getLoginBonusMessage(count) {
  return t("toast.loginBonus", { count });
}
