# Pip's Picture Pantry - New Project Brief

Last updated: June 28, 2026

Recommended new folder name:

`D:\Users\bbock\OneDrive\00. Private\10. Development\03. Pip's Picture Pantry`

Recommended app title:

**Pip's Picture Pantry**

Subtitle / store short line:

**A cozy picture puzzle from Sunny Spoon Studios.**

## Decision Summary

Elena's Cozy Village is placed on development hold. The world, characters, and Sunny Spoon Studios identity remain valuable, but the current app became too broad, too text-heavy, and too difficult to bring to launch quality with incremental fixes.

The new first-release game should be a much smaller, cleaner product:

- A simple mobile-first puzzle game.
- A polished 2D cozy interface.
- One core loop that is understandable within 10 seconds.
- Elena/Pip/Sunny Spoon Village identity without heavy story systems.
- No educational positioning on the first release surface.

Final chosen direction:

**Cozy Nonogram / Picross**

The first game should be a picture-logic puzzle where players solve small grids to reveal Sunny Spoon Village images: Pip, soup bowls, recipe cards, Elena's apron, cafe signs, market treats, and tiny cozy objects.

## Why This Direction

### Product Reason

The previous Elena Cozy Village direction tried to combine:

- Story game.
- Restaurant helper game.
- Learning game.
- Village simulation.
- Dream Studio decoration.
- Character collection.
- Parent settings.
- Cross-platform release preparation.

That scope is too large for the first commercial product. The new game should prove that Sunny Spoon Studios can ship one small, polished, replayable game.

### Market Reason

Current casual game patterns in Korea and the United States favor:

- Simple rules.
- Short sessions.
- Clear completion goals.
- Puzzle familiarity.
- Low friction replay.
- Daily challenge structures.

Nonogram/Picross is especially attractive because:

- Korea has strong familiarity with 네모로직-style games.
- The United States has a steady Picross/Nonogram niche.
- The rules are stable and testable.
- Content can be generated as solution grids.
- Completed puzzles naturally become collectible pictures.

### Development Reason

This genre is highly suitable for Codex-led development:

- Pure state-machine logic.
- No physics engine.
- No complex animation engine.
- No random match balancing.
- No 3D assets.
- No heavy level editor required for MVP.
- Strong automated testing is possible because every puzzle has a known solution.
- CSS Grid and standard DOM controls are enough for a beautiful first version.

Claude should act as reviewer:

- UX clarity review.
- Puzzle difficulty review.
- Visual density review.
- Store-readiness review.
- Regression risk review.

Codex should lead implementation:

- Architecture.
- Game logic.
- UI.
- Local save.
- Test harness.
- Android/iOS packaging preparation.

## Product Pillars

### 1. One Puzzle, One Cozy Picture

Every puzzle reveals one tiny Sunny Spoon picture. The player should always understand what they are doing:

> "Fill the grid to reveal today's cozy picture."

### 2. Pip Is The Emotional Hook

Pip should be the main mascot and first memory target.

Pip's role:

- Greets the player.
- Holds the daily picture card.
- Reacts gently to completion.
- Carries hints.
- Appears in completed image stamps.

Pip should not explain complex systems or speak in long sentences.

### 3. Elena Gives Purpose, Not Homework

Elena can appear as the warm human anchor:

- "Let's finish Pip's picture card."
- "This one belongs in the cafe album."
- "A tiny picture for the pantry wall."

Elena should remain active, observant, and creative, but the first game should not require story scenes to function.

### 4. Cozy But Not Childish

The visual standard is:

- Soft 2D illustration.
- Warm paper and cafe textures.
- Clean grid.
- High readability.
- No PowerPoint-shape look.
- No cluttered dashboard panels.
- No excessive explanatory text.

The goal is "small premium cozy puzzle", not "school worksheet" and not "busy learning app".

### 5. Release Small, Expand Calmly

First release should not contain the whole Sunny Spoon ecosystem. It should create a foundation:

- Polished puzzle loop.
- Daily habit.
- A small gallery.
- A few high-quality character reactions.
- Room for future packs.

## Game Concept

### Core Loop

1. Player opens the app.
2. Pip presents today's picture card.
3. Player chooses a puzzle or continues the current one.
4. Player fills / marks cells using row and column clues.
5. The hidden picture is completed.
6. Pip reacts.
7. The picture is added to the Pantry Album.
8. Player can play another puzzle or leave satisfied.

