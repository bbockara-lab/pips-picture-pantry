import { en } from "./en.js";
import { ko } from "./ko.js";

const dictionaries = { en, ko };
const DEFAULT_LOCALE = "en";
const LANGUAGE_STORAGE_KEY = "pip-picture-pantry-language";
const SYSTEM_PREFERENCE = "system";
let languagePreference = readLanguagePreference();
let activeLocale = resolveLocale(languagePreference);

export function getActiveLocale(language = getNavigatorLanguage()) {
  const normalized = String(language || "").toLowerCase();
  if (normalized.startsWith("ko")) {
    return "ko";
  }
  return DEFAULT_LOCALE;
}

export function getLanguagePreference() {
  return languagePreference;
}

export function getSupportedLocales() {
  return [DEFAULT_LOCALE, "ko"];
}

export function setActiveLocale(locale) {
  languagePreference = dictionaries[locale] ? locale : DEFAULT_LOCALE;
  activeLocale = dictionaries[languagePreference] ? languagePreference : DEFAULT_LOCALE;
}

export function setLanguagePreference(preference, language = getNavigatorLanguage()) {
  languagePreference = preference === SYSTEM_PREFERENCE || dictionaries[preference] ? preference : SYSTEM_PREFERENCE;
  activeLocale = resolveLocale(languagePreference, language);
  writeLanguagePreference(languagePreference);
}

export function t(key, params = {}) {
  const dictionary = dictionaries[activeLocale] || dictionaries[DEFAULT_LOCALE];
  const value = getByPath(dictionary, key) ?? getByPath(dictionaries[DEFAULT_LOCALE], key) ?? key;
  if (typeof value !== "string") {
    return key;
  }
  return format(value, params);
}

export function puzzleText(puzzleId, field) {
  return t(`puzzles.${puzzleId}.${field}`);
}

function resolveLocale(preference, language = getNavigatorLanguage()) {
  if (preference === SYSTEM_PREFERENCE) {
    return getActiveLocale(language);
  }
  return dictionaries[preference] ? preference : DEFAULT_LOCALE;
}

function readLanguagePreference() {
  try {
    const stored = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
    return stored === SYSTEM_PREFERENCE || dictionaries[stored] ? stored : SYSTEM_PREFERENCE;
  } catch {
    return SYSTEM_PREFERENCE;
  }
}

function writeLanguagePreference(preference) {
  try {
    globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, preference);
  } catch {
    // LocalStorage can be unavailable in private or restricted browser contexts.
  }
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