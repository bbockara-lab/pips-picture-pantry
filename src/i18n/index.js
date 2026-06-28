import { en } from "./en.js";
import { ko } from "./ko.js";

const dictionaries = { en, ko };
const DEFAULT_LOCALE = "en";

export function getActiveLocale(language = getNavigatorLanguage()) {
  const normalized = String(language || "").toLowerCase();
  if (normalized.startsWith("ko")) {
    return "ko";
  }
  return DEFAULT_LOCALE;
}

export function t(key, params = {}) {
  const dictionary = dictionaries[getActiveLocale()] || dictionaries[DEFAULT_LOCALE];
  const value = getByPath(dictionary, key) ?? getByPath(dictionaries[DEFAULT_LOCALE], key) ?? key;
  if (typeof value !== "string") {
    return key;
  }
  return format(value, params);
}

export function puzzleText(puzzleId, field) {
  return t(`puzzles.${puzzleId}.${field}`);
}

function getNavigatorLanguage() {
  return typeof navigator === "undefined" ? DEFAULT_LOCALE : navigator.language;
}

function getByPath(source, path) {
  return path.split(".").reduce((current, segment) => current?.[segment], source);
}

function format(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}