const PACK_COMPLETION_PALETTES = {
  "sunny-spoon-sign": "sunny-sign",
  "apron-drawer": "apron-drawer",
  "bakery-window": "bakery-window",
  "village-pantry": "village-pantry"
};

export function getCompletionPaletteId(puzzle) {
  return puzzle?.completionPalette || PACK_COMPLETION_PALETTES[puzzle?.packId] || "";
}

export function getPackCompletionPalette(paletteId) {
  return {
    "sunny-sign": ["#f2b84d", "#e88743", "#65a88f", "#8a5639"],
    "apron-drawer": ["#78b7a3", "#e9c96f", "#df7d68", "#7b5877"],
    "bakery-window": ["#d68a49", "#f0c36d", "#b45e4d", "#739063"],
    "village-pantry": ["#cb704f", "#e7a85c", "#719a72", "#7f6250"]
  }[paletteId] || null;
}
