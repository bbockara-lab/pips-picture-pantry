import "./styles.css";
import { renderApp } from "./ui/appShell.js";
import { unlockAudio, playTap } from "./ui/audio.js";
import { renderBrandIntro } from "./ui/brandIntro.js";

const root = document.querySelector("#app");
renderApp(root);
renderBrandIntro(root);

window.addEventListener("ppp:player-changed", () => renderApp(root));
window.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    unlockAudio();
    playTap();
  }
});
