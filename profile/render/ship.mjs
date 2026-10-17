// "Five ways to ship", rung by rung.
//
// Every rung card draws the same six components in the same places: gateway,
// inventory-app and its database, the RabbitMQ queue, billing-app and its
// database. Only the walls around them change: VMs, containers, a K3s
// namespace, an AWS VPC, and finally the pipeline that ships it. Requests
// run through each one the same way, because it's the same system.

import { C } from '../lib/theme.mjs';
import { svg, text, rect, line, label, delay, check, arrow, textWidth } from '../lib/svg.mjs';
import { wrap, measure } from '../lib/text.mjs';

const W = 1000;
const H = 470;
const DX = 432, DY = 28, DW = 540, DH = H - 56; // diagram frame

// Component boxes, relative to the diagram frame. Same on every rung.
const BOX = {
  gateway: { x: 190, y: 92, w: 160, h: 46, name: 'api-gateway', port: ':3000' },
  inventory: { x: 30, y: 198, w: 156, h: 46, name: 'inventory-app', port: ':8080' },
  queue: { x: 214, y: 198, w: 112, h: 46, name: 'rabbitmq', port: 'billing_queue' },
  billing: { x: 354, y: 198, w: 156, h: 46, name: 'billing-app', port: 'consumer' },
  invdb: { x: 30, y: 306, w: 156, h: 46, name: 'inventory-db', port: 'movies_db' },
  billdb: { x: 354, y: 306, w: 156, h: 46, name: 'billing-db', port: 'billing_db' },
};
const ACCENT = { gateway: C.bone, inventory: C.soft, queue: C.rose, billing: C.amber, invdb: C.soft, billdb: C.amber };

const cx = (b) => b.x + b.w / 2;
const at = (x, y) => [DX + x, DY + y];

/** Pixel path through the diagram, from frame-relative points. */
const path = (...pts) => 'M' + pts.map(([x, y]) => `${DX + x} ${DY + y}`).join('L');

// The two request flows every rung carries.
const FLOW_MOVIES = path([cx(BOX.gateway) - 30, 40], [cx(BOX.gateway) - 30, BOX.gateway.y + BOX.gateway.h], [cx(BOX.gateway) - 30, 170], [cx(BOX.inventory), 170], [cx(BOX.inventory), BOX.inventory.y], [cx(BOX.inventory), BOX.invdb.y]);
const FLOW_BILLING = path([cx(BOX.gateway) + 30, 40], [cx(BOX.gateway) + 30, BOX.gateway.y + BOX.gateway.h], [cx(BOX.gateway) + 30, 170], [cx(BOX.queue), 170], [cx(BOX.queue), BOX.queue.y + BOX.queue.h / 2], [BOX.billing.x, BOX.queue.y + BOX.queue.h / 2], [cx(BOX.billing), BOX.queue.y + BOX.queue.h / 2], [cx(BOX.billing), BOX.billdb.y]);

function component(key, { dashed, tag, replicas } = {}) {
  const b = BOX[key];
  const [x, y] = at(b.x, b.y);
  const o = [];
  if (replicas) {
    // Ghost replicas behind the box, appearing as the autoscaler scales out.
    [2, 1].forEach((k) => o.push(`<g class="hpa${k}">${rect(x + k * 6, y - k * 6, b.w, b.h, C.panel, { stroke: C.hairStrong, strokeDasharray: dashed ? '4 3' : undefined })}</g>`));
  }
  o.push(rect(x, y, b.w, b.h, C.panel, { stroke: dashed ? 'rgba(239,233,221,0.45)' : C.hairStrong, strokeDasharray: dashed ? '4 3' : undefined }));
  o.push(rect(x, y, 3, b.h, ACCENT[key]));
  o.push(text(b.name, { x: x + 12, y: y + 19, size: 12, face: 'mb', fill: C.bone }));
  o.push(text(tag ?? b.port, { x: x + 12, y: y + 35, size: 10.5, face: 'm', fill: C.muted }));
  return o.join('');
}

