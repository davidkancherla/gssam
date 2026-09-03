#!/usr/bin/env python3
"""Generate a GSSAM YouTube thumbnail with the next Sunday date."""

from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PHOTO = ROOT / "public" / "images" / "real-bishop-visit.jpg"
DEFAULT_LOGO = ROOT / "public" / "brand" / "logo.png"
DEFAULT_OUTPUT = ROOT / "public" / "generated" / "gssam-youtube-thumbnail.png"
TIMEZONE = "America/Los_Angeles"
CANVAS = (1280, 720)


def next_sunday(today: date) -> date:
    days_until_sunday = (6 - today.weekday()) % 7
    return today + timedelta(days=days_until_sunday)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default(size=size)


def cover_crop(image: Image.Image, size: tuple[int, int], focus_x: float = 0.56) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = int((resized.width - target_w) * focus_x)
    top = max(0, (resized.height - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h))


def draw_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font_obj: ImageFont.ImageFont, fill: str) -> None:
    x, y = xy
    shadow = (0, 0, 0, 145)
    draw.text((x + 3, y + 4), text, font=font_obj, fill=shadow)
    draw.text((x, y), text, font=font_obj, fill=fill)


def centered_text(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, font_obj: ImageFont.ImageFont, fill: str) -> None:
    left, top, right, bottom = box
    text_box = draw.textbbox((0, 0), text, font=font_obj)
    text_w = text_box[2] - text_box[0]
    text_h = text_box[3] - text_box[1]
    x = left + ((right - left - text_w) // 2)
    y = top + ((bottom - top - text_h) // 2) - 2
    draw.text((x, y), text, font=font_obj, fill=fill)


def rounded_panel(size: tuple[int, int], radius: int, fill: tuple[int, int, int, int]) -> Image.Image:
    panel = Image.new("RGBA", size, (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=fill)
    return panel


def make_thumbnail(photo_path: Path, logo_path: Path, output_path: Path, service_date: date) -> None:
    base = cover_crop(Image.open(photo_path).convert("RGB"), CANVAS)
    base = ImageEnhance.Color(base).enhance(1.08)
    base = ImageEnhance.Contrast(base).enhance(1.06)

    canvas = base.convert("RGBA")
    overlay = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    pixels = overlay.load()
    for x in range(CANVAS[0]):
        alpha = int(max(0, 208 * (1 - (x / 780))))
        maroon_boost = int(max(0, 70 * (1 - (x / 540))))
        for y in range(CANVAS[1]):
            vertical = 1 - abs((y - 360) / 460)
            pixels[x, y] = (78 + maroon_boost, 8, 18, max(0, min(230, int(alpha * (0.76 + vertical * 0.24)))))
    canvas.alpha_composite(overlay)

    draw = ImageDraw.Draw(canvas)

    logo_badge = rounded_panel((214, 116), 22, (112, 13, 24, 236))
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((162, 82), Image.Resampling.LANCZOS)
    logo_badge.alpha_composite(logo, ((214 - logo.width) // 2, (116 - logo.height) // 2))
    canvas.alpha_composite(logo_badge, (72, 54))

    draw_text(draw, (314, 65), "GSSAM", font(60, bold=True), "#fff8ee")
    draw.text((318, 130), "GOOD SHEPHERD SOUTH ASIAN MINISTRY", font=font(22, bold=True), fill="#f7d9a2")

    draw.rounded_rectangle((72, 220, 416, 272), radius=16, fill=(246, 199, 72, 238), outline=(255, 244, 204, 210), width=2)
    centered_text(draw, (72, 220, 416, 272), "SUNDAY WORSHIP", font(29, bold=True), "#3d0b10")

    date_line = f"{service_date:%A}, {service_date:%B} {service_date.day}, {service_date:%Y}"

    draw_text(draw, (72, 304), date_line.upper(), font(52, bold=True), "#ffffff")
    draw_text(draw, (72, 382), "11:30 AM - 1:30 PM PT", font(58, bold=True), "#f6c748")
    draw_text(draw, (72, 472), "Telugu | Hindi | English", font(40, bold=True), "#fff4df")

    info_panel = rounded_panel((500, 72), 16, (255, 255, 255, 42))
    canvas.alpha_composite(info_panel, (72, 566))
    centered_text(draw, (72, 566, 572, 638), "4211 Carol Ave, Fremont, CA", font(30, bold=True), "#fff8ee")

    draw.rectangle((0, 690, 1280, 720), fill=(112, 13, 24, 244))
    centered_text(draw, (0, 690, 1280, 720), "WORSHIP WITH OUR CHURCH FAMILY THIS SUNDAY", font(24, bold=True), "#fff8ee")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path, "PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a dated GSSAM YouTube thumbnail.")
    parser.add_argument("--date", help="Service date in YYYY-MM-DD format. Defaults to the next upcoming Sunday.")
    parser.add_argument("--photo", type=Path, default=DEFAULT_PHOTO, help="Background photo path.")
    parser.add_argument("--logo", type=Path, default=DEFAULT_LOGO, help="Logo image path.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output PNG path.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.date:
        service_date = datetime.strptime(args.date, "%Y-%m-%d").date()
    else:
        today = datetime.now(ZoneInfo(TIMEZONE)).date()
        service_date = next_sunday(today)
    make_thumbnail(args.photo, args.logo, args.output, service_date)
    print(f"Generated {args.output} for {service_date.isoformat()}")


if __name__ == "__main__":
    main()
