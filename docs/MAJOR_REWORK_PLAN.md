# Pip's Picture Pantry Major Rework Plan

Last updated: 2026-07-10

## Status

Mode: experimental direction plan, not an immediate Play Console release patch.

The current closed-test build proved that the core cozy nonogram loop works, but tester feedback and genre review show that the game needs a stronger long-term reason to keep playing. This plan reframes the app from a small picross MVP into a cozy puzzle game where players solve pictures, earn spoons, decorate a Pantry, collect color cards, and later challenge their own records.

This is intentionally a large rework. It should be developed locally in Codex/browser first, then uploaded to Play only after the new loop feels coherent.

## Product North Star

Pip's Picture Pantry should become:

> A cozy picture puzzle game where players solve nonograms to reveal colorful cards, earn spoon currency, and decorate Pip's Pantry over time.

The main motivation should not be "pay or wait to play the next puzzle." The main motivation should be "I want this Pantry item/theme now, and I need a few more spoons."

## Content Scale Goal

**Direction: as many high-quality curated puzzles as the launch/update pipeline can responsibly support.**

- Puzzle count should be a competitive advantage, but not a fixed launch-number promise.
- Launch volume depends on readiness: authored puzzle quality, art direction, album/picker performance, Pantry economy gates, and QA capacity.
- Post-launch updates should keep adding curated puzzle packs continuously, with no intentional ceiling.
- Puzzle quantity can be throttled through Pantry story progress, spoon costs, room goals, and update pacing instead of limiting the total content ambition.
- Long-term goal: become the cozy nonogram game with one of the deepest curated puzzle libraries on mobile.
- Quality bar: every album/catalog puzzle must be logically solvable, visually readable, and resolve into a recognizable cozy image with strong design, theme, and color sensibility; volume does not lower the bar.

### Launch Catalog Strategy Pivot - 2026-07-10

The launch catalog should now target a polished **Season 0 / Launch v1** set rather than trying to finish the old 1,000-puzzle ambition before release.

- Practical launch target: about 333 curated puzzles, roughly one third of the long-term 1,000-puzzle ambition.
- This number is directional, not a hard marketing promise. If quality, UI, economy, art, or QA needs more time, launch can ship slightly below or above it.
- Once the catalog is near the 333 range, prioritize first-session quality over raw puzzle count: opening art, button feel, settings polish, guide/dialog presentation, Pantry story loop, Time Attack economy, completion effects, and mobile layout.
- The 1,000-puzzle goal becomes a cumulative live-service roadmap, reached through quarterly or seasonal updates rather than launch crunch.
- Seasonal updates should create anticipation: spring picnic, summer fruit/cafe, autumn baking, winter cocoa/gifts, holiday pantry, or current-topic cozy packs.
- Every future season must keep the same catalog contract: logical solve, readable silhouette, translated title/image name, art-readability metadata, and mobile/catalog QA guards.
- Economy pacing can use Pantry room goals, spoon costs, Time Attack, daily rewards, and staged unlocks so players experience progress without consuming the entire catalog too quickly.

## Core Loop

1. Player solves a puzzle.
2. Filled monochrome cells become a colorful finished picture.
3. The finished picture is saved to the Album.
4. Player earns spoons.
5. Player spends spoons on Pantry decorations.
6. Pantry becomes warmer, fuller, and more personal.
7. Stage milestones award badges that can be displayed as pride objects.
8. Larger boards and challenge modes provide skill growth and replay value.

## Currency And Monetization Direction

### Spoon Role

Spoons should become the primary soft currency and deserve a polished production asset. The current CSS-style spoon icon is no longer acceptable for the game's main currency.

Required direction:

- Replace CSS/shape-based spoon visuals with a polished image asset.
- Treat the spoon as a small golden "Spoon Coin" or charm-like currency.
- Use the same asset family in top balance, puzzle rewards, shop prices, daily rewards, and purchase prompts.
- Keep most progression earnable through play.

### Purchase Motivation

The intended monetization pressure is not blocked gameplay. The intended pressure is decorative desire.

Good prompt:

> 12 more spoons and the window plant is yours.

Poor prompt:

> Not enough spoons. Buy more.

Near-term:

- No forced ads.
- No lives/energy.
- No gameplay-interrupting purchase prompt.
- IAP can be prepared later, but the first rework should validate desire before real billing.

## Pantry Decoration System

### Purpose

Pantry decoration becomes the main meta-game. Badges remain, but as milestone trophies rather than the central reason to play.

### Initial Pantry V1

Start with one small Pantry room/shelf scene and 8-12 high-quality image assets:

- Small wooden shelf
- Cookie plate
- Soup pot
- Window plant
- Yellow check rug
- Recipe board
- Warm lamp
- Pip doll
- Bread basket
- Jam jar
- Cozy curtain
- Tiny table

### Long-Term Expansion

To avoid "I finished decorating, now what?", Pantry must expand through spaces and themes:

- Starter Pantry
- Cafe Window
- Bakery Corner
- Sunny Spoon Kitchen
- Village Pantry
- Seasonal rooms
- Character corners

Decoration also needs tiers:

- Basic items: easy to earn
- Pretty items: medium grind
- Set items: complete a themed look
- Seasonal items: limited-time feeling
- Premium items: future optional purchase/pack candidate

### Implementation Notes

- Do not draw purchasable items with CSS.
- All shop/decor items should be production PNG/WebP assets with transparent backgrounds where appropriate.
- The code should manage item metadata, price, unlock state, ownership, placement slots, and persistence.
- Placeholder images are allowed during prototyping, but must be clearly marked as placeholder and not shipped.

## Reward Depth And Fast Player Pacing

Closed-test and market feedback should assume that committed players will clear content much faster than expected. The reward system cannot rely on a single finite checklist. It needs a long-tail structure before production launch.

### Design Assumption

Some players will finish the first visible reward layer in one or two days. The game should welcome that instead of breaking. Fast players should feel, "I finished this shelf, now I have a better reason to keep decorating."

### Reward Depth Layers

1. **Immediate rewards:** every puzzle gives spoons and a finished color card.
2. **Stage rewards:** completing a 20-puzzle stage gives a unique badge and a Pantry display object.
3. **Room rewards:** completing several stages unlocks a new Pantry room or theme shelf.
4. **Decoration mastery:** item sets can have collection bonuses, alternate colors, or upgraded versions.
5. **Challenge rewards:** Time Attack and larger boards can award profile badges, special frames, or limited shop items later.
6. **Seasonal/event rewards:** rotating item sets keep the spoon economy useful after the first room is decorated.

### Economy Principle

Spoons should not only unlock the next puzzle. Puzzles should mostly remain playable, while spoons create choice pressure around decorating: buy the cute plant now, save for the lamp set, or finish a stage for a badge display slot.

### Anti-Exhaustion Rules

- Never ship a Pantry shop that can be fully exhausted too quickly without another sink.
- Keep at least one aspirational long-term item or room visible but not intrusive.
- Add repeatable or rotating sinks before adding real spoon purchases.
- Do not let paid spoons become the only reasonable way to decorate. Purchases should accelerate desire, not replace play.

## Image Asset Pipeline

This rework needs an explicit production asset pipeline.

### Asset Classes

- Currency: spoon coin/charm
- Shop items: decorative PNG/WebP
- Badge images: unique milestone badges
- Puzzle color cards: colored solved-picture previews
- Opening/login art: improved Sunny Spoon Studios and game identity screens
- Pantry room backgrounds/themes

### Quality Bar

- No CSS-built illustrations for player-facing rewards.
- No repeated reuse of a few character-sheet crops as "different" rewards.
- Each free stage should have a distinct badge identity.
- Assets should share the Sunny Spoon/Pip cozy style but use more vivid accents than the current muted UI.

### Opening/Login Screens

The opening identity screens should be revisited during asset production. Current identity art relies too much on a small number of reused thumbnails. The rework should consider:

- A better Sunny Spoon Studios logo/intro image.
- A richer Pip's Picture Pantry key visual.
- Cleaner character placement.
- More polished first impression before gameplay.

## Color And Visual Refresh

The current warm cozy palette is correct in spirit but too muted compared with successful casual puzzle references. The visual refresh should not discard the brand identity; it should raise saturation and reward contrast.

Target:

- Keep cream paper and cocoa outlines as identity anchors.
- Make reward moments, buttons, currency, item cards, and completion states more vivid.
- Use brighter gold, mint, tomato, sky, and warm green accents.
- Avoid making the whole app neon or generic.

Suggested direction:

- Base UI: cozy paper, readable, calm.
- Rewards/shop/completion: brighter, juicier, more collectible.
- Pantry scene: warmer and more saturated than puzzle panels.

## Puzzle Completion Colorization

Puzzle completion should no longer feel like only "correct/incorrect." It should feel like revealing a picture.

### Desired Flow

1. During play: filled cells use the normal single fill color.
2. On completion: solved cells animate into per-cell colors.
3. The final card is stored in the Album as a color card.
4. Larger boards should have more meaningful and attractive color images.

### Data Direction

Each puzzle eventually needs a color layer:

- `solution`: binary nonogram answer
- `colorMap`: per-solved-cell color metadata
- optional `finalArt`: richer card thumbnail if generated separately

Early implementation can start with a few 5x5/8x8 examples before scaling.

## Badge System

### Decision

Keep badges, but demote them from the primary goal to milestone rewards.

Badges should be:

