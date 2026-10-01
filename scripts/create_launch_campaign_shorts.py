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

W, H, FPS = 1080, 1920, 30
OUT = ROOT / "store-assets" / "youtube" / "shorts" / "launch-campaign-en"
ART = OUT / "artwork"
CREAM, COCOA, GOLD = (255, 247, 224), (39, 25, 22), (255, 185, 43)
RED, SAGE, WHITE = (211, 54, 57), (81, 113, 76), (255, 255, 255)


def face(size: int) -> ImageFont.FreeTypeFont:
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def fit_bg(path: Path, darken: float = 1.0) -> Image.Image:
    im = Image.open(path).convert("RGB")
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    im = im.crop((x, y, x + W, y + H))
    if darken != 1:
        im = ImageEnhance.Brightness(im).enhance(darken)
    return im.convert("RGBA")


def text_center(draw, text, y, size, fill=WHITE, stroke=0, stroke_fill=COCOA):
    f = face(size)
    box = draw.textbbox((0, 0), text, font=f, stroke_width=stroke)
    draw.text(((W - box[2] + box[0]) / 2, y), text, font=f, fill=fill,
              stroke_width=stroke, stroke_fill=stroke_fill)


STRAWBERRY = [
    "00111000",
    "01011010",
    "00111100",
    "01111110",
    "11111111",
    "11111111",
    "01111110",
    "00111100",
]

COFFEE = [
    "00000000",
    "01111100",
    "01000110",
    "01000101",
    "01000110",
    "01111100",
    "00111000",
    "01111100",
]


def grid(frame, pattern, reveal, y0=510, tile=91, gap=8, accent=RED):
    draw = ImageDraw.Draw(frame)
    total = tile * 8 + gap * 7
    x0 = (W - total) // 2
    draw.rounded_rectangle((x0 - 30, y0 - 30, x0 + total + 30, y0 + total + 30), 42,
                           fill=(255, 248, 225, 240), outline=(89, 55, 38), width=7)
    count = round(64 * max(0, min(1, reveal)))
    for i in range(64):
        r, c = divmod(i, 8)
        x, y = x0 + c * (tile + gap), y0 + r * (tile + gap)
        shown = i < count
        active = pattern[r][c] == "1"
        color = accent if shown and active else ((226, 235, 212) if shown else (255, 253, 243))
        draw.rounded_rectangle((x, y, x + tile, y + tile), 14, fill=color,
                               outline=(116, 82, 56), width=4)
        if shown and not active:
            draw.line((x + 28, y + 28, x + tile - 28, y + tile - 28), fill=SAGE, width=8)
            draw.line((x + tile - 28, y + 28, x + 28, y + tile - 28), fill=SAGE, width=8)


def pill(draw, label, y, fill=GOLD, ink=COCOA, width=760):
    x0 = (W - width) // 2
    draw.rounded_rectangle((x0, y, x0 + width, y + 120), 60, fill=fill)
    text_center(draw, label, y + 30, 45, ink)


def overlay(frame, color=(20, 10, 8, 130)):
    shade = Image.new("RGBA", frame.size, color)
    frame.alpha_composite(shade)


def challenge(t):
    frame = fit_bg(ART / "strawberry-challenge-bg.png", .93)
    draw = ImageDraw.Draw(frame)
    if t < 1.4:
        overlay(frame, (23, 12, 10, 155)); draw = ImageDraw.Draw(frame)
        text_center(draw, "ONLY 1 IN 10", 400, 92, GOLD)
        text_center(draw, "GETS THIS IN 3 SEC", 535, 69, WHITE)
        pill(draw, "READY?", 820)
    elif t < 5.6:
        local = (t - 1.4) / 4.2
        text_center(draw, "WHAT PICTURE IS HIDING?", 150, 52, COCOA, 2, WHITE)
        grid(frame, STRAWBERRY, .10 + .82 * local)
        text_center(draw, str(max(1, 3 - int(local * 3))), 1370, 120, RED, 3, WHITE)
        text_center(draw, "DON'T CHEAT.", 1540, 46, COCOA)
    elif t < 8.2:
        grid(frame, STRAWBERRY, 1)
        text_center(draw, "STRAWBERRY!", 160, 94, RED, 4, WHITE)
        pill(draw, "HOW FAST WERE YOU?", 1390)
    else:
        overlay(frame, (30, 17, 12, 175)); draw = ImageDraw.Draw(frame)
        text_center(draw, "600 COZY", 420, 108, GOLD)
        text_center(draw, "PICTURE PUZZLES", 550, 75, WHITE)
        text_center(draw, "Pip's Picture Pantry", 930, 53, WHITE)
        pill(draw, "PLAY FREE", 1080)
        text_center(draw, "iPhone  •  Android", 1270, 45, WHITE)
        text_center(draw, "COMMENT YOUR TIME", 1580, 37, GOLD)
    return frame