/** Wires between components, drawn under them. */
function wires() {
  const g = BOX.gateway, i = BOX.inventory, q = BOX.queue, bl = BOX.billing;
  const ys = 170;
  return [
    path([cx(g), g.y + g.h], [cx(g), ys]),
    path([cx(i), ys], [cx(bl), ys]),
    path([cx(i), ys], [cx(i), i.y]),
    path([cx(q), ys], [cx(q), q.y]),
    path([q.x + q.w, q.y + q.h / 2], [bl.x, bl.y + bl.h / 2]),
    path([cx(i), i.y + i.h], [cx(i), BOX.invdb.y]),
    path([cx(bl), bl.y + bl.h], [cx(bl), BOX.billdb.y]),
  ].map((d) => `<path d="${d}" fill="none" stroke="${C.hairStrong}" stroke-width="1.2"/>`).join('') +
    text('http', { x: DX + cx(i) + 8, y: DY + ys - 6, size: 10, face: 'm', fill: C.dim }) +
    text('amqp', { x: DX + cx(q) + 8, y: DY + ys - 6, size: 10, face: 'm', fill: C.dim }) +
    text('consume', { x: DX + q.x + q.w + 4, y: DY + q.y + q.h / 2 - 6, size: 10, face: 'm', fill: C.dim });
}

/** Requests: a movie call down to inventory-db, an order through the queue. */
function packets() {
  const p = (d, dur, begin, fill) =>
    `<rect x="-3.5" y="-3.5" width="7" height="7" fill="${fill}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${d}"/></rect>`;
  return p(FLOW_MOVIES, 2.6, 0.2, C.bone) + p(FLOW_BILLING, 3.4, 1.3, C.amber) + p(FLOW_MOVIES, 2.6, 1.6, C.bone);
}

/** The way in, at the top of the diagram. */
function entry(str, x0 = cx(BOX.gateway)) {
  const [x, y] = at(x0, 22);
  const w = measure(str, 'm', 11) + 22;
  return rect(x - w / 2, y - 14, w, 22, C.ink, { stroke: C.hair }) + text(str, { x, y: y + 1, size: 11, face: 'm', fill: C.soft, anchor: 'middle' });
}

function wall(x, y, w, h, title, sub, { dashed, fill = 'rgba(239,233,221,0.025)', stroke = 'rgba(239,233,221,0.22)' } = {}) {
  const [X, Y] = at(x, y);
  return rect(X, Y, w, h, fill, { stroke, strokeDasharray: dashed ? '5 4' : undefined }) +
    label(title, X + 10, Y + 16, C.soft, 9.5) +
    (sub ? text(sub, { x: X + w - 10, y: Y + 16, size: 10, face: 'm', fill: C.dim, anchor: 'end' }) : '');
}

const volume = (key, name) => {
  const b = BOX[key];
  const [x, y] = at(b.x + b.w - 22, b.y + b.h + 6);
  return `<g><ellipse cx="${x + 8}" cy="${y + 3}" rx="8" ry="3" fill="${C.panel2}" stroke="${C.hairStrong}"/><path d="M${x} ${y + 3}v10a8 3 0 0 0 16 0v-10" fill="${C.panel2}" stroke="${C.hairStrong}"/>${text(name, { x: x - 6, y: y + 13, size: 9.5, face: 'm', fill: C.dim, anchor: 'end' })}</g>`;
};

// ——— the five settings