- Cute, badge-like production images.
- Unique per stage or milestone.
- Earned after completing 20-puzzle stages or major goals.
- Displayable in Pantry or Album, not necessarily a main tab forever.

Recommended UI structure:

- Puzzle: play loop
- Pantry: main growth/decorating loop
- Album: color cards and completion record
- Badges: either an Album section or Pantry display shelf

## Floating Navigation And Focused Play Shell

The current text tab row feels closer to a web dashboard than a mobile game. Reference games make the main destinations reachable through persistent, icon-first controls near the bottom of the screen, while puzzle play itself stays focused.

Direction:
- Replace the large text tab row with icon-first navigation.
- Start with one always-visible bottom-right floating menu button to reduce clutter and asset burden.
- Tapping the menu opens four choices: Puzzle, Album, Pantry, Badges.
- Each menu choice must use approved PNG/WebP icon art, not CSS-drawn placeholder icons.
- Expanded menu choices may keep short text labels for clarity and accessibility, but recognition should come from icons first.
- Puzzle play should use a focused shell where the board and controls dominate; meta navigation becomes compact and non-intrusive.
- Meta screens can keep the floating navigation visible so players can switch screens without hunting for tabs.
## Large Board And Control Mode
Larger puzzles are strategically important. If the game stays at 5x5/8x8 only, long-term depth will be weak.

### Target Board Sizes

- 5x5: first onboarding and fast cozy puzzles
- 8x8: early main content
- 10x10: late free-stage bridge
- 12x12: next content expansion
- 15x15 and 18x18: long-term premium/deeper puzzle content

### Control Mode

For 10x10+ and especially 12x12+, add a cursor/key control mode:

- D-pad moves selected cell.
- Fill button fills selected cell.
- Blank-check button marks selected cell.
- Current row and column are highlighted.
- Matching row/column clues are highlighted.
- Cursor movement has clear visual feedback.

### Line Guide

When a row or column has already satisfied its filled-cell requirement:

- V1: show soft X guide marks on remaining unresolved cells.
- V2: optional auto-check setting can actually mark those cells.

This should be designed as a helper, not as an over-automated solver.

## Audio And Haptics

The rework should preserve the cozy audio direction but avoid tactile overload.

### Input Feedback

Direct tap:

- Light tap SFX.
- Optional light haptic.

Cursor movement:

- Very soft "tick" or "tok" SFX to confirm movement.
- Haptic should be more conservative than tap/fill.

Fill/check action in cursor mode:

- Same as direct tap fill/check.
- Optional light haptic.

Completion:

- Distinct reward chime.
- Optional slightly stronger haptic pulse.

### Settings Recommendation

Separate or semi-separate controls:

- Sound effects on/off
- Music on/off
- Haptics on/off

Do not assume phone silent/vibrate mode maps cleanly to web audio. In a Capacitor/WebView app, vibration should be controlled by `navigator.vibrate` or native bridge behavior, while audio obeys app SFX/music settings and device output rules. To avoid too much buzzing, cursor movement should default to sound only, with haptics reserved for fill/check/completion unless the user enables stronger feedback later.

## Time Attack / Challenge Mode

This is a later pillar, not the first Pantry rework slice.

Direction:

- Unlock after some normal progress.
- 5-minute and/or 10-minute sessions.
- Solve as many puzzles as possible.
- Deterministic seeded sequence for fairness.
- Starts with 5x5, then mixes 8x8 and 10x10.
- Local best score first.
- Later login/global leaderboard possible.

Time Attack should become a distinct "skill/replay" loop, while Pantry remains the cozy growth loop.

## Tutorial And First-Time Guidance

Tester feedback says first-time rules need to be more visual and less wordy.

Keep:

- Visual examples for clues like `3` and `1 1 1`.

Clarify:

- `3` means three adjacent filled cells in that row/column, not necessarily from the edge.
- `1 1 1` means separated groups with at least one blank between groups, not exactly one blank.

Behavior:

- Show the guide early.
- Let it collapse or disappear after first understanding.
- Make it accessible again through settings/help.

### Pip Guided Onboarding

After first name entry, Pip should introduce the game through a short character-led onboarding instead of relying only on static guide text.

Direction:
- Use 2-3 short dialogue slides after the first player name entry.
- Pip greets the player by name, then explains that numbers tell how many cells to fill in each row or column.
- Include a visual clue slide for `3` and `1 1 1`.
- Include an action slide for Fill, Blank Check, and Undo.
- Add an optional guided 5x5 demo where Pip highlights a row or column and shows the first few moves.
- Keep copy short, allow skip, store completion locally, and make the tutorial replayable from settings/help.
- First prototype may use existing approved Pip raster art; later polish should use generated PNG/WebP tutorial poses, not CSS character drawings.
## Completed Stage Visibility
Tester feedback requested a way to hide completed stages. This remains useful after Pantry exists.

Recommendation:

- Add a "Hide completed" toggle on the puzzle/stage list.
- Keep completed cards visible in Album.
- Keep stage badges visible in Pantry/Album milestones.

## Proposed Implementation Order

### Phase 0 - Planning / Asset Contract

- Finalize this plan after Claude review.
- Define asset manifest schema.
- Define placeholder vs production asset rules.
- Create first asset briefs for spoon, badge set, and Pantry item set.

### Phase 1 - Visual Economy Foundation

- Replace CSS spoon with a real spoon currency image.
- Refresh reward/currency UI with brighter accents.
- Add production-style badge asset slots.
- Keep existing gameplay intact.

### Phase 1A - Navigation And Onboarding UX Foundation

- Add the floating menu state model and bottom-right expandable navigation shell.
- Add Pip guided onboarding after first name entry.
- Use approved raster Pip art and approved icon assets only; if icon assets are not ready, keep the structure behind a conservative fallback rather than shipping CSS-drawn menu art.
- Keep the old text tab navigation removable behind one boundary so the shell can evolve without touching puzzle logic.
### Phase 2 - Color Completion Prototype
- Add colorMap support to puzzle data.
- Implement completion colorization animation.
- Store/display colored cards in Album.
- Start with a small subset of puzzles.

### Phase 3 - Pantry Decoration V1

- Add Pantry view.
- Add shop/inventory/placement data model.
- Add 8-12 starter item assets.
- Implement purchase, preview, placement, save/load.
- Add "not enough spoons" UX with play-to-earn path.

### Phase 4 - Badge Refactor

- Move badge emphasis into Pantry/Album milestone area.
- Replace reused images with distinct badge art.
- Make earned badges displayable as pride items.

### Phase 5 - Large Board Control Mode

- Add cursor state.
- Add D-pad and fill/check controls.
- Add row/column highlight.
- Add clue highlight.
- Add soft X guide for completed lines.
- Add movement SFX and conservative haptic settings.

### Phase 6 - Content Expansion

- Add more 10x10/12x12 puzzles.
- Improve completed color art quality for larger boards.
- Start puzzle generation/validation pipeline for scaling beyond 100 puzzles.

### Phase 7 - Challenge Mode

- Add local Time Attack prototype.
- Add local records.
- Balance rewards after normal/Pantry loop is stable.

## Claude Review Questions And Answers

> Full answers recorded in `docs/CLAUDE_REVIEW_LOG.md` Direction Note 7 (2026-07-02).

1. **Does the rework correctly demote badges from primary motivation to milestone rewards?**
   Yes. Badges work as milestone trophies. Pantry decoration should be the primary motivation.

2. **Is the Pantry decoration loop strong enough to support gentle monetization without paywalling core gameplay?**
   Yes, if item art quality is high enough to create genuine desire. Asset production for Phase 3 items should be contracted before Phase 1 code work begins so art is ready when the shop goes in.

3. **Is the asset pipeline strict enough to prevent future CSS/placeholder art from leaking into production?**
   The written rules are good. Recommend adding a build-time check: any asset registered with `placeholder: true` in the manifest should trigger a warning or build failure before release.

4. **Should `colorMap` be embedded in puzzle data, generated from separate art manifests, or both?**
   Embed in puzzle data. Add a `colorMap` array (one hex per solved cell) directly on each puzzle object. Separate manifests double the management surface. Split later only if a generation pipeline requires it.

5. **Is cursor mode best introduced before or after Pantry V1?**
   After Pantry V1. Cursor mode is only meaningful with 10x10+ boards, which arrive in Phase 6. Implement in Phase 5 after the Pantry loop is stable.

6. **Are haptics/audio defaults conservative enough for repeated cursor movement?**
   Cursor movement: sound only by default, haptics OFF. Fill/complete: haptics ON by default. `navigator.vibrate()` in Capacitor/Android can feel stronger than expected ??keep movement feedback sound-only unless the user opts in.

7. **What is the safest first implementation slice that gives visible improvement without destabilizing the current closed-test build?**
   Phase 1 only: replace the CSS spoon icon with a real image asset and brighten reward/currency UI accents. No game loop changes. Phase 2 (colorMap) touches puzzle data schema and should be a separate commit with save-compatibility notes.

## Non-Goals For First Slice

- No real in-app purchase implementation yet.
- No forced ad system.
- No global login or leaderboard.
- No 1000-puzzle expansion before a puzzle generation/QA pipeline exists.
- No large visual redesign that erases the Sunny Spoon cozy identity.

## Hard No-CSS-Art Gate - 2026-07-02

