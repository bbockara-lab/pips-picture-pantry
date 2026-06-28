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
  }
];

export function getPuzzleById(id) {
  return puzzles.find((puzzle) => puzzle.id === id) || puzzles[0];
}
