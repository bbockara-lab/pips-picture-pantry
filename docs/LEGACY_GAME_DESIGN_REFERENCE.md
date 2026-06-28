# Elena's Cozy Village - Game Design Notes

## Purpose
This document defines the story, motivation, mission structure, and learning design for Elena's Cozy Village. It should guide future development before adding more mechanics.

The game should not feel like a worksheet with decoration. Elena should solve small story events inside the restaurant, and English vocabulary or math should appear as the natural tool needed to move the story forward.

The product direction has expanded beyond a single-child custom game. Elena remains the main character in the world, but the app should support multiple child profiles and adapt learning content by grade, reading level, math readiness, and parent-selected focus.

The current product direction is now anchored in `PRODUCT_DIRECTION.md`: Elena's Cozy Village should become a cozy life simulation first, with learning quietly embedded inside world, character, relationship, collection, and Dream Studio progression.

Target structure:

World -> Characters -> Relationships -> Collection -> Learning

This means the game should be remembered for Pip, friendships, memories, Dream Studio, village life, and cozy atmosphere before it is remembered as an educational app.

## Core Fantasy
Elena is a curious young helper who loves cooking, clothes, cozy rooms, and making things beautiful. She is not "working at a restaurant" because adults told her to work. She is helping revive a small family cafe in a warm village.

The cafe used to be a lively place where neighbors gathered after school, shared recipes, told stories, and celebrated birthdays. Recently, the cafe has become quiet because the recipe book was damaged, supplies are mixed up, and the rooms feel old and empty.

Elena finds out that the cafe can become bright again if she helps one day at a time. She is joined by a gentle capybara helper who turns the cafe into a warmer, funnier, more memorable place.

The long-term fantasy should grow beyond serving cafe orders. Players should feel that they are visiting a small village, checking on familiar people, collecting warm memories, and slowly helping Elena build the Dream Studio she imagines.

## Visual Direction
The strongest current reference direction is **PlateUp Lite**:
- Top-down or 2.5D restaurant layout.
- A visible kitchen workflow with counters, appliances, tables, customers, and small moving characters.
- Days/episodes built around serving customers and improving the restaurant.
- Between episodes, the player upgrades layout, decorations, recipes, or tools.

The game should not copy PlateUp directly, but can borrow the readable restaurant layout and busy-but-cute kitchen energy. Elena's version should be softer, more story-driven, and less stressful.

Secondary influences:
- **Good Pizza, Great Pizza:** customer dialogue and personality-driven orders.
- **Cooking Mama:** short cooking actions as mini tasks.
- **Venba:** food as story and memory.
- **Stardew Valley:** long-term relationships and cozy progression.

### Originality Direction
The current prototype uses a top-down kitchen because it is readable and fast to validate. Before release, the game must develop its own visual identity and reduce resemblance to any specific reference game.

The long-term visual identity should be:

**Sunny Spoon storybook kitchen + Elena's Dream Studio sketchbook, not a generic restaurant simulator.**

Distinctive pillars:
- Storybook warmth: hand-drawn labels, rounded imperfect furniture, recipe-card textures, sticker-book rewards, and soft character acting.
- Elena's taste: outfit/decor choices, cozy room planning, color and pattern play, Dream Studio sketches.
- Pip as a visual anchor: Pip carries cards, points, reacts, wears accessories, and becomes a mascot unique to this game.
- Learning objects as props: vocabulary cards, measuring ribbons, coin trays, timer tickets, shelf labels, recipe stickers, and sketchbook pages.
- Cafe-to-studio progression: the world should gradually feel less like a fixed restaurant grid and more like Elena rebuilding a cozy creative place.
- Character-first warmth: recurring characters should be more memorable than the kitchen system. The child should remember Pip, Elena, Aunt Mina, and regular customers as much as the tasks.

Design changes to reduce reference-game similarity:
- Avoid copying kitchen layout proportions, station placement, UI framing, customer rhythm, or upgrade flow from any specific game.
- Move away from purely rectangular counter-grid readability toward storybook zones: recipe corner, warm stove nook, shelf wall, serving table, cozy customer bench, and Dream Studio board.
- Replace generic top-down station icons with original illustrated props.
- Use scene beats, speech bubbles, stickers, and sketchbook transitions instead of a restaurant-management interface rhythm.
- Develop original character silhouettes and animation language for Elena, Pip, Aunt Mina, and customers.

Reference games can inform broad genre patterns, but final assets, layout, UI, progression, and interaction feel must be original.

### Character-First Identity
The strongest originality opportunity is character presence. Many restaurant-management references focus on systems, stations, and efficiency. Elena's Cozy Village should focus more on companionship, character reactions, and relationships.

Principle:

**The game should feel like helping familiar friends in a cozy place, not optimizing a restaurant grid.**

Character priorities:
- Pip should be a constant visual companion, not a small decorative pet.
- Elena should show curiosity, confidence, confusion, and pride through short animations and expressions.
- Aunt Mina should feel like a warm mentor, not only an instruction giver.
- Regular customers should have names, preferences, small emotional needs, and return over time.
- Character reactions should explain success and failure before long text does.
- Outfits and accessories should be character expression, not only cosmetic rewards.

Pip-specific design:
- Pip carries recipe cards, timer cards, shelf labels, and sticker rewards.
- Pip points, sniffs, nods, hides, celebrates, or gently worries.
- Pip can wear tiny accessories earned through story progress.
- Pip should be visually recognizable in screenshots and app icons.
- Pip should create a unique emotional rhythm: calm, funny, helpful, and loyal.

