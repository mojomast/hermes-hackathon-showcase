import * as H from '../lib.mjs';

const EDGES = [
  'a stray keyword to register_tool and your plugin silently loads with 0 tools',
  'a duplicated YAML key that PyYAML quietly "fixes" for you',
  'an unquoted commit SHA the catalog validator reads as a number',
  "a dashboard API change that won't show up until you restart the gateway",
  'a security scan that fails your plugin because your README mentions a scary command word',
  "a PR that won't open because of a GitHub limit, not your auth",
  "an agent tool that can approve a stranger's device because a lobby message talked it into it",
  'a session token that leaks because authedFetch was handed an absolute asset URL',
  'a loopback "token-gated" viewer that hands the token to anyone who asks',
  'a live pane that starves the Hermes gateway because every poll runs a full capture',
];
const INSIDE = [
  ['Agent Skill', 'skills/hermes-plugin-development/: a short core guide plus 13 deep-dive references (manifest, ctx API, all 46 hooks, capabilities and isolation, panes, testing, release and catalog, review lessons, pitfalls, hackathons, worked examples).'],
  ['Template plugin', 'templates/hello-hermes: a minimal plugin that passes hermes plugins validate and doctor --ci as-is, with a fake-host test, strict-YAML check, version bump script and schema-token meter.'],
  ['Catalog kit', 'Catalog entry and PR body templates matching the upstream schema, including the 6-screenshot cap.'],
  ['Hermes plugin', 'plugin.yaml + register(ctx) at the repo root: bundles the skill and adds 2 lean tools (190 o200k tokens total).'],
];
const CHECKS = ['strict YAML', 'manifest rules', 'provides_tools vs registered (static AST)', 'security preflight', 'static schema token cost', 'catalog entry rules: sha, hosts, category, subdir, at most 6 screenshots'];

