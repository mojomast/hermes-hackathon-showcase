import * as H from '../lib.mjs';

const roman = (n) => ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'][n - 1];

export default function eoh(f) {
  const tools = f.stats.tool_names;
  return {
    title: 'Eye Of Hermes (EOH) — a live 3D globe for Hermes Agent',
    description: f.tagline,
    fonts: 'family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500;1,600&family=Space+Mono:wght@400;700',
    themeColor: '#06142a',
    body: `
<header class="chart-top">
  ${H.nav(f.slug)}
</header>
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="hero-text">
      <p class="kicker"><span>Chart No. 01</span> <span>Hermes Agent plugin · id <code>godseye</code></span></p>
      <h1 id="t">Eye <em>of</em> Hermes</h1>
      <p class="lede">${H.esc(f.tagline)}</p>
      <dl class="legend-mini">
        <div><dt>Release</dt><dd>${f.release.tag}</dd></div>
        <div><dt>Tools</dt><dd>${f.stats.tools}</dd></div>
        <div><dt>Schema</dt><dd>${f.stats.tokens_o200k.toLocaleString('en-US')} o200k</dd></div>
        <div><dt>Hermes</dt><dd>${H.esc(f.requires_hermes)}</dd></div>
      </dl>
      <p class="cta"><a href="#film">Watch the survey film</a> <a href="#install">Install</a></p>
    </div>
    <div class="globe-wrap" aria-hidden="true">
      <canvas id="globe" width="720" height="720"></canvas>
      <img class="eye" src="../thumbs/eoh/eoh-logo-512.t.webp" width="512" height="512" alt="">
      <p class="globe-note">Graticule at 15°. Pins mark places shown in the plugin's screenshots.</p>
    </div>
  </section>

  <section class="plate what" data-reveal aria-labelledby="what-h">
    <p class="coord">45°30′N 73°33′W</p>
    <h2 id="what-h">The survey</h2>
    <div class="cols">
      <p>Eye Of Hermes puts a live 3D globe in a Hermes Desktop or Webapp pane, and hands the agent the controls. The plugin (id <code>godseye</code>) drives a running <a href="https://github.com/mojomast/gods-eye-view">God's Eye View</a> checkout. Hermes can fly the camera, drop pins, draw routes and areas, query public data feeds, and leave watches running while you keep talking.</p>
      <p>HUD summaries are written with the Hermes model through <code>ctx.llm</code>. Overlays live in a sidebar and export as <code>eoh.overlays.v1</code>. Some things are refused outright: person search, face recognition, and tracking an individual.</p>
    </div>
  </section>

  <section class="plate legend" data-reveal aria-labelledby="legend-h">
    <p class="coord">35°41′N 139°41′E</p>
    <h2 id="legend-h">Legend</h2>
    <ul class="legend-list">
      ${f.features.map((x, i) => `<li><span class="sym sym-${i % 6}" aria-hidden="true"></span><p>${H.inline(x)}</p></li>`).join('\n      ')}
    </ul>
    <h3 class="tools-h">The eleven instruments</h3>
    <ol class="tools">
      ${tools.map((t, i) => `<li><span class="deg">${String(i * 30).padStart(3, '0')}°</span><code>${t}</code></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="plate route" data-reveal aria-labelledby="route-h">
    <p class="coord">33°52′S 151°12′E</p>
    <h2 id="route-h">Waypoints <span>· what to ask it for</span></h2>
    <ol class="waypoints">
      ${f.use_cases.map((u, i) => `<li><span class="wp">WP ${String(i + 1).padStart(2, '0')}</span><p>${H.inline(u)}</p></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="plate film" id="film" data-reveal aria-labelledby="film-h">
    <p class="coord">52°31′N 13°24′E</p>
    <h2 id="film-h">Survey film</h2>
    ${H.video(f)}
  </section>

  <section class="plate soundings" data-reveal aria-labelledby="stats-h">
    <p class="coord">32°43′N 117°09′W</p>
    <h2 id="stats-h">Soundings</h2>
    <ul class="stats">
      ${H.statList(f).map(([v, l]) => `<li><strong>${H.esc(v)}</strong><span>${H.esc(l)}</span></li>`).join('\n      ')}
    </ul>
    <p class="note">${H.esc(f.stats.tokens_note)} ${H.esc(f.stats.tests_note)}</p>
    <div class="scale" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><em>0 · 7,670 tokens</em></div>
  </section>

  <section class="plate atlas" data-reveal aria-labelledby="atlas-h">
    <p class="coord">51°30′N 0°07′W</p>
    <h2 id="atlas-h">Atlas plates</h2>
    ${H.gallery(f.slug, { cls: 'gallery', label: 'Eye Of Hermes screenshots' })}
  </section>

  <section class="plate install-plate" id="install" data-reveal aria-labelledby="install-h">
    <p class="coord">00°00′N 00°00′E</p>
    <h2 id="install-h">Field instructions</h2>
    ${H.install(f)}
    <h3>Sources</h3>
    ${H.links(f)}
  </section>
</main>
${H.footer(f)}
<script src="globe.js" defer></script>
`,
    roman,
  };
}
