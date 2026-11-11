// The page's toy pet. Purely local; nothing is saved or sent anywhere.
(() => {
  const egg = document.querySelector('.egg');
  if (!egg) return;
  const pet = egg.querySelector('.pet');
  const msg = egg.querySelector('.lcd-msg');
  const m = Object.fromEntries([...egg.querySelectorAll('meter')].map((el) => [el.dataset.m, el]));
  const set = (k, v) => { m[k].value = Math.max(0, Math.min(100, v)); m[k].textContent = Math.round(m[k].value); };
  const acts = {
    feed: () => { set('full', m.full.value + 25); set('health', m.health.value + 5); return 'nom nom!'; },
    play: () => {
      if (m.energy.value < 15) return 'too sleepy...';
      set('happy', m.happy.value + 25); set('energy', m.energy.value - 15); set('full', m.full.value - 8); return 'wheee!';
    },
    rest: () => { set('energy', m.energy.value + 35); return 'zzz...'; },
  };
  egg.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => {
    msg.textContent = acts[b.dataset.act]();
    if (!window.prefersReducedMotion()) { pet.classList.remove('eat'); void pet.offsetWidth; pet.classList.add('eat'); }
  }));
  setInterval(() => {
    if (document.hidden) return;
    set('full', m.full.value - 2); set('happy', m.happy.value - 1.5); set('energy', m.energy.value - 1);
    const low = ['full', 'happy', 'energy'].filter((k) => m[k].value < 25);
    set('health', m.health.value + (low.length ? -2 : 1));
    if (low.length && !msg.dataset.warned) { msg.textContent = low[0] === 'full' ? 'hungry!' : low[0] === 'happy' ? 'bored...' : 'tired...'; msg.dataset.warned = 1; }
    if (!low.length) delete msg.dataset.warned;
  }, 4000);
})();
