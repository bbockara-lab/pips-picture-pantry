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
OUTPUT_DIR = BASE / "upload" / "social" / "en-US"
OUTPUT = OUTPUT_DIR / "pips-picture-pantry-gameplay-short-1080x1920-v1.mp4"
COVER = OUTPUT_DIR / "pips-picture-pantry-gameplay-short-cover-1080x1920-v1.jpg"
MANIFEST = BASE / "premium-gameplay-short-v1-manifest.json"
START = 2.0
DURATION = 27.2


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # The pantry remains recognizable but quiet. The real gameplay is deliberately
    # large, centered, and crisp. Pip overlaps only the lower-left whitespace of
    # the capture so puzzle clues and primary controls remain unobstructed.
    filter_complex = (
        "[0:v]scale=3410:1920:flags=lanczos,crop=1080:1920," 
        "gblur=sigma=5:steps=2,eq=saturation=0.80:brightness=-0.018:contrast=0.96," 
        "drawbox=x=0:y=0:w=iw:h=ih:color=0x3a251d@0.10:t=fill,fps=30,format=yuv420p[bg];"
        "[bg]drawbox=x=163:y=122:w=754:h=1580:color=0x2f211d@0.30:t=fill," 
        "drawbox=x=171:y=114:w=738:h=1580:color=0xfffaec@0.98:t=fill[canvas];"
        "[1:v]scale=720:-2:flags=lanczos,crop=720:1560:0:0," 
        "fps=30,format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=26.45:d=0.75[game];"
        "[canvas][game]overlay=x=180:y=124:shortest=1[with_game];"
        "[2:v]scale=286:286:flags=lanczos,format=rgba[pip];"
        "[with_game][pip]overlay=x=126:y=1380:shortest=1[with_pip];"
        "[3:v]scale=270:-1:flags=lanczos,format=rgba[logo];"
        "[with_pip][logo]overlay=x=405:y=4:shortest=1,format=yuv420p[v];"
        f"[4:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,volume=0.27," 
        "afade=t=in:st=0:d=0.8,afade=t=out:st=26.0:d=1.2[a]"
    )

    subprocess.run([
        str(FFMPEG), "-y",
        "-loop", "1", "-i", str(BACKGROUND),
        "-ss", str(START), "-i", str(GAMEPLAY),
        "-loop", "1", "-i", str(PIP),
        "-loop", "1", "-i", str(LOGO),
        "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]", "-t", str(DURATION),
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.1",
        "-crf", "14", "-preset", "slow", "-r", "30",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", str(OUTPUT),
    ], check=True)

    subprocess.run([
        str(FFMPEG), "-y", "-ss", "7.8", "-i", str(OUTPUT),
        "-frames:v", "1", "-update", "1", "-q:v", "2", str(COVER),
    ], check=True)

    manifest = {
        "version": "v0.1.708",
        "platforms": ["YouTube Shorts", "Instagram Reels"],
        "durationSeconds": DURATION,
        "resolution": "1080x1920",
        "safeArea": "Primary content avoids the right-side action rail and bottom 200 px.",
        "creativeDirection": (
            "Latest continuous gameplay over softly defocused pantry artwork, with Pip "
            "overlapping the lower-left of the gameplay capture as a secondary guide."
        ),
        "gameplayStartSeconds": START,
        "gameplay": GAMEPLAY.relative_to(ROOT).as_posix(),
        "background": BACKGROUND.relative_to(ROOT).as_posix(),
        "pip": PIP.relative_to(ROOT).as_posix(),
        "logo": LOGO.relative_to(ROOT).as_posix(),
        "music": MUSIC.relative_to(ROOT).as_posix(),
        "video": OUTPUT.relative_to(ROOT).as_posix(),
        "cover": COVER.relative_to(ROOT).as_posix(),
        "sha256": sha256(OUTPUT),
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)
    print(COVER)
    print(MANIFEST)


if __name__ == "__main__":
    main()
