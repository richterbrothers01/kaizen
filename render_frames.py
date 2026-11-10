#!/usr/bin/env python3
"""Render 5 scroll-scrub frame sequences for the Kaizen landing pages.

Each scene: 72 frames, 960x540, WebP, plus a poster.jpg (frame 40).
Deterministic seeds. Output: landing-pages/<slug>/frames/f000.webp ... f071.webp
"""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H, N = 960, 540, 72
ROOT = os.path.expanduser("~/workspace/kaizen/landing-pages")

# ------------------------------------------------------------------ glow kit
def _sprite(size, power=2.0):
    y, x = np.mgrid[0:size, 0:size]
    c = (size - 1) / 2.0
    d = np.sqrt((x - c) ** 2 + (y - c) ** 2) / (size / 2.0)
    return (np.clip(1 - d, 0, 1) ** power).astype(np.float32)

SPRITES = {r: _sprite(r * 2) for r in (3, 6, 12, 24, 48, 96, 160)}

def add_glow(arr, x, y, radius, color, intensity=1.0):
    r = min(SPRITES, key=lambda k: abs(k - radius))
    spr = SPRITES[r]
    s = spr.shape[0]
    x0, y0 = int(x - s / 2), int(y - s / 2)
    xa, ya = max(0, x0), max(0, y0)
    xb, yb = min(W, x0 + s), min(H, y0 + s)
    if xa >= xb or ya >= yb:
        return
    sub = spr[ya - y0: ya - y0 + (yb - ya), xa - x0: xa - x0 + (xb - xa)]
    for ch in range(3):
        arr[ya:yb, xa:xb, ch] += sub * color[ch] * intensity * 255.0

def to_img(arr):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

def save_scene(slug, frames):
    out = os.path.join(ROOT, slug, "frames")
    os.makedirs(out, exist_ok=True)
    for i, im in enumerate(frames):
        im.save(os.path.join(out, f"f{i:03d}.webp"), quality=74, method=4)
    frames[40].save(os.path.join(ROOT, slug, "poster.jpg"), quality=84)
    print(f"{slug}: {len(frames)} frames", flush=True)

BG = np.array([5.0, 5.0, 7.0], dtype=np.float32)

# ------------------------------------------------------------------ 1. climb
def scene_climb():
    rng = random.Random(11)
    embers = []
    for _ in range(110):
        embers.append(dict(x=rng.uniform(0, W), y=rng.uniform(0, H),
                           sp=rng.uniform(0.35, 1.0), r=rng.choice([3, 3, 6, 6, 12]),
                           ph=rng.uniform(0, 6.28), drift=rng.uniform(-14, 20),
                           warm=rng.uniform(0.5, 0.72)))
    orbs = [dict(x=rng.uniform(80, W - 80), y=rng.uniform(0, H),
                 sp=rng.uniform(0.12, 0.25), r=rng.choice([48, 96]),
                 int=rng.uniform(0.10, 0.17)) for _ in range(6)]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        arr = np.zeros((H, W, 3), dtype=np.float32) + BG
        for o in orbs:
            y = (o["y"] - t * o["sp"] * H * 1.6) % (H + 160) - 80
            add_glow(arr, o["x"], y, o["r"], (1.0, 0.62, 0.25), o["int"])
        for e in embers:
            y = (e["y"] - t * e["sp"] * H * 1.25) % (H + 24) - 12
            x = e["x"] + math.sin(t * 5 + e["ph"]) * 7 + t * e["drift"]
            flick = 0.55 + 0.45 * math.sin(t * 22 + e["ph"] * 3)
            add_glow(arr, x, y, e["r"], (1.0, e["warm"], 0.28), 0.85 * flick)
        im = to_img(arr)
        d = ImageDraw.Draw(im, "RGBA")
        off = t * 16  # steps sink slightly: camera rises
        for k, (x0, yb, wd) in enumerate([(90, 470, 300), (330, 505, 330), (580, 538, 320)]):
            y = yb + off
            d.polygon([(x0, y), (x0 + wd, y - 26), (x0 + wd, H + 20), (x0, H + 20)],
                      fill=(9, 9, 13, 255))
            d.line([(x0, y), (x0 + wd, y - 26)], fill=(72, 56, 30, 255), width=2)
        frames.append(im)
    return frames

