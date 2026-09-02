from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-assets" / "social" / "pip-cozy-puzzle-night"
ART = OUT / "artwork"
W, H, FPS, DURATION = 1080, 1920, 30, 10.6

PLATE = ART / "pip-coloring-background-v3.png"
PAW_SOURCE = ART / "pip-pencil-paw-source-v3.png"
REACTION = ART / "pip-cozy-puzzle-finished-colored-v3.png"
LOGO = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"
BGM = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"

SILENT = OUT / "pip-colors-the-puzzle-en-v3-silent.mp4"
SFX = OUT / "pip-colors-the-puzzle-en-v3-sfx.wav"
FINAL = OUT / "pip-colors-the-puzzle-en-v3.mp4"
COVER = OUT / "pip-colors-the-puzzle-en-v3-cover.jpg"
CONTACT = OUT / "pip-colors-the-puzzle-en-v3-contact.jpg"

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


def remove_checkerboard(image: Image.Image) -> Image.Image:
    """Extract the generated paw artwork from its near-white checkerboard plate."""
    rgba = np.asarray(image.convert("RGBA"), dtype=np.uint8).copy()
    rgb = rgba[..., :3].astype(np.float32)
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    saturation = (maximum - minimum) / np.maximum(maximum, 1)
    subject = np.maximum((238 - minimum) / 24, (saturation - 0.07) / 0.13)
    alpha = np.clip(subject, 0, 1)
    alpha = np.asarray(
        Image.fromarray(np.uint8(alpha * 255), "L").filter(ImageFilter.GaussianBlur(1.15))
    )
    rgba[..., 3] = alpha
    result = Image.fromarray(rgba, "RGBA")
    bbox = result.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("Paw extraction produced an empty sprite")
    return result.crop(bbox)


