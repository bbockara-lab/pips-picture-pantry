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

W, H, FPS, DURATION = 1080, 1920, 30, 12.8
OUT = ROOT / "store-assets" / "social" / "almost-wrong-tap-8x8"
SOURCE = ROOT / "store-assets" / "social" / "next-move-8x8" / "hard-sequence-04.png"
CELL_SOURCE = ROOT / "store-assets" / "social" / "next-move-8x8" / "hard-sequence-00.png"
SCENE_ART = ROOT / "store-assets" / "youtube" / "shorts" / "launch-campaign-en" / "artwork" / "pantry-magic-bg.png"
FINGER_ART = OUT / "artwork" / "real-finger-tap-v2.png"
CELEBRATION_ART = ROOT / "store-assets" / "social" / "one-safe-move-8x8" / "artwork" / "row-complete-celebration-v1.png"
LOGO_ART = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"
SILENT = OUT / "almost-wrong-tap-pantry-jar-8x8-en-v2-silent.mp4"
WAV = OUT / "almost-wrong-tap-pantry-jar-8x8-en-v2.wav"
FINAL = OUT / "almost-wrong-tap-pantry-jar-8x8-en-v2.mp4"
COVER = OUT / "almost-wrong-tap-pantry-jar-8x8-en-v2-cover.jpg"
CONTACT = OUT / "almost-wrong-tap-pantry-jar-8x8-en-v2-contact.jpg"

INK = (60, 39, 37)
CREAM = (255, 248, 224)
GOLD = (255, 190, 51)
RED = (236, 78, 63)
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
CELL_SOURCE_IMAGE = Image.open(CELL_SOURCE).convert("RGB")
SCENE_IMAGE = Image.open(SCENE_ART).convert("RGB")
SOURCE_BOARD = SOURCE_IMAGE.crop((0, 0, SOURCE_IMAGE.width, 1260))
SOURCE_BOARD = SOURCE_BOARD.resize((1030, round(SOURCE_BOARD.height * 1030 / SOURCE_BOARD.width)), Image.Resampling.LANCZOS)
CELL_BOARD = CELL_SOURCE_IMAGE.crop((0, 0, CELL_SOURCE_IMAGE.width, 1260))
CELL_BOARD = CELL_BOARD.resize((1030, round(CELL_BOARD.height * 1030 / CELL_BOARD.width)), Image.Resampling.LANCZOS)
FINGER = Image.open(FINGER_ART).convert("RGBA")
# The generated cutout still carries a dark, nearly opaque backing in its lower-right
# quadrant. Remove it by deriving a second matte from luminance, then intersecting it
# with the authored alpha. This keeps skin and nail detail without a rectangular plate.
finger_rgb = np.asarray(FINGER.convert("RGB"), dtype=np.float32)
finger_luma = finger_rgb[..., 0] * .2126 + finger_rgb[..., 1] * .7152 + finger_rgb[..., 2] * .0722
finger_red = finger_rgb[..., 0]
finger_subject = (
    np.clip((finger_red - 90.0) / 50.0, 0.0, 1.0)
    * np.clip((finger_luma - 65.0) / 45.0, 0.0, 1.0)
)
finger_alpha = np.asarray(FINGER.getchannel("A"), dtype=np.float32) / 255.0
finger_clean_alpha = np.uint8(255.0 * finger_subject * finger_alpha)
FINGER.putalpha(Image.fromarray(finger_clean_alpha, mode="L").filter(ImageFilter.GaussianBlur(1.2)))
FINGER_BOX = FINGER.getchannel("A").getbbox()
if FINGER_BOX:
    FINGER = FINGER.crop(FINGER_BOX)
