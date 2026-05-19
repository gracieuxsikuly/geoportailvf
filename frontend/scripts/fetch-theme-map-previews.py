"""
Vignettes cartographiques « Explorer par thématique » — une carte distincte par thème.

Sources : Wikimedia Commons (CC / domaine public) ; tuiles © OpenStreetMap (ODbL) via Carto.
Usage : python scripts/fetch-theme-map-previews.py
"""

from __future__ import annotations

import io
import math
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "themes"
TARGET_SIZE = (800, 500)
USER_AGENT = "VirungaGeoportail/1.0 (theme-map-generator)"

# Tuiles Carto (ODbL — OpenStreetMap)
TILE_VOYAGER = "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
TILE_LIGHT = "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
TILE_DARK = "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
TILE_ROADS = "https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
TILE_TOPO = "https://tile.opentopomap.org/{z}/{x}/{y}.png"

# Contour simplifié du cœur du PNV (coords relatives 0–1 dans la vignette OSM z9 centrée Virunga)
PARK_POLYGON_REL = [
    (0.42, 0.18),
    (0.62, 0.22),
    (0.72, 0.42),
    (0.68, 0.62),
    (0.48, 0.72),
    (0.32, 0.58),
    (0.30, 0.35),
]


@dataclass(frozen=True)
class MapView:
    lat: float
    lon: float
    zoom: int
    cols: int = 3
    rows: int = 2


@dataclass(frozen=True)
class ThemeSpec:
    slug: str
    label: str
    accent: tuple[int, int, int]
    view: MapView | None = None
    wikimedia_url: str | None = None
    tile_url: str = TILE_VOYAGER
    postprocess: str = "default"


THEMES: list[ThemeSpec] = [
    ThemeSpec(
        slug="localisation-limites",
        label="Limites du parc",
        accent=(22, 101, 52),
        view=MapView(-0.92, 29.45, 9, 4, 3),
        tile_url=TILE_LIGHT,
        postprocess="boundaries",
    ),
    ThemeSpec(
        slug="milieu-physique",
        label="Relief & hydrographie",
        accent=(120, 90, 60),
        wikimedia_url=(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/"
            "Rwenzori-Virunga_Montane_Moorlands_Ecoregion_-_Relief_Map_Angle.png/"
            "960px-Rwenzori-Virunga_Montane_Moorlands_Ecoregion_-_Relief_Map_Angle.png"
        ),
        postprocess="relief",
    ),
    ThemeSpec(
        slug="biodiversite",
        label="Forêts & habitats",
        accent=(76, 130, 55),
        wikimedia_url=(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/"
            "Albertine_Rift_Montane_Forests_Ecoregion_-_Relief_Map_Angle.png/"
            "960px-Albertine_Rift_Montane_Forests_Ecoregion_-_Relief_Map_Angle.png"
        ),
        postprocess="forest",
    ),
    ThemeSpec(
        slug="population-activites",
        label="Provinces & peuplement",
        accent=(180, 70, 50),
        wikimedia_url=(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/"
            "Nord-Kivu_in_Democratic_Republic_of_the_Congo.svg/"
            "960px-Nord-Kivu_in_Democratic_Republic_of_the_Congo.svg.png"
        ),
        postprocess="admin",
    ),
    ThemeSpec(
        slug="tourisme-patrimoine",
        label="Sites & paysages",
        accent=(0, 120, 140),
        view=MapView(-1.52, 29.25, 10, 3, 2),
        tile_url=TILE_VOYAGER,
        postprocess="tourism",
    ),
    ThemeSpec(
        slug="conservation-enjeux",
        label="Aires protégées",
        accent=(16, 92, 48),
        view=MapView(-0.88, 29.42, 9, 3, 2),
        tile_url=TILE_VOYAGER,
        postprocess="conservation_osm",
    ),
    ThemeSpec(
        slug="infrastructures",
        label="Réseau routier",
        accent=(90, 90, 95),
        view=MapView(-1.05, 29.35, 8, 4, 3),
        tile_url=TILE_ROADS,
        postprocess="roads",
    ),
]


def fetch_bytes(url: str) -> bytes:
    r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=90)
    r.raise_for_status()
    return r.content


def lat_lon_to_tile(lat: float, lon: float, zoom: int) -> tuple[float, float]:
    n = 2**zoom
    x = (lon + 180.0) / 360.0 * n
    lat_rad = math.radians(lat)
    y = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    return x, y


def fetch_tile(z: int, x: int, y: int, template: str, retries: int = 4) -> Image.Image:
    url = template.format(z=z, x=x, y=y)
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            return Image.open(io.BytesIO(fetch_bytes(url))).convert("RGB")
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            time.sleep(0.5 * (attempt + 1))
    raise last_err or RuntimeError(f"tile failed: {url}")


def stitch_tiles(view: MapView, tile_url: str) -> Image.Image:
    tile_size = 256
    cx, cy = lat_lon_to_tile(view.lat, view.lon, view.zoom)
    x0, y0 = int(cx) - view.cols // 2, int(cy) - view.rows // 2
    canvas = Image.new("RGB", (view.cols * tile_size, view.rows * tile_size))
    for row in range(view.rows):
        for col in range(view.cols):
            tile = fetch_tile(view.zoom, x0 + col, y0 + row, tile_url)
            canvas.paste(tile, (col * tile_size, row * tile_size))
            time.sleep(0.12)
    return canvas


