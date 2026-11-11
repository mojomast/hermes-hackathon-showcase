(() => {
  const el = document.querySelector('[data-count]');
  if (!el || window.prefersReducedMotion()) return;
  const target = Number(el.dataset.count);
  const fmt = (n) => n.toLocaleString('en-US');
  el.setAttribute('aria-label', fmt(target));
  const t0 = performance.now(), dur = 1600;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
})();
