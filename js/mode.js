const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Charger le mode depuis localStorage ou appliquer le défaut (sombre)
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  root.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
} else {
  // Mode sombre par défaut (rien à faire, les variables CSS par défaut sont sombres)
  toggleBtn.textContent = '🌙';
}

// Changer le thème au clic
toggleBtn.addEventListener('click', () => {
  root.classList.toggle('light-mode');
  const isLight = root.classList.contains('light-mode');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});