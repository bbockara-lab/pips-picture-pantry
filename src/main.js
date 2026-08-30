import "./styles.css";
import { App } from "@capacitor/app";
import { renderApp } from "./ui/appShell.js";
import { unlockAudio, playTap, setAudioAppActive } from "./ui/audio.js";
import { renderBrandIntro } from "./ui/brandIntro.js";

const root = document.querySelector("#app");
renderApp(root);
renderBrandIntro(root);

function syncDocumentAudioState() {
  setAudioAppActive(document.visibilityState !== "hidden");
}

document.addEventListener("visibilitychange", syncDocumentAudioState);
window.addEventListener("pagehide", () => setAudioAppActive(false));
window.addEventListener("pageshow", syncDocumentAudioState);
void App.addListener("appStateChange", ({ isActive }) => {
  setAudioAppActive(isActive);
});

window.addEventListener("ppp:player-changed", () => renderApp(root));
window.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button && !button.matches(".puzzle-cell, .cursor-move, .cursor-action-button")) {
    unlockAudio();
    playTap();
  }
});
