const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Small nonograms cannot be made readable by drawing on a 12x12 canvas and
// scaling the result down.  These release-critical silhouettes are authored
// directly on their final grid so that every filled cell describes the title.
// Keep the rows visual: 1 = filled, 0 = blank.
const LEGACY_SUMMER_ART = Object.freeze({
  1: ["00100", "01110", "11111", "01110", "00100"], // watermelon slice
  2: ["10101", "01110", "11111", "11111", "01110"], // peach basket
  3: ["00100", "01110", "10101", "11011", "01010"], // cherry pair
  4: ["10101", "11111", "01110", "01110", "00100"], // berry bowl
  5: ["10101", "11111", "11011", "11111", "11111"], // melon crate
  6: ["00011", "00110", "01100", "11010", "10100"], // plum branch
  7: ["00100", "01110", "11111", "00100", "01110"], // sun hat
  8: ["01110", "11011", "10101", "11011", "01110"], // beach ball
  9: ["00110", "00100", "01110", "01010", "01110"], // lemonade glass
  10: ["10101", "01110", "11111", "10101", "11111"], // picnic basket
  11: ["00011", "00011", "00110", "01100", "11000"], // garden trowel
  12: ["10101", "01110", "11111", "01110", "00100"], // sunflower

  13: ["00101000", "01111100", "10101010", "01111100", "00111000", "01111100", "11111110", "01111100"], // tomato trug
  14: ["00011000", "00111100", "00111100", "00111100", "00111100", "01111110", "01011010", "01011010"], // sweet corn
  15: ["00000000", "01111110", "11011011", "01101110", "11011011", "01101110", "11111111", "01111110"], // cucumber tray
  16: ["00100100", "01101110", "00111100", "01111110", "00111100", "00011000", "00111100", "01111110"], // basil bundle
  17: ["00100100", "01111110", "10111101", "11111111", "01111110", "00111100", "01111110", "11111111"], // lemon basket
  18: ["00100100", "01111110", "01011010", "11111111", "01111110", "00111100", "01101110", "01000010"], // pepper bunch
  19: ["01011010", "11111111", "01111110", "11011011", "11111111", "01111110", "10100101", "11111111"], // strawberry patch
  20: ["01011010", "11111111", "01111110", "00111100", "00011000", "01111110", "11111111", "01111110"], // apricot bowl
  21: ["01000010", "11100111", "01111110", "00111100", "01111110", "11111111", "10111101", "11111111"], // pear basket
  22: ["00011000", "00111100", "01101100", "00111110", "01101100", "00111110", "00011000", "00110000"], // grape vine
  23: ["00100100", "01101110", "11111111", "01111110", "00111100", "01111110", "11000011", "01111110"], // fig plate
  24: ["01100110", "11111111", "11011011", "10011001", "10011001", "11011011", "11111111", "01100110"], // orange wedges
  25: ["11111111", "10011001", "10011001", "11111111", "10011001", "10011001", "10011001", "11111111"], // summer window
  26: ["11111111", "10101010", "11111111", "01111110", "01011010", "01011010", "01011010", "11011011"], // striped awning
  27: ["11111111", "10101010", "11111111", "10000001", "11111111", "10100101", "10100101", "11111111"], // market stall
  28: ["11111111", "10011001", "10111101", "10111101", "10111101", "10111101", "10011001", "11111111"], // garden gate
  29: ["00011100", "01111100", "11011110", "11111111", "11111100", "01111000", "00110000", "00110000"], // watering can
  30: ["00011000", "00111100", "00011000", "01111110", "11011011", "10111101", "01111110", "00111100"], // bird bath
  31: ["11111111", "11001100", "11001100", "00110011", "00110011", "11001100", "11001100", "11111111"], // picnic blanket
  32: ["00100100", "01111110", "01011010", "11111111", "11011011", "11111111", "11111111", "01111110"], // sandcastle
  33: ["00011000", "00111100", "01111110", "11011011", "10111101", "10011001", "11000011", "01111110"], // seashell
  34: ["00011000", "00011100", "00011110", "00011011", "00011000", "01111110", "11111111", "01111110"], // sailboat
  35: ["00011000", "00111100", "01111110", "11111111", "10111101", "00011000", "00011000", "00111100"], // sun umbrella
  36: ["00100100", "01111110", "01000010", "01111110", "00111100", "00111100", "00111100", "01111110"], // beach bucket
  37: ["00111000", "01111110", "01100111", "01100111", "01111110", "01100100", "01111100", "00111000"], // lemonade pitcher
  38: ["00011000", "01111110", "11111111", "10111101", "11111111", "01111110", "11111111", "01111110"], // fruit tart
  39: ["00110000", "01111000", "11111100", "00111100", "01111110", "00011110", "00111111", "01111110"], // picnic sandwiches
  40: ["01011010", "11111111", "10100101", "11111111", "01111110", "00111100", "01111110", "00111100"], // summer salad

  43: ["0001111000", "0011111100", "0011011100", "0011111100", "0011111100", "0001111000", "0000110000", "0000110000", "0001111000", "0001111000"], // ice pop
  46: ["0011001100", "0011001100", "0011111100", "0011111100", "0011001100", "0011111100", "0011001100", "0110000110", "1100000011", "1100000011"], // garden chair
  63: ["0011001100", "0111101110", "1111111111", "0111101110", "0011001100", "0000110000", "0011111100", "0111111110", "1100000011", "0111111110"], // cucumber roll plate
  70: ["0000000110", "0000001111", "0000011110", "0000111100", "0001111000", "0011110000", "0111100000", "1111000000", "1110000000", "0100000000"], // fruit skewer
  72: ["1000000001", "1100000011", "0110000110", "0011001100", "0001111000", "0001111000", "0011001100", "0110000110", "1100000011", "1000000001"], // orchard path
  75: ["1000100001", "1101110011", "0111110110", "0011111100", "0001111000", "0011111100", "0110110110", "1100110011", "1000110001", "1000110001"], // vine trellis

  79: ["000000000000", "000011110000", "000111111000", "001100001100", "011111111110", "000011110000", "000011110000", "001111111100", "011000000110", "110000000011", "110000000011", "110000000011"], // seaside table
  85: ["100000000001", "110000000011", "011000000110", "001100001100", "000111111000", "001111111100", "011011110110", "111111111111", "001100001100", "011000000110", "110000000011", "111111111111"], // sunset feast
  86: ["001000000100", "011100001110", "001000000100", "000001100000", "000011110000", "000111111000", "001111111100", "011111111110", "111111111111", "110000000011", "110000000011", "111111111111"] // lantern table
});

