// Decorative orthographic globe: graticule, great-circle routes, and pins at
// the cities that appear in the plugin's own screenshots.
(() => {
  const c = document.getElementById('globe');
  if (!c) return;
  const ctx = c.getContext('2d');
  const D = Math.PI / 180;
  const pins = [
    ['TOKYO', 35.68, 139.69], ['SAN DIEGO', 32.72, -117.16], ['LONDON', 51.5, -0.12],
    ['SYDNEY', -33.86, 151.21], ['BERLIN', 52.52, 13.4], ['MONTRÉAL', 45.51, -73.55],
  ];
  const routes = [[5, 2], [2, 4], [4, 0], [0, 3], [0, 1], [1, 5]];
  let lon0 = -40, lat0 = 22, last = 0, drag = null;
  const size = () => {
    const r = c.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = r.width * dpr; c.height = r.height * dpr;
  };
  const proj = (lat, lon, R, cx, cy) => {
    const p = lat * D, l = (lon - lon0) * D, p0 = lat0 * D;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return [cx + R * Math.cos(p) * Math.sin(l), cy - R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)), cosc];
  };
  const toVec = (lat, lon) => [Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D)];
  const toLL = (v) => [Math.asin(v[2]) / D, Math.atan2(v[1], v[0]) / D];
  const slerp = (a, b, t) => {
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const w = Math.acos(dot), s = Math.sin(w) || 1;
    const k1 = Math.sin((1 - t) * w) / s, k2 = Math.sin(t * w) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  };
  const line = (pts, R, cx, cy, front, back) => {
    let prevVis = null;
    ctx.beginPath();
    for (const [la, lo] of pts) {
      const [x, y, z] = proj(la, lo, R, cx, cy);
      const vis = z >= 0;
      if (vis !== prevVis) { ctx.stroke(); ctx.strokeStyle = vis ? front : back; ctx.beginPath(); ctx.moveTo(x, y); }
      else ctx.lineTo(x, y);
      prevVis = vis;
    }
    ctx.stroke();
  };
  const draw = (t) => {
    const w = c.width, h = c.height, R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
    const u = w / 720;
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R);
    g.addColorStop(0, '#16406f'); g.addColorStop(1, '#071a33');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 1 * u;
    for (let lo = -180; lo < 180; lo += 15) {
      const pts = []; for (let la = -90; la <= 90; la += 3) pts.push([la, lo]);
      line(pts, R, cx, cy, lo % 90 === 0 ? 'rgba(227,176,75,.55)' : 'rgba(95,212,234,.32)', 'rgba(95,212,234,.05)');
    }
    for (let la = -75; la <= 75; la += 15) {
      const pts = []; for (let lo = -180; lo <= 180; lo += 3) pts.push([la, lo]);
      line(pts, R, cx, cy, la === 0 ? 'rgba(227,176,75,.6)' : 'rgba(95,212,234,.32)', 'rgba(95,212,234,.05)');
    }
    ctx.lineWidth = 1.6 * u; ctx.setLineDash([5 * u, 5 * u]);
    ctx.lineDashOffset = -t / 40;
    for (const [a, b] of routes) {
      const va = toVec(pins[a][1], pins[a][2]), vb = toVec(pins[b][1], pins[b][2]);
      const pts = []; for (let i = 0; i <= 60; i++) pts.push(toLL(slerp(va, vb, i / 60)));
      line(pts, R, cx, cy, 'rgba(227,176,75,.9)', 'rgba(227,176,75,0)');
    }
    ctx.setLineDash([]);
    ctx.font = `700 ${11 * u}px "Space Mono", monospace`;
    for (const [name, la, lo] of pins) {
      const [x, y, z] = proj(la, lo, R, cx, cy);
      if (z < 0) continue;
      const pulse = (t / 1400) % 1;
      ctx.strokeStyle = `rgba(95,212,234,${1 - pulse})`;
      ctx.beginPath(); ctx.arc(x, y, (4 + pulse * 14) * u, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#e3b04b'; ctx.beginPath(); ctx.arc(x, y, 3.5 * u, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(233,226,204,.92)'; ctx.fillText(name, x + 8 * u, y - 6 * u);
    }
    ctx.strokeStyle = 'rgba(227,176,75,.8)'; ctx.lineWidth = 1.5 * u;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(95,212,234,.25)';
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2); ctx.stroke();
    for (let a = 0; a < 360; a += 10) {
      const r1 = R * 1.08, r2 = R * (a % 30 === 0 ? 1.13 : 1.1);
      ctx.beginPath();
      ctx.moveTo(cx + r1 * Math.cos(a * D), cy + r1 * Math.sin(a * D));
      ctx.lineTo(cx + r2 * Math.cos(a * D), cy + r2 * Math.sin(a * D));
      ctx.stroke();
    }
  };
  const loop = (t) => {
    if (!drag && !window.prefersReducedMotion()) lon0 += (t - last) * 0.006;
    last = t; draw(t);
    if (!window.prefersReducedMotion() || drag) requestAnimationFrame(loop);
  };
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY, lon0, lat0]; c.setPointerCapture(e.pointerId); requestAnimationFrame(loop); });
  c.addEventListener('pointermove', (e) => {
    if (!drag) return;
    lon0 = drag[2] - (e.clientX - drag[0]) * 0.4;
    lat0 = Math.max(-80, Math.min(80, drag[3] + (e.clientY - drag[1]) * 0.4));
    if (window.prefersReducedMotion()) draw(0);
  });
  c.addEventListener('pointerup', () => { drag = null; });
  addEventListener('resize', () => { size(); draw(last); });
  size();
  if (window.prefersReducedMotion()) draw(0); else requestAnimationFrame(loop);
})();
