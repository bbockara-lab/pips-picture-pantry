from __future__ import annotations

import math
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEPS = ROOT / ".tmp" / "video_deps"
sys.path.insert(0, str(DEPS))
import imageio_ffmpeg  # noqa: E402


W, H, FPS = 1080, 1920, 30
OUT = ROOT / "store-assets" / "youtube" / "shorts" / "dual-launch-1.1.21"
SILENT = OUT / "pips-guess-the-picture-short-en-silent.mp4"
AUDIO = OUT / "pips-guess-the-picture-short-en.wav"
FINAL = OUT / "pips-guess-the-picture-short-en.mp4"
COVER = OUT / "pips-guess-the-picture-short-en-cover.jpg"

SCREEN = ROOT / "store-assets" / "store-media" / "app-store-1.1.21-final" / "upload" / "app-store" / "iphone-6.9" / "en-US"

CREAM = (255, 248, 229)
BROWN = (61, 39, 35)
GOLD = (255, 188, 48)
ORANGE = (236, 137, 58)
MINT = (201, 235, 207)
INK = (38, 28, 27)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/SFNSRounded.ttf",
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def ease(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def center(draw: ImageDraw.ImageDraw, text: str, y: int, face, fill=BROWN, stroke=0, stroke_fill=None) -> None:
    box = draw.textbbox((0, 0), text, font=face, stroke_width=stroke)
    draw.text(((W - (box[2] - box[0])) / 2, y), text, font=face, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)


def rounded_paste(canvas: Image.Image, image: Image.Image, box: tuple[int, int, int, int], radius: int = 45) -> None:
    x0, y0, x1, y1 = box
    image = image.resize((x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width, image.height), radius, fill=255)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((x0 + 12, y0 + 20, x1 + 12, y1 + 20), radius, fill=(46, 28, 20, 55))
    canvas.alpha_composite(shadow)
    canvas.paste(image, (x0, y0), mask)


SOLUTION = [
    "01110",
    "11111",
    "11111",
    "01110",
    "00100",
]


def draw_grid(frame: Image.Image, progress: float, wobble: float = 0.0) -> None:
    draw = ImageDraw.Draw(frame)
    size, gap = 138, 12
    total = size * 5 + gap * 4
    x0 = (W - total) // 2 + round(math.sin(wobble * math.pi * 5) * 5)
    y0 = 520
    order = [(r, c) for r in range(5) for c in range(5)]
    reveal = round(progress * len(order))
    for index, (row, col) in enumerate(order):
        x = x0 + col * (size + gap)
        y = y0 + row * (size + gap)
        active = index < reveal
        filled = SOLUTION[row][col] == "1"
        color = ORANGE if active and filled else ((244, 224, 171) if active else (255, 253, 241))
        outline = (103, 72, 55) if active else (210, 192, 161)
        draw.rounded_rectangle((x, y, x + size, y + size), 22, fill=color, outline=outline, width=8)
        if active and not filled:
            draw.line((x + 42, y + 42, x + size - 42, y + size - 42), fill=(115, 154, 127), width=13)
            draw.line((x + size - 42, y + 42, x + 42, y + size - 42), fill=(115, 154, 127), width=13)


def hook_scene(t: float) -> Image.Image:
    frame = Image.new("RGBA", (W, H), INK + (255,))
    draw = ImageDraw.Draw(frame)
    pulse = 1 + 0.035 * math.sin(t * math.pi * 6)
    center(draw, "STOP SCROLLING!", 330, font(round(88 * pulse), True), GOLD)
    center(draw, "CAN YOU GUESS IT", 570, font(67, True), (255, 255, 255))
    center(draw, "IN 3 SECONDS?", 700, font(92, True), MINT, 3, (0, 0, 0))
    draw.rounded_rectangle((270, 1040, 810, 1195), 78, fill=GOLD)
    center(draw, "DON'T BLINK", 1080, font(52, True), BROWN)
    center(draw, "READY?", 1530, font(48, True), (210, 202, 194))
    return frame


def challenge_scene(t: float) -> Image.Image:
    frame = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(frame)
    center(draw, "WHAT IS IT?", 110, font(82, True))
    countdown = max(1, 3 - int(t * 3.0))
    center(draw, str(countdown), 285, font(122, True), (202, 83, 43))
    progress = min(1.0, 0.14 + t * 0.82)
    draw_grid(frame, progress, t)
    center(draw, "HINT: YOU SEE IT EVERY DAY", 1395, font(39, True), (105, 77, 55))
    center(draw, "3   ·   2   ·   1", 1535, font(55, True), (180, 124, 42))
    center(draw, "LOCK IN YOUR ANSWER", 1695, font(40, True), (105, 89, 76))
    return frame


def reveal_scene(t: float) -> Image.Image:
    frame = Image.new("RGBA", (W, H), MINT + (255,))
    draw = ImageDraw.Draw(frame)
    center(draw, "THE ANSWER IS...", 120, font(65, True), BROWN)
    center(draw, "A HEART!", 250, font(126, True), (188, 78, 35), 4, (255, 255, 255))
    draw_grid(frame, 1.0)
    # A universal answer works even before viewers know the game or its characters.
    pulse = 1 + 0.05 * math.sin(t * math.pi * 4)
    cx, cy, radius = W // 2, 930, round(195 * pulse)
    draw.ellipse((cx - radius, cy - radius, cx, cy), fill=(232, 76, 78), outline=(132, 45, 45), width=8)
    draw.ellipse((cx, cy - radius, cx + radius, cy), fill=(232, 76, 78), outline=(132, 45, 45), width=8)
    draw.polygon([(cx - radius, cy - 55), (cx + radius, cy - 55), (cx, cy + 270)], fill=(232, 76, 78))
    draw.rounded_rectangle((120, 1370, 960, 1590), 60, fill=(255, 251, 236), outline=(127, 88, 55), width=5)
    center(draw, "HOW FAST DID YOU GET IT?", 1430, font(45, True))
    center(draw, "DROP YOUR TIME BELOW", 1640, font(40, True), (91, 70, 56))
    return frame


def feature_scene(t: float) -> Image.Image:
    frame = Image.new("RGBA", (W, H), INK + (255,))
    draw = ImageDraw.Draw(frame)
    segment = min(2, int(t * 3))
    sources = ["02-time-attack.png", "01-home-with-time-attack.png", "06-pantry.png"]
    labels = [("3-MIN TIME ATTACK", "QUICK. TENSE. ADDICTIVE."), ("600 PICTURE PUZZLES", "WHAT WILL YOU REVEAL?"), ("BUILD YOUR PANTRY", "SOLVE. COLLECT. UNLOCK.")]
    shot = Image.open(SCREEN / sources[segment]).convert("RGB")
    rounded_paste(frame, shot.convert("RGBA"), (210, 300, 870, 1734), 58)
    draw.rounded_rectangle((110, 90, 970, 245), 60, fill=GOLD)
    center(draw, labels[segment][0], 122, font(58, True), BROWN)
    center(draw, labels[segment][1], 1780, font(36, True), (255, 255, 255))
    return frame


def end_scene(t: float) -> Image.Image:
    frame = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(frame)
    # Lead with the familiar puzzle experience instead of an unknown character.
    draw_grid(frame, 1.0)
    center(draw, "COZY PICTURE PUZZLES", 160, font(60, True), BROWN)
    center(draw, "NOW AVAILABLE", 1320, font(82, True), BROWN)
    draw.rounded_rectangle((120, 940, 960, 1110), 80, fill=GOLD, outline=(112, 72, 44), width=5)
    center(draw, "iPhone  +  Android", 980, font(55, True), BROWN)
    center(draw, "Pip’s Picture Pantry", 1450, font(57, True), (178, 76, 36))
    center(draw, "PLAY FREE TODAY", 1565, font(45, True), (92, 71, 55))
    center(draw, "COMMENT YOUR TIME!", 1690, font(36, True), (92, 71, 55))
    center(draw, "SUNNY SPOON STUDIOS", 1780, font(25, True), (170, 107, 35))
    return frame


SCENES = [
    (1.25, hook_scene),
    (3.75, challenge_scene),
    (2.35, reveal_scene),
    (2.85, feature_scene),
    (2.80, end_scene),
]


def make_audio(duration: float) -> None:
    rate = 48000
    samples = np.zeros(int(duration * rate), dtype=np.float64)

    def tone(start: float, length: float, freq: float, amp: float, decay: float = 5.0) -> None:
        a, b = int(start * rate), min(len(samples), int((start + length) * rate))
        if b <= a:
            return
        x = np.arange(b - a) / rate
        samples[a:b] += amp * np.sin(2 * np.pi * freq * x) * np.exp(-decay * x)

    # Immediate hook impact, three countdown ticks, reveal sparkle, then a bright looping motif.
    tone(0.02, 0.45, 115, 0.34, 8)
    tone(0.04, 0.32, 230, 0.24, 9)
    for start in (1.55, 2.70, 3.85):
        tone(start, 0.18, 880, 0.24, 18)
        tone(start, 0.15, 440, 0.18, 20)
    for i, freq in enumerate((523.25, 659.25, 783.99, 1046.5)):
        tone(5.02 + i * 0.11, 0.7, freq, 0.15, 4)
    notes = [392.0, 493.88, 587.33, 659.25, 587.33, 493.88]
    beat = 0.38
    start = 7.25
    index = 0
    while start + index * beat < duration:
        tone(start + index * beat, 0.32, notes[index % len(notes)], 0.09, 7)
        index += 1
    fade = int(0.45 * rate)
    samples[-fade:] *= np.linspace(1, 0, fade)
    pcm = np.int16(np.clip(samples, -1, 1) * 32767)
    with wave.open(str(AUDIO), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm.tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    writer = imageio_ffmpeg.write_frames(
        str(SILENT), (W, H), fps=FPS, codec="libx264", quality=7,
        pix_fmt_in="rgb24", pix_fmt_out="yuv420p", macro_block_size=1,
        output_params=["-movflags", "+faststart"],
    )
    writer.send(None)
    previous = None
    cover = None
    try:
        for scene_index, (seconds, renderer) in enumerate(SCENES):
            count = round(seconds * FPS)
            for frame_index in range(count):
                frame = renderer(frame_index / max(1, count - 1)).convert("RGB")
                if previous is not None and frame_index < 5:
                    frame = Image.blend(previous, frame, ease(frame_index / 5))
                writer.send(np.asarray(frame, dtype=np.uint8))
                previous = frame
                if scene_index == 0 and frame_index == count // 2:
                    cover = frame.copy()
    finally:
        writer.close()
    duration = sum(seconds for seconds, _ in SCENES)
    make_audio(duration)
    subprocess.run([
        ffmpeg, "-y", "-i", str(SILENT), "-i", str(AUDIO),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest",
        "-movflags", "+faststart", str(FINAL),
    ], check=True)
    (cover or hook_scene(0.5).convert("RGB")).save(COVER, "JPEG", quality=94, optimize=True)
    print(FINAL)
    print(COVER)


if __name__ == "__main__":
    main()
