import { NATIVE_SUMMER_ART } from "./summerPuzzleArt.js";

const MORNING_TABLE_MOTIFS = Object.freeze([
  ["Morning Shortcake", "아침 쇼트케이크", 41],
  ["Frosted Fruit Bowl", "서리 과일 그릇", 42],
  ["Berry Ice Pop", "베리 아이스바", 43],
  ["Breakfast Cone", "아침 와플 콘", 44],
  ["Jam Toast", "잼 토스트", 45],
  ["Window Chair", "창가 의자", 46],
  ["Daisy Pot", "데이지 화분", 47],
  ["Paper Butterfly", "종이 나비", 48],
  ["Blue Dragonfly", "파란 잠자리", 49],
  ["Spotted Ladybird", "점박이 무당벌레", 50],
  ["Honey Bee", "꿀벌", 51],
  ["Daisy Chain", "데이지 화환", 52],
  ["Lavender Sprig", "라벤더 한 줄기", 53],
  ["Rose Basket", "장미 바구니", 54],
  ["Herb Scissors", "허브 가위", 55],
  ["Wooden Tray", "나무 쟁반", 56],
  ["Gingham Napkin", "깅엄 냅킨", 57],
  ["Tea Flask", "차 보온병", 58],
  ["Orchard Juice", "과수원 주스", 59],
  ["Golden Serving Spoon", "황금 서빙 스푼", 60]
]);

const BAKING_BENCH_MOTIFS = Object.freeze([
  ["Tomato Sandwich", "토마토 샌드위치", 61],
  ["Corn Salad", "옥수수 샐러드", 62],
  ["Cucumber Rolls", "오이말이", 63],
  ["Peach Pie", "복숭아 파이", 64],
  ["Cherry Cake", "체리 케이크", 65],
  ["Melon Soda", "멜론 소다", 66],
  ["Berry Parfait", "베리 파르페", 67],
  ["Lemon Cookie", "레몬 쿠키", 68],
  ["Plum Tart", "자두 타르트", 69],
  ["Fruit Skewer", "과일 꼬치", 70],
  ["Garden Picnic", "정원 피크닉", 71],
  ["Orchard Path", "과수원 길", 72],
  ["Sunny Pantry", "햇살 팬트리", 73],
  ["Open Shutters", "열린 덧창", 74],
  ["Vine Trellis", "덩굴 시렁", 75],
  ["Produce Bicycle", "농산물 자전거", 76],
  ["Bakery Sign", "베이커리 표지판", 77],
  ["Canvas Tote", "캔버스 가방", 78],
  ["Cooling Table", "식힘 테이블", 79],
  ["Pastry Garland", "페이스트리 가랜드", 80]
]);

const GARDEN_NOOK_MOTIFS = Object.freeze([
  ["Seedling Tray", "모종 쟁반", 81],
  ["Tulip Watering Can", "튤립 물뿌리개", 82],
  ["Garden Trowel", "정원 모종삽", 83],
  ["Herb Marker", "허브 이름표", 84],
  ["Woven Plant Basket", "화분 바구니", 85],
  ["Snail Visitor", "달팽이 손님", 86],
  ["Birdhouse", "새집", 87],
  ["Mushroom Cluster", "버섯 무리", 88],
  ["Clover Patch", "클로버 밭", 89],
  ["Sunflower Pot", "해바라기 화분", 90],
  ["Garden Boots", "정원 장화", 91],
  ["Twine Spool", "노끈 실패", 92],
  ["Leaf Press", "나뭇잎 압화기", 93],
  ["Terracotta Pots", "테라코타 화분", 94],
  ["Window Fern", "창가 고사리", 95],
  ["Butterfly House", "나비 집", 96],
  ["Rain Barrel", "빗물 통", 97],
  ["Bean Trellis", "콩 시렁", 98],
  ["Garden Gate", "정원 문", 99],
  ["Flower Arch", "꽃 아치", 100]
]);

