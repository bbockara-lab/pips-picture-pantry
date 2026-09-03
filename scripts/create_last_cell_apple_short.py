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

W, H, FPS, DURATION = 1080, 1920, 30, 13.8
OUT = ROOT / "store-assets" / "social" / "last-cell-apple-8x8"
SOURCE = ROOT / "store-assets" / "social" / "next-move-8x8" / "hard-sequence-00.png"
SCENE_ART = ROOT / "store-assets" / "youtube" / "shorts" / "launch-campaign-en" / "artwork" / "pantry-magic-bg.png"
FINGER_ART = ROOT / "store-assets" / "social" / "almost-wrong-tap-8x8" / "artwork" / "real-finger-tap-v2.png"
CELEBRATION_ART = ROOT / "store-assets" / "social" / "one-safe-move-8x8" / "artwork" / "row-complete-celebration-v1.png"
LOGO_ART = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"
SILENT = OUT / "one-cell-apple-reveal-8x8-en-v1-silent.mp4"
WAV = OUT / "one-cell-apple-reveal-8x8-en-v1.wav"
FINAL = OUT / "one-cell-apple-reveal-8x8-en-v1.mp4"
COVER = OUT / "one-cell-apple-reveal-8x8-en-v1-cover.jpg"
CONTACT = OUT / "one-cell-apple-reveal-8x8-en-v1-contact.jpg"

INK = (60, 39, 37)
CREAM = (255, 248, 224)
GOLD = (255, 190, 51)
RED = (232, 74, 58)
APPLE = (213, 57, 48)
APPLE_LIGHT = (245, 102, 67)
LEAF = (91, 151, 72)
MINT = (105, 211, 174)
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


def centered(draw, text, y, size, fill=WHITE, stroke=3, stroke_fill=INK):
    face = font(size)
    box = draw.textbbox((0, 0), text, font=face, stroke_width=stroke)
    x = (W - (box[2] - box[0])) / 2
    draw.text((x, y), text, font=face, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)


def cover(image, size):
    scale = max(size[0] / image.width, size[1] / image.height)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (image.width - size[0]) // 2
    top = (image.height - size[1]) // 2
    return image.crop((left, top, left + size[0], top + size[1]))


SOURCE_IMAGE = Image.open(SOURCE).convert("RGB")
SCENE_IMAGE = Image.open(SCENE_ART).convert("RGB")
SOURCE_BOARD = SOURCE_IMAGE.crop((0, 0, SOURCE_IMAGE.width, 1260))
SOURCE_BOARD = SOURCE_BOARD.resize(
    (1030, round(SOURCE_BOARD.height * 1030 / SOURCE_BOARD.width)), Image.Resampling.LANCZOS
)
FINGER = Image.open(FINGER_ART).convert("RGBA")
finger_rgb = np.asarray(FINGER.convert("RGB"), dtype=np.float32)
finger_luma = finger_rgb[..., 0] * .2126 + finger_rgb[..., 1] * .7152 + finger_rgb[..., 2] * .0722
finger_subject = (
    np.clip((finger_rgb[..., 0] - 90.0) / 50.0, 0.0, 1.0)
    * np.clip((finger_luma - 65.0) / 45.0, 0.0, 1.0)
)
finger_alpha = np.asarray(FINGER.getchannel("A"), dtype=np.float32) / 255.0
FINGER.putalpha(
    Image.fromarray(np.uint8(255.0 * finger_subject * finger_alpha), mode="L")
    .filter(ImageFilter.GaussianBlur(1.2))
)
finger_box = FINGER.getchannel("A").getbbox()
if finger_box:
    FINGER = FINGER.crop(finger_box)
CELEBRATION = Image.open(CELEBRATION_ART).convert("RGBA")
LOGO = Image.open(LOGO_ART).convert("RGBA")

# Coordinates are calibrated against the 1290px simulator capture after scaling to 1030px.
# Every state uses these exact 88px in-game tiles on a single 94px pitch, preventing doubled rails.
GRID_X, GRID_Y, TILE, PITCH = 236, 212, 88, 94
GAME_FILL_CELL = SOURCE_BOARD.crop((236, 212, 324, 300)).convert("RGBA")
GAME_X_CELL = SOURCE_BOARD.crop((424, 212, 512, 300)).convert("RGBA")
GAME_BLANK_CELL = SOURCE_BOARD.crop((236, 588, 324, 676)).convert("RGBA")

