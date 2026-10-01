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

W, H, FPS, DURATION = 1080, 1920, 30, 20.0
OUT = ROOT / "store-assets" / "social" / "next-move-8x8"
SOURCES = [OUT / f"hard-sequence-{index:02d}.png" for index in range(5)]
ART = ROOT / "store-assets" / "youtube" / "shorts" / "launch-campaign-en" / "artwork" / "time-attack-bg.png"
SILENT = OUT / "next-move-8x8-emerging-v4-20s-silent.mp4"
WAV = OUT / "next-move-8x8-emerging-v4-20s.wav"
FINAL = OUT / "next-move-8x8-emerging-v4-20s.mp4"
COVER = OUT / "next-move-8x8-emerging-v4-20s-cover.jpg"

CREAM = (255, 247, 224)
COCOA = (48, 29, 25)
GOLD = (255, 188, 50)
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


def center(draw, text, y, size, fill=WHITE, stroke=0, stroke_fill=COCOA):
    f = font(size)
    box = draw.textbbox((0, 0), text, font=f, stroke_width=stroke)
    draw.text(((W - box[2] + box[0]) / 2, y), text, font=f, fill=fill,
              stroke_width=stroke, stroke_fill=stroke_fill)


def background():
    art = Image.open(ART).convert("RGB")
    scale = max(W / art.width, H / art.height)
    art = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
    art = art.crop(((art.width - W) // 2, (art.height - H) // 2,
                    (art.width - W) // 2 + W, (art.height - H) // 2 + H))
    art = art.filter(ImageFilter.GaussianBlur(8))
    art = ImageEnhance.Brightness(art).enhance(.48)
    return art.convert("RGBA")


def board_card(source):
    screen = Image.open(source).convert("RGBA")
    # Keep the actual clue area and full 8×8 board. The controls are excluded so
    # the puzzle remains large enough to reason about on a phone screen.
    board = screen.crop((0, 0, screen.width, 1260))
    board.thumbnail((1010, 1040), Image.Resampling.LANCZOS)
    mask = Image.new("L", board.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, board.width, board.height), 38, fill=255)
    board.putalpha(mask)
    return board


BG = background()
BOARDS = [board_card(source) for source in SOURCES]


def frame_at(t: float):
    frame = BG.copy()
    draw = ImageDraw.Draw(frame)
    # Dedicated copy zones remain outside the puzzle at all times.
    if t < 10.5:
        center(draw, "I THINK I CAN SEE IT...", 95, 66, GOLD, 3, COCOA)
        center(draw, "Just a few more squares.", 205, 40, WHITE, 2, COCOA)
    else:
        center(draw, "AND NOW I'M STUCK.", 85, 70, GOLD, 3, COCOA)
        center(draw, "Which square would you fill next?", 202, 48, WHITE, 2, COCOA)

    # The puzzle itself never changes. Only a tiny camera breath keeps the short alive.
    if t < 2.5: board_index = 0
    elif t < 4.5: board_index = 1
    elif t < 6.5: board_index = 2
    elif t < 8.5: board_index = 3
    else: board_index = 4
    source_board = BOARDS[board_index]
    breath = 1 + .005 * math.sin(t * math.pi / 2.5)
    board = source_board.resize((round(source_board.width * breath), round(source_board.height * breath)), Image.Resampling.LANCZOS)
    x = (W - board.width) // 2
    y = 350 - (board.height - source_board.height) // 2
    shadow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((x + 12, y + 18, x + board.width + 12, y + board.height + 18), 45,
                                             fill=(15, 7, 5, 110))
    frame.alpha_composite(shadow)
    frame.alpha_composite(board, (x, y))

    if t < 10.5:
        center(draw, f"NICE...  {min(4, board_index)} / 4", 1430, 43, CREAM, 2, COCOA)
    elif t < 17.5:
        center(draw, "FILL  ■   OR   MARK  ×", 1425, 45, GOLD, 2, COCOA)
        center(draw, "What can you prove from the clues?", 1500, 35, WHITE, 2, COCOA)
    else:
        center(draw, "NO REVEAL.", 1410, 53, GOLD, 2, COCOA)
        center(draw, "I want your move ↓", 1485, 45, WHITE, 2, COCOA)

    center(draw, "Pip's Picture Pantry", 1682, 43, WHITE, 2, COCOA)
    draw.rounded_rectangle((250, 1760, 830, 1848), 44, fill=GOLD)
    center(draw, "iPhone  •  Android", 1782, 34, COCOA)
    return frame.convert("RGB")


def make_audio():
    rate = 48000
    samples = np.zeros(round(DURATION * rate), dtype=np.float64)
    notes = [261.63, 329.63, 392.00, 329.63]
    for i in range(20):
        start = i * .5
        a, b = round(start * rate), min(len(samples), round((start + .46) * rate))
        x = np.arange(b - a) / rate
        samples[a:b] += .065 * np.sin(2 * np.pi * notes[i % len(notes)] * x) * np.exp(-5 * x)
    for start in (0.0, 2.5, 4.5, 6.5, 8.5, 10.5, 17.5):
        a, b = round(start * rate), min(len(samples), round((start + .25) * rate))
        x = np.arange(b - a) / rate
        samples[a:b] += .12 * np.sin(2 * np.pi * 784 * x) * np.exp(-12 * x)
    fade = round(.5 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(WAV), "wb") as wav:
        wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(rate)
        wav.writeframes(np.int16(np.clip(samples, -1, 1) * 32767).tobytes())


def main():
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    writer = imageio_ffmpeg.write_frames(str(SILENT), (W, H), fps=FPS, codec="libx264", quality=7,
        pix_fmt_in="rgb24", pix_fmt_out="yuv420p", macro_block_size=1,
        output_params=["-movflags", "+faststart"])
    writer.send(None)
    try:
        for i in range(round(DURATION * FPS)):
            writer.send(np.asarray(frame_at(i / FPS), dtype=np.uint8))
    finally:
        writer.close()
    make_audio()
    subprocess.run([ffmpeg, "-y", "-i", str(SILENT), "-i", str(WAV), "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(FINAL)], check=True)
    frame_at(13.0).save(COVER, "JPEG", quality=95)
    print(FINAL)


if __name__ == "__main__":
    main()
