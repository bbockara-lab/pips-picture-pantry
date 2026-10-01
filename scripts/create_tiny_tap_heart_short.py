from __future__ import annotations

import importlib.util
import math
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".tmp" / "video_deps"))

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter


import imageio_ffmpeg  # noqa: E402


spec = importlib.util.spec_from_file_location(
    "apple_short_base", ROOT / "scripts" / "create_last_cell_apple_short.py"
)
base = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(base)


W, H, FPS, DURATION = 1080, 1920, 30, 11.4
OUT = ROOT / "store-assets" / "social" / "tiny-tap-heart-8x8"
HAND_ART = OUT / "artwork" / "cute-storybook-tap-hand-v1.png"
SILENT = OUT / "three-tiny-taps-heart-8x8-en-v1-silent.mp4"
WAV = OUT / "three-tiny-taps-heart-8x8-en-v1.wav"
FINAL = OUT / "three-tiny-taps-heart-8x8-en-v1.mp4"
COVER = OUT / "three-tiny-taps-heart-8x8-en-v1-cover.jpg"
CONTACT = OUT / "three-tiny-taps-heart-8x8-en-v1-contact.jpg"

INK = (60, 39, 37)
CREAM = (255, 248, 224)
GOLD = (255, 190, 51)
CORAL = (231, 83, 82)
PINK = (245, 126, 121)
MINT = (105, 211, 174)
WHITE = (255, 255, 255)

GRID_X, GRID_Y, TILE, PITCH = base.GRID_X, base.GRID_Y, base.TILE, base.PITCH
GAME_FILL_CELL = base.GAME_FILL_CELL
GAME_X_CELL = base.GAME_X_CELL
GAME_BLANK_CELL = base.GAME_BLANK_CELL
LOGO = base.LOGO
BG = base.BG

HEART = (
    "00000000",
    "01100110",
    "11111111",
    "11111111",
    "01111110",
    "00111100",
    "00011000",
    "00000000",
)
TARGETS = ((1, 1), (1, 6), (6, 3))
TAP_TIMES = (2.15, 3.55, 4.95)
BOARD_LEFT = (W - base.SOURCE_BOARD.width) // 2
BOARD_TOP = 292


def build_heart_effect_art():
    mask = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(mask)
    for row_index, row in enumerate(HEART):
        for col_index, value in enumerate(row):
            if value != "1":
                continue
            x1 = BOARD_LEFT + GRID_X + col_index * PITCH - 4
            y1 = BOARD_TOP + GRID_Y + row_index * PITCH - 4
            draw.rounded_rectangle((x1, y1, x1 + PITCH + 8, y1 + PITCH + 8), 13, fill=255)
    bounds = mask.getbbox()
    wide = mask.filter(ImageFilter.MaxFilter(61))
    medium = mask.filter(ImageFilter.MaxFilter(35))
    outer_wide = ImageChops.subtract(wide, mask).filter(ImageFilter.GaussianBlur(15))
    outer_medium = ImageChops.subtract(medium, mask).filter(ImageFilter.GaussianBlur(4))
    return bounds, outer_wide, outer_medium


