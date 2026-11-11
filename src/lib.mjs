import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { galleries } from './captions.mjs';

export const ROOT = new URL('..', import.meta.url).pathname;

export const ORDER = [
  'eoh', 'hermagotchi', 'poptart', 'hyperrizz', 'stitchslop',
  'hermes-plugin-dev', 'assetrizz', 'photo-to-part', 'templeos', 'bundlebees',
];

export const facts = Object.fromEntries(
  ORDER.map((s) => [s, JSON.parse(readFileSync(join(ROOT, 'assets', s, 'facts.json'), 'utf8'))]),
);

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Wrap identifiers such as godseye_* or ctx.llm in <code> after escaping.
export const inline = (s) =>
  esc(s).replace(
    /(\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\*?(?:\([^)]*\))?|\bctx\.[a-z]+|\beoh\.overlays\.v1\b|\b[a-z_]+=[a-z_]+\b|--[a-z-]+)/g,
    '<code>$1</code>',
  );

export const duration = (sec) => {
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const dimCache = new Map();
export function dims(rel) {
  if (dimCache.has(rel)) return dimCache.get(rel);
  let d = [0, 0];
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
      'stream=width,height', '-of', 'csv=p=0', join(ROOT, rel)]).toString().trim();
    d = out.split(',').map(Number);
  } catch { /* svg or unreadable: leave unsized */ }
  dimCache.set(rel, d);
  return d;
}

const stem = (f) => f.replace(/\.[^.]+$/, '');

// Paths are relative to an entry page at /<slug>/index.html.
export function imgPaths(slug, file, up = '../') {
  const orig = `assets/${slug}/img/${file}`;
  if (file.endsWith('.svg')) return { t: orig, l: orig, orig, up };
  return { t: `thumbs/${slug}/${stem(file)}.t.webp`, l: `thumbs/${slug}/${stem(file)}.l.webp`, orig, up };
}

export function img(slug, file, { alt = '', size = 'l', cls = '', eager = false, up = '../', sizes = '' } = {}) {
  const p = imgPaths(slug, file, up);
  const src = p[size];
  const [w, h] = dims(src);
  const wh = w ? ` width="${w}" height="${h}"` : '';
  const srcset = !file.endsWith('.svg') && size === 'l'
    ? ` srcset="${up}${p.t} ${dims(p.t)[0]}w, ${up}${p.l} ${w}w" sizes="${sizes || '100vw'}"` : '';
  return `<img src="${up}${src}"${srcset}${wh} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export const altFor = (slug, file) => (galleries[slug].find(([f]) => f === file) || [, ''])[1];

export function gallery(slug, { cls = 'gallery', only, label = 'Screenshots' } = {}) {
  const items = galleries[slug].filter(([f]) => !only || only.includes(f));
  return `<ul class="${cls}" data-gallery aria-label="${esc(label)}">
${items.map(([file, alt], i) => {
    const p = imgPaths(slug, file);
    return `  <li class="g-item g-${i + 1}"><figure>
    <button type="button" class="g-open" data-full="../${p.l}" data-orig="../${p.orig}" data-caption="${esc(alt)}" aria-label="Enlarge: ${esc(alt)}">${img(slug, file, { alt, size: 't' })}</button>
    <figcaption>${esc(alt)}</figcaption>
  </figure></li>`;
  }).join('\n')}
</ul>`;
}

export function xEmbed(f, { theme = 'dark' } = {}) {
  return `<div class="x-embed" data-x-embed>
  <blockquote class="twitter-tweet" data-dnt="true" data-theme="${theme}">
    <p>${esc(f.name)} submission post by @ussyverse on X.</p>
    <a href="${f.x_post}">View the submission post on X</a>
  </blockquote>
  <p class="x-fallback">No submission video was found for ${esc(f.name)}, so the X post is embedded instead. If it does not load, <a href="${f.x_post}">open the post on X</a>.</p>
</div>`;
}

export function video(f, { cls = 'vid' } = {}) {
  if (!f.video?.found) return xEmbed(f);
  const s = f.slug;
  return `<figure class="${cls}">
  <video controls preload="none" playsinline width="1280" height="720" poster="../assets/${s}/poster.jpg" aria-label="${esc(f.name)} submission video, ${duration(f.video.duration_seconds)}">
    <source src="../assets/${s}/video.mp4" type="video/mp4">
    <a href="../assets/${s}/video.mp4">Download the ${esc(f.name)} submission video (MP4)</a>
  </video>
  <figcaption>Submission video · ${duration(f.video.duration_seconds)} · <a href="${f.x_post}">original post on X</a></figcaption>
</figure>`;
}

const isCmd = (line) => /^(hermes |#|sudo |\/plugin |git |npm )/.test(line.trim());

export function install(f, { cls = 'install' } = {}) {
  const paras = f.install.split(/\n\n+/);
  const out = paras.map((p) => {
    const lines = p.split('\n');
    if (lines.every(isCmd)) {
      const code = lines.join('\n');
      return `<div class="code-wrap"><pre><code>${esc(code)}</code></pre><button type="button" class="copy" data-copy="${esc(lines.filter((l) => !l.trim().startsWith('#')).join('\n'))}">Copy</button></div>`;
    }
    return lines.map((l) => `<p>${inline(l)}</p>`).join('\n');
  });
  return `<div class="${cls}">\n${out.join('\n')}\n</div>`;
}

export function links(f, { cls = 'links' } = {}) {
  const items = [
    ['Repository', f.repo, f.repo.replace('https://github.com/', '')],
    [`Release ${f.release.tag}`, f.release.url, `${f.release.sha.slice(0, 7)}`],
    ['Submission post on X', f.x_post, '@ussyverse'],
    ['Catalog PR', f.catalog_pr, `NousResearch/hermes-agent #${f.catalog_pr.split('/').pop()}`],
    ...(f.related_repos || []).map((r) => [r.release_tag ? `${r.name} ${r.release_tag}` : r.name, r.release_url || r.url, 'related repo']),
  ];
  return `<ul class="${cls}">
${items.map(([label, href, sub]) => `  <li><a href="${href}"><span class="l-label">${esc(label)}</span> <span class="l-sub">${esc(sub)}</span></a></li>`).join('\n')}
</ul>`;
}

