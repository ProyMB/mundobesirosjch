document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  const search = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.word-card');
  const categoryButtons = document.querySelectorAll('.category-card');
  const empty = document.getElementById('wordEmpty');
  const filterButton = document.getElementById('filterButton');
  const showAllWords = document.getElementById('showAllWords');
  let selectedCategory = 'Todos';
  let currentAudio = null;
  let currentButton = null;

  if (backButton) backButton.addEventListener('click', () => { window.location.href = 'index.html'; });

  const stopAudio = () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if (currentButton) currentButton.textContent = '🔊';
    currentAudio = null; currentButton = null;
  };

  const playAudio = (button) => {
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
    currentAudio.play().catch(() => { stopAudio(); alert('No se encontró este audio. Coloca el MP3 correspondiente en audios/.'); });
    currentAudio.onended = stopAudio;
  };

  const filterWords = () => {
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

  if (categoryButtons) categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category || 'Todos';
      categoryButtons.forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      filterWords();
    });
  });

  if (search) search.addEventListener('input', filterWords);
  if (filterButton) filterButton.addEventListener('click', () => {
    selectedCategory = 'Todos';
    categoryButtons.forEach(item => item.classList.toggle('selected', item.dataset.category === 'Todos'));
    filterWords();
    search?.focus();
  });
  if (showAllWords) showAllWords.addEventListener('click', () => {
    selectedCategory = 'Todos';
    if (search) search.value = '';
    categoryButtons.forEach(item => item.classList.toggle('selected', item.dataset.category === 'Todos'));
    filterWords();
  });

  if (cards) cards.forEach(card => {
    const button = card.querySelector('.word-audio');
    if (button) button.addEventListener('click', () => playAudio(button));
  });

  filterWords();
});