def time_attack(t):
    frame = fit_bg(ART / "time-attack-bg.png", .94)
    draw = ImageDraw.Draw(frame)
    if t < 1.5:
        overlay(frame, (8, 5, 4, 115)); draw = ImageDraw.Draw(frame)
        text_center(draw, "3 MINUTES.", 250, 112, GOLD)
        text_center(draw, "HOW FAR CAN YOU GO?", 410, 64, WHITE)
    elif t < 6.7:
        local = (t - 1.5) / 5.2
        text_center(draw, "TIME ATTACK", 110, 85, GOLD, 3, COCOA)
        grid(frame, COFFEE, min(1, local * 1.35), 800, 69, 7, (113, 74, 45))
        remaining = max(0, 180 - round(local * 180))
        pill(draw, f"{remaining // 60}:{remaining % 60:02d}", 1560, WHITE, RED, 420)
    elif t < 9.0:
        overlay(frame, (13, 7, 4, 80)); draw = ImageDraw.Draw(frame)
        text_center(draw, "NEW RECORD", 340, 105, GOLD, 4, COCOA)
        text_center(draw, "ONE MORE ROUND?", 490, 60, WHITE)
        pill(draw, "YES. OBVIOUSLY.", 1310)
    else:
        overlay(frame, (12, 7, 5, 175)); draw = ImageDraw.Draw(frame)
        text_center(draw, "PUZZLE FAST.", 390, 92, GOLD)
        text_center(draw, "UNWIND SLOW.", 515, 82, WHITE)
        text_center(draw, "Pip's Picture Pantry", 910, 54, WHITE)
        pill(draw, "PLAY FREE", 1060)
        text_center(draw, "Available on iPhone & Android", 1240, 39, WHITE)
    return frame


def pantry(t):
    frame = fit_bg(ART / "pantry-magic-bg.png", .88)
    draw = ImageDraw.Draw(frame)
    if t < 1.6:
        overlay(frame, (29, 14, 7, 115)); draw = ImageDraw.Draw(frame)
        text_center(draw, "THIS PANTRY", 280, 100, GOLD)
        text_center(draw, "STARTS EMPTY", 420, 91, WHITE)
    elif t < 7.0:
        local = (t - 1.6) / 5.4
        # A moving mask reveals the filled upper pantry as progress rises.
        text_center(draw, "EVERY PUZZLE FILLS A SHELF", 120, 48, WHITE, 3, COCOA)
        progress_y = round(1510 - local * 690)
        draw.rounded_rectangle((110, progress_y, 970, progress_y + 110), 55, fill=(255, 246, 214, 235))
        text_center(draw, f"PANTRY  {round(local * 100):02d}%", progress_y + 27, 43, COCOA)
        for i in range(8):
            if i / 8 < local:
                x = 155 + (i % 4) * 205; y = 1460 + (i // 4) * 145
                draw.ellipse((x, y, x + 72, y + 72), fill=GOLD, outline=WHITE, width=4)
    elif t < 9.2:
        overlay(frame, (25, 12, 6, 60)); draw = ImageDraw.Draw(frame)
        text_center(draw, "YOUR COZY COLLECTION", 1120, 53, WHITE, 3, COCOA)
        text_center(draw, "ONE PICTURE AT A TIME", 1200, 45, GOLD, 2, COCOA)
    else:
        overlay(frame, (31, 15, 8, 170)); draw = ImageDraw.Draw(frame)
        text_center(draw, "SOLVE. COLLECT.", 440, 88, GOLD)
        text_center(draw, "MAKE IT YOURS.", 560, 78, WHITE)
        text_center(draw, "Pip's Picture Pantry", 930, 53, WHITE)
        pill(draw, "PLAY FREE", 1080)
        text_center(draw, "iPhone  •  Android", 1260, 44, WHITE)
    return frame


def audio(path: Path, duration=12.5, intense=False):
    rate = 48000; samples = np.zeros(round(duration * rate), dtype=np.float64)
    def tone(start, length, hz, amp=.12, decay=6):
        a, b = round(start * rate), min(len(samples), round((start + length) * rate))
        x = np.arange(max(0, b - a)) / rate
        samples[a:b] += amp * np.sin(2 * np.pi * hz * x) * np.exp(-decay * x)
    base = [392, 493.88, 587.33, 659.25, 587.33, 493.88]
    step = .28 if intense else .38
    for i in range(math.ceil(duration / step)):
        tone(i * step, step * .9, base[i % len(base)], .09 if intense else .07, 8)
    for s in (0, 1.5, 5.6, 8.2, 9.2): tone(s, .35, 1046.5, .18, 10)
    samples[-round(.4 * rate):] *= np.linspace(1, 0, round(.4 * rate))
    pcm = np.int16(np.clip(samples, -1, 1) * 32767)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm.tobytes())


def render(name, renderer, intense=False):
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe(); silent = OUT / f"{name}-silent.mp4"; wav = OUT / f"{name}.wav"
    final = OUT / f"{name}.mp4"; cover = OUT / f"{name}-cover.jpg"
    writer = imageio_ffmpeg.write_frames(str(silent), (W, H), fps=FPS, codec="libx264", quality=7,
        pix_fmt_in="rgb24", pix_fmt_out="yuv420p", macro_block_size=1, output_params=["-movflags", "+faststart"])
    writer.send(None); first = None
    try:
        for i in range(round(12.5 * FPS)):
            im = renderer(i / FPS).convert("RGB")
            writer.send(np.asarray(im, dtype=np.uint8))
            if i == 18: first = im.copy()
    finally: writer.close()
    audio(wav, intense=intense)
    subprocess.run([ffmpeg, "-y", "-i", str(silent), "-i", str(wav), "-c:v", "copy",
        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(final)], check=True)
    (first or renderer(.6).convert("RGB")).save(cover, "JPEG", quality=95)
    return final


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for item in (
        render("01-strawberry-8x8-challenge", challenge),
        render("02-time-attack-record", time_attack, True),
        render("03-pantry-transformation", pantry),
    ): print(item)
