from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-assets" / "social" / "pip-cozy-puzzle-night"
START_ART = ROOT / "store-assets" / "social-campaigns" / "launch-2026" / "06-quiet-puzzle-break-art.png"
END_ART = OUT / "artwork" / "pip-cozy-puzzle-finished-v1.png"
LOGO_ART = ROOT / "src" / "assets" / "brand" / "pips-picture-pantry-logo-v1.webp"
BGM = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"

W, H, FPS, DURATION = 1080, 1920, 30, 10.8
SILENT = OUT / "pip-cozy-puzzle-night-en-v1-silent.mp4"
SFX = OUT / "pip-cozy-puzzle-night-en-v1-sfx.wav"
FINAL = OUT / "pip-cozy-puzzle-night-en-v1.mp4"
COVER = OUT / "pip-cozy-puzzle-night-en-v1-cover.jpg"
CONTACT = OUT / "pip-cozy-puzzle-night-en-v1-contact.jpg"

CREAM = (255, 245, 217)
INK = (54, 34, 29)
GOLD = (255, 194, 61)


def font(size: int):
    for candidate in (
        "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


def cover(image: Image.Image, size=(W, H)) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def fade_window(t: float, enter: float, hold: float, leave: float) -> float:
    if t < enter or t > leave:
        return 0.0
    if t < hold:
        return smoothstep((t - enter) / max(0.001, hold - enter))
    return 1.0 - smoothstep((t - hold) / max(0.001, leave - hold))


def ken_burns(image: Image.Image, t: float, end_zoom: float, drift_x: float, drift_y: float) -> Image.Image:
    progress = smoothstep(t / DURATION)
    zoom = 1.0 + (end_zoom - 1.0) * progress
    width = round(W / zoom)
    height = round(H / zoom)
    cx = W / 2 + drift_x * progress
    cy = H / 2 + drift_y * progress
    left = round(max(0, min(W - width, cx - width / 2)))
    top = round(max(0, min(H - height, cy - height / 2)))
    return image.crop((left, top, left + width, top + height)).resize((W, H), Image.Resampling.LANCZOS)


def draw_centered_text(frame: Image.Image, text: str, y: int, size: int, alpha: float) -> None:
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    face = font(size)
    box = draw.textbbox((0, 0), text, font=face, stroke_width=2)
    tw = box[2] - box[0]
    x = (W - tw) / 2
    draw.text(
        (x + 4, y + 7), text, font=face,
        fill=(20, 10, 8, round(165 * alpha)), stroke_width=3,
        stroke_fill=(20, 10, 8, round(120 * alpha)),
    )
    draw.text(
        (x, y), text, font=face,
        fill=(*CREAM, round(255 * alpha)), stroke_width=2,
        stroke_fill=(*INK, round(235 * alpha)),
    )
    frame.alpha_composite(layer)


def draw_rain(frame: Image.Image, t: float) -> None:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    # Keep the rain inside the round window; the soft mask prevents a rectangular overlay.
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse((567, 360, 1045, 1045), fill=205)
    for index in range(36):
        x = 585 + ((index * 83 + int(t * 92)) % 435)
        y = 385 + ((index * 137 + int(t * 285)) % 610)
        length = 22 + (index % 4) * 7
        draw.line((x, y, x - 5, y + length), fill=(184, 215, 229, 68), width=2)
    layer.putalpha(Image.composite(layer.getchannel("A"), Image.new("L", (W, H), 0), mask))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.35)))


def draw_lamp_and_steam(frame: Image.Image, t: float) -> None:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pulse = 0.82 + 0.18 * math.sin(t * math.pi * 1.35)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((775, 900, 1085, 1305), fill=(255, 177, 55, round(42 * pulse)))
    layer.alpha_composite(glow.filter(ImageFilter.GaussianBlur(45)))
    draw = ImageDraw.Draw(layer)
    for strand in range(2):
        points = []
        for step in range(30):
            p = step / 29
            x = 815 + strand * 22 + math.sin(t * 1.7 + p * 5.5 + strand) * 11
            y = 1400 - p * 115
            points.append((x, y))
        draw.line(points, fill=(255, 243, 218, 54), width=4)
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(3)))


def draw_puzzle_moment(frame: Image.Image, t: float) -> None:
    if t < 3.85 or t > 7.1:
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    progress = max(0.0, min(1.0, (t - 4.05) / 1.72))
    # A short procession of hand-painted square glints follows the pencil across the notebook.
    cells = [(604, 1208), (621, 1214), (639, 1221), (657, 1228), (674, 1234)]
    for index, (x, y) in enumerate(cells):
        local = max(0.0, min(1.0, progress * len(cells) - index))
        if local <= 0:
            continue
        radius = 6 + 5 * math.sin(local * math.pi)
        draw.rounded_rectangle(
            (x - radius, y - radius, x + radius, y + radius),
            radius=4, fill=(255, 204, 82, round(120 * local)),
            outline=(255, 244, 190, round(205 * local)), width=2,
        )
    flash = math.exp(-((t - 6.28) / 0.24) ** 2)
    if flash > 0.01:
        for ring in range(4):
            radius = 28 + ring * 22 + flash * 24
            alpha = round(115 * flash * (1 - ring / 5))
            draw.ellipse(
                (641 - radius, 1223 - radius, 641 + radius, 1223 + radius),
                outline=(255, 210, 85, alpha), width=6,
            )
        for index in range(12):
            angle = index * math.pi / 6 + t
            distance = 40 + 86 * flash
            x = 641 + math.cos(angle) * distance
            y = 1223 + math.sin(angle) * distance * 0.65
            r = 3 + (index % 3)
            draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 236, 152, round(230 * flash)))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.1)))


