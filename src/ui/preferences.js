
const CONTROL_MODE_KEY = "pips-picture-pantry:v0.1:control-mode";
const CONTROL_MODE_VALUES = new Set(["auto", "direct", "cursor"]);
const CURSOR_TRAIL_KEY = "pips-picture-pantry:v0.1:cursor-trail";


export function getControlModePreference() {
  const stored = localStorage.getItem(CONTROL_MODE_KEY);
  return CONTROL_MODE_VALUES.has(stored) ? stored : "direct";
}

export function setControlModePreference(value) {
  const next = CONTROL_MODE_VALUES.has(value) ? value : "direct";
  localStorage.setItem(CONTROL_MODE_KEY, next);
  return next;
}

export function getCursorTrailPreference() {
  return localStorage.getItem(CURSOR_TRAIL_KEY) !== "off";
}

export function setCursorTrailPreference(enabled) {
  const next = Boolean(enabled);
  localStorage.setItem(CURSOR_TRAIL_KEY, next ? "on" : "off");
  return next;
}
