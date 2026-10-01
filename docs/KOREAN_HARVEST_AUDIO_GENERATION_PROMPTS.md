# Korean Harvest Audio Generation Prompt Catalog

Last updated: 2026-08-28

Companion specification: `docs/KOREAN_HARVEST_AUDIO_AND_CURSOR_PLAN.md`

This catalog converts every cue in the production plan into a repeatable generation recipe. Prompts are written in English because current music and sound generators follow detailed English audio direction more reliably.

## Recommended production tool

### Primary: Stable Audio

Use Stable Audio as the single primary workspace for both music and sound effects. It supports text-generated music, sound effects and audio transformation. Before production, save a PDF or screenshot of the plan and license terms that apply on the actual generation date.

Do not assume a web subscription and the downloadable Stable Audio model use identical terms. Record which product, model version and plan generated every accepted file.

### Optional secondary: ElevenLabs Sound Effects only

ElevenLabs Sound Effects can be useful for short Foley alternatives. Do not use self-serve Eleven Music for the shipped game soundtrack without written clearance or the required Enterprise music rights: its current terms define a monetized game distributed on more than one platform as a Studio Game and exclude that use from self-serve music media rights.

Adobe Firefly can be a commercially safe backup for effects and ambience, but its current text-to-sound-effects feature does not generate music.

## How to build every prompt

For every cue, combine these four parts:

1. The cue-specific action sentence from the `Use` or `Direction` column in the companion specification.
2. The category recipe below.
3. The universal quality block.
4. The required variation instruction.

### Universal music quality block

> Instrumental mobile game background music for Pip's Picture Pantry. Warm, handmade, cozy and tactile. Respectful Korean harvest color using restrained gayageum-like plucks, soft daegeum breath, light janggu or wooden percussion, yugi-brass accents, paper, wood and ceramic textures. Memorable but gentle, clean stereo mix, phone-speaker friendly, no vocals, no copyrighted melody, no modern pop drums, no cinematic trailer impacts, no casino sound, no harsh high frequencies. Seamless loop with a musically identical start and end, no fade-out.

### Universal SFX quality block

> One isolated mobile-game sound effect, dry and clean, close-miked, warm handmade acoustic character, immediate transient, phone-speaker friendly, no music bed, no voice, no background noise, no long reverb, no cinematic impact, no casino or slot-machine character, no harsh digital beep. Leave clean silence before and after the event.

### Variation rule

For a cue requiring multiple variations, keep the same object, loudness and semantic meaning. Change only micro-timing, pitch within roughly two semitones, material strike position or hand pressure. A variation must never sound like a different action.

## Complete BGM prompts

### `bgm_harvest_home`

> 132-second seamless instrumental loop for the home screen of a cozy Korean harvest puzzle game. 82 BPM, gentle 4/4. A welcoming four-note Sunny Spoon motif played by warm gayageum-like plucks, soft wooden marimba, breathy bamboo-flute responses, brushed janggu and quiet room texture. Moonlit workshop warmth, curious and safe, enough melody to establish the brand but sparse enough for a menu left open for minutes. Begin with a two-second recognizable motif, develop lightly, return naturally to the opening harmony. Apply the universal music quality block.

### `bgm_harvest_puzzle`

> 150-second seamless instrumental loop for focused nonogram puzzle solving. 72 BPM, gentle 4/4, very sparse arrangement. Muted gayageum-like single notes, soft felt mallets, quiet woodblock pulse, warm sustained bed and occasional bamboo breath. No busy melody, no dramatic cadence, no sudden dynamic changes. Repetition should feel calm after twenty minutes of play. Reuse a simplified version of the home motif only once per cycle. Apply the universal music quality block.

### `bgm_harvest_pantry`

> 112-second seamless instrumental loop for browsing a cozy pantry of jars and collectibles. 78 BPM, lightly playful. Ceramic taps, warm wooden shelf percussion, delicate gayageum-like pizzicato, soft bass and small yugi-brass glints. The feeling is opening a handmade cabinet and discovering preserved autumn treasures. Curious, warm, never childish or shopping-like. Apply the universal music quality block.

### `bgm_harvest_spoon_run`

> 96-second seamless instrumental loop for a daily puzzle and replay-reward screen. 92 BPM, gentle walking pulse. Light janggu brushes, wooden footsteps, plucked strings and a bright but restrained spoon-brass motif. Encouraging daily momentum without urgency, gambling energy or reward-machine sounds. Apply the universal music quality block.

### `bgm_harvest_time_attack`

> 108-second seamless instrumental loop for a three-round timed picture puzzle. 112 BPM with a precise but soft pulse. Muted janggu, woodblocks, short gayageum-like ostinato, warm bass and controlled bamboo accents. Clear forward motion and concentration, never stressful, alarming or action-cinematic. Compose compatible low-intensity and high-intensity arrangements at the identical tempo and bar structure so the final thirty seconds can intensify seamlessly. No ending cadence. Apply the universal music quality block.

