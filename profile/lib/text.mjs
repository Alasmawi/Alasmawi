// Text measurement from the embedded fonts' own advance widths, so layout and
// wrapping are computed rather than guessed. Kerning is ignored; it moves a
// line by a pixel or two at most at these sizes.

import { readFileSync } from 'node:fs';

const METRICS = JSON.parse(readFileSync(new URL('../data/metrics.json', import.meta.url), 'utf8'));
const missing = new Set();

export const metrics = METRICS;

/** Width in px of `str` set in font `key` at `size`, with optional letter-spacing in em. */
export function measure(str, key, size, tracking = 0) {
  const adv = METRICS[key].adv;
  let w = 0;
  for (const ch of str) {
    const a = adv[ch];
    if (a === undefined) {
      if (!missing.has(`${key}:${ch}`)) {
        missing.add(`${key}:${ch}`);
        console.warn(`  ! glyph ${JSON.stringify(ch)} not in font "${key}", width estimated`);
      }
      w += 0.6;
    } else w += a;
  }
  const n = [...str].length;
  return w * size + Math.max(0, n - 1) * tracking * size;
}

/** Greedy word wrap to `maxWidth`. Returns an array of lines. */
export function wrap(str, key, size, maxWidth, tracking = 0) {
  const words = str.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next, key, size, tracking) <= maxWidth || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Largest size ≤ `max` at which `str` fits in `width`. */
export function fit(str, key, width, max, tracking = 0) {
  const w = measure(str, key, 1, tracking);
  return Math.min(max, Math.floor((width / w) * 10) / 10);
}