# ------------------------------------------------------------------ 2. glass
def scene_glass():
    frames = []
    panes = [(-30, 110, 40, 300, 210), (240, 300, 190, 330, 230), (560, 90, 330, 300, 200)]
    for i in range(N):
        t = i / (N - 1)
        arr = np.zeros((H, W, 3), dtype=np.float32) + np.array([4, 5, 8], np.float32)
        add_glow(arr, W * 0.66 + 50 * math.sin(t * 3.14), H * 0.42, 160,
                 (1.0, 0.66, 0.3), 0.16)
        add_glow(arr, W * 0.3, H * 0.7, 96, (0.45, 0.6, 1.0), 0.07)
        im = to_img(arr)
        for (x, y, base_ang, pw, ph) in panes:
            layer = Image.new("RGBA", (pw + 80, ph + 80), (0, 0, 0, 0))
            ld = ImageDraw.Draw(layer)
            ld.rounded_rectangle([40, 40, 40 + pw, 40 + ph], radius=26,
                                 fill=(175, 200, 225, 56), outline=(225, 238, 255, 155), width=2)
            ld.line([40, 40 + ph, 40 + pw, 40], fill=(255, 196, 120, 110), width=3)
            layer = layer.rotate(base_ang + t * 16, resample=Image.BICUBIC, center=(layer.width / 2, layer.height / 2))
            im.paste(layer, (int(x + t * 26), int(y + 8 * math.sin(t * 3 + x))), layer)
        glow = im.filter(ImageFilter.GaussianBlur(14))
        im = Image.blend(im, glow, 0.18)
        frames.append(im.convert("RGB"))
    return frames

# ------------------------------------------------------------------ 3. night
def scene_night():
    rng = random.Random(33)
    bokeh = [dict(x=rng.uniform(0, W), y=rng.uniform(0, H), r=rng.choice([24, 48, 96]),
                  warm=rng.random() < 0.7, dx=rng.uniform(-8, 8), int=rng.uniform(0.10, 0.22))
             for _ in range(26)]
    rain = [dict(x=rng.uniform(-10, W), y=rng.uniform(0, H), ln=rng.uniform(10, 24),
                 sp=rng.uniform(0.9, 1.7), a=rng.randint(60, 150)) for _ in range(150)]
    drops = [dict(x=rng.uniform(60, W - 60), y=rng.uniform(0, H * 0.5),
                  sp=rng.uniform(0.10, 0.2), ln=rng.uniform(26, 54)) for _ in range(8)]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        arr = np.zeros((H, W, 3), dtype=np.float32) + np.array([4, 5, 9], np.float32)
        for b in bokeh:
            col = (1.0, 0.62, 0.26) if b["warm"] else (0.4, 0.55, 1.0)
            add_glow(arr, b["x"] + t * b["dx"], b["y"], b["r"], col, b["int"])
        im = to_img(arr)
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        for r in rain:
            y = (r["y"] + t * (H + 80) * r["sp"]) % (H + 80) - 40
            d.line([(r["x"], y), (r["x"] - 2, y + r["ln"])], fill=(175, 195, 215, r["a"]), width=2)
        for dr in drops:
            y = (dr["y"] + t * H * dr["sp"] * 3) % (H * 0.8)
            grad = Image.new("RGBA", (6, int(dr["ln"])), (0, 0, 0, 0))
            gd = ImageDraw.Draw(grad)
            for k in range(int(dr["ln"])):
                a = int(120 * (k / dr["ln"]))
                gd.line([(3, k), (3, k)], fill=(200, 215, 230, a))
            layer.paste(grad, (int(dr["x"]), int(y)), grad)
            d.ellipse([dr["x"], y + dr["ln"] - 3, dr["x"] + 6, y + dr["ln"] + 3],
                      fill=(210, 225, 240, 150))
        layer = layer.filter(ImageFilter.GaussianBlur(0.7))
        im.paste(layer, (0, 0), layer)
        frames.append(im.convert("RGB"))
    return frames