### `bgm_harvest_album_map`

> 120-second seamless instrumental loop for browsing an album, badges and a seasonal map. 68 BPM, spacious and reflective. Soft gayageum harmonics, bamboo flute fragments, paper movement texture, warm sustained harmony and almost no percussion. A quiet room filled with memories and completed pictures. Apply the universal music quality block.

### `bgm_harvest_dialogue`

> 76-second seamless instrumental reading underscore for Pip's guides, mailbox letters and story cards. 64 BPM, extremely light. Warm sustained bed, occasional two-note plucked motif, soft paper and room texture, large gaps for reading. No attention-grabbing melody, percussion or emotional manipulation. Apply the universal music quality block.

### `bgm_cozy_year_round_v2`

> 144-second seamless instrumental loop establishing the year-round Sunny Spoon Studios sound. 80 BPM, warm handcrafted chamber-folk palette with felt mallets, soft plucked strings, wooden percussion, gentle bass and breathy flute. Cozy kitchen workshop, friendly curiosity and quiet satisfaction. No explicitly seasonal melody or holiday instrument. Include the same four-note brand motif used in the harvest home theme. Apply the universal music quality block.

## Complete musical stinger prompts

Generate each as one complete event with no loop and a clean natural tail.

| ID | Paste-ready description |
| --- | --- |
| `stinger_brand_intro` | 2.2-second warm brand reveal: four-note plucked Sunny Spoon motif, soft wood resonance and one tiny yugi-brass glow; friendly recognition, not a corporate logo or fanfare. |
| `stinger_puzzle_complete` | 1.9-second picture-completion flourish: delicate brush sweep becomes warm plucked notes and a small colorful ceramic sparkle; satisfying discovery, no coin sound. |
| `stinger_shelf_complete` | 3.8-second major shelf-completion phrase: wood, ceramic, gayageum-like arpeggio and warm flute answer, building clearly above ordinary puzzle completion without sounding epic. |
| `stinger_badge_earned` | 2.7-second badge reveal: embossed paper lift, rounded brass heart glint and a proud three-note plucked cadence; warm achievement, no military medal sound. |
| `stinger_collectible_unlocked` | 2.5-second collectible unlock: cupboard latch, paper wrap opening, ceramic placement and a gentle melodic reveal. |
| `stinger_time_attack_round` | 1.25-second round transition: precise woodblock pickup and rising two-note pluck that clearly says continue immediately; energetic but soft. |
| `stinger_time_attack_success` | 3.1-second timed challenge success: resolved rhythmic motif, warm flute lift, plucked-string cascade and restrained brass glow. |
| `stinger_time_attack_best` | 3.7-second new-best celebration: begin like ordinary success, then add a second ascending motif and brighter handmade flourish; unmistakably more special but not casino-like. |
| `stinger_time_attack_fail` | 2.2-second time-expired response: soft descending wood and plucked phrase ending on a warm unresolved invitation to try again; never scolding or tragic. |

Append the universal SFX quality block to every row above, except permit a short musical tail.

## SFX category generation recipes

Every event ID and its cue-specific action sentence are listed in the companion specification. Use that sentence as the first sentence, then append the matching recipe below and the universal SFX quality block. This produces a distinct prompt for all 103 interaction events and all 7 environmental event families without changing their canonical names.

### A. Global UI and navigation — all `sfx_ui_*`

> Duration 80–280 ms. Build the event from a soft fingertip contact, rounded wood, thick paper or tiny ceramic detail. Primary actions may be slightly fuller than secondary actions. Back and close must descend or release; open and confirm may rise or settle. Locked and error sounds must be hollow and gentle, never alarming. Keep all UI cues in one coherent material family.

### B. Puzzle cell input — `sfx_cell_*`, `sfx_drag_*`, `sfx_line_*`, `sfx_invalid_cell`, `sfx_undo`, `sfx_auto_x_sweep`

> Duration 35–450 ms. Treat filling as a soft wet brush or rounded wooden dab, marking X as a dry pencil or paper tick, clearing as a light brush lift. Drag-step sounds must be under 90 ms with almost no tail. Line completion is a short horizontal brush sweep with two quiet plucked confirmation notes. Undo reverses the material gesture rather than using a digital rewind.

### C. D-pad and Trail Paint — all `sfx_cursor_*` and `sfx_control_mode_switch`

> Duration 30–220 ms. Cursor movement is a muted wooden navigation tick quieter than editing. Brush selection is a distinct soft tool pickup. Trail start acknowledges that the hold threshold was crossed; trail steps are extremely short brush dabs that tolerate 105 ms repetition; trail end is a tiny lift. Boundary feedback is a rate-limited padded wood stop, never a buzz. Fill and mark families must remain distinguishable.

### D. Hints — all `sfx_hint_*`

