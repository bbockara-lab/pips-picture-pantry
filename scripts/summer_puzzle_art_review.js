import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { SUMMER_PUZZLES } from "../src/data/summerPuzzles.js";

export function buildSummerPuzzleArtReviewHtml(puzzles = SUMMER_PUZZLES) {
  const cards = puzzles.map((puzzle, index) => {
    const grid = puzzle.solution.flatMap((row) => [...row])
      .map((cell) => `<i class="${cell === "1" ? "on" : ""}"></i>`).join("");
    return `<article><header><b>${String(index + 1).padStart(3, "0")}. ${puzzle.title}</b><span>${puzzle.size}×${puzzle.size}</span></header>
      <div class="ko">${puzzle.titleKo}</div><div class="grid" style="--size:${puzzle.size}">${grid}</div>
      <footer>□ 일치　□ 수정　□ 제목 변경</footer></article>`;
  }).join("\n");
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><title>Summer Puzzle Art Review</title><style>
  *{box-sizing:border-box}body{margin:0;background:#f8f2e4;color:#402a24;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif}
  h1{margin:28px 32px 6px;font-size:28px}.note{margin:0 32px 24px;color:#7a5d4d;line-height:1.5}main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;padding:0 32px 40px}
  article{background:#fffaf0;border:1px solid #d8c5a3;border-radius:16px;padding:14px;box-shadow:0 4px 12px #5d40221a;break-inside:avoid}header{display:flex;justify-content:space-between;gap:8px;align-items:start;font-size:14px}header span{white-space:nowrap;color:#986735}
  .ko{margin:5px 0 10px;color:#76574a;font-size:13px}.grid{display:grid;grid-template-columns:repeat(var(--size),1fr);aspect-ratio:1;gap:2px;padding:6px;background:#eadfc8;border-radius:10px}.grid i{display:block;background:#fff8e8;border-radius:2px}.grid i.on{background:#df8e35;box-shadow:inset 0 0 0 1px #b96622}footer{margin-top:10px;font-size:12px;color:#6f6156}@media(max-width:1000px){main{grid-template-columns:repeat(3,1fr)}}</style>
  <h1>여름 퍼즐 100개 제목–실루엣 전수 검수</h1><p class="note">제목별 카테고리 실루엣과 가장자리 단서를 적용했습니다. 각 카드를 눈으로 확인해 일치/수정/제목 변경 중 하나를 결정해야 출시 게이트를 통과합니다.</p><main>${cards}</main></html>`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outputPath = process.argv[2] || "store-assets/00-UPLOAD-READY/summer-puzzle-art-review.html";
  await writeFile(outputPath, buildSummerPuzzleArtReviewHtml(), "utf8");
  console.log(`Summer puzzle art review written to ${outputPath}`);
}
