"""Raster icons for slashskills from the slash mark (site/components/brand/logos.tsx: SlashMark).

32-unit grid: ink square with rx 7, amber stroke from (10.5, 24.5) to (21.5, 7.5), width 2.8, round caps.
Usage: python3 -I make_icons.py <site dir>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

INK, AMBER = (10, 10, 10, 255), (245, 158, 11, 255)
SS = 8  # supersampling


def mark(size, rounded=True, slash_scale=1.0):
    big = size * SS
    u = big / 32
    im = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=7 * u, fill=INK)
    else:
        d.rectangle((0, 0, big, big), fill=INK)
    c = 16 * u
    a = (c + (10.5 * u - c) * slash_scale, c + (24.5 * u - c) * slash_scale)
    b = (c + (21.5 * u - c) * slash_scale, c + (7.5 * u - c) * slash_scale)
    w = 2.8 * u * slash_scale
    d.line((a, b), fill=AMBER, width=round(w))
    for x, y in (a, b):
        d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=AMBER)
    return im.resize((size, size), Image.LANCZOS)


def main(site):
    site = Path(site)
    app, public = site / "app", site / "public"
    mark(48).save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    # iOS masks its own corners, so the touch icon is a full square.
    mark(180, rounded=False).save(app / "apple-icon.png")
    mark(180, rounded=False).save(public / "apple-touch-icon.png")
    mark(192).save(public / "icon-192.png")
    mark(512).save(public / "icon-512.png")
    # Maskable: full bleed, slash kept inside the 80% safe zone.
    mark(512, rounded=False, slash_scale=0.8).save(public / "icon-maskable-512.png")
    print("wrote favicon.ico, apple-icon.png, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png")


if __name__ == "__main__":
    main(sys.argv[1])