const VILLAGE_CART_MOTIFS = Object.freeze([
  ["Market Cart", "장터 손수레", 21],
  ["Striped Awning", "줄무늬 차양", 22],
  ["Apple Crate", "사과 상자", 23],
  ["Bread Basket", "빵 바구니", 24],
  ["Flower Bucket", "꽃 양동이", 25],
  ["Chalkboard Sign", "칠판 간판", 26],
  ["Coin Purse", "동전 지갑", 27],
  ["Parcel Stack", "소포 더미", 28],
  ["Village Bell", "마을 종", 29],
  ["Milk Churn", "우유 통", 30],
  ["Jam Display", "잼 진열대", 31],
  ["Produce Scale", "농산물 저울", 32],
  ["Ribbon Bundle", "리본 묶음", 33],
  ["Lantern Hook", "등불 걸이", 34],
  ["Market Umbrella", "장터 파라솔", 35],
  ["Wicker Hamper", "라탄 바구니", 36],
  ["Village Bicycle", "마을 자전거", 37],
  ["Cobblestone Lamp", "돌길 가로등", 38],
  ["Cottage Direction Sign", "오두막 이정표", 39],
  ["Festival Cart", "축제 손수레", 40]
]);

const STARLIGHT_SHELF_MOTIFS = Object.freeze([
  ["Star Lantern", "별빛 등불", 41],
  ["Crescent Clock", "초승달 시계", 42],
  ["Moon Tea Cup", "달빛 찻잔", 43],
  ["Constellation Jar", "별자리 유리병", 44],
  ["Night Window", "밤 창문", 45],
  ["Sleepy Candle", "졸린 촛불", 46],
  ["Comet Postcard", "혜성 엽서", 47],
  ["Starry Quilt", "별무늬 이불", 48],
  ["Moonflower Vase", "달맞이꽃 화병", 49],
  ["Firefly Bottle", "반딧불이 병", 50],
  ["Telescope", "망원경", 51],
  ["Cloud Pillow", "구름 베개", 52],
  ["Nightcap", "잠자리 모자", 53],
  ["Owl Bookmark", "부엉이 책갈피", 54],
  ["Midnight Cocoa", "한밤의 코코아", 55],
  ["Dream Journal", "꿈 일기장", 56],
  ["Star Garland", "별 가랜드", 57],
  ["Moon Shelf", "달빛 선반", 58],
  ["Wish Box", "소원 상자", 59],
  ["Starlight Workshop", "별빛 작업실", 60]
]);

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function rotateClockwise(rows) {
  const size = rows.length;
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => rows[size - 1 - column][row]).join("")
  );
}

function mirrorHorizontally(rows) {
  return rows.map((row) => [...row].reverse().join(""));
}

function fitArtToFrame(rows, targetSize = 10) {
  const cells = rows.map((row) => [...row]);
  const occupiedRows = cells.flatMap((row, rowIndex) => row.includes("1") ? [rowIndex] : []);
  const occupiedColumns = cells[0].flatMap((_, columnIndex) =>
    cells.some((row) => row[columnIndex] === "1") ? [columnIndex] : []
  );
  const top = Math.min(...occupiedRows);
  const bottom = Math.max(...occupiedRows);
  const left = Math.min(...occupiedColumns);
  const right = Math.max(...occupiedColumns);
  return Array.from({ length: targetSize }, (_, rowIndex) => {
    const sourceRow = Math.round(top + ((bottom - top) * rowIndex / (targetSize - 1)));
    return Array.from({ length: targetSize }, (_, columnIndex) => {
      const sourceColumn = Math.round(left + ((right - left) * columnIndex / (targetSize - 1)));
      return cells[sourceRow][sourceColumn];
    }).join("");
  });
}

function spreadArtToFrame(rows, targetSize = 10) {
  const occupied = rows.flatMap((row, rowIndex) => [...row].flatMap((cell, columnIndex) =>
    cell === "1" ? [[rowIndex, columnIndex]] : []
  ));
  const sourceRows = occupied.map(([row]) => row);
  const sourceColumns = occupied.map(([, column]) => column);
  const top = Math.min(...sourceRows);
  const bottom = Math.max(...sourceRows);
  const left = Math.min(...sourceColumns);
  const right = Math.max(...sourceColumns);
  const canvas = Array.from({ length: targetSize }, () => Array(targetSize).fill("0"));
  occupied.forEach(([row, column]) => {
    const targetRow = Math.round((row - top) * (targetSize - 1) / Math.max(1, bottom - top));
    const targetColumn = Math.round((column - left) * (targetSize - 1) / Math.max(1, right - left));
    canvas[targetRow][targetColumn] = "1";
  });
  return canvas.map((row) => row.join(""));
}