# Column four reads 1 / 6: a single stem cell, a gap, then six apple cells.
# The two unresolved candidates are therefore unambiguous: row 2 is X, row 8 is filled.
APPLE_PUZZLE = (
    "00010000",
    "00100000",
    "01111100",
    "11111110",
    "11111110",
    "11111110",
    "01111100",
    "00111000",
)
WRONG_ROW, TARGET_ROW, DECISION_COL = 1, 7, 3


def clues(line):
    result, run = [], 0
    for value in line:
        if value == "1":
            run += 1
        elif run:
            result.append(run)
            run = 0
    if run:
        result.append(run)
    return result or [0]


def colored_fill_cell(color):
    art = GAME_FILL_CELL.copy()
    wash = Image.new("RGBA", art.size, (*color, 0))
    mask = Image.new("L", art.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((8, 8, art.width - 9, art.height - 9), 12, fill=205)
    wash.putalpha(mask)
    art.alpha_composite(wash)
    shine = Image.new("RGBA", art.size, (0, 0, 0, 0))
    ImageDraw.Draw(shine).rounded_rectangle((15, 13, 43, 24), 8, fill=(255, 244, 207, 92))
    art.alpha_composite(shine.filter(ImageFilter.GaussianBlur(4)))
    return art


APPLE_CELL = colored_fill_cell(APPLE)
APPLE_LIGHT_CELL = colored_fill_cell(APPLE_LIGHT)
LEAF_CELL = colored_fill_cell(LEAF)


def render_board(final=False, reveal_progress=0.0):
    board = Image.new("RGBA", SOURCE_BOARD.size, (255, 250, 232, 255))
    draw = ImageDraw.Draw(board)
    draw.rounded_rectangle(
        (8, 8, board.width - 8, board.height - 8), 58,
        fill=(255, 249, 229), outline=(214, 205, 184), width=5,
    )
    draw.rounded_rectangle(
        (215, 178, 1008, 974), 34,
        fill=(239, 232, 211), outline=(203, 193, 169), width=5,
    )

    for row_index, solution_row in enumerate(APPLE_PUZZLE):
        for col_index, value in enumerate(solution_row):
            unresolved = col_index == DECISION_COL and row_index in (WRONG_ROW, TARGET_ROW)
            state = "blank" if unresolved and not final else ("fill" if value == "1" else "x")
            x = GRID_X + col_index * PITCH
            y = GRID_Y + row_index * PITCH
            art = {"blank": GAME_BLANK_CELL, "x": GAME_X_CELL, "fill": GAME_FILL_CELL}[state]
            if final and state == "fill" and reveal_progress > 0:
                row_threshold = row_index / 8
                local = max(0.0, min(1.0, (reveal_progress - row_threshold) * 3.2))
                if local > 0:
                    if row_index <= 1:
                        color_art = LEAF_CELL
                    elif (row_index + col_index) % 5 == 0:
                        color_art = APPLE_LIGHT_CELL
                    else:
                        color_art = APPLE_CELL
                    art = Image.blend(art, color_art, local)
            board.alpha_composite(art, (x, y))

    chip_font = font(27)

    def draw_number_chip(cx, cy, value, active=False):
        radius = 24
        fill = (255, 204, 76) if active else (255, 248, 220)
        edge = (202, 150, 40) if active else (220, 207, 171)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=fill, outline=edge, width=3)
        label = str(value)
        box = draw.textbbox((0, 0), label, font=chip_font)
        draw.text(
            (cx - (box[2] - box[0]) / 2, cy - (box[3] - box[1]) / 2 - 2),
            label, font=chip_font, fill=INK,
        )

    row_clues = [clues(row) for row in APPLE_PUZZLE]
    columns = ["".join(row[col] for row in APPLE_PUZZLE) for col in range(8)]
    col_clues = [clues(column) for column in columns]

    for row_index, values in enumerate(row_clues):
        cy = GRID_Y + row_index * PITCH + TILE // 2
        draw.rounded_rectangle((28, cy - 42, 207, cy + 42), 42, fill=(255, 252, 238))
        total = len(values) * 52
        start = 118 - total / 2 + 26
        for index, value in enumerate(values):
            draw_number_chip(round(start + index * 52), cy, value)

    for col_index, values in enumerate(col_clues):
        cx = GRID_X + col_index * PITCH + TILE // 2
        active = col_index == DECISION_COL
        capsule_fill = (255, 229, 130) if active else (255, 252, 238)
        draw.rounded_rectangle((cx - 42, 18, cx + 42, 174), 42, fill=capsule_fill)
        total = len(values) * 52
        start = 96 - total / 2 + 26
        for index, value in enumerate(values):
            draw_number_chip(cx, round(start + index * 52), value, active=active)
    return board


