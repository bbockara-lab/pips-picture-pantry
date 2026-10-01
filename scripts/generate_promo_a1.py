from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PROMO = ROOT / "store-assets" / "play-console" / "promo-a1"
SOURCE = PROMO / "source"
KO = PROMO / "ko"
EN = PROMO / "en"

CANVAS = (1080, 1920)
CREAM = "#fff7df"
INK = "#4a302e"
MUTED = "#7a5a4d"
GOLD = "#d79a18"
PAPER = "#fffaf0"

FONT_KO = Path(r"C:\Windows\Fonts\malgun.ttf")
FONT_KO_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")
FONT_EN = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_EN_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def font(size, bold=False, ko=False):
    path = FONT_KO_BOLD if ko and bold else FONT_KO if ko else FONT_EN_BOLD if bold else FONT_EN
    return ImageFont.truetype(str(path), size)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def cover(image, size, focus=(0.5, 0.5)):
    image = image.convert("RGB")
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, min(resized.width - size[0], round(resized.width * focus[0] - size[0] / 2)))
    top = max(0, min(resized.height - size[1], round(resized.height * focus[1] - size[1] / 2)))
    return resized.crop((left, top, left + size[0], top + size[1]))


def contain(image, size, background=PAPER):
    image = image.convert("RGB")
    scale = min(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    result = Image.new("RGB", size, background)
    result.paste(resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2))
    return result


def gradient_background():
    image = Image.new("RGB", CANVAS, CREAM)
    px = image.load()
    start = (255, 249, 230)
    end = (239, 221, 173)
    for y in range(CANVAS[1]):
        t = y / (CANVAS[1] - 1)
        row = tuple(round(start[i] * (1 - t) + end[i] * t) for i in range(3))
        for x in range(CANVAS[0]):
            px[x, y] = row
    return image


def fit_text(draw, text, max_width, start_size, bold=False, ko=False):
    size = start_size
    while size > 30:
        face = font(size, bold=bold, ko=ko)
        if draw.textbbox((0, 0), text, font=face)[2] <= max_width:
            return face
        size -= 2
    return font(size, bold=bold, ko=ko)


def poster(number, source_path, ko_title, en_title, mode="contain", focus=(0.5, 0.5)):
    for lang, title, out_dir in (("ko", ko_title, KO), ("en", en_title, EN)):
        is_ko = lang == "ko"
        canvas = gradient_background()
        draw = ImageDraw.Draw(canvas)

        draw.rounded_rectangle((70, 60, 1010, 244), radius=54, fill="#fffaf0", outline="#e6c77d", width=3)
        draw.text((108, 88), f"{number:02d}", font=font(38, bold=True), fill=GOLD)
        title_face = fit_text(draw, title, 760, 62, bold=True, ko=is_ko)
        draw.text((190, 78), title, font=title_face, fill=INK)

        frame = (76, 300, 1004, 1668)
        shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle((frame[0] + 8, frame[1] + 18, frame[2] + 8, frame[3] + 18), radius=58, fill=(75, 47, 35, 70))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)

        art = Image.open(source_path)
        box_size = (frame[2] - frame[0], frame[3] - frame[1])
        art = cover(art, box_size, focus) if mode == "cover" else contain(art, box_size)
        canvas.paste(art, (frame[0], frame[1]), rounded_mask(box_size, 58))

        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle(frame, radius=58, outline="#8b5b3f", width=5)
        draw.rounded_rectangle((96, 1710, 984, 1844), radius=42, fill="#fffaf0", outline="#d5b469", width=3)
        footer = "Pip's Picture Pantry"
        footer_face = font(43, bold=True)
        bbox = draw.textbbox((0, 0), footer, font=footer_face)
        draw.text(((1080 - (bbox[2] - bbox[0])) / 2, 1745), footer, font=footer_face, fill=MUTED)

        out_dir.mkdir(parents=True, exist_ok=True)
        canvas.convert("RGB").save(out_dir / f"{number:02d}.png", "PNG", dpi=(300, 300), optimize=True)


def feature_graphic():
    master = Image.open(SOURCE / "pip-pantry-feature-master-v1.png")
    art = cover(master, (1024, 500), focus=(0.47, 0.48)).convert("RGBA")

    veil = Image.new("RGBA", art.size, (0, 0, 0, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((535, 0, 1024, 500), fill=(255, 246, 218, 58))
    art = Image.alpha_composite(art, veil)

    draw = ImageDraw.Draw(art)
    title = "Pip's Picture Pantry"
    subtitle = "333 cozy picture puzzles"
    draw.text((568, 146), title, font=font(48, bold=True), fill="#4a302e", stroke_width=2, stroke_fill="#fff6dc")
    draw.text((573, 215), subtitle, font=font(25, bold=True), fill="#6d4938")
    draw.rounded_rectangle((570, 262, 917, 326), radius=30, fill=(255, 249, 231, 225), outline="#d79a18", width=3)
    draw.text((603, 277), "Solve. Collect. Decorate.", font=font(22, bold=True), fill="#694235")

    PROMO.mkdir(parents=True, exist_ok=True)
    art.convert("RGB").save(PROMO / "feature-graphic-1024x500.png", "PNG", dpi=(300, 300), optimize=True)


def main():
    phone = ROOT / "store-assets" / "play-console" / "phone-screenshots"
    poster(
        1,
        SOURCE / "pip-pantry-feature-master-v1.png",
        "그림 하나 같이 풀어볼까요?",
        "Shall we solve a picture together?",
        mode="cover",
        focus=(0.30, 0.5),
    )
    poster(
        2,
        phone / "01-puzzle-screen.png",
        "색칠하고 그림을 완성해요",
        "Fill the grid and reveal the picture",
    )
    poster(
        3,
        ROOT / "src" / "assets" / "backgrounds" / "pantry-room-sunlit-v2.png",
        "스푼을 모아 팬트리를 꾸며요",
        "Collect spoons and fill your pantry",
        mode="cover",
    )
    poster(
        4,
        phone / "03-album.png",
        "완성한 그림들이 모여요",
        "Keep every picture you complete",
    )
    poster(
        5,
        phone / "04-badges.png",
        "도전하고 배지를 수집해요",
        "Take on challenges and collect badges",
    )
    feature_graphic()


if __name__ == "__main__":
    main()
