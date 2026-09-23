AFRAME.registerComponent('slow-rotate', {
  schema: {
    speed: {
      type: 'number',
      default: 0.7
    }
  },

  tick: function (time, timeDelta) {
    if (!this.el.object3D) return;

    this.el.object3D.rotation.y +=
      THREE.MathUtils.degToRad(
        this.data.speed * (timeDelta / 1000)
      );
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  const sky = document.querySelector('#sky360');
  const status3d = document.querySelector('#statusText3d');
  const status2d = document.querySelector('#statusText2d');
  const form = document.querySelector('#promptForm');
  const input = document.querySelector('#promptInput');

  function setStatus(message) {
    if (status3d) status3d.setAttribute('value', message);
    if (status2d) status2d.textContent = message;
  }

  function generateSky(prompt) {
    setStatus('Génération du décor...');

    /*
      2048×1024 = beaucoup plus raisonnable pour commencer sur Quest 3.
      Si tout fonctionne, tu pourras tester 4096×2048 ensuite.
    */
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?width=2048&height=1024&nologo=true`;

    // Chargement préalable pour détecter une erreur réseau/CORS.
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      sky.setAttribute('src', url);
      setStatus('Décor généré.');
    };

    img.onerror = () => {
      setStatus('Erreur image. Vérifie le réseau ou réessaie.');
      console.error('Impossible de charger l’image :', url);
    };

    img.src = url;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const prompt = input.value.trim();
    if (!prompt) return;

    generateSky(prompt);

    input.value = '';
    input.blur();
  });

  scene.addEventListener('loaded', () => {
    setStatus('VR prête. Génération du décor...');

    generateSky(
      'vaste nébuleuse spatiale violette et bleue, étoiles brillantes, ' +
      'trou noir au loin, environnement panoramique 360 degrés, ' +
      'sans texte, sans interface'
    );
  });

  scene.addEventListener('enter-vr', () => {
    setStatus('Mode VR activé.');
  });

  scene.addEventListener('exit-vr', () => {
    setStatus('Mode VR quitté.');
  });
});
