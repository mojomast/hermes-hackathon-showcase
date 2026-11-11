import * as H from '../lib.mjs';

const TOOLS = [
  ['bundlebees_status', 'Health, capacity, live attempts, events, containers, or authorized projects. op is required. Never returns tokens or hosts.', 108],
  ['bundlebees_dispatch', 'Validate a brief (object or JSON string) and start a worker. Optional model (default deepseek-v4.1-flash) and kanban_task_id.', 130],
  ['bundlebees_attempt', 'get, events, cancel, or review one attempt. cancel and review require confirm=true. Notes are scrubbed.', 146],
  ['bundlebees_host_prompt', 'Paste-ready setup prompt for a remote-host agent. Takes a reach method enum, never an address. No secrets or host addresses in or out.', 185],
];
// "How it works" flowchart from the README.
const FLOW = [
  ['Hermes agent', 'four bundlebees tools'],
  ['bundlebees plugin', 'preconfigured adapter'],
  ['Worker launcher', ''],
  ['Cua sandboxes', ''],
  ['Attempt result and patch', 'user-run CLI'],
  ['hermes bundlebees verify', 'lease, tests, secret scan'],
  ['Feature branch push', ''],
  ['Open a pull request', ''],
];

const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 180 * (60 * i - 30);
  return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
}).join(' ');

const flowSvg = () => {
  const pts = FLOW.map((_, i) => [80 + i * 120, i % 2 ? 150 : 80]);
  const path = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
  return `<svg class="flow" viewBox="0 0 1000 290" role="img" aria-labelledby="flow-t">
  <title id="flow-t">How it works: ${FLOW.map(([a]) => a).join(', then ')}. The plugin can also attach an optional Hermes kanban card id.</title>
  <path id="flowpath" d="${path}" class="trail"/>
  ${pts.map(([x, y], i) => `<g class="node n${i}"><polygon points="${hex(x, y, 44)}"/><text x="${x}" y="${y + (i % 2 ? 66 : -56)}" text-anchor="middle">${FLOW[i][0]}</text><text class="num" x="${x}" y="${y + 6}" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text></g>`).join('\n  ')}
  <g class="kanban"><polygon points="${hex(200, 262, 20)}"/><text x="230" y="267">Hermes kanban (optional card id)</text><line x1="200" y1="242" x2="200" y2="224"/></g>
  ${[0, 1, 2].map((i) => `<g class="bee"><ellipse rx="7" ry="5"/><line x1="-2" y1="-5" x2="-2" y2="5"/><line x1="2" y1="-5" x2="2" y2="5"/><ellipse class="wing" cx="0" cy="-7" rx="5" ry="3"/><animateMotion dur="${9 + i * 2}s" begin="-${i * 3}s" repeatCount="indefinite" rotate="auto"><mpath href="#flowpath"/></animateMotion></g>`).join('')}
</svg>`;
};

