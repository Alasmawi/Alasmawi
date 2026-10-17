// The stack on the bone ground: brand marks from simple-icons (CC0) in ink,
// in flat square tiles, and text chips for things with no mark (AWS
// services, identity tooling).

import { readFileSync } from 'node:fs';
import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay } from '../lib/svg.mjs';
import { measure } from '../lib/text.mjs';

const ICONS = JSON.parse(readFileSync(new URL('../data/icons.json', import.meta.url), 'utf8'));
const W = 1000;

export function stack({ groups }) {
  const X0 = 220, X1 = 962, TILE = 56, GAP = 18;
  const o = [];
  let y = 34;
  let k = 0;
  for (const grp of groups) {
    const rowTop = y;
    o.push(label(grp.group, 38, y + 22, C.carmine, 11));
    let x = X0;
    let rowH = 0;
    for (const id of grp.icons ?? []) {
      const ic = ICONS[id];
      if (x + TILE > X1) { x = X0; y += TILE + 34; }
      const s = TILE / 24 * 0.5;
      o.push(`<g class="fu" style="animation-duration:.5s;${delay(0.1 + k++ * 0.025)}">`);
      o.push(rect(x + 0.5, y + 0.5, TILE - 1, TILE - 1, C.bone, { stroke: 'rgba(14,15,18,0.22)' }));
      o.push(`<path transform="translate(${x + TILE / 2 - 12 * s} ${y + TILE / 2 - 12 * s}) scale(${s})" d="${ic.path}" fill="${C.ink}"/>`);
      const name = ic.title.replace('GNU Bash', 'Bash').replace('Node.js', 'Node').replace('GitHub Actions', 'Actions');
      o.push(text(name, { x: x + TILE / 2, y: y + TILE + 15, size: 10, face: 'm', fill: C.inkText, anchor: 'middle' }));
      o.push('</g>');
      x += TILE + GAP;
      rowH = TILE + 26;
    }
    if (grp.chips) {
      let besideIcons = Boolean(grp.icons?.length);
      if (besideIcons) x += 6;
      for (const c of grp.chips) {
        const w = measure(c, 'm', 12.5) + 26;
        if (x + w > X1) { x = X0; y += besideIcons ? TILE + 34 : 44; besideIcons = false; rowH = 0; }
        const cy = besideIcons ? y + TILE / 2 - 17 : y;
        o.push(`<g class="fu" style="animation-duration:.5s;${delay(0.1 + k++ * 0.025)}">`);
        o.push(rect(x + 0.5, cy + 0.5, w, 34, 'none', { stroke: 'rgba(14,15,18,0.3)' }));
        o.push(text(c, { x: x + 13, y: cy + 22, size: 12.5, face: 'm', fill: C.ink }));
        o.push('</g>');
        x += w + 10;
        rowH = Math.max(rowH, 44);
      }
    }
    y += rowH + 22;
    o.push(line(38, y - 10, X1, y - 10, C.hairInk));
    void rowTop;
  }
  const H = y + 4;
  return svg({
    w: W,
    h: H,
    bg: C.bone,
    title: 'Stack',
    desc: groups.map((g) => `${g.group}: ${[...(g.icons ?? []).map((i) => ICONS[i].title), ...(g.chips ?? [])].join(', ')}`).join('. '),
    body: o.join(''),
  });
}