### Session Length

Target session lengths:

- 5x5 starter puzzle: 30-90 seconds.
- 8x8 easy puzzle: 2-4 minutes.
- 10x10 normal puzzle: 4-8 minutes.

The first release should favor short sessions over depth.

### Control Scheme

Mobile-first controls:

- Tap cell to fill.
- Long-press or mode toggle to mark empty.
- Optional mode switch: Fill / Mark.
- Undo button.
- Hint button, limited but generous.
- Mistake feedback should be gentle.

Avoid:

- Tiny toolbar buttons.
- Multi-layer menus.
- Hidden gestures as required controls.
- Text labels inside small controls when icons are enough.

### Puzzle Modes

MVP modes:

- Starter Pack.
- Daily Picture.
- Pantry Album.

Post-MVP modes:

- Seasonal Packs.
- Pip's Favorite Things.
- Elena's Sketchbook.
- Sunny Spoon Cafe Signs.
- Market Day.

## MVP Scope

### Must Have

- 5x5 tutorial puzzles.
- 8x8 main puzzles.
- 10x10 unlockable puzzles.
- Puzzle data format with solution grid.
- Auto-generated row and column clues.
- Fill/mark/clear cell states.
- Win detection.
- Local progress save.
- Completed picture album.
- Pip completion reaction.
- Mobile-first responsive UI.
- Basic settings: sound on/off, reset progress.
- Version label visible in a discreet footer/settings area.

### Should Have

- Daily puzzle slot.
- Streak count, but gentle and non-punitive.
- Hint system.
- 30-50 hand-authored launch puzzles.
- Puzzle pack categories.
- Completion animation.
- Haptic-safe button feedback where available.

### Could Have Later

- Cloud save.
- Ads.
- Paid packs.
- Seasonal events.
- Character outfit rewards.
- Puzzle editor tool.
- Store screenshot generator.
- App Store / Google Play themed assets.

### Must Not Have In MVP

- Dream Studio.
- Restaurant management.
- Parent Corner as a visible main tab.
- Learning-language configuration.
- Long story cards.
- Complex village map.
- Character relationship systems.
- Inventory/shop/currency.
- Login.
- Social sharing.
- Monetization mechanics.

## Initial Puzzle Packs

### Pack 1: Pip's Pantry Shelf

Purpose: first 20 puzzles, low difficulty.

Example pictures:

- Pip face.
- Soup bowl.
- Spoon.
- Recipe card.
- Tiny bow.
- Apple.
- Tea cup.
- Bread loaf.
- Cafe sign.
- Apron pocket.

### Pack 2: Sunny Spoon Cafe

Purpose: 8x8 and 10x10 cozy cafe objects.

Example pictures:

- Tomato soup.
- Window.
- Chair.
- Oven mitt.
- Muffin.
- Clock.
- Wooden spoon.
- Pantry jar.
- Table flower.
- Cafe bell.

### Pack 3: Elena's Little Sketches

Purpose: slightly more characterful images.

Example pictures:

- Elena's heart clip.
- Sketchbook.
- Dream window.
- Market basket.
- Party ribbon.
- Reading corner.
- Friend note.
- Studio lamp.

## First 10 Puzzles To Build

Use these for the first playable prototype:

1. Pip Face - 5x5
2. Soup Bowl - 5x5
3. Spoon - 5x5
4. Recipe Card - 5x5
5. Tiny Bow - 5x5
6. Cafe Window - 8x8
7. Tomato Soup - 8x8
8. Pantry Jar - 8x8
9. Elena Heart Clip - 8x8
10. Sunny Spoon Sign - 10x10

The first prototype should feel complete with only these 10 puzzles.

## Visual Direction

### Overall Look

Keywords:

- Cozy.
- Clean.
- Premium casual.
- Warm cafe.
- Soft paper.
- Illustrated, not clip-art.
- Friendly but not babyish.

### Color Direction

Suggested palette:

- Cream paper: `#FFF3D8`
- Warm parchment: `#F5DFAE`
- Cafe brown: `#7A4E35`
- Cocoa outline: `#3D2B2E`
- Pip tan: `#C99967`
- Soft mint: `#A8D8C2`
- Tomato red: `#D95D4F`
- Golden accent: `#F2C94C`
- Deep plum: `#4A344A`

