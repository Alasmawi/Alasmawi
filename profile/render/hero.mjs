// The opening spread, after the site's hero: the name set huge in condensed
// Archivo across an ink ground and a carmine panel, portrait in the panel.

import { readFileSync } from 'node:fs';
import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, dot, label, delay, textWidth, g, esc } from '../lib/svg.mjs';
import { wrap } from '../lib/text.mjs';

const W = 1000;
const H = 480;
const PANEL_X = 652;
const portrait = readFileSync(new URL('../media/portrait.webp', import.meta.url)).toString('base64');

// Nav labels set right to left from the edge, the first one marked active.
function nav(items) {
  let x = W - 30;
  const out = [];
  const pos = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const w = textWidth(items[i], 'l', 11, 0.14);
    pos[i] = x - w;
    out.push(label(items[i], x - w, 38, i === 0 ? C.bone : 'rgba(239,233,221,0.78)', 11));
    x -= w + 30;
  }
  out.push(rect(pos[0], 52, textWidth(items[0], 'l', 11, 0.14), 2, C.bone));
  return out.join('');
}

export function hero({ person, build }) {
  const size = 172;
  const lh = size * 0.86;
  const y1 = 92 + size * 0.686;
  const y2 = y1 + lh;

  // Each name line rises out of its own clip, one after the other.
  const nameLine = (word, y, i) => {
    const top = y - size * 0.74;
    return `<clipPath id="nl${i}"><rect x="0" y="${top}" width="${W}" height="${size * 0.8}"/></clipPath>` +
      g(text(word, { x: 36, y, size, face: 'd', fill: C.bone, tracking: -0.01, cls: 'rise', style: delay(0.25 + i * 0.14) }), { clipPath: `url(#nl${i})` });
  };

  // A ruler down the panel's edge, like the scale on an instrument.
  let ticks = '';
  for (let y = 70; y < H - 20; y += 10) {
    const long = (y - 70) % 50 === 0;
    ticks += line(PANEL_X, y, PANEL_X + (long ? 14 : 7), y, 'rgba(239,233,221,0.35)', 1);
  }

  const lines = wrap(person.line, 'b', 20, 520);
  const lead = lines.map((l, i) => text(l, { x: 38, y: 404 + i * 28, size: 20, face: 'b', fill: C.bone, cls: 'fu', style: delay(0.9 + i * 0.08) })).join('');

  const status = 'Open to product roles';
  const statusX = 38 + 22;
  const meta = `${person.place} · ${person.tz}`;

  const body = [
    rect(PANEL_X, 0, W - PANEL_X, H, C.carmine, { class: 'wx', style: 'transform-origin:100% 0' }),
    `<g class="fi" style="${delay(0.7)}">${ticks}</g>`,
    // Portrait: grayscale, sitting on the bottom edge of the panel like the site's.
    `<image class="fu" style="${delay(0.85)}" x="${W - 300}" y="${H - 360}" width="300" height="360" preserveAspectRatio="xMidYMax meet" href="data:image/webp;base64,${portrait}"/>`,
    // Top bar.
    label('alasmawi.dev', 38, 38, C.bone, 12),
    nav(['work', 'experience', 'stack', 'telemetry']),
    line(0, 58, W, 58, C.hair),
    // Coordinates, in the panel's corner.
    text('26.2285° N  50.5860° E', { x: W - 30, y: 84, size: 11, face: 'm', fill: 'rgba(239,233,221,0.8)', anchor: 'end', cls: 'fi', style: delay(1.1) }),
    text(`build ${build.date}`, { x: W - 30, y: 102, size: 11, face: 'm', fill: 'rgba(239,233,221,0.55)', anchor: 'end', cls: 'fi', style: delay(1.2) }),
    nameLine(person.first, y1, 0),
    nameLine(person.last, y2, 1),
    lead,
    // Status: a live dot with a ring, the label, then where.
    `<g class="fi" style="${delay(1.15)}">`,
    dot(44, 448, 4.5, C.rose, { class: 'ring' }),
    dot(44, 448, 4.5, C.rose),
    label(status, statusX, 452, C.bone, 11),
    text(meta, { x: statusX + textWidth(status, 'l', 11, 0.14) + 18, y: 452, size: 12, face: 'm', fill: C.muted }),
    `</g>`,
  ].join('');

  return svg({
    w: W,
    h: H,
    bg: C.ink,
    title: `${person.first} ${person.last}`,
    desc: `${person.first} ${person.last}. ${person.line} Based in ${person.place}.`,
    body,
  });
}
