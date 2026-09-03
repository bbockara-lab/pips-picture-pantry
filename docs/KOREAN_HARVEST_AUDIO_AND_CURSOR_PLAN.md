# Korean Harvest Audio & D-pad Update Plan

Last updated: 2026-08-28

Paste-ready generation descriptions and tool/licensing guidance: `docs/KOREAN_HARVEST_AUDIO_GENERATION_PROMPTS.md`

## Release intent

The Korean Harvest release updates the complete audible identity of Pip's Picture Pantry and corrects the D-pad Trail Paint interaction before Android and iOS packages are built from the shared source.

This is a production brief, not authorization to activate the seasonal content gate or overwrite the current signed release artifacts.

## Confirmed D-pad issue

### Current behavior

- Trail Paint defaults to on.
- Color or Blank remains latched as `session.brushMode`.
- Every arrow movement calls `moveSelectedCell()`.
- When `session.trailEnabled` is true, every destination is immediately painted, including a short single arrow tap.
- Pointer hold begins repeating after 320 ms at 105 ms intervals, but the paint logic does not distinguish the first short movement from the repeated hold movements.
- The current unit test explicitly treats paint-on-every-move as correct, so the existing green test suite cannot catch this UX mismatch.
- This code is shared by Android and iOS; it is not an Android-only performance defect.

Relevant implementation:

- `src/ui/puzzleCursorControls.js`
- `src/ui/puzzleView.js`
- `tests/cursorControls.test.js`
- `src/i18n/ko.js` and `src/i18n/en.js`, `guide.cursorControlsIntro`

### Required Korean Harvest behavior

1. A short arrow tap moves the cursor only.
2. Color or Blank applies its action to the currently selected cell and remembers that brush.
3. Holding an arrow past the hold threshold starts Trail Paint with the remembered brush.
4. Repeated destinations are painted only while the arrow remains held.
5. Releasing, cancelling or losing pointer capture stops both movement and painting immediately.
6. With Trail Paint disabled, short taps and holds move only; Color and Blank still act on the current cell.
7. Keyboard input follows the same model: non-repeated arrow keydown moves only; repeated keydown may trail-paint after the hold/repeat boundary.
8. Direct cell tapping and finger-drag painting remain unchanged.
9. The active Color/Blank styling must read as “selected brush”, not “button is physically being held”.

### Regression acceptance tests

- Quick arrow tap with Trail Paint on: cursor moves one cell and the destination remains empty.
- Color current cell, then quick arrow tap: current cell is colored; destination remains empty.
- Hold arrow with Color selected: repeated destination cells become filled until release.
- Hold arrow with Blank selected: repeated destination cells become X-marked until release.
- Hold arrow with Trail Paint off: repeated cursor movement occurs without modifying cells.
- Release, `pointercancel`, and `lostpointercapture`: no additional movement or paint occurs.
- Board edge: holding against an edge produces no history spam and no repeated boundary sound.
- One held trail is recorded as one undoable move where practical; otherwise the history contract must be documented and tested.
- The first 8x8 guide demonstrates a quick move separately from a held paint trail.
- Physical Android and iPhone checks cover quick tap, long hold, direction change, rapid release and all four directions.

## Reported Next Picture responsiveness issue

### Player-visible symptom

- On the completion screen, tapping **Next Picture / 다음 그림** can appear to do nothing immediately.
- The lack of prompt acknowledgement leads the player to tap two or three times.
- The current completion button waits for its `click` handler to call `selectNextPuzzle()` and then rebuild the screen; there is no explicit immediate busy/transition state on the button.
- The root cause is not yet proven. The Korean Harvest pass must profile puzzle selection, local persistence, image decoding and the following `draw()` instead of treating this as a styling-only problem.

Relevant implementation:

- `src/ui/pipReaction.js`, completion action button
- `src/ui/appShell.js`, `selectNextPuzzle()` and `selectPuzzle()`
- `src/ui/playScreen.js` and `src/ui/puzzleView.js`, next puzzle render path

### Required Korean Harvest behavior