const STAGES = {
  '01'() {
    return [
      wall(178, 64, 184, 88, 'gateway-vm', '.13'),
      wall(14, 170, 188, 200, 'inventory-vm', '.11'),
      wall(204, 170, 322, 200, 'billing-vm', '.12'),
      wires(),
      component('gateway', { tag: ':3000 · pm2' }),
      component('inventory', { tag: ':8080 · pm2' }),
      component('queue'),
      component('billing', { tag: 'consumer · pm2' }),
      component('invdb', { tag: 'postgresql' }),
      component('billdb', { tag: 'postgresql' }),
      entry('client -> gateway-vm :3000'),
      foot('vagrant · private network 192.168.56.0/24'),
    ].join('');
  },
  '02'() {
    return [
      wall(10, 48, 520, 334, 'docker host', 'crud-net bridge'),
      wires(),
      ...['gateway', 'inventory', 'queue', 'billing', 'invdb', 'billdb'].map((k) => component(k, { tag: { gateway: 'published :3000', inventory: 'debian-slim', queue: 'debian-slim', billing: 'debian-slim', invdb: 'postgresql-13', billdb: 'postgresql-13' }[k] })),
      volume('invdb', 'vol'),
      volume('billdb', 'vol'),
      volume('gateway', 'logs'),
      entry('host :3000, the only published port'),
      foot('docker-compose · 6 images · 1 network · 3 volumes'),
    ].join('');
  },
  '03'() {
    return [
      wall(10, 48, 520, 334, 'namespace crud-master', 'master + agent'),
      wires(),
      component('gateway', { tag: 'Deployment · hpa 1-3', replicas: true }),
      component('inventory', { tag: 'Deployment · hpa 1-3', replicas: true }),
      component('queue', { tag: 'Deployment' }),
      component('billing', { tag: 'StatefulSet' }),
      component('invdb', { tag: 'StatefulSet · pvc 1Gi' }),
      component('billdb', { tag: 'StatefulSet · pvc 1Gi' }),
      entry('NodePort 30000 -> 3000'),
      foot('k3s · secrets from .env · scales on 60% cpu'),
    ].join('');
  },
  '04'() {
    // Drawn dashed: the stack is written and validated, never applied.
    return [
      wall(4, 6, 532, 380, 'vpc · 2 availability zones', 'not applied', { dashed: true }),
      wall(120, 30, 300, 36, '', 'public subnet', { dashed: true, fill: 'rgba(176,18,43,0.12)', stroke: 'rgba(234,95,112,0.5)' }),
      wall(14, 76, 512, 300, 'private subnets', 'ecs tasks sg', { dashed: true }),
      wires(),
      component('gateway', { tag: 'Fargate · 1-3', dashed: true }),
      component('inventory', { tag: 'Fargate · 1-3', dashed: true }),
      component('queue', { tag: 'Amazon MQ', dashed: true }),
      component('billing', { tag: 'Fargate · x1', dashed: true }),
      component('invdb', { tag: 'RDS postgres', dashed: true }),
      component('billdb', { tag: 'RDS postgres', dashed: true }),
      `<g>${(() => { const [x, y] = at(cx(BOX.gateway), 48); return rect(x - 30, y - 10, 60, 18, C.carmine) + text('ALB', { x, y: y + 3, size: 11, face: 'mb', fill: C.bone, anchor: 'middle' }); })()}</g>`,
      foot('terraform · secrets manager · validated, not applied'),
    ].join('');
  },
  '05'() {
    return pipelines();
  },
};

function foot(str) {
  const [x, y] = at(14, DH - 12);
  return text(str, { x, y, size: 10.5, face: 'm', fill: C.dim });
}