CELEBRATION = Image.open(CELEBRATION_ART).convert("RGBA")
LOGO = Image.open(LOGO_ART).convert("RGBA")
# The source screenshot is scaled from 1290px to 1030px. Its live 8x8 grid
# starts at (236, 212), with 88px cell art on a 94px pitch. Earlier crops used
# three different vertical offsets and then enlarged every tile to 91px; that
# pulled neighbouring rails into the cell art and made the board look doubled.
GRID_X, GRID_Y, TILE, PITCH = 236, 212, 88, 94
GAME_FILL_CELL = CELL_BOARD.crop((236, 212, 324, 300)).convert("RGBA")
GAME_X_CELL = CELL_BOARD.crop((424, 212, 512, 300)).convert("RGBA")
GAME_BLANK_CELL = CELL_BOARD.crop((236, 588, 324, 676)).convert("RGBA")
PANTRY_JAR = (
    "00111100",
    "01000010",
    "01111110",
    "01011010",
    "01011010",
    "01011010",
    "01111110",
    "00111100",
)


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


def render_pantry_jar_board():
    """Render a new puzzle from exact in-game cell art on one shared coordinate grid."""
    board = Image.new("RGBA", SOURCE_BOARD.size, (255, 250, 232, 255))
    draw = ImageDraw.Draw(board)
    draw.rounded_rectangle((8, 8, board.width - 8, board.height - 8), 58,
                           fill=(255, 249, 229), outline=(214, 205, 184), width=5)
    draw.rounded_rectangle((215, 178, 1008, 974), 34,
                           fill=(239, 232, 211), outline=(203, 193, 169), width=5)

    # Completed top rows establish a different picture; the fourth row holds the decision.
    states = []
    for row_index, solution_row in enumerate(PANTRY_JAR):
        if row_index < 3:
            states.append(["fill" if value == "1" else "x" for value in solution_row])
        elif row_index == 3:
            states.append(["x", "blank", "blank", "fill", "fill", "x", "fill", "x"])
        else:
            states.append(["blank"] * 8)

    tile_art = {"fill": GAME_FILL_CELL, "x": GAME_X_CELL, "blank": GAME_BLANK_CELL}
    for row_index, row in enumerate(states):
        for col_index, state in enumerate(row):
            x = GRID_X + col_index * PITCH
            y = GRID_Y + row_index * PITCH
            board.alpha_composite(tile_art[state], (x, y))

    chip_font = font(27)

    def draw_number_chip(cx, cy, value, active=False):
        radius = 24
        fill = (255, 204, 76) if active else (255, 248, 220)
        edge = (202, 150, 40) if active else (220, 207, 171)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=fill, outline=edge, width=3)
        label = str(value)
        box = draw.textbbox((0, 0), label, font=chip_font)
        draw.text((cx - (box[2] - box[0]) / 2, cy - (box[3] - box[1]) / 2 - 2), label,
                  font=chip_font, fill=INK)

    row_clues = [clues(row) for row in PANTRY_JAR]
    columns = ["".join(row[col] for row in PANTRY_JAR) for col in range(8)]
    col_clues = [clues(column) for column in columns]

    for row_index, values in enumerate(row_clues):
        cy = GRID_Y + row_index * PITCH + TILE // 2
        capsule_fill = (255, 232, 138) if row_index == 3 else (255, 252, 238)
        draw.rounded_rectangle((28, cy - 42, 207, cy + 42), 42, fill=capsule_fill)
        total = len(values) * 52
        start = 118 - total / 2 + 26
        for index, value in enumerate(values):
            draw_number_chip(round(start + index * 52), cy, value, active=row_index == 3)

    for col_index, values in enumerate(col_clues):
        cx = GRID_X + col_index * PITCH + TILE // 2
        capsule_fill = (236, 246, 226) if col_index in (1, 2) else (255, 252, 238)
        draw.rounded_rectangle((cx - 42, 18, cx + 42, 174), 42, fill=capsule_fill)
        total = len(values) * 52
        start = 96 - total / 2 + 26
        for index, value in enumerate(values):
            draw_number_chip(cx, round(start + index * 52), value)
    return board


BOARD = render_pantry_jar_board()


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
    # Keep one immutable coordinate system. Camera motion was the source of the v1 drift.
    board = BOARD.copy()
    mask = Image.new("L", board.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, board.width - 1, board.height - 1), 36, fill=255)
    board.putalpha(mask)
    return board, (W - board.width) // 2, 292


