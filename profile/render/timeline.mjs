// Experience on a 2026 month axis, and education as parallel tracks across
// years. Both are drawn from dates, against the build date, so the "today"
// line and any ongoing bar move forward every time the Action runs.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, dot } from '../lib/svg.mjs';

const W = 1000;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const fmt = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;

export function experience({ roles, today }) {
  const year = 2026;
  const X0 = 300, X1 = 962;
  const y0 = Date.UTC(year, 0, 1), y1 = Date.UTC(year + 1, 0, 1);
  const X = (t) => X0 + ((Math.min(Math.max(t, y0), y1) - y0) / (y1 - y0)) * (X1 - X0);
  const now = today.getTime();
  const H = 120 + roles.length * 96;
  const o = [];

  o.push(text(String(year), { x: 34, y: 112, size: 112, face: 'd', fill: C.bone, cls: 'fu' }));
  o.push(label('two internships', 38, 146, C.muted, 10));
  // Month grid.
  MONTHS.forEach((m, i) => {
    const x = X(Date.UTC(year, i, 1));
    o.push(line(x, 46, x, H - 24, 'rgba(239,233,221,0.07)'));
    o.push(label(m, x + 4, 40, C.dim, 9.5));
  });
  o.push(line(X0, 50, X1, 50, C.hair));

  roles.forEach((r, i) => {
    const y = 104 + i * 96;
    const s = Date.parse(r.start);
    const e = r.end ? Date.parse(r.end) : now;
    const x1 = X(s), x2 = X(e);
    const d = 0.3 + i * 0.25;
    o.push(rect(x1, y, x2 - x1, 12, r.color, { class: 'wx', style: `transform-origin:0 0;${delay(d)}` }));
    if (!r.end) {
      // Ongoing: the bar's end breathes.
      o.push(rect(x2 - 2, y - 4, 4, 20, r.color, { class: 'pulse' }));
    }
    o.push(`<g class="fu" style="${delay(d + 0.3)}">`);
    o.push(label(r.role, x1, y - 30, C.bone, 11));
    o.push(text(r.org, { x: x1, y: y - 12, size: 13, face: 'b', fill: C.soft }));
    const range = `${fmt(new Date(s))} — ${r.end ? fmt(new Date(e)) : 'present'}`;
    o.push(text(range, { x: x1, y: y + 34, size: 11.5, face: 'm', fill: C.muted }));
    o.push(`<path d="M${x1 + 2} ${y + 44}v10h10" fill="none" stroke="${C.dim}"/>`);
    o.push(text(`built ${r.built}`, { x: x1 + 18, y: y + 58, size: 12, face: 'mb', fill: r.end ? C.amber : C.rose }));
    o.push('</g>');
  });

  // Today.
  const tx = X(now);
  o.push(`<g class="fi" style="${delay(1)}">`);
  o.push(line(tx, 56, tx, H - 20, C.bone, 1, { strokeDasharray: '2 4' }));
  o.push(rect(tx - 34, H - 22, 68, 18, C.bone));
  o.push(label(`today`, tx, H - 9, C.ink, 9.5, 'middle'));
  o.push('</g>');

  return svg({
    w: W,
    h: H + 6,
    bg: C.ink,
    title: `Experience, ${year}`,
    desc: roles.map((r) => `${r.role}, ${r.org}, ${r.start} to ${r.end ?? 'present'}`).join('. '),
    body: o.join(''),
  });
}

export function education({ schools, today }) {
  // Headline across the top, tracks below on their own axis, totals in a
  // right-hand column so nothing runs into the bars.
  const Y0 = 2022, Y1 = 2027;
  const X0 = 38, X1 = 820;
  const X = (y) => X0 + ((y - Y0) / (Y1 - Y0)) * (X1 - X0);
  const top = 150;
  const H = top + schools.length * 92 + 70;
  const o = [];
  o.push(label('education', 38, 42, C.carmine, 11));
  o.push(`<clipPath id="ec"><rect x="0" y="${96 - 52 * 0.74}" width="${W}" height="${52 * 0.8}"/></clipPath>`);
  o.push(`<g clip-path="url(#ec)">${text('Degree and program, in parallel', { x: 36, y: 96, size: 52, face: 'd', fill: C.ink, cls: 'rise' })}</g>`);
  o.push(text('A Computer Science degree on the cloud computing track, with a project-based full-stack program taken alongside its last two years.', { x: 38, y: 124, size: 14, face: 'b', fill: C.inkText }));

  const axisY = top;
  for (let y = Y0; y <= Y1; y++) {
    o.push(line(X(y), axisY + 8, X(y), H - 44, C.hairInk));
    if (y < Y1) o.push(text(String(y), { x: X(y) + 6, y: axisY + 22, size: 11, face: 'm', fill: C.inkText }));
  }
  // Overlap band.
  o.push(rect(X(2024.7), axisY + 30, X(2026.5) - X(2024.7), H - 74 - axisY - 30, 'rgba(176,18,43,0.07)'));
  o.push(label('overlap', X(2024.7) + 8, axisY + 46, C.carmine, 9.5));

  schools.forEach((s, i) => {
    const y = axisY + 76 + i * 92;
    const start = s.from + 0.7, end = s.to + 0.5;
    const d = 0.3 + i * 0.25;
    o.push(label(s.short, X(start), y - 26, C.ink, 11));
    o.push(text(`${s.degree} · ${s.track}`, { x: X(start), y: y - 9, size: 12, face: 'm', fill: C.inkText }));
    if (s.phases) {
      const total = s.phases.reduce((a, p) => a + p.months, 0);
      let x = X(start);
      const span = X(end) - x;
      s.phases.forEach((p, j) => {
        const w = (p.months / total) * span;
        o.push(rect(x, y, w - 2, 18, j ? s.color : '#0f8c88', { class: 'wx', style: `transform-origin:0 0;${delay(d + j * 0.3)}` }));
        o.push(text(p.name, { x: x + 7, y: y + 13, size: 10.5, face: 'mb', fill: j ? C.ink : C.bone, cls: 'fi', style: delay(d + 0.6) }));
        x += w;
      });
    } else {
      o.push(rect(X(start), y, X(end) - X(start), 18, s.color, { class: 'wx', style: `transform-origin:0 0;${delay(d)}` }));
    }
    // Totals column.
    o.push(text(s.stat[0], { x: 862, y: y + 16, size: 30, face: 't', fill: C.ink }));
    o.push(label(s.stat[1], 862, y + 32, C.inkText, 9));
    o.push(dot(850, y + 9, 4, s.color));
  });

  const ty = today.getUTCFullYear() + today.getUTCMonth() / 12 + today.getUTCDate() / 365;
  o.push(`<g class="fi" style="${delay(1)}">${line(X(ty), axisY + 30, X(ty), H - 40, C.ink, 1, { strokeDasharray: '2 4' })}${rect(X(ty) - 30, H - 40, 60, 18, C.ink)}${label('today', X(ty), H - 27, C.bone, 9.5, 'middle')}</g>`);

  return svg({
    w: W,
    h: H,
    bg: C.bone,
    title: 'Education',
    desc: schools.map((s) => `${s.school}: ${s.degree}, ${s.track}, ${s.from} to ${s.to}`).join('. '),
    body: o.join(''),
  });
}