Future character systems:
- Character preference notes.
- Thank-you cards or memory cards from regular customers.
- Small character-specific keepsakes after relationship note milestones.
- Pip accessory collection.
- Elena outfit themes tied to story chapters.
- Short recurring character arcs, such as Lily's tea party, Mr. Park's clock mix-up, or Aunt Mina's recipe memories.

Future player social systems:
- Friend adding, visiting, gifting, shared albums, or cooperative events should be treated as later parent-managed online features, not v1.0 local-only features.
- If added, social interactions should work across iOS and Android through a shared backend identity model rather than platform-specific friend systems.
- Child safety comes first: no open chat, no public search by child personal information, no public leaderboards, and no child-to-child contact without parent-controlled limits.
- Prefer low-risk cozy interactions such as sending a sticker, visiting a Dream Studio snapshot, sharing a recipe card, or exchanging a preset thank-you note.
- Learning progress can become the main positive competition loop: weekly practice streaks, chapter progress, memory notes collected, skill garden growth, Dream Studio ideas earned, or review missions cleared.
- Platform-native systems such as Apple Game Center or Google Play Games can be used for sign-in, achievements, or platform leaderboards, but the in-game friend/progress model should remain portable across platforms.
- Progress comparison should feel encouraging, not shaming: show nearby friends, personal bests, gentle milestones, and cooperative celebration rather than aggressive ranks for children.

## Child Interface Direction
The interface should be designed for children who may be early readers, English learners, or easily tired by text-heavy screens.

Core principle:

**The child should understand the next action from the scene, character poses, icons, and motion before relying on a full sentence.**

Use icons and visual symbols generously:
- Cooking station icons for stove, freezer, cutting board, oven, sink, shelf, timer, and serving counter.
- Subject icons for reading, math, vocabulary, time, money, measurement, and fractions.
- Reward icons for coins, stickers, story stars, decor, outfits, and Dream Studio ideas.
- Emotion icons or character expressions for help, surprise, success, confusion, and celebration.
- Visual word cards that pair a word with a small picture cue.

Text should support the action, not carry the whole interface. A child should not feel like they are reading a messenger thread or completing a worksheet inside a panel.

### Screen Transition Rule
Scene transitions should be used deliberately to keep attention moving.

Prefer:
- A character walks over or pops into the kitchen scene before dialogue starts.
- Dialogue appears as a speech bubble anchored to the speaking character.
- The kitchen continues animating behind the conversation: steam, customers waiting, food cooking, Pip carrying a card.
- After a short dialogue beat, the camera or focus shifts to the station, recipe card, timer, shelf, or customer involved.
- The player acts directly on the scene when possible.
- Feedback happens in the world: the pot bubbles, the timer dings, the shelf label changes, or a customer receives food.

Avoid:
- Long static panels of text.
- Mission prompts that feel like a chat or form.
- Repeated screen states where only the words change.
- Abstract answer buttons without icons, pictures, station art, or character reaction.

### Dialogue Presentation
Dialogue should feel like part of the cafe world.

Good pattern:
1. Character enters or gestures.
2. Speech bubble gives one short line.
3. Pip or the scene shows an icon/picture clue.
4. The target object highlights.
5. Player taps/drags/chooses in the scene.
6. A brief explanation appears after the action.

The current mission panel is useful for architecture, but it should gradually become a support layer rather than the primary child-facing experience.

## Audio Direction
Audio should make the game feel calm, warm, and cozy rather than loud or stimulation-heavy.

The main purpose of background sound is atmosphere:
- A soft cafe/village loop that can sit behind play without demanding attention.
- Gentle environmental texture such as warm room tone, quiet cafe movement, soft kitchen ambience, or light village ambience.
- Episode-specific variations that remain calm: a brighter market layer, a quieter Dream Studio layer, and a softer review-mission layer.

Avoid:
- Aggressive arcade loops.
- Sudden loud stingers.
- Failure sounds that feel punishing.
- Busy music that competes with reading or parent-child conversation.

Implementation principles:
- Music and ambience should be optional and easy to turn off.
- Background audio should start only after a user gesture, respecting browser and mobile platform rules.
- Sound effects should stay small and warm: a soft chime for success, a gentle tap for choices, a quiet sticker/reward sparkle.
- Release audio must use original or clearly licensed assets.

The desired feeling is: Elena is spending time in a safe cozy place, not being pushed by a noisy game.

## Why Elena Helps
Elena's family visits a village cafe called Sunny Spoon Cafe. The owner, Aunt Mina, is kind but overwhelmed. Her old recipe book has missing words, the kitchen labels are confusing, and customers keep asking for special orders.

Elena notices that she can help because she is good at noticing details:
- She can read clues in recipes.
- She can match words to ingredients.
- She can count coins and measure time.
- She can decorate spaces so people feel welcome.

Elena is not an employee. She is a junior cafe helper and designer.

## Elena's Dream
Elena's dream is to open a beautiful little place of her own one day: half cafe, half dress-up studio, half cozy clubhouse. The game can call this dream:

**Elena's Dream Studio**

It is a place where she can:
- Cook cute dishes.
- Design outfits.
- Decorate rooms.
- Invite friends and neighbors.
- Collect stories from the people she helps.

Every mission at Sunny Spoon Cafe teaches Elena one thing she will need for her future dream studio.

### Dream Studio As Life Goal

Dream Studio should become the primary long-term progression system, not only a reward room.

The desired progression is:

Cafe -> Village -> Dream Studio

Long-term motivation should be:

"I want to improve my Dream Studio."

Dream Studio should eventually collect visible proof of the whole life-sim loop: room decor, furniture, outfits, recipes, village photos, friendship memories, seasonal displays, and Pip collection items.

## Opening Story Draft
A simple opening conversation can introduce the premise.

Scene: Outside Sunny Spoon Cafe, after school.

