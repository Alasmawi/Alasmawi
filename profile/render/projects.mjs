// Featured project cards. Text on the left, and on the right a small working
// picture of the system, animated the way the real one behaves: packets
// moving through the K9 pipeline, Bayyan's renewals going from healthy to
// critical, Guidely's sources ranking, Brain-Book's messages arriving,
// Detecto's boxes counting. All of it loops; the text never moves.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, check, arrow, textWidth, esc, dot } from '../lib/svg.mjs';
import { wrap, fit, measure } from '../lib/text.mjs';

const W = 1000;
const H = 430;
const VX = 470, VY = 30, VW = 500, VH = H - 60; // the visual's frame

/** Opacity window keyframes for looping sequences: visible from a→b (seconds) in a loop of `total`. */
function win(id, total, a, b, fade = 0.25) {
  const p = (t) => `${Math.max(0, Math.min(100, (t / total) * 100)).toFixed(2)}%`;
  return `@keyframes ${id}{0%,${p(a)}{opacity:0}${p(a + fade)},${p(b)}{opacity:1}${p(b + fade)},100%{opacity:0}}.${id}{animation:${id} ${total}s linear infinite}`;
}

const node = (x, y, w, h, title, sub, accent = C.hairStrong) =>
  rect(x, y, w, h, C.panel, { stroke: accent }) +
  text(title, { x: x + 10, y: y + 18, size: 11.5, face: 'mb', fill: C.bone }) +
  (sub ? text(sub, { x: x + 10, y: y + 33, size: 10.5, face: 'm', fill: C.muted }) : '');

/** A packet travelling a path forever. */
const packet = (d, dur, begin, fill = C.rose, s = 6) =>
  `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" fill="${fill}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${d}" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></rect>`;

const wire = (d, dash) => `<path d="${d}" fill="none" stroke="${C.hairStrong}" stroke-width="1.2"${dash ? ' stroke-dasharray="3 4"' : ''}/>`;

function frameTitle(x, y, str, live = true) {
  return (live ? dot(x + 4, y - 4, 3.5, C.rose, { class: 'pulse' }) : '') + label(str, x + (live ? 14 : 0), y, C.muted, 10);
}

// ——— K9 Pavlov: devices → Pi 5 → IoT Core → Lambda → DynamoDB / Bedrock → dashboard

function visK9(x, y) {
  const o = [];
  o.push(frameTitle(x + 18, y + 26, 'ingestion pipeline · live'));
  const devs = [['collar', 'ESP32-S3'], ['kennel', 'sensors'], ['food scale', 'load cell']];
  devs.forEach(([a, b], i) => o.push(node(x + 18, y + 48 + i * 50, 112, 40, a, b)));
  o.push(node(x + 178, y + 98, 120, 40, 'Pi 5 gateway', 'Greengrass'));
  o.push(node(x + 346, y + 98, 132, 40, 'AWS IoT Core', 'MQTT topics', C.amber));
  o.push(node(x + 346, y + 196, 132, 40, 'Lambda', 'detection rules', C.amber));
  o.push(node(x + 346, y + 280, 132, 40, 'DynamoDB', 'history', C.amber));
  o.push(node(x + 178, y + 196, 120, 40, 'Bedrock', 'care guidance', C.amber));
  o.push(node(x + 18, y + 196, 112, 40, 'dashboard', 'Cognito views', C.rose));
  // A scope note under the dashboard: who sees what.
  o.push(text('handlers', { x: x + 18, y: y + 262, size: 10.5, face: 'm', fill: C.soft }));
  o.push(text('kennel staff', { x: x + 18, y: y + 278, size: 10.5, face: 'm', fill: C.soft }));
  o.push(rect(x + 18, y + 290, 112, 1, C.hair));
  o.push(text('own views only', { x: x + 18, y: y + 306, size: 10.5, face: 'm', fill: C.muted }));

  const paths = [
    `M${x + 130} ${y + 68}H${x + 154}V${y + 118}H${x + 178}`,
    `M${x + 130} ${y + 118}H${x + 178}`,
    `M${x + 130} ${y + 168}H${x + 154}V${y + 118}H${x + 178}`,
    `M${x + 298} ${y + 118}H${x + 346}`,
    `M${x + 412} ${y + 138}V${y + 196}`,
    `M${x + 412} ${y + 236}V${y + 280}`,
    `M${x + 346} ${y + 216}H${x + 298}`,
    `M${x + 178} ${y + 216}H${x + 130}`,
  ];
  paths.forEach((d) => o.push(wire(d)));
  o.push(text('mqtt', { x: x + 306, y: y + 112, size: 10, face: 'm', fill: C.amber }));
  // Readings flow every couple of seconds; a flagged one detours through Bedrock.
  [0, 1, 2].forEach((i) => o.push(packet(paths[i], 1.6, i * 0.5)));
  o.push(packet(paths[3], 1.0, 0.3));
  o.push(packet(paths[4], 1.0, 0.8));
  o.push(packet(paths[5], 1.0, 1.4, C.bone));
  o.push(packet(paths[6], 1.4, 2.0, C.amber));
  o.push(packet(paths[7], 1.4, 2.7, C.amber));
  return o.join('');
}

