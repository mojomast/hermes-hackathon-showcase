import * as H from '../lib.mjs';

const OPS = [
  ['list', '{}', 'List tracks'],
  ['get', '{trackId}', 'Read one track (code, tempo, sections, revision)'],
  ['create', '{title, code, tempo, sections}', 'New track. Tempo 20–400'],
  ['update', '{trackId, expectedRevision, changes}', 'Change title, code, tempo or sections'],
  ['update_section', '{trackId, expectedRevision, sectionId, section}', 'Edit one section'],
  ['sections', '{trackId}', "List a track's sections"],
  ['snapshot', '{trackId, expectedRevision}', 'Save a snapshot of the current revision'],
  ['snapshots', '{trackId}', 'List snapshots'],
  ['restore', '{trackId, snapshotId, expectedRevision}', 'Restore a snapshot'],
  ['analyze', '{trackId}', 'Static counts (no audio analysis)'],
  ['export', '{trackId}', 'Export the code (never audio)'],
];

const ROWS = [
  ['bd', 'x...x...x...x..x'],
  ['sd', '....x.......x...'],
  ['hh', '..x...x...x...xx'],
  ['blip', 'x..x..x.....x.x.'],
];

export default function poptart(f) {
  const t = f.stats.tests;
  return {
    title: 'poptart — a Strudel live-coding studio for Hermes Agent',
    description: f.tagline,
    fonts: 'family=Bricolage+Grotesque:opsz,wght@12..96,800&family=JetBrains+Mono:ital,wght@0,400;0,700;1,400',
    themeColor: '#0e0f0c',
    body: `
<header class="transport" aria-label="Page toy transport">
  <span class="brand">poptart<span class="dot" aria-hidden="true">●</span></span>
  <button type="button" class="t-play" aria-pressed="false">▶ Play / apply</button>
  <button type="button" class="t-stop">■ Stop</button>
  <button type="button" class="t-mute" aria-pressed="false">Mute</button>
  <label class="t-bpm">BPM <input type="number" min="60" max="200" value="126" inputmode="numeric"></label>
  <span class="t-state" aria-live="polite">stopped · nothing plays until you press Play</span>
</header>
<main id="main">
  <section class="hero" aria-labelledby="t">
    <p class="comment">// ${H.esc(f.catalog_title)} · catalog id <code>${f.catalog_name}</code> · ${f.release.tag}</p>
    <h1 id="t" class="word" aria-label="poptart">${[...'poptart'].map((c, i) => `<span style="--i:${i}" aria-hidden="true">${c}</span>`).join('')}</h1>
    <p class="lede">${H.esc(f.tagline)}</p>
    <div class="seq" role="group" aria-labelledby="seq-h">
      <p id="seq-h" class="seq-h"><span class="kw">toy</span> a 16-step pattern on this page, made with Web Audio. It isn't poptart, it borrows the idea: edit, press Play, watch the tokens light up.</p>
      ${ROWS.map(([name, pat], r) => `<div class="row" data-row="${name}">
        <span class="rname">${name}</span>
        <div class="steps">${[...pat].map((c, i) => `<button type="button" class="st${i % 4 === 0 ? ' beat' : ''}" aria-pressed="${c === 'x'}" aria-label="${name} step ${i + 1}"></button>`).join('')}</div>
        <code class="mini" aria-label="${name} mini-notation"></code>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="pane why" data-reveal aria-labelledby="why-h">
    <h2 id="why-h"><span class="sec">section</span> "Why poptart"</h2>
    <div class="lines">
      <p>Strudel is a fantastic way to make music in code. poptart turns it into a <em>workspace</em>: tracks that persist, revisions that guard against overwrites, sections you can switch between, and a clean agent API.</p>
      <p>Your Hermes agent can draft a beat, add a break or change the tempo. You stay in control, because nothing plays until <em>you</em> press Play.</p>
      <p class="c">// built on Strudel by the TidalCycles community · AGPL-3.0-or-later</p>
    </div>
  </section>

  <section class="pane feats" data-reveal aria-labelledby="feat-h">
    <h2 id="feat-h"><span class="sec">section</span> "Main"</h2>
    <ol class="lines code-lines">
      ${f.features.map((x) => `<li><span class="op">+</span> ${H.inline(x)}</li>`).join('\n      ')}
    </ol>
  </section>

  <section class="pane ops" data-reveal aria-labelledby="ops-h">
    <h2 id="ops-h"><span class="sec">tool</span> poptart_studio({ op, input })</h2>
    <p class="note">One tool, eleven ops, a ${f.stats.tokens_o200k}-token schema. There is deliberately no delete, shell, remote-playback or audio-export op, and agent edits never auto-play.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th scope="col">op</th><th scope="col">input</th><th scope="col">what it does</th></tr></thead>
        <tbody>
          ${OPS.map(([o, i, d]) => `<tr><th scope="row"><code>${o}</code></th><td><code>${H.esc(i)}</code></td><td>${H.esc(d)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="pane library" data-reveal aria-labelledby="lib-h">
    <h2 id="lib-h"><span class="sec">library</span> things to make</h2>
    <ul class="tracks">
      ${f.use_cases.map((u, i) => `<li><span class="tno">track ${String(i + 1).padStart(2, '0')}</span><p>${H.inline(u)}</p><span class="bars" aria-hidden="true">${'<i></i>'.repeat(12)}</span></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="pane demo" data-reveal aria-labelledby="demo-h">
    <h2 id="demo-h"><span class="sec">section</span> "Break" · the demo</h2>
    ${H.video(f)}
  </section>

  <section class="pane meters" data-reveal aria-labelledby="stats-h">
    <h2 id="stats-h"><span class="sec">analyze</span> static counts</h2>
    <ul class="readouts">
      ${H.statList(f).map(([v, l]) => `<li><strong>${H.esc(v)}</strong><span>${H.esc(l)}</span></li>`).join('\n      ')}
    </ul>
    <p class="note">${H.esc(t.note)}</p>
  </section>

  <section class="pane snaps" data-reveal aria-labelledby="snap-h">
    <h2 id="snap-h"><span class="sec">snapshots</span> screenshots</h2>
    ${H.gallery(f.slug, { cls: 'gallery', label: 'poptart screenshots' })}
  </section>

  <section class="pane inst" data-reveal aria-labelledby="inst-h">
    <h2 id="inst-h"><span class="sec">export</span> install</h2>
    ${H.install(f)}
    ${H.links(f)}
  </section>
</main>
${H.footer(f)}
${H.nav(f.slug)}
<script src="seq.js" defer></script>
`,
  };
}
