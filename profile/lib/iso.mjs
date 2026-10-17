// Isometric projection and flat-shaded prisms. No gradients: each face is
// one flat colour, the light coming from the upper left.

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const r = (v) => Math.round(v * 100) / 100;

/** Grid (gx, gy, z) → screen (x, y), around an origin. */
export const project = (ox, oy) => (gx, gy, z = 0) => [r(ox + (gx - gy) * COS), r(oy + (gx + gy) * SIN - z)];

/** Darken or lighten a #rrggbb by factor (0.7 = 30% darker). */
export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

const pts = (a) => a.map((p) => p.join(',')).join(' ');

/**
 * A box with its footprint at (gx, gy), size (w, d), height h. Returns the
 * three visible faces; `top`, `left` and `right` are colours.
 */
export function box(P, gx, gy, w, d, h, { top, left, right, stroke = 'none', sw = 1, z = 0 }) {
  const A = P(gx, gy, z + h), B = P(gx + w, gy, z + h), Cc = P(gx + w, gy + d, z + h), D = P(gx, gy + d, z + h);
  const B0 = P(gx + w, gy, z), C0 = P(gx + w, gy + d, z), D0 = P(gx, gy + d, z);
  const s = stroke === 'none' ? '' : ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  return (
    (h > 0 ? `<polygon points="${pts([D, Cc, C0, D0])}" fill="${left}"${s}/>` + `<polygon points="${pts([Cc, B, B0, C0])}" fill="${right}"${s}/>` : '') +
    `<polygon points="${pts([A, B, Cc, D])}" fill="${top}"${s}/>`
  );
}
