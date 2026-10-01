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


WIDTH, HEIGHT = 1080, 1920
FPS = 30
SCENE_SECONDS = 3.2
SCENE_FRAMES = int(FPS * SCENE_SECONDS)
FADE_FRAMES = 12
MOTION_MARGIN = 48

SOURCE_DIR = ROOT / "store-assets" / "social-campaigns" / "launch-2026" / "play-upload" / "phone-1080x1920"
OUT_DIR = ROOT / "store-assets" / "youtube" / "shorts"
SILENT_MP4 = OUT_DIR / "sunny-spoon-studios-first-short-v3-silent.mp4"
AUDIO_WAV = OUT_DIR / "sunny-spoon-studios-first-short-v3-music.wav"
FINAL_MP4 = OUT_DIR / "sunny-spoon-studios-first-short-v3.mp4"
THUMBNAIL = OUT_DIR / "sunny-spoon-studios-first-short-v3-cover.png"

# The previous shelf scene is intentionally excluded: Pip's left arm was malformed.
SCENES = [
    "01-meet-pip-1080x1920.png",
    "02-hidden-picture-1080x1920.png",
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


def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = ["arialbd.ttf" if bold else "arial.ttf", "malgunbd.ttf" if bold else "malgun.ttf"]
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def add_scene_identity(canvas: Image.Image) -> Image.Image:
    """Bake the identity ribbon into the artwork so it moves with the scene."""
    canvas = canvas.convert("RGBA")
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")

    # Replace the source image's small top label with one slim integrated ribbon.
    ribbon_h = 86
    draw.rectangle((0, 0, canvas.width, ribbon_h), fill=(255, 249, 229, 244))
    draw.line((0, ribbon_h - 2, canvas.width, ribbon_h - 2), fill=(113, 71, 42, 105), width=2)
    title_font = get_font(29, bold=True)
    studio_font = get_font(17, bold=True)
    draw.text((66, 25), "PIP'S PICTURE PANTRY", font=title_font, fill=(74, 43, 31, 255))

    studio_text = "BY SUNNY SPOON STUDIOS"
    bbox = draw.textbbox((0, 0), studio_text, font=studio_font)
    text_w = bbox[2] - bbox[0]
    pill_w = text_w + 36
    pill_right = canvas.width - 54
    pill_left = pill_right - pill_w
    draw.rounded_rectangle((pill_left, 19, pill_right, 67), 21, fill=(235, 247, 218, 245), outline=(92, 113, 72, 105), width=2)
    draw.text((pill_left + 18, 34), studio_text, font=studio_font, fill=(77, 67, 45, 255))

    return Image.alpha_composite(canvas, overlay).convert("RGB")


def add_progress(frame: Image.Image, scene_index: int) -> Image.Image:
    frame = frame.convert("RGBA")
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")

    # Progress dots sit below all scene copy, inside a dedicated bottom rail.
    draw.rounded_rectangle((WIDTH // 2 - 120, 1862, WIDTH // 2 + 120, 1912), 24, fill=(70, 42, 28, 88))
    gap = 38
    start_x = WIDTH // 2 - ((len(SCENES) - 1) * gap) // 2
    for index in range(len(SCENES)):
        radius = 8 if index == scene_index else 6
        fill = (255, 198, 58, 255) if index == scene_index else (255, 251, 235, 205)
        cx = start_x + index * gap
        cy = 1887
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=fill)

    return Image.alpha_composite(frame, overlay).convert("RGB")

def animate_scene(canvas: Image.Image, scene_index: int, frame_index: int) -> Image.Image:
    # The image is resized only once. Integer-pixel cropping then moves steadily
    # in one direction, avoiding the subpixel resize/crop vibration of v1.
    t = ease(frame_index / max(1, SCENE_FRAMES - 1))
    travel = MOTION_MARGIN
    x = round(travel * t) if scene_index % 2 == 0 else round(travel * (1.0 - t))
    y = 0
    frame = canvas.crop((x, y, x + WIDTH, y + HEIGHT))
    return add_progress(frame, scene_index)


def make_music(duration: float) -> None:
    sample_rate = 44100
    count = int(duration * sample_rate)
    samples = np.zeros(count, dtype=np.float64)
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
    canvas_size = (WIDTH + MOTION_MARGIN, HEIGHT + MOTION_MARGIN)
    canvases = [
        add_scene_identity(cover(Image.open(SOURCE_DIR / name).convert("RGB"), canvas_size))
        for name in SCENES
    ]
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    writer = imageio_ffmpeg.write_frames(
        str(SILENT_MP4),
        (WIDTH, HEIGHT),
        fps=FPS,
        codec="libx264",
        quality=7,
        pix_fmt_in="rgb24",
        pix_fmt_out="yuv420p",
        macro_block_size=1,
        output_params=["-movflags", "+faststart"],
    )
    writer.send(None)
    try:
        previous = None
        for scene_index, canvas in enumerate(canvases):
            for frame_index in range(SCENE_FRAMES):
                current = animate_scene(canvas, scene_index, frame_index)
                if previous is not None and frame_index < FADE_FRAMES:
                    current = Image.blend(previous, current, ease(frame_index / FADE_FRAMES))
                writer.send(np.asarray(current, dtype=np.uint8))
                previous = current
    finally:
        writer.close()

    duration = len(canvases) * SCENE_SECONDS
    make_music(duration)
    subprocess.run([
        ffmpeg, "-y", "-i", str(SILENT_MP4), "-i", str(AUDIO_WAV),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(FINAL_MP4),
    ], check=True)
    animate_scene(canvases[0], 0, SCENE_FRAMES // 2).save(THUMBNAIL)
    print(FINAL_MP4)
    print(THUMBNAIL)


if __name__ == "__main__":
    main()