- Do not use CSS or DOM shape compositions as player-facing art for currency, decorations, badges, tutorial illustrations, character poses, or navigation icons.
- If a finished PNG/WebP asset is not ready, keep the feature behind a conservative text/structure fallback instead of faking art in CSS.
- Do not keep reusing the same Pip image as the answer to every reward or onboarding need. New reward categories need distinct approved art.
- Any future Pantry shop item should enter through an asset manifest with explicit file paths and review status before it appears in the playable UI.


## Direction Addendum - 2026-07-03 Time Attack Random Puzzle Source

- Time Attack should not draw only from the static catalog, because repeat players can memorize those puzzles and the mode loses meaning.
- Use a seeded generator for Time Attack boards. This gives each run a fresh puzzle sequence while keeping the sequence reproducible for local records and future leaderboard validation.
- Proposed ramp for the first prototype: rounds 1-3 use 5x5, rounds 4-7 use 8x8, rounds 8-12 use 10x10, rounds 13-18 use 12x12, and later rounds use 15x15.
- Time Attack generated puzzles are rule challenges, not album/badge art rewards. They should pay record/progress rewards and feed the Pantry economy only after abuse limits and balance are designed.
- Normal stage monetization should continue moving away from paid stage locks. The stronger loop is: solve puzzles -> earn spoons -> decorate Pantry -> unlock pride/milestone badge moments.


## Direction Addendum - 2026-07-04 Nyan Tower Benchmark Decisions

- Puzzle focus should move toward a dedicated play surface for larger boards. The list/map/pantry shell should not compete for space while the player solves 10x10, 12x12, 15x15, and later boards.
- Large-board interaction should include a D-pad/cursor mode, highlighted current row and column, and a clear selected cell state. Direct touch can remain available, but cursor mode needs an explicit setting and onboarding moment.
- Undo should remain generous/free. The better pressure and monetizable helper system is limited hints, especially on large boards. Hint bulbs should reveal a logically useful cell or safe mark with a satisfying visual effect.
- Time Attack should use seeded randomly generated puzzles, not only catalog puzzles. This avoids memorization and allows fair local records now, then future account/leaderboard validation later.
- Pantry should become the main long-term goal: solve puzzles -> earn spoons -> buy decorations -> place items -> expand to new rooms/floors. Stage badges stay as milestone pride rewards, not the main economy sink.
- Buying or placing a Pantry item should include a reward moment: dimmed room backdrop, spotlight/rays, item name banner, then placement into the room.
- No CSS/DOM-drawn player-facing art is allowed for currency, menu icons, decorations, badges, tutorial characters, or shop items. If reviewed raster art is missing, the surface must stay hidden, paused, or text-only.
- Visual direction should become a little more vivid while retaining Sunny Spoon warmth: brighter accents, stronger contrast on controls, and more satisfying colored puzzle completion art.

## Implementation Note - 2026-07-04 Hint And Reward Direction

The current major rework should treat hints as the pressure valve for larger boards. Undo remains unlimited because cozy play should tolerate correction; challenge comes from limited hints, larger boards, time pressure modes, and record chasing.

Nyan Tower-inspired reward moments to design after real art is available:
- Item purchase reveal: dim backdrop, warm spotlight, item name ribbon, and the acquired decoration centered.
- Item placement: purchased decoration animates into its slot and the Pantry character reacts.
- Room progression: Pantry can expand vertically or by themed rooms so decoration does not end after a single scene.
- Hint bulb: real raster icon plus short reveal effect on the corrected/confirmed square.

Do not ship CSS-drawn stand-in art for any of these moments. If a raster asset is not ready, the surface should remain gated or textual.

## v0.1.58 Implementation Note

Immediate implementation decisions:
- Keep Pantry decoration gated until real reviewed raster art exists. Candidate decoration files may exist in the repo, but they must stay hidden unless the asset manifest marks them approved and visible.
- Do not use CSS/DOM-drawn visuals for player-facing currency, rewards, navigation icons, tutorial art, badges, or decorations.
- Use the focused puzzle screen as the foundation for 10x10+ boards, cursor mode, hint UI, and Time Attack.
- Time Attack should use deterministic generated boards per run/seed rather than the normal puzzle catalog. This protects replay value and lets records be compared locally now and server-side later.
- Undo remains generous; difficulty should come from board size, hints, time pressure, and optional challenge modes.

### v0.1.58 Bundle Gate Note
- Hidden Pantry decoration candidates must not be statically imported by runtime modules. Until approved raster art exists, decoration data can keep economy metadata, but visible art URLs stay absent.
- The next Pantry implementation should add approved assets through the manifest first, then wire only approved/visible records into UI.

### Implementation Note - v0.1.59

- Time Attack is now implemented as an experimental local hub and 3-round generated puzzle flow, not as a finished monetization/leaderboard feature.
- All AAB production remains paused during the rework. Local browser/mobile-preview approval comes first.
- Art pipeline rule is strict: no new player-facing CSS/DOM art placeholders for currency, decorations, badges, menus, rewards, or tutorial visuals. Use approved raster assets or keep the feature gated.
- Next production-quality gameplay pass should prioritize focused puzzle play, larger-board readability, cursor line highlights, hint bulbs, and Time Attack difficulty progression.



### Implementation Note - v0.1.60

- Cursor/D-pad controls now have a stronger containment layer for narrow panels and conservative input feedback.
- Direction-key movement should remain sound-only by default; haptics are reserved for actual fill/blank actions to avoid excessive buzzing during repeated movement.
- Android launcher visibility will be checked during the next release build, especially Samsung Game Launcher behavior and manifest/category implications.

### Implementation Note - v0.1.61
- Badge visuals now require dedicated approved raster badge assets before they can be shown. Stage art is not reused as badge art.
- Remaining art work should create real PNG/WebP assets for currency, floating menu icons, badge rewards, pantry decorations, and tutorial beats; CSS/DOM-drawn placeholder art stays out of player-facing UI.


### Implementation Note - v0.1.62

- Cursor/D-pad controls received a narrow-layout containment pass after review showed the D-pad overlapping selected-cell action buttons.
- Keep the player setting for control style visible and simple: auto, direct tap, or D-pad.
- The next larger-board pass should move more puzzle solving into the focused play surface, where 10x10+ grids, cursor controls, hints, and Time Attack timers have room to breathe.
- Time Attack remains designed around deterministic generated puzzles, not memorized catalog puzzles.
- Art policy remains unchanged: no CSS/DOM-drawn player-facing art for currency, menus, badges, tutorial, decorations, or rewards. Reviewed raster assets only.

### Implementation Note - v0.1.63
- Cursor controls now include soft line-completion guidance for larger boards: satisfied active lines expose likely blank candidates as pale X marks.
- The guide intentionally stays visual-only and does not auto-mark cells, leaving full control with the player.
- Pantry/decor/badge art remains blocked behind real raster asset production; CSS placeholder art should not be expanded.

### v0.1.64 implementation note

- Focused puzzle play now accepts keyboard-style cursor input as a desktop verification path and as the same interaction model that will back mobile D-pad controls for 10x10+ boards.
- The keyboard layer intentionally avoids changing puzzle economy, Pantry art, or release packaging.
- Continue with larger-board board-fit checks, hint affordances, and Time Attack flow before any AAB work resumes.


### Implementation Note - v0.1.66
- Time Attack local records now include elapsed time and a simple score formula. This is intentionally a local prototype, not the final leaderboard/economy balance.
- Focused play now shows the Time Attack timer in the header and keeps cursor controls contained on narrow panels.
- Next gameplay pass should decide the final Time Attack scoring ladder, hint-bulb economy, and larger-board board-fit rules before Android packaging resumes.

### Implementation Note - v0.1.67
- Larger boards now explain the hint economy more clearly: hints are limited per puzzle and reveal one sure square, while undo remains free.
- This is a UX/logic bridge only. The final hint bulb icon, purchase/reveal effect, and Pantry decoration art must be created as reviewed raster PNG/WebP assets before production polish.
- Keep Android release packaging paused until the experimental play-loop, economy, and asset direction are stable again.


### Direction Addendum - v0.1.124 Replay and Progression Economy

- Do not pay normal rewards for unrestricted replay of solved catalog pictures; solved nonograms are too easy to memorize.
- Add replay value through bounded Pip Replay Picks, clean-solve challenges, no-hint conditions, and small daily-limited rewards.
- Use Pantry milestone gates for future stage expansion: preview access can stay generous, but full progression should ask the player to decorate enough of the room to prove engagement with the core economy.
- Monetization pressure should come from wanting to accelerate Pantry milestones and future stage access, while still leaving a fair free path through daily rewards, Time Attack, and bounded replay picks.

### v0.1.129 Benchmark Note - Story-backed Decoration
- Benchmark takeaway: even a simple furniture purchase can feel more compelling when it starts as a character request, shows a target item, and ends with a small acknowledgement/reward moment.
- Pip's Picture Pantry should keep its own puzzle-first identity, but Pantry purchases should increasingly become authored micro-requests: ask -> choose item -> place -> react -> unlock the next cozy goal.
- First implementation slice: the starter Pantry item now appears through a Pip request card rather than only as a shop item.


### v0.1.130 Follow-up - Story Milestone Loop

- The decoration benchmark direction now has a second step in product form: first request completion produces a small relationship/room-level beat and points to next arrivals.
- Next expansion should turn selected arrival goals into richer Pip dialogue or delivery-board tasks, rather than only adding more shop cards.


### v0.1.131 Follow-up - Delivery Notes

- Decoration progression now has a benchmark-inspired chain: first request, room milestone, next-arrival preview, and selected delivery note.
- Next step should decide whether delivery notes become a durable task list with rewards, dialogue, and completion celebration, or remain a lightweight guide layer.


