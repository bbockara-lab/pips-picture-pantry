from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve()
if len(sys.argv) > 1:
    PROJECT = Path(sys.argv[1]).resolve()
else:
    raise SystemExit('project root required')

BASE = PROJECT / 'store-assets' / 'store-media' / 'v0.1.703'
ART = BASE / 'video-art' / 'character-launch' / 'pip-open-launch-art-v1.png'
MUSIC = PROJECT / 'src' / 'assets' / 'music' / 'bgm-cozy.mp3'
FFMPEG = PROJECT / '.tmp' / 'video_deps' / 'imageio_ffmpeg' / 'binaries' / 'ffmpeg-win-x86_64-v7.1.exe'


def font(size: int, bold: bool = False):
    names = ['malgunbd.ttf', 'segoeuib.ttf'] if bold else ['malgun.ttf', 'segoeui.ttf']
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def cover_image() -> Image.Image:
    src = Image.open(ART).convert('RGB')
    target_ratio = 1080 / 1920
    ratio = src.width / src.height
    if ratio > target_ratio:
        crop_w = int(src.height * target_ratio)
        left = (src.width - crop_w) // 2
        src = src.crop((left, 0, left + crop_w, src.height))
    else:
        crop_h = int(src.width / target_ratio)
        top = max(0, (src.height - crop_h) // 2)
        src = src.crop((0, top, src.width, top + crop_h))
    return src.resize((1080, 1920), Image.Resampling.LANCZOS)


def end_card(locale: str) -> Path:
    image = cover_image()
    overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle((92, 112, 988, 430), radius=42, fill=(255, 250, 235, 235), outline=(110, 75, 45, 95), width=2)
    if locale == 'ko-KR':
        title, sub = '핍의 퍼즐방', 'Android에 출시했어요'
    else:
        title, sub = "Pip's Picture Pantry", 'Now open on Android'
    title_font, sub_font = font(67, True), font(39, False)
    box = draw.textbbox((0, 0), title, font=title_font)
    draw.text(((1080 - (box[2]-box[0]))/2, 178), title, font=title_font, fill=(70, 43, 32, 255))
    box = draw.textbbox((0, 0), sub, font=sub_font)
    draw.text(((1080 - (box[2]-box[0]))/2, 304), sub, font=sub_font, fill=(151, 83, 25, 255))
    result = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    path = BASE / 'video-art' / 'character-launch' / locale / 'end-card.jpg'
    path.parent.mkdir(parents=True, exist_ok=True)
    result.save(path, quality=95, subsampling=0)
    return path


def render(locale: str) -> Path:
    end = end_card(locale)
    output = BASE / 'upload' / 'youtube' / locale / 'character-launch-short-1080x1920.mp4'
    output.parent.mkdir(parents=True, exist_ok=True)
    moving_seconds, end_seconds, total = 8.5, 2.5, 11.0
    filters = (
        "[0:v]scale=1180:2098:flags=lanczos,crop=1080:1920:(iw-ow)/2:(ih-oh)/2,"
        "zoompan=z='min(zoom+0.00008,1.025)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
        "d=1:s=1080x1920:fps=30,format=yuv420p,setpts=PTS-STARTPTS[v0];"
        "[1:v]scale=1080:1920:flags=lanczos,fps=30,format=yuv420p,setpts=PTS-STARTPTS[v1];"
        "[v0][v1]concat=n=2:v=1:a=0[v];"
        f"[2:a]atrim=0:{total},asetpts=PTS-STARTPTS,volume=0.28,"
        f"afade=t=in:st=0:d=0.5,afade=t=out:st={total-0.7}:d=0.7[a]"
    )
    subprocess.run([
        str(FFMPEG), '-y',
        '-framerate', '30', '-loop', '1', '-t', str(moving_seconds), '-i', str(ART),
        '-framerate', '30', '-loop', '1', '-t', str(end_seconds), '-i', str(end),
        '-ss', '36', '-stream_loop', '-1', '-i', str(MUSIC),
        '-filter_complex', filters, '-map', '[v]', '-map', '[a]',
        '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-crf', '18', '-preset', 'medium',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
        '-movflags', '+faststart', '-shortest', str(output)
    ], check=True)
    return output


outputs = [render('en-US'), render('ko-KR')]
manifest = {
    'version': 'v0.1.703',
    'concept': 'Character-and-atmosphere launch announcement; no gameplay footage.',
    'artwork': ART.relative_to(PROJECT).as_posix(),
    'music': MUSIC.relative_to(PROJECT).as_posix(),
    'musicStartSeconds': 36,
    'durationSeconds': 11,
    'outputs': [p.relative_to(PROJECT).as_posix() for p in outputs]
}
manifest_path = BASE / 'character-launch-short-manifest.json'
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
print(manifest_path)
