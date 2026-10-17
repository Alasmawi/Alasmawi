// "What I do": four columns on the bone ground, like the site's focus pillars.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, delay, arrow } from '../lib/svg.mjs';
import { wrap } from '../lib/text.mjs';

export function pillars({ pillars }) {
  const W = 1000;
  const X0 = 38;
  const colW = (W - X0 * 2) / pillars.length;
  const inner = colW - 34;

  const cols = pillars.map((p, i) => {
    const x = X0 + i * colW + (i ? 20 : 0);
    const titleLines = wrap(p.title.toUpperCase(), 't', 30, inner);
    const bodyLines = wrap(p.body, 'b', 15, inner - (i ? 0 : 0));
    let y = 92;
    const parts = [];
    parts.push(text(`0${i + 1}`, { x, y: 62, size: 12, face: 'm', fill: C.carmine }));
    for (const l of titleLines) {
      parts.push(text(l, { x, y, size: 30, face: 't', fill: C.ink }));
      y += 28;
    }
    y += 12;
    for (const l of bodyLines) {
      parts.push(text(l, { x, y, size: 15, face: 'b', fill: C.inkText }));
      y += 22;
    }
    return { parts, y, x, items: p.items };
  });

  // Items line up across columns, under the tallest body.
  const itemsY = Math.max(...cols.map((c) => c.y)) + 18;
  const body = [];
  cols.forEach((c, i) => {
    const d = 0.15 + i * 0.12;
    body.push(rect(c.x, 26, 36, 4, C.carmine, { class: 'wx', style: `transform-origin:0 0;${delay(d)}` }));
    body.push(`<g class="fu" style="${delay(d + 0.05)}">${c.parts.join('')}`);
    c.items.forEach((it, j) => {
      const y = itemsY + j * 26;
      body.push(line(c.x, y - 18, c.x + inner, y - 18, C.hairInk));
      body.push(text(it, { x: c.x, y, size: 13, face: 'm', fill: C.ink }));
      body.push(arrow(c.x + inner - 8, y - 5, 9, C.carmine, 'ne'));
    });
    body.push('</g>');
    if (i) body.push(line(X0 + i * colW, 24, X0 + i * colW, itemsY + c.items.length * 26, C.hairInk));
  });
  const H = itemsY + 3 * 26 + 24;

  return svg({
    w: W,
    h: H,
    bg: C.bone,
    title: 'What I do',
    desc: pillars.map((p) => `${p.title}: ${p.body} (${p.items.join(', ')})`).join(' '),
    body: body.join(''),
  });
}