Avoid:

- Overuse of purple.
- Flat gray panels.
- Neon puzzle colors.
- Generic school-app primary colors.
- Busy patterned backgrounds behind puzzle grids.

### Puzzle Board

The board should be the hero.

Rules:

- Centered.
- Large touch targets.
- Calm background.
- Clear row/column clues.
- Filled cells should feel like tiny illustrated tiles, not default squares.
- Marked empty cells should be visually quiet.
- Completed pictures should have a small reveal animation.

### UI Layout

Mobile first screen:

1. Small top bar: title / settings.
2. Pip reaction strip or small character bubble.
3. Puzzle board.
4. Fill/Mark toggle and Undo/Hint.
5. Bottom progress line.

No side panels on mobile.

Desktop/tablet can use extra space, but should not reveal dense management UI.

### Character Usage

MVP character priority:

1. Pip.
2. Elena.
3. Aunt Mina.
4. Mr. Park / Lily / Nora / Mateo / June later as puzzle-pack themes.

MVP should not require full-body characters on every screen. Use high-quality portraits/reactions instead.

## Writing Direction

Text should be short.

Good:

- "Pip found today's picture."
- "Fill the grid to reveal it."
- "A cozy soup bowl!"
- "Saved to the Pantry Album."

Bad:

- Long explanations of story context.
- Learning objective language.
- Multi-sentence system descriptions.
- Generic "complete the mission" copy.

Tone:

- Warm.
- Specific.
- Low-pressure.
- Lightly playful.

## Technical Direction

### Recommended Stack

Start with:

- Vite.
- TypeScript or plain JavaScript with strict modules.
- HTML/CSS.
- CSS Grid for puzzle board.
- LocalStorage for save.
- Vitest or Node-based unit tests for puzzle logic.
- Playwright visual checks after first UI prototype.

Codex preference:

- Use small modules from day one.
- Keep puzzle logic independent from UI.
- Avoid one large `ui.js` file.
- Avoid canvas for MVP unless a clear need appears.

### Suggested File Structure

```text
03. Pip's Picture Pantry/
  docs/
    PROJECT_BRIEF.md
    ART_DIRECTION.md
    MVP_SCOPE.md
    REVIEW_PROTOCOL.md
  src/
    main.js
    styles.css
    data/
      puzzles.js
      characters.js
      brand.js
    game/
      nonogram.js
      puzzleState.js
      save.js
      dailyPuzzle.js
    ui/
      boardView.js
      homeView.js
      albumView.js
      pipReaction.js
    assets/
      characters/
      icons/
      textures/
  tests/
    nonogram.test.js
    puzzleState.test.js
```

### Core Logic Contracts

`nonogram.js` should provide:

- `computeClues(solutionGrid)`
- `createPuzzleState(puzzle)`
- `toggleCell(state, row, col, mode)`
- `isSolved(state, solutionGrid)`
- `countMistakes(state, solutionGrid)`
- `serializeState(state)`
- `restoreState(payload)`

Puzzle data:

```js
{
  id: "pip-face-5",
  title: "Pip Face",
  packId: "pip-pantry-shelf",
  size: 5,
  difficulty: "starter",
  solution: [
    "01110",
    "11111",
    "10101",
    "11111",
    "01110"
  ],
  reward: {
    imageName: "Pip Face",
    albumText: "Pip saved his first tiny picture."
  }
}
```

### QA Gates

Before first internal test:

- Puzzle clue generation tests pass.
- Win detection tests pass.
- Save/restore tests pass.
- 5x5/8x8/10x10 layouts fit 360px width.
- No text overlap at 360x740, 390x844, 430x932.
- First puzzle can be completed in under 90 seconds.
- No visible debug text.
- No desktop side panel on mobile.
- All buttons are 44px+ touch targets.

## Collaboration Model

### Codex Role

Codex is the primary developer:

- Creates architecture.
- Implements game logic.
- Builds UI.
- Writes tests.
- Maintains context docs.
- Handles packaging and release preparation.

### Claude Role

Claude is the external reviewer:

- Reviews UX clarity.
- Reviews game loop simplicity.
- Reviews visual density.
- Reviews puzzle difficulty.
- Reviews launch readiness.

Claude should not directly expand scope without Codex/user approval.

### Review Protocol

