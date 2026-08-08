import { expandStabilizationPairs } from "./stabilizationPuzzles.js";

const EIGHT_BY_EIGHT_PAIRS = [
  {
    left: ["stability-tea-tray-113", "Tea Tray"], right: ["stability-breakfast-tray-114", "Breakfast Tray"],
    silhouette: "oval serving tray with two tiny cups, raised handles, and a patterned cloth",
    solution: ["10000001", "01111110", "11111111", "11011011", "11111111", "10100111", "01111110", "00111100"]
  },
  {
    left: ["stability-kitchen-timer-115", "Kitchen Timer"], right: ["stability-egg-timer-116", "Egg Timer"],
    silhouette: "round kitchen timer with a top knob, clock hand, side tick marks, and flat foot",
    solution: ["00011010", "00111100", "01111110", "11011011", "11101111", "11111111", "01111110", "00111100"]
  },
  {
    left: ["stability-potted-fern-117", "Potted Fern"], right: ["stability-window-fern-118", "Window Fern"],
    silhouette: "soft fern in a tapered pot with a tall center stem and alternating leafy fronds",
    solution: ["00010100", "01111100", "00111010", "11111100", "01111110", "00111100", "01111110", "00111100"]
  },
  {
    left: ["stability-chef-hat-119", "Chef Hat"], right: ["stability-baker-hat-120", "Baker Hat"],
    silhouette: "puffy cook hat with three rounded crown lobes, a narrow band, and folded brim",
    solution: ["00101000", "01111110", "11111111", "11111101", "01111110", "00111100", "01111110", "01111110"]
  },
  {
    left: ["stability-letter-basket-121", "Letter Basket"], right: ["stability-recipe-basket-122", "Recipe Basket"],
    silhouette: "small woven basket holding folded notes with an arched handle and sturdy rim",
    solution: ["00111100", "01000010", "11110111", "11111111", "10101101", "11111111", "01111110", "00111100"]
  },
  {
    left: ["stability-handbell-123", "Handbell"], right: ["stability-dinner-bell-124", "Dinner Bell"],
    silhouette: "little handbell with a round grip, flared brass body, clapper, and curved lip",
    solution: ["00011010", "00111100", "00011000", "00111100", "01111110", "11111111", "01111110", "00100100"]
  },
  {
    left: ["stability-patchwork-quilt-125", "Patchwork Quilt"], right: ["stability-picnic-blanket-126", "Picnic Blanket"],
    silhouette: "folded patchwork textile with checker panels, scalloped edge, and one loose corner",
    solution: ["11111110", "11011011", "10110110", "11111111", "11011011", "10110110", "11111111", "10101010"]
  }
];

