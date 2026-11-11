(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  window.prefersReducedMotion = () => reduced.matches;

  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  ready(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('[data-reveal]');
    if (reduced.matches || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveals.forEach((el) => io.observe(el));
    }

    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const label = btn.textContent;
        try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copied'; }
        catch { btn.textContent = 'Select & copy'; }
        setTimeout(() => { btn.textContent = label; }, 1600);
      });
    });

    // Lightbox
    const dlg = document.querySelector('dialog.lightbox');
    if (dlg && typeof dlg.showModal === 'function') {
      const im = dlg.querySelector('img');
      const cap = dlg.querySelector('figcaption');
      const count = dlg.querySelector('.lb-count');
      const orig = dlg.querySelector('.lb-orig');
      let set = []; let idx = 0; let opener = null;
      const show = (i) => {
        idx = (i + set.length) % set.length;
        const b = set[idx];
        im.src = b.dataset.full;
        im.alt = b.dataset.caption || '';
        cap.textContent = b.dataset.caption || '';
        orig.href = b.dataset.orig;
        count.textContent = `${idx + 1} / ${set.length}`;
        dlg.querySelector('.lb-prev').hidden = dlg.querySelector('.lb-next').hidden = set.length < 2;
      };
      document.querySelectorAll('[data-gallery]').forEach((g) => {
        const btns = [...g.querySelectorAll('.g-open')];
        btns.forEach((b, i) => b.addEventListener('click', () => {
          set = btns; opener = b; show(i); dlg.showModal(); dlg.querySelector('.lb-close').focus();
        }));
      });
      dlg.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
      dlg.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
      dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
      dlg.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('close', () => { im.removeAttribute('src'); opener?.focus(); });
    }

    // X embeds load widgets.js only when scrolled near.
    const embeds = document.querySelectorAll('[data-x-embed]');
    if (embeds.length) {
      const load = () => {
        if (document.getElementById('x-widgets')) return;
        const s = document.createElement('script');
        s.id = 'x-widgets'; s.async = true; s.src = 'https://platform.twitter.com/widgets.js';
        document.body.appendChild(s);
      };
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((en) => { if (en.some((e) => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '400px' });
        embeds.forEach((e) => io.observe(e));
      } else load();
    }

    // Pause other videos when one plays.
    const vids = [...document.querySelectorAll('video')];
    vids.forEach((v) => v.addEventListener('play', () => vids.forEach((o) => o !== v && o.pause())));
  });
})();
