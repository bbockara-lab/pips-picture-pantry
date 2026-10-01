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
OUT_DIR = ROOT / "store-assets" / "youtube" / "shorts"
SILENT_MP4 = OUT_DIR / "sunny-spoon-studios-launch-short-v4-silent.mp4"
AUDIO_WAV = OUT_DIR / "sunny-spoon-studios-launch-short-v4-music.wav"
FINAL_MP4 = OUT_DIR / "sunny-spoon-studios-launch-short-v4.mp4"
THUMBNAIL = OUT_DIR / "sunny-spoon-studios-launch-short-v4-cover.png"

SCREEN_DIR = ROOT / "store-assets" / "play-console" / "phone-screenshots"
CHAR_DIR = ROOT / "src" / "assets" / "characters"
ICON_PATH = ROOT / "store-assets" / "play-console" / "app-icon-512.png"

CREAM = (255, 248, 226)
BROWN = (71, 43, 34)
GOLD = (239, 171, 48)
GREEN = (221, 235, 199)


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return 0.5 - 0.5 * math.cos(math.pi * value)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ["malgunbd.ttf" if bold else "malgun.ttf", "arialbd.ttf" if bold else "arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def contain(image: Image.Image, width: int, height: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((width, height), Image.Resampling.LANCZOS)
    return result


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius, fill=255)
    return mask


def center_text(draw: ImageDraw.ImageDraw, y: int, text: str, text_font, fill=BROWN) -> None:
    box = draw.textbbox((0, 0), text, font=text_font)
    draw.text(((WIDTH - (box[2] - box[0])) / 2, y), text, font=text_font, fill=fill)


def add_header(frame: Image.Image, kicker: str, title: str) -> None:
    draw = ImageDraw.Draw(frame)
    center_text(draw, 72, kicker.upper(), font(23, True), (177, 109, 24))
    center_text(draw, 112, title, font(58, True))


def title_scene(t: float) -> Image.Image:
    frame = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(frame)
    center_text(draw, 112, "PIP'S PICTURE PANTRY", font(34, True), (177, 109, 24))

    pip = Image.open(CHAR_DIR / "pip-strip-sticker-v1.png").convert("RGBA")
    pip_size = round(530 + 18 * math.sin(t * math.pi))
    pip = contain(pip, pip_size, pip_size)
    x = (WIDTH - pip.width) // 2
    y = 560 + round(10 * math.sin(t * math.pi * 2))
    frame.paste(pip, (x, y), pip)

    bubble = (180, 245, 900, 555)
    draw.rounded_rectangle(bubble, 76, fill=(255, 255, 250), outline=(112, 73, 51), width=5)
    draw.polygon([(500, 555), (585, 555), (548, 625)], fill=(255, 255, 250))
    draw.line([(500, 555), (548, 625), (585, 555)], fill=(112, 73, 51), width=5)
    center_text(draw, 330, "We're open!", font(76, True))
    center_text(draw, 1265, "A cozy picture puzzle game", font(41, True))
    center_text(draw, 1332, "now available on Android", font(34), (100, 78, 61))
    return frame


def gameplay_scene(name: str, kicker: str, title: str, t: float) -> Image.Image:
    frame = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    add_header(frame, kicker, title)

    screenshot = Image.open(SCREEN_DIR / name).convert("RGB")
    # Keep the real game UI intact. The tiny scale drift is the only motion.
    base_w, base_h = 860, 1529
    scale = 1.0 + 0.018 * ease(t)
    shot = screenshot.resize((round(base_w * scale), round(base_h * scale)), Image.Resampling.LANCZOS)
    crop_x = max(0, (shot.width - base_w) // 2)
    crop_y = max(0, round((shot.height - base_h) * ease(t)))
    shot = shot.crop((crop_x, crop_y, crop_x + base_w, crop_y + base_h))
    mask = rounded_mask(shot.size, 50)

    x, y = (WIDTH - shot.width) // 2, 250
    shadow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((x + 12, y + 18, x + shot.width + 12, y + shot.height + 18), 50, fill=(70, 42, 28, 48))
    frame = Image.alpha_composite(frame.convert("RGBA"), shadow).convert("RGB")
    frame.paste(shot, (x, y), mask)
    return frame


def end_scene(t: float) -> Image.Image:
    frame = Image.new("RGB", (WIDTH, HEIGHT), GREEN)
    draw = ImageDraw.Draw(frame)
    icon = Image.open(ICON_PATH).convert("RGBA")
    icon_size = round(350 + 12 * math.sin(t * math.pi))
    icon = contain(icon, icon_size, icon_size)
    frame.paste(icon, ((WIDTH - icon.width) // 2, 300), icon)

    center_text(draw, 750, "Pip's Picture Pantry", font(64, True))
    center_text(draw, 850, "is available now", font(46), (91, 70, 53))
    draw.rounded_rectangle((190, 1010, 890, 1150), 70, fill=GOLD)
    center_text(draw, 1040, "GET IT ON GOOGLE PLAY", font(35, True))
    center_text(draw, 1270, "333 puzzles  •  No third-party ads", font(30), (91, 70, 53))
    center_text(draw, 1330, "English + Korean", font(30), (91, 70, 53))
    center_text(draw, 1660, "SUNNY SPOON STUDIOS", font(25, True), (177, 109, 24))
    return frame


SCENES = [
    (2.6, title_scene),
    (3.0, lambda t: gameplay_scene("01-puzzle-screen.png", "PLAY", "Solve a picture.", t)),
    (2.5, lambda t: gameplay_scene("03-album.png", "COLLECT", "Keep every reveal.", t)),
    (2.9, end_scene),
]


def make_music(duration: float) -> None:
    sample_rate = 44100
    count = int(duration * sample_rate)
    samples = np.zeros(count, dtype=np.float64)
    notes = [392.00, 493.88, 587.33, 493.88, 440.00, 523.25, 659.25, 523.25]
    beat = 0.72
    for index in range(int(duration / beat) + 1):
        start = int(index * beat * sample_rate)
        end = min(count, start + int(0.48 * sample_rate))
        if end <= start:
            continue
        time = np.arange(end - start) / sample_rate
        envelope = np.exp(-5.0 * time)
        tone = np.sin(2 * np.pi * notes[index % len(notes)] * time)
        samples[start:end] += 0.10 * envelope * tone
    fade = int(0.55 * sample_rate)
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
    previous = None
    cover_frame = None
    try:
        for scene_index, (seconds, renderer) in enumerate(SCENES):
            frame_count = round(seconds * FPS)
            for frame_index in range(frame_count):
                current = renderer(frame_index / max(1, frame_count - 1))
                if previous is not None and frame_index < 9:
                    current = Image.blend(previous, current, ease(frame_index / 9))
                writer.send(np.asarray(current, dtype=np.uint8))
                previous = current
                if scene_index == 0 and frame_index == frame_count // 2:
                    cover_frame = current.copy()
    finally:
        writer.close()

    duration = sum(seconds for seconds, _ in SCENES)
    make_music(duration)
    subprocess.run([
        ffmpeg, "-y", "-i", str(SILENT_MP4), "-i", str(AUDIO_WAV),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest",
        "-movflags", "+faststart", str(FINAL_MP4),
    ], check=True)
    (cover_frame or title_scene(0.5)).save(THUMBNAIL)
    print(FINAL_MP4)
    print(THUMBNAIL)


if __name__ == "__main__":
    main()
