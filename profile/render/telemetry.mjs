// Live numbers, redrawn by the scheduled Action: a KPI board, language share
// and weekday rhythm, and the last year of contributions as an isometric city.

import { C, langColor } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, dot } from '../lib/svg.mjs';
import { measure } from '../lib/text.mjs';
import { project as iso, box, shade } from '../lib/iso.mjs';

const W = 1000;
const fmtN = (v) => v.toLocaleString('en-US');
const ago = (from, to) => {
  const m = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth();
  return `${Math.floor(m / 12)}y ${m % 12}m`;
};

/**
 * A number that counts up to `v`: intermediate frames flash past, and the
 * final value is the resting state (so it's correct with motion off).
 */
function counter(v, x, y, size, fill, t0, id, css) {
  const frames = 7;
  let out = '';
  const dur = 1.1;
  for (let f = 1; f < frames; f++) {
    const val = Math.round((v * f) / frames);
    const a = t0 + ((f - 1) / frames) * dur, b = t0 + (f / frames) * dur;
    const k = `${id}f${f}`;
    css.push(`@keyframes ${k}{0%{opacity:0}${(a / (t0 + dur)) * 100}%{opacity:0}${(a / (t0 + dur)) * 100 + 0.01}%{opacity:1}${(b / (t0 + dur)) * 100}%{opacity:1}${(b / (t0 + dur)) * 100 + 0.01}%,100%{opacity:0}}.${k}{opacity:0;animation:${k} ${t0 + dur}s linear both}`);
    out += text(fmtN(val), { x, y, size, face: 't', fill, cls: k });
  }
  css.push(`@keyframes ${id}{0%,99%{opacity:0}100%{opacity:1}}.${id}{animation:${id} ${t0 + dur}s linear both}`);
  out += text(fmtN(v), { x, y, size, face: 't', fill, cls: id });
  return out;
}

export function telemetry({ gh, today }) {
  const css = [];
  const o = [];
  const kpis = [
    ['contributions', gh.lastYear, 'last 12 months'],
    ['lifetime', gh.lifetime, `since ${gh.createdAt.slice(0, 4)}`],
    ['commits', gh.commits, 'last 12 months'],
    ['pull requests', gh.prs, 'last 12 months'],
    ['public repos', gh.repos, `${gh.stars} star${gh.stars === 1 ? '' : 's'}`],
    ['current streak', gh.streak.current, 'days'],
    ['longest streak', gh.streak.longest, 'days, last 12 months'],
    ['active days', gh.activeDays, `of the last ${gh.weeks.flat().length}`],
  ];
  const X0 = 20, cw = (W - 40) / 4, ch = 116;
  kpis.forEach(([name, v, sub], i) => {
    const x = X0 + (i % 4) * cw, y = 20 + Math.floor(i / 4) * ch;
    o.push(rect(x + 0.5, y + 0.5, cw - 10, ch - 10, C.panel, { stroke: C.hair }));
    if (i === 0) o.push(rect(x, y, 3, ch - 10, C.carmine));
    o.push(label(name, x + 18, y + 28, C.muted, 10));
    o.push(counter(v, x + 16, y + 78, 46, i === 0 ? C.bone : C.boneDim, 0.2 + i * 0.08, `k${i}`, css));
    o.push(text(sub, { x: x + 18, y: y + 96, size: 11, face: 'm', fill: C.dim }));
  });

  // Language share, by bytes across public repos.
  let y = 20 + 2 * ch + 24;
  o.push(label('languages · share of code by bytes', X0 + 2, y, C.muted, 10));
  y += 14;
  const langs = gh.languages.slice(0, 8);
  const rest = 1 - langs.reduce((a, l) => a + l.share, 0);
  const segs = rest > 0.001 ? [...langs, { name: 'Other', share: rest }] : langs;
  let x = X0;
  const BW = W - 40;
  segs.forEach((l, i) => {
    const w = l.share * BW;
    o.push(rect(x, y, Math.max(0, w - 2), 14, l.name === 'Other' ? C.dim : langColor(l.name), { class: 'wx', style: `transform-origin:0 0;${delay(0.6 + i * 0.07)}` }));
    x += w;
  });
  y += 40;
  let lx = X0;
  segs.forEach((l, i) => {
    const pct = `${(l.share * 100).toFixed(1)}%`;
    const w = 14 + measure(l.name, 'm', 12) + 8 + measure(pct, 'm', 12) + 26;
    if (lx + w > W - 20) { lx = X0; y += 22; }
    o.push(rect(lx, y - 9, 9, 9, l.name === 'Other' ? C.dim : langColor(l.name)));
    o.push(text(l.name, { x: lx + 15, y, size: 12, face: 'm', fill: C.bone }));
    o.push(text(pct, { x: lx + 15 + measure(l.name, 'm', 12) + 8, y, size: 12, face: 'm', fill: C.muted }));
    lx += w;
  });

  // Weekday rhythm.
  y += 40;
  o.push(label('when the work lands · contributions by weekday', X0 + 2, y, C.muted, 10));
  y += 16;
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const max = Math.max(...gh.byWeekday, 1);
  const dw = (W - 40) / 7;
  gh.byWeekday.forEach((v, i) => {
    const bh = Math.max(2, (v / max) * 70);
    const bx = X0 + i * dw;
    o.push(rect(bx, y + 70 - bh, dw - 12, bh, v === max ? C.carmine : '#2a2c33', { class: 'wy', style: delay(0.9 + i * 0.05) }));
    o.push(label(days[i], bx, y + 88, v === max ? C.rose : C.dim, 9.5));
    o.push(text(String(v), { x: bx + dw - 16, y: y + 88, size: 11, face: 'm', fill: C.muted, anchor: 'end' }));
  });
  y += 106;
  o.push(line(X0, y, W - 20, y, C.hair));
  y += 22;
  const fetched = new Date(gh.fetchedAt);
  o.push(dot(X0 + 5, y - 4, 3.5, gh.source === 'live' ? C.rose : C.amber, { class: 'pulse' }));
  o.push(text(`synced ${gh.fetchedAt.slice(0, 16).replace('T', ' ')} UTC · graphql api · ${gh.source} · account age ${ago(new Date(gh.createdAt), today)} · ${gh.followers} followers`, { x: X0 + 18, y, size: 11.5, face: 'm', fill: C.muted }));
  void fetched;
  const H = y + 22;

  return svg({
    w: W,
    h: H,
    bg: C.ink,
    title: 'GitHub telemetry',
    desc: `${gh.lastYear} contributions in the last 12 months, ${gh.lifetime} lifetime, ${gh.commits} commits, ${gh.prs} pull requests, ${gh.repos} public repositories. Current streak ${gh.streak.current} days, longest ${gh.streak.longest}. Top languages: ${langs.slice(0, 5).map((l) => `${l.name} ${(l.share * 100).toFixed(0)}%`).join(', ')}.`,
    body: o.join(''),
    css: css.join(''),
  });
}