BOARD = render_board()


def make_background():
    bg = cover(SCENE_IMAGE, (W, H)).filter(ImageFilter.GaussianBlur(13))
    bg = ImageEnhance.Brightness(bg).enhance(.48).convert("RGBA")
    bg.alpha_composite(Image.new("RGBA", (W, H), (38, 20, 16, 95)))
    return bg


BG = make_background()


def smoothstep(value):
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def board_geometry(t):
    if t >= 9.75:
        reveal = smoothstep((t - 9.75) / 1.6)
        board = render_board(final=True, reveal_progress=reveal)
    elif t >= 8.05:
        board = render_board(final=True)
    else:
        board = BOARD.copy()
    mask = Image.new("L", board.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, board.width - 1, board.height - 1), 36, fill=255)
    board.putalpha(mask)
    return board, (W - board.width) // 2, 292


def dim_except(frame, board_box, cutouts, alpha=198):
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(board_box, 36, fill=alpha)
    for box in cutouts:
        draw.rounded_rectangle(box, 28, fill=10)
    shade = Image.new("RGBA", (W, H), (16, 8, 7, 0))
    shade.putalpha(mask)
    frame.alpha_composite(shade)


def glow_box(frame, box, color, phase=0.0, width=18):
    pulse = .76 + .24 * math.sin(phase * math.pi * 4.5)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = box
    for grow, alpha, line in ((28, 58, width + 18), (14, 120, width + 7), (2, 245, width)):
        draw.rounded_rectangle(
            (x1 - grow, y1 - grow, x2 + grow, y2 + grow), 28 + grow,
            outline=(*color, round(alpha * pulse)), width=line,
        )
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(2)))


def finger_pose(frame, t, wrong, target):
    if t >= 8.05:
        return
    if t < .8:
        p = smoothstep(t / .8)
        tip = (1180 + (wrong[0] - 1180) * p, 1440 + (wrong[1] - 1440) * p)
    elif t < 2.0:
        tip = (wrong[0] + 5 * math.sin(t * 7), wrong[1] + 5 * math.cos(t * 5))
    elif t < 2.65:
        p = smoothstep((t - 2.0) / .65)
        tip = (wrong[0] + 110 * p, wrong[1] + 130 * p)
    elif t < 5.0:
        tip = (wrong[0] + 110, wrong[1] + 130)
    elif t < 7.4:
        p = smoothstep((t - 5.0) / 2.4)
        tip = (wrong[0] + 110 + (target[0] - wrong[0] - 110) * p,
               wrong[1] + 130 + (target[1] - wrong[1] - 130) * p)
    else:
        press = math.sin(min(1.0, (t - 7.4) / .48) * math.pi)
        tip = (target[0], target[1] + 18 * press)

    hand = FINGER.copy()
    target_width = 430
    hand = hand.resize((target_width, round(hand.height * target_width / hand.width)), Image.Resampling.LANCZOS)
    alpha = np.asarray(hand.getchannel("A"), dtype=np.float32)
    x_axis = np.linspace(0.0, 1.0, hand.width, dtype=np.float32)
    y_axis = np.linspace(0.0, 1.0, hand.height, dtype=np.float32)
    alpha *= np.clip((1.0 - x_axis) / .22, 0.0, 1.0)[None, :]
    alpha *= np.clip((1.0 - y_axis) / .16, 0.0, 1.0)[:, None] * .95
    hand.putalpha(Image.fromarray(np.uint8(alpha), mode="L"))
    x = round(tip[0] - hand.width * .14)
    y = round(tip[1] - hand.height * .06)
    shadow = hand.getchannel("A").filter(ImageFilter.GaussianBlur(18))
    shadow_art = Image.new("RGBA", hand.size, (20, 8, 6, 118))
    shadow_art.putalpha(shadow.point(lambda v: round(v * .40)))
    frame.alpha_composite(shadow_art, (x + 18, y + 25))
    frame.alpha_composite(hand, (x, y))


