// The small pieces the README is stitched from: link buttons, section headers
// and the closing footer.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, textWidth, arrow, g } from '../lib/svg.mjs';
import { wrap } from '../lib/text.mjs';

/** A flat, square button. Primary is bone on ink; the rest are outlined. */
export function button({ label: str, primary }) {
  const size = 12;
  const tw = textWidth(str, 'l', size, 0.14);
  const w = Math.ceil(tw + 64);
  const h = 46;
  const fg = primary ? C.ink : C.bone;
  const body = [
    primary ? rect(0, 0, w, h, C.bone) : rect(0.75, 0.75, w - 1.5, h - 1.5, C.ink, { stroke: 'rgba(239,233,221,0.8)', strokeWidth: 1.5 }),
    label(str, 22, h / 2 + 4.2, fg, size),
    arrow(w - 24, h / 2, 10, fg, 'ne'),
  ].join('');
  return svg({ w, h, title: str, body });
}

/**
 * A section header: a numbered label, a condensed title that rises into
 * place, and a short note on the right, over a hairline. `ground` switches it
 * between ink, bone and carmine.
 */
export function header({ n, title, note, ground = 'ink', total }) {
  const W = 1000;
  const bg = { ink: C.ink, bone: C.bone, carmine: C.carmine }[ground];
  const fg = ground === 'bone' ? C.ink : C.bone;
  const sub = ground === 'bone' ? C.inkText : ground === 'carmine' ? 'rgba(239,233,221,0.82)' : C.soft;
  const num = ground === 'ink' ? C.rose : ground === 'bone' ? C.carmine : C.bone;
  const size = 84;
  const noteLines = note ? wrap(note, 'b', 15, 330) : [];
  const H = Math.max(150, 58 + noteLines.length * 22 + 40);
  const base = H - 34;
  const body = [
    text(n, { x: 38, y: 40, size: 12, face: 'm', fill: num }),
    text(`/ ${String(total).padStart(2, '0')}`, { x: 60, y: 40, size: 12, face: 'm', fill: sub }),
    `<clipPath id="hc"><rect x="0" y="${base - size * 0.74}" width="${W}" height="${size * 0.78}"/></clipPath>`,
    g(text(title, { x: 34, y: base, size, face: 'd', fill: fg, tracking: -0.01, cls: 'rise', style: delay(0.1) }), { clipPath: 'url(#hc)' }),
    ...noteLines.map((l, i) => text(l, { x: 630, y: base - (noteLines.length - 1 - i) * 22 - 4, size: 15, face: 'b', fill: sub, cls: 'fu', style: delay(0.35 + i * 0.06) })),
    line(0, H - 0.5, W, H - 0.5, ground === 'bone' ? C.hairInk : C.hair, 1, { class: 'wx', style: `transform-origin:0 0;${delay(0.2)}` }),
  ].join('');
  return svg({ w: W, h: H, bg, title, desc: note ? `${title}. ${note}` : title, body });
}

/** Closing spread on carmine, with the build stamp. */
export function footer({ person, build }) {
  const W = 1000;
  const H = 400;
  const size = 132;
  const l1 = 'Let’s build';
  const l2 = 'something.';
  const y1 = 70 + size * 0.686;
  const y2 = y1 + size * 0.86;
  const clip = (i, y) => `<clipPath id="f${i}"><rect x="0" y="${y - size * 0.74}" width="${W}" height="${size * 0.8}"/></clipPath>`;
  const body = [
    clip(0, y1),
    clip(1, y2),
    g(text(l1, { x: 34, y: y1, size, face: 'd', fill: C.bone, cls: 'rise', style: delay(0.1) }), { clipPath: 'url(#f0)' }),
    g(text(l2, { x: 34, y: y2, size, face: 'd', fill: C.bone, cls: 'rise', style: delay(0.24) }), { clipPath: 'url(#f1)' }),
    label('contact', 38, 40, 'rgba(239,233,221,0.8)', 11),
    text(person.email, { x: 38, y: 318, size: 22, face: 'mb', fill: C.bone }),
    rect(38, 328, textWidth(person.email, 'mb', 22), 2, C.bone, { class: 'wx', style: `transform-origin:0 0;${delay(0.6)}` }),
    text('For roles or project inquiries, email me. I usually reply within a day.', { x: 38, y: 356, size: 15, face: 'b', fill: 'rgba(239,233,221,0.85)' }),
    line(0, H - 28, W, H - 28, 'rgba(239,233,221,0.25)'),
    label(`© ${build.year} ${person.first} ${person.last}`, 38, H - 10, 'rgba(239,233,221,0.8)', 10),
    text(`build ${build.stamp} · ${build.count} svgs · node profile/build.mjs`, { x: W - 30, y: H - 10, size: 11, face: 'm', fill: 'rgba(239,233,221,0.7)', anchor: 'end' }),
  ].join('');
  return svg({ w: W, h: H, bg: C.carmine, title: 'Let’s build something.', desc: `Contact: ${person.email}`, body });
}
