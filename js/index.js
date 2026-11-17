document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('drawer');
  const closeDrawer = document.getElementById('closeDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const themeToggle = document.getElementById('themeToggle');
  const wordDayAudioButtons = document.querySelectorAll('.mini-audio');
  let currentAudio = null;
  let currentButton = null;

  const setDrawer = (open) => {
    if (drawer) { drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open)); }
    if (backdrop) backdrop.classList.toggle('open', open);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
  };

  if (menuToggle) menuToggle.addEventListener('click', () => setDrawer(true));
  if (closeDrawer) closeDrawer.addEventListener('click', () => setDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('soft-mode');
      themeToggle.textContent = document.body.classList.contains('soft-mode') ? '○' : '●';
    });
  }

  const stopWordDayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentButton) currentButton.textContent = '🔊';
    currentAudio = null;
    currentButton = null;
  };

  wordDayAudioButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const source = button.dataset.audio;
      if (!source) return;

      if (currentButton === button && currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play().catch(() => stopWordDayAudio());
          button.textContent = '❚❚';
        } else {
          stopWordDayAudio();
        }
        return;
      }

      stopWordDayAudio();
      currentAudio = new Audio(source);
      currentButton = button;
      button.textContent = '❚❚';
      currentAudio.play().catch(() => {
        stopWordDayAudio();
        alert('No se encontró el archivo de audio. Coloca el MP3 correspondiente en la carpeta audios/.');
      });
      currentAudio.onended = stopWordDayAudio;
    });
  });
});