def dim_except(frame, board_box, cutouts, alpha=190):
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(board_box, 36, fill=alpha)
    for box in cutouts:
        draw.rounded_rectangle(box, 28, fill=12)
    shade = Image.new("RGBA", (W, H), (16, 8, 7, 0))
    shade.putalpha(mask)
    frame.alpha_composite(shade)


def glow_box(frame, box, color, phase=0.0, width=18):
    pulse = .76 + .24 * math.sin(phase * math.pi * 5.0)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = box
    for grow, alpha, line in ((28, 60, width + 18), (14, 125, width + 7), (2, 245, width)):
        draw.rounded_rectangle((x1 - grow, y1 - grow, x2 + grow, y2 + grow), 28 + grow,
                               outline=(*color, round(alpha * pulse)), width=line)
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(2)))


def paste_cell(frame, cell, center):
    art = cell
    frame.alpha_composite(art, (round(center[0] - art.width / 2), round(center[1] - art.height / 2)))


def finger_pose(frame, t, wrong, safe):
    if t >= 7.05:
        return
    if t < .9:
        p = smoothstep(t / .9)
        tip = (1180 + (wrong[0] - 1180) * p, 1540 + (wrong[1] - 1540) * p)
    elif t < 1.7:
        tip = (wrong[0] + 5 * math.sin(t * 8), wrong[1] + 5 * math.cos(t * 6))
    elif t < 2.3:
        p = smoothstep((t - 1.7) / .6)
        tip = (wrong[0] + 95 * p, wrong[1] + 165 * p)
    elif t < 4.8:
        tip = (wrong[0] + 95, wrong[1] + 165)
    elif t < 6.45:
        p = smoothstep((t - 4.8) / 1.65)
        tip = (wrong[0] + 95 + (safe[0] - wrong[0] - 95) * p,
               wrong[1] + 165 + (safe[1] - wrong[1] - 165) * p)
    else:
        press = math.sin(min(1, (t - 6.45) / .38) * math.pi)
        tip = (safe[0], safe[1] + 18 * press)

    hand = FINGER.copy()
    target_width = 430
    hand = hand.resize((target_width, round(hand.height * target_width / hand.width)), Image.Resampling.LANCZOS)
    alpha_array = np.asarray(hand.getchannel("A"), dtype=np.float32)
    # The source hand exits its generated canvas at the lower-right. Feather those
    # two canvas edges so no hard rectangular crop can ever appear over the board.
    x_axis = np.linspace(0.0, 1.0, hand.width, dtype=np.float32)
    y_axis = np.linspace(0.0, 1.0, hand.height, dtype=np.float32)
    x_fade = np.clip((1.0 - x_axis) / .22, 0.0, 1.0)
    y_fade = np.clip((1.0 - y_axis) / .16, 0.0, 1.0)
    alpha_array *= x_fade[None, :] * y_fade[:, None] * .95
    hand.putalpha(Image.fromarray(np.uint8(alpha_array), mode="L"))
    # Calibrated after the clean v2 alpha crop: fingertip center is at 14% x / 6% y.
    x = round(tip[0] - hand.width * .14)
    y = round(tip[1] - hand.height * .06)
    shadow = hand.getchannel("A").filter(ImageFilter.GaussianBlur(18))
    shadow_art = Image.new("RGBA", hand.size, (20, 8, 6, 118))
    shadow_art.putalpha(shadow.point(lambda v: round(v * .40)))
    frame.alpha_composite(shadow_art, (x + 18, y + 25))
    frame.alpha_composite(hand, (x, y))


def mistake_target(frame, t, wrong):
    if t >= 1.7:
        return
    elapsed = max(0.0, t - .45)
    pulse = .78 + .22 * math.sin(elapsed * math.pi * 6)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    # Keep the warning rail outside the target cell. The old circular ring ran
    # across the cell corners and hid the very move viewers needed to inspect.
    half = TILE // 2 + 14 + round(4 * pulse)
    draw.rounded_rectangle((wrong[0] - half, wrong[1] - half,
                            wrong[0] + half, wrong[1] + half),
                           24, outline=(255, 83, 67, round(245 * pulse)), width=12)
    outer = half + 17
    draw.rounded_rectangle((wrong[0] - outer, wrong[1] - outer,
                            wrong[0] + outer, wrong[1] + outer),
                           34, outline=(255, 222, 191, round(105 * pulse)), width=8)
    frame.alpha_composite(layer)


