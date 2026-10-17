// Terminal sessions that type themselves out: the about card and the
// `tail -f now.log` card.
//
// Typing is a cover rect that slides off each command in character-sized
// steps, with the cursor riding its left edge. Every timing is computed here
// from the content, so the session plays as one continuous take.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, esc, delay, textWidth } from '../lib/svg.mjs';
import { wrap, measure } from '../lib/text.mjs';

const W = 1000;
const PAD = 34;
const FS = 15; // mono size
const LH = 25;
const CW = measure('M', 'm', FS); // monospace advance
const CHAR_T = 0.05; // seconds per typed character

const n2 = (v) => Math.round(v * 1000) / 1000;

/** Window chrome: a flat title bar with three square lights. */
function chrome(h, title) {
  return [
    rect(0.5, 0.5, W - 1, h - 1, C.panel, { stroke: C.hair }),
    rect(1, 1, W - 2, 40, C.panel2),
    rect(0, 41, W, 1, C.hair),
    rect(20, 16, 10, 10, C.carmine),
    rect(38, 16, 10, 10, C.dim),
    rect(56, 16, 10, 10, C.dim),
    text(title, { x: W / 2, y: 26, size: 12, face: 'm', fill: C.muted, anchor: 'middle' }),
  ].join('');
}

/** The prompt: a chevron path (the subset font has no ❯) and the path. */
function prompt(x, y) {
  return `<path d="M${x} ${y - 10}l6 5-6 5" fill="none" stroke="${C.rose}" stroke-width="2" stroke-linecap="square"/>` +
    text('~', { x: x + 14, y, size: FS, face: 'm', fill: C.soft });
}

export function about({ session }) {
  const css = [];
  const rows = [];
  let y = 42 + 36;
  let t = 0.5;
  let k = 0;
  const outX = PAD;
  const maxW = W - PAD * 2;

  for (const step of session) {
    if (step.cmd) {
      const x = PAD + 34;
      const w = measure(step.cmd, 'm', FS) + 4;
      const dur = step.cmd.length * CHAR_T;
      rows.push(`<g class="fi" style="${delay(t)}">${prompt(PAD, y)}</g>`);
      rows.push(text(step.cmd, { x, y, size: FS, face: 'mb', fill: C.bone }));
      // The cover slides right by its own width; the cursor rides its left edge
      // and is only shown while this line is being typed.
      const id = `c${k++}`;
      const end = t + dur;
      css.push(`@keyframes ${id}{from{transform:translateX(0)}}.${id}{transform:translateX(${n2(w + 2)}px);animation:${id} ${n2(dur)}s steps(${step.cmd.length}) ${n2(t)}s both}`);
      rows.push(`<g class="${id}">${rect(x - 1, y - 17, w + 2, 23, C.panel)}${rect(x - 1, y - 15, CW, 19, C.bone, { class: `k${id}` })}</g>`);
      const total = end + 0.35;
      css.push(`@keyframes k${id}{0%{opacity:0}${pct(t, total)}{opacity:0}${pct(t + 0.001, total)}{opacity:1}99.9%{opacity:1}100%{opacity:0}}.k${id}{opacity:0;animation:k${id} ${n2(total)}s linear both}`);
      t = end + 0.35;
      y += LH;
    } else if (step.out) {
      const paras = Array.isArray(step.out) ? step.out : [step.out];
      for (const p of paras) {
        for (const l of wrap(p, 'm', FS, maxW)) {
          rows.push(text(l, { x: outX, y, size: FS, face: 'm', fill: C.boneDim, cls: 'fi', style: `animation-duration:.18s;${delay(t)}` }));
          t += 0.05;
          y += LH;
        }
        y += 6;
      }
      t += 0.3;
      y += 8;
    } else if (step.json) {
      const lines = jsonLines(step.json);
      for (const parts of lines) {
        const spans = parts.map(([s, fill]) => `<tspan fill="${fill}">${esc(s)}</tspan>`).join('');
        rows.push(`<text x="${outX}" y="${y}" class="m fi" font-size="${FS}" style="animation-duration:.18s;${delay(t)}">${spans}</text>`);
        t += 0.05;
        y += LH;
      }
      t += 0.3;
      y += 8;
    }
  }
  // Final prompt with a resting, blinking cursor.
  rows.push(`<g class="fi" style="${delay(t)}">${prompt(PAD, y)}${rect(PAD + 34, y - 15, CW, 19, C.bone, { class: 'blink' })}</g>`);
  const H = y + 30;

  return svg({
    w: W,
    h: H,
    title: 'whoami',
    desc: session.map((s) => s.cmd ?? (s.out ? [].concat(s.out).join(' ') : s.json.map(([k, v]) => `${k}: ${[].concat(v).join(', ')}`).join('; '))).join(' — '),
    body: chrome(H, 'abdulla@alasmawi: ~ — zsh') + rows.join(''),
    css: css.join(''),
  });
}

