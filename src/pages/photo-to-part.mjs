import * as H from '../lib.mjs';

const TOOL_ROLE = {
  photo_part_validate: 'Watertightness, shell count, bounding box, circular bores, printability, and a spec or --dim check',
  photo_part_render: 'Front, side, top and iso previews, an eight-view comparison sheet, a side-by-side and a silhouette overlay with IoU',
  photo_part_heal: 'Weld, fill holes, and keep the largest shell of a scan',
  photo_part_template: 'A watertight block from a template (plate, L-bracket, hinge, thread, spur gear, spiral scroll, strap hinge, …)',
  photo_part_measure: 'Pixels per millimetre from a coin, a ruler, or an ArUco/AprilTag marker',
  photo_part_build: 'Runs one local .py file after Hermes asks for approval. No shell',
};
const STAGES = ['Photo', 'Scale', 'Segment', 'Spec', 'Approval', 'Build', 'Render', 'Compare', 'Refine'];

// Bounding envelope of the checked-in plate clip sample: 51 × 72.6 × 6 mm.
const drawing = () => `
<svg class="dwg" viewBox="0 0 520 380" role="img" aria-labelledby="dwg-t">
  <title id="dwg-t">Envelope of the checked-in plate clip sample: 51 by 72.6 by 6 millimetres, front and side views.</title>
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="currentColor"/></marker>
  </defs>
  <g class="views">
    <rect class="part" x="80" y="40" width="153" height="217.8" rx="6"/>
    <line class="center" x1="156.5" y1="22" x2="156.5" y2="276"/>
    <line class="center" x1="62" y1="148.9" x2="251" y2="148.9"/>
    <rect class="part" x="330" y="40" width="18" height="217.8"/>
    <line class="center" x1="339" y1="22" x2="339" y2="276"/>
    <line class="proj" x1="233" y1="40" x2="330" y2="40"/>
    <line class="proj" x1="233" y1="257.8" x2="330" y2="257.8"/>
  </g>
  <g class="dims">
    <line class="ext" x1="80" y1="262" x2="80" y2="312"/><line class="ext" x1="233" y1="262" x2="233" y2="312"/>
    <line class="dim" x1="80" y1="302" x2="233" y2="302" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <text x="156.5" y="296" text-anchor="middle">51</text>
    <line class="ext" x1="76" y1="40" x2="26" y2="40"/><line class="ext" x1="76" y1="257.8" x2="26" y2="257.8"/>
    <line class="dim" x1="36" y1="40" x2="36" y2="257.8" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <text x="26" y="148.9" text-anchor="middle" transform="rotate(-90 26 148.9)">72.6</text>
    <line class="ext" x1="330" y1="262" x2="330" y2="312"/><line class="ext" x1="348" y1="262" x2="348" y2="312"/>
    <line class="dim" x1="300" y1="302" x2="330" y2="302" marker-end="url(#ar)"/>
    <line class="dim" x1="378" y1="302" x2="348" y2="302" marker-end="url(#ar)"/>
    <text x="339" y="296" text-anchor="middle">6</text>
  </g>
  <g class="labels">
    <text x="156.5" y="345" text-anchor="middle">FRONT</text>
    <text x="339" y="345" text-anchor="middle">SIDE</text>
    <text x="384" y="80">ENVELOPE ONLY</text>
    <text x="384" y="96">examples/</text>
    <text x="384" y="110">plate-clip</text>
    <text x="384" y="126">UNITS: mm</text>
  </g>
</svg>`;

