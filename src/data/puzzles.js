export const puzzles = [
  {
    id: "pip-face-5",
    title: "Pip Face",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 5,
    difficulty: "starter",
    solution: ["01110", "11111", "10101", "11111", "01110"]
  },
  {
    id: "soup-bowl-5",
    title: "Soup Bowl",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 5,
    difficulty: "starter",
    solution: ["00000", "11111", "10001", "11111", "01110"]
  },
  {
    id: "spoon-5",
    title: "Spoon",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 5,
    difficulty: "starter",
    solution: ["01100", "01100", "00100", "00100", "00100"]
  },
  {
    id: "recipe-card-5",
    title: "Recipe Card",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 5,
    difficulty: "starter",
    solution: ["11111", "10001", "10111", "10001", "11111"]
  },
  {
    id: "tiny-bow-5",
    title: "Tiny Bow",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 5,
    difficulty: "starter",
    solution: ["10001", "11011", "01110", "11011", "10001"]
  },
  {
    id: "cafe-window-8",
    title: "Cafe Window",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 8,
    difficulty: "easy",
    solution: [
      "01111110",
      "01011010",
      "01011010",
      "01111110",
      "01011010",
      "01011010",
      "01111110",
      "00000000"
    ]
  },
  {
    id: "tomato-soup-8",
    title: "Tomato Soup",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 8,
    difficulty: "easy",
    solution: [
      "00111100",
      "01111110",
      "11111111",
      "11100111",
      "11111111",
      "01111110",
      "00111100",
      "00011000"
    ]
  },
  {
    id: "pantry-jar-8",
    title: "Pantry Jar",
    packId: "pips-pantry-shelf",
    access: "free",
    size: 8,
    difficulty: "easy",
    solution: [
      "00111100",
      "01000010",
      "01111110",
      "01011010",
      "01011010",
      "01011010",
      "01111110",
      "00111100"
    ]
  },
  {
    id: "sunny-spoon-sign-10",
    title: "Sunny Spoon Sign",
    packId: "pips-pantry-shelf",
    access: "unlockable",
    unlockRequirement: {
      type: "completed-count",
      count: 5
    },
    size: 10,
    difficulty: "next-step",
    solution: [
      "0011111100",
      "0110000110",
      "1101111011",
      "1101001011",
      "1101111011",
      "1100000011",
      "0111111110",
      "0010010100",
      "0011111100",
      "0000110000"
    ]
  }
];

export function getPuzzleById(id) {
  return puzzles.find((puzzle) => puzzle.id === id) || puzzles[0];
}