def candidate_rail(frame, center, t, color):
    pulse = .76 + .24 * math.sin(t * math.pi * 5)
    half = TILE // 2 + 14 + round(3 * pulse)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(
        (center[0] - half, center[1] - half, center[0] + half, center[1] + half),
        24, outline=(*color, round(245 * pulse)), width=12,
    )
    frame.alpha_composite(layer)


def reveal_burst(frame, t, target, board_box):
    elapsed = t - 9.75
    if elapsed < 0:
        return
    fade = 1.0 if elapsed < 2.0 else max(0.0, 1.0 - (elapsed - 2.0) / .6)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = board_box
    for grow, alpha, width in ((10, 190, 18), (25, 105, 24), (44, 45, 34)):
        draw.rounded_rectangle(
            (x1 - grow, y1 - grow, x2 + grow, y2 + grow), 38 + grow,
            outline=(255, 188, 38, round(alpha * fade)), width=width,
        )
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(3)))
    flare = CELEBRATION.crop((115, 115, 580, 615))
    flare.thumbnail((110, 110), Image.Resampling.LANCZOS)
    flare.putalpha(flare.getchannel("A").point(lambda v: round(v * fade)))
    orbit = min(1.0, elapsed / 1.4) * math.pi * 2
    for offset in (0, math.pi):
        fx = target[0] + math.cos(orbit + offset) * 180
        fy = target[1] + math.sin(orbit + offset) * 115
        frame.alpha_composite(flare, (round(fx - 55), round(fy - 55)))


