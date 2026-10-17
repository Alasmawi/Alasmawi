// "Five ways to ship": the same backend as five isometric platforms climbing
// to the upper right. The three services (gateway, inventory API, billing)
// sit on every rung, because it is the same system each time. A highlight
// sweeps up the rungs and a packet hops from one to the next.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, dot, check } from '../lib/svg.mjs';
import { project as iso, box, shade } from '../lib/iso.mjs';

const W = 1000;
const H = 570;

const RUNG = 124; // grid distance between rungs
const A = 96; // platform footprint
const height = (i) => 22 + i * 30;

/**
 * Projection fitted to a box: project every corner once at unit scale, then
 * scale and shift so the whole ladder sits inside (x0, y0)–(x1, y1).
 */
function fitted(n, [x0, y0, x1, y1]) {
  const raw = iso(0, 0);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const gy = -i * RUNG;
    for (const [gx, dy] of [[0, 0], [A, 0], [A, A], [0, A]]) for (const z of [0, height(i) + 30]) pts.push(raw(gx, gy + dy, z));
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [mx, Mx, my, My] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((x1 - x0) / (Mx - mx), (y1 - y0) / (My - my));
  const ox = x0 + ((x1 - x0) - (Mx - mx) * k) / 2 - mx * k;
  const oy = y0 + ((y1 - y0) - (My - my) * k) / 2 - my * k;
  return { k, P: (gx, gy, z = 0) => raw(gx, gy, z).map((v, j) => Math.round((v * k + (j ? oy : ox)) * 100) / 100) };
}

