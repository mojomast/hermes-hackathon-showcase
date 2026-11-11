// Launcher grid: click, arrows, or the app's shortcut key (as in the guest).
(() => {
  const btns = [...document.querySelectorAll('.launcher .grid button')];
  const status = document.getElementById('l-status');
  if (!btns.length) return;
  const cols = () => (matchMedia('(max-width: 600px)').matches ? 3 : 6);
  const pick = (b, focus = true) => {
    btns.forEach((x) => x.classList.toggle('sel', x === b));
    status.textContent = `${b.querySelector('.an').textContent} [${b.dataset.key}] - ${b.dataset.desc}`;
    if (focus) b.focus();
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', (e) => {
      const c = cols();
      const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: c, ArrowUp: -c }[e.key];
      if (d) { e.preventDefault(); pick(btns[(i + d + btns.length) % btns.length]); }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (document.querySelector('dialog[open]')) return;
    const b = btns.find((x) => x.dataset.key === e.key.toUpperCase());
    if (b && e.key.length === 1) {
      const launcher = b.closest('.launcher');
      const r = launcher.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) pick(b);
    }
  });
  const log = document.querySelector('.bootlog');
  if (log && !window.prefersReducedMotion()) {
    const full = log.textContent; log.textContent = '';
    let i = 0;
    const t = setInterval(() => { log.textContent = full.slice(0, i += 3); if (i >= full.length) clearInterval(t); }, 18);
  }
})();
