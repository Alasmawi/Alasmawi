"""Rebuilds profile/fonts and profile/data/metrics.json.

The SVGs embed their own fonts, because an <img> on GitHub can't load any.
Archivo is variable; each style the site uses (display, title, label, text)
is pinned to a static instance and cut down to ASCII plus a few symbols,
which brings each one to about 6 KB.

    pip install fonttools brotli
    python profile/tools/fonts.py <archivo-latin-wdth-normal.woff2> <jetbrains-mono files dir>
"""
import json, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "fonts")
EXTRA = [0xB7, 0xD7, 0xB0, 0x2013, 0x2014, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026,
         0x2190, 0x2191, 0x2192, 0x2193, 0x25CF, 0x2713, 0x25B8, 0x276F,
         0x2500, 0x2502, 0x250C, 0x2510, 0x2514, 0x2518, 0x251C, 0x2524, 0x2588]
UNICODES = list(range(0x20, 0x7F)) + EXTRA

# key: (wdth, wght) — the same pairs as .display, .display-sm, .label and body text on alasmawi.dev
ARCHIVO = {"d": (62, 900), "t": (68, 800), "l": (118, 500), "b": (100, 400), "bb": (100, 600)}
FILES = {"d": "archivo-display", "t": "archivo-title", "l": "archivo-label",
         "b": "archivo-text", "bb": "archivo-text-bold", "m": "mono", "mb": "mono-bold"}


def cut(font, out):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga"]
    opts.name_IDs = []
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(font)
    font.flavor = "woff2"
    font.save(out)


def build(archivo, mono_dir):
    for key, (wdth, wght) in ARCHIVO.items():
        f = instantiateVariableFont(TTFont(archivo), {"wdth": wdth, "wght": wght})
        cut(f, os.path.join(OUT, FILES[key] + ".woff2"))
    for key, w in (("m", 400), ("mb", 700)):
        cut(TTFont(os.path.join(mono_dir, f"jetbrains-mono-latin-{w}-normal.woff2")),
            os.path.join(OUT, FILES[key] + ".woff2"))


def metrics():
    data = {}
    for key, name in FILES.items():
        f = TTFont(os.path.join(OUT, name + ".woff2"))
        upm = f["head"].unitsPerEm
        hmtx, cmap = f["hmtx"], f.getBestCmap()
        data[key] = {
            "file": name + ".woff2",
            "ascent": f["hhea"].ascent / upm,
            "cap": getattr(f["OS/2"], "sCapHeight", 0.7 * upm) / upm,
            "adv": {chr(cp): round(hmtx[g][0] / upm, 4) for cp, g in cmap.items()},
        }
    with open(os.path.join(ROOT, "data", "metrics.json"), "w") as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    if len(sys.argv) == 3:
        build(sys.argv[1], sys.argv[2])
    metrics()
