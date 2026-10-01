import { expandStabilizationPairs } from "./stabilizationPuzzles.js";

const EIGHT_BY_EIGHT_PAIRS = [
  {
    left: ["stability-counter-bell-57", "Counter Bell"], right: ["stability-porch-bell-58", "Porch Bell"],
    silhouette: "rounded service bell with a top button, wide dome, and sturdy counter base",
    solution: ["00011010", "00111100", "00111100", "01111110", "01111110", "11111111", "00111100", "00011000"]
  },
  {
    left: ["stability-cocoa-mug-59", "Cocoa Mug"], right: ["stability-cinnamon-mug-60", "Cinnamon Mug"],
    silhouette: "cozy handled mug with a foamy top, round body, and little saucer beneath",
    solution: ["00111100", "01111110", "11111101", "11111111", "11111111", "01111110", "00111100", "01111110"]
  },
  {
    left: ["stability-honey-dipper-61", "Honey Dipper"], right: ["stability-jam-spoon-62", "Jam Spoon"],
    silhouette: "diagonal pantry utensil with a ribbed round head and a long narrow handle",
    solution: ["11100000", "11110000", "11111000", "01111000", "00111000", "00011100", "00001110", "00000111"]
  },
  {
    left: ["stability-rosemary-sprig-63", "Rosemary Sprig"], right: ["stability-mint-sprig-64", "Mint Sprig"],
    silhouette: "leafy herb sprig with a rising stem and alternating clusters of soft leaves",
    solution: ["00001000", "11011000", "01110000", "01111000", "01111100", "00111110", "00011111", "00001010"]
  },
  {
    left: ["stability-oven-mitt-65", "Oven Mitt"], right: ["stability-quilted-mitt-66", "Quilted Mitt"],
    silhouette: "padded oven mitt with a raised thumb, rounded cuff, and quilted palm shape",
    solution: ["11110000", "01111000", "01111100", "01111110", "11111111", "11111110", "01111100", "00111100"]
  },
  {
    left: ["stability-picnic-lamp-67", "Picnic Lamp"], right: ["stability-garden-lamp-68", "Garden Lamp"],
    silhouette: "small table lamp with a broad shade, glowing center, slim stem, and oval foot",
    solution: ["00111100", "01111110", "11111111", "01111110", "00111100", "00011010", "00111100", "01111110"]
  },
  {
    left: ["stability-ribbon-bow-69", "Ribbon Bow"], right: ["stability-gift-bow-70", "Gift Bow"],
    silhouette: "full ribbon bow with two rounded loops, center knot, and flowing lower tails",
    solution: ["11000011", "11100111", "01111110", "00111100", "01111110", "11111111", "11011011", "10111001"]
  },
  {
    left: ["stability-oak-acorn-71", "Oak Acorn"], right: ["stability-forest-chestnut-72", "Forest Chestnut"],
    silhouette: "plump woodland nut with a textured cap, tiny stem, and softly pointed base",
    solution: ["00011010", "00111100", "01111110", "11111111", "10111101", "11111111", "01111110", "00111100"]
  }
];