def row_celebration(frame, t, row_box):
    elapsed = t - 7.05
    if elapsed < 0 or elapsed > 2.85:
        return
    p = smoothstep(min(1.0, elapsed / .55))
    fade = 1.0 if elapsed < 2.35 else max(0.0, 1 - (elapsed - 2.35) / .5)
    x1, y1, x2, y2 = row_box
    right = round(x1 + (x2 - x1) * p)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    if right > x1 + 24:
        # The authored rail sits outside the cells. A broad blurred aura gives
        # it weight while the crisp inner edge never paints over cell artwork.
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        aura_draw = ImageDraw.Draw(aura)
        aura_draw.rounded_rectangle((x1, y1, right, y2), 34,
                                    outline=(255, 179, 27, round(210 * fade)), width=24)
        frame.alpha_composite(aura.filter(ImageFilter.GaussianBlur(16)))
        draw.rounded_rectangle((x1, y1, right, y2), 34,
                               outline=(255, 181, 30, round(255 * fade)), width=16)
        draw.rounded_rectangle((x1 + 9, y1 + 9, right - 9, y2 - 9), 25,
                               outline=(255, 255, 225, round(255 * fade)), width=7)
        draw.rounded_rectangle((x1 + 17, y1 + 17, right - 17, y2 - 17), 18,
                               outline=(79, 220, 176, round(235 * fade)), width=5)
    frame.alpha_composite(layer)
    flare = CELEBRATION.crop((115, 115, 580, 615))
    flare.thumbnail((68, 68), Image.Resampling.LANCZOS)
    flare.putalpha(flare.getchannel("A").point(lambda v: round(v * fade)))
    fx = round(x1 + (x2 - x1) * min(1.0, elapsed / 1.15))
    # Sparkles travel just outside the rail instead of covering the solved row.
    fy = y1 - 28 if int(elapsed * 6) % 2 == 0 else y2 + 28
    frame.alpha_composite(flare, (fx - flare.width // 2, fy - flare.height // 2))


def logo_card(frame, t):
    if t < 9.9:
        return
    p = smoothstep((t - 9.9) / .55)
    width = round(470 * (.86 + .14 * p))
    art = LOGO.resize((width, round(LOGO.height * width / LOGO.width)), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda v: round(v * p)))
    frame.alpha_composite(art, ((W - art.width) // 2, 1035 - art.height // 2))


def frame_at(t):
    frame = BG.copy()
    draw = ImageDraw.Draw(frame)
    if t < 1.7:
        centered(draw, "I ALMOST TAPPED THIS.", 78, 70, GOLD)
        centered(draw, "One tap would've ruined it.", 175, 42, CREAM, 2)
    elif t < 2.6:
        centered(draw, "WAIT.", 74, 94, RED, 4)
        centered(draw, "The row clue says no.", 188, 42, CREAM, 2)
    elif t < 4.8:
        centered(draw, "THE 1, 2, 1 CLUE SAYS NO.", 84, 58, GOLD)
        centered(draw, "One. Gap. Two. Gap. One.", 178, 41, CREAM, 2)
    elif t < 7.05:
        centered(draw, "SO WHICH TAP IS SAFE?", 82, 64, WHITE)
        centered(draw, "Watch the fingertip.", 178, 42, GOLD, 2)
    elif t < 9.9:
        centered(draw, "SAVED THE RUN.", 82, 76, GOLD)
        centered(draw, "The whole row locks in.", 185, 42, CREAM, 2)
    else:
        centered(draw, "WOULD YOU HAVE CAUGHT IT?", 78, 57, WHITE)

    board, left, top = board_geometry(t)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((left + 13, top + 21, left + board.width + 13, top + board.height + 21),
                                             40, fill=(8, 3, 3, 128))
    frame.alpha_composite(shadow)
    frame.alpha_composite(board, (left, top))

    target_row = 3
    safe_col, wrong_col = 1, 2
    row_center = top + GRID_Y + target_row * PITCH + TILE // 2
    safe = (left + GRID_X + safe_col * PITCH + TILE // 2, row_center)
    wrong = (left + GRID_X + wrong_col * PITCH + TILE // 2, row_center)
    board_box = (left, top, left + board.width, top + board.height)
    wrong_box = (wrong[0] - 62, wrong[1] - 62, wrong[0] + 62, wrong[1] + 62)
    safe_box = (safe[0] - 62, safe[1] - 62, safe[0] + 62, safe[1] + 62)
    clue_box = (left + 18, row_center - 64, left + 217, row_center + 64)
    row_top = top + GRID_Y + target_row * PITCH
    row_box = (left + GRID_X - 40, row_top - 40,
               left + GRID_X + 7 * PITCH + TILE + 40, row_top + TILE + 40)

    if 1.7 <= t < 4.8:
        dim_except(frame, board_box, [clue_box, row_box], 198)
        glow_box(frame, clue_box, GOLD, t - 1.7, 18)
    elif 4.8 <= t < 7.05:
        dim_except(frame, board_box, [wrong_box, safe_box, clue_box], 202)
        glow_box(frame, safe_box, MINT, t - 4.8, 17)
    elif 7.05 <= t < 9.9:
        paste_cell(frame, GAME_X_CELL, wrong)
        paste_cell(frame, GAME_FILL_CELL, safe)
        dim_except(frame, board_box, [row_box], 182)
        row_celebration(frame, t, row_box)
    elif t >= 9.9:
        paste_cell(frame, GAME_X_CELL, wrong)
        paste_cell(frame, GAME_FILL_CELL, safe)
        dim_except(frame, board_box, [row_box], 205)
        glow_box(frame, row_box, GOLD, t - 9.9, 13)
        logo_card(frame, t)

    mistake_target(frame, t, wrong)
    finger_pose(frame, t, wrong, safe)

    if 4.8 <= t < 7.05:
        remaining = max(1, math.ceil(7.05 - t))
        cy = 1165
        draw.ellipse((W // 2 - 82, cy - 82, W // 2 + 82, cy + 82),
                     fill=(43, 26, 23, 230), outline=GOLD, width=8)
        face = font(112)
        box = draw.textbbox((0, 0), str(remaining), font=face)
        draw.text((W / 2 - (box[2] - box[0]) / 2, cy - 67), str(remaining), font=face, fill=WHITE)

    if t < 9.9:
        draw.rounded_rectangle((246, 1638, 834, 1746), 54, fill=(255, 248, 224, 238), outline=GOLD, width=5)
        centered(draw, "Pip's Picture Pantry", 1662, 46, INK, 0)
    else:
        draw.rounded_rectangle((210, 1450, 870, 1570), 60, fill=(255, 248, 224, 240), outline=GOLD, width=5)
        centered(draw, "Pip's Picture Pantry", 1477, 48, INK, 0)
        centered(draw, "Can you spot the next safe move?", 1615, 37, CREAM, 2)
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

    # Two low heartbeats, an abrupt warning, three clock ticks, then a warm success chord.
    for start in (.28, .92):
        tone(start, .20, 72, .23, 15)
        tone(start + .055, .16, 54, .16, 17)
    tone(1.7, .32, 176, .25, 9)
    tone(1.72, .18, 92, .22, 14)
    tone(2.62, .26, 440, .10, 10)
    for start in (4.85, 5.78, 6.64):
        tone(start, .11, 760, .13, 20)
    tone(7.05, .12, 1180, .16, 22)
    for frequency, delay in ((523.25, 0), (659.25, .07), (783.99, .14), (1046.5, .22)):
        tone(7.12 + delay, .58, frequency, .10, 7)
    tone(9.9, .38, 392, .11, 8)
    fade = round(.4 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(np.int16(np.clip(samples, -1, 1) * 32767).tobytes())


def make_contact():
    times = (.45, 1.25, 1.95, 3.25, 5.15, 6.6, 7.35, 8.45, 10.35, 11.8)
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
