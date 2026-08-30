import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const eventRoot = resolve(root, "store-assets/events/korean-harvest-2026");
const metadata = JSON.parse(readFileSync(resolve(eventRoot, "metadata.json"), "utf8"));
const errors = [];

function readImageDimensions(path) {
  const bytes = readFileSync(path);
  if (bytes.subarray(1, 4).toString("ascii") === "PNG") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
      }
      const segmentLength = bytes.readUInt16BE(offset + 2);
      if (!segmentLength) break;
      offset += 2 + segmentLength;
    }
  }
  throw new Error(`Unsupported image header: ${path}`);
}

function assertLength(label, value, maximum, minimum = 1) {
  const length = [...String(value || "")].length;
  if (length < minimum || length > maximum) errors.push(`${label}: ${length} characters, expected ${minimum}-${maximum}`);
}

for (const [locale, copy] of Object.entries(metadata.apple.localizations)) {
  assertLength(`Apple ${locale} name`, copy.name, 30);
  assertLength(`Apple ${locale} short description`, copy.shortDescription, 50);
  assertLength(`Apple ${locale} long description`, copy.longDescription, 120);
}

for (const [locale, copy] of Object.entries(metadata.googlePlay.localizations)) {
  assertLength(`Google ${locale} title`, copy.title, 80);
  assertLength(`Google ${locale} tagline`, copy.tagline, 80);
  assertLength(`Google ${locale} description`, copy.description, 500, 100);
}

const imageChecks = [
  ["Apple card", metadata.apple.media.card, 1920, 1080, null],
  ["Apple detail", metadata.apple.media.detail, 1080, 1920, null],
  ["Google primary", metadata.googlePlay.primaryImage, 1920, 1080, 1_000_000]
];

for (const [label, relativePath, expectedWidth, expectedHeight, maxBytes] of imageChecks) {
  const path = resolve(eventRoot, relativePath);
  const info = readImageDimensions(path);
  if (info.width !== expectedWidth || info.height !== expectedHeight) {
    errors.push(`${label}: ${info.width}x${info.height}, expected ${expectedWidth}x${expectedHeight}`);
  }
  if (maxBytes && statSync(path).size > maxBytes) {
    errors.push(`${label}: ${statSync(path).size} bytes exceeds ${maxBytes}`);
  }
}

if (metadata.start >= metadata.end) errors.push("Event start must precede event end");
if (metadata.purchaseRequired !== false) errors.push("The free Chuseok event must not claim that a purchase is required");

if (errors.length) {
  console.error("Korean Harvest store-event check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Korean Harvest store-event packet passed: bilingual copy, dates and 3 exact media files verified.");