const pct = (t, total) => `${Math.min(99.8, (t / total) * 100).toFixed(2)}%`;

/** profile.json, highlighted: keys in rose, strings in bone, punctuation muted. */
function jsonLines(pairs) {
  const P = C.muted, K = C.rose, S = C.bone;
  const out = [[['{', P]]];
  pairs.forEach(([k, v], i) => {
    const comma = i < pairs.length - 1 ? ',' : '';
    const parts = [['  "', P], [k, K], ['": ', P]];
    if (Array.isArray(v)) {
      parts.push(['[', P]);
      v.forEach((s, j) => parts.push([`"${s}"`, S], [j < v.length - 1 ? ', ' : '', P]));
      parts.push([']' + comma, P]);
    } else parts.push([`"${v}"`, S], [comma, P]);
    out.push(parts);
  });
  out.push([['}', P]]);
  return out;
}

/** `tail -f ~/now.log`: lines stream in, then the log keeps a heartbeat. */
export function now({ entries }) {
  const rows = [];
  let y = 42 + 36;
  const cmd = 'tail -f ~/now.log';
  const x = PAD + 34;
  const w = measure(cmd, 'm', FS) + 4;
  const dur = cmd.length * CHAR_T;
  const css = [`@keyframes nc{from{transform:translateX(0)}}.nc{transform:translateX(${n2(w + 2)}px);animation:nc ${n2(dur)}s steps(${cmd.length}) .4s both}`];
  rows.push(prompt(PAD, y), text(cmd, { x, y, size: FS, face: 'mb', fill: C.bone }), `<g class="nc">${rect(x - 1, y - 17, w + 2, 23, C.panel)}</g>`);
  y += LH + 8;
  let t = 0.4 + dur + 0.4;
  const tagW = Math.max(...entries.map(([k]) => k.length));
  for (const [k, v, since] of entries) {
    const tag = `[ ${k.padEnd(tagW)} ]`;
    const when = since.padEnd(7);
    rows.push(
      `<g class="fu" style="animation-duration:.35s;${delay(t)}">` +
        text(when, { x: PAD, y, size: FS, face: 'm', fill: C.dim }) +
        text(tag, { x: PAD + measure(when + '  ', 'm', FS), y, size: FS, face: 'm', fill: C.rose }) +
        text(v, { x: PAD + measure(`${when}  ${tag}  `, 'm', FS), y, size: FS, face: 'm', fill: C.bone }) +
        `</g>`,
    );
    t += 0.32;
    y += LH;
  }
  // Heartbeat: a dot that keeps pulsing, as if the log is still being written.
  y += 6;
  rows.push(
    `<g class="fi" style="${delay(t)}">` +
      `<circle cx="${PAD + 5}" cy="${y - 5}" r="4" fill="${C.rose}" class="pulse"/>` +
      text('watching for changes', { x: PAD + 20, y, size: FS, face: 'm', fill: C.muted }) +
      rect(PAD + 20 + measure('watching for changes ', 'm', FS), y - 15, CW, 19, C.bone, { class: 'blink' }) +
      `</g>`,
  );
  const H = y + 30;
  return svg({
    w: W,
    h: H,
    title: 'Currently',
    desc: entries.map(([k, v, since]) => `${k}: ${v} (since ${since})`).join('. '),
    body: chrome(H, 'tail — now.log') + rows.join(''),
    css: css.join(''),
  });
}
