import * as H from '../lib.mjs';

// 16x14 pixel pet drawn on the page's toy LCD (decorative).
const PET = [
  '......kkkk......',
  '....kkggggkk....',
  '...kggggggggk...',
  '..kggggggggggk..',
  '..kggwkggwkggk..',
  '.kgggkkggkkgggk.',
  '.kggggggggggggk.',
  '.kgggpggggpgggk.',
  '.kggggkkkkggggk.',
  '.kgggggggggggggk',
  '..kggggggggggk..',
  '...kggggggggk...',
  '...kk.kkkk.kk...',
  '....k......k....',
];
const petSvg = () => {
  const fill = { k: '#2b2a1f', g: '#2b2a1f', w: '#c4cf9a', p: '#2b2a1f' };
  const op = { k: 1, g: .55, w: 1, p: .9 };
  let r = '';
  PET.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch !== '.') r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill[ch]}" fill-opacity="${op[ch]}"/>`;
  }));
  return `<svg class="pet" viewBox="0 0 16 14" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
};

export default function hermagotchi(f) {
  const t = f.stats.tests;
  return {
    title: 'Hermagotchi — co-op virtual pets for Hermes Agent',
    description: f.tagline,
    fonts: 'family=Fredoka:wght@400;500;600;700&family=Pixelify+Sans:wght@400;700',
    themeColor: '#ff6fae',
    body: `
${H.nav(f.slug)}
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="hero-copy">
      <img class="wordmark" src="../assets/hermagotchi/img/wordmark.png" width="207" height="33" alt="Hermagotchi wordmark">
      <h1 id="t">Hermagotchi</h1>
      <p class="lede">${H.esc(f.tagline)}</p>
      <p class="pills"><span>${f.stats.tools} tools</span><span>${t.python} Python tests</span><span>${t.javascript} JS tests</span><span>${f.release.tag}</span></p>
      <p class="cta"><a class="btn pink" href="#tv">Watch the demo</a> <a class="btn" href="#adopt">Adopt one</a></p>
    </div>
    <div class="device-wrap">
      <div class="egg" role="group" aria-labelledby="toy-h">
        <span class="ring" aria-hidden="true"></span>
        <p class="egg-brand" aria-hidden="true">HERMAGOTCHI</p>
        <div class="lcd">
          <p id="toy-h" class="sr-only">Toy pet for this page. The real pets live in the Hermes pane.</p>
          ${petSvg()}
          <ul class="meters" aria-label="Toy pet meters">
            <li><span>FULL</span><meter min="0" max="100" value="70" data-m="full">70</meter></li>
            <li><span>HAPPY</span><meter min="0" max="100" value="60" data-m="happy">60</meter></li>
            <li><span>ENERGY</span><meter min="0" max="100" value="80" data-m="energy">80</meter></li>
            <li><span>HEALTH</span><meter min="0" max="100" value="90" data-m="health">90</meter></li>
          </ul>
          <p class="lcd-msg" aria-live="polite">hi!</p>
        </div>
        <div class="egg-btns">
          <button type="button" data-act="feed">Feed</button>
          <button type="button" data-act="play">Play</button>
          <button type="button" data-act="rest">Rest</button>
        </div>
      </div>
      <p class="toy-note">A toy for this page. The real pet lives in the Hermes pane.</p>
    </div>
  </section>

  <section class="what" data-reveal aria-labelledby="what-h">
    <h2 id="what-h">So what is it?</h2>
    <div class="bubbles">
      <p class="bubble">Hermagotchi gives Hermes a native pane with <b>Habitat, Battle, Shop, Leaderboard and Social</b> tabs, plus a lobby rail. You raise a pet, battle other pets async, earn Bits, unlock cosmetics up to mythic tier, and talk trash in the lobby.</p>
      <p class="bubble b2">By default it's an <b>offline practice sim</b>: in memory, no network, and it resets when Hermes restarts. Online play is opt-in, and pairing a device stays a human action in the pane.</p>
      <p class="bubble b3">The agent drives eight <code>hermagotchi_*</code> tools. It can <b>never buy items</b>, and agent chat and autonomy stay off until you switch them on.</p>
    </div>
  </section>

  <section class="feats" data-reveal aria-labelledby="feat-h">
    <h2 id="feat-h">What's in the box</h2>
    <ul class="stickers">
      ${f.features.map((x, i) => `<li class="s${i % 6}"><p>${H.inline(x)}</p></li>`).join('\n      ')}
    </ul>
    <h3 class="carts-h">The eight tools</h3>
    <ul class="carts">
      ${f.stats.tool_names.map((n) => `<li><code>${n}</code></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="goals" data-reveal aria-labelledby="goals-h">
    <h2 id="goals-h">Daily goals</h2>
    <p class="sub">Things to do with your pet. Tick them off; nothing is saved.</p>
    <ul class="checklist">
      ${f.use_cases.map((u, i) => `<li><input type="checkbox" id="g${i}"><label for="g${i}">${H.inline(u)}</label></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="tv-sec" id="tv" data-reveal aria-labelledby="tv-h">
    <h2 id="tv-h">Now showing on channel 9</h2>
    <div class="tv">
      <span class="ant" aria-hidden="true"></span>
      <div class="tv-screen">${H.video(f)}</div>
      <span class="knobs" aria-hidden="true"><i></i><i></i></span>
    </div>
  </section>

  <section class="card-sec" data-reveal aria-labelledby="stats-h">
    <h2 id="stats-h">Pet card</h2>
    <div class="petcard">
      <ul>
        ${H.statList(f).map(([v, l]) => `<li><strong>${H.esc(v)}</strong><span>${H.esc(l)}</span></li>`).join('\n        ')}
      </ul>
      <p class="small">${H.esc(t.note)}</p>
    </div>
  </section>

  <section class="album" data-reveal aria-labelledby="album-h">
    <h2 id="album-h">Photo album</h2>
    ${H.gallery(f.slug, { cls: 'polaroids', label: 'Hermagotchi screenshots' })}
  </section>

  <section class="adopt" id="adopt" data-reveal aria-labelledby="adopt-h">
    <div class="tag">
      <h2 id="adopt-h">Care instructions</h2>
      ${H.install(f)}
    </div>
    <div class="linkbox">
      <h3>Links</h3>
      ${H.links(f)}
    </div>
  </section>
</main>
${H.footer(f)}
<script src="pet.js" defer></script>
`,
  };
}
