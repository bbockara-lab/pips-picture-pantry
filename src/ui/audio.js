const SFX_KEY = "pips-picture-pantry:v0.1:sfx";
const MUSIC_KEY = "pips-picture-pantry:v0.1:music";
let audioContext = null;
let musicNodes = null;
let audioUnlocked = false;

export function getAudioPreferences() {
  return {
    sfx: readBool(SFX_KEY, true),
    music: readBool(MUSIC_KEY, false)
  };
}

export function setSfxEnabled(enabled) {
  writeBool(SFX_KEY, enabled);
}

export function setMusicEnabled(enabled) {
  writeBool(MUSIC_KEY, enabled);
  if (!enabled) {
    stopMusic();
  }
}

export function unlockAudio() {
  const context = getContext();
  if (!context) {
    return;
  }
  audioUnlocked = true;
  context.resume?.();
  if (getAudioPreferences().music) {
    startMusic();
  }
}

export function playTap() {
  if (!getAudioPreferences().sfx) {
    return;
  }
  playTone(660, 0.025, 0.035, "triangle");
}

export function playComplete() {
  if (!getAudioPreferences().sfx) {
    return;
  }
  playTone(523, 0.06, 0.05, "sine");
  globalThis.setTimeout(() => playTone(659, 0.08, 0.05, "sine"), 70);
  globalThis.setTimeout(() => playTone(784, 0.12, 0.045, "sine"), 145);
}

export function startMusic() {
  // BGM placeholder: enable again when an original looped audio file is added.
  stopMusic();
}

export function stopMusic() {
  if (!musicNodes) {
    return;
  }
  musicNodes.low.stop();
  musicNodes.high.stop();
  musicNodes.gain.disconnect();
  musicNodes = null;
}

function playTone(frequency, duration, volume, type) {
  const context = getContext();
  if (!context) {
    return;
  }
  context.resume?.();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function getContext() {
  if (typeof window === "undefined") {
    return null;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }
  audioContext ||= new AudioContext();
  return audioContext;
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
  try {
    localStorage.setItem(key, String(Boolean(value)));
  } catch {
    // Ignore storage failures in restricted browser modes.
  }
}
