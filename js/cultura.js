document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  const search = document.getElementById('cultureSearch');
  const cards = document.querySelectorAll('.culture-card');
  const categories = document.querySelectorAll('[data-culture-category]');
  const empty = document.getElementById('cultureEmpty');
  const filterButton = document.getElementById('cultureFilterButton');
  let selectedCategory = 'Todos';
  let currentMedia = null;
  let currentButton = null;

  const setButtonState = (button, isPlaying) => {
    if (!button) return;
    const label = isPlaying ? '❚❚' : '▶';
    const time = button.querySelector('span');
    button.innerHTML = `${label}${time ? ' ' + time.outerHTML : ''}`;
  };

  if (backButton) backButton.addEventListener('click', () => { window.location.href = 'index.html'; });

  const stopMedia = () => {
    if (currentMedia) {
      currentMedia.pause?.();
      currentMedia.currentTime = 0;
    }
    if (currentButton) setButtonState(currentButton, false);
    currentMedia = null;
    currentButton = null;
  };

  const getMediaSource = (button) => button?.dataset.video || button?.dataset.audio || null;
  const getMediaType = (button) => button?.dataset.video ? 'video' : button?.dataset.audio ? 'audio' : 'archivo';

  const playMedia = (button) => {
    const source = getMediaSource(button);
    if (!source) return;
    const mediaType = getMediaType(button);

    if (currentButton === button && currentMedia) {
      if (currentMedia.paused) {
        currentMedia.play().catch(() => {});
        setButtonState(button, true);
      } else {
        currentMedia.pause();
        setButtonState(button, false);
      }
      return;
    }

    stopMedia();
    currentButton = button;
    currentMedia = mediaType === 'video' ? document.createElement('video') : new Audio();
    currentMedia.src = source;
    setButtonState(button, true);

    currentMedia.play().catch(() => {
      stopMedia();
      const folder = mediaType === 'video' ? 'videos/' : 'audios/';
      const extension = mediaType === 'video' ? 'MP4' : 'MP3';
      alert(`No se encontró este ${mediaType}. Agrega el archivo ${extension} en la carpeta ${folder}.`);
    });
    currentMedia.onended = stopMedia;
  };

  const filterCulture = () => {
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
      selectedCategory = button.dataset.cultureCategory || 'Todos';
      categories.forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      filterCulture();
    });
  });

  if (search) search.addEventListener('input', filterCulture);
  if (filterButton) filterButton.addEventListener('click', () => { selectedCategory = 'Todos'; filterCulture(); search?.focus(); });

  const playButtons = document.querySelectorAll('.culture-play');
  if (playButtons) playButtons.forEach(button => button.addEventListener('click', () => playMedia(button)));

  filterCulture();
});
