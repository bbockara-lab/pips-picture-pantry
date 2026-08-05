from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
VERSION = "v0.1.703"
BASE = ROOT / "store-assets" / "store-media" / VERSION
RAW = BASE / "raw"
UPLOAD = BASE / "upload"

SCENES = [
    "01-puzzle-in-progress.png",
    "02-puzzle-complete.png",
    "03-puzzle-library.png",
    "04-picture-album.png",
    "05-pantry-room.png",
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    names = [
        "malgunbd.ttf" if bold else "malgun.ttf",
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    raise RuntimeError("Required Windows fonts were not found")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_rgb(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.open(source).convert("RGB").save(destination, "PNG", optimize=True)


def package_screenshots() -> list[dict]:
    packaged = []
    target_map = {
        "google-play": ("google-play", (1080, 1920)),
        "app-store-6.9": ("app-store/iphone-6.9", (1290, 2796)),
        "app-store-ipad-13": ("app-store/ipad-13", (2048, 2732)),
    }
    for raw_target, (upload_target, expected) in target_map.items():
        for language, locale in (("en", "en-US"), ("ko", "ko-KR")):
            for scene in SCENES:
                source = RAW / raw_target / language / scene
                destination = UPLOAD / upload_target / locale / scene
                save_rgb(source, destination)
                with Image.open(destination) as image:
                    if image.size != expected:
                        raise RuntimeError(f"Unexpected size for {destination}: {image.size}, expected {expected}")
                    if image.mode != "RGB":
                        raise RuntimeError(f"Unexpected mode for {destination}: {image.mode}")
                packaged.append({
                    "store": upload_target,
                    "locale": locale,
                    "scene": scene,
                    "size": list(expected),
                    "path": destination.relative_to(ROOT).as_posix(),
                    "sha256": sha256(destination),
                })
    return packaged


def crop_cover(image: Image.Image, size: tuple[int, int], focus_y: float = 0.47) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - size[0]) // 2)
    top = max(0, min(resized.height - size[1], round(resized.height * focus_y - size[1] / 2)))
    return resized.crop((left, top, left + size[0], top + size[1]))


def feature_graphic(locale: str) -> Path:
    language = "ko" if locale == "ko-KR" else "en"
    screenshot = Image.open(RAW / "google-play" / language / "01-puzzle-in-progress.png").convert("RGB")
    background = crop_cover(screenshot, (1024, 500), focus_y=0.50).filter(ImageFilter.GaussianBlur(10))
    veil = Image.new("RGBA", background.size, (255, 247, 225, 150))
    canvas = Image.alpha_composite(background.convert("RGBA"), veil)

    # The actual current app remains the hero: an uncropped live screenshot panel.
    live = screenshot.resize((281, 500), Image.Resampling.LANCZOS)
    live_mask = Image.new("L", live.size, 0)
    ImageDraw.Draw(live_mask).rounded_rectangle((0, 0, live.width, live.height), 30, fill=255)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((71, 18, 372, 518), 32, fill=(57, 36, 28, 62))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(live, (60, 0), live_mask)

    draw = ImageDraw.Draw(canvas)
    title = "핍의 퍼즐방" if locale == "ko-KR" else "Pip's Picture Pantry"
    subtitle = "그림을 풀고, 팬트리를 채워요" if locale == "ko-KR" else "Solve pictures. Fill the pantry."
    draw.text((412, 150), title, font=font(52, True), fill=(70, 42, 34), stroke_width=1, stroke_fill=(255, 250, 237))
    draw.text((416, 228), subtitle, font=font(27, False), fill=(92, 67, 51))
    draw.rounded_rectangle((413, 292, 845, 355), 28, fill=(255, 250, 237, 232), outline=(210, 157, 65, 190), width=2)
    detail = "333개의 그림 퍼즐" if locale == "ko-KR" else "333 picture puzzles"
    draw.text((445, 310), detail, font=font(22, True), fill=(91, 61, 43))

    destination = UPLOAD / "google-play" / locale / "feature-graphic-1024x500.png"
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(destination, "PNG", optimize=True)
    return destination


def contact_sheet(store: str, locale: str, paths: list[Path], thumb_width: int) -> Path:
    thumbs = []
    for path in paths:
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_width, 700), Image.Resampling.LANCZOS)
        thumbs.append((path.name, image.copy()))
    margin, gap, label_height = 30, 22, 46
    width = margin * 2 + sum(image.width for _, image in thumbs) + gap * (len(thumbs) - 1)
    height = margin * 2 + max(image.height for _, image in thumbs) + label_height
    canvas = Image.new("RGB", (width, height), (247, 242, 226))
    draw = ImageDraw.Draw(canvas)
    x = margin
    for name, image in thumbs:
        canvas.paste(image, (x, margin + label_height))
        draw.text((x, margin), name[:2], font=font(24, True), fill=(70, 42, 34))
        x += image.width + gap
    destination = BASE / "review" / f"{store.replace('/', '-')}-{locale}-contact-sheet.jpg"
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "JPEG", quality=88, optimize=True)
    return destination


def main() -> None:
    packaged = package_screenshots()
    features = [feature_graphic(locale) for locale in ("en-US", "ko-KR")]
    review = []
    for store in ("google-play", "app-store/iphone-6.9", "app-store/ipad-13"):
        for locale in ("en-US", "ko-KR"):
            paths = [UPLOAD / store / locale / scene for scene in SCENES]
            review.append(contact_sheet(store, locale, paths, 210 if store == "google-play" else 190))

    manifest = {
        "version": VERSION,
        "sourceManifest": (BASE / "capture-manifest.json").relative_to(ROOT).as_posix(),
        "policy": "All screenshots are direct current-app captures. No legacy phone-screenshots, device frames, or CSS promotional mockups.",
        "screenshots": packaged,
        "featureGraphics": [
            {"path": path.relative_to(ROOT).as_posix(), "size": [1024, 500], "sha256": sha256(path)}
            for path in features
        ],
        "reviewSheets": [path.relative_to(ROOT).as_posix() for path in review],
    }
    manifest_path = BASE / "store-upload-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Packaged {len(packaged)} store screenshots, {len(features)} feature graphics, and {len(review)} review sheets.")
    print(manifest_path)


if __name__ == "__main__":
    main()