// ——— Bayyan: records sliding from healthy to due soon to critical

function visBayyan(x, y) {
  const o = [];
  const css = [];
  o.push(frameTitle(x + 18, y + 26, 'renewal register'));
  // Language toggle, as in the app. Arabic falls back to a system face.
  o.push(rect(x + VW - 110, y + 12, 80, 24, C.panel, { stroke: C.hair }));
  o.push(rect(x + VW - 110, y + 12, 40, 24, C.bone));
  o.push(text('EN', { x: x + VW - 90, y: y + 28, size: 11, face: 'mb', fill: C.ink, anchor: 'middle' }));
  o.push(`<text x="${x + VW - 50}" y="${y + 29}" font-size="13" fill="${C.bone}" text-anchor="middle" font-family="Geeza Pro,Noto Sans Arabic,Tahoma,Arial,sans-serif">ع</text>`);

  const cols = [x + 18, x + 160, x + 300, x + 384];
  ['type', 'record', 'renews', 'status'].forEach((c, i) => o.push(label(c, cols[i], y + 64, C.dim, 9.5)));
  o.push(rect(x + 18, y + 72, VW - 36, 1, C.hair));
  const rows = [
    ['telecom', 'Fixed line, NOC', 'monthly'],
    ['contract', 'Support contract', 'yearly'],
    ['licence', 'Firewall licence', 'yearly'],
    ['subscription', 'Cloud backup', 'quarterly'],
    ['permit', 'Radio permit', 'yearly'],
  ];
  const T = 12;
  const states = [
    ['healthy', C.soft, 'transparent', C.hairStrong],
    ['due soon', C.ink, C.amber, C.amber],
    ['critical', C.bone, C.red, C.red],
  ];
  rows.forEach(([type, rec, cyc], i) => {
    const ry = y + 100 + i * 40;
    o.push(text(type, { x: cols[0], y: ry, size: 11.5, face: 'm', fill: C.muted }));
    o.push(text(rec, { x: cols[1], y: ry, size: 12.5, face: 'b', fill: C.bone }));
    o.push(text(cyc, { x: cols[2], y: ry, size: 11, face: 'm', fill: C.soft }));
    // Time left until renewal, draining; status follows it.
    const off = (i * 2.3) % T;
    const id = `br${i}`;
    const restScale = [0.8, 0.62, 0.3, 0.7, 0.08][i];
    css.push(`@keyframes ${id}{0%{transform:scaleX(1)}100%{transform:scaleX(0.04)}}.${id}{transform-box:fill-box;transform-origin:0 0;transform:scaleX(${restScale});animation:${id} ${T}s linear infinite;animation-delay:-${off}s}`);
    o.push(rect(cols[1], ry + 9, 120, 2, C.panel2));
    o.push(rect(cols[1], ry + 9, 120, 2, C.bone, { class: id, opacity: 0.6 }));
    states.forEach(([name, fg, bg, stroke], s) => {
      const sid = `bs${i}${s}`;
      const a = [0, 0.55, 0.8][s] * T, b = [0.55, 0.8, 1][s] * T;
      css.push(`@keyframes ${sid}{0%,${(a / T) * 100}%{opacity:0}${(a / T) * 100 + 0.5}%,${(b / T) * 100 - 0.5}%{opacity:1}${(b / T) * 100}%,100%{opacity:0}}.${sid}{animation:${sid} ${T}s steps(1,end) infinite;animation-delay:-${off}s}`);
      const pw = 86;
      // At rest (motion off) each row shows one status, a spread of all three.
      const rest = [0, 0, 1, 0, 2][i] === s ? 1 : 0;
      o.push(`<g class="${sid}" opacity="${rest}">${rect(cols[3], ry - 13, pw, 20, bg, { stroke })}${text(name, { x: cols[3] + pw / 2, y: ry + 1, size: 10, face: 'l', fill: fg, anchor: 'middle', tracking: 0.12 })}</g>`);
    });
  });
  // Bill import: an unknown number is held back for a person to check.
  const by = y + VH - 50;
  o.push(rect(x + 18, by, VW - 36, 34, C.panel, { stroke: C.hair }));
  o.push(rect(x + 18, by, 3, 34, C.amber, { class: 'pulse' }));
  o.push(text('bill import', { x: x + 32, y: by + 21, size: 11, face: 'mb', fill: C.bone }));
  o.push(text('1 charge for an unknown number, held for review', { x: x + 124, y: by + 21, size: 11, face: 'm', fill: C.amber }));
  return { body: o.join(''), css: css.join('') };
}