Aunt Mina:
"Oh no, the lunch rush is starting, but my recipe book got splashed with soup."

Elena:
"I can help. I know how to read clues."

Capybara:
"Pip!"

Aunt Mina:
"Really? Some recipes are missing words, and some orders need careful counting."

Elena:
"And Pip can carry the recipe cards. He's very serious."

Aunt Mina:
"Then I have the perfect helper team. For every order you solve, you earn cafe coins. Use them for outfits, room decorations, and your own Dream Studio plan."

First mission objective:
"Help Aunt Mina serve 3 starter orders before the clock runs out."

Reward explanation:
"Earn coins, recipe stickers, and story stars. Coins buy decor. Recipe stickers unlock new dishes. Story stars open the next day."

## Game Structure
The game should be organized into days. Each day has a small story problem, several kitchen events, and a reward moment.

## Expandable Story Architecture
The story should be designed as an expandable series from the beginning. New episodes should feel like natural parts of Elena's growth, not random extra missions.

The long-term structure has three layers:

1. **Daily Cafe Episodes**
   Small playable stories at Sunny Spoon Cafe. Each day has one local problem: a damaged recipe, a special customer, a busy rush, a missing supply, a birthday, a weather event, or a room that needs decorating.

2. **Character Relationship Arcs**
   Recurring characters return with new needs and small personal stories. Elena gradually learns their tastes, hobbies, worries, and dreams. This makes repeated cooking tasks feel like helping people she knows.

3. **Elena's Dream Studio Growth**
   Every episode gives Elena one idea, item, recipe, or skill for her future Dream Studio. The Dream Studio is the long-term reason that repeated missions matter.

### Narrative Spine
The full game can follow this spine:

**Elena helps Sunny Spoon Cafe become lively again while slowly discovering what kind of place she wants to create for herself.**

This spine allows new episodes to be added without breaking the story. A new episode only needs to answer:
- Who needs help today?
- What changed in the cafe or village?
- What skill does Elena practice?
- What does Elena learn for her Dream Studio?
- What visible reward changes the world?

### Episode Template
Every new episode should use the same expandable template:

1. **Hook**
   Something changes today. A person arrives, an object is missing, a recipe is damaged, the weather affects the cafe, or a room needs preparation.

2. **Emotional Reason**
   Elena cares because someone will feel happy, relieved, included, brave, or proud if she helps.

3. **Playable Problem**
   The player solves 3-6 small tasks through kitchen, decor, outfit, market, or conversation actions.

4. **Learning Hidden in Action**
   Vocabulary/math/reading is the tool needed to solve the event, not the visible reason for the event.

5. **Resolution**
   The character reacts. The cafe improves. Elena receives a memory, sticker, recipe, decor item, or clue.

6. **Dream Studio Link**
   Elena writes or sketches one idea for her own future place.

### Growth Tracks
Elena should grow in several parallel tracks. This makes level-up feel broader than just harder questions.

#### Cafe Helper Track
Elena becomes more capable in the cafe:
- Day 1: recipe helper.
- Day 3: order planner.
- Day 5: market helper.
- Day 8: event helper.
- Day 12: mini-manager for one busy rush.

#### Designer Track
Elena develops her taste:
- Chooses colors and room styles.
- Learns descriptive vocabulary.
- Unlocks furniture and outfit themes.
- Designs special table setups for story events.

#### Friend Track
Elena builds relationships:
- Learns regular customers' preferences.
- Helps classmates with little problems.
- Collects thank-you notes or memory cards.
- Unlocks character-specific recipes/decor.

#### Dream Studio Track
Elena's personal dream becomes clearer:
- Starts with a blank sketchbook.
- Adds a cafe corner.
- Adds a dress-up corner.
- Adds a reading/story corner.
- Adds a party/event corner.
- Eventually opens a tiny preview of Elena's Dream Studio.

### Chapter Structure
The game can be divided into chapters so future content has a home.

#### Chapter 1: Saving Sunny Spoon
Goal:
Make the cafe functional again.

Themes:
Recipes, timing, basic customer needs, first decorations.

Possible episodes:
- The Splashed Recipe Book.
- The After-School Rush.
- The Missing Market List.
- Birthday Table Trouble.

#### Chapter 2: The Village Gets Curious
Goal:
More people discover Elena's help.

Themes:
Recurring customers, preferences, clues, categories, more complex schedules.

Possible episodes:
- Snow Day Soup.
- Library Lunch Boxes.
- Lily's Outfit Tea Party.
- Mr. Park's Clock Mix-Up.

Current preview hook:
- v0.81 introduces Snow Day Soup as a planned Chapter 2 seed, unlocked conceptually after Elena completes the first Dream Studio plan. It is intentionally not playable yet; it exists to keep future story updates connected to Chapter 1 without breaking existing saves.
- Release plan note: Chapter 2 should not block the June 20 Chapter 1 App Store MVP target. The June 20 target is quality-gated, not a hard deadline; Chapter 1 should feel content-rich and polished before review submission. Chapter 2 should be prepared for the early-July follow-up, where App Store receives Chapter 2 as an update and Google Play can debut with Chapters 1 and 2 together.

#### Chapter 3: Elena's Style
Goal:
Elena starts shaping the cafe and her own identity.

Themes:
Decor choices, descriptive words, measurement, comparison, design requests.

Possible episodes:
- The Cozy Corner Contest.
- Apron Pattern Day.
- The Too-Big Rug.
- Color Words for Lily.

#### Chapter 4: Dream Studio Preview
Goal:
Elena begins turning a back room into her future studio.

Themes:
Planning, budgeting, multi-step tasks, story retelling, cause/effect.

Possible episodes:
- The Empty Back Room.
- Three Corners, One Room.
- The Grand Sketch Board.
- First Friends Preview Party.

