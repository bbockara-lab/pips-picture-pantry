#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
source_root="$project_root/audio-production/korean-harvest/processed"
runtime_root="$project_root/src/assets/audio/korean-harvest"

mkdir -p "$runtime_root/bgm" "$runtime_root/stingers" "$runtime_root/sfx" "$runtime_root/ambience" "$runtime_root/pip"

encode_group() {
  local group="$1"
  local loudness="$2"
  local quality="$3"
  local source output
  for source in "$source_root/$group"/*.wav; do
    output="$runtime_root/$group/$(basename "${source%.wav}").mp3"
    ffmpeg -hide_banner -loglevel error -y -i "$source" \
      -af "loudnorm=I=${loudness}:LRA=8:TP=-1.5" \
      -ar 48000 -c:a libmp3lame -q:a "$quality" "$output"
  done
}

encode_group bgm -22 5
encode_group stingers -18 4
encode_group sfx -19 5
encode_group ambience -26 6
encode_group pip -18 5

echo "Runtime audio derivatives prepared at $runtime_root"
