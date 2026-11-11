(() => {
  const svg = document.querySelector('svg.flow');
  if (!svg) return;
  const apply = () => (window.prefersReducedMotion() ? svg.pauseAnimations() : svg.unpauseAnimations());
  apply();
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', apply);
})();
