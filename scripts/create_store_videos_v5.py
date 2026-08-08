from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
VERSION = "v0.1.703"
BASE = ROOT / "store-assets" / "store-media" / VERSION
RAW = BASE / "raw"
UPLOAD = BASE / "upload"
ART = BASE / "video-art"
MUSIC = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"
DEPS = ROOT / ".tmp" / "video_deps"
sys.path.insert(0, str(DEPS))
import imageio_ffmpeg  # noqa: E402


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for name in ("malgunbd.ttf" if bold else "malgun.ttf", "segoeuib.ttf" if bold else "segoeui.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    raise RuntimeError("Required Windows font was not found")


def center(draw: ImageDraw.ImageDraw, text: str, y: int, face, fill: tuple[int, int, int]) -> None:
    box = draw.textbbox((0, 0), text, font=face)
    draw.text(((1080 - (box[2] - box[0])) / 2, y), text, font=face, fill=fill)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def title_art(locale: str) -> Path:
    language = "ko" if locale == "ko-KR" else "en"
    pantry = Image.open(RAW / "google-play" / language / "05-pantry-room.png").convert("RGB")
    background = cover(pantry, (1080, 1920)).filter(ImageFilter.GaussianBlur(18))
    veil = Image.new("RGBA", background.size, (255, 247, 225, 185))
    canvas = Image.alpha_composite(background.convert("RGBA"), veil)

    # Existing in-game Pip sticker; no new generated character image.
    pip = Image.open(ROOT / "src" / "assets" / "characters" / "pip-strip-sticker-v1.png").convert("RGBA")
    pip = pip.resize((520, 520), Image.Resampling.LANCZOS)
    canvas.paste(pip, ((1080 - pip.width) // 2, 545), pip)

    draw = ImageDraw.Draw(canvas)
    title = "핍의 퍼즐방" if locale == "ko-KR" else "Pip's Picture Pantry"
    line = "팬트리가 문을 열었어요" if locale == "ko-KR" else "The pantry is open."
    center(draw, title, 210, font(70, True), (69, 42, 34))
    center(draw, line, 330, font(43, False), (97, 71, 54))
    draw.rounded_rectangle((170, 1220, 910, 1380), 70, fill=(255, 251, 240, 235), outline=(201, 151, 59, 220), width=4)
    detail = "그림을 풀고 팬트리를 채워요" if locale == "ko-KR" else "Solve pictures. Fill the pantry."
    center(draw, detail, 1267, font(34, True), (78, 51, 39))
    center(draw, "SUNNY SPOON STUDIOS", 1705, font(24, True), (166, 102, 24))

    path = ART / locale / "short-title.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(path, "PNG", optimize=True)
    return path


def end_art(locale: str) -> Path:
    language = "ko" if locale == "ko-KR" else "en"
    screenshot = Image.open(UPLOAD / "google-play" / locale / "01-puzzle-in-progress.png").convert("RGB")
    canvas = Image.new("RGB", (1080, 1920), (255, 248, 226))
    live = screenshot.resize((756, 1344), Image.Resampling.LANCZOS)
    mask = Image.new("L", live.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, live.width, live.height), 48, fill=255)
    canvas.paste(live, ((1080 - live.width) // 2, 160), mask)
    draw = ImageDraw.Draw(canvas)
    label = "Android에서 만나요" if locale == "ko-KR" else "Available on Android"
    draw.rounded_rectangle((170, 1530, 910, 1690), 72, fill=(239, 171, 48), outline=(113, 73, 42), width=3)
    center(draw, label, 1577, font(39, True), (69, 42, 34))
    center(draw, "PIP'S PICTURE PANTRY", 1780, font(24, True), (166, 102, 24))
    path = ART / locale / "short-end.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(path, "PNG", optimize=True)
    return path


def youtube_thumbnail(locale: str) -> Path:
    feature = Image.open(UPLOAD / "google-play" / locale / "feature-graphic-1024x500.png").convert("RGB")
    canvas = cover(feature, (1280, 720))
    path = UPLOAD / "youtube" / locale / "thumbnail-1280x720.jpg"
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(path, "JPEG", quality=92, optimize=True)
    return path


def duration(ffmpeg: str, path: Path) -> float:
    probe = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(path), "-f", "null", "NUL"],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    import re
    match = re.search(r"Duration: (\d+):(\d+):([\d.]+)", probe.stderr)
    if not match:
        raise RuntimeError(f"Could not read duration for {path}")
    return int(match.group(1)) * 3600 + int(match.group(2)) * 60 + float(match.group(3))


def render_short(ffmpeg: str, locale: str, title: Path, end: Path, gameplay: Path) -> Path:
    gameplay_duration = duration(ffmpeg, gameplay)
    title_seconds = 1.50
    end_seconds = 1.50
    total = title_seconds + gameplay_duration + end_seconds
    destination = UPLOAD / "youtube" / locale / "launch-short-1080x1920.mp4"
    destination.parent.mkdir(parents=True, exist_ok=True)
    filter_complex = (
        f"[0:v]scale=1080:1920:flags=lanczos,fps=30,settb=AVTB,format=yuv420p,setpts=PTS-STARTPTS[v0];"
        f"[1:v]scale=1080:1920:flags=lanczos,fps=30,settb=AVTB,format=yuv420p,setpts=PTS-STARTPTS[v1];"
        f"[2:v]scale=1080:1920:flags=lanczos,fps=30,settb=AVTB,format=yuv420p,setpts=PTS-STARTPTS[v2];"
        f"[v0][v1][v2]concat=n=3:v=1:a=0[v];"
        f"[3:a]atrim=0:{total},asetpts=PTS-STARTPTS,volume=0.28,"
        f"afade=t=in:st=0:d=0.55,afade=t=out:st={max(0, total - 0.75)}:d=0.75[a]"
    )
    subprocess.run([
        ffmpeg, "-y",
        "-framerate", "30", "-loop", "1", "-t", str(title_seconds), "-i", str(title),
        "-i", str(gameplay),
        "-framerate", "30", "-loop", "1", "-t", str(end_seconds), "-i", str(end),
        "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.0", "-crf", "18", "-preset", "medium",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", "-shortest", str(destination),
    ], check=True)
    return destination


def render_play_preview(ffmpeg: str, locale: str, gameplay: Path) -> Path:
    seconds = duration(ffmpeg, gameplay)
    destination = UPLOAD / "google-play" / locale / "preview-video-1080x1920.mp4"
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        ffmpeg, "-y", "-i", str(gameplay), "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex",
        f"[0:v]scale=1080:1920:flags=lanczos,fps=30,format=yuv420p[v];"
        f"[1:a]atrim=0:{seconds},asetpts=PTS-STARTPTS,volume=0.28,"
        f"afade=t=in:st=0:d=0.45,afade=t=out:st={max(0, seconds - 0.65)}:d=0.65[a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.0", "-crf", "18", "-preset", "medium",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", "-shortest", str(destination),
    ], check=True)
    return destination


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    results = []
    for locale, language in (("en-US", "en"), ("ko-KR", "ko")):
        gameplay = RAW / "video" / language / f"gameplay-{language}.webm"
        title = title_art(locale)
        end = end_art(locale)
        thumbnail = youtube_thumbnail(locale)
        short = render_short(ffmpeg, locale, title, end, gameplay)
        preview = render_play_preview(ffmpeg, locale, gameplay)
        results.append({
            "locale": locale,
            "music": MUSIC.relative_to(ROOT).as_posix(),
            "musicStartSeconds": 12,
            "gameplaySource": gameplay.relative_to(ROOT).as_posix(),
            "titleArt": title.relative_to(ROOT).as_posix(),
            "endArt": end.relative_to(ROOT).as_posix(),
            "youtubeThumbnail": thumbnail.relative_to(ROOT).as_posix(),
            "youtubeShort": short.relative_to(ROOT).as_posix(),
            "googlePlayPreview": preview.relative_to(ROOT).as_posix(),
        })
    manifest = {
        "version": VERSION,
        "direction": "Gameplay first; existing in-game artwork only; no synthetic tone music; no CSS mockups.",
        "googlePlayDelivery": "Upload preview video to YouTube as public or unlisted with ads disabled, then paste its video URL into Play Console.",
        "assets": results,
    }
    path = BASE / "video-manifest.json"
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(path)


if __name__ == "__main__":
    main()