// ——— Guidely: question in, answer with ranked, cited passages out

function visGuidely(x, y) {
  const o = [];
  const css = [];
  const T = 10;
  o.push(frameTitle(x + 18, y + 26, 'example query', false));
  o.push(rect(x + 18, y + 42, VW - 36, 40, C.panel, { stroke: C.hairStrong }));
  const q = 'Who approves a remote-work request?';
  o.push(text(q, { x: x + 32, y: y + 67, size: 13, face: 'm', fill: C.bone }));
  const qw = measure(q, 'm', 13) + 4;
  css.push(`@keyframes gq{0%{transform:translateX(0)}22%,100%{transform:translateX(${qw}px)}}.gq{transform:translateX(${qw}px);animation:gq ${T}s steps(${q.length}) infinite}`);
  o.push(`<clipPath id="gqc"><rect x="${x + 19}" y="${y + 43}" width="${VW - 38}" height="38"/></clipPath>`);
  o.push(`<g clip-path="url(#gqc)"><g class="gq">${rect(x + 31, y + 50, qw, 24, C.panel)}${rect(x + 31, y + 52, 8, 18, C.bone)}</g></g>`);
  // Answer, then sources one by one with their similarity.
  css.push(win('ga', T, 2.6, 9.4));
  o.push(`<g class="ga">${label('answer', x + 18, y + 112, C.rose, 10)}${text('Your line manager first, then HR confirms it in writing.', { x: x + 18, y: y + 136, size: 15, face: 'b', fill: C.bone })}</g>`);
  o.push(label('sources', x + 18, y + 176, C.muted, 10));
  const src = [
    ['hr-handbook.pdf', '§ 4.2 Remote work', 0.82],
    ['remote-work-policy.docx', 'Approvals', 0.77],
    ['onboarding.md', 'Who to ask', 0.58],
  ];
  src.forEach(([f, sec, s], i) => {
    const sy = y + 196 + i * 54;
    const id = `gs${i}`;
    css.push(win(id, T, 3.2 + i * 0.45, 9.4));
    const bw = 120;
    css.push(`@keyframes gb${i}{0%,${((3.2 + i * 0.45) / T) * 100}%{transform:scaleX(0)}${((3.9 + i * 0.45) / T) * 100}%,100%{transform:scaleX(1)}}.gb${i}{transform-box:fill-box;transform-origin:0 0;animation:gb${i} ${T}s cubic-bezier(.2,.7,.1,1) infinite}`);
    o.push(`<g class="${id}">` +
      rect(x + 18, sy, VW - 36, 44, C.panel, { stroke: C.hair }) +
      rect(x + 18, sy, 3, 44, i === 0 ? C.rose : C.dim) +
      text(f, { x: x + 32, y: sy + 19, size: 12, face: 'mb', fill: C.bone }) +
      text(sec, { x: x + 32, y: sy + 35, size: 11, face: 'm', fill: C.muted }) +
      rect(x + VW - 36 - bw - 40, sy + 20, bw, 4, C.panel2) +
      rect(x + VW - 36 - bw - 40, sy + 20, bw * s, 4, i === 0 ? C.rose : C.soft, { class: `gb${i}` }) +
      text(s.toFixed(2), { x: x + VW - 30, y: sy + 26, size: 12, face: 'm', fill: C.bone, anchor: 'end' }) +
      `</g>`);
  });
  return { body: o.join(''), css: css.join('') };
}

// ——— Brain-Book: a group chat over a WebSocket