def logo_card(frame, t):
    if t < 12.0:
        return
    p = smoothstep((t - 12.0) / .55)
    width = round(430 * (.84 + .16 * p))
    art = LOGO.resize((width, round(LOGO.height * width / LOGO.width)), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda value: round(value * p)))
    frame.alpha_composite(art, ((W - art.width) // 2, 1325 - art.height // 2))


def frame_at(t):
    frame = BG.copy()
    draw = ImageDraw.Draw(frame)
    if t < 2.1:
        centered(draw, "ONE CELL FINISHES THE PICTURE.", 76, 55, GOLD)
        centered(draw, "Top or bottom?", 170, 43, CREAM, 2)
    elif t < 5.0:
        centered(draw, "CHECK THE COLUMN CLUE.", 76, 64, WHITE)
        centered(draw, "One. Gap. Six.", 173, 45, GOLD, 2)
    elif t < 8.05:
        centered(draw, "THE SIX HAS ONE PLACE TO END.", 78, 53, GOLD)
        centered(draw, "Follow it to the bottom.", 172, 41, CREAM, 2)
    elif t < 9.75:
        centered(draw, "BOTTOM FILLS. TOP IS A GAP.", 78, 56, WHITE)
        centered(draw, "The 1 / 6 column is complete.", 174, 40, GOLD, 2)
    elif t < 12.0:
        centered(draw, "AND THE APPLE APPEARS.", 77, 66, GOLD)
        centered(draw, "One precise tap finished it.", 176, 41, CREAM, 2)
    else:
        centered(draw, "WHAT PICTURE WILL YOU REVEAL?", 77, 52, WHITE)

    board, left, top = board_geometry(t)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (left + 13, top + 21, left + board.width + 13, top + board.height + 21),
        40, fill=(8, 3, 3, 128),
    )
    frame.alpha_composite(shadow)
    frame.alpha_composite(board, (left, top))

    cx = left + GRID_X + DECISION_COL * PITCH + TILE // 2
    wrong = (cx, top + GRID_Y + WRONG_ROW * PITCH + TILE // 2)
    target = (cx, top + GRID_Y + TARGET_ROW * PITCH + TILE // 2)
    board_box = (left, top, left + board.width, top + board.height)
    clue_box = (cx - 67, top + 3, cx + 67, top + 190)
    wrong_box = (wrong[0] - 66, wrong[1] - 66, wrong[0] + 66, wrong[1] + 66)
    target_box = (target[0] - 66, target[1] - 66, target[0] + 66, target[1] + 66)
    column_box = (cx - 64, top + GRID_Y - 22, cx + 64, top + GRID_Y + 7 * PITCH + TILE + 22)

    if t < 2.1:
        dim_except(frame, board_box, [wrong_box, target_box], 190)
        candidate_rail(frame, wrong, t, RED)
        candidate_rail(frame, target, t + .32, MINT)
    elif t < 5.0:
        dim_except(frame, board_box, [clue_box, column_box], 210)
        glow_box(frame, clue_box, GOLD, t - 2.1, 20)
    elif t < 8.05:
        dim_except(frame, board_box, [clue_box, target_box], 206)
        glow_box(frame, target_box, MINT, t - 5.0, 18)
    elif t < 9.75:
        dim_except(frame, board_box, [clue_box, column_box], 196)
        glow_box(frame, column_box, GOLD, t - 8.05, 17)
    else:
        reveal_burst(frame, t, target, board_box)

    finger_pose(frame, t, wrong, target)
    logo_card(frame, t)

    if t < 12.0:
        draw.rounded_rectangle((231, 1634, 849, 1745), 55, fill=(255, 248, 224, 238), outline=GOLD, width=5)
        centered(draw, "Pip's Picture Pantry", 1662, 46, INK, 0)
    else:
        draw.rounded_rectangle((205, 1480, 875, 1598), 59, fill=(255, 248, 224, 242), outline=GOLD, width=5)
        centered(draw, "Pip's Picture Pantry", 1507, 48, INK, 0)
        centered(draw, "600 cozy pictures to uncover", 1640, 38, CREAM, 2)
    centered(draw, "iPhone + Android", 1793, 30, WHITE, 2)
    return frame.convert("RGB")


def make_audio():
    rate = 48000
    samples = np.zeros(round(DURATION * rate), dtype=np.float64)

    def tone(start, duration, frequency, volume, decay=8):
        a = round(start * rate)
        b = min(len(samples), round((start + duration) * rate))
        x = np.arange(b - a) / rate
        samples[a:b] += volume * np.sin(2 * np.pi * frequency * x) * np.exp(-decay * x)

    for start in (.35, 1.05):
        tone(start, .20, 70, .23, 15)
        tone(start + .05, .15, 52, .15, 17)
    tone(2.1, .25, 420, .13, 10)
    tone(2.18, .18, 630, .10, 12)
    for start in (5.05, 5.83, 6.61, 7.39):
        tone(start, .10, 750, .12, 21)
    tone(8.05, .13, 1120, .16, 22)
    for frequency, delay in ((523.25, 0), (659.25, .08), (783.99, .16)):
        tone(8.10 + delay, .52, frequency, .10, 7)
    for frequency, delay in ((392, 0), (523.25, .08), (659.25, .16), (783.99, .25), (1046.5, .34)):
        tone(9.75 + delay, .78, frequency, .12, 5)
    tone(12.0, .42, 523.25, .10, 7)
    fade = round(.45 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(np.int16(np.clip(samples, -1, 1) * 32767).tobytes())


def make_contact():
    times = (.45, 1.45, 2.5, 3.7, 5.35, 6.8, 7.7, 8.55, 9.25, 10.25, 11.35, 12.5, 13.3)
    thumbs = [frame_at(t).resize((216, 384), Image.Resampling.LANCZOS) for t in times]
    sheet = Image.new("RGB", (216 * len(thumbs), 384), CREAM)
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, (216 * index, 0))
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
    frame_at(.85).save(COVER, "JPEG", quality=95)
    make_contact()
    print(FINAL)


if __name__ == "__main__":
    main()