// Claude's release-art review found that these motifs became generic blobs
// when 12x12 drawing primitives were rounded onto smaller grids.  They are
// therefore authored directly at their shipped dimensions.  Each silhouette
// keeps the title's identifying feature (wedge, handle, pedestal, stick,
// converging path, lattice, table legs, lantern, and so on) instead of merely
// being a mathematically unique answer.
export const REVIEWED_SUMMER_ART = Object.freeze({
  1: [
    "00001",
    "00011",
    "00111",
    "01111",
    "11111"
  ], // watermelon wedge
  13: [
    "00111100",
    "01000010",
    "10110101",
    "01111110",
    "01000010",
    "01111110",
    "01011010",
    "01111110"
  ], // tomato trug: handle, three tomatoes, slatted basket
  15: [
    "00000000",
    "01111110",
    "01000010",
    "01101110",
    "01011010",
    "01101110",
    "01000010",
    "01111110"
  ], // cucumber tray: rim and three long slices
  17: [
    "00011000",
    "00100100",
    "01000010",
    "10100101",
    "01011010",
    "01111110",
    "01000010",
    "00111100"
  ], // lemon basket: arched handle and two pointed lemons
  20: [
    "00000000",
    "00100100",
    "01111110",
    "01011010",
    "00100100",
    "01111110",
    "00111100",
    "00011000"
  ], // apricot bowl: three fruit over a tapered bowl
  21: [
    "00100100",
    "01101110",
    "01011010",
    "00100100",
    "01111110",
    "01000010",
    "01011010",
    "01111110"
  ], // pear basket: narrow stems, broad fruit, square basket
  23: [
    "00100100",
    "01101110",
    "01011010",
    "01111110",
    "00100100",
    "10000001",
    "01111110",
    "00111100"
  ], // fig plate: two teardrop figs and an oval plate
  30: [
    "00001100",
    "00011010",
    "00111100",
    "11111111",
    "00111100",
    "00011000",
    "00111100",
    "01111110"
  ], // bird bath: perched bird, basin, pedestal and foot
  32: [
    "00100100",
    "01101110",
    "01011010",
    "11111111",
    "10111101",
    "11111111",
    "10011001",
    "11111111"
  ], // sandcastle: two flags, towers, gate and base
  43: [
    "0001111000",
    "0010000100",
    "0101000010",
    "0100000010",
    "0100100010",
    "0100000010",
    "0011111100",
    "0000110000",
    "0000110000",
    "0000110000"
  ], // ice pop: rounded frozen bar with bite and stick
  46: [
    "0011001100",
    "0011001100",
    "0011111100",
    "0011001100",
    "0011111100",
    "0010000100",
    "0011111100",
    "0011001100",
    "0110000110",
    "1100000011"
  ], // garden chair: back slats, seat and four legs
  63: [
    "0000000000",
    "0011101110",
    "0101010001",
    "0101010001",
    "0011101110",
    "0000110000",
    "0110000110",
    "1001111001",
    "1000000001",
    "0111111110"
  ], // cucumber rolls: two hollow rolls on an oval plate
  70: [
    "0000000110",
    "0000001111",
    "0000011010",
    "0000111100",
    "0001101000",
    "0011110000",
    "0010100000",
    "0111100000",
    "1100000000",
    "1000000000"
  ], // fruit skewer: alternating fruit pieces on a diagonal stick
  72: [
    "1100000011",
    "1010000101",
    "1001001001",
    "0001111000",
    "0001001000",
    "0010000100",
    "0010000100",
    "0100000010",
    "0100000010",
    "1000000001"
  ], // orchard path: tree rows and a path widening toward the viewer
  75: [
    "1000100001",
    "1101110011",
    "1010101101",
    "1101110011",
    "1010101101",
    "1101110011",
    "1010101101",
    "1101110011",
    "1000100001",
    "1000100001"
  ], // vine trellis: repeated lattice with climbing leaves
  79: [
    "000001100000",
    "000011110000",
    "000110011000",
    "001100001100",
    "000001100000",
    "001001100100",
    "011111111110",
    "000011110000",
    "000011110000",
    "000110011000",
    "001100001100",
    "011000000110"
  ], // seaside table: parasol, cups, tabletop and splayed legs
  85: [
    "100000000001",
    "110000000011",
    "010010010010",
    "000111111000",
    "001001001100",
    "011111111110",
    "100100001001",
    "111111111111",
    "001000000100",
    "001000000100",
    "011000000110",
    "110000000011"
  ], // sunset feast: sun rays, dishes, long table and legs
  86: [
    "000001100000",
    "000011110000",
    "000110011000",
    "000101101000",
    "000111111000",
    "000011110000",
    "001111111100",
    "011001100110",
    "111111111111",
    "001000000100",
    "011000000110",
    "110000000011"
  ] // lantern table: glowing lantern centered above a table
});