// Real figures only; nulls from facts.json are skipped.
export function statList(f) {
  const st = f.stats;
  const s = [];
  s.push([String(st.tools), st.tools === 1 ? 'agent tool' : 'agent tools']);
  if (st.tokens_o200k) s.push([st.tokens_o200k.toLocaleString('en-US'), 'o200k schema tokens']);
  if (typeof st.tests === 'number') s.push([String(st.tests), 'tests passed']);
  if (st.tests && typeof st.tests === 'object') {
    for (const [k, v] of Object.entries(st.tests)) {
      if (typeof v === 'number') s.push([String(v), `${k.replace(/_/g, ' ')}${/tests/.test(k) ? '' : ' tests'}`]);
    }
  }
  if (st.library) {
    s.push([st.library.pngs.toLocaleString('en-US'), 'original PNGs in the library']);
    s.push([String(st.library.style_packs), 'style packs']);
  }
  if (f.video?.found) s.push([duration(f.video.duration_seconds), 'submission video']);
  s.push([f.release.tag, 'release']);
  return s;
}

export function nav(slug, { cls = 'entry-nav' } = {}) {
  const i = ORDER.indexOf(slug);
  const prev = ORDER[(i + ORDER.length - 1) % ORDER.length];
  const next = ORDER[(i + 1) % ORDER.length];
  return `<nav class="${cls}" aria-label="Entries">
  <a class="n-prev" href="../${prev}/" rel="prev" aria-label="Previous entry: ${esc(facts[prev].name)}"><span aria-hidden="true">←</span> <span class="n-txt">${esc(facts[prev].name)}</span><span class="n-alt">Prev</span></a>
  <a class="n-home" href="../">All 10 entries <span class="n-count">${String(i + 1).padStart(2, '0')}/10</span></a>
  <a class="n-next" href="../${next}/" rel="next" aria-label="Next entry: ${esc(facts[next].name)}"><span class="n-txt">${esc(facts[next].name)}</span><span class="n-alt">Next</span> <span aria-hidden="true">→</span></a>
</nav>`;
}

export function footer(f) {
  return `<footer class="credit">
  <p>${esc(f.name)} is a community plugin by Kyle Durepos (<a href="https://github.com/mojomast">mojomast</a>, <a href="https://x.com/ussyverse">@ussyverse</a>) for <a href="https://github.com/NousResearch/hermes-agent">Hermes Agent</a>, entered in the Nous Research Hermes Agent Plugin Hackathon. It is not a Nous Research product. Screenshots and video belong to the <a href="${f.repo}">plugin repository</a> under its license.</p>
</footer>`;
}

export function fontLink(families) {
  if (!families) return '';
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families}&display=swap">`;
}

export function page({ slug, title, description, fonts, body, bodyClass = '', themeColor = '#000', up = '../', script = '' }) {
  const css = slug ? `<link rel="stylesheet" href="style.css">` : `<link rel="stylesheet" href="index.css">`;
  const ogImg = slug && existsSync(join(ROOT, 'assets', slug, 'poster.jpg')) ? `assets/${slug}/poster.jpg` : null;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="${themeColor}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${ogImg ? `<meta property="og:image" content="${up}${ogImg}">` : ''}
${fontLink(fonts)}
<link rel="stylesheet" href="${up}shared/base.css">
${css}
<script src="${up}shared/site.js" defer></script>
${script}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${body}
<dialog class="lightbox" aria-label="Image viewer">
  <figure><img alt=""><figcaption></figcaption></figure>
  <div class="lb-bar">
    <button type="button" class="lb-prev" aria-label="Previous image">←</button>
    <span class="lb-count" aria-live="polite"></span>
    <button type="button" class="lb-next" aria-label="Next image">→</button>
    <a class="lb-orig" href="#">Original</a>
    <button type="button" class="lb-close" aria-label="Close image viewer">✕</button>
  </div>
</dialog>
</body>
</html>
`;
}
