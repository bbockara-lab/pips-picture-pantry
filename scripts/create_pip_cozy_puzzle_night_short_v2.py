from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-assets" / "social" / "pip-cozy-puzzle-night"
ART = OUT / "artwork"
W, H, FPS, DURATION = 1080, 1920, 30, 10.8

WIDE = ROOT / "store-assets" / "social-campaigns" / "launch-2026" / "06-quiet-puzzle-break-art.png"
BEFORE = ART / "pip-final-cell-before-v2.png"
AFTER = ART / "pip-final-cell-after-v2.png"
REACTION = ART / "pip-cozy-puzzle-finished-v1.png"
LOGO = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"
BGM = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"

SILENT = OUT / "pip-cozy-puzzle-night-en-v2-silent.mp4"
SFX = OUT / "pip-cozy-puzzle-night-en-v2-sfx.wav"
FINAL = OUT / "pip-cozy-puzzle-night-en-v2.mp4"
COVER = OUT / "pip-cozy-puzzle-night-en-v2-cover.jpg"
CONTACT = OUT / "pip-cozy-puzzle-night-en-v2-contact.jpg"

CREAM = (255, 246, 219)
INK = (52, 33, 28)


def font(size: int):
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def cover(image: Image.Image) -> Image.Image:
    scale = max(W / image.width, H / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - W) // 2
    top = (resized.height - H) // 2
    return resized.crop((left, top, left + W, top + H)).convert("RGBA")


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def text_alpha(t: float, start: float, full: float, fade: float, end: float) -> float:
    if t < start or t >= end:
        return 0.0
    if t < full:
        return smoothstep((t - start) / (full - start))
    if t > fade:
        return 1.0 - smoothstep((t - fade) / (end - fade))
    return 1.0


def centered_text(frame: Image.Image, text: str, y: int, size: int, alpha: float) -> None:
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    face = font(size)
    bounds = draw.textbbox((0, 0), text, font=face, stroke_width=2)
    x = (W - (bounds[2] - bounds[0])) / 2
    draw.text(
        (x + 4, y + 6), text, font=face,
        fill=(14, 8, 7, round(175 * alpha)), stroke_width=3,
        stroke_fill=(14, 8, 7, round(145 * alpha)),
    )
    draw.text(
        (x, y), text, font=face,
        fill=(*CREAM, round(255 * alpha)), stroke_width=2,
        stroke_fill=(*INK, round(245 * alpha)),
    )
    frame.alpha_composite(layer)


def place_logo(frame: Image.Image, logo: Image.Image, alpha: float) -> None:
    if alpha <= 0:
        return
    width = 480
    height = round(logo.height * width / logo.width)
    art = logo.resize((width, height), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda value: round(value * alpha)))
    frame.alpha_composite(art, ((W - width) // 2, 1585))


def render_frame(t: float, shots: list[Image.Image], logo: Image.Image) -> Image.Image:
    # Deliberate cinematic cuts between completed illustrations. No morphing, parallax,
    # artificial rain, particles, rings, glows, or coordinate-based subject effects.
    if t < 2.45:
        frame = shots[0].copy()
    elif t < 4.42:
        frame = shots[1].copy()
    elif t < 5.35:
        frame = shots[2].copy()
    else:
        frame = shots[3].copy()

    centered_text(
        frame, "ONE SQUARE LEFT.", 112, 66,
        text_alpha(t, 0.28, 0.58, 1.86, 2.25),
    )
    centered_text(
        frame, "NICE ONE, PIP.", 112, 62,
        text_alpha(t, 5.48, 5.82, 8.18, 8.62),
    )
    place_logo(frame, logo, smoothstep((t - 8.72) / 0.7) if t >= 8.72 else 0.0)

    if t < 0.4:
        alpha = round(255 * (1.0 - smoothstep(t / 0.4)))
        frame.alpha_composite(Image.new("RGBA", (W, H), (10, 6, 5, alpha)))
    if t > 10.42:
        alpha = round(255 * smoothstep((t - 10.42) / 0.38))
        frame.alpha_composite(Image.new("RGBA", (W, H), (10, 6, 5, alpha)))
    return frame.convert("RGB")


def create_sfx() -> None:
    rate = 48000
    sample_count = round(DURATION * rate)
    signal = np.zeros(sample_count, dtype=np.float64)

    def tap(start: float, frequency: float, duration: float, volume: float, decay: float):
        begin = round(start * rate)
        length = min(round(duration * rate), sample_count - begin)
        x = np.arange(length) / rate
        envelope = np.exp(-decay * x) * np.sin(np.minimum(1, x / 0.008) * math.pi / 2)
        signal[begin:begin + length] += np.sin(2 * math.pi * frequency * x) * envelope * volume

    # One pencil contact and one restrained completion chime.
    tap(4.42, 720, 0.12, 0.08, 24)
    tap(5.34, 880, 0.7, 0.10, 4.4)
    tap(5.39, 1320, 0.8, 0.055, 4.0)
    pcm = np.int16(np.clip(signal, -1, 1) * 32767)
    with wave.open(str(SFX), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(rate)
        handle.writeframes(pcm.tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    shots = [cover(Image.open(path).convert("RGB")) for path in (WIDE, BEFORE, AFTER, REACTION)]
    logo = Image.open(LOGO).convert("RGBA")

    encoder = subprocess.Popen(
        [
            "ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(SILENT),
        ],
        stdin=subprocess.PIPE,
    )
    assert encoder.stdin is not None
    contacts = []
    for index in range(round(DURATION * FPS)):
        t = index / FPS
        frame = render_frame(t, shots, logo)
        encoder.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
        if index in {18, 65, 86, 128, 145, 178, 235, 290}:
            contacts.append(frame.resize((270, 480), Image.Resampling.LANCZOS))
        if index == 178:
            frame.save(COVER, quality=95)
    encoder.stdin.close()
    if encoder.wait() != 0:
        raise RuntimeError("Video encoder failed")

    create_sfx()
    subprocess.run(
        [
            "ffmpeg", "-y", "-stream_loop", "-1", "-i", str(BGM), "-i", str(SFX),
            "-filter_complex",
            f"[0:a]volume=0.14,atrim=0:{DURATION},afade=t=in:st=0:d=0.6,"
            f"afade=t=out:st=9.9:d=0.9[m];[1:a]volume=1.0[s];"
            "[m][s]amix=inputs=2:duration=first[a]",
            "-i", str(SILENT), "-map", "2:v:0", "-map", "[a]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
            "-movflags", "+faststart", str(FINAL),
        ],
        check=True,
    )

    sheet = Image.new("RGB", (1080, 960), (31, 18, 14))
    for index, frame in enumerate(contacts):
        sheet.paste(frame, ((index % 4) * 270, (index // 4) * 480))
    sheet.save(CONTACT, quality=93)
    print(FINAL)


if __name__ == "__main__":
    main()