export default function p2p(f) {
  const zones = (n, c) => Array.from({ length: n }, (_, i) => `<span>${c ? String.fromCharCode(65 + i) : i + 1}</span>`).join('');
  return {
    title: 'photo-to-part — photos and measurements to printable parametric parts, for Hermes Agent',
    description: f.tagline,
    fonts: 'family=Barlow+Condensed:wght@400;500;700&family=B612+Mono:wght@400;700',
    themeColor: '#0f3d73',
    body: `
${H.nav(f.slug)}
<div class="sheet">
  <div class="zones top" aria-hidden="true">${zones(8)}</div>
  <div class="zones left" aria-hidden="true">${zones(6, true)}</div>
  <main id="main">
    <section class="hero" aria-labelledby="t">
      <div class="hero-text">
        <p class="tag">DWG · HERMES AGENT PLUGIN</p>
        <h1 id="t">Photo<span>→</span>Part</h1>
        <p class="lede">${H.esc(f.tagline)}</p>
        <ol class="stages" aria-label="Part studio stages shown in the pane">${STAGES.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>
      <figure class="hero-dwg">${drawing()}<figcaption>Fig. 0 — bounding envelope of the sample in <code>examples/plate-clip</code> (51 × 72.6 × 6 mm).</figcaption></figure>
    </section>

    <section class="block what" data-reveal aria-labelledby="what-h">
      <h2 id="what-h"><span class="bubble">A</span> General notes</h2>
      <div class="notes">
        <p>photo-to-part is one skill, <code>photo-to-part:photo-to-printable-part</code>, plus six tools. Hand it a photo, a few measurements, or a messy 3D scan, and it works toward a parametric part you can print or edit: templates first, then a local Python build behind an approval prompt, then validation and comparison renders held next to your photo.</p>
        <p>On Hermes 0.23 or newer, an optional Part studio pane shows the stage, photo overlay, renders, history, scale and trust, approval, and output paths. The tools install without it.</p>
      </div>
      <ol class="drawing-notes">
        ${f.features.map((x) => `<li>${H.inline(x)}</li>`).join('\n        ')}
      </ol>
    </section>

    <section class="block bom-sec" data-reveal aria-labelledby="bom-h">
      <h2 id="bom-h"><span class="bubble">B</span> Bill of materials</h2>
      <div class="table-wrap">
      <table class="bom">
        <thead><tr><th scope="col">Item</th><th scope="col">Tool</th><th scope="col">Function</th><th scope="col">Qty</th></tr></thead>
        <tbody>
          ${f.stats.tool_names.map((n, i) => `<tr><td>${i + 1}</td><th scope="row"><code>${n}</code></th><td>${H.inline(TOOL_ROLE[n])}</td><td>1</td></tr>`).join('\n          ')}
        </tbody>
      </table>
      </div>
    </section>

    <section class="block details" data-reveal aria-labelledby="det-h">
      <h2 id="det-h"><span class="bubble">C</span> Details: use cases</h2>
      <ol class="detail-list">
        ${f.use_cases.map((u, i) => `<li><span class="callout" aria-hidden="true">${String.fromCharCode(68 + i)}</span><p><b>Detail ${String.fromCharCode(68 + i)}.</b> ${H.inline(u)}</p></li>`).join('\n        ')}
      </ol>
    </section>

    <section class="block section-v" data-reveal aria-labelledby="vid-h">
      <h2 id="vid-h"><span class="bubble">J</span> Section J–J: the submission video</h2>
      ${H.video(f)}
    </section>

    <section class="block views" data-reveal aria-labelledby="gal-h">
      <h2 id="gal-h"><span class="bubble">K</span> Views</h2>
      ${H.gallery(f.slug, { cls: 'view-grid', label: 'photo-to-part screenshots and renders' })}
    </section>

    <section class="block inst" data-reveal aria-labelledby="inst-h">
      <h2 id="inst-h"><span class="bubble">L</span> Assembly instructions</h2>
      ${H.install(f)}
      <p class="tn">${H.esc(f.stats.tests_note)}</p>
    </section>

    <section class="block refs" data-reveal aria-labelledby="ref-h">
      <h2 id="ref-h"><span class="bubble">M</span> Referenced documents</h2>
      ${H.links(f)}
    </section>

    <table class="title-block" aria-label="Title block">
      <tbody>
        <tr><th scope="row">Title</th><td colspan="3" class="tb-title">${H.esc(f.title)}</td></tr>
        <tr><th scope="row">Plugin</th><td><code>${f.catalog_name}</code></td><th scope="row">Rev</th><td>${f.release.tag}</td></tr>
        <tr><th scope="row">Dwg no.</th><td>${f.release.sha.slice(0, 10)}</td><th scope="row">Tools</th><td>${f.stats.tools}</td></tr>
        <tr><th scope="row">Video</th><td>${H.duration(f.video.duration_seconds)}</td><th scope="row">Units</th><td>mm</td></tr>
        <tr><th scope="row">Drawn</th><td colspan="3">Kyle Durepos · mojomast</td></tr>
      </tbody>
    </table>
  </main>
</div>
${H.footer(f)}
`,
  };
}
