# Art Direction

Last updated: 2026-06-28

## Visual Promise

Pip's Picture Pantry should feel like a small premium cozy puzzle game: warm paper, cafe textures, clean readable grids, and soft illustrated character touches.

## MVP Priorities

- The puzzle board is the hero.
- Pip appears as the emotional hook, especially in greeting and completion states.
- Elena can appear as warm context, but she should not become a tutorial narrator.
- Use existing character sheets as continuity reference and reaction sources.

## Palette

- Cream paper: `#FFF3D8`
- Warm parchment: `#F5DFAE`
- Cafe brown: `#7A4E35`
- Cocoa outline: `#3D2B2E`
- Pip tan: `#C99967`
- Soft mint: `#A8D8C2`
- Tomato red: `#D95D4F`
- Golden accent: `#F2C94C`
- Deep plum: `#4A344A`

## Guardrails

- Avoid dense dashboard panels.
- Avoid old Elena scene composition and old UI structure.
- Avoid school worksheet styling.
- Avoid tiny controls below 44px.
- Avoid long text inside gameplay panels.

## Character Continuity Gate - 2026-07-05

- Pip guide, reward, completion, menu, and promotional art must preserve the Sunny Spoon Studios baseline identity.
- Pip is not a generic bear, hamster, plush mascot, or interchangeable cute animal. He must keep the rounded warm-brown pantry-helper silhouette, tiny cream chef hat, muted red scarf, small dot eyes, tiny nose/mouth, soft blush, warm-brown outline, and quiet helper energy described in `CHARACTER_IP_BIBLE.md`.
- Generated or imported character art is not approved simply because it is cute or polished. It must be checked against `CHARACTER_IP_BIBLE.md`, `src/data/characterIdentity.js`, and the current baseline assets before visible UI wiring.
- If character continuity is uncertain, use an existing baseline Sunny Spoon/Pip raster asset or a text/chrome fallback rather than shipping a new character image.

## Whole-App Art Cohesion Reset - 2026-07-05

The target is not merely "cute enough". The art direction should feel like one premium cozy Sunny Spoon Studios product from the app icon to the opening screen, guide dialogs, spoon currency, puzzle completion effects, badges, and Pantry decoration rewards.

Current visible mismatches, including the opening-screen mix of app icon Pip, legacy/generated character sheets, and different Pip proportions, should be treated as temporary technical debt. Do not expand those mismatches. Replace them through a coordinated art pass documented in `docs/ART_REWORK_ROADMAP.md`.


## Sunny Spoon Studios Shared Identity - 2026-07-06

The opening brand sequence should work as a reusable Sunny Spoon Studios identity layer, not as a one-off Pip's Picture Pantry illustration. It should feel premium, cozy, warm, and studio-owned before the game-specific title appears. The app icon, Sunny Spoon Studios screen, and game start screen must feel like consecutive frames from the same art system.

Guidance for future art passes:

- App icon: strong Pip/Pantry recognition, readable at small sizes, same character proportions as runtime Pip.
- Sunny Spoon Studios screen: reusable studio bumper/mark with Sunny Spoon warmth, not overloaded with this game's puzzle UI or Pantry-specific clutter.
- Game start screen: game-specific key visual can include Pip and Pantry mood, but it must inherit the same palette, lighting, outline weight, and cozy polish as the icon and studio screen.
- Do not mix a polished icon with unrelated generated splash art or legacy character-sheet crops in the first-run sequence.
