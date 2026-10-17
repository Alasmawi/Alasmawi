#!/usr/bin/env node
// Builds the profile: pulls live numbers from GitHub, renders every card in
// render/ to assets/generated/*.svg, then renders README.md from
// README.template.md. Run with `npm run build` (or `node profile/build.mjs`).
//
//   --offline   skip the API and render from cache/github.json
//   --only=a,b  render just these cards (README is still written)
//   --still     no motion: render each card's resting frame, for visual checks

import { writeFileSync, readFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as content from './content.mjs';
import { loadGithub } from './lib/github.mjs';
import { hero } from './render/hero.mjs';
import { button, header, footer } from './render/chrome.mjs';
import { about, now } from './render/terminal.mjs';
import { pillars } from './render/pillars.mjs';
import { project } from './render/projects.mjs';
import { ladder } from './render/ladder.mjs';
import { experience, education } from './render/timeline.mjs';
import { explorer } from './render/explorer.mjs';
import { stack } from './render/stack.mjs';
import { telemetry, city } from './render/telemetry.mjs';
import { stackDocs, esc } from './lib/svg.mjs';
import { rung, evolution } from './render/ship.mjs';

const ROOT = new URL('../', import.meta.url);
const OUT = new URL('assets/generated/', ROOT);
const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
if (args.includes('--offline')) process.env.PROFILE_OFFLINE = '1';
if (args.includes('--still')) process.env.PROFILE_STILL = '1';

const started = Date.now();
const nowDate = new Date(process.env.PROFILE_DATE ?? Date.now());
const sha = (() => {
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return 'local'; }
})();

console.log('profile build');
const gh = await loadGithub(content.USER).catch((e) => (console.warn(`  ! ${e.message}`), null));
console.log(`  github data: ${gh ? gh.source : 'none'}${gh ? ` (fetched ${gh.fetchedAt})` : ''}`);

// Every card, by output name. A section's header is stacked onto its card so
// they ship as one image.
const H = (n, title, note, ground) => header({ n, title, note, ground, total: SECTIONS });
const SECTIONS = 8;
const cards = {
  hero: () => hero({ person: content.PERSON, build }),
  ...Object.fromEntries(content.LINKS.map((l) => [`btn-${l.id}`, () => button(l)])),
  about: () => stackDocs([H('01', 'About', 'Full-stack engineer, cloud underneath. The short version, as a shell session.'), about({ session: content.ABOUT })]),
  focus: () => stackDocs([H('02', 'What I do', 'Four kinds of work, each with the projects that show it.', 'bone'), pillars({ pillars: content.PILLARS })]),
  'h-work': () => H('03', 'Selected work', 'Two systems built for government organizations in Bahrain, then personal and program projects.'),
  ...Object.fromEntries(content.FEATURED.map((p, i) => [`work-${p.id}`, () => project(p, i)])),
  ladder: () => stackDocs([H('04', 'Five ways to ship', 'One microservices backend, deployed five times. Each repo is the same system one rung further up.'), ladder({ steps: content.LADDER })]),
  ...Object.fromEntries(content.LADDER.map((s, i) => [`rung-${s.n}`, () => rung(s, i, content.LADDER.length)])),
  evolution: () => evolution({ steps: content.LADDER, rows: content.EVOLUTION }),
  experience: () => stackDocs([H('05', 'Experience', 'Two internships in 2026: cloud and IoT, then network and information security.'), experience({ roles: content.EXPERIENCE, today: nowDate })]),
  education: () => education({ schools: content.EDUCATION, today: nowDate }),
  more: () => stackDocs([H('06', 'More projects', 'A web server, a shell, a ray tracer, games and a front-end framework, each written without the library that usually does the work.'), explorer({ projects: content.MORE })]),
  stack: () => stackDocs([H('07', 'Stack', 'What I reach for, grouped by where it sits in a system.', 'bone'), stack({ groups: content.STACK })]),
  telemetry: () => (gh ? stackDocs([H('08', 'Telemetry', 'Pulled from the GitHub API by a scheduled Action and redrawn twice a day.'), telemetry({ gh, today: nowDate }), city({ gh })]) : null),
  now: () => now({ entries: content.NOW }),
  footer: () => footer({ person: content.PERSON, build }),
};