### Why Repeated Tasks Stay Meaningful
Repeated mechanics should be recontextualized by story.

Same mechanic, different story meaning:
- Matching a word can repair a recipe, read a customer clue, label a shelf, or choose decor.
- Adding/subtracting can buy market supplies, split coins for decor, calculate change, or plan party treats.
- Telling time can bake muffins, schedule customers, open the cafe, or prepare before a friend arrives.
- Fractions can cut sandwiches, divide cake, share fruit, or measure fabric patterns.

This means the player may practice the same academic skill, but the story event should feel different.

### Episode Expansion Rules
When adding a future episode, follow these rules:

- Do not add an episode only because we need more problems.
- Every episode must change at least one of these: a relationship, the cafe, Elena's Dream Studio, or Elena's confidence.
- Every episode should unlock or foreshadow something.
- At least one line of dialogue should show Elena's personality.
- At least one reward should be visible in the world or collection.
- New mechanics should be introduced through a story need.
- If a task repeats, change the context, character, or emotional reason.

### Live Content Expansion Rule
Post-release updates should feel like Elena's world naturally growing, not like unrelated content attached after launch.

Rules for future app updates:
- Preserve the existing chapter spine. New stories should continue from known relationships, cafe changes, Dream Studio progress, or village events.
- Add content through expandable containers: new daily episodes, character relationship arcs, seasonal village events, Dream Studio goals, or review missions.
- Do not rewrite completed story events unless a migration path preserves the player's memories, stickers, keepsakes, and chapter completion state.
- New characters should enter through a reason inside Sunny Spoon Cafe or the village, then become reusable in later episodes.
- New mechanics should be introduced by a character need before they become repeated practice.
- Event updates should leave a durable trace, such as a memory note, recipe sticker, decor item, outfit/accessory, or Dream Studio idea.
- Content packs should declare where they sit in the timeline: after a specific day, after a chapter, as a seasonal side event, or as optional review content.
- Future Korean-learning or English-learning variants should respect the same story position but may use different mission content when vocabulary or reading skills require it.

Implementation implication:
- Treat `chapters`, `episodes`, `missions`, `milestones`, `customerProfiles`, `relationshipRewards`, and future event packs as appendable data layers.
- Save data should remain forward-compatible: older players should keep completed episodes, collected memories, earned keepsakes, and placed Dream Studio stickers when new content ships.
- App updates should include a content-integrity check so new episode IDs, prerequisite rules, rewards, and relationship notes cannot break the existing Chapter 1 path.

### Story Seeds Backlog
These are expandable episode ideas that can be developed later.

- **Snow Day Soup:** Customers are cold after playing outside. Elena learns warm/cool vocabulary and elapsed time. v0.81 tracks this as the first planned Chapter 2 preview seed after the Dream Studio board reveal.
- **The Lost Lunchbox:** A classmate forgot which lunch is hers. Elena uses descriptive clues and categories.
- **Lily's Dress-Up Tea Party:** Lily wants a table and outfit theme. Elena practices adjectives and color/category words.
- **Mr. Park's Clock Mix-Up:** Mr. Park reads the wrong time. Elena uses analog clock clues.
- **Market Morning:** Aunt Mina has a budget. Elena chooses ingredients without overspending.
- **The Cracked Cupcake Recipe:** Compound words are split apart in the recipe book.
- **Four Friends, One Cake:** Fractions appear as fair sharing at a birthday.
- **The Cozy Corner Contest:** Elena decorates a reading corner using measurement and comparison.
- **Rainy Day Delivery:** Elena sequences steps and reads map/direction words.
- **Dream Studio Sketch Night:** Elena reviews what she learned and chooses the next room goal.

### Long-Term Save Data Implication
The save file should eventually track story progress, not only coins.

Future save fields:
- Current chapter.
- Current episode.
- Completed episodes.
- Known characters.
- Character preference notes.
- Recipe stickers.
- Dream Studio milestones.
- Decor unlocks.
- Learned vocabulary by story context.

### Day Loop
1. Story intro: a character explains today's problem.
2. Prep phase: Elena checks ingredients, recipe cards, or customer requests.
3. Service phase: player completes 3-6 short tasks.
4. Story resolution: customer or Aunt Mina reacts.
5. Reward phase: coins, recipe sticker, decor unlock, or outfit unlock.
6. Dream Studio update: Elena uses rewards to improve her future studio.

## Mission Types
Learning should be embedded into actions instead of appearing only as direct questions.

### Vocabulary as Recipe Repair
Problem:
The recipe card says "simmer," "whisk," or "slice," but the picture clue is missing.

Player action:
Choose the correct station or ingredient action.

Learning:
Vocabulary meaning, categories, multiple-meaning words.

Example:
Customer wants tomato soup. Recipe says "simmer until warm."
Player must move the pot to the low-heat stove, not the cutting board.

### Math as Kitchen Timing
Problem:
Food needs to be ready at a certain time.

Player action:
Set a timer, choose which order to start first, or add minutes.

Learning:
Telling time, elapsed time, quarter hour, half hour.

Example:
Muffins start at 3:15 and bake for 15 minutes. Player sets pickup time to 3:30.

### Math as Coins and Supplies
Problem:
Elena has a budget for ingredients or decor.

Player action:
Buy the right supplies without overspending.

Learning:
Addition, subtraction, comparison, money reasoning.

Example:
Tomatoes cost 8 coins, bread costs 6 coins, and Elena has 20 coins. She must keep enough coins for eggs.

### Fractions as Serving and Sharing
Problem:
Customers ask for portions.

Player action:
Cut, divide, or plate food correctly.

Learning:
Halves, thirds, fourths, equal parts.

