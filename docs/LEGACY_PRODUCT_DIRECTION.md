# Elena's Cozy Village - Product Direction

Last updated: June 8, 2026

## Direction Shift

Elena's Cozy Village should evolve from an educational game into a cozy life simulation game with learning naturally embedded inside the experience.

Educational value remains important, but it should no longer be the primary product identity.

Target audiences:
- Children.
- Parents.
- Cozy game fans, including teens and adults.

## Core Philosophy

Previous structure:

Learning -> Story -> Reward

Target structure:

World -> Characters -> Relationships -> Collection -> Learning

Players should return because they want to:
- See Pip.
- Visit the village.
- Decorate Dream Studio.
- Meet recurring characters.
- Collect memories.
- Unlock new areas.

They should not feel they are returning only to complete another lesson.

## Product Identity Pillars

The game should be remembered for:
- Pip.
- Friendships.
- Memories.
- Dream Studio.
- Village life.
- Cozy atmosphere.

Learning should quietly power the experience rather than define it.

Ideal player reaction:

"I forgot I was playing an educational game."

## Learning Rule

Every learning task must solve a real in-world problem.

Prefer:
- Help Pip repair a damaged recipe card.
- Help Nora organize the market budget.
- Help Lily prepare a tea table.
- Help Aunt Mina restore a family recipe.

Avoid:
- Answer a vocabulary exercise.
- Answer a math question.
- Complete a visible worksheet.
- Add missions only because a curriculum slot needs more practice.

Desired feeling:

"I helped someone."

Not:

"I completed an exercise."

## Dream Studio Direction

Dream Studio should become the primary long-term progression system.

Current role:
- Reward room.

Target role:
- Life goal.

Core progression:

Cafe -> Village -> Dream Studio

The player's long-term motivation should become:

"I want to improve my Dream Studio."

Dream Studio should eventually support:
- Room decorating.
- Furniture collections.
- Outfit/style corners.
- Recipe displays.
- Friendship memories.
- Village photo displays.
- Seasonal room themes.

## Pip Direction
Character continuity across sequels, books, video, promotional art, and merchandise is governed by `CHARACTER_IP_BIBLE.md`. New content should strengthen the approved visual, voice, behavior, and agency anchors rather than treating the cast as interchangeable cozy archetypes. The Bible is a production continuity contract, not a substitute for trademark, name, provenance, or visual-similarity clearance.

Pip should become one of the strongest identity pillars of the game.

Increase emphasis on:
- Accessories.
- Reactions.
- Animations.
- Collection systems.
- Personality moments.

Future collection examples:
- Pip hats.
- Pip glasses.
- Pip scarves.
- Seasonal outfits.
- Event outfits.
- Mascot badges.
- Tiny helper tools.

Long-term collection scale can grow toward 50+, 100+, and 150+ unique Pip items across chapters and seasonal updates, but v1.0 should introduce the collection language gently and without pressure.

Players should want to collect Pip items even if they do not care about educational progress.

## Relationship Direction

Relationships should become a major progression layer.

Example future shape:
- Aunt Mina - Friendship Lv.5.
- Nora - Friendship Lv.3.
- Lily - Friendship Lv.4.
- Mateo - Friendship Lv.2.

Friendship can unlock:
- New dialogue.
- New memories.
- New keepsakes.
- New outfits.
- New decorations.
- New story events.

Players should care about people, not mission counts.

## Memory Album Direction

Memory Album should become a major collectible system.

Expandable memory types:
- Character memories.
- Photo cards.
- Story keepsakes.
- Thank-you notes.
- Seasonal memories.
- Event memories.

Completion-minded players should have a reason to collect everything, while children can simply enjoy the visible memories.

## Village Expansion Direction

Learning should emerge naturally from places.

Future locations:
- Cafe.
- Market.
- Library.
- Flower Garden.
- Park.
- Tailor Shop.
- Bakery.
- Lakeside.
- Town Square.
- Art Corner.

Example location-learning fit:
- Library -> vocabulary and story clues.
- Garden -> measurement and observation.
- Bakery -> fractions and sequencing.
- Market -> money and planning.
- Park -> observation, categories, and nature words.

## Cozy Activities

The game should include activities that exist because they feel cozy, not because they directly teach.

Examples:
- Feed animals.
- Pet Pip.
- Arrange flowers.
- Decorate rooms.
- Collect stickers.
- Organize shelves.
- Water plants.
- Take village photos.
- Drink tea with characters.

These activities do not need educational justification.

Current implementation:
- v0.87 adds `Pip Care Corner` as the first live example of a cozy activity that does not award curriculum XP or require a mission answer.
- v0.88 adds Pip care badges so the cozy activity also supports a small collection goal.

## Seasonal Direction

The world should support seasons and seasonal events:
- Spring.
- Summer.
- Autumn.
- Winter.

Future examples:
- Spring Flower Festival.
- Summer Picnic Day.
- Autumn Harvest Week.
- Winter Snow Cafe.

## Adult Cozy Player Layer

Long-term collection goals should exist for cozy game fans who enjoy completion.

Possible completion meters:
- Village Completion %.
- Dream Studio Completion %.
- Memory Collection %.
- Pip Collection %.
- Friendship Completion %.
- Seasonal Collection %.

Children may ignore these. Adult cozy players may love them.

Current implementation:
- v0.89 adds `Cozy Collection Shelf` with first visible completion meters for Dream Studio, Memory Album, Close Friends, Pip Badges, and Village Days.

## Monetization Philosophy

Do not design Elena's Cozy Village as a typical mobile free-to-play game.

Avoid:
- Energy systems.
- Waiting timers.
- Gacha.
- Loot boxes.
- Ad rewards.
- Artificial scarcity.
- Forced engagement mechanics.

Preferred monetization:
- Chapter unlocks.
- Expansion packs.
- Dream Studio packs.
- Cosmetic collections.
- Seasonal DLC.

All purchases should be parent-facing, non-manipulative, and separated from child-facing pressure.

## Feature Validation Test

Before implementing any feature, ask:
- Does this make the world feel more alive?
- Does this strengthen a character?
- Does this create a memory?
- Does this improve Dream Studio?
- Would a cozy game player enjoy this even if there were no educational rewards attached?

If the answer is no, reconsider the feature.

## Release Implication

The first public build can be delayed if needed to avoid launching as a thin educational prototype.

The Chapter 1 MVP should still remain scoped, but its release bar should emphasize:
- World warmth.
- Pip identity.
- Relationship collection.
- Dream Studio motivation.
- Memory Album collectibility.
- Cozy activities and visual polish.

Chapter 1 does not need all long-term systems, but it should clearly point toward the cozy life simulation identity.

## Cozy-First Player Identity And Progress Protection

The product direction now treats the game identity as a Cozy World player profile, not as a learning profile.

Required experience:
- Guest play starts immediately without login.
- World, relationships, collections, Dream Studio, and story progress form the primary save.
- Learning preferences remain optional metadata under the player profile.
- Meaningful progress can later be protected through an optional account.
- Adult players can use a direct player account.
- Child players can use a parent-managed household profile without a child email.
- Apple and Google sign-in may authenticate, but an app-level Player ID remains the cross-platform source of truth.
- Offline local play must continue when account or cloud services are unavailable.

Current implementation:
- Save Schema v2 introduces a stable save key, internal Player ID, revision metadata, legacy migration, local backup recovery, and parent-gated portable Progress Backup export/restore.
- Cloud sync and login are not live yet.
- The detailed boundary is maintained in CROSS_PLATFORM_SAVE_ARCHITECTURE.md.

## Cozy Curriculum Scope - June 22, 2026

Chapters use one fixed authored mission path for every player. Grade, Lexile, and comfort metadata may support parent context and future content audits, but the main story does not replace missions by player level.

Core experience:
- Keep the required main-path interaction feel within a broadly accessible Grades 1-3 range.
- Let knowledge broaden across chapters without turning completion into an academic difficulty ladder.
- Use hints, visual objects, character reactions, and retry-friendly feedback instead of timed tests or failure walls.
- Keep curriculum labels and mastery details secondary and parent-facing.

Grades 4-5 concepts:
- May appear when they become practical cozy-life thinking: multi-step budgeting, recipe fractions or decimals, data reading, inference, map reasoning, and planning.
- Must be visually scaffolded and understandable through the scene.
- Must not require long-form calculation, academic terminology recall, or worksheet-style performance to continue the story.
- Optional deeper side puzzles may use more complexity later, but the main chapter remains calm and finishable.

Chapter content mix target:
- 60% familiar skills reused in a new world or relationship context.
- 25% gently introduced concepts.
- 15% integrated story reasoning that combines multiple simple observations.

Adult cozy layer:
- The literal answer may be easy, but the action should still feel satisfying as organizing, decorating, planning, helping a friend, restoring a memory, or improving the village.
- If an activity has no satisfying world consequence without its educational reward, redesign the activity.


## Sunny Spoon Studios Brand Direction

The long-term brand structure is now broader than one game:
- Studio / brand: Sunny Spoon Studios.
- Brand philosophy: Story / Smile / Spark.
- World / universe: Sunny Spoon Village.
- Current product entry point: Elena's Cozy Village, currently implemented under the Elena's Cozy Village app shell.
- Character layer: Elena, Pip, Aunt Mina, village friends, and future residents.

The goal is not to build one successful game in isolation. The first release should quietly establish a memorable world, recognizable characters, and a lasting cozy brand that can support future chapters, Pip-focused games, Dream Studio experiences, village-life simulators, educational experiences, cozy mini-games, storybooks, seasonal events, and future Sunny Spoon titles.

Brand integration rule:
- Sunny Spoon Studios belongs in the splash/launch moment, credits, About/Parent Corner, update announcements, store materials, and future trailers.
- It must not interrupt gameplay, become a sales pitch, add marketing mechanics, or pressure sharing.
- The player should primarily experience Pip, Elena, Dream Studio, village life, friendships, and memories.
- Pip should be remembered before the studio brand, then gradually connect players back to Sunny Spoon Studios.

Discoverability should come from naturally shareable moments: adorable Pip reactions, unexpected Pip memories, cozy friendship scenes, Dream Studio creations, special completion scenes, beautiful Memory Album pages, emotional thank-you notes, and replay surprises. Replayability should mean "something new might happen," not "I must grind."

