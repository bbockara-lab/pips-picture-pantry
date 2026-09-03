import { isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";
import { getAudioCueUrls, MUSIC_CUES } from "./audioCatalog.js";

const SFX_KEY = "pips-picture-pantry:v0.1:sfx";
const MUSIC_KEY = "pips-picture-pantry:v0.1:music";
const activePlayers = new Set();
const lastVariationByCue = new Map();
let audioContext = null;
let musicElement = null;
let musicCueId = null;
let requestedMusicScene = "home";
let audioUnlocked = false;
let appIsActive = true;
let musicSuppressed = false;

export function getAudioPreferences() {
  return {
    sfx: readBool(SFX_KEY, true),
    music: readBool(MUSIC_KEY, true)
  };
}

export function setSfxEnabled(enabled) {
  writeBool(SFX_KEY, enabled);
  if (!enabled) stopActiveEffects();
}

export function setMusicEnabled(enabled) {
  writeBool(MUSIC_KEY, enabled);
  if (!enabled) stopMusic();
  else startMusic();
}

export function unlockAudio() {
  if (!appIsActive) return;
  audioUnlocked = true;
  getContext()?.resume?.();
  if (getAudioPreferences().music) startMusic();
}

export function setMusicScene(scene) {
  const normalized = MUSIC_CUES[scene] ? scene : "yearRound";
  requestedMusicScene = normalized;
  const cueId = resolveMusicCueId(normalized);
  if (cueId === musicCueId) return;
  const wasPlaying = Boolean(musicElement && !musicElement.paused);
  stopMusic();
  musicElement = null;
  musicCueId = cueId;
  if (wasPlaying || audioUnlocked) startMusic();
}

export function playCue(cueId, options = {}) {
  if (!appIsActive || !getAudioPreferences().sfx) return null;
  const urls = getAudioCueUrls(cueId);
  if (!urls.length || typeof Audio === "undefined") return null;
  const index = pickVariation(cueId, urls.length, options.variationIndex);
  const player = new Audio(urls[index]);
  player.preload = "auto";
  player.volume = clampVolume(options.volume ?? 1);
  activePlayers.add(player);
  const release = () => activePlayers.delete(player);
  player.addEventListener("ended", release, { once: true });
  player.addEventListener("error", release, { once: true });
  player.play().catch(release);
  return player;
}

export function playTap() {
  playCue("sfx_ui_tap_soft", { volume: 0.58 });
}

export function playPrimaryTap() {
  playCue("sfx_ui_tap_primary", { volume: 0.7 });
}

export function playCursorMove() {
  playCue("sfx_cursor_move", { volume: 0.42 });
}

export function playCursorAction(mode = "fill", options = {}) {
  const prefix = options.trail ? "sfx_cursor_trail_step" : "sfx_cursor_select";
  playCue(`${prefix}_${mode === "mark" ? "mark" : "fill"}`, { volume: options.trail ? 0.42 : 0.62 });
  lightVibrate(options.trail ? 4 : 8);
}

export function playComplete() {
  playCue("sfx_picture_color_bloom", { volume: 0.72 });
  globalThis.setTimeout(() => playCue("stinger_puzzle_complete", { volume: 0.8 }), 120);
  globalThis.setTimeout(() => playCue("pip_happy_small", { volume: 0.56 }), 520);
}

export function playStageComplete() {
  playCue("sfx_pantry_shelf_complete", { volume: 0.74 });
  globalThis.setTimeout(() => playCue("stinger_shelf_complete", { volume: 0.85 }), 130);
  globalThis.setTimeout(() => playCue("pip_proud", { volume: 0.6 }), 820);
}

export function startMusic() {
  if (!appIsActive || musicSuppressed || !getAudioPreferences().music || !audioUnlocked || typeof Audio === "undefined") return;
  getMusicElement()?.play().catch(() => {
    // Mobile platforms may defer playback until the next direct user gesture.
  });
}

export function stopMusic() {
  musicElement?.pause();
}

export function setMusicSuppressed(suppressed) {
  musicSuppressed = Boolean(suppressed);
  if (musicSuppressed) stopMusic();
  else startMusic();
}

export function playTimeAttackCountdown(step) {
  const cueId = step === "go" ? "sfx_time_go" : `sfx_time_count_${Number(step) || 3}`;
  playCue(cueId, { volume: step === "go" ? 0.86 : 0.72 });
  lightVibrate(step === "go" ? 28 : 12);
}

export function setAudioAppActive(isActive) {
  appIsActive = Boolean(isActive);
  if (!appIsActive) {
    stopMusic();
    stopActiveEffects();
    audioContext?.suspend?.();
    return;
  }
  if (!audioUnlocked || !getAudioPreferences().music) return;
  audioContext?.resume?.();
  startMusic();
}

function resolveMusicCueId(scene) {
  if (!isKoreanHarvestContentRuntimeReady()) return MUSIC_CUES.yearRound;
  return MUSIC_CUES[scene] || MUSIC_CUES.home;
}

function getMusicElement() {
  const cueId = resolveMusicCueId(requestedMusicScene);
  if (musicElement && musicCueId === cueId) return musicElement;
  const url = getAudioCueUrls(cueId)[0];
  if (!url || typeof Audio === "undefined") return null;
  musicElement?.pause();
  musicCueId = cueId;
  musicElement = new Audio(url);
  musicElement.loop = true;
  musicElement.preload = "auto";
  musicElement.volume = sceneMusicVolume(requestedMusicScene);
  return musicElement;
}

function sceneMusicVolume(scene) {
  if (scene === "timeAttack") return 0.34;
  if (scene === "dialogue") return 0.19;
  if (scene === "puzzle") return 0.23;
  return 0.27;
}

function pickVariation(cueId, count, requestedIndex) {
  if (count <= 1) return 0;
  if (Number.isInteger(requestedIndex)) return Math.max(0, Math.min(count - 1, requestedIndex));
  const previous = lastVariationByCue.get(cueId) ?? -1;
  let next = Math.floor(Math.random() * count);
  if (next === previous) next = (next + 1) % count;
  lastVariationByCue.set(cueId, next);
  return next;
}

function stopActiveEffects() {
  for (const player of activePlayers) {
    player.pause?.();
    player.currentTime = 0;
  }
  activePlayers.clear();
}

function lightVibrate(duration) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try { navigator.vibrate(duration); } catch { /* Haptics are optional. */ }
}

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  audioContext ||= new AudioContext();
  return audioContext;
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function readBool(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function writeBool(key, value) {
  try { localStorage.setItem(key, String(Boolean(value))); } catch { /* Ignore restricted storage. */ }
}