const TEN_BY_TEN_PAIRS = [
  {
    left: ["stability-sunroom-gazebo-73", "Sunroom Gazebo"], right: ["stability-garden-gazebo-74", "Garden Gazebo"],
    silhouette: "open garden gazebo with a peaked roof, four posts, railings, and a broad step",
    solution: ["1001100000", "0011110000", "1111111000", "1111111100", "1100001110", "1101101110", "1101101110", "1100001110", "1111111111", "0111111110"]
  },
  {
    left: ["stability-flower-wheelbarrow-75", "Flower Wheelbarrow"], right: ["stability-herb-wheelbarrow-76", "Herb Wheelbarrow"],
    silhouette: "garden wheelbarrow with leafy cargo, deep tray, two handles, legs, and one wheel",
    solution: ["1101010000", "1111111000", "1111111100", "1111111110", "0111111111", "0011111110", "0011000100", "0110000110", "1100000011", "0100000001"]
  },
  {
    left: ["stability-honey-beehive-77", "Honey Beehive"], right: ["stability-orchard-beehive-78", "Orchard Beehive"],
    silhouette: "rounded woven beehive with layered bands, a tiny doorway, and two visiting bees",
    solution: ["0011110000", "0111111000", "1111111101", "0111111110", "1111111111", "0111111110", "1111011111", "0111111110", "0011111100", "0111111110"]
  },
  {
    left: ["stability-recipe-mailbox-79", "Recipe Mailbox"], right: ["stability-village-mailbox-80", "Village Mailbox"],
    silhouette: "little rural mailbox with a curved roof, raised flag, post, and flowered base",
    solution: ["0011111100", "0111111110", "1111111111", "1101111111", "1111111110", "0011111100", "0001100000", "0001100000", "0111111000", "1111111100"]
  },
  {
    left: ["stability-orchard-bridge-81", "Orchard Bridge"], right: ["stability-garden-bridge-82", "Garden Bridge"],
    silhouette: "small arched footbridge with curved rails, plank steps, and flower banks",
    solution: ["1000000001", "1100000011", "1110000111", "0111111110", "1111111111", "1010101011", "1111111111", "0111111110", "1100000011", "1000000001"]
  },
  {
    left: ["stability-rain-umbrella-83", "Rain Umbrella"], right: ["stability-picnic-parasol-84", "Picnic Parasol"],
    silhouette: "wide scalloped umbrella with a pointed top, curved handle, and offset raindrops",
    solution: ["0000100000", "0001110000", "0011111000", "0111111100", "1111111110", "1010101011", "0000100010", "0000100000", "0000110000", "0000011000"]
  },
  {
    left: ["stability-flour-sack-85", "Ribboned Flour Sack"], right: ["stability-grain-sack-86", "Grain Sack"],
    silhouette: "tied pantry sack with a gathered neck, printed label, rounded sides, and heavy base",
    solution: ["1001100000", "0011110000", "0001100000", "1111111000", "1111111100", "1101101110", "1111111111", "1110011111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-pastry-roller-87", "Pastry Roller"], right: ["stability-cinnamon-roller-88", "Cinnamon Roller"],
    silhouette: "long rolling pin with thick center barrel, two handles, and a small flour cloud",
    solution: ["0000000001", "1100000011", "0111111110", "1111111111", "1110110111", "1111111111", "0111111110", "0011111100", "0110000110", "1100000011"]
  },
  {
    left: ["stability-kitchen-scale-89", "Kitchen Scale"], right: ["stability-market-scale-90", "Market Scale"],
    silhouette: "vintage kitchen scale with a wide bowl, round dial, pointer, and solid foot",
    solution: ["0111111100", "1111111110", "0111111100", "0011111000", "0111111100", "1101101110", "1111111111", "0111111110", "0011111100", "0111111110"]
  },
  {
    left: ["stability-robin-birdbath-91", "Robin Birdbath"], right: ["stability-garden-fountain-92", "Garden Fountain"],
    silhouette: "shallow birdbath with a perched bird, slim pedestal, water drops, and round base",
    solution: ["1100010000", "1110111000", "0111111100", "1111111110", "0111111100", "0001100000", "0011110000", "0001100000", "0011110000", "0111111000"]
  },
  {
    left: ["stability-tulip-bouquet-93", "Tulip Bouquet"], right: ["stability-wildflower-bouquet-94", "Wildflower Bouquet"],
    silhouette: "full flower bouquet with five blossoms, crossing stems, leafy wrap, and ribbon tie",
    solution: ["1010101000", "1111111100", "0111111000", "1011110100", "0111111000", "0011110000", "0111111000", "0011110000", "0111111000", "0011110000"]
  },
  {
    left: ["stability-jam-display-shelf-95", "Jam Display Shelf"], right: ["stability-tea-display-shelf-96", "Tea Display Shelf"],
    silhouette: "two-tier pantry shelf with little jars, scalloped trim, sturdy posts, and feet",
    solution: ["1111111111", "1001001001", "1111111111", "1101101111", "1111111111", "1001001001", "1111111111", "1101101111", "1111111111", "1100000011"]
  },
  {
    left: ["stability-apron-hook-97", "Apron Hook"], right: ["stability-utensil-rack-98", "Utensil Rack"],
    silhouette: "wall rack with a top rail, hanging apron and utensils, pegs, and lower hooks",
    solution: ["1111111110", "1010101010", "1111111111", "0101010100", "0111111100", "0111011100", "1111011110", "1111111111", "1101101011", "1001101001"]
  },
  {
    left: ["stability-cookie-tin-99", "Cookie Tin"], right: ["stability-biscuit-tin-100", "Biscuit Tin"],
    silhouette: "decorative round biscuit tin with lid knob, ribbon label, patterned body, and rim",
    solution: ["1001100000", "0011110000", "1111111000", "1111111100", "1011110110", "1111111111", "1101101111", "1111111111", "0111111110", "0011111100"]
  },
  {
    left: ["stability-hearth-stove-101", "Hearth Stove"], right: ["stability-cottage-stove-102", "Cottage Stove"],
    silhouette: "small cast-iron stove with chimney, cooktop, glowing door, side handles, and legs",
    solution: ["0001100000", "0001100000", "0011110000", "0111111000", "1111111100", "1101101110", "1111111111", "1101101111", "1111111111", "1100000011"]
  },
  {
    left: ["stability-mixing-bowl-103", "Mixing Bowl"], right: ["stability-batter-bowl-104", "Batter Bowl"],
    silhouette: "large mixing bowl with a tilted whisk, pouring lip, striped body, and grounded foot",
    solution: ["0000000111", "0000001110", "1000011100", "1100111000", "1111111100", "1110111110", "1111111111", "0111111110", "0011111100", "0111111110"]
  },
  {
    left: ["stability-berry-crate-105", "Berry Crate"], right: ["stability-apple-crate-106", "Apple Crate"],
    silhouette: "wooden produce crate filled with round fruit, slatted sides, corner posts, and feet",
    solution: ["0010101010", "1111111111", "1101101111", "1111111111", "1010101011", "1111111111", "1101101111", "1111111111", "0111111110", "1100000011"]
  },
  {
    left: ["stability-cafe-sign-107", "Cafe Sign"], right: ["stability-bakery-sign-108", "Bakery Sign"],
    silhouette: "hanging shop sign with an arched top, side bracket, central emblem, and lower tassels",
    solution: ["1111000000", "1001100000", "1111111100", "0111111110", "1101101111", "1111111111", "1100110111", "1111111111", "0111111110", "0011001100"]
  },
  {
    left: ["stability-picnic-table-109", "Picnic Table"], right: ["stability-garden-table-110", "Garden Table"],
    silhouette: "outdoor table with a broad plank top, crossed supports, benches, and sturdy feet",
    solution: ["1111111111", "1111111111", "0011111100", "0111111110", "1101101111", "1001101001", "0011110000", "0110011000", "1100001100", "1000000101"]
  },
  {
    left: ["stability-pantry-door-111", "Pantry Door"], right: ["stability-cottage-door-112", "Cottage Door"],
    silhouette: "arched wooden door with inset panels, tiny window, round knob, vines, and stone step",
    solution: ["0001111100", "0110111110", "1111111111", "1100101011", "1111111111", "1100001111", "1111111111", "1101101111", "0111111111", "0110111110"]
  }
];

export const STABILIZATION_PUZZLES_BATCH_2 = Object.freeze([
  ...expandStabilizationPairs(EIGHT_BY_EIGHT_PAIRS, 8),
  ...expandStabilizationPairs(TEN_BY_TEN_PAIRS, 10)
]);
