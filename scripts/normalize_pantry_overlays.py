#!/usr/bin/env python3
"""Normalize generated Pantry cutouts onto the shared 1024x1536 room canvas."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

CANVAS = (1024, 1536)

# x, y, width, height in the shared room canvas.  Values are scene anchors,
# not responsive CSS coordinates: each exported image remains a full canvas.
TARGETS = {
    "counter-starter-cloth-v1.png": (52, 760, 360, 190),
    "counter-small-jam-jar-v1.png": (590, 745, 120, 180),
    "counter-ribbon-rolling-pin-v1.png": (400, 800, 260, 96),
    "counter-soup-pot-v1.png": (490, 735, 190, 185),
    "counter-honey-cake-stand-v1.png": (465, 720, 210, 205),
    "counter-golden-waffle-press-v1.png": (440, 735, 250, 190),
    "window-sunny-curtains-v1.png": (690, 18, 320, 790),
    "window-herb-pot-v1.png": (760, 600, 155, 170),
    "window-flower-vase-v1.png": (810, 530, 150, 245),
    "window-lace-lantern-v1.png": (690, 355, 132, 210),
    "window-stained-glass-v1.png": (742, 275, 170, 230),
    "shelf-recipe-cards-v1.png": (48, 470, 220, 160),
    "shelf-tiny-succulent-v1.png": (95, 510, 160, 145),
    "shelf-berry-tea-tins-v1.png": (60, 280, 205, 155),
    "shelf-copper-cookie-tin-v1.png": (78, 265, 180, 160),
    "shelf-spice-carousel-v1.png": (45, 325, 240, 170),
    "floor-mint-check-rug-v1.png": (68, 1290, 705, 190),
    "floor-woven-basket-v1.png": (72, 1115, 215, 185),
    "floor-plush-cushion-v1.png": (690, 1240, 275, 215),
    "floor-delivery-cart-v1.png": (500, 1090, 390, 305),
    "back-wall-cork-board-v1.png": (360, 225, 305, 300),
    "back-wall-spoon-clock-v1.png": (400, 220, 230, 310),
    "back-wall-golden-sign-v1.png": (385, 265, 250, 175),
    "back-wall-framed-recipe-v1.png": (375, 255, 270, 245),
    "back-wall-tapestry-v1.png": (350, 115, 330, 470),
}


def normalize(input_path: Path, output_path: Path, target: tuple[int, int, int, int]) -> None:
    image = Image.open(input_path).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"No visible subject in {input_path}")
    subject = image.crop(bbox)
    x, y, max_width, max_height = target
    scale = min(max_width / subject.width, max_height / subject.height)
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    paste_x = x + (max_width - subject.width) // 2
    paste_y = y + max_height - subject.height
    canvas.alpha_composite(subject, (paste_x, paste_y))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()
    for filename, target in TARGETS.items():
        source = args.input_dir / filename
        if not source.exists():
            raise FileNotFoundError(source)
        normalize(source, args.output_dir / filename, target)
        print(f"normalized {filename}")


if __name__ == "__main__":
    main()