1. The first pointer press shows a visible pressed state within one rendered frame.
2. The first accepted tap immediately disables the action and displays a short transition/loading acknowledgement when navigation cannot finish in the same frame.
3. Repeated taps while the transition is active are ignored; they must never skip multiple pictures or invoke completion/reward logic twice.
4. The next puzzle screen should become interactive promptly on both platforms; profile and remove avoidable synchronous work from the navigation path.
5. Preload or decode the next puzzle's required visual assets before they are displayed when that work is responsible for the delay.
6. Preserve keyboard activation, screen-reader naming and focus behavior.

### Responsiveness acceptance tests

- One tap always produces immediate visual acknowledgement and exactly one navigation event.
- Three rapid taps still advance exactly one picture.
- No duplicate reward, completion, history or analytics side effect occurs.
- Measure input-to-feedback and input-to-next-screen timing on a physical iPhone and a mid-range physical Android device, not simulator only.
- Test after cold launch, after a long play session, with music/effects on and off, and in airplane mode.
- Verify normal puzzle, replay challenge and daily-picture completion paths separately because their navigation branches differ.

## Current audio baseline

- Runtime music: one file, `src/assets/music/bgm-cozy.mp3`, approximately 171 seconds, 48 kHz stereo.
- Runtime effects: synthesized WebAudio tones in `src/ui/audio.js` for generic button tap, cursor move, cursor action, puzzle complete, shelf complete and Time Attack countdown.
- Most buttons are routed through the same global `playTap()` sound.
- Time Attack currently suppresses normal BGM instead of switching to a dedicated track.
- There are no authored audio files for rewards, spoons, Pantry purchases, Album saves, badges, mailbox, stage unlocks, hints, errors or Pip reactions.

## Audio identity

### Desired character

- Warm, handmade, tactile and small-scale rather than cinematic or glossy.
- Korean Harvest color comes from restrained gayageum-like plucks, soft daegeum breath, light janggu/wood percussion, yugi-brass taps, paper, wood, ceramic and cloth textures.
- Cultural instruments must sound musically intentional, not like a generic “Asian” preset.
- Pip's sounds are short nonverbal mascot reactions, never baby speech or human dialogue.
- Frequent puzzle sounds must remain soft enough for long sessions.
- Avoid casino chimes, slot-machine coin showers, notification pings, sharp 3–6 kHz clicks, giant trailer impacts and constant sparkle noise.

## Deliverable summary

The complete target pack contains:

- 8 loopable music tracks.
- 9 musical stingers.
- 103 core interaction SFX event families, rendered as 269 files with variations.
- 7 optional environmental/acoustic event families, rendered as 20 files with variations.
- 289 total authored SFX/ambience files when the complete optional set is included.
- 20 optional but recommended Pip vocal-reaction files.
- WAV masters, implementation derivatives, stems/project files and a cue sheet.

The variation counts below are part of the deliverable. Repeating actions must not replay one identical sample every time.

## Background music — 8 loopable tracks

| ID | Screen / purpose | Target length | Direction |
| --- | --- | ---: | --- |
| `bgm_harvest_home` | Seasonal Puzzle Room / home | 120–180 s | Welcoming moonlit workshop theme; memorable but quiet melody. |
| `bgm_harvest_puzzle` | Normal puzzle solving | 120–180 s | Sparse, low-distraction arrangement with fewer melody notes and no strong cadence. |
| `bgm_harvest_pantry` | Pip's Pantry and collectible browsing | 90–150 s | Warm shelf, ceramic and wood character; gentle curiosity. |
| `bgm_harvest_spoon_run` | Daily picture and replay rewards | 75–120 s | Slightly brighter walking pulse without urgency. |
| `bgm_harvest_time_attack` | Active Time Attack | 75–120 s | Clear pulse and controlled tension; no alarming percussion; loop must survive three rounds. |
| `bgm_harvest_album_map` | Album, badges and stage map | 90–150 s | Reflective collection-room variation; wider space and fewer transients. |
| `bgm_harvest_dialogue` | Pip guides, mailbox letters and story cards | 60–90 s | Very light underscore leaving room for reading; may reuse the home motif. |
| `bgm_cozy_year_round_v2` | Non-seasonal fallback replacement | 120–180 s | Updated core Sunny Spoon theme with no seasonal instrument dependency. |

### Music stems requested

For every BGM deliver a full mix and at least these stems:

- Melody / featured instrument.
- Harmony / sustained bed.
- Rhythm / percussion.
- Bass / low support.
- Texture / ambience.

