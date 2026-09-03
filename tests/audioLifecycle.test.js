import { beforeEach, describe, expect, it, vi } from "vitest";

const MUSIC_KEY = "pips-picture-pantry:v0.1:music";

function createStorage(music = null) {
  const values = new Map();
  if (music !== null) values.set(MUSIC_KEY, String(music));
  return {
    getItem: vi.fn((key) => values.has(key) ? values.get(key) : null),
    setItem: vi.fn((key, value) => values.set(key, String(value)))
  };
}

async function loadAudio({ music = null } = {}) {
  vi.resetModules();
  const element = {
    loop: false,
    preload: "",
    volume: 1,
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn()
  };
  const context = {
    currentTime: 0,
    resume: vi.fn(() => Promise.resolve()),
    suspend: vi.fn(() => Promise.resolve()),
    createOscillator: vi.fn(),
    createGain: vi.fn(),
    destination: {}
  };
  vi.stubGlobal("localStorage", createStorage(music));
  vi.stubGlobal("Audio", vi.fn(() => element));
  vi.stubGlobal("window", { AudioContext: vi.fn(() => context) });
  const audio = await import("../src/ui/audio.js");
  return { audio, element, context };
}

describe("app audio lifecycle", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("pauses music and suspends Web Audio when the app becomes inactive", async () => {
    const { audio, element, context } = await loadAudio();
    audio.unlockAudio();
    audio.setAudioAppActive(false);

    expect(element.pause).toHaveBeenCalledTimes(1);
    expect(context.suspend).toHaveBeenCalledTimes(1);
  });

  it("resumes enabled music when the app becomes active again", async () => {
    const { audio, element, context } = await loadAudio();
    audio.unlockAudio();
    audio.setAudioAppActive(false);
    const playsBeforeResume = element.play.mock.calls.length;
    audio.setAudioAppActive(true);

    expect(context.resume).toHaveBeenCalled();
    expect(element.play.mock.calls.length).toBe(playsBeforeResume + 1);
  });

  it("does not restart music that the user disabled", async () => {
    const { audio, element } = await loadAudio({ music: false });
    audio.unlockAudio();
    audio.setAudioAppActive(false);
    audio.setAudioAppActive(true);

    expect(element.play).not.toHaveBeenCalled();
  });

  it("keeps music silent across app resume during Time Attack, then restores it on exit", async () => {
    const { audio, element } = await loadAudio();
    audio.unlockAudio();
    audio.setMusicSuppressed(true);
    const playsBeforeResume = element.play.mock.calls.length;

    audio.setAudioAppActive(false);
    audio.setAudioAppActive(true);
    expect(element.play.mock.calls.length).toBe(playsBeforeResume);

    audio.setMusicSuppressed(false);
    expect(element.play.mock.calls.length).toBe(playsBeforeResume + 1);
  });
});
