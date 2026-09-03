import fs from "node:fs";
import path from "node:path";

const sourceRoot = "audio-production/korean-harvest/processed";
const runtimeRoot = "src/assets/audio/korean-harvest";
const groups = ["bgm", "stingers", "sfx", "ambience", "pip"];
let sourceCount = 0;
let runtimeCount = 0;

for (const group of groups) {
  const sourceFiles = fs.readdirSync(path.join(sourceRoot, group)).filter((name) => name.endsWith(".wav")).sort();
  const runtimeFiles = fs.readdirSync(path.join(runtimeRoot, group)).filter((name) => name.endsWith(".mp3")).sort();
  const expected = sourceFiles.map((name) => name.replace(/\.wav$/, ".mp3"));
  if (JSON.stringify(runtimeFiles) !== JSON.stringify(expected)) {
    throw new Error(`${group} runtime derivatives do not exactly match approved processed sources`);
  }
  for (const name of runtimeFiles) {
    const size = fs.statSync(path.join(runtimeRoot, group, name)).size;
    if (size < 2048) throw new Error(`${group}/${name} is suspiciously small (${size} bytes)`);
  }
  sourceCount += sourceFiles.length;
  runtimeCount += runtimeFiles.length;
}

if (runtimeCount !== 322 || sourceCount !== runtimeCount) {
  throw new Error(`Expected 322 approved runtime cues, found ${runtimeCount}/${sourceCount}`);
}
if (fs.readdirSync(runtimeRoot).some((name) => name === "drafts")) {
  throw new Error("Non-shipping drafts must never enter the runtime audio tree");
}

console.log(`Korean Harvest runtime audio verified: ${runtimeCount} compressed cues`);