export default function bundlebees(f) {
  return {
    title: 'bundlebees — orchestrate CUA bees from Hermes Agent',
    description: f.tagline,
    fonts: 'family=Chakra+Petch:wght@400;600;700&family=Martian+Mono:wght@400;600',
    themeColor: '#0b0f14',
    body: `
${H.nav(f.slug)}
<main id="main">
  <section class="hero" aria-labelledby="t">
    <div class="hero-copy">
      <p class="kick">HIVE-01 · ${f.release.tag} · Hermes ${H.esc(f.requires_hermes)}</p>
      <h1 id="t">bundle<span>bees</span></h1>
      <p class="lede">${H.esc(f.tagline)}</p>
      <p class="sub">Check a worker launcher, dispatch leased briefs into disposable <a href="https://github.com/trycua/cua">Cua</a> sandboxes, watch the attempts, and leave verify and deploy to a user-run CLI.</p>
    </div>
    <ul class="comb" aria-label="Key figures">
      ${H.statList(f).map(([v, l], i) => `<li class="c${i}"><strong>${H.esc(v)}</strong><span>${H.esc(l)}</span></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="band why" data-reveal aria-labelledby="why-h">
    <h2 id="why-h"><span class="idx">01</span> Why it exists</h2>
    <div class="cols">
      <p>A coordinator can already run cheap, parallel coding workers (bees) in disposable Cua sandboxes on a machine you control. The pattern this plugin was built for is the Orbit / DeepSeek bees workflow: slice a repo task into file-leased briefs and dispatch them to workers.</p>
      <p>bundlebees turns that workflow into a Hermes plugin, so the agent never has to invent an HTTP client, touch a token, or apply a patch itself. Task tracking stays on Hermes kanban. The model dispatches and watches. You run <code>hermes bundlebees verify</code> and <code>hermes bundlebees deploy</code>.</p>
    </div>
  </section>

  <section class="band flow-sec" data-reveal aria-labelledby="flow-h">
    <h2 id="flow-h"><span class="idx">02</span> How it works</h2>
    <div class="flow-wrap">${flowSvg()}</div>
    <ol class="flow-list">${FLOW.map(([a, b]) => `<li>${H.esc(a)}${b ? ` <span>→ ${H.esc(b)}</span>` : ''}</li>`).join('')}</ol>
  </section>

  <section class="band cells-sec" data-reveal aria-labelledby="feat-h">
    <h2 id="feat-h"><span class="idx">03</span> Cells</h2>
    <ul class="cells">
      ${f.features.map((x) => `<li><div><p>${H.inline(x)}</p></div></li>`).join('\n      ')}
    </ul>
  </section>

  <section class="band tools-sec" data-reveal aria-labelledby="tools-h">
    <h2 id="tools-h"><span class="idx">04</span> Four tools · ${f.stats.tokens_o200k} o200k of a 900 budget</h2>
    <div class="budget" role="img" aria-label="Per-tool schema tokens: ${TOOLS.map(([n, , t]) => `${n} ${t}`).join(', ')}; combined ${f.stats.tokens_o200k} of 900">
      ${TOOLS.map(([n, , t], i) => `<span class="b${i}" style="flex:${t}"></span>`).join('')}<span class="free" style="flex:${900 - f.stats.tokens_o200k}"></span>
    </div>
    <dl class="tools">
      ${TOOLS.map(([n, d, t], i) => `<div class="t${i}"><dt><code>${n}</code><span>${t} o200k</span></dt><dd>${H.inline(d)}</dd></div>`).join('\n      ')}
    </dl>
    <p class="fn">Per-tool counts are each schema measured on its own; the combined array measures ${f.stats.tokens_o200k}.</p>
  </section>

  <section class="band uses" data-reveal aria-labelledby="uc-h">
    <h2 id="uc-h"><span class="idx">05</span> Flight plans</h2>
    <ol class="plans">
      ${f.use_cases.map((u, i) => `<li><span class="pn">B-${String(i + 1).padStart(2, '0')}</span><p>${H.inline(u)}</p></li>`).join('\n      ')}
    </ol>
  </section>

  <section class="band vid-sec" data-reveal aria-labelledby="vid-h">
    <h2 id="vid-h"><span class="idx">06</span> Showcase</h2>
    ${H.video(f)}
  </section>

  <section class="band gal" data-reveal aria-labelledby="gal-h">
    <h2 id="gal-h"><span class="idx">07</span> Inspection</h2>
    ${H.gallery(f.slug, { cls: 'shots', label: 'bundlebees screenshots' })}
  </section>

  <section class="band inst" data-reveal aria-labelledby="inst-h">
    <h2 id="inst-h"><span class="idx">08</span> Install</h2>
    ${H.install(f)}
    <p class="fn">${H.esc(f.stats.tests_note)}</p>
    ${H.links(f)}
  </section>
</main>
${H.footer(f)}
<script src="hive.js" defer></script>
`,
  };
}