# ------------------------------------------------------------------ 4. flow
def scene_flow():
    frames = []
    starts = [0.16, 0.32, 0.47, 0.62, 0.8]
    target = (0.78 * W, 0.46 * H)
    for i in range(N):
        t = i / (N - 1)
        layer = Image.new("RGB", (W, H), (0, 0, 0))
        d = ImageDraw.Draw(layer)
        curves = []
        for j, sy in enumerate(starts):
            pts = []
            for xi in range(0, W + 1, 8):
                u = xi / W
                y = (sy * H) * (1 - u ** 1.35) + target[1] * (u ** 1.35)
                y += math.sin(xi * 0.012 + t * 6.28 + j * 1.3) * 11 * (1 - u)
                pts.append((xi, y))
            curves.append(pts)
            d.line(pts, fill=(150, 104, 30) if j != 2 else (210, 150, 60), width=3)
        bloom = layer.filter(ImageFilter.GaussianBlur(7))
        arr = np.asarray(bloom, dtype=np.float32) * 1.15 + BG
        for j, pts in enumerate(curves):
            k = int(((t * 1.2 + j * 0.23) % 1.0) * (len(pts) - 1))
            x, y = pts[k]
            add_glow(arr, x, y, 24, (1.0, 0.72, 0.34), 0.8)
        pulse = 0.75 + 0.25 * math.sin(t * 12.56)
        add_glow(arr, target[0], target[1], 48, (1.0, 0.74, 0.36), 0.85 * pulse)
        add_glow(arr, target[0], target[1], 12, (1.0, 0.85, 0.55), 1.0)
        frames.append(to_img(arr))
    return frames

# ------------------------------------------------------------------ 5. zen
def scene_zen():
    rng = random.Random(55)
    stars = [dict(x=rng.uniform(0, W), y=rng.uniform(0, H * 0.85), r=rng.choice([3, 3, 6]),
                  ph=rng.uniform(0, 6.28), base=rng.uniform(0.25, 0.8)) for _ in range(170)]
    cloud_src = Image.new("L", (W, 120), 0)
    cd = ImageDraw.Draw(cloud_src)
    for _ in range(46):
        cx, cy = rng.uniform(0, W), rng.uniform(20, 100)
        rr = rng.uniform(18, 60)
        cd.ellipse([cx - rr, cy - rr * 0.32, cx + rr, cy + rr * 0.32], fill=rng.randint(28, 70))
    cloud_src = cloud_src.filter(ImageFilter.GaussianBlur(16))
    frames = []
    for i in range(N):
        t = i / (N - 1)
        arr = np.zeros((H, W, 3), dtype=np.float32) + np.array([3, 3, 5], np.float32)
        hx, hy = W * 0.5, H * 0.34
        grow = 0.35 + 0.4 * t
        add_glow(arr, hx, hy, 160, (1.0, 0.8, 0.5), 0.34 * grow + 0.12)
        for s in stars:
            tw = s["base"] * (0.55 + 0.45 * math.sin(t * 12.56 + s["ph"]))
            add_glow(arr, s["x"], s["y"], s["r"], (0.9, 0.93, 1.0), tw)
        im = to_img(arr)
        spark = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sd = ImageDraw.Draw(spark)
        L = 92 + 40 * t
        a = int(130 * grow)
        sd.line([(hx - L, hy), (hx + L, hy)], fill=(255, 226, 170, a), width=2)
        sd.line([(hx, hy - L * 0.7), (hx, hy + L * 0.7)], fill=(255, 226, 170, a), width=2)
        spark = spark.filter(ImageFilter.GaussianBlur(1.1))
        im.paste(spark, (0, 0), spark)
        arr2 = np.asarray(im, dtype=np.float32)
        add_glow(arr2, hx, hy, 24, (1.0, 0.86, 0.6), 0.95)
        im = to_img(arr2)
        for band, ybase in enumerate((300, 400)):
            strip = cloud_src.crop((0, band * 40, W, band * 40 + 60)).resize((W, 60))
            off = int(t * (50 + band * 30)) % W
            merged = Image.new("L", (W, 60), 0)
            merged.paste(strip, (-off, 0))
            merged.paste(strip, (W - off, 0))
            tint = Image.new("RGBA", (W, 60), (150, 160, 190, 0))
            tint.putalpha(merged.point(lambda v: int(v * 0.5)))
            im.paste(tint, (0, ybase), tint)
        frames.append(im.convert("RGB"))
    return frames

# ------------------------------------------------------------------ run
if __name__ == "__main__":
    save_scene("kaizen-1-climb", scene_climb())
    save_scene("kaizen-2-glass", scene_glass())
    save_scene("kaizen-3-night", scene_night())
    save_scene("kaizen-4-flow", scene_flow())
    save_scene("kaizen-5-zen", scene_zen())
    print("ALL SCENES DONE")
