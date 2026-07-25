import { en } from "./en.js";
import { ko } from "./ko.js";

const dictionaries = { en, ko };
const DEFAULT_LOCALE = "en";
const LANGUAGE_STORAGE_KEY = "pip-picture-pantry-language";
const SYSTEM_PREFERENCE = "system";
let languagePreference = readLanguagePreference();
let activeLocale = resolveLocale(languagePreference);
applyDocumentLanguage(activeLocale);

export function getActiveLocale(language = getNavigatorLanguage()) {
  const normalized = String(language || "").toLowerCase();
  if (normalized.startsWith("ko")) {
    return "ko";
  }
  return DEFAULT_LOCALE;
}

export function getCurrentLocale() {
  return activeLocale;
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
  applyDocumentLanguage(activeLocale);
}

export function setLanguagePreference(preference, language = getNavigatorLanguage()) {
  languagePreference = preference === SYSTEM_PREFERENCE || dictionaries[preference] ? preference : SYSTEM_PREFERENCE;
  activeLocale = resolveLocale(languagePreference, language);
  writeLanguagePreference(languagePreference);
  applyDocumentLanguage(activeLocale);
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

export function puzzleTitle(puzzle) {
  if (puzzle?.runtimeTitle) {
    return localizedPuzzleFallback(puzzle.runtimeTitle);
  }
  return puzzleCopy(puzzle, "title", localizedPuzzleFallback(puzzle?.title || titleFromId(puzzle?.id)));
}

export function puzzleImageName(puzzle) {
  if (puzzle?.runtimeTitle) {
    return localizedPuzzleFallback(puzzle.runtimeTitle);
  }
  return puzzleCopy(puzzle, "imageName", localizedPuzzleFallback(puzzle?.title || titleFromId(puzzle?.id)));
}

export function puzzleAlbumText(puzzle) {
  return puzzleCopy(puzzle, "albumText", t("album.genericSaved", { title: puzzleImageName(puzzle) }));
}

function puzzleCopy(puzzle, field, fallback) {
  const key = `puzzles.${puzzle?.id}.${field}`;
  const value = t(key);
  return value === key ? fallback : value;
}

const KOREAN_PUZZLE_TITLES = {
  "Cafe Window": "카페 창가",
  "Tomato Soup": "토마토 수프",
  "Pantry Jar": "팬트리 병",
  "Milk Bottle": "우유병",
  "Jam Jar": "잼 병",
  Whisk: "거품기",
  "Chef Hat": "요리사 모자",
  Cupcake: "컵케이크",
  Kettle: "주전자",
  "Rolling Pin": "밀대",
  "Pocket Apron": "주머니 앞치마",
  "Patch Pocket": "천 조각 주머니",
  "Four-Hole Button": "네 구멍 단추",
  "Thread Spool": "실타래",
  "Sewing Scissors": "재봉 가위",
  "Golden Needle": "금빛 바늘",
  "Tomato Pincushion": "토마토 바늘꽂이",
  "Apron Bow": "앞치마 리본",
  "Folded Gingham": "접은 체크 천",
  "Drawer Handle": "서랍 손잡이",
  "Little Bakery Window": "작은 빵집 창가",
  "Butter Croissant": "버터 크루아상",
  "Tiered Cake": "층층 케이크",
  "Macaron Box": "마카롱 상자",
  "Ribbon Macaron Box": "리본 마카롱 상자",
  "Cocoa Tin": "코코아 통",
  "Cocoa Label Tin": "코코아 라벨 통",
  "Honey Jar": "꿀단지",
  "Berry Tart": "베리 타르트",
  "Berry Rosette Tart": "베리 꽃 타르트",
  "Pie Lattice": "격자무늬 파이",
  "Woven Lattice Pie": "촘촘한 격자 파이",
  "Cookie Jar": "쿠키 병",
  "Scone Basket": "스콘 바구니",
  "Scone Picnic Basket": "피크닉 스콘 바구니",
  "Berry Preserve Pot": "베리 저장 단지",
  "Pantry Cottage": "팬트리 오두막",
  "Apple Tree": "사과나무",
  "Market Basket": "장바구니",
  "Farmstand Basket": "농장 가판대 바구니",
  "Harvest Basket": "수확 바구니",
  "Daisy Pot": "데이지 화분",
  "Garden Fence": "정원 울타리",
  "Watering Can": "물뿌리개",
  "Little Bird": "작은 새",
  "Forest Mushroom": "숲속 버섯",
  "Porch Lantern": "현관 등불",
  "Picnic Blanket": "피크닉 담요",
  "Garden Window": "정원 창가",
  "Cottage Garden Window": "오두막 정원 창가",
  "Hearth Copper Kettle": "난롯가 구리 주전자",
  "Produce Crate": "농산물 상자",
  "Herb Jar": "허브 병",
  "Milk Churn": "우유통",
  "Jam Shelf": "잼 선반",
  "Garden Rake": "정원 갈퀴",
  "Straw Hat": "밀짚모자",
  "Flower Basket": "꽃바구니",
  Wheelbarrow: "손수레",
  "Village Sign": "마을 표지판",
  "Baguette Basket": "바게트 바구니",
  "Cinnamon Roll": "시나몬 롤",
  "Flour Jar": "밀가루 병",
  "Milk Pitcher": "우유 피처",
  "Berry Jam Pot": "베리 잼 냄비",
  "Balloon Whisk": "풍선 거품기",
  "Baker Cap": "제빵사 모자",
  "Cupcake Tray": "컵케이크 트레이",
  "Copper Kettle": "구리 주전자",
  "Rolling Pin Rack": "밀대 선반"
};

function localizedPuzzleFallback(title) {
  if (activeLocale !== "ko") {
    return title;
  }
  const match = String(title || "").match(/^(.*?)( 2)?$/);
  const translated = KOREAN_PUZZLE_TITLES[match?.[1]];
  if (!translated) {
    return title;
  }
  return match?.[2] ? `두 번째 ${translated}` : translated;
}

function titleFromId(id = "") {
  return String(id)
    .replace(/-\d+$/, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

function applyDocumentLanguage(locale) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
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
