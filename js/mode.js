const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Charger le mode depuis localStorage
if (localStorage.getItem('theme') === 'light') {
  root.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
} else if (!localStorage.getItem('theme')) {
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.classList.add('light-mode');
    toggleBtn.textContent = '☀️';
  }
}

// Changer le thème au clic
toggleBtn.addEventListener('click', () => {
  root.classList.toggle('light-mode');
  const isLight = root.classList.contains('light-mode');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