// These final-grid drawings are constrained not only for readability but also
// for a single valid nonogram solution. Keep this separate from the visual
// review catalog above so both contracts remain independently testable.
const UNIQUE_SUMMER_ART_OVERRIDES = Object.freeze({
  6: ["01011", "00110", "01100", "11010", "10100"],
  11: ["10011", "00011", "00110", "01100", "11000"],
  17: ["00011000", "00100100", "01100010", "10100101", "01011010", "01111110", "01000010", "00111100"],
  43: ["0101111000", "0011000100", "0101000010", "0100000010", "0100100010", "0100000010", "0011111100", "0000110000", "0000110000", "0000110000"],
  55: ["1000000000", "0111000000", "0111000000", "0111100000", "0001110000", "0000111000", "0000011110", "0000001110", "0000001110", "0100000000"],
  63: ["0100000000", "0011101110", "0101010001", "0101010001", "0011101110", "0000110000", "0111000110", "1001111001", "1000000001", "0111111110"],
  72: ["1100000011", "1010000101", "1001001001", "0001111000", "0001001000", "0010000100", "0010000100", "0100000010", "0100000010", "1100000011"],
  78: ["000000000001", "000000000010", "001000000110", "000111111100", "000111111000", "000111111000", "000111110000", "000111111000", "000111111000", "000000000000", "000000000000", "000000000010"],
  79: ["000001100000", "001011110000", "000110011000", "001100001100", "000001100000", "001001100100", "011111111110", "000011110000", "000011110000", "000110011000", "001100001100", "011000000110"],
  85: ["000000000011", "110000000011", "010010010010", "000111111000", "001001001100", "011111111110", "100100001001", "111111111111", "001000000100", "001000000100", "011000000110", "110000000011"],
  94: ["000001000000", "000000000000", "011111111101", "001001100100", "001100100100", "001000100100", "001111111110", "001010110100", "001100101100", "001100101100", "001111111110", "000000100000"],
  100: ["000010000000", "001110000000", "011110000000", "001110000000", "000111000000", "000011100000", "000001110000", "000000111101", "000000011110", "000000011110", "000000011110", "000000100000"]
});