export default function hpd(f) {
  const toc = [['s1', 'Scope'], ['s2', 'Sharp edges'], ['s3', 'Contents'], ['s4', 'Tools'], ['s5', 'Applications'], ['s6', 'Measurements'], ['s7', 'Figures'], ['s8', 'Appendix A: submission post'], ['s9', 'Installation'], ['s10', 'References']];
  return {
    title: 'Hermes Plugin Dev — a skill and plugin for building Hermes Agent plugins',
    description: f.tagline,
    fonts: 'family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;600',
    themeColor: '#f7f6f1',
    body: `
<header class="doc-head">
  ${H.nav(f.slug)}
</header>
<div class="sheet">
  <aside class="toc" aria-label="Contents">
    <p class="toc-h">Contents</p>
    <ol>${toc.map(([id, l], i) => `<li><a href="#${id}"><span>${i + 1}</span> ${l}</a></li>`).join('')}</ol>
  </aside>
  <main id="main">
    <header class="title-block">
      <table class="meta">
        <tr><th scope="row">Document</th><td>HPD · ${f.release.tag}</td><th scope="row">Status</th><td>Submitted to catalog</td></tr>
        <tr><th scope="row">Plugin id</th><td><code>${f.catalog_name}</code></td><th scope="row">Requires</th><td>Hermes ${H.esc(f.requires_hermes)}</td></tr>
        <tr><th scope="row">Author</th><td>Kyle Durepos (mojomast)</td><th scope="row">Catalog PR</th><td><a href="${f.catalog_pr}">#${f.catalog_pr.split('/').pop()}</a></td></tr>
      </table>
      <h1>Hermes Plugin Dev</h1>
      <p class="lede">${H.esc(f.tagline)}</p>
      <p class="abstract"><b>Abstract.</b> One Agent Skill and one Hermes plugin, distilled from shipping real community plugins and from the catalog reviews that followed. Any coding agent can load the skill. Installed into Hermes, it also gives the Hermes agent two small, offline tools to build plugins itself.</p>
    </header>

    <section id="s1" data-reveal>
      <h2><span>1</span> Scope</h2>
      <p>Hermes Agent has a powerful plugin system and a reviewed plugin catalog. Getting a plugin from idea to listed means learning a dozen sharp edges the hard way. This repository captures those lessons, each checked against hermes-agent source or the public catalog review threads, in a format every major coding agent can load.</p>
      <p class="rule"><b>1.1</b> The tools make no network calls, start no subprocesses, use no git and hold no credentials. They write only into the target folder you name.</p>
      <p class="rule"><b>1.2</b> The security preflight is a heuristic, not a proof.</p>
    </section>

    <section id="s2" data-reveal>
      <h2><span>2</span> Sharp edges</h2>
      <p>Failure modes listed in the README, each one learned the hard way:</p>
      <ol class="edges">
        ${EDGES.map((e) => `<li>${H.inline(e)}</li>`).join('\n        ')}
      </ol>
    </section>

    <section id="s3" data-reveal>
      <h2><span>3</span> Contents</h2>
      <dl class="inside">
        ${INSIDE.map(([k, v]) => `<div><dt>${k}</dt><dd>${H.inline(v)}</dd></div>`).join('\n        ')}
      </dl>
      <h3>3.1 Features</h3>
      <ul class="feat">${f.features.map((x) => `<li>${H.inline(x)}</li>`).join('')}</ul>
    </section>

    <section id="s4" data-reveal>
      <h2><span>4</span> Tools</h2>
      <div class="tool">
        <p class="sig"><code>hpd_scaffold(target_dir, name)</code></p>
        <p>Creates a new plugin from the template, renamed, with a catalog entry and PR body stub. Writes only inside <code>target_dir</code>; refuses non-empty dirs; never overwrites.</p>
      </div>
      <div class="tool">
        <p class="sig"><code>hpd_check(path, catalog_entry?)</code></p>
        <p>Offline lint, read-only. Never imports or executes the target plugin (v0.3.1 measures schema tokens statically from the AST). It inspects:</p>
        <ul class="checks">${CHECKS.map((c) => `<li><span class="box" aria-hidden="true">☐</span> ${H.inline(c)}</li>`).join('')}</ul>
      </div>
      <div class="tool">
        <p class="sig"><code>hermes hpd check &lt;dir&gt; [--execute]</code></p>
        <p>A user-run CLI for the same lint. Default is static. <code>--execute</code> imports <code>register()</code> with a fake host, like <code>hermes plugins doctor</code>. Only use it on code you trust.</p>
      </div>
    </section>

    <section id="s5" data-reveal>
      <h2><span>5</span> Applications</h2>
      <ol class="apps">${f.use_cases.map((u, i) => `<li><span class="num">5.${i + 1}</span> ${H.inline(u)}</li>`).join('')}</ol>
    </section>

    <section id="s6" data-reveal>
      <h2><span>6</span> Measurements</h2>
      <table class="data">
        <caption>Table 1. Figures from the README and v0.3.1 release notes.</caption>
        <tbody>${H.statList(f).map(([v, l]) => `<tr><th scope="row">${H.esc(l)}</th><td>${H.esc(v)}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fn">${H.esc(f.stats.tokens_note)} ${H.esc(f.stats.tests_note)}</p>
    </section>

    <section id="s7" data-reveal>
      <h2><span>7</span> Figures</h2>
      ${H.gallery(f.slug, { cls: 'figs', label: 'Hermes Plugin Dev figures' })}
      <p class="fn">The repository ships a banner only; there are no other screenshots.</p>
    </section>

    <section id="s8" data-reveal>
      <h2><span>8</span> Appendix A: submission post</h2>
      ${H.video(f)}
    </section>

    <section id="s9" data-reveal>
      <h2><span>9</span> Installation</h2>
      ${H.install(f)}
    </section>

    <section id="s10" data-reveal>
      <h2><span>10</span> References</h2>
      ${H.links(f, { cls: 'refs' })}
    </section>
    ${H.footer(f)}
  </main>
</div>
`,
  };
}
