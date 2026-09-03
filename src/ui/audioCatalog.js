const modules = import.meta.glob("../assets/audio/korean-harvest/**/*.mp3", {
  eager: true,
  query: "?url",
  import: "default"
});

const catalog = Object.freeze(Object.entries(modules).reduce((entries, [path, url]) => {
  const filename = path.split("/").at(-1)?.replace(/\.mp3$/, "") || "";
  const group = path.split("/").at(-2) || "";
  const cueId = ["sfx", "ambience", "pip"].includes(group)
    ? filename.replace(/_[a-e]$/, "")
    : filename;
  if (!entries[cueId]) entries[cueId] = [];
  entries[cueId].push(url);
  return entries;
}, {}));

export const MUSIC_CUES = Object.freeze({
  yearRound: "bgm_cozy_year_round_v2",
  home: "bgm_harvest_home",
  puzzle: "bgm_harvest_puzzle",
  pantry: "bgm_harvest_pantry",
  spoonRun: "bgm_harvest_spoon_run",
  timeAttack: "bgm_harvest_time_attack",
  albumMap: "bgm_harvest_album_map",
  dialogue: "bgm_harvest_dialogue"
});

export function getAudioCueUrls(cueId) {
  return catalog[String(cueId || "")] || [];
}

export function getAudioCueIds() {
  return Object.keys(catalog);
}