Example:
Cut one pie into fourths and serve one fourth to each of four friends.

### Reading Comprehension as Customer Clues
Problem:
Customer gives a short request with details.

Player action:
Identify main detail, sequence, or cause-effect.

Learning:
Main idea, details, author's purpose, cause and effect.

Example:
"I need something warm because I played outside in the snow." Player infers soup or tea.

## Scene-Based Story Plan

### Scene 1: The Splashed Recipe Book
Story purpose:
Introduce Aunt Mina, Sunny Spoon Cafe, Elena's helper role, and rewards.

Learning focus:
Basic cooking vocabulary and one time question.

Game events:
- Repair three recipe cards by matching words to actions.
- Serve three simple customers.
- Earn first recipe sticker: Tomato Soup.

Reward:
Unlock the back room and one free decor item.

### Scene 2: The After-School Rush
Story purpose:
Elena learns that customers have different needs.

Learning focus:
Word categories and elapsed time.

Game events:
- Group ingredients by category.
- Decide which food should start first based on cooking time.
- Serve customers before patience runs out.

Reward:
Unlock a chef hat color and more cafe coins.

### Scene 3: The Missing Market List
Story purpose:
The cafe needs supplies, but the shopping list has missing words.

Learning focus:
Vocabulary, compound words, money math.

Game events:
- Complete market list words.
- Buy ingredients under budget.
- Bring back enough supplies for the day.

Reward:
Unlock market shelf decoration.

### Scene 4: Birthday Table Trouble
Story purpose:
A child customer has a birthday, and Elena wants to make it special.

Learning focus:
Fractions and story details.

Game events:
- Divide cake into equal portions.
- Read guest clues for favorite toppings.
- Decorate birthday table.

Reward:
Unlock party lights and a cupcake recipe sticker.

### Scene 5: Dream Studio Sketch
Story purpose:
Elena starts drawing her own future studio.

Learning focus:
Measurement, comparison, descriptive vocabulary.

Game events:
- Choose furniture that fits a room.
- Measure rug and table sizes.
- Pick adjectives that match design requests.

Reward:
Unlock Dream Studio preview board.

## Reward System

### Coins
Short-term reward used to buy:
- Outfits.
- Room colors.
- Furniture.
- Kitchen tools.
- Decorative items.

### Recipe Stickers
Collection reward used to show progress:
- Tomato Soup.
- Sunny Toast.
- Muffins.
- Fruit Salad.
- Cupcakes.
- Bento Lunch.

### Story Stars
Progress reward used to unlock:
- Next day.
- New character.
- New room.
- Dream Studio milestone.

### Friend Keepsakes
Relationship reward used to show close-friend progress:
- A recurring friend gives a small character-specific keepsake after Elena collects three thank-you notes from them.
- Keepsakes should stay tiny and album-like, such as a badge, ribbon, pin, clip, leaf, or party star.
- The reward should appear in the Memory Album and be mentioned in the new-note callout when it is earned.
- Small keepsake UI should continue using the dedicated headshot atlas for character faces rather than full-body sticker crops.

### Decor Unlocks
Emotional reward:
The restaurant and Elena's Dream Studio should visibly improve. The player should feel, "I made this place better."

## Characters
Cross-media character continuity is defined in `CHARACTER_IP_BIBLE.md` and implemented in `src/data/characterIdentity.js`. The in-game Lookbook must use that shared data so visual cues, roles, voice rules, and identity guardrails do not drift independently between chapters.

### Elena
Curious, stylish, detail-oriented, kind, and persistent. She likes making places pretty and helping people feel welcome.

### Pip the Capybara
Elena's capybara companion and cafe helper. Pip is calm, round, loyal, and quietly funny. He does not speak in full sentences most of the time, but he reacts with expressive sounds, signs, and body language.

Possible name options:
- Pip
- Mochi
- Bori
- Nori
- Coco

Recommended starting name:
**Pip**

Role in the story:
- Pip came with Elena to the cafe and immediately found the warmest spot near the kitchen.
- Aunt Mina lets Pip stay because he is gentle and surprisingly helpful.
- Pip becomes the mascot of Sunny Spoon Cafe.
- Children and customers return partly because they want to see Pip.

Role in gameplay:
- Carries small recipe cards or order tickets.
- Points toward a station when Elena needs a hint.
- Sniffs ingredients to help category sorting.
- Holds a timer sign for time problems.
- Wears unlockable tiny accessories.
- Reacts emotionally to correct/incorrect actions.
- Can fetch a customer preference note from the notebook.

Learning role:
Pip should not simply give answers. He should give clues:
- For vocabulary, Pip can show a picture clue or gesture.
- For math, Pip can hold blocks, coins, or timer cards.
- For reading, Pip can highlight an important word in a customer's request.
- For fractions, Pip can sit beside the plate and show equal parts with paw cards.

Reward role:
Pip can receive:
- Hats.
- Bow ties.
- Tiny aprons.
- Bed/cushion upgrades.
- Snack treats.
- Mascot badges.

Emotional role:
Pip gives the game warmth and continuity. Even if the episode changes, Pip is the player's constant companion. He can also make repeated practice feel less like work because his reactions create small moments of delight.

Design rules for Pip:
- Keep him pet-like, not a talking adult.
- Use short sounds, signs, and gestures.
- Avoid making him too silly or disruptive.
- Let Elena remain the main character.
- Use Pip as a helper, mascot, and emotional anchor.

### Aunt Mina
Cafe owner and mentor. Warm, a little overwhelmed, but encouraging. She explains missions without sounding like a teacher.

### Mr. Park
Regular customer who loves soup and gives time-based requests.

### Lily
Another second-grade child who likes cute outfits and gives fashion/decor requests.