def add_logo(frame: Image.Image, t: float, logo: Image.Image) -> None:
    alpha = smoothstep((t - 8.35) / 0.65) if t >= 8.35 else 0.0
    if alpha <= 0:
        return
    target_w = 470
    target_h = round(logo.height * target_w / logo.width)
    art = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    art.putalpha(art.getchannel("A").point(lambda value: round(value * alpha)))
    x = (W - target_w) // 2
    y = 1590
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle(
        (x - 28, y - 16, x + target_w + 28, y + target_h + 16),
        42, fill=(255, 244, 216, round(86 * alpha)),
    )
    frame.alpha_composite(glow.filter(ImageFilter.GaussianBlur(18)))
    frame.alpha_composite(art, (x, y))


def render_frame(t: float, start: Image.Image, end: Image.Image, logo: Image.Image) -> Image.Image:
    start_frame = ken_burns(start, t, 1.045, 8, 28)
    end_frame = ken_burns(end, t, 1.055, -8, 18)
    transition = smoothstep((t - 6.20) / 0.72)
    frame = Image.blend(start_frame, end_frame, transition).convert("RGBA")
    draw_rain(frame, t)
    draw_lamp_and_steam(frame, t)
    draw_puzzle_moment(frame, t)

    flash = math.exp(-((t - 6.35) / 0.22) ** 2)
    if flash > 0.01:
        frame.alpha_composite(Image.new("RGBA", (W, H), (255, 224, 155, round(82 * flash))))

    first_alpha = fade_window(t, 0.35, 2.7, 3.8)
    draw_centered_text(frame, "Pip's kind of evening.", 118, 63, first_alpha)
    second_alpha = fade_window(t, 7.05, 9.8, 10.35)
    draw_centered_text(frame, "A tiny puzzle. A cozy little win.", 118, 52, second_alpha)
    add_logo(frame, t, logo)

    fade_in = smoothstep(t / 0.45)
    fade_out = 1.0 - smoothstep((t - 10.42) / 0.38) if t >= 10.42 else 1.0
    brightness = fade_in * fade_out
    if brightness < 0.999:
        dark = Image.new("RGBA", (W, H), (10, 6, 5, round(255 * (1 - brightness))))
        frame.alpha_composite(dark)
    return frame.convert("RGB")


def write_sfx() -> None:
    rate = 44100
    count = round(rate * DURATION)
    rng = np.random.default_rng(22)
    signal = rng.normal(0, 1, count) * 0.005
    # Soft rain bed.
    signal = np.convolve(signal, np.ones(14) / 14, mode="same")

    def tone(start: float, duration: float, frequency: float, volume: float, decay: float = 5.0):
        begin = round(start * rate)
        length = min(round(duration * rate), count - begin)
        x = np.arange(length) / rate
        envelope = np.sin(np.minimum(1, x / 0.018) * math.pi / 2) * np.exp(-decay * x)
        signal[begin:begin + length] += np.sin(2 * math.pi * frequency * x) * envelope * volume

    for index in range(5):
        tone(4.15 + index * 0.28, 0.11, 680 + index * 35, 0.045, 18)
    tone(6.24, 0.8, 880, 0.105, 3.8)
    tone(6.29, 1.1, 1320, 0.07, 3.2)
    tone(6.36, 1.0, 1760, 0.045, 3.4)
    pcm = np.int16(np.clip(signal, -1, 1) * 32767)
    with wave.open(str(SFX), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(rate)
        handle.writeframes(pcm.tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    start = cover(Image.open(START_ART).convert("RGB"))
    end = cover(Image.open(END_ART).convert("RGB"))
    # Match the generated ending frame to the original scene's low-key exposure.
    end = ImageEnhance.Brightness(end).enhance(0.94)
    logo = Image.open(LOGO_ART).convert("RGBA")

    encoder = subprocess.Popen(
        [
            "ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(SILENT),
        ],
        stdin=subprocess.PIPE,
    )
    assert encoder.stdin is not None
    frames = round(DURATION * FPS)
    contact_frames = []
    for index in range(frames):
        t = index / FPS
        frame = render_frame(t, start, end, logo)
        encoder.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())
        if index in {15, 90, 145, 190, 235, 295}:
            contact_frames.append(frame.resize((270, 480), Image.Resampling.LANCZOS))
        if index == 235:
            frame.save(COVER, quality=94)
    encoder.stdin.close()
    if encoder.wait() != 0:
        raise RuntimeError("Video encoder failed")

    write_sfx()
    subprocess.run(
        [
            "ffmpeg", "-y", "-stream_loop", "-1", "-i", str(BGM), "-i", str(SFX),
            "-filter_complex",
            f"[0:a]volume=0.16,atrim=0:{DURATION},afade=t=in:st=0:d=0.8,"
            f"afade=t=out:st=9.9:d=0.9[m];[1:a]volume=1.0[s];[m][s]amix=inputs=2:duration=first[a]",
            "-i", str(SILENT), "-map", "2:v:0", "-map", "[a]", "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(FINAL),
        ],
        check=True,
    )

    sheet = Image.new("RGB", (810, 960), (34, 20, 15))
    for index, frame in enumerate(contact_frames):
        sheet.paste(frame, ((index % 3) * 270, (index // 3) * 480))
    sheet.save(CONTACT, quality=92)
    print(FINAL)


if __name__ == "__main__":
    main()
