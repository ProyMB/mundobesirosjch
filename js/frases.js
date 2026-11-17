document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  const search = document.getElementById('phraseSearch');
  const cards = document.querySelectorAll('.phrase-card');
  const empty = document.getElementById('phraseEmpty');
  const listenAll = document.getElementById('listenAll');
  let currentAudio = null;
  let currentButton = null;

  if (backButton) backButton.addEventListener('click', () => { window.location.href = 'index.html'; });

  const stopAudio = () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if (currentButton) currentButton.textContent = '🔊';
    currentAudio = null; currentButton = null;
  };

  const playButtonAudio = (button) => {
    const source = button?.dataset.audio;
    if (!source) return;
    if (currentButton === button && currentAudio) {
      if (currentAudio.paused) { currentAudio.play().catch(() => {}); button.textContent = '❚❚'; }
      else { currentAudio.pause(); button.textContent = '🔊'; }
      return;
    }
    stopAudio();
    currentAudio = new Audio(source);
    currentButton = button;
    button.textContent = '❚❚';
    currentAudio.play().catch(() => { stopAudio(); alert('No se encontró este audio. Agrega el archivo MP3 indicado en la carpeta audios/.'); });
    currentAudio.onended = stopAudio;
  };

  if (cards) cards.forEach(card => {
    const sound = card.querySelector('.sound-button');
    const bookmark = card.querySelector('.bookmark');
    if (sound) sound.addEventListener('click', () => playButtonAudio(sound));
    if (bookmark) bookmark.addEventListener('click', () => {
      bookmark.classList.toggle('saved');
      bookmark.textContent = bookmark.classList.contains('saved') ? '♥' : '♡';
    });
  });

  const filter = () => {
    const term = search?.value.trim().toLowerCase() || '';
    let count = 0;
    if (cards) cards.forEach(card => {
      const haystack = card.dataset.search?.toLowerCase() || '';
      const show = haystack.includes(term);
      card.hidden = !show;
      if (show) count++;
    });
    if (empty) empty.hidden = count !== 0;
  };

  if (search) search.addEventListener('input', filter);

  if (listenAll) listenAll.addEventListener('click', () => {
    const firstVisible = Array.from(cards).find(card => !card.hidden);
    const button = firstVisible?.querySelector('.sound-button');
    if (button) playButtonAudio(button);
  });

  filter();
});
