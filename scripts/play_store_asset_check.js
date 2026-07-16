import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredAssets = [
  { file: "store-assets/play-console/app-icon-512.png", width: 512, height: 512, type: "png" },
  { file: "store-assets/play-console/feature-graphic-1024x500.png", width: 1024, height: 500, type: "png" },
  { file: "store-assets/play-console/phone-screenshots/01-puzzle-screen.png", width: 1080, height: 1920, type: "png" },
  { file: "store-assets/play-console/phone-screenshots/02-stage-list.png", width: 1080, height: 1920, type: "png" },
  { file: "store-assets/play-console/phone-screenshots/03-album.png", width: 1080, height: 1920, type: "png" },
  { file: "store-assets/play-console/phone-screenshots/04-badges.png", width: 1080, height: 1920, type: "png" },
  { file: "store-assets/play-console/tablet-7-screenshots/01-puzzle-screen.png", width: 1200, height: 1920, type: "png" },
  { file: "store-assets/play-console/tablet-7-screenshots/02-stage-list.png", width: 1200, height: 1920, type: "png" },
  { file: "store-assets/play-console/tablet-7-screenshots/03-album.png", width: 1200, height: 1920, type: "png" },
  { file: "store-assets/play-console/tablet-7-screenshots/04-badges.png", width: 1200, height: 1920, type: "png" },
  { file: "store-assets/play-console/tablet-10-screenshots/01-puzzle-screen.png", width: 1600, height: 2560, type: "png" },
  { file: "store-assets/play-console/tablet-10-screenshots/02-stage-list.png", width: 1600, height: 2560, type: "png" },
  { file: "store-assets/play-console/tablet-10-screenshots/03-album.png", width: 1600, height: 2560, type: "png" },
  { file: "store-assets/play-console/tablet-10-screenshots/04-badges.png", width: 1600, height: 2560, type: "png" }
];

function getPngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
    throw new Error("not a PNG file");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function getJpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("not a JPEG file");
  }

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    offset += 2 + length;
  }

  throw new Error("could not find JPEG dimensions");
}

function getDimensions(assetPath, type) {
  const buffer = fs.readFileSync(assetPath);
  return type === "jpg" || type === "jpeg" ? getJpegDimensions(buffer) : getPngDimensions(buffer);
}

const errors = [];
for (const asset of requiredAssets) {
  const assetPath = path.join(repoRoot, asset.file);
  if (!fs.existsSync(assetPath)) {
    errors.push(`${asset.file} is missing`);
    continue;
  }

  try {
    const dimensions = getDimensions(assetPath, asset.type);
    if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
      errors.push(`${asset.file} is ${dimensions.width}x${dimensions.height}, expected ${asset.width}x${asset.height}`);
    }
  } catch (error) {
    errors.push(`${asset.file}: ${error.message}`);
  }
}

const phoneDir = path.join(repoRoot, "store-assets/play-console/phone-screenshots");
const phonePngs = fs.existsSync(phoneDir)
  ? fs.readdirSync(phoneDir).filter((name) => name.toLowerCase().endsWith(".png"))
  : [];
if (phonePngs.length < 2 || phonePngs.length > 8) {
  errors.push(`phone screenshot PNG count is ${phonePngs.length}, expected 2-8`);
}

if (errors.length > 0) {
  console.error("Play Store asset check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Play Store asset check passed: ${requiredAssets.length} required graphics verified.`);