### v0.1.132 Follow-up - Delivery Completion

- Delivery notes now have a completion beat when their target decoration is acquired, making the decoration loop request -> goal -> purchase -> celebration.
- The next UX step is to decide whether the completion beat should unlock a new durable request queue, a room chapter, or a Pip dialogue scene.

### v0.1.133 Follow-up - Shop Scan Control

- Pantry shop now supports the story/economy direction by keeping the default catalog scan small: 6 prioritized items first, then optional expansion.
- This keeps room goals and Pip delivery notes from being buried under a long catalog while preserving access to all approved decorations.
- Next durable progression step should decide whether completed delivery notes create a saved request queue, room chapter progress, or a Pip dialogue follow-up.

### v0.1.134 Follow-up - Pantry Support Card Grouping

- Pantry now has a clearer hierarchy: story beats remain above, support information is grouped in a planning deck, then the shop follows with progressive reveal.
- This keeps the benchmark-inspired story/request loop readable while preserving the practical economy and placement explanations.
- Next product slice should focus on durable request/chapter state or a Pip dialogue follow-up after delivery completion, rather than adding more independent top cards.

### v0.1.135 Follow-up - Durable Delivery Goals

- Delivery-note progression now has a save-backed target, which is the first durable step toward room requests/chapters.
- Next product slice can build on this by recording completed request history, unlocking the next authored request, or showing a Pip dialogue beat after completion.


### v0.1.136 Follow-up - Delivery Request History
- Completed Pantry delivery requests now leave a durable, deduped history entry in save data instead of disappearing after the active note is cleared.
- This gives the upcoming story/chapter gate and Pantry economy tuning a stable record of which request moments the player has already fulfilled.
- Verified through save-layer unit coverage and mobile visual QA save-state inspection.


### v0.1.137 Follow-up - Visible Request History
- Added the first visible layer on top of delivery completion history: a cozy request-log card in the Pantry.
- This supports the larger direction where purchases and room changes are story moments, not just catalog transactions.


### v0.1.138 Follow-up - Story Step Pressure
- Completed Pantry requests now feed a visible room-step meter, turning decoration purchases into chapter progression.
- This is the first implementation step toward requiring meaningful room/story progress before later puzzle-stage expansion.

### v0.1.139 Follow-up - Economy Gate
- Connected the decoration/story economy to puzzle progression by requiring Pantry delivery completions for unlockable stage packs.
- First-pass thresholds: 3 completed requests for Sunny Spoon Sign, 6 for Apron Drawer, 10 for Bakery Window, and 10 for Village Pantry.
- Locked stage UI now explains the missing Pantry story progress instead of only asking for more spoons.
- This keeps the user's economy direction in the live progression loop without forcing a larger balance rewrite yet.

### v0.1.140 Follow-up - Map Gate Clarity
- Extended the v0.1.139 economy gate visibility into the badge map so future-stage goals are consistent across navigation surfaces.
- This keeps the progression loop clearer before deeper balance tuning or paywall packaging.

### v0.1.141 Follow-up - Actionable Gate
- Added a direct Pantry route to locked stage cards so economy gates guide the user back to the decoration/story loop.
- This supports the intended loop: solve puzzles, earn spoons, complete Pantry requests, then unlock the next puzzle stage.

## Direction Addendum - 2026-07-07 Puzzle Scale Clarification

- "As many as possible" remains the content ambition. Specific large numbers are planning references, not fixed launch promises.
- Puzzle volume can ship at launch or through later updates, depending on art, QA, performance, and economy readiness.
- The Pantry/story/spoon systems should pace access and motivation without reducing the long-term ambition for a very large curated puzzle library.
- Quality remains non-negotiable: puzzle idea, recognizable finished image, color sensibility, and logical solvability matter as much as count.

### v0.1.142 Follow-up - Pantry Stage Goal
- Added Pantry-side visibility for the next puzzle-stage gate, aligning the large-puzzle-library ambition with story/economy pacing.
- This helps players understand that completing Pantry requests unlocks more puzzle content, not just room decoration.


### v0.1.143 Follow-up - Stage Art Guard
- The current approved stage reward artwork is now protected by mobile QA instead of only being present in data wiring.
- This reduces the risk that future stage/badge/puzzle-hub changes accidentally return the experience to a construction-placeholder feel.


### v0.1.144 Follow-up - Chained Pantry Requests
- Request completion now feeds directly into the next authored decoration goal, supporting the direction that purchases should feel like story beats rather than isolated shop transactions.
- The implementation reuses the existing delivery-note save path, keeping the loop stable while leaving room for fuller authored chapters later.


### v0.1.145 Follow-up - Room Chapter Signal
- Completed decoration requests now read as chapter progress, reinforcing that Pantry purchases are progression beats tied to later puzzle access.
- This keeps the economy/story loop visible while leaving richer authored cutscenes for a later polish slice.


### v0.1.146 Follow-up - Stage Spoon Gate
- The Pantry-to-stage gate now communicates both story progress and spoon savings, aligning the UI with the intended economy pressure.
- This supports the direction that players who want to progress quickly understand why replay, daily play, and Time Attack matter.


### v0.1.147 Follow-up - Legacy Unlock Dot Cleanup
- Removed an old puzzle-chip pseudo-element from the pre-Pantry-gate era so future stage-lock visuals rely on the current Pantry/story/economy surfaces.

### v0.1.148 Follow-up - Source Hygiene Guard
- Added a dedicated source hygiene QA command to keep encoding drift and removed legacy puzzle-chip styling from quietly returning during the large art/story rework.

### v0.1.149 Follow-up - Pack Size Contract
- Added a data-level guard for the next content-scale phase: each progression pack's declared board size must match its maximum shipped puzzle size.
- This keeps future 12x12/15x15 ambitions from appearing in runtime metadata before authored puzzle grids actually exist.

### v0.1.150 Follow-up - Puzzle Scale Test Flex
- Reworked puzzle data tests so they protect minimum catalog scale and board-size placement rules without freezing the current 100-puzzle distribution.
- This clears the next content-expansion lane: new progression puzzles can be added without first rewriting stale count assertions.

### v0.1.151 Follow-up - First 12x12 Catalog Puzzle
- Added the first authored 12x12 catalog puzzle to prove the dedicated play screen can receive larger progression content, not only Time Attack generated boards.
- Future 12x12/15x15 expansion should continue as curated puzzle additions with mobile QA after each small batch.

### v0.1.152 Follow-up - 12x12 Mobile QA Path
- Added mobile QA coverage that opens the authored 12x12 catalog puzzle and verifies the focused play screen layout receives the larger board.
- This protects the larger-board expansion lane before adding more 12x12/15x15 authored content.

### v0.1.153 Follow-up - 12x12 Content Batch
- Expanded the large-board catalog from a single Bakery Window 12x12 card to a three-card mini batch.
- Mobile QA now guards that the 12x12 cards are visible in the unlocked catalog before entering focused play.
- Verification after this slice: `node --check tests\\puzzleData.test.js`, `node --check scripts\\mobile_visual_check.js`, and `node --check src\\data\\puzzles.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the three-card 12x12 Bakery Window catalog check.


### v0.1.154 Follow-up - First-Impression UI Polish
- Treated the opening-screen seal and start button as part of the art-quality pass rather than final graphics, replacing the mismatched old icon crop with current Pip chrome art.
- Polished settings modal controls to reduce the skeleton/PPT feel while the broader graphic replacement plan continues.
- Note: final app icon replacement should update both installed app icon assets and this opening seal usage together.
- Verification after this slice: `node --check src\\ui\\brandIntro.js` and `node --check src\\ui\\settingsView.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; Playwright visual capture found 0 overflowing opening/settings controls and reduced the settings dialog height from about 808px to about 731px on 390x844; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


### v0.1.155 Follow-up - First-Impression QA Guard
- Locked the current opening screen and settings polish into mobile QA so first-impression UI regressions are caught during future art/icon replacement.
- Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the opening seal/start-button and settings-dialog polish guards active.

