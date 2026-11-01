const particleRoot = document.getElementById('particle-field');
if (window.PaigeParticles && particleRoot) {
  const particles = window.PaigeParticles(particleRoot);
  particles.setActive(true);
  for (const type of ['pointermove', 'pointerdown', 'pointerleave']) {
    document.querySelector('main').addEventListener(type, event => {
      particleRoot.querySelector('canvas').dispatchEvent(new PointerEvent(type, {
        clientX: event.clientX, clientY: event.clientY
      }));
    }, {passive: true});
  }
}