### Chef Berry
A playful imaginary mascot in Elena's recipe book. Can explain vocabulary through pictures and short jokes.

## Design Rule: Learning Hidden in Action
Avoid:
- A large quiz panel as the main interaction.
- "What is the answer?" as the default pattern.
- Too many abstract multiple-choice questions.
- Text-only mission cards that feel like messenger tasks.

Prefer:
- Customer asks for something.
- Recipe has a missing clue.
- Player chooses the station, ingredient, timer, portion, or decor.
- Feedback explains the concept briefly after the action.
- Icons, speech bubbles, character animation, and object highlights guide the action before text explanation.

## Strategic Direction: Cozy Story Game With A Hidden Education Engine
The product should now move toward a cozy life simulation identity, while keeping the education architecture as the hidden engine underneath the world.

Target presentation balance:
- 90% cozy world, characters, relationships, collection, and Dream Studio motivation.
- 10% visible education.

Internal product balance:
- 60% education engine.
- 40% cozy systems.

The player should remember Pip, Sunny Spoon Cafe, recurring friends, memory cards, thank-you notes, and Dream Studio more strongly than XP, coins, skill labels, or curriculum metadata.

Target emotional loop:
- Help someone.
- Move the story forward.
- Grow a relationship.
- Receive an emotional reward.
- Improve Dream Studio or the village.

Vocabulary, math, reading, and reasoning remain present as tools used to solve meaningful events.

Feature validation test:
- Does this make the world feel more alive?
- Does this strengthen a character?
- Does this create a memory?
- Does this improve Dream Studio?
- Would a cozy game player enjoy this even if there were no educational rewards attached?

If the answer is no, reconsider the feature before adding it.

Current cozy activity baseline:
- v0.87 introduces `Pip Care Corner` in Pip's Practice Basket as the first non-lesson cozy interaction. It tracks small Pip affection and care visits without awarding curriculum XP or special learning currency.
- v0.88 adds care badges so Pip's cozy interaction has a tiny collectible arc without becoming a lesson reward.
- v0.89 adds `Cozy Collection Shelf` so collection-minded players can see Dream Studio, Memory Album, Close Friends, Pip Badges, and Village Days without opening the parent learning-progress details.
- v0.90 adds a content-language guard so bilingual story-support text can begin without turning learning prompts, vocabulary answers, or word-category logic into direct translations.

## Design Rule: Interface Language vs Learning Language
The app should support English and Korean UI switching, but learning content must not be handled as blind translation.

Use two related concepts:
- Interface language: navigation, buttons, parent settings, system feedback, and non-learning shell text.
- Learning language: the language being practiced by the mission content.

Reason:
- Math and many story-support lines can often be translated safely.
- Vocabulary, word-category, compound-word, phonics, reading-comprehension, and clue-based tasks may need separate Korean-learning or English-learning versions.
- A direct translation can make a correct answer wrong, too easy, too hard, or educationally meaningless.

Implementation rule:
- UI shell can use shared `i18n` strings.
- Mission content should eventually support language-specific variants such as `content.en`, `content.ko`, or separate mission packs.
- Early bilingual work should start with safe UI text and story-support text, then add designed learning variants per skill.
- Current runtime rule: `content.en` / `content.ko` may provide scene lines and request-card support copy, but prompts, choices, clues, and answer keys remain English-learning content until a mission declares a designed learning-language variant.
- Locale QA must include text-length and layout checks because Korean and English wrap differently.
- The saved profile should store the target learning language separately from the interface locale so Korean UI can still run English practice, and future English UI can run Korean practice.
- Vocabulary missions must declare their supported learning languages before they are shown in a non-English practice mode.
- Current product direction: the player should choose the language path at the beginning of a new game as part of the story setup. The language path should be locked during a run and changeable only after Reset.
- The first language-path guide should be in English so parents and learners understand the decision before the app shifts into the chosen language.

## Design Rule: Interface Boundary Contract
Every persistent interface region should have a clear layout boundary before new features are added to it.

Rules:
- Header/HUD areas should use bounded columns or stacked mobile flow, not content-sized rails that move when a new menu, badge, or language label is added.
- Cards, tabs, buttons, badges, and panels should keep `min-width: 0`, wrapping, max-width, or scroll behavior where long English/Korean text can appear.
- Fixed or absolute UI regions need explicit safe-area and viewport constraints. If content can grow, the region should scroll internally or move into normal document flow on small screens.
- New feature work that adds header controls, tabs, card text, reward rows, or modal sections should update layout QA expectations at the same time.
- Visual polish is not complete until the element still respects its parent boundary after the longest expected label, Korean UI text, and future reward/content states are considered.

## Design Rule: Warm 2D Volume
The visual target is not full 3D, but the game should not feel flat. Even simple buttons, tickets, stickers, and cards should carry a small sense of light, shadow, thickness, and touch.

Rules:
- Use warm highlights and soft shadows to give important UI surfaces volume, especially buttons, answer choices, reward cards, tickets, and sticker-like elements.
- Prefer tactile 2D depth: top light, gentle inner shade, soft drop shadow, and a small pressed state.
- Avoid harsh black shadows, plastic gloss, heavy bevels, or realistic 3D rendering that fights the cozy sticker style.
- Repeated UI elements should share volume tokens so the whole game feels intentionally made rather than assembled from unrelated flat shapes.
- A single button shown by itself should still feel cute, warm, and touchable.

## Design Rule: Scene-First Request Beats
Early missions should begin from a character need or visible object problem before they become a formal learning prompt.