const TEN_BY_TEN_PAIRS = [
  {
    left: ["stability-window-planter-128", "Window Planter"], right: ["stability-herb-planter-129", "Herb Planter"],
    silhouette: "long window box with three leafy herbs, curved brackets, soil line, and trailing vine",
    solution: ["0010101000", "0111111100", "1011111010", "0111111110", "1111111111", "1101101111", "1111111111", "0111111110", "0111111110", "1100000011"]
  },
  {
    left: ["stability-copper-pan-130", "Copper Pan"], right: ["stability-skillet-pan-131", "Skillet Pan"],
    silhouette: "round cooking pan with a deep bowl, long angled handle, hanging loop, and shine mark",
    solution: ["0000000011", "0011110110", "0111111100", "1111111110", "1101101111", "1111111110", "0111111100", "0011111000", "0001110000", "0000100000"]
  },
  {
    left: ["stability-market-bicycle-132", "Market Bicycle"], right: ["stability-bakery-bicycle-133", "Bakery Bicycle"],
    silhouette: "village bicycle with two round wheels, basket, sloped frame, seat, and handlebar",
    solution: ["0000001100", "0011101110", "0111111100", "1101100110", "1111111111", "1010010101", "1111111111", "0110010110", "1100000011", "0100000010"]
  },
  {
    left: ["stability-cake-dome-134", "Cake Dome"], right: ["stability-pastry-dome-135", "Pastry Dome"],
    silhouette: "glass cake dome with lid knob, rounded cover, little pastry, pedestal, and broad base",
    solution: ["0010101001", "1111111100", "0111111110", "1111111111", "1101101111", "1111111111", "0111111110", "0011111100", "0001100000", "0011110000"]
  },
  {
    left: ["stability-sunflower-wreath-136", "Sunflower Wreath"], right: ["stability-daisy-wreath-137", "Daisy Wreath"],
    silhouette: "round flower wreath with clustered petals, open center, ribbon tail, and leafy accent",
    solution: ["0011111000", "0111111100", "1110011110", "1100001111", "1101101111", "1100001111", "1110011110", "0111111100", "0011111000", "0001100100"]
  },
  {
    left: ["stability-recipe-board-138", "Recipe Board"], right: ["stability-menu-board-139", "Menu Board"],
    silhouette: "standing chalkboard with arched header, handwritten lines, side flower, and two feet",
    solution: ["0011111100", "0110000110", "1101101011", "1001001001", "1101011011", "1001001001", "1101101011", "1001001001", "0111111110", "0011001100"]
  },
  {
    left: ["stability-linen-basket-140", "Linen Basket"], right: ["stability-napkin-basket-141", "Napkin Basket"],
    silhouette: "woven household basket with folded linens, two handles, crosshatch body, and flat base",
    solution: ["1100000011", "1110101111", "0111111110", "1111111111", "1101101111", "1110011111", "1101101111", "1110011111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-porch-rocker-142", "Porch Rocker"], right: ["stability-reading-rocker-143", "Reading Rocker"],
    silhouette: "cozy rocking chair with slatted back, curved arms, seat cushion, and long rockers",
    solution: ["0011110000", "0010010000", "0011111000", "0110011100", "1111111110", "0111111100", "0010010010", "0110010110", "1100000011", "0111111110"]
  },
  {
    left: ["stability-berry-colander-144", "Berry Colander"], right: ["stability-apple-colander-145", "Apple Colander"],
    silhouette: "handled kitchen colander filled with fruit, perforated bowl, rim, and short base",
    solution: ["1010101000", "1111111100", "0111111110", "1111111111", "1101101111", "1111111111", "0111111110", "0011111100", "0001100000", "0011110000"]
  },
  {
    left: ["stability-garden-trellis-146", "Garden Trellis"], right: ["stability-rose-trellis-147", "Rose Trellis"],
    silhouette: "arched garden trellis with crossed lattice, climbing leaves, blossoms, and ground stakes",
    solution: ["0011111100", "0110011110", "1101101011", "1011010111", "1110111011", "1011010111", "1101101011", "1011010111", "1111111111", "1100000011"]
  },
  {
    left: ["stability-pantry-stool-148", "Pantry Stool"], right: ["stability-kitchen-stool-149", "Kitchen Stool"],
    silhouette: "wooden step stool with rounded seat, cross braces, two sturdy legs, and lower rung",
    solution: ["0011111100", "0111111110", "1111111111", "0011111000", "0010010000", "0110011000", "1101101100", "1101101100", "1100001100", "1111111110"]
  },
  {
    left: ["stability-bread-cloche-150", "Bread Cloche"], right: ["stability-bun-cloche-151", "Bun Cloche"],
    silhouette: "covered bread basket with knobbed dome, warm rolls, side handles, and serving plate",
    solution: ["0001101000", "0011110000", "0111111000", "1111111100", "1101101110", "1111111111", "0111111110", "1111111111", "0111111110", "1111111111"]
  },
  {
    left: ["stability-porch-swing-152", "Porch Swing"], right: ["stability-garden-swing-153", "Garden Swing"],
    silhouette: "hanging bench swing with two ropes, slatted seat, little cushion, and tasselled edge",
    solution: ["1000000001", "1100000011", "1101111011", "1111111111", "1101010111", "1111111111", "0111111110", "0100000110", "1100000011", "1000000001"]
  },
  {
    left: ["stability-spice-rack-154", "Pantry Spice Rack"], right: ["stability-herb-rack-155", "Herb Rack"],
    silhouette: "wall spice rack with two shelves, small labeled jars, side rails, hooks, and feet",
    solution: ["1111111111", "1001001001", "1111111111", "1000000001", "1101101111", "1001001001", "1111111111", "1000000001", "1111111111", "1100000011"]
  },
  {
    left: ["stability-orchard-ladder-156", "Orchard Ladder"], right: ["stability-pantry-ladder-157", "Pantry Ladder"],
    silhouette: "tall leaning ladder with even rungs, side basket, hooked top, and wide grounded feet",
    solution: ["1100001000", "0110011000", "0111111000", "0110011000", "0111111100", "0110011110", "0111111111", "0110011110", "1110011011", "1100000011"]
  },
  {
    left: ["stability-tea-trolley-158", "Tea Trolley"], right: ["stability-dessert-trolley-159", "Dessert Trolley"],
    silhouette: "two-tier serving trolley with teapot, cakes, tall handle, rails, and small wheels",
    solution: ["1001010000", "1111111000", "1101101110", "1111111111", "0111111110", "0100000110", "1111111111", "1101101111", "1100000011", "0100000010"]
  },
  {
    left: ["stability-cottage-window-160", "Cottage Window"], right: ["stability-pantry-window-161", "Pantry Window"],
    silhouette: "arched cottage window with crossed panes, curtains, flower box, shutters, and sill",
    solution: ["0011111100", "0110000110", "1101101011", "1010010101", "1101101011", "1010010101", "1101101011", "1000000001", "1111111111", "0110000110"]
  },
  {
    left: ["stability-jam-kettle-162", "Jam Kettle"], right: ["stability-preserve-kettle-163", "Preserve Kettle"],
    silhouette: "wide preserving kettle with fruit, overhead handle, pouring lip, steam, and heavy base",
    solution: ["0010011000", "0001000000", "0010010000", "0111110000", "0111111000", "1111111110", "1111111111", "1110111111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-village-lamppost-164", "Village Lamppost"], right: ["stability-garden-lamppost-165", "Garden Lamppost"],
    silhouette: "old lamppost with glowing lantern, peaked cap, slim decorated pole, vine, and stone foot",
    solution: ["0011111000", "0111111100", "1111111110", "1101101111", "0111111100", "0001100100", "0011110000", "0001100000", "0011110000", "0111111000"]
  },
  {
    left: ["stability-pantry-cabinet-166", "Pantry Cabinet"], right: ["stability-recipe-cabinet-167", "Recipe Cabinet"],
    silhouette: "tall pantry cabinet with crown top, glass doors, shelves of jars, knobs, and short feet",
    solution: ["0111111110", "1100000011", "1101101011", "1100000011", "1111111111", "1100000011", "1101011011", "1100000011", "1111111111", "1100000011"]
  }
];

const LITTLE_PANTRY_KEY = Object.freeze({
  id: "stability-little-pantry-key-127",
  title: "Little Pantry Key",
  titleKey: "puzzles.stability-little-pantry-key-127",
  packId: "apron-drawer",
  access: "free",
  size: 8,
  difficulty: "medium",
  reward: 5,
  solution: ["11110000", "10011000", "11111100", "00111110", "00011111", "00001110", "00000110", "00000101"]
});

export const STABILIZATION_PUZZLES_BATCH_3 = Object.freeze([
  ...expandStabilizationPairs(EIGHT_BY_EIGHT_PAIRS, 8),
  LITTLE_PANTRY_KEY,
  ...expandStabilizationPairs(TEN_BY_TEN_PAIRS, 10)
]);
