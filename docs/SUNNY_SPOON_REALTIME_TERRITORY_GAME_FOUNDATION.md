# Sunny Spoon Studios Real-Time Territory Game Foundation

Status: pre-project product research and franchise inheritance contract  
Prepared: 2026-08-20  
Working concept: a family-friendly real-time territory game using Pip, Elena, and the Sunny Spoon world

## 1. Purpose

This document separates three things before a new repository is created:

1. what currently makes Paper.io 2 immediately playable and habit-forming;
2. what Sunny Spoon Studios may learn from that structure without copying its expression;
3. which franchise, artwork, writing, economy, safety, engineering, and release rules must cascade into the new project.

It is a research and direction contract, not authorization to copy Paper.io 2 maps, UI, characters, names, effects, progression screens, prices, or source implementation.

## 2. Evidence boundary

### Publicly confirmed

Paper.io 2 publicly describes the following current systems:

- The player leaves a safe owned zone, draws an exposed trail, and captures the enclosed area by returning home.
- A player is eliminated when another player touches the exposed trail or when the player touches their own trail.
- A run can end by claiming the entire map or eliminating rivals.
- Territory earned during failed runs still contributes to country completion; a country can therefore be completed across several attempts.
- Completing countries unlocks countries, skins, power-ups, bonuses, and a short bonus game after a one-run full clear.
- There are more than 100 collectible skins, chests, daily rewards, gold, gems, a shop, limited offers, and character powers.
- Character powers include speed, paint, attack, shield, trail protection, radar, and visibility effects. They charge during play.
- The current App Store listing presents quick online multiplayer, quick matches, daily rewards, skins, in-app purchases, advertising, and a paid No Ads product.
- Voodoo support distinguishes forced inter-run ads, banner ads, and optional rewarded videos.

### Not publicly proven by this research

- Exact matchmaking population, server authority model, tick rate, latency compensation, bot ratio, retention metrics, reward probabilities, chest odds, offer segmentation, or live-operations calendar.
- Whether every opponent shown in every mode is a simultaneously connected human.

Do not describe those unknowns as facts. They require packet/runtime analysis, direct developer disclosure, or a separately authorized competitive teardown.

## 3. Paper.io 2 loop analysis

### 3.0 Owner-supplied runtime capture observations — 2026-08-20

Seven Korean-language mobile captures supplied by the owner confirm the following visible meta structure in the tested build. These are observations from that build, not promises that every region/version has identical tuning.

- The home screen centers a large Play action and shows a country completion bar above the selected character. The captured state shows United States at 33%, making the persistent journey goal visible before play.
- Two currencies remain visible across the home, shop, character, and mission surfaces: coins and premium gems.
- A separate time-limited `Kill to Win` competition ranks players by skull count and displays different rewards for the leading positions. This adds an event-specific competitive objective above ordinary territory play.
- The shop places a free coin claim, a coin-purchased classic item, and a paid No Ads offer in the first merchandise row, then sells premium-gem bundles and exchanges premium gems for large coin bundles.
- The captured gem price ladder is 20 / 110 / 500 / 1100 gems, while the visible coin exchange ladder includes 3,500 / 22,000 / 70,000 / 225,000 coins for 20 / 100 / 300 / 900 gems. These figures are evidence of the tested build only and must not be copied as Sunny Spoon pricing.
- The character collection shows a classic category with a collected/total counter (`6/68` in the capture), selected state, and locked characters tied to behavioral achievements such as consecutive days, games played, opponents eliminated, and chests opened.
- A seven-day mission/reward strip mixes premium gems and escalating coin rewards. The visible daily task board requires all listed missions for the day reward and includes varied goals such as making loops, remaining outside owned paint for a duration, and completing countries.
- The Settings surface exposes sound, music, vibration, minimap side, restore purchases, data, support, community, and version information. The visible build identifies itself as `v4.36.0 (0)`.

What this adds to the earlier analysis:

1. Paper.io 2 does not rely on one progression road. Country completion, event ranking, daily missions, character achievement locks, currencies, and commerce all remain visible as parallel return loops.
2. Several goals deliberately encourage alternate behavior inside the same movement system—for example longer exposure outside safety or producing a number of loops—so missions vary play without requiring a new control scheme.
3. The UI repeatedly places red exclamation badges on store and mission destinations. Sunny Spoon should use notifications only for genuinely new or claimable value, never permanent attention pressure.
4. The dense currency/store presentation confirms a major differentiation opportunity: Sunny Spoon can retain layered progression while offering a calmer home hierarchy and transparent, non-advertising commerce.

