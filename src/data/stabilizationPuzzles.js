function mirrorRows(rows) {
  return rows.map((row) => [...row].reverse().join(""));
}

function createPuzzle({ id, title, size, solution, silhouette, mood, tags }) {
  return Object.freeze({
    id,
    title,
    titleKey: `puzzles.${id}`,
    packId: size === 8 ? "apron-drawer" : "village-pantry",
    access: "free",
    size,
    difficulty: size === 8 ? "medium" : "hard",
    reward: size === 8 ? 5 : 7,
    ...(size >= 10 ? {
      artReadability: {
        silhouette,
        colorMood: mood,
        tags
      }
    } : {}),
    solution
  });
}

const EIGHT_BY_EIGHT_PAIRS = [
  {
    left: ["stability-warm-teapot-1", "Warm Teapot"],
    right: ["stability-window-teapot-2", "Window Teapot"],
    silhouette: "round teapot with a raised lid, short spout, and large side handle",
    solution: ["00111000", "01111100", "11111110", "11110111", "11111111", "01111110", "00111100", "00011000"]
  },
  {
    left: ["stability-herb-watering-can-3", "Herb Watering Can"],
    right: ["stability-garden-watering-can-4", "Garden Watering Can"],
    silhouette: "small watering can with a long spout, top handle, and sturdy base",
    solution: ["00011000", "00111100", "01111101", "11111111", "11111110", "01111100", "00111100", "00100100"]
  },
  {
    left: ["stability-forest-mushroom-5", "Forest Mushroom"],
    right: ["stability-meadow-mushroom-6", "Meadow Mushroom"],
    silhouette: "wide mushroom cap with a curved edge and a short offset stem",
    solution: ["00111100", "01111110", "11111111", "11011011", "00111000", "00111000", "00111100", "00011000"]
  },
  {
    left: ["stability-pantry-lantern-7", "Pantry Lantern"],
    right: ["stability-porch-lantern-8", "Porch Lantern"],
    silhouette: "handled lantern with a glowing center, framed sides, and small base",
    solution: ["10011000", "00111100", "01100110", "11111111", "11011011", "11111111", "01111110", "00111100"]
  },
  {
    left: ["stability-sparrow-house-9", "Sparrow House"],
    right: ["stability-robin-house-10", "Robin House"],
    silhouette: "tiny birdhouse with a pitched roof, round doorway, and side perch",
    solution: ["00010000", "00111000", "01111100", "11111110", "11010111", "11111110", "01111100", "00100100"]
  },
  {
    left: ["stability-market-basket-11", "Market Basket"],
    right: ["stability-berry-basket-12", "Berry Basket"],
    silhouette: "woven basket with an arched handle, fruit shapes, and a flat base",
    solution: ["00111000", "01000100", "11111110", "11010111", "11111111", "11101111", "01111110", "00111100"]
  },
  {
    left: ["stability-daisy-pot-13", "Daisy Pot"],
    right: ["stability-sunflower-pot-14", "Sunflower Pot"],
    silhouette: "single flower above a tapered clay pot with two offset leaves",
    solution: ["00111000", "01111100", "00111010", "00011100", "00111100", "01111110", "01111100", "00111000"]
  },
  {
    left: ["stability-rain-boots-15", "Rain Boots"],
    right: ["stability-garden-boots-16", "Garden Boots"],
    silhouette: "pair of cozy rain boots with tall cuffs and outward-facing toes",
    solution: ["01101100", "01101100", "01101100", "01101100", "01101100", "01111110", "11111111", "11100111"]
  }
];