def fit_cover(img: Image.Image, size: tuple[int, int] = TARGET_SIZE) -> Image.Image:
    return ImageOps.fit(img.convert("RGB"), size, method=Image.Resampling.LANCZOS)


def park_polygon_pixels(w: int, h: int) -> list[tuple[float, float]]:
    return [(rx * w, ry * h) for rx, ry in PARK_POLYGON_REL]


def draw_park_boundary(img: Image.Image, *, fill_alpha: int = 70, outline_width: int = 4) -> Image.Image:
    w, h = img.size
    pts = park_polygon_pixels(w, h)
    overlay = img.copy()
    draw = ImageDraw.Draw(overlay, "RGBA")
    draw.polygon(pts, fill=(34, 139, 34, fill_alpha), outline=(22, 101, 52, 255), width=outline_width)
    return Image.blend(img, overlay, 0.55)


def add_accent_bar(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    """Fine barre d'accent chromatique par thème (sans texte — style geo.be)."""
    out = img.copy()
    draw = ImageDraw.Draw(out, "RGBA")
    w, h = out.size
    draw.rectangle((0, h - 5, w, h), fill=(*spec.accent, 255))
    return out


def tint(img: Image.Image, rgb: tuple[int, int, int], alpha: float) -> Image.Image:
    layer = Image.new("RGB", img.size, rgb)
    return Image.blend(img, layer, alpha)


def postprocess_boundaries(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = draw_park_boundary(img, fill_alpha=55, outline_width=5)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    return add_accent_bar(img, spec)


def postprocess_relief(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(1.12)
    img = ImageEnhance.Contrast(img).enhance(1.1)
    return add_accent_bar(img, spec)


def postprocess_forest(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = img.convert("RGB")
    img = tint(img, (40, 95, 45), 0.12)
    img = ImageEnhance.Color(img).enhance(1.15)
    return add_accent_bar(img, spec)


def postprocess_admin(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = ImageEnhance.Sharpness(img).enhance(1.2)
    img = ImageEnhance.Contrast(img).enhance(1.05)
    return add_accent_bar(img, spec)


def postprocess_tourism(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = ImageEnhance.Color(img).enhance(1.2)
    img = ImageEnhance.Brightness(img).enhance(1.04)
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")
    for cx, cy in [(0.35 * w, 0.55 * h), (0.55 * w, 0.42 * h), (0.72 * w, 0.38 * h)]:
        r = 14
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(0, 140, 160, 200), outline=(255, 255, 255, 230), width=2)
    return add_accent_bar(img, spec)


def postprocess_conservation(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = img.convert("RGB")
    img = tint(img, (25, 110, 55), 0.28)
    img = ImageEnhance.Contrast(img).enhance(1.15)
    return add_accent_bar(img, spec)


def postprocess_conservation_osm(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    img = img.convert("RGB")
    img = draw_park_boundary(img, fill_alpha=35, outline_width=3)
    img = ImageEnhance.Color(img).enhance(1.05)
    return add_accent_bar(img, spec)


def postprocess_roads(img: Image.Image, spec: ThemeSpec) -> Image.Image:
    gray = ImageOps.grayscale(img)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges = ImageEnhance.Contrast(edges).enhance(2.5)
    roads = ImageOps.invert(edges)
    base = ImageOps.grayscale(img).convert("RGB")
    combined = Image.blend(base, roads.convert("RGB"), 0.35)
    combined = ImageEnhance.Contrast(combined).enhance(1.25)
    return add_accent_bar(combined, spec)


POSTPROCESSORS: dict[str, Callable[[Image.Image, ThemeSpec], Image.Image]] = {
    "boundaries": postprocess_boundaries,
    "relief": postprocess_relief,
    "forest": postprocess_forest,
    "admin": postprocess_admin,
    "tourism": postprocess_tourism,
    "conservation": postprocess_conservation,
    "conservation_osm": postprocess_conservation_osm,
    "roads": postprocess_roads,
    "default": lambda img, spec: add_accent_bar(img, spec),
}


def save_theme(spec: ThemeSpec, img: Image.Image) -> None:
    processor = POSTPROCESSORS.get(spec.postprocess, POSTPROCESSORS["default"])
    final = fit_cover(processor(img.convert("RGB"), spec))
    path = OUT_DIR / f"{spec.slug}-carte.jpg"
    final.save(path, "JPEG", quality=90, optimize=True)
    print(f"  OK {path.name} ({path.stat().st_size // 1024} Ko)")


def render_theme(spec: ThemeSpec) -> None:
    print(f"[{spec.slug}] {spec.label}")
    if spec.wikimedia_url:
        img = Image.open(io.BytesIO(fetch_bytes(spec.wikimedia_url)))
        save_theme(spec, img)
        return
    if spec.view is None:
        raise ValueError(f"No source for {spec.slug}")
    raw = stitch_tiles(spec.view, spec.tile_url)
    save_theme(spec, raw)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    errors = 0
    for spec in THEMES:
        try:
            render_theme(spec)
        except Exception as exc:  # noqa: BLE001
            errors += 1
            print(f"  ERREUR {spec.slug}: {exc}", file=sys.stderr)
    print(f"Terminé ({len(THEMES) - errors}/{len(THEMES)} thèmes).")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
