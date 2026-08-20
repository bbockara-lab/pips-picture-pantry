import { getUnlockedMailboxMessages } from "../data/mailboxMessages.js";
import { getReadMailboxMessageIds, hasSeenGuide, markMailboxMessageRead } from "../game/save.js";
import { t } from "../i18n/index.js";

export function getUnreadMailboxCount() {
  const read = new Set(getReadMailboxMessageIds());
  return getUnlockedMailboxMessages("all", hasSeenGuide).filter((message) => !read.has(message.id)).length;
}

export function renderMailboxView({ onReplayGuide = () => {}, onMailboxChange = () => {} } = {}) {
  const root = document.createElement("main");
  root.className = "mailbox-view";
  let filter = "all";
  let openMessageId = null;

  const render = () => {
    root.replaceChildren();
    const header = document.createElement("header");
    header.className = "mailbox-view__header";
    const eyebrow = document.createElement("p");
    eyebrow.textContent = t("mailbox.eyebrow");
    const title = document.createElement("h1");
    title.textContent = t("mailbox.title");
    const intro = document.createElement("span");
    intro.textContent = t("mailbox.intro");
    header.append(eyebrow, title, intro);
    const filters = document.createElement("div");
    filters.className = "mailbox-view__filters";
    [["all", "mailbox.filters.all"], ["letter", "mailbox.filters.letters"], ["story", "mailbox.filters.stories"]].forEach(([value, key]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = value === filter ? "active" : "";
      button.textContent = t(key);
      button.addEventListener("click", () => { filter = value; openMessageId = null; render(); });
      filters.appendChild(button);
    });
    const list = document.createElement("section");
    list.className = "mailbox-view__list";
    const read = new Set(getReadMailboxMessageIds());
    getUnlockedMailboxMessages(filter, hasSeenGuide).forEach((message) => {
      const article = document.createElement("article");
      article.className = `mailbox-message${read.has(message.id) ? " is-read" : " is-unread"}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mailbox-message__summary";
      const seal = document.createElement("span");
      seal.className = "mailbox-message__seal";
      seal.setAttribute("aria-hidden", "true");
      const copy = document.createElement("span");
      const messageTitle = document.createElement("strong");
      messageTitle.textContent = t(message.titleKey);
      const preview = document.createElement("small");
      preview.textContent = t(message.previewKey);
      copy.append(messageTitle, preview);
      button.append(seal, copy);
      button.addEventListener("click", () => {
        markMailboxMessageRead(message.id);
        if (message.guideId) {
          onMailboxChange();
          return onReplayGuide(message.guideId);
        }
        openMessageId = openMessageId === message.id ? null : message.id;
        render();
      });
      article.appendChild(button);
      if (openMessageId === message.id && message.kind === "letter") {
        const detail = document.createElement("div");
        detail.className = "mailbox-message__letter";
        if (message.art) {
          const image = document.createElement("img");
          image.src = message.art.src;
          image.alt = t("mailbox.welcomeArtAlt");
          image.dataset.assetId = message.art.assetId;
          detail.appendChild(image);
        }
        const date = document.createElement("p");
        date.className = "mailbox-message__date";
        date.textContent = t(message.dateKey);
        const body = document.createElement("p");
        body.className = "mailbox-message__body";
        body.textContent = t(message.bodyKey);
        detail.append(date, body);
        article.appendChild(detail);
      }
      list.appendChild(article);
    });
    root.append(header, filters, list);
  };
  render();
  return root;
}
