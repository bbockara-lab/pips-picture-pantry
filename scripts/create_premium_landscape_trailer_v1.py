from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "store-assets" / "store-media" / "v0.1.704"
FFMPEG = ROOT / ".tmp" / "video_deps_mac" / "imageio_ffmpeg" / "binaries" / "ffmpeg-macos-aarch64-v7.1"
BACKGROUND = BASE / "video-art" / "premium-trailer" / "pantry-cinematic-background-v1.png"
GAMEPLAY = BASE / "raw" / "premium-trailer" / "gameplay-en-premium-v1.webm"
PIP = ROOT / "src" / "assets" / "characters" / "pip-chrome-v2.png"
MUSIC = ROOT / "src" / "assets" / "music" / "bgm-cozy.mp3"
OUTPUT = BASE / "upload" / "youtube" / "en-US" / "premium-landscape-trailer-1920x1080-v1.mp4"
THUMBNAIL = OUTPUT.with_name("premium-landscape-trailer-thumbnail-1280x720-v1.jpg")
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
DURATION = 31.8


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    title = "Pip’s Picture Pantry"
    filter_complex = (
        "[0:v]scale=2000:1125:flags=lanczos,"
        "crop=1920:1080:x='40+24*sin(t/9)':y='22+10*sin(t/12)',"
        "fps=30,format=yuv420p[bg];"
        "[bg]drawbox=x=604:y=14:w=526:h=1052:color=0x38251f@0.23:t=fill,"
        "drawbox=x=592:y=2:w=526:h=1052:color=0xfff8e8@0.98:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{title}':x=72:y=118:fontsize=46:"
        "fontcolor=0x4a3028:borderw=2:bordercolor=0xfff7e4@0.75,"
        f"drawtext=fontfile='{FONT_REGULAR}':text='A cozy picture puzzle':x=86:y=198:fontsize=31:"
        "fontcolor=0x815a3f:borderw=1:bordercolor=0xfff7e4@0.65,"
        f"drawtext=fontfile='{FONT_BOLD}':text='SOLVE   •   COLLECT   •   DECORATE':x=84:y=872:fontsize=25:"
        "fontcolor=0x51362d:borderw=1:bordercolor=0xfff7e4@0.75[canvas];"
        "[1:v]scale=486:1052:flags=lanczos,fps=30,format=yuv420p,"
        "fade=t=in:st=0:d=0.65,fade=t=out:st=31.05:d=0.75[game];"
        "[canvas][game]overlay=x=612:y=2:shortest=1[mid];"
        "[2:v]scale=520:520:flags=lanczos,format=rgba[pip];"
        "[mid][pip]overlay=x=1360:y='500+8*sin(t*1.35)':shortest=1,format=yuv420p[v];"
        f"[3:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,volume=0.30,"
        "afade=t=in:st=0:d=1.0,afade=t=out:st=30.6:d=1.2[a]"
    )
    subprocess.run([
        str(FFMPEG), "-y",
        "-loop", "1", "-i", str(BACKGROUND),
        "-i", str(GAMEPLAY),
        "-loop", "1", "-i", str(PIP),
        "-ss", "12", "-stream_loop", "-1", "-i", str(MUSIC),
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "[a]",
        "-t", str(DURATION),
        "-c:v", "libx264", "-profile:v", "high", "-level", "4.1",
        "-crf", "16", "-preset", "slow", "-r", "30",
        "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", str(OUTPUT)
    ], check=True)
    subprocess.run([
        str(FFMPEG), "-y", "-ss", "6.5", "-i", str(OUTPUT),
        "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-q:v", "2", str(THUMBNAIL)
    ], check=True)
    manifest = {
        "version": "v0.1.704",
        "direction": "Premium art-first landscape trailer with slow background drift and paced current-gameplay capture.",
        "durationSeconds": DURATION,
        "resolution": "1920x1080",
        "gameplay": GAMEPLAY.relative_to(ROOT).as_posix(),
        "background": BACKGROUND.relative_to(ROOT).as_posix(),
        "pip": PIP.relative_to(ROOT).as_posix(),
        "music": MUSIC.relative_to(ROOT).as_posix(),
        "video": OUTPUT.relative_to(ROOT).as_posix(),
        "thumbnail": THUMBNAIL.relative_to(ROOT).as_posix(),
    }
    path = BASE / "premium-landscape-trailer-manifest.json"
    path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(OUTPUT)
    print(THUMBNAIL)


if __name__ == "__main__":
    main()
