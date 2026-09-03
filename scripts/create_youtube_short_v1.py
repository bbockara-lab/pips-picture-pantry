from __future__ import annotations

import math
import os
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEPS = ROOT / ".tmp" / "video_deps"
sys.path.insert(0, str(DEPS))
import imageio_ffmpeg  # noqa: E402


WIDTH, HEIGHT = 1080, 1920
FPS = 30
SCENE_SECONDS = 3.0
SCENE_FRAMES = int(FPS * SCENE_SECONDS)
FADE_FRAMES = 12

SOURCE_DIR = ROOT / "store-assets" / "social-campaigns" / "launch-2026" / "play-upload" / "phone-1080x1920"
OUT_DIR = ROOT / "store-assets" / "youtube" / "shorts"
SILENT_MP4 = OUT_DIR / "sunny-spoon-studios-first-short-v1-silent.mp4"
AUDIO_WAV = OUT_DIR / "sunny-spoon-studios-first-short-v1-music.wav"
FINAL_MP4 = OUT_DIR / "sunny-spoon-studios-first-short-v1.mp4"
THUMBNAIL = OUT_DIR / "sunny-spoon-studios-first-short-v1-cover.png"

SCENES = [
    "01-meet-pip-1080x1920.png",
    "02-hidden-picture-1080x1920.png",
    "03-fill-the-shelves-1080x1920.png",
    "04-nine-keepsakes-1080x1920.png",
    "05-grandpa-clock-1080x1920.png",
    "06-quiet-puzzle-break-1080x1920.png",
]


def cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / img.width, target_h / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
    x = (resized.width - target_w) // 2
    y = (resized.height - target_h) // 2
    return resized.crop((x, y, x + target_w, y + target_h))


def ease(value: float) -> float:
    return 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, value)))