The supplied images are research evidence only. Do not trace, reproduce, train project art from, or place their Paper.io UI, characters, badges, store cards, icons, layouts, or event branding in Sunny Spoon production assets.

#### Additional match, unlock, and No Ads captures

Three later captures add direct evidence of the tested build's active-match and post-goal presentation:

- The active match uses a highly reduced playfield with the player avatar attached to a colored exposed trail. Opponent territory/trails remain visible without decorative scenery competing with them.
- A horizontal match-progress track across the top contains multiple reward milestones, including coin markers and a final special reward. This creates several reachable subgoals before full-map completion.
- The left match rail shows eliminations and current coins. The right rail shows a live percentage leaderboard with portraits, rank markers, and the current player's position.
- A minimap at the lower left shows territory distribution and player points. A glowing field orb/pickup appears in the arena, confirming an additional tactical pickup layer beyond pure trail movement.
- A banner advertisement occupies the lower active-play area in the captured build. Its presence visibly reduces usable composition space and supports the owner's report that advertising harms the play experience.
- Completing an achievement (`play 30 games` in the capture) immediately unlocks a named character, then presents a full-screen reveal with rarity/category, character turntable, completion condition, celebration effects, and one confirmation action.
- The No Ads offer is presented as a permanent purchase at USD 9.99 in the captured storefront. Its copy says that mandatory ads during and after games are removed permanently while optional rewarded videos remain available.

Design implications for Sunny Spoon:

1. Preserve the active arena's visual restraint. Premium artwork should live in territory texture, edge treatment, landmarks, atmosphere, and match intro/outro—not cover trail readability.
2. Use in-match subgoals sparingly. At most one journey/progress strip should appear during play, and it must not compete with danger, leaderboard, objective, or safe-area information.
3. A minimap is valuable only if it answers a tactical question at a glance. Its side should be selectable and its symbols must remain readable without personal photos.
4. Field pickups can create tactical variety, but their effects must be deterministic enough to understand, visually announced, and balanced separately from purchased upgrades.
5. Achievement-based character reveals are worth adapting: effort condition -> anticipation -> premium reveal -> immediate ownership. Sunny Spoon should pair the reveal with a character moment or keepsake, not only a rotating model.
6. Sunny Spoon's no-ad promise should be a product property, not a USD 9.99 relief purchase. No banner, forced inter-match, forced post-match, or rewarded video system is planned.
7. Because Paper.io's captured match mixes progress, currencies, ranking, kills, minimap, pickup, and advertising, our prototype must establish an explicit information budget before adding meta HUD elements.

### 3.1 Moment-to-moment play

The core loop is unusually compact:

`safe territory -> leave safety -> create vulnerable trail -> decide how much risk to take -> reconnect -> instant visible expansion -> reassess enemies -> repeat`

Its strength comes from one input producing several simultaneous decisions:

- **Direction:** where to move.
- **Risk:** how far to travel before returning.
- **Greed:** how much area to attempt in one loop.
- **Attack:** whether to cut an exposed opponent.
- **Defense:** whether to retreat because the player's own trail is exposed.
- **Spatial planning:** whether the new loop is efficient, defensible, and likely to reconnect.

There is no separate attack button, build button, targeting UI, or inventory decision in the base loop. The same movement gesture creates territory, exposes weakness, attacks, and escapes. This is the primary design lesson.

### 3.2 Why failure invites another run

- Elimination is fast and visually legible.
- The player normally understands the cause: their exposed line was cut or they crossed it.
- A near-complete loop creates an immediate “I almost had it” response.
- Short runs reduce the perceived cost of restarting.
- Country progress means a failed run can still contribute to a meta goal.
- Opponent behavior creates unscripted stories: escape, revenge, theft, ambush, and greedy overreach.

The important retention mechanic is not merely short sessions. It is **short sessions with partial persistence**: the run is disposable, but the player's broader journey continues.

### 3.3 Reward layers