const MORNING_TABLE_ART_OVERRIDES = Object.freeze({
  1: Object.freeze([
    "0000100000", "0001110000", "0011111000", "0110101100", "1111111111",
    "1000000001", "1111111111", "1000000001", "1111111111", "0011111100"
  ]),
  2: Object.freeze([
    "1000100011", "0000111010", "0011111100", "1111111011", "1000000001",
    "0100000010", "0110100110", "0011001100", "0001111000", "0000110000"
  ]),
  5: Object.freeze([
    "1111111100", "1000000110", "1011110011", "1010010001", "1011110001",
    "1000000001", "1010101001", "1000000001", "1111111111", "0011111100"
  ]),
  7: Object.freeze([
    "1000100011", "0101111010", "1011111100", "0001111110", "0000110000",
    "0111111111", "0100000010", "0101101000", "0111111110", "0011111100"
  ]),
  11: Object.freeze([
    "1000000001", "1100110011", "0111111110", "0011111100", "1111111111",
    "0001111000", "0011111100", "0110110110", "1100110011", "1000000001"
  ]),
  13: Object.freeze([
    "0011000000", "0110000000", "0011000000", "0001100000", "0011110000",
    "0000110000", "0001111000", "0000011000", "0000111100", "0000001111"
  ]),
  14: Object.freeze([
    "1000000001", "1100000011", "0011111100", "0110110110", "1111111111",
    "1001001001", "1010010100", "1001001001", "1111111111", "0111111110"
  ]),
  16: Object.freeze([
    "1111111111", "1000000001", "1011111101", "1010000101", "1010110101",
    "1010000101", "1011111101", "1000000001", "1100000011", "1111111111"
  ]),
  19: Object.freeze([
    "0000110000", "0001111000", "0011111100", "0011001100", "1111111111",
    "1001001001", "1010110101", "1001001001", "1000000001", "1111111111"
  ])
});

const BAKING_BENCH_ART_OVERRIDES = Object.freeze({
  17: Object.freeze([
    "1111111111", "1000000001", "1011111101", "1010000101", "1010110101",
    "1010110101", "1010000101", "1011111101", "1001100001", "1111111111"
  ]),
  18: Object.freeze([
    "0010000000", "0001111000", "0001111000", "0001111000", "0001111000",
    "0001111000", "0011101000", "0010000000", "0110000001", "1000000000"
  ])
});

const VILLAGE_CART_ART_OVERRIDES = Object.freeze({
  3: Object.freeze([
    "1111111111", "1000000001", "1011001101", "1001111001", "1010110101",
    "1011001101", "1001111001", "1010110101", "1000000001", "1111111111"
  ]),
  10: Object.freeze([
    "0101111010", "0001111000", "0000000000", "0000110000", "0001111000",
    "1101111011", "0001111000", "0000010000", "0100110000", "0001100000"
  ])
});

const STARLIGHT_SHELF_ART_OVERRIDES = Object.freeze({
  3: Object.freeze([
    "0010111101", "0001000010", "0000000000", "0001000111", "1111010001",
    "1111000001", "0001000001", "0000000000", "0001000010", "0000111100"
  ]),
  13: Object.freeze([
    "0000110000", "0001111000", "0011111100", "0111111110", "1111111111",
    "1000000001", "0111111110", "0011001100", "0001111000", "0000110000"
  ]),
  15: Object.freeze([
    "0000000001", "1000001110", "0000001110", "0000011110", "0000010000",
    "0000111000", "0001110000", "0111100000", "0111000000", "0111000000"
  ]),
  16: Object.freeze([
    "1111111111", "1000000001", "1011111101", "1010000101", "1010110101",
    "1010100101", "1010110101", "1010000101", "1000000001", "1111111111"
  ])
});

function buildMorningTableArt(sourceNumber, index) {
  const override = MORNING_TABLE_ART_OVERRIDES[index + 1];
  if (override) return [...override];
  let rows = [...NATIVE_SUMMER_ART[sourceNumber]];
  const rotations = (index % 3) + 1;
  for (let turn = 0; turn < rotations; turn += 1) rows = rotateClockwise(rows);
  if (index % 2 === 0) rows = mirrorHorizontally(rows);
  return fitArtToFrame(rows);
}

