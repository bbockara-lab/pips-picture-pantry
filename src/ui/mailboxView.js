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
    header.innerHTML = `<p>${t("mailbox.eyebrow")}</p><h1>${t("mailbox.title")}</h1><span>${t("mailbox.intro")}</span>`;
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
      button.innerHTML = `<span class="mailbox-message__seal" aria-hidden="true"></span><span><strong>${t(message.titleKey)}</strong><small>${t(message.previewKey)}</small></span>`;
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
