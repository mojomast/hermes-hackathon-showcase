// A tiny Web Audio step sequencer for the page. Silent until the user presses Play.
(() => {
  const rows = [...document.querySelectorAll('.seq .row')];
  if (!rows.length) return;
  const play = document.querySelector('.t-play');
  const stop = document.querySelector('.t-stop');
  const mute = document.querySelector('.t-mute');
  const bpmIn = document.querySelector('.t-bpm input');
  const state = document.querySelector('.t-state');
  const word = document.querySelector('.word');
  const letters = [...word.querySelectorAll('span')];
  let ac = null, out = null, timer = null, step = 0, nextT = 0, muted = false;

  const render = (row) => {
    const mini = row.querySelector('.mini');
    const name = row.dataset.row;
    mini.innerHTML = [...row.querySelectorAll('.st')].map((b, i) =>
      `<span class="tok${b.getAttribute('aria-pressed') === 'true' ? '' : ' rest'}" data-i="${i}">${b.getAttribute('aria-pressed') === 'true' ? name : '~'}</span>`).join(' ');
  };
  rows.forEach((row) => {
    row.querySelectorAll('.st').forEach((b) => b.addEventListener('click', () => {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      render(row);
    }));
    render(row);
  });

  const noise = () => {
    const b = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
    const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  };
  let nbuf;
  const voices = {
    bd: (t) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + .18); g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g).connect(out); o.start(t); o.stop(t + .32); },
    sd: (t) => { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nbuf; f.type = 'bandpass'; f.frequency.value = 1800; g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .18); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + .2); },
    hh: (t) => { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nbuf; f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .05); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + .06); },
    blip: (t, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = [392, 523.25, 659.25, 587.33][i % 4]; g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); o.connect(g).connect(out); o.start(t); o.stop(t + .13); },
  };

  const bpm = () => Math.max(60, Math.min(200, Number(bpmIn.value) || 126));
  const highlight = (i) => {
    rows.forEach((row) => {
      row.querySelectorAll('.st').forEach((b, j) => b.classList.toggle('now', j === i));
      row.querySelectorAll('.tok').forEach((tk, j) => tk.classList.toggle('on', j === i && !tk.classList.contains('rest')));
    });
    letters.forEach((l, j) => l.classList.toggle('hit', i >= 0 && j === Math.floor(i / 16 * letters.length)));
  };
  const tick = () => {
    const spb = 60 / bpm() / 4;
    while (nextT < ac.currentTime + 0.1) {
      const i = step % 16;
      rows.forEach((row) => {
        if (row.querySelectorAll('.st')[i].getAttribute('aria-pressed') === 'true') voices[row.dataset.row](nextT, i);
      });
      const delay = Math.max(0, (nextT - ac.currentTime) * 1000);
      setTimeout(() => highlight(i), delay);
      nextT += spb; step++;
    }
  };
  play.addEventListener('click', async () => {
    if (!ac) { ac = new AudioContext(); out = ac.createGain(); out.gain.value = .8; out.connect(ac.destination); nbuf = noise(); }
    await ac.resume();
    if (timer) return;
    nextT = ac.currentTime + 0.05; step = 0;
    timer = setInterval(tick, 25);
    play.setAttribute('aria-pressed', 'true'); word.classList.add('live');
    state.textContent = `playing · ${bpm()} bpm`;
  });
  stop.addEventListener('click', () => {
    clearInterval(timer); timer = null; highlight(-1);
    play.setAttribute('aria-pressed', 'false'); word.classList.remove('live');
    state.textContent = 'stopped';
  });
  mute.addEventListener('click', () => {
    muted = !muted; mute.setAttribute('aria-pressed', String(muted));
    if (out) out.gain.value = muted ? 0 : .8;
  });
  bpmIn.addEventListener('change', () => { if (timer) state.textContent = `playing · ${bpm()} bpm`; });
})();