Rules:
- The first screen beat should answer: who needs help, what changed in the scene, and what the player should look at.
- The right-side ticket may still carry the exact learning prompt, but it should be preceded by a short request card or scene cue when the mission starts.
- Day 1 is the priority because it teaches the player what kind of game this is.
- Scene-first request beats should stay short, concrete, and tied to Canvas focus points such as stove, timer, shelf, counter, coins, or recipe book.
- Future language variants may localize or redesign request beats separately from vocabulary answer logic.

Immediate UX priorities:
- Make navigation feel like visiting places.
- Surface Dream Studio progress early and often.
- Lead rewards with memories, stickers, character reactions, and studio ideas.
- Keep growth XP and mastery available for parents without placing them at the center of the child's experience.
- Increase Pip's visible role as helper, guide, and mascot.

## Design Rule: Characters Deliver The Story
The opening conversation is not a text preface. It is the player's first emotional reason to continue.

Prefer:
- Show the speaking character prominently while they talk.
- Let Pip react visibly beside Elena and recurring friends.
- Use character portraits, poses, expressions, and short dialogue beats before presenting a task summary.
- Keep mission explanations attached to a visible character request or reaction.
- Build recurring character identity strongly enough that children recognize who needs help before reading every word.

Avoid:
- Long dialogue boxes with letter tokens as the primary visual.
- Mission summaries that appear before the player feels who needs help.
- Treating story as text wrapped around a worksheet.

Architecture implication:
- Opening dialogue and in-scene mission guidance should share a reusable speaker portrait mapping.
- Future illustrated character assets can replace CSS portraits without rewriting episode data or dialogue flow.

## Design Rule: Layered Completion
The game should have completion, but not only one final ending.

Completion should exist at several levels:
- Episode completion: a playable day ends and leaves a visible memory, sticker, or shop unlock.
- Chapter story order: Day 1 is available first; each later playable Day unlocks only after the previous Day is completed. Completed Days remain replayable, and an in-progress Day remains accessible for save compatibility.
- Chapter completion: a small story season reaches an emotional goal.
- Curriculum completion: a skill node becomes strong or mastered.
- Review completion: older skills return until they are retained across time and context.
- Collection completion: recipes, memories, decor, outfits, Pip accessories, and village spaces are filled in.

This lets the game support both cozy play and an education roadmap. Children see story and village progress. Parents see learning progress. The system uses mastery and review status to decide what should appear next.

## Release QA Rule: Simulate Story Progression
As the game approaches store submission, manual play should be supported by automated simulation.

The current release-prep rule:
- Static release checks verify version/cache tags, data integrity, assets, i18n keys, parent gate, privacy posture, and no external trackers.
- Playthrough simulation verifies Chapter 1 state progression: correct missions, memory cards, milestones, friendship keepsakes, shop unlocks, Dream Studio ideas, and final chapter reveal.
- Device-layout checks verify responsive breakpoints, safe-area rules, compact version labels, phone stacking, and minimum touch target sizes.
- HTTP smoke checks verify the local preview server can actually serve the app shell, modules, data, and required character atlases.
- Content expansion checks verify content packs, timeline slots, prerequisites, save-field preservation, reward references, and Chapter 1 continuity.
- Release-candidate runner executes the automated QA suite as one gate before manual visual QA or packaging, and starts the local preview server automatically when needed.
- Manual visual QA checklist covers the remaining human-judgment areas: first-start language path, tap feel, animation timing, Memory Album readability, Chapter 1 reveal, screenshot candidates, and store-readiness items.
- Store submission checks keep public listing, privacy policy, and data-safety drafts aligned with the actual local-only/no ads/no tracking build.
- Store asset checks keep screenshot and app icon planning tied to actual gameplay, original character identity, and no-debug/no-reference-copy requirements.
- Packaging readiness checks keep the Stage 1 iOS handoff explicit: Capacitor path, final icon/screenshot/privacy/support items, device testing, safe-area behavior, and no added tracking SDKs.
- Browser/device QA is still required for visual layout, touch feel, animation timing, and child-facing readability.

This split keeps the education/story state machine testable while preserving human review for the parts a script cannot judge well.

## Art Direction: Sunny Spoon Sticker Dollhouse
The project can borrow broad craft qualities from collectible 3D sticker scene products, but it must not copy a specific package, character, layout, or bear design.

Use this as a quality direction:
- Cozy sticker-book finish with thick light die-cut outlines.
- Isometric or dollhouse-like rooms where children can inspect many tiny objects.
- Rounded, soft, plush-like character silhouettes.
- Warm bakery colors, cream backgrounds, gentle browns, rose accents, soft blues, and honey yellows.
- Dense but readable props: shelves, trays, tiny signs, plants, stickers, table settings, market baskets, and room accessories.
- Character-forward scenes where Elena, Pip, Aunt Mina, and recurring customers feel like collectible story figures.
- Visual rewards that look like stickers, pins, decor pieces, and miniature furniture.

Avoid:
- Copying the exact bear proportions, facial expressions, package typography, room layout, or sticker scenes from any reference product.
- Letting the world become generic animal-shop art; Sunny Spoon Cafe, Elena's Dream Studio, Pip the capybara, and the education-story loop must remain recognizable.
- Excessive clutter that hides the learning action target.

Implementation notes:
- Use white or cream sticker outlines around important characters and large scene modules.
- Keep in-world educational choices as visible cards, props, trays, or objects, not only side-panel text.
- Treat each episode as a room/scene sticker set: cafe starter day, after-school rush, market list, birthday table, and Dream Studio sketch night should all have distinct prop families.
- Future generated or commissioned assets should follow this original `Sunny Spoon Sticker Dollhouse` style guide, not the visual identity of any single reference item.

### Character Asset Usage Rules
Character identity should stay consistent, but each UI surface needs the right crop and pose. Do not reuse a full-body sticker inside a face-only container.

