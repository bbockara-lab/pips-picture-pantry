# Korean Harvest Audio Production

This directory stores source masters and production records outside the shipped app bundle.

- `masters/bgm/`: lossless WAV background-music masters downloaded from Stable Audio.
- `masters/stingers/`, `masters/sfx/`, `masters/ambience/`, `masters/pip/`: untouched Stable Audio source downloads.
- `processed/`: 48 kHz / 24-bit production files, including required SFX variations and isolated Pip reactions.
- `drafts/`: non-shipping free-tier references and quarantined results whose cue identity was not provable.
- Runtime-ready compressed derivatives live in `src/assets/audio/korean-harvest/`; masters and drafts never enter the app bundle.
- Canonical filenames match the cue IDs in `docs/KOREAN_HARVEST_AUDIO_AND_CURSOR_PLAN.md`.
- Full generation status and provenance are recorded in `SOURCE_MANIFEST.md`.
