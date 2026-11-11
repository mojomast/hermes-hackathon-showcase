import * as H from '../lib.mjs';
import { galleries } from '../captions.mjs';

// The design direction of each entry page, shown on the index.
export const STUDIOS = {
  eoh: { style: 'Cartographic chart room', type: 'Cormorant Garamond / Space Mono', pal: ['#06142a', '#0b2140', '#5fd4ea', '#e3b04b', '#e9e2cc'] },
  hermagotchi: { style: 'Pocket virtual pet', type: 'Fredoka / Pixelify Sans', pal: ['#fff4d6', '#ff6fae', '#36d6a8', '#ffd23f', '#2b1d3a'] },
  poptart: { style: 'Live-coding music toy', type: 'Bricolage Grotesque / JetBrains Mono', pal: ['#0e0f0c', '#15170f', '#a3e635', '#ff5fa2', '#ffb02e'] },
  hyperrizz: { style: 'Film slate and screenplay', type: 'Bebas Neue / Courier Prime', pal: ['#0c0c0f', '#171923', '#d8f36a', '#e8b968', '#ff9474'] },
  stitchslop: { style: 'Embroidery hoop and linen', type: 'Fraunces / Atkinson Hyperlegible', pal: ['#efe7d6', '#1d3a8a', '#b4532a', '#3c7a52', '#d9a441'] },
  'hermes-plugin-dev': { style: 'Technical field manual', type: 'IBM Plex Serif / IBM Plex Mono', pal: ['#f7f6f1', '#141414', '#c8102e', '#1a7f37', '#d8d5ca'] },
  assetrizz: { style: 'JRPG menu and sprite atlas', type: 'Silkscreen / DotGothic16', pal: ['#151d30', '#2a4bb8', '#10226a', '#ffd76a', '#5bbf4a'] },
  'photo-to-part': { style: 'CAD blueprint sheet', type: 'Barlow Condensed / B612 Mono', pal: ['#0f3d73', '#0c3260', '#e8f1ff', '#9fd8ff', '#ff8a5b'] },
  templeos: { style: '640×480 16-colour VGA', type: 'Press Start 2P / VT323', pal: ['#0000aa', '#ffffff', '#ffff55', '#55ffff', '#aa0000'] },
  bundlebees: { style: 'Honeycomb hive engineering', type: 'Chakra Petch / Martian Mono', pal: ['#0b0f14', '#121821', '#f5b301', '#54d3a1', '#ffe8a3'] },
};

const thumb = (s, f) => {
  if (f.video?.found) return { src: `assets/${s}/poster.jpg`, w: 1280, h: 720, alt: `${f.name} submission video poster` };
  const [file, alt] = galleries[s][0];
  const p = H.imgPaths(s, file, '');
  const [w, h] = H.dims(p.t);
  return { src: p.t, w, h, alt };
};

