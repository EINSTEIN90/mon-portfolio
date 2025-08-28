const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Charger le mode depuis localStorage
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
} else if (!localStorage.getItem('theme')) {
  // Si pas de préférence, suivre le système
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.classList.add('light-mode');
    toggleBtn.textContent = '☀️';
  }
}

// Changer le thème au clic
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