// A shipped nonogram must use the full vertical frame. Procedural recipes are
// authored in a 12-unit coordinate space, so rounding them onto 10x10/12x12
// grids can otherwise leave blank rows at the top or bottom. Stretch only the
// occupied vertical bounds (never the reviewed final-grid overrides) so the
// title-specific silhouette remains intact while the puzzle fills its frame.
function fitProceduralArtToVerticalFrame(rows) {
  const firstFilledRow = rows.findIndex((row) => row.includes("1"));
  const lastFilledRow = rows.findLastIndex((row) => row.includes("1"));
  if (firstFilledRow <= 0 && lastFilledRow === rows.length - 1) return rows;
  if (firstFilledRow < 0 || firstFilledRow === lastFilledRow) return rows;

  return Array.from({ length: rows.length }, (_, rowIndex) => {
    const sourceIndex = Math.round(
      firstFilledRow + ((lastFilledRow - firstFilledRow) * rowIndex / (rows.length - 1))
    );
    return rows[sourceIndex];
  });
}

function renderSummerPuzzleArt(size, number) {
  // Small silhouettes and every motif flagged during release art review use
  // direct final-grid authoring. The remaining title-specific recipes below
  // are rendered at their shipped size. Never replace reviewed entries with
  // scaled primitives: rounding made unrelated food and furniture collapse
  // into the same generic blob in the previous release candidate.
  const nativeArt = UNIQUE_SUMMER_ART_OVERRIDES[number]
    ?? REVIEWED_SUMMER_ART[number]
    ?? (number <= 12 ? LEGACY_SUMMER_ART[number] : null);
  if (nativeArt) {
    if (nativeArt.length !== size || nativeArt.some((row) => row.length !== size)) {
      throw new Error(`Invalid native summer art dimensions for ${number}: expected ${size}x${size}`);
    }
    return [...nativeArt];
  }
  const cells = Array.from({ length: size }, () => Array(size).fill("0"));
  const xy = (value) => Math.round((value / 11) * (size - 1));
  const put = (x, y, value = "1") => {
    const col = clamp(xy(x), 0, size - 1);
    const row = clamp(xy(y), 0, size - 1);
    cells[row][col] = value;
  };
  const line = (x1, y1, x2, y2, width = 0) => {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1) * 2;
    for (let step = 0; step <= steps; step += 1) {
      const x = x1 + ((x2 - x1) * step / steps);
      const y = y1 + ((y2 - y1) * step / steps);
      put(x, y);
      if (width) { put(x + width, y); put(x - width, y); }
    }
  };
  const box = (x1, y1, x2, y2, filled = true) => {
    for (let y = y1; y <= y2; y += 0.55) {
      for (let x = x1; x <= x2; x += 0.55) {
        if (filled || x < x1 + 0.7 || x > x2 - 0.7 || y < y1 + 0.7 || y > y2 - 0.7) put(x, y);
      }
    }
  };
  const oval = (cx, cy, rx, ry, filled = true) => {
    for (let y = cy - ry; y <= cy + ry; y += 0.35) {
      for (let x = cx - rx; x <= cx + rx; x += 0.35) {
        const distance = ((x - cx) ** 2 / rx ** 2) + ((y - cy) ** 2 / ry ** 2);
        if (distance <= 1 && (filled || distance > 0.48)) put(x, y);
      }
    }
  };
  const fruit = (x, y, radius = 1.25, leaf = true) => {
    oval(x, y, radius, radius, true);
    if (leaf) { put(x + radius * 0.65, y - radius); put(x + radius * 1.05, y - radius * 1.25); }
  };
  const bowl = (x1 = 2, x2 = 9, y = 7) => {
    line(x1, y, x2, y); line(x1 + 1, y + 1, x2 - 1, y + 3); line(x1 + 1, y + 3, x2 - 1, y + 3);
  };
  const basket = (y = 6.5) => {
    box(2, y, 9, 10, true); line(2.5, y, 4, 3.5); line(4, 3.5, 7, 3.5); line(7, 3.5, 8.5, y);
  };
  const vessel = (x = 4, y = 3, w = 4, h = 7) => {
    box(x, y, x + w, y + h, true); line(x + 1, y - 1, x + w - 1, y - 1); line(x + 1, y - 1, x + 1, y);
  };
  const flower = (x = 5.5, y = 3, radius = 1.2) => {
    fruit(x, y, radius, false); put(x - radius, y); put(x + radius, y); put(x, y - radius); put(x, y + radius);
    line(x, y + radius, x, 10); put(x - 1, 7); put(x + 1, 8);
  };
  const fabric = (top = 2, bottom = 5) => {
    line(1, top, 10, top); line(1, top, 2, bottom); line(2, bottom, 9, bottom); line(9, bottom, 10, top);
  };
  const plate = () => { oval(5.5, 8, 4.5, 1.6, false); };
  const windowFrame = () => { box(1.5, 1.5, 9.5, 10, false); line(5.5, 1.5, 5.5, 10); line(1.5, 5.5, 9.5, 5.5); };

  switch (number) {
    case 1: line(1, 4, 5.5, 10); line(5.5, 10, 10, 4); line(10, 4, 1, 4); put(3, 5); put(5, 7); put(8, 5); break;
    case 2: basket(); fruit(4, 5); fruit(6.5, 5); break;
    case 3: fruit(3.5, 7, 1.6, false); fruit(7.5, 7, 1.6, false); line(3.5, 5.5, 5.5, 2); line(7.5, 5.5, 5.5, 2); break;
    case 4: fruit(3, 6, 1); fruit(5.5, 5, 1); fruit(8, 6, 1); bowl(); break;
    case 5: box(1.5, 5, 9.5, 10, true); line(4, 5, 4, 10); line(7, 5, 7, 10); fruit(3, 4, 1); fruit(6, 3.5, 1); fruit(8.5, 4, 1); break;
    case 6: line(1, 9, 10, 2, 1); fruit(3, 7, 1); fruit(5.5, 5, 1); fruit(8, 3, 1); break;
    case 7: oval(5.5, 6, 5, 1.7, true); box(3.5, 3, 7.5, 6, true); break;
    case 8: oval(5.5, 6, 4, 4, false); line(2, 4, 9, 7); line(4, 2, 7, 9); break;
    case 9: box(3, 3, 8, 10, true); line(2.5, 3, 8.5, 3); line(6, 3, 8.5, 0.5); put(4, 6, "0"); put(6, 8, "0"); break;
    case 10: basket(6); box(3, 6.5, 5, 8, false); box(6, 6.5, 8, 8, false); break;
    case 11: line(2, 10, 8, 4, 1); box(7, 1.5, 10, 5, true); break;
    case 12: flower(5.5, 3, 2); break;
    case 13: basket(7); fruit(3.2, 6, 1); fruit(5.5, 5.5, 1); fruit(7.8, 6, 1); break;
    case 14: oval(5.5, 6, 2.2, 4.5, true); line(3.5, 3, 7.5, 9); line(7.5, 3, 3.5, 9); break;
    case 15: box(1.5, 6, 9.5, 10, false); oval(3.5, 5, 1.2, 2.2); oval(7.5, 5, 1.2, 2.2); break;
    case 16: line(3.5, 2, 3.5, 10); line(5.5, 1, 5.5, 10); line(7.5, 2, 7.5, 10); put(2.5, 4); put(4.5, 6); put(6.5, 3); put(8.5, 7); break;
    case 17: basket(); fruit(3.5, 5); fruit(6, 4.5); fruit(8, 5); break;
    case 18: fruit(3.2, 5.5, 1.2); fruit(5.5, 4.5, 1.2); fruit(7.8, 5.5, 1.2); line(2, 7, 9, 7); break;
    case 19: fruit(2.5, 7, 1); fruit(4.5, 5, 1); fruit(6.5, 7, 1); fruit(8.5, 5, 1); put(3.5, 9); put(7.5, 9); break;
    case 20: fruit(3, 6, 1.4); fruit(5.5, 5, 1.4); fruit(8, 6, 1.4); bowl(); break;
    case 21: basket(); oval(4, 5, 1.2, 1.8); oval(7, 5, 1.2, 1.8); break;
    case 22: line(5.5, 1, 5.5, 10); fruit(3, 3, 1); fruit(7.5, 4, 1); fruit(3.5, 7, 1); fruit(8, 8, 1); break;
    case 23: oval(3.5, 6, 1.4, 1.8); oval(7.5, 6, 1.4, 1.8); plate(); break;
    case 24: oval(3, 6, 1.8, 3); oval(8, 6, 1.8, 3); line(1.5, 6, 9.5, 6); break;
    case 25: windowFrame(); put(3.5, 4); put(7.5, 3); line(2, 9, 5, 7); break;
    case 26: fabric(2, 5); line(2, 2, 2, 10); line(9, 2, 9, 10); line(4, 2, 4, 5); line(7, 2, 7, 5); break;
    case 27: fabric(2, 4); box(2, 4, 9, 9, false); box(3, 6, 5, 9, true); box(6, 6, 8, 9, true); break;
    case 28: box(2, 1, 9, 10, false); line(5.5, 1, 5.5, 10); line(2, 5.5, 5.5, 8); line(9, 5.5, 5.5, 8); break;
    case 29: vessel(3, 5, 5, 5); line(8, 6, 10, 4); line(3, 6, 1, 5); break;
    case 30: oval(5.5, 6.5, 4, 3, false); line(5.5, 3.5, 5.5, 1); put(5.5, 7); break;
    case 31: box(1, 2, 10, 10, true); for (let y = 3; y < 10; y += 2) for (let x = 2; x < 10; x += 2) put(x, y, "0"); break;
    case 32: box(2, 6, 9, 10, true); box(3, 4, 5, 6, true); box(6, 3, 8, 6, true); put(4, 2); put(7, 1); break;
    case 33: oval(5.5, 6, 4.5, 3.3, false); line(2, 6, 9, 6); line(5.5, 3, 5.5, 9); break;
    case 34: line(2, 8, 9, 8); line(2, 8, 5.5, 4); line(9, 8, 5.5, 4); line(5.5, 4, 5.5, 1); line(5.5, 1, 9, 5); break;
    case 35: oval(5.5, 3, 4.5, 2.5, true); line(5.5, 3, 5.5, 10); line(3, 10, 8, 10); break;
    case 36: box(3, 5, 8, 10, true); line(2, 5, 9, 5); line(3, 5, 5, 2); line(8, 5, 6, 2); break;
    case 37: vessel(3, 3, 5, 7); line(8, 4, 10, 3); line(8, 6, 10, 5); break;
    case 38: plate(); oval(5.5, 6.5, 4, 2.4, true); fruit(4, 5.5, 0.8); fruit(7, 5.5, 0.8); break;
    case 39: box(1, 5, 4.5, 8, true); box(4, 3, 7.5, 6, true); box(7, 5, 10, 8, true); line(1, 9, 10, 9); break;
    case 40: fruit(2.5, 5, 1); fruit(4.5, 4, 1); fruit(6.5, 5, 1); fruit(8.5, 4, 1); bowl(); break;
    case 41: box(2.5, 5, 8.5, 9.5, true); oval(5.5, 5, 3, 2, true); fruit(4, 3.5, 0.8); fruit(7, 3.5, 0.8); break;
    case 42: bowl(); oval(5.5, 5, 3.5, 2.5, true); put(4, 4, "0"); put(7, 5, "0"); break;
    case 43: box(4, 2, 7, 8, true); line(5.5, 8, 5.5, 11); put(5, 4, "0"); break;
    case 44: oval(5.5, 3, 3, 2.5, true); line(3.5, 5, 5.5, 10); line(7.5, 5, 5.5, 10); break;
    case 45: box(2, 4, 9, 9, true); box(3, 5, 8, 7, false); put(3, 3); put(7, 2); break;
    case 46: line(3, 2, 3, 9); line(8, 2, 8, 9); line(3, 6, 8, 6); line(3, 9, 1.5, 11); line(8, 9, 9.5, 11); line(3, 3, 8, 3); break;
    case 47: box(3, 5, 8, 10, true); flower(5.5, 3, 1.6); break;
    case 48: oval(3.5, 5, 2.5, 3, true); oval(7.5, 5, 2.5, 3, true); line(5.5, 5, 5.5, 10); put(4.5, 1); put(6.5, 1); break;
    case 49: line(5.5, 1, 5.5, 10, 1); oval(2.5, 5, 2, 1.5, true); oval(8.5, 5, 2, 1.5, true); break;
    case 50: oval(5.5, 5.5, 4, 4, true); put(4, 4, "0"); put(7, 4, "0"); put(5.5, 7, "0"); line(5.5, 1.5, 5.5, 0); break;
    case 51: oval(5.5, 5.5, 4, 3, true); line(3, 3, 2, 1); line(8, 3, 9, 1); line(5.5, 3, 5.5, 8); break;
    case 52: flower(3, 4, 1); flower(5.5, 3, 1); flower(8, 4, 1); line(2, 8, 9, 8); break;
    case 53: line(5.5, 1, 5.5, 10); for (let y = 2; y < 9; y += 2) { put(4.5, y); put(6.5, y + 1); } break;
    case 54: basket(7); flower(3, 5, 1); flower(5.5, 4, 1); flower(8, 5, 1); break;
    case 55: line(2, 2, 9, 9, 1); oval(2.5, 2.5, 1.5, 1.5, false); oval(8.5, 8.5, 1.5, 1.5, false); break;
    case 56: box(1.5, 4, 9.5, 10, true); line(1.5, 4, 9.5, 4); line(3, 4, 3, 10); line(8, 4, 8, 10); break;
    case 57: box(1, 1, 10, 10, true); for (let y = 1; y <= 10; y += 2) for (let x = 1; x <= 10; x += 2) put(x, y, "0"); break;
    case 58: vessel(3.5, 2, 4, 8); line(3.5, 5, 2, 5); line(7.5, 5, 9, 5); break;
    case 59: vessel(4, 2, 3, 8); line(4, 1, 7, 1); put(5.5, 5, "0"); break;
    case 60: line(2, 9, 9, 2, 1); oval(8.5, 2.5, 1.5, 1.5, true); break;
    case 61: box(2, 4, 9, 8, true); line(2, 6, 9, 6); fruit(4, 3, 0.8); fruit(7, 3, 0.8); break;
    case 62: bowl(); fruit(3, 6, 0.8); oval(5.5, 5, 0.8, 2); fruit(8, 6, 0.8); break;
    case 63: oval(3, 5, 1, 2.5, true); oval(5.5, 6, 1, 2.5, true); oval(8, 5, 1, 2.5, true); plate(); break;
    case 64: oval(5.5, 6, 4, 3, true); line(2, 6, 9, 6); put(5.5, 2); plate(); break;
    case 65: box(2.5, 4, 8.5, 9.5, true); oval(5.5, 4, 3, 2, true); fruit(5.5, 2.5, 0.8); break;
    case 66: vessel(3.5, 3, 4, 7); line(4, 5, 7, 5); line(7.5, 4, 9, 3); put(5.5, 7, "0"); break;
    case 67: vessel(3, 3, 5, 7); oval(5.5, 4, 1, 1); oval(4.5, 6, 1, 1); oval(6.5, 8, 1, 1); break;
    case 68: oval(5.5, 5.5, 4, 4, true); put(5.5, 5.5, "0"); put(4, 4, "0"); put(7, 7, "0"); break;
    case 69: oval(5.5, 6, 4, 3, true); fruit(4, 5, 0.8); fruit(7, 5, 0.8); plate(); break;
    case 70: line(2, 9, 9, 2, 1); fruit(3, 8, 0.9); fruit(5, 6, 0.9); fruit(7, 4, 0.9); fruit(9, 2, 0.9); break;
    case 71: box(1, 7, 10, 10, true); basket(6); oval(2, 3, 1.2, 1.2); oval(9, 3, 1.2, 1.2); break;
    case 72: line(5.5, 1, 5.5, 10); line(5.5, 3, 2, 6); line(5.5, 5, 9, 8); put(3, 3); put(8, 5); break;
    case 73: windowFrame(); box(2, 7, 5, 9, true); box(6, 6, 9, 9, true); break;
    case 74: windowFrame(); line(1.5, 1.5, 0, 5.5); line(1.5, 10, 0, 5.5); line(9.5, 1.5, 11, 5.5); line(9.5, 10, 11, 5.5); break;
    case 75: line(2, 10, 2, 2); line(5.5, 10, 5.5, 1); line(9, 10, 9, 2); line(2, 2, 5.5, 5); line(5.5, 1, 9, 4); break;
    case 76: oval(3, 8.5, 2, 2, false); oval(8, 8.5, 2, 2, false); line(3, 8.5, 8, 8.5); line(3, 8.5, 5, 4); line(5, 4, 8, 8.5); line(5, 4, 8, 3); box(7, 2, 9, 4, true); break;
    case 77: box(2, 3, 9, 8, false); line(1, 9, 10, 9); fruit(4, 6, 1); fruit(7, 6, 1); break;
    case 78: box(3, 3, 8, 9, true); line(3, 3, 1, 1); line(8, 3, 10, 1); break;
    case 79: box(2, 6, 9, 9, true); line(2, 6, 4, 3); line(9, 6, 7, 3); line(4, 3, 7, 3); break;
    case 80: for (let x = 1; x <= 10; x += 2) oval(x, 5.5 + ((x % 4) - 1), 1.4, 1.1, false); line(1, 8, 10, 8); break;
    case 81: line(5.5, 1, 5.5, 10); for (let spoke = 0; spoke < 8; spoke += 1) { const angle = spoke * Math.PI / 4; line(5.5, 5.5, 5.5 + 4 * Math.cos(angle), 5.5 + 4 * Math.sin(angle)); } break;
    case 82: box(4, 2, 7, 9, true); box(3, 1, 8, 3, true); line(2, 10, 9, 10); put(5.5, 5, "0"); break;
    case 83: line(2, 2, 2, 10); line(2, 2, 9, 4); line(2, 6, 8, 7); break;
    case 84: oval(4, 6, 2.3, 2.3, false); oval(7.5, 6, 2.3, 2.3, false); line(1.5, 6, 10, 6); break;
    case 85: plate(); line(1, 3, 10, 3); fruit(3, 6, 1); fruit(5.5, 5, 1); fruit(8, 6, 1); line(2, 10, 9, 10); break;
    case 86: box(1.5, 6, 9.5, 10, true); vessel(4.5, 2, 2, 4); put(2.5, 4); put(8.5, 4); break;
    case 87: box(2, 7, 9, 10, true); flower(3.5, 5, 1); flower(7.5, 4, 1); vessel(5, 5, 1, 3); break;
    case 88: plate(); fruit(2.5, 6, 1); oval(4.5, 5, 1, 2); fruit(6.5, 6, 1); oval(8.5, 5, 1, 2); break;
    case 89: vessel(3.5, 4, 4, 6); line(7.5, 5, 10, 4); line(3.5, 5, 2, 5); put(5.5, 2); break;
    case 90: box(2.5, 5, 8.5, 10, true); oval(5.5, 5, 3, 2, true); flower(5.5, 3, 1); break;
    case 91: vessel(3, 2, 5, 8); put(4, 5, "0"); put(6, 4, "0"); put(5, 7, "0"); put(7, 8, "0"); break;
    case 92: basket(6); oval(4, 4.5, 1.4, 1.4); oval(7, 4.5, 1.4, 1.4); line(2, 1, 9, 1); break;
    case 93: fabric(2, 5); line(2, 2, 2, 10); line(9, 2, 9, 10); put(4, 3, "0"); put(7, 4, "0"); break;
    case 94: windowFrame(); line(1.5, 10, 4, 7); line(9.5, 10, 7, 7); line(1, 2, 3, 4); break;
    case 95: line(2, 10, 2, 4); line(5.5, 10, 5.5, 2); line(9, 10, 9, 5); fruit(2, 3, 1); fruit(5.5, 1, 1); fruit(9, 4, 1); break;
    case 96: box(1, 8, 10, 10, true); basket(7); line(1, 2, 10, 2); put(2, 4); put(9, 5); break;
    case 97: oval(2.5, 4, 1.5, 1.5, true); oval(5.5, 3, 1.5, 1.5, true); oval(8.5, 4, 1.5, 1.5, true); line(2.5, 5.5, 5.5, 10); line(5.5, 4.5, 5.5, 10); line(8.5, 5.5, 5.5, 10); break;
    case 98: line(1, 2, 10, 2); for (let x = 2; x < 10; x += 2) { line(x, 2, x + 1, 5); line(x + 1, 5, x + 2, 2); } break;
    case 99: oval(5.5, 5.5, 4.5, 4.5, false); line(5.5, 1, 5.5, 10); line(1, 5.5, 10, 5.5); line(2.5, 2.5, 8.5, 8.5); break;
    case 100: line(2, 2, 9, 9, 1); oval(8.5, 9, 2, 1.5, true); oval(3, 2, 1.5, 1.5, true); put(5, 5, "0"); break;
    default: throw new Error(`Missing authored summer puzzle art for ${number}`);
  }

  return fitProceduralArtToVerticalFrame(cells.map((row) => row.join("")));
}

const sizeForSummerPuzzle = (number) => {
  if (number <= 12) return 5;
  if (number <= 40) return 8;
  if (number <= 76) return 10;
  return 12;
};

// A complete, immutable final-grid catalog makes omissions visible to tests
// and ensures the game, review sheet, and QA all inspect the same artwork.
export const NATIVE_SUMMER_ART = Object.freeze(Object.fromEntries(
  Array.from({ length: 100 }, (_, index) => {
    const number = index + 1;
    return [number, Object.freeze(renderSummerPuzzleArt(sizeForSummerPuzzle(number), number))];
  })
));

export function buildSummerPuzzleArt(size, number) {
  const rows = NATIVE_SUMMER_ART[number];
  if (!rows) throw new Error(`Missing authored summer puzzle art for ${number}`);
  if (rows.length !== size || rows.some((row) => row.length !== size)) {
    throw new Error(`Invalid summer art dimensions for ${number}: expected ${size}x${size}`);
  }
  return [...rows];
}
