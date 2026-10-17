// The same system as alasmawi.dev, in one place.
//
// Three flat grounds — ink, bone and carmine — and nothing laid over them: no
// blur, no glow, no gradient, no rounded panel. A section sits on one ground
// and the next may sit on another; that change of ground is the rhythm.
//
// Archivo at three widths: condensed and heavy for headlines, normal for
// reading, wide and tracked for labels. JetBrains Mono is for data only.

export const C = {
  ink: '#0e0f12',
  panel: '#15171c',
  panel2: '#1b1d23',
  bone: '#efe9dd',
  boneDim: '#d9d2c3',
  carmine: '#b0122b',
  carmineDeep: '#7d0d1f',
  red: '#ce1126',
  rose: '#ea5f70', // Bahrain red lightened to clear 4.5:1 as text on ink
  muted: '#8d8f98',
  soft: '#a3a4ab',
  dim: '#5c5e66',
  hair: 'rgba(239,233,221,0.14)',
  hairStrong: 'rgba(239,233,221,0.28)',
  hairInk: 'rgba(14,15,18,0.16)',
  inkText: '#3a3c44',
  amber: '#f2a93b', // AWS CIC
  gold: '#c9a227', // University of Bahrain
  tiffany: '#1ccfc9', // Reboot01
};

// Same values as LANGUAGE_COLORS in the portfolio's projects.js.
export const LANG = {
  Go: '#2FC2E8',
  Rust: '#DE7B4A',
  JavaScript: '#E8C547',
  TypeScript: '#5B9BE6',
  Python: '#7BA05B',
  Shell: '#89A85B',
  HCL: '#8E7CC3',
  Jinja: '#B4523A',
  HTML: '#D9663F',
  CSS: '#7A68B8',
  Dockerfile: '#4D8FB5',
  Vue: '#41B883',
  PHP: '#777BB4',
};
export const langColor = (name) => LANG[name] ?? C.muted;

// Class → font key in data/metrics.json. Every SVG embeds only the faces it uses.
export const FACES = { d: { key: 'd' }, t: { key: 't' }, l: { key: 'l' }, b: { key: 'b' }, bb: { key: 'bb' }, m: { key: 'm' }, mb: { key: 'mb' } };