export function ladder({ steps }) {
  const { P: P0, k } = fitted(steps.length, [330, 40, 975, 480]);
  // Heights are in screen units, so they scale with the fit too.
  const P = (gx, gy, z = 0) => P0(gx, gy, z);
  const step = RUNG;
  const T = 10; // sweep period
  const o = [];
  const css = [];

  // Floor grid.
  for (let i = -1; i <= 5; i++) {
    const [x1, y1] = P(-30, -i * step + A + 10);
    const [x2, y2] = P(A + 40, -i * step + A + 10);
    o.push(line(x1, y1, x2, y2, 'rgba(239,233,221,0.05)'));
  }
  for (let j = 0; j <= 4; j++) {
    const [x1, y1] = P(-30 + j * 40, A + 140);
    const [x2, y2] = P(-30 + j * 40, -4.6 * step);
    o.push(line(x1, y1, x2, y2, 'rgba(239,233,221,0.05)'));
  }

  const tops = [];
  // Farthest first, so nearer rungs paint over it.
  for (let i = steps.length - 1; i >= 0; i--) {
    const gy = -i * step;
    const h = height(i);
    const base = { top: '#2a2c33', left: '#1b1d23', right: '#15171c', stroke: 'rgba(239,233,221,0.22)' };
    const hi = { top: C.carmine, left: shade(C.carmine, 0.62), right: shade(C.carmine, 0.45), stroke: 'rgba(239,233,221,0.5)' };
    const id = `lh${i}`;
    const a = (i / steps.length) * 100, b = ((i + 1) / steps.length) * 100;
    css.push(`@keyframes ${id}{0%,${a}%{opacity:0}${a + 0.5}%,${b}%{opacity:1}${b + 0.5}%,100%{opacity:0}}.${id}{opacity:0;animation:${id} ${T}s steps(1,end) infinite}`);
    o.push(`<g class="fu" style="${delay(0.15 + (steps.length - 1 - i) * 0.08)}">`);
    o.push(box(P, 0, gy, A, A, h, base));
    o.push(`<g class="${id}">${box(P, 0, gy, A, A, h, hi)}</g>`);
    // Three service cubes on top: gateway, inventory, billing.
    [[C.bone, 12], [C.soft, 40], [C.amber, 68]].forEach(([c, off]) => {
      o.push(box(P, off, gy + 34, 16, 16, 14, { top: c, left: shade(c, 0.62), right: shade(c, 0.45), z: h }));
    });
    // The rung number on the platform's front face.
    const [nx, ny] = P(A, gy + A * 0.5, h * 0.5);
    o.push(text(steps[i].n, { x: nx - 18 * k, y: ny + 4, size: 12, face: 'mb', fill: 'rgba(239,233,221,0.6)', anchor: 'middle' }));
    o.push('</g>');
    tops[i] = { at: P(A / 2, gy + A / 2, h + 14), h, gy };
  }

  // Packet: hops up the rungs on the sweep's beat.
  const hop = tops.map((t) => t.at);
  let d = `M${hop[0][0]} ${hop[0][1] - 10}`;
  for (let i = 1; i < hop.length; i++) {
    const [x0, y0] = hop[i - 1], [x1, y1] = hop[i];
    d += ` Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 70} ${x1} ${y1 - 10}`;
  }
  o.push(`<path d="${d}" fill="none" stroke="rgba(234,95,112,0.45)" stroke-width="1.2" stroke-dasharray="3 5"/>`);
  o.push(`<rect x="-5" y="-5" width="10" height="10" fill="${C.rose}"><animateMotion dur="${T}s" repeatCount="indefinite" path="${d}" keyPoints="0;0;0.25;0.25;0.5;0.5;0.75;0.75;1;1" keyTimes="0;0.16;0.2;0.36;0.4;0.56;0.6;0.76;0.8;1" calcMode="spline" keySplines="0 0 1 1;.5 0 .5 1;0 0 1 1;.5 0 .5 1;0 0 1 1;.5 0 .5 1;0 0 1 1;.5 0 .5 1;0 0 1 1"/></rect>`);

  // Labels on the left, each with a leader to its rung.
  const lx = 38;
  steps.forEach((s, i) => {
    const ly = 462 - i * 96;
    const [tx, ty] = P(0, tops[i].gy + A, tops[i].h * 0.6);
    o.push(`<g class="fu" style="${delay(0.5 + i * 0.1)}">`);
    o.push(text(s.n, { x: lx, y: ly, size: 12, face: 'm', fill: C.rose }));
    o.push(text(s.verb.toUpperCase(), { x: lx + 30, y: ly, size: 26, face: 't', fill: C.bone }));
    o.push(text(s.repo, { x: lx + 30, y: ly + 22, size: 13, face: 'mb', fill: C.soft }));
    o.push(text(s.stack, { x: lx + 30, y: ly + 40, size: 11.5, face: 'm', fill: C.muted }));
    const ok = s.status.level === 'verified';
    o.push(ok ? check(lx + 2, ly + 52, 9, C.rose) : rect(lx + 2, ly + 47, 8, 8, 'none', { stroke: C.amber, strokeDasharray: s.status.level === 'validated' ? '2 2' : undefined }));
    o.push(text(s.status.label, { x: lx + 16, y: ly + 56, size: 10.5, face: 'm', fill: ok ? C.soft : C.amber }));
    o.push(`<path d="M${lx + 250} ${ly - 8}H${tx - 40}L${tx - 4} ${ty}" fill="none" stroke="${C.hair}" stroke-width="1"/>`);
    o.push(dot(tx - 4, ty, 2.5, C.rose));
    o.push('</g>');
  });

  // Legend for the cubes.
  const gx = 820, gy = 512;
  [['api-gateway', C.bone], ['inventory', C.soft], ['billing', C.amber]].forEach(([n, c], i) => {
    o.push(rect(gx, gy + i * 18 - 8, 8, 8, c), text(n, { x: gx + 16, y: gy + i * 18, size: 11, face: 'm', fill: C.muted }));
  });
  o.push(label('on every rung', gx, gy - 22, C.dim, 9));

  return svg({
    w: W,
    h: H,
    bg: C.ink,
    title: 'One backend, five ways to ship it',
    desc: steps.map((s) => `${s.n} ${s.verb}: ${s.repo} (${s.stack})`).join('. '),
    body: o.join(''),
    css: css.join(''),
  });
}