Paper.io 2 stacks rewards at different time scales:

| Time scale | Observed reward/motivation | Function |
| --- | --- | --- |
| Seconds | Territory visibly expands | Constant competence feedback |
| One risky loop | Enclosed land, possible elimination | Risk/reward payoff |
| One run | Placement, coverage, kills, country contribution | Restart motivation |
| Several runs | Country completion | Failure still advances something |
| Milestone | New country, skin, power-up, bonus | Anticipation and collection |
| Daily | Free reward | Return habit |
| Event cycle | Chests and event rewards | Time-limited novelty |
| Long term | 100+ skins and powers | Collection breadth and playstyle experimentation |
| Purchase | Gems, bundles, skins, No Ads | Monetization and acceleration |

### 3.4 Long-term utilization mechanisms

The long tail is produced by four interacting systems:

1. **Content road:** countries provide a visible sequence rather than an abstract account level.
2. **Collection road:** skins turn repeated play into ownership progress.
3. **Mechanical variation:** character powers change preferred tactics, not only appearance.
4. **Live cadence:** daily rewards, chests, limited offers, and events create reasons to return now.

This layering is stronger than simply adding levels. Each system answers a different player question:

- “What do I do now?” — play a quick match.
- “Did this failed run matter?” — country progress increased.
- “What am I working toward?” — the next unlock.
- “Why try another character?” — a different power and style.
- “Why return tomorrow?” — daily/event opportunity.

### 3.5 Friction and practices Sunny Spoon should reject

- No forced advertisement between matches.
- No banner advertisement over or beside active play.
- No ad-driven interruption of a child's emotional recovery after losing.
- No loot presentation that obscures price, odds, or the difference between earned and purchased value.
- No purchase prompt immediately after repeated defeat.
- No energy system that sells the right to continue basic play.
- No fake urgency, misleading countdown, preselected purchase, or accidental child purchase path.
- No claim of human real-time competition when a participant is actually a bot.

## 4. Sunny Spoon adaptation: original game thesis

### 4.1 Product promise

Create a warm, readable, competitive family game in which Pip and Elena restore blank storybook places by drawing safe paths and bringing color, gardens, recipes, fabrics, and memories back to Sunny Spoon Village.

The game should preserve the core emotional rhythm:

`cozy safety -> brave excursion -> visible risk -> satisfying return -> a world becomes warmer`

It must not present itself as Paper.io with Sunny Spoon art. The world, verbs, match objectives, map grammar, progression, social behavior, and audiovisual feedback require an original system.

### 4.2 Franchise roles

- **Elena:** active protagonist and designer. She chooses routes, restoration goals, team plans, and what a recovered place becomes. She retains agency.
- **Pip:** field companion, clue carrier, emotional anchor, and gentle reaction character. Pip may guide attention and celebrate but does not make Elena's meaningful choice.
- **Aunt Mina and village friends:** mission context, seasonal needs, cooperative goals, keepsake stories, and post-match consequences—not generic quest dispensers.

### 4.3 Original play vocabulary to prototype

Temporary names only:

- Owned territory: **Warmth**, **Garden**, or **Story Patch**
- Exposed trail: **Ribbon Trail**, **Brush Trail**, or **Recipe Thread**
- Capture: **Restore**, **Stitch**, **Bloom**, or **Set the Table**
- Elimination: **Trail break**, followed by a soft reset rather than violent death language
- Match map: a blank or faded storybook place that visibly becomes a Sunny Spoon scene

The final vocabulary must be tested in Korean and English before the game title is selected.

### 4.4 Differentiators worth prototyping

- Restored territory reveals authored textures and environmental storytelling rather than flat player color alone.
- Teams can complete shared village shapes or seasonal community goals alongside individual scoring.
- Elena chooses a restoration plan before a match; Pip reacts and assists during the match.
- The end state becomes a keepsake card, village restoration entry, or shared family album page.
- Cooperative family rooms and private codes exist beside public competition.
- Players can communicate only through curated, localized Pip/Elena gestures and phrases; no unrestricted child chat.

Do not implement all differentiators in the first prototype. First prove that moving, risking, reconnecting, and restoring are satisfying.

## 5. Proposed progression architecture

### 5.1 Session loop

