from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = "v0.1.703"
BASE = ROOT / "store-assets" / "store-media" / VERSION
RAW = BASE / "raw"
UPLOAD = BASE / "upload"
MUSIC = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"
DEPS = ROOT / ".tmp" / "video_deps_mac"
sys.path.insert(0, str(DEPS))
import imageio_ffmpeg  # noqa: E402


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe(ffmpeg: str, path: Path) -> dict:
    result = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(path), "-f", "null", "-"],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    duration_match = re.search(r"Duration: (\d+):(\d+):([\d.]+)", result.stderr)
    video_match = re.search(r"Video: h264 .*?, (\d+)x(\d+).*?, ([\d.]+) fps", result.stderr)
    audio_match = re.search(r"Audio: aac .*?, (\d+) Hz, stereo", result.stderr)
    if not duration_match or not video_match or not audio_match:
        raise RuntimeError(f"Could not validate {path}\n{result.stderr}")
    duration = int(duration_match.group(1)) * 3600 + int(duration_match.group(2)) * 60 + float(duration_match.group(3))
    return {
        "durationSeconds": round(duration, 2),
        "width": int(video_match.group(1)),
        "height": int(video_match.group(2)),
        "fps": float(video_match.group(3)),
        "audioSampleRate": int(audio_match.group(1)),
    }


def render(ffmpeg: str, locale: str) -> tuple[Path, Path, dict]:
    language = "ko" if locale == "ko-KR" else "en"
    source = RAW / "video" / language / f"gameplay-{language}.webm"
    directory = UPLOAD / "app-store" / "iphone-6.9" / locale
    directory.mkdir(parents=True, exist_ok=True)
    destination = directory / "app-preview-886x1920.mp4"
    poster = directory / "app-preview-poster-886x1920.png"

    subprocess.run([
        ffmpeg, "-y", "-i", str(source),
        "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex",
        "[0:v]scale=886:1920:flags=lanczos,fps=30,format=yuv420p[v];"
        "[1:a]volume=0.28,afade=t=in:st=0:d=0.45[a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.0",
        "-b:v", "10M", "-maxrate", "12M", "-bufsize", "20M",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", "-shortest", str(destination),
    ], check=True)
    subprocess.run([
        ffmpeg, "-y", "-ss", "5", "-i", str(destination), "-frames:v", "1", str(poster),
    ], check=True)

    details = probe(ffmpeg, destination)
    if not 15 <= details["durationSeconds"] <= 30:
        raise RuntimeError(f"App preview duration is outside Apple's 15-30 second range: {details}")
    if (details["width"], details["height"]) != (886, 1920) or details["fps"] > 30:
        raise RuntimeError(f"App preview video does not match Apple specifications: {details}")
    return destination, poster, details


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    assets = []
    for locale in ("en-US", "ko-KR"):
        video, poster, details = render(ffmpeg, locale)
        assets.append({
            "locale": locale,
            "video": video.relative_to(ROOT).as_posix(),
            "poster": poster.relative_to(ROOT).as_posix(),
            "sha256": sha256(video),
            **details,
        })
    manifest = {
        "version": VERSION,
        "appleProfile": "iPhone portrait app preview; H.264 High Profile; 886x1920; 30fps; AAC stereo 48kHz; 15-30 seconds",
        "assets": assets,
    }
    path = BASE / "app-store-preview-manifest.json"
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {len(assets)} App Store previews.")
    print(path)


if __name__ == "__main__":
    main()