### v0.1.156 Follow-up - Opening Seal Asset Guard
- Added asset QA coverage so the start-screen seal stays tied to current Pip character art until the final app-icon family is replaced deliberately.
- Verification after this slice: `node --check scripts\\asset_manifest_check.js` passed; `npm run qa:assets` passed with 122 assets; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.157 Follow-up - Tactile Button System Polish
- Reduced the visual gap between the polished opening screen and the in-game UI by applying a shared tactile button treatment to reusable controls.
- Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.158 Follow-up - App Chrome Polish
- Continued the first-impression polish into persistent app chrome: header/HUD and floating navigation now share the same warmer tactile design language.
- Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.159 Follow-up - App Chrome QA Guard
- Locked app chrome polish into mobile visual QA so the framed HUD and floating nav do not regress during later art/layout passes.
- Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the app chrome polish guard active; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK.
### v0.1.160 Follow-up - Completion Reward Polish
- Reward/completion UI moved closer to the approved cozy art direction without changing puzzle logic.
- Next likely guard: add automated mobile checks for completion banner and stage-complete card containment.
### v0.1.161 Follow-up - Reward Polish QA Guards
- Closed the v0.1.160 follow-up by making reward polish measurable in automated mobile QA.
- Next likely slice: continue replacing remaining placeholder-feeling surfaces with the current Sunny Spoon/Pip art direction.
### v0.1.162 Follow-up - Settings Dialog Polish
- Addressed the preview feedback that settings still felt like a temporary flat form.
- Next likely slice: strengthen the QA guard to check settings button/input polish metrics directly.
### v0.1.163 Follow-up - Settings Polish QA Guard
- Closed the v0.1.162 QA follow-up with measurable settings dialog polish checks.
- Next likely slice: continue polishing remaining high-traffic surfaces such as replay picks, album/map cards, or pantry purchase feedback.
### v0.1.164 Follow-up - iOS Safe Area Chrome Guard
- Closed the urgent visual QA risk from Review 27 by protecting the app shell with CSS safe-area insets and an automated mobile guard.
- Next likely slice: continue high-traffic UI polish for replay picks, album/map cards, or pantry purchase feedback.
### v0.1.165 Follow-up - Replay Picks Polish
- Replay Picks now matches the current tactile/cozy UI direction and is protected by mobile QA.
- Next likely slice: album/map card polish or pantry purchase feedback polish.
### v0.1.166 Follow-up - Album And Map Polish
- Collection/progression surfaces now match the current Sunny Spoon UI direction and are protected by mobile QA.
- Next likely slice: pantry purchase feedback polish or remaining shop/collection affordance polish.
### v0.1.167 Follow-up - 12x12 Bakery Content Batch 2
- Continued the content-volume lane from Review 28 with a small curated 12x12 batch instead of a broad generated dump.
- The 12x12 catalog guard now requires five Bakery Window large-board puzzles.
### v0.1.168 Follow-up - Village Pantry 10x10 Content Batch
- Continued the content-volume lane with a small curated late-stage 10x10 batch.
- Next likely content slice: add another small batch to Village Pantry or start a new checked content-generation helper for larger puzzle authoring.
### v0.1.169 Follow-up - Village Pantry 10x10 Content Batch 2
- Continued the content-volume lane with a second small Village Pantry batch.
- Next likely slice: add a lightweight content authoring/validation helper so future batches can scale without hand-checking row lengths and catalog floors each time.

### v0.1.170 Follow-up - 12x12 Bakery Content Batch 3
- Continued the larger-board content-volume lane with a third curated Bakery Window 12x12 batch.
- Mobile visual QA now requires seven 12x12 Bakery catalog chips, keeping the dedicated play surface guarded as content grows.

### v0.1.171 Follow-up - Puzzle Catalog Report Guard
- Added a catalog-report guard so future 500+/1000+ puzzle expansion can track pack and board-size distribution with a repeatable command instead of manual counting.
- This supports the user's direction that puzzle quantity should be as many as possible while preserving authored-quality and economy pacing.

### v0.1.172 Follow-up - Village Pantry 10x10 Content Batch 3
- Continued the authored content-volume lane with a third Village Pantry 10x10 batch.
- The catalog report now guards 113 free puzzles and 12 Village Pantry large-board cards, keeping puzzle-volume growth explicit.

### v0.1.173 Follow-up - Village Pantry Mobile Catalog Guard
- Added a mobile guard for the expanded Village Pantry 10x10 catalog so late-stage content volume remains visible in the actual player navigation path.

### v0.1.174 Follow-up - 12x12 Bakery Content Batch 4
- Continued the larger-board content-volume lane with a fourth curated Bakery Window 12x12 batch.
- Mobile and catalog-report guards now track nine 12x12 Bakery Window cards.

### v0.1.175 Follow-up - Village Pantry 10x10 Content Batch 4
- Continued the authored content-volume lane with a fourth Village Pantry 10x10 batch.
- Mobile and catalog-report guards now track 14 Village Pantry large-board cards.

### v0.1.176 Follow-up - 12x12 Bakery Content Batch 5
- Continued the larger-board content-volume lane with a fifth curated Bakery Window 12x12 batch.
- Mobile and catalog-report guards now track 11 12x12 Bakery Window cards.

### v0.1.177 Follow-up - Village Pantry 10x10 Content Batch 5
- Continued the authored content-volume lane with a fifth Village Pantry 10x10 batch.
- Mobile and catalog-report guards now track 16 Village Pantry large-board cards.

### v0.1.178 Follow-up - 12x12 Bakery Content Batch 6
- Continued the larger-board content-volume lane with a sixth curated Bakery Window 12x12 batch.
- Mobile and catalog-report guards now track 13 12x12 Bakery Window cards.

### v0.1.179 Follow-up - Village Pantry 10x10 Content Batch 6
- Continued the authored content-volume lane with a sixth Village Pantry 10x10 batch.
- Mobile and catalog-report guards now track 18 Village Pantry large-board cards.


### v0.1.180 Follow-up - Village Pantry Translation Metadata Guard
- Closed the Review 29 metadata gap by registering recent Village Pantry titles in the puzzle data and i18n dictionaries.
- Next likely slice: resume content-volume growth or add a stronger catalog metadata validator before larger generated batches.


### v0.1.181 Follow-up - Large-Board Translation Metadata Guard
- Large-board catalog growth now has a direct titleKey/i18n contract before the next content-volume push.
- Next likely slice: continue curated 12x12/10x10 content expansion or add a small authoring helper for batch puzzle intake.


### v0.1.182 Follow-up - Catalog Metadata QA Guard
- The content-volume lane now has an automated metadata gate for 10x10+ progression puzzles before the next authored or generated batch lands.
- Next likely slice: resume curated 12x12/10x10 puzzle additions with the guard active.


### v0.1.183 Follow-up - 12x12 Bakery Content Batch 7
- Resumed the content-volume lane with the v0.1.182 catalog metadata guard active.
- Next likely slice: add another Village Pantry 10x10 batch or continue Bakery 12x12 toward a denser late-stage catalog.


### v0.1.184 Follow-up - Village Pantry 10x10 Content Batch 7
- Continued the Village Pantry content-volume lane with the catalog metadata guard active.
- Bakery Window and Village Pantry now both have deeper late-stage puzzle lanes guarded by mobile visibility checks.


### v0.1.185 Follow-up - 12x12 Bakery Content Batch 8
- Continued the Bakery 12x12 content-volume lane with catalog metadata and mobile visibility guards active.
- Next likely slice: add a Village Pantry 10x10 companion batch or start a reusable puzzle batch authoring helper.


### v0.1.186 Follow-up - Village Pantry 10x10 Content Batch 8
- Continued the Village Pantry companion content lane so Bakery and Village late-stage depth keep growing together.
- Next likely slice: pause content addition briefly to add a reusable batch intake helper, or continue with another Bakery 12x12 pair.


### v0.1.187 Follow-up - Puzzle Batch Intake Guard
- Added a reusable candidate-batch validator before continuing larger content-volume pushes.
- This reduces hand-checking risk for future 10x10, 12x12, and later 15x15 puzzle batches.

### v0.1.188 Follow-up - Village Pantry 10x10 Batch
- Continued the "as many polished puzzles as possible" target with a focused Village Pantry content pair.
- Increased catalog/mobile QA thresholds from 43 to 45 large boards and from 22 to 24 Village Pantry 10x10 chips.

### v0.1.189 Follow-up - Bakery Window 12x12 Batch
- Continued the large-board content ramp with two additional 12x12 Bakery Window puzzles.
- Increased catalog/mobile QA thresholds from 45 to 47 large boards and from 17 to 19 Bakery Window 12x12 chips.

### v0.1.190 Follow-up - Village Pantry 10x10 Pair
- Continued the high-volume polished puzzle goal with two additional Village Pantry 10x10 puzzles.
- Increased catalog/mobile QA thresholds from 47 to 49 large boards and from 24 to 26 Village Pantry 10x10 chips.

### v0.1.191 Follow-up - Readable Puzzle Art Intake
- User direction reinforced that puzzle color, picture completion, and instant recognizability matter as much as count.
- Added an intake contract requiring silhouette, color mood, and visual tags for future 10x10+ free puzzle batches.
- Continued the high-volume puzzle target with two additional 12x12 Bakery Window puzzles.

### v0.1.192 Follow-up - Village Readable Puzzle Pair
- Continued the high-volume puzzle target while preserving the new recognizability rule from v0.1.191.
- Added Blueberry Label and Potted Basil with explicit future color direction for richer completion art.

### v0.1.193 Follow-up - Bakery Readable Puzzle Pair
- Continued the high-volume puzzle target with Cocoa Mug Steam and Gingerbread Heart.
- Kept the v0.1.191 recognizability rule active through explicit silhouette, color mood, and tag metadata.

### v0.1.194 Follow-up - Village Readable Puzzle Pair
- Continued the high-volume puzzle target with Warm Pie Window and Checkered Jam Cloth.
- Preserved the recognizable-puzzle rule through explicit silhouette, color mood, and tag metadata.

### v0.1.195 Follow-up - Bakery Readable Puzzle Pair
- Continued the high-volume puzzle target with Layer Cake Slice and Ribbon Cookie Box.
- Kept puzzle intake aligned with the user's recognizability requirement by adding silhouette/color/tag readability briefs to both new 12x12 puzzles.
- Next: continue alternating Bakery Window 12x12 and Village Pantry 10x10 batches, or start feeding readability metadata into completion/reveal polish.

### v0.1.196 Follow-up - Village Readable Puzzle Pair
- Continued the high-volume puzzle target with Cinnamon Braid and Teapot Cozy.
- Release timing note: Android production access remains closed-test gated; Mac mini arrival around 2026-07-23 means shared content and QA are the best use of the current window.
- Next: continue alternating Bakery Window 12x12 and Village Pantry 10x10 batches, then connect readability metadata into completion/reveal polish once the catalog floor is stronger.