HEART_EFFECT_BOUNDS, HEART_GLOW_WIDE, HEART_GLOW_MEDIUM = build_heart_effect_art()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def colored_fill_cell(color):
    art = GAME_FILL_CELL.copy()
    wash = Image.new("RGBA", art.size, (*color, 0))
    mask = Image.new("L", art.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((8, 8, art.width - 9, art.height - 9), 12, fill=214)
    wash.putalpha(mask)
    art.alpha_composite(wash)
    shine = Image.new("RGBA", art.size, (0, 0, 0, 0))
    ImageDraw.Draw(shine).ellipse((14, 11, 47, 29), fill=(255, 246, 224, 92))
    art.alpha_composite(shine.filter(ImageFilter.GaussianBlur(5)))
    return art


HEART_CELL = colored_fill_cell(CORAL)
HEART_LIGHT_CELL = colored_fill_cell(PINK)


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


def target_revealed(t, index):
    return t >= TAP_TIMES[index] + .18


def render_board(t):
    board = Image.new("RGBA", base.SOURCE_BOARD.size, (255, 250, 232, 255))
    draw = ImageDraw.Draw(board)
    draw.rounded_rectangle(
        (8, 8, board.width - 8, board.height - 8), 58,
        fill=(255, 249, 229), outline=(214, 205, 184), width=5,
    )
    draw.rounded_rectangle(
        (215, 178, 1008, 974), 34,
        fill=(239, 232, 211), outline=(203, 193, 169), width=5,
    )

    color_progress = smoothstep((t - 5.25) / 1.75)
    for row_index, solution_row in enumerate(HEART):
        for col_index, value in enumerate(solution_row):
            target_index = TARGETS.index((row_index, col_index)) if (row_index, col_index) in TARGETS else None
            unresolved = target_index is not None and not target_revealed(t, target_index)
            if unresolved:
                art = GAME_BLANK_CELL
            elif value == "0":
                art = GAME_X_CELL
            else:
                art = GAME_FILL_CELL
                if color_progress > 0:
                    wave = max(0.0, min(1.0, color_progress * 2.2 - (row_index + abs(3.5 - col_index)) * .11))
                    tint = HEART_LIGHT_CELL if (row_index + col_index) % 4 == 0 else HEART_CELL
                    art = Image.blend(art, tint, wave)
            board.alpha_composite(art, (GRID_X + col_index * PITCH, GRID_Y + row_index * PITCH))

    chip_font = base.font(27)

    def chip(cx, cy, value, active=False):
        fill = (255, 211, 91) if active else (255, 248, 220)
        edge = (205, 151, 38) if active else (220, 207, 171)
        draw.ellipse((cx - 24, cy - 24, cx + 24, cy + 24), fill=fill, outline=edge, width=3)
        label = str(value)
        box = draw.textbbox((0, 0), label, font=chip_font)
        draw.text((cx - (box[2] - box[0]) / 2, cy - (box[3] - box[1]) / 2 - 2), label, font=chip_font, fill=INK)

    row_clues = [clues(row) for row in HEART]
    columns = ["".join(row[col] for row in HEART) for col in range(8)]
    col_clues = [clues(column) for column in columns]
    for row_index, values in enumerate(row_clues):
        cy = GRID_Y + row_index * PITCH + TILE // 2
        active = row_index in (1, 6)
        draw.rounded_rectangle((28, cy - 42, 207, cy + 42), 42, fill=(255, 232, 138) if active else (255, 252, 238))
        start = 118 - len(values) * 26 + 26
        for index, value in enumerate(values):
            chip(round(start + index * 52), cy, value, active)
    for col_index, values in enumerate(col_clues):
        cx = GRID_X + col_index * PITCH + TILE // 2
        active = col_index in (1, 3, 6)
        draw.rounded_rectangle((cx - 42, 18, cx + 42, 174), 42, fill=(255, 239, 177) if active else (255, 252, 238))
        start = 96 - len(values) * 26 + 26
        for index, value in enumerate(values):
            chip(cx, round(start + index * 52), value, active)

    mask = Image.new("L", board.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, board.width - 1, board.height - 1), 36, fill=255)
    board.putalpha(mask)
    return board


HAND = Image.open(HAND_ART).convert("RGBA")
hand_box = HAND.getchannel("A").getbbox()
if hand_box:
    HAND = HAND.crop(hand_box)
HAND = HAND.resize((405, round(HAND.height * 405 / HAND.width)), Image.Resampling.LANCZOS)


