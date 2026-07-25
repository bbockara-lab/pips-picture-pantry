const BASE_MOTIFS = [
  {
    title: "Pocket Apron",
    solution: ["00111100", "01111110", "01111110", "11111111", "11011011", "11011011", "11000011", "01000010"]
  },
  {
    title: "Patch Pocket",
    solution: ["01111110", "01000010", "01000010", "01111110", "01100110", "01111110", "00111100", "00011000"]
  },
  {
    title: "Four-Hole Button",
    solution: ["00111100", "01111110", "11111111", "11011011", "11011011", "11111111", "01111110", "00111100"]
  },
  {
    title: "Thread Spool",
    solution: ["01111110", "00111100", "00111100", "00111100", "00111100", "00111100", "00111100", "01111110"]
  },
  {
    title: "Sewing Scissors",
    solution: ["11000011", "11100111", "01111110", "00111100", "00011000", "00111100", "01100110", "11000011"]
  },
  {
    title: "Golden Needle",
    solution: ["00000011", "00000110", "00001100", "00011000", "00110000", "01100000", "11000000", "10000000"]
  },
  {
    title: "Tomato Pincushion",
    solution: ["00011000", "00111100", "01111110", "11111111", "11111111", "01111110", "00111100", "00011000"]
  },
  {
    title: "Apron Bow",
    solution: ["11000011", "11100111", "01111110", "00111100", "00111100", "01111110", "11100111", "11000011"]
  },
  {
    title: "Folded Gingham",
    solution: ["11111111", "10000001", "10111101", "10100101", "10111101", "10000001", "11111111", "01111110"]
  },
  {
    title: "Drawer Handle",
    solution: ["00111100", "01111110", "11000011", "11000011", "11000011", "11111111", "01111110", "00111100"]
  }
];

function softenVariant(solution, motifIndex) {
  return solution.map((row, rowIndex) => {
    const cells = [...row];
    const columnIndex = (motifIndex + rowIndex * 3) % cells.length;
    if (rowIndex > 0 && rowIndex < cells.length - 1) {
      cells[columnIndex] = cells[columnIndex] === "1" ? "0" : "1";
    }
    return cells.join("");
  });
}

export const APRON_DRAWER_PUZZLE_OVERRIDES = Object.fromEntries(
  BASE_MOTIFS.flatMap((motif, index) => {
    const firstNumber = index + 1;
    const secondNumber = index + 11;
    const baseSlug = [
      "cafe-window",
      "tomato-soup",
      "pantry-jar",
      "milk-bottle",
      "jam-jar",
      "whisk",
      "chef-hat",
      "cupcake",
      "kettle",
      "rolling-pin"
    ][index];
    const firstId = `apron-drawer-${baseSlug}-${firstNumber}`;
    const secondId = `apron-drawer-${baseSlug}-2-${secondNumber}`;
    return [
      [firstId, motif],
      [secondId, {
        title: `${motif.title} 2`,
        solution: softenVariant(motif.solution, index)
      }]
    ];
  })
);