/** Rung 05: the two pipeline templates, with a job token walking each one and waiting at approval. */
function pipelines() {
  const o = [];
  const css = [];
  const lanes = [
    ['app pipeline · per service repo', ['build', 'test', 'scan', 'containerize', 'staging', 'approval', 'production']],
    ['infra pipeline', ['init', 'validate', 'plan', 'apply staging', 'approval', 'apply prod']],
  ];
  lanes.forEach(([name, stages], li) => {
    const y0 = 40 + li * 150;
    const [lx, ly] = at(14, y0);
    o.push(label(name, lx, ly, C.soft, 9.5));
    const gap = 6;
    const sw = (DW - 28 - gap * (stages.length - 1)) / stages.length;
    stages.forEach((s, i) => {
      const [x, y] = at(14 + i * (sw + gap), y0 + 14);
      const gate = s === 'approval';
      o.push(rect(x, y, sw, 44, gate ? 'rgba(242,169,59,0.08)' : C.panel, { stroke: gate ? C.amber : C.hairStrong, strokeDasharray: gate ? '4 3' : undefined }));
      if (gate) o.push(rect(x + sw / 2 - 5, y + 9, 3, 10, C.amber), rect(x + sw / 2 + 2, y + 9, 3, 10, C.amber));
      const words = s.split(' ');
      words.forEach((w, k) => o.push(text(w, { x: x + sw / 2, y: y + (gate ? 34 : 20 + k * 13 + (words.length === 1 ? 6 : 0)), size: Math.min(10.5, (sw - 8) / measure(w, 'm', 1)), face: 'm', fill: gate ? C.amber : C.bone, anchor: 'middle' })));
      // A status square that turns on as the token passes.
      const id = `ps${li}${i}`;
      const T = 9;
      const on = ((i + 0.6) / (stages.length + 1.6)) * 100;
      css.push(`@keyframes ${id}{0%,${on}%{fill:${C.dim}}${on + 0.1}%,96%{fill:${gate ? C.amber : C.rose}}100%{fill:${C.dim}}}.${id}{animation:${id} ${T}s steps(1,end) infinite;animation-delay:${li * 1.5}s}`);
      o.push(rect(x + 6, y + 6, 5, 5, gate ? C.amber : C.rose, { class: id }));
    });
    // Token: walks the lane, holds at approval (a person signs off), then goes on.
    const [sx, sy] = at(14 + sw / 2, y0 + 70);
    const [ex] = at(14 + (stages.length - 1) * (sw + gap) + sw / 2, 0);
    const gi = stages.indexOf('approval');
    const gx = sx + gi * (sw + gap);
    const frac = (gx - sx) / (ex - sx);
    o.push(line(sx, sy, ex, sy, C.hair));
    o.push(`<rect x="-4" y="-4" width="8" height="8" fill="${C.rose}"><animateMotion dur="9s" begin="${li * 1.5}s" repeatCount="indefinite" path="M${sx} ${sy}H${ex}" keyPoints="0;${frac.toFixed(3)};${frac.toFixed(3)};1;1" keyTimes="0;0.45;0.7;0.92;1" calcMode="linear"/></rect>`);
    o.push(text(li ? 'terraform, per environment' : 'feature branches stop after scan', { x: sx - sw / 2, y: sy + 20, size: 10, face: 'm', fill: C.dim }));
  });
  // Where it all runs.
  const [bx, by] = at(14, 330);
  o.push(rect(bx, by, DW - 28, 44, C.panel, { stroke: C.hairStrong }));
  o.push(rect(bx, by, 3, 44, C.bone));
  o.push(text('gitlab ce', { x: bx + 14, y: by + 19, size: 12, face: 'mb', fill: C.bone }));
  o.push(text('deployed by ansible · runner on docker · ssh on 2222', { x: bx + 14, y: by + 35, size: 10.5, face: 'm', fill: C.muted }));
  o.push(text('protected branches', { x: bx + DW - 42, y: by + 27, size: 10.5, face: 'm', fill: C.amber, anchor: 'end' }));
  return { body: o.join(''), css: css.join('') };
}

const STATUS = {
  verified: { fg: C.ink, bg: C.bone, stroke: C.bone },
  partial: { fg: C.amber, bg: 'none', stroke: C.amber },
  validated: { fg: C.amber, bg: 'none', stroke: C.amber, dashed: true },
};