def tap_center(left, top, target):
    row, col = target
    return (left + GRID_X + col * PITCH + TILE // 2, top + GRID_Y + row * PITCH + TILE // 2)


def hand_pose(frame, t, centers):
    if t < .55 or t > 5.55:
        return
    keyframes = [
        (.55, (1160, 1540)), (1.45, centers[0]), (2.15, centers[0]),
        (2.47, centers[0]), (3.20, centers[1]), (3.55, centers[1]),
        (3.87, centers[1]), (4.60, centers[2]), (4.95, centers[2]),
        (5.25, centers[2]), (5.55, (1160, 1540)),
    ]
    for index in range(len(keyframes) - 1):
        t1, p1 = keyframes[index]
        t2, p2 = keyframes[index + 1]
        if t1 <= t <= t2:
            p = smoothstep((t - t1) / (t2 - t1))
            tip = (p1[0] + (p2[0] - p1[0]) * p, p1[1] + (p2[1] - p1[1]) * p)
            break
    else:
        return
    press = 0.0
    for tap_time in TAP_TIMES:
        distance = abs(t - tap_time)
        if distance < .18:
            press = max(press, math.sin((.18 - distance) / .18 * math.pi / 2))
    tip = (tip[0], tip[1] + 13 * press)
    hand = HAND.copy()
    x = round(tip[0] - hand.width * .135)
    y = round(tip[1] - hand.height * .075)
    shadow = hand.getchannel("A").filter(ImageFilter.GaussianBlur(17))
    shadow_art = Image.new("RGBA", hand.size, (25, 10, 7, 110))
    shadow_art.putalpha(shadow.point(lambda value: round(value * .34)))
    frame.alpha_composite(shadow_art, (x + 18, y + 24))
    frame.alpha_composite(hand, (x, y))


def tap_burst(frame, center, elapsed):
    if not 0 <= elapsed <= .55:
        return
    p = smoothstep(elapsed / .55)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    radius = 34 + 70 * p
    alpha = round(235 * (1 - p))
    draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius), outline=(*GOLD, alpha), width=14)
    for angle in range(0, 360, 45):
        radians = math.radians(angle)
        inner, outer = 48 + 35 * p, 67 + 55 * p
        draw.line((center[0] + math.cos(radians) * inner, center[1] + math.sin(radians) * inner,
                   center[0] + math.cos(radians) * outer, center[1] + math.sin(radians) * outer),
                  fill=(*CREAM, alpha), width=9)
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.2)))


def heart_celebration(frame, t):
    elapsed = t - 5.25
    if elapsed < 0:
        return
    fade = min(1.0, elapsed / .55) * (1.0 if elapsed < 2.25 else max(0.0, 1.0 - (elapsed - 2.25) / .7))

    # Build the celebration from the solved heart cells themselves.  The old
    # version outlined the whole board, so its apparent center did not match
    # the revealed picture.
    tight = HEART_EFFECT_BOUNDS
    if not tight:
        return

    glow = Image.new("RGBA", (W, H), GOLD + (0,))
    glow.putalpha(HEART_GLOW_WIDE.point(lambda value: round(value * .34 * fade)))
    frame.alpha_composite(glow)
    rim = Image.new("RGBA", (W, H), CREAM + (0,))
    rim.putalpha(HEART_GLOW_MEDIUM.point(lambda value: round(value * .88 * fade)))
    frame.alpha_composite(rim)

    # Sparkles orbit the tight heart bounds instead of a hard-coded board
    # center. They remain outside the colored cells so the picture stays clear.
    x1, y1, x2, y2 = tight
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    rx, ry = (x2 - x1) / 2 + 58, (y2 - y1) / 2 + 52
    sparkle_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sparkle_draw = ImageDraw.Draw(sparkle_layer)
    for index in range(16):
        angle = index * math.tau / 16 + elapsed * .42
        x = cx + math.cos(angle) * rx
        y = cy + math.sin(angle) * ry
        pulse = .65 + .35 * math.sin(elapsed * 5.2 + index * 1.7)
        radius = 5 + (index % 3) * 2
        alpha = round(235 * fade * pulse)
        sparkle_draw.line((x - radius * 1.8, y, x + radius * 1.8, y), fill=(*CREAM, alpha), width=4)
        sparkle_draw.line((x, y - radius * 1.8, x, y + radius * 1.8), fill=(*CREAM, alpha), width=4)
        sparkle_draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*GOLD, alpha))
    frame.alpha_composite(sparkle_layer.filter(ImageFilter.GaussianBlur(.7)))


