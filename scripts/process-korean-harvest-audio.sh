#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
audio_root="$project_root/audio-production/korean-harvest"
plan="$project_root/docs/KOREAN_HARVEST_AUDIO_AND_CURSOR_PLAN.md"

mkdir -p "$audio_root/processed/sfx" "$audio_root/processed/ambience" "$audio_root/processed/stingers" "$audio_root/processed/bgm"

convert_base() {
  local source="$1"
  local output="$2"
  local mode="${3:-trim}"
  local filter

  if [[ "$mode" == "loop" ]]; then
    filter="aresample=48000"
  else
    filter="silenceremove=start_periods=1:start_duration=0.005:start_threshold=-60dB:stop_periods=1:stop_duration=0.04:stop_threshold=-60dB,apad=pad_dur=0.03,aresample=48000"
  fi

  ffmpeg -hide_banner -loglevel error -y -i "$source" -af "$filter" -c:a pcm_s24le "$output"
}

make_variant() {
  local source="$1"
  local output="$2"
  local variant="$3"
  local filter

  case "$variant" in
    b) filter="volume=0.97,asetrate=49431,aresample=48000,atempo=0.97105" ;;
    c) filter="adelay=10|10,asetrate=50856,aresample=48000,atempo=0.94385" ;;
    d) filter="lowpass=f=6200,volume=1.01" ;;
    e) filter="equalizer=f=680:t=q:w=1.1:g=2.2,volume=0.99" ;;
    *) return 1 ;;
  esac

  ffmpeg -hide_banner -loglevel error -y -i "$source" -af "$filter" -c:a pcm_s24le "$output"
}

while IFS=$'\t' read -r cue count; do
  [[ "$cue" == "sfx_collectible_effect_on" || "$cue" == "sfx_collectible_effect_off" ]] && continue
  source="$audio_root/masters/sfx/$cue.wav"
  [[ -f "$source" ]] || { echo "Missing SFX master: $cue" >&2; exit 1; }
  mode="trim"
  [[ "$cue" == "sfx_store_connecting" ]] && mode="loop"
  base="$audio_root/processed/sfx/${cue}_a.wav"
  convert_base "$source" "$base" "$mode"
  for ((i=2; i<=count; i++)); do
    letter=$(printf "\\$(printf '%03o' $((96+i)))")
    make_variant "$base" "$audio_root/processed/sfx/${cue}_${letter}.wav" "$letter"
  done
done < <(awk -F'|' '/^\| `sfx_/ {gsub(/`|^[ \t]+|[ \t]+$/, "", $2); gsub(/^[ \t]+|[ \t]+$/, "", $3); print $2 "\t" ($3+0)}' "$plan")

while IFS=$'\t' read -r cue count; do
  source="$audio_root/masters/ambience/$cue.wav"
  [[ -f "$source" ]] || { echo "Missing ambience master: $cue" >&2; exit 1; }
  mode="trim"
  [[ "$cue" == "amb_harvest_workshop_night" || "$cue" == "amb_harvest_window_breeze" ]] && mode="loop"
  base="$audio_root/processed/ambience/${cue}_a.wav"
  convert_base "$source" "$base" "$mode"
  for ((i=2; i<=count; i++)); do
    letter=$(printf "\\$(printf '%03o' $((96+i)))")
    make_variant "$base" "$audio_root/processed/ambience/${cue}_${letter}.wav" "$letter"
  done
done < <(awk -F'|' '/^\| `amb_/ {gsub(/`|^[ \t]+|[ \t]+$/, "", $2); gsub(/^[ \t]+|[ \t]+$/, "", $3); print $2 "\t" ($3+0)}' "$plan")

for source in "$audio_root"/masters/stingers/*.wav; do
  cue="$(basename "$source" .wav)"
  convert_base "$source" "$audio_root/processed/stingers/$cue.wav" trim
done

for source in "$audio_root"/masters/bgm/*.wav; do
  cue="$(basename "$source" .wav)"
  convert_base "$source" "$audio_root/processed/bgm/$cue.wav" loop
done

echo "Processed Korean Harvest audio pack."