For every major milestone:

1. Codex implements and verifies.
2. User checks locally or on device.
3. Claude reviews screenshots/build behavior.
4. Codex decides whether feedback is in-scope.
5. Context docs are updated.

Claude feedback should be saved as:

`docs/CLAUDE_REVIEW_LOG.md`

or copied into the active Codex thread when short.

## Reusable Files From Elena Cozy Village

Copy these into the new project if possible.

### Highest Value

```text
src/assets/characters/sunny-spoon-cast-concept-v1.png
src/assets/characters/headshot-portrait-sheet-v1-clean.png
src/assets/characters/opening-expression-sheet-v1-clean.png
src/assets/characters/cafe-action-sheet-v1-clean.png
src/assets/characters/story-friends-sheet-v1-clean.png
src/data/characterIdentity.js
src/data/brand.js
CHARACTER_IP_BIBLE.md
PRODUCT_DIRECTION.md
```

### App Icon / Pip Branding Candidates

```text
src/assets/app-icon-192.png
src/assets/app-icon-512.png
src/assets/apple-touch-icon-180.png
store-assets/app-icon/v1.36/finalists/pip-soup-badge-v2-source.png
store-assets/app-icon/v1.36/finalists/pip-soup-badge-v2-app-store-1024.png
store-assets/app-icon/v1.36/finalists/pip-recipe-card-v2-source.png
store-assets/app-icon/v1.36/finalists/pip-recipe-card-v2-app-store-1024.png
store-assets/app-icon/v1.36/recommended-icon-manifest.json
```

### Optional Reference Only

```text
GAME_DESIGN.md
CHAPTER_1_CONTENT_BIBLE.md
APP_ICON_BRIEF.md
APP_ICON_CANDIDATE_PLAN.md
```

Do not copy the old `src/ui.js`, `src/styles.css`, `dist`, `capacitor-handoff`, or old QA artifacts as implementation sources. They are useful historical references but should not become the new app foundation.

## Assets To Reuse Carefully

The existing character sheets are useful for continuity, but the new game should avoid the cluttered scene composition from Elena Cozy Village.

Use existing sheets for:

- Pip reaction cutouts.
- Elena small portrait.
- App icon candidate.
- Store art inspiration.
- Character continuity reference.

Do not use existing sheets for:

- Crowded cafe background.
- Multi-character gameplay screen.
- Dense dashboard panels.
- Full-body sprites inside tiny UI cards.

## First Development Milestones

### Milestone 0 - New Project Setup

Goal: clean empty project with docs and copied reference assets.

Outputs:

- `docs/PROJECT_BRIEF.md`
- `docs/ART_DIRECTION.md`
- `src/data/brand.js`
- `src/data/characters.js`
- copied character reference assets

### Milestone 1 - Logic Prototype

Goal: playable nonogram in a plain UI.

Outputs:

- clue generation
- fill/mark controls
- solved detection
- 5 starter puzzles
- unit tests

No art polish yet.

### Milestone 2 - Mobile Cozy UI

Goal: first screenshot should look like a real Sunny Spoon game.

Outputs:

- mobile-first board layout
- Pip reaction strip
- warm visual style
- no dense side panels
- 360px layout pass

### Milestone 3 - Pantry Album

Goal: completion has a reason to matter.

Outputs:

- completed picture collection
- tiny reward reveal
- local save
- album screen

### Milestone 4 - MVP Content

Goal: enough content for internal test.

Outputs:

- 30 launch puzzles
- difficulty curve
- daily puzzle slot
- first store screenshots

### Milestone 5 - Android Internal Test

Goal: first real-device validation.

Outputs:

- Capacitor Android package
- signed AAB
- internal test upload
- real-device screenshots
- Claude review

## Release Philosophy

The first release should not prove the whole Sunny Spoon universe.

It should prove:

- Players understand the game immediately.
- Pip is memorable.
- The visual quality feels intentional.
- The puzzle loop is satisfying.
- The app can be shipped cleanly.

Everything else can come later.

## Final Product Decision

Proceed with:

**Pip's Picture Pantry**

Genre:

**Cozy Nonogram / Picross**

Studio:

**Sunny Spoon Studios**

Core characters:

**Pip first, Elena second**

First release promise:

**Solve tiny picture puzzles with Pip and collect cozy Sunny Spoon memories.**