### v0.1.197 Follow-up - Four Puzzle Readability Batch
- Switched from 2-puzzle increments to a 4-puzzle mixed batch to increase catalog throughput while preserving artReadability briefs and i18n coverage.
- Keep this as the preferred content-production cadence when no new UI architecture is being touched.

### v0.1.198 Follow-up - Puzzle Readability Report Guard
- Quality cadence adjustment: keep using 4-puzzle content batches when stable, but first make the catalog QA report protect recognizability and art planning metadata.
- This supports the owner's priority order: quality, completeness, and interface satisfaction before raw puzzle count.

### v0.1.199 Follow-up - Four Puzzle Quality Batch
- Returned to 4-puzzle content production after v0.1.198 quality guard work.
- Keep the cadence quality-first: every new 10x10+ free puzzle needs a readable silhouette, color mood, and tags before it can pass catalog QA.

### v0.1.200 Follow-up - Four Puzzle Quality Batch
- Continued the quality-gated 4-puzzle production cadence and crossed the v0.1.200 milestone.
- Keep mixing Bakery 12x12 and Village 10x10 additions so both high-density play and cozy pantry identity grow together.

### v0.1.201 Follow-up - Recent Puzzle Edge Row Polish
- Puzzle production quality rule: avoid using all-zero top/bottom rows as generic padding in new readable large-board puzzles.
- Prefer an intentional base, plate shadow, handle continuation, crumb line, table line, or small decorative edge detail when the object needs breathing room.

### v0.1.202 Follow-up - Four Puzzle Quality Batch
- Resumed 4-puzzle production while applying the v0.1.201 edge-row rule from the start.
- Continue treating silhouette edge rows as authored visual details, not disposable padding.

### v0.1.203 Follow-up - Four Puzzle Quality Batch
- Continued the quality-first content scale-up with four more readable 10x10+/12x12 free puzzles.
- Kept the no-blank-edge-row rule active for recent readable large boards so new art briefs map to intentional silhouettes.

### v0.1.204 Follow-up - Four Puzzle Quality Batch
- Continued the curated puzzle scale-up with four more readable large-board puzzles while varying silhouettes across pastries, jars, and herb/textile pantry props.
- Raised catalog and mobile visual guards so quantity growth remains test-visible instead of only documented.

### v0.1.205 Follow-up - Time Attack Hint Economy
- Added the first implementation slice for Time Attack as both spoon earning and spoon spending: paid hints with escalating costs.
- Keep next pass focused on UX polish and telemetry-like balancing notes before changing reward numbers further.

### v0.1.206 Follow-up - Time Attack Hint Confirmation Polish
- Addressed Review 32 follow-up by removing native confirm and making paid-hint no-refund semantics visible in UI copy.

### v0.1.207 Follow-up - Four Puzzle Quality Batch
- Continued curated puzzle scale-up after the Time Attack hint economy polish.
- Keep alternating Bakery 12x12 and Village 10x10 batches while preserving instant recognizability and cozy item identity.

### v0.1.208 Follow-up - Four Puzzle Quality Batch
- Continued the quality-first puzzle expansion cadence while the release window remains focused on content depth and QA stability.
- Keep future batches varied across pastry silhouettes, pantry tools, storage jars, and textile/decor objects so the catalog does not feel repetitive.

### v0.1.209 Follow-up - Four Puzzle Quality Batch
- Continued autonomous content expansion while the user was away, keeping the established QA ladder intact.
- Watch for repeated pantry jar/storage concepts in future batches; prefer tools, textiles, windows, plants, tableware, and bakery shapes to keep the catalog lively.

### v0.1.210 Follow-up - Recent Puzzle Title Guard
- Converted the v0.1.208 Cocoa Tin duplicate-title lesson into a focused regression test for recent readable 10x10+ puzzle batches.
- Continue allowing legacy starter repeats, but keep new premium-feeling catalog entries distinct by name and silhouette.

### v0.1.211 Follow-up - Four Puzzle Quality Batch
- Continued the high-quality large-board puzzle cadence after adding the recent-title uniqueness guard.
- Keep rotating pastry shapes, tea tools, textiles, jars, plants, and room decor so the picture catalog feels curated rather than generated in bulk.

### v0.1.212 Follow-up - Catalog Report Threshold Tightening
- Tightened the catalog report regression floor before continuing the push toward 200+ puzzles.
- Keep tests tracking actual catalog scale so future content regressions are visible, not hidden behind old launch-era thresholds.

### v0.1.213 Follow-up - Four Puzzle Quality Batch
- Continued content expansion after tightening catalog report thresholds.
- Next content milestone: one more 4-puzzle batch crosses 199, then the following small batch can pass 200 while preserving readability and distinct title guards.

### v0.1.214 Follow-up - Four Puzzle Quality Batch
- Reached the 199-puzzle threshold with guarded readable large-board expansion.
- Next small content batch should intentionally cross 200 and then pause for a catalog/UX polish pass before another large content run.


### v0.1.215 Follow-up - 200+ Puzzle Milestone Batch
- Crossed 200 total free puzzles with a balanced 4-puzzle batch: two Bakery Window 12x12 boards and two Village Pantry 10x10 boards.
- Continued the high-quality puzzle rule: recognizable silhouette first, future color mood documented, tags present, no blank edge rows, localized catalog names.
- Next after QA: pause briefly for catalog UX / first-impression polish before continuing another content burst.


### v0.1.216 Follow-up - Opening Screen Tactile Polish
- After crossing 200 puzzles, paused content expansion briefly for first-impression polish.
- Improved the start button and intro composition without replacing the approved Sunny Spoon/Pip art assets.
- Kept this as a scoped UI polish layer rather than a broad art-system rewrite.


### v0.1.217 Follow-up - Catalog Summary Polish
- After the 200+ puzzle milestone and opening-screen polish, improved puzzle hub scanability so large stages communicate their size before another content burst.
- Next content pass can resume puzzle growth, but keep summary chips and catalog QA thresholds aligned as counts climb.


### v0.1.218 Follow-up - Four Puzzle Quality Batch
- Resumed curated puzzle growth after the 200+ catalog UX polish, adding two Bakery 12x12 and two Village 10x10 boards.
- Continue alternating content growth with short UX/QA polish passes so the large catalog remains both deep and easy to browse.


### v0.1.219 Follow-up - Recent Korean Puzzle Title Guard
- Closed a localization-quality gap found after the v0.1.218 content batch: recent large-board Korean catalog names now have explicit readable coverage.
- Keep pairing content batches with metadata guards so puzzle quantity growth does not quietly reduce catalog polish.


### v0.1.220 Follow-up - Four Puzzle Quality Batch
- Continued curated puzzle scale with two new 12x12 bakery silhouettes and two new 10x10 pantry-object silhouettes.
- Keep the next content pass balanced between puzzle quantity and readable object design, especially as 12x12 boards become a stronger differentiator.


### v0.1.221 Follow-up - Four Puzzle Quality Batch
- Continued the high-volume curated puzzle lane with silhouettes that should remain recognizable even before final color-card art is attached.
- Keep alternating Bakery 12x12 and Village 10x10 batches until the catalog depth target is comfortably ahead of closed-test expectations.


### v0.1.222 Follow-up - Bakery 12x12 Guard Alignment
- Closed a small QA drift after the v0.1.221 content batch: Bakery-specific guard now matches the active 57-card 12x12 floor.


### v0.1.223 Follow-up - Four Puzzle Quality Batch
- Continued curated catalog expansion with a mix of pastry silhouettes and pantry-tool silhouettes while preserving the readable art brief contract.
- Next content slices should keep avoiding repeated object shapes so the catalog feels broad, not merely large.

### v0.1.224 Follow-up - Four Puzzle Quality Batch
- Continued the polished puzzle-volume lane with two Bakery Window 12x12 boards and two Village Pantry 10x10 boards.
- Kept the new puzzles within the art-readability contract so future generated art has explicit silhouette, color mood, and tag guidance.

### v0.1.225 Follow-up - Four Puzzle Quality Batch
- Added one more balanced content batch, keeping the growing puzzle catalog tied to translated metadata, readability briefs, and mobile catalog guards.

### v0.1.226 Follow-up - Four Puzzle Quality Batch
- Continued the authored puzzle expansion with another balanced Bakery/Village batch.
- Preserved the launch-content direction: many puzzles, but each one carries translated metadata and an art-readability brief for later visual production.

### v0.1.227 Follow-up - Four Puzzle Quality Batch
- Continued the polished content-volume push while keeping puzzle identity readable enough for later artwork and album surfaces.

### v0.1.228 Follow-up - Four Puzzle Quality Batch
- Continued the high-volume puzzle catalog with another readable Bakery/Village batch and crossed 100 large-board readability briefs.

### v0.1.229 Follow-up - Four Puzzle Quality Batch
- Continued the balanced Bakery/Village puzzle expansion with translated metadata, art-readability briefs, and raised mobile/catalog guards.

### v0.1.230 Follow-up - Four Puzzle Quality Batch
- Continued expanding the polished launch catalog and crossed 80 Village Pantry 10x10 boards under mobile/catalog guards.

### v0.1.231 Follow-up - Four Puzzle Quality Batch
- Continued the polished large-board catalog expansion, keeping puzzle volume tied to readable silhouettes and translated metadata.

