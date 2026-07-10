const HIDE_COMPLETED_STAGES_KEY = "pips-picture-pantry:v0.1:hide-completed-stages";
const CONTROL_MODE_KEY = "pips-picture-pantry:v0.1:control-mode";
const CONTROL_MODE_VALUES = new Set(["auto", "direct", "cursor"]);

export function getHideCompletedStagesPreference() {
  return localStorage.getItem(HIDE_COMPLETED_STAGES_KEY) === "true";
}

export function setHideCompletedStagesPreference(value) {
  localStorage.setItem(HIDE_COMPLETED_STAGES_KEY, value ? "true" : "false");
}

export function getControlModePreference() {
  const stored = localStorage.getItem(CONTROL_MODE_KEY);
  return CONTROL_MODE_VALUES.has(stored) ? stored : "auto";
}

export function setControlModePreference(value) {
  const next = CONTROL_MODE_VALUES.has(value) ? value : "auto";
  localStorage.setItem(CONTROL_MODE_KEY, next);
  return next;
}