1. Choose Pip/Elena loadout and a clearly explained companion ability.
2. Enter a 2–3 minute match with one visible objective.
3. Restore territory, help or evade others, and collect match materials.
4. End with a readable result: contribution, brave-return streak, teamwork, and restored scene progress.
5. Apply progress immediately; never make a failed match feel erased.
6. Offer one calm next action: play again, inspect the restoration, or return home.

### 5.2 Meta loop

`matches -> restoration progress -> completed village place -> story/keepsake/outfit unlock -> new tactical option -> next place`

Recommended layers:

- **Journey:** authored Sunny Spoon locations with persistent restoration percentages.
- **Friendship:** character stories unlocked by meaningful play milestones, not purchases alone.
- **Collection:** outfits, trails, home scenes, emotes, keepsakes, and companion tools.
- **Mastery:** non-purchasable achievements for skill, restraint, rescue, defense, and teamwork.
- **Season:** time-bounded theme with permanent access to earned story/collection items after the season.
- **Family goals:** optional shared progress among linked family members without exposing child identity.

### 5.3 Failure policy

- Every legitimate match grants some journey progress, subject to anti-idle checks.
- Skill rewards and victory rewards remain meaningfully larger.
- No negative currency balance, destroyed paid item, or paid recovery after defeat.
- A loss response names what happened in one gentle line and offers an actionable observation.
- Do not infantilize the player or have Pip deliver a long lecture.

## 6. Monetization and strengthening policy

The owner direction is no advertising and purchasable items that can be strengthened. That can work only with explicit competitive safeguards.

### 6.1 Allowed product categories

- Pip and Elena outfits that preserve character identity.
- Trail and territory presentation themes.
- Home/village decoration sets.
- Emotes, arrival animations, and keepsake frames.
- Companion tools and abilities that can be upgraded for solo, cooperative, adventure, and clearly labeled unranked modes.
- One-time supporter/family packs with transparent contents.
- Direct-purchase currency bundles only if every price and conversion is plainly visible.

### 6.2 Mode rules

| Mode | Purchased/upgraded power |
| --- | --- |
| Ranked public competition | Normalized or disabled; spending cannot buy rank |
| Standard public family match | Prefer normalization; any variation must be narrow and match-visible |
| Private family room | Host-selectable equalized or collection-enabled rules |
| Cooperative/PvE restoration | Full owned upgrades allowed |
| Solo practice/bot adventure | Full owned upgrades allowed |

This preserves the requested strengthening fantasy without turning a family competition into pay-to-win.

### 6.3 Ability design contract

- Every ability has a visible charge, clear active duration, readable counterplay, and plain-language description.
- No purchased ability may create invulnerability without a telegraph and short limit.
- Upgrade steps change one understandable dimension at a time: cooldown, duration, radius, or utility.
- Never sell hidden accuracy, matchmaking advantage, opponent weakening, or undocumented probability.
- A free route must unlock tactically complete starter abilities.
- Balance changes must preserve purchased item utility or offer a fair migration/refund policy where required.

### 6.4 Currency decision deferred

Pip's Picture Pantry uses one Spoon currency. That is a product-specific economy, not an automatic franchise rule.

Before naming currencies for the new game, model:

- earned match currency;
- premium purchased currency, if any;
- direct-price purchases as a simpler alternative;
- upgrade costs and time to obtain through play;
- family account and child-purchase controls;
- refund, restore, duplicate transaction, and server receipt validation.

No randomized paid reward is approved at this stage.

## 7. Family and online safety contract

- No open text or voice chat for the initial release.
- Curated emotes cannot contain insults, romantic solicitation, personal information, or coercion.
- Display names use filters, reporting, rate limits, and child-safe defaults; generated names are preferred.
- Private rooms use revocable invite codes and do not reveal precise location, age, email, or platform account.
- Block, mute, report, moderation review, and evidence retention must exist before public matchmaking.
- Bots are labeled in internal telemetry and never marketed as human opponents.
- Matchmaking must account for latency, skill, party composition, and ability-rule set.
- Purchases require platform confirmation; parental controls and restore-purchase behavior must be tested.
- Privacy and age-rating review are launch gates, not store-form cleanup after development.

## 8. Franchise artwork inheritance contract

The new project inherits `CHARACTER_IP_BIBLE.md` and `ART_DIRECTION.md` as authoritative baselines.

### 8.1 Character continuity

- Pip retains the rounded warm-brown capybara silhouette, cream chef hat, muted red scarf, small facial features, blush, warm outline, and quiet helper energy.
- Elena retains the side-part bob, heart clip, mint work apron, sketchbook/design identity, and decision-making agency.
- Outfit variants may change costumes and accessories, but not species, age, face, silhouette, or core identity anchors.
- Pip appears in every player-facing home/seasonal scene through theme-integrated artwork, never as an unrelated sticker.
- New competitive poses require approved turnarounds, movement silhouettes, trail-running poses, hit/recovery expressions, and small-size readability checks.

### 8.2 Quality floor

- Target one premium illustrated product, not a mix of polished key art, generic generated icons, and placeholder UI.
- Gameplay readability outranks decorative density.
- Active trails, danger, safe territory, opponents, abilities, and objectives must remain distinguishable for color-vision differences and small devices.
- Never bake UI, currency, buttons, player names, or navigation into scene artwork.
- Controls are at least 44px and safe areas are measured on narrow phones and tablets.
- Raster art requires provenance, license/creator records, asset ID, dimensions, alpha/background status, intended surface, and human visual approval.
- Generated art is a candidate, not an approved asset. It must pass character continuity, similarity, anatomy, small-size, and scene-lighting review.
- Reuse requires honest perspective, lighting, scale, and narrative fit. A mismatched asset is worse than a temporary neutral placeholder.

### 8.3 New-project art gate

Before production content:

1. Approve Pip and Elena real-time-game turnarounds.
2. Approve movement, trail, restoration, danger, victory, and recovery pose sheets.
3. Approve one map visual language and one UI material system.
4. Verify gameplay silhouettes without facial detail.
5. Verify all critical states in grayscale and common color-vision simulations.
6. Verify at 360x740, 390x844, 430x932, and a representative tablet landscape/portrait set.
7. Record approved assets in a runtime manifest and enforce 1:1 registry checks.

## 9. Dialogue and narrative inheritance contract

### 9.1 Voice hierarchy

- Elena makes plans, asks practical questions, notices details, and makes meaningful choices.
- Pip communicates mainly through short sounds, signs, gestures, reactions, and very limited full sentences.
- Aunt Mina creates room for choice and names real needs; she is not a tutorial machine.
- Friends reveal preferences, relationships, worries, promises, memories, or aspirations when they return.

### 9.2 Match writing

- No dialogue covers the active playfield or interrupts a dangerous excursion.
- Pre-match dialogue is one emotional premise plus one objective.
- In-match lines are short, optional, localized, and never required to understand danger.
- Post-match dialogue is one reaction and one next-facing thought, not a reward ledger spoken aloud.
- Rules use UI language; characters provide motivation, observation, and warmth.
- A defeat line never shames, mocks, or pressures a purchase.

### 9.3 Conversation state

- Story messages unlock only after their actual trigger; future conversations are not open from the start.
- The inbox archives unlocked developer letters, character conversations, seasonal notices, and replayable guidance with explicit unlock metadata.
- Read/unread state, replayability, localization, and version compatibility are part of the data contract.
- Every new conversation declares speaker, trigger, chronology, required prior events, artwork, Korean/English text, and archive behavior.

## 10. Real-time technical foundation

### 10.1 Authority

- Public matches use a server-authoritative simulation for movement constraints, trail collision, captures, eliminations, rewards, and ability activation.
- Clients send timestamped inputs, not trusted positions, territory, currency, or results.
- Client prediction may improve local responsiveness; server reconciliation remains final.
- Remote movement uses interpolation with a defined latency budget and recovery behavior.

### 10.2 Match service boundaries

- Identity/profile service
- Party/private-room service
- Matchmaking queue
- Authoritative room simulation
- Progression/economy service
- Purchase receipt validation
- Moderation/reporting service
- Analytics and operational telemetry

Do not begin with all services separated. A modular monolith plus isolated match workers is sufficient for the prototype, provided authority boundaries are preserved.

### 10.3 Prototype stages

