import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";

export function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.dataset.assetId = "spoon-token-v2";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

export function appendSpoonLabel(element, localizedText, size = "small") {
  const text = String(localizedText || "").replace(/\u{1F944}/gu, "").replace(/\s+/g, " ").trim();
  element.replaceChildren(document.createTextNode(text + " "), createSpoonIcon(size));
  return element;
}