Time Attack additionally needs a low-intensity and high-intensity stem or two compatible full mixes so the final 30 seconds can intensify without changing tempo or bar position.

## Musical stingers — 9 files

| ID | Duration | Trigger |
| --- | ---: | --- |
| `stinger_brand_intro` | 1.8–2.8 s | Sunny Spoon / Pip logo reveal. |
| `stinger_puzzle_complete` | 1.5–2.3 s | A picture gains its completion colors. |
| `stinger_shelf_complete` | 3.0–4.5 s | Entire puzzle shelf complete. |
| `stinger_badge_earned` | 2.2–3.2 s | Badge appears and is saved. |
| `stinger_collectible_unlocked` | 2.0–3.0 s | Pantry collectible becomes available. |
| `stinger_time_attack_round` | 1.0–1.6 s | 5x5 to 8x8 and 8x8 to 10x10 transition. |
| `stinger_time_attack_success` | 2.5–3.8 s | All three rounds cleared. |
| `stinger_time_attack_best` | 3.0–4.2 s | New best result; must clearly exceed ordinary success. |
| `stinger_time_attack_fail` | 1.8–2.8 s | Time expired; encouraging, never punishing. |

## Core SFX production list

### A. Global UI and navigation

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_ui_tap_soft` | 4 | Ordinary secondary buttons and cards. |
| `sfx_ui_tap_primary` | 3 | Play Now, Start, Challenge and primary confirmation. |
| `sfx_ui_back` | 2 | Back / return navigation. |
| `sfx_ui_close` | 2 | Close modal, guide or detail card. |
| `sfx_ui_modal_open` | 2 | Settings, confirmation, purchase detail, guide. |
| `sfx_ui_modal_close` | 2 | Modal dismissal. |
| `sfx_ui_toggle_on` | 2 | Settings enabled. |
| `sfx_ui_toggle_off` | 2 | Settings disabled. |
| `sfx_ui_tab_switch` | 3 | Language, mailbox filter and section switching. |
| `sfx_ui_card_select` | 3 | Puzzle card, collectible, badge or stage selected. |
| `sfx_ui_locked` | 2 | Locked shelf, puzzle, collectible or stage tapped. |
| `sfx_ui_error_soft` | 2 | Unavailable action or validation failure. |
| `sfx_ui_confirm` | 2 | Save name, reset confirmation and accepted action. |
| `sfx_ui_scroll_settle` | 2 | Optional quiet shelf/carousel snap; do not fire during free scrolling. |

### B. Puzzle cell input

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_cell_fill` | 5 | Direct or cursor Color action; short wood/brush dab. |
| `sfx_cell_mark_x` | 5 | Blank/X mark; lighter dry tick distinct from fill. |
| `sfx_cell_clear` | 3 | Remove a fill or X. |
| `sfx_drag_begin_fill` | 2 | Finger stroke begins in fill mode. |
| `sfx_drag_begin_mark` | 2 | Finger stroke begins in blank mode. |
| `sfx_drag_step_fill` | 5 | Quiet per-cell variation while sliding; extremely short. |
| `sfx_drag_step_mark` | 5 | Quiet per-cell X variation while sliding. |
| `sfx_drag_end` | 2 | Optional cloth/brush lift at valid stroke end. |
| `sfx_line_complete` | 4 | Row or column becomes logically complete. |
| `sfx_line_reopen` | 2 | Completed line becomes incomplete after correction. |
| `sfx_invalid_cell` | 2 | Locked/completed cell cannot be changed. |
| `sfx_undo` | 3 | Undo one history action. |
| `sfx_auto_x_sweep` | 3 | Remaining cells receive safe automatic X guidance. |

