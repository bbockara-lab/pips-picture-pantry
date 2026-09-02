from __future__ import annotations

import math
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".tmp" / "video_deps"))
import imageio_ffmpeg  # noqa: E402

W, H, FPS, DURATION = 1080, 1920, 30, 15.5
OUT = ROOT / "store-assets" / "social" / "one-safe-move-8x8"
SOURCE = ROOT / "store-assets" / "social" / "next-move-8x8" / "hard-sequence-04.png"
SILENT = OUT / "one-safe-move-8x8-en-silent.mp4"
WAV = OUT / "one-safe-move-8x8-en.wav"
FINAL = OUT / "one-safe-move-8x8-en.mp4"
COVER = OUT / "one-safe-move-8x8-en-cover.jpg"
CONTACT = OUT / "one-safe-move-8x8-en-contact.jpg"
TOKEN_ART = OUT / "artwork" / "choice-tokens-ab-v2.png"
CELEBRATION_ART = OUT / "artwork" / "row-complete-celebration-v1.png"
LOGO_ART = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"

INK = (60, 39, 37)
CREAM = (255, 248, 224)
GOLD = (255, 190, 51)
ORANGE = (233, 139, 76)
MINT = (143, 203, 177)
WHITE = (255, 255, 255)


def font(size: int):
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def text_center(draw, text, y, size, fill=INK, stroke=0, stroke_fill=WHITE):
    f = font(size)
    box = draw.textbbox((0, 0), text, font=f, stroke_width=stroke)
    draw.text(((W - (box[2] - box[0])) / 2, y), text, font=f, fill=fill,
              stroke_width=stroke, stroke_fill=stroke_fill)


def fit_cover(image, size):
    scale = max(size[0] / image.width, size[1] / image.height)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    x = (image.width - size[0]) // 2
    y = (image.height - size[1]) // 2
    return image.crop((x, y, x + size[0], y + size[1]))


SOURCE_IMAGE = Image.open(SOURCE).convert("RGB")
# The board occupies the top 1260 px in the 1290×2796 capture.
BOARD = SOURCE_IMAGE.crop((0, 0, SOURCE_IMAGE.width, 1260))
BOARD = BOARD.resize((1030, round(BOARD.height * 1030 / BOARD.width)), Image.Resampling.LANCZOS)
TOKEN_SHEET = Image.open(TOKEN_ART).convert("RGBA")


def token_crop(left: int, right: int):
    token = TOKEN_SHEET.crop((left, 0, right, TOKEN_SHEET.height))
    alpha_box = token.getchannel("A").getbbox()
    return token.crop(alpha_box)


