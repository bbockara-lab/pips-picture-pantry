from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "store-assets" / "store-media" / "v0.1.708"
FFMPEG = ROOT / ".tmp" / "video_deps_mac" / "imageio_ffmpeg" / "binaries" / "ffmpeg-macos-aarch64-v7.1"
BACKGROUND = ROOT / "store-assets" / "store-media" / "v0.1.704" / "video-art" / "premium-trailer" / "pantry-cinematic-background-v1.png"
GAMEPLAY = BASE / "raw" / "premium-trailer" / "gameplay-en-premium-v1.webm"
PIP = ROOT / "src" / "assets" / "characters" / "pip-chrome-v2.png"
LOGO = ROOT / "store-assets" / "brand" / "pips-picture-pantry-logo-v1.png"
MUSIC = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"
OUTPUT = BASE / "upload" / "youtube" / "en-US" / "premium-landscape-trailer-1920x1080-v4.mp4"
THUMBNAIL = OUTPUT.with_name("premium-landscape-trailer-thumbnail-1280x720-v4.jpg")
MANIFEST = BASE / "premium-landscape-trailer-v4-manifest.json"
DURATION = 31.8


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    # Keep the pantry identifiable without competing with the crisp gameplay.
    # Sigma 6 preserves shelves, window light, and materials while the lowered
    # saturation and center scrim still keep attention on the phone capture.
    filter_complex = (
        "[0:v]scale=2304:1296:flags=lanczos,crop=1920:1080," 
        "gblur=sigma=6:steps=2,eq=saturation=0.82:brightness=-0.012:contrast=0.97," 
        "drawbox=x=0:y=0:w=iw:h=ih:color=0xfff4dc@0.06:t=fill,fps=30,format=yuv420p[bg];"
        "[bg]drawbox=x=678:y=0:w=564:h=1080:color=0x2f211d@0.27:t=fill," 
        "drawbox=x=687:y=0:w=546:h=1080:color=0xfffaec@0.98:t=fill[canvas];"
        "[1:v]scale=520:1127:flags=lanczos,crop=520:1080:0:23," 
        "fps=30,format=yuv420p,fade=t=in:st=0:d=0.55,fade=t=out:st=31.05:d=0.75[game];"
        "[canvas][game]overlay=x=700:y=0:shortest=1[with_game];"
        "[2:v]scale=500:500:flags=lanczos,format=rgba[pip];"
        "[with_game][pip]overlay=x=155:y=500:shortest=1[with_pip];"
        "[3:v]scale=510:-1:flags=lanczos,format=rgba[logo];"
        "[with_pip][logo]overlay=x=68:y=54:shortest=1,format=yuv420p[v];"
        f"[4:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,volume=0.27," 
        "afade=t=in:st=0:d=1.0,afade=t=out:st=30.6:d=1.2[a]"
    )

    subprocess.run([
        str(FFMPEG), "-y",
        "-loop", "1", "-i", str(BACKGROUND),
        "-i", str(GAMEPLAY),
        "-loop", "1", "-i", str(PIP),
        "-loop", "1", "-i", str(LOGO),
        "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]",
        "-t", str(DURATION),
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.1",
        "-crf", "14", "-preset", "slow", "-r", "30",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", str(OUTPUT),
    ], check=True)

    subprocess.run([
        str(FFMPEG), "-y", "-ss", "6.5", "-i", str(OUTPUT),
        "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos",
        "-q:v", "2", str(THUMBNAIL),
    ], check=True)

    manifest = {
        "version": "v0.1.708",
        "creativeDirection": (
            "Static, softly defocused but identifiable pantry artwork; enlarged centered gameplay; "
            "Pip and the reusable title logo grouped on the left as secondary elements."
        ),
        "durationSeconds": DURATION,
        "resolution": "1920x1080",
        "videoEncoding": "H.264 High, CRF 14, 30 fps",
        "gameplay": GAMEPLAY.relative_to(ROOT).as_posix(),
        "background": BACKGROUND.relative_to(ROOT).as_posix(),
        "pip": PIP.relative_to(ROOT).as_posix(),
        "logo": LOGO.relative_to(ROOT).as_posix(),
        "music": MUSIC.relative_to(ROOT).as_posix(),
        "video": OUTPUT.relative_to(ROOT).as_posix(),
        "thumbnail": THUMBNAIL.relative_to(ROOT).as_posix(),
        "sha256": sha256(OUTPUT),
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)
    print(THUMBNAIL)
    print(MANIFEST)


if __name__ == "__main__":
    main()
