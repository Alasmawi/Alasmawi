// The document wrapper every card goes through, plus small drawing helpers.
//
// GitHub serves README images through its camo proxy as plain <img>, so an SVG
// gets no scripts, no external fonts and no external images. What it does get:
// CSS animation, SMIL, embedded data: URIs and media queries. Everything here
// is built inside those limits.

import { readFileSync } from 'node:fs';
import { C, FACES } from './theme.mjs';
import { metrics, measure } from './text.mjs';

const FONT_DIR = new URL('../fonts/', import.meta.url);
const fontCache = new Map();
function fontData(file) {
  if (!fontCache.has(file)) fontCache.set(file, readFileSync(new URL(file, FONT_DIR)).toString('base64'));
  return fontCache.get(file);
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const n = (v) => (Number.isInteger(v) ? v : Math.round(v * 100) / 100);

/** Attribute string from an object; skips null/undefined/false. */
export const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => ` ${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${esc(typeof v === 'number' ? n(v) : v)}"`)
    .join('');

/**
 * <text> in one of the embedded faces.
 * opts: x, y, size, face ('d'|'t'|'l'|'b'|'bb'|'m'|'mb'), fill, anchor, tracking (em), cls, style, extra
 */
export function text(str, { x = 0, y = 0, size = 16, face = 'b', fill = C.bone, anchor, tracking = 0, cls = '', style, opacity, extra = {} } = {}) {
  const content = face === 'd' || face === 'l' ? String(str).toUpperCase() : String(str);
  return `<text${attrs({
    x,
    y,
    class: `${face} ${cls}`.trim(),
    fontSize: size,
    fill,
    textAnchor: anchor,
    letterSpacing: tracking ? `${n(tracking * size)}` : undefined,
    opacity,
    style,
    ...extra,
  })}>${esc(content)}</text>`;
}

/** Width of `str` as `text()` would draw it (handles the uppercase faces). */
export function textWidth(str, face, size, tracking = 0) {
  const s = face === 'd' || face === 'l' ? String(str).toUpperCase() : String(str);
  return measure(s, face, size, tracking);
}

export const rect = (x, y, w, h, fill, extra = {}) => `<rect${attrs({ x, y, width: w, height: h, fill, ...extra })}/>`;
export const line = (x1, y1, x2, y2, stroke = C.hair, w = 1, extra = {}) =>
  `<line${attrs({ x1, y1, x2, y2, stroke, strokeWidth: w, ...extra })}/>`;
export const g = (body, extra = {}) => `<g${attrs(extra)}>${body}</g>`;

/** A filled dot drawn as a shape, since the subset fonts carry no ● glyph. */
export const dot = (cx, cy, r, fill, extra = {}) => `<circle${attrs({ cx, cy, r, fill, ...extra })}/>`;

/** → drawn as a path, sized to a cap height. */
export function arrow(x, y, size, stroke, dir = 'right') {
  const s = size;
  const rot = { right: 0, down: 90, left: 180, up: 270, ne: -45 }[dir];
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${rot})"><path d="M${n(-s / 2)} 0H${n(s / 2)}M${n(s / 2 - s * 0.38)} ${n(-s * 0.36)}L${n(s / 2)} 0L${n(s / 2 - s * 0.38)} ${n(s * 0.36)}" fill="none" stroke="${stroke}" stroke-width="${n(Math.max(1.4, s / 7))}" stroke-linecap="square"/></g>`;
}

/** ✓ as a path. */
export const check = (x, y, s, stroke) =>
  `<path d="M${n(x)} ${n(y - s * 0.05)}l${n(s * 0.32)} ${n(s * 0.32)}l${n(s * 0.62)} ${n(-s * 0.7)}" fill="none" stroke="${stroke}" stroke-width="${n(Math.max(1.6, s / 6))}" stroke-linecap="square"/>`;