const TEN_BY_TEN_PAIRS = [
  {
    left: ["stability-cafe-chair-17", "Cafe Chair"], right: ["stability-window-chair-18", "Window Chair"],
    silhouette: "wooden cafe chair with a slatted back, square seat, and two clear legs",
    solution: ["0011110000", "0010010000", "0011110000", "0010010000", "0011111100", "0011111100", "0010010010", "0010010010", "0110010010", "1100000110"]
  },
  {
    left: ["stability-bread-basket-19", "Bread Basket"], right: ["stability-picnic-basket-20", "Picnic Basket"],
    silhouette: "deep bread basket with a tall handle, three loaves, and woven lower rim",
    solution: ["0001110000", "0010001000", "0100000100", "1111111110", "1101101111", "1110111111", "1111111111", "0111111110", "0011111100", "0001111000"]
  },
  {
    left: ["stability-wall-clock-21", "Wall Clock"], right: ["stability-kitchen-clock-22", "Kitchen Clock"],
    silhouette: "round wall clock with two hands, a top loop, and a tiny side winding key",
    solution: ["0001100000", "0111110000", "0111111000", "1110111100", "1101110110", "1111011111", "0111111110", "0011111100", "0001111000", "0000100000"]
  },
  {
    left: ["stability-basil-pot-23", "Basil Pot"], right: ["stability-mint-pot-24", "Mint Pot"],
    silhouette: "leafy herb plant with three stems, offset leaves, and a tapered flowerpot",
    solution: ["0010010000", "0110111000", "0011110100", "1001111000", "0111110000", "0011100000", "0111110000", "0111111000", "0011110000", "0001100000"]
  },
  {
    left: ["stability-jam-cart-25", "Jam Cart"], right: ["stability-market-cart-26", "Market Cart"],
    silhouette: "small market cart with a striped canopy, jam jars, handle, and two wheels",
    solution: ["0011111100", "0110101010", "1111111111", "1011011011", "1111111110", "0111111100", "0010010010", "0110010010", "1100000110", "1100000110"]
  },
  {
    left: ["stability-butter-croissant-27", "Golden Butter Croissant"], right: ["stability-honey-croissant-28", "Honey Croissant"],
    silhouette: "curved croissant with layered inner bands and one pointed end lifted upward",
    solution: ["0000110000", "0001111000", "0011111100", "0110111110", "1101110111", "1111011111", "1111111110", "0111111100", "0011111000", "0001110000"]
  },
  {
    left: ["stability-flour-windmill-29", "Flour Windmill"], right: ["stability-village-windmill-30", "Village Windmill"],
    silhouette: "little windmill with four broad sails, a peaked roof, and a narrow tower",
    solution: ["0000100100", "0101111000", "0011110101", "1111111010", "0111111100", "0011110000", "0011110000", "0011010000", "0111111000", "1111111100"]
  },
  {
    left: ["stability-copper-kettle-31", "Hearthside Copper Kettle"], right: ["stability-tea-kettle-32", "Tea Kettle"],
    silhouette: "round kettle with an overhead handle, short lid, spout, and grounded base",
    solution: ["0001110000", "0010001000", "0111111100", "1111111110", "1111011111", "1111111111", "0111111110", "0011111100", "0011111100", "0001111000"]
  },
  {
    left: ["stability-village-gate-33", "Village Gate"], right: ["stability-garden-gate-34", "Garden Gate"],
    silhouette: "arched garden gate with vertical boards, two posts, and a small side latch",
    solution: ["0011110000", "0110011000", "1100001100", "1111111110", "1010101011", "1010101011", "1010101010", "1010101010", "1111111110", "1100000110"]
  },
  {
    left: ["stability-striped-apron-35", "Striped Apron"], right: ["stability-bakers-apron-36", "Baker's Apron"],
    silhouette: "kitchen apron with a neck loop, side tie, striped body, and front pocket",
    solution: ["0001100000", "0010010000", "0111110000", "0111111000", "1111111100", "1110011110", "1111111111", "0111111110", "0111111110", "0011111100"]
  },
  {
    left: ["stability-berry-tart-37", "Morning Berry Tart"], right: ["stability-cherry-tart-38", "Cherry Tart"],
    silhouette: "round fruit tart with a scalloped crust, berry topping, and offset mint leaf",
    solution: ["0001111000", "0011111100", "0111011110", "1111111111", "1101101111", "1110111111", "1111111110", "0111111100", "0011111000", "0001100000"]
  },
  {
    left: ["stability-recipe-book-39", "Recipe Book"], right: ["stability-pantry-journal-40", "Pantry Journal"],
    silhouette: "open recipe book with a center fold, page lines, bookmark, and rounded lower corners",
    solution: ["0000101110", "1111111111", "1101101011", "1111111111", "1101011011", "1111111111", "1101101011", "1111111111", "0111111110", "0011001100"]
  },
  {
    left: ["stability-window-candle-41", "Window Candle"], right: ["stability-evening-candle-42", "Evening Candle"],
    silhouette: "short candle with a bright flame, dripping wax, side handle, and saucer base",
    solution: ["0001000000", "0011100000", "0010100000", "0011100000", "0011110000", "0011010000", "0011110110", "0111111110", "1111111111", "0111111110"]
  },
  {
    left: ["stability-garden-bench-43", "Garden Bench"], right: ["stability-village-bench-44", "Village Bench"],
    silhouette: "wooden garden bench with a slatted back, long seat, armrest, and sturdy legs",
    solution: ["0111111100", "0101010100", "0111111100", "0101010100", "1111111110", "1111111111", "0100000100", "0100000100", "1100000110", "1100000110"]
  },
  {
    left: ["stability-cake-stand-45", "Cake Stand"], right: ["stability-pastry-stand-46", "Pastry Stand"],
    silhouette: "small iced cake on a pedestal stand with a top berry and offset serving handle",
    solution: ["0001000000", "0011100000", "1111110000", "1111111000", "1110111100", "1111111110", "0111111100", "0001100000", "0011110000", "0111111000"]
  },
  {
    left: ["stability-milk-churn-47", "Creamery Milk Churn"], right: ["stability-cream-churn-48", "Cream Churn"],
    silhouette: "tall milk churn with lid knob, shoulder handles, label panel, and wide base",
    solution: ["0001100000", "0011110000", "0011110000", "1111111000", "1111111100", "1101101110", "1111111111", "1110011111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-hand-mixer-49", "Hand Mixer"], right: ["stability-cream-whisk-50", "Cream Whisk"],
    silhouette: "hand mixer with a rounded motor, top grip, two beaters, and a side speed tab",
    solution: ["0011111000", "0110001100", "1111111110", "1111111111", "0111111100", "0011011000", "0011011000", "0011011000", "0110110000", "1100110000"]
  },
  {
    left: ["stability-market-awning-51", "Market Awning"], right: ["stability-bakery-awning-52", "Bakery Awning"],
    silhouette: "striped shop awning with scalloped edge, side post, and a small hanging sign",
    solution: ["1111111110", "1010101010", "1111111111", "0111111110", "0101010110", "0100000110", "0101100110", "0101100110", "0100000110", "1100000110"]
  },
  {
    left: ["stability-soup-pot-53", "Soup Pot"], right: ["stability-stew-pot-54", "Stew Pot"],
    silhouette: "wide soup pot with lid, rising steam, two handles, and a rounded cooking base",
    solution: ["0010010000", "0001000000", "0010010000", "0111110000", "0111111000", "1111111110", "1111111111", "1110111111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-cozy-cottage-55", "Cozy Cottage"], right: ["stability-pantry-cottage-56", "Sunny Pantry Cottage"],
    silhouette: "tiny cottage with a pitched roof, chimney, glowing windows, and a side garden",
    solution: ["0001001000", "0011111100", "0111111110", "1111111111", "1111111110", "1101101110", "1111111110", "1100110110", "1111111110", "0111111100"]
  }
];

export function expandStabilizationPairs(pairs, size) {
  return pairs.flatMap((pair) => {
    const [leftId, leftTitle] = pair.left;
    const [rightId, rightTitle] = pair.right;
    const common = {
      size,
      silhouette: pair.silhouette,
      mood: "warm cream, honey gold, pantry brown, and a soft herb-green accent",
      tags: pair.silhouette.split(" ").filter((word) => word.length >= 5).slice(0, 3)
    };
    return [
      createPuzzle({ ...common, id: leftId, title: leftTitle, solution: pair.solution }),
      createPuzzle({ ...common, id: rightId, title: rightTitle, solution: mirrorRows(pair.solution) })
    ];
  });
}

export const STABILIZATION_PUZZLES_BATCH_1 = Object.freeze([
  ...expandStabilizationPairs(EIGHT_BY_EIGHT_PAIRS, 8),
  ...expandStabilizationPairs(TEN_BY_TEN_PAIRS, 10)
]);
