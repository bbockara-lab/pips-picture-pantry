import "./styles.css";
import { renderApp } from "./ui/appShell.js";
import { renderBrandIntro } from "./ui/brandIntro.js";

const root = document.querySelector("#app");
renderApp(root);
renderBrandIntro(root);