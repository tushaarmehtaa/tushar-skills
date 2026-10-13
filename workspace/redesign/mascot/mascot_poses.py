"""Draw the slashskills astronaut on a 32x36 pixel grid in 16 poses.

Writes one SVG per pose plus a sprite sheet PNG (4 columns) and poses.json.
Usage: python3 -I mascot_poses.py <out_dir>
"""
import json, math, sys
from pathlib import Path

W, H = 32, 36
INK, WHITE, CREAM, AMBER = "#0A0A0A", "#FFFFFF", "#F6E7C1", "#F59E0B"

HELMET_C = (16, 17)   # helmet centre
HELMET_R = 9.5
BODY_C = (16, 22)     # body centre
FEET_Y = 31           # centre row of the 3x3 feet; ground is row 33


def blob(cv, cx, cy, color=INK):
    """Solid 3x3 nub, used for arms and feet."""
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            cv[(cx + dx, cy + dy)] = color


def draw(p):
    cv = {}
    dy = p.get("dy", 0)
    lean = p.get("lean", 0)
    rx, ry = p.get("rx", 8.5), p.get("ry", 8)
    hx, hy = HELMET_C[0], HELMET_C[1] + dy
    bx, by = BODY_C[0], BODY_C[1] + dy

    # helmet: white fill, ink outline, cream glint top-left
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - hx, y + 0.5 - hy)
            if d <= HELMET_R - 1:
                cv[(x, y)] = WHITE
            elif d <= HELMET_R:
                cv[(x, y)] = INK
            if HELMET_R - 3.2 <= d <= HELMET_R - 1.6:
                ang = math.degrees(math.atan2(y + 0.5 - hy, x + 0.5 - hx))
                if -150 <= ang <= -105:
                    cv[(x, y)] = CREAM
    # headphones
    for side in (-1, 1):
        x0 = hx - 12 if side < 0 else hx + 9
        for x in range(x0, x0 + 3):
            for y in range(hy - 3, hy + 3):
                edge = x in (x0, x0 + 2) or y in (hy - 3, hy + 2)
                cv[(x, y)] = INK if edge else AMBER
    # body bean
    for y in range(H):
        for x in range(W):
            if ((x + 0.5 - bx) / rx) ** 2 + ((y + 0.5 - by) / ry) ** 2 <= 1:
                cv[(x, y)] = INK
    # eyes
    eyes = p.get("eyes", "open")
    ex = p.get("look", 0)
    for x0 in (bx - 4 + ex, bx + 2 + ex):
        ey = by - 5
        if eyes == "open":
            for x in (x0, x0 + 1):
                for y in (ey, ey + 1, ey + 2):
                    cv[(x, y)] = WHITE
        elif eyes == "blink":
            cv[(x0, ey + 2)] = cv[(x0 + 1, ey + 2)] = WHITE
        elif eyes == "happy":
            cv[(x0 - 1, ey + 2)] = cv[(x0, ey + 1)] = cv[(x0 + 1, ey + 1)] = cv[(x0 + 2, ey + 2)] = WHITE
    # amber slash, two pixels thick
    for i in range(8):
        x = bx - 4 + i
        y = by + 5 - round(i * 6 / 7)
        cv[(x, y)] = AMBER
        cv[(x + 1, y)] = AMBER

    # lean: shift everything above the body centre sideways
    if lean:
        moved = {}
        for (x, y), c in cv.items():
            shift = lean if y < by - 2 else 0
            moved[(x + shift, y)] = c
        cv = moved

    # The grid centre sits between columns 15 and 16, so right-side parts step one column in to mirror the left.
    mirror = lambda x: x if x < bx else x - 1
    # arms: offsets from the body centre
    for ax, ay in p.get("arms", [(-10, 1), (10, 1)]):
        blob(cv, mirror(bx + ax), by + ay)
    # feet: absolute x, lift in rows
    for fx, lift in p.get("feet", [(12, 0), (20, 0)]):
        blob(cv, mirror(fx), FEET_Y - lift)
    return cv


DOWN = [(-10, 1), (10, 1)]
POSES = [
    ("idle", "Idle", "standing on the bar", {}),
    ("blink", "Blink", "idle breath, eyes shut", {"dy": 1, "eyes": "blink", "arms": [(-10, 1), (10, 1)]}),
    ("step-l", "Step left", "walk frame, left foot up", {"dy": -1, "arms": [(-10, -1), (10, 2)], "feet": [(12, 2), (20, 0)]}),
    ("step-r", "Step right", "walk frame, right foot up", {"dy": -1, "arms": [(-10, 2), (10, -1)], "feet": [(12, 0), (20, 2)]}),
    ("hop", "Hop", "little bounce between steps", {"dy": -3, "arms": [(-10, -2), (10, -2)], "feet": [(12, 2), (20, 2)]}),
    ("wave-high", "Wave high", "hover hello, arm up", {"arms": [(-10, 1), (13, -11)], "eyes": "happy"}),
    ("wave-out", "Wave out", "hover hello, arm swings out", {"arms": [(-10, 1), (13, -6)], "eyes": "happy", "lean": -1}),
    ("hands-up", "Hands up", "the \\o/ on copy", {"arms": [(-13, -11), (13, -11)], "eyes": "happy"}),
    ("arms-out", "Arms out", "airplane, mid dance", {"arms": [(-12, -2), (12, -2)]}),
    ("disco", "Disco point", "one up, one down", {"arms": [(-12, 4), (13, -11)], "lean": 1, "feet": [(11, 0), (20, 0)]}),
    ("groove-l", "Groove left", "lean left, kick right", {"lean": -1, "arms": [(-13, -10), (10, 3)], "feet": [(12, 0), (22, 2)]}),
    ("groove-r", "Groove right", "lean right, kick left", {"lean": 1, "arms": [(-10, 3), (13, -10)], "feet": [(10, 2), (20, 0)]}),
    ("squat", "Squat", "drop low, feet wide", {"dy": 2, "rx": 9.5, "ry": 7, "arms": [(-12, 0), (12, 0)], "feet": [(9, 0), (23, 0)], "eyes": "happy"}),
    ("jump", "Jump", "copy cheer, top of the jump", {"dy": -6, "arms": [(-13, -11), (13, -11)], "feet": [(13, 5), (19, 5)], "eyes": "happy"}),
    ("land", "Land", "squash on landing", {"dy": 1, "rx": 9.5, "ry": 7.5, "arms": [(-12, 3), (12, 3)], "feet": [(10, 0), (22, 0)]}),
    ("look", "Look", "eyes follow the cursor", {"look": 1}),
]


def svg(cv):
    rows = {}
    for (x, y), c in cv.items():
        if 0 <= x < W and 0 <= y < H:
            rows.setdefault(y, {})[x] = c
    out = []
    for y in sorted(rows):
        xs = sorted(rows[y])
        start = prev = xs[0]
        for x in xs[1:] + [None]:
            if x is not None and x == prev + 1 and rows[y][x] == rows[y][start]:
                prev = x
                continue
            out.append(f'<rect x="{start}" y="{y}" width="{prev - start + 1}" height="1" fill="{rows[y][start]}"/>')
            if x is not None:
                start = prev = x
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W * 10}" height="{H * 10}" shape-rendering="crispEdges">{"".join(out)}</svg>'


def main(out):
    out = Path(out)
    (out / "poses").mkdir(parents=True, exist_ok=True)
    meta = []
    for i, (slug, name, note, p) in enumerate(POSES):
        cv = draw(p)
        (out / "poses" / f"{i + 1:02d}-{slug}.svg").write_text(svg(cv))
        meta.append({"index": i, "slug": slug, "name": name, "note": note, "frame": [i % 4, i // 4]})
    try:
        from PIL import Image
        sheet = Image.new("RGBA", (W * 4, H * math.ceil(len(POSES) / 4)), (0, 0, 0, 0))
        for i, (_, _, _, p) in enumerate(POSES):
            for (x, y), c in draw(p).items():
                if 0 <= x < W and 0 <= y < H:
                    sheet.putpixel(((i % 4) * W + x, (i // 4) * H + y), tuple(int(c[k:k + 2], 16) for k in (1, 3, 5)) + (255,))
        sheet.save(out / "mascot-sheet.png")
    except ImportError:
        pass
    (out / "poses.json").write_text(json.dumps({"frame": [W, H], "columns": 4, "poses": meta}, indent=1))
    print(f"wrote {len(POSES)} poses to {out}")


if __name__ == "__main__":
    main(sys.argv[1])
