## v0.1.671 - Explicit Stage Lock Conditions

- Completed Step 27 by showing previous-stage puzzle completion and paid Pantry jar progress as separate status rows on every locked stage card.
- Each condition reports its own remaining count and uses distinct completed/incomplete styling, so players can see exactly which requirement is blocking progress.
- The condition calculation is covered by a functional test for both unmet and met states. The launch-integrity contract now protects the two-condition guidance.
- Step 28 behavior was intentionally not mixed into this patch: current spoon unlock costs and the existing unlock button remain until the next Step removes them.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Full candidate verification passed: 42 test files / 250 tests, 333-puzzle catalog and uniqueness gates, art and asset audits, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.670 - Shared Spoon Balance

- Completed Step 26 by adding a shared, safe-area-aware spoon balance chip to views that previously had no persistent currency display, including active puzzle and Time Attack play.
- The chip reuses the approved `spoon-token-v2` artwork and reads the latest saved balance on every shell redraw.
- Pantry and the Workshop home intentionally keep their existing dedicated spoon displays, avoiding duplicate balances on those screens.
- Added regression coverage for the shared renderer, placement condition, localization, fixed positioning, and non-blocking pointer behavior.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Candidate verification passed: 41 test files / 249 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, and HTTP probe. The combined runner encountered a first-navigation `networkidle` timeout after all earlier gates passed; isolated mobile QA then passed at 360x740, 390x844, 430x932, and 675x900.

## v0.1.669 - Daily Picture Completion Flow

- Completed Step 25 by ending a solved Daily Picture with its reveal, existing puzzle and Daily reward rows, and one OK action that returns directly to Spoon Run.
- Daily completion no longer offers Next Picture. Ordinary puzzle completions and replay completions retain their existing action rules.
- Once today's Daily Picture is complete, its Spoon Run card shows the completed state and has neither an enabled action nor a click handler.
- Added regression coverage for the Daily completion return path and completed-card interaction lock.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Candidate checks passed: 41 test files / 248 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, and HTTP probe. The combined runner encountered two non-product mobile-runner transients on separate attempts (a non-reproducing Time Attack paint assertion and a first-navigation `networkidle` timeout); isolated mobile QA then passed at 360x740, 390x844, 430x932, and 675x900.

## v0.1.668 - Reliable Progress Reset

- Completed Step 24 by reloading the app immediately after the confirmed progress reset, preventing stale in-memory puzzle, spoon, Pantry, and guide state from being redrawn after LocalStorage is cleared.
- The existing two-step settings confirmation remains in place. Resetting deletes only the active player's progress save; the active player identity and name remain available after reload.
- Added regression coverage for the reload contract and for preserving the active player while clearing completed puzzles and spoon balance.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Full candidate verification passed: 41 test files / 246 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.667 - Replay Daily-Limit Completion

- Completed Step 23 by replacing the final 3/3 replay completion's Next Picture action with a single Back to Earn Spoons action.
- The final rewarded replay now shows a dedicated come-back-tomorrow message and returns directly to the Spoon Run view; ordinary completions and replay completions with remaining rewards keep the existing Next Picture action.
- Exhaustion requires a successful reward and zero remaining daily slots, so hinted, duplicate, or otherwise ineligible replay completions cannot trigger the end-of-day state accidentally.
- Added regression coverage for rewarded-final, ineligible, remaining, and non-replay completion states.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Full candidate verification passed: 40 test files / 244 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.666 - Pantry Header Simplification

- Completed Step 22 by removing the duplicate Pantry jar-collection eyebrow above the existing Pantry title.
- Removed the retired Korean and English eyebrow keys instead of replacing them with another duplicate title, keeping the header future-proof for additional collectible types.
- Added a launch-integrity guard that blocks the retired `pantry.jar.eyebrow` render path from returning.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built.
- Full candidate verification passed: 40 test files / 243 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.665 - IAP Spoon Grant Rebalance

- Completed Step 21 by changing the repeatable US$0.99 support grant from 250 to 150 spoons and the US$2.99 Small Spoon Jar grant from 750 to 500 spoons; store prices and product IDs are unchanged.
- The 500-spoon jar remains a value step above three support packs (500 vs 450, about 11% bonus), while purchase-token duplicate protection and consumable behavior remain unchanged.
- Runtime config, Billing/store copy contracts, future real-device validation templates, and focused purchase/save regression tests now share the same 150/500 values. Historical 250-spoon real-device evidence remains preserved as a record of the earlier build.
- Android remains versionCode 33 / versionName 1.1.5; no AAB was requested or built. Play Console product descriptions must be updated to 150/500 before the next Android upload.
- Full candidate verification passed: 40 test files / 243 tests, 333-puzzle catalog and uniqueness gates, Billing contract, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.664 - Small Puzzle Hint Access

- Completed Step 20 by granting one starter hint to 5x5 puzzles and two starter hints to 8x8 puzzles; existing 10x10+ limits remain unchanged.
- After starter hints are exhausted, normal 5x5 hints cost 3 spoons and 8x8 hints cost 5 spoons, with the existing paid-use escalation retained.
- Small-puzzle hints still reveal exactly one cell, and focused tests cover allowance, reveal count, starter-to-spoon boundaries, and escalating costs.
- Full candidate verification passed: 40 test files / 242 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.663 - Puzzle Picker Mosaic Removal

- Completed Step 19 by removing the stage-art and fallback tile mosaics from unlocked and next-locked puzzle-picker shelves.
- Puzzle-picker shelves now contain only their header, independent collapse control, puzzle grid, and the unlock panel where applicable; stage-completion artwork remains unchanged.
- Removed the retired mosaic import, render helpers, preview CSS, and progress canvas CSS; mobile QA now fails if any retired mosaic container returns.
- Full candidate verification passed: 40 test files / 240 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, HTTP probe, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.662 - Per-Shelf Puzzle Picker Collapse

- Completed Step 18 by removing the global persisted Hide Completed control and replacing it with an independent 44px expand/collapse arrow in every unlocked shelf header.
- Completed shelves default closed, unfinished shelves default open, and explicit player choices remain in an in-memory override Map for the current app session only.
- Each toggle exposes translated shelf-specific labels, `aria-expanded`, and `aria-controls`; collapsed puzzle content is removed from interaction with the native `hidden` state.
- Full candidate verification passed: 40 test files / 239 tests, 333-puzzle catalog and uniqueness gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.661 - Canonical Shelf Names and Distinct Wooden Spoon

- Completed Step 17 by making every badge milestone display the canonical `shelves.*` name already used by the puzzle picker and shelf-completion overlay.
- Replaced the duplicated thirteenth first-shelf spoon with a centered horizontal wooden-spoon silhouette and distinct Korean/English title and image copy.
- Full candidate verification passed: 40 test files / 236 tests, 333-puzzle catalog and uniqueness gates, zero duplicate/repeated-title art findings, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.660 - Itemized Completion Spoon Rewards

- Completed Step 16 by showing puzzle completion, Daily bonus, and shelf completion spoons as separate positive reward rows instead of presenting a combined total.
- The completion flow now carries the exact savePuzzleState() reward result and the exact markShelfCompletedIfFirst() bonus into the completion banner; zero-value rows remain hidden.
- Daily completion copy no longer embeds a combined spoon total, and the shelf completion row receives a distinct warm-gold treatment.
- Full candidate verification passed: 40 test files / 234 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.659 - Centered Completion Action

- Completed Step 15 by converting the completion action area from the obsolete two-column layout to a single centered column capped at 320px.
- The completion scene still exposes only the existing Next Picture action; no navigation behavior changed.
- Mobile QA now measures one action button, its bounded width, and its horizontal center against the completion banner to prevent the half-width regression from returning.
- Full candidate verification passed: 40 test files / 233 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.658 - Late Pantry Economy and Badge Glow Verification

- Completed Step 14 by strengthening the paid price curve for the late Fruit, Oil, and Tea shelves while preserving the Pickle shelf's approved 25-135 range; the full 48-jar catalog now totals 3,310 spoons.
- Extracted the badge earned-state handoff into tested helpers: the newly earned badge ID is consumed once and only the matching earned slot receives the one-time gold glow class.
- The final Full Pantry badge keeps its permanent gold pulse, while the existing reduced-motion rule disables both animations for motion-sensitive players.
- Full candidate verification passed: 40 test files / 232 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.657 - Time Attack Reward Rebalance

- Completed Step 13 by reducing Time Attack base rewards from 15/25/38/55 to 10/18/30/45 spoons for 5x5, 8x8, 10x10, and 12x12 boards.
- The record-improvement bonus remains 12 spoons and the rewarded-run daily limit remains 3, preserving the mode's incentive while reducing its share of daily spoon income.
- Runtime fallback reward now matches the 8x8 baseline at 18 spoons; economy and save regression tests lock both the new table and accumulated balances.
- Full candidate verification passed: 39 test files / 228 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.656 - Time Attack Hint Restoration

- Completed Step 12 by placing the Time Attack hint control before the puzzle board so it remains immediately visible during the timed run.
- Time Attack now charges every hint in the configured `2 -> 4 -> 7` spoon sequence instead of inheriting normal-puzzle starter hints.
- The existing run result path continues to aggregate `hintsUsed` across completed rounds and the active round; focused regression coverage now locks both cost order and final result accounting.
- Candidate gates passed: 39 test files / 227 tests, 333-puzzle catalog and asset gates, production build, and Android release gate. Mobile QA separately passed at 360x740, 390x844, 430x932, and 675x900, including visible pre-board hint placement, the first 2-spoon charge, and one-use meter accounting.
## v0.1.655 - Spoon Run First-Visit Guide

- Completed Step 11 with a two-slide Pip introduction that explains the daily bonus picture and up to three clean-replay spoon rewards.
- The guide opens automatically on the first Spoon Run visit only, then records `spoonRunIntro` through the existing guide acknowledgement save flow.
- Added regression coverage for the registered guide steps, Pip speaker label, first-visit trigger, persisted acknowledgement, and Korean/English key parity.
- Full candidate verification passed: 38 test files / 225 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900, including the two-step Spoon Run first-visit guide.
## v0.1.654 - Spoon Run Replay Isolation

- Completed Step 10 by separating the explicit Spoon Run pick flag from general replay/challenge mode, so only a card deliberately selected from Spoon Run can claim the clean-replay spoon reward.
- Replay completion `Next Picture` remains inside the stable replay pool; after the final candidate it returns to the replay list in Spoon Run instead of entering the general unfinished-puzzle flow.
- Successful replay feedback now shows both the awarded `+1` spoon and the number of replay rewards remaining today.
- Full candidate verification passed: 38 test files / 223 tests, 333-puzzle catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.653 - Daily Spoon Run Completion Continuity

- Completed Step 9 by keeping Today's Picture completion inside Spoon Run: `Next Picture` now closes the Daily challenge and focuses the replay list instead of entering the general unfinished-puzzle flow.
- Daily completion feedback now reports the actual spoon amount awarded, with first-time normal puzzle reward and the once-per-date Daily bonus accounted for separately.
- Daily challenge state is cleared on picker, view, Workshop, and Time Attack exits so it cannot leak into another play mode.
- Date-specific completion remains independent from general puzzle completion; full candidate verification passes 38 test files / 223 tests, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.652 - Spoon Run Integrated View

- Added `spoonRun` as a first-class view and floating navigation destination using the approved `spoon-token-v2` economy icon.
- Moved Today's Picture and Replay Picks off the Workshop home into the focused Spoon Run view; the Workshop shortcut now replaces the former Time Attack shortcut.
- Preserved Time Attack in floating navigation and retained the existing Daily/Replay reward and selection flows.
- Updated responsive placement and mobile QA navigation helpers; `qa:candidate` passes 38 files / 222 tests plus 360x740, 390x844, 430x932, and 675x900.

## v0.1.651 - Workshop Time Attack Card Removal

- Removed the duplicate Time Attack teaser card and its dead renderer from the Workshop supporting-card stack.
- Kept Time Attack available through the existing Workshop/floating navigation icons and added a regression contract that forbids the duplicate teaser card.
- Updated mobile QA to require the teaser card to be absent while the current Time Attack navigation entry remains intact.
- Verification passed: 38 test files / 222 tests, catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.650 - Completion Action Simplification

- Removed the redundant Menu/Back action from both standard and replay completion banners; completion now presents only the `Next picture` action.
- Preserved floating navigation as the single route to other app destinations and added a source regression test for the one-button completion contract.
- Verification passed: 38 test files / 221 tests, catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.
## v0.1.649 - Replay Next-Picture Continuity

- Completion `Next picture` now stays inside the stable Daily replay-pick pool instead of falling through to the normal unfinished-puzzle selector.
- Replay navigation moves forward without wrapping; after the last candidate it closes the challenge and returns to the replay card on the Workshop hub.
- Verification passed: 38 test files / 220 tests, catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.648 - Daily Completion Isolation

- Added a local-calendar Daily completion date that is stored separately from general `completedPuzzleIds`; the Daily card now shows complete only when its saved date matches today.
- Daily entry now carries an explicit challenge context, starts from a fresh board even when the same picture was completed normally, and records completion only after that Daily run is solved.
- Kept normal first-completion rewards separate while allowing the Daily bonus once per date; tomorrow naturally returns the Daily card to incomplete.
- Verification passed: 38 test files / 218 tests, catalog and asset gates, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.641 - Badge Artwork Single-Surface Cleanup

- Removed the earned-badge shelf from the shared app shell, so collected badge artwork is no longer persistently shown on Puzzle, Album, Pantry, Time Attack, or Settings surfaces.
- Kept the Badge navigation destination, the Badge collection view, semantic text badge styles, and transient completion feedback intact.
- Added a source regression test that requires the Badge collection view to remain the only persistent badge-art surface.
- Verification passed: 38 test files / 205 tests, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.640 - Time Attack Paint Persistence Recovery

- Root cause confirmed: `renderPuzzleView()`'s inner `update(nextState, options)` parameter shadowed the outer render options, so `onPuzzleStateChange` never reached App Shell.
- Time Attack now passes its transient puzzle state through App Shell and Play Screen back into Puzzle View on each one-second timer redraw instead of recreating an empty board.
- Mobile QA now paints a Time Attack cell, waits beyond the timer redraw interval, and requires the same cell to remain filled before exiting to the unchanged regular puzzle.
- - Verification passed: 37 test files / 203 tests, production build, Android release gate, and mobile QA at 360x740, 390x844, 430x932, and 675x900. The mobile flow starts Time Attack, paints a cell, waits 1.2 seconds beyond the timer redraw, requires the cell to remain filled, then confirms regular-puzzle restoration.

## v0.1.639 - Pantry Shelf Progression and Completion Celebration

- Changed Pantry stage progress from individual paid-jar purchases to completed paid-jar shelves: all five paid jars in JAM, HONEY, HERB, or SPICE now contribute exactly one gate step.
- Mapped the five content packs and all 15 Season 0 shelves to the 0/1/2/3/4 completed-Pantry-shelf gates while preserving puzzle completion and spoon unlock costs as separate requirements.
- Added a one-time last-jar celebration after the refreshed Pantry renders: gold shelf-board sweep, six staggered jar bounces, and eight self-cleaning sparkles, with reduced-motion support.
- Removed paid jars from the legacy Pantry story-goal counter so unrelated legacy decoration progress cannot unlock jar-shelf stage gates.
- Automated verification passed: 37 test files / 202 tests, 333-puzzle catalog and asset checks, production build, Android release gate, and mobile layouts at 360x740, 390x844, 430x932, and 675x900 via `npm run qa:candidate`. The shelf-completion transition is unit-tested; visual observation of the purchase-triggered animation remains pending because the local browser connection was blocked by the OneDrive ACL.

## v0.1.638 - Pantry Spoon Token Consistency

- Replaced platform spoon emoji rendering in Pantry shelf prices, the Pantry balance, and the jar purchase button with the approved `spoon-token-v2.png` economy asset.
- Added a shared Pantry spoon-label renderer with explicit asset identity metadata and responsive icon sizing.
- Verification passed: 37 test files / 202 tests, production build, Android release gate, and mobile layouts at 360x740, 390x844, 430x932, and 675x900 via `npm run qa:candidate`.

## v0.1.637 - Premium Pantry Jar Art Collection

- Rebuilt all 24 Pantry jars as individually art-directed raster collectibles with transparent WebP runtime assets: distinct silhouettes, fabrics, ribbons, golden spoon charms, illustrated labels, glass/material detail, and escalating rarity finishes.
- Uses CSS only for the four category-specific shelf scenes and runtime states: wood grain, progress medallions, locked/equipped treatments, and a full-shelf completion sheen.
- Kept the v0.1.636 jar economy, purchase, equip, stage-gate, Spoon Store, and save behavior unchanged. Existing beta decoration/spoon migration remains intentionally out of scope.
- Visible/package version is v0.1.637. Android remains versionCode 33 / versionName 1.1.5; no AAB is built or authorized for this visual-quality pass.
- Verification passed: 24/24 art mapping and alpha checks; 36 test files / 201 tests; production build; Android release gate; and mobile layout at 360x740, 390x844, 430x932, and 675x900 via `npm run qa:candidate`.

## v0.1.636 - CSS Pantry Jar Collection

- Replaced the legacy background-room, overlay-art, slot-filter, and decoration-card Pantry with four CSS-only jar shelves: Jam, Honey, Herbs, and Spices.
- Added 24 data-driven jars with starter/common/rare/special/luxury pricing, glass/lid/fill variables, and five CSS fill textures. Each shelf owns six jars and displays one equipped jar at a time.
- Added independent `ownedJarIds` and `equippedJars` save state. Four starter jars are granted and equipped idempotently; only paid jar purchases append one Pantry room step for existing stage gates.
- Jar purchases validate balance and ownership, deduct spoons, grant the jar, update stage progress, and persist once. The bottom sheet supports purchase, equip, insufficient-balance routing, backdrop close, Escape close, safe-area padding, and focus.
- Workshop Pantry notification now tracks unowned jars instead of retired decorations. The Spoon Store remains below the shelves.
- Verification state: automated verified; real-device review remains pending. `npm run qa:candidate` passed 35 test files / 199 tests, asset/Billing/build/Android release gates, and mobile runtime QA at 360x740, 390x844, 430x932, and 675x900.
- Visible/package version is v0.1.636. Android remains versionCode 33 / versionName 1.1.5; no AAB is built or authorized in this UI replacement.

## v0.1.635 - Time Attack Exit State Recovery

- Root cause confirmed: starting Time Attack replaced `activePuzzle` with a generated run puzzle, while close/navigation/completion/timeout paths cleared only parts of the Time Attack state and never restored the regular puzzle.
- Added `preTimeAttackPuzzle` and one `clearTimeAttackSession()` path that clears the run, seed, timer start, round index, hint count, puzzle state, and restores the original regular puzzle.
- The X/back close path now returns directly to the Puzzle Workshop. Defensive navigation cleanup prevents a partially active run from leaking into any other view. Normal completion and timeout also restore the original puzzle while preserving the Time Attack result screen.
- Added source regression tests and a four-width runtime flow: remember regular Play Now target, start Time Attack, exit, require the same regular target, open it, require `data-view="puzzle"`, and reject Time Attack UI leakage.
- Verification state: automated verified; real-device confirmation remains pending. Focused Time Attack/save/board tests passed 33/33, and `npm run qa:candidate` passed 34 test files / 195 tests plus the 360x740, 390x844, 430x932, and 675x900 runtime flow from Time Attack exit into the unchanged regular puzzle.
- Visible/package version is v0.1.635. Android remains versionCode 33 / versionName 1.1.5; no AAB is built or authorized in this recovery slice.

## v0.1.634 - Workshop Supporting Cards Recovery

- Root cause confirmed: `renderDailyCard`, `renderTimeAttackTeaserCard`, and `renderReplayPicksCard` remained implemented with CSS/i18n support, but their `createShell()` call sites were removed during the full-screen Workshop redesign.
- Restored all three entries below `renderPuzzleHub()`. Replay Picks uses completed unlocked puzzles, the saved daily count/limit, and enters the existing replay challenge path.
- Added `.puzzle-hub-cards` as an inset, width-bounded wrapper below the full-screen scene with 120 px plus safe-area bottom clearance.
- Added focused regression coverage plus four-width runtime assertions for card presence, ordering below the scene, horizontal containment, bottom clearance, and the returning-player Replay Picks state.
- Verification state: automated verified; real-device verification pending. Focused tests passed 12/12, and the complete candidate gate passed 33 test files / 193 tests, launch integrity, hygiene/assets/store/Billing/privacy checks, production build, and runtime geometry/interaction QA at 360x740, 390x844, 430x932, and 675x900. The runtime checks require Daily and Time Attack cards for a fresh profile, Replay Picks for a seeded returning profile, all cards below the scene, horizontal containment, 120 px bottom clearance, and minimum action target sizes. Browser-plugin inspection was unavailable because its Windows sandbox process failed on the OneDrive ACL.
- Visible/package version is v0.1.634. Android remains versionCode 33 / versionName 1.1.5; no AAB is built or authorized in this recovery slice.

## Release Safety Update - 2026-07-28 Clean-Commit AAB Gate

- Added `scripts/release_commit_gate.js` and `npm run qa:release:commit`.
- A signed AAB is now blocked unless the worktree is completely clean, package/UI versions match, the same versions exist at HEAD, `docs/CONTEXT.md` contains the release version, the HEAD subject names that version, and committed Android versionCode/versionName are present.
- `scripts/build_android_signed_release_bundle.ps1` runs this gate both before QA and again after all QA gates. It deletes the previous exact `app-release.aab` only after both commit checks pass, preventing a stale bundle from being mistaken for a new build.
- Enforcement verified on the current intentionally dirty v0.1.633 worktree: standalone gate exit 1; signed-build exit 1 before QA/build/signing; existing AAB SHA-256 remained `FD377B40179B98F4507B3D564B7BE6BD50A29089E0263FA099095775000B9C05`.
- Current release state remains blocked until all intended v0.1.633 files are reviewed and committed. This gate does not claim the three outstanding real-device UX defects are resolved.

## v0.1.633 - Android Touch Paint Re-render Recovery

- Reproduced the real failure sequence in browser QA at all four review widths: touch `pointerdown` → `pointerup` painted the cell, the state update re-rendered the board, then Android's delayed `click` with `detail: 0` toggled the newly rendered cell back to empty.
- Root cause: `suppressPointerClickUntil` lived inside `renderCells()`. The successful pointer paint triggered a re-render, so the replacement board reset suppression to `0` before the synthetic click arrived.
- Moved the suppression timestamp to module lifetime so the replacement board consumes the delayed click. The 300 ms window and keyboard/click fallback behavior remain otherwise unchanged.
- Mobile QA now executes the full Android-style event sequence against tap-mode focused play and requires the cell to remain filled after the replacement board receives the synthetic click.
- Play Now status was inspected without another style change: the final Workshop rule computes a minimum 96x96 target, and the existing mobile geometry gate requires at least 96 px.
- Verification state: automated verified; real-device verification pending. The pre-fix Android sequence failed at all four widths (`filled` → synthetic click → `empty`). After moving suppression to module lifetime, `tests/boardView.test.js` passed 10/10 and `npm run qa:mobile` passed the same sequence plus the 96 px Play Now geometry gate at 360x740, 390x844, 430x932, and 675x900.
- Visible/package version is v0.1.633. The signed Android AAB was built as versionCode 33 / versionName 1.1.5 at `android/app/build/outputs/bundle/release/app-release.aab` (16,862,424 bytes; SHA-256 `FD377B40179B98F4507B3D564B7BE6BD50A29089E0263FA099095775000B9C05`; `jar verified`). Full candidate QA passed earlier on the same source state; a later signed-script rerun hit only the known local Playwright `networkidle` harness timeout, after which the already-verified source was synced and signed directly.

## v0.1.632 - Empty Album Play Now Recovery

- Root cause confirmed: the empty Album action received `() => onSelectView("puzzle")`, which only returned to the Workshop home and explicitly set `playOpen = false`.
- Connected the empty Album action to the existing `onNextPuzzle` / `selectNextPuzzle()` path. That path selects the first unlocked unfinished puzzle and delegates to `selectPuzzle()`, which sets the puzzle active and opens focused play.
- Mobile QA now starts with a genuinely empty Album, presses its only action, requires the play screen and board to replace the Album, then returns to the Workshop home before continuing the existing suite.
- Verification state: automated verified; real-device verification pending. `tests/guideDialog.test.js` passed 5/5. `npm run qa:mobile` passed the empty Album → Play Now → play screen/board → Workshop return flow at 360x740, 390x844, 430x932, and 675x900.
- Visible/package version is v0.1.632. Android remains versionCode 32 / versionName 1.1.4; no AAB was built.

## v0.1.631 - Badge Guide Trigger Recovery

- Root cause confirmed in `src/game/save.js`: `"map"` was missing from `GUIDE_IDS`, so both `hasSeenGuide("map")` and `markGuideSeen("map")` normalized to `"puzzle"`. A user who had seen the puzzle guide was therefore incorrectly treated as having seen the Badge guide.
- Added `"map"` as an independent persisted guide ID. The existing `appShell.js` trigger and `renderGuideDialog(activeGuide, ...)` path were already connected and did not require another render call.
- Save tests now prove that seeing the puzzle/time-attack guides does not mark the map guide seen, and that map acknowledgement persists independently.
- Mobile QA now enters the Map after the puzzle guide has been acknowledged, requires `.guide-dialog--map` to open, validates Pip and badge copy, closes it, and then continues Map layout checks.
- Verification state: automated verified; real-device verification pending. `tests/save.test.js` and `tests/guideDialog.test.js` passed 25/25. `npm run qa:mobile` passed the full Badge guide entry/dismissal flow at 360x740, 390x844, 430x932, and 675x900; an initial run stopped before product assertions on the existing 2-second intro-detach timeout, and the immediate retry completed successfully.
- Visible/package version is v0.1.631. Android remains versionCode 32 / versionName 1.1.4; no AAB was built.

## v0.1.630 - Guide Name Tag Visibility Candidate

- Fixed the actual guide stacking conflict: `.guide-dialog__art` no longer creates a lower stacking context beneath the dialogue bubble, while `.guide-dialog__name-tag` is explicitly layered above the bubble.
- The guide art now uses `overflow: visible`, so the name tag can cross the character/dialogue seam without being clipped.
- Mobile visual QA now requires the puzzle, map, and Time Attack speaker name tag to have text and measurable geometry, remain inside the viewport, use visible overflow, and be the topmost element at its center point.
- Updated the stale Time Attack first-step QA assertion to match the current speaker introduction copy.
- Verification state: automated verified; real-device verification pending. `npm run qa:mobile` passed at 360x740, 390x844, 430x932, and 675x900, including topmost-element checks for the name tag; `tests/guideDialog.test.js` passed 4/4.
- Visible/package version is v0.1.630. Android remains versionCode 32 / versionName 1.1.4; no AAB was built.

## v0.1.629 - Workshop Greeting Layout Candidate

- Reproduced the v0.1.626 Workshop issue from the supplied device screenshot: Pip and the greeting read as separate elements, the bubble used a plain white card treatment, and the first four destination icons sat too close to the greeting zone.
- Updated the actual final `.hub-greeting-*` rules instead of appending another override: Pip-to-bubble gap is 4px, padding is compact, and the bubble now uses the game paper/ink border, asymmetric speech-corner radius, and tactile shadow.
- Moved Picture List and Album from 22% to 28% scene height, and Time Attack and Pantry from 38% to 44%. Badge and Play Now positions were intentionally left unchanged.
- Strengthened mobile QA to measure final computed Pip/bubble gap, themed bubble border/background/radius/shadow, scene containment, and that all four requested destinations start below the greeting group.
- Verification state: **Automated verified; device verification pending.** Workshop measurements passed at 360x740 / 390x844 / 430x932 / 675x900. The mobile command still exits nonzero only for the separately tracked stale Time Attack guide-copy assertion.
- Visible/package version is v0.1.629. Android remains versionCode 32 / versionName 1.1.4; no AAB was built.
- Pantry shop remains outside this issue.

## v0.1.628 - Settings Radio Collision Candidate

- Adopted `docs/VERIFICATION_PROTOCOL.md`: issues move through Reproduced, Candidate fix, Automated verified, Device verified, and only then Resolved. Source presence or code review alone can no longer be reported as a fix.
- Confirmed the recurring language-radio collision was a cascade failure: the later `.settings-language-group > button` rule at the end of the active settings block overwrote the earlier 30px left padding with `padding: 10px 4px !important`.
- Replaced the actual winning shorthand with `padding: 8px 4px 8px 34px !important`; no new final override was appended.
- Mobile QA now measures computed left padding, rendered radio marker dimensions, and the remaining marker-to-text gap at 360x740 / 390x844 / 430x932 / 675x900. All four settings measurements passed.
- Verification state: **Automated verified; device verification pending.** The full mobile command still exits nonzero only for the separately tracked stale Time Attack guide-copy assertion at all four widths.
- Visible/package version is v0.1.628. Android remains versionCode 32 / versionName 1.1.4; no AAB was built for this single-issue candidate.
- Pantry shop work remains explicitly excluded from this issue.

## v0.1.627 - Repeatable Cozy Support Purchase Recovery

- Corrected the US$0.99 `pip_cozy_support` flow to match its Google Play consumable configuration: the purchase action remains available after a completed purchase and each new transaction grants 250 spoons.
- Replaced the permanent `cozyPassPurchased` ownership gate with the shared bounded purchase-token ledger, so duplicate callbacks cannot grant twice while distinct purchases can each grant once.
- Removed purchase restore and its owned-state UI/copy because a consumed repeatable top-up is not a restorable permanent entitlement.
- Real-device evidence from v0.1.626 is accepted as passed: Google Play checkout completed and exactly 250 spoons were granted. The product owner waived further paid repeat transactions; v0.1.627 automated purchase-token coverage is the remaining repeat/duplicate evidence.
- Visible/package version is v0.1.627. Android upload numbering remains versionCode 32 / versionName 1.1.4 until the next requested AAB build.
- Scope is intentionally limited to Billing recovery; reported puzzle coloring and other UX issues remain under separate review.
- Verification: 32 test files / 189 tests, Billing release check, source hygiene, assets/store/privacy checks, production build, and Android release gate passed. Full `qa:candidate` reached mobile QA; the first run timed out at `networkidle`, and the direct retry exposed the pre-existing Time Attack guide-copy assertion now under separate UX review.

## v0.1.626 - Real-Device Guide and Board Release Candidate

- Finalized the requested guide name-tag metrics, artwork positioning, dialogue overlap, and marked-cell centering as the last CSS override block.
- Carries forward the v0.1.625 Play Now resize/pulse, Workshop Pip scale, localized guide introductions, Billing consumable flags, and Android touch suppression repairs.
- Visible/package version is v0.1.626. Android internal-test upload numbering is versionCode 32 / versionName 1.1.4, above the tested vc31 / 1.1.3 build.
- Verification: 32 test files / 191 tests, catalog, uniqueness, art, assets, store, Billing wiring, privacy, production build, and Android vc32 release gate passed. The final mobile Playwright pass reached HTTP 200 but timed out at `page.goto(..., networkidle)` before product assertions, matching the current local browser-harness issue; signed release completed with `jar verified`. The sole release-folder AAB is `android/app/build/outputs/bundle/release/app-release.aab` (16,862,997 bytes; SHA-256 `A4270771AB2006FFA411460AFD2DAD3DE2520938AC58DCB1E105FB28810F7F80`).
## v0.1.625 - Play Now Reach and First-Entry Cue

- Enlarged the fixed Play Now trigger from 56px to 80px, its artwork from 44px to 60px, and raised it from +16px to +32px above the safe-area baseline.
- Added a warm pulse cue only while the Puzzle guide is unseen; reduced-motion users receive no repeating animation.
- Added a source-level regression guard for the unseen-guide condition and the final CSS size/position contract.
- Enlarged the Workshop home greeting Pip from the previous 28-40px compact override to a responsive 90-120px conversation scale while preserving the higher-specificity override and automatic aspect ratio.
- Reworked the Puzzle, Time Attack, and Badge Map guide presentation with localized character name tags, overlapping dialogue cards, larger Pip artwork, and new first-step introductions; Pantry neighbor guides retain their separate side-by-side layout.
- Centered the marked-cell × glyph and safe-suggestion state with a final grid/place-items override so Android rendering no longer shifts the symbol toward the upper-right corner.
- Android upload numbering remains versionCode 31 / versionName 1.1.3. No AAB is built for this incremental UI slice while additional real-device feedback is still being collected.
- Verification: `tests/floatingNav.test.js` plus `tests/save.test.js` passed (23 tests), JavaScript syntax checks passed, and the production build completed successfully.
- Guide follow-up verification: guide/i18n/home regression suites passed (21 tests), both locale modules and guide code passed syntax checks, and the production build completed successfully.
- Marked-cell follow-up verification: `tests/boardView.test.js` passed all 9 tests and the production build completed successfully.
## v0.1.624 - Real-Device Settings and Guide Follow-ups

- Reserved 30px of left padding in each compact language option so the radio control no longer collides with System, English, or Korean labels on a real Android device.
- Applied the shared content-panel spacing contract to Pantry and Time Attack: 14px outer padding, plus 10px between the Pantry room and its following story content.
- Recast the Time Attack first-run guide as a Mr. Park neighbor conversation with new clock, hint, and speed-challenge copy in English and Korean.
- Added a three-step Pip guide for the Badge Map, automatic first-entry display, and a dedicated Badge guide replay button with Map artwork in Settings.
- Raised the fixed floating navigation control 16px above its existing safe-area offset so it no longer sits against the gesture/navigation edge on real devices.
- Restored the Workshop home greeting Pip to its intended compact 28-40px range by making the higher-specificity width and auto-height declarations override the shared 160px greeting class; added regression coverage for this cascade.
- This real-device feedback batch is now frozen for the next signed internal-test AAB.
- Android upload numbering is prepared at versionCode 31 / versionName 1.1.3 because Play internal testing already accepted versionCode 30 / versionName 1.1.2.
- Verification: the focused tests and candidate suite cover 31 files / 187 tests, production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900. The existing local-only signing environment file under `99. Key Paths/Android/Pip's Picture Pantry` was rediscovered from repository release documentation; its secret values remain outside the repo and are never printed.
- Internal-test AAB: upload-key-signed v0.1.624 at Android versionCode 31 / versionName 1.1.3 after production build, Capacitor sync, and `jarsigner` verification. Sole release-folder AAB: `pips-picture-pantry-v0.1.624-vc31-internal.aab`; size 16,862,539 bytes; SHA-256 `B8A38FCC8E8160F48117BEEFC5FFE313CA9E235D7C867C5149817ED824724334`. This is for Play internal-test Billing evidence only; production remains blocked on both real-device purchase records.
## v0.1.623 - Android Cell Input, Billing, and Pip Greeting Scale

- Suppress every synthesized click arriving within 300ms after a pointer paint commit, including Android clicks with `event.detail === 0`, so one touch no longer paints and immediately toggles the same cell back.
- Added `isConsumable: true` to the Cozy Support Pack native purchase call as required by the current Android Billing integration.
- Increased the Workshop greeting Pip artwork from 80px to 160px while retaining the connected speech-bubble structure; the non-interactive greeting layer passes pointer input through to scene destinations beneath it.
- Verification: focused board/Billing/home tests passed (19 tests), and `npm run qa:candidate` passed (31 test files / 184 tests; production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900). The first mobile run exposed greeting pointer interception; `pointer-events: none` corrected it before the clean rerun.
- Internal-test AAB: upload-key-signed v0.1.623 at Android versionCode 30 / versionName 1.1.2; Capacitor sync and jarsigner verification passed. Only `pips-picture-pantry-v0.1.623-vc30-internal.aab` remains in the release folder. Size: 16,862,278 bytes; SHA-256: `0794D7A3935DC43743BC1FEA97B23204BE815F0FA7D56ADDE5750F3D21AF6BD6`.

## v0.1.622 - Guide Alignment, Greeting Bubble, and Billing Flag

- Centered guide overlays with safe-area-aware vertical padding.
- Connected the Workshop Pip greeting to explicit wrap, portrait, and speech-bubble styles while retaining the existing scene selectors.
- Kept the Cozy Support Pack non-consumable and restorable, while the repeatable Small Spoon Jar remains the only purchase using `isConsumable: true`.
- Verification: `npm run qa:candidate` passed (31 test files / 184 tests; Billing, production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900 included). Real-device Billing purchase/restore and repeat-purchase evidence remains pending.
- Internal-test AAB: upload-key-signed v0.1.622 build created at Android versionCode 30 / versionName 1.1.2 after candidate QA, live privacy verification, the final Billing contract correction, production build, Capacitor sync, and jarsigner verification. SHA-256: 01B19C3AB7304655D0C0001EF565246C3646D075781D0BBDD309FED656D18A65. Use it only for Play internal-test Billing evidence; production submission remains blocked on the real-device records.
## v0.1.621 - Daily Pip Greeting and Single Cell Input

- Added a short Pip speech bubble greeting on the Workshop home that rotates once per local calendar day across seven localized messages.
- Replaced the zero-delay click guard after pointer painting with a bounded synthetic-click guard, so one touch or mouse press changes a puzzle cell only once while keyboard activation remains available.
- Added regression coverage for delayed pointer clicks.
- Verification: `npm run qa:candidate` passed (31 test files / 184 tests; catalog, uniqueness, art, launch, hygiene, assets, store, Billing, privacy, production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900).

## v0.1.619 - Single-Scene Onboarding and Puzzle Controls

- Rebuilt standard Pip guides as one mint scene with Pip grounded in the backdrop and a single floating dialogue card; story-neighbour conversations retain their two-character layout.
- Restored the approved raster Fill, Blank, and Undo artwork at every board size, including the previous 5x5 fallback that hid those icons, and aligned guide action chips to the same vertical rhythm.
- Verification: `npm run qa:candidate` passed (182 tests; mobile QA at 360x740, 390x844, 430x932, and 675x900).

## v0.1.618 - Workshop labels and input containment

- Workshop home: placed a small Pip beside the greeting, restored readable labels beneath destination artwork, and converted the Pantry novelty marker to a nonverbal dot.
- Workshop CTA: removed the opaque button shell so the paint-tool art and label sit directly in the room.
- Settings: constrained the three language choices so narrow Android widths cannot overlap.
- QA: updated the home visual contract so visible labels are required.
- Verification: `npm run qa:candidate` passed (182 tests, four mobile viewports); the fallback candidate server port is now forwarded to visual QA.
pm run qa:candidate passed (182 tests, four mobile viewports); the fallback candidate server port is now forwarded to visual QA.

## v0.1.616 - Final Approval Candidate Clarity
- Added the missing Pantry-decoration hint beneath the locked-stage requirement so the next action is explicit.
- Renamed and structurally separated the primary Puzzle CTA from its picture icon: Solve now / Play Now.
- Added a one-time shelf-completion burst and badge-earned line to the existing mounted completion overlay; this avoids trying to animate an unmounted Puzzle-list mosaic.
- Verification: focused release-clarity tests, mobile QA, and the full candidate gate passed. An upload-key-signed internal-test AAB was rebuilt at Android versionCode 28 / versionName 1.1.0; it is for real-device Billing evidence only, not production submission.
## v0.1.617 - Device-first Onboarding and Workshop Clarity
- Rebalanced full-screen Pip dialogue into a deliberate 40/60 character-and-card composition for tall Android devices, with safe scrolling inside the dialogue half.
- Tightened the three language buttons, added a short friendly Workshop greeting, visible scene-destination progress badges, and a larger circular play action.
- Added an actionable empty/progress hint to the Badge Shelf so a new player understands how badges arrive.
- Verification: `npm run qa:candidate` passed ? 30 test files / 182 tests, catalog, art, hygiene, store, Billing configuration, build, Android release gate, and mobile QA at 360?740 / 390?844 / 430?932 / 675?900. The only remaining release evidence is real-device Play Billing purchase/restore and repeat-purchase.
- Internal-test AAB: upload-key-signed v0.1.617 build created at Android versionCode 29 / versionName 1.1.1 after standard release QA and Capacitor sync. It intentionally skips the final Billing-evidence gate; use it only for Play internal-test Billing evidence. Any later production upload must increment Android versionCode again.

## v0.1.615 - Earned Badge Lightness
- Reframed earned badges as lightweight, transparent achievement tokens rather than a separate report-like card.
- Kept the approved badge art and accessible earned-label copy intact while removing the opaque shelf surface that fought the game background.
- Verification: source hygiene, responsive mobile geometry, build, and the targeted visual contract pass.
## v0.1.614 - Pantry Slot Switching
- Tapping a room slot now brings its matching shop choices into view, so owned decorations and new purchases can be swapped without hunting below the room.
- The persistent slot model remains explicit: an item changes only within its matching room location, while purchase still equips it immediately.
- Verification: four-width mobile visual QA, Pantry overlay contracts, save behavior, and source hygiene pass.

## v0.1.613 - Workshop Navigation Hierarchy
- Rebuilt the Puzzle Room home hierarchy: one large primary play action, five anchored destination icons, and a compact top-right settings/currency control group.
- Replaced the duplicated primary puzzle icon with the approved fill-control artwork, keeping the picture list icon distinct.
- Updated mobile visual QA to enforce the new five-destination scene, compact settings target, no collisions, and the distinct primary play art.

## v0.1.612 - Clear Stage Gate
- Simplified Pantry-gated stage copy to describe the actual action: decorate the Pantry, then continue.
- Removed the misleading story requirement wording and kept the unlock requirement compact at every supported width.

## v0.1.611 - Pantry Overlay Matte Repair

- Reprocessed all 25 master-coordinate Pantry overlays after detecting residual chroma-magenta pixels from generated source mattes.
- The normalization pipeline now removes matte pixels both before cropping and after LANCZOS resizing, preventing semi-transparent purple edge halos from leaking onto the room background.
- Verified every overlay remains 1024x1536 and contains zero visible magenta-matte pixels.
## v0.1.610 - Pantry Room v2 Master Overlay Pipeline

- Replaced the v1 room path that visually placed independent shop thumbnails over a background with a master-derived room base plus 25 transparent full-canvas overlays.
- The active `sunlit-v2` base is an empty 1024x1536 Pantry room. Counter (6), window (5), shelf (5), floor (4), and back-wall (5) items now render only through their approved perspective-safe overlay counterpart.
- The room no longer relies on responsive per-item CSS coordinates: each overlay preserves its canonical master coordinate system at every viewport, while the original catalog art remains shop-only.
- Added asset-manifest approval records and a unit contract requiring all 25 purchasable decorations to resolve to a v2 overlay. Base/overlay dimension and alpha checks pass locally.
- Verification: 178 unit tests, 201-asset manifest QA, production build, Android release gate, four-width mobile QA, and the full candidate gate pass. The 64-frame v0.1.610 visual-review pack was regenerated, including the Pantry room/shop state. Real-device Billing purchase/restore and repeat-purchase evidence remain external release work.
## v0.1.609 - Large Board Guide Boundaries

- Added tactile board separators only where they improve play: no divider on 5x5, one centered vertical/horizontal boundary on 8x8 and 10x10, and 4-cell boundaries on 12x12.
- The guide boundaries use the existing cell frame rather than an overlay, so they remain aligned with drag painting, cursor selection, completed-line guidance, and X marks at every mobile size.
- Added a board helper unit test and extended the 12x12 mobile visual contract to verify both separator directions and their exact cell-boundary alignment.

## v0.1.608 - Reachable Progress and Pantry Switching

- Added the missing earned-badge shelf layout so stage badges render at controlled, responsive dimensions instead of their source-image size.
- The puzzle list now reveals exactly the next locked shelf after its predecessor is complete, reusing the existing cost, pantry-progress, and open-stage controls rather than ending the visible route.
- Pantry offers now say `Replace` when a purchasable item will replace the current decoration in that room slot; owned items remain separately reachable for re-equipping.
- Verification: full qa:candidate passes: 175 tests, catalog and art audits, source hygiene, 174-asset manifest, store checks, billing configuration, production build, Android release gate, and mobile visual QA at 360x740 / 390x844 / 430x932 / 675x900. Real-device Billing evidence remains external.
## v0.1.607 - Core Play-Flow Repairs

- Time Attack now starts every round from a fresh transient board, advances through all three rounds without reading or overwriting normal puzzle progress, and returns to its own results/records path only after the run ends.
- Repaired the guide overlay's responsive structure, removed the stale settings corner pseudo-artifact, and made Clock Grandpa use the dedicated character portrait instead of the duplicate-headed sprite sheet.
- Restored decorating-room control: equipped and owned pieces stay reachable first in the shop list, and an owned story item can be placed again directly from Pip's request.
- Puzzle play now labels its existing header return action as `Menu`; no floating navigation is layered over a live board.
- Verification: 175 automated tests and mobile visual QA at 360x740, 390x844, 430x932, and 675x900 pass. Full candidate verification is next. Real-device Billing evidence remains external.
## v0.1.606 - Destination-Specific Screen Ownership

- Removed the shared `핍의 퍼즐방` / app-title header from every non-play destination. Album, stage map, decorating room, Time Attack, and settings now own only their own screen content instead of inheriting the Workshop name.
- Kept the dedicated puzzle-play HUD separate: it names the actual puzzle being solved rather than branding every screen as the Workshop.
- Extended four-width mobile QA to fail whenever the retired `.top-bar` reappears after navigating to album, map, decorating room, or Time Attack.
- Next: complete the full Workshop composition pass (dominant next-puzzle affordance, meaningful cutout hierarchy, and furnished-room progression) without reintroducing global chrome.
## v0.1.605 - Workshop Cutout Scale Correction

- Repacked only the v3 runtime WebP files against their alpha bounds. The source PNG archives remain intact; the app now spends its 76px destination target on the visible illustration rather than transparent canvas margin.
- This directly protects the Workshop hierarchy: the primary Play action remains largest, while Puzzle/Album/Pantry/Clock Grandpa/Badge/Settings are discoverable cutouts instead of tiny marks in a large hit area.
- Next: rerun the four-width mobile check and visual review pack before requesting a new player-facing visual pass.
## v0.1.604 - Workshop Cutout Art Replacement

- Replaced the Workshop navigation source art with a new v3 set whose corners are verified transparent and whose white outline follows each object rather than forming a CSS plate. The six destinations now use one coherent native cutout system: puzzle card, album, pantry jar, Clock Grandpa pocket watch, badge map, and settings gear.
- Routed the v3 IDs through manifest, runtime allowlist, shared floating navigation, and four-width visual QA expectations together. Removed the last unused puzzle-control import from the navigation route.
- Recorded the Pantry room-art pipeline as a separate art-production contract: complete furnished master scene first, then a clean room base and matching alpha overlays. Current room coordinates remain intentionally frozen until that input exists.
- Next: inspect the v3 artwork in the full visual review pack before any screen-level geometry changes; follow it with the full candidate gate. Real-device Billing evidence remains the only external release blocker.
## v0.1.603 - UI Rework v2 Integration

- Adopted the integrated UI-rework contract: the Workshop keeps direct cutout destination art and one primary play action, while Time Attack and all non-play destinations share a quiet warm surface.
- Added reduced-motion-safe breathing/pulse cues without adding new text or card frames. The scene motion is clipped within the Workshop so it cannot increase document overflow.
- Kept the Pantry slot geometry frozen. A finished furnished-room master plus per-slot transparent overlays is required before any further placement-art work; current product thumbnails will not be coordinate-tuned into the room.
- Unified the compact, icon-only shared return trigger and removed a stale puzzle-control import from that route.
- Kept the primary Workshop action stationary while its shadow pulses: this preserves its invitation cue without blocking real pointer interaction or the complete 64-frame visual review flow.
- Verification: 175 tests, source hygiene, asset manifest QA (174 assets), mobile visual QA at 360x740 / 390x844 / 430x932 / 675x900, production build, Android release gate, and the full candidate gate pass. Only the two real-device Billing evidence records remain external release blockers.
## v0.1.602 - Unified Settings Navigation Art

- Routed the shared floating navigation settings destination through the same approved Workshop sticker artwork as the home scene.
- This removes the last cross-screen mismatch where settings still used the compact puzzle-control glyph while every other destination used the new navigation system.
- Verification: source hygiene, asset-manifest, mobile visual QA, and production build are pending for this isolated follow-up.

## v0.1.601 - Workshop Sticker Navigation

- Replaced the six Workshop navigation illustrations with a coherent transparent sticker set: puzzle notebook, completed-picture album, Clock Grandpa pocket watch, Pantry jar, achievement map, and settings gear.
- Rebuilt the scene hierarchy around physical workshop anchors and one large lower-right Play action. Destination controls now stay clear of Pip and his notebook instead of reading as a flat six-card menu.
- Archived high-resolution alpha sources alongside optimized 512px WebP runtime copies; no chroma-key source is shipped.
- Verification: asset manifest validation and four-width mobile visual QA passed.

## v0.1.600 - Screen-Aware Navigation and Time Attack Entry

- Added an explicit active-view marker to the app shell so each destination can own its surface without leaking home composition styles.
- Time Attack now opens without the generic header and presents Clock Grandpa as a centered challenge entry; the run ladder and start action remain unchanged.
- Reworked the shared return picker into a compact icon-only control with a labeled expanded destination panel, preserving accessibility labels and readable destination names.
- Next: finish the Pantry installation-art pipeline only after master furnished-room artwork and per-slot transparent overlays are available; do not solve those scene problems with more CSS coordinates.

## v0.1.599 - Workshop Cutout Navigation Foundation

- Started the UI rework v2 from the player-facing home: destination artwork now renders as glow-backed sticker cutouts instead of a second ring/card frame, while the Workshop background and primary play action receive gentle motion with reduced-motion support.
- This is intentionally a visual-foundation slice only. The Pantry furnishing pipeline is deferred until installed-scene art and placement metadata are authored; no attempt is made to force current product thumbnails into room coordinates.
- Next: add explicit `data-view` routing for warm sub-screen composition, rebuild the Time Attack entry without the generic header, then create the Pantry master-room asset pipeline.
## v0.1.598 - Puzzle Room icon hierarchy

- Reset the legacy two-column icon grid inside each workshop destination, so the hidden accessibility label no longer consumes half of the ring. Approved destination art now uses the full button area instead of rendering as a thin, hard-to-find strip.
- Mobile QA now enforces six 76px+ scene targets, large 72px+ rendered art, and a 96px+ primary Play target across all four required widths. This protects the deliberate visual hierarchy from future CSS cascade regressions.
- Verification: `npm run qa:mobile`, 175 tests, and source hygiene pass at 360x740 / 390x844 / 430x932 / 675x900.

## v0.1.597 ? Shared-menu alignment

- The non-home menu trigger now centers its current-route art and `�޴�` / `Menu` label as a single group instead of pinning the art against the left edge of a wide bar.
- The trigger retains its full-width touch target and opens the same direct Puzzle Room return route alongside the other destinations.
## v0.1.596 ? Puzzle Room destination-art legibility

- Workshop scene destination targets retain their 84px+ tap areas, while the approved destination artwork is enlarged within the white-ringed color buttons; this removes the transparent-padding effect that made each icon read too small.
- The scene stays text-light: one large lower-right `Ǯ��` / `Play` action plus destination-only buttons around Pip, with all labels preserved for assistive technology.
## v0.1.595 - Puzzle Room Hierarchy and Clear Returns - 2026-07-26

- Replaced the accidental top-wide `Solve this picture` bar with one large in-scene Play action. It has a clear puzzle icon, a concise local label, and a dedicated lower-right priority position.
- Rebuilt the six workshop destinations as high-contrast, white-ringed, color-coded scene buttons with deliberate left/right positions: picture list and album at the upper room, Time Attack and Pantry in the mid room, badge map and Settings at the lower edges.
- Opening Picture List now replaces the workshop instead of rendering below a full-screen scene. It has an explicit Puzzle Room return button and keeps the common menu available; the menu's first item now names the Puzzle Room directly.
- Corrected the focused-play back label to Puzzle Room / ?�즐�? matching its existing route instead of falsely calling it the Picture List.
- Hidden the underlying focused-play Settings icon while the Settings modal is open so it cannot appear as a pale, unexplained ghost control.
- Verification: 175 tests and `npm run qa:mobile` at 360x740 / 390x844 / 430x932 / 675x900 pass. Local capture artifacts were regenerated for the revised home, Settings, and Picture List.
- External release blocker unchanged: record real-device Billing evidence for `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` repeat purchase.
# Pip's Picture Pantry - Active Context

## v0.1.593 - Purchase Motivation and Puzzle Integrity - 2026-07-26

- Added a unique-solution guard for all 333 authored puzzles and every generated Time Attack board size. Future catalog additions now fail candidate QA if their clue set can resolve to more than one board.
- Kept the full free route intact while making a decor shortfall actionable: an unavailable item now offers a direct `Add spoons` route to the optional Pantry store instead of a dead disabled purchase button.
- Opening Pantry now requests native Google Play product metadata on that actual surface, so current Android prices can appear without first visiting Settings. Web stays deliberately non-purchasable.
- Kept the Puzzle Workshop distinct from Pip's editable Pantry, but equipped Pantry furnishings now appear as small, physical workshop details. The optional Support Pack also leaves a permanent thank-you keepsake there.
- Added active-play language-switch coverage: normal puzzle cells, selected mode, and cursor are preserved when language changes; an active Time Attack run remains held by the app shell while its labels redraw.
- Verification: 175 tests, 333 unique authored solutions, art audit with 0 duplicate silhouettes / 0 duplicate titles / 0 review candidates, 162 registered assets, 64-frame visual review pack, build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900 all pass.
- Release blocker unchanged: record real-device Billing evidence for `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` purchase/repeat before the signed Play upload.
## Current Launch Candidate Snapshot - 2026-07-17

### v0.1.592 - Separate Puzzle Workshop Home

- Split the player-facing spaces cleanly: the new home is an original Pip puzzle workshop scene, while the editable Pantry remains a separate room that fills as the player buys and equips furnishings.
- Removed the studio-name line from the normal game header; it remains an opening-brand responsibility rather than recurring in-play copy.
- Korean UI now uses `?? ???` for the play home and `?? ??? ?` for the furnishing route, including visible early puzzle names.
- Replaced the labeled destination card grid with six accessible, icon-only scene destinations around the workshop. The current puzzle remains one compact bottom action.
- Centered the floating menu label independently of its icon and reduced the starter counter furnishing zone so it reads as a placed object, not a room-scale illustration.
- Verification: 170 tests, asset manifest QA (160 assets), four-width mobile QA (360x740 / 390x844 / 430x932 / 675x900), and regenerated 64-image visual review pack pass. Full candidate/build validation follows this context update.
- Release blocker unchanged: real-device Billing evidence for `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` repeat purchase.

### v0.1.591 - Pip's Picture Room Home and Navigation

- Renamed the Korean player-facing space to `Pip??그림�?, retaining the English product name only where it is part of the brand. The room, Pantry route, and home copy now use the same familiar Korean concept.
- Rebuilt the first landing screen as Pip's actual warm picture room: Pip, one clear current-picture action, and six direct destinations. The picture shelf only opens after `그림 목록`, so the initial screen invites play rather than presenting a catalogue.
- Moved Settings fully into the destination menu. Outside the home screen, the menu now sits in normal document flow immediately below the header and opens one destination per row, preventing the former bottom overlay from covering Pantry shop actions.
- Tightened the Pantry header and constrained the counter decoration to furnishing scale so the background remains the room and the item reads as an object placed in it.
- Verification: `npm run test` (170 tests), `npm run qa:mobile` at 360x740 / 390x844 / 430x932 / 675x900, and the regenerated 64-image visual review pack pass. Full candidate/build validation follows this context update. No Android bundle was created.
- Release blocker unchanged: real-device Billing evidence for `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` repeat purchase.

### v0.1.590 - Mobile Play Safety and Pantry Room

- Made cursor-mode board presses selection-only: direct taps and drag gestures move the selected cell without coloring or marking a puzzle. Color and Blank now apply only through their explicit actions.
- Removed the cramped row/column and selected-state status chips. Puzzle progress is now a compact `{filled} / {target}` count, and automatic X marks use the quieter mint treatment without the old shadow-heavy ornament.
- Moved Reset Progress out of the live header into Settings, behind its existing confirmation flow. Completion `Menu` now returns to the puzzle hub at the top; the in-play Picture List remains the explicit route to the full list.
- Rebuilt the Pantry as Pip's actual warm room with an approved sunlit window, shelf, counter, floor, and purposefully placed decoration zones. The shop remains below the room, with spoon items first and optional support packs last.
- Localized the Korean brand title to `Pip??그림 ?�트�?, replaced Settings guide replay placeholders with approved raster art, centered Time Attack Start, and consolidated Quick Travel into the requested vertical order.
- Verification: focused unit tests, asset/hygiene checks, production build, and four-width mobile QA (360x740 / 390x844 / 430x932 / 675x900) pass. The visual pack is regenerated for manual review; external Billing purchase evidence remains the only release blocker.

### v0.1.589 - Clock Grandfather Focus

- Time Attack now gives the Clock Grandfather and his pocket watch a clear, near-full-height presence at the start of the challenge; it reads as a distinct game route without the former ambiguous aura treatment.
- Verified the focused Time Attack surface through the four-width mobile visual QA. No Android bundle was created.

### v0.1.588 - Shelf Completion Handoff

- A completed non-final shelf now returns to the picture list, where the next shelf can be chosen or opened; the final Village Pantry shelf instead leads directly into Pip's Pantry.
- The completion overlay has distinct final-shelf copy and action, so it never promises a nonexistent ?�next shelf.??- Verified focused shelf/save/i18n tests and mobile visual QA at 360x740, 390x844, 430x932, and 675x900. No Android bundle was created.

### v0.1.587 - Season Shelf Progression Rebuild

- Repackaged the unchanged 333 authored puzzle IDs into 15 short player-facing shelves (20-23 pictures each), so the opening experience now moves 5x5 -> mixed 5x5/8x8 -> 10x10 tastes -> gradual 12x12 introduction instead of dropping a 136-board wall after the opening packs.
- Added save-compatible shelf progress: legacy pack unlocks migrate to their matching shelves, completed legacy packs seed their matching shelf-completion records, and all existing puzzle completion IDs remain untouched.
- The picker, in-play previous/next navigation, daily candidate access, shelf completion rewards, and keepsake badge milestones now use shelf progression rather than the old five oversized pack boundaries. The 15 shelf unlock costs total 970 spoons and shelf bonuses total 750 spoons, matching the old five-pack economy instead of accidentally inflating late-game currency.
- Removed the last player-facing global catalog pressure from Album counts; normal play communicates shelf progress only. Existing approved stage/badge art is temporarily reused through `artPackId` while each new shelf gets its own future visual pass.
- Shelf completion is now a concise Pip moment (art, one line, spoon bonus, next action) rather than a reward report. The Time Attack start view now carries the approved clock-grandpa character crop so the mode reads as a timed visit with a world character, not a bare utility panel.
- The former hidden-bonus-pack QA guard now proves the stronger shelf invariant: no future `-plus` pack can appear in the curated launch shelf journey, while legacy saves remain safely migrated.
- Verification in this slice: focused shelf/save/badge/i18n tests, production build, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900. No Android bundle was created.

- Mode remains `live-candidate`, now focused on final Android release hardening rather than bulk feature expansion.
- Season 0 launch catalog target is complete at 333 polished puzzles; future 1,000+ depth moves to seasonal/quarterly updates.
- Android v1 should include one optional support purchase from launch: Play Console product ID `pip_cozy_support`, one-time non-consumable, suggested USD 0.99 / KRW 1,100, reward 250 spoons.
- Monetization direction: no ads for v1, no hard puzzle paywall, no purchase interruption during active play. The support pack is framed as helping Pip and adding spoons, not as a paid tier.
- Billing implementation exists in `src/game/billing.js` and is guarded by `npm run qa:billing`; Play Console managed product setup and final signed-device purchase test remain required.
- Gameplay integrity priorities for the last release push: hint/undo no-refund semantics, replay reward anti-farming, Time Attack score fairness, Pantry placement persistence, and mobile WebView QA.
- UI/art priorities for the last release push: support pack card polish, store/Pantry item presentation, Pip-led guide dialogs, completion effects, consistent Sunny Spoon/Pip artwork, and no placeholder-looking buttons/icons.
- Final Android upload numbering is prepared at `android/app/build.gradle` versionCode 28 / versionName 1.1.0; signed upload remains blocked until Play Console Billing evidence is recorded and the final release gate passes.

### Billing Console Setup Guard Addendum

- Added `docs/PLAY_CONSOLE_BILLING_SETUP.md` as the non-secret Play Console checklist for the `pip_cozy_support` managed product: product type, suggested price, player framing, activation, and real internal-tester purchase/restore validation.
- Strengthened `npm run qa:billing` so the Billing guard now checks that the setup checklist exists, names the product ID, preserves non-consumable / 250-spoon / USD 0.99 / KRW 1,100 launch assumptions, and is referenced from the Android release status.
- This is release-gate/documentation hardening only; no visible app version bump was needed.

### Billing Startup Restore Guard

- App startup now runs one silent native restore sync for the Pip Support Pack before the player opens Settings.
- The sync is a no-op on web/non-Android and uses the existing duplicate-grant guard, so owned players can recover the 250-spoon entitlement without creating a second grant.
- Billing QA now guards that the app shell imports and calls the startup sync path, keeping purchase UI, restore UI, and app-start restoration connected.

### Billing Entitlement Payload Guard

- `isCozySupportEntitlement()` now accepts nested object arrays under `products`, in addition to direct product ID strings and transaction/purchase/purchases/result wrappers.
- This protects the Pip Support Pack purchase and restore grant path from native Billing response-shape drift while preserving the duplicate-grant guard in `grantCozySupportPack()`.
- Verified with Billing unit coverage plus `npm run qa:billing` and `npm run qa:hygiene`.

### Future Set Naming Guard

- Internal bonus-pack preview naming now uses `bonus-preview` / `futurePackHint` instead of old paid-pack wording.
- Future pack metadata now uses `future-theme-pack` so hidden later-season content does not inherit the old paid-theme naming.
- Player copy was already safe, but this keeps code, QA guards, and future monetization work aligned with the v1 plan: one optional Support Pack now, future seasonal/bonus sets later.

### Pantry Support Pack Path Guard

- `pip_cozy_support` should stay discoverable from natural spoon-planning moments, not from active-puzzle interruptions or hard paywall copy.
- The Pantry earning plan may show the Pip Support Pack action only when a selected goal has a spoon shortfall (`needed > 0`), alongside the normal play-for-spoons route.
- `npm run qa:billing` now guards the Pantry support action, explanatory note, callback wiring, and player-facing copy so this route cannot disappear or regress into paid/free tier language.

### v0.1.416 Support Pack Already-Owned Guard

- Bumped visible app version and package metadata to `v0.1.416`.
- Added an `already-owned` Billing status so a Google Play non-consumable ownership conflict guides players toward Restore instead of a generic failed request.
- Extended Billing i18n, unit tests, and release QA guards so this real-store edge case stays player-safe in Android testing.

### v0.1.417 Support Pack Restore Resilience

- Bumped visible app version and package metadata to `v0.1.417`.
- Split Support Pack purchase and restore button eligibility so a catalog lookup failure cannot block a player from restoring an already-owned Google Play purchase.
- Reused the same eligibility helpers in Settings rendering and app-shell action guards, with Billing tests and release QA guards covering the shared contract.

### v0.1.418 Stage Gate Reason Chip

- Bumped visible app version and package metadata to `v0.1.418`.
- Added a soft gate-reason chip to locked stage cards so players see whether a stage is blocked by Pantry requests, spoons, or both.
- Extended English/Korean copy plus mobile QA coverage so the pack unlock economy remains explicit instead of feeling like a broken disabled button.

### v0.1.419 Hint Copy Terminology

- Bumped visible app version and package metadata to `v0.1.419`.
- Reframed normal and Time Attack hint copy so players see one hint feature: starter hints first, then extra help that uses spoons.
- Added tests that guard player-facing hint copy against paid/free category wording in English and Korean.

### v0.1.420 Support Pack Value Chips

- Bumped visible app version and package metadata to `v0.1.420`.
- Added compact value chips to the Pip Support Pack card so the player can see the spoon grant, Google Play path, and restore safety before tapping the store button.
- Extended Billing and mobile QA guards so the support card keeps a clear, polished purchase value summary without paid/free tier wording.

### v0.1.421 Korean Pantry Copy Guard

- Bumped visible app version and package metadata to `v0.1.421`.
- Expanded Korean i18n tests across Pantry purchase feedback, placement planning, spoon earning, and item status copy so core live-economy UI cannot regress into mojibake or fallback wording.
- This is release hardening only; no gameplay balance or purchase behavior changed.

### v0.1.422 Locked Stage Spoon Plan Action

- Bumped visible app version and package metadata to `v0.1.422`.
- Added a stage-goal action for the case where Pantry room requests are complete but the next picture pack is still blocked by spoons.
- The action routes players to the Pantry spoon plan instead of showing a direct purchase prompt, keeping the support-pack economy discoverable from a natural "what should I do next?" moment.
- Added exact English/Korean i18n guards for the new action label so it stays framed as planning spoons, not paid/free tier language.

### Android Billing Native Build Check

- Re-ran `npx cap sync android` after the support-pack and copy-guard work; Capacitor detected `@capgo/native-purchases@8.6.4` and produced no source changes.
- Verified the native Android debug compile with Android Studio JBR by running `:app:assembleDebug`; Gradle compiled the `:capgo-native-purchases` module successfully.
- Remaining Billing risk is now Play Console/product/runtime validation, not local native compilation: create/activate `pip_cozy_support`, build the final signed AAB after the Android version bump, then test purchase/restore on an internal tester device.
Last updated: 2026-07-10

## Current Launch Strategy Snapshot - 2026-07-10

- Current local catalog after v0.1.239: 283 free puzzles, 193 large boards, 91 12x12 boards, 98 Village Pantry 10x10 boards, and 145 readable large-board briefs.
- Launch target is now **about 333 high-quality puzzles**, not 1,000 puzzles before release.
- The long-term 1,000+ puzzle ambition remains, but it becomes a post-launch live-service roadmap through seasonal and quarterly updates.
- Once the launch catalog nears the 333 range, prioritize total game quality over more bulk puzzle generation: Sunny Spoon/Pip art consistency, opening screen, button/UI feel, settings polish, Pip guide dialogs, Pantry story loop, Time Attack hint economy, completion effects, and mobile QA.
- Seasonal updates should preserve anticipation and freshness: spring picnic, summer fruit/cafe, autumn baking, winter cocoa/gifts, Sunny Spoon festival, or other timely cozy packs.
- Every future puzzle update still needs the same quality gate: logical solve, readable object, distinct silhouette, strong color/design concept, translated catalog copy, art-readability metadata, and automated catalog/i18n/mobile guards.

## Current Phase

- Mode: `live-candidate`
- Version: `v0.1.13`
- Goal: ship a small Android-first cozy Nonogram MVP within one week, while keeping iOS packaging and store-readiness prepared for Mac Mini handoff.

## Decisions

- Elena's Cozy Village remains on hold.
- This project starts clean and only reuses Sunny Spoon Studios character, brand, and art references.
- MVP focuses on one puzzle loop: choose puzzle, fill or mark cells, complete a picture, save progress.
- Monetization should be weak/trial-level and should not block most content or interfere with world introduction.
- Week-one monetization should favor optional non-consumable support or a bonus pack later; ads are deferred.

## Implementation Notes

- Use Vite, plain JavaScript modules, CSS Grid, LocalStorage, and Vitest.
- Keep puzzle logic independent from UI.
- Avoid old Elena UI, old QA artifacts, and broad simulation/story systems.
- Android app ID target: `com.sunnyspoonstudios.pipspicturepantry`.
- iOS bundle ID target: `com.sunnyspoonstudios.pipspicturepantry`.

## Verification Log

- 2026-06-28: Confirmed workspace root is `D:\Users\bbock\OneDrive\00. Private\10. Development\03. Pip's Picture Pantry`.
- 2026-06-28: Confirmed handoff files exist at project root rather than under `PipPicturePantry_NewProject_Handoff`.
- 2026-06-28: Added Vite/Vitest scaffold, Milestone 0 docs, core Nonogram modules, five starter puzzles, and first playable mobile UI.
- 2026-06-28: `npm install` completed with 0 vulnerabilities.
- 2026-06-28: `npm run test` passed: 2 files, 8 tests.
- 2026-06-28: `npm run build` passed and generated `dist/`.
- 2026-06-28: Local dev server verified at `http://127.0.0.1:5173` with HTTP 200.
- 2026-06-28: Official monetization docs checked; MVP monetization remains optional non-consumable support or bonus pack, with ads deferred.
- 2026-06-28: Initialized local Git repository, added `.gitignore`, committed baseline as `a83aa08 chore: initialize Pip's Picture Pantry MVP scaffold`, and renamed branch to `main`.
- 2026-06-28: Responded to Claude Review 1: fixed stacked column clues, changed board clue row to auto height, added Pantry Album view, softened progress copy, added two 8x8 puzzles, and added puzzle data tests.
- 2026-06-28: `npm run test` passed after Claude response: 3 files, 11 tests.
- 2026-06-28: `npm run build` passed after Claude response.
- 2026-06-28: Browser visual QA was attempted, but in-app browser connection failed with Windows sandbox ACL error; mobile visual pass remained pending.
- 2026-06-28: Responded to Claude Review 2: added `src/i18n` scaffold for English/Korean, extracted gameplay UI strings, restored the x difficulty badge via `\u00d7`, converted album stamps from text abbreviations to mini puzzle-grid visuals, added `.content-panel`, and added `min-height` for album stamps.
- 2026-06-28: Korean i18n file is stored with Unicode escape sequences to avoid Windows/PowerShell encoding corruption while still rendering Korean text in the browser.
- 2026-06-28: `npm run test` passed after i18n response: 4 files, 14 tests.
- 2026-06-28: `npm run build` passed after i18n response.
- 2026-06-28: Added Playwright mobile QA script and verified 360x740, 390x844, and 430x932 with no horizontal overflow, visible puzzle board, visible album, and acceptable tap targets.
- 2026-06-28: Added Capacitor Android shell with app ID `com.sunnyspoonstudios.pipspicturepantry`; `npx cap sync android` passed.
- 2026-06-28: Android debug APK build passed: `android/app/build/outputs/apk/debug/app-debug.apk`.
- 2026-06-28: Android release AAB build passed: `android/app/build/outputs/bundle/release/app-release.aab`.
- 2026-06-28: `jarsigner -verify` confirmed the release AAB is unsigned; upload keystore/signing remains the Play upload blocker.
- 2026-06-28: npm run cap:sync passed, then scripts/build_android_release_bundle.ps1 passed after sync.

## Progress Update - 2026-06-28 Game Loop / Monetization Foundation

- Responded to Claude Design & Game Feel Review and Direction Note 2 with a focused live-candidate polish slice.
- Added reset confirmation dialog so progress is not erased by a single accidental tap.
- Locked completed puzzle boards while keeping the solved picture visible.
- Added completion CTAs: View Album and Next Picture, connecting completion to collection value.
- Added a visually separate Daily card above the puzzle panel to make the daily habit loop clearer.
- Added pack/access metadata for future monetization structure: free, unlockable, and bonus-pack. No payment UI or forced monetization was added.
- Removed dead puzzle reward display data from puzzles.js; puzzle copy now stays in i18n dictionaries.
- Added one new 8x8 puzzle and one 10x10 next-step puzzle to exercise larger board and album stamp density.
- Cached the active locale after startup and added an explicit ko.js comment that launch puzzle titles stay English intentionally.
- Verification after this slice: node --check on changed JS modules passed; npm run test passed with 16 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Sunny Spoon Entry Identity

- Bumped visible app version to v0.1.1.
- Added an in-app Sunny Spoon Studios opening screen using the launch app seal, cozy paper texture, warm family-look copy, and the opening expression character sheet.
- Added a Start skip button and short auto-dismiss timing so the brand moment is visible without slowing the puzzle loop.
- Updated Pip strip imagery from the generic app icon to character art for stronger family look continuity.
- Added shared CSS tokens and paper-grid texture treatment across the body, panels, buttons, daily card, board cells, and completion state.
- Aligned Android native color resources, splash theme colors, launcher background color, and web theme-color with the Sunny Spoon cream/paper palette.
- Updated mobile QA to verify the brand intro before continuing to puzzle and album checks.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 16 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 Studio Logo / Language Settings

- Bumped visible app version to v0.1.2.
- Split startup identity into two explicit stages: Sunny Spoon Studios company logo bumper first, then Pip's Picture Pantry game identity.
- Kept the company bumper as a fixed English studio mark, while game identity and app UI follow the active language.
- Added in-app Settings with language choices: System, English, Korean.
- Default language behavior is System, which follows device/browser language; explicit user choices are stored locally and override System.
- Added i18n tests for system default and in-app language override behavior.
- Updated mobile QA to verify both the studio logo stage and game identity stage before checking puzzle and album screens.
- Android language direction noted: Android 13+ supports centralized per-app language preferences; native LocaleManager/AppCompat integration remains a later Android polish step after the Capacitor MVP shell is stable.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 First-Play Clarity / Copy Cleanup

- Bumped visible app version to v0.1.3.
- Removed internal product-direction copy from the game identity screen. The game identity now shows title, character art, and Start only.
- Set the first puzzle on launch to the 5x5 Pip Face starter puzzle instead of a rotating Daily puzzle, so first-time players begin with the easiest board.
- Added a compact How to Play card above the board with the first action: choose Fill, read number clues, tap squares, and use Mark for blanks.
- Added a simple clue example visual so the player sees what a clue like 3 means before touching the grid.
- Updated Korean font handling by setting document language from the active locale and adding Korean-first font stack for lang=ko.
- Updated user-facing copy to remove vague direction/brand-positioning lines; keep future visible copy concrete and player-useful.
- Updated mobile QA to verify the How to Play card is visible before checking the puzzle board.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Product Copy Rule

- Do not show internal development-positioning phrases to players. Lines such as quiet minutes, cozy world intent, or why we are making the game belong in planning docs, not the app UI.
- First-play screens must answer what should I do now within one glance.
- Player-facing text should be concrete: tap, fill, mark, solve, save, album, today.

## Progress Update - 2026-06-28 Clue Readability / Visual Direction

- Bumped visible app version to v0.1.4.
- Removed the ambiguous cropped character thumbnail from the Pip strip; first-play UI now focuses on instruction and board state.
- Removed difficult player-facing terminology such as grid from onboarding copy, replacing it with picture squares / picture cells.
- Clarified clue wording: 3 means three together; 1 1 means two separate singles.
- Improved clue number rendering so separate numbers no longer visually collapse into 111.
- Improved fill/mark visual language: fill uses warmer honey/coral tones, mark uses mint dashed styling and a dot marker.
- Added Korean font handling and copy cleanup carried forward from v0.1.3.
- Generated first experimental character redesign candidate at docs/visual-concepts/pip-cast-redesign-concept-v1.png.
- Added docs/CHARACTER_REDESIGN_DIRECTION.md with redesign principles, avoid-list, and IP clearance notes.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Character Direction Approval

- Bumped visible app version to v0.1.5.
- User approved the first Pip/cast redesign concept as the production target direction.
- Created a resized app asset at src/assets/characters/pip-cast-redesign-concept-v1-web.jpg from the approved concept for app use.
- Updated the game identity cast image to show the approved redesign direction instead of the older expression sheet, using Vite asset imports so the image is bundled into dist/Android.
- Updated brand metadata so launchProductName and currentAppTitle point to Pip's Picture Pantry instead of Elena's Cozy Village.
- Documented that the app icon/native launcher assets still need a dedicated redesign-based icon pass before final store submission.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed with the app character asset bundled at about 119 KB; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed after running separately from cap:sync; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Pip Strip Sticker

- Bumped visible app version to v0.1.6.
- Generated a dedicated Pip sticker asset for the in-game Pip strip using the approved cozy sticker direction.
- Saved the app asset at src/assets/characters/pip-strip-sticker-v1.png with transparent corners and a 320px square size.
- Restored Pip character presence in the Pip strip without reusing a cropped character sheet or app icon.
- Updated CHARACTER_IP_BIBLE.md so Pip's MVP visual anchors match the approved chef-hat/scarf pantry-helper direction.
- Updated mobile visual QA to require the Pip strip sticker to render on 360px, 390px, and 430px mobile widths.
- Verification after this slice: node --check passed on appShell.js and mobile_visual_check.js; npm run test passed with 17 tests; npm run build passed with the Pip strip asset bundled at about 170 KB; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 Completion Reward Moment

- Bumped visible app version to v0.1.7.
- Generated and added a dedicated Pip completion reaction sticker at src/assets/characters/pip-complete-sticker-v1.png.
- Rebuilt the completion banner into a reward moment with Pip reaction art, concrete saved-card copy, completion CTAs, and a larger solved-picture reveal card.
- Updated mobile visual QA to seed a completed starter puzzle and verify .completion-pip and .completion-reveal render on 360px, 390px, and 430px mobile widths.
- Verification after this slice: node --check passed on appShell.js, pipReaction.js, and mobile_visual_check.js; npm run test passed with 17 tests; npm run build passed with the Pip completion asset bundled at about 221 KB; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Unlock Gate

- Bumped visible app version to v0.1.8.
- Added src/game/puzzleAccess.js to evaluate unlock requirements independently from UI rendering.
- Connected the Sunny Spoon Sign 10x10 puzzle to completed-count progress: it now stays locked until 5 cards are completed.
- Puzzle picker now renders locked chips as disabled with a visible completion requirement instead of allowing early selection.
- Added unlock access tests covering free puzzles, completed-count locking, unlocking, and duplicate completed-id handling.
- Updated mobile visual QA to require a locked puzzle chip before the starter completion seed runs.
- Verification after this slice: node --check passed on appShell.js, puzzleAccess.js, and mobile_visual_check.js; npm run test passed with 20 tests; npm run build passed; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Product Copy Rule

- Do not show internal development-positioning phrases to players. Lines such as quiet minutes, cozy world intent, or why we are making the game belong in planning docs, not the app UI.
- First-play screens must answer what should I do now within one glance.
- Player-facing text should be concrete: tap, fill, mark, solve, save, album, today.
- Avoid technical terms like grid when a simpler player term works.

## Character Direction Rule

- Treat current generated character art as clearance-pending and replaceable.
- Prefer original, simplified 2D sticker-like shapes over glossy AI-rendered fur or semi-realistic mascot detail.
- Do not ship a final character design without visual similarity review and trademark/name clearance in target markets.

## Next Actions

- Expand launch puzzle content toward the 30-picture store target after the completion loop feels rewarding.
- Create/connect upload keystore outside the repo and build a signed Android release AAB.
- Draft Android/iOS store metadata and screenshot checklist using the v0.1.6 first-play flow.
- Run a manual real-device or emulator check of native splash to Sunny Spoon logo bumper to game identity to first puzzle handoff.
- Later Android polish: connect in-app language picker to Android per-app language APIs/LocaleManager or AppCompat so system settings and app settings stay synchronized on Android 13+.

## Progress Update - 2026-06-28 Android Signing Pipeline

- Kept UI version at v0.1.8 because this slice changes release infrastructure, not player-visible behavior.
- Added environment-variable based Android release signing in android/app/build.gradle.
- Added scripts/create_android_upload_keystore.ps1 for one-time upload keystore creation outside the repo.
- Added scripts/build_android_signed_release_bundle.ps1 for signed AAB builds and jarsigner verification once signing variables are set.
- Added docs/ANDROID_SIGNING_SETUP.md and .gitignore safeguards for keystore/signing-secret files.
- Next Android blocker: run the keystore creation step with owner-chosen passwords, set PPP_UPLOAD_* environment variables, build the signed AAB, and upload to Google Play internal testing.

## Progress Update - 2026-06-28 Signed Android AAB

- Kept UI version at v0.1.8 because this slice changes release readiness, not player-facing behavior.
- Created the Android upload keystore and a local-only signing env file outside the repo under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry.
- Built the first signed release AAB at android/app/build/outputs/bundle/release/app-release.aab.
- Verified the signed AAB with jarsigner: jar verified, exit code 0.
- Recorded upload key SHA-256 fingerprint in docs/ANDROID_RELEASE_STATUS.md for Play Console reference.
- Next Android action: upload signed AAB to Google Play internal testing and capture Play Console acceptance or rejection details.

## Progress Update - 2026-06-28 Key Paths Organization

- Organized private Android signing materials under 99. Key Paths/Android by project name.
- Moved Pip's Picture Pantry upload keystore and local signing env file to 99. Key Paths/Android/Pip's Picture Pantry outside the repo.
- Moved Elena Cozy Village upload key into 99. Key Paths/Android/Elena Cozy Village for the same key-storage convention.
- Updated Android signing docs and the keystore creation script default path to the 99. Key Paths convention.
- Verification after this slice: rebuilt the signed AAB using the moved Pip env file path; jarsigner reported jar verified; current upload key SHA-256 is recorded in docs/ANDROID_RELEASE_STATUS.md.

## Progress Update - 2026-06-28 v0.1.9 First Internal Test Feedback

- Bumped visible app version to v0.1.9 and Android release version to versionCode 2 / versionName 1.0.1 for the next Play internal test upload.
- Changed the game identity screen so it no longer auto-dismisses; players must tap Start before entering the puzzle.
- Clarified first puzzle instructions: 3 is now described as three continuous squares, and 1 1 explains coloring one square, leaving a gap, then coloring one more.
- Renamed controls from Fill / Mark / Undo to Color / Blank Check / Undo last move in English, and to coloring / blank-check wording in Korean.
- Lightened the cozy paper background while keeping the Sunny Spoon cream palette.
- Reframed Today's card as Today's pick: a suggested picture with no bonus, meant only to reduce choice friction.
- Updated mobile visual QA to verify the game identity screen stays visible until Start is tapped.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 20 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.
## Progress Update - 2026-06-28 v0.1.10 Puzzle List Progress Cues

- Bumped visible app version to v0.1.10 and Android release version to versionCode 3 / versionName 1.0.2 for the next internal test upload.
- Added each puzzle size to the bottom picture list, so players can see 5x5 / 8x8 / 10x10 before choosing a picture.
- Added completed-state labeling and a soft mint completed style to solved pictures in the bottom list, not only in the album.
- Adjusted the album note so the Korean line "completed cards appear here" stays on one line on the target mobile widths.
- Captured the user's larger retention idea as a future Pantry Mural / meta-picture system: solved cards can become tiles toward a larger cozy illustration.
- Captured the audio idea as a post-internal-test polish candidate: cute tap/mark/complete SFX and a low-volume cozy BGM loop, with mute/settings controls and no extra monetization pressure.

## Product Direction Candidates

- Pantry Mural: each solved card can fill one slot of a larger pantry/cafe illustration. This should be a motivation layer, not a blocker for enjoying individual free cards.
- Audio polish: add lightweight local audio assets only after current first-play flow is stable. Required controls: sound effects on/off, music on/off, conservative default volume, and no disruptive autoplay assumptions.
## Progress Update - 2026-06-28 v0.1.11 Player Profiles / Pantry Map

- Bumped visible app version to v0.1.11 and Android release version to versionCode 4 / versionName 1.0.3 for the next internal test upload.
- Added a first-launch player name step after the Sunny Spoon Studios and game identity screens. The app now asks what Pip should call the player before entering the puzzle loop.
- Added local player profiles: progress is saved by player name, and entering a different name can start or resume a separate local progress track on the same device.
- Preserved existing single-profile progress by migrating the legacy save into the first named profile when a player name is created.
- Added a Pantry Map tab where solved cards fill slots in a larger pantry wall. This is the first MVP version of the larger meta-picture retention loop.
- Added a player-name input in Settings so a device can switch to a new local name later.
- Audio remains deferred until after the name/profile and map loop have been tested on-device.
## Progress Update - 2026-06-28 v0.1.12 Launch Puzzle Volume

- Bumped visible app version to v0.1.12 and Android release version to versionCode 5 / versionName 1.0.4 for the next internal test upload.
- Corrected the map expansion direction: this slice expands the playable picture count, not only the Pantry Map meta view.
- Expanded the first launch shelf to 30 playable pictures: twelve 5x5 starter pictures, twelve 8x8 easy pictures, and six 10x10 next-step pictures.
- Kept the content mostly free and progression-based. The 10x10 pictures unlock by completed-card count rather than payment.
- Added puzzle data coverage to enforce the 30-picture launch volume and size distribution.


## Progress Update - 2026-06-28 v0.1.13 Review Fixes

- Bumped visible app version to v0.1.13 and Android release version to versionCode 6 / versionName 1.0.5.
- Fixed corrupted Korean albumText strings for the new launch puzzles from teacup-5 through village-window-10.
- Fixed createShell() to include onPlayerChange in the destructured parameter list so Settings can change the local player name.
- Clarified the three-tab model: Album stores completed cards, while Wall / Pantry Wall shows cards filling a larger pantry-wall progression view.
- Restored first-run player-name onboarding after the Start button and added a short note explaining that progress is saved under that name on this device.

## Progress Update - 2026-06-28 v0.1.14 Folder Economy / Audio Trial

- Bumped visible app version to v0.1.14 and Android release version to versionCode 7 / versionName 1.0.6.
- Fixed the live player profile path again from the tester screenshots: the Pip strip now receives the active player name, Settings shows translated player-name controls, and the `Jay` profile stays visible after first onboarding.
- Replaced the weak Today's pick wording with a reward reason: completing the daily pick now grants an extra spoon bonus once per day.
- Added the first trial economy loop: completed cards award spoons, the header shows spoon balance, and later folders can be opened with earned spoons.
- Expanded free launch content to 100 cards arranged as five folders of 20 cards each: Pip's First Shelf, Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry.
- Converted the Roadmap view from individual card slots into folder-level mural progress, so each completed folder fills a larger Pip-picture part.
- Added lightweight local WebAudio tap/complete effects and a very quiet background loop with Settings toggles for effects and music.
- Brightened the game background and added uniform folder card art/spacing so folder labels and art no longer press against borders.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-28 v0.1.15 Review 8 Polish

- Bumped visible app version to v0.1.15 and Android release version to versionCode 8 / versionName 1.0.7.
- Replaced the remaining folder-art mural label hardcode with localized `map.parts.*` copy, so Korean mode no longer shows labels such as `Pip Ear` in English.
- Replaced `window.setTimeout` usage in audio and brand intro timing with `globalThis.setTimeout` for consistency with the rest of the browser-safe code.
- Softened early spoon-gate costs for internal testing: Sunny Spoon Sign now opens at 24 spoons, followed by 70 / 110 / 120 spoon folder gates.
- Confirmed `map.parts.*` keys already exist in both English and Korean dictionaries.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-28 v0.1.16 Stage / Currency Polish

- Bumped visible app version to v0.1.16 and Android release version to versionCode 9 / versionName 1.0.8.
- Removed the current continuous background oscillator from the music toggle and made music default off; tap and completion sound effects remain enabled by default.
- Reworked the visible progression language from folders to stages/scenes, while keeping the data model stable internally.
- Added a CSS spoon icon for the header balance, puzzle rewards, and unlock costs so the player-facing economy is visual rather than text-heavy.
- Added two future optional paid theme stage placeholders, while keeping spoons as an earned in-game progression currency instead of a purchasable consumable.
- Changed the roadmap and stage previews from folder art / explicit Pip-part labels into soft silhouettes that become clearer with progress.
- Cleaned Korean stage copy for consistency across the free progression stages.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-28 v0.1.17 Roadmap / Reward Polish

- Bumped visible app version to v0.1.17 and Android release version to versionCode 10 / versionName 1.0.9.
- Removed the confusing `5x5 - +3` reward formatting. Puzzle cards now show the size followed by a small reward token and `+3`.
- Replaced the rough spoon glyph with a warmer golden reward token that carries a small spoon mark, so the economy reads as visual currency without relying on the word spoon.
- Replaced the crude CSS circle silhouettes in stage previews and the Roadmap with the real Pip complete sticker as a ghosted target image that reveals color by progress.
- Hid the music toggle for now because the previous generated background tone did not meet the cozy quality bar. Tap and completion sound effects remain available; file-based BGM is deferred until we have a real audio asset.
- Removed the BOM character from `src/data/packs.js` after Claude review.
- Kept future bonus stage placeholders in the stage list as optional paid-theme previews, but excluded empty bonus packs from the Roadmap progression so they do not appear as 0/0 completion targets.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-29 v0.1.18 Badge / Future Sets Polish

- Bumped visible app version to v0.1.18 and Android release version to versionCode 11 / versionName 1.0.10.
- Added a top badge shelf: the first 100-card free roadmap now leads to a Pip Portrait badge that becomes earned when the full free set is complete.
- Added the same badge state to the Roadmap view so the 100-card completion goal has a visible pride reward, not only a revealed picture.
- Expanded future paid-theme placeholders from two to five 20-card set concepts: Cozy Cafe Room, Bakery Morning, Seasonal Pantry, Village Picnic, and Sunny Spoon Festival.
- Fixed the missing `packs.preview` i18n key so Korean no longer shows a raw translation key in bonus-stage badges.
- Changed future paid-stage copy from vague Coming Soon wording to a price-preview placeholder (`$0.99 planned` / `?�상 가�?$0.99`) for later store wiring.
- Kept BGM disabled intentionally and documented `startMusic()` as a placeholder until an original looped music file is added; current SFX remains active.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.19 Store-Safe Add-On Copy

- Bumped visible app version to v0.1.19 and Android release version to versionCode 12 / versionName 1.0.11.
- Replaced hardcoded `$0.99 planned` add-on text with store-safe value copy: `Optional add-on - 100 puzzles` / `?�택 추�? ?�트 - 100�??�즐`.
- Changed the top badge shelf so it appears only after the first 100-card Pip Portrait badge is earned; in-progress badge tracking remains in the Roadmap view.
- Removed the residual BOM from `src/ui/appShell.js`.
- Verification after this slice: node --check passed on appShell; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932.

## Progress Update - 2026-06-29 v0.1.20 Retention Polish

- Bumped visible app version to v0.1.20 and Android release version to versionCode 13 / versionName 1.0.12.
- Added pack-level badge metadata for the five free progression stages and a new `src/game/badges.js` helper for earned / next badge status.
- Changed Roadmap badge progress from one large 100-card counter to the next pack badge target, giving players a shorter 20-card milestone.
- Kept the top badge shelf earned-only: it now appears only after at least one pack badge is earned, avoiding noisy 0-progress UI for new players.
- Added completion dates to saved puzzle progress and shows the completed date on finished Album cards.
- Added simple Pip strip dialogue progression based on completed-card count so Pip responds differently as the pantry fills up.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 27 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932.

## Progress Update - 2026-06-29 v0.1.21 Stage Completion Celebration

- Bumped visible app version to v0.1.21 and Android release version to versionCode 14 / versionName 1.0.13.
- Added a one-time stage completion celebration when all 20 cards in a free progression stage are complete.
- Added `completedPackIds` to local save normalization so older saves migrate safely and completed-stage celebrations do not repeat.
- Added a short stage-complete sound effect and a Pip sticker overlay that confirms the whole stage has been saved to the Album.
- Kept the previous BGM decision unchanged: generated background music remains disabled until an original looped audio asset exists.
- Deferred large puzzle-size replacement for later content expansion because changing launched puzzle boards can disturb existing internal-test saves and balance.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.22 Daily Reward Clarity

- Bumped visible app version to v0.1.22 and Android release version to versionCode 15 / versionName 1.0.14.
- Updated Today's pick reward copy so the bonus displays with the same reward token icon used elsewhere in the economy, making it clear the player receives +5 spoons/tokens.
- Kept the current Roadmap art model unchanged for this patch: the free 100-card path completes one Pip Portrait. Stage-specific preview/badge art remains a planned pre-release polish item for the next broader content pass.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.23 Cozy Music Trial

- Bumped visible app version to v0.1.23 and Android release version to versionCode 16 / versionName 1.0.15.
- Added an optional WebAudio cozy music loop using a quiet 12-second C-major pattern with soft note envelopes and low bass support.
- Restored the music toggle in Settings as `Cozy music on/off` / `?�늑???�악 켜기/?�기`; music remains opt-in and does not autoplay by default.
- Kept SFX behavior unchanged and preserved the previous tap, card-complete, and stage-complete effects.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.

## Progress Update - 2026-06-29 v0.1.24 Roadmap Clarity

- Bumped visible app version to v0.1.24 and Android release version to versionCode 17 / versionName 1.0.16.
- Fixed Today's pick selection so it only chooses from currently unlocked/playable puzzle stages, avoiding locked daily recommendations.
- Changed Today's pick reward copy layout so the reward token and +5 stay together on the second line.
- Reworked stage previews and Roadmap cards to stop clipping Pip vertically; stage cards now show a progress meter, while the main Pip portrait becomes gradually clearer by overall 100-card progress.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 29 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.

## Progress Update - 2026-06-29 v0.1.25 File-Based Cozy BGM

- Bumped visible app version to v0.1.25 and Android release version to versionCode 18 / versionName 1.0.17.
- Added the provided original cozy background music file at src/assets/music/bgm-cozy.mp3.
- Replaced the temporary WebAudio generated music loop with a looped, opt-in MP3 background track at conservative volume.
- Kept music off by default and controlled through Settings, while SFX behavior remains unchanged.

## Progress Update - 2026-06-29 v0.1.26 Stage-Part Roadmap Reveal

- Bumped visible app version to v0.1.26 and Android release version to versionCode 19 / versionName 1.0.18.
- Reworked the Roadmap goal from overlapping full-image opacity to stage-specific Pip part reveals.
- Mapped the five free stages to clearer Pip portrait parts: chef hat, scarf, face, body, and picture card.
- Removed the misleading large progress stripe from Roadmap cards; progress remains in compact meters so the cards do not look like sliced images.

## Progress Update - 2026-06-30 v0.1.27 Roadmap / Stage Preview Split

- Bumped visible app version to v0.1.27 and Android release version to versionCode 20 / versionName 1.0.19.
- Clarified the visual model: the main Roadmap image is the full Pip portrait becoming clearer across 100 completed cards.
- Changed stage previews and Roadmap stage cards to show only the relevant Pip part for that stage, with compact progress meters.
- Removed broad left-to-right fill backgrounds from stage art areas so stage cards no longer look like clipped full portraits.

## Progress Update - 2026-06-30 v0.1.28 Pip Tile Roadmap

- Bumped visible app version to v0.1.28 and Android release version to versionCode 21 / versionName 1.0.20.
- Replaced semantic Pip-part cutting with a stable tile-puzzle reveal model.
- The main Roadmap now treats the first 100 free puzzles as a 10x10 Pip portrait tile board; each completed puzzle reveals one tile.
- Stage previews and Roadmap stage cards now show 20-tile mini boards instead of trying to identify character body parts.

## Progress Update - 2026-06-30 v0.1.29 Badge Shelf Simplification

- Bumped visible app version to v0.1.29 and Android release version to versionCode 22 / versionName 1.0.21.
- Removed the confusing Roadmap concept from the user-facing flow and repurposed the third tab as a Badge Shelf.
- Kept the tile-reveal style in stage previews, but each of the five free stages now uses a different target image instead of repeating Pip.
- Stage completion and the earned top badge shelf now use the matching stage badge image.
- Verification after this slice: JS syntax checks passed, unit tests passed, production build passed, mobile visual QA passed, and signed AAB was rebuilt with jarsigner verification.

## Progress Update - 2026-06-30 v0.1.30 Release Candidate Polish

- Bumped visible app version to v0.1.30 and Android release version to versionCode 23 / versionName 1.0.22.
- Replaced the nearly invisible Village Pantry stage badge art with the Story Friends image sheet so the fifth free stage has a visible target picture.
- Slightly increased unrevealed tile opacity for stage previews and locked badge cards so future badge art reads as an intentional preview instead of an empty panel.
- Verification after this slice: JS syntax checks passed, unit tests passed, production build passed, mobile visual QA passed, and signed AAB was rebuilt with jarsigner verification.

## Progress Update - 2026-06-30 v0.1.31 Launcher Icon Repair

- Bumped visible app version to v0.1.31 and Android release version to versionCode 24 / versionName 1.0.23.
- Regenerated Android launcher icon PNG resources from the Play Console 512px Pip app icon so installed tester builds should show the intended launcher icon instead of a blank/default icon.
- This is a packaging-only follow-up intended for the closed test track after the first Alpha review/install checks.
- Verification after this slice: appShell syntax check passed, production web build passed, and signed AAB was rebuilt as versionCode 24 / versionName 1.0.23.


## Progress Update - 2026-07-01 v0.1.32 Tutorial / Mystery Tile Polish

- Bumped visible app version to v0.1.32 and prepared Android release numbering as versionCode 25 / versionName 1.0.24 for the next closed-test build if this UX pass is approved.
- Reworked the first-puzzle help card into a visual-first guide: clue examples now show how 3 and 1 1 1 map onto five cells, and the action buttons are shown as short labels instead of a long ordered explanation.
- Made unrevealed stage and badge art more mysterious while keeping one peek tile visible, so players can sense a hidden picture without seeing too much of the final badge.
- Verification after this slice: node --check passed for puzzleView, appShell, and mapView; npm run build passed. Local Vite server responds at http://127.0.0.1:5173/.

- Refined the v0.1.32 first-puzzle guide copy and clue captions so 3 reads as adjacent cells and 1 1 1 reads as separated cells without relying on long numbered instructions.

## Progress Update - 2026-07-01 v0.1.33 Tutorial Label Polish

- Bumped visible app version to v0.1.33 while keeping Android release numbering at versionCode 25 / versionName 1.0.24 because the next closed-test AAB has not been uploaded yet.
- Renamed the first-puzzle help heading from the Korean `그림 �?가?�드` wording to a friendlier picture-square guide label, while keeping the visual clue examples for adjacent 3 cells and separated 1 1 1 cells.
- Verification after this slice: node --check passed for ko/en i18n and appShell; npm run build passed; signed AAB rebuilt for the next closed-test upload.
## Tester Feedback - 2026-07-01 Stage Navigation / Puzzle Size Expansion

- Closed-test feedback from a tester on the previous build: within a stage, selecting a later picture requires scrolling farther down as the stage progresses, and after entering a puzzle the view does not jump directly to the puzzle board. Returning to choose another picture can require repeated long scrolling.
- UX requirement before adding 10x10 or larger puzzles: reduce vertical travel between stage picture selection and puzzle play. Candidate solutions include a compact current-stage carousel, previous/next picture buttons, auto-scroll to the active puzzle board after selection, and a sticky mini stage selector.
- For 10x10/12x12 expansion, prioritize navigation comfort and board reachability before adding more difficult content; larger boards will make this friction more noticeable.

## Progress Update - 2026-07-01 v0.1.34 Stage Navigation Comfort

- Mode: live-candidate polish while closed testing remains active.
- Bumped visible app version to v0.1.34 for a tester-feedback UX slice.
- Added same-stage navigation inside the puzzle panel: previous picture, picture list, and next picture.
- Selecting a picture now scrolls back to the puzzle board, reducing repeated manual scrolling after choosing a lower stage puzzle.
- The picture list button scrolls to the active stage block so players can choose another picture in the same stage without hunting through the page.
- Android target for the next upload is versionCode 26 / versionName 1.0.25, pending local play review before signed AAB rebuild.
- Verification: node --check passed for appShell.js, puzzleView.js, ko.js, and en.js; npm run build passed.

## Progress Update - 2026-07-01 v0.1.35 Late-Stage 10x10 Trial

- Bumped visible app version to v0.1.35 for the next tester-facing difficulty expansion slice.
- Introduced 10x10 puzzles only in the later free stages: Bakery Window now ends with four 10x10 medium puzzles, and Village Pantry now ends with six 10x10 medium puzzles. The first three stages remain unchanged so new players still start with 5x5 and 8x8 only.
- Kept each free stage at 20 puzzles and preserved existing unlock costs. The new composition is 40 5x5 puzzles, 50 8x8 puzzles, and 10 10x10 puzzles across the 100 free puzzles.
- Adjusted board sizing so larger boards fit better on mobile before the next local UX check.
- Android target for the next upload is versionCode 27 / versionName 1.0.26, pending local play review before signed AAB rebuild.

## Direction Plan - 2026-07-02 Major Rework / Pantry Decoration Economy

- Mode: experimental direction planning; AAB uploads are paused while closed-test feedback and market research are folded into a larger product rework.
- Created `docs/MAJOR_REWORK_PLAN.md` for Claude review.
- Direction: shift the long-term loop from "spoons unlock more puzzles" toward "puzzles reveal color cards, earn spoons, and fund Pantry decoration."
- Production asset rule: stop relying on CSS-built player-facing reward art. Spoon currency, shop items, badges, opening/login images, and major reward visuals should become real PNG/WebP assets with clear placeholder-vs-production tracking.
- Badge decision: keep badges as milestone rewards, but demote them from the main goal. Pantry decoration becomes the primary meta-progression loop; badges can be displayed through Pantry/Album as pride objects.
- Added large-board strategy to the plan: 10x10/12x12/15x15+ should use a cursor/D-pad mode with row/column guides, clue highlighting, soft X guidance, sound feedback, and conservative haptic settings.


## Progress Update - 2026-07-02 v0.1.36 Experimental Rework First Slice

- Mode: experimental local-development slice; Play/AAB upload remains paused while the larger Pantry decoration rework is shaped.
- Bumped visible web app version to v0.1.36 and package version to 0.1.36 without changing Android versionCode/versionName.
- Added a completed-stage visibility toggle to the puzzle list so testers can hide finished stages while keeping completed cards in Album and earned milestones in Badges.
- Expanded the major rework plan with fast-player reward pacing: immediate puzzle rewards, stage badges, room/theme unlocks, decoration mastery, challenge rewards, and seasonal/repeatable sinks so high-engagement players do not exhaust the economy too quickly.
- Image generation for the new spoon currency asset was attempted, but generated results did not meet the requested asset direction; no bad asset was committed.


## Progress Update - 2026-07-02 v0.1.37 Pantry Decoration Skeleton

- Scope: experimental major-rework slice; Android AAB churn remains paused while the new meta loop is validated locally.
- Bumped visible web app version to v0.1.37 and package version to 0.1.37.
- Added a dedicated Pantry tab as the first playable decoration-economy skeleton: the save model now tracks owned and equipped decorations, and the UI lets players buy/place items with puzzle-earned spoons.
- Separated decoration data into src/data/decorations.js so future real PNG/WebP item assets can be added without mixing item economy with shell UI code.
- Intentional art boundary: this slice uses labeled PNG slots only. It does not ship weak CSS-made item art, because the major rework direction is to replace currency, badge, decoration, and completion art with proper generated/imported image assets.
- Next action: create/curate real spoon currency, badge, and pantry item PNG assets, then replace the placeholder slots and tune costs/reward pacing.

## Progress Update - 2026-07-02 v0.1.38 Colored Completion Rewards

- Scope: experimental major-rework slice; Play/AAB uploads remain paused while the new reward loop is validated locally.
- Bumped visible web app version to v0.1.38 and package version to 0.1.38.
- Added colored completed-puzzle rendering so finished boards and Album cards shift from single brown blocks toward warmer multi-color reward stamps.
- Added src/ui/coloredPuzzleArt.js as a deterministic color layer for existing puzzle masks. This is an interim reward polish layer, not a replacement for future real generated card artwork.
- Verification after this slice: node --check passed for albumView, boardView, coloredPuzzleArt, and puzzleView; npm run test -- --run passed; npm run build passed after removing BOM introduced during Windows patching.


## Progress Update - 2026-07-02 v0.1.39 Real Pantry Asset Pipeline

- Added project-local PNG assets for the spoon token and the first six Pantry decorations under `src/assets/icons` and `src/assets/decorations`.
- Wired Pantry decoration data to explicit `assetUrl` fields so shop cards and equipped room slots render actual image files instead of placeholder text.
- Replaced the CSS-built spoon icon with an image-backed spoon token across Pantry currency UI.
- Note: built-in image generation returned irrelevant outputs during this slice, so those generated files were not used. This version establishes the replaceable asset pipeline first; final art can now be swapped by replacing PNG files.
- Verification target: run syntax checks, unit tests, and production build after this asset wiring.


## Progress Update - 2026-07-02 v0.1.40 Global Spoon Token

- Extended the new PNG spoon token beyond Pantry into the main app shell currency display, daily reward, puzzle reward chips, and stage unlock cost UI.
- The old CSS-drawn spoon remains overridden by the v0.1.39 image-backed styles, so visible currency now uses the same asset across the app.
- This is still marked as a replaceable asset pipeline step; final currency art can be improved by swapping `src/assets/icons/spoon-token-v1.png`.
## Progress Update - 2026-07-02 v0.1.41 Startup Recovery

- Scope: recovery patch after the v0.1.40 local preview showed a blank app shell.
- Fixed the undefined `hideCompletedStages` runtime path by initializing the setting inside `renderApp()` and adding the localStorage preference helpers used by the stage filter.
- Bumped visible web app version to v0.1.41 and package version to 0.1.41 so this recovery build is distinguishable during local QA.

## Progress Update - 2026-07-02 v0.1.42 Pantry Containment

- Mode: `recovery` / containment, not feature expansion.
- Bumped visible app version to v0.1.42 and package version to 0.1.42.
- Removed the broken Pantry decoration shop surface from the playable UI because CSS/shape-like placeholder art and absolute slot placement were damaging layout quality.
- Replaced the Pantry tab with a stable holding view that preserves spoon progress and states the asset rule: Pantry rewards must use finished PNG/WebP game assets, not code-drawn placeholder items.
- Fixed the Pantry i18n block in English and Korean to remove development-facing text such as "final PNG will replace these slots" from player-facing UI.
- Next action: rebuild Pantry only after a small approved real-asset set exists: spoon currency, 2-3 decoration items, and 1-2 badge images.

## Direction Update - 2026-07-02 Floating Navigation / Pip Tutorial

- Mode: `experimental` planning; no AAB/upload target.
- Added plan direction to replace the web-like text tab row with icon-first floating navigation, starting with one bottom-right expandable menu to limit clutter and asset burden.
- Added Pip guided onboarding direction: after name entry, show 2-3 short character dialogue slides and an optional guided 5x5 demo; it should be skippable, remembered locally, and replayable from settings/help.
- Asset rule reiterated: navigation icons and tutorial character poses must use approved PNG/WebP assets, not CSS-drawn placeholder icons.
## Progress Update - 2026-07-02 v0.1.43 Asset-Gated Floating Navigation

- Mode: `experimental` shell slice; Play/AAB uploads remain paused during the larger rework.
- Bumped visible web app version to v0.1.43 and package version to 0.1.43.
- Replaced the always-visible text tab row with a bottom-right floating navigation menu so the main screen can move toward an icon-first mobile game shell.
- Important asset boundary: this slice intentionally does not add CSS-drawn navigation icons or decoration art. The floating menu currently uses text labels as conservative UI chrome until approved PNG/WebP icons exist.
- Reaffirmed the production art rule after the failed generated-image attempt: reward, currency, badge, decoration, tutorial, and menu art must be real raster assets; bad generated outputs and CSS-like placeholder art should not be wired into player-facing screens.


## Android launcher placement note - 2026-07-02

- Tester feedback: the last Android test install appeared under a system/game folder rather than directly on the home screen, and the launcher icon behavior still needs review before the next Android AAB build.
- Keep AAB generation paused during the experimental rework, but before the next tester upload verify launcher icon resources, manifest category/launcher intent behavior, and Samsung/Game Launcher style device behavior.

### v0.1.43 Follow-up - Mobile QA Tap Targets
- Raised stage navigation and completed-stage filter tap targets to 44px minimum after mobile QA found 36-38px controls.
- Re-ran npm run qa:mobile: passed for 360x740, 390x844, and 430x932.
- Re-ran npm run build: passed. No Android/AAB build was produced in this experimental asset-gate pass.

## Progress Update - 2026-07-03 v0.1.44 Asset Manifest Guard

- Mode: `experimental` art-pipeline guard; Play/AAB uploads remain paused.
- Bumped visible web app version to v0.1.44 and package version to 0.1.44.
- Added `src/data/assetManifest.js` and `npm run qa:assets` so player-facing art can be tracked as real raster assets with explicit approval status.
- The guard blocks visible placeholder/candidate art and fails if CSS pseudo-elements try to draw the spoon currency token again.
- Kept the Pantry decoration shop hidden until approved PNG/WebP assets exist; existing decoration PNGs are registered as hidden candidates only.
- Android launcher placement remains recorded for the next AAB pass, but no Android build was produced in this slice.


## Progress Update - 2026-07-03 v0.1.45 Cursor Board Controls

- Bumped visible web version to v0.1.45 for a local UX iteration only; Android AAB generation remains paused during the major rework.
- Added persistent puzzle cursor state so larger boards can support D-pad style control without relying only on direct cell taps.
- Added row/column clue and board-cell highlighting for the selected cursor position.
- Added large-board cursor controls below the existing touch controls: move selection, color selected cell, and blank-check selected cell.
- Kept this slice free of CSS-drawn art assets; the changes are interaction UI only, while player-facing decorative art remains blocked behind the asset manifest replacement plan.
- Deferred note remains: next Android release should check why some devices place the app under a game folder/Game Launcher rather than directly on the home screen.

## Progress Update - 2026-07-03 v0.1.46 Pantry Holding Copy + Recovery

- Mode: `experimental` stabilization during the major art/economy rework; Android AAB generation remains paused.
- Bumped visible web version to v0.1.46 and package version to 0.1.46.
- Recovered Korean i18n and cursor-control text after malformed strings caused a blank/unstable local screen risk.
- Replaced the player-facing Pantry placeholder/shop with a simple holding card so CSS-drawn decoration items and developer asset-rule copy are not shown to players.
- Confirmed the current image-generation attempt produced off-prompt assets, so no new generated art was wired into the app. Future currency, badge, decoration, tutorial, and menu icons must be reviewed raster assets before use.
- Deferred Android note: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-03 v0.1.47 Player-Facing Copy Cleanup

- Mode: `experimental` stability and player-copy cleanup; Android AAB generation remains paused.
- Bumped visible web version to v0.1.47 and package version to 0.1.47.
- Removed remaining developer-facing Pantry copy from the player experience, including prototype/asset-rule wording.
- Fixed the Korean floating menu label so it renders as `메뉴` instead of mojibake.
- No new CSS-drawn art was introduced. Pantry remains a holding view until reviewed raster decoration and currency assets are ready.

## Guard Update - 2026-07-03 Asset Copy And CSS-Art Checks

- Mode: `experimental` guardrail; no Android/AAB build produced.
- Extended `npm run qa:assets` so it now also blocks likely CSS-drawn decoration/badge/menu/floating-nav art selectors and scans player i18n files for development-only copy such as prototype, asset-rule, and PNG/WebP wording.
- Added `docs/ART_ASSET_BACKLOG.md` as the working list for real raster art needed before reopening Pantry, replacing visible temporary stage/badge/currency art, and moving to icon-first navigation/tutorial screens.
- Current known acceptable warnings remain temporary visible currency and stage-reward art; these are tracked replacement targets, not final art.


## Progress Update - 2026-07-03 v0.1.48 Reward Art Gate

- Mode: `experimental` containment during the major art/economy rework; Android AAB generation remains paused.
- Bumped visible web version to v0.1.48 and package version to 0.1.48.
- Disabled reused Pip/cast stage reward art by emptying the approved stage-art map and demoting previous stage-reward entries in the asset manifest to hidden.
- Stage previews, badge shelf, badge room, and stage-complete overlay now show conservative pending-art states when no approved dedicated raster art exists, instead of broken images or recycled character art.
- The only remaining asset-manifest warning is `spoon-token-v1`, which remains visible as the current currency token but is still tracked for replacement with a better production currency asset.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.
- Verification after this slice: node --check passed for changed JS/i18n modules; `npm run qa:assets` passed with only the spoon-token warning; `npm run test -- --run` passed 32 tests; `npm run build` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


## Progress Update - 2026-07-03 v0.1.49 Control Mode And Time Attack Generator

- Mode: `experimental`; Android AAB generation remains paused during the major rework.
- Bumped visible web version to v0.1.49 and package version to 0.1.49.
- Added a persistent control-mode setting: Auto, Tap cells, or D-pad. Auto keeps direct tapping for small boards and shows D-pad controls for larger boards.
- Compact D-pad/action layout so cursor controls do not collide with the selected-cell action buttons on narrow mobile screens.
- Hidden future bonus/paid pack previews from the puzzle flow while the design moves away from stage paywalls toward the Pantry decoration economy.
- Added a deterministic random puzzle generator scaffold for Time Attack. Time Attack can now use generated rule-valid puzzles rather than memorized catalog puzzles.
- The spoon currency remains the existing temporary raster asset for now; no CSS replacement art was added. A proper reviewed currency asset is still required before the next release-art pass.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

### v0.1.49 Follow-up - Control Mode Startup Recovery

- Fixed a startup regression in the experimental control-mode slice: `controlMode` preference state and helpers are now initialized inside `renderApp()` so the app no longer renders a blank screen on local boot.
- Re-ran local runtime smoke in Playwright; the app shell renders and the brand intro reaches the game stage.
- Re-ran verification after the recovery: `node --check src\ui\appShell.js`, `npm run test -- --run`, `npm run build`, `npm run qa:assets`, and `npm run qa:mobile` all passed. `qa:assets` still reports the expected temporary spoon-token replacement warning.
- No Android/AAB build was produced; this remains an experimental local-development slice.


## Progress Update - 2026-07-03 v0.1.50 Focused Puzzle Shell

- Mode: `experimental`; Android AAB generation and Play upload work remain paused during the major UX/art rework.
- Bumped visible web version to v0.1.50 and package version to 0.1.50.
- Split puzzle solving into a focused play screen with its own header and back-to-list action, so larger boards and D-pad controls can use more vertical space.
- The main Puzzle tab now behaves as a picture-selection hub instead of embedding the full board inline with the stage list.
- Kept Pantry decoration and new reward art gated: no new CSS-drawn player-facing art was introduced in this slice. Real PNG/WebP assets are still required before reopening the decoration economy.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.


## Progress Update - 2026-07-03 v0.1.51 Cursor Layout Polish

- Mode: `experimental`; Android AAB generation and Play uploads remain paused during the major UX/art rework.
- Bumped visible web version to v0.1.51 and package version to 0.1.51.
- Tightened the focused puzzle D-pad layout so move buttons and selected-cell actions no longer collide on narrow screens.
- Action buttons now wrap safely and the D-pad scales down on small widths, preserving the focused puzzle-screen direction for larger boards and future Time Attack.
- Kept the art gate intact: no new CSS-drawn player-facing art was introduced. Pantry decoration, menu art, badge art, and final currency art still require reviewed raster assets before release use.
- Fixed the focused play-screen size label so it no longer risks mojibake display.
- Verification: `node --check src\ui\appShell.js`, `node --check src\ui\puzzleView.js`, `npm run test -- --run`, `npm run build`, `npm run qa:assets`, and `npm run qa:mobile` all passed. `qa:assets` still reports only the expected temporary spoon-token replacement warning.

## Progress Update - 2026-07-03 v0.1.52 Focused Play Text Safety

- Mode: `experimental`; Android AAB generation and Play uploads remain paused while the major UX/art rework continues in local web first.
- Bumped visible web version to v0.1.52 and package version to 0.1.52.
- Fixed the focused play-screen puzzle size label in code to use a stable ASCII `5x5` style label, removing the remaining mojibake path in the play header.
- Reconfirmed the current art gate: Pantry decoration, badge art, menu icons, and the final spoon/currency must remain behind real raster assets. No new CSS-drawn player-facing art should be added.
- Next action: continue the focused puzzle screen, larger-board controls, Time Attack random puzzle structure, and raster-asset pipeline without building a new AAB until local UX is reviewed.

## Progress Update - 2026-07-03 v0.1.53 Cursor Control Containment

- Mode: `experimental`; Android AAB generation and Play uploads remain paused while the major UX/art rework continues locally first.
- Bumped visible web version to v0.1.53 and package version to 0.1.53.
- Tightened the focused puzzle D-pad control layout again after narrow-screen feedback: the D-pad is smaller, action labels use safer sizing, and screens under 380px stack the D-pad above the two action buttons to prevent overlap.
- Kept the existing control-mode setting direction: Auto, Tap cells, and D-pad remain the planned choices for direct-touch vs cursor play.
- Reconfirmed the art boundary after failed/off-prompt image generation attempts: no newly generated off-prompt or CSS-drawn player-facing art is wired into the app. Pantry decoration, menu icons, badge art, and final currency art remain gated behind reviewed raster assets.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-04 v0.1.54 Economy Foundation

- Mode: `experimental`; no Android AAB was produced and Play uploads remain paused while the major economy/art/UX rework continues locally first.
- Bumped visible web version to v0.1.54 and package version to 0.1.54.
- Added `src/data/economyConfig.js` as the central economy configuration for puzzle rewards, stage completion bonuses, daily bonus, Time Attack rewards, record bonus, daily Time Attack limit, and future Cozy Pass spoon grant.
- Stage completion now grants a one-time stage bonus through `markPackCompletedIfFirst(pack)` and shows that bonus in the stage-complete overlay when earned.
- Daily recommendation bonus now reads from the shared economy config instead of a local magic number.
- Added Time Attack save/reward hooks (`recordTimeAttackResult`, best scores, daily counts) so the later seeded-random Time Attack mode can reward spoons and preserve personal records without wiring the UI yet.
- Updated starter and free pack metadata with size, unlock cost, and stage bonus values from the economy spec. This is foundation data only; the broader plan still moves monetization pressure toward Pantry decoration rather than harsh puzzle locking.
- Claude economy consultation has been considered: long-term retention needs many more puzzles, repeated Pantry expansion, Time Attack as a renewable challenge/reward source, and purchase options that accelerate decoration rather than replace play. These remain planned implementation work, not completed UI.
- The art gate remains strict: no new CSS-drawn player-facing decoration, badge, menu, or currency art was added. The current spoon token is still a temporary visible raster asset and must be replaced by reviewed production art.
- Verification: `node --check` passed for changed JS modules, `npm run test -- --run` passed 36 tests, `npm run build` passed, `npm run qa:assets` passed with only the expected temporary spoon-token warning, and `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


## Progress Update - 2026-07-04 v0.1.55 Pantry Art Approval Gate

- Mode: `experimental`; no Android AAB was produced and Play uploads remain paused while the major economy/art/UX rework continues locally first.
- Bumped visible web version to v0.1.55 and package version to 0.1.55.
- Added an explicit asset approval gate for Pantry decorations: `src/data/assetManifest.js` now exposes asset lookup/approval helpers, and every Pantry decoration is tied to an `assetId` that must be an approved visible `pantry-decoration` raster asset before it can be used.
- Updated save-layer behavior so `buyDecoration()` and `equipDecoration()` reject decoration records whose art is not approved. This prevents temporary CSS-style or candidate decoration art from becoming a real purchase/equip reward.
- Kept the Pantry feature intentionally paused in the UI. It now explains the future reward loop with text only: solve puzzles, earn spoons, finish stages, then decorate once reviewed item art is ready.
- Updated save tests to lock this behavior: candidate Pantry items cannot be bought or equipped until approved.
- Claude economy consultation has been read and folded into next actions: before reopening Pantry, Codex needs to settle the launch puzzle volume/size mix, Pantry room-1 slot and item counts, room expansion cadence, daily puzzle pool size, and whether repeat puzzle clears should ever pay a small long-tail reward.
- The art gate remains strict: no new CSS-drawn player-facing decoration, badge, menu, or currency art should be added. The current spoon token is still a temporary visible raster asset and must be replaced by reviewed production art.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.
- Verification: `node --check` passed for changed JS/i18n modules, `npm run test -- --run` passed 36 tests, `npm run build` passed, `npm run qa:assets` passed with only the expected temporary spoon-token warning, and `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.



## Progress Update - 2026-07-04 v0.1.56 Large-Board Control Stabilization

- Mode: `experimental`; no Android AAB was produced. Closed-test uploads remain paused while the local major UX/economy/art rework continues.
- Bumped visible web version to v0.1.56 and package version to 0.1.56.
- Tightened the large-board cursor control layout so the D-pad and action buttons no longer overlap on narrow mobile widths. Cursor actions now use shorter copy and responsive button sizing.
- Updated cursor guide copy to focus on the actual interaction: move with arrows, then choose color or blank.
- Added design decisions from the latest playtest and market review to the active rework plan: undo should remain free; larger boards should use limited hint bulbs instead of undo limits; Time Attack should use generated random nonogram boards; Pantry should progress through rooms/floors with purchase reveal effects; and all player-facing reward/menu/currency/decoration art must be real reviewed raster assets, not CSS compositions.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-04 v0.1.57 Hint-Bulb Rule Baseline

Mode: experimental gameplay rework. No Android AAB was produced.

Changes made:
- Added the first large-board hint rule: 10x10+ puzzles can expose a limited hint action instead of restricting undo.
- Hint use fills one correct unresolved cell first, then marks a definite blank if no fill target remains.
- Hint use is saved/restored with puzzle state and undo restores the hint count when undoing a hinted move.
- Added a simple text-only hint panel for now. The final bulb icon/effect must use reviewed raster art, not CSS-drawn art.

Decisions captured from Nyan Tower benchmark:
- Purchase/equip should eventually use a dimmed reveal scene, name banner, item spotlight, and placement animation.
- Pantry should become a multi-room or floor-like long-term progression surface, with decorations as the primary spoon sink.
- Larger boards should use direct touch or D-pad controls with line highlights, a selected square, and limited hints. Undo should remain forgiving.
- Time Attack should use seeded generated boards, not only existing catalog puzzles, so memorization does not break the mode.

Next actions:
- Build dedicated full-screen puzzle play surface so 12x12/15x15 boards have enough room.
- Replace hint button, floating menu, currency, decoration, badge, and tutorial visuals with approved raster art assets only.
- Add purchase/equip reveal animation after the Pantry art set is ready.

## Progress Update - 2026-07-04 v0.1.58 Cursor Control Containment And Pantry Art Gate

Mode: experimental local UX pass. No AAB was generated for this slice.

Changes:
- Bumped the visible/local version to v0.1.58.
- Added a final containment layer for cursor/D-pad controls so arrow keys and action buttons do not overlap on narrow play panels.
- Confirmed settings already expose Auto, direct tap, and D-pad control modes.
- Removed the default starter decoration from normalized save data so unapproved Pantry art cannot reappear through old default state.
- Reconfirmed the Pantry room remains paused until reviewed raster decoration assets are available. CSS/DOM-drawn decoration art must not be shown to players.

Context from Claude economy consultation:
- Long-tail spoon demand should come from Pantry decoration and expansion, not from blocking basic puzzle play.
- Fast players need renewable goals: daily puzzle pools, Time Attack records, room/floor expansion, and future decoration sets.
- Time Attack should use seeded/generated boards so memorized catalog puzzles do not undermine the mode.

Next actions:
- Build the focused puzzle screen as the primary large-board surface.
- Add generated Time Attack puzzle flow and local records.
- Replace temporary currency, badge, menu, tutorial, and Pantry visuals with approved raster assets before reopening Pantry.

### v0.1.58 Follow-up - Candidate Decoration Bundle Gate
- Removed direct runtime imports for hidden candidate Pantry decoration PNGs from src/data/decorations.js.
- Candidate decoration records remain in the asset manifest as backlog metadata only; they are not bundled or exposed until an asset is explicitly approved and made visible.
- This keeps the major-rework art rule intact: no player-facing Pantry/currency/badge/menu/tutorial reward art should ship from CSS placeholders or unapproved candidate images.

## Progress Update - 2026-07-04 v0.1.59 Time Attack Skeleton

Mode: experimental local gameplay rework. No Android AAB was generated.

Changes:
- Bumped the visible/local web version to v0.1.59 and package version to 0.1.59.
- Added a first Time Attack hub to the floating navigation. This starts a 3-round generated puzzle run, returns to the hub when the run ends, and records local best-run data.
- Kept Time Attack as a prototype shell for now: final timer pressure, leaderboard UX, reward tuning, and mode-specific art are still planned work.
- Reconfirmed the art rule after the Pantry/CSS-art regression: player-facing currency, decoration, badge, menu, reward, and tutorial visuals must use reviewed raster assets or remain text/hidden.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

Next actions:
- Move puzzle solving into a stronger focused play surface for large boards and Time Attack.
- Replace menu/currency/badge/tutorial/Pantry visuals with real approved raster assets.
- Add line-highlighting, selected-cell feedback, hint-bulb UX, and generated-board difficulty progression.



## Progress Update - 2026-07-04 v0.1.60 Cursor Feedback And Control Containment

- Kept this as experimental local rework only; no Android AAB was built for this pass.
- Bumped the visible/local web version to v0.1.60 and package version to 0.1.60.
- Added conservative cursor-control feedback: D-pad movement plays a light tick, while Color/Blank actions play a slightly stronger tick plus a very short haptic pulse when available.
- Tightened the cursor-control layout so the D-pad and selected-cell action buttons stay inside the puzzle panel on narrow screens.
- Reconfirmed the art rule for the major rework: visible reward/menu/currency/decoration art should come from real raster assets, not CSS-composed placeholder drawings.
- Deferred Android launcher behavior check: on the next Android build, verify whether Samsung/Game Launcher settings or manifest/category choices cause the app to appear only in a game folder instead of the normal home/app drawer path.

Next action:
- Continue focused play-screen polish, larger-board usability, Pantry raster-art pipeline, and generated Time Attack progression before producing another Android bundle.

## Progress Update - 2026-07-04 v0.1.61 Badge Art Gate Tightening
- Bumped the visible/local web version to v0.1.61 and package version to 0.1.61.
- Tightened the badge room art gate: badge cards no longer reuse stage preview art or CSS-tile mosaics as badge visuals. Until dedicated approved raster badge PNG assets exist, badge cards show the art-pending state only.
- Kept stage preview tile rendering gated behind `stageArt.js`; because no approved stage art is registered there yet, no reused stage artwork is exposed by default.
- This remains an experimental local rework slice only. Android AAB generation stays paused until the new art/economy/control direction is stable.


## Progress Update - 2026-07-04 v0.1.62 Cursor Control Layout Stabilization

- Mode: experimental local-development slice; Play/AAB upload remains paused during the major rework.
- Bumped visible web version to v0.1.62 and package version to 0.1.62.
- Tightened D-pad cursor controls so the direction pad and selected-cell action buttons do not overlap in narrow puzzle panels.
- Kept the existing Settings control-mode path intact: auto for big boards, direct tap, or D-pad mode.
- Reconfirmed the art boundary after another off-prompt image-generation attempt: bad generated images and CSS/DOM-drawn reward/menu/pantry/currency art must not be wired into player-facing screens.
- Next action: continue the focused puzzle-screen and large-board pass, then replace temporary currency/menu/badge visuals only with reviewed raster PNG/WebP assets.

### v0.1.63 - Soft Line Completion Guidance
- Added cursor-mode visual guidance: when the active row or column already has the clue-required number of filled cells, remaining empty cells in that line show a pale X suggestion.
- This is UI-only guidance and does not mutate puzzle state, preserving player agency while reducing friction on 10x10+ boards.
- Continued art policy: no new CSS-drawn player-facing art; decoration/art reward work remains gated until real raster assets are ready.

### v0.1.64 - Focused Puzzle Keyboard Controls

- Added keyboard support to the focused puzzle surface in cursor mode: arrow keys move the selected square, Space/Enter colors it, X/Backspace/Delete marks a blank, and Ctrl/Cmd+Z undoes the last move.
- Added tap feedback for direct board cell selection so both touch and cursor control paths provide immediate game feel.
- Preserved the no-new-CSS-art rule: this slice only changes interaction behavior and copy; raster art replacement remains a separate asset pipeline task.
- Verification: `node --check src\ui\puzzleView.js` and `npm run test -- --run` passed.
- Next action: continue focused play-screen polish for larger boards, hint UX, Time Attack pacing, and reviewed raster assets before any new Android bundle.


### v0.1.65 - Time Attack Timer And Scoring
- Added elapsed-time tracking to the experimental Time Attack run and saved local records with elapsed seconds plus a score derived from completed rounds and speed bonus.
- Time Attack remains local/experimental and continues to use generated puzzles rather than catalog puzzles.
- Verification: node syntax checks, unit tests, and production build passed before the v0.1.66 layout follow-up.

### v0.1.66 - Cursor Control Containment Follow-up
- Bumped the visible/local web version to v0.1.66 and package version to 0.1.66.
- Added the missing Time Attack timer readout to the focused play header.
- Added a final layout containment layer for D-pad controls so the direction pad and selected-cell action buttons fit inside narrow puzzle panels without overlapping.
- This remains experimental local rework only. No Android AAB was produced.

### v0.1.67 - Larger-board Hint Affordance
- Bumped the visible web version to v0.1.67 and package version to 0.1.67.
- Improved the larger-board hint panel so players can see used/available hints, understand that hints solve one sure square, and know undo remains free.
- Kept the hint visual as text/chrome only for now. Final bulb icon/effect still requires approved raster PNG/WebP art, per the no CSS player-art rule.
- Android AAB work remains paused during the experimental gameplay rework.

### v0.1.68 - Focused Play Settings Access
- Bumped the visible/local web version to v0.1.68 and package version to 0.1.68.
- Added a Settings button directly to the focused puzzle header so players can switch Auto, Tap cells, and D-pad modes without leaving the play surface.
- Added narrow-screen header containment for the new focused-play Settings button so the title, size chip, and controls do not overlap on mobile widths.
- Repaired Korean focused-play and Time Attack strings that could break syntax or show stale timer/score copy.
- This remains an experimental local rework slice. No Android AAB was generated, and no new CSS/DOM-drawn player-facing art was added.

### v0.1.69 - Focused Play Module Extraction
- Bumped the visible/local web version to v0.1.69 and package version to 0.1.69.
- Extracted the focused puzzle play surface from `src/ui/appShell.js` into `src/ui/playScreen.js` so appShell can stay closer to routing/state orchestration instead of absorbing more UI surface code.
- Kept the v0.1.68 focused-play Settings access, Time Attack timer header, daily bonus handling, and stage navigation behavior intact through the new module boundary.
- This is an experimental structural-containment slice only. No Android AAB was generated, and no new player-facing art was added.

### v0.1.70 - Puzzle Hub And Stage List Extraction
- Bumped the visible/local web version to v0.1.70 and package version to 0.1.70.
- Extracted the current-picture hub and stage/puzzle picker surface from `src/ui/appShell.js` into `src/ui/puzzleHubView.js`.
- Kept stage filtering, unlock cost display, approved-stage-art gating, art-pending fallback, and spoon reward chips intact through the new module boundary.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new CSS/DOM-drawn player-facing art was added.

### v0.1.71 - Completion Banner Routing Check
- Bumped the visible/local web version to v0.1.71 and package version to 0.1.71.
- Confirmed the completion screen is intentionally user-paced: after a card is complete, the preview waits for the player to choose Album or Next Picture instead of auto-advancing.
- Restored the focused-play completion `Album` route by passing the album-view callback through `playScreen.js`; `Next Picture` remains connected to the existing next-puzzle flow.
- Browser automation was blocked by the Windows sandbox ACL issue during this check, so verification used syntax checks, unit tests, production build, asset QA, and mobile visual QA.
- No Android AAB was generated, and no new player-facing art was added.

### v0.1.72 - Settings Dialog Extraction
- Bumped the visible/local web version to v0.1.72 and package version to 0.1.72.
- Extracted the Settings dialog from `src/ui/appShell.js` into `src/ui/settingsView.js`, keeping language, player name, sound, music, and control-mode settings intact.
- Removed the unused legacy view-tabs function from appShell now that floating navigation owns the main app navigation surface.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.73 - App Chrome Extraction
- Bumped the visible/local web version to v0.1.73 and package version to 0.1.73.
- Extracted shared app chrome from `src/ui/appShell.js` into `src/ui/appChrome.js`: header, footer, Pip strip, earned badge shelf, reset dialog, and shared spoon icon rendering.
- Kept the existing real raster spoon asset path and badge art-pending fallback intact; no CSS/DOM-drawn player-facing art was added.
- This continues the experimental structural-containment pass. No Android AAB was generated.

### v0.1.74 - UI Preference Module Extraction
- Bumped the visible/local web version to v0.1.74 and package version to 0.1.74.
- Extracted local UI preference helpers from `src/ui/appShell.js` into `src/ui/preferences.js`, including completed-stage visibility and control-mode persistence.
- This creates a small home for future onboarding/tutorial/settings flags without growing appShell again.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.75 - Daily Card And Stage Navigation Extraction
- Bumped the visible/local web version to v0.1.75 and package version to 0.1.75.
- Moved the Daily picture card renderer and stage-navigation model helper from `src/ui/appShell.js` into `src/ui/puzzleHubView.js`.
- This keeps puzzle-list and puzzle-hub UI together while leaving appShell focused on app state, view routing, and mode transitions.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.76 - Time Attack Flow Extraction
- Bumped the visible/local web version to v0.1.76 and package version to 0.1.76.
- Extracted Time Attack session creation, round advancement, result scoring, and elapsed-time calculation into `src/ui/timeAttackFlow.js`.
- Kept appShell responsible for view routing and active puzzle assignment while moving Time Attack rules out of the shell.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.77 - Time Attack Hub Expansion
- Bumped the visible/local web version to v0.1.77 and package version to 0.1.77.
- Expanded the Time Attack hub with compact summary cards for run plan, daily reward status, best run, richer record rows, and a last-result panel after a run.
- Saved Time Attack result metadata now returns score and elapsed seconds so the hub can show the just-finished run without recalculating UI state.
- This remains local experimental gameplay polish. No Android AAB was generated, and no new player-facing art was added.
- Verification: unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.78 - Puzzle Assist View Extraction
- Bumped the visible/local web version to v0.1.78 and package version to 0.1.78.
- Extracted the how-to-play visual guide, larger-board hint panel, hint limit rules, and mark-mode hint into `src/ui/puzzleAssistView.js`.
- Kept `src/ui/puzzleView.js` focused on puzzle state, board rendering, controls, cursor movement, progress, and completion flow.
- This creates a contained module for future tutorial/onboarding and hint UX expansion without growing the main puzzle surface file.
- This remains a local experimental structural slice. No Android AAB was generated, and no new player-facing art was added.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.79 - Puzzle Cursor Controls Extraction
- Bumped the visible/local web version to v0.1.79 and package version to 0.1.79.
- Extracted larger-board cursor mode decisions, D-pad rendering, selected-cell movement, and selected-cell fill/mark actions into `src/ui/puzzleCursorControls.js`.
- Kept keyboard routing in `src/ui/puzzleView.js` while moving cursor-specific behavior and UI into a focused module for future large-board control polish.
- This remains a local experimental structural slice. No Android AAB was generated, and no new player-facing art was added.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.80 - Pip Guided Dialogue Onboarding
- Bumped the visible/local web version to v0.1.80 and package version to 0.1.80.
- Added `src/ui/guideDialog.js`, a Pip-led raster-art dialogue overlay for first-time puzzle guidance and first-time Time Attack guidance.
- Generated and registered `src/assets/characters/pip-guide-scene-v1.png` as approved visible guide art in the asset manifest, keeping the guide player-facing art raster-backed instead of CSS/DOM-drawn.
- Added local save tracking for seen guide IDs so puzzle and Time Attack guides are remembered per player profile.
- Updated mobile visual QA to verify the guide dialog/art and dismiss it during first-run checks.
- Note: the current guide art is visually suitable but large at about 2.1 MB in the production bundle; next polish should downscale/convert it to WebP after visual approval.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed. Browser automation through the in-app browser plugin remained blocked by the Windows ACL issue, so verification used script-based Playwright/mobile QA instead.
- This remains local experimental gameplay/onboarding polish. No Android AAB was generated.

### v0.1.81 - Pip Character Continuity Correction
- Bumped the visible/local web version to v0.1.81 and package version to 0.1.81.
- Corrected the v0.1.80 guide art decision after user review: `pip-guide-scene-v1.png` was cute but not Pip, so it is now marked `rejected`, hidden from visible UI, and labeled `rejected-wrong-character` in the asset manifest.
- Switched the guide dialog back to established Sunny Spoon/Pip baseline raster art (`pip-cast-redesign-concept-v1-web.jpg`) via the approved `pip-cast-redesign-concept-v1-web-guide` manifest record.
- Added a Character Continuity Gate to `docs/ART_DIRECTION.md`: new character art must preserve Pip's approved chef-hat/scarf/capybara-helper identity and be checked against `CHARACTER_IP_BIBLE.md`, `src/data/characterIdentity.js`, and baseline assets before visible UI wiring.
- Strengthened `scripts/asset_manifest_check.js` so visible rejected identity assets fail QA and visible guide/reward character art must carry an approved Sunny Spoon continuity status.
- Verification: unit tests, production build, asset manifest QA, and mobile visual QA passed. The rejected guide image is no longer included in the production bundle.
- This remains a local experimental art-governance correction. No Android AAB was generated.

### v0.1.82 - Art Cohesion Reset Start
- Bumped the visible/local web version to v0.1.82 and package version to 0.1.82.
- Removed the inconsistent cast-sheet collage from the opening game identity screen. The first screen now avoids mixing the app-icon Pip with unrelated legacy/generated character-sheet art until a coherent Sunny Spoon/Pip key visual is approved.
- Added `docs/ART_REWORK_ROADMAP.md` as the art-system reset plan for a unified premium cozy Sunny Spoon Studios look across app icon, opening screen, guide dialogs, spoon currency, completion effects, badges, Pantry decorations, and navigation icons.
- Expanded `docs/ART_DIRECTION.md` with the whole-app art cohesion reset: the quality target is extreme cozy/cute polish with one consistent Pip identity, not convenient reuse of existing images.
- Updated mobile visual QA to fail if the old `.brand-intro__cast` image returns to the opening screen.
- Verification: unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.
- This remains a local experimental art-direction reset. No Android AAB was generated.

### v0.1.83 - Runtime Art Import Guard
- Bumped the visible/local web version to v0.1.83 and package version to 0.1.83.
- Strengthened `scripts/asset_manifest_check.js` so candidate/rejected/hidden-only asset paths fail QA if they are referenced by runtime source files.
- Added explicit manifest records for currently visible temporary Pip chrome and completion art: `pip-strip-sticker-v1-chrome` and `pip-complete-sticker-v1-completion`. These are allowed only as tracked temporary baseline debt and must be replaced during the coordinated Pip master art pass.
- Removed stale `.brand-intro__cast` CSS now that the inconsistent opening cast-sheet image is intentionally gone.
- Current art debt warnings are now explicit: spoon token, Pip strip/chrome, and Pip completion reaction all remain visible temporary assets to replace in the art reset.
- Verification: unit tests, production build, asset manifest QA, and mobile visual QA passed.
- This remains a local experimental art-pipeline hardening slice. No Android AAB was generated.

### v0.1.84 - Pip Master Art Candidate Intake
- Bumped the visible/local web version to v0.1.84 and package version to 0.1.84.
- Generated `src/assets/characters/pip-master-key-candidate-v1.png` as a first master Pip key visual candidate for the coordinated art reset.
- Registered the new image in `src/data/assetManifest.js` as `candidate`, `visible: false`, with `identityStatus: candidate-needs-character-review`; it is not wired into runtime UI.
- Added `docs/PIP_MASTER_ART_REVIEW.md` to record the candidate prompt intent, positives, and review concerns before any approval. Main concern: verify it does not drift toward a generic bear and can actually become the one consistent Pip style.
- Confirmed the candidate and the rejected guide scene do not enter the production bundle; only manifest audit references remain.
- Verification: asset manifest QA, production build, unit tests, mobile visual QA, and local dev-server HTTP check passed.
- This remains a local experimental art-candidate intake slice. No Android AAB was generated.

### v0.1.85 - Pip Master Art Review Board
- Bumped the visible/local web version to v0.1.85 and package version to 0.1.85.
- Added `docs/art-review/pip-master-review-v1.html` as a docs-only comparison board for current Pip baselines, rejected drift, and the hidden master candidate.
- Linked the board from `docs/PIP_MASTER_ART_REVIEW.md` so future art decisions compare against the same Pip identity criteria before runtime wiring.
- Kept the master candidate hidden and manifest-gated; no new player-facing character art was added in this slice.

### v0.1.86 - Korean Guide Copy Repair
- Bumped the visible/local web version to v0.1.86 and package version to 0.1.86.
- Repaired mojibake in Korean Pip guide dialog copy and large-board hint copy so first-run puzzle guidance, Time Attack guidance, and hint labels render as readable Korean.
- Added an i18n regression test that checks Korean guide/hint strings do not contain common mojibake markers.
- Kept the art master candidate hidden and manifest-gated; this slice changed copy quality, not visible character art.

### v0.1.87 - Time Attack Save Retention
- Bumped the visible/local web version to v0.1.87 and package version to 0.1.87.
- Addressed Claude Review 18's minor save-growth note by pruning `timeAttackDailyCount` to recent valid date keys during save normalization.
- Added save regression coverage so stale Time Attack daily-count keys and malformed date keys are removed while recent counts remain.
- Confirmed Claude Review 18's `createSpoonIcon` concern is already safe in `puzzleHubView.js` because the helper is local to that module and uses the raster spoon token.
- No Android AAB was generated; this remains an experimental local save-hygiene slice.

### v0.1.88 - Art-Gated Guide And Pantry QA
- Bumped the visible/local web version to v0.1.88 and package version to 0.1.88.
- Guarded `guideDialog.js` guide art rendering with the asset manifest approval check instead of relying only on a direct raster import.
- Strengthened `npm run qa:assets` so Pantry remains visibly paused and cannot expose shop/equip UI while there are no approved visible pantry-decoration assets.
- This addresses Claude Review 18's guide-art and Pantry placeholder concerns without exposing unapproved decoration art.
- No Android AAB was generated; this remains an experimental art-gate hardening slice.

### v0.1.89 - Spoon Token Candidate Intake
- Bumped the visible/local web version to v0.1.89 and package version to 0.1.89.
- Generated a new transparent golden spoon currency candidate at `src/assets/icons/spoon-token-candidate-v2.png` using built-in image generation plus local chroma-key removal.
- Registered `spoon-token-candidate-v2` in `src/data/assetManifest.js` as hidden `candidate` currency art; the live UI still uses the existing temporary `spoon-token-v1`.
- Added `docs/SPOON_TOKEN_ART_REVIEW.md` with prompt intent, technical validation, and the approval rule before any UI replacement.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.

### v0.1.90 - Runtime Manifest Isolation
- Bumped the visible/local web version to v0.1.90 and package version to 0.1.90.
- Moved guide and Pantry decoration runtime approval from full `assetManifest.js` registry imports to a small `src/data/runtimeArt.js` allowlist so hidden candidate asset records do not get bundled into production JS.
- Strengthened `npm run qa:assets` to fail if runtime files import `assetManifest.js` directly.
- Confirmed the new spoon candidate remains a hidden review asset and the live UI still uses `spoon-token-v1`.
- No Android AAB was generated; this remains an experimental art-pipeline hardening slice.

### v0.1.91 - Approved Spoon Token Runtime Swap
- Bumped the visible/local web version to v0.1.91 and package version to 0.1.91.
- Promoted the user-approved golden spoon candidate into optimized runtime art at `src/assets/icons/spoon-token-v2.png` after downscaling to 256x256 transparent RGBA.
- Switched header currency, daily reward, puzzle reward, stage unlock, and stage-complete bonus icon imports from `spoon-token-v1` to `spoon-token-v2`.
- Updated `src/data/assetManifest.js` so `spoon-token-v2` is approved visible currency art, while `spoon-token-v1` is hidden legacy audit art and `spoon-token-candidate-v2` is archived candidate source.
- Updated `docs/SPOON_TOKEN_ART_REVIEW.md` with the approval note and runtime asset details.
- No Android AAB was generated; this remains an experimental art-polish slice.


### v0.1.92 - Pip Chrome And Completion Candidate Intake
- Bumped the visible/local web version to v0.1.92 and package version to 0.1.92.
- Generated two new transparent Pip candidate assets for the coordinated character reset: `src/assets/characters/pip-chrome-candidate-v2.png` and `src/assets/characters/pip-completion-candidate-v2.png`.
- Registered both assets in `src/data/assetManifest.js` as hidden candidates with `identityStatus: candidate-needs-character-review`; neither is wired into runtime UI.
- Updated `docs/PIP_MASTER_ART_REVIEW.md` and `docs/art-review/pip-master-review-v1.html` so the current baselines, rejected drift, master candidate, chrome candidate, and completion candidate can be compared together before approval.
- Updated `docs/ART_ASSET_BACKLOG.md` to mark the spoon token replacement complete and add the active Pip character candidate queue.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.


### v0.1.93 - First Stage Reward Candidate Intake
- Bumped the visible/local web version to v0.1.93 and package version to 0.1.93.
- Generated and saved the first free-stage reward style sample at `src/assets/stage-rewards/pips-first-shelf-reward-candidate-v1.png`.
- Registered the reward art in `src/data/assetManifest.js` as a hidden `stage-reward-art-candidate`; `src/data/stageArt.js` remains empty, so no new runtime reward art is visible yet.
- Added `docs/STAGE_REWARD_ART_REVIEW.md` and `docs/art-review/stage-reward-review-v1.html` for review before approving any stage reward art.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.


### v0.1.94 - Approved Art Runtime Promotion
- Bumped the visible/local web version to v0.1.94 and package version to 0.1.94.
- Treated the newly generated high-polish art level as approved per user direction unless a specific correction is requested.
- Optimized and promoted Pip chrome, Pip completion reaction, and the first free-stage reward candidate into runtime assets: `pip-chrome-v2.png`, `pip-completion-v2.png`, and `pips-first-shelf-reward-v1.webp`.
- Switched `appChrome.js`, `pipReaction.js`, and `stageArt.js` to use the approved runtime assets while keeping candidate/source files archived in the manifest.
- Updated `src/data/assetManifest.js` so the old visible temporary Pip chrome/completion records are hidden legacy audit assets and the new assets are approved visible art.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.


### v0.1.95 - Free Stage Reward Art Set
- Bumped the visible/local web version to v0.1.95 and package version to 0.1.95.
- Generated, optimized, registered, and wired approved reward art for the remaining four free progression stages: Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry.
- Updated `src/data/stageArt.js` so all five free stage packs now have approved runtime reward art.
- Added source PNG archive records and optimized WebP runtime records to `src/data/assetManifest.js`.
- Updated stage reward review/backlog docs to mark the free-stage reward art set complete.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.


### v0.1.96 - Free Stage Badge Art Set
- Bumped the visible/local web version to v0.1.96 and package version to 0.1.96.
- Generated, circular-masked, optimized, registered, and wired approved collectible badge art for the five free progression stages.
- Added `src/data/badgeArt.js` and connected badge art into the badge shelf and Pantry Map badge collection cards.
- Replaced player-facing "art pending" badge placeholders with actual approved badge medals, while still dimming unearned/locked badges with progress labels.
- Updated `docs/ART_ASSET_BACKLOG.md` to mark free-stage badge art complete.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.

### Pantry Decoration Raw Intake - Pending Background Removal
- Generated and copied six high-polish Pantry decoration raw images into `src/assets/decorations/*-v2-raw.png`: starter counter cloth, sunny window curtains, recipe card shelf, mint check rug, soup pot display, and golden spoon sign.
- These raw images still have chroma-key backgrounds and are not runtime-safe yet. Do not wire them into `src/data/runtimeArt.js`, `src/data/decorations.js`, or `src/ui/pantryView.js` until background removal and alpha validation are complete.
- The next safe implementation step is to run chroma-key removal into `*-v2.png`, validate RGBA alpha/corners, then promote the approved decoration IDs into the runtime Pantry decoration allowlist.
- Pantry remains paused because `APPROVED_PANTRY_DECORATION_ASSET_IDS` is still empty.

### v0.1.97 - Pantry Decoration MVP Reopened
- Promoted six approved Sunny Spoon Pantry decoration artworks into runtime WebP assets and archived their raw/transparent sources in the manifest.
- Reopened the Pantry room/shop UI: approved decorations can be previewed in room slots, bought with spoons, and equipped per slot.
- Updated the save regression test from the old art-blocked behavior to the approved buy/equip flow, including an insufficient-spoons guard.
- Version bumped to v0.1.97; release gates now treat Pantry decoration art as approved visible raster assets instead of a paused placeholder surface.

### v0.1.98 - Pantry First Purchase Guide and Placement Guardrails
- Added a one-time Pip guide for the first successful Pantry decoration purchase using the existing guide persistence system.
- Clarified the current placement model in code and docs: fixed room slots, one equipped item per slot, auto-equip on purchase, owned items retained.
- Added Pantry placement, physical capacity, item-count, and spoon-economy guardrails to the economy design spec so future art/item batches are balanced against room space and monetization pacing.
- Version bumped to v0.1.98.

### v0.1.99 - Pantry Placement Affordances
- Added visible placement affordances to Pantry: each room slot is selectable, highlights the active placement region, and filters the shop to compatible decorations.
- Added slot labels to shop cards so players can see where each purchased item will appear before spending spoons.
- Added a room-capacity note showing decorated slots out of the five physical Pantry spots.
- Version bumped to v0.1.99.

### v0.1.100 - Pantry Economy Guardrails
- Aligned MVP Pantry decoration prices/rarities with the economy design spec: common items sit in the 18-60 range and cozy items now start at 80+.
- Extended `npm run qa:assets` to enforce Pantry slot validity, rarity cost ranges, approved visible decoration art, unique decoration IDs/assets, and at least one free starter decoration.
- Updated the save regression expectation for the new sunny-window-curtains cost.
- Version bumped to v0.1.100.

### v0.1.101 - Pantry Placement Mobile QA
- Extended `npm run qa:mobile` to navigate into Pantry and verify the room, slot filters, placement labels, selected slot state, and slot-specific shop filtering.
- The QA now checks default all-item state, counter slot filtering, window filter behavior, all-spots restoration, tap-target sizing, and horizontal overflow on mobile viewports.
- Version bumped to v0.1.101.

### v0.1.102 - Pantry First Purchase Callback Fix
- Fixed the Claude Review 19 bug where `onPantryFirstPurchase` was referenced inside `createShell` without being defined or passed from `draw()`.
- Reintroduced `requestPantryFirstPurchaseGuide()` and passed it through `createShell` so the first successful Pantry purchase opens Pip's one-time guide.
- Extended mobile QA to click the first Pantry decoration purchase and assert that the Pip guide overlay appears.
- Confirmed Review 19's stageArt and timeAttackDailyCount concerns are stale against current code: stage reward art is populated and time attack daily counts are pruned in `normalizeSave()`.
- Version bumped to v0.1.102.

### v0.1.103 - Opening Key Visual
- Generated, optimized, registered, and wired a new Sunny Spoon/Pip opening key visual into `brandIntro.js`.
- Replaced the app-icon-only first impression with a richer pantry scene while keeping title/studio text in UI for localization and avoiding generated text artifacts.
- Registered the source PNG and approved runtime WebP in `assetManifest.js`; asset QA now treats visible opening key visuals as character-continuity-gated art.
- Updated mobile visual QA to require the opening key visual image and continue blocking the old inconsistent cast collage.
- Version bumped to v0.1.103.


### v0.1.104 - Pantry Common Decoration Expansion
- Added four approved common Pantry decorations: Small Jam Jar, Herb Pot, Recipe Cork Board, and Tiny Succulent.
- Archived generated raw/transparent PNG sources and wired only optimized WebP assets into runtime decoration art.
- Extended Pantry shop data, approved runtime art gates, translations, asset manifest records, and mobile visual QA counts for the expanded 10-item shop.
- Version bumped to v0.1.104.


### Post-v0.1.104 - Review 20 QA Hardening
- Confirmed Claude Review 20 remaining stageArt and timeAttackDailyCount notes are stale against current code: all five free stage reward artworks are wired and time attack daily counts are already pruned by tests.
- Added an asset QA gate requiring every Pip Portrait/free-progression pack to have an approved visible stage-reward asset and a live stageArt.js runtime mapping.
- Kept app version at v0.1.104 because this is QA hardening only, with no user-visible UI or behavior change.


### v0.1.105 - Pantry Slot Decoration Set 15
- Added five approved common Pantry decorations: Spoon Wall Clock, Berry Tea Tins, Ribbon Rolling Pin, Sunny Flower Vase, and Woven Pantry Basket.
- Expanded the live Pantry shop from 10 to 15 decorations, with at least two choices in every physical room slot and additional mid-common price points.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.105.


### v0.1.106 - Pantry Cozy Decoration Goals
- Added five approved cozy Pantry decorations: Honey Cake Stand, Lace Window Lantern, Copper Cookie Tin, Plush Floor Cushion, and Framed Recipe Glow.
- Expanded the live Pantry shop from 15 to 20 decorations and added one higher-value cozy target for every physical room slot.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.106.


### v0.1.107 - Pantry Rare Decoration Goals
- Added five approved rare Pantry decorations: Golden Waffle Press, Stained Glass Suncatcher, Porcelain Spice Carousel, Pantry Delivery Cart, and Spoon Wall Tapestry.
- Expanded the live Pantry shop from 20 to 25 decorations and added long-term rare purchase goals across all five room slots.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.107.


### v0.1.108 - Pantry Rarity Filters
- Added Pantry shop rarity filters for starter, common, cozy, and rare decorations while preserving slot filters.
- Shop cards now show decoration grade next to price so the larger 25-item catalog is easier to scan.
- Updated mobile visual QA to require rarity filters and verify the rare filter count.
- Version bumped to v0.1.108.


### v0.1.109 - Pantry Availability Filters
- Added Pantry shop availability filters for All items, Can buy, and Owned so players can quickly find decorations that match their current spoon balance.
- Availability filters combine with existing slot and rarity filters, keeping the 25-item catalog scannable as the economy grows.
- Fixed the decoration card grade/price separator to render as a proper middle dot.
- Updated mobile visual QA to require availability filters and verify Can buy behavior at the seeded starter balance.
- Version bumped to v0.1.109.


### v0.1.110 - Pantry Filter Empty State

- Added a Pantry shop empty state for filter combinations with no matching decorations, including a clear reset-filters action.
- The empty state combines with slot, rarity, and availability filters so the larger decoration catalog never looks broken when a strict filter returns zero cards.
- Updated mobile visual QA to verify the rare + can-buy empty state and reset flow before purchasing the starter decoration.
- Version bumped to v0.1.110.


### v0.1.111 - Pantry Filter Summary

- Added a Pantry filter summary showing how many decorations match the current slot, rarity, and availability filters.
- Added a compact clear-filters action beside the summary so filtered catalog browsing can return to the full shop quickly.
- Updated mobile visual QA to require the summary and verify the rare-filter count.
- Version bumped to v0.1.111.


### v0.1.112 - Pantry Sort And Recommendation Badges

- Added Pantry shop sorting controls: recommended, low price, high price, and rare-first.
- Added item status badges so decorations communicate start-here, can-buy-now, save-for-later, owned, and on-display states before the purchase button.
- Recommended sorting now prioritizes the free starter item, currently affordable unowned items, save goals, owned items, and equipped decorations in a predictable order.
- Updated mobile visual QA to require sort controls/status badges and verify high-price sorting.
- Version bumped to v0.1.112.


### v0.1.113 - Pantry Placement Advisor

- Added a Pantry placement advisor under the room view so players can understand the fixed five-slot decoration model before buying.
- The advisor explains total catalog coverage in the all-spots view and, for a selected slot, shows compatible item count, owned count, and spoon price range.
- This directly supports the room-capacity and economy-planning guardrails: each physical spot now communicates how many items fit and how its price ladder grows.
- Updated mobile visual QA to verify the advisor and selected counter-slot guidance.
- Version bumped to v0.1.113.


### v0.1.114 - Pantry Savings Goal

- Added a Pantry savings-goal card that points players toward the next unowned decoration target and shows current spoon progress.
- The goal respects the selected room slot, so choosing counter/window/shelf/floor/back-wall reframes the economy around that physical placement area.
- This makes the decoration economy more legible: players can see what to solve puzzles for next and how many more spoons are needed.
- Updated mobile visual QA to require the savings goal and verify the seeded 3-spoon state points to the next 17-spoon gap.
- Version bumped to v0.1.114.


### v0.1.115 - Pantry Collection Progress

- Added a Pantry collection progress board that shows owned decorations out of the approved catalog and displayed room spots out of the five fixed placements.
- Added per-slot progress chips so players can see whether counter, window, shelf, floor, and back-wall choices are filling out evenly.
- This supports room-capacity balancing and helps future item-count decisions stay visible in the product UI instead of only in docs.
- Updated mobile visual QA to require the progress board and verify the seeded 0/25 catalog and 0/6 counter progress.
- Version bumped to v0.1.115.


### v0.1.116 - Pantry Item Savings Meters

- Added per-item spoon progress meters on unowned paid Pantry decorations so players can see saved spoons, total cost, and remaining gap directly on each card.
- This complements the global savings goal: the catalog now communicates both the next recommended target and per-decoration progress toward future purchases.
- Updated mobile visual QA to require item savings meters and verify seeded spoon progress text.
- Version bumped to v0.1.116.


### v0.1.117 - Pantry Placement Swap Notes

- Added per-card placement notes explaining whether a decoration will fill an empty room spot or replace the currently displayed item in that fixed slot.
- This makes the one-item-per-slot model visible before purchase/equip decisions, reducing ambiguity around where bought decorations go.
- Updated mobile visual QA to require swap/placement notes and verify the seeded empty-slot explanation.
- Version bumped to v0.1.117.


### Post-v0.1.117 Pantry Purchase QA Hardening

- Strengthened mobile visual QA after the first Pantry purchase: the test now verifies collection progress updates to 1/25, displayed-room progress updates to 1/5, and the counter slot becomes filled.
- Kept visible app version at v0.1.117 because this is QA coverage only, not a player-facing UI change.


### v0.1.118 - Pantry Display Plan

- Added a Pantry display-plan card that explains the selected room spot's current decoration state and the next matching upgrade target.
- The plan distinguishes all-room overview from slot-specific empty/filled placement, making the fixed five-slot decoration model clearer before purchase or equip decisions.
- Fixed the Pantry card grade/price separator back to the approved middle dot.
- Updated mobile visual QA to require the display-plan card in the all-room and counter-slot flows.
- Version bumped to v0.1.118.


### v0.1.119 - Pantry Browsing State Retention

- Preserved Pantry slot, rarity, availability, and sort selections across purchase/equip refreshes so players keep the room spot they were planning.
- Updated mobile visual QA to buy the starter counter decoration from a selected counter context and confirm the filled counter display plan remains visible after the first-purchase guide.
- Version bumped to v0.1.119.


### v0.1.120 - Pantry Purchase Feedback

- Added a Pantry action feedback card after decoration purchase/equip so the player sees the acquired item, placement result, and cozy room improvement immediately after the action.
- The feedback uses the approved runtime decoration art and keeps the existing slot-planning context intact.
- Updated mobile visual QA to require the starter counter purchase feedback after the first-purchase guide flow.
- Version bumped to v0.1.120.


### v0.1.121 - Pantry Earning Plan

- Added a Pantry earning-plan card that converts the next decoration's spoon gap into approximate starter-puzzle runs and daily-bonus runs using the shared economy config.
- This makes the puzzle -> spoons -> decoration loop more legible without introducing paid purchase prompts or hard gates.
- Updated mobile visual QA to require the earning plan and verify the seeded 17-spoon gap maps to about 6 starter puzzles or 2 daily-bonus runs.
- Version bumped to v0.1.121.


### v0.1.122 - Pantry Earning CTA

- Added a Play for spoons action to the Pantry earning-plan card, linking the decoration goal back to the puzzle view without introducing paid prompts or hard gates.
- Updated mobile visual QA to require the earning CTA alongside the spoon-run estimate.
- Version bumped to v0.1.122.


### v0.1.123 - Pantry Goal Tracking

- Added Track goal controls to unowned paid Pantry decorations so players can choose a desired item instead of only following the cheapest next target.
- Savings goal and Spoon plan now prioritize the tracked decoration when it matches the current room-slot context, and tracking a card moves the Pantry context to that item's physical slot.
- Updated mobile visual QA to track Golden Waffle Press and verify the spoon plan retargets to its 357-spoon gap.
- Version bumped to v0.1.123.


### v0.1.124 - Replay Reward Guardrails

- Locked the new economy direction into implementation: ordinary replay remains unpaid, while future Pip Replay Picks can award only tiny controlled rewards.
- Added save-layer replay reward guardrails: completed puzzle required, Pip-picked flag required, clean-solve flag required, one reward per puzzle per day, and a daily cap of 3 replay rewards.
- Added tests proving replay rewards cannot be farmed by repeatedly solving the same memorized picture.
- Version bumped to v0.1.124.


### v0.1.125 - Replay Picks Hub Surface
- Added deterministic Pip replay picks for completed, unlocked pictures so replay economy now has a visible daily surface before full challenge replay mode.
- Puzzle hub now shows a cozy replay picks card with today count/limit and review actions; the copy explicitly frames replay rewards as limited Pip-picked challenges, not unlimited farming.
- Added replay pick unit coverage and mobile visual QA expectations for the card after a seeded completed puzzle.
- Version bumped to v0.1.125.


### v0.1.126 - Replay Challenge Session
- Replay Picks now open an ephemeral replay challenge board instead of the completed saved puzzle state.
- Replay challenge completion can call the existing replay reward guard, awarding only Pip-picked clean runs and leaving canonical album/progression saves untouched.
- Clean replay is broken by any wrong filled cell during the run or by hint use; the player may still finish for practice.
- Version bumped to v0.1.126.


### v0.1.127 - Replay Clean Undo Guard
- Addressed Claude Review 22 follow-up: replay clean status is now an explicit cumulative tracker.
- A wrong filled cell permanently breaks the clean replay bonus for that run even if the move is undone.
- Hint use also permanently breaks the clean replay bonus for that run even if the hint move is undone and the visible hint count returns to zero.
- Version bumped to v0.1.127.


### Art Direction Note - 2026-07-06 Shared Sunny Spoon Identity
- User direction: the current coordinated art reset must cover the full first impression sequence: app icon, Sunny Spoon Studios screen, and game start screen.
- Sunny Spoon Studios should be treated as a reusable studio brand layer for future games, not a splash made only for Pip's Picture Pantry.
- The game start screen may be Pip/Pantry-specific, but it must visually match the app icon and studio bumper through character proportions, palette, lighting, outline weight, and premium cozy polish.
- Added this requirement to docs/ART_DIRECTION.md and docs/ART_REWORK_ROADMAP.md; no runtime version bump because this is planning/context only.

### v0.1.128 - Reusable Sunny Spoon Studios Bumper Art
- Generated and promoted a reusable Sunny Spoon Studios bumper image for the first launch stage.
- Replaced the CSS-only studio bumper mark with approved raster art guarded by `runtimeArt.js`; the image has no embedded text and avoids Pip/Pantry-specific props so it can scale to future Sunny Spoon titles.
- Runtime uses optimized `src/assets/brand/sunny-spoon-studios-bumper-v1.webp`; the generated PNG source is archived in the asset manifest.
- Mobile visual QA now checks the studio bumper image directly instead of the old CSS text mark.
- Version bumped to v0.1.128.

### v0.1.129 - Pantry Story Request Benchmark Pass
- User benchmark: decoration/shop flow should feel like a small story request, not only a utility purchase.
- Added a first Pantry request card above the shop so the starter counter item is framed as Pip's first room request.
- The request card guides the player to the relevant slot/filter and can later expand into authored request chains, character reactions, and reward moments.
- Version bumped to v0.1.129.


### v0.1.130 - Pantry Story Milestone

- Extended the first Pantry request into a small story milestone: after Pip's first counter request is placed, the Pantry now shows a room-level/bond card and previews the next three affordable decoration goals.
- Kept the implementation as a UI/story layer on top of existing owned/equipped decoration state, avoiding a save-schema change while the benchmarked story loop is still being shaped.
- Added Korean/English i18n keys and a regression check so the milestone copy does not fall back to English in Korean mode.
- Version bumped to v0.1.130.


### v0.1.131 - Pantry Delivery Note Goal

- Extended the Pantry story loop again: tapping a next-arrival decoration now pins a Pip delivery note with the target item, room slot, remaining spoon need, and a direct goal CTA.
- Kept this as view-level story state, not a save migration, so the delivery-note interaction can evolve before becoming durable task data.
- Added Korean/English i18n coverage and mobile QA coverage for the delivery-note surface.
- Version bumped to v0.1.131.


### v0.1.132 - Pantry Story Card Split And Delivery Completion

- Split the Pantry story request, milestone, and delivery-note renderers out of pantryView.js into src/ui/pantryStoryCards.js, reducing pantryView.js from 938 lines to under 800 lines.
- Added a delivery-complete feedback path: if the current delivery-note target is bought or equipped, the Pantry shows a dedicated Delivery complete celebration instead of generic purchase feedback.
- Extended i18n and mobile visual QA to cover the delivery-complete story feedback.
- Version bumped to v0.1.132.

### v0.1.133 - Pantry Shop Progressive Reveal

- Addressed the Review 23 mobile-scroll caution by changing the Pantry shop to reveal the first 6 prioritized decoration cards by default, then expose additional cards through a Show more decorations control.
- Filter, sort, slot, story-goal, and reset actions now return the shop to the focused 6-card reveal so the player sees the most relevant choices before scanning the whole catalog.
- Added i18n, styling, and mobile visual QA coverage for the 6/25 progressive reveal and 12-card expansion flow.
- Version bumped to v0.1.133.

### v0.1.134 - Pantry Planning Deck

- Addressed the Review 24 remaining concern about upper Pantry support cards stacking independently by grouping display plan, savings goal, earning plan, placement advisor, and room progress into a single `pantry-planning-deck`.
- Added mobile visual QA coverage that verifies the planning deck groups exactly 5 support-card mounts while preserving the existing story request, milestone, delivery note, and progressive shop flow.
- Confirmed the Review 24 `stageArt.js` pending note is stale against current code: all five free stage reward artworks are already wired through `approvedStageArtUrls`.
- Version bumped to v0.1.134.

### v0.1.135 - Durable Pantry Delivery Goal

- Promoted the Pantry delivery-note target from view-only state into the save layer as `pantryStoryGoalId`.
- Added `getPantryStoryGoalId`, `setPantryStoryGoalId`, and `clearPantryStoryGoalId`; purchasing or equipping the target decoration now clears the saved delivery goal automatically.
- Pantry view now restores the pinned delivery note from save after reload, and mobile visual QA verifies the Small Jam Jar delivery note survives a page reload before completion.
- Version bumped to v0.1.135.


### v0.1.136 - Pantry Delivery Completion History
- Added save-backed Pantry delivery completion history as `pantryCompletedStoryGoalIds`, plus helpers for reading, checking, and recording completed story requests.
- Updated Pantry purchase/equip completion so a matched delivery target now clears `pantryStoryGoalId` and records the completed decoration id exactly once.
- Extended save tests and mobile visual QA to verify that the Small Jam Jar delivery completion survives as save-state history after the story-complete feedback.
- Version bumped to v0.1.136.


### v0.1.137 - Pantry Request Completion Archive
- Added a Pantry request-log card that appears after completed delivery requests and shows the recent completed decoration goals.
- Wired the card to the v0.1.136 `pantryCompletedStoryGoalIds` save history, making completed requests visible instead of silently disappearing after fulfillment.
- Extended mobile visual QA to verify the Small Jam Jar request appears in the completed request log after story completion.
- Version bumped to v0.1.137.


### v0.1.138 - Pantry Room Step Progress
- Added a next-room-step progress meter to the Pantry request log, using completed delivery request counts as the first visible chapter-progress signal.
- The first completed delivery now shows 1/3 requests toward the next room step, preparing the Pantry loop for story/chapter gating and economy pressure.
- Extended Korean i18n and mobile visual QA to cover the new room-step progress text.
- Version bumped to v0.1.138.

### v0.1.139 - Pantry Story Stage Gate
- Added a Pantry room-step gate to unlockable puzzle packs: Sunny Spoon Sign now requires 3 completed Pantry delivery requests, Apron Drawer 6, Bakery Window 10, and Village Pantry 10.
- canUnlockPack() and unlockPack() now both require the room-step condition, while already-unlocked packs remain playable for save compatibility.
- Locked stage cards now show the Pantry room progress requirement alongside the spoon cost, making the economy pressure visible instead of hidden.
- Mobile QA now checks that the first locked stage explains the Pantry story requirement (0/3, Need pantry story).
- Version bumped to v0.1.139.

Validation planned: unit tests, asset QA, production build, local HTTP smoke, and mobile visual QA.

### v0.1.140 - Badge Map Gate Clarity
- Badge/map locked cards now reuse the Pantry room-step requirement helper, so locked future badges explain the same story gate as the puzzle list.
- Mobile QA now checks that locked badge cards show Pantry room progress (0/3) instead of only a generic locked state.
- Version bumped to v0.1.140.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.

### v0.1.141 - Stage Gate Pantry Action
- Locked puzzle stage cards now include a Go to Pantry action when the Pantry room-step gate is not met.
- The action routes directly to the Pantry view, keeping the progression loop actionable instead of only descriptive.
- Mobile QA now checks that the first locked stage includes the Pantry action copy.
- Version bumped to v0.1.141.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.

### Direction Note - Puzzle Scale Correction
- Clarified the puzzle-volume strategy: do not treat 1,000 puzzles as a fixed launch promise. The product direction is to provide as many high-quality curated puzzles as possible across launch and future updates.
- Launch count should be determined by readiness: puzzle quality, art consistency, QA coverage, performance, Pantry/story gates, and spoon economy balance.
- Puzzle quantity remains a competitive advantage, but each catalog puzzle still needs strong design, recognizable cozy imagery, appealing color sensibility, and logical solvability.

### v0.1.142 - Pantry Stage Goal
- Pantry request-log progress now names the next puzzle stage unlocked by Pantry story progress.
- After the first completed delivery, the archive explains that 2 more requests are needed to open Sunny Spoon Sign, making the stage gate actionable inside the Pantry loop.
- Mobile QA now verifies the next-stage goal text and card.
- Version bumped to v0.1.142.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.143 - Stage Art QA Guard
- Confirmed the earlier Review note about empty `stageArt.js` is stale: the five free-stage reward artworks are wired into runtime previews.
- Strengthened mobile visual QA so stage previews must render approved tile mosaics and must not fall back to pending-art placeholders.
- Version bumped to v0.1.143.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.144 - Pantry Archive Next Request
- Completed Pantry request logs now include a next Pip request CTA that pins the next unowned decoration into the existing delivery-note flow.
- This keeps the benchmark-inspired request loop moving from completed request -> next request without adding a separate save schema.
- Version bumped to v0.1.144.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.145 - Pantry Room Chapter Signal
- Pantry request logs now show a room chapter card derived from completed delivery requests, making the request count feel like authored room progression rather than only a numeric gate.
- Mobile QA verifies the first completed delivery shows Chapter 2 progress alongside the next stage and next Pip request CTA.
- Version bumped to v0.1.145.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.146 - Pantry Stage Spoon Gate
- Pantry request logs now show both requirements for the next puzzle stage: completed Pip requests and saved spoons.
- This removes the misleading impression that request count alone opens a gated stage and better exposes the intended decoration/economy pacing.
- Version bumped to v0.1.146.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.147 - Legacy Unlockable Dot Cleanup
- Removed the stale `puzzle-chip[data-access="unlockable"]::after` CSS rule from early unlock-gate experiments.
- Current pack locking uses stage cards, Pantry gates, and explicit unlock panels, so the old dot marker was dead styling and could confuse future UI work.
- Version bumped to v0.1.147.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, mobile visual QA, and legacy CSS absence check.

### v0.1.148 - Source Hygiene QA Guard
- Added `npm run qa:hygiene` to block UTF-8 BOMs in source files and catch the removed legacy unlockable puzzle-chip dot rule if it returns.
- This keeps old review cleanup items guarded by automation instead of relying on manual search before release.
- Version bumped to v0.1.148.

Verification after this slice: `node --check scripts\\source_hygiene_check.js` passed; `npm run test -- --run` passed 51 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932. `npm run qa:hygiene` was added but its direct run was blocked by the current Codex usage/ACL gate, so it remains the one pending direct command check.

### v0.1.149 - Pack Size Contract
- Added puzzle data regression coverage requiring every progression pack's declared board size to match the maximum board size it actually ships.
- Corrected the current pack metadata so Apron Drawer declares 8x8 and the mixed late-stage Bakery Window/Village Pantry packs declare their current 10x10 maximum instead of future 12x12/15x15 ambitions.
- This turns the 10x10+ content-scale direction into a concrete data contract before adding more late-stage puzzle volume.
- Version bumped to v0.1.149.

Verification after this slice: targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.150 - Puzzle Scale Test Flex
- Replaced hardcoded puzzle distribution checks with scalable catalog contracts: at least 100 free progression puzzles, at least five progression packs, at least 20 puzzles per progression pack, and larger boards only inside packs declared for larger boards.
- This removes the test bottleneck called out in Review 26 before the next authored puzzle expansion pass.
- Version bumped to v0.1.150.

Verification after this slice: `node --check tests\\puzzleData.test.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.151 - First 12x12 Catalog Puzzle
- Added the first authored 12x12 catalog puzzle, `Bakery Window Glow`, to the Bakery Window progression pack.
- Raised Bakery Window's declared board size to 12 now that it actually ships a 12x12 board, keeping the v0.1.149 pack-size contract honest.
- Extended puzzle data tests so the free progression catalog must now include at least one 12x12 puzzle and at least 101 free puzzles.
- Version bumped to v0.1.151.

Verification after this slice: `node --check tests\\puzzleData.test.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


### v0.1.152 - 12x12 Mobile QA Path
- Extended mobile visual QA to seed Bakery Window access, open the authored 12x12 `Bakery Window Glow` catalog puzzle, and verify the focused play screen renders 144 cells.
- The QA now also checks the 12x12 board CSS variable, hint panel, cursor controls, and horizontal overflow across the standard mobile viewport set.
- Version bumped to v0.1.152.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 including the 12x12 Bakery Window Glow focused-play path.

### v0.1.153 - 12x12 Bakery Mini Batch
- Added two more authored 12x12 Bakery Window catalog puzzles, `Croissant Tray` and `Tiered Cakes`, so the larger-board path is now a small batch instead of a single proof card.
- Raised puzzle data contracts from one 12x12 free puzzle to at least three, and kept the free progression catalog minimum aligned at 103 puzzles.
- Extended mobile visual QA so the Bakery Window unlocked catalog must expose at least three 12x12 puzzle chips before opening the focused 12x12 play screen.
- Version bumped to v0.1.153.

Verification after this slice: `node --check tests\\puzzleData.test.js`, `node --check scripts\\mobile_visual_check.js`, and `node --check src\\data\\puzzles.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the three-card 12x12 Bakery Window catalog check.


### v0.1.154 - Intro And Settings Polish
- Replaced the opening screen's small seal image with the current Pip chrome character asset so the first screen no longer mixes the new key visual with the old app-icon crop.
- Restyled the opening start/name buttons with a warmer pressed game-button treatment that better matches the cozy key visual.
- Polished the settings dialog surface and option buttons so Korean labels wrap cleanly and the audio/control toggles feel less like flat placeholder UI.
- Version bumped to v0.1.154.

Verification after this slice: `node --check src\\ui\\brandIntro.js` and `node --check src\\ui\\settingsView.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; Playwright visual capture found 0 overflowing opening/settings controls and reduced the settings dialog height from about 808px to about 731px on 390x844; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


### v0.1.155 - First-Impression QA Guard
- Added mobile visual QA coverage for the opening screen's Pip seal and polished start button treatment so future icon swaps do not accidentally restore the old app-icon crop or flat button styling.
- Added settings-dialog polish QA to catch overflowing controls and excessive modal height on mobile viewports.
- Version bumped to v0.1.155.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the opening seal/start-button and settings-dialog polish guards active.

### v0.1.156 - Opening Seal Asset Guard
- Added asset-manifest QA rules so `brandIntro.js` cannot silently return to the old app-icon crop for the opening seal.
- The guard now requires the current approved `pip-chrome-v2` character art and an explicit `pipSealUrl` import path, making the final icon swap easier to update deliberately.
- Version bumped to v0.1.156.

Verification after this slice: `node --check scripts\\asset_manifest_check.js` passed; `npm run qa:assets` passed with 122 assets; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.157 - Tactile Button System Polish
- Added a shared tactile button treatment across common gameplay buttons, puzzle chips, floating navigation, and Pantry secondary actions so the main UI better matches the polished opening screen.
- Preserved the existing 44px+ tap target contract while adding subtle gradient depth, pressed states, and active-state color consistency.
- Version bumped to v0.1.157.

Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.158 - App Chrome Polish
- Polished the top header as a framed app chrome surface so the title, spoon counter, settings, and reset controls feel like one designed game HUD rather than loose buttons.
- Refined the floating navigation menu panel to match the tactile button system with a warmer surface, stronger elevation, and safer compact sizing.
- Version bumped to v0.1.158.

Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.159 - App Chrome QA Guard
- Added mobile visual QA coverage for the polished app header/HUD treatment and floating navigation panel layout.
- The guard now checks top-bar elevation/radius treatment, currency pill sizing, and floating nav panel viewport containment.
- Version bumped to v0.1.159.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the app chrome polish guard active; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK.
### v0.1.160 - Completion Reward Polish
- Reward and completion moments now have a richer cozy surface layer: completion banners use the approved Pip completion sticker in a framed reward card, solved reveals have stronger presentation, and action spacing matches the newer tactile button system.
- Stage completion overlays now have a dedicated modal/card treatment instead of relying on generic button styling only.
- Version bumped to v0.1.160.
### v0.1.161 - Reward Polish QA Guards
- Added mobile visual QA guards for the solved completion banner: Pip sticker sizing, reveal square, action width, radius, and gradient treatment are now checked across supported mobile widths.
- Added a lightweight stage-complete reward card CSS fixture check so the stage reward overlay keeps its dedicated cozy modal treatment while the real gameplay trigger evolves.
- Version bumped to v0.1.161.
### v0.1.162 - Settings Dialog Polish
- Settings modal styling now matches the tactile Sunny Spoon UI system: warmer framed surface, softer section grouping, stronger active states, and cleaner player-name/audio controls.
- Kept existing settings behavior unchanged while improving the mobile first impression noted in preview feedback.
- Version bumped to v0.1.162.
### v0.1.163 - Settings Polish QA Guard
- Mobile visual QA now checks settings dialog polish metrics directly: modal radius/gradient, active language button treatment, input sizing, and close button treatment.
- This closes the v0.1.162 follow-up so the settings screen cannot quietly regress to a flat temporary form.
- Version bumped to v0.1.163.
### v0.1.164 - iOS Safe Area Chrome Guard
- Added `viewport-fit=cover` and safe-area-aware app-shell padding so the top HUD is protected on notched iOS devices.
- Mobile visual QA now checks the viewport meta and shell/top-bar spacing contract across supported preview widths.
- Version bumped to v0.1.164.
### v0.1.165 - Replay Picks Polish
- Replay Picks now uses the newer cozy card surface, count pill, tactile replay buttons, and stronger active state so the replay loop feels intentional rather than placeholder-like.
- Mobile visual QA now checks replay card/button radius, gradients, count pill treatment, and horizontal containment.
- Version bumped to v0.1.165.
### v0.1.166 - Album And Map Polish
- Album and Map screens now share the current cozy/tactile surface system: framed panels, warmer album stamps, badge cards, progress strip, and next-badge card treatment.
- Mobile visual QA now guards album/map panel radius, gradients, stamp/token sizing, and horizontal containment.
- Version bumped to v0.1.166.
### v0.1.167 - 12x12 Bakery Content Batch 2
- Added two more authored Bakery Window 12x12 catalog puzzles: `Macaron Box` and `Cocoa Tin`.
- Raised puzzle data contracts from at least three to at least five 12x12 free progression puzzles, and raised the free catalog floor to 105.
- Mobile visual QA now requires at least five 12x12 Bakery catalog chips before opening the focused 12x12 play path.
- Version bumped to v0.1.167.
### v0.1.168 - Village Pantry 10x10 Content Batch
- Added two more authored Village Pantry 10x10 puzzles: `Market Basket` and `Garden Window`.
- Raised the free catalog floor from 105 to 107 while keeping the new content inside the existing 10x10 late-stage progression pack.
- Version bumped to v0.1.168.
### v0.1.169 - Village Pantry 10x10 Content Batch 2
- Added two more authored Village Pantry 10x10 puzzles: `Picnic Cloth` and `Flower Cart`.
- Raised the free catalog floor from 107 to 109 while keeping the new content in the existing late-stage 10x10 progression lane.
- Version bumped to v0.1.169.

### v0.1.170 - 12x12 Bakery Content Batch 3
- Added two more authored Bakery Window 12x12 puzzles: `Honey Jar Shelf` and `Berry Tart`.
- Raised large-board/free-catalog contracts from 5 to 7 Bakery 12x12 cards and from 109 to 111 free puzzles.
- Version bumped to v0.1.170.

### v0.1.171 - Puzzle Catalog Report Guard
- Added `scripts/puzzle_catalog_report.js` and `npm run qa:catalog` to summarize pack counts, size distribution, free-puzzle volume, 10x10+ boards, and 12x12+ boards before larger content expansion.
- Added a regression test for the report so the launch catalog floor, Bakery 12x12 count, and Village Pantry large-board count stay visible during future puzzle-growth slices.
- Version bumped to v0.1.171.

### v0.1.172 - Village Pantry 10x10 Content Batch 3
- Added two more authored Village Pantry 10x10 puzzles: `Tea Tray` and `Jam Crate`.
- Raised free-catalog and catalog-report contracts to 113 free puzzles and 12 Village Pantry large-board puzzles.
- Version bumped to v0.1.172.

### v0.1.173 - Village Pantry Mobile Catalog Guard
- Extended mobile visual QA so the unlocked Puzzle Hub must expose at least 12 Village Pantry 10x10 chips.
- This protects the v0.1.168, v0.1.169, and v0.1.172 Village Pantry content batches from disappearing behind catalog UI changes.
- Version bumped to v0.1.173.

### v0.1.174 - 12x12 Bakery Content Batch 4
- Added two more authored Bakery Window 12x12 puzzles: `Pie Lattice` and `Cookie Jar Row`.
- Raised large-board/free-catalog contracts to 9 Bakery 12x12 cards and 115 free puzzles.
- Version bumped to v0.1.174.

### v0.1.175 - Village Pantry 10x10 Content Batch 4
- Added two more authored Village Pantry 10x10 puzzles: `Flour Sack` and `Spice Rack`.
- Raised free-catalog and catalog-report contracts to 117 free puzzles and 14 Village Pantry large-board puzzles.
- Version bumped to v0.1.175.

### v0.1.176 - 12x12 Bakery Content Batch 5
- Added two more authored Bakery Window 12x12 puzzles: `Scone Basket` and `Milk Glass`.
- Raised large-board/free-catalog contracts to 11 Bakery 12x12 cards and 119 free puzzles.
- Version bumped to v0.1.176.

### v0.1.177 - Village Pantry 10x10 Content Batch 5
- Added two more authored Village Pantry 10x10 puzzles: `Hanging Herbs` and `Checkered Napkin`.
- Raised free-catalog and catalog-report contracts to 121 free puzzles and 16 Village Pantry large-board puzzles.
- Version bumped to v0.1.177.

### v0.1.178 - 12x12 Bakery Content Batch 6
- Added two more authored Bakery Window 12x12 puzzles: `Cinnamon Rolls` and `Cup Stack`.
- Raised large-board/free-catalog contracts to 13 Bakery 12x12 cards and 123 free puzzles.
- Version bumped to v0.1.178.

### v0.1.179 - Village Pantry 10x10 Content Batch 6
- Added two more authored Village Pantry 10x10 puzzles: `Candle Shelf` and `Wicker Tray`.
- Raised free-catalog and catalog-report contracts to 125 free puzzles and 18 Village Pantry large-board puzzles.
- Version bumped to v0.1.179.


### v0.1.180 - Village Pantry Translation Metadata Guard
- Added titleKey metadata and English/Korean puzzle copy for the six recent Village Pantry 10x10 additions: Flour Sack, Spice Rack, Hanging Herbs, Checkered Napkin, Candle Shelf, and Wicker Tray.
- Added regression guards so late-stage Village Pantry catalog names stay translated in album/list surfaces instead of falling back to raw English titles.
- Version bumped to v0.1.180.


### v0.1.181 - Large-Board Translation Metadata Guard
- Added titleKey metadata and English/Korean puzzle copy for all remaining 10x10+ free progression puzzles.
- Added a regression guard so every large-board free puzzle must have translated catalog metadata before future puzzle-volume expansion continues.
- Version bumped to v0.1.181.


### v0.1.182 - Catalog Metadata QA Guard
- Extended `npm run qa:catalog` so every 10x10+ free progression puzzle must carry its expected titleKey and English/Korean title/imageName copy.
- Added a regression test with synthetic bad catalog data so missing large-board metadata now fails as a catalog warning before future puzzle batches ship.
- Version bumped to v0.1.182.


### v0.1.183 - 12x12 Bakery Content Batch 7
- Added two more authored Bakery Window 12x12 puzzles: `Lemon Tart` and `Sugar Duster`.
- Raised free-catalog, large-board, Bakery 12x12, catalog-report, and mobile catalog visibility contracts to 127 free puzzles, 37 large boards, and 15 Bakery 12x12 cards.
- Version bumped to v0.1.183.


### v0.1.184 - Village Pantry 10x10 Content Batch 7
- Added two more authored Village Pantry 10x10 puzzles: `Pickle Crocks` and `Bread Board`.
- Raised free-catalog, large-board, Village Pantry large-board, catalog-report, and mobile catalog visibility contracts to 129 free puzzles, 39 large boards, and 20 Village Pantry 10x10 cards.
- Version bumped to v0.1.184.


### v0.1.185 - 12x12 Bakery Content Batch 8
- Added two more authored Bakery Window 12x12 puzzles: `Pretzel Twist` and `Berry Jam Pot`.
- Raised free-catalog, large-board, Bakery 12x12, catalog-report, and mobile catalog visibility contracts to 131 free puzzles, 41 large boards, and 17 Bakery 12x12 cards.
- Version bumped to v0.1.185.


### v0.1.186 - Village Pantry 10x10 Content Batch 8
- Added two more authored Village Pantry 10x10 puzzles: `Copper Ladle` and `Potato Sack`.
- Raised free-catalog, large-board, Village Pantry large-board, catalog-report, and mobile catalog visibility contracts to 133 free puzzles, 43 large boards, and 22 Village Pantry 10x10 cards.
- Version bumped to v0.1.186.


### v0.1.187 - Puzzle Batch Intake Guard
- Added `scripts/puzzle_batch_intake.js` so future authored/generated puzzle batches can be checked before they enter the main catalog.
- The intake guard validates duplicate ids, pack max board size, solution dimensions, binary rows, and 10x10+ free puzzle titleKey/i18n metadata.
- Added `npm run qa:batch` and regression coverage for both accepted and rejected candidate batches.
- Version bumped to v0.1.187.

### v0.1.188 - Village Pantry 10x10 Batch
- Added 2 Village Pantry 10x10 progression puzzles: Tea Tin Stack and Market Basket.
- Raised large-board and mobile catalog guard thresholds so the new content is protected by regression checks.
- Version bumped to v0.1.188.

### v0.1.189 - Bakery Window 12x12 Batch
- Added 2 Bakery Window 12x12 progression puzzles: Icing Piping Bag and Cherry Danish Tray.
- Raised 12x12, large-board, and mobile catalog guard thresholds so this bigger-board batch is protected.
- Version bumped to v0.1.189.

### v0.1.190 - Village Pantry 10x10 Pair
- Added 2 Village Pantry 10x10 progression puzzles: Herb Bundle and Patchwork Tea Cozy.
- Raised large-board and Village Pantry mobile catalog guard thresholds for the expanded catalog.
- Version bumped to v0.1.190.

### v0.1.191 - Readable Puzzle Art Intake
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Flower Box Window and Honey Spoon Jar.
- Strengthened puzzle batch intake so future free 10x10+ candidates must include a readable `artReadability` brief with silhouette, color mood, and visual tags.
- Raised 12x12, large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.191.

### v0.1.192 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Blueberry Label and Potted Basil.
- Continued using silhouette, color mood, and visual tags for new large-board puzzle planning.
- Raised large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.192.

### v0.1.193 - Bakery Readable Puzzle Pair
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Cocoa Mug Steam and Gingerbread Heart.
- Continued using bold silhouettes and future color mood planning for new large-board puzzle additions.
- Raised 12x12, large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.193.

### v0.1.194 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Warm Pie Window and Checkered Jam Cloth.
- Continued balancing Bakery/Village puzzle volume while keeping the large-board silhouette and color mood contract.
- Raised large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.194.

### v0.1.195 - Bakery Readable Puzzle Pair
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Layer Cake Slice and Ribbon Cookie Box.
- Raised guarded launch-catalog thresholds to 149 free puzzles, 59 large-board free puzzles, 25 total 12x12 boards, and 25 Bakery Window 12x12 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.195.

### 2026-07-09 Android Production Access / Mac Mini Timing
- Play Console production access is still gated by the closed-test requirement: 12 selected testers are in place and 5 days have elapsed toward the 14-day participation requirement.
- Mac mini is expected around 2026-07-23; until then, continue prioritizing shared web/Android content scale, art consistency, QA guards, and Capacitor readiness rather than Mac-only App Store packaging.

### v0.1.196 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Cinnamon Braid and Teapot Cozy.
- Raised guarded launch-catalog thresholds to 151 free puzzles, 61 large-board free puzzles, and 32 Village Pantry 10x10 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.196.

### v0.1.197 - Four Puzzle Readability Batch
- Added 4 readable large-board puzzles in a faster batch: Peach Tart Fan, Sugar Bell, Copper Kettle, and Berry Bowl.
- Raised guarded launch-catalog thresholds to 155 free puzzles, 65 large-board free puzzles, 27 Bakery Window 12x12 boards, and 34 Village Pantry 10x10 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.197.

### v0.1.198 - Puzzle Readability Report Guard
- Promoted the user's quality-first direction into catalog QA: recent free 10x10+ puzzles now need readable silhouette/color/tag briefs in the catalog report, not only in batch intake.
- Added readable large-board brief totals to npm run qa:catalog; the new guard found and fixed a missing brief on Patchwork Tea Cozy.
- Version bumped to v0.1.198.

### v0.1.199 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Jam Thumbprint, Lemon Glaze Bun, Flower Milk Jug, and Toast Rack.
- Raised guarded launch-catalog thresholds to 159 free puzzles, 69 large-board free puzzles, 29 Bakery Window 12x12 boards, 36 Village Pantry 10x10 boards, and 21 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.199.

### v0.1.200 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Caramel Custard Cup, Berry Cream Roll, Honey Dipper, and Egg Basket.
- Raised guarded launch-catalog thresholds to 163 free puzzles, 73 large-board free puzzles, 31 Bakery Window 12x12 boards, 38 Village Pantry 10x10 boards, and 25 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.200.

### v0.1.201 - Recent Puzzle Edge Row Polish
- Considered Review 31's note that repeated 000000 edge rows can make puzzle silhouettes feel less authored.
- Polished recent readable puzzle solutions so bottom rows become meaningful plate, shadow, base, or handle rows instead of empty padding.
- Added a regression test for recent free 10x10+ readable puzzles to avoid fully blank first/last solution rows; full test/build/mobile QA passed.
- Version bumped to v0.1.201.

### v0.1.202 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles without blank edge rows: Cocoa Cream Puff, Sprinkle Donut, Cotton Napkin Ring, and Spice Scoop.
- Raised guarded launch-catalog thresholds to 167 free puzzles, 77 large-board free puzzles, 33 Bakery Window 12x12 boards, 40 Village Pantry 10x10 boards, and 29 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.202.

### v0.1.203 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Cinnamon Swirl Roll, Strawberry Tart, Ribbon Tea Tin, and Checked Pot Holder.
- Raised guarded launch-catalog thresholds to 171 free puzzles, 81 large-board free puzzles, 35 Bakery Window 12x12 boards, 42 Village Pantry 10x10 boards, and 33 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.203.

### v0.1.204 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Honey Cruller Twist, Pear Galette, Lace Jar Cover, and Garden Herb Bundle.
- Raised guarded launch-catalog thresholds to 175 free puzzles, 85 large-board free puzzles, 37 Bakery Window 12x12 boards, 44 Village Pantry 10x10 boards, and 37 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.204.

### v0.1.205 - Time Attack Hint Economy
- Added Time Attack as a two-way economy loop: players can earn daily spoons from runs, but optional hints spend spoons at 2/4/7 per run.
- Updated Pip's Time Attack first-run guide to explain random puzzles, record chasing, and the choice between spending hints or saving for Pantry goals.
- Version bumped to v0.1.205; full test/build/mobile QA passed after restarting the local dev server.

### v0.1.206 - Time Attack Hint Confirmation Polish
- Replaced native confirm with an in-app paid-hint confirmation panel for Time Attack so Android WebView/browser UI stays consistent with the game.
- Clarified that Undo can remove the hint move but does not refund spent spoons.
- Version bumped to v0.1.206; full test/build/mobile/catalog QA passed.

### v0.1.207 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Apricot Danish, Vanilla Eclair, Hanging Ladle, and Pickle Jar.
- Kept the quality-first puzzle expansion rule active: clear silhouette, future color mood, tags, no blank edge rows, and localized names.
- Version bumped to v0.1.207; full test/build/mobile/catalog QA passed.

### v0.1.208 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Jam Crescent, Lemon Tartlet, Flour Sifter, and Cocoa Scoop Tin.
- Continued alternating Bakery 12x12 and Village 10x10 additions with explicit readability briefs and localized names.
- Version bumped to v0.1.208; full test/build/mobile/catalog QA passed.

### v0.1.209 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Braided Pretzel, Berry Danish Square, Measuring Spoons, and Jam Label Jar.
- Continued pushing catalog depth while varying silhouettes across loops, square pastries, fanned tools, and labeled jars.
- Version bumped to v0.1.209; full test/build/mobile/catalog QA passed.

### v0.1.210 - Recent Puzzle Title Guard
- Added a recent-readable-large-board title uniqueness guard to prevent newly authored high-quality puzzle batches from reusing names.
- Kept older starter-pack repeated titles untouched because those are part of the existing cross-pack structure.
- Version bumped to v0.1.210; full test/build/mobile QA passed.

### v0.1.211 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Almond Pinwheel, Cherry Turnover, Tea Strainer, and Blue Gingham Cloth.
- Continued catalog growth after the recent-title uniqueness guard, with each new title remaining distinct and localized.
- Version bumped to v0.1.211; full test/build/mobile/catalog QA passed.

### v0.1.212 - Catalog Report Threshold Tightening
- Raised stale puzzle catalog report thresholds to the current 191-puzzle / 101-large-board / 45-12x12 / 53-readable-brief catalog floor.
- Version bumped to v0.1.212; full test/build/mobile/catalog QA passed.

### v0.1.213 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Custard Star, Poppy Seed Roll, Scalloped Plate, and Honey Clothespin.
- Continued the march toward 200+ puzzles while keeping report thresholds, mobile QA thresholds, and recent-title uniqueness aligned.
- Version bumped to v0.1.213; full test/build/mobile/catalog QA passed.

### v0.1.214 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Maple Palmier, Fig Tart Square, Copper Funnel, and Embroidered Napkin.
- Brought the catalog to 199 free puzzles while keeping recent-title uniqueness, readable art briefs, and mobile catalog thresholds aligned.
- Version bumped to v0.1.214; full test/build/mobile/catalog QA passed.


### v0.1.215 - 200+ Puzzle Milestone Batch
- Added four readable, edge-filled large-board puzzles: Orange Brioche Knot, Cream Horn, Linen Bread Bag, and Porcelain Butter Dish.
- Crossed the 200-puzzle milestone with 203 free puzzles while keeping Bakery 12x12, Village 10x10, readable art briefs, recent-title uniqueness, and mobile catalog thresholds aligned.
- Version bumped to v0.1.215; full test/build/mobile/catalog QA passed.


### v0.1.216 - Opening Screen Tactile Polish
- Added a scoped opening screen polish layer for the game-stage intro: warmer card depth, improved key-visual frame, larger Pip seal, and a more tactile start button.
- Tightened the mobile visual guard so the start button must keep larger dimensions, rounded corners, gradient, and real shadow treatment.
- Version bumped to v0.1.216; full test/build/mobile QA passed.


### v0.1.217 - Catalog Summary Polish
- Added compact catalog summary chips to puzzle pack headers so large stages show progress, total pictures, large-board count, and maximum board size at a glance.
- Added mobile QA coverage for Bakery Window and Village Pantry summary chips so the 200+ puzzle catalog remains visibly scannable.
- Version bumped to v0.1.217; syntax checks, targeted i18n test, hygiene/assets QA, full test suite, production build, and mobile visual QA passed.


### v0.1.218 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Honey Cruller Ring, Raspberry Linzer Frame, Ceramic Measuring Cup, and Herb Drying Rack.
- Resumed content growth after the catalog summary polish while keeping Bakery 12x12, Village 10x10, translated metadata, readable art briefs, and mobile catalog thresholds aligned.
- Version bumped to v0.1.218; syntax checks, catalog QA, targeted puzzle/catalog/batch/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA passed.


### v0.1.219 - Recent Korean Puzzle Title Guard
- Repaired the newest Korean large-board puzzle names from the v0.1.215-v0.1.218 content run so catalog browsing does not show mojibake for recent cards.
- Added an i18n regression guard for the newest Bakery/Village large-board titles and image names.
- Verified with syntax checks, targeted i18n test, catalog report, hygiene/assets QA, full Vitest, production build, and mobile visual QA.


### v0.1.220 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Blueberry Babka Slice, Vanilla Canele Tower, Polka Dot Sugar Tin, and Wooden Egg Crate.
- Raised catalog guards to 211 free puzzles, 121 large-board free puzzles, 55 Bakery Window 12x12 boards, 62 Village Pantry 10x10 boards, and 73 readable large-board briefs.
- Version bumped to v0.1.220; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


### v0.1.221 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Strawberry Charlotte Dome, Cocoa Biscotti Bundle, Checkered Tea Towel, and Honeycomb Glass Jar.
- Raised catalog guards to 215 free puzzles, 125 large-board free puzzles, 57 Bakery Window 12x12 boards, 64 Village Pantry 10x10 boards, and 77 readable large-board briefs.
- Version bumped to v0.1.221; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


### v0.1.222 - Bakery 12x12 Guard Alignment
- Aligned the Bakery Window-specific 12x12 regression guard with the current v0.1.221 catalog floor of 57 authored Bakery 12x12 puzzles.
- Version bumped to v0.1.222; targeted puzzle-data and catalog-report tests passed.


### v0.1.223 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Almond Croissant Stack, Peach Cream Tartlet, Blue Enamel Colander, and Cinnamon Stick Jar.
- Raised catalog guards to 219 free puzzles, 129 large-board free puzzles, 59 Bakery Window 12x12 boards, 66 Village Pantry 10x10 boards, and 81 readable large-board briefs.
- Version bumped to v0.1.223; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.224 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Lavender Shortbread Tin and Maple Pecan Braid.
- Added Village Pantry 10x10 Red Check Apron and Pearl Sugar Bowl.
- Raised catalog guards to 223 free puzzles, 133 large-board free puzzles, 61 Bakery Window 12x12 boards, 68 Village Pantry 10x10 boards, and 85 readable large-board briefs.
- Version bumped to v0.1.224; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.225 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Apricot Jam Tart and Cocoa Swirl Meringue.
- Added Village Pantry 10x10 Gingham Butter Cloche and Pressed Flower Frame.
- Raised catalog guards to 227 free puzzles, 137 large-board free puzzles, 63 Bakery Window 12x12 boards, 70 Village Pantry 10x10 boards, and 89 readable large-board briefs.
- Version bumped to v0.1.225; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.226 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Candied Orange Scone and Rose Cream Eclair.
- Added Village Pantry 10x10 Striped Pickle Jar and Little Recipe Box.
- Raised catalog guards to 231 free puzzles, 141 large-board free puzzles, 65 Bakery Window 12x12 boards, 72 Village Pantry 10x10 boards, and 93 readable large-board briefs.
- Version bumped to v0.1.226; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.227 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Hazelnut Praline Square and Lemon Curd Rosette.
- Added Village Pantry 10x10 Cornflower Tea Canister and Ribboned Bread Basket.
- Raised catalog guards to 235 free puzzles, 145 large-board free puzzles, 67 Bakery Window 12x12 boards, 74 Village Pantry 10x10 boards, and 97 readable large-board briefs.
- Version bumped to v0.1.227; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.228 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Vanilla Bean Cupcake and Pistachio Glaze Donut.
- Added Village Pantry 10x10 Sage Thread Spool and Ceramic Honey Spoon Rest.
- Raised catalog guards to 239 free puzzles, 149 large-board free puzzles, 69 Bakery Window 12x12 boards, 76 Village Pantry 10x10 boards, and 101 readable large-board briefs.
- Version bumped to v0.1.228; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.229 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Caramel Pear Muffin and Sugar Dusted Bundt.
- Added Village Pantry 10x10 Daisy Milk Bottle and Quilted Pot Mat.
- Raised catalog guards to 243 free puzzles, 153 large-board free puzzles, 71 Bakery Window 12x12 boards, 78 Village Pantry 10x10 boards, and 105 readable large-board briefs.
- Version bumped to v0.1.229; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.230 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Berry Cream Crown and Cocoa Almond Biscuit.
- Added Village Pantry 10x10 Lace Jam Spoon and Mint Label Flour Tin.
- Raised catalog guards to 247 free puzzles, 157 large-board free puzzles, 73 Bakery Window 12x12 boards, 80 Village Pantry 10x10 boards, and 109 readable large-board briefs.
- Version bumped to v0.1.230; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.231 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Cherry Cream Brioche and Ginger Honey Madeleine.
- Added Village Pantry 10x10 Blue Ribbon Mason Jar and Floral Rolling Pin.
- Raised catalog guards to 251 free puzzles, 161 large-board free puzzles, 75 Bakery Window 12x12 boards, 82 Village Pantry 10x10 boards, and 113 readable large-board briefs.
- Version bumped to v0.1.231; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.232 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Raspberry Choux Puff and Lemon Ribbon Tart.
- Added Village Pantry 10x10 Little Spice Drawer and Checkered Napkin Ring.
- Raised catalog guards to 255 free puzzles, 165 large-board free puzzles, 77 Bakery Window 12x12 boards, 84 Village Pantry 10x10 boards, and 117 readable large-board briefs.
- Version bumped to v0.1.232; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.233 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Almond Crescent Roll and Peach Custard Square.
- Added Village Pantry 10x10 Copper Measuring Cups and Blue Check Sugar Tin.
- Raised catalog guards to 259 free puzzles, 169 large-board free puzzles, 79 Bakery Window 12x12 boards, 86 Village Pantry 10x10 boards, and 121 readable large-board briefs.
- Version bumped to v0.1.233; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.234 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Strawberry Vanilla Puff and Cinnamon Honey Twist.
- Added Village Pantry 10x10 Green Label Tea Tin and Little Linen Basket.
- Raised catalog guards to 263 free puzzles, 173 large-board free puzzles, 81 Bakery Window 12x12 boards, 88 Village Pantry 10x10 boards, and 125 readable large-board briefs.
- Version bumped to v0.1.234; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.235 - Four Puzzle Quality Batch
- Added four readable free puzzles: Caramel Fig Danish, Blueberry Cream Pinwheel, Honey Label Crock, and Daisy Checked Teapot.
- Raised catalog guards to 267 free puzzles, 177 large-board free puzzles, 83 Bakery Window 12x12 boards, 90 Village Pantry 10x10 boards, and 129 readable large-board briefs.
- Version bumped to v0.1.235; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.236 - Four Puzzle Quality Batch
- Added four readable free puzzles: Plum Cardamom Braid, Honey Lavender Canele, Rose Label Jam Pot, and Blue Linen Bowl Cover.
- Raised catalog guards to 271 free puzzles, 181 large-board free puzzles, 85 Bakery Window 12x12 boards, 92 Village Pantry 10x10 boards, and 133 readable large-board briefs.
- Version bumped to v0.1.236; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.237 - Four Puzzle Quality Batch
- Added four readable free puzzles: Orange Blossom Cruller, Blackberry Vanilla Galette, Gingham Egg Cup, and Sage Butter Dish.
- Raised catalog guards to 275 free puzzles, 185 large-board free puzzles, 87 Bakery Window 12x12 boards, 94 Village Pantry 10x10 boards, and 137 readable large-board briefs.
- Version bumped to v0.1.237; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.238 - Four Puzzle Quality Batch
- Added four readable free puzzles: Pear Ginger Turnover, Mocha Cream Roll, Poppy Seed Mortar, and Striped Pantry Towel.
- Raised catalog guards to 279 free puzzles, 189 large-board free puzzles, 89 Bakery Window 12x12 boards, 96 Village Pantry 10x10 boards, and 141 readable large-board briefs.
- Version bumped to v0.1.238; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.239 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cherry Almond Biscotti, Lemon Poppy Pound Cake, Little Cocoa Scoop, and Sunflower Flour Sieve.
- Raised catalog guards to 283 free puzzles, 193 large-board free puzzles, 91 Bakery Window 12x12 boards, 98 Village Pantry 10x10 boards, and 145 readable large-board briefs.
- Version bumped to v0.1.239; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.240 - Time Attack Coach Polish
- Added a Pip coach card to the Time Attack lobby so the mode explains its role even after the first-run guide is dismissed.
- The card now frames Time Attack as a spoon source, a selective hint sink, and a personal-record challenge.
- Added mobile QA coverage for the Time Attack coach card treatment and bumped the visible app version to v0.1.240.

### v0.1.241 - Time Attack Hint Confirmation Polish
- Polished the paid Time Attack hint confirmation panel so spending spoons stays inside the cozy game UI instead of feeling like a browser dialog.
- Added a source hygiene guard that blocks window.confirm/globalThis.confirm from returning to runtime or QA code.
- Added mobile visual QA coverage for the paid-hint confirmation panel treatment.
- Bumped the visible app version to v0.1.241 while keeping Android bundle generation paused during the local rework.

### v0.1.242 - Time Attack Three-Round Pacing
- Changed the default 3-round Time Attack run from three 5x5 boards to 5x5, 8x8, then 10x10 so the mode exposes a meaningful paid-hint decision within a short session.
- Time Attack records now use the largest board reached in the run instead of always recording against the opening 5x5 board.
- Bumped the visible app version to v0.1.242.

### v0.1.243 - Time Attack Ladder Polish
- Added a visible 5x5 -> 8x8 -> 10x10 run ladder to the Time Attack lobby so the shorter 3-round pacing is clear before players start.
- Added mobile QA coverage for the ladder treatment and bumped the visible app version to v0.1.243.

### v0.1.244 - Readable Puzzle Batch
- Added four readable large-board puzzles: Bakery Window 12x12 Raspberry Lattice Tart and Sesame Pretzel Knot; Village Pantry 10x10 Porcelain Measuring Jug and Embroidered Tea Cozy.
- Raised catalog guards to 287 free puzzles, 197 large-board free puzzles, 93 Bakery Window 12x12 boards, 100 Village Pantry 10x10 boards, and 149 readable large-board briefs.

### v0.1.245 - Time Attack Progress-Cell Records
- Changed Time Attack record metadata and lobby copy from round-only scoring toward progress-cell records: completed previous boards plus correct cells on the current board.
- Saved best scores now include progressCells, currentRoundCorrectCells, hintsUsed, elapsedSeconds, and score so future timed partial runs can rank by one-more-correct-cell progress.

### v0.1.246 - Time Attack Timeout Records
- Added a 3-minute Time Attack limit so the mode now ends on time instead of relying only on full 3-board completion.
- Time Attack now snapshots the active puzzle state and records partial timeout runs by progressCells, preserving the one-more-correct-cell record design.

### v0.1.247 - Time Attack Timeout Visual Polish
- Polished the Time Attack remaining-time pill and result card so timeout, record, and normal run outcomes are easier to distinguish in the first-session flow.
- Kept the change visual-only on top of v0.1.246 timeout recording behavior.

### v0.1.248 - Time Attack Result Detail Polish
- ?�?�어???�?�아??결과?�서 보상???�는 ?�?�아?�과 진행 부족으�?보상???�는 ?�?�아?�을 문구�?분리?�다.
- 결과 카드???�용???�트 ?��? ?�출?? 기록 경쟁�??�푼 ?�비가 ???�면?�서 ?�께 ?�해?�도�??�리?�다.
- 버전 ?�기??v0.1.248�?갱신?�다.

### v0.1.249 - Time Attack Record Hint Visibility
- ?�?�어??최고 기록 ?�약�?기록 목록???�용???�트 ?��? ?�께 ?�시?�도�??�리?�다.
- 진행 �??? ?�간, ?�트 ?��? ??줄에 같이 보여 기록 경쟁�??�푼 ?�비??관계�? ??명확?�졌??
- 버전 ?�기??v0.1.249�?갱신?�다.

### v0.1.250 - Opening Version Visibility
- ?�프??게임 ?�작 ?�면�??�름 ?�력 ?�면???��? 버전 칩을 추�??? 미리보기?�서 ?�재 빌드�?즉시 ?�인?????�게 ?�다.
- APP_VERSION??src/data/appVersion.js�?분리?????�과 브랜???�트로�? 같�? 버전 값을 공유?�도�??�리?�다.
- 모바??QA가 ?�프??버전 칩을 ?�인?�도�??�장?�다.

### v0.1.251 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cranberry Linzer Star, Hazelnut Cocoa Tart, Braided Herb Basket, and Blue Daisy Teacup.
- Raised catalog guards to 291 free puzzles, 201 large-board free puzzles, 95 Bakery Window 12x12 boards, 102 Village Pantry 10x10 boards, and 153 readable large-board briefs.
- Version bumped to v0.1.251; verification focused on syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, and production build.

### v0.1.252 - Four Puzzle Quality Batch
- Added four readable free puzzles: Pistachio Crescent Wreath, Apricot Custard Bar, Copper Tea Strainer, and Gingham Picnic Jar.
- Raised catalog guards to 295 free puzzles, 205 large-board free puzzles, 97 Bakery Window 12x12 boards, 104 Village Pantry 10x10 boards, and 157 readable large-board briefs.
- Version bumped to v0.1.252; verification focused on syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, and production build.

### v0.1.253 - Four Puzzle Quality Batch
- Added four readable free puzzles: Maple Pecan Scroll, Vanilla Checker Tile, Wooden Pastry Brush, and Ceramic Spoon Rest.
- Raised catalog guards to 299 free puzzles, 209 large-board free puzzles, 99 Bakery Window 12x12 boards, 106 Village Pantry 10x10 boards, and 161 readable large-board briefs.
- Version bumped to v0.1.253; verification focused on syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, and production build.

### v0.1.254 - Four Puzzle Quality Batch
- Added four readable free puzzles: Orange Cardamom Ring, Berry Cream Envelope, Sage Linen Bundle, and Honey Dipper Jar.
- Raised catalog guards to 303 free puzzles, 213 large-board free puzzles, 101 Bakery Window 12x12 boards, 108 Village Pantry 10x10 boards, and 165 readable large-board briefs.
- Version bumped to v0.1.254; local verification mirrors the GitHub verify workflow: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, and production build.

### v0.1.255 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cherry Cream Crown, Lemon Zest Petal Tart, Striped Sugar Sack, and Tiny Copper Kettle.
- Raised catalog guards to 307 free puzzles, 217 large-board free puzzles, 103 Bakery Window 12x12 boards, 110 Village Pantry 10x10 boards, and 169 readable large-board briefs.
- Version bumped to v0.1.255; local verification continues to mirror the GitHub verify workflow before push.

### v0.1.256 - Four Puzzle Quality Batch
- Added four readable free puzzles: Fig Honey Pinwheel, Cocoa Pear Tartlet, Checked Recipe Folder, and Berry Label Sifter.
- Raised catalog guards to 311 free puzzles, 221 large-board free puzzles, 105 Bakery Window 12x12 boards, 112 Village Pantry 10x10 boards, and 173 readable large-board briefs.
- Version bumped to v0.1.256; local verification continues to mirror the GitHub verify workflow before push.

### v0.1.257 - Four Puzzle Quality Batch
- Added four readable free puzzles: Apple Cinnamon Rose, Honey Sesame Twist, Blue Stripe Flour Crock, and Copper Berry Scoop.
- Raised catalog guards to 315 free puzzles, 225 large-board free puzzles, 107 Bakery Window 12x12 boards, 114 Village Pantry 10x10 boards, and 177 readable large-board briefs.
- Version bumped to v0.1.257; local verification continues to mirror the GitHub verify workflow before push.

### v0.1.258 - Four Puzzle Quality Batch
- Added four readable free puzzles: Plum Cream Danish, Ginger Caramel Knot, Mint Label Tea Tin, and Stitched Linen Apron.
- Raised catalog guards to 319 free puzzles, 229 large-board free puzzles, 109 Bakery Window 12x12 boards, 116 Village Pantry 10x10 boards, and 181 readable large-board briefs.
- Version bumped to v0.1.258; local verification continues to mirror the GitHub verify workflow before push.

### v0.1.259 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cranberry Custard Braid, Mocha Hazelnut Button, Sunflower Spice Tin, and Gingham Bread Cloth.
- Raised catalog guards to 323 free puzzles, 233 large-board free puzzles, 111 Bakery Window 12x12 boards, 118 Village Pantry 10x10 boards, and 185 readable large-board briefs.
- Version bumped to v0.1.259; local verification continues to mirror the GitHub verify workflow before push.

### v0.1.260 - Season 0 Launch Catalog Completion Batch
- Added ten readable free puzzles to close the Season 0 launch catalog target: Pear Vanilla Rosette, Blueberry Almond Square, Apricot Sugar Shell, Cocoa Cherry Ribbon, Lemon Thyme Crown, Patchwork Jam Ledger, Sage Butter Crock, Copper Honey Measure, Daisy Recipe Clipboard, and Tiny Checkered Sieve.
- Raised catalog guards to 333 free puzzles, 243 large-board free puzzles, 116 Bakery Window 12x12 boards, 123 Village Pantry 10x10 boards, and 195 readable large-board briefs.
- Season 0 now reaches the 333-puzzle launch target. Next major priority should shift from bulk puzzle count to first-session polish, art consistency, Pantry story/economy flow, Time Attack feel, completion effects, and mobile QA.

### v0.1.261 - Season 0 Progress Hub
- Puzzle Hub??Season 0 진행 카드�?추�???333�?출시 ?�즐???�나???�칭 ?�즌 카탈로그�?보이�??�다.
- 카드?�서 ?�체 ?�성�? ?�린 ?�테?��? ?? 보유 ?�푼???�께 보여 주어 ?�음 ?�테?��? ?�금�?Pantry ?�청???�연?�러??목표가 ?�도�??�리?�다.
- ?�음 ?�즌 ?�데?�트 ?�고 문구�?추�???출시 ??계절???�즐 ???�장 방향??UI ?�에 ?�었??
- 모바??preview guard?�서 발견???�????mosaic ?�축 문제�??�께 ?�정?�다. ?�제 136�?137�??�즐 ?��? 그�?�??�더?��? ?�고 20�??�플??진행률을 ?�산??stage art가 ?�정?�으�?보이�??�다.

### v0.1.262 - Stage Unlock Plan Copy
- ?�긴 ?�테?��? 카드???�음 ?�동 ?�랜 문구�?추�??�다. ?�푼 부�? Pantry ?�청 부�? ????부족한 ?�황??각각 ?�명???�음 ?�즐???�기 ?�한 목표�???명확?�게 보여 준??
- Season 0??333�??�즐???�순 목록???�니???�푼 ?�급�?Pantry 진행?�로 ?�계?�으�??�어 가??구조�??�끼�??�는 UI 보강?�다.


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
- Upgraded the floating navigation trigger to show the current destination instead of a generic menu-only label, making the bottom control feel more like an in-game wayfinding sign.
- Added short localized helper lines to each floating nav destination so Puzzle, Album, Pantry, Time, and Badges communicate their purpose before the user taps.
- Bumped the visible app version to v0.1.266; verification focused on syntax, i18n, full Vitest, hygiene/assets/catalog QA, production build, and mobile visual QA.

### v0.1.267 - Pantry Progress Mission Card
- Added a Room Path mission block to the Pantry progress board so decoration requests, room steps, spoon savings, and the next puzzle stage are visible in one place.
- Reused the existing Pantry room-step requirements from the stage pack data instead of introducing a new economy rule, keeping decoration pacing and stage unlock logic aligned.
- Bumped the visible app version to v0.1.267; verification focused on pantry syntax, i18n, full Vitest, hygiene/assets/catalog QA, production build, HTTP smoke, and mobile visual QA.

### v0.1.268 - Pantry Progress Mission Mobile Guard
- Added explicit mobile visual QA coverage for the Pantry Room Path mission card so the next request target, spoon gate, meter, and fact chips cannot silently disappear during future layout work.
- Bumped the visible app version to v0.1.268; verification focuses on syntax, full Vitest, hygiene/assets/catalog QA, production build, HTTP smoke, and mobile visual QA.

### v0.1.269 - Pantry Progress Mission Action
- Added a direct action to the Pantry Room Path mission card so the card now routes players toward the next decoration request before sending them to earn more spoons.
- Bumped the visible app version to v0.1.269; verification focuses on Pantry syntax, i18n, mobile QA, full Vitest, hygiene/assets/catalog QA, production build, and HTTP smoke.

### v0.1.270 - Time Attack Board Progress Records
- Extended Time Attack result records with the active board number and active-board cell progress so close runs differ by more than completed round count.
- Updated best-run, record-list, and last-run copy to show both total progress cells and the current board's cell count, preserving old-record fallbacks.
- Bumped the visible app version to v0.1.270; verification focuses on Time Attack syntax, save tests, i18n, mobile QA, full Vitest, hygiene/assets/catalog QA, production build, and HTTP smoke.

### Design Note - Puzzle Interaction And Hint Economy UX
- User direction: prioritize puzzle-screen kindness and convenience after the Season 0 catalog target. Drag/sweep cell selection, completed-line feedback, and stronger hint bundles should be treated as one coherent UX lane.
- Drag/sweep input is expected for consecutive cells, especially on larger boards. It must work with existing direct-tap/move controls, undo, mistake tracking, replay-clean reward rules, and mobile touch scrolling.
- Completed-line feedback should make the game feel helpful: a completed row/column gets a soft backlight and remaining unresolved cells can receive soft X/blank guidance. Keep it gentle and cozy; avoid loud arcade effects or anything that removes puzzle agency.
- Hint economy needs size-aware design. A one-cell hint is too weak for 12x12 boards, so normal puzzles should use difficulty-scaled reveal bundles and paid hints should feel worth spending spoons on. Time Attack should remain separate: hints can be a spoon sink under pressure, but must protect record clarity and fairness.
- Future QA coverage should include drag gesture behavior, auto/soft X line completion, hint bundle cost and reveal counts, undo/no-refund semantics, replay-clean interactions, and mobile no-scroll-regression checks.

### v0.1.271 - Completed Line Guidance Foundation
- Added correctness-based row/column completion guidance to the puzzle board so satisfied lines can glow gently and show soft blank/X suggestions across the whole completed line.
- Replaced the previous cursor-only clue-count heuristic with solution-aware line checks, preventing wrong filled cells from being treated as complete just because the clue count matches.
- Bumped the visible app version to v0.1.271; verification focuses on board syntax, full Vitest, hygiene/assets/catalog QA, production build, HTTP smoke, and mobile visual QA.

### v0.1.272 - Drag Stroke Cell Painting
- Added the first drag/sweep input slice for puzzle boards: players can press and sweep across consecutive cells, then commit the stroke as one state update.
- Drag strokes use one history entry, so undo reverses the whole sweep instead of forcing the player to undo every cell individually.
- Bumped the visible app version to v0.1.272; verification focuses on puzzle state stroke tests, board syntax, mobile QA, full Vitest, hygiene/assets/catalog QA, production build, and HTTP smoke.

### v0.1.273 - Drag Stroke Preview Polish
- Added a distinct drag-preview treatment so cells under an active sweep feel responsive before the stroke commits.
- Kept the change visual-only: drag stroke grouping, undo behavior, puzzle rewards, and hint logic remain unchanged.
- Bumped the visible app version to v0.1.273; verification focuses on CSS hygiene, mobile QA, full Vitest, asset/catalog QA, production build, and HTTP smoke.

### v0.1.274 - Size-Aware Hint Reveal Foundation
- Changed puzzle hints so one hint can reveal a small group of sure cells while still counting as one hint use.
- Normal large boards now scale hint help by size: 10x10 reveals up to 3 cells, 12x12 up to 5, 15x15 up to 6, and 18x18 up to 8.
- Time Attack keeps the existing one-cell paid hint behavior for now so the current spoon economy and record fairness stay stable.
### v0.1.275 - Hint Undo Exploit Guard
- Changed Undo so hint cells can be visually reverted, but the hint use count remains spent.
- This prevents using hints as free preview information by hinting, memorizing, then undoing.
- Updated hint copy to clearly say Undo may clear hint cells but hint use and spent spoons remain recorded.
### v0.1.276 - Hint Mistake Correction Priority
- Updated normal hint targeting so a hint corrects an already-wrong filled cell before adding safe marks to untouched blanks.
- This makes paid/limited hints feel useful when a player is stuck because of an existing mistake, especially on larger boards.
- Kept the v0.1.275 rule: Undo can revert the visible hint cells, but hint usage remains spent.
### v0.1.277 - Safe Suggestion Tap Guard
- Completed-line safe X suggestions now commit as marks when tapped or dragged, even while the player is in fill mode.
- This prevents a visually suggested blank from becoming a wrong filled cell through a natural tap.
- Added a board-view paint-decision unit test so future input polish keeps visual guidance and committed state aligned.
### v0.1.278 - Replay Final-Move Clean Guard
- Replay clean status now updates before reward payout even when the latest move completes the puzzle.
- This closes a final-hint loophole where a replay could complete with a hint before the clean tracker saw the hint use.
- Added a replay challenge regression test for final-hint completion.
### v0.1.279 - Normal Puzzle Extra Hint Economy
- Added paid extra hints for normal large-board puzzles after the free hint allowance is used.
- Extra hint costs now scale by board size and repeated paid use, while Time Attack keeps its separate one-cell escalating hint economy.
- Kept the no-free-preview rule: Undo can remove revealed cells, but hint use and spent spoons remain recorded.

### v0.1.280 - Time Attack State Callback Wiring Guard
- Fixed focused play wiring so puzzle state changes are passed from `renderPlayScreen` into `renderPuzzleView`.
- This keeps Time Attack timeout records aware of the current board state and supports the progress-cell ranking direction.
- Added a play-screen wiring guard test so future UI refactors do not silently drop the callback again.


### v0.1.281 - Paid Hint Count State Split
- Separated paid normal puzzle hint count from total hint count with `paidHintsUsed` in puzzle state.
- Extra hint pricing now reads paid hint count directly instead of deriving it from `hintsUsed - hintLimit`, keeping future variable free-hint rules safe.
- Undo still clears revealed cells only; hint use and paid hint count remain spent by design.


### v0.1.282 - Zero-Clue Line Guidance
- Completed-line guidance now treats all-empty solution lines as satisfied when the player has no filled cells in that row or column.
- This lets 0-clue rows/columns show the same soft completed-line glow and safe X suggestions as other solved lines.
- Added board-view guard coverage for zero-clue line behavior.


### v0.1.283 - First-Play Line Guidance Copy
- The how-to-play card now explains the completed-line glow and pale X suggestions directly in the first play surface.
- Added a small muted line-hint style so the guidance reads as help copy rather than another command.
- i18n coverage now includes the completed-line hint copy.


### v0.1.284 - Drag Stroke Safe-Suggestion Protection
- Drag strokes can now carry per-cell target values, so safe X suggestion cells stay marked even when a fill stroke crosses them.
- This keeps completed-line guidance helpful during fast swipe play instead of letting a drag accidentally erase the guidance.
- Added board-view and puzzle-state tests for per-cell drag targets.


### v0.1.285 - Drag Stroke Value Regression Guard
- Refined safe-suggestion drag protection so normal cells keep the stroke's original target value.
- This preserves the existing drag-to-clear behavior when a stroke starts from a filled cell, while still protecting safe X suggestion cells.
- Added board-view coverage for safe-suggestion protection versus normal stroke value preservation.

### v0.1.286 - Korean Replay And Hint Copy Polish
- Repaired remaining Korean replay-pick copy so the daily clean replay challenge reads as intentional guidance instead of mojibake.
- Clarified the Korean Time Attack paid-hint sentence so the spoon cost is stated as a cost, not a hint count.
- Added i18n regression coverage for the replay-pick and Time Attack paid-hint Korean strings.

### v0.1.287 - Paid Hint Title Clarity
- Split hint panel titles for free hints, normal extra hints, and Time Attack paid hints so the paid state is visible before reading the body copy.
- Added direct helper coverage for the three hint title modes and Korean i18n coverage for the new labels.

### v0.1.288 - Korean Copy Regression Guard
- Tightened Korean guide/hint i18n tests so mojibake fragments cannot be accepted as readable gameplay copy.
- Updated the paid extra hint assertion to expect the readable Korean phrase directly, keeping economy copy quality tied to automated QA.

### v0.1.289 - Korean Source Hygiene Guard
- Extended source hygiene so src/i18n/ko.js is scanned for common mojibake fragments, not only selected runtime keys.
- This makes future Korean UI copy additions fail fast if encoding damage slips into the source file.
## Progress Update - 2026-07-12 v0.1.290 Unified Hint Presentation

- Kept the player-facing hint UI as one hint surface: the panel title stays on the remaining hint count instead of exposing internal free/spoon/Time Attack categories.
- Time Attack now uses its small free hint allowance first and only switches to spoon-spending hints after that allowance is used.
- Updated guide and hint copy so players hear "use spoons for the next hint" rather than "paid hint" or separate paid categories.
## Progress Update - 2026-07-12 v0.1.291 Hint Icon Control Polish

- Changed the hint action from a text-heavy button into an accessible icon-only control so players see one clear hint affordance rather than hint categories or cost labels.
- Added tactile Sunny Spoon styling to the hint panel and button while keeping the remaining free-hint count visible in the panel copy.
- Extended mobile QA to guard the hint button touch size, icon presence, and absence of visible button text.
## Progress Update - 2026-07-12 v0.1.292 Time Attack Guide QA Guard

- Added mobile QA coverage that opens Time Attack, confirms Pip's first-run guide appears, and advances to the hint step.
- The guard checks that the guide explains both limited hints and spoon continuation, keeping the player-facing hint model simple while preserving the economy pacing.
- This protects the intended onboarding flow without adding separate visible hint categories to the puzzle controls.
## Progress Update - 2026-07-12 v0.1.293 Korean UI Copy Guard

- Added a recursive i18n regression test over Korean non-puzzle UI copy so mojibake fragments cannot slip into core screens, guides, pantry, or hint text.
- Kept the heavier 333-puzzle catalog names out of this broad UI guard because puzzle metadata already has targeted catalog checks and separate expansion QA.
- This supports the launch-quality goal that Korean interface polish is treated as product quality, not a late cosmetic pass.
## Progress Update - 2026-07-12 v0.1.294 Completed-Line Guidance Guard

- Exposed the board completed-line guidance calculation for direct regression coverage.
- Added tests that verify only truly completed rows/columns receive guidance, while locked boards keep guidance hidden.
- This protects the friendly large-board experience where completed lines glow and safe blank suggestions appear only when the solved line state is real.


## Progress Update - 2026-07-12 v0.1.295 Opening Promise Chip Polish

- Turned the opening promise strip into three tactile mini chips for puzzle volume, Pantry goals, and Time Attack.
- Used CSS-native Sunny Spoon styled marks instead of introducing new bitmap art, keeping the screen visually richer without adding character/world inconsistency.
- Extended mobile QA so the first screen now guards promise-chip count, touch/read size, icon presence, gradient treatment, and overflow.


## Progress Update - 2026-07-12 v0.1.296 Spoon Hint Confirmation Clarity

- Added a compact spoon-cost chip inside the hint confirmation panel so spending moments stay clear without exposing paid/free labels as separate user-facing modes.
- Kept the single hint-button presentation intact; the extra explanation only appears at the confirmation step after free hints are used up.
- Extended mobile QA to guard the spoon-cost chip, icon mark, dimensions, and gradient treatment.

## Progress Update - 2026-07-12 v0.1.297 Completed-Line Visual Guard

- Polished completed-line guidance so solved rows/columns read as a soft backlight, while safe blank suggestions keep their gentle dashed X treatment.
- Kept the board logic unchanged; this slice is about making the existing friendly guidance feel clearer during large-board play.
- Extended mobile QA to verify not only that completed-line guidance appears, but that the glow, safe-X outline, and clue gradient remain visually present.

## Progress Update - 2026-07-12 v0.1.298 Puzzle Control Icon Polish

- Reworked the three core puzzle controls into icon+label buttons for Color, Blank Check, and Undo so the play surface feels more like a tactile game UI.
- Kept the existing undo rules unchanged: it can remove the last visual move, but hint usage and spoon spending remain counted.
- Extended mobile QA to guard control count, icon presence, touch height, gradient treatment, labels, aria labels, and overflow.

## Progress Update - 2026-07-12 v0.1.299 Puzzle Progress Chip Polish

- Reworked the puzzle progress line into a compact status chip with distinct normal, warning, and complete treatments.
- Kept the underlying filled/mistake logic unchanged while making progress feedback easier to read during repeated play.
- Extended mobile QA to guard the progress chip dimensions, icon mark, gradient treatment, text presence, and overflow.

### v0.1.300 - Hint Allowance Meter Polish
- Kept the hint action as one icon-only button while adding a small allowance meter beside the copy so free hints are easier to scan.
- The meter shows remaining free hint uses without introducing separate free/extra/Time Attack button categories.
- Mobile QA now guards the 12x12 hint meter count, available dots, and accessibility label.

### v0.1.301 - Play Header HUD Polish
- Reframed the focused puzzle header as a compact tactile HUD card so back, title, settings, and board size read as one designed surface.
- Kept behavior unchanged and preserved Time Attack and Replay variants with mode-aware header backgrounds.
- Mobile QA now guards header bounds, gradient treatment, title fit, and control placement on the 12x12 play path.

### v0.1.302 - Puzzle Tool Shelf Cohesion
- Reframed the lower puzzle controls, hint panel, and progress chip as one cohesive play-tool shelf through shared width, spacing, rounded surfaces, and soft Sunny Spoon gradients.
- Kept all puzzle logic unchanged: fill, blank check, undo, hint allowance, and spoon-spending rules continue to behave as before.
- Mobile QA now guards the stacked tool-shelf treatment so future UI polish does not scatter the main play controls on 12x12 boards.

### v0.1.303 - How-To Guide Card Polish
- Polished the in-puzzle how-to card so the clue examples, line-completion hint, and basic actions read as one friendly guide surface.
- Kept gameplay logic unchanged while making the first visible play guidance feel closer to the tactile Sunny Spoon interface.
- Mobile QA now guards the guide card bounds, gradient treatment, clue example rows, action chips, mini cells, and overflow on the 12x12 path.

### v0.1.304 - Season Update Teaser Polish
- Refined the Season 0 Puzzle Hub teaser so the 333-picture launch catalog points toward ongoing seasonal drops instead of feeling like a one-time finite list.
- Added tactile update chips for puzzle drops, season rooms, and Pip news, matching the broader benchmark direction of character-led, user-friendly update operations.
- Mobile QA now checks the teaser copy, chips, gradient treatment, and mobile bounds.

### v0.1.305 - Completion Collectible Card Polish
- Reframed the puzzle-complete solved reveal as a small album-card surface with an Album card label and Saved stamp.
- Kept completion logic unchanged: album saving, replay rewards, next-picture flow, hint counts, and spoon rules are not touched.
- Mobile QA now guards the completion card shell, stamp, label, gradient treatment, reveal square, and action bounds so reward polish survives later art passes.

### v0.1.306 - Stage Complete Fact Chip Polish
- Added two compact reward facts to the stage-complete overlay so finishing a stage communicates album progress and room-path momentum, not only a one-time bonus.
- Kept stage completion logic, spoon bonus rules, dismissal behavior, and approved stage art handling unchanged.
- Mobile QA now guards the fact-chip count, text, gradient treatment, dimensions, and overflow inside the stage-complete reward card.


### v0.1.307 - Large Board Cursor Pad Polish
- Upgraded the large-board cursor controls from a plain helper block into a tactile game-pad surface with a current row/column chip, larger directional buttons, and separate Color/Blank action buttons.
- Kept all puzzle state, undo, drag painting, hint economy, and completed-line guidance behavior unchanged.
- Mobile QA now guards the cursor pad's gradient treatment, button sizes, labels, position chip, and overflow behavior.

### v0.1.308 - Puzzle Progress Target Count
- Updated the in-play progress chip to show colored cells against the puzzle's actual solution target, so larger boards communicate progress as `count/target` instead of a loose filled-cell count.
- Kept mistake warnings visible in the same chip, now framed as target progress plus cells to revisit.
- Added i18n and mobile QA coverage so future UI passes preserve the target-count progress cue on compact play surfaces.

### v0.1.309 - Puzzle Progress Rail Polish
- Added a soft visual progress rail inside the in-play progress chip so `count/target` also reads at a glance as board-completion momentum.
- Kept puzzle logic, mistake warnings, hints, undo, and drag painting unchanged; this is a presentation-only layer on the existing progress chip.
- Mobile QA now guards the progress ratio custom property and clipped chip treatment so the rail remains a designed part of the play surface.

### v0.1.310 - Guided Line Progress Badge
- Added a compact completed-line badge to the in-play progress chip so players can see when row/column guidance is helping them clear the board.
- Reused the existing completed-line solution comparison logic; fill, mark, undo, hints, spoon spending, drag painting, and mistake handling are unchanged.
- Added i18n coverage and mobile QA telemetry for the badge dimensions so the extra guidance stays compact on large-board play surfaces.

### v0.1.311 - Cursor Selected State Chip
- Added a compact selected-square status chip to the large-board cursor controls so players can see whether the current cursor cell is empty, colored, or marked blank before acting.
- Kept cursor movement, fill/mark behavior, undo, hints, spoon spending, drag painting, and completed-line guidance unchanged; this is a presentation/accessibility layer on the existing cursor state.
- Bumped the visible app version to v0.1.311 and extended mobile QA telemetry to guard the status chip text, dimensions, gradient treatment, and overflow behavior.

### v0.1.312 - Cursor Action Intent Labels
- Updated the large-board cursor action buttons so already colored cells show a clear-color action and already marked cells show a clear-X action.
- Kept the underlying toggle behavior unchanged; this slice makes the existing result easier to predict before the player taps.
- Bumped the visible app version to v0.1.312 and extended mobile QA to verify the status chip and action label update after coloring a selected cursor cell.

### v0.1.313 - Cursor Action Intent Guards
- Added explicit cursor action descriptors so large-board buttons carry fill, mark, clear-fill, and clear-mark intent classes in addition to readable labels.
- Polished the cursor action buttons with small built-in fill/X glyphs so the game-pad controls read more visually without adding new art assets.
- Added focused unit coverage for cursor selected-cell labels and clear-action intent, then bumped the visible app version to v0.1.313.

### v0.1.314 - Large Board Cursor Focus Rails
- Connected the existing current-row, current-column, selected-cell, and active-clue classes to visible focus rail styling on large boards.
- Kept puzzle input logic unchanged while making cursor-pad play easier to follow on 12x12 boards and above.
- Bumped the visible app version to v0.1.314 and extended mobile QA to guard the row, column, clue, and selected-cell highlight treatment.

### v0.1.315 - Puzzle Control Symbol Polish
- Polished the fill, blank-check, undo, and large-board cursor action symbols so they read as tactile Sunny Spoon tokens rather than temporary UI marks.
- Kept puzzle input, undo, hint spending, drag painting, and cursor behavior unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to verify control-symbol gradients, shadows, pseudo-element artwork, and cursor action icon treatment.

### v0.1.316 - Pip Conversational How-To Guide
- Reworked the in-puzzle how-to card into a Pip-led mini dialogue scene using the approved `pip-chrome-v2` character art.
- Kept guide copy, puzzle input, hint, undo, line guidance, and cursor behavior unchanged; this is a first-play presentation polish pass.
- Extended mobile QA to guard the Pip image, speech-bubble treatment, clue examples, action chips, and overflow on the 12x12 path.

### v0.1.317 - Pip Guide Dialog Art Continuity
- Swapped first-run, Time Attack, and Pantry purchase guide dialogs onto the approved `pip-chrome-v2` character art so Pip stays visually consistent across guide surfaces.
- Preserved the existing guide steps, save flow, and runtime art approval gate while removing the older guide-scene dependency from visible dialog UI.
- Extended asset and mobile QA to guard the guide dialog art source, speech-bubble treatment, and overflow across the guided onboarding paths.

### v0.1.318 - Settings Dialog Tactile Polish
- Refined the settings dialog into a more deliberate Sunny Spoon control surface with role-specific language, player-name, control-mode, audio, save, and close button treatments.
- Kept settings behavior unchanged: language preference, player name saving, control mode, sound toggles, and close flow use the same callbacks as before.
- Extended mobile QA to guard the settings title badge, active-choice marker, save button treatment, section counts, gradients, dimensions, and overflow.

### v0.1.319 - Puzzle Board Frame Polish
- Polished the active puzzle panel, puzzle meta row, and board frame into a warmer paper-tray treatment so the board surface feels intentional rather than bare scaffolding.
- Kept puzzle input, cursor controls, drag painting, hints, undo, line guidance, and completion logic unchanged; this is a presentation-only polish pass.
- Extended mobile QA to guard the active panel, meta card, board tray, grid frame, active clue treatment, gradients, shadows, bounds, and overflow.

### v0.1.320 - Time Attack Countdown Wiring Guard
- Fixed the Time Attack play header so the countdown limit passed from the app shell is explicitly destructured before the remaining-time text is rendered.
- Kept Time Attack session selection, records, hints, spoon spending, and puzzle flow unchanged; this closes a small runtime-risk gap in the play header.
- Added a source-level play-screen guard so future refactors cannot drop the countdown limit wiring silently.

### v0.1.321 - Time Attack Start Surface Polish
- Polished the Time Attack entry surface so the intro, start button, summary cards, and record panel read as one tactile Sunny Spoon game surface instead of plain utility blocks.
- Kept Time Attack session selection, countdown wiring, records, hints, spoon spending, and reward rules unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to guard the intro card, tactile start button, summary card gradients, records panel treatment, and viewport bounds on the Time Attack path.

### v0.1.322 - Opening Start CTA Token Polish
- Added a scoped Sunny Spoon token treatment to the opening start button so the first tappable action feels like part of the game art direction instead of a plain flat button.
- Kept the name-entry continue button, intro timing, player-name flow, and brand art unchanged by scoping the token to the non-name opening stage.
- Extended mobile QA to inspect the start button pseudo-element token, gradient, dimensions, and shadow along with the existing button polish guard.

### v0.1.323 - Album Map Status Card Polish
- Added compact status chips to Album cards and Badge Shelf cards so saved, hidden, earned, in-progress, and locked states read directly inside the repeated card surfaces.
- Kept album completion, badge progress, pack unlock, pantry requirements, and all reward logic unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to guard the new Album/Map state chips, gradients, dimensions, and viewport bounds so future card polish does not regress the status language.

### v0.1.324 - Stage Complete Reward Card Polish
- Added a subtle reward ribbon, fact-chip tokens, and a warmer tactile CTA treatment to the stage-complete overlay so stage completion feels more like a crafted reward moment.
- Kept stage completion detection, spoon bonuses, pack badge logic, and dismissal behavior unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to guard the reward-card pseudo-element, fact-token artwork, CTA gradient, dimensions, and overflow behavior.

### v0.1.325 - Safe Blank Suggestion Art Polish
- Reworked completed-line safe blank suggestions so the X mark is drawn as layered CSS artwork rather than raw text, keeping the board friendlier and more premium during guided play.
- Kept all completed-line guidance logic, drag painting, hints, undo, cursor controls, and puzzle state behavior unchanged; this is a presentation and regression-guard pass.
- Extended mobile QA to guard the safe-X pseudo-element layers, transparency, shadow, dimensions, and filter treatment so future board polish preserves the handcrafted symbol language.

### v0.1.326 - Guided Line Copy Polish
- Fixed the completed-line progress badge so English uses "1 line" for a single guided row or column instead of the awkward "1 lines" copy seen during mobile QA.
- Added explicit i18n coverage for the singular guided-line key while preserving Korean line copy and existing multi-line progress language.
- Kept completed-line guidance logic, safe-X art, puzzle input, hints, undo, and cursor behavior unchanged; this is a copy-quality and regression-test pass.

### v0.1.327 - Cursor Symbol Art Guard Polish
- Added richer layered treatment to completed-line safe blank X marks, cursor status chips, and large-board D-pad buttons so these controls feel like small Sunny Spoon game tokens rather than temporary symbols.
- Kept puzzle input, cursor movement, drag painting, hints, undo, and completed-line guidance logic unchanged; this is a presentation and regression-guard pass.
- Extended mobile QA to guard status-chip token artwork, D-pad shine layers, and safe-X radial/linear artwork so future UI polish preserves the handcrafted symbol language.

### v0.1.328 - Drag Preview Token Polish
- Polished the drag-stroke preview cells so swiping across multiple cells shows the same layered fill/X token language used by the rest of the puzzle controls.
- Kept drag painting behavior, safe-suggestion protection, cursor controls, hints, undo, and completion logic unchanged; this is a presentation and QA guard pass for the active gesture moment.
- Extended mobile QA to start an actual board drag and inspect the transient `.drag-preview` artwork layers before release checks pass.
### v0.1.329 - Hint Allowance Token Polish
- Polished the remaining-hint meter into small spoon-token artwork so hints still read as one simple icon action while the allowance feels like part of the Sunny Spoon interface.
- Kept hint limits, reveal counts, spoon spending, undo behavior, Time Attack hint rules, and puzzle state logic unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to guard the hint meter background, token gradients, shadows, and spoon-handle pseudo-elements so future hint UI work does not regress into plain dots.

### v0.1.330 - Clue Number Token Polish
- Polished row and column clue numbers into small glossy tokens so the puzzle clues match the tactile Sunny Spoon board, control, and hint-token language.
- Kept clue calculation, completed-line guidance, cursor movement, drag painting, hints, undo, and puzzle state behavior unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to guard active and completed clue token gradients, shine layers, and shadows so board clue readability stays premium during later layout work.
### v0.1.331 - Pip Guide Card Sticker Polish
- Polished the in-puzzle Pip how-to card so Pip, the speech bubble, clue examples, and action chips read more like a cohesive Sunny Spoon sticker guide instead of a plain instruction panel.
- Kept guide copy, puzzle logic, drag painting, hints, undo, and completed-line behavior unchanged; this is a visual polish and guard pass.
- Extended mobile QA to protect the guide card shine layer, Pip sticker frame, speech-bubble accent, clue-row shine, and action-chip marker layers.
### v0.1.332 - Floating Nav Token Polish
- Polished the floating navigation trigger and active menu items with shine, arrow, and small token layers so view switching feels like part of the Sunny Spoon HUD rather than a utility dropdown.
- Kept navigation behavior, active-view selection, labels, and route callbacks unchanged; this is a presentation and QA guard pass.
- Extended mobile QA to protect the floating nav open state, trigger shine, arrow treatment, active-item token, padding, bounds, and panel gradients.
### v0.1.333 - Header Icon Artwork Polish
- Replaced the visible text gear/reset glyphs in the main and play headers with CSS-drawn Sunny Spoon icon buttons while keeping the existing accessible labels and click behavior.
- Kept settings/reset routing unchanged; this is a UI artwork pass for first-impression chrome consistency.
- Extended mobile QA to guard icon-only header buttons, minimum tap size, gradient button art, settings gear layers, and reset arrow layers.
### v0.1.334 - Completed Line Auto Marks
- Added solution-safe automatic blank marks after a real completed row or column, so players get the friendly guidance they expect without requiring every likely blank to be tapped one by one.
- Auto marks are merged into the triggering move history, so one Undo clears the last player action and the automatic X marks together; Undo itself does not regenerate auto marks.
- Added state tests for correct-line auto marking, wrong-line protection, and grouped Undo behavior.

### v0.1.335 - Auto Mark Guide Polish
- Updated the Pip-led how-to card examples so completed-line blanks use the same soft automatic X token players now see on the board.
- Refined line-completion guide copy to explain that safe blanks are marked automatically only after a line is truly complete.
- Extended mobile QA and Korean i18n coverage so the guide, auto-mark artwork, and user-facing copy stay aligned.

## Superseded IAP / Cozy Pass Note (historical v0.1.340 context)

This block originally recorded the 2026-07-13 state where `cozyPassPurchased` and
`COZY_PASS_SPOON_GRANT` were reserved only and no Google Play Billing plugin was
installed. That is no longer the current launch plan.

Current launch direction:
- Android v1 includes one optional Play Billing support product: `pip_cozy_support`.
- The product grants the existing 250-spoon support reward once per local profile after purchase or restore.
- `@capgo/native-purchases` is installed and native Android debug compilation has passed.
- Five `bonus-pack` entries remain hidden future previews until authored/approved; they are not playable empty packs.
- Final release still requires Play Console managed-product activation and real-device purchase/restore validation. See `docs/PLAY_CONSOLE_BILLING_SETUP.md`, `docs/MONETIZATION_PLAN.md`, and the v0.1.410+ Billing sections below.

### v0.1.336 - Mobile Safe Area And Save Guard
- Added body-level overlay safe-area padding so settings, Pip guides, brand intro, and stage-complete reward surfaces stay above Android gesture navigation and iOS home indicators.
- Reset the safe-suggestion outer border cascade so the board keeps one intentional dashed guide ring instead of showing double dashed X artwork.
- Hardened restored puzzle state against damaged save payloads by normalizing unknown cell values to empty before Undo or later board logic touches them.
- Extended mobile QA and puzzle-state tests to guard the overlay safe-area padding, safe-suggestion border reset, and damaged-save recovery path.

### v0.1.337 - Opening Start Button Polish
- Refined the game-stage opening start button into a larger tactile Sunny Spoon CTA with a thicker edge, layered shine, spoon-token accent, and pressed state so the first tap feels less like a flat placeholder.
- Kept the opening flow, player-name prompt, studio bumper, Pip seal, and key visual unchanged; this slice is presentation polish with no gameplay behavior change.
- Extended mobile QA to guard the opening start CTA tap size, gradient treatment, shadow depth, clipped shine layer, and spoon-token accent.
- Repaired the IAP / Cozy Pass context block into ASCII-safe launch notes after a console encoding artifact made the Korean text hard to inspect.

### v0.1.338 - Player Intro Invitation Polish
- Polished the first-run player-name step into a tactile invitation card with a framed label, warm input field, shine layer, and full-width continue CTA so the opening flow stays premium after the first Start tap.
- Repaired Korean opening copy for the Season 0 launch note and promise chips, using Unicode escapes to prevent Windows console encoding from reintroducing mojibake.
- Extended mobile QA to inspect the player-name form card, input, label, shine layer, and continue button before filling the name.
- Added i18n regression assertions for Korean opening copy so the launch note and three promise chips remain readable.
### v0.1.339 - Pip-Led Player Name Invitation
- Added a small Pip cue to the first-run player-name step so the name request feels like an in-world invitation instead of a plain form.
- Styled the cue with the existing Pip chrome art, a warm speech-card treatment, and a small tail without introducing a new asset.
- Extended mobile QA to verify the Pip cue text, image size, card gradient, shadow, tail, and responsive width before dismissing the opening flow.

### v0.1.340 - Settings Player Name Card Polish
- Refined the Settings player-name section into a tactile card with a small spoon-token badge, warmer gradient surface, stronger input field, and clearer focus ring.
- Kept the existing settings layout and behavior intact while extending mobile QA to guard the player-form card radius, gradient, shadow, badge, and input polish.

### v0.1.341 - Pip Guide Dialogue Polish
- Strengthened the in-puzzle how-to card so Pip, the speech bubble, clue examples, and action chips read more like a friendly dialogue scene rather than a plain tutorial panel.
- Kept puzzle logic, hint rules, drag painting, undo, auto marks, and guide copy unchanged; this is a presentation polish and QA guard slice.
- Extended mobile QA to protect the Pip scene badge, speech-tail gradient, bubble depth, and existing guide-card artwork layers.

### v0.1.342 - Time Attack Coach Dialogue Polish
- Polished the Time Attack coach card so Pip's mode explanation uses the same sticker-frame, warm speech, shine, and token-chip language as the in-puzzle guide.
- Kept run selection, countdown, hint economy, records, rewards, and guide copy unchanged; this is a presentation and QA guard slice for the mode entry surface.
- Extended mobile QA to guard the coach-card shine, backing token, Pip frame, chip token artwork, and chip shine layers.

## Sunny Spoon Card UI Vocabulary - Launch Polish
- Launch-facing cards should share a warm framed surface, one soft top-shine layer, a small sticker/token accent, tactile shadow depth, and a mint or cream active state.
- UI-only polish should keep behavior stable and add a matching mobile QA guard whenever the visual treatment becomes part of the release expectation.
- Prefer CSS-native symbols and reusable sticker/token language for controls until a final raster asset exists, so placeholder text or flat utility buttons do not leak into launch surfaces.

### v0.1.343 - Settings Choice Card Vocabulary Polish
- Polished the language, control-mode, and sound setting groups into small framed cards so Settings uses the same warm surface, shine, token, and tactile shadow language as the opening, guide, and Time Attack surfaces.
- Kept language selection, player-name editing, sound toggles, control-mode selection, and close behavior unchanged; this is a presentation and QA guard slice.
- Extended mobile QA to guard the three Settings choice cards, their shine layers, and the small choice-token artwork on every language/control/audio option.

### Release Readiness - 2026-07-14 Closed Testing Day 9
- User reported Google Play production access eligibility at 9/14 days complete. Working target is to finish the Android-ready candidate within three development days, then reserve the remaining eligibility window for review, real-device checks, upload, and store-listing cleanup.
- Repaired the Android release checklist into ASCII-safe release notes so versionCode/versionName rules remain readable before the next AAB upload.
- Extended source hygiene to guard the Android release status document against common mojibake fragments, treating release-doc readability as a launch-risk item.

### Source Hygiene Guard Stability - 2026-07-14
- Converted Korean/release-note mojibake guards to escaped fragment checks so the guard source itself stays stable across PowerShell, GitHub diff, and CI encoding paths.
- Verified the narrower guard avoids false positives on normal Korean release notes while still preserving launch-risk detection for known corrupted fragments.

### v0.1.344 - Pantry Room Path Chips
- Bumped the visible app version to v0.1.344 and added a three-chip room path inside the Pantry progress mission card: request count, next puzzle stage, and spoon progress.
- The intent is to make the first-session economy loop easier to read at a glance: Pip requests are not optional decoration clutter; they are the bridge to the next stage plus the reason to keep earning spoons.
- Extended mobile QA to require the new path chips and protect their mobile tap-size/readability alongside the existing mission meter and facts.

### v0.1.345 - Completion Reward Fact Chips
- Bumped the visible app version to v0.1.345 and added three small reward fact chips to the puzzle completion banner: album saved, room path grows, and next picture ready.
- The completion moment now reinforces why the player should continue without changing completion timing, replay reward rules, or the existing Album/Next Picture actions.
- Extended mobile QA to require the three completion fact chips, their readable tap-sized layout, and warm gradient treatment on mobile viewports.

### v0.1.346 - Pip-Led Pantry Request Card
- Bumped the visible app version to v0.1.346 and upgraded the first Pantry request card with the approved Pip chrome art so the shop entry reads like a character-led request, not only an item catalog.
- Kept Pantry purchase, slot filtering, story goals, completion archive, and spoon economy behavior unchanged; this is launch-facing presentation polish.
- Extended mobile QA to guard the Pip cameo, shine layer, rounded card frame, and polished request-card treatment on mobile viewports.

### v0.1.347 - Pantry Shop Delivery Card Polish
- Bumped the visible app version to v0.1.347 and polished Pantry shop items into warm delivery-style cards with a framed item-art stage, shine layer, clearer rarity/cost chips, and full-width tactile action buttons.
- Replaced the inline shop-card meta separator with structured rarity and spoon-cost chips so the catalog stays readable across Korean/English and Windows console encodings.
- Kept purchase, equip, filtering, sorting, story goals, and spoon economy behavior unchanged while extending mobile QA to guard the card frame, art stage, meta chips, shine layer, and CTA tap target.

### v0.1.348 - Pantry Shop Reveal Control Polish
- Bumped the visible app version to v0.1.348 and upgraded the Pantry shop reveal control with a progress meter, shine layer, spoon-token CTA, and stronger mobile tap target.
- Kept the progressive 6-card reveal logic unchanged; the new meter only makes the remaining decoration catalog feel intentional instead of like a plain pagination button.
- Extended mobile QA to guard the reveal card frame, meter fill, clipped shine, spoon-token button accent, and responsive full-width CTA behavior.

### v0.1.349 - Pantry Action Feedback Reward Polish
- Bumped the visible app version to v0.1.349 and polished Pantry purchase/story-complete feedback into reward-style cards with a stronger framed surface, clipped shine, token accent, and deeper item-art stage.
- Kept purchase, equip, room slot, story-goal, completion archive, and spoon economy behavior unchanged; this is presentation polish for the post-purchase reward moment.
- Extended mobile QA to guard the feedback frame, shine/token artwork, item-art stage, dismiss tap target, and story-complete reward variant on mobile viewports.


### v0.1.350 - Pantry Room Slot Polish
- Bumped the visible app version to v0.1.350 and upgraded the fixed Pantry room slots with a warm room frame, floor/wall split, tactile slot cards, dashed empty-place affordance, selected-state glow, and item-art staging.
- Kept slot selection, shop filtering, purchase/equip behavior, story goals, and the five-slot capacity model unchanged while making the physical placement model clearer at a glance.
- Extended mobile QA to guard the room frame, pseudo-layer divider, five absolute placement slots, slot radius, and border depth on mobile viewports.


### v0.1.351 - Pantry Placement Advisor Polish
- Bumped the visible app version to v0.1.351 and upgraded the Pantry placement advisor into a warm planning card with a spoon-token badge, clipped shine, deeper border, and clearer selected-slot explanation.
- Kept slot selection, fixed placement capacity, shop filtering, and economy behavior unchanged; the card now better supports the user question of where a decoration will go before spending spoons.
- Extended mobile QA to guard the advisor frame, left token spacing, token artwork, shine layer, and radial/linear card treatment on mobile viewports.


### v0.1.352 - Pantry Display Plan Polish
- Bumped the visible app version to v0.1.352 and upgraded the Pantry display plan into a matching upgrade card with clipped shine, a gold token accent, and a framed next-decoration step.
- Kept selected-slot filtering, equipped-state copy, next decoration cost math, and shop behavior unchanged; this is a visual/readability pass on the same placement economy flow.
- Extended mobile QA to guard the display plan frame, token artwork, shine layer, and next-step icon treatment on mobile viewports.


### v0.1.353 - Pantry Savings Goal Polish
- Bumped the visible app version to v0.1.353 and upgraded item savings meters plus the tracked-goal button into small economy cards with spoon-token artwork, thicker progress depth, and active-state glow.
- Kept shop ordering, affordability math, selected slot filtering, and tracked-goal persistence unchanged; this pass improves the visual reward loop around saving spoons for a decoration.
- Extended mobile QA to guard savings-card frame, token artwork, meter depth, and tracked-goal active treatment on mobile viewports.


### v0.1.354 - Pantry Pip Cameo Guard
- Bumped the visible app version to v0.1.354 and hardened the first Pantry request Pip cameo so the character image is built with explicit DOM nodes instead of HTML string insertion.
- Kept request selection, purchase flow, slot filtering, card copy, and Pip artwork unchanged; this is a safety and launch-polish guard for the character-led shop entry surface.
- Extended mobile QA to guard Pip cameo pointer behavior, speech-tail artwork, image layering, and decorative alt text so future card polish cannot accidentally turn Pip into a blocking or screen-reader-visible control.


### v0.1.355 - Pantry Story Milestone Delivery Polish
- Bumped the visible app version to v0.1.355 and upgraded the post-first-purchase milestone plus delivery-note cards with the same framed surface, shine, token, and tactile action language used by the newer Pantry shop cards.
- Kept story goal selection, next-arrival persistence, purchase flow, spoon math, and slot placement unchanged; this is a launch-facing presentation pass for the first decoration story loop.
- Extended mobile QA to guard milestone card frame, level/item chip polish, delivery-note solid card treatment, step chips, and 44px action controls on mobile viewports.


### v0.1.356 - Pantry Story Archive Polish
- Bumped the visible app version to v0.1.356 and upgraded the completed-request archive into the same cozy framed card language as the newer Pantry story surfaces.
- Kept completed-goal persistence, next-request planning, stage-gate math, and shop routing unchanged; this is a launch-facing polish pass for the loop summary that appears after a decoration request is fulfilled.
- Extended mobile QA to guard the archive frame, progress meter, chapter card, stage-goal card, next-request CTA, and completed-item chips across mobile viewports.


### v0.1.357 - Pantry Progress Board Polish
- Bumped the visible app version to v0.1.357 and upgraded the Pantry collection progress board into the same framed, token-accented card language as the newer story and shop surfaces.
- Kept collection counts, slot ownership math, room-path mission, spoon gate copy, and shop routing unchanged; this is a presentation/readability pass for the always-visible progress loop.
- Extended mobile QA to guard the progress-board frame, clipped shine, token accent, summary pill, five slot cards, and slot-token artwork across mobile viewports.


### v0.1.358 - Pantry Economy Plan Polish
- Bumped the visible app version to v0.1.358 and upgraded the Pantry savings-goal and earning-plan cards into the same warm spoon-economy card language as the item savings chips.
- Kept target-item selection, tracked-goal retargeting, spoon gap math, starter/daily run estimates, and Time Attack routing unchanged; this is a UI clarity pass for the spend/earn loop.
- Extended mobile QA to guard the savings-goal frame, spoon token, shine layer, meter depth, earning-plan frame, and spoon-accented action button across mobile viewports.


### v0.1.359 - Pantry Filter Controls Polish
- Bumped the visible app version to v0.1.359 and upgraded Pantry slot, rarity, availability, sort, filter-summary, and reset controls into the same tactile chip language as the polished shop cards.
- Kept all filtering, sorting, visible-card limit, reset behavior, and selected-slot persistence unchanged; this is a visual consistency pass for the decoration browsing workflow.
- Extended mobile QA to guard the filter-stack frame, active filter chips, active sort chip, sort label, filtered summary card, clear button, and empty-state reset button across mobile viewports.


### v0.1.360 - Pantry Story Request CTA Polish
- Bumped the visible app version to v0.1.360 and upgraded the first Pantry request target chip plus CTA button into the same tactile, spoon-token card language as the newer shop surfaces.
- Kept request selection, starter decoration choice, ownership/equip checks, and action routing unchanged; this is a first-purchase guidance and touch-quality pass.
- Extended mobile QA to guard the request card border/shadow, Pip cameo depth, target chip artwork, and CTA shine/border/radius treatment across mobile viewports.


### v0.1.361 - Pantry Item Signal Chip Polish
- Bumped the visible app version to v0.1.361 and upgraded item status, slot note, and swap note text into compact signal chips with small CSS-drawn token icons.
- Kept item status selection, buy/equip routing, slot filtering, swap warnings, and savings logic unchanged; this is a readability and decision-support pass inside each shop card.
- Extended mobile QA to guard status/note chip height, radius, border, clipped background, and icon artwork across mobile viewports.


### v0.1.362 - Opening Promise Chip Depth Polish
- Bumped the visible app version to v0.1.362 and upgraded the three opening promise chips with a clipped shine layer, thicker framed border, deeper tactile shadow, and a tiny corner token accent.
- Kept the studio bumper timing, player-name flow, start button, and promise copy unchanged; this is a first-impression visual consistency pass.
- Extended mobile QA to guard the promise chip border depth, clipped shine, corner token, and no-overflow behavior across mobile viewports.


### v0.1.363 - Reset Dialog Confirmation Polish
- Bumped the visible app version to v0.1.363 and upgraded the reset confirmation dialog into a warm framed modal with shine, warning token, body card, and tactile cancel/confirm buttons.
- Kept reset semantics unchanged; mobile QA opens the dialog and cancels it so no player progress is cleared during validation.
- Extended mobile QA to guard reset dialog frame depth, title badge artwork, body-card treatment, button tap size, and no-overflow behavior across mobile viewports.


### v0.1.364 - Stage Navigation Button Polish
- Bumped the visible app version to v0.1.364 and upgraded the in-puzzle previous/list/next navigation into a framed tactile card with clipped shine, stronger button depth, and CSS-drawn direction/list tokens.
- Kept stage routing, disabled previous/next behavior, list navigation, Time Attack, and replay challenge flows unchanged; this is a presentation and touch-quality pass for the normal stage screen.
- Extended mobile QA to guard the stage navigation frame, shine layer, three button variants, disabled-state treatment, icon artwork, and no-overflow behavior across mobile viewports.


### v0.1.365 - Pip Guide Dialog Tactile Polish
- Bumped the visible app version to v0.1.365 and rebuilt the first-run guide dialog rendering with explicit DOM nodes instead of HTML string insertion.
- Upgraded the Pip guide scene with clipped shine, small spoon-token accents, deeper art framing, and tactile skip/next buttons while keeping guide step content, seen-guide saves, and puzzle/time-attack/pantry guide routing unchanged.
- Extended mobile QA to guard the guide art frame, Pip image, bubble tail, token accents, button shine, and no-overflow behavior across mobile viewports.


### v0.1.366 - Puzzle Hub Selection Polish
- Bumped the visible app version to v0.1.366 and upgraded the stage preview plus puzzle chips with thicker framed surfaces, clipped shine, small token accents, and clearer active/complete/locked visual states.
- Kept puzzle unlocking, pack gating, active puzzle selection, completion state, and 333-puzzle catalog behavior unchanged; this is a selection-surface polish pass.
- Extended mobile QA to guard the stage preview frame, shine/token layers, puzzle chip tap size, active/locked card treatment, and no-overflow behavior across mobile viewports.


### v0.1.367 - Daily Reward Card Polish
- Bumped the visible app version to v0.1.367 and upgraded the daily reward card into a framed spoon-economy surface with clipped shine, token accent, reward pill, and a deeper tactile play button.
- Kept daily puzzle selection, active-state disabling, bonus amount, and reward persistence unchanged; this is a launch-facing polish pass for the daily return loop.
- Extended mobile QA to guard the daily card frame, shine/token layers, reward amount pill, CTA button depth, and no-overflow behavior across mobile viewports.


### v0.1.368 - Time Attack Summary Records Polish
- Bumped the visible app version to v0.1.368 and upgraded Time Attack summary cards plus records panel with framed score-card surfaces, clipped shine, spoon-token accents, and readable record rows.
- Kept Time Attack run creation, daily reward counts, best-score sorting, and record math unchanged; this is a presentation and QA-readability pass for the competitive loop.
- Extended mobile QA to guard summary-card shine/token layers, records-panel frame treatment, row height, and no-overflow behavior across mobile viewports.


### v0.1.369 - Reset Dialog Flow QA Guard
- Bumped the visible app version to v0.1.369 and closed the reset-dialog review flag by making mobile QA exercise the real reset button, modal backdrop, dialog copy, cancel/confirm labels, and cancel-return flow.
- Kept reset semantics and reset-dialog UI artwork unchanged; this is a launch-readiness guard for a destructive confirmation surface.
- Extended mobile QA to verify safe-area backdrop padding, dialog viewport containment, localized copy intent, button tap size, and app-shell recovery after cancel.


### v0.1.370 - Pantry Feedback Pip Cameo Polish
- Bumped the visible app version to v0.1.370 and upgraded Pantry purchase, equip, and story-complete feedback cards with the approved Pip guide cameo asset.
- Rebuilt the feedback copy with explicit DOM nodes instead of HTML string insertion while keeping purchase/equip/story completion logic, spoon accounting, and placement behavior unchanged.
- Extended mobile QA to guard the Pip cameo frame, speech-tail accent, image size, reward frame, item art, and story-complete feedback treatment across mobile viewports.


### v0.1.371 - Pantry Delivery Pip Stamp Polish
- Bumped the visible app version to v0.1.371 and added the approved Pip guide art as a small delivery-stamp cameo on active Pantry delivery notes.
- Rebuilt the delivery-note copy and step chips with explicit DOM nodes instead of HTML string insertion while keeping goal selection, spoon-gap math, persistence, and shop routing unchanged.
- Extended mobile QA to guard the delivery Pip stamp frame, speech-tail accent, image size, delivery card frame, step chips, and action buttons across mobile viewports.


### v0.1.372 - Pantry Progress Mission Card Polish
- Bumped the visible app version to v0.1.372 and rebuilt the Pantry room-path mission card with explicit DOM nodes instead of HTML string insertion.
- Upgraded the mission card with a clipped shine layer, spoon-token accent, deeper framed surface, and stronger progress-meter depth while keeping room-step targets, spoon-gate math, and action routing unchanged.
- Extended mobile QA to guard the mission card border, clipped shine, token accent, meter depth, route chips, facts, and action layout across mobile viewports.


### v0.1.373 - Settings Dialog DOM Safety Polish
- Bumped the visible app version to v0.1.373 and rebuilt the Settings dialog title, language note, player-name form, control copy, and audio label with explicit DOM nodes instead of HTML string insertion.
- Removed the now-unneeded manual attribute escaping helper because the player name is assigned through the input value API.
- Kept language selection, player-name save, control mode, audio toggles, close behavior, and existing tactile settings artwork unchanged while relying on the existing mobile QA settings guards.


### v0.1.374 - Pantry Delivery Pip Selector Cleanup
- Bumped the visible app version to v0.1.374 and closed the reviewed duplicate CSS selector on the Pantry delivery Pip stamp.
- Moved the stamp layering directly into the single .pantry-story-delivery__pip rule while keeping the frame, speech-tail accent, image sizing, delivery card behavior, and mobile QA expectations unchanged.
- This is a small CSS hygiene pass to keep the polished Pantry story-card artwork easier to maintain before release QA.



### v0.1.375 - Pantry Story Cards DOM Safety Polish
- Bumped the visible app version to v0.1.375 and removed the remaining HTML string insertion paths from the Pantry story request, milestone, and archive cards.
- Added a tiny shared DOM text helper so localized copy is assigned through textContent while preserving all existing class names, CTA wiring, progress math, and mobile QA selectors.
- This keeps the Pantry story surfaces safer for Android WebView/CSP and reduces late-release copy/rendering risk without changing the user-facing flow.


### v0.1.376 - Album Map DOM Safety Polish
- Bumped the visible app version to v0.1.376 and rebuilt the Album header/cards plus Pantry Map header with explicit DOM nodes instead of HTML string insertion.
- Preserved all album/map class names, completion date formatting, badge progress math, and mobile QA selectors while assigning localized copy through textContent.
- This continues the release-hardening pass on user-facing collection surfaces without changing progression, badge, or navigation behavior.

### v0.1.377 - Opening And Completion DOM Safety Polish
- Bumped the visible app version to v0.1.377 and rebuilt the stage-complete overlay with explicit DOM nodes instead of HTML string insertion.
- Rebuilt the Sunny Spoon Studios opening intro and first-player name step with DOM/textContent while preserving the existing studio bumper timing, start CTA, player-name save, and version display.
- This closes two launch-facing first-impression surfaces in the release-hardening pass without changing puzzle progression, rewards, or onboarding behavior.

### v0.1.378 - App Chrome And Play Header DOM Safety Polish
- Bumped the visible app version to v0.1.378 and rebuilt the global header, Pip strip, badge shelf, and reset dialog with explicit DOM nodes instead of HTML string insertion.
- Rebuilt the play-screen title block and hint confirmation spoon-cost chip with textContent/DOM nodes while preserving existing classes, icons, event handlers, and mobile QA selectors.
- This extends the release-hardening pass across the most common navigation and in-play surfaces without changing save data, puzzle state, hint economics, or reset behavior.

### v0.1.379 - Time Attack And Puzzle Meta DOM Safety Polish
- Bumped the visible app version to v0.1.379 and rebuilt the Time Attack intro and Pip coach copy with explicit DOM nodes instead of HTML string insertion.
- Rebuilt the puzzle meta header with textContent and switched the puzzle redraw clear step to replaceChildren() while preserving completion, replay, hint, and board-control behavior.
- This keeps the competitive Time Attack entry surface and main puzzle metadata safer for Android WebView/CSP without changing gameplay state or reward math.

### v0.1.380 - Puzzle Hub DOM Safety Polish
- Bumped the visible app version to v0.1.380 and rebuilt the puzzle hub, season progress, daily puzzle, replay picks, pack headers, stage preview, and unlock panels with explicit DOM nodes.
- Removed HTML string insertion from puzzleHubView.js while preserving pack unlock actions, pantry routing, replay pick selection, stage meters, and spoon icon rendering.
- This protects the launch hub from i18n/data insertion regressions and keeps the seasonal progression surface ready for Android WebView QA.

### v0.1.381 - Pantry And Shell DOM Safety Polish
- Bumped the visible app version to v0.1.381 and rebuilt the Pantry shop cards, savings goal, earning plan, collection progress, placement advisor, display plan, shop header, and shop limit meter with explicit DOM nodes.
- Replaced Pantry and app-shell redraw clearing with replaceChildren() while preserving decoration buying, equipping, story requests, tracked goals, filters, and shop pagination.
- This removes the remaining Pantry HTML string insertion path and keeps the decoration economy surface safer for Android WebView QA.

### v0.1.381 Release Gate Addendum
- Added `scripts/android_release_gate.js` plus `npm run qa:release` and `npm run qa:release:final`.
- The normal gate keeps package/UI version sync and release checklist coverage visible during polish, while the final gate blocks signed Play-upload builds if Android `versionCode` / `versionName` still match the last Play Console upload.
- This keeps Android numbering as a deliberate final-release action instead of a silent manual note.

### v0.1.381 Candidate QA Addendum
- Added `scripts/release_candidate_check.js` plus `npm run qa:candidate` to run the launch-candidate validation ladder in one command.
- The candidate gate runs Vitest, catalog, hygiene, asset manifest, production build, normal Android release gate, a temporary Vite dev server, mobile visual QA, and an HTTP 200 probe.
- This keeps the final Android review loop faster and less error-prone while leaving `qa:release:final` as the stricter pre-AAB numbering block.
### v0.1.381 Android Candidate QA Addendum
- Added `scripts/android_candidate_check.ps1` plus `npm run qa:android:candidate` to chain the web candidate gate, Capacitor sync, unsigned Android release bundle build, and AAB output sanity check.
- This is the fast pre-upload Android candidate lane. It does not replace `npm run qa:release:final`, which must still be run after the final `versionCode` / `versionName` bump before signed Play upload.
### v0.1.381 Runtime HTML Hygiene Addendum
- Extended `npm run qa:hygiene` to fail if runtime UI/data/game code reintroduces `innerHTML`, `outerHTML`, or `insertAdjacentHTML` paths.
- QA scripts may still use controlled fixture markup, but player-facing Android WebView surfaces now stay guarded behind explicit DOM construction.
### v0.1.381 Signed AAB Final Gate Addendum
- Updated `scripts/build_android_signed_release_bundle.ps1` so signed Play-upload builds run `npm run qa:release:final` before checking signing secrets or producing an AAB.
- This prevents an accidental signed upload bundle with the last Play Console `versionCode` / `versionName` after local polish builds.
### v0.1.381 Android Native Exit Guard Addendum
- Hardened Android PowerShell build wrappers so native commands such as `npm`, `npx`, and `gradlew.bat` throw on non-zero exit codes under Windows PowerShell.
- This ensures `build_android_signed_release_bundle.ps1` stops immediately at `qa:release:final` until Play upload numbering is bumped, instead of continuing into signing checks after a failed gate.
### v0.1.381 Play Store Asset QA Addendum
- Added `scripts/play_store_asset_check.js` plus `npm run qa:store` to verify Play Console app icon, feature graphic, phone screenshots, and tablet screenshots exist at their expected dimensions.
- Wired the store asset check into `npm run qa:candidate` so final review catches missing or wrong-size graphics before Play Console upload work.

### v0.1.381 Play Store Listing QA Addendum
- Refreshed `docs/PLAY_CONSOLE_STORE_LISTING.md` for the current launch shape: Season 0 with 333 puzzles, Pantry goals, Time Attack, spoon rewards, no login, and no third-party ads/tracking SDKs.
- Added `scripts/play_store_listing_check.js` plus `npm run qa:store-listing` to guard the Play Console listing draft for current date, app name, short-description length, privacy URL, launch positioning, screenshot paths, and forbidden monetization wording.
- Wired the listing check into `npm run qa:candidate` so final Android review validates both Play Store graphics and submission copy before upload.

### v0.1.381 Candidate Mobile Port QA Addendum
- Fixed `scripts/mobile_visual_check.js` so mobile QA respects `PPP_QA_PORT` when the release candidate runner starts a temporary Vite server on a non-default port.
- Verified `PPP_QA_PORT=5174 npm run qa:candidate` end-to-end: Vitest 99 passed, catalog 333/333, hygiene, assets, store assets, store listing, production build, release gate, HTTP 200, and mobile QA across 360/390/430px all passed.
- This keeps candidate QA usable even when the normal local preview on 5173 is stopped, busy, or reserved for manual review.

### v0.1.381 Privacy Policy QA Addendum
- Refreshed both `docs/PRIVACY_POLICY.md` and hosted `store-assets/privacy-policy.html` to the current release-review date.
- Added `scripts/privacy_policy_check.js` plus `npm run qa:privacy` to verify Markdown and hosted privacy policy copy stay aligned on local-only data, no ads/analytics/tracking SDKs, no data sharing, reset/uninstall deletion guidance, and contact email.
- Wired the privacy policy check into `npm run qa:candidate` after Play Store listing validation so submission copy, public policy HTML, and candidate QA remain in sync.

### v0.1.381 Live Privacy Policy Deployment Addendum
- Refreshed Play Store listing and privacy policy dates to 2026-07-16, deployed `store-assets/privacy-policy.html` to Firebase Hosting, and verified the public policy URL returns HTTP 200.
- Added `npm run qa:privacy:live` to compare the local Markdown/HTML privacy policy against `https://sunny-spoon-pantry.web.app/privacy-policy.html`.
- Keep `qa:privacy` in the normal candidate gate for offline local checks, and run `qa:privacy:live` after any privacy policy hosting deploy or before final Play Console submission.

### v0.1.381 Signed Upload QA Chain Addendum
- Updated `scripts/build_android_signed_release_bundle.ps1` so the signed Play-upload path now runs `npm run qa:candidate`, `npm run qa:privacy:live`, and `npm run qa:release:final` before checking signing secrets or building the release bundle.
- This keeps the final AAB path tied to the same web/mobile/store/privacy checks used during release review, with the stricter Android numbering and Billing evidence gates still protecting the signed upload.

### v0.1.382 - Stage Complete Fallback Art Polish
- Bumped the visible app version to v0.1.382 and replaced the stage-complete pending-art text block with the approved `pip-completion-v2.png` fallback when a pack does not yet have dedicated stage art.
- Added fallback-specific styling so the reward card still feels like a finished Sunny Spoon/Pip celebration instead of a construction placeholder.
- Strengthened mobile visual QA so the stage-complete fixture now fails if `.stage-complete-pending-art` reappears or if the fallback art loses its radial cozy backdrop.

### v0.1.383 - Stage Preview Fallback Polish
- Bumped the visible app version to v0.1.383 and replaced the Puzzle Hub stage preview text fallback with a textless cozy tile mosaic.
- Removed unused `badges.artPending*` i18n keys so placeholder stage-art copy cannot resurface through the stage preview path.
- Kept the mobile QA guard that fails if `.stage-art-pending` appears, while preserving existing approved stage art mosaics for the current launch packs.

### v0.1.384 - Pantry Placement CTA Clarity
- Bumped the visible app version to v0.1.384 and changed owned decoration actions from generic equip wording to slot-specific placement copy, for example `Place in Counter`.
- Clarified the locked purchase CTA to include the spoon unit (`Need N spoons`) so the shop economy reads as one spoon-based system instead of an unexplained number.
- Added i18n regression coverage for the Korean placement CTA and spoon-shortage copy.

### v0.1.384 QA Hardening Addendum
- Rebuilt the remaining mobile visual QA HTML fixtures with explicit DOM nodes so the launch QA layer follows the same no-HTML-string discipline as the runtime UI.
- Consolidated the Pantry request Pip cameo CSS so the same border and shadow treatment lives in the base selector instead of a later duplicate override.
- Verified `npm run qa:candidate` after both changes, and verified `npm run qa:android:candidate` after the CSS cleanup. The only remaining Android candidate warnings are the expected final-upload `versionCode` / `versionName` bump reminders.

### v0.1.384 QA Fixture Hygiene Guard Addendum
- Extended `npm run qa:hygiene` so `scripts/mobile_visual_check.js` also fails if controlled mobile QA fixtures reintroduce `innerHTML`, `outerHTML`, `insertAdjacentHTML`, or `document.write`.
- This keeps the QA layer aligned with the runtime Android WebView/CSP hardening rule: fixtures and player-facing UI should use explicit DOM nodes and textContent instead of HTML string insertion.
- Verification: `node --check scripts\source_hygiene_check.js`, `npm run qa:hygiene`, and `PPP_QA_PORT=5174 npm run qa:candidate` all passed. Expected Android final-upload version warnings remain only until the final `versionCode` / `versionName` bump.


### v0.1.384 Android Release Chain Guard Addendum
- Strengthened `npm run qa:release` so `docs/ANDROID_RELEASE_STATUS.md` must keep the launch-critical chain visible: candidate QA, Android candidate QA, live privacy QA, the signed AAB script, and the 333-puzzle Season 0 target.
- This turns the release status document into a guarded checklist instead of a passive note, reducing the chance that final Play upload preparation drifts away from the actual QA path.
- Verification: `node --check scripts\android_release_gate.js`, `npm run qa:release`, and `PPP_QA_PORT=5174 npm run qa:candidate` all passed. Expected Android final-upload version warnings remain only until the final `versionCode` / `versionName` bump.

### v0.1.384 GitHub Verify Release QA Addendum
- Expanded `.github/workflows/verify.yml` so GitHub Actions now checks Play Store graphics, Play Store listing copy, local privacy policy alignment, and the Android release gate in addition to hygiene, assets, catalog, tests, and build.
- This gives Claude/GitHub review a faster signal when release-facing assets, policy copy, or Android numbering notes drift from the local candidate QA path.
- Verification: `npm run qa:store`, `npm run qa:store-listing`, and `npm run qa:privacy` all passed locally after wiring the workflow steps.

### v0.1.384 Candidate QA Port Fallback Addendum
- Updated `scripts/release_candidate_check.js` so `npm run qa:candidate` keeps an explicit `PPP_QA_PORT` strict, but automatically falls forward from 5173 to the next open local port when the default preview port is already busy.
- This lets release QA run while a manual preview or browser session is open, reducing false failures during final Android review.
- Verification: `node --check scripts\release_candidate_check.js`, `npm run qa:release`, and `npm run qa:candidate` all passed. Expected Android final-upload version warnings remain only until the final `versionCode` / `versionName` bump.

### v0.1.385 Pip-Led First-Play Guide Copy Polish
- Bumped the visible app version to v0.1.385 and made the first-play how-to card read more like Pip speaking beside the player instead of a generic instruction card.
- Added a dedicated Pip dialogue line above the clue explanation while keeping the existing completed-line safe-X guidance visible.
- Strengthened mobile visual QA so the polished how-to card now fails if the Pip dialogue line disappears.

### Guide Dialog Text QA Guard
- Strengthened mobile visual QA so Pip guide dialogs now fail if the eyebrow, title, or body copy disappears while the chrome art and button frame remain visible.
- This is a QA-only guard for the launch polish phase; no visible app version bump was needed.

### Time Attack Guide Story QA Guard
- Strengthened mobile visual QA so the Time Attack first-run guide now validates all three story beats: mode framing, limited hints plus spoon continuation, and record chasing versus spoon saving.
- This is a QA-only guard for the launch polish phase; no visible app version bump was needed.

### Android Release Chain Store/Policy Guard Addendum
- Strengthened `npm run qa:release` so the Android release status checklist must explicitly mention Play Store graphics QA, Play Store listing QA, local privacy QA, live privacy QA, Android candidate QA, the signed AAB script, and the 333-puzzle Season 0 target.
- Updated `docs/ANDROID_RELEASE_STATUS.md` so the verified candidate output names store listing copy and local privacy policy alignment, not only generic candidate QA.
- This is a QA/documentation guard for final Play upload readiness; no visible app version bump was needed.
- Verification: `node --check scripts\\android_release_gate.js`, `npm run qa:release`, and `npm run qa:candidate` all passed. Expected Android final-upload version warnings remain only until the final `versionCode` / `versionName` bump.

### Android Candidate Signed-Upload Guidance Addendum
- Updated `scripts/android_candidate_check.ps1` so a passing unsigned Android candidate points to the signed upload script, not only the final release-number gate.
- The final console guidance now matches the real signed path: bump Android `versionCode` / `versionName`, then run `scripts/build_android_signed_release_bundle.ps1`, which reruns `qa:candidate`, `qa:privacy:live`, and `qa:release:final` before signing.
- Verification: PowerShell parser syntax check passed for `scripts/android_candidate_check.ps1`.

### v0.1.410 - Cozy Support Pack Billing Foundation
- Direction changed from deferred IAP to a v1-ready optional support purchase, because the first public impression should not teach players that the game has no store economy and then surprise them later.
- Added the Capacitor 8-compatible @capgo/native-purchases plugin path for Android Google Play Billing, using one non-consumable product ID: pip_cozy_support.
- The purchase grants the existing COZY_PASS_SPOON_GRANT value of 250 spoons through the existing cozyPassPurchased save field, with a local duplicate guard so purchase/restore cannot double-grant spoons on the same profile.
- Player-facing copy must avoid words like paid/free tier in the puzzle UI. The app should present this as an optional Pip Support Pack that adds spoons, while Play Store handles the actual purchase sheet.
- v1 scope remains client-side purchase recognition only. Server-side receipt validation and cross-device account entitlement can be considered after launch if support-pack usage justifies it.

### v0.1.415 Support Pack Status Feedback Guard
- Bumped the visible app version to v0.1.415 and package version to 0.1.415.
- Added explicit status tones for the Pip Support Pack card so checking, success, warning, and ready states are visually distinct without introducing hard paid/free tier language.
- Added `aria-live="polite"` to the support status line and extended unit/mobile QA coverage so purchase, restore, failure, network, and unsupported states keep honest player feedback.
- This closes one more launch trust gap: if Play Billing is unavailable or a purchase fails, the app now looks intentionally recoverable rather than half-ready.

### v0.1.414 Billing Failure Copy Guard
- Bumped the visible app version to v0.1.414 and package version to 0.1.414.
- Added explicit support-pack status copy for network errors and failed/wrong-product store responses so the settings card never falls back to "ready" after a failed purchase or restore attempt.
- Exported the support-pack status resolver for focused tests, added billing coverage for failed store request copy, and extended `qa:billing` to require the new player-safe status keys.
- This keeps the launch purchase path honest: cancelled, missing, offline, and failed flows remain clearly recoverable, with no implication that spoons were spent.

### v0.1.413 Monetization Copy Guard
- Bumped the visible app version to v0.1.413 and package version to 0.1.413.
- Reframed launch-facing pack and Pantry starter labels away from paid/free category language: starter/free items now read as included/basic, and future pack previews read as upcoming optional sets.
- Hardened qa:billing so support-pack and future-pack player-facing copy is checked from actual i18n values and cannot reintroduce paid/free or Korean paid/free terms.
- This keeps the v1 economy visible from launch while preserving the cozy, optional support framing.

### v0.1.412 Pantry Support Pack Discovery

- Bumped the visible app version to v0.1.412 and package version to 0.1.412.
- Connected the Pantry earning-plan card to the Settings support pack card so players who are short on spoons can discover the optional Pip Support Pack from the natural economy moment, without using paid/free wording in the player-facing Pantry copy.
- Added mobile QA coverage that verifies the earning plan still explains the spoon gap, exposes the support pack fallback, opens the support card, and closes back to Pantry cleanly across 360x740, 390x844, and 430x932.
- Verification: syntax checks for appShell, pantryView, i18n, and mobile QA passed; full Vitest passed with 103 tests; qa:billing, qa:hygiene, and qa:mobile passed.

### v0.1.411 Billing QA Guard Addendum
- Added `npm run qa:billing` so the optional Pip Support Pack cannot drift away from Android Billing permissions, product ID wiring, i18n copy, policy docs, and Play Console listing disclosure.
- Wired Billing QA into `npm run qa:candidate` and the Android release gate so final candidate checks include the monetization surface, not only gameplay and store graphics.
- The player-facing copy remains one gentle support/spoon surface; the guard fails if support-pack UI copy reintroduces paid/free or ?�료/무료 wording.

### Playable Pack Catalog Guard Addendum
- Strengthened `npm run qa:catalog` so any launch/playable pack with zero authored puzzles fails immediately, while `bonus-pack` entries may remain hidden future previews.
- This protects the Season 0 launch flow from accidentally exposing an empty stage after the catalog pivot to 333 polished puzzles plus later seasonal drops.
- The Billing QA forbidden-copy regex is already normalized to explicit Korean terms (`?�료` / `무료`), so the guard remains readable and does not depend on mojibake fragments.
### Support Pack Visible Copy QA Guard
- Mobile visual QA now verifies that the Settings Support Pack card renders with both support and restore actions, keeps the 250-spoon value visible, and does not expose paid/free tier wording in player-facing copy.
- This closes the remaining Billing UI wiring gap before real Play Console product testing: code paths, startup restore sync, and visible support-card copy are now guarded locally.
### Android Candidate Billing Reminder Guard
- The Android candidate script now prints the Billing product activation and real-device purchase/restore evidence requirement immediately after the unsigned candidate AAB check passes.
- This mirrors the hard `qa:release:final` gate, but surfaces the reminder earlier so the final signed upload is not blocked by a forgotten Play Console product setup step.


### v0.1.423 Small Spoon Jar Billing Product
- Added the second v1 Android store product: `pip_spoon_jar_small`, a repeatable Small Spoon Jar that grants 750 spoons through `SPOON_JAR_SMALL_GRANT`.
- The Support Pack remains one-time and restorable; the Small Spoon Jar is consumable and uses `processedBillingPurchaseIds` to prevent duplicate local grants from the same store token.
- Updated billing QA and release docs so final Play Console setup must activate both `pip_cozy_support` and `pip_spoon_jar_small` before signed upload testing.

### v0.1.424 Spoon Jar Settings Billing Wiring
- Bumped the visible app version to v0.1.424 and package version to 0.1.424.
- Connected the Small Spoon Jar product to the Settings Billing surface so opening Settings loads both `pip_cozy_support` and `pip_spoon_jar_small`, with separate product identifiers, status copy, and purchase/restore roles.
- Strengthened Billing and mobile QA so Support Pack remains one-time/restorable, Small Spoon Jar remains repeatable, both cards avoid paid/free wording, and `npm run qa:candidate` only leaves the expected real-device Billing evidence warnings before final signed upload.

### v0.1.425 Hidden Bonus Pack Launch Guard
- Bumped the visible app version to v0.1.425 and package version to 0.1.425.
- Locked the five future `bonus-pack` / `*-plus` theme packs behind an explicit launch guard: they remain authored in metadata for later seasonal/store expansion, but they do not render in the puzzle picker until their art, puzzles, and purchase path are ready.
- Added `npm run qa:bonus-pack`, wired it into `npm run qa:candidate`, and extended mobile/unit coverage so hidden future packs cannot accidentally leak into launch UI while Pantry goals and unlock logic continue to ignore them.

### v0.1.425 Launch Integrity QA Guard Addendum
- Added npm run qa:launch-integrity and wired it into npm run qa:candidate so final Android upload numbering, pack unlock guidance, and replay-clean reward wiring are checked together before release.
- The guard locks the two-condition stage gate UX: enough spoons but not enough Pantry progress must still show the Pantry request path and Go to Pantry action, while spoon shortages use the spoon-earning copy.
- The same guard locks replay rewards to isReplayClean(replayCleanStatus), preserving the rule that hinted or mistake-corrected replays cannot earn clean replay rewards.
- This is a release QA guard only; no visible app version bump was needed.

### Billing Surface Mobile QA Guard Addendum
- Strengthened mobile visual QA so the Settings billing surface must expose both launch products with distinct roles: `pip_cozy_support` remains the 250-spoon support/restore card, while `pip_spoon_jar_small` remains the 750-spoon repeatable jar without restore copy.
- The Pantry spoon-shortage support action now has mobile coverage that verifies it opens Settings and lands on both Billing cards, preventing the natural economy path from hiding the repeatable jar.
- This is a launch QA guard only; no visible app version bump was needed.

### Android Billing Final Checklist Guard Addendum
- Clarified the Android release note so the final Play Console step explicitly requires both launch managed products: `pip_cozy_support` and `pip_spoon_jar_small`.
- Strengthened `npm run qa:billing` so the release status cannot regress to single-product setup wording before signed upload.
- This is a release QA/documentation guard only; no visible app version bump was needed.

### Android Release Numbering Reminder Cleanup
- Updated the Android candidate reminder and release notes to match the current prepared upload state: versionCode 28 / versionName 1.1.0 is already set for the public-launch Billing candidate.
- The remaining signed-upload blocker is now framed correctly as Play Console product activation plus real-device Billing evidence, not another automatic version bump.
- If another AAB is uploaded before this candidate, bump Android numbering again before rebuilding the signed bundle.

### v0.1.426 Spoon Jar Failure Copy Polish
- Bumped the visible app version to v0.1.426 and package version to 0.1.426.
- Split the Small Spoon Jar failure status copy from the Support Pack failure copy so each Billing product keeps its own player-facing wording.
- Added Billing QA coverage for the new `spoonJarFailed` i18n key, keeping the two-product store surface clear without paid/free wording.

### Visual Review Pack QA Addendum
- Added `npm run qa:visual-pack`, a local Playwright screenshot pack for the launch-facing UX and art review loop.
- The pack captures the opening brand intro, Pip guide, first puzzle board, Settings Billing surface, Pantry room/shop, Time Attack coach, Album, Map, and a large-board cursor-control scene at a 390x844 mobile viewport.
- Output is written under ignored `qa-artifacts/visual-review/<app-version>/` with a `manifest.json`, so Codex, Claude, and manual review can discuss the same screenshots without committing generated images.

### Visual Review Guide Addendum
- Added `docs/VISUAL_REVIEW_GUIDE.md` as the human art/UX review checklist for the screenshot pack.
- The guide anchors launch review around Pip consistency, tactile UI symbols, Billing copy framing, Pantry goal clarity, and first-play friendliness so visual polish can be judged locally before device-only QA.

### v0.1.427 Mobile Visual Recovery
- Bumped the visible app version to v0.1.427 and package version to 0.1.427.
- Added a launch-facing mobile layout recovery layer for the opening promise chips, start CTA, stage navigation card, Pip how-to dialogue card, clue examples, and puzzle control buttons.
- The patch targets the visual review issues where Korean guide copy collapsed into one-character columns, stage navigation became a narrow vertical strip, and tactile CSS symbols overlapped or read as placeholder UI at mid-width mobile preview sizes.
- Strengthened mobile visual QA so the opening start CTA must remain fully inside the first mobile viewport instead of merely having polished button chrome.

### Reusable Control Artwork Direction Addendum
- The current tactile CSS symbols are functional enough for layout recovery, but they are not the final art standard.
- Before release sign-off, shared controls should receive a reusable artwork pass: paint/fill, blank X, undo, hint spoon, Time Attack, Settings/reset, stage navigation, and cursor/D-pad arrows.
- The priority order remains structure first, then artwork consolidation. This avoids disrupting the release QA spine while preserving the final quality bar: every repeated symbol should feel like Sunny Spoon Studios art, not a placeholder button glyph.

### v0.1.428 Settings Billing Sheet Recovery
- Bumped the visible app version to v0.1.428 and package version to 0.1.428.
- Added a settings-specific modal backdrop class so the longer Settings/Billing surface behaves like a mobile sheet without changing reset or guide dialogs.
- The Settings dialog now stays inside the viewport with its own scroll area, keeping the Done button and Billing cards from visually blending into the underlying puzzle screen.
- Updated the visual review pack to scroll to the Support Pack card before capturing the Settings Billing surface, and strengthened mobile QA so the settings backdrop/dialog scroll contract is guarded.

### v0.1.429 Reusable Control Icon Artwork Pass
- Bumped the visible app version to v0.1.429 and package version to 0.1.429.
- Upgraded the shared puzzle control tokens for fill, blank-check, and undo from functional glyphs toward reusable Sunny Spoon Studios-style CSS artwork.
- Stabilized the focused-play 12x12 board fit by accounting for grid gaps and widening the row clue lane so larger puzzles stay readable in mobile review captures.
- Kept the change visual-only: puzzle state, undo behavior, hint accounting, and control event wiring are unchanged.

### v0.1.430 Opening Mode Chip Artwork Pass
- Bumped the visible app version to v0.1.430 and package version to 0.1.430.
- Polished the opening screen's puzzle, pantry, and time-attack promise chips so their embedded symbols read as reusable Sunny Spoon Studios UI artwork rather than temporary button glyphs.
- Kept navigation behavior unchanged for this slice; direct mode entry from the opening screen remains a separate UX decision after the release shell is stable.

### v0.1.431 Opening Mode Chip Entry Wiring
- Bumped the visible app version to v0.1.431 and package version to 0.1.431.
- Converted the opening promise chips into real buttons: puzzle opens the puzzle hub, pantry opens the pantry goals/shop path, and time attack opens the Time Attack panel.
- Kept first-run player naming intact by deferring the selected destination until after the name form submits, then dispatching the same app-shell navigation event.
- Added explicit button reset/focus styling for the chips so they remain tactile artwork while becoming discoverable entry points.

### v0.1.432 Puzzle Blank-Mark Token Artwork
- Bumped the visible app version to v0.1.432 and package version to 0.1.432.
- Upgraded ordinary blank-check cells and safe blank suggestions from visible text glyphs into layered CSS token artwork with a small glossy tile, diagonal X strokes, and hidden text color.
- Kept board state, drag painting, auto-line marking, hint, and undo behavior unchanged; this is a presentation-only step toward the final shared artwork system.
- Existing completed-line auto-mark artwork keeps its higher-specificity treatment, while ordinary marked cells and soft blank suggestions now share a reusable token language.

### v0.1.433 Pantry Optional Card Null Leak Guard
- Bumped the visible app version to v0.1.433 and package version to 0.1.433.
- Replaced nullable Pantry mount rendering with a node-only helper so optional story, savings, progress, and display-plan cards no longer leak literal `null` text into the room/shop view.
- Added mobile visual QA coverage that fails if the Pantry panel exposes `null` as visible copy, protecting the launch screenshot review path and Android WebView surface.
- Kept Pantry slot selection, purchase/equip, story goals, and Billing behavior unchanged; this is a rendering integrity fix.

### v0.1.434 Floating Nav View Icon Artwork
- Bumped the visible app version to v0.1.434 and package version to 0.1.434.
- Added a dedicated decorative icon span to each floating navigation item so Puzzle, Album, Pantry, Time Attack, and Badges no longer rely on the tiny generic dot token.
- Drew the five view tokens in the shared Sunny Spoon Studios CSS-art language: puzzle board, album card, pantry shelf, Time Attack clock, and badge medal.
- Strengthened mobile visual QA so the floating nav must expose all five view icons with sufficient size, gradients, and pseudo-element artwork, keeping Time Attack discoverability from regressing.

### v0.1.435 First-Play Guide Dialogue Flow Guard
- Bumped the visible app version to v0.1.435 and package version to 0.1.435.
- Locked the first-play Pip how-to card into a single dialogue flow so the character bubble no longer collapses into a narrow vertical text strip at intermediate mobile preview widths.
- Kept the guide functional behavior unchanged while strengthening the mobile visual QA guard: Pip's bubble must keep a readable minimum width and sane aspect ratio, and the clue examples remain full-width below the dialogue.

### v0.1.436 First-Play Guide Action Icon Artwork
- Bumped the visible app version to v0.1.436 and package version to 0.1.436.
- Replaced the first-play guide action chips' generic dot accent with structured mini action icons for fill, blank-check, and undo, using the same CSS-art language as the live puzzle controls.
- Strengthened mobile visual QA so the how-to card must keep three named action chips, each with a real icon slot, gradient artwork, and action-specific pseudo-element marks instead of placeholder decoration.

### v0.1.437 Time Attack Hub Entry
- Bumped the visible app version to v0.1.437 and package version to 0.1.437.
- Added a polished Time Attack teaser card directly to the puzzle hub so players can discover the mode without opening the floating navigation menu.
- The card uses a clock badge, spoon-run copy, and a tactile start CTA while preserving the existing Time Attack panel, guide, scoring, and hint economy behavior.
- Mobile visual QA now guards the hub entry's card chrome, clock artwork, CTA tap target, and localized Time Attack copy.

### Visual Review Pack Time Attack Addendum
- The visual review pack now captures the puzzle hub Time Attack teaser as its own screenshot before opening the floating navigation menu.
- This keeps Time Attack discoverability review split into two clear surfaces: the in-hub teaser card and the floating-nav entry.
- The change is QA tooling only; runtime navigation, Time Attack scoring, guide copy, and Billing behavior are unchanged.

### v0.1.438 Visual Review Pack and Daily Card Copy Guard
- Bumped the visible app version to v0.1.438 and package version to 0.1.438.
- The visual review pack now clears its ignored output folder before each run, so stale screenshots cannot mix with the current manifest during Codex/Claude art review.
- Added dedicated English and Korean puzzle-hub Time Attack teaser captures before the floating navigation menu capture, making the hub entry and nav entry reviewable as separate surfaces.
- Shortened the English and Korean daily bonus notes so the spoon reward chip stands on its own cleanly, preventing lone punctuation or dangling Korean particles from appearing in narrow mobile cards.

### Visual Review Guide 16-Shot Order
- `docs/VISUAL_REVIEW_GUIDE.md` now mirrors the actual visual review pack order: English first-run, Korean first-run, then returning-player/release surfaces.
- Time Attack discoverability is reviewed in two places on purpose: the puzzle hub teaser card and the floating menu entry.
- The guide explicitly treats Korean as a first-class launch flow, not an overflow-only regression case.

### v0.1.439 Billing Product Artwork Slots
- Bumped the visible app version to v0.1.439 and package version to 0.1.439.
- Added dedicated decorative product-art slots to the Settings Billing cards so Pip Support Pack and Small Spoon Jar no longer rely only on a generic corner token.
- The Support Pack art reads as a spoon/support badge, while the Spoon Jar art reads as a jar of spoon tokens; both remain CSS-built, aria-hidden decorative UI layers.
- Strengthened mobile visual QA so both Billing products must keep distinct product-art slots, gradient/pseudo-element artwork, and the existing one-time/restore vs repeatable purchase roles.

### v0.1.440 Compact Stage Navigation
- Bumped the visible app version to v0.1.440 and package version to 0.1.440.
- Restored the previous/list/next stage navigation actions to a compact three-button shelf on narrow mobile viewports so the first puzzle and large boards do not lose too much vertical space before gameplay.
- Strengthened mobile visual QA to fail if the three stage navigation buttons drift into stacked rows again.

### v0.1.441 Stage Navigation Icon Artwork Pass
- Bumped the visible app version to v0.1.441 and package version to 0.1.441.
- Reworked the previous/list/next stage navigation tokens so they read as small arrow and picture-list artwork instead of generic diamond markers, while keeping button labels, disabled states, and routing unchanged.
- Strengthened mobile visual QA so stage-navigation buttons must keep gradient-backed icon artwork in addition to the compact one-row layout guard.

### v0.1.442 Opening Mode Chip Action Affordance
- Bumped the visible app version to v0.1.442 and package version to 0.1.442.
- Added a small Open/?�기 capsule to the opening Puzzle/Pantry/Time Attack chips so the launch promises read as tappable entry points without changing routing or the player-name pending-view flow.
- Strengthened mobile visual QA so every opening mode chip must keep the action capsule, arrow cue, gradient body, and no-overflow treatment at the 360/390/430px Android viewports.

### v0.1.443 Time Attack Entry CTA Clarity
- Bumped the visible app version to v0.1.443 and package version to 0.1.443.
- Turned the puzzle-hub Time Attack button into a dedicated launch CTA with a clock token, arrow cue, and stronger tactile button layout so the mode reads as directly startable.
- Added view-specific floating-nav item/icon classes and strengthened the Time Attack nav item treatment without changing routing, guide copy, scoring, or spoon-hint economy behavior.
- Strengthened mobile visual QA so the hub CTA must keep its clock artwork, action label, arrow cue, grid layout, and localized Time Attack copy at the 360/390/430px Android viewports.

### v0.1.444 Mobile Play Layout Recovery
- Bumped the visible app version to v0.1.444 and package version to 0.1.444.
- Recovered the first-play Pip guide dialogue on narrow mobile screens so Pip and the speech bubble stay in a two-column layout instead of collapsing into a one-character vertical text strip.
- Repaired the play header HUD so the puzzle title, settings button, and size badge keep separate tracks at 360-380px widths rather than letting the difficulty badge overlap the title.
- Clipped the active board frame and brand intro horizontal layer overflow, then strengthened mobile visual QA to catch guide-column collapse, title/badge overlap, visible board-frame overflow, and clue/grid drift.

### v0.1.445 Mobile Clue Tray Recovery
- Bumped the visible app version to v0.1.445 and package version to 0.1.445.
- Widened the mobile row-clue tray while reducing the derived cell size slightly so multi-token clues such as "1 1 1" stay inside the active board frame instead of spilling toward the card edge.
- Strengthened mobile visual QA so the widest row clue must remain inside the board frame and stop before the puzzle grid begins.

### v0.1.446 Mobile Column Clue Alignment
- Bumped the visible app version to v0.1.446 and package version to 0.1.446.
- Matched the column-clue tray to the puzzle grid's inner cell area so top clue tokens align with cell centers instead of sitting on the grid's outer frame.
- Strengthened mobile visual QA to compare first column clue and first cell centers directly, closing the remaining measured clue/cell offset.

### v0.1.447 Shared Board Track Alignment
- Bumped the visible app version to v0.1.447 and package version to 0.1.447.
- Replaced the mobile column-clue padding correction with shared board frame variables so the clue trays and puzzle grid use the same cell width, gap, and frame inset across both axes.
- Strengthened mobile visual QA to compare first and last column clue centers plus first and last row clue centers against their matching cells, preventing first-column-only fixes from hiding edge drift.

### v0.1.448 Puzzle Control Token Artwork Pass
- Bumped the visible app version to v0.1.448 and package version to 0.1.448.
- Reworked the reusable fill, blank-check, and undo button tokens with a stronger shared glossy base, clearer internal silhouettes, and separate per-action shapes so the puzzle controls no longer read as plain placeholder marks.
- Strengthened mobile visual QA so all three puzzle control tokens must remain present, gradient-backed, non-overflowing, and action-specific at the 360/390/430px Android viewports.

### v0.1.449 Billing Card Trust Polish
- Bumped the visible app version to v0.1.449 and package version to 0.1.449.
- Separated Billing card decorative layers so the Support Pack and Small Spoon Jar product art reads as a clear badge while the background token stays a soft watermark.
- Tightened purchase/restore button chrome inside Billing cards, preserving the one-time Support Pack and repeatable Spoon Jar behavior without touching purchase logic.
- Strengthened mobile visual QA so Billing product art cannot overlap the title, body, chips, status, or purchase buttons at the Android review viewports.

### v0.1.450 Mobile Board Track Alignment
- Bumped the visible app version to v0.1.450 and package version to 0.1.450.
- Re-synced the narrow mobile board frame track so column clues and puzzle cells share the same framed width at 360-420px viewports.
- Preserved the clipped board frame and widened the row clue tray enough for three-token 12x12 clues while removing the small-screen grid-size/frame-size mismatch that could shift end-column clue centers.
- Strengthened mobile visual QA so large-board clue/cell centers remain aligned and row clue number tokens cannot be clipped on Android review widths.

### v0.1.451 Opening Mode Action Copy
- Bumped the visible app version to v0.1.451 and package version to 0.1.451.
- Split the opening promise chip action labels by destination so the first screen reads as three clear entry points: solve puzzles, decorate the pantry, or challenge Time Attack.
- Kept the legacy generic Open label as a fallback key, while mobile visual QA now guards the destination-specific action copy on all three launch chips.

### v0.1.452 Opening Mode Release Guard
- Bumped the visible app version to v0.1.452 and package version to 0.1.452.
- Extended the launch integrity gate so the opening screen cannot regress to generic mode chips without the puzzle, pantry, and Time Attack action cues.
- Kept Time Attack discoverability tied to both source structure and mobile visual QA, so the launch screen remains a real entry point instead of a decorative highlight strip.

### v0.1.453 Mobile First-Play Guide Compaction
- Bumped the visible app version to v0.1.453 and package version to 0.1.453.
- Compressed the mobile first-play Pip guide card so Pip, the speech bubble, clue examples, and action chips remain polished while leaving more room for the puzzle board in the first gameplay scroll.
- Strengthened mobile visual QA so the how-to guide cannot silently grow back into a tall card that pushes the board and controls too far below the first Android viewport.

### v0.1.454 Board Clue Track Sync
- Bumped the visible app version to v0.1.454 and package version to 0.1.454.
- Locked column clues, row clues, and puzzle cells to the same `--board-cell-size`, `--board-gap-size`, and `--board-grid-width` contract so clue numbers cannot drift away from cell centers on 5x5 now or larger 12x12+ boards later.
- This directly closes the remaining visual-review concern where padding-based clue tuning could improve the first column while worsening the last column.

### v0.1.455 Visual Review Playbook
- Bumped the visible app version to v0.1.455 and package version to 0.1.455.
- Added `npm run review:play` as the hands-on local review command for Codex/browser play checks at `http://127.0.0.1:5173/`.
- Upgraded the generated visual review contact sheet with a manual-play card and launch art/UX checklist so screenshot review and live play review share the same quality criteria.
- Kept gameplay, Billing, Pantry, Time Attack, and puzzle-state behavior unchanged; this is a launch-review workflow pass for catching graphics, overlap, copy-fit, and discoverability issues faster.

### v0.1.456 Full Board Clue Alignment Guard
- Bumped the visible app version to v0.1.456 and package version to 0.1.456.
- Strengthened mobile visual QA to compare every column clue and row clue center against its corresponding puzzle cell, not only the first and last tracks.
- Kept board CSS and gameplay unchanged; this locks the 12x12+ alignment contract and prevents padding fixes that improve one edge while drifting another.

### v0.1.457 Shared Puzzle Action Token Crispness
- Bumped the visible app version to v0.1.457 and package version to 0.1.457.
- Sharpened the shared fill, blank-check, and undo token artwork used by both puzzle controls and Pip guide action chips with stronger tactile borders, inner highlights, clearer silhouettes, and deeper button-like shadows.
- Strengthened mobile visual QA so the reusable puzzle action tokens must keep their larger control size, guide-chip size, rounded art container, gradient fill, and shadow treatment at the Android review viewports.
- Kept puzzle logic, guide copy, Billing, Pantry, Time Attack, and save behavior unchanged; this is a reusable CSS-art polish pass ahead of the final approved artwork replacement.

### v0.1.458 Opening Pip Seal Art Medallion
- Bumped the visible app version to v0.1.458 and package version to 0.1.458.
- Polished the opening Pip seal so the existing approved Pip chrome art reads as a framed Sunny Spoon medallion instead of a small pasted icon under the key visual.
- Strengthened mobile visual QA to guard the seal size, gradient frame, clipped art mask, object-fit, transform, and drop shadow across Android review viewports.
- Kept intro flow, promise chips, Billing, puzzle logic, Pantry, Time Attack, and save behavior unchanged; this is a first-impression artwork presentation pass.

### v0.1.459 Starter Board Alignment Guard
- Bumped the visible app version to v0.1.459 and package version to 0.1.459.
- Added a mobile visual QA guard for the first 5x5 starter puzzle so column and row clue centers must align with their corresponding puzzle cells within 1px.
- Kept board CSS, gameplay, guide copy, Billing, Pantry, Time Attack, and save behavior unchanged; this locks the repaired starter-board layout without introducing new UI behavior.

### v0.1.460 Opening Promise Chip Readability
- Bumped the visible app version to v0.1.460 and package version to 0.1.460.
- Rebuilt the three opening promise chips so icon, promise text, and action badge use a measured grid instead of an absolute badge that can overlap or clip copy.
- On narrow Android review viewports, the three chips now stack into full-width rows so "Solve", "Decorate", and "Challenge" remain readable entry cues for puzzles, pantry goals, and Time Attack.
- Strengthened mobile visual QA to fail when promise chip text overlaps the action badge, overflows the chip, or loses its tactile badge structure.

### v0.1.461 Fixed Navigation And Guide Replay
- Bumped the visible app version to v0.1.461 and package version to 0.1.461.
- Play screens now append the floating navigation as well, and the nav is fixed to the lower-right viewport edge so Puzzle, Album, Pantry, Time Attack, and Map remain reachable without scrolling.
- Settings now includes a Pip guide replay card, letting the player reopen the puzzle or Time Attack guide after first-run onboarding.
- Strengthened mobile visual QA to guard fixed nav placement and the guide replay card's tactile treatment.

### v0.1.462 Overlay Navigation Guard
- Bumped the visible app version to v0.1.462 and package version to 0.1.462.
- Floating navigation is now withheld while reset, settings, or Pip guide overlays are open, preventing the fixed lower-right menu from sitting above modal layers.
- Strengthened mobile visual QA to fail if the floating navigation is present during a Pip guide or settings modal.

### v0.1.463 Opening Promise Chip No-Clip Guard
- Bumped the visible app version to v0.1.463 and package version to 0.1.463.
- Re-locked the opening promise chips so narrow desktop, tablet, and Android review widths stack into readable rows instead of squeezing the icon, label, and action cue into clipped columns.
- Strengthened mobile visual QA to measure label scroll overflow directly, so "solve/decorate/challenge" entry chips cannot silently truncate or overlap again.
- Kept intro navigation, Billing, Pantry, puzzle play, Time Attack, and save behavior unchanged; this is a launch-facing readability and discoverability guard.

### v0.1.464 Opening Promise Route Guard
- Bumped the visible app version to v0.1.464 and package version to 0.1.464.
- Strengthened mobile visual QA so each opening promise chip is clicked from a fresh first-run context and must route to a visible Puzzle, Pantry, or Time Attack surface.
- Added a direct blocking-overlay guard so the fixed floating navigation cannot reappear above Pip guide or modal layers while they are active.
- Kept UI copy, Billing, Pantry state, puzzle logic, Time Attack scoring, and save behavior unchanged; this is a release-facing discoverability and overlay safety guard.

### v0.1.465 Floating Nav Entry And Pip Guide Voice
- Bumped the visible app version to v0.1.465 and package version to 0.1.465.
- Added the active-view artwork token to the always-visible floating navigation trigger, so the player can identify the current destination before opening the menu.
- Reused the existing five-view CSS icon language for the trigger icon and strengthened mobile visual QA to guard trigger icon size, gradient artwork, pseudo-element detail, and current-label overflow.
- Rewrote the first puzzle, Time Attack, and first-purchase guide copy in Korean and English so Pip speaks in a warmer first-person helper voice while preserving the same rule/economy guidance.
- Kept routing, Billing, Pantry state, puzzle logic, Time Attack scoring, save behavior, and deferred raster artwork scope unchanged; this is a launch-facing discoverability and onboarding-copy polish pass.

### v0.1.466 Play Screen Nav Clearance
- Bumped the visible app version to v0.1.466 and package version to 0.1.466.
- Kept the floating navigation fixed on hub-style screens while moving it into the normal play-screen flow, so Puzzle, Album, Pantry, Time Attack, and Map remain reachable without the nav trigger covering puzzle cells or the control shelf.
- Strengthened mobile visual QA to fail if the play-screen floating nav becomes fixed again or overlaps the puzzle grid/controls.
- Stabilized the visual review pack's return-to-hub path so the Time Attack teaser screenshot is captured from the intended Puzzle Hub surface instead of whatever screen happened to be active.

### v0.1.467 Opening Promise Chip Release Fit
- Bumped the visible app version to v0.1.467 and package version to 0.1.467.
- Added a final narrow-screen release-fit override for the three opening promise chips so the puzzle, pantry, and Time Attack entry cues remain full readable row cards instead of clipped mini buttons on Korean mobile layouts.
- Kept the existing tactile chip artwork and route behavior intact while prioritizing no-overlap text fit on short Android review viewports.
- Kept Billing, Pantry state, puzzle play, Time Attack scoring, floating navigation, and save behavior unchanged; this is a visible first-screen readability polish pass.

### v0.1.468 Fixed Quick Travel Recovery
- Bumped the visible app version to v0.1.468 and package version to 0.1.468.
- Restored the floating navigation to a fixed lower-right quick-travel menu on play screens so Puzzle, Album, Pantry, Time Attack, and Map remain reachable without scrolling.
- Updated play-screen mobile QA to guard the fixed menu's right/bottom safe-area placement while still preventing overlap with the puzzle board or primary controls.
- Reworded the settings guide replay and Billing fallback copy so Pip speaks like an in-world helper and store availability reads as Android-app readiness instead of test-build language.

### v0.1.469 Quick Travel Icon Shelf Legibility
- Bumped the visible app version to v0.1.469 and package version to 0.1.469.
- Enlarged and sharpened the fixed quick-travel menu icons so Puzzle, Album, Pantry, Time Attack, and Map read as deliberate Sunny Spoon controls instead of rough placeholder marks.
- Switched the narrow mobile quick-travel menu to a stacked readable shelf and tightened labels/hints so the shop, pantry, album, and Time Attack routes remain discoverable after opening the lower-right launcher.
- Strengthened mobile visual QA to fail when quick-travel icons shrink, lose gradient artwork, or when menu labels/hints clip inside their cards.

### v0.1.470 Pip Guide Replay Split
- Bumped the visible app version to v0.1.470 and package version to 0.1.470.
- Split the settings guide replay card into separate Picture Guide and Time Attack Guide buttons so players can intentionally reopen the onboarding flow they need.
- Repaired the Korean Pip guide copy and kept both puzzle and Time Attack guide text in Pip's first-person helper voice instead of detached instruction-card wording.
- Strengthened mobile visual QA to guard two replay buttons, their route targets, no text overflow, tactile icon treatment, and button sizing on Android review viewports.
- Kept Billing, Pantry state, puzzle play, Time Attack scoring, floating navigation, and save behavior unchanged; this is a launch-facing help/discoverability polish pass.

### v0.1.471 Quick Travel Meaning Pass
- Bumped the visible app version to v0.1.471 and package version to 0.1.471.
- Reworked the fixed play-screen quick-travel trigger from an icon-only puck into a compact labeled route badge with Menu/current-view/Jump text, so Pantry, Album, Time Attack, and Badges are discoverable without scrolling or guessing.
- Reworded the Pantry and Time Attack route hints to explicitly mention shop/decorating and spoon-score runs, matching the monetization and progression loops now present in the release candidate.
- Tightened Korean guide replay copy in settings so Pip sounds like an in-world helper and mobile QA now guards visible quick-travel trigger text instead of allowing the old visually-hidden label pattern to return.
- Kept Billing, Pantry state, puzzle play, Time Attack scoring, save behavior, and the deferred final raster icon pass unchanged; this is a navigation clarity and launch-readability patch.

### v0.1.472 Billing Card Store Readiness Polish
- Bumped the visible app version to v0.1.472 and package version to 0.1.472.
- Reworded the support pack and spoon jar fallback copy so store-unavailable web previews read as Google Play price readiness instead of Android test-build or developer-state language.
- Polished disabled Billing buttons to keep the cards warm, tactile, and launch-facing while still preventing web-only purchase taps until the native Google Play catalog is available.
- Kept Billing product IDs, purchase/restore behavior, Pantry state, puzzle play, Time Attack scoring, floating navigation, and save behavior unchanged; this is a visible monetization trust polish pass.

### v0.1.473 Launch Entry Readability Pass
- Bumped the visible app version to v0.1.473 and package version to 0.1.473.
- Re-locked the opening promise chips into a two-line icon/title/action layout so Korean launch entry labels cannot overlap the action badge on intermediate Android review widths.
- Reworded the Pantry and Time Attack opening hints so players can see the shop/decorating route and score-run route before they enter the game.
- Refined the Pip how-to copy in Korean and English toward a warmer first-person guide voice while preserving the same nonogram rules.
- Kept Billing product IDs, purchase/restore behavior, Pantry state, puzzle play, Time Attack scoring, floating navigation, and save behavior unchanged; this is launch-facing readability polish.

### v0.1.474 Guide Replay And Quick Travel Artwork Pass
- Bumped the visible app version to v0.1.474 and package version to 0.1.474.
- Converted the settings guide replay actions into real icon-and-label DOM tokens so the puzzle and Time Attack guide buttons no longer depend on button pseudo-elements for their primary artwork.
- Added a launch-layer polish pass for the fixed quick-travel trigger: stronger token surface, clearer current-destination hierarchy, and tighter play-screen sizing.
- Extended mobile QA to verify guide replay icon size, gradients, pseudo-details, and label overflow directly.
- Deferred the full Sunny Spoon Studios raster icon replacement pass until after the release gates; this slice improves the current shared artwork layer without changing save, Billing, or navigation logic.

### v0.1.475 Floating Quick Travel Artwork Pass
- Bumped the visible app version to v0.1.475 and package version to 0.1.475.
- Rebuilt the fixed quick-travel menu rows into an icon-plus-copy grid so Puzzle, Album, Pantry, Time Attack, and Map have clear route cards instead of compressed text beside rough symbols.
- Added view-specific CSS artwork tokens for the floating menu: puzzle board, album card, pantry jar, Time Attack clock, and map pin now share the same tactile Sunny Spoon button language.
- Extended mobile QA to guard the quick-travel copy wrapper, icon size, gradient artwork, pseudo-details, and label/hint overflow so shop, pantry, album, and Time Attack access cannot silently become unreadable again.
- Kept Billing product IDs, purchase/restore behavior, Pantry state, puzzle play, Time Attack scoring, and save behavior unchanged; this is a navigation clarity and visual readability pass.

### v0.1.476 Pip Guide Conversation Lock
- Bumped the visible app version to v0.1.476 and package version to 0.1.476.
- Rebuilt the guide dialog copy and chrome so Pip is visibly the speaker, with a speaker chip, compact side-by-side Pip art, and first-person helper copy for puzzle, Time Attack, and first-purchase flows.
- Strengthened mobile QA and i18n tests to guard guide speaker presence, no text overflow, visible guide step state, and Korean guide readability.
- Kept Billing product IDs, purchase/restore behavior, Pantry state, puzzle play, Time Attack scoring, floating navigation, and save behavior unchanged; this is a launch-facing onboarding trust polish pass.

### v0.1.477 Billing Store Readiness Copy Guard
- Bumped the visible app version to v0.1.477 and package version to 0.1.477.
- Reworded Support Pack and Spoon Jar fallback copy so web/native-unavailable states read as store preparation instead of Android test-build or raw Google Play app wording.
- Added i18n and mobile QA guards against developer/test Billing copy in the visible settings cards while keeping product IDs, purchase/restore, pantry state, puzzle play, Time Attack, floating navigation, and save behavior unchanged.
- Remaining external release evidence is unchanged: activate Play Console products and record real-device purchase/restore for both Billing items.

### v0.1.486 Billing Card Artwork Pass
- Bumped the visible app version to v0.1.486 and package version to 0.1.486.
- Refined the Support Pack and Spoon Jar card token artwork with larger layered CSS medallions so the monetization cards no longer read as rough placeholders in settings and web preview.
- Strengthened mobile QA thresholds for Billing card artwork size and button height while preserving existing no-overlap, no-developer-copy, and store-readiness guards.
- Remaining external release evidence is unchanged: activate Play Console products and record real-device purchase/restore for both Billing items.

### v0.1.488 Billing Card Copy Wrap Guard
- Bumped the visible app version to v0.1.488 and package version to 0.1.488.
- Locked the Support Pack and Spoon Jar fact chips/actions to readable wrapping copy instead of nowrap/ellipsis truncation, preserving the store-preparation language without exposing developer/test phrasing.
- Extended mobile QA to reject nowrap, ellipsis, excessive line counts, and copy overflow inside Billing cards while preserving the existing artwork, no-overlap, and product ID guards.
- Remaining external release evidence is unchanged: activate Play Console products and record real-device purchase/restore for both Billing items.

### v0.1.489 Large Board Quick Travel Clearance
- Bumped the visible app version to v0.1.489 and package version to 0.1.489.
- Added play-screen bottom clearance below the large-board cursor controls so the fixed quick-travel tray cannot cover the D-pad or action buttons on mobile.
- Extended mobile QA to measure the real floating-nav, D-pad, and cursor-action rectangles and fail if the fixed tray overlaps the large-board controls.
- Remaining external release evidence is unchanged: activate Play Console products and record real-device purchase/restore for both Billing items.

### v0.1.490 Opening Quick Travel Containment
- Bumped the visible app version to v0.1.490 and package version to 0.1.490.
- Hid and disabled the fixed quick-travel tray while the branded opening screen is active so it cannot cover the Time Attack entry chip or first-play call to action.
- Extended mobile QA to guard the intro-open state, floating-nav visibility, and pointer-event containment before the intro is dismissed.
- Kept post-intro navigation, puzzle play, Pantry, Time Attack, Billing behavior, and the two remaining real-device Billing evidence items unchanged.

### v0.1.491 Completion Album Route Recovery
- Bumped the visible app version to v0.1.491 and package version to 0.1.491.
- Restored the standard completed-puzzle "View Album" action so it leaves focused play, resets the carried scroll position, and opens the Album from its header, while replay challenges keep their existing return behavior.
- Extended unit and mobile QA to guard the completion-to-Album route, and changed the 333-card Album review image from an unreadably tall full-page capture to a useful viewport capture.
- Kept puzzle completion rewards, save data, replay rewards, Pantry, Time Attack, Billing behavior, and the two remaining real-device Billing evidence items unchanged.

### v0.1.492 Settings Sheet Horizontal Containment
- Bumped the visible app version to v0.1.492 and package version to 0.1.492.
- Locked the scrollable settings sheet to border-box sizing so the dialog, close control, guide buttons, and Billing cards stay inside the padded backdrop when a mobile vertical scrollbar reduces the available width.
- Removed the accidental horizontal settings scrollbar and extended mobile QA to measure backdrop/dialog scroll widths plus both padded side boundaries.
- Kept settings behavior, guide replay, Billing product wiring, purchase/restore behavior, puzzle play, and the two remaining real-device Billing evidence items unchanged.

### v0.1.493 Shared D-pad Arrow Artwork
- Bumped the visible app version to v0.1.493 and package version to 0.1.493.
- Replaced the large-board D-pad's raw arrow characters with one reusable layered CSS arrow token, rotated consistently for all four directions while preserving the existing localized accessible labels.
- Extended mobile QA to guard hidden fallback glyphs, arrow dimensions, gradient fill, clipped silhouette, shadow depth, direction transforms, and the existing 44px tap targets.
- Kept cursor movement, selected-cell actions, control-mode preferences, puzzle state, and Billing behavior unchanged.

### v0.1.494 Mid-width Time Attack Entry Readability
- Bumped the visible app version to v0.1.494 and package version to 0.1.494.
- Reflowed the Time Attack hub teaser at 620-780px so its clock badge and warm explanatory copy keep the first row while the full-width challenge CTA gets a clear second row instead of compressing the title and body into a narrow column.
- Extended mobile QA at the 675px review width to guard CTA row placement, usable copy width, and near-card-width action sizing.
- Kept Time Attack rules, daily limits, rewards, hint costs, navigation behavior, and Billing behavior unchanged.

### V1 Visual Finish Backlog
- Keep the current CSS-only control symbols as functional placeholders until the release shell is stable, then replace reusable button symbols with approved Sunny Spoon Studios artwork: fill, blank-check, undo, D-pad directions, hint, settings, Time Attack, pantry/shop, and pack/status chips.
- Treat this as a final art pass rather than a piecemeal feature detour: artwork quality, line alignment, text fit, and icon consistency must be checked together across opening, puzzle play, guide dialogs, pantry/shop, billing, and Time Attack.
- The opening screen now exposes the three major entry points, but the reusable icon system is not considered final until those symbols are upgraded from CSS construction to coherent approved assets or an equally polished shared icon layer.

### Post-v0.1.494 Release-facing UI Audit
- Reviewed the current 24-frame visual pack across opening, Pip guide, first puzzle, floating navigation, Pantry/shop, Billing, Album, badges, Time Attack, and large-board cursor controls after the v0.1.493-v0.1.494 artwork/readability slices.
- Confirmed the shared CSS icon layer now reads consistently enough for the current release candidate: control labels remain legible, Pip reads as the guide speaker, quick travel exposes all five destinations, and no new overlap or truncation defect justified another speculative UI patch.
- Kept final raster replacement as a separately reviewed art-production lane. Do not expand player-facing CSS illustration further; replace the shared control/navigation tokens only when a coherent approved PNG/WebP set is ready.
- Additional release checks passed: asset manifest (122 registered assets), Play Store graphics (14 required assets), source hygiene, 333-puzzle catalog target, Billing wiring, Android release gate, and launch-integrity guard.
- The only remaining external evidence is unchanged: real-device `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` purchase/repeat records. No signed AAB was built in this UI/UX pass.

### Experimental Quick Travel Raster Candidate v1
- Generated a hidden five-icon raster candidate set for Puzzle, Album, Pantry, Time Attack, and Map using the approved opening pantry visual and golden spoon token as style references.
- Removed the flat magenta chroma background, split the source into five transparent 256x256 PNG candidates, and registered the raw source, transparent source, and individual crops in the asset manifest as non-visible review assets.
- Added `docs/art-review/quick-travel-icon-review-v1.html` to compare each icon at 144px, 48px, and 32px, plus `docs/QUICK_TRAVEL_ICON_ART_REVIEW.md` with prompt intent, initial assessment, risks, and the promotion gate.
- Kept the entire set out of runtime UI. The current CSS navigation tokens remain live until the five raster icons are explicitly approved together; no package/UI version bump is needed for this docs-only experimental lane.
- Candidate validation passed: RGBA transparency with alpha range 0-255, five isolated source runs, asset manifest with 129 registered assets, 115 unit tests, and production build.

### Experimental Puzzle Control Raster Candidates v1
- Generated Fill, Blank Check, Undo, Hint, and Settings candidates individually so each repeated control could keep a strong 32px silhouette while sharing the new cream/cocoa/amber/mint raster language.
- Archived each flat-magenta source and produced a transparent 256x256 RGBA review candidate with alpha range 0-255 and transparent corners; none are imported by runtime code.
- Marked Fill, Blank Check, Hint, and Settings as promising first-pass candidates. Undo is explicitly `candidate-needs-regeneration` because its central object drifted into a jigsaw piece instead of a square nonogram cell.
- Added `docs/art-review/puzzle-control-icon-review-v1.html` and `docs/PUZZLE_CONTROL_ICON_ART_REVIEW.md` so the set can be compared at 144px, 48px, and 32px without silently promoting a semantically wrong icon.
- Kept the live CSS controls, puzzle behavior, accessible labels, package version, Billing, and save state unchanged; this remains a hidden experimental art-production lane.
- Re-ran `qa:mobile`, the 24-frame visual pack, and the full release-candidate gate after both candidate sets were committed. All checks passed, candidate filenames were absent from `dist`, and the only warnings remained the two external real-device Billing evidence records.

### Experimental Undo Raster Candidate v2
- Regenerated the blocked Undo control candidate while preserving the broad glossy counter-clockwise arrow and replacing the jigsaw-shaped center with a straight-sided nonogram cell tile.
- Archived the generated magenta source, produced a transparent 256x256 RGBA candidate, and kept both files hidden in the asset manifest; no runtime import, CSS fallback removal, package version bump, or Billing behavior change was made.
- Updated the puzzle-control review board to compare Undo v2 at 144px, 48px, and 32px. Undo v1 remains archived as rejected-direction evidence rather than being overwritten.

### v0.1.495 Mobile Pip Guide Speaker Alignment
- Bumped the visible app version and package metadata to v0.1.495.
- Moved the mobile Pip portrait card from the bottom of tall guide dialogs to the start of the speech bubble, keeping Pip beside the existing bubble tail instead of visually disconnecting the speaker from the conversation.
- Preserved guide copy, step order, skip/continue actions, approved Pip artwork, desktop layout, navigation containment, and Billing behavior.
- Extended mobile QA to compare the Pip art and speech-bubble top edges on viewports up to 520px so the conversation relationship cannot silently drift apart again.

### v0.1.496 Quick Travel Raster Artwork Promotion
- Bumped the visible app version and package metadata to v0.1.496.
- Promoted the reviewed Puzzle, Album, Pantry, Time Attack, and Map quick-travel set into candidate-free runtime PNG assets while preserving the original hidden candidate/source files as review history.
- Replaced the five layered CSS icon constructions in both the floating trigger and expanded menu with approved raster images behind a dedicated runtime allowlist and view-to-asset map; accessible route labels, hints, titles, active state, and navigation behavior remain unchanged.
- Updated mobile QA to require the exact five approved asset IDs, 256x256 loaded source dimensions, and absence of the old icon pseudo-elements while retaining all existing route clarity, text-fit, fixed-position, and large-board clearance checks.
- Billing behavior and the two remaining real-device Billing evidence items are unchanged.

### v0.1.497 Primary Puzzle Control Raster Promotion
- Bumped the visible app version and package metadata to v0.1.497.
- Promoted the reviewed Fill, Blank Check, and regenerated Undo artwork into isolated approved runtime assets under `src/assets/icons/puzzle-controls-v1`.
- Added a puzzle-control runtime allowlist and data mapper so hidden candidate/source files remain provenance only and cannot enter the live UI accidentally.
- Replaced only the three primary puzzle shelf CSS constructions with raster images while preserving button labels, actions, focus/disabled states, and tactile button surfaces.
- Left Hint and Settings hidden for a later surface-specific pass instead of widening this rollback unit.
- Mobile QA now verifies the exact approved asset IDs, 256x256 source dimensions, cleared pseudo-elements, accessible labels, and control containment.

### v0.1.498 Hint and Settings Raster Promotion
- Bumped the visible app version and package metadata to v0.1.498.
- Completed the reviewed puzzle-control artwork set by promoting the spoon-bulb Hint icon and mint-gear Settings icon into approved runtime copies.
- Added a small shared image factory so puzzle controls, the Hint panel, the app header, and the focused-play header all receive the same allowlisted asset metadata without duplicating DOM construction.
- Preserved the 54px Hint and 44px Settings tactile button surfaces, accessible names, disabled/pressed behavior, settings flow, hint allowance meter, and spoon-economy copy.
- Extended mobile QA to require exact approved asset IDs and 256x256 source dimensions for both surfaces while confirming the retired Settings pseudo-elements remain absent.

### v0.1.499 Full-Screen Mobile Pip Conversation
- Bumped the visible app version and package metadata to v0.1.499.
- Reframed puzzle, Time Attack, and first Pantry purchase guides as full-viewport mobile conversation scenes instead of compact cards floating over the current screen.
- Gave Pip the main visual stage, an opaque Sunny Spoon room backdrop, and a bottom speech panel with two reachable actions so information delivery feels like a direct conversation.
- Preserved guide step order, localized copy, replay behavior, skip/continue actions, focus semantics, approved Pip artwork, save-state marking, and desktop dialog behavior.
- Mobile QA now treats full viewport coverage and a substantially enlarged Pip portrait as required behavior while keeping speech text, controls, and overflow checks.

### v0.1.500 Dedicated Mobile Puzzle Play Screen
- Bumped the visible app version and package metadata to v0.1.500.
- Reinforced the existing `playOpen` early-return architecture with a full-width, full-height mobile play shell, sticky focused-play header, and dedicated board background.
- Removed floating quick travel from active puzzle and Time Attack sessions so the board and puzzle controls read as a separate gameplay screen instead of a card embedded in the hub.
- Kept Back and Settings in the play header; players return to the hub before using Puzzle, Album, Pantry, Time Attack, or Map quick travel.
- Preserved puzzle state, stage navigation, board sizing, cursor controls, completion routes, settings overlays, and Billing behavior.

### v0.1.501 Pantry Room Story Conversation
- Bumped the visible app version and package metadata to v0.1.501.
- Promoted the starter counter request and the first completed tracked Pantry room request from a small inline acknowledgement into Pip's full-screen three-step conversation on mobile.
- Connected decorating to a clear story promise: the room feels warmer, village neighbors are waiting for a place, and the next request reveals another neighbor story.
- Triggered the story beat whether the requested decoration is newly purchased or already owned and equipped, while preserving the existing inline completion feedback.
- Stored the one-time acknowledgement as `pantryRoomStory` alongside the existing guide IDs so existing saves remain compatible and the conversation does not repeat unexpectedly.

### v0.1.502 First Pantry Neighbor Reveal
- Bumped the visible app version and package metadata to v0.1.502.
- Added a one-time full-screen Pip conversation after three completed tracked Pantry requests, revealing Mr. Park as the first village neighbor drawn to the decorated room.
- Reused the approved high-quality `story-friends-sheet-v1-clean` artwork through a clipped character frame instead of introducing another CSS silhouette or temporary icon.
- Connected the reveal to a repeatable story promise: every few completed requests can welcome another neighbor and open another room story.
- Updated the character continuity data to match the current product: Pip is the active Picture Pantry host who speaks in short, warm guide sentences, while Elena remains a wider Sunny Spoon Village lead.
- Extended mobile QA to seed the third request, require the Mr. Park guide ID/copy/artwork, and verify the blocking full-screen conversation before continuing Pantry checks.

### v0.1.503 Pantry Neighbor Progression
- Bumped the visible app version and package metadata to v0.1.503.
- Extended the Pantry's full-screen resident story from the first three-request reveal to Lily after six completed requests and Mateo after ten.
- Reused the approved `story-friends-sheet-v1-clean` character sheet with isolated sprite positions, keeping the resident art coherent without adding CSS placeholder characters.
- Selects the earliest unseen eligible neighbor so upgraded saves meet Mr. Park, Lily, and Mateo in order instead of silently skipping older story beats.
- Added warm Pip-led English and Korean conversations that connect each decorated corner to a new village use: Mr. Park's quiet visit, Lily's tea party, and Mateo's reading seat.
- Expanded the visual review pack from 25 to 27 screenshots with deterministic Korean captures for all three resident milestones.
- Verification: 115 unit tests passed, the 27-frame visual pack completed, and mobile visual QA passed at 360x740, 390x844, 430x932, and 675x900. The two real-device Billing evidence records remain the only external blockers.

### v0.1.504 Neighbor Artwork Render Stability
- Bumped the visible app version and package metadata to v0.1.504 after a manual pixel review found Lily's action labels visually corrupted even though the DOM overflow metrics passed.
- Replaced runtime movement of the five-column story sheet with three lossless approved character crops for Mr. Park, Lily, and Mateo, preserving the exact artwork while reducing fragile sprite compositing.
- Removed the neighbor image `drop-shadow` filter after repeated isolated captures proved its transparent-layer composition could corrupt the action-button pixels beneath Lily in headless Chromium and potentially lower-end Android WebViews.
- Hardened the 27-frame visual review pack: each resident reveal now runs in an isolated page, resets scroll position, records dialog/bubble/line/button geometry and button text in `manifest.json`, and fails if any required element escapes its viewport or own content box.
- Manual 390x844 review confirmed all three resident portraits, Korean titles, body copy, progress dots, and both action labels render inside their intended sections with no overlap or clipping.

### v0.1.505 Korean Resident Names and Conversation Polish
- Bumped the visible app version and package metadata to v0.1.505.
- Localized human resident names in Korean story scenes as `�??�생??, `릴리`, and `마테??; retained `Pip` as the established character and product brand name.
- Rewrote translation-like guide phrases across the first puzzle, Time Attack, first room story, and all three resident arrivals into shorter natural Korean conversation while preserving the original mechanics and story beats.
- Added i18n regression checks that require the three Korean resident names and reject `Mr. Park`, `Lily`, or `Mateo` in their Korean introduction copy.
- Hardened resident screenshots to wait for decoded character images, loaded fonts, and two completed animation frames before capture; this prevents partially painted speech panels from being mistaken for text overflow or section intrusion.
- Manually reviewed the Korean first-puzzle guide and all three 390x844 resident captures for name rendering, sentence rhythm, line breaks, speech-panel boundaries, progress dots, and action labels.

### v0.1.506 Korean Clock Grandpa Naming
- Bumped the visible app version and package metadata to v0.1.506.
- Replaced the formal `�??�생?? localization with the warmer role-based name `?�계 ?�아버�?` in his Korean title and first introduction.
- Uses the shorter `?�아버�?` after the introduction so repeated sentences sound natural while the clock remains his memorable first-encounter identity.
- Kept the English `Mr. Park`, internal guide ID, save-state marker, artwork mapping, and milestone behavior unchanged.

### v0.1.507 Korean Pantry and Spoon Copy Polish
- Bumped the visible app version and package metadata to v0.1.507.
- Rewrote translation-like Korean copy in the Settings Billing cards and Pantry story/progress surfaces so support purchases read as filling Pip's spoon economy rather than a paid tier.
- Clarified the next Pantry request, room-story milestone, request archive, decoration progress, and spoon-shortfall language without changing prices, rewards, progression, Billing wiring, or save data.
- Expanded the visual review pack from 27 to 29 screenshots with deterministic Korean returning-player captures for Settings/Billing and the full Pantry room/shop surface.
- Manual 390x844 review confirmed the revised Billing copy stays inside its cards and buttons, while the full Pantry capture keeps headings, progress panels, filter controls, item cards, and action buttons in their intended sections without visible overlap.
- Verification: 115 unit tests, the 29-frame visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, and the full candidate gate passed. The two real-device Billing evidence records remain external blockers.

### v0.1.508 Korean Player Name Defaults
- Bumped the visible app version and package metadata to v0.1.508.
- Replaced the English `Jay` name-field example with the natural Korean example `?�늘` when the app is displayed in Korean.
- Replaced the fallback player address `Friend` with `친구`, so Pip does not switch back to an English human name when a Korean player has no saved display name.
- Kept `Pip` and the English locale unchanged because Pip is the established character and product brand.
- Verification: 115 unit tests and mobile visual QA at 360x740, 390x844, 430x932, and 675x900 passed.

### v0.1.509 Billing Product Raster Artwork
- Bumped the visible app version and package metadata to v0.1.509.
- Replaced the CSS-drawn Pip Support Pack and Small Spoon Jar symbols with two reviewed 256x256 transparent raster icons: a warm ribboned spoon gift pouch and a ceramic jar visibly filled with spoon tokens.
- Kept the existing tactile card frames but disabled the retired product-art pseudo-elements, so CSS no longer constructs either product illustration.
- Added both assets to the approved runtime manifest and strengthened mobile QA to require their exact asset IDs, source filenames, 256px dimensions, and absent pseudo-element content.
- Manual review of the Korean 390x844 Billing capture confirmed both icons remain distinct at 46px, stay inside their card slots, and do not overlap titles, body copy, facts, status messages, or purchase actions.
- Verification: 115 unit tests, asset manifest QA with 156 registered assets, production build, mobile QA at four viewports, the 29-frame visual review pack, and the full candidate gate passed.

### v0.1.510 Claude Review P2 Guards
- Bumped the visible app version and package metadata to v0.1.510.
- Added a shared null-safe puzzle-control artwork append helper and moved the header Settings, focused-play Settings, and Hint surfaces onto it, matching the defensive pattern already used by the floating navigation and puzzle controls.
- Extracted Pantry guide selection into a pure tested flow with the explicit priority `room story -> first-purchase guide -> earliest unseen eligible neighbor`.
- This preserves the existing starter-room story beat while preventing an eligible resident reveal from appearing before a skipped first-purchase guide.
- Added regression coverage for room-story priority, first-purchase priority, upgraded saves eligible for multiple residents, ordered Mr. Park/Lily/Mateo reveals, and the fully seen state.
- Updated the resident mobile-QA fixture to mark the two prerequisite Pantry guides as seen, keeping the resident reveal check isolated from the newly enforced queue order.
- Verification: 119 unit tests, production build, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900 passed.

### v0.1.511 Claude Review P3 Cleanup
- Bumped the visible app version and package metadata to v0.1.511.
- Replaced the broad zero-cost counter heuristic with the exact `starter-counter-cloth` ID, preventing future free counter decorations from completing the starter room request accidentally.
- Stacked Support Pack purchase and restore actions at every Settings width so the long Korean store-price label receives the full card width instead of wrapping into an uneven three-line half-width button at 675px.
- Removed both historical sets of CSS-drawn Support Pack and Spoon Jar product shapes now that approved raster icons own those visuals.
- Extended asset QA to reject any future Billing product `::before` or `::after` artwork rule, while preserving the tactile raster frame and card decoration layers.
- Manual review of the regenerated 675x900 Billing capture confirmed the Korean purchase label now fits on one line at full card width and aligns cleanly with Restore, with no icon or section overlap.
- Verification: 119 unit tests, asset QA, production build, the 29-frame visual review pack, mobile QA at four viewports, and the full candidate gate passed.

### v0.1.512 Progress Reset Raster Artwork
- Bumped the visible app version and package metadata to v0.1.512.
- Replaced the remaining CSS-drawn header reset arrow with an approved 256px transparent raster icon: a warm circular arrow around a sprouting Pantry tile, keeping the action friendly and distinct from destructive delete imagery.
- Reused the null-safe puzzle-control art path and runtime approval gate, while preserving the existing localized label, confirmation dialog, and reset behavior.
- Updated asset and mobile visual QA contracts to require the exact reset asset, 256px source dimensions, and disabled reset pseudo-element artwork.
- Made Settings visual measurement wait for both Billing product PNGs to finish decoding, removing a startup race that could report zero natural dimensions before layout inspection.
- Verification: 119 unit tests, 157-asset manifest QA, production build, 29-frame visual pack, mobile QA at 360/390/430/675px, and the full release-candidate gate passed.

### v0.1.513 Header Raster Cleanup
- Bumped the visible app version and package metadata to v0.1.513.
- Removed the retired CSS-drawn Settings gear that had remained hidden behind a later `content: none` override after the approved raster Settings icon was promoted.
- Strengthened asset QA to reject pseudo-element artwork for both header controls, keeping Settings and Progress Reset on the same approved raster-only contract.
- Reclassified the art backlog from experimental major rework to live release-candidate final polish; no visible placeholder artwork remains on the launch-critical header controls.
- Verification: 119 unit tests, 157-asset QA, production build, 29-frame visual pack, mobile QA at 360/390/430/675px, and the full release-candidate gate passed.

### v0.1.514 Final Visual Coverage
- Bumped the visible app version and package metadata to v0.1.514.
- Centered the fifth quick-travel destination on the final row at 560-780px preview widths, removing the asymmetric orphan item while preserving the two-column scan pattern.
- Added an explicit wide-layout geometry contract that requires the odd final destination to remain centered in its menu.
- Expanded the visual review pack from 29 to 30 screenshots with a Korean Album viewport capture, closing the last locale-specific visual coverage gap without producing an impractical 333-card full-page image.
- Manual review confirmed the centered 675px five-item menu and Korean Album title, count, saved card, description, and locked-card preview render without clipping or section intrusion.
- Verification: 119 unit tests, 157-asset QA, production build, 30-frame visual pack, mobile QA at 360/390/430/675px, and the full release-candidate gate passed.

### v0.1.515 Player-First Visual Reset (In Progress)
- Reopened release visual review after owner playtesting identified excessive explanatory copy, decorative glare/orbs, cramped cards, and Settings-hosted purchases as launch blockers despite prior geometry QA passing.
- Simplified the opening to the key visual, title, and Start action; removed the pre-start mode cards, season/count pitch, version chip, studio label, Pip seal, and decorative button glare.
- Simplified the player-name step to the question and form, removing device-storage and developer-facing helper copy.
- Rebuilt Pip guidance as a full-screen character-and-dialogue scene without eyebrow/speaker labels, floating tokens, or light-orb decoration. The first puzzle guide now includes a tappable five-cell practice row inside the conversation and will not continue until the player fills the requested three connected cells.
- Removed Billing products from Settings and placed them in a dedicated Spoon Shop below the Pantry, with shorter price-and-spoon actions and no decorative pseudo-element art.
- Generated `pip-pantry-v3-source.png` from the current opening-art Pip identity and produced web, Play Console, and Android launcher candidates. This remains an owner-review candidate, not an approved final icon.
- Replaced legacy mobile-QA expectations that required glare, medallions, version chips, and opening mode cards. The new contract rejects those elements, keeps Settings preference-only, checks the Spoon Shop location, and validates clean full-screen Pip dialogue.
- Reworked the launch puzzle hub after owner flow review: removed the season/report card and persistent Pip banner, collapsed daily rewards to one text line, replaced the CSS Time Attack symbol with approved raster art, localized the first-stage titles, and separated puzzle names from compact size/reward metadata.
- Removed the oversized spoon reward illustration and decorative stage-preview orb/glare. Stage filters now appear only after a stage is actually complete.
- Redrew the first 5x5 solution with visible Pip ears and added a dedicated warm-brown completion palette so the mandatory first solve reads as a character reveal rather than a hollow skull-like face. A regression test now locks the first silhouette.
- Corrected the interactive tutorial after review found that clue `3` in a five-cell row had three valid placements but the practice accepted only the middle placement. The practice now uses the unambiguous clue `5`, accepts all five cells, and has a pure-data regression contract.
- Added `docs/UX_REWORK_PLAN.md` to turn recurring owner feedback into shared product rules, phased screen audits, and explicit acceptance criteria instead of continuing isolated screenshot patches.
- Continued Phase A with a dedicated flat starter-play surface at mobile widths: removed the duplicated in-board Pip tutorial card, stripped starter navigation/control glare and pseudo-icons, shortened the stage position to `1 / 20`, and made the three starter controls text-first.
- Expanded the visual pack with explicit English, Korean, and wide interactive-practice captures plus a scripted Korean first-completion capture, growing coverage from 33 to 37 frames.
- Reworked the first completion into a reveal-focused state: completed boards and controls no longer remain above the reward, the three report-like fact chips are gone, and the saved card pairs the authored Pip celebration art with a small colored 5x5 result.
- Current verification: 121 unit tests, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, 37-frame visual review pack generation, production build, and the full candidate gate pass. Phase A still needs the second and third starter completion-art audit before promotion.

### v0.1.516 UX Recovery Phases A-C
- Promoted the owner-feedback reset into a coherent first-session, navigation, and Pantry recovery pass rather than continuing isolated screenshot patches.
- Finished the first three starter completion treatments with authored Pip, soup-bowl, and golden-spoon palettes. Pip's 5x5 result now distinguishes ears, eyes, muzzle, and face colors in the completion reveal and Album.
- Simplified the puzzle hub stage headings by removing catalog summaries, pack notes, reward-token decoration, and report-like stage metadata.
- Changed the Album from a 333-card locked catalog to a shelf of completed pictures only. Empty locked placeholders, duplicate saved-state chips, and the explanatory note are absent.
- Changed Badges from a full locked roadmap to the nearest badge plus badges the player has actually earned.
- Reduced the Pantry's initial decoration list from six cards to three, removed repeated empty-slot sentences, stripped remaining room/button glare, and kept the Spoon Shop below the decorating flow.
- Reduced Settings to visible choices: explanatory language/control paragraphs, decorative header/name orbs, choice glare, and repeated Billing fact chips are removed. Korean audio and store copy is shorter and conversational.
- Completed the first-shelf art metadata pass: all 20 starter puzzles now select an authored motif palette, with paired variants sharing the same Pip, bowl, spoon, recipe-card, bow, teacup, cookie, loaf, house, or apple color language instead of falling back to a random catalog palette.
- Updated measured mobile QA to enforce the earned-only Album and next-badge presentation while retaining four-width overflow and tap-target coverage.
- Verification: 123 unit tests, the 39-frame v0.1.516 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, the full release-candidate gate, and production build passed.
- The only release evidence still outside local automation is the existing real-device Billing pair: `pip_cozy_support` purchase/restore and `pip_spoon_jar_small` purchase/repeat.

### v0.1.517 Completion Identity Guard
- Unified the first-Pip completion treatment behind the exact `pips-first-shelf-pip-face-1` ID. Later Pip-face puzzles can share the authored face palette without accidentally receiving the first-completion character scene.
- Added a regression test covering both the first and second Pip-face puzzle IDs.
- Replaced the zero-picture Album's generic hidden-card sentence with one friendly question and a direct route back to picture selection.
- Replaced the starter artwork's diagonal color-cycling formula with motif-specific regions: recipe-card borders, bow center, teacup base, cookie chips, loaf crust, house roof/windows, and apple leaf/body now use intentional positions.
- Added a 1200px first-shelf contact sheet to the visual pack, showing all 20 completed starter cards in one five-column review image.
- Fixed generic Korean Album copy to interpolate localized image names instead of leaking English source titles, then removed the repeated saved-card sentence from Album cards because the visible title already communicates it.
- Verification: 126 unit tests, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, the full release-candidate gate, and the expanded 40-frame v0.1.517 visual pack passed.

### v0.1.518 Stage Completion Art Expansion
- Extended the completed-picture color system beyond the first shelf. Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry now each resolve through a documented stage palette while puzzle-specific authored palettes still take priority.
- Applied the same stage identity to the immediate completion reveal and the saved Album card instead of allowing the two surfaces to drift.
- Expanded visual review with five-column contact sheets for the first shelf, Sunny Spoon Sign, and Apron Drawer. The 42-frame pack now exposes 60 completed cards for side-by-side silhouette, palette, title-wrap, and spacing review.
- Localized the recurring Sunny Spoon Sign and Apron Drawer picture names used by the first 40 post-starter puzzles, including natural `??번째 ...` variants, and localized their Korean stage/badge names.
- The contact-sheet audit also exposed that Sunny Spoon Sign and Apron Drawer currently reuse the same 20 base silhouettes. This is recorded as the next content-art replacement slice rather than hidden by color changes.
- Verification: 129 unit tests, the localized 42-frame visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.519 Apron Drawer Identity Recovery
- Replaced Apron Drawer's copied Sunny Spoon Sign content with 20 pack-specific 8x8 silhouettes while preserving every existing puzzle ID and therefore save compatibility.
- The new set uses ten sewing and drawer motifs plus ten distinct variants: pocket apron, patch pocket, four-hole button, thread spool, sewing scissors, needle, pincushion, apron bow, folded gingham, and drawer handle.
- Added natural Korean titles for all ten motifs and their `??번째 ...` variants; changed the technically valid but awkward `?�패` label to the clearer player-facing `?��???.
- Replaced diagonal/confetti stage coloring with region-based palettes. Edges, centers, and upper/lower regions now form coherent Sunny Spoon, apron, bakery, and village color groupings.
- Added a data contract requiring all 20 Apron Drawer solutions to be unique and none to duplicate a Sunny Spoon Sign solution.
- Visual review: the refreshed Apron Drawer contact sheet now shows a distinct sewing-themed shelf with stable title wrapping and no repeated Sunny Spoon silhouettes.
- Verification: 130 unit tests, the refreshed 42-frame v0.1.519 visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.520 Bakery and Village Opening Art
- Added dedicated first-20 completion contact sheets for Bakery Window and Village Pantry, expanding visual QA from 42 to 44 screenshots.
- Replaced the first ten copied starter silhouettes in each stage with 20 distinct 5x5 motifs while preserving puzzle IDs and save compatibility.
- Bakery Window now opens with bakery-window, croissant, tiered cake, macaron box, cocoa tin, honey jar, berry tart, lattice pie, cookie jar, and scone basket pictures.
- Village Pantry now opens with a cottage, apple tree, market basket, daisy pot, fence, watering can, bird, mushroom, porch lantern, and picnic blanket.
- Added natural Korean titles for the new pictures and a regression contract requiring the 20 replacement solutions to remain mutually distinct.
- Contact-sheet review confirmed stable Korean title wrapping, coherent stage-region colors, and visibly different Bakery/Village first rows. The sheets also make the remaining repeated 8x8/10x10 lower row explicit for the next art batch.
- Verification: 131 unit tests, the 44-frame v0.1.520 visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.521 Village Pantry First-20 Recovery
- Replaced Village Pantry's remaining repeated 8x8/10x10 opening pictures with ten village-specific scenes: garden window, produce crate, herb jar, milk churn, jam shelf, garden rake, straw hat, flower basket, wheelbarrow, and village sign.
- Preserved all original puzzle IDs while changing titles and solutions, keeping completed/save references compatible.
- Added localized Korean titles and corrected title precedence so intentionally replaced artwork does not get renamed back to an older translation-key title.
- Added regression coverage requiring the first 20 Village Pantry solutions to be unique and separate from the first 60 pictures in Sunny Spoon Sign, Apron Drawer, and Bakery Window.
- Contact-sheet review confirmed the complete four-row Village Pantry opening shelf is now distinct and all replacement Korean titles fit their cards.
- Verification: 133 unit tests, the refreshed 44-frame v0.1.521 visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.522 Bakery Window First-20 Recovery
- Replaced Bakery Window's repeated 8x8/10x10 lower opening row with ten bakery-specific pictures: baguette basket, cinnamon roll, flour jar, milk pitcher, berry jam pot, balloon whisk, baker cap, cupcake tray, copper kettle, and rolling-pin rack.
- Preserved puzzle IDs and routed replacement titles through the runtime-title localization path so older per-ID translations cannot override the new artwork names.
- Added a regression contract requiring Bakery Window's first 20 solutions to be unique and distinct from Sunny Spoon Sign and Apron Drawer.
- Contact-sheet review confirmed the complete Bakery Window opening shelf now reads as one coherent bakery collection, with concise Korean titles and stable card geometry.
- Verification: 134 unit tests, the refreshed 44-frame v0.1.522 visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.523 Large-Catalog Art Audit
- Added `npm run qa:art-audit`, a deterministic quality report for the 273 Bakery Window and Village Pantry puzzles.
- The audit groups exact duplicate solutions and repeated titles, then ranks extreme fill density, multiple blank edges, and missing readable-art briefs without failing the build merely because known content debt exists.
- Added the audit to the release-candidate pipeline so new work always prints the current top 30 replacement candidates.
- Current baseline: 7 exact duplicate-silhouette groups, 9 repeated-title groups, and 144 review candidates. The highest-priority items are two 90%-filled Bakery 12x12 duplicates and several Village 10x10 multi-copy groups.
- Added unit coverage proving exact duplicates outrank softer warnings and validating extreme-density/blank-edge detection.
- This changes the next art process from sequential bulk editing to evidence-based batches: duplicate groups first, then density, then edge composition.
- Verification: 136 unit tests, the art-audit command, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.524 First 12x12 Duplicate Repairs
- Re-authored the two exact-duplicate Bakery Window 12x12 groups identified at the top of the art audit.
- Plum Cardamom Braid now uses a tucked braided pastry silhouette; Cherry Almond Biscotti uses a crossed pair with angled ends instead of sharing the same 90%-filled block.
- Cherry Cream Crown and Lemon Thyme Crown now have separate crown constructions, peak spacing, bases, and negative-space patterns.
- Reduced exact duplicate-silhouette groups from 7 to 5 and total review candidates from 144 to 140 without changing puzzle IDs, titles, rewards, or save references.
- Added regression coverage that keeps all four repaired IDs out of exact-duplicate findings.
- Added a four-card 12x12 repair contact sheet to visual QA; manual review confirmed the silhouettes are distinct, Korean titles fit, and stage color regions remain coherent.
- Verification: 137 unit tests, the art-audit command, the expanded 45-frame v0.1.524 visual pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.525 Village Multi-Copy Repair
- Re-authored the two largest remaining Village Pantry 10x10 duplicate groups while preserving puzzle IDs, rewards, and save compatibility.
- Blue Gingham Cloth, Wooden Egg Crate, and Checkered Tea Towel now use separate textile, crate, and hanging-cloth silhouettes.
- Cornflower Tea Canister, Daisy Milk Bottle, Blue Ribbon Mason Jar, and Gingham Egg Cup now use distinct vessel shapes instead of one shared rounded block.
- Reduced exact duplicate-silhouette groups from 5 to 3 and review candidates from 140 to 134.
- Added a seven-card completion contact sheet; manual review confirmed distinct shapes, stable Korean labels, and no card overflow.

### v0.1.526 Zero Exact-Duplicate Art Baseline
- Re-authored the final three exact-duplicate Village Pantry 10x10 groups: Checkered Napkin Ring / Green Label Tea Tin, Honey Label Crock / Little Cocoa Scoop, and Copper Berry Scoop / Copper Honey Measure.
- The deterministic Bakery/Village audit now reports zero exact duplicate-silhouette groups across 273 puzzles. Remaining findings are softer quality work: 9 repeated-title groups plus density, blank-edge, and missing-brief candidates.
- Extended the repaired-ID regression contract so any future exact-solution reuse among the 17 repaired Bakery/Village pictures fails unit tests.
- Added a six-card final-repair contact sheet. Manual review confirmed the ring, tin, crock, two scoop profiles, and measuring cup remain recognizable and separately composed at actual 10x10 completion size.
- Verification: 137 unit tests, zero-duplicate art audit, the 47-frame v0.1.526 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.527 Distinct Player-Facing Picture Names
- Removed all nine repeated-title groups reported across the 273 Bakery Window and Village Pantry puzzles without changing puzzle IDs or save references.
- Named visually related pictures by their distinguishing detail: ribbon versus plain macaron boxes, label cocoa tin, berry rosette tart, woven lattice pie, picnic scone basket, preserve pot, farmstand/harvest baskets, cottage garden window, and hearth copper kettle.
- Added natural Korean equivalents for every new runtime title so the repair does not fall back to English in Korean play.
- Added a regression contract requiring zero repeated player-facing titles in the audited packs.
- Added a 19-card comparison sheet containing every former title group. Manual review confirmed the Korean names remain inside the cards and clarify the visible differences.
- Audit baseline now reports zero exact duplicate silhouettes, zero repeated-title groups, and 122 softer review candidates.
- Verification: 138 unit tests, art audit, the 48-frame v0.1.527 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.528 Village Composition and Readability Repair
- Re-authored the seven highest-priority Village Pantry blank-edge candidates: Tea Tray, Flour Sack, Pickle Crocks, Copper Ladle, Potato Sack, Herb Bundle, and Cottage Garden Window.
- Rebalanced each 10x10 composition to use the board deliberately rather than leaving two or three accidental empty edges. Object-specific negative space remains where it improves recognition.
- Added readable-art briefs and motif tags for all seven pictures so future audits and completion-art work retain the intended tray, vessel, tool, textile, and plant forms.
- Added a regression contract requiring all seven repaired IDs to stay out of the automated art-review queue.
- Added a seven-card completion contact sheet. Manual review confirmed centered silhouettes, distinct objects, stable Korean titles, and no card overflow.
- Reduced softer art-review candidates from 122 to 115 while retaining zero exact duplicates and zero repeated titles.
- Verification: 139 unit tests, art audit, the 49-frame v0.1.528 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.529 Bakery Composition Repair A
- Re-authored the first seven Bakery Window 12x12 blank-edge candidates: Berry Preserve Pot, Berry Rosette Tart, Cinnamon Rolls, Cocoa Label Tin, Cookie Jar Row, Croissant Tray, and Cup Stack.
- Enlarged each subject across the board while keeping meaningful holes, handles, rims, spirals, labels, and layered pastry gaps so the completion result remains readable instead of becoming a dense block.
- Added readable-art briefs and motif tags for all seven pictures and a regression contract keeping them out of the automated review queue.
- Added a seven-card completion contact sheet. Manual review confirmed distinct silhouettes, stable Korean labels, intentional negative space, and no card overflow.
- Reduced softer art-review candidates from 115 to 108 while retaining zero exact duplicates and zero repeated titles.
- Verification: 140 unit tests, art audit, the 50-frame v0.1.529 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.530 Bakery Composition Repair B
- Re-authored the final seven prioritized Bakery Window 12x12 blank-edge candidates: Honey Jar Shelf, Lemon Tart, Milk Glass, Woven Lattice Pie, Pretzel Twist, Scone Picnic Basket, and Tiered Cakes.
- Preserved meaningful negative space while extending handles, rims, shelves, platters, and pastry edges across the board so each solved picture has a deliberate centered composition.
- Added readable-art briefs and motif tags for all seven pictures and a regression contract keeping them out of the automated review queue.
- Added a seven-card completion contact sheet. Manual review confirmed recognizable tiers, jars, pie weave, basket, glass, citrus wedges, and pretzel loops with stable Korean labels.
- The top art-audit queue now contains density candidates only. Softer review candidates fell from 108 to 101 while exact duplicates and repeated titles remain at zero.
- Verification: 141 unit tests, art audit, the 51-frame v0.1.530 visual review pack, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, production build, source diff check, and the full release-candidate gate passed.

### v0.1.531 Claude Visual Review Clarity Fixes
- Removed the development version footer from player-facing screens while retaining the internal package and source version contract.
- Localized the seeded legacy player name `Jay` to the current-language placeholder in Settings, so Korean play no longer exposes an English setup artifact.
- Reduced the first completion reveal to one clear saved-to-album sentence and the solved artwork; redundant completion and saved-state labels were removed.
- Removed the Pantry shop item counter/progress explainer and the replay recommendation body paragraph.
- Simplified the English spoon-jar description so it no longer refers to an abstract next stage.
- Added launch-integrity source guards for all five clarity decisions.
- Verification: 141 unit tests, launch-integrity QA, and the regenerated 51-frame v0.1.531 visual pack pass. Targeted visual inspection confirmed the Korean name, completion reveal, footer removal, Pantry shop, and replay-card changes.

### v0.1.532 Large-board Focus Pass
- Cursor-mode large boards no longer repeat the full Pip lesson card above the board.
- Cursor-mode large boards no longer render the separate tap-mode Color / Blank Check / Undo strip; the D-pad panel remains the single source of movement and cell actions.
- The change makes the 12x12 board the primary visual and removes two duplicate instruction/control regions without changing tap or automatic control modes.
- Updated mobile QA to protect the reduced cursor-mode hierarchy and the simplified first-completion reveal instead of requiring the removed legacy cards and labels.
- Verification: 141 unit tests, launch-integrity QA, art/catalog/assets/store/Billing/privacy checks, production build, Android release gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, the full release-candidate gate, and the regenerated 51-frame v0.1.532 visual pack pass.
- Manual review of the large-board capture confirms the board now follows stage navigation directly and the D-pad is the only action panel.

### v0.1.533 Mobile Play Header Clearance
- Removed sticky positioning from the dedicated play header so it remains above the puzzle instead of floating across the board during scroll or full-page capture.
- Retained the full-width safe-area header and its back, title, Settings, and size controls.
- Updated mobile QA to require a normal-flow play header. This protects the board from future sticky-header overlap regressions.
- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, and the regenerated 51-frame v0.1.533 visual pack pass.
- Manual review of the 12x12 full-page capture confirms the play header, stage navigation, board, hint card, and cursor controls now appear in normal document order without overlap.

### v0.1.534 Play Navigation Deduplication
- Removed the second `Picture list` button from the stage-navigation row because the dedicated play header already provides the same exit.
- Stage navigation now answers one question only: move to the previous or next picture.
- Expanded the two remaining buttons evenly and updated mobile QA to reject a return to the redundant three-button layout.
- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.534 visual pack pass.
- Manual review confirms the large-board capture has no floating overlap and the two-button stage row leaves more horizontal room for translated labels.

### v0.1.535 Cursor Action Artwork
- Replaced the cursor-mode Color and Blank CSS tokens with the approved 256x256 fill-brush and mark-X raster artwork already used by the main puzzle controls.
- Removed both cursor-action pseudo-elements, including the unexplained circular highlight inside each button.
- Kept the dynamic Clear labels while retaining the same visual asset for each action family.
- Updated mobile QA to require the approved asset IDs, decoded 256x256 sources, minimum rendered size, and no pseudo-element fallback art.
- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.535 visual pack pass.
- Manual review confirms the unexplained CSS highlight tokens are gone and both cursor actions now use the same approved illustrated assets as the main puzzle controls.

### v0.1.536 Compact Large-board Controls
- Large cursor-mode boards no longer render the Previous / Next stage card while a puzzle is active. Picture-list exit remains in the dedicated play header, and completion keeps the next-picture route.
- Removed the two repeated instructional paragraphs from 10x10+ cursor panels while retaining localized accessible labels on every control.
- Reflowed the four directional buttons into one horizontal row and Color / Blank into a second two-button row.
- Kept current row/column and selected-cell state as compact status chips above the controls.
- The large-board page now prioritizes header, board, and one short control dock rather than stacking navigation, lessons, hints, and a tall D-pad.
- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.536 visual pack pass.
- In the 390px capture, the full 12x12 board and compact movement/action dock fit together above the optional hint card. The 360x740 contract also passes without horizontal overflow or control overlap.

### v0.1.537 Large-board Visual Grammar
- Restored the directional controls to a true compact cross layout and placed the two action buttons beside it, preserving directional meaning without returning to the tall original panel.
- Replaced the negative-margin status alignment with a shared two-column status row so position and selected-cell chips use the same baseline and height contract.
- Standardized 12x12 row and column clue tokens to one 17x17 size, one font size, and zero inter-token margin to prevent mixed circles and collisions.
- Removed the large-board hint explanation sentence. The hint allowance and button remain; the revealed cells demonstrate the result directly.

### v0.1.538 Obsolete Play Clearance Removal
- Removed the 112px cursor-panel bottom margin that previously reserved space for a fixed quick-travel tray.
- Dedicated play screens no longer mount that tray, so the old clearance created an unexplained empty band between controls and hints.
- The hint allowance now follows the compact controls at the normal card gap.
- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.538 visual pack pass.

### v0.1.539 QA Cleanup Safety and Time Attack Simplification

- Confirmed Playwright uses the OS temporary directory rather than a persistent browser profile in the OneDrive checkout. Added a fail-closed path ownership check before the visual review script clears its versioned output folder.
- Removed the three report-like Time Attack summary cards and the coach card's repeated economy chips. The start surface now centers Pip, the 5x5/8x8/10x10 ladder, one start action, a compact daily-spoon status, and existing records.
- Shortened Korean and English Time Attack copy and disabled the retired decorative pseudo-element shine/tokens on the coach and records surfaces.
- Verification: 141 unit tests, the 101-candidate art audit, launch-integrity QA, production build, Android release gate, four-width mobile QA, the full release-candidate gate, and the regenerated 51-frame v0.1.539 visual pack pass.
- Real-device Billing purchase/restore and consumable-repeat evidence remain the only external release blockers.

### v0.1.540 Pantry Store Ordering

- Moved the Support Pack and Small Spoon Jar into the Pantry shop itself. Spoon-priced decoration filters, cards, and the ?�show more??action always appear first; paid packs follow as the final shop section.
- Kept purchases out of Settings and added measured mobile QA guards for both Pantry-shop containment and decoration-before-paid-pack ordering.
- Removed the unused Daily `notePrefix` and `noteSuffix` translation keys identified by Claude review.
- Visual review confirms the Pantry order is room and request, spoon-priced decorations, ?�show more,??then Support Pack and Small Spoon Jar. The full candidate gate and 51-frame v0.1.540 visual pack pass.
- Manual review confirms the 12x12 clue tokens are uniform, the status chips share a baseline, the cross-shaped D-pad preserves direction, and the compact hint card contains no explanatory body copy.


### v0.1.541 Pantry Shop Visual Grammar

- Unified decoration and paid-pack cards around one 76px artwork frame, 16px card radius, 1px border, flat background, 44px actions, and shared spacing.
- Removed the paid section's nested store-container appearance and separated it with one quiet divider after the spoon-priced decoration list.
- Shortened the two shop section titles and renamed the ambiguous Korean starter item from �?카운??�?to 체크 카운?�보.

- Verification: 141 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.541 visual pack pass.


### v0.1.542 Pantry Request Copy Reduction

- Removed the repeated 부?�한 ?�품 target chip from the first Pantry request card; the artwork, title, and action already identify the item.
- Reduced the start, placement, and completion bodies to one short conversational sentence in Korean and English.

- Verification: 141 unit tests, the full release-candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.543 Pantry Action Focus

- Removed the completed-request archive, room-level counter, chapter meter, and stage-cost report from the Pantry screen. Story progress remains in save data and still triggers the existing full-screen Pip and neighbor dialogue.
- After the first request, the inline milestone now asks only which of the next three decorations the player wants to view.
- Shortened the Korean and English labels to `?�음 ?�품` / `Next decoration` and concise item actions.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.543 visual pack pass. Real-device Billing evidence remains external.

### v0.1.544 Pantry Goal Card Reduction

- Reduced a selected decoration goal to its artwork, title, one short slot/spoon status line, and direct actions.
- Removed the inline Pip stamp, meta eyebrow, explanatory paragraph, repeated status chips, and decorative glare/orb effects. Pip remains reserved for full-screen story dialogue and the first-request story moment.
- Flattened the remaining next-decoration and goal cards to the shared 1px-border visual grammar.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.545 Pantry Story Surface Separation

- The completed first request now leaves the inline flow entirely instead of competing with the next-decoration choices.
- The active first-request card shows only decoration art, a short title, and its action. Pip speech remains in the full-screen guide opened by that action.
- Reduced purchase/equip feedback to decoration art, one result title, and dismiss; removed the inline Pip cameo, eyebrow, and explanatory report paragraph.
- Flattened both surfaces and disabled their decorative pseudo-elements.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.546 Billing Status Feedback Recovery

- Replaced the broad Spoon Store status hide with the existing ready-only and empty-only rules. Checking, success, cancellation, purchase failure, network error, and restore results are visible again.
- Added browser QA that temporarily exercises checking, success, and warning classes for both paid products and fails if any tone is hidden by the CSS cascade.
- Verification: 141 unit tests, Billing tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.547 Retired Pantry Report Removal

- Deleted the unmounted savings plan, earning calculator, collection progress board, room-stage mission, placement advisor, and display-plan DOM builders.
- Removed their dormant mount tree plus pack/economy dependencies while preserving the completed-request count used by live story and neighbor-guide progression.
- This prevents the previously rejected report dashboard from returning through an accidental append or future partial refactor.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.547 visual pack pass.

### v0.1.548 Retired Pantry Copy Removal

- Removed the unused bilingual planning, savings, progress-report, mission-route, placement-advisor, and display-plan copy after their UI builders were retired.
- Removed the matching translation assertions so tests cover only player-facing Pantry language.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.549 Retired Pantry CSS Removal

- Removed the unused placement-advisor, savings-goal, earning-plan, progress-board, mission-route, display-plan, and planning-deck CSS after their DOM builders were retired.
- Preserved the live per-decoration savings meter and the mobile QA assertion that the old planning deck is absent.
- Added a source-hygiene guard that blocks the retired report selectors from returning.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.550 Compact Pantry Decoration Cards

- Reduced every spoon-priced decoration card to artwork, item name, spoon price or owned state, and its direct buy/equip action.
- Removed repeated rarity, purchase-status, slot-placement, swap explanation, savings meter, and manual goal-tracking UI from the rendered cards.
- Added mobile QA that rejects those report-like card details at every supported width.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.551 Compact Pantry Card Residue Removal

- Removed the retired rarity, item-status, placement, swap, savings, and manual goal-tracking translations and CSS after the compact card renderer shipped.
- Simplified two surviving live selectors that only carried obsolete negative exclusions.
- Added a source-hygiene guard preventing the report-style card selectors from returning.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

### v0.1.552 Bakery Density Repair Group A

- Redrew four high-density 12x12 Bakery Window silhouettes: Apricot Jam Tart, Berry Cream Crown, Almond Crescent Roll, and Apricot Custard Bar.
- Reduced their filled-cell density from 85-88% to 60-66%, using distinct negative space for tart filling, crown peaks, crescent curvature, and custard-bar stripes.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 142 unit tests, 97-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.553 Bakery Density Repair Group B

- Redrew four more high-density 12x12 Bakery Window silhouettes: Blackberry Vanilla Galette, Blueberry Almond Square, Blueberry Cream Pinwheel, and Caramel Fig Danish.
- Replaced near-solid blocks with distinct folded crust, framed square, radial pinwheel, and braided-ring compositions while preserving readable edge clues.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 143 unit tests, 93-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.554 Bakery Density Repair Group C

- Redrew Caramel Pear Muffin, Cherry Cream Brioche, Cinnamon Honey Twist, and Cocoa Almond Biscuit as distinct 12x12 compositions.
- Added readable muffin cup folds, twin cherry topping and cream pocket, a diagonal braided twist, and an almond-cut oval biscuit instead of near-solid blocks.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 144 unit tests, 89-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.555 Bakery Density Repair Group D

- Closed Claude Review 12 note by redrawing Cocoa Almond Biscuit so its oval rim and almond pieces read without the earlier diagonal-X impression.
- Redrew Cocoa Pear Tartlet, Fig Honey Pinwheel, Ginger Honey Madeleine, and Hazelnut Cocoa Tart with distinct fruit arcs, radial folds, shell ridges, and scalloped crust.
- Added a regression test keeping all five reviewed silhouettes out of the art-audit queue.
- Verification: 145 unit tests, 85-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.556 Bakery Density Repair Group E

- Redrew Hazelnut Praline Square, Honey Lavender Canele, Lavender Shortbread Tin, and Lemon Curd Rosette as distinct 12x12 compositions.
- Replaced near-solid blocks with a framed nut grid, vertical canele flutes, an asymmetric labeled tin, and a readable lemon spiral.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 146 unit tests, 81-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.557 Bakery Density Repair Group F

- Redrew Lemon Poppy Pound Cake, Lemon Ribbon Tart, Mocha Cream Roll, and Orange Blossom Cruller as distinct 12x12 compositions.
- Replaced near-solid blocks with a rectangular seeded slice, diagonal lemon ribbon, side-on cream spiral, and open twisted cruller ring.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 147 unit tests, 77-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


### v0.1.558 First Puzzle Teaching and Clue Grammar

- Rewrote Pip's first puzzle lesson in natural, shorter Korean and English, with balanced dialogue width.
- Added pointer-drag painting to the five-cell practice row and a visible 1-1-1 separated-group example on the following dialogue step.
- Renamed the Korean first pack from a singular first stage to Pip's First Shelf so 2/20 reads correctly as the second saved picture.
- Removed the obsolete CSS-drawn progress marker and unified row/column clue numbers as equal circular tokens, with mobile geometry guards for size, shape, alignment, and overflow.
- Verification: 147 tests, full candidate gate, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900 passed.


### v0.1.559 Bakery Density Repair Group G

- Redrew Peach Cream Tartlet, Pistachio Glaze Donut, Peach Custard Square, and Pear Ginger Turnover as distinct 12x12 compositions.
- Replaced near-solid blocks with a fruit-fan tart shell, an open glazed ring, a crisp framed custard square, and a triangular crimped turnover.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 148 unit tests, 73-candidate art audit, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame visual pack pass.


### v0.1.560 Bakery Density Repair Group H

- Redrew the runtime 5x5 Recipe Card and Bread Loaf plus the 12x12 Raspberry Choux Puff and Plum Cream Danish.
- Kept the 5x5 source and progression overrides synchronized so the player sees the reviewed card and loaf silhouettes rather than stale replacements.
- Replaced dense pastry blocks with an airy berry-and-cream puff and a folded oval plum danish.
- Added an art-audit regression test keeping all four out of the review queue.
- Verification: 149 unit tests, 69-candidate art audit, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame visual pack pass.


### v0.1.561 Korean Game Typography

- Replaced the report-like Korean system-font stack with a locally bundled two-tier game typography system.
- Korean titles, Pip dialogue, section labels, and primary actions use Jua; short supporting copy uses Gowun Dodum.
- Puzzle clues, counters, timers, stage positions, and currency values stay on a compact rounded system stack so gameplay numbers remain stable and highly legible.
- Kept English typography unchanged and bundled only Korean WOFF2 files, avoiding runtime network requests and legacy WOFF payload.
- Player-facing copy direction is now explicit: remove explanatory reporting, keep necessary lines short, and let interaction teach obvious outcomes.
- Verification: 149 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame visual pack pass.

### v0.1.562 Direct Guide and Mobile Rhythm
- Changed the `1 1 1` Pip lesson from a pre-filled diagram into a required three-cell interaction, so the player performs the rule instead of watching an answer appear.
- Removed the secondary `Not now` / `?�중??볼게?? action from Pip conversations; story and tutorial moments now present one clear next action.
- Added compact, no-wrap puzzle progress treatment and responsive settings grids for 360px through 675px layouts.
- Compressed the current-picture hub card and stage unlock presentation; spoon requirements now use a restrained 30px token instead of a dominant standalone reward image.
- Updated mobile and visual-review automation to play through both interactive tutorial rows.
- Verification: 149 tests passed; mobile visual QA passed at 360x740, 390x844, 430x932, and 675x900. Full candidate and visual-pack gates remain next.
### v0.1.563 Balanced Dialogue and Time Attack Cleanup
- Constrained Pip dialogue to a centered 20-22 character reading measure with balanced wrapping, so two-line Korean copy keeps a stable visual center.
- Rebuilt the `1 1 1` tutorial clue as three independent circular clue tokens matching the live puzzle board grammar.
- Changed the final tutorial action from the awkward `같이 ?�작` / `Start together` to `?? 가보자!` / `Ready? Go!`.
- Shortened cursor status chips to the state itself and normalized their height, padding, and baseline against the row/column position chip.
- Simplified Time Attack to the playable essentials: Pip, a short prompt, 5x5 to 8x8 to 10x10, Start, reward status, and records. Removed report-like round descriptions, decorative orb/glare layers, and card shadows.
- Mobile visual QA passed at 360x740, 390x844, 430x932, and 675x900 after updating the flat-card regression contract.

### v0.1.564 Bakery Density Repair Group I

- Redrew the final eight high-density Bakery 12x12 candidates as distinct tart, eclair, dome, puff, bundt, cupcake, checker-cookie, and cream-band compositions.
- Reduced near-solid 81-86% blocks to 54-67% silhouettes with readable negative space and object-specific contours.
- Added two art-audit regression tests and two dedicated four-card completion contact sheets for review at actual rendered size.


### v0.1.565 Village Density Repair Groups A-B

- Redrew all twenty-eight high-density Village Pantry 10x10 candidates across containers, utensils, linens, cookware, and storage objects.
- Replaced near-solid 79-91% blocks with distinct silhouettes using readable handles, holes, checks, nesting, woven gaps, labels, mesh, and open ceramic space.
- Added seven art-audit regression tests and seven dedicated four-card completion contact sheets.


### v0.1.566 Launch Art Audit Closure

- Added specific silhouette, color-mood, and tag briefs to all 27 legacy Bakery Window and Village Pantry puzzles that lacked authored art guidance.
- Reworked six blank-edge compositions and synchronized their progression and quality overrides so runtime art matches source data.
- Closed the 273-puzzle Bakery/Village audit at zero duplicate silhouettes, zero repeated titles, and zero review candidates.
- Added a zero-queue regression test and a six-card contact sheet for the final composition repairs.


### v0.1.567 Phase E concise dialogue pass
- Shortened active KO/EN hint prompts to the choice, spoon cost, and balance needed at the moment of action.
- Rewrote Time Attack, first Pantry placement, room-story, and three neighbor guide steps as short character dialogue instead of feature reports.
- Restored the Korean neighbor guide copy in Unicode-safe form and strengthened the non-puzzle Korean mojibake test to reject CJK corruption fragments.
- Reduced the large-board tap-mode Pip card to one instruction plus its visual clue examples; duplicate automatic-X explanations no longer compete with the board.
- Focused i18n and Pantry guide-flow tests pass. Full visual-pack and candidate gates remain the next verification step.


### v0.1.568 Phase E Pantry visibility cleanup
- Removed the duplicate Pantry spoon count and the unmounted placement-report node so the room, request, decorations, and paid packs remain the visible hierarchy.
- Removed legacy rarity, availability, and sort state that no longer had visible controls but could still hide decoration cards for returning sessions.
- Pantry filtering now follows only the visible room-slot choice, with the featured affordability ordering preserved.
- Unified starter-hint body copy on one key; large-board reveal count remains an interaction result rather than explanatory text.
- Full unit tests and four-width mobile visual QA pass before the final candidate rerun.

### v0.1.569 Phase E Time Attack result cleanup
- Removed the extra intro sentence so the Time Attack screen moves directly from its title to Pip, the three board sizes, and Start.
- Reduced stored records to board size, solved cells, and elapsed time; current-board diagnostics and zero-use hint reports are no longer shown to players.
- Result cards show hint usage only when a hint was actually used, and timeout copy is now a short game response instead of an economy report.
- Removed the now-unused board-progress formatter and added KO/EN regression coverage for the compact result format.
- Verification: 160 unit tests, four-width mobile QA, the regenerated 61-frame visual pack, full candidate gate, production build, and Android release gate pass.

### v0.1.570 Phase E settings choice cleanup
- Removed the explanatory sentence above the two guide replay buttons; the settings screen now presents only the guide label and direct choices.
- Removed the retired Time Attack board-progress and best-summary translation keys noted in Review 16, plus the unused guide-body style and translation.
- Settings remains preferences-only; paid spoon packs stay below Pantry decorations in the Pantry shop.
- Verification: 160 unit tests, source hygiene, four-width mobile QA, the regenerated 61-frame visual pack, full candidate gate, production build, and Android release gate pass.

### v0.1.571 retired season report removal
- Removed the unmounted Season 0 progress dashboard, its 333-picture metrics, next-season marketing teaser, goal cards, translations, and CSS.
- Simplified the puzzle-hub call back to its active responsibility: show the current picture and open it. Stage unlock and Pantry routing remain owned by the live puzzle picker.
- Removed the never-called season teaser QA helper while retaining the launch regression that requires the retired dashboard to stay absent.
- Added source-hygiene guards across puzzleHubView, KO/EN translations, and CSS so the report UI cannot silently return.
- Verification: 160 unit tests, source hygiene, clean full-candidate QA, four-width mobile QA, production build, Android release gate, and the regenerated 61-frame visual pack pass.

### v0.1.572 retired intro and Pip-strip cleanup
- Removed the unmounted small Pip strip and player-facing version footer functions, along with their KO/EN translations.
- Used selector-aware CSS cleanup to remove 105 retired selectors for the Pip strip, version footer, intro seal, feature promise strip, launch note, version chip, and cast strip while preserving any active selectors sharing a rule.
- Kept legacy hidden artwork entries in the asset manifest as audit history; no approved runtime art was removed.
- Added source-hygiene guards so the retired strip, footer, intro marketing copy, and ornamental CSS cannot silently return.
- Verification passed: 160 unit tests, source hygiene, the full candidate gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, build, Android release gate, and the 61-frame visual review pack.

### v0.1.573 collection-surface copy cleanup

- Removed the Album note that repeated what the completed-picture grid already shows.
- Removed repeated "Badge earned" labels from the earned badge shelf and badge room; artwork and badge names now carry the state, while accessible shelf labeling remains.
- Removed the matching dead translations and CSS selectors and added source-hygiene guards against reintroducing report-like collection copy.
- Verification passed: 160 unit tests, source hygiene, the full candidate gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, build, Android release gate, and the 61-frame visual review pack.

### v0.1.574 replay surface and encoding cleanup

- Reduced the replay-picks card to one title, today's count, and direct picture choices; removed the duplicate eyebrow and repeated per-button replay label.
- Removed the legacy replay-card color blobs and button glare pseudo-elements, plus their unused explainer styles and translations.
- Shortened the clean-replay rule/result while preserving the one-spoon reward contract, and repaired the corrupted daily-reward separator in both locales.
- Added translation, launch-integrity, and source-hygiene guards for the compact replay grammar and retired ornament layers.
- Verification passed: 160 unit tests, source hygiene, launch integrity, the full candidate gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, build, Android release gate, and the 61-frame visual review pack.

### v0.1.575 locked-stage decision cleanup

- Reduced each locked stage to the unlock cost, Pantry request progress when required, and the action available now.
- Removed the duplicate plan paragraph and gate-reason chip, along with their seven KO/EN translation keys, helper functions, and CSS selectors.
- Kept the live unlock checks, disabled-button reason, Pantry route, spoon balance, and save behavior unchanged.
- Updated launch-integrity and source-hygiene contracts to protect the compact lock state.
- Verification passed: 160 unit tests, source hygiene, launch integrity, the full candidate gate, mobile QA at 360x740 / 390x844 / 430x932 / 675x900, build, Android release gate, and the 61-frame visual review pack.

### v0.1.576-v0.1.580 Phase E release-surface polish

- Removed the remaining hub, replay, lock, and quick-travel report copy so each surface leads with one player decision rather than a feature explanation.
- Kept Quick Travel reachable with approved raster art while reducing its phone trigger to a 48px icon, avoiding Pantry-card title collisions. The three language choices now remain on one compact line at phone widths.
- Moved Pip's Time Attack presence to the full-screen guide only. The live Time Attack screen now shows the 5x5 / 8x8 / 10x10 ladder, Start, daily status, and earned records.
- Corrected the visual-review pack so its Time Attack capture closes the one-time guide before recording the actual start screen.
- Verification: 160 unit tests, source hygiene, the 61-frame visual review pack, full candidate gate, production build, Android release gate, and measured mobile QA at 360x740 / 390x844 / 430x932 / 675x900 pass at v0.1.580.
- External release evidence remains unchanged: real-device Billing purchase/restore for `pip_cozy_support` and purchase/repeat for `pip_spoon_jar_small`.

### v0.1.581-v0.1.582 final play-choice polish

- Removed duplicated hub and Time Attack labels; each surface now begins with the active picture or mode title rather than an extra category label.
- Puzzle choices now show only the picture name and board size. Spoon awards remain a completion moment instead of a pre-play report on every card.
- Regression checks reject restoring reward-report metadata to puzzle choices.
- Verification: 160 unit tests, source hygiene, the regenerated 61-frame visual review pack, full candidate gate, production build, Android release gate, and measured mobile QA at 360x740 / 390x844 / 430x932 / 675x900 pass at v0.1.582.
- Remaining release evidence is external only: real-device Billing purchase/restore for `pip_cozy_support` and purchase/repeat for `pip_spoon_jar_small`.

### v0.1.586 release-structure first slice

- Removed the player-facing Album denominator, so the live Album celebrates completed pictures without presenting the fixed Season 0 total as a distant obligation.
- Kept the Badge room visually compact while restoring accessible earned/progress labels through dynamic ARIA text rather than visible report copy.
- Confirmed future `bonus-pack` records are already excluded from the live puzzle picker; they remain data-only until content, artwork, and a real store path exist.
- Started the release-structure audit: the 333 authored puzzles remain valid content, but their current five-pack distribution will be reworked into smaller, progressive shelves without changing puzzle IDs or discarding completed work.

### v0.1.583 Time Attack clock identity

- Replaced the retired spoon-stopwatch destination art with Mr. Park's isolated pocket watch across the Time Attack hub card and Quick Travel.
- Removed the inherited circular badge, aura, and pseudo-element decoration so the watch itself is the clear Time Attack cue at phone and wide layouts.
- Registered the new raster asset and added hygiene plus four-width visual assertions to prevent a fallback to the retired ambiguous icon.
- Verification: 160 unit tests, 158 registered assets, source hygiene, the regenerated 61-frame visual review pack, full candidate gate, production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900 pass at v0.1.583.
- Remaining release evidence is external only: real-device Billing purchase/restore for `pip_cozy_support` and purchase/repeat for `pip_spoon_jar_small`.

### v0.1.584-v0.1.585 final surface audit

- Replaced the lingering Pantry ?�show more decorations??glare card with one flat, full-width action and removed its retired meter, sparkle, and pseudo-element rules.
- Reduced the Badge room from collection-report copy to the current badge artwork, name, and compact progress only.
- Fixed the opening grain layer so it is decorative-only and can never intercept a player tap while the intro exits.
- Added hygiene and mobile regression checks for retired Pantry glare, Badge-report copy, and the intro grain pointer contract.
- Verification: 160 unit tests, source hygiene, 158 registered assets, the regenerated 61-frame visual review pack, full candidate gate, production build, Android release gate, and mobile QA at 360x740 / 390x844 / 430x932 / 675x900 pass at v0.1.585.
- Remaining release evidence is external only: real-device Billing purchase/restore for `pip_cozy_support` and purchase/repeat for `pip_spoon_jar_small`.

### 2026-07-26 Pre-release spatial-contract audit

- Began a menu-by-menu geometry audit after Production access was granted and before release submission.
- Strengthened four-width mobile QA so the six workshop destinations must remain inside the illustrated scene, cannot overlap one another, and cannot overlap the current-puzzle action.
- Added the same containment and collision guard to the five Pantry room slots, alongside the existing horizontal-overflow, shop ordering, card, and Billing-status checks.
- Added `docs/HOME_SCENE_CONTRACT.md`: the workshop and Pantry remain distinct surfaces, while future decoration/theme work must use one equipped-decoration save source and authored perspective-safe overlays. Persistent destinations stay in side rails; Pip and room storytelling own the center.
### 2026-07-26 Runtime background optimization

- Preserved the approved PNG masters for Pip's Puzzle Workshop and the sunlit Decor Room, then added quality-checked WebP runtime versions.
- Runtime payload drops from about 2.4MB each to 424KB (Workshop) and 346KB (Decor Room), while pixel RMS comparison remains below 1.9.
- Asset QA now requires the runtime WebP imports and the archived non-visible PNG source records, preventing accidental reversion to direct PNG bundling.

### v0.1.594 full-screen Puzzle Room home correction

- Replaced the card-based home with one full-screen, authored Puzzle Room scene: no external header, title block, or separate spoon pill appears over the home.
- Moved the spoon balance into the scene and rebuilt the current-puzzle call to action as a direct `???�즐 ?��? action with puzzle art and the active picture name.
- Converted the six destinations to large, icon-only in-scene controls; labels remain available to assistive technology while no longer reading as white folder cards.
- Removed the incorrect Pantry-decoration/supporter-keepsake overlays from the Puzzle Room. The editable Pantry remains its own room; future shared room themes must be authored as complete scene variants rather than placing purchased items at arbitrary coordinates.
- Stopped the initial brand-intro fade-in so the existing home cannot flash before the Sunny Spoon Studios bumper.
- Reworked the mobile QA contract for the full-screen home: it now checks full-scene containment, icon/action collisions, in-scene currency, and the absence of retired Pantry-prop overlays. The normal header contract remains active for all other views.
- Verification: 175 unit tests, source hygiene, full `qa:candidate`, production build, Android release gate, and four-width mobile QA pass at v0.1.594. Only the two real-device Billing evidence items remain external release blockers.

## v0.1.642 - 2026-07-29 - Pantry 8-shelf economy and art expansion

- Expanded Pantry collection from 4 shelves / 24 jars to 8 shelves / 48 jars while keeping one free starter jar per shelf.
- Added 24 individually generated, transparent 256px WebP jar artworks for Pickles, Fruit Preserves, Herb Oils, and Botanical Teas.
- Switched stage gating from completed jar shelves to paid jar count, using nine thresholds: 0, 5, 10, 15, 20, 25, 30, 35, and 40.
- Rebalanced jar shelf totals to 180/200/240/280/340/420/520/640 spoons (2,820 total) and stage unlocks to 1,535 spoons with 810 stage bonus spoons.
- Preserved completed-shelf counting only for Pantry collection celebration effects.
- Validation: `npm run qa:candidate` passed 38 test files / 205 tests, all 333 puzzle catalog checks, 48 mapped jar assets, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.643 - 2026-07-29 - Nine-stage Badge Shelf

- Rebuilt the Badge menu as three authored wooden shelves with nine stage badges, while keeping persistent badge artwork confined to the Badge menu.
- Kept the original Stage 0-2 badge art and added six transparent 256px WebP scenes for Stages 3-8: Bakery Door, Pastry Morning, Tin Collection, Village Path, Clock Corner, and Full Pantry.
- Mapped each badge to completion of its full stage puzzle group across all 333 authored puzzles. The last puzzle of a stage now triggers a short earned toast, and the newly earned slot glows when the Badge menu opens.
- Locked badges remain visible in subdued grayscale with progress; earned badges restore full color. The final Full Pantry badge keeps a gentle gold pulse, with reduced-motion support.
- Updated mobile and source-hygiene contracts so duplicate persistent badge artwork stays removed from non-Badge menus while the dedicated Badge collection UI and transient earned toast remain supported.
- Validation: `npm run qa:candidate` passed 38 test files / 207 tests, all 333 puzzle catalog checks, 207 registered assets, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.644 - 2026-07-29 - Badge spacing and first-run guide verification

- Fixed a legacy `.badge-shelf { display: flex; }` cascade that squeezed the new three-slot shelves and caused neighboring badge circles to overlap.
- Reduced badge circle sizing and added explicit slot gaps so all three badges remain separated at 360x740, 390x844, 430x932, and 675x900.
- Made unearned badge artwork substantially more mysterious with grayscale treatment and `0.12` image opacity while keeping progress and unlock hints readable.
- Strengthened mobile QA to reject non-positive badge gaps, locked art opacity above `0.15`, and any shelf containment regression.
- Verified the true first-entry Badge guide as Pip with three populated steps, sequential `1 -> 2 -> 3` progression, and a clean final dismissal at all four QA widths.
- Validation: `npm run qa:candidate` passed 38 test files / 207 tests, all 333 puzzle catalog checks, production build, Android release gate, and four-width mobile visual QA.

## v0.1.645 - 2026-07-29 - Affordable Pantry notification

- Changed the Workshop Pantry notification so it appears only when the player can currently afford an unowned paid jar.
- Free starter jars, unaffordable jars, and already-owned jars no longer keep the notification permanently lit.
- Reused the same computed condition on the `home.pantryLabel` destination button and avoided repeated save reads for the displayed spoon balance.
- Added focused regression coverage for zero balance, affordability thresholds, ownership, and all-owned states.
- Validation: `npm run qa:candidate` passed 38 test files / 210 tests, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.646 - 2026-07-29 - Guide overlay isolation

- Raised every guide overlay above Pantry jar detail sheets and transient UI so neighbor conversations cannot be covered by the underlying Pantry screen.
- Locked document scrolling and overscroll while any guide is active, then released the lock through the normal guide-close redraw.
- Strengthened Pantry neighbor backdrops to cover the full dynamic viewport while keeping the approved Mr. Park artwork fully contained.
- Extended mobile visual QA to reject incomplete viewport coverage, overlay z-index below transient UI, missing background scroll lock, or clipped guide character art.
- Android versionCode/versionName remain unchanged; no AAB was requested for this step.
- Validation: `npm run qa:candidate` passed 38 test files / 211 tests, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.

## v0.1.647 - 2026-07-29 - Pip's Pantry naming

- Unified the Pantry destination name across floating navigation and the Workshop home.
- Korean now uses `Pip의 팬트리`; English now uses `Pip's Pantry` for both `views.pantry` and `home.pantryLabel`.
- Added focused i18n coverage so the two entry points cannot drift apart again.
- Validation: `npm run qa:candidate` passed 38 test files / 212 tests, production build, Android release gate, and mobile visual QA at 360x740, 390x844, 430x932, and 675x900.
- Android versionCode/versionName remain unchanged; no AAB was requested for this step.