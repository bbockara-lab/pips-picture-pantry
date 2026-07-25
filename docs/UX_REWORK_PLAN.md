# Pip's Picture Pantry UX Rework Plan

Status: live-quality recovery, Phases A-C implemented
Baseline: v0.1.542
Goal: replace screen-by-screen patching with one coherent first-session and navigation experience before release.

## Why this pass exists

Owner review repeatedly found the same problems across different screens:

- information written like a product report instead of a game;
- labels, helper text, and repeated explanations competing with the actual action;
- decorative glare, orbs, medallions, and CSS symbols with no gameplay meaning;
- cards nested inside cards until sections touch, clip, or lose hierarchy;
- Pip shown as a small helper badge instead of a character who occupies the scene and speaks;
- raster artwork and CSS placeholder artwork mixed without a consistent quality bar;
- desktop-width screenshots passing while the real first-time mobile flow still feels cramped;
- rewards shown larger than the picture, story, or player decision they are meant to support.

The recovery pass therefore treats these as system rules, not isolated bugs.

## Product rules

### 1. One screen, one player question

Every screen must answer one immediate question:

- Opening: start the story.
- Name: what should Pip call me?
- Pip dialogue: what is Pip telling or asking me now?
- Puzzle: which cells should I solve?
- Completion: what picture did I reveal?
- Hub: what do I want to play next?
- Pantry: what do I want to place or buy?
- Settings: which preference do I want to change?

Anything that does not help answer that question is removed, deferred, or moved to a later contextual surface.

### 2. Player copy is not release documentation

- Do not show version, storage mechanics, catalog totals, season labels, implementation status, economy calculations, or future-roadmap copy in normal play.
- Prefer a title, one short sentence when necessary, and one clear action.
- Do not repeat information already visible in the art, count, button, or progress state.
- Korean copy must sound conversational and use natural Korean names; English fallback text must not leak into Korean screens.
- Avoid forced line breaks in source copy. Layout owns wrapping.

### 3. Pip speaks in scenes

- Story, onboarding, new mechanics, and new-neighbor beats use a blocking full-screen dialogue scene.
- Pip or the speaking neighbor is visually central, with dialogue directly below or beside the character according to viewport.
- No meta labels such as “small guide”, “Pip is speaking”, or “continue listening”.
- Interactive teaching happens inside the dialogue and must demonstrate a logically valid puzzle state.
- Persistent strips and detached portrait badges are not substitutes for dialogue.

### 4. Gameplay owns its own screen

- Puzzle play never looks embedded in a dashboard card.
- Board, clues, mode controls, undo, hint, and exit are the only primary elements during play.
- Controls use approved readable artwork at the actual rendered size; no miniature decorative duplicate icons.
- Mobile geometry is designed first at 360px, then checked at 390px, 430px, and 675px.

### 5. Art must carry meaning

- No orb, shine, token, dot, badge, or pseudo-element unless it communicates a real state or action.
- No CSS-drawn placeholder art on launch-critical surfaces.
- Raster icons must remain recognizable at their rendered size and share framing, palette, edge treatment, and lighting.
- Rewards are supporting information, never the largest visual on a card.
- Solved puzzles need an authored palette or reveal treatment that makes the finished image more appealing than the unsolved grid.

### 6. Cards are containers, not decoration

- Avoid more than two visible containment levels.
- Cards must not be used solely to create a colored background behind another card.
- At 360px, text and actions stack before they squeeze.
- No fixed-height text containers unless QA proves all supported locales fit.
- No horizontal scrolling, clipped copy, edge-touching actions, or overlapping fixed navigation.

### 7. Purchases appear in context

- Billing products live in the Spoon Shop reached from the Pantry or a genuine spoon-shortage moment.
- Settings contains preferences and help, not products.
- Purchase actions describe the item and result naturally; store price is supplied by the store UI, not explained as a technical operation.
- The spoon economy is described through goals and choices, not calculations or monetization terminology.

## Work sequence

### Phase A — First-session vertical slice

Screens: opening, name, Pip tutorial, first puzzle, first completion.

Done when:

- a new save reaches the first puzzle without seeing developer-facing copy;
- Pip occupies a full dialogue scene;
- the practice interaction teaches a valid nonogram fact;
- the puzzle is a dedicated play screen at all four QA widths;
- the first solved image reads as Pip and reveals an intentional color palette;
- the next action is obvious without a paragraph of explanation.

### Phase B — Play choice and progression

Screens: puzzle hub, puzzle picker, Daily, Time Attack entry, Album, Badges.

Done when:

- card titles, size, reward, and status never overlap;
- the first 20 Korean titles are localized and later fallbacks are audited;
- Daily and Time Attack each have one compact proposition and one action;
- catalog reports, season copy, and roadmap notes are absent from player UI;
- floating navigation names every destination clearly without obscuring content;
- all remaining CSS placeholder icons are inventoried and either replaced or removed.

### Phase C — Pantry and spoon economy

Screens: Pantry room, decoration picker, Spoon Shop, shortage route, Settings.

Done when:

- the room is the visual focus and empty slots do not repeat the same sentence five times;
- the next request is understandable from one short prompt;
- planning decks and economy calculations remain removed;
- shop placement feels connected to decorating rather than Settings;
- purchase cards fit at 360px with concise Korean and English actions;
- Settings is limited to controls, guide replay, accessibility, and legal/help routes.

### Phase D — Completion-art system

Scope: all launch puzzles, beginning with the first 20.

Done when:

- every solved image selects a palette by authored metadata or a documented pack palette;
- the completion reveal is the dominant celebratory visual;
- silhouettes are reviewed at actual grid size, not only by data validity;
- skull-like, ambiguous, or visually unrewarding starter silhouettes are redrawn;
- a visual contact sheet supports batch review of solved starter puzzles.