function visBrainBook(x, y) {
  const o = [];
  const css = [];
  const T = 9;
  o.push(frameTitle(x + 18, y + 26, 'ws://brain-book · connected'));
  // Left: the feed, as quiet placeholders.
  const fx = x + 18, fw = 190;
  o.push(label('group feed', fx, y + 60, C.dim, 9.5));
  for (let i = 0; i < 3; i++) {
    const py = y + 74 + i * 92;
    o.push(rect(fx, py, fw, 80, C.panel, { stroke: C.hair }));
    o.push(rect(fx + 12, py + 12, 22, 22, C.panel2));
    o.push(rect(fx + 42, py + 16, 80 - i * 12, 5, C.dim));
    o.push(rect(fx + 42, py + 27, 50, 4, C.panel2));
    o.push(rect(fx + 12, py + 46, fw - 24, 4, C.panel2));
    o.push(rect(fx + 12, py + 56, fw - 60, 4, C.panel2));
  }
  // Right: messages arrive and stack.
  const cx = x + 228, cw = VW - 246;
  o.push(rect(cx, y + 48, cw, VH - 66, C.panel, { stroke: C.hair }));
  o.push(label('#reboot-cohort', cx + 14, y + 70, C.soft, 9.5));
  o.push(rect(cx, y + 80, cw, 1, C.hair));
  const msgs = [
    [false, 'pushed the websocket fix'],
    [true, 'nice, testing it now'],
    [false, 'audit at 4?'],
    [true, 'on my way'],
    [false, 'typing'],
  ];
  msgs.forEach(([me, m], i) => {
    const my = y + 100 + i * 46;
    const tw = measure(m, 'b', 12.5) + 24;
    const bx = me ? cx + cw - 14 - tw : cx + 14;
    const id = `bm${i}`;
    css.push(win(id, T, 0.4 + i * 1.1, T - 0.6, 0.2));
    const last = i === msgs.length - 1;
    o.push(`<g class="${id}">` +
      rect(bx, my, tw, 30, me ? C.bone : C.panel2, { stroke: me ? 'none' : C.hair }) +
      (last
        ? [0, 1, 2].map((k) => dot(bx + 12 + k * 9, my + 15, 2.5, C.soft, { class: 'pulse', style: delay(k * 0.2) })).join('')
        : text(m, { x: bx + 12, y: my + 19.5, size: 12.5, face: 'b', fill: me ? C.ink : C.bone })) +
      `</g>`);
  });
  return { body: o.join(''), css: css.join('') };
}

// ——— Detecto: boxes land on people, the count climbs, a zone trips

function visDetecto(x, y) {
  const o = [];
  const css = [];
  const T = 8;
  o.push(frameTitle(x + 18, y + 26, 'webcam · yolov8'));
  const fx = x + 18, fy = y + 42, fw = VW - 36, fh = VH - 100;
  o.push(rect(fx, fy, fw, fh, '#101115', { stroke: C.hair }));
  // A faint floor grid for depth.
  for (let i = 1; i < 6; i++) o.push(line(fx, fy + (fh / 6) * i, fx + fw, fy + (fh / 6) * i, 'rgba(239,233,221,0.05)'));
  for (let i = 1; i < 10; i++) o.push(line(fx + (fw / 10) * i, fy, fx + (fw / 10) * i, fy + fh, 'rgba(239,233,221,0.05)'));
  // Zone A.
  const zx = fx + fw * 0.52, zw = fw * 0.44;
  o.push(rect(zx, fy + 18, zw, fh - 36, 'rgba(242,169,59,0.06)', { stroke: C.amber, strokeDasharray: '5 5' }));
  o.push(label('zone a · limit 2', zx + 10, fy + fh - 28, C.amber, 9.5));
  const people = [
    [0.12, 0.3, 1.0, 0.94],
    [0.33, 0.22, 0.85, 0.91],
    [0.62, 0.28, 0.95, 0.89],
    [0.8, 0.34, 1.05, 0.86],
  ];
  people.forEach(([px, py, s, conf], i) => {
    const cx = fx + fw * px, top = fy + fh * py;
    const hh = 26 * s, bw = 34 * s, bh = 92 * s;
    o.push(dot(cx, top + hh / 2, hh / 2, '#3a3c44'));
    o.push(rect(cx - bw / 2, top + hh + 4, bw, bh, '#2c2e35'));
    const id = `dp${i}`;
    css.push(win(id, T, 0.6 + i * 0.7, T - 0.5, 0.12));
    const bx = cx - bw / 2 - 10, by = top - 8, bbw = bw + 20, bbh = hh + bh + 18;
    o.push(`<g class="${id}">` + rect(bx, by, bbw, bbh, 'none', { stroke: C.rose, strokeWidth: 1.6 }) +
      rect(bx - 0.8, by - 16, measure(`person ${conf}`, 'm', 10) + 10, 16, C.rose) +
      text(`person ${conf}`, { x: bx + 4, y: by - 4.5, size: 10, face: 'm', fill: C.bone }) + `</g>`);
  });
  // Counter: each value shown in turn, resting on the final count.
  const ky = y + VH - 30;
  o.push(label('people', fx, ky, C.muted, 10));
  for (let k = 0; k <= 4; k++) {
    const id = `dc${k}`;
    const a = k === 0 ? 0 : 0.6 + (k - 1) * 0.7 + 0.12;
    const b = k === 4 ? T - 0.5 : 0.6 + k * 0.7 + 0.12;
    css.push(`@keyframes ${id}{0%,${(a / T) * 100}%{opacity:${k === 0 ? 1 : 0}}${(a / T) * 100 + 0.1}%,${(b / T) * 100}%{opacity:1}${(b / T) * 100 + 0.1}%,100%{opacity:${k === 0 ? 1 : 0}}}.${id}{animation:${id} ${T}s steps(1,end) infinite}`);
    o.push(text(String(k), { x: fx + 70, y: ky + 4, size: 30, face: 't', fill: C.bone, cls: id, opacity: k === 4 ? undefined : 0 }));
  }
  css.push(win('dz', T, 0.6 + 3 * 0.7 + 0.12, T - 0.5, 0.1));
  o.push(`<g class="dz">${rect(fx + fw - 200, ky - 18, 200, 26, C.amber)}${label('zone a over limit', fx + fw - 100, ky, C.ink, 10, 'middle')}</g>`);
  o.push(text('every run kept', { x: fx + 104, y: ky - 4, size: 11, face: 'm', fill: C.dim }));
  o.push(text('csv · xlsx export', { x: fx + 104, y: ky + 10, size: 11, face: 'm', fill: C.dim }));
  return { body: o.join(''), css: css.join('') };
}

