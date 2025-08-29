// mode.js - Solution robuste et complète
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Fonction pour appliquer le thème de manière forcée
function applyTheme(isDark) {
  if (isDark) {
    root.classList.remove('light-mode');
    toggleBtn.textContent = '🌙';
    // Force le mode sombre même si les préférences système sont différentes
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light-mode');
    toggleBtn.textContent = '☀️';
    root.style.colorScheme = 'light';
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  
  // Logique claire : défaut sombre, ou thème sauvegardé
  if (savedTheme === 'light') {
    applyTheme(false); // Mode clair
  } else {
    applyTheme(true);  // Mode sombre (défaut)
    // S'assurer que localStorage reflète le défaut
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
    }
  }
});

// Gestionnaire de clic pour le bouton
toggleBtn?.addEventListener('click', () => {
  const isCurrentlyDark = !root.classList.contains('light-mode');
  const newTheme = isCurrentlyDark ? 'light' : 'dark';
  
  // Appliquer le nouveau thème
  applyTheme(newTheme === 'dark');
  
  // Sauvegarder dans localStorage
  localStorage.setItem('theme', newTheme);
  
  // Debug pour vérifier
  console.log('Thème changé vers:', newTheme);
  console.log('Classe light-mode présente:', root.classList.contains('light-mode'));
});