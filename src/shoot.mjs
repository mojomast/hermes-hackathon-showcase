// Full-page screenshots via headless Chrome + CDP (no npm deps).
// Usage: node src/shoot.mjs <baseUrl> <outDir> [paths...]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [base, outDir, ...paths] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const port = 9333;
const chrome = spawn('google-chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--no-sandbox', '--disable-site-isolation-trials', '--disable-features=IsolateOrigins,site-per-process',
  '--hide-scrollbars', '--autoplay-policy=user-gesture-required', '--user-data-dir=/tmp/shoot-profile-' + process.pid, '--disk-cache-size=1', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const pg = list.find((t) => t.type === 'page');
    ws = new WebSocket(pg.webSocketDebuggerUrl); break;
  } catch { await sleep(200); }
}
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const events = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else events.push(d);
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
const errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
});

const modes = [['desktop', 1440, 900, false], ['mobile', 390, 844, true]];
for (const p of paths) {
  for (const [name, w, h, mobile] of modes) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await send('Page.navigate', { url: base + p });
    await sleep(1800);
    // Trigger lazy content by scrolling through, then return to top.
    await send('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('in'));})()`, awaitPromise: true });
    await sleep(Number(process.env.SHOT_WAIT || 1200));
    const { result } = await send('Runtime.evaluate', { expression: 'JSON.stringify([document.documentElement.scrollWidth, document.documentElement.scrollHeight])', returnByValue: true });
    const [sw, sh] = JSON.parse(result.result.value);
    const full = Math.min(sh, 16000);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: full, scale: 1 } });
    const slug = p.replace(/\//g, '') || 'index';
    writeFileSync(join(outDir, `${slug}-${name}.jpg`), Buffer.from(shot.result.data, 'base64'));
    console.log(`${slug}-${name}: ${w}x${full}${sw > w ? `  OVERFLOW scrollWidth=${sw}` : ''}`);
    if (sw > w) {
      const { result: r2 } = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify([...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>${w}+1&&r.width>0&&getComputedStyle(e).position!=='fixed'}).slice(0,8).map(e=>e.tagName+'.'+[...e.classList].join('.')+' '+Math.round(e.getBoundingClientRect().right)))` });
      console.log('   ', r2.result.value);
    }
  }
}
if (errors.length) console.log('JS errors:', errors);
ws.close(); chrome.kill();
