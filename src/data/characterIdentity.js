export const characterIdentity = [
  {
    id: "elena",
    name: "Elena",
    role: "Dream Studio designer",
    note: "Curious, capable, and warm. She remains a wider Sunny Spoon Village lead while Pip leads Picture Pantry.",
    cues: ["side-part bob", "heart clip", "mint apron"],
    signatureProps: ["sketchbook", "heart clip", "mint work apron"],
    personality: ["observant", "kind", "persistent", "visually creative"],
    actionLanguage: ["notices small details", "sketches an idea", "helps someone feel welcome"],
    voiceRule: "Warm and specific. Elena asks curious questions and offers practical ideas without sounding like a teacher.",
    identityGuardrail: "Keep Elena as a wider village lead without displacing Pip as the active Picture Pantry host.",
    franchiseCore: true
  },
  {
    id: "pip",
    name: "Pip",
    role: "Picture Pantry host",
    note: "Calm mascot, direct player guide, clue carrier, and emotional anchor.",
    cues: ["round capybara", "tiny bow", "soft smile"],
    signatureProps: ["tiny bow", "recipe card", "cozy cushion"],
    personality: ["calm", "loyal", "quietly funny", "gentle"],
    actionLanguage: ["sniffs a clue", "holds up a small card", "settles into the warmest nearby spot"],
    voiceRule: "Speak in short, warm, direct sentences when guiding the player. Pip explains one idea at a time and invites curiosity instead of lecturing.",
    identityGuardrail: "Keep Pip recognizably capybara-shaped, gentle, and emotionally steady while allowing him to lead Picture Pantry conversations.",
    franchiseCore: true
  },
  {
    id: "aunt-mina",
    name: "Aunt Mina",
    role: "Cafe mentor",
    note: "Tidy shelves and repaired recipe cards reveal a caring mentor who sometimes has too much to do.",
    cues: ["side bun", "mentor apron", "wooden spoon"],
    signatureProps: ["wooden spoon", "well-used recipe book", "mentor apron"],
    personality: ["warm", "encouraging", "capable", "occasionally overwhelmed"],
    actionLanguage: ["makes room for Elena to try", "shares a recipe memory", "thanks helpers directly"],
    voiceRule: "Encouraging and concise. Aunt Mina frames needs as real cafe or village problems, never classroom instructions.",
    identityGuardrail: "She mentors without taking over Elena's work or becoming a generic quest dispenser.",
    franchiseCore: true
  },
  {
    id: "mr-park",
    name: "Mr. Park",
    role: "Soup regular",
    note: "Warm tomato soup and careful timing make him a reassuring recurring village rhythm.",
    cues: ["neat side part", "round glasses", "pocket clock"],
    signatureProps: ["pocket clock", "soup order card"],
    personality: ["punctual", "gentle", "appreciative"],
    actionLanguage: ["checks the time", "notices a careful repair", "returns for a familiar soup"],
    voiceRule: "Measured, polite, and lightly precise without becoming stern.",
    identityGuardrail: "Time motifs support his personality; they should not reduce every appearance to a clock exercise.",
    franchiseCore: false
  },
  {
    id: "lily",
    name: "Lily",
    role: "Tea party friend",
    note: "Cute muffins, outfits, and bright table colors express her playful social confidence.",
    cues: ["twin buns", "sunny bow", "pink party dress"],
    signatureProps: ["sunny bow", "tea-party invitation"],
    personality: ["expressive", "social", "imaginative"],
    actionLanguage: ["suggests a theme", "mixes colors", "invites someone into the plan"],
    voiceRule: "Bright and decisive, with concrete visual preferences rather than generic excitement.",
    identityGuardrail: "Keep her interested in people and shared occasions, not only clothes or pink objects.",
    franchiseCore: false
  },
  {
    id: "mateo",
    name: "Mateo",
    role: "Quiet reader",
    note: "Warm snacks and cozy reading corners help him participate at his own pace.",
    cues: ["soft curls", "blue hoodie", "favorite book"],
    signatureProps: ["favorite book", "blue hoodie"],
    personality: ["thoughtful", "quiet", "observant"],
    actionLanguage: ["marks a favorite page", "finds a calm corner", "shares one careful observation"],
    voiceRule: "Brief and thoughtful. Silence and pauses are comfortable, not treated as a problem to fix.",
    identityGuardrail: "Do not make quietness his only trait or use him solely for reading prompts.",
    franchiseCore: false
  },
  {
    id: "nora",
    name: "Nora",
    role: "Market helper",
    note: "Neat lists and careful budgets connect her to the practical life of Market Street.",
    cues: ["long braid", "yellow tie", "market list"],
    signatureProps: ["market list", "yellow neck tie"],
    personality: ["resourceful", "organized", "fair-minded"],
    actionLanguage: ["checks a list", "compares practical choices", "keeps a promise to a shopkeeper"],
    voiceRule: "Clear and practical, with warmth beneath her organized manner.",
    identityGuardrail: "Organization is a strength, not a reason to portray her as controlling or humorless.",
    franchiseCore: false
  },
  {
    id: "june",
    name: "June",
    role: "Birthday friend",
    note: "Fair sharing and colorful party tables show how much she values everyone feeling included.",
    cues: ["wavy bob", "party hat", "purple dress"],
    signatureProps: ["party hat", "shared celebration tray"],
    personality: ["inclusive", "festive", "generous"],
    actionLanguage: ["counts everyone in", "shares the center decoration", "turns a mistake into a celebration"],
    voiceRule: "Celebratory but considerate. June notices who has not yet been included.",
    identityGuardrail: "Let her appear outside birthdays so she develops beyond a single event role.",
    franchiseCore: false
  }
];

export const franchiseCoreCharacters = characterIdentity.filter((character) => character.franchiseCore);

export function characterIdentityByName(name) {
  return characterIdentity.find((character) => character.name === name) || null;
}

