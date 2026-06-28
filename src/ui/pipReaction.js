export function getCompletionMessage(puzzle) {
  return `A cozy ${puzzle.reward.imageName.toLowerCase()}! Saved to the Pantry Album.`;
}

export function renderCompletionBanner(puzzle) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";
  banner.innerHTML = `
    <span class="spark">✓</span>
    <p>${getCompletionMessage(puzzle)}</p>
  `;
  return banner;
}