### C. D-pad and Trail Paint

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_cursor_move` | 5 | Quick arrow movement only; softer than cell editing. |
| `sfx_cursor_boundary` | 2 | Optional restrained edge bump, rate-limited. |
| `sfx_cursor_select_fill` | 2 | Color brush selected/applied. |
| `sfx_cursor_select_mark` | 2 | Blank brush selected/applied. |
| `sfx_cursor_trail_start_fill` | 2 | Hold threshold crossed with Color. |
| `sfx_cursor_trail_start_mark` | 2 | Hold threshold crossed with Blank. |
| `sfx_cursor_trail_step_fill` | 5 | Held arrow paints each new destination. |
| `sfx_cursor_trail_step_mark` | 5 | Held arrow marks each new destination. |
| `sfx_cursor_trail_end` | 2 | Optional short release; omit if it makes controls noisy. |
| `sfx_control_mode_switch` | 2 | D-pad / Tap Cells in-game switch. |

### D. Hints and assistance

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_hint_panel_open` | 2 | Hint panel appears. |
| `sfx_hint_select` | 2 | Hint level selected. |
| `sfx_hint_spoon_spend` | 3 | Spoons leave balance; soft descending utensil taps. |
| `sfx_hint_reveal_cell` | 4 | Revealed cell(s), synchronized per visual cluster rather than every cell. |
| `sfx_hint_insufficient_spoons` | 2 | Purchase cannot proceed; gentle hollow spoon tap. |
| `sfx_hint_cancel` | 2 | Hint confirmation dismissed. |

### E. Picture, shelf and collection progression

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_picture_color_bloom` | 4 | Completion colors spread over the solved board. |
| `sfx_picture_card_save` | 3 | Picture enters the Album. |
| `sfx_next_puzzle` | 3 | Continue to the next picture. |
| `sfx_shelf_unlock` | 3 | New puzzle shelf opens. |
| `sfx_stage_unlock` | 3 | Pantry stage/map destination opens. |
| `sfx_badge_progress` | 3 | Badge progress increments without unlocking. |
| `sfx_badge_place` | 2 | Earned badge settles into its frame. |
| `sfx_album_page_open` | 3 | Album view/card detail opens. |
| `sfx_album_page_turn` | 4 | Browse album or collection pages. |
| `sfx_collection_counter_complete` | 2 | A collection count reaches its target. |

### F. Spoon economy and rewards

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_spoon_gain_small` | 4 | 1–3 spoons gained. |
| `sfx_spoon_gain_medium` | 3 | Daily or replay reward. |
| `sfx_spoon_gain_large` | 2 | Purchase or major Pantry bonus. |
| `sfx_spoon_count_tick` | 5 | Count-up/down ticks; pitch may change programmatically. |
| `sfx_spoon_balance_settle` | 2 | Final balance lands. |
| `sfx_daily_reward_claim` | 3 | Daily picture reward claimed. |
| `sfx_replay_reward_claim` | 3 | Clean replay reward claimed. |
| `sfx_reward_limit_reached` | 2 | Daily reward limit reached, neutral rather than negative. |

### G. Pantry collectibles and purchases

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_pantry_open` | 2 | Pantry view enters; wooden cabinet/cloth detail. |
| `sfx_collectible_detail_open` | 3 | Jar or reward detail card opens. |
| `sfx_collectible_buy` | 3 | Successful spoon purchase of a collectible. |
| `sfx_collectible_insufficient` | 2 | Not enough spoons. |
| `sfx_collectible_equip` | 3 | Place/display collectible. |
| `sfx_collectible_unequip` | 2 | Remove displayed collectible. |
| `sfx_collectible_effect_on` | 2 | Activate bonus effect. |
| `sfx_collectible_effect_off` | 2 | Deactivate bonus effect. |
| `sfx_pantry_shelf_fill` | 3 | One shelf gains an item. |
| `sfx_pantry_shelf_complete` | 2 | Collection shelf completes; precedes its musical stinger. |
| `sfx_store_connecting` | 1 loop | Very soft 1.0–1.5 s loop while store connection is pending. |
| `sfx_store_window_open` | 2 | Native Apple/Google purchase sheet is requested. |
| `sfx_store_purchase_success` | 2 | Verified IAP completed and balance updated. |
| `sfx_store_purchase_cancel` | 2 | User cancelled; neutral cloth tap. |
| `sfx_store_purchase_fail` | 2 | Store error; warm and non-alarming. |

### H. Spoon Run

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_spoon_run_open` | 2 | Daily challenge card enters. |
| `sfx_daily_picture_select` | 3 | Today's picture selected. |
| `sfx_replay_pick_select` | 3 | One of the replay picks selected. |
| `sfx_clean_replay` | 2 | Replay completed without a mistake. |
| `sfx_replay_mistake` | 2 | Clean bonus is lost; subtle, not punitive. |
| `sfx_daily_progress_increment` | 3 | “Today 1/3” etc. increments. |
| `sfx_daily_all_claimed` | 2 | All daily opportunities completed. |