function buildBakingBenchArt(sourceNumber, index) {
  const override = BAKING_BENCH_ART_OVERRIDES[index + 1];
  if (override) return [...override];
  let rows = [...NATIVE_SUMMER_ART[sourceNumber]];
  const rotations = ((index + 1) % 3) + 1;
  for (let turn = 0; turn < rotations; turn += 1) rows = rotateClockwise(rows);
  if (index % 2 === 1) rows = mirrorHorizontally(rows);
  return spreadArtToFrame(rows);
}

function buildGardenNookArt(sourceNumber, index) {
  let rows = [...NATIVE_SUMMER_ART[sourceNumber]];
  const rotations = (index + 2) % 4;
  for (let turn = 0; turn < rotations; turn += 1) rows = rotateClockwise(rows);
  if (index % 3 !== 0) rows = mirrorHorizontally(rows);
  return spreadArtToFrame(rows);
}

function buildVillageCartArt(sourceNumber, index) {
  const override = VILLAGE_CART_ART_OVERRIDES[index + 1];
  if (override) return [...override];
  let rows = [...NATIVE_SUMMER_ART[sourceNumber]];
  const rotations = (index + 1) % 4;
  for (let turn = 0; turn < rotations; turn += 1) rows = rotateClockwise(rows);
  if (index % 2 === 0) rows = mirrorHorizontally(rows);
  return spreadArtToFrame(rows);
}

function buildStarlightShelfArt(sourceNumber, index) {
  const override = STARLIGHT_SHELF_ART_OVERRIDES[index + 1];
  if (override) return [...override];
  let rows = [...NATIVE_SUMMER_ART[sourceNumber]];
  const rotations = (index + 3) % 4;
  for (let turn = 0; turn < rotations; turn += 1) rows = rotateClockwise(rows);
  if (index % 3 === 0) rows = mirrorHorizontally(rows);
  return spreadArtToFrame(rows);
}

function createPuzzle([title, titleKo, sourceNumber], index, stage, buildArt) {
  const number = index + 1;
  const id = `cozy-workshop-${stage}-${slugify(title)}-${number}`;
  return Object.freeze({
    id,
    title,
    titleKo,
    titleKey: `puzzles.${id}`,
    packId: "cozy-workshop",
    access: "free",
    size: 10,
    difficulty: "medium",
    reward: 7,
    completionPalette: `cozy-workshop-${stage}-${String(number).padStart(2, "0")}`,
    artReadability: Object.freeze({
      silhouette: `${title.toLowerCase()} with a distinct centered outline and readable title-specific details`,
      colorMood: "morning honey gold, cottage mint, berry red, and warm cream",
      tags: Object.freeze(["cozy-workshop", stage, slugify(title)])
    }),
    solution: Object.freeze(buildArt(sourceNumber, index))
  });
}

export const COZY_WORKSHOP_MORNING_TABLE_PUZZLES = Object.freeze(
  MORNING_TABLE_MOTIFS.map((motif, index) => createPuzzle(motif, index, "morning-table", buildMorningTableArt))
);

export const COZY_WORKSHOP_BAKING_BENCH_PUZZLES = Object.freeze(
  BAKING_BENCH_MOTIFS.map((motif, index) => createPuzzle(motif, index, "baking-bench", buildBakingBenchArt))
);

export const COZY_WORKSHOP_GARDEN_NOOK_PUZZLES = Object.freeze(
  GARDEN_NOOK_MOTIFS.map((motif, index) => createPuzzle(motif, index, "garden-nook", buildGardenNookArt))
);

export const COZY_WORKSHOP_VILLAGE_CART_PUZZLES = Object.freeze(
  VILLAGE_CART_MOTIFS.map((motif, index) => createPuzzle(motif, index, "village-cart", buildVillageCartArt))
);

export const COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES = Object.freeze(
  STARLIGHT_SHELF_MOTIFS.map((motif, index) => createPuzzle(motif, index, "starlight-shelf", buildStarlightShelfArt))
);

export const COZY_WORKSHOP_PUZZLES = Object.freeze([
  ...COZY_WORKSHOP_MORNING_TABLE_PUZZLES,
  ...COZY_WORKSHOP_BAKING_BENCH_PUZZLES,
  ...COZY_WORKSHOP_GARDEN_NOOK_PUZZLES,
  ...COZY_WORKSHOP_VILLAGE_CART_PUZZLES,
  ...COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES
]);
