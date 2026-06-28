export const puzzles = [
  {
    id: "pip-face-5",
    title: "Pip Face",
    packId: "pips-pantry-shelf",
    size: 5,
    difficulty: "starter",
    solution: ["01110", "11111", "10101", "11111", "01110"],
    reward: {
      imageName: "Pip Face",
      albumText: "Pip saved his first tiny picture."
    }
  },
  {
    id: "soup-bowl-5",
    title: "Soup Bowl",
    packId: "pips-pantry-shelf",
    size: 5,
    difficulty: "starter",
    solution: ["00000", "11111", "10001", "11111", "01110"],
    reward: {
      imageName: "Soup Bowl",
      albumText: "A warm bowl for the pantry card."
    }
  },
  {
    id: "spoon-5",
    title: "Spoon",
    packId: "pips-pantry-shelf",
    size: 5,
    difficulty: "starter",
    solution: ["01100", "01100", "00100", "00100", "00100"],
    reward: {
      imageName: "Spoon",
      albumText: "Pip found the smallest spoon."
    }
  },
  {
    id: "recipe-card-5",
    title: "Recipe Card",
    packId: "pips-pantry-shelf",
    size: 5,
    difficulty: "starter",
    solution: ["11111", "10001", "10111", "10001", "11111"],
    reward: {
      imageName: "Recipe Card",
      albumText: "A little recipe card is tucked away."
    }
  },
  {
    id: "tiny-bow-5",
    title: "Tiny Bow",
    packId: "pips-pantry-shelf",
    size: 5,
    difficulty: "starter",
    solution: ["10001", "11011", "01110", "11011", "10001"],
    reward: {
      imageName: "Tiny Bow",
      albumText: "Pip's bow gets its own picture."
    }
  },
  {
    id: "cafe-window-8",
    title: "Cafe Window",
    packId: "pips-pantry-shelf",
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
    ],
    reward: {
      imageName: "Cafe Window",
      albumText: "A sunny window opens onto the pantry wall."
    }
  },
  {
    id: "tomato-soup-8",
    title: "Tomato Soup",
    packId: "pips-pantry-shelf",
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
    ],
    reward: {
      imageName: "Tomato Soup",
      albumText: "Tomato soup warms the whole shelf."
    }
  }
];

export function getPuzzleById(id) {
  return puzzles.find((puzzle) => puzzle.id === id) || puzzles[0];
}