| Surface | Asset Type | Current Source | Rule |
| --- | --- | --- | --- |
| Lookbook / design review | Full-body cast concept | `sunny-spoon-cast-concept-v1.png` | Show the full silhouette and outfit language. |
| Opening dialogue | Expressive upper-body portraits | `opening-expression-sheet-v1-clean.png` | Use mood variants tied to the active line. |
| Playable Canvas scene | Full-body action sprites | `cafe-action-sheet-v1-clean.png`, `story-friends-sheet-v1-clean.png` | Use standing, walking, and helper poses in-world. |
| Scene bubble, speaker token, Memory Album | Headshot portraits | `headshot-portrait-sheet-v1-clean.png` | Use face-first headshots only; avoid full-body crops. |
| Future outfit/decor rewards | Variant sheets derived from the approved base | TBD | Preserve face, silhouette, and signature props while changing outfit/accessory only. |

## Development Roadmap

### Product Shift: Personalized Profiles
- Add profile-aware learning bands instead of hardcoding Elena's grade or assessment data.
- Let parents optionally enter Lexile, Star Reading, Star Math, grade, age band, and learning focus.
- If no assessment data exists, start from grade/age and adapt through in-game performance.
- Map missions to curriculum metadata so content can be selected for each user.
- Keep the child-facing experience story-first; keep score/profile details parent-facing.

### v0.4: Opening Story Layer
- Add title/start screen.
- Add Aunt Mina and Elena dialogue.
- Introduce Pip the capybara as Elena's companion and cafe helper.
- Explain why Elena helps.
- Explain coins, recipe stickers, story stars, and Dream Studio.
- Start first mission only after the dialogue.

### v0.5: Scene 1 Implementation
- Replace direct quiz panel with recipe card repair.
- Make first three tasks map to in-scene actions.
- Add simple customer requests.
- Add first recipe sticker reward.

### v0.6: Reward and Decor Room
- Add back room/Dream Studio screen.
- Let player place or preview earned decor.
- Store unlocks in local save.

### v0.7: Day Structure
- Add Day 1 completion.
- Add end-of-day summary.
- Add Day 2 intro hook.

## Current Product Warning
The current v0.3 screen has a better game-like visual direction, but the interaction model is still too quiz-like. The next important step is not more graphics. The next important step is to make the first 3-5 minutes feel like a story-driven tutorial.

### Fixed Authored Chapter Learning Contract

The curriculum layer is a content-balancing engine, not a player-level gate. Every player follows the same authored chapter missions, as in a conventional story game.

- Chapter 1 role: establish accessible early-elementary life skills through cafe repair, customer clues, market planning, fair sharing, and Dream Studio design.
- Chapter 2 role: reuse familiar skills in snowy, seasonal, social, and returning-friend situations rather than simply raising numerical difficulty.
- Chapter 3 and later role: broaden context and combine observations. Selected Grades 4-5 concepts can appear as visual life puzzles, but mandatory completion remains low-pressure and scaffolded.
- Challenge grows through richer context, trade-offs, memory, sequencing, and world consequences, not through longer worksheets.
- Profile learning bands remain useful metadata for parents and curriculum audits; runtime mission replacement is not required for the main game.
- Optional future side activities may carry deeper puzzle complexity without blocking the shared story path.

For every future mission, define both:
- Curriculum purpose: the skill or reasoning being exercised.
- Cozy purpose: the person helped, object repaired, place improved, memory created, or collection advanced.

### Replay Diversity Contract

The first Chapter clear is canonical and authored. Replay diversity should not come from changing the player's grade band or from unbounded random question generation.

- A replay may select a persisted curated remix seed for the Day.
- Remixes keep the same skill and cozy difficulty while changing a customer request, ingredient, object arrangement, clue wording, or scene consequence.
- Selected life-simulation missions may allow more than one valid solution when each choice creates a clear preference, decor, relationship, or collection consequence.
- First-clear story rewards, milestone stickers, and major unlocks remain canonical and one-time.
- Replay rewards may rotate among bounded cozy materials, friend notes, photo variations, or decor swatches; they must not duplicate major story unlocks or become an infinite premium-currency farm.
- Reloading must not reroll the active remix or reward.
- The game should label replay content as a warm return visit, not as a harder academic challenge.
- Completed remix keepsakes remain visible in Pip's Replay Pocket inside the Memory Album, turning a repeated Day into a small character memory instead of an invisible counter.
- Pip reactions are deterministic from the persisted replay combination so reloading cannot change the emotional outcome.


## Sunny Spoon Universe Structure

Sunny Spoon Studios is the creator brand; Sunny Spoon Village is the world; Elena's Cozy Village is the first entry point; Elena's Cozy Village is the current playable app shell for Chapter 1. Future Sunny Spoon experiences should be able to reuse the same world memory without forcing the current game to become a marketing surface.

Future Sunny Spoon experiences may include additional story chapters, Pip-focused games, Dream Studio-focused experiences, village life simulators, educational experiences, cozy mini-games, storybooks, seasonal events, and other Sunny Spoon titles.

Design implications:
- Keep the launch experience brief and elegant: Sunny Spoon Studios, Story / Smile / Spark, Elena's Cozy Village, then the main game.
- Keep Sunny Spoon Studios out of ordinary gameplay except credits/About/Parent Corner/update surfaces.
- Strengthen Pip as the most recognizable mascot, but make Pip specific through behavior, props, reactions, and memories rather than relying only on "capybara" novelty.
- Treat replay variations, Memory Album pages, friendship notes, Pip reactions, and Dream Studio creations as the main shareable moments.
- Avoid social pressure, marketing hooks, forced sharing, grind, or F2P retention tricks.