const build = {
  date: nowDate.toISOString().slice(0, 10),
  year: nowDate.getUTCFullYear(),
  stamp: `${nowDate.toISOString().slice(0, 16).replace('T', ' ')} UTC · ${sha}`,
  count: Object.keys(cards).length,
};

mkdirSync(OUT, { recursive: true });
let bytes = 0;
const written = new Set();
for (const [name, render] of Object.entries(cards)) {
  if (only && !only.includes(name)) { written.add(`${name}.svg`); continue; }
  const doc = render();
  const out = doc && String(doc);
  if (!out) { console.warn(`  - ${name}: skipped (no data)`); continue; }
  writeFileSync(new URL(`${name}.svg`, OUT), out);
  written.add(`${name}.svg`);
  bytes += out.length;
  console.log(`  ✓ ${name.padEnd(14)} ${(out.length / 1024).toFixed(1).padStart(6)} KB`);
}
// Drop cards that no longer exist, but keep what the workflow puts here (snake).
if (!only) for (const f of readdirSync(OUT)) if (f.endsWith('.svg') && !written.has(f) && !f.startsWith('snake')) unlinkSync(new URL(f, OUT));

// README: {{name}} placeholders, filled from content and the build.
const tpl = readFileSync(new URL('profile/README.template.md', ROOT), 'utf8');
const vars = {
  ...Object.fromEntries(Object.entries(content.PERSON).map(([k, v]) => [`person.${k}`, v])),
  'build.date': build.date,
  'build.stamp': build.stamp,
  rungs: content.LADDER.map((s) => `<a href="https://github.com/${content.USER}/${s.repo}"><img src="./assets/generated/rung-${s.n}.svg" width="100%" alt="${esc(`${s.n} ${s.verb}, ${s.repo}: ${s.delta} Status: ${s.status.label}.`)}" /></a>`).join('\n<br/><br/>\n'),
  more_links: content.MORE.map((p) => `[\`${p.name}\`](https://github.com/${content.USER}/${p.name})`).join(' · '),
  experience_details: content.EXPERIENCE.slice().reverse().map((r) => `<details>\n<summary><b>${r.role}</b> · ${r.org}</summary>\n<br/>\n\n${r.points.map((p) => `- ${p}`).join('\n')}\n\n</details>`).join('\n\n'),
  work_cards: content.FEATURED.map((p) => `<a href="${p.href}"><img src="./assets/generated/work-${p.id}.svg" width="100%" alt="${esc(`${p.name}: ${p.summary}`)}" /></a>`).join('\n<br/><br/>\n'),
  // The snake comes from the workflow (Platane/snk); until it has run once, leave it out.
  snake: existsSync(new URL('snake-dark.svg', OUT))
    ? `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="./assets/generated/snake-dark.svg" />\n  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/snake-light.svg" />\n  <img src="./assets/generated/snake-dark.svg" width="100%" alt="The contribution graph being eaten by a snake." />\n</picture>`
    : '',
  buttons: content.LINKS.map((l) => `<a href="${l.href}"><img src="./assets/generated/btn-${l.id}.svg" height="46" alt="${l.label}" /></a>`).join('&nbsp;'),
};
const readme = tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => {
  if (!(k in vars)) throw new Error(`README.template.md: unknown placeholder ${m}`);
  return vars[k];
});
writeFileSync(new URL('README.md', ROOT), readme);

console.log(`  ✓ README.md      ${(readme.length / 1024).toFixed(1).padStart(6)} KB`);
console.log(`  ${written.size} svgs, ${(bytes / 1024).toFixed(0)} KB rendered in ${Date.now() - started} ms`);
