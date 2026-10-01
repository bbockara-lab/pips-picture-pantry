import { buildSummerPuzzleArt } from "./summerPuzzleArt.js";

const SUMMER_MOTIFS = [
  "Watermelon Slice", "Peach Basket", "Cherry Pair", "Berry Bowl", "Melon Crate", "Plum Branch",
  "Sun Hat", "Beach Ball", "Lemonade Glass", "Picnic Basket", "Garden Trowel", "Sunflower",
  "Tomato Trug", "Sweet Corn", "Cucumber Tray", "Basil Bundle", "Lemon Basket", "Pepper Bunch",
  "Strawberry Patch", "Apricot Bowl", "Pear Basket", "Grape Vine", "Fig Plate", "Orange Wedges",
  "Summer Window", "Striped Awning", "Market Stall", "Garden Gate", "Watering Can", "Bird Bath",
  "Picnic Blanket", "Sandcastle", "Seashell", "Sailboat", "Sun Umbrella", "Beach Bucket",
  "Lemonade Pitcher", "Fruit Tart", "Picnic Sandwiches", "Summer Salad", "Berry Shortcake", "Shaved Ice Bowl",
  "Ice Pop", "Waffle Cone", "Jam Toast", "Garden Chair", "Flower Pot", "Butterfly",
  "Dragonfly", "Ladybird", "Honey Bee", "Daisy Chain", "Lavender Sprig", "Rose Basket",
  "Herb Scissors", "Wooden Tray", "Checkered Napkin", "Thermos Flask", "Juice Bottle", "Serving Spoon",
  "Tomato Sandwich", "Corn Salad", "Cucumber Roll", "Peach Pie", "Cherry Cake", "Melon Soda",
  "Berry Parfait", "Lemon Cookie", "Plum Tart", "Fruit Skewer", "Garden Picnic", "Orchard Path",
  "Sunny Pantry", "Open Shutters", "Vine Trellis", "Market Produce Bicycle", "Produce Sign", "Canvas Tote",
  "Seaside Table", "Shell Garland", "Driftwood Star", "Lighthouse", "Harbor Flag", "Fishing Float",
  "Sunset Feast", "Lantern Table", "Garden Supper", "Fruit Platter", "Cool Tea Pot", "Summer Cake",
  "Firefly Jar", "Moonlit Basket", "Evening Awning", "Coastal Window", "Golden Orchard", "Pip's Picnic",
  "Spoon Bouquet", "Pantry Bunting", "Summer Badge", "Sunny Spoon"
];

const SUMMER_MOTIFS_KO = [
  "수박 한 조각", "복숭아 바구니", "체리 한 쌍", "베리 그릇", "멜론 상자", "자두 가지",
  "여름 모자", "비치볼", "레모네이드 잔", "피크닉 바구니", "정원 모종삽", "해바라기",
  "토마토 채집 바구니", "옥수수", "오이 쟁반", "바질 묶음", "레몬 바구니", "파프리카 묶음",
  "딸기밭", "살구 그릇", "배 바구니", "포도 덩굴", "무화과 접시", "오렌지 조각",
  "여름 창가", "줄무늬 차양", "시장 가판대", "정원 문", "물뿌리개", "새 물그릇",
  "피크닉 담요", "모래성", "조개껍데기", "돛단배", "파라솔", "해변 양동이",
  "레모네이드 피처", "과일 타르트", "피크닉 샌드위치", "여름 샐러드", "베리 쇼트케이크", "빙수 그릇",
  "아이스바", "와플 콘", "잼 토스트", "정원 의자", "꽃 화분", "나비",
  "잠자리", "무당벌레", "꿀벌", "데이지 화환", "라벤더 한 줄기", "장미 바구니",
  "허브 가위", "나무 쟁반", "체크무늬 냅킨", "보온병", "주스 병", "서빙 스푼",
  "토마토 샌드위치", "옥수수 샐러드", "오이말이", "복숭아 파이", "체리 케이크", "멜론 소다",
  "베리 파르페", "레몬 쿠키", "자두 타르트", "과일 꼬치", "정원 피크닉", "과수원 길",
  "햇살 팬트리", "열린 덧창", "덩굴 시렁", "시장 농산물 자전거", "농산물 표지판", "캔버스 가방",
  "바닷가 테이블", "조개 화환", "유목 별", "등대", "항구 깃발", "낚시찌",
  "노을빛 만찬", "등불 테이블", "정원 저녁상", "과일 모둠", "시원한 찻주전자", "여름 케이크",
  "반딧불이 병", "달빛 바구니", "저녁 차양", "바닷가 창문", "황금빛 과수원", "핍의 피크닉",
  "스푼 꽃다발", "팬트리 가랜드", "여름 배지", "햇살 스푼"
];

const SIZE_COUNTS = [[5, 12], [8, 28], [10, 36], [12, 24]];
const REWARD_BY_SIZE = { 5: 3, 8: 5, 10: 7, 12: 9 };
const DIFFICULTY_BY_SIZE = { 5: "starter", 8: "easy", 10: "medium", 12: "hard" };

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

let motifIndex = 0;
export const SUMMER_PUZZLES = Object.freeze(SIZE_COUNTS.flatMap(([size, count]) =>
  Array.from({ length: count }, () => {
    const title = SUMMER_MOTIFS[motifIndex];
    const number = motifIndex + 1;
    motifIndex += 1;
    const id = `summer-pantry-${slugify(title)}-${number}`;
    return Object.freeze({
      id,
      title,
      titleKo: SUMMER_MOTIFS_KO[number - 1],
      titleKey: `puzzles.${id}`,
      packId: "summer-pantry",
      access: "free",
      size,
      difficulty: DIFFICULTY_BY_SIZE[size],
      reward: REWARD_BY_SIZE[size],
      completionPalette: `summer-${String(number).padStart(3, "0")}`,
      artReadability: Object.freeze({
        silhouette: `${title.toLowerCase()} with a clear cozy summer outline`,
        colorMood: "sun-warmed peach, garden green, berry red, and lemonade gold",
        tags: Object.freeze(["summer", "pantry", slugify(title)])
      }),
      solution: Object.freeze(buildSummerPuzzleArt(size, number))
    });
  })
));