### Phase E — Whole-flow release audit

Done when:

- fresh-save KO and EN flows are captured from opening through first completion;
- Pantry purchase/equip and Time Attack entry/exit are captured;
- 360x740, 390x844, 430x932, and 675x900 pass measured overflow checks;
- screenshots are reviewed for hierarchy, not only selector presence;
- unit tests, `qa:mobile`, `qa:visual-pack`, `qa:candidate`, and build pass;
- only the two documented real-device Billing evidence items remain external blockers.

## Review checklist for every screen

1. What is the one player question?
2. Is every sentence necessary to answer it?
3. Is the primary action visible without scrolling or decoding a symbol?
4. Does Pip appear only when Pip is genuinely speaking or acting?
5. Does every visual ornament communicate state, reward, destination, or action?
6. Is any label repeated by nearby text or art?
7. Does Korean wrap naturally at 360px?
8. Are two adjacent cards touching, clipping, or competing for emphasis?
9. Is the largest artwork also the most important thing on the screen?
10. Would a first-time player know what happens after the next tap?

## Current immediate queue

- Phase A: implemented and covered by English, Korean, wide, practice, and first-three-completion captures.
- Phase B: hub reports removed; Album shows earned pictures only; Badges shows the next keepsake plus earned badges only.
- Phase C: empty-slot repetition removed; first shop page reduced to three choices; Spoon Shop stays below Pantry; Settings copy and decoration reduced.
- Completion art: the first shelf has authored motif palettes; Sunny Spoon Sign has a stage palette; Apron Drawer now has 20 unique sewing-themed silhouettes and a stage palette instead of reusing Sunny Spoon Sign puzzles.
- Completion art: all exact duplicates, repeated titles, and the prioritized Village/Bakery blank-edge compositions are repaired and documented. The art queue now starts with high-density Bakery 12x12 candidates.
- Release audit: keep regenerating the 51-frame visual pack and rerun the candidate gate after each completed art/UX slice.
- Current slice: v0.1.539 protects visual-QA cleanup with an owned-directory guard and simplifies Time Attack from a report-like card stack to Pip, the three-round ladder, one start action, a compact daily status, and records.
- Verification: v0.1.539 passes 141 unit tests, the 101-candidate art audit, launch-integrity QA, production build, Android release gate, four-width mobile QA, the full candidate gate, and a regenerated 51-frame visual pack.
- Current slice: v0.1.540 nests the optional paid packs inside the Pantry shop after all spoon-priced decoration controls and cards. Mobile QA now locks both containment and ordering.
- Verification: v0.1.540 passes 141 unit tests, the full release-candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame visual pack.

- Current slice: v0.1.541 applies one flat card grammar to spoon-priced decorations and paid packs, with concise section labels and no nested paid-store frame.

- Verification: v0.1.541 passes 141 unit tests, the full candidate gate, four-width mobile QA, production build, Android release gate, and the regenerated 51-frame visual pack.

- Current slice: v0.1.542 removes the repeated first-request target chip and reduces each first-request state to one short sentence.

- Verification: v0.1.542 passes 141 unit tests, the full candidate gate, four-width mobile QA, production build, and Android release gate.

- Current slice: v0.1.543 removes the Pantry request archive, room-level counter, chapter/stage calculations, and milestone narration from the rendered flow. The first completed request now leads directly to three next-decoration choices while full-screen story guides remain intact.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.543 visual pack pass.

- Current slice: v0.1.544 reduces the selected Pantry decoration goal to artwork, one status line, and actions; removes its inline Pip stamp and repeated report copy; and disables the remaining glare/orb pseudo-elements on Pantry story-action cards.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.545 separates story from utility UI: the first-request card now contains only decoration art, title, and action; completed requests disappear; and purchase/equip feedback no longer repeats Pip, meta labels, or explanatory paragraphs.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.546 resolves Claude Review 10 P2 by restoring player-visible Billing progress, result, and failure messages while keeping ordinary ready/empty status quiet.
- Verification: 141 unit tests, Billing tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.547 removes the dormant Pantry planning/report implementation rather than relying on hidden mounts. Live purchasing, placement, story completion, and neighbor guide progression remain intact.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, four-width mobile QA, and the regenerated 51-frame v0.1.547 visual pack pass.

- Current slice: v0.1.548 removes the retired Pantry report vocabulary from both locales and their tests, preventing hidden dashboard copy from returning through future UI work.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.549 removes the retired Pantry report CSS and adds a hygiene guard against its return while preserving live decoration savings feedback.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.550 makes each Pantry decoration card answer one question only: what is it, what does it cost, and what can I do now.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.551 removes the retired decoration-card copy and styles so the compact shop grammar is structural rather than cosmetic.
- Verification: 141 unit tests, full candidate gate, production build, Android release gate, and four-width mobile QA pass.

- Current slice: v0.1.552 begins the remaining high-density Bakery art queue with four distinct 12x12 silhouettes, reducing the audit queue from 101 to 97 candidates.
- Verification: 142 unit tests, 97-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


- Current slice: v0.1.553 continues the high-density Bakery art queue with four distinct 12x12 pastry silhouettes, reducing the audit queue from 97 to 93 candidates.
- Verification: 143 unit tests, 93-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


- Current slice: v0.1.554 repairs four more high-density Bakery silhouettes and reduces the audit queue from 93 to 89 candidates.
- Verification: 144 unit tests, 89-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.


- Current slice: v0.1.555 closes the Review 12 biscuit note and repairs four additional Bakery silhouettes, reducing the audit queue from 89 to 85 candidates.
- Verification: 145 unit tests, 85-candidate art audit, full candidate gate, production build, Android release gate, and four-width mobile QA pass.
