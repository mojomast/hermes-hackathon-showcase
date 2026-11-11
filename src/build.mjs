// Renders index.html and <slug>/index.html from assets/<slug>/facts.json.
// Run: node src/build.mjs   (after src/thumbs.sh has produced thumbs/)
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ORDER, ROOT, facts, page } from './lib.mjs';
const only = process.argv.slice(2);
for (const slug of ORDER) {
  if (only.length && !only.includes(slug)) continue;
  const mod = join(ROOT, 'src', 'pages', `${slug}.mjs`);
  if (!existsSync(mod)) { console.warn(`skip ${slug}: no template`); continue; }
  const { default: render } = await import(mod);
  const p = render(facts[slug]);
  mkdirSync(join(ROOT, slug), { recursive: true });
  writeFileSync(join(ROOT, slug, 'index.html'), page({ slug, ...p }));
  console.log(`built ${slug}/index.html`);
}
if (!only.length || only.includes('index')) {
  const { default: landing } = await import('./pages/index.mjs');
  writeFileSync(join(ROOT, 'index.html'), page({ slug: null, up: '', ...landing() }));
  console.log('built index.html');
}