const VIS = { k9: visK9, bayyan: visBayyan, guidely: visGuidely, brainbook: visBrainBook, detecto: visDetecto };

export function project(p, i) {
  const o = [];
  o.push(rect(0.5, 0.5, W - 1, H - 1, C.ink, { stroke: C.hair }));
  o.push(rect(0, 0, 4, H, i < 2 ? C.carmine : C.dim));
  // Left column.
  const lx = 38, lw = 392;
  o.push(label(p.context, lx, 52, C.rose, 11));
  o.push(text(`0${i + 1} / 0${5}`, { x: lx + lw, y: 52, size: 11, face: 'm', fill: C.dim, anchor: 'end' }));
  const size = fit(p.name.toUpperCase(), 'd', lw, 78);
  const ny = 64 + size * 0.72;
  o.push(`<clipPath id="pn"><rect x="0" y="${ny - size * 0.74}" width="${W}" height="${size * 0.8}"/></clipPath>`);
  o.push(`<g clip-path="url(#pn)">${text(p.name, { x: lx - 2, y: ny, size, face: 'd', fill: C.bone, cls: 'rise', style: delay(0.1) })}</g>`);
  let y = ny + 36;
  for (const l of wrap(p.summary, 'b', 16, lw)) {
    o.push(text(l, { x: lx, y, size: 16, face: 'b', fill: C.boneDim, cls: 'fu', style: delay(0.3) }));
    y += 24;
  }
  y += 14;
  p.proof.forEach((pr, j) => {
    o.push(`<g class="fu" style="${delay(0.45 + j * 0.1)}">${check(lx + 1, y - 4, 11, C.rose)}${text(pr, { x: lx + 22, y, size: 13, face: 'm', fill: C.bone })}</g>`);
    y += 23;
  });
  // Tags and the link, pinned to the bottom.
  const tagLines = wrap(p.tags.join(' · '), 'm', 11.5, lw);
  let ty = H - 70 - (tagLines.length - 1) * 18;
  for (const l of tagLines) {
    o.push(text(l, { x: lx, y: ty, size: 11.5, face: 'm', fill: C.muted }));
    ty += 18;
  }
  o.push(line(lx, H - 52, lx + lw, H - 52, C.hair));
  o.push(label('open', lx, H - 26, C.bone, 11));
  o.push(text(p.cta, { x: lx + 52, y: H - 26, size: 12, face: 'm', fill: C.soft }));
  o.push(arrow(lx + lw - 6, H - 30, 11, C.rose, 'ne'));

  // Right: the visual in its own frame.
  o.push(rect(VX, VY, VW, VH, '#121318', { stroke: C.hair }));
  const v = VIS[p.id](VX, VY);
  const vis = typeof v === 'string' ? { body: v, css: '' } : v;
  o.push(`<g class="fi" style="${delay(0.5)}">${vis.body}</g>`);

  return svg({
    w: W,
    h: H,
    title: p.name,
    desc: `${p.name} (${p.context}). ${p.summary} ${p.proof.join('. ')}. Built with ${p.tags.join(', ')}.`,
    body: o.join(''),
    css: vis.css,
  });
}