def create_colored_puzzle(plate: Image.Image) -> tuple[Image.Image, Image.Image]:
    arr = np.asarray(plate.convert("RGB"), dtype=np.uint8)
    luminance = arr.mean(axis=2)
    # The puzzle drawing only. Clues, notebook lines, lamp and table are excluded.
    roi = np.zeros((H, W), dtype=bool)
    roi[790:1385, 355:800] = True
    dark = (luminance < 93) & roi
    # Preserve the paper texture while replacing only the dark filled pixels.
    yy, xx = np.indices((H, W))
    palette = np.zeros_like(arr)
    palette[:] = (112, 61, 34)
    palette[(yy >= 900) & (yy < 1080)] = (218, 143, 52)
    band = (yy >= 1080) & (yy < 1200)
    palette[band & (((xx // 43) % 3) == 0)] = (111, 139, 88)
    palette[band & (((xx // 43) % 3) == 1)] = (205, 87, 62)
    palette[band & (((xx // 43) % 3) == 2)] = (232, 165, 57)
    palette[yy >= 1200] = (190, 105, 42)
    texture = np.clip((luminance.astype(np.int16) - 42) // 7, -4, 8)
    colored = np.clip(palette.astype(np.int16) + texture[..., None], 0, 255).astype(np.uint8)
    art = Image.fromarray(colored, "RGB").convert("RGBA")
    mask = Image.fromarray(np.uint8(dark) * 255, "L")
    return art, mask


STROKES = (
    # start, end, from, to: broad, deliberate pencil passes across the basket.
    (0.72, 2.08, (445, 930), (735, 1010)),
    (2.28, 3.68, (745, 1102), (405, 1158)),
    (3.88, 5.28, (420, 1250), (705, 1320)),
)


def stroke_state(t: float) -> tuple[Image.Image, tuple[float, float], bool]:
    reveal = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(reveal)
    tip = (445.0, 930.0)
    moving = False
    for start, end, point_a, point_b in STROKES:
        if t >= end:
            draw.line((point_a, point_b), fill=255, width=190)
            tip = point_b
            continue
        if t >= start:
            progress = smoothstep((t - start) / (end - start))
            x = point_a[0] + (point_b[0] - point_a[0]) * progress
            y = point_a[1] + (point_b[1] - point_a[1]) * progress
            draw.line((point_a, (x, y)), fill=255, width=190)
            tip = (x, y)
            moving = True
        break
    return reveal.filter(ImageFilter.GaussianBlur(2.2)), tip, moving


def place_paw(frame: Image.Image, paw: Image.Image, tip: tuple[float, float], moving: bool, t: float) -> None:
    width = 520
    height = round(paw.height * width / paw.width)
    sprite = paw.resize((width, height), Image.Resampling.LANCZOS)
    # The only motion is the hand itself: a tiny natural writing pressure, not camera shake.
    pressure = 4 * math.sin(t * math.pi * 5) if moving else 0
    anchor_x, anchor_y = 22, 47
    x = round(tip[0] - anchor_x)
    y = round(tip[1] - anchor_y + pressure)
    frame.alpha_composite(sprite, (x, y))


def place_logo(frame: Image.Image, logo: Image.Image, alpha: float) -> None:
    if alpha <= 0:
        return
    width = 480
    height = round(logo.height * width / logo.width)
    art = logo.resize((width, height), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda value: round(value * alpha)))
    frame.alpha_composite(art, ((W - width) // 2, 1585))


def render_frame(
    t: float,
    plate: Image.Image,
    colored: Image.Image,
    dark_mask: Image.Image,
    paw: Image.Image,
    reaction: Image.Image,
    logo: Image.Image,
) -> Image.Image:
    if t < 5.55:
        frame = plate.copy()
        reveal, tip, moving = stroke_state(t)
        mask = Image.composite(dark_mask, Image.new("L", (W, H), 0), reveal)
        frame.alpha_composite(Image.composite(colored, Image.new("RGBA", (W, H)), mask))
        place_paw(frame, paw, tip, moving, t)
        alpha = 1.0 if 0.35 <= t <= 1.65 else 0.0
        if 0.15 <= t < 0.35:
            alpha = smoothstep((t - 0.15) / 0.2)
        elif 1.65 < t <= 1.95:
            alpha = 1 - smoothstep((t - 1.65) / 0.3)
        centered_text(frame, "PIP'S LAST THREE STROKES.", 94, 54, alpha)
    else:
        frame = reaction.copy()
        alpha = 1.0 if 5.85 <= t <= 8.15 else 0.0
        if 5.55 <= t < 5.85:
            alpha = smoothstep((t - 5.55) / 0.3)
        elif 8.15 < t <= 8.5:
            alpha = 1 - smoothstep((t - 8.15) / 0.35)
        centered_text(frame, "LOOK WHAT PIP MADE.", 105, 58, alpha)
        place_logo(frame, logo, smoothstep((t - 8.55) / 0.65) if t >= 8.55 else 0.0)

    if t < 0.25:
        a = round(255 * (1 - smoothstep(t / 0.25)))
        frame.alpha_composite(Image.new("RGBA", (W, H), (8, 5, 4, a)))
    if t > 10.25:
        a = round(255 * smoothstep((t - 10.25) / 0.35))
        frame.alpha_composite(Image.new("RGBA", (W, H), (8, 5, 4, a)))
    return frame.convert("RGB")


def create_sfx() -> None:
    rate = 48000
    samples = round(DURATION * rate)
    signal = np.zeros(samples, dtype=np.float64)
    rng = np.random.default_rng(731)
    for start, end, _, _ in STROKES:
        begin, finish = round(start * rate), round(end * rate)
        length = finish - begin
        noise = rng.normal(0, 1, length)
        grain = np.concatenate(([noise[0]], np.diff(noise)))
        x = np.arange(length) / rate
        envelope = np.sin(np.minimum(1, x / 0.08) * math.pi / 2)
        envelope *= np.sin(np.minimum(1, (end - start - x) / 0.08) * math.pi / 2)
        signal[begin:finish] += grain * envelope * 0.012
    # Restrained completion notes; no magical particle sound.
    for start, frequency, volume in ((5.55, 784, 0.075), (5.63, 988, 0.055)):
        begin = round(start * rate)
        length = min(round(0.65 * rate), samples - begin)
        x = np.arange(length) / rate
        signal[begin:begin + length] += np.sin(2 * math.pi * frequency * x) * np.exp(-5 * x) * volume
    pcm = np.int16(np.clip(signal, -1, 1) * 32767)
    with wave.open(str(SFX), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(rate)
        handle.writeframes(pcm.tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    plate = cover(Image.open(PLATE).convert("RGB"))
    reaction = cover(Image.open(REACTION).convert("RGB"))
    paw = remove_checkerboard(Image.open(PAW_SOURCE))
    logo = Image.open(LOGO).convert("RGBA")
    colored, dark_mask = create_colored_puzzle(plate)

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
    contact_frames = {12, 35, 62, 84, 112, 142, 178, 224, 273, 306}
    for index in range(round(DURATION * FPS)):
        frame = render_frame(index / FPS, plate, colored, dark_mask, paw, reaction, logo)
        encoder.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
        if index in contact_frames:
            contacts.append(frame.resize((270, 480), Image.Resampling.LANCZOS))
        if index == 84:
            frame.save(COVER, quality=95)
    encoder.stdin.close()
    if encoder.wait() != 0:
        raise RuntimeError("Video encoder failed")

    create_sfx()
    subprocess.run(
        [
            "ffmpeg", "-y", "-stream_loop", "-1", "-i", str(BGM), "-i", str(SFX),
            "-filter_complex",
            f"[0:a]volume=0.12,atrim=0:{DURATION},afade=t=in:st=0:d=0.45,"
            f"afade=t=out:st=9.75:d=0.85[m];[1:a]volume=1.0[s];"
            "[m][s]amix=inputs=2:duration=first[a]",
            "-i", str(SILENT), "-map", "2:v:0", "-map", "[a]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
            "-movflags", "+faststart", str(FINAL),
        ],
        check=True,
    )

    sheet = Image.new("RGB", (1350, 960), (31, 18, 14))
    for index, frame in enumerate(contacts):
        sheet.paste(frame, ((index % 5) * 270, (index // 5) * 480))
    sheet.save(CONTACT, quality=93)
    print(FINAL)


if __name__ == "__main__":
    main()
