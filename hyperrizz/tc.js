(() => {
  const el = document.getElementById('tc');
  if (!el || window.prefersReducedMotion()) return;
  const t0 = performance.now();
  const p = (n) => String(n).padStart(2, '0');
  const tick = (t) => {
    const f = Math.floor((t - t0) / (1000 / 30));
    el.textContent = `${p(Math.floor(f / 108000))}:${p(Math.floor(f / 1800) % 60)}:${p(Math.floor(f / 30) % 60)}:${p(f % 30)}`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