### v0.1.232 Follow-up - Four Puzzle Quality Batch
- Continued the quality-first puzzle scale-up with two readable Bakery Window 12x12 puzzles and two readable Village Pantry 10x10 puzzles.
- Keep alternating larger board content while preserving clear silhouette, color mood, and translated metadata for every new puzzle.

### v0.1.233 Follow-up - Four Puzzle Quality Batch
- Continued the quality-first catalog ramp with two pastry silhouettes and two pantry-tool silhouettes, all carrying readable art briefs and localized titles.
- The launch-volume lane remains quality gated: every added 10x10+/12x12 puzzle must stay recognizable before future artwork production.

### v0.1.234 Follow-up - Four Puzzle Quality Batch
- Continued the quality-first content ramp and pushed Bakery Window past 100 authored puzzles while Village Pantry keeps expanding its 10x10 object vocabulary.
- The next content passes can keep this two-pack cadence until a new themed pack receives approved art direction and QA thresholds.

### v0.1.235 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Kept the incremental puzzle production lane focused on readable icons first, so future art generation can use the puzzle metadata as a compact creative brief.

### v0.1.236 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Continued the high-volume puzzle lane while keeping every added puzzle tied to a readable cozy object, not abstract fill patterns.

### v0.1.237 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Continued the puzzle-scale lane with distinct pantry and pastry objects to avoid repeated abstract silhouettes.

### v0.1.238 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Kept the content lane aligned to cozy, inspectable objects so future puzzle art can be generated from specific briefs instead of generic patterns.

### v0.1.239 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Continued pushing catalog scale while keeping object identity readable for future album thumbnails and reward art.

### v0.1.244 Follow-up - Readable Puzzle Batch
- Continued the Season 0 catalog ramp with four quality-gated puzzles while staying in the launch-polish pivot zone.
- New batch: Raspberry Lattice Tart, Sesame Pretzel Knot, Porcelain Measuring Jug, and Embroidered Tea Cozy. Keep future batches similarly distinct in silhouette and color mood.

### v0.1.245 Follow-up - Time Attack Progress-Cell Records
- Time Attack record design now uses correct progress cells as the primary ranking unit, with elapsed time and hint usage as secondary score factors.
- This preserves the user's direction that one more correct move should matter more than merely reaching the same board or round.

### v0.1.246 Follow-up - Time Attack Timeout Records
- Time Attack now has a concrete 3-minute session limit, making progress-cell records meaningful even when the player does not complete all three boards.
- Partial runs record the largest board reached and correct cells completed so the mode can differentiate close attempts.

### v0.1.247 Follow-up - Time Attack Timeout Visual Polish
- Added visual emphasis for Time Attack timeout and personal-record outcomes so progress-cell runs feel more intentional after the 3-minute limit.

### v0.1.248 Follow-up - Time Attack Result Detail Polish
- 타임어택 타임아웃 결과에서 보상이 있는 타임아웃과 진행 부족으로 보상이 없는 타임아웃을 문구로 분리했다.
- 결과 카드에 사용한 힌트 수를 노출해, 기록 경쟁과 스푼 소비가 한 화면에서 함께 이해되도록 정리했다.
- 버전 표기는 v0.1.248로 갱신했다.

### v0.1.249 Follow-up - Time Attack Record Hint Visibility
- 타임어택 최고 기록 요약과 기록 목록에 사용한 힌트 수를 함께 표시하도록 정리했다.
- 진행 칸 수, 시간, 힌트 수가 한 줄에 같이 보여 기록 경쟁과 스푼 소비의 관계가 더 명확해졌다.
- 버전 표기는 v0.1.249로 갱신했다.

### v0.1.250 Follow-up - Opening Version Visibility
- 오프닝 게임 시작 화면과 이름 입력 화면에 작은 버전 칩을 추가해, 미리보기에서 현재 빌드를 즉시 확인할 수 있게 했다.
- APP_VERSION을 src/data/appVersion.js로 분리해 앱 쉘과 브랜드 인트로가 같은 버전 값을 공유하도록 정리했다.
- 모바일 QA가 오프닝 버전 칩을 확인하도록 확장했다.

### v0.1.251 Follow-up - Four Puzzle Quality Batch
- Added two Bakery Window 12x12 puzzle briefs and two Village Pantry 10x10 puzzle briefs with explicit silhouette/color/tags metadata.
- Continued the Season 0 quality-first launch catalog toward the 333-puzzle target while keeping post-launch seasonal expansion open.

### v0.1.252 Follow-up - Four Puzzle Quality Batch
- Added another balanced Bakery/Village batch with pastry and pantry silhouettes chosen for later icon-readability.
- Season 0 catalog now has 38 free puzzles remaining to the 333 launch target, leaving room for UI/art polish before release.

### v0.1.253 Follow-up - Four Puzzle Quality Batch
- Added pastry roll/tile and pantry tool/rest silhouettes to keep the growing catalog visually distinguishable.
- Season 0 catalog now has 34 free puzzles remaining to the 333 launch target.

### v0.1.254 Follow-up - Four Puzzle Quality Batch
- Added another quality-gated Bakery/Village content batch while keeping silhouettes distinct enough for later thumbnail and reward art production.
- GitHub verify workflow is now part of the project baseline; keep local QA aligned with the same test/catalog/hygiene/assets/build ladder before push.

### v0.1.255 Follow-up - Four Puzzle Quality Batch
- Added four more quality-gated launch puzzles, emphasizing immediately readable silhouettes for later art generation.
- Season 0 catalog now has 26 free puzzles remaining to the 333 launch target.

### v0.1.256 Follow-up - Four Puzzle Quality Batch
- Added another balanced Bakery/Village launch batch with distinct pastry and pantry-object silhouettes.
- Season 0 catalog now has 22 free puzzles remaining to the 333 launch target; keep future batches quality-gated and avoid duplicate readable titles.

### v0.1.257 Follow-up - Four Puzzle Quality Batch
- Added pastry rose/twist and pantry crock/scoop silhouettes to keep the late Season 0 catalog varied.
- Season 0 catalog now has 18 free puzzles remaining to the 333 launch target; continue balancing content growth with first-session polish.

### v0.1.258 Follow-up - Four Puzzle Quality Batch
- Added plum/ginger pastry silhouettes and mint/linen pantry silhouettes, keeping late Season 0 entries object-readable.
- Season 0 catalog now has 14 free puzzles remaining to the 333 launch target; after the next few batches, shift harder toward first-session polish.

### v0.1.259 Follow-up - Four Puzzle Quality Batch
- Added cranberry/mocha bakery items and sunflower/gingham pantry items to round out the late Season 0 launch catalog.
- Season 0 catalog now has 10 free puzzles remaining to the 333 launch target, so the next work should start reserving time for UI/art/game-feel polish.

### v0.1.260 Follow-up - Season 0 Launch Catalog Completion
- Completed the practical Season 0 launch catalog target at 333 free puzzles.
- Future content should become seasonal/update-driven rather than bulk pre-launch production; immediate development priority should shift to the first-session experience, art consistency, Pantry progression, Time Attack economy, and mobile polish.

### v0.1.261 - Season 0 Progress Hub
- Puzzle Hub에 Season 0 진행 카드를 추가해 333개 출시 퍼즐을 하나의 런칭 시즌 카탈로그로 보이게 했다.
- 카드에서 전체 완성률, 열린 스테이지 수, 보유 스푼을 함께 보여 주어 다음 스테이지 해금과 Pantry 요청이 자연스러운 목표가 되도록 정리했다.
- 다음 시즌 업데이트 예고 문구를 추가해 출시 후 계절성 퍼즐 팩 확장 방향을 UI 안에 심었다.
- 모바일 preview guard에서 발견된 대형 팩 mosaic 압축 문제를 함께 수정했다. 실제 136개/137개 퍼즐 수를 그대로 렌더하지 않고 20칸 샘플에 진행률을 환산해 stage art가 안정적으로 보이게 했다.

### v0.1.262 - Stage Unlock Plan Copy
- 잠긴 스테이지 카드에 다음 행동 플랜 문구를 추가했다. 스푼 부족, Pantry 요청 부족, 둘 다 부족한 상황을 각각 설명해 다음 퍼즐을 열기 위한 목표를 더 명확하게 보여 준다.
- Season 0의 333개 퍼즐을 단순 목록이 아니라 스푼 수급과 Pantry 진행으로 단계적으로 열어 가는 구조로 느끼게 하는 UI 보강이다.


### v0.1.263 - Opening Promise Strip
- Added a Season 0 launch note and three tactile promise chips to the brand intro: 333 pictures, Pantry goals, and Time Attack.
- The first game screen now previews puzzle volume, decoration goals, and competitive play before the user enters the puzzle loop.


### v0.1.264 - Season Next Goal Card
- Added a Next Goal panel to the Season 0 Puzzle Hub card so the 333-picture catalog points players toward the next locked shelf, album completion, or next-season savings goal.
- Reused the existing spoon/Pantry gate logic inside the hub instead of adding a separate economy rule, keeping stage pacing, room requests, and UI copy aligned.


### v0.1.265 - Season Goal Actions
- Added direct actions to the Season 0 Next Goal card: open a ready stage, route to Pantry when room progress is missing, or view the Album when all stages are open.
- Fixed the Next Goal locked-copy path so it passes the actual unlock-ready boolean into the shared unlock-plan text helper.

