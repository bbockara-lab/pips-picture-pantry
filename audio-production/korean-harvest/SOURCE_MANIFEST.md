# Korean Harvest Audio Source Manifest

Generated on 2026-08-29 with Stable Audio SA3 using the Creator plan (Stable Audio Solo subscription).

- Prompt source: `docs/KOREAN_HARVEST_AUDIO_GENERATION_PROMPTS.md`
- Stable Audio download format: 44.1 kHz, 16-bit stereo PCM WAV
- Status: all 322 approved processed cues have loudness-normalized MP3 runtime derivatives; physical-device listening and final loop-boundary sign-off remain release gates
- Shipping rule: do not copy these WAV masters into `src/assets/music/`; only approved compressed derivatives belong in the app bundle
- Stable Audio credits remaining after generation: 247

## Background music masters

| Cue | Duration | Size (bytes) | SHA-256 |
| --- | ---: | ---: | --- |
| `bgm_cozy_year_round_v2.wav` | 180 s | 31,752,044 | `3caa6e51ab28c3bdc9e35e7208e316ebb49244604e74b7d24f7cbbe71d03fc3e` |
| `bgm_harvest_album_map.wav` | 90 s | 15,876,044 | `8ac9ab341dccbf9858f1ef56bf6a4e6119c6bae4a8e163ac822c4b4f710e106a` |
| `bgm_harvest_dialogue.wav` | 90 s | 15,876,044 | `19479bf8e7dc01a53aca478171acff1e76f0d6a860e97d205dcb2cf3122bb02f` |
| `bgm_harvest_home.wav` | 180 s | 31,752,044 | `e585387ce1889a789ab3bf8a4b2a525d7dabcb150ae0996a947ce77d9208934d` |
| `bgm_harvest_pantry.wav` | 90 s | 15,876,044 | `44d4f6bacada9bf4e39dacac8f05a2265b147b4dadc3c92fc89cdf91d452aab4` |
| `bgm_harvest_puzzle.wav` | 180 s | 31,752,044 | `4d31e265ab4d7c1a7c84319f3bfb1e8256a7ab6b04dcb22c4decc4483f3b580d` |
| `bgm_harvest_spoon_run.wav` | 90 s | 15,876,044 | `551838395dad245d417327d9377431530c54a0b2434a12c8d1cc3965449b2b24` |
| `bgm_harvest_time_attack.wav` | 90 s | 15,876,044 | `1c2f98a8a27b00f2f5da31a058d1c167f2712e7b808090d9ca0e3555c855c7a3` |

## Complete generated pack

| Deliverable | Raw source masters | Processed 48 kHz / 24-bit files |
| --- | ---: | ---: |
| Background music | 8 | 8 |
| Musical stingers | 9 | 9 |
| Core interaction SFX | 101 | 265 variations |
| Environmental/acoustic cues | 7 | 20 variations |
| Pip nonverbal reactions | 1 consistent 30-second source session | 20 isolated reactions |
| **Total** | **126** | **322** |

The processed pack is stored by category under `processed/`. Core and environmental variants use the `a` through `e` suffixes specified by the production plan. The deterministic conversion and variation process is in `scripts/process-korean-harvest-audio.sh`.

Runtime derivatives are stored under `src/assets/audio/korean-harvest/` and are recreated by `scripts/prepare-korean-harvest-runtime-audio.sh`. `npm run qa:audio` enforces a one-to-one match with the 322 approved processed sources, rejects suspiciously small outputs, and keeps every draft outside the bundle. The runtime catalog loads all approved variations, prevents an identical variation from repeating consecutively, maps eight music scenes, and replaces the previous oscillator placeholders for the primary UI, puzzle, cursor, completion, Time Attack, purchase and reward paths.

`sfx_collectible_effect_on` and `sfx_collectible_effect_off` were intentionally not generated because the collectible bonus-effect activation feature was removed. The remaining 101 core event families exactly match the current production list after that removal.

Pip's 20 reactions were generated together in `masters/pip/pip_reaction_pack_source.wav` to keep one character identity. The source contained one extra trailing reaction; the first 20 requested events were isolated in their specified order under `processed/pip/`. The untouched source remains available for re-editing.

## Non-shipping references

The first free-tier generations are preserved only for comparison under `drafts/free-tier/`:

- `bgm_harvest_home_free_draft.wav`
- `bgm_harvest_pantry_free_draft.wav`
- `bgm_harvest_puzzle_free_draft.wav`

These drafts must not replace the Creator masters or ship in a release build.

Parallel browser testing also produced eight files whose cue identity could not be proven. They were preserved, not deleted, under `drafts/ambiguous-parallel/` and must not ship.
