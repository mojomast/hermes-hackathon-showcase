import * as H from '../lib.mjs';

const TEMPLATES = ['topdown_farming', 'topdown_shooter', 'dungeon_crawler', 'side_platformer'];

export default function assetrizz(f) {
  const lib = f.stats.library;
  const rel = f.related_repos[0];
  return {
    title: 'assetrizz — 14,641 original 2D game assets beside Hermes Agent',
    description: f.tagline,
    fonts: 'family=Silkscreen:wght@400;700&family=DotGothic16',
    themeColor: '#10204f',
    body: `
${H.nav(f.slug)}
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="win title-win">
      <p class="win-t">NEW GAME</p>
      <h1 id="t">assetrizz</h1>
      <p class="lede">${H.esc(f.tagline)}</p>
      <p class="counter"><span class="big" data-count="${lib.pngs}">${lib.pngs.toLocaleString('en-US')}</span> original PNGs · <b>${lib.style_packs}</b> style packs · about 1.65 GB</p>
      <ul class="menu" aria-label="Jump to">
        <li><a href="#cutscene">Watch cutscene</a></li>
        <li><a href="#quests">Quest log</a></li>
        <li><a href="#save">Install</a></li>
      </ul>
    </div>
    <figure class="win scene-win">
      <p class="win-t">EXAMPLE SCENE · pixel_32</p>
      ${H.img(f.slug, 'example-scene.png', { alt: H.altFor(f.slug, 'example-scene.png'), eager: true, cls: 'pix' })}
    </figure>
  </section>

  <section class="win what" data-reveal aria-labelledby="what-h">
    <h2 id="what-h" class="win-t">STORY SO FAR</h2>
    <p>assetrizz pairs a Hermes plugin with an original 2D game-asset library: ${lib.pngs.toLocaleString('en-US')} PNGs across ${lib.style_packs} style packs, pinned at <a href="${rel.release_url}">mojomast/assetrizz ${rel.release_tag}</a>. The plugin ships a 15 MB scannable catalog and two compact tools, <code>assetrizz_search</code> and <code>assetrizz_scene</code>. Ask for a meadow, a ranger or a roadside inn: the agent searches the catalog, places tiles and props, and renders a PNG you can preview in a dark Desktop pane.</p>
    <p>The art itself stays out of your plugins folder. Single PNGs are fetched on demand from the pinned tag, SSRF-guarded and SHA-256 verified. A bulk download is something only you can start.</p>
  </section>

  <section class="stages" data-reveal aria-labelledby="stage-h">
    <h2 id="stage-h" class="sec-h">SELECT STAGE <span>compose-v2 templates</span></h2>
    <ul class="stage-list">
      ${TEMPLATES.map((s, i) => `<li><span class="lv">STAGE ${i + 1}</span><code>${s}</code></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="win items" data-reveal aria-labelledby="feat-h">
    <h2 id="feat-h" class="win-t">ITEMS</h2>
    <ul class="item-list">
      ${f.features.map((x, i) => `<li><span class="slot s${i}" aria-hidden="true"></span><p>${H.inline(x)}</p></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="win quests" id="quests" data-reveal aria-labelledby="q-h">
    <h2 id="q-h" class="win-t">QUEST LOG</h2>
    <ol class="quest-list">
      ${f.use_cases.map((u, i) => `<li><span class="qm" aria-hidden="true">!</span><p><b>Quest ${i + 1}.</b> ${H.inline(u)}</p></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="cut" id="cutscene" data-reveal aria-labelledby="cut-h">
    <h2 id="cut-h" class="sec-h">CUTSCENE <span>the posted demo</span></h2>
    <div class="win vid-win">${H.video(f)}</div>
  </section>

  <section class="win status" data-reveal aria-labelledby="st-h">
    <h2 id="st-h" class="win-t">STATUS</h2>
    <dl class="stat-grid">
      ${H.statList(f).map(([v, l]) => `<div><dt>${H.esc(l)}</dt><dd>${H.esc(v)}</dd></div>`).join('\n      ')}
    </dl>
    <p class="small">${H.esc(f.stats.tests_note)} ${H.esc(f.stats.tokens_note)}</p>
  </section>

  <section class="inv" data-reveal aria-labelledby="inv-h">
    <h2 id="inv-h" class="sec-h">INVENTORY <span>screenshots</span></h2>
    ${H.gallery(f.slug, { cls: 'inv-grid', label: 'assetrizz screenshots' })}
  </section>

  <section class="win save" id="save" data-reveal aria-labelledby="save-h">
    <h2 id="save-h" class="win-t">SAVE FILE · INSTALL</h2>
    ${H.install(f)}
    <h3 class="win-sub">WARP POINTS</h3>
    ${H.links(f)}
  </section>
</main>
${H.footer(f)}
<script src="count.js" defer></script>
`,
  };
}