1. Deterministic offline movement, trail, reconnection, capture, and collision simulation.
2. One human plus five bots; prove fun and readability before commerce.
3. Local/network two-client authoritative room with simulated latency and packet loss.
4. Six-player private room, reconnect, spectator-safe end state, and bot substitution.
5. Public matchmaking, moderation, progression, and server-validated rewards.
6. Store sandbox purchases, receipts, refunds, restore, and economy abuse tests.
7. Load, soak, regional latency, failure recovery, and live-operations rehearsal.

## 11. Analytics without manipulative design

Measure:

- tutorial completion and first successful reconnection;
- time to understand trail vulnerability;
- match duration and restart interval;
- elimination cause and perceived fairness survey;
- territory risk size and retreat behavior;
- solo, family, cooperative, and public-mode preference;
- day-1/day-7 return by earned progression—not only purchase exposure;
- ability pick/win rates across free and paid acquisition paths;
- child-safe report frequency and moderation response time;
- performance, latency, disconnect, battery, and crash rates.

Do not optimize solely for session count, store visits, loss-triggered purchases, or notification opens.

## 12. Cascading project bootstrap rules

When the new repository is created, copy or adapt these documents before feature work:

- `CHARACTER_IP_BIBLE.md`
- `ART_DIRECTION.md`
- this foundation document
- `CONTENT_CHANGE_IMPACT_CHECKLIST.md`
- `VERIFICATION_PROTOCOL.md`

Create new project-specific documents for:

- game rules and deterministic simulation;
- networking authority and protocol versioning;
- progression/economy model;
- family safety and moderation;
- art manifest and asset provenance;
- Korean/English terminology and character voice;
- live-operations/event policy;
- store purchases and receipt validation;
- release identity and signed artifact gates.

Every major change must trace this impact graph:

`game rule -> simulation -> network protocol -> bot behavior -> matchmaking -> progression -> economy -> artwork -> dialogue/i18n -> save/account migration -> analytics -> QA -> store/release`

## 13. First vertical slice recommendation

Build only enough to answer whether the Sunny Spoon interpretation is genuinely fun:

- portrait mobile arena;
- Elena as the player and Pip as the companion;
- one garden/storybook map;
- one movement gesture;
- one safe zone and exposed ribbon/brush trail;
- deterministic capture and trail break;
- five clearly labeled bots;
- one 2-minute objective;
- persistent restoration percentage across attempts;
- one earned cosmetic and two prototype abilities, all freely selectable;
- no shop, ads, account, season, or public matchmaking yet;
- performance target of stable 60fps on agreed minimum devices.

Exit criteria:

- new players understand safe territory, danger, and reconnection without a long tutorial;
- a failed match still creates a desire to retry;
- Pip and Elena feel essential rather than reskinned decoration;
- the playfield remains readable over premium artwork;
- deterministic replays reproduce captures and collisions;
- the team can articulate at least three original reasons to choose this game beyond “Paper.io without ads.”

## 14. Open owner decisions before repository creation

- Final product fantasy: garden restoration, storybook coloring, village rebuilding, fabric stitching, or another original verb.
- Primary mode at launch: solo/bots, cooperative family, private multiplayer, or public competition.
- Match size and duration target.
- Whether Elena or Pip is directly controlled, and how the other participates.
- Upgrade scope in unranked public matches.
- Account/guest/family-link model.
- Minimum supported devices and regions.
- Art production budget and approval workflow.
- Backend monthly budget and acceptable regional latency.
- Direct purchases versus premium currency.
- Whether the initial release contains public matchmaking at all.

## 15. Research sources

- [Paper.io 2 — Apple App Store](https://apps.apple.com/us/app/paper-io-2/id1423046460)
- [Paper.io 2 official product page](https://voodoo.io/paper2)
- [Basic rules — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000095752-what-are-the-basic-rules-of-paper-io-2-)
- [Country progression — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000095753-how-to-progress-in-paper-io-2-)
- [Skin acquisition — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000102993-what-are-character-powers-)
- [Character powers — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000102994-how-do-i-activate-character-power-)
- [Power list and upgrades — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000102996-character-powers-what-they-do-and-how-upgrades-work)
- [No Ads behavior — official Paper.io 2 support](https://paper2-help.freshdesk.com/support/solutions/articles/202000071538-why-do-i-still-see-videos-after-purchasing-no-ads-)
