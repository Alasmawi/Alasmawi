# profile/

The generator behind [github.com/Alasmawi](https://github.com/Alasmawi). It renders every image on the profile as a hand-written SVG and then writes the root `README.md` from a template. It has no dependencies, only Node 20+.

```bash
npm run build            # live numbers from the GitHub API (GITHUB_TOKEN, or `gh auth token`)
npm run build:offline    # render from cache/github.json
node profile/build.mjs --still    # no motion: each card's resting frame, for visual checks
node profile/build.mjs --only=hero,about
```

`.github/workflows/profile.yml` runs the build twice a day and on every change in here, draws the contribution snake, and commits the results.

## Layout

| Path | What's in it |
|:--|:--|
| `content.mjs` | Every word on the profile. Kept in step with alasmawi.dev, so edit copy here. |
| `README.template.md` | The README, with `{{placeholders}}` the build fills in. |
| `build.mjs` | Fetches data, renders each card to `assets/generated/`, writes `README.md`. |
| `render/` | One module per card: hero, terminal sessions, pillars, project cards, isometric ladder, timelines, explorer, stack, telemetry. |
| `lib/svg.mjs` | The document wrapper (embeds only the fonts a card uses, shared keyframes, reduced motion) and drawing helpers. |
| `lib/text.mjs` | Measures and wraps text using the embedded fonts' real advance widths. |
| `lib/iso.mjs` | Isometric projection and flat-shaded boxes. |
| `lib/github.mjs` | GraphQL queries, streaks, language share, with `cache/github.json` as the fallback. |
| `fonts/`, `data/metrics.json` | Archivo pinned to the site's four styles and cut down to about 6 KB each, plus JetBrains Mono. Rebuild them with `tools/fonts.py`. |
| `data/icons.json` | The simple-icons (CC0) brand paths the stack card uses. |

## Rules the cards follow

- They use the same system as the site: three flat grounds (ink, bone and carmine) with no gradients, glow or rounded panels. Archivo is condensed for headlines, normal for reading and wide for labels. Mono is used only for data.
- GitHub serves README images through a proxy as plain `<img>`, so each SVG embeds its own fonts and images and runs no scripts.
- Every animation ends on its element's resting state, so with reduced motion on, or in `--still` builds, the card is complete rather than blank.