/** The last year of contributions as an isometric city, one tower per day. */
export function city({ gh }) {
  const weeks = gh.weeks;
  const S = 15; // cell
  const P = iso(40 + 7 * S * 0.866, 120);
  const max = Math.max(1, ...weeks.flat().map((d) => d.n));
  const ramp = ['#4a1019', '#7a1222', C.carmine, C.rose];
  const level = (n) => (n === 0 ? -1 : Math.min(3, Math.floor((Math.sqrt(n) / Math.sqrt(max)) * 3.999)));
  const o = [];
  const css = [];
  // Painter's order: back to front, by gx + gy.
  const cells = [];
  weeks.forEach((wk, wi) => wk.forEach((d) => cells.push({ ...d, gx: wi, gy: d.wd })));
  cells.sort((a, b) => a.gx + a.gy - (b.gx + b.gy) || a.gy - b.gy);
  for (const c of cells) {
    const lv = level(c.n);
    const h = c.n ? 5 + (Math.sqrt(c.n) / Math.sqrt(max)) * 78 : 0;
    const col = lv < 0 ? '#1b1d23' : ramp[lv];
    const faces = { top: lv < 0 ? '#1b1d23' : shade(col, 1.18), left: shade(col, 0.7), right: shade(col, 0.5), stroke: lv < 0 ? 'rgba(239,233,221,0.05)' : 'none', sw: 0.6 };
    const b = box(P, c.gx * S + 1, c.gy * S + 1, S - 2, S - 2, h, faces);
    o.push(c.n ? `<g class="wy" style="${delay(0.2 + c.gx * 0.018)}">${b}</g>` : b);
  }
  // Callouts.
  const busy = cells.find((c) => c.date === gh.busiest.date);
  const bh = 5 + (Math.sqrt(busy.n) / Math.sqrt(max)) * 78;
  const [bx, by] = P(busy.gx * S + S / 2, busy.gy * S + S / 2, bh);
  o.push(`<g class="fi" style="${delay(1.6)}">${line(bx, by - 4, bx, by - 54, C.bone, 1)}${dot(bx, by - 2, 2.5, C.bone)}${text(`busiest day · ${busy.n}`, { x: bx + 6, y: by - 58, size: 11.5, face: 'mb', fill: C.bone })}${text(busy.date, { x: bx + 6, y: by - 44, size: 11, face: 'm', fill: C.muted })}</g>`);

  const W2 = W;
  const H2 = 600;
  // Headline in the empty upper-right triangle.
  o.push(text(fmtN(gh.lastYear), { x: W2 - 40, y: 108, size: 92, face: 'd', fill: C.bone, anchor: 'end', cls: 'fu' }));
  o.push(label('contributions in the last year', W2 - 42, 134, C.muted, 10, 'end'));
  // Legend, lower left.
  const ly = H2 - 40;
  o.push(label('less', 40, ly, C.dim, 9.5));
  ['#1b1d23', ...ramp].forEach((c, i) => o.push(rect(84 + i * 18, ly - 10, 12, 12, c)));
  o.push(label('more', 84 + 5 * 18 + 4, ly, C.dim, 9.5));
  const first = weeks[0][0].date, last = weeks.at(-1).at(-1).date;
  o.push(text(`${first} → ${last}`.replace('→', '-'), { x: 40, y: ly + 22, size: 11, face: 'm', fill: C.dim }));

  return svg({
    w: W2,
    h: H2,
    bg: C.ink,
    title: 'Contribution city',
    desc: `The last year of GitHub contributions as an isometric city, one tower per day. ${gh.lastYear} contributions, busiest day ${busy.date} with ${busy.n}.`,
    body: o.join(''),
    css: css.join(''),
  });
}