/**
 * Wraps a body into a complete SVG document: title/desc for screen readers,
 * only the font faces the body uses, the shared animation library, and a
 * reduced-motion switch. Animations are written so that the un-animated state
 * is the finished one — with motion off, everything is simply there.
 */
export function svg(spec) {
  return new Doc(spec);
}

/** A card before it's serialized, so cards can be stacked into one file. */
class Doc {
  constructor({ w, h, title, desc, body, css = '', bg }) {
    Object.assign(this, { w, h, title, desc: desc ?? title, body, css, bg });
  }
  toString() {
    return render(this);
  }
}

/**
 * Stacks cards vertically into one SVG. A section's header and its card ship
 * as one image, so there's no seam between them and the fonts are embedded
 * once instead of twice.
 */
export function stackDocs(docs, { title } = {}) {
  let y = 0;
  const body = docs
    .map((d) => {
      const part = `<g transform="translate(0 ${y})">${d.bg ? rect(0, 0, d.w, d.h, d.bg) : ''}${d.body}</g>`;
      y += d.h;
      return part;
    })
    .join('');
  return new Doc({
    w: Math.max(...docs.map((d) => d.w)),
    h: y,
    title: title ?? docs.map((d) => d.title).join(' · '),
    desc: docs.map((d) => d.desc).join(' '),
    body,
    css: docs.map((d) => d.css).join(''),
  });
}

function render({ w, h, title, desc, body, css, bg }) {
  const used = new Set();
  for (const m of body.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(/\s+/)) if (FACES[c]) used.add(c);
  const faces = [...used]
    .map((c) => {
      const f = metrics[FACES[c].key];
      return `@font-face{font-family:"${c}";src:url(data:font/woff2;base64,${fontData(f.file)}) format("woff2")}.${c}{font-family:"${c}",${c.startsWith('m') ? 'ui-monospace,Menlo,Consolas,monospace' : 'Arial,Helvetica,sans-serif'}}`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>${faces}${ANIM}${css}${still()}</style>
${bg ? rect(0, 0, w, h, bg) : ''}${body}
</svg>
`;
}

// `--still` renders the resting frame, for screenshots and visual checks.
const NO_MOTION = '*{animation:none!important}';
const still = () => (process.env.PROFILE_STILL ? NO_MOTION : `@media (prefers-reduced-motion:reduce){${NO_MOTION}}`);

// Shared keyframes. Each ends on the element's resting state.
const ANIM = [
  '@keyframes rise{from{transform:translateY(105%)}}',
  '@keyframes fadeIn{from{opacity:0}}',
  '@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}}',
  '@keyframes wipeX{from{transform:scaleX(0)}}',
  '@keyframes wipeY{from{transform:scaleY(0)}}',
  '@keyframes blink{50%{opacity:0}}',
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}',
  '@keyframes ring{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.2);opacity:0}}',
  '.rise{animation:rise .9s cubic-bezier(.2,.7,.1,1) both;transform-box:fill-box}',
  '.fi{animation:fadeIn .7s ease-out both}',
  '.fu{animation:fadeUp .7s cubic-bezier(.2,.7,.1,1) both;transform-box:fill-box}',
  '.wx{animation:wipeX .9s cubic-bezier(.7,0,.2,1) both;transform-box:fill-box}',
  '.wy{animation:wipeY .9s cubic-bezier(.2,.7,.1,1) both;transform-box:fill-box;transform-origin:50% 100%}',
  '.blink{animation:blink 1.1s steps(1) infinite}',
  '.pulse{animation:pulse 2.4s ease-in-out infinite}',
  '.ring{animation:ring 2.4s ease-out infinite;transform-box:fill-box;transform-origin:center}',
].join('');

/** Inline `animation-delay` style. */
export const delay = (s) => `animation-delay:${n(s)}s`;

/** A small uppercase label with the site's tracking. */
export const label = (str, x, y, fill = C.muted, size = 11, anchor) =>
  text(str, { x, y, size, face: 'l', fill, tracking: 0.14, anchor });