TOKEN_A = token_crop(0, TOKEN_SHEET.width // 2)
TOKEN_B = token_crop(TOKEN_SHEET.width // 2, TOKEN_SHEET.width)
CELEBRATION = Image.open(CELEBRATION_ART).convert("RGBA")
GAME_LOGO = Image.open(LOGO_ART).convert("RGBA")
# Reuse exact rendered game cells for the answer—no approximation of the app UI.
GAME_X_CELL = BOARD.crop((235, 401, 325, 491)).convert("RGBA")
GAME_FILL_CELL = BOARD.crop((329, 401, 419, 491)).convert("RGBA")


def base_frame():
    bg = fit_cover(SOURCE_IMAGE, (W, H)).filter(ImageFilter.GaussianBlur(24))
    bg = ImageEnhance.Brightness(bg).enhance(.63).convert("RGBA")
    veil = Image.new("RGBA", (W, H), (45, 24, 18, 92))
    bg.alpha_composite(veil)
    return bg


BG = base_frame()


def paste_token(frame, token, center, size, scale=1.0):
    side = round(size * scale)
    art = token.resize((side, side), Image.Resampling.LANCZOS)
    x, y = center
    frame.alpha_composite(art, (round(x - side / 2), round(y - side / 2)))


def paste_cell(frame, cell, center):
    x, y = center
    art = cell.resize((91, 91), Image.Resampling.LANCZOS)
    frame.alpha_composite(art, (round(x - art.width / 2), round(y - art.height / 2)))


def paste_celebration(frame, t, row_y):
    elapsed = t - 9.6
    if elapsed < 0 or elapsed > 2.6:
        return
    # Keep the authored VFX strictly on the outside of the completed row.
    # The cells stay fully visible; only a thin illustrated frame travels around them.
    progress = min(1.0, elapsed / .65)
    fade = 1.0 if elapsed < 2.0 else max(0.0, 1 - (elapsed - 2.0) / .6)
    glow = .76 + .24 * math.sin(elapsed * math.pi * 5.4)
    outline = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    outline_draw = ImageDraw.Draw(outline)
    right = round(245 + 790 * progress)
    if right > 260:
        outline_draw.rounded_rectangle((238, row_y - 65, right, row_y + 65), 32,
                                       outline=(255, 190, 30, round(155 * fade * glow)), width=28)
        outline_draw.rounded_rectangle((246, row_y - 57, right - 8, row_y + 57), 27,
                                       outline=(255, 251, 215, round(255 * fade)), width=13)
        outline_draw.rounded_rectangle((256, row_y - 47, right - 18, row_y + 47), 20,
                                       outline=(73, 214, 174, round(235 * fade * glow)), width=8)
    frame.alpha_composite(outline)
    art = CELEBRATION.resize((790, 116), Image.Resampling.LANCZOS)
    border_mask = Image.new("L", art.size, 0)
    mask_draw = ImageDraw.Draw(border_mask)
    mask_draw.rounded_rectangle((3, 3, art.width - 4, art.height - 4), 30, fill=255)
    mask_draw.rounded_rectangle((15, 15, art.width - 16, art.height - 16), 22, fill=0)
    authored_alpha = np.asarray(art.getchannel("A"), dtype=np.float32)
    ring_alpha = np.asarray(border_mask, dtype=np.float32)
    combined = np.uint8(authored_alpha * (ring_alpha / 255.0) * fade)
    art.putalpha(Image.fromarray(combined, mode="L"))
    visible = max(1, round(art.width * progress))
    art = art.crop((0, 0, visible, art.height))
    frame.alpha_composite(art, (245, round(row_y - 58)))

    # Small authored flares travel along the border instead of covering the answer.
    flare = CELEBRATION.crop((120, 120, 570, 610))
    flare.thumbnail((74, 74), Image.Resampling.LANCZOS)
    if fade < 1:
        flare_alpha = flare.getchannel("A").point(lambda value: round(value * fade))
        flare.putalpha(flare_alpha)
    orbit = min(1.0, elapsed / 1.1)
    fx = round(270 + 700 * orbit)
    fy = round(row_y - 57 if elapsed % .55 < .275 else row_y + 57)
    frame.alpha_composite(flare, (fx - flare.width // 2, fy - flare.height // 2))


def paste_answer_focus(frame, t, left_center, right_center):
    """First beat: celebrate only the two cells that just changed."""
    elapsed = t - 7.4
    if elapsed < 0 or elapsed > 2.2:
        return
    fade = 1.0 if elapsed < 1.75 else max(0.0, 1 - (elapsed - 1.75) / .45)
    pulse = .78 + .22 * math.sin(elapsed * math.pi * 7)
    left_x, center_y = left_center
    right_x, _ = right_center
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    layer_draw = ImageDraw.Draw(layer)
    layer_draw.rounded_rectangle((left_x - 53, center_y - 53, right_x + 53, center_y + 53), 25,
                                 outline=(255, 214, 72, round(220 * fade * pulse)), width=11)
    layer_draw.rounded_rectangle((left_x - 46, center_y - 46, right_x + 46, center_y + 46), 20,
                                 outline=(255, 251, 215, round(245 * fade)), width=5)
    frame.alpha_composite(layer)

    flare = CELEBRATION.crop((120, 120, 570, 610))
    flare.thumbnail((70, 70), Image.Resampling.LANCZOS)
    flare_alpha = flare.getchannel("A").point(lambda value: round(value * fade))
    flare.putalpha(flare_alpha)
    for x in (left_x - 45, right_x + 45):
        frame.alpha_composite(flare, (round(x - flare.width / 2), round(center_y - flare.height / 2)))


def dim_board_except(frame, board_box, cutouts, alpha=178):
    """A stage-light mask makes the intended reading order unmistakable."""
    x1, y1, x2, y2 = board_box
    shade = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    shade_alpha = Image.new("L", frame.size, 0)
    mask_draw = ImageDraw.Draw(shade_alpha)
    mask_draw.rounded_rectangle(board_box, 34, fill=alpha)
    for cutout in cutouts:
        mask_draw.rounded_rectangle(cutout, 26, fill=18)
    shade.putalpha(shade_alpha)
    frame.alpha_composite(shade)


def paste_clue_focus(frame, t, clue_box, row_y):
    elapsed = t - 12.2
    if elapsed < 0:
        return
    pulse = .72 + .28 * math.sin(elapsed * math.pi * 4.2)
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = clue_box
    draw.rounded_rectangle((x1 - 10, y1 - 8, x2 + 10, y2 + 8), 34,
                           outline=(255, 184, 24, round(205 * pulse)), width=22)
    draw.rounded_rectangle((x1 - 2, y1, x2 + 2, y2), 27,
                           outline=(255, 252, 220, 255), width=8)
    # A bold pointer connects the newly introduced clue to the completed row.
    start_x, end_x = x2 + 18, x2 + 102
    draw.line((start_x, row_y, end_x, row_y), fill=(255, 206, 55, 255), width=16)
    draw.polygon(((end_x, row_y), (end_x - 26, row_y - 22), (end_x - 26, row_y + 22)), fill=(255, 206, 55, 255))
    frame.alpha_composite(layer)


def paste_final_logo(frame, t):
    elapsed = t - 12.2
    if elapsed < 0:
        return
    progress = min(1.0, elapsed / .55)
    bounce = 1 + .08 * math.sin(progress * math.pi)
    width = round(470 * bounce)
    height = round(GAME_LOGO.height * width / GAME_LOGO.width)
    logo = GAME_LOGO.resize((width, height), Image.Resampling.LANCZOS)
    alpha = logo.getchannel("A").point(lambda value: round(value * progress))
    logo.putalpha(alpha)
    x = round((W - width) / 2)
    y = round(930 - (height - 318) / 2)
    frame.alpha_composite(logo, (x, y))


def frame_at(t: float):
    frame = BG.copy()
    draw = ImageDraw.Draw(frame)

    if t < 1.15:
        text_center(draw, "ONE WRONG TAP", 78, 76, GOLD, 3, INK)
        text_center(draw, "ends the run.", 174, 54, WHITE, 2, INK)
    elif t < 7.4:
        text_center(draw, "ONLY ONE IS SAFE.", 84, 69, WHITE, 3, INK)
        text_center(draw, "A or B?", 176, 55, GOLD, 2, INK)
    elif t < 9.6:
        text_center(draw, "B IS THE SAFE MOVE.", 92, 67, GOLD, 3, INK)
        text_center(draw, "A is blank.  B is filled.", 190, 43, WHITE, 2, INK)
    elif t < 12.2:
        text_center(draw, "THE ROW IS COMPLETE.", 92, 65, GOLD, 3, INK)
        text_center(draw, "Now look at the clue on the left.", 190, 41, WHITE, 2, INK)
    else:
        text_center(draw, "SEE THE 4, 1 ON THE LEFT?", 92, 61, GOLD, 3, INK)
        text_center(draw, "FOUR  /  GAP  /  ONE", 190, 45, WHITE, 2, INK)

    # Keep the real game UI dominant. A tiny scale pulse replaces synthetic scene changes.
    pulse = 1 + .004 * math.sin(t * 2.2)
    board = BOARD.resize((round(BOARD.width * pulse), round(BOARD.height * pulse)), Image.Resampling.LANCZOS)
    mask = Image.new("L", board.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, board.width, board.height), 34, fill=255)
    board.putalpha(mask)
    bx = (W - board.width) // 2
    by = 310 - (board.height - BOARD.height) // 2
    shadow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((bx + 12, by + 18, bx + board.width + 12, by + board.height + 18), 38,
                                             fill=(12, 5, 3, 120))
    frame.alpha_composite(shadow)
    frame.alpha_composite(board, (bx, by))

    # Row 3, columns 6 and 7 in the actual 8×8 board.
    # Coordinates are measured after the 1290 -> 1030 board resize.
    ax, ay = bx + 745, by + 446
    bx2, by2 = bx + 839, by + 446
    if 1.15 <= t < 7.4:
        # These neon quiz markers deliberately do not share the board palette.
        hover = 1 + .05 * math.sin(t * 5.2)
        paste_token(frame, TOKEN_A, (ax, ay), 128, hover)
        paste_token(frame, TOKEN_B, (bx2, by2), 128, 2 - hover)

    if 5.0 <= t < 7.4:
        remaining = max(1, math.ceil(7.4 - t))
        # Put the countdown on the board itself so the eye never leaves the decision.
        cy = 1128
        draw.ellipse((W // 2 - 92, cy - 92, W // 2 + 92, cy + 92), fill=(48, 29, 25, 218), outline=GOLD, width=8)
        f = font(126)
        box = draw.textbbox((0, 0), str(remaining), font=f)
        draw.text((W / 2 - (box[2] - box[0]) / 2, cy - 76), str(remaining), font=f, fill=WHITE)
        text_center(draw, "Use the row clue: 4 and 1", 1370, 44, CREAM, 2, INK)
    elif t >= 7.4:
        # Remove A/B and replace them with the app's actual X and filled-cell artwork.
        paste_cell(frame, GAME_X_CELL, (ax, ay))
        paste_cell(frame, GAME_FILL_CELL, (bx2, by2))
        board_box = (bx, by, bx + board.width, by + board.height)
        pair_box = (ax - 62, ay - 62, bx2 + 62, ay + 62)
        row_box = (bx + 220, ay - 66, bx + 1008, ay + 66)
        clue_box = (bx + 30, ay - 66, bx + 225, ay + 66)
        if t < 9.6:
            dim_board_except(frame, board_box, [pair_box], 188)
        elif t < 12.2:
            dim_board_except(frame, board_box, [row_box], 180)
        else:
            dim_board_except(frame, board_box, [clue_box, row_box], 190)
        paste_answer_focus(frame, t, (ax, ay), (bx2, by2))
        paste_celebration(frame, t, ay)
        paste_clue_focus(frame, t, clue_box, ay)
        paste_final_logo(frame, t)
        if t < 9.6:
            text_center(draw, "Only these two cells change.", 1370, 43, CREAM, 2, INK)
        elif t < 12.2:
            text_center(draw, "That finishes the entire 4, 1 row.", 1370, 41, CREAM, 2, INK)
        else:
            text_center(draw, "Four filled.  Gap.  One filled.", 1370, 43, CREAM, 2, INK)

    if t < 12.2:
        text_center(draw, "Would you have tapped B?", 1535, 43, WHITE, 2, INK)
    else:
        text_center(draw, "That's why A is X and B is filled.", 1535, 38, CREAM, 2, INK)

    # Keep the searchable app name visible without turning the clip into an ad.
    if t < 12.2:
        draw.rounded_rectangle((205, 1665, 875, 1770), 52, fill=(255, 248, 224, 232), outline=(255, 190, 51, 245), width=5)
        text_center(draw, "Pip's Picture Pantry", 1687, 47, INK)
    text_center(draw, "iPhone + Android", 1795, 31, WHITE, 2, INK)
    return frame.convert("RGB")


def make_audio():
    rate = 48000
    samples = np.zeros(round(DURATION * rate), dtype=np.float64)

    def tone(start, duration, frequency, volume, decay=8):
        a, b = round(start * rate), min(len(samples), round((start + duration) * rate))
        x = np.arange(b - a) / rate
        samples[a:b] += volume * np.sin(2 * np.pi * frequency * x) * np.exp(-decay * x)

    tone(0.0, .45, 128, .20, 6)
    tone(1.15, .25, 440, .12, 11)
    for start in (5.0, 6.0, 7.0):
        tone(start, .12, 740, .12, 18)
    tone(7.4, .35, 523.25, .14, 7)
    tone(7.48, .45, 659.25, .12, 7)
    tone(9.6, .45, 784, .13, 8)
    tone(9.72, .55, 987.77, .10, 8)
    tone(12.2, .38, 392, .12, 8)
    fade = round(.35 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(np.int16(np.clip(samples, -1, 1) * 32767).tobytes())


def make_contact():
    times = (0.4, 1.8, 5.4, 6.4, 7.8, 9.0, 10.4, 12.8, 14.3)
    thumbs = []
    for t in times:
        image = frame_at(t).resize((220, 391), Image.Resampling.LANCZOS)
        thumbs.append(image)
    sheet = Image.new("RGB", (220 * len(thumbs), 391), WHITE)
    for index, image in enumerate(thumbs):
        sheet.paste(image, (220 * index, 0))
    sheet.save(CONTACT, "JPEG", quality=92)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    writer = imageio_ffmpeg.write_frames(
        str(SILENT), (W, H), fps=FPS, codec="libx264", quality=7,
        pix_fmt_in="rgb24", pix_fmt_out="yuv420p", macro_block_size=1,
        output_params=["-movflags", "+faststart"],
    )
    writer.send(None)
    try:
        for index in range(round(DURATION * FPS)):
            writer.send(np.asarray(frame_at(index / FPS), dtype=np.uint8))
    finally:
        writer.close()
    make_audio()
    subprocess.run([
        ffmpeg, "-y", "-i", str(SILENT), "-i", str(WAV), "-c:v", "copy",
        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(FINAL),
    ], check=True)
    frame_at(2.5).save(COVER, "JPEG", quality=95)
    make_contact()
    print(FINAL)


if __name__ == "__main__":
    main()
