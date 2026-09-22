// Rotation lente du ciel — composant A-Frame personnalisé (axe Y)
AFRAME.registerComponent('slow-rotate', {
  schema: { speed: { type: 'number', default: 0.7 } }, // degrés / seconde
  tick: function (time, timeDelta) {
    this.el.object3D.rotation.y += THREE.MathUtils.degToRad(this.data.speed * (timeDelta / 1000));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  const sky = document.querySelector('#sky360');
  const status3d = document.querySelector('#statusText3d');
  const status2d = document.querySelector('#statusText2d');
  const form = document.querySelector('#promptForm');
  const input = document.querySelector('#promptInput');

  function setStatus(msg) {
    status3d.setAttribute('value', msg);
    status2d.textContent = msg;
  }

  function generateSky(prompt) {
    setStatus('Génération spatiale en cours... (peut prendre 15-40s en 4K)');
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=4096&height=2048&nologo=true`;

    const img = new Image();
    img.crossOrigin = 'anonymous'; // DOIT être posé avant .src : évite qu'une texture
                                    // "cross-origin" soit rejetée par le rendu WebGL
    img.onload = () => {
      sky.setAttribute('material', 'src', img);
      setStatus('Décor généré : ' + prompt);
    };
    img.onerror = () => {
      // Si ça échoue systématiquement : teste d'abord sur Chrome desktop (console
      // visible) pour voir si Pollinations bloque l'origine ou si c'est le réseau.
      setStatus('Échec de génération. Réessaie avec une autre description.');
    };
    img.src = url;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    generateSky(prompt);
    input.blur(); // referme le clavier virtuel
    input.value = '';
  });

  // Génération initiale au chargement de la scène
  scene.addEventListener('loaded', () => {
    generateSky('vaste nébuleuse spatiale colorée, étoiles, vue à 360 degrés');
  });
});
