import "./styles.css";
import { App } from "@capacitor/app";
import { renderApp } from "./ui/appShell.js";
import { unlockAudio, playTap, setAudioAppActive } from "./ui/audio.js";
import { renderBrandIntro } from "./ui/brandIntro.js";
import { captureAndroidInstallReferral, rememberReferralUrl, syncReferralMailbox } from "./game/referrals.js";

const root = document.querySelector("#app");
renderApp(root);
renderBrandIntro(root);
let referralRefreshQueuedAfterIntro = false;

function openKoreanHarvestDeepLink(url) {
  if (!url?.startsWith("pipspicturepantry://event/korean-harvest-2026")) return;
  root.dataset.openKoreanHarvestEvent = "true";
  renderApp(root);
}

async function handleReferralUrl(url) {
  if (!rememberReferralUrl(url)) return false;
  await refreshReferralMailbox();
  return true;
}

async function refreshReferralMailbox() {
  try {
    const result = await syncReferralMailbox();
    if (result.newCount > 0) root.dataset.newReferralMail = "true";
    // The intro is appended outside appShell. Re-rendering the shell while it is
    // open removes that DOM node before brandIntro can dismiss itself, leaving
    // data-intro-open stuck forever. Defer the mailbox redraw until the intro's
    // normal dismissal so update gates, login rewards, and referral notices all
    // resume from a consistent lifecycle state.
    if (root.dataset.introOpen === "true") {
      if (!referralRefreshQueuedAfterIntro) {
        referralRefreshQueuedAfterIntro = true;
        window.addEventListener("ppp:intro-dismissed", () => {
          referralRefreshQueuedAfterIntro = false;
          renderApp(root);
        }, { once: true });
      }
      return;
    }
    renderApp(root);
  } catch {
    // Referral sync is intentionally non-blocking; the next launch retries it.
  }
}

void App.addListener("appUrlOpen", ({ url }) => {
  openKoreanHarvestDeepLink(url);
  void handleReferralUrl(url);
});
void App.getLaunchUrl().then(({ url } = {}) => {
  openKoreanHarvestDeepLink(url);
  void handleReferralUrl(url);
});
void captureAndroidInstallReferral().finally(refreshReferralMailbox);

function syncDocumentAudioState() {
  setAudioAppActive(document.visibilityState !== "hidden");
}

document.addEventListener("visibilitychange", syncDocumentAudioState);
window.addEventListener("pagehide", () => setAudioAppActive(false));
window.addEventListener("pageshow", syncDocumentAudioState);
void App.addListener("appStateChange", ({ isActive }) => {
  setAudioAppActive(isActive);
});

window.addEventListener("ppp:player-changed", () => {
  renderApp(root);
  void refreshReferralMailbox();
});
window.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button && !button.matches(".puzzle-cell, .cursor-move, .cursor-action-button")) {
    unlockAudio();
    playTap();
  }
});