def logo_card(frame, t):
    if t < 8.35:
        return
    p = smoothstep((t - 8.35) / .5)
    width = round(430 * (.82 + .18 * p))
    art = LOGO.resize((width, round(LOGO.height * width / LOGO.width)), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda value: round(value * p)))
    frame.alpha_composite(art, ((W - art.width) // 2, 1338 - art.height // 2))


def frame_at(t):
    frame = BG.copy()
    draw = ImageDraw.Draw(frame)
    if t < 1.55:
        base.centered(draw, "THREE TINY TAPS...", 74, 72, GOLD)
        base.centered(draw, "Can you guess the picture?", 177, 41, CREAM, 2)
    elif t < 5.25:
        tap_number = 1 if t < 2.85 else (2 if t < 4.25 else 3)
        base.centered(draw, "TAP.  TAP.  TAP.", 76, 72, WHITE)
        base.centered(draw, f"Tiny tap {min(tap_number, 3)} of 3", 179, 40, GOLD, 2)
    elif t < 8.35:
        base.centered(draw, "A LITTLE HEART!", 76, 78, GOLD)
        base.centered(draw, "One cozy picture, finished.", 183, 40, CREAM, 2)
    else:
        base.centered(draw, "WHAT WILL YOUR NEXT TAP REVEAL?", 78, 50, WHITE)

    board = render_board(t)
    left, top = BOARD_LEFT, BOARD_TOP
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((left + 13, top + 21, left + board.width + 13, top + board.height + 21), 40, fill=(8, 3, 3, 128))
    frame.alpha_composite(shadow)
    frame.alpha_composite(board, (left, top))
    centers = [tap_center(left, top, target) for target in TARGETS]
    for center, tap_time in zip(centers, TAP_TIMES):
        tap_burst(frame, center, t - tap_time)
    heart_celebration(frame, t)
    hand_pose(frame, t, centers)
    logo_card(frame, t)

    if t < 8.35:
        draw.rounded_rectangle((230, 1631, 850, 1743), 56, fill=(255, 248, 224, 242), outline=GOLD, width=5)
        base.centered(draw, "Pip's Picture Pantry", 1659, 46, INK, 0)
    else:
        draw.rounded_rectangle((205, 1480, 875, 1598), 59, fill=(255, 248, 224, 244), outline=GOLD, width=5)
        base.centered(draw, "Pip's Picture Pantry", 1507, 48, INK, 0)
        base.centered(draw, "600 cozy pictures to uncover", 1640, 38, CREAM, 2)
    base.centered(draw, "iPhone + Android", 1793, 30, WHITE, 2)
    return frame.convert("RGB")


def make_audio():
    rate = 48000
    samples = np.zeros(round(DURATION * rate), dtype=np.float64)

    def tone(start, duration, frequency, volume, decay=8):
        a = round(start * rate)
        b = min(len(samples), round((start + duration) * rate))
        x = np.arange(b - a) / rate
        samples[a:b] += volume * np.sin(2 * np.pi * frequency * x) * np.exp(-decay * x)

    for index, start in enumerate(TAP_TIMES):
        tone(start, .15, 740 + index * 90, .16, 18)
        tone(start + .045, .18, 1080 + index * 110, .10, 20)
    for frequency, delay in ((523.25, 0), (659.25, .09), (783.99, .18), (1046.5, .29)):
        tone(5.25 + delay, .85, frequency, .13, 5)
    tone(8.35, .45, 659.25, .09, 7)
    tone(8.44, .42, 880, .07, 8)
    fade = round(.45 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(np.int16(np.clip(samples, -1, 1) * 32767).tobytes())


def make_contact():
    times = (.45, 1.3, 1.9, 2.25, 3.1, 3.65, 4.45, 5.05, 5.65, 6.55, 7.65, 8.7, 10.2)
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
    frame_at(.8).save(COVER, "JPEG", quality=95)
    make_contact()
    print(FINAL)


if __name__ == "__main__":
    main()