export default function landing() {
  const all = H.ORDER.map((s) => H.facts[s]);
  const tools = all.reduce((n, f) => n + f.stats.tools, 0);
  const vids = all.filter((f) => f.video?.found).length;
  return {
    title: 'Ten plugins for Hermes Agent: Kyle Durepos’s hackathon entries',
    description: 'A showcase of the ten community plugins Kyle Durepos (mojomast, @ussyverse) entered in the Nous Research Hermes Agent Plugin Hackathon.',
    fonts: 'family=Big+Shoulders+Display:wght@700;900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=DM+Mono:wght@400;500',
    themeColor: '#efebe2',
    body: `
<header class="mast">
  <p class="who"><a href="https://github.com/mojomast">github/mojomast</a> <a href="https://x.com/ussyverse">x/@ussyverse</a></p>
  <p class="what">Nous Research Hermes Agent Plugin Hackathon · deadline 11 November 2026</p>
</header>
<main id="main">
  <section class="hero" aria-labelledby="t">
    <p class="big" aria-hidden="true">10</p>
    <div class="hero-txt">
      <h1 id="t">Ten plugins for <em>Hermes Agent</em>, by Kyle Durepos.</h1>
      <p class="lede">A globe the agent can fly. A pet it can raise. A studio for patterns, films, embroidery, game scenes and printable parts. A shared TempleOS screen. A hive of coding bees. And a kit for building the next one.</p>
      <p class="disclaimer">These are community plugins by Kyle Durepos (mojomast), not Nous Research products. Every page below was designed in its own style, to suit its plugin.</p>
    </div>
    <dl class="totals">
      <div><dt>Entries</dt><dd>${all.length}</dd></div>
      <div><dt>Agent tools in total</dt><dd>${tools}</dd></div>
      <div><dt>Submission videos</dt><dd>${vids}</dd></div>
      <div><dt>Catalog PRs</dt><dd>${all.length}</dd></div>
    </dl>
  </section>

  <section class="index" aria-labelledby="idx-h">
    <h2 id="idx-h" class="sec">Index of entries</h2>
    <ol class="rows">
      ${all.map((f, i) => {
        const s = f.slug; const st = STUDIOS[s]; const th = thumb(s, f);
        return `<li class="row" style="--a:${st.pal[2]};--b:${st.pal[0]}">
        <a href="${s}/" class="row-link">
          <span class="no">${String(i + 1).padStart(2, '0')}</span>
          <span class="nm"><span class="name">${H.esc(f.name)}</span><span class="tag">${H.esc(f.tagline)}</span></span>
          <span class="meta"><span>${f.stats.tools} ${f.stats.tools === 1 ? 'tool' : 'tools'}</span><span>${f.video?.found ? `video ${H.duration(f.video.duration_seconds)}` : 'X post'}</span><span>${f.release.tag}</span></span>
          <span class="thumb"><img src="${th.src}" width="${th.w}" height="${th.h}" alt="" loading="lazy" decoding="async"></span>
        </a>
        <span class="studio"><span class="sw" aria-hidden="true">${st.pal.map((c) => `<i style="background:${c}"></i>`).join('')}</span> ${H.esc(st.style)} · set in ${H.esc(st.type)}</span>
      </li>`;
      }).join('\n      ')}
    </ol>
  </section>

  <section class="grid-sec" aria-labelledby="g-h">
    <h2 id="g-h" class="sec">At a glance</h2>
    <div class="tw">
    <table>
      <thead><tr><th scope="col">Entry</th><th scope="col">Tools</th><th scope="col">Schema tokens (o200k)</th><th scope="col">Tests stated</th><th scope="col">Requires Hermes</th><th scope="col">Links</th></tr></thead>
      <tbody>
        ${all.map((f) => {
          const t = f.stats.tests;
          const tests = typeof t === 'number' ? String(t) : t ? Object.entries(t).filter(([, v]) => typeof v === 'number').map(([k, v]) => `${v} ${k.replace(/_/g, ' ').replace(/ tests$/, '')}`).join(', ') : '—';
          return `<tr><th scope="row"><a href="${f.slug}/">${H.esc(f.name)}</a></th><td>${f.stats.tools}</td><td>${f.stats.tokens_o200k ? f.stats.tokens_o200k.toLocaleString('en-US') : '—'}</td><td>${H.esc(tests)}</td><td>${H.esc(f.requires_hermes.split(' ')[0])}</td><td class="lk"><a href="${f.repo}">repo</a> <a href="${f.release.url}">${f.release.tag}</a> <a href="${f.x_post}">X</a> <a href="${f.catalog_pr}">PR</a></td></tr>`;
        }).join('\n        ')}
      </tbody>
    </table>
    </div>
    <p class="fn">— means the README and release notes don't state a figure. Nothing here is estimated.</p>
  </section>
</main>
<footer class="foot">
  <p>Built from the public asset pack in this repository. Screenshots, videos and README text belong to each plugin's repository under its own license; follow the links for sources.</p>
  <p><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent</a> is by Nous Research. These plugins and this site are community work by Kyle Durepos.</p>
</footer>
`,
  };
}
