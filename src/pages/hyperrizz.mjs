import * as H from '../lib.mjs';

const NOTES = [
  ['A subject-derived visual identity', 'An editorial arc and readable holds'],
  ['Strong type and composition', 'Meaningful variation between shots'],
  ['Convincing media treatment', 'Honest provenance and sharp source pixels'],
  ['Music and motion', 'Correct downbeat, phrase phase and audio levels'],
];

export default function hyperrizz(f) {
  const t = f.stats.tests;
  return {
    title: 'hyperrizz — agent-led HyperFrames films for Hermes Agent',
    description: f.tagline,
    fonts: 'family=Bebas+Neue&family=Courier+Prime:ital,wght@0,400;0,700;1,400',
    themeColor: '#0c0c0f',
    body: `
<div class="grain" aria-hidden="true"></div>
${H.nav(f.slug)}
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="frame">
      ${H.img(f.slug, 'broadcast-lab.png', { alt: '', eager: true, cls: 'plate' })}
      <div class="hud" aria-hidden="true">
        <span class="rec">● REC</span>
        <span class="tc" id="tc">00:00:00:00</span>
        <span class="safe"></span>
      </div>
      <div class="title-card">
        <p class="pre">A Hermes Agent plugin by Kyle Durepos</p>
        <h1 id="t">Hyperrizz</h1>
        <p class="lede">${H.esc(f.tagline)}</p>
      </div>
    </div>
    <dl class="slate" aria-label="Production slate">
      <div><dt>Prod.</dt><dd>hyperrizz</dd></div>
      <div><dt>Roll</dt><dd>${f.release.tag}</dd></div>
      <div><dt>Tools</dt><dd>${f.stats.tools}</dd></div>
      <div><dt>Starter</dt><dd>HyperFrames 0.9.23</dd></div>
      <div><dt>Verifier</dt><dd>${t.ffmpeg_regression_tests} FFmpeg tests</dd></div>
      <div><dt>Hermes</dt><dd>${H.esc(f.requires_hermes)}</dd></div>
    </dl>
  </section>

  <section class="script" data-reveal aria-labelledby="what-h">
    <h2 id="what-h" class="slug">INT. HERMES CHAT — CONTINUOUS</h2>
    <p class="action">You tell Hermes the story. Hermes researches, art-directs, writes the scenes, builds a <a href="https://hyperframes.heygen.com">HyperFrames</a> project, checks it and iterates. You watch the real project in a live review pane, with playback, sound, a scrubber and frame stepping, before anyone spends time encoding an MP4.</p>
    <p class="paren">(you pause on a moment)</p>
    <p class="action">You write what you want changed and hit <b>Iterate with Hermes</b>. The note carries the project, revision and exact frame back into the conversation. The next successful build refreshes the preview. When you want the controls yourself, <b>Full editor</b> opens the actual HyperFrames Studio inside the pane.</p>
    <p class="action">Production is local: Node, Chromium and FFmpeg, with no API keys and no hosted generation.</p>
    <p class="trans">CUT TO:</p>
  </section>

  <section class="shots" data-reveal aria-labelledby="shots-h">
    <h2 id="shots-h" class="slug">SHOT LIST</h2>
    <table>
      <thead><tr><th scope="col">Shot</th><th scope="col">Description</th></tr></thead>
      <tbody>
        ${f.features.map((x, i) => `<tr><th scope="row">${i + 1}A</th><td>${H.inline(x)}</td></tr>`).join('\n        ')}
      </tbody>
    </table>
    <ul class="tools">${f.stats.tool_names.map((n) => `<li><code>${n}</code></li>`).join('')}</ul>
  </section>

  <section class="boards" data-reveal aria-labelledby="board-h">
    <h2 id="board-h" class="slug">STORYBOARD — WHAT YOU CAN MAKE</h2>
    <ol class="panels">
      ${f.use_cases.map((u, i) => `<li><div class="pframe" aria-hidden="true"><span>${String(i + 1).padStart(2, '0')}</span></div><p>${H.inline(u)}</p></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="notes" data-reveal aria-labelledby="notes-h">
    <h2 id="notes-h" class="slug">DIRECTOR'S NOTES</h2>
    <p class="action">From the README: reuse the engineering, invent the film.</p>
    <table class="two">
      <thead><tr><th scope="col">A good-looking frame needs…</th><th scope="col">A finished film also needs…</th></tr></thead>
      <tbody>${NOTES.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody>
    </table>
  </section>

  <section class="dailies" data-reveal aria-labelledby="dailies-h">
    <h2 id="dailies-h" class="slug">DAILIES</h2>
    <div class="monitor">${H.video(f)}</div>
  </section>

  <section class="strip-sec" data-reveal aria-labelledby="strip-h">
    <h2 id="strip-h" class="slug">CONTACT PRINTS</h2>
    <div class="strip">${H.gallery(f.slug, { cls: 'gallery', label: 'hyperrizz stills and screenshots' })}</div>
  </section>

  <section class="callsheet" data-reveal aria-labelledby="call-h">
    <h2 id="call-h" class="slug">CALL SHEET — INSTALL</h2>
    ${H.install(f)}
  </section>

  <section class="credits" data-reveal aria-labelledby="cred-h">
    <h2 id="cred-h">Credits</h2>
    <dl class="roll">
      ${H.statList(f).map(([v, l]) => `<div><dt>${H.esc(l)}</dt><dd>${H.esc(v)}</dd></div>`).join('\n      ')}
    </dl>
    <p class="cred-note">${H.esc(t.note)}</p>
    ${H.links(f)}
  </section>
</main>
${H.footer(f)}
<script src="tc.js" defer></script>
`,
  };
}