### v0.1.266 - Floating Navigation Context Polish
- Continued the post-catalog UX polish lane by giving the floating nav a current-view trigger label and destination helper copy.
- Kept the change UI-only and art-compatible: no placeholder icon art was introduced, preserving the approved asset pipeline for future Sunny Spoon/Pip visual upgrades.

### v0.1.267 - Pantry Progress Mission Card
- Connected the Pantry progress board more directly to progression pacing by showing the next room-step request target and spoon requirement for the next puzzle stage.
- This supports the launch direction that decoration is not merely optional collecting: it becomes a readable bridge between puzzle rewards, room completion, and future stage access.

### v0.1.268 - Pantry Progress Mission Mobile Guard
- Locked the new Pantry progression bridge into mobile QA. Future UI/art passes should preserve the card because it is the visible link between decoration requests, stage access, and spoon pacing.
- This keeps the current priority on launch quality: fewer raw puzzle-production slices, more protection around the progression experience that makes the 333 launch puzzles feel structured.

### v0.1.269 - Pantry Progress Mission Action
- Turned the Pantry Room Path card from a progress readout into a guided action surface.
- The first priority remains room-request progress; spoon earning stays available when the room gate is satisfied or when other Pantry cards call for it.

### v0.1.270 - Time Attack Board Progress Records
- Made the user's Time Attack ranking direction explicit in the product surface: records now communicate how far into the current board the run reached, not just which board was reached.
- This keeps the mode competitive even when many players time out in the same round, while preserving the existing progress-cell scoring model and hint penalty economy.

### Direction Addendum - Puzzle Interaction And Hint Economy UX
- Record these as scheduled product direction, not immediate patch scope: drag painting, friendly line-completion guidance, and size-aware hint bundles should be designed together because they all change how generous the puzzle screen feels.
- Drag painting should let the player press/touch and sweep across consecutive cells instead of tapping every square. The implementation must preserve the current control modes, undo history, mistake tracking, replay-clean checks, and mobile scroll behavior.
- Completed-line guidance should be cozy and readable: when a row or column clue is correctly satisfied, give that line a subtle warm backlight and mark remaining unresolved cells with soft blank/X guidance. This should help new players without making the puzzle solve itself; consider a guided/default-on assist treatment and a settings path if advanced players want less help.
- Normal puzzle hints should become difficulty-scaled bundles rather than a single-cell answer on larger boards. Candidate reveal counts: 5x5 = 1 useful cell, 8x8 = 2-3, 10x10 = 3-4, 12x12 = 5-6, future larger boards = 7+; final numbers should be tuned against real board difficulty and spoon economy.
- Paid hint design should feel like a fair continuation tool: the player should think "one more hint will keep this puzzle alive" rather than "the game solved it for me." Hints should prioritize logically useful filled cells and safe blank marks, not purely random answers.
- Time Attack should keep a distinct hint economy: hints are a tactical spoon sink under pressure, with rising per-run cost and clear no-refund/no-record-confusion semantics. The reveal payload may be smaller or faster than normal mode if needed to protect competitive integrity.
- Suggested implementation order: first drag input and line-complete feedback in the focused puzzle screen, then normal puzzle hint bundles/copy, then Time Attack-specific tuning, then mobile QA guards for drag gestures, line-complete states, hint bundle UI, undo semantics, and scroll prevention.

### v0.1.271 - Completed Line Guidance Foundation
- Added the first implementation slice for friendly puzzle guidance: row/column completion is now checked against the actual solution before the UI shows completed-line glow or soft blank/X suggestions.
- This starts the larger interaction UX lane without changing rewards, hint economy, or drag behavior yet.

### v0.1.272 - Drag Stroke Cell Painting
- Implemented the first planned drag/sweep interaction pass for the focused puzzle board.
- The stroke commits once on pointer release and stores one grouped history item, preserving cozy undo behavior while making larger boards less tap-heavy.

### v0.1.273 - Drag Stroke Preview Polish
- Polished the drag/sweep interaction by giving in-progress cells a clearer preview style before pointer release commits the stroke.
- This closes Review 42 follow-up without changing the drag state model.

### v0.1.274 - Size-Aware Hint Reveal Foundation
- Implemented grouped hint reveals as a foundation for future normal-puzzle paid hints.
- Preserved Time Attack hint balance at one cell per paid hint until separate economy tuning is ready.
- Added regression coverage for multi-cell hint undo behavior and readable i18n copy.
### v0.1.275 - Hint Undo Exploit Guard
- Closed the hint-preview exploit: Undo no longer reduces `hintsUsed` after a hint move.
- Keep the design rule: Undo is an input safety net, not a reward/economy reset.
- Future paid normal-puzzle hints should follow the same rule as Time Attack: no spoon refund and no clean-record reset after Undo.
### v0.1.276 - Hint Targeting Logic Guard
- Hints now prioritize correcting a wrong filled cell before placing additional safe X marks.
- Design rule: a limited or paid hint must resolve the player's current friction, not only reveal unrelated untouched cells.
- Future hint economy tuning should preserve this order: fix clear mistakes, reveal required filled cells, then add safe blank marks.
### v0.1.277 - Visual Guidance Must Match Input Semantics
- Safe X suggestions are not only decorative: direct touch/drag on those cells must mark them, not fill them.
- This closes a small but high-friction puzzle UX trap where a player could follow the UI hint and accidentally create a mistake.
- Continue using this standard for future guidance systems: anything that looks actionable must commit the same semantic action.
### v0.1.278 - Reward Rules Must Observe the Final Move
- Clean replay reward logic must evaluate the completed state, including the final move, before payout.
- Hints, mistakes, and other reward-breaking actions should never be hidden by the transition into a completed screen.
- Use this same ordering standard for future Time Attack and seasonal challenge rewards.
### v0.1.279 - Normal Puzzle Paid Hint Bridge
- Normal large puzzles now have a bridge from limited free hints into paid extra hints, matching the direction that 12x12+ boards may need a fair continuation tool.
- Starting costs are intentionally higher than Time Attack hints because normal hints reveal bundled useful cells and are not under time pressure. Tune these with real play data before launch.
- Preserve separate balance lanes: normal paid hints support cozy completion; Time Attack paid hints remain a high-pressure record decision.

### v0.1.280 - Time Attack Progress State Wiring
- Time Attack records depend on live puzzle-state callbacks, especially for timeout runs where the puzzle is not completed.
- Keep callback wiring guarded whenever play-screen/header/puzzle-view composition is refactored; otherwise progress-cell ranking can lose the current-board state.


### v0.1.281 - Hint Economy State Rule
- Track paid extra hints separately from total hints so free-hint allowances can later vary by board size, difficulty, event, or onboarding without corrupting price escalation.
- Preserve the fairness rule: undo may remove hint-filled cells, but hint usage and spoon-paid hint usage remain recorded.


### v0.1.282 - Friendly Zero-Clue Rows
- For first-session and large-board friendliness, rows or columns with a 0 clue should visually guide players toward X marks instead of staying visually inert.
- Keep this as guidance, not a separate reward/economy action: tapping or dragging the suggested cells still records normal player marks.


### v0.1.283 - Teach Friendly Line Guidance Early
- First-session puzzle guidance should mention line-completion assistance, because completed-line glow and pale X suggestions are core comfort features for larger boards.
- Keep the copy short and embedded in the existing how-to-play card to avoid another modal.


### v0.1.284 - Swipe Play Should Respect Guidance
- Drag/swipe painting should feel fast without punishing players for crossing already-solved guidance.
- Safe X suggestion cells now protect themselves during mixed strokes, which better matches the friendly large-board UX goal.


### v0.1.285 - Swipe Protection Must Preserve Intent
- Safe-suggestion protection should only affect suggested blank cells; it must not turn a clear stroke into a mixed toggle stroke.
- Keep guarding this interaction because swipe play is a core comfort feature on larger boards.

### v0.1.286 - Player-Facing Copy Is Part Of Game Feel
- Keep Korean copy checks close to gameplay UX work, especially for replay, hints, Time Attack, and first-run guide text.
- Treat mojibake or awkward economy wording as a release-quality issue, not a cosmetic-only issue.

### v0.1.287 - Hint Economy Copy Should Be State-Aware
- Hint UI should make the free-to-paid transition explicit in title, body, and action text.
- Keep separating normal puzzle extra hints from Time Attack hint spending because the economy intent is different.

### v0.1.288 - Copy QA Is Part Of Interface Polish
- Treat visible Korean copy regressions as interface defects, especially around hints, guides, Time Attack, and replay challenge flows.
- Keep regression tests checking both missing translations and common mojibake fragments before Android release work resumes.

### v0.1.289 - Automate Copy Quality Gates
- Korean copy quality should be guarded at source level as well as targeted i18n tests because interface polish depends on every visible string staying readable.
- Keep this lightweight hygiene gate close to existing BOM/stale CSS checks so copy regressions are caught before visual QA.
### v0.1.290 - Hint Economy Should Stay Player-Friendly

- Internal hint states may split free allowance, spoon-spending continuation, and Time Attack tuning, but player-facing UI should present a single hint action.
- Explain the transition at the moment it matters: show remaining free hints first, then tell the player the next hint uses spoons.
- Avoid user-facing "paid hint" category language; use spoon economy language instead.
### v0.1.291 - Hint Button Presentation Rule

- The hint action should remain a single visible icon control. The UI may show remaining free hints and spoon-use explanations in surrounding copy, but the button itself should not expose internal free/extra/Time Attack labels.
- Keep the icon button accessible with an aria label and mobile-safe tap size.