def add_brand_polish(frame: Image.Image, scene_index: int, local_t: float) -> Image.Image:
    frame = frame.copy()
    draw = ImageDraw.Draw(frame, "RGBA")

    # Warm vignette, intentionally subtle so the original campaign art remains dominant.
    vignette = Image.new("L", (WIDTH, HEIGHT), 0)
    vd = ImageDraw.Draw(vignette)
    for radius, alpha in ((900, 0), (760, 22), (620, 48)):
        vd.ellipse((WIDTH // 2 - radius, HEIGHT // 2 - radius, WIDTH // 2 + radius, HEIGHT // 2 + radius), fill=alpha)
    vignette = vignette.filter(ImageFilter.GaussianBlur(180))
    shade = Image.new("RGBA", (WIDTH, HEIGHT), (56, 34, 22, 0))
    shade.putalpha(vignette)
    frame = Image.alpha_composite(frame.convert("RGBA"), shade)
    draw = ImageDraw.Draw(frame, "RGBA")

    # Sunny Spoon corner mark.
    draw.rounded_rectangle((42, 44, 344, 108), 28, fill=(255, 248, 222, 224), outline=(111, 71, 43, 80), width=2)
    try:
        font = ImageFont.truetype("arialbd.ttf", 27)
    except OSError:
        font = ImageFont.load_default()
    draw.text((70, 61), "SUNNY SPOON STUDIOS", font=font, fill=(83, 51, 35, 255))

    # Scene progress dots.
    y = 1820
    total_w = len(SCENES) * 34
    start_x = (WIDTH - total_w) // 2
    for i in range(len(SCENES)):
        fill = (255, 196, 63, 255) if i == scene_index else (255, 248, 222, 150)
        r = 8 if i == scene_index else 6
        cx = start_x + i * 34 + 17
        draw.ellipse((cx - r, y - r, cx + r, y + r), fill=fill, outline=(89, 51, 30, 100))

    # Small drifting sparkles provide motion even in visually quiet scenes.
    for n in range(6):
        phase = (local_t * 0.42 + n * 0.17 + scene_index * 0.11) % 1.0
        x = 100 + ((n * 173 + scene_index * 79) % 850)
        yy = int(1680 - phase * 1160)
        a = int(160 * math.sin(math.pi * phase))
        size = 4 + (n % 3) * 2
        draw.ellipse((x - size, yy - size, x + size, yy + size), fill=(255, 216, 95, a))
    return frame.convert("RGB")


def animate_scene(img: Image.Image, scene_index: int, frame_index: int) -> Image.Image:
    t = frame_index / max(1, SCENE_FRAMES - 1)
    zoom = 1.0 + 0.035 * ease(t)
    scaled = img.resize((round(WIDTH * zoom), round(HEIGHT * zoom)), Image.Resampling.LANCZOS)
    max_x = scaled.width - WIDTH
    max_y = scaled.height - HEIGHT
    direction = -1 if scene_index % 2 else 1
    x = int(max_x * (0.5 + direction * (t - 0.5) * 0.42))
    y = int(max_y * (0.45 + 0.1 * math.sin(t * math.pi)))
    frame = scaled.crop((x, y, x + WIDTH, y + HEIGHT))
    return add_brand_polish(frame, scene_index, t)


def make_music(duration: float) -> None:
    sample_rate = 44100
    count = int(duration * sample_rate)
    samples = np.zeros(count, dtype=np.float64)
    # Original sunny four-note motif, repeated with soft bell-like harmonics.
    notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 783.99]
    beat = 0.75
    for i in range(int(duration / beat) + 1):
        start = int(i * beat * sample_rate)
        end = min(count, start + int(0.58 * sample_rate))
        if end <= start:
            continue
        t = np.arange(end - start) / sample_rate
        freq = notes[i % len(notes)]
        envelope = np.exp(-4.2 * t)
        bell = np.sin(2 * np.pi * freq * t) + 0.28 * np.sin(2 * np.pi * freq * 2.01 * t)
        samples[start:end] += 0.14 * envelope * bell
    # Gentle low pulse, kept quiet for a cozy rather than energetic feel.
    for i in range(int(duration / 1.5) + 1):
        start = int(i * 1.5 * sample_rate)
        end = min(count, start + int(0.35 * sample_rate))
        t = np.arange(end - start) / sample_rate
        samples[start:end] += 0.035 * np.exp(-8 * t) * np.sin(2 * np.pi * 130.81 * t)
    fade = int(0.65 * sample_rate)
    samples[:fade] *= np.linspace(0, 1, fade)
    samples[-fade:] *= np.linspace(1, 0, fade)
    pcm = np.int16(np.clip(samples, -1, 1) * 32767)
    with wave.open(str(AUDIO_WAV), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(pcm.tobytes())


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    images = [cover(Image.open(SOURCE_DIR / name).convert("RGB"), (WIDTH, HEIGHT)) for name in SCENES]
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    writer = imageio_ffmpeg.write_frames(
        str(SILENT_MP4),
        (WIDTH, HEIGHT),
        fps=FPS,
        codec="libx264",
        quality=8,
        pix_fmt_in="rgb24",
        pix_fmt_out="yuv420p",
        macro_block_size=1,
        output_params=["-movflags", "+faststart"],
    )
    writer.send(None)
    try:
        previous = None
        for scene_index, img in enumerate(images):
            for frame_index in range(SCENE_FRAMES):
                current = animate_scene(img, scene_index, frame_index)
                if previous is not None and frame_index < FADE_FRAMES:
                    alpha = ease(frame_index / FADE_FRAMES)
                    current = Image.blend(previous, current, alpha)
                writer.send(np.asarray(current, dtype=np.uint8))
                previous = current
    finally:
        writer.close()

    duration = len(images) * SCENE_SECONDS
    make_music(duration)
    cmd = [
        ffmpeg, "-y", "-i", str(SILENT_MP4), "-i", str(AUDIO_WAV),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(FINAL_MP4),
    ]
    subprocess.run(cmd, check=True)
    animate_scene(images[0], 0, SCENE_FRAMES // 2).save(THUMBNAIL)
    print(FINAL_MP4)
    print(THUMBNAIL)


if __name__ == "__main__":
    main()
