from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

PROJECT = Path(sys.argv[1]).resolve()
BASE = PROJECT / 'store-assets' / 'store-media' / 'v0.1.703'
ART = BASE / 'video-art' / 'character-launch' / 'pip-open-launch-art-v1.png'
MUSIC = PROJECT / 'src' / 'assets' / 'music' / 'bgm-cozy.mp3'
FFMPEG = PROJECT / '.tmp' / 'video_deps' / 'imageio_ffmpeg' / 'binaries' / 'ffmpeg-win-x86_64-v7.1.exe'


def font(size: int, bold: bool = False):
    for name in (['malgunbd.ttf', 'segoeuib.ttf'] if bold else ['malgun.ttf', 'segoeui.ttf']):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def cover(src: Image.Image, size: tuple[int, int]) -> Image.Image:
    sw, sh = src.size
    tw, th = size
    scale = max(tw / sw, th / sh)
    resized = src.resize((round(sw * scale), round(sh * scale)), Image.Resampling.LANCZOS)
    x = (resized.width - tw) // 2
    y = (resized.height - th) // 2
    return resized.crop((x, y, x + tw, y + th))


def background(locale: str) -> Path:
    src = Image.open(ART).convert('RGB')
    image = cover(src, (1920, 1080)).filter(ImageFilter.GaussianBlur(22))
    image = ImageEnhance.Color(image).enhance(0.72)
    veil = Image.new('RGBA', image.size, (55, 35, 22, 104))
    image = Image.alpha_composite(image.convert('RGBA'), veil)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((40, 50, 610, 1030), radius=42, fill=(255, 250, 233, 224))
    draw.rounded_rectangle((1310, 50, 1880, 1030), radius=42, fill=(255, 250, 233, 224))
    draw.rounded_rectangle((642, 14, 1278, 1066), radius=30, fill=(255, 246, 222, 245), outline=(255, 255, 255, 230), width=6)
    if locale == 'ko-KR':
        title = '핍의\n퍼즐방'
        kicker = '조용한 그림 퍼즐'
        stat = '333개의\n그림 퍼즐'
        line = '풀고 · 모으고 · 꾸며요'
    else:
        title = "Pip's\nPicture\nPantry"
        kicker = 'A quiet picture puzzle'
        stat = '333 picture\npuzzles'
        line = 'Solve · Collect · Decorate'
    title_font, kicker_font, stat_font, line_font = font(76, True), font(33), font(60, True), font(31)
    draw.text((90, 135), title, font=title_font, fill=(70, 42, 31, 255), spacing=4)
    draw.text((90, 555), kicker, font=kicker_font, fill=(145, 80, 30, 255))
    draw.line((90, 640, 550, 640), fill=(190, 139, 74, 150), width=2)
    draw.text((1365, 215), stat, font=stat_font, fill=(70, 42, 31, 255), spacing=6)
    draw.text((1365, 500), line, font=line_font, fill=(145, 80, 30, 255))
    draw.text((1365, 884), 'SUNNY SPOON STUDIOS', font=font(23, True), fill=(112, 78, 54, 230))
    path = BASE / 'video-art' / 'google-play-landscape' / locale / 'background-1920x1080.jpg'
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert('RGB').save(path, quality=94, subsampling=0)
    return path


def render(locale: str, language: str) -> dict:
    bg = background(locale)
    gameplay = BASE / 'raw' / 'video' / language / f'gameplay-{language}.webm'
    output = BASE / 'upload' / 'google-play' / locale / 'preview-video-landscape-1920x1080.mp4'
    filters = (
        '[0:v]scale=1920:1080,format=yuv420p[bg];'
        '[1:v]scale=608:1080:flags=lanczos,fps=30,format=yuv420p[game];'
        '[bg][game]overlay=x=656:y=0:shortest=1[v];'
        '[2:a]atrim=0:15.57,asetpts=PTS-STARTPTS,volume=0.28,'
        'afade=t=in:st=0:d=0.45,afade=t=out:st=14.9:d=0.65[a]'
    )
    subprocess.run([
        str(FFMPEG), '-y', '-loop', '1', '-i', str(bg), '-i', str(gameplay),
        '-ss', '12', '-stream_loop', '-1', '-i', str(MUSIC),
        '-filter_complex', filters, '-map', '[v]', '-map', '[a]',
        '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-crf', '18', '-preset', 'medium',
        '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
        '-movflags', '+faststart', '-shortest', str(output)
    ], check=True)
    thumbnail = output.with_name('preview-video-landscape-thumbnail-1280x720.jpg')
    subprocess.run([
        str(FFMPEG), '-y', '-ss', '3.0', '-i', str(output), '-frames:v', '1',
        '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', str(thumbnail)
    ], check=True)
    return {'locale': locale, 'video': output.relative_to(PROJECT).as_posix(), 'thumbnail': thumbnail.relative_to(PROJECT).as_posix()}


results = [render('en-US', 'en'), render('ko-KR', 'ko')]
manifest = {
    'version': 'v0.1.703',
    'purpose': 'Landscape Google Play preview video delivered through a standard YouTube URL.',
    'actualGameplaySource': 'Fresh current-app v0.1.703 recordings.',
    'orientation': '1920x1080 landscape',
    'durationSeconds': 15.57,
    'music': MUSIC.relative_to(PROJECT).as_posix(),
    'outputs': results
}
path = BASE / 'google-play-landscape-preview-manifest.json'
path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
print(path)
