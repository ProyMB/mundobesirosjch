document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  const search = document.getElementById('audioSearch');
  const cards = document.querySelectorAll('.audio-card');
  const categories = document.querySelectorAll('[data-audio-category]');
  const empty = document.getElementById('audioEmpty');
  const status = document.getElementById('audioStatus');
  const filterButton = document.getElementById('audioFilterButton');
  let selectedCategory = 'Todos';
  let currentAudio = null;
  let currentButton = null;

  if (backButton) backButton.addEventListener('click', () => { window.location.href = 'index.html'; });

  const stopAudio = () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if (currentButton) { currentButton.textContent = '▶'; currentButton.classList.remove('active'); }
    currentAudio = null; currentButton = null;
  };

  const playAudio = (button) => {
    const source = button?.dataset.audio;
    if (!source) return;

    if (currentButton === button && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play().catch(() => {});
        button.textContent = '❚❚';
        button.classList.add('active');
      } else {
        currentAudio.pause();
        button.textContent = '▶';
        button.classList.remove('active');
      }
      return;
    }

    stopAudio();
    currentAudio = new Audio(source);
    currentButton = button;
    button.textContent = '❚❚';
    button.classList.add('active');

    currentAudio.play().catch(() => {
      if (status) status.textContent = `No se pudo reproducir ${source}. Verifica que el MP3 exista en la carpeta audios/.`;
      stopAudio();
    });
    currentAudio.onended = stopAudio;
  };

  const filterAudio = () => {
    const term = search?.value.trim().toLowerCase() || '';
    let count = 0;
    if (cards) cards.forEach(card => {
      const text = card.dataset.search?.toLowerCase() || '';
      const category = card.dataset.category || '';
      const show = text.includes(term) && (selectedCategory === 'Todos' || category === selectedCategory);
      card.hidden = !show;
      if (show) count++;
    });
    if (empty) empty.hidden = count !== 0;
  };

  if (categories) categories.forEach(button => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.audioCategory || 'Todos';
      categories.forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      filterAudio();
    });
  });

  if (search) search.addEventListener('input', filterAudio);
  if (filterButton) filterButton.addEventListener('click', () => {
    selectedCategory = 'Todos';
    categories.forEach(item => item.classList.remove('selected'));
    filterAudio();
    search?.focus();
  });

  if (cards) cards.forEach(card => {
    const play = card.querySelector('.play-btn');
    const bookmark = card.querySelector('.bookmark');
    if (play) play.addEventListener('click', () => playAudio(play));
    if (bookmark) bookmark.addEventListener('click', () => {
      bookmark.classList.toggle('saved');
      bookmark.textContent = bookmark.classList.contains('saved') ? '♥' : '♡';
    });
  });

  filterAudio();
});
