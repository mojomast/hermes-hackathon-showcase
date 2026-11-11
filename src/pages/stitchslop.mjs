import * as H from '../lib.mjs';

const TOOLS = [
  ['stitchslop_status', 'Bridge, tab, Chrome, relay and pane in one call. Start here when something looks wrong.'],
  ['stitchslop_connect', 'Starts the bridge and waits for the tab using the stored pairing. Refuses a model-supplied token.'],
  ['stitchslop_call', 'Runs one app verb (scene.describe, background.digitize, design.export, …). Images and exports are written to disk and returned as paths.'],
  ['stitchslop_browser', 'Starts and stops the pane: Xvfb + Chrome + capture relay, returns viewerUrl.'],
];

export default function stitchslop(f) {
  return {
    title: 'stitchslop — drive the Stitch Slop embroidery editor from Hermes Agent',
    description: f.tagline,
    fonts: 'family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Atkinson+Hyperlegible:wght@400;700',
    themeColor: '#efe7d6',
    body: `
${H.nav(f.slug)}
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="hero-copy">
      <p class="eyebrow">Hermes Agent plugin · ${f.release.tag}</p>
      <h1 id="t" class="sr-only">stitchslop</h1>
      <svg class="stitched" viewBox="0 0 620 150" role="img" aria-label="stitchslop">
        <text x="6" y="118" class="satin">stitchslop</text>
        <text x="6" y="118" class="run">stitchslop</text>
      </svg>
      <p class="lede">Drive the embroidery app from chat.</p>
      <p class="sub">${H.esc(f.tagline)}</p>
      <p class="spools">
        <span style="--c:#1d3a8a">${f.stats.tools} tools</span>
        <span style="--c:#b4532a">${f.stats.tokens_o200k} o200k tokens</span>
        <span style="--c:#3c7a52">0 core deps</span>
        <span style="--c:#d9a441">DST · PES</span>
      </p>
    </div>
    <div class="hoop">
      <div class="hoop-in">
        ${H.img(f.slug, 'stitch.jpg', { alt: H.altFor(f.slug, 'stitch.jpg'), eager: true })}
      </div>
      <span class="screw" aria-hidden="true"></span>
      <p class="hoop-cap">Made end to end from a chat session, as shown in the README.</p>
    </div>
  </section>

  <section class="swatch what" data-reveal aria-labelledby="what-h">
    <h2 id="what-h">Why it exists</h2>
    <div class="two">
      <p><a href="https://www.stitchslop.com">Stitch Slop</a> is a browser embroidery digitizer whose designs live in a tab. A chat agent can't reach that tab: the site refuses to be framed, and even if it didn't, an agent can't click.</p>
      <p>This plugin solves both halves. The tab dials out over Stitch Slop's published loopback WebSocket bridge, which this plugin implements in the standard library. A plugin-owned Chrome draws the real app on a private X display, and the pane streams it and forwards your clicks and keys back. You see the design, the agent edits it, and you take over whenever you like.</p>
    </div>
  </section>

  <section class="patches-sec" data-reveal aria-labelledby="feat-h">
    <h2 id="feat-h">Patches</h2>
    <ul class="patches">
      ${f.features.map((x, i) => `<li class="p${i % 4}"><p>${H.inline(x)}</p></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="swatch pattern" data-reveal aria-labelledby="uc-h">
    <h2 id="uc-h">Pattern instructions</h2>
    <ol class="steps">
      ${f.use_cases.map((u) => `<li><p>${H.inline(u)}</p></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="tools-sec" data-reveal aria-labelledby="tools-h">
    <h2 id="tools-h">The four needles</h2>
    <dl class="needles">
      ${TOOLS.map(([n, d]) => `<div><dt><code>${n}</code></dt><dd>${H.inline(d)}</dd></div>`).join('\n      ')}
    </dl>
    <p class="aside">The app owns the command list: over 80 verbs. <code>stitchslop_call("x.list")</code> answers with every real name.</p>
  </section>

  <section class="swatch post" data-reveal aria-labelledby="post-h">
    <h2 id="post-h">The submission post</h2>
    ${H.video(f)}
  </section>

  <section class="board" data-reveal aria-labelledby="gal-h">
    <h2 id="gal-h">Pinboard</h2>
    ${H.gallery(f.slug, { cls: 'pins', label: 'stitchslop screenshots' })}
  </section>

  <section class="label-sec" data-reveal aria-labelledby="inst-h">
    <div class="care">
      <h2 id="inst-h">Care label</h2>
      ${H.install(f)}
      <ul class="stat-line">
        ${H.statList(f).map(([v, l]) => `<li><strong>${H.esc(v)}</strong> ${H.esc(l)}</li>`).join('\n        ')}
      </ul>
      <p class="tn">${H.esc(f.stats.tests_note)}</p>
    </div>
    <div class="ribbons">
      <h3>Threads to follow</h3>
      ${H.links(f)}
    </div>
  </section>
</main>
${H.footer(f)}
`,
  };
}