export function rung(step, i, total) {
  const o = [];
  const css = [
    // HPA: replicas appear one by one, then scale back in.
    '@keyframes hpa1{0%,30%{opacity:0}35%,85%{opacity:1}90%,100%{opacity:0}}.hpa1{animation:hpa1 8s linear infinite}',
    '@keyframes hpa2{0%,50%{opacity:0}55%,80%{opacity:1}85%,100%{opacity:0}}.hpa2{animation:hpa2 8s linear infinite}',
  ];
  o.push(rect(0.5, 0.5, W - 1, H - 1, C.ink, { stroke: C.hair }));
  o.push(rect(0, 0, 4, H, C.carmine));

  // Left column.
  const lx = 38, lw = 360;
  o.push(text(step.n, { x: lx, y: 54, size: 13, face: 'mb', fill: C.rose }));
  o.push(text(`/ 0${total}`, { x: lx + 24, y: 54, size: 13, face: 'm', fill: C.dim }));
  // Progress: which rung of five this is.
  for (let k = 0; k < total; k++) o.push(rect(lx + 80 + k * 22, 46, 16, 4, k <= i ? C.carmine : C.panel2));
  const size = 66;
  o.push(`<clipPath id="rv"><rect x="0" y="${118 - size * 0.74}" width="${W}" height="${size * 0.8}"/></clipPath>`);
  o.push(`<g clip-path="url(#rv)">${text(step.verb, { x: lx - 2, y: 118, size, face: 'd', fill: C.bone, cls: 'rise', style: delay(0.1) })}</g>`);
  o.push(text(step.repo, { x: lx, y: 146, size: 14, face: 'mb', fill: C.soft }));

  const st = STATUS[step.status.level];
  const sw = textWidth(step.status.label, 'l', 9.5, 0.14) + 22;
  o.push(rect(lx + 0.5, 162.5, sw, 22, st.bg, { stroke: st.stroke, strokeDasharray: st.dashed ? '4 3' : undefined }));
  o.push(label(step.status.label, lx + 11, 177, st.fg, 9.5));

  let y = 214;
  for (const l of wrap(step.delta, 'b', 15, lw)) {
    o.push(text(l, { x: lx, y, size: 15, face: 'b', fill: C.boneDim, cls: 'fu', style: delay(0.3) }));
    y += 22;
  }
  y += 14;
  step.facts.forEach((f, k) => {
    const not = /not (yet )?run|not applied/.test(f);
    o.push(`<g class="fu" style="${delay(0.45 + k * 0.1)}">`);
    o.push(not ? rect(lx + 1, y - 10, 10, 10, 'none', { stroke: C.amber }) : check(lx + 1, y - 4, 11, C.rose));
    o.push(text(f, { x: lx + 22, y, size: 12.5, face: 'm', fill: not ? C.amber : C.bone }));
    o.push('</g>');
    y += 22;
  });
  o.push(line(lx, H - 50, lx + lw, H - 50, C.hair));
  o.push(label('open', lx, H - 25, C.bone, 11));
  o.push(text(`Alasmawi/${step.repo}`, { x: lx + 52, y: H - 25, size: 12, face: 'm', fill: C.soft }));
  o.push(arrow(lx + lw - 6, H - 29, 11, C.rose, 'ne'));

  // Right: the system, in this rung's walls.
  o.push(rect(DX, DY, DW, DH, '#121318', { stroke: C.hair }));
  const s = STAGES[step.n]();
  const stage = typeof s === 'string' ? { body: s, css: '' } : s;
  o.push(`<g class="fi" style="${delay(0.4)}">${stage.body}${step.n === '05' ? '' : packets()}</g>`);

  return svg({
    w: W,
    h: H,
    title: `${step.n} ${step.verb}: ${step.repo}`,
    desc: `${step.delta} Status: ${step.status.label}. ${step.facts.join('. ')}.`,
    body: o.join(''),
    css: css.join('') + stage.css,
  });
}

/** What changed from rung to rung, one row per concern. A column highlight walks across. */
export function evolution({ steps, rows }) {
  const X0 = 150, CW = (W - 20 - X0) / steps.length;
  const top = 74, RH = 58;
  const H2 = top + rows.length * RH + 30;
  const T = 10;
  const o = [];
  const css = [];
  o.push(label('what changed at each rung', 38, 36, C.muted, 10));
  css.push(`@keyframes colw{${steps.map((_, i) => `${(i / steps.length) * 100}%{transform:translateX(${i * CW}px)}`).join('')}100%{transform:translateX(0)}}.colw{animation:colw ${T}s steps(1,end) infinite}`);
  o.push(`<g class="colw">${rect(X0, top - 30, CW, H2 - top + 10, 'rgba(176,18,43,0.12)')}${rect(X0, top - 30, CW, 3, C.carmine)}</g>`);
  steps.forEach((s, i) => {
    const x = X0 + i * CW + 12;
    o.push(text(s.n, { x, y: top - 10, size: 11, face: 'mb', fill: C.rose }));
    o.push(label(s.verb, x + 24, top - 10, C.bone, 10));
    if (i) o.push(line(X0 + i * CW, top - 30, X0 + i * CW, H2 - 20, 'rgba(239,233,221,0.07)'));
  });
  rows.forEach(([name, cells], r) => {
    const y = top + r * RH;
    o.push(line(20, y, W - 20, y, C.hair));
    o.push(label(name, 38, y + 24, C.muted, 10));
    cells.forEach((c, i) => {
      const lines = wrap(c, 'm', 11.5, CW - 24);
      lines.slice(0, 3).forEach((l, k) => o.push(text(l, { x: X0 + i * CW + 12, y: y + 22 + k * 15, size: 11.5, face: 'm', fill: C.bone, cls: 'fi', style: delay(0.1 + i * 0.12) })));
    });
  });
  o.push(line(20, top + rows.length * RH, W - 20, top + rows.length * RH, C.hair));

  return svg({
    w: W,
    h: H2,
    bg: C.panel,
    title: 'What changed at each rung',
    desc: rows.map(([name, cells]) => `${name}: ${cells.map((c, i) => `${steps[i].verb}, ${c}`).join('; ')}`).join('. '),
    body: o.join(''),
    css: css.join(''),
  });
}
