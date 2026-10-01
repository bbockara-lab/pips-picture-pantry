# Evergreen Audio Generation Log

Generated in Stable Audio on 2026-09-30 using the signed-in Creator plan. The untouched WAV exports are kept in `audio-production/year-round/stable-audio-originals/`; shipping MP3 derivatives are in `src/assets/audio/year-round/bgm/`.

## Runtime mapping

| Screens | Runtime cue | Stable Audio session | Source length | Shipping length |
| --- | --- | --- | ---: | ---: |
| Home, dialogue | `bgm_evergreen_home_v1` | Cozy Pantry Workshop | 120 s | 118 s |
| Puzzle | `bgm_evergreen_puzzle_v1` | Capybara Kitchen | 150 s | 148 s |
| Pantry, album, completion | `bgm_evergreen_collection_v1` | Capybara Kitchen Waltz | 120 s | 118 s |
| Spoon Run, time attack | `bgm_evergreen_time_attack_v1` | Capybara Kitchen Rush | 90 s | 88 s |

The shipping files use 44.1 kHz stereo MP3 at 160 kbps. A two-second circular crossfade removes the generated fade-out and makes the browser/native loop boundary continuous. Runtime loudness is aligned with the existing soundtrack at approximately -19 to -21 LUFS.

## Prompts

### Home

> Instrumental cozy mobile puzzle game background music for Pip's Picture Pantry, a warm evergreen pantry workshop with a cute young capybara chef. 80 BPM gentle 4/4, warm handcrafted chamber-folk palette, soft felt marimba, delicate pizzicato strings, muted wooden percussion, gentle upright bass, tiny ceramic taps, airy flute used sparingly. Friendly curiosity, sunny kitchen warmth, quiet satisfaction, youthful and adorable rather than grand or rustic. A simple memorable four-note motif in the first two seconds, light development, plenty of breathing room for menu interaction. Clean stereo mix, phone-speaker friendly, no vocals, no East Asian holiday instruments, no seasonal or Christmas feeling, no modern pop drums, no cinematic impacts, no casino sound, no harsh highs. Seamless loop with matching start and end, no fade-out.

### Puzzle

> Instrumental focus music for a cozy mobile nonogram puzzle game starring a cute young capybara chef. 76 BPM gentle 4/4, D major with soft modal color, very sparse felt marimba notes, quiet pizzicato strings, brushed wooden ticks, mellow upright bass, occasional airy flute answer. Calm concentration, patient curiosity, tiny moments of discovery; warm and handcrafted but never sleepy. Keep the midrange uncluttered and dynamics even so taps, hints, and reward sounds remain clearly audible. No vocals, no holiday or East Asian seasonal instruments, no big melody, no modern drums, no cinematic swells, no tension, no harsh highs. Seamless loop, matching start and end, no fade-out, phone-speaker friendly.

### Collection and completion

> Instrumental cozy collection and celebration music for Pip's Picture Pantry, a cute capybara chef's illustrated pantry album. 82 BPM gentle 6/8, warm glockenspiel used softly, felt marimba, pizzicato strings, tiny hand percussion, mellow upright bass, delicate flute and clarinet. Tender pride, completed-picture satisfaction, browsing handmade keepsakes, bright and adorable without becoming childish or grand. A small rising motif that feels related to a cozy kitchen theme, light sparkling accents with lots of space for UI sounds. No vocals, no holiday or East Asian seasonal instruments, no Christmas bells, no cinematic orchestra, no pop drums, no harsh highs. Seamless loop with matching start and end, no fade-out, clean phone-speaker mix.

### Timed modes

> Instrumental upbeat timed-challenge music for a cozy mobile puzzle game starring a cute young capybara chef. 108 BPM light 4/4, plucky marimba, pizzicato strings, nimble muted woodblocks, soft upright bass, tiny clarinet flourishes. Playful forward motion and cheerful focus, energetic but never stressful, no urgency sirens and no heavy percussion. Keep a clear compact rhythm while leaving room for taps, countdown ticks, and reward sounds. No vocals, no holiday or East Asian seasonal instruments, no cinematic impacts, no EDM, no casino feeling, no brass blasts, no harsh highs. Seamless loop with matching start and end, no fade-out, phone-speaker friendly.

## Seasonal transition

The Korean Harvest soundtrack is selected only while `isKoreanHarvestEventVisible()` is true. Starting on 2026-10-05 local device time, the evergreen mapping above takes priority. Harvest puzzles remain available through the archive flow without keeping the seasonal home soundtrack active.

Existing interaction, reward, Pip, and completion effects remain in use. Their runtime calls are material- and action-based rather than date-bound; no effect call explicitly selects the two harvest-only ambience cues after the event.
