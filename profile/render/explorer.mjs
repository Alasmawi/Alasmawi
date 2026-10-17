// "More projects" as a file listing: `ls -l ~/projects`, with a selection bar
// that walks down the rows as if someone is browsing them.

import { C, langColor } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, dot, arrow } from '../lib/svg.mjs';
import { measure } from '../lib/text.mjs';

const W = 1000;

export function explorer({ projects }) {
  const top = 92, RH = 34;
  const H = top + projects.length * RH + 56;
  const T = projects.length * 1.4;
  const o = [];
  const css = [];

  o.push(rect(0.5, 0.5, W - 1, H - 1, C.panel, { stroke: C.hair }));
  o.push(text('~/projects', { x: 30, y: 40, size: 14, face: 'mb', fill: C.bone }));
  o.push(text(`${projects.length} repositories · sorted by language`, { x: 30 + measure('~/projects  ', 'mb', 14), y: 40, size: 12, face: 'm', fill: C.muted }));
  // A grid/list switch, list selected.
  o.push(rect(W - 110, 22, 40, 26, C.panel2, { stroke: C.hair }), rect(W - 70, 22, 40, 26, C.bone));
  [0, 1, 2, 3].forEach((k) => o.push(rect(W - 98 + (k % 2) * 9, 28 + Math.floor(k / 2) * 9, 6, 6, C.muted)));
  [0, 1, 2].forEach((k) => o.push(rect(W - 59, 29 + k * 5, 18, 2, C.ink)));

  const cols = { perm: 30, lang: 158, name: 300, what: 470 };
  [['mode', cols.perm], ['language', cols.lang], ['name', cols.name], ['what it is', cols.what]].forEach(([s, x]) => o.push(label(s, x, 74, C.dim, 9.5)));
  o.push(line(20, 82, W - 20, 82, C.hair));

  // Selection bar.
  css.push(`@keyframes sel{${projects.map((_, i) => `${((i / projects.length) * 100).toFixed(2)}%{transform:translateY(${i * RH}px)}`).join('')}100%{transform:translateY(0)}}.sel{animation:sel ${T}s steps(1,end) infinite}`);
  o.push(`<g class="sel">${rect(20, top - 4, W - 40, RH, 'rgba(176,18,43,0.16)')}${rect(20, top - 4, 3, RH, C.carmine)}</g>`);

  projects.forEach((p, i) => {
    const y = top + i * RH + 18;
    o.push(`<g class="fu" style="animation-duration:.4s;${delay(0.1 + i * 0.06)}">`);
    o.push(text('drwxr-xr-x', { x: cols.perm, y, size: 12.5, face: 'm', fill: C.dim }));
    o.push(dot(cols.lang + 4, y - 4, 4, langColor(p.lang)));
    o.push(text(p.lang, { x: cols.lang + 16, y, size: 12.5, face: 'm', fill: C.soft }));
    o.push(text(p.name, { x: cols.name, y, size: 13.5, face: 'mb', fill: C.bone }));
    o.push(text(p.what, { x: cols.what, y, size: 13, face: 'b', fill: C.boneDim }));
    o.push(arrow(W - 40, y - 4, 9, C.dim, 'ne'));
    o.push('</g>');
    if (i < projects.length - 1) o.push(line(20, top + (i + 1) * RH - 4, W - 20, top + (i + 1) * RH - 4, 'rgba(239,233,221,0.06)'));
  });
  o.push(line(20, H - 40, W - 20, H - 40, C.hair));
  o.push(text('plus piscine collections in Rust, JavaScript, Go and Shell', { x: 30, y: H - 16, size: 12, face: 'm', fill: C.muted }));

  return svg({
    w: W,
    h: H,
    title: 'More projects',
    desc: projects.map((p) => `${p.name} (${p.lang}): ${p.what}`).join('. '),
    body: o.join(''),
    css: css.join(''),
  });
}
