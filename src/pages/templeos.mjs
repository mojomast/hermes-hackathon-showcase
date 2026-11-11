import * as H from '../lib.mjs';

// From source-guest.md, "The 18 apps" (Temple of Hermes 0.1.2 launcher order).
const APPS = [
  ['Temple', 'T', 'Home screen; keeps you on the launcher.'],
  ['Hermes Chat', 'H', 'Talk with the Hermes agent over COM2.'],
  ['WorldSim', 'W', 'Five agents explore a tile planet and log what they find.'],
  ['Codex', 'C', 'Read the Codex of Nous from ::/Hermes/Lore.'],
  ['Psyche', 'P', 'Text signal-field monitor; visualization only, no network.'],
  ['Capybara', 'B', 'Feed, pet, and rest the Temple capybara.'],
  ['Messenger', 'M', 'Courier-lane arcade: scrolls, seals, and storm cells.'],
  ['BBS', 'S', 'HBBS/1 boards over COM2, with a DolDoc UI and a JSON CLI.'],
  ['Threshold', 'R', 'Temple gate: host window, MOTD, doors, splash.'],
  ['Dojo', 'J', "Teknium's hall of four scored HolyC challenges."],
  ['Offerings', 'O', "Don Piedro's shop for wallpapers, palettes, snippets."],
  ['Southpaw', 'U', 'Announcer-fronted DolDoc view of BBS highlights.'],
  ['Modem / Net', 'N', 'COM2 status, hang-up, and loopback echo test.'],
  ['Caduceus', 'D', 'Guide the temple serpent around the grid.'],
  ['Token Rain', 'K', 'Catch Arete tokens and dodge cursed glyphs.'],
  ['Spoon', 'Q', "Don Piedro's catch arcade; offerings in a spoon."],
  ['Dojo Duel', 'L', "Teknium's 12-second HolyC typing duel."],
  ['About', 'A', 'About page and help; Esc returns to the launcher.'],
];
const FLAVORS = [
  ['', 'Temple of Hermes 0.1.2 (default)', 'TinkerOS 5.20-rc10', 'TempleOS 5.03', 'ZealOS'],
  ['Id', 'templeoh', 'tinkeros', 'templeos', 'zealos'],
  ['Resolution', '640×480', '640×480', '640×480', '1024×768'],
  ['Mouse', 'VMMouse (absolute)', 'VMMouse (absolute)', 'no abs handler', 'relative'],
  ['Disk bus', 'IDE', 'IDE', 'IDE', 'AHCI required'],
];
const MODES = [
  ['Watch', 'You see the VM; only the agent injects input.'],
  ['Shared (default)', 'Both can type. Your key/click pauses the agent ~2 s.'],
  ['Take control', 'Agent tools return agent_paused until Hand back.'],
];

const win = (id, title, body, cls = '') => `<section class="win ${cls}" id="${id}" data-reveal aria-labelledby="${id}-h">
  <h2 class="tbar" id="${id}-h"><span>${title}</span><span class="x" aria-hidden="true">[X]</span></h2>
  <div class="wbody">${body}</div>
</section>`;

export default function templeos(f) {
  const guest = f.related_repos[0];
  return {
    title: 'TempleOS for Hermes — a shared TempleOS-family screen for you and Hermes Agent',
    description: f.tagline,
    fonts: 'family=Press+Start+2P&family=VT323',
    themeColor: '#0000aa',
    body: `
<div class="statusbar" aria-hidden="true"><span class="sb-user">HERMES/user</span> <span>TempleOS for Hermes ${f.release.tag}</span> <span class="sb-r">640x480 16 COLOR</span></div>
${H.nav(f.slug)}
<div class="screen">
<main id="main">
  <section class="boot" aria-labelledby="t">
    <pre class="bootlog" aria-hidden="true">qemu-system-x86_64 -nic none -vga std ...
Temple of Hermes ${H.esc(guest.release_tag.replace('v', ''))} ... SHA-256 OK
COM1 agent handshake ... OK</pre>
    <h1 id="t"><span class="y">TEMPLE<span class="b">OS</span></span> <span class="w">for Hermes</span></h1>
    <p class="lede">${H.esc(f.tagline)}</p>
    <p class="mem">In memory of Terry A. Davis (1969–2018), author of TempleOS. TempleOS is public domain. This plugin is an unofficial Hermes integration.</p>
  </section>

  <section class="launcher" aria-labelledby="l-h">
    <h2 class="lhead" id="l-h">THE TEMPLE OF HERMES ${H.esc(guest.release_tag)}<br><span>18 apps and games</span></h2>
    <ul class="grid" role="list">
      ${APPS.map(([n, k, d], i) => `<li><button type="button" data-key="${k}" data-desc="${H.esc(d)}" aria-describedby="l-status"${i === 0 ? ' class="sel"' : ''}><span class="an">${H.esc(n)}</span><span class="ak">[${k}]</span></button></li>`).join('\n      ')}
    </ul>
    <p class="lfoot" id="l-status" aria-live="polite">Click an icon or press its key to read about it - arrows move</p>
    <p class="lnote">Recreated from the guest's home launcher. The real one runs inside QEMU.</p>
  </section>

  ${win('what', 'What it is', `
    <p>The plugin runs a local TempleOS-family guest in a child QEMU, with networking always off (<code>-nic none</code>). The Hermes agent and you share one live screen in a Hermes Desktop pane. The agent reads the screen as text or as a 640×480 PNG, types and clicks, injects HolyC, and moves files over a framed COM1 protocol. You can take the keyboard at any time and hand it back.</p>
    <p>QEMU and the ISOs are not bundled. Doctor fetches the official pinned ISO and verifies its SHA-256. The default guest is <a href="${guest.url}">Temple of Hermes</a> ${H.esc(guest.release_tag)}, a public-domain TinkerOS fork with an 18-entry home launcher, HBBS/1 boards over a COM2 serial modem, and a COM1 agent handshake.</p>`)}

  ${win('feat', 'Features', `<ul class="dl">${f.features.map((x) => `<li>${H.inline(x)}</li>`).join('')}</ul>
    <h3>Pane modes</h3>
    <dl class="modes">${MODES.map(([a, b]) => `<div><dt>${a}</dt><dd>${H.inline(b)}</dd></div>`).join('')}</dl>`)}

  ${win('uses', 'Use cases', `<ol class="dl num">${f.use_cases.map((u) => `<li>${H.inline(u)}</li>`).join('')}</ol>`)}

  ${win('flav', 'Guest OS flavors', `<div class="tw"><table>${FLAVORS.map((r, i) => `<tr>${r.map((c, j) => (i === 0 || j === 0) ? `<th scope="${i === 0 ? 'col' : 'row'}">${H.esc(c)}</th>` : `<td>${H.esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`)}

  ${win('video', 'Video.MP4', H.video(f), 'vwin')}

  ${win('stats', 'Stats', `<ul class="stats">${H.statList(f).map(([v, l]) => `<li><b>${H.esc(v)}</b> ${H.esc(l)}</li>`).join('')}</ul><p class="small">${H.esc(f.stats.tokens_note)} ${H.esc(f.stats.tests_note)}</p>`)}

  ${win('shots', 'Screenshots', H.gallery(f.slug, { cls: 'shots', label: 'TempleOS for Hermes screenshots' }))}

  ${win('install', 'Install.HC', H.install(f))}

  ${win('links', 'Links', H.links(f))}
</main>
${H.footer(f)}
</div>
<script src="launcher.js" defer></script>
`,
  };
}
