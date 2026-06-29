const SFX_KEY = "pips-picture-pantry:v0.1:sfx";
const MUSIC_KEY = "pips-picture-pantry:v0.1:music";
const MUSIC_LOOP_MS = 12000;

let audioContext = null;
let musicNodes = null;
let audioUnlocked = false;

const cozyLoop = [
  { at: 0, frequency: 523.25, duration: 1.4, volume: 0.018, type: "sine" },
  { at: 900, frequency: 659.25, duration: 1.1, volume: 0.014, type: "triangle" },
  { at: 1800, frequency: 783.99, duration: 1.2, volume: 0.014, type: "triangle" },
  { at: 3000, frequency: 659.25, duration: 1.2, volume: 0.012, type: "sine" },
  { at: 4200, frequency: 587.33, duration: 1.4, volume: 0.014, type: "sine" },
  { at: 5400, frequency: 698.46, duration: 1.1, volume: 0.012, type: "triangle" },
  { at: 6600, frequency: 880, duration: 1.5, volume: 0.012, type: "triangle" },
  { at: 8400, frequency: 783.99, duration: 1.2, volume: 0.011, type: "sine" },
  { at: 9900, frequency: 659.25, duration: 1.6, volume: 0.012, type: "sine" }
];

const cozyBass = [
  { at: 0, frequency: 130.81, duration: 3.2 },
  { at: 3600, frequency: 146.83, duration: 2.8 },
  { at: 6600, frequency: 174.61, duration: 2.8 },
  { at: 9600, frequency: 146.83, duration: 2.2 }
];

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

export function playStageComplete() {
  if (!getAudioPreferences().sfx) {
    return;
  }
  playTone(523, 0.08, 0.07, "sine");
  globalThis.setTimeout(() => playTone(659, 0.08, 0.07, "sine"), 90);
  globalThis.setTimeout(() => playTone(784, 0.08, 0.07, "sine"), 180);
  globalThis.setTimeout(() => playTone(1047, 0.18, 0.09, "sine"), 270);
  globalThis.setTimeout(() => playTone(1047, 0.12, 0.07, "triangle"), 460);
}

export function startMusic() {
  if (!getAudioPreferences().music || musicNodes) {
    return;
  }

  const context = getContext();
  if (!context || !audioUnlocked) {
    return;
  }

  context.resume?.();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.72, context.currentTime);
  gain.connect(context.destination);
  musicNodes = { gain, timers: new Set(), oscillators: new Set() };
  scheduleMusicLoop();
}

export function stopMusic() {
  if (!musicNodes) {
    return;
  }

  musicNodes.timers.forEach((timer) => globalThis.clearTimeout(timer));
  musicNodes.oscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already be stopped by its envelope.
    }
  });
  musicNodes.gain.disconnect();
  musicNodes = null;
}

function scheduleMusicLoop() {
  if (!musicNodes) {
    return;
  }

  [...cozyLoop, ...cozyBass.map((note) => ({ ...note, volume: 0.01, type: "sine" }))].forEach((note) => {
    const timer = globalThis.setTimeout(() => {
      musicNodes?.timers.delete(timer);
      playMusicNote(note.frequency, note.duration, note.volume, note.type);
    }, note.at);
    musicNodes.timers.add(timer);
  });

  const loopTimer = globalThis.setTimeout(() => {
    musicNodes?.timers.delete(loopTimer);
    scheduleMusicLoop();
  }, MUSIC_LOOP_MS);
  musicNodes.timers.add(loopTimer);
}

function playMusicNote(frequency, duration, volume, type) {
  const context = getContext();
  if (!context || !musicNodes) {
    return;
  }

  const oscillator = context.createOscillator();
  const noteGain = context.createGain();
  const now = context.currentTime;
  const attack = 0.08;
  const release = Math.min(0.45, duration * 0.42);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.linearRampToValueAtTime(volume, now + attack);
  noteGain.gain.setValueAtTime(volume, now + Math.max(attack, duration - release));
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(noteGain);
  noteGain.connect(musicNodes.gain);
  musicNodes.oscillators.add(oscillator);
  oscillator.onended = () => {
    musicNodes?.oscillators.delete(oscillator);
    noteGain.disconnect();
  };
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
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