> Duration 100–650 ms. Use warm spoon brass, paper reveal and restrained glowing texture. Spending descends; revealing rises gently; insufficient balance is one hollow spoon touch. Never resemble a purchase cash register, jackpot or failure alarm.

### E. Picture and collection progression — `sfx_picture_*`, `sfx_next_puzzle`, `sfx_shelf_unlock`, `sfx_stage_unlock`, `sfx_badge_*`, `sfx_album_*`, `sfx_collection_counter_complete`

> Duration 180–1100 ms. Combine thick paper cards, wooden frames, cloth, brush color and ceramic objects. A save sound settles inward; an unlock opens outward; a page turn remains physical and dry. Progress increments are smaller than unlocks. Do not duplicate the musical stingers; these effects should layer beneath them.

### F. Spoon economy and rewards — all `sfx_spoon_*`, `sfx_daily_reward_claim`, `sfx_replay_reward_claim`, `sfx_reward_limit_reached`

> Duration 50–900 ms. Use a small real brass spoon or yugi-like utensil, recorded softly on wood or cloth. Small, medium and large rewards differ by the number and spacing of touches, not by casino pitch ladders. Count ticks must remain comfortable through long count-ups. Final settle is a single confident cloth-damped placement.

### G. Pantry and native purchases — all `sfx_pantry_*`, `sfx_collectible_*`, `sfx_store_*`

> Duration 120–1200 ms; the connecting cue may be a seamless 1.2-second loop. Use cabinet wood, jar ceramic, bojagi cloth, paper labels and restrained spoon brass. Equip sounds place an object securely; unequip lifts it. Store success confirms verified delivery without sounding like money; cancel is neutral; failure is warm and recoverable. The connecting loop must be quiet enough to run several seconds.

### H. Spoon Run — `sfx_spoon_run_open`, `sfx_daily_picture_select`, `sfx_replay_pick_select`, `sfx_clean_replay`, `sfx_replay_mistake`, `sfx_daily_progress_increment`, `sfx_daily_all_claimed`

> Duration 100–850 ms. Brighter daily-routine palette using paper cards, light wooden steps and a tiny spoon accent. Selection is tactile, clean replay sounds polished, a replay mistake is a subtle dry interruption, and all-claimed has a calm end-of-day resolution rather than a jackpot.

### I. Time Attack — all `sfx_time_*`

> Duration 60–700 ms. Use precise wooden percussion and short plucked notes locked to the Time Attack music palette. Countdown 3, 2 and 1 rise consistently; Go is broader and unmistakable. Final ticks must cut through the mix without sharp beeps. Expired releases tension; record save sounds like a paper record card being stamped gently.

### J. Mailbox, guides and story — all `sfx_mail_*`, `sfx_guide_*`, `sfx_story_*`

> Duration 100–850 ms. Use envelope paper, hanji texture, small seal, card stock and soft wood. Unread is a tiny paper nudge, mail open is an envelope fold, attachment claim adds one restrained reward accent. Tutorial correct and retry should feel encouraging and readable, not childish.

### K. Seasonal environment — all `amb_*`

> Create an isolated natural acoustic layer with no music and no recognizable speech. For loops, generate 20–30 seconds of nearly stationary sound with no prominent event at the seam. Workshop night is an extremely quiet interior room tone; window breeze remains outside the visible window and contains no rain unless the displayed art shows rain. Hanji, bojagi, ceramic, wood shelf and spoon brass one-shots must remain close-miked and clean.

### Pip reaction pack — all `pip_*`

> One tiny nonverbal mascot reaction from the same warm, round, friendly Pip voice identity. 180–650 ms, animal-like but readable, no spoken word, no baby voice, no human sentence, no chipmunk pitch shift, no breath noise bed. Keep the exact same apparent character age, body size and timbre across every emotion. Generate the entire pack in one tool/session or from one approved reference so Pip never changes identity.

## Variation prompts

After one master take is approved, generate its variants with one of these suffixes:

- `Variant B: same exact action and object, 3 percent softer, slightly different contact position.`
- `Variant C: same exact action and object, micro-timing changed by less than 20 ms, pitch no more than one semitone higher.`
- `Variant D: same exact action and object, slightly more cloth damping, equal perceived loudness.`
- `Variant E: same exact action and object, slightly more wooden resonance, identical duration and semantic strength.`

Do not ask the generator for “random variations”; uncontrolled variation changes object identity and makes the interface feel inconsistent.

## Acceptance checklist for every generated file

- The cue communicates the intended action without seeing the screen.
- It contains no accidental voice, melody fragment, watermark, room contamination or unwanted second event.
- Frequent actions remain comfortable at rapid repetition.
- It still reads through an iPhone speaker and a mid-range Android speaker at low volume.
- It does not duplicate the global tap and semantic effect simultaneously.
- The exact prompt, generator, model, plan, creation date and source file are recorded in the cue sheet.
- The commercial license explicitly covers a monetized game distributed on both iOS and Android.