### I. Time Attack

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_time_count_3` | 1 | Countdown 3. |
| `sfx_time_count_2` | 1 | Countdown 2, slightly higher or brighter. |
| `sfx_time_count_1` | 1 | Countdown 1. |
| `sfx_time_go` | 2 | Start; strongest countdown transient. |
| `sfx_time_round_complete` | 2 | Round cleared before transition stinger. |
| `sfx_time_30_seconds` | 2 | First urgency cue, restrained. |
| `sfx_time_10_seconds` | 2 | Distinct stronger cue. |
| `sfx_time_final_tick` | 3 | Last five seconds; one short sample with controlled pitch variants. |
| `sfx_time_expired` | 2 | Clock hits zero. |
| `sfx_time_record_save` | 2 | Result is stored in My Record. |
| `sfx_time_exit_confirm` | 2 | Exit/abandon confirmation appears. |

### J. Mailbox, guides and story

| ID | Variations | Use |
| --- | ---: | --- |
| `sfx_mail_unread` | 3 | New/unread mail indicator. |
| `sfx_mail_open` | 3 | Envelope opens. |
| `sfx_mail_page` | 3 | Move between letter/guide pages. |
| `sfx_mail_attachment_claim` | 3 | Gift attachment claimed. |
| `sfx_guide_step` | 3 | Next guide page. |
| `sfx_guide_practice_correct` | 3 | Interactive tutorial action succeeds. |
| `sfx_guide_practice_retry` | 2 | Tutorial retry; encouraging. |
| `sfx_story_card_reveal` | 3 | Pantry story request/reward card reveals. |
| `sfx_story_choice` | 2 | Player chooses the next decoration. |

### K. Seasonal environmental accents

These are optional layers, not constant effects. They must never compete with puzzle feedback.

| ID | Variations | Use |
| --- | ---: | --- |
| `amb_harvest_workshop_night` | 1 loop | Very quiet interior night room tone. |
| `amb_harvest_window_breeze` | 1 loop | Occasional soft exterior air, no rain unless art shows rain. |
| `amb_hanji_rustle` | 3 | Mail, guide and paper-card movement. |
| `amb_bojagi_cloth` | 3 | Pantry object and reward transitions. |
| `amb_ceramic_place` | 4 | Moon jar/celadon collectible placement. |
| `amb_wood_shelf` | 3 | Pantry shelf opening/settling. |
| `amb_spoon_brass` | 5 | Physical spoon token taps used only for economy moments. |

## Pip nonverbal reaction pack — 20 files

These should be recorded or designed as a consistent mascot voice, not generated independently with changing timbre.

| ID group | Variations | Emotion |
| --- | ---: | --- |
| `pip_greeting` | 3 | Warm hello / recognition. |
| `pip_happy_small` | 3 | Small correct action or reward. |
| `pip_happy_big` | 3 | Picture or shelf completion. |
| `pip_surprised` | 2 | New collectible or reveal. |
| `pip_thinking` | 2 | Hint/guide moment. |
| `pip_encourage` | 3 | Retry or Time Attack continuation. |
| `pip_disappointed_soft` | 2 | Time expired or mistake, never scolding. |
| `pip_sleepy_cozy` | 2 | Optional idle/home reaction. |

## File and export specification

### Masters

- Sample rate: 48 kHz.
- Music/stingers: 24-bit stereo WAV masters.
- UI/cell transients: 24-bit mono WAV masters unless stereo space is essential.
- No normalization that causes inter-sample clipping.
- Music target: approximately -22 to -19 LUFS integrated, peak no higher than -1 dBTP.
- Frequent UI/cell effects: conservative short-term level, generally 4–8 dB below major reward stingers.
- Keep low-frequency content usable on phone speakers; avoid sub-bass-dependent cues.

### Runtime derivatives

- Keep WAV masters outside the shipped app bundle if compressed derivatives are used.
- Short SFX under roughly 1.5 s: 48 kHz 16-bit mono WAV is preferred for reliable low-latency playback.
- Longer stereo stingers: AAC-LC `.m4a`, 128–160 kbps, or tested WAV when size remains acceptable.
- BGM: AAC-LC `.m4a` or MP3, 48 kHz stereo, 160–192 kbps.
- Every loop must be tested in both iOS WKWebView and Android WebView for encoder-delay gaps. Supply a sample-accurate WAV loop master and loop start/end metadata.
- File names use lowercase snake case and match the IDs in this document.

### Tail and loop rules

- Button/cell effects: normally 30–350 ms; no unnecessary one-second reverb tail.
- Reward effects: normally 500–1500 ms.
- Musical stingers may reach the durations listed above.
- Loop files must begin and end at matching zero-crossing/musical boundaries.
- Reverb tails that cross a loop point belong in a separate tail stem or must be printed into both ends correctly.

## Runtime implementation requirements

- Replace oscillator-only `playTone()` events with named asset cues and a small reusable audio manager.
- Preload the common cell, cursor and UI cues after the first user gesture.
- Use a round-robin variation selector that does not repeat the same variant twice in a row.
- Rate-limit high-frequency events such as drag cells, cursor repeats, count ticks and edge bumps.
- Do not play the global button tap on top of a semantic sound. A button with `sfx_collectible_buy` must not also fire `sfx_ui_tap_soft`.
- Crossfade BGM between views over approximately 300–700 ms rather than stopping abruptly.
- Time Attack switches from the current BGM to `bgm_harvest_time_attack`; it no longer stays silent for the entire run.
- Duck BGM 4–6 dB under puzzle/shelf completion stingers and 2–4 dB under important reward sounds.
- Respect separate Effects and Music preferences across pause/resume, foreground/background, and app relaunch.
- Native store sheets, phone interruptions and app backgrounding must pause or duck music without restarting overlapping instances.
- Keep audio playable offline; every gameplay cue and BGM file is bundled locally. Only native purchase availability remains network-dependent.

## Licensing and provenance checklist

For every paid music/sound tool, sample library, performer or purchased source retain:

- Product/library name and version.
- Invoice or license receipt.
- Exact commercial mobile-app distribution rights.
- Whether attribution is required.
- Whether raw sample redistribution is prohibited.
- Project/session file and stems proving the final work was assembled for Sunny Spoon Studios.
- Cue-sheet row with creator, creation date, source libraries and final exported filenames.
- Confirmation that no recognizable third-party melody, brand sound, character voice or restricted AI voice was used.

Do not ship a sample merely because the software subscription was paid; its library license must specifically permit commercial synchronization and app distribution.

## Production order

### Batch 1 — interaction foundation

- Cell fill/mark/clear, drag variations, cursor movement and Trail Paint cues.
- Global UI semantic cues.
- Normal puzzle BGM and updated year-round BGM.
- D-pad behavior fix and its regression tests.

### Batch 2 — release-critical modes

- Korean Harvest home, Pantry and Time Attack music.
- Countdown, round transition, success/fail and final-second cues.
- Puzzle/shelf completion, spoon reward and stage unlock families.

### Batch 3 — collection and story polish

- Album, badges, Pantry detail, IAP, mailbox, guide and story sounds.
- Pip reaction pack.
- Environmental texture layers.

### Batch 4 — mix and physical-device sign-off

- Loudness pass on iPhone speaker, Android speaker, earbuds and silent/vibrate modes.
- Verify no double-triggered global/semantic effects.
- Verify rapid cell strokes and held D-pad input remain responsive without audio backlog.
- Verify every BGM loop for at least three consecutive cycles.
- Verify app background/foreground and phone interruption recovery.
- Verify all gameplay audio works in airplane mode.

## Release completion definition

The audio update is complete only when:

- No oscillator placeholder remains in a player-facing production path unless deliberately retained as a tested fallback.
- Every event marked above either has its authored cue or is explicitly documented as intentionally silent.
- Android and iOS use the same cue mapping and source assets.
- Time Attack has dedicated music and clear start/end feedback.
- Quick D-pad movement is audibly and behaviorally distinct from held Trail Paint.
- Settings immediately stop/resume the correct audio category without ghost playback.
- Licensing records, masters, runtime assets, cue map and physical-device QA evidence are stored with the release handoff.
