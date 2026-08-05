from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "store-assets" / "social-campaigns" / "launch-2026"
OUTPUT = SOURCE / "play-upload"
PHONE = OUTPUT / "phone-1080x1920"
FEATURE = OUTPUT / "feature-1024x500"

ITEMS = [
    ("01-meet-pip", "PIP'S PICTURE PANTRY", "Meet Pip.", "Solve a picture. Warm the pantry."),
    ("02-hidden-picture", "COZY PICTURE PUZZLES", "Every grid hides", "a cozy little picture."),
    ("03-fill-the-shelves", "COLLECT & DISPLAY", "Fill every shelf", "with something lovely."),
    ("04-nine-keepsakes", "PIP'S BADGE SHELF", "Nine keepsakes.", "One growing pantry."),
    ("05-grandpa-clock", "TIME ATTACK", "Beat the clock.", "Keep the cozy."),
    ("06-quiet-puzzle-break", "YOUR QUIET PUZZLE BREAK", "Slow down with Pip.", "One warm picture at a time."),
]

INK = "#4a302e"
GOLD = "#c88719"
CREAM = "#fff7df"
FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def font(size: int, bold: bool = False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size)


def cover(image: Image.Image, size: tuple[int, int], focus=(0.5, 0.5)) -> Image.Image:
    image = image.convert("RGB")
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = max(0, min(resized.width - size[0], round(resized.width * focus[0] - size[0] / 2)))
    top = max(0, min(resized.height - size[1], round(resized.height * focus[1] - size[1] / 2)))
    return resized.crop((left, top, left + size[0], top + size[1]))


def export_phone(slug: str):
    source = Image.open(SOURCE / f"{slug}.png")
    result = cover(source, (1080, 1920))
    result.save(PHONE / f"{slug}-1080x1920.png", "PNG", optimize=True)


def export_feature(slug: str, kicker: str, headline: str, subtitle: str):
    art_source = Image.open(SOURCE / f"{slug}-art.png")
    art = cover(art_source, (1024, 500), focus=(0.55, 0.54)).filter(ImageFilter.GaussianBlur(0.25))
    result = art.convert("RGBA")

    overlay = Image.new("RGBA", result.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((0, 0, 620, 500), fill=(255, 247, 223, 244))
    od.polygon([(560, 0), (710, 0), (625, 500), (490, 500)], fill=(255, 247, 223, 210))
    od.rectangle((0, 0, 1024, 18), fill=(200, 135, 25, 255))
    result = Image.alpha_composite(result, overlay)

    draw = ImageDraw.Draw(result)
    draw.text((62, 78), kicker, font=font(23, True), fill=GOLD)
    draw.text((58, 128), headline, font=font(58, True), fill=INK)
    draw.text((62, 212), subtitle, font=font(29, True), fill=INK)
    draw.rounded_rectangle((58, 305, 442, 372), radius=30, fill=(255, 252, 240, 238), outline=GOLD, width=3)
    draw.text((92, 321), "Solve. Collect. Decorate.", font=font(23, True), fill=INK)
    draw.text((62, 421), "Pip's Picture Pantry", font=font(25, True), fill=INK)

    result.convert("RGB").save(FEATURE / f"{slug}-1024x500.png", "PNG", optimize=True)


def main():
    PHONE.mkdir(parents=True, exist_ok=True)
    FEATURE.mkdir(parents=True, exist_ok=True)
    for slug, kicker, headline, subtitle in ITEMS:
        export_phone(slug)
        export_feature(slug, kicker, headline, subtitle)
    print(f"Exported {len(ITEMS)} phone screenshots and {len(ITEMS)} feature graphics to {OUTPUT}")


if __name__ == "__main__":
    main()
