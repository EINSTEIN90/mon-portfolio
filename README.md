# Portfolio Vanilla - HTML, CSS, JavaScript

Un portfolio professionnel moderne créé avec HTML5, CSS3, JavaScript vanilla et Tailwind CSS. Design responsive, animations fluides et optimisé pour les performances.

## 🚀 Fonctionnalités

- **Design moderne** : Interface professionnelle avec le design system Pixel Pushers
- **Responsive** : Adapté à tous les appareils (mobile, tablette, desktop)
- **Animations fluides** : Micro-interactions et animations CSS/JS
- **Performance optimisée** : Lazy loading, code minifié, optimisation images
- **SEO friendly** : Structure HTML sémantique, meta tags optimisés
- **Accessibilité** : Navigation clavier, contrastes respectés, aria-labels

## 📁 Structure du projet

```
portfolio-vanilla/
├── index.html              # Page d'accueil
├── about.html              # À propos
├── portfolio.html          # Projets
├── skills.html             # Compétences  
├── contact.html            # Contact
├── cv.html                 # CV
├── css/
│   └── style.css          # Styles personnalisés
├── js/
│   └── main.js            # JavaScript principal
├── img/                   # Images (à ajouter)
├── blog/                  # Articles blog (optionnel)
└── README.md              # Documentation
```

## 🎨 Design System

### Couleurs principales
- **Primaire** : `#d9fb06` (Lime green)
- **Fond principal** : `#1a1c1b` (Noir profond)
- **Fond cartes** : `#302f2c` (Gris foncé)
- **Texte secondaire** : `#888680` (Gris moyen)
- **Accent olive** : `#3f4816` (Olive foncé)

### Typographie
- **Famille principale** : Inter (Google Fonts)
- **Famille titres** : Space Grotesk (Google Fonts)
- **Échelle modulaire** : System responsive avec clamp()

## 🛠️ Installation et utilisation

### 1. Déploiement local simple

```bash
# Méthode 1 : Serveur HTTP Python
cd portfolio-vanilla
python -m http.server 8000

# Méthode 2 : Serveur HTTP Node.js (si installé)
npx http-server -p 8000

# Méthode 3 : Live Server (VS Code extension)
# Clic droit sur index.html > "Open with Live Server"
```

Ouvrir `http://localhost:8000` dans votre navigateur.

### 2. Personnalisation

#### Modifier les informations personnelles
1. **Textes** : Éditer directement dans les fichiers HTML
2. **Images** : Ajouter vos images dans le dossier `/img/`
3. **Projets** : Modifier la fonction `getProjectData()` dans `js/main.js`
4. **Couleurs** : Ajuster les variables CSS dans `css/style.css`

#### Ajouter des projets
Dans `js/main.js`, modifier l'objet `projects` :

```javascript
const projects = {
    nouveauProjet: {
        title: 'Mon Nouveau Projet',
        description: 'Description du projet...',
        icon: 'fas fa-code',
        technologies: ['HTML', 'CSS', 'JS'],
        features: ['Feature 1', 'Feature 2'],
        liveUrl: 'https://monprojet.com',
        githubUrl: 'https://github.com/user/repo'
    }
};
```

#### Personnaliser les styles
Variables CSS principales dans `css/style.css` :

```css
:root {
  --brand-primary: #d9fb06;    /* Couleur principale */
  --bg-page: #1a1c1b;         /* Fond principal */
  --bg-card: #302f2c;         /* Fond cartes */
}
```

## ⚡ Fonctionnalités JavaScript

### Navigation
- Menu mobile responsive
- Navigation smooth scroll
- Liens actifs automatiques

### Projets
- Modal dynamique pour les détails
- Système de filtres (à implémenter)
- Lazy loading des images

### Formulaires
- Validation en temps réel
- Protection anti-spam (honeypot)
- Messages de confirmation

### Animations
- Animations au scroll (Intersection Observer)
- Barres de progression animées
- Micro-interactions sur hover

## 🔧 Optimisations et bonnes pratiques

### Performance
- **Images** : Utilisez WebP quand possible, compressez les images
- **CSS** : Styles critiques inline, lazy loading du reste
- **JavaScript** : Code modulaire, event delegation
- **Fonts** : Préchargement des Google Fonts

### SEO
- Meta tags optimisés
- Structure HTML sémantique
- Schema.org markup (à ajouter)
- Sitemap.xml (à générer)

### Accessibilité
- Navigation clavier complète
- Aria-labels sur les éléments interactifs
- Contrastes de couleur respectés
- Focus visible

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablette** : 768px - 1199px  
- **Desktop** : ≥ 1200px

### Stratégie Mobile-First
Le CSS utilise une approche mobile-first avec des media queries progressives.

## 🚀 Déploiement

### Options de déploiement gratuites
1. **Netlify** : Glisser-déposer le dossier
2. **Vercel** : Import depuis GitHub
3. **GitHub Pages** : Push vers repo GitHub
4. **Surge.sh** : `npm install -g surge && surge`

### Préparation pour la production
1. Optimiser les images (WebP, compression)
2. Minifier CSS/JS (optionnel pour un projet simple)
3. Tester sur tous les navigateurs
4. Valider HTML/CSS (W3C Validator)

## 🔮 Évolutions possibles

### Fonctionnalités avancées
- [ ] Système de blog avec markdown
- [ ] Mode sombre/clair
- [ ] Multilingue (i18n)
- [ ] Système de recherche
- [ ] Analytics intégrés
- [ ] PWA (Progressive Web App)

### Intégrations tierces
- [ ] EmailJS pour les formulaires
- [ ] Google Analytics
- [ ] Calendly pour les rendez-vous
- [ ] CMS headless (Strapi, Contentful)

## 🐛 Dépannage

### Problèmes courants
1. **Fonts ne se chargent pas** : Vérifier la connexion internet
2. **Images cassées** : Vérifier les chemins relatifs
3. **JavaScript ne fonctionne pas** : Ouvrir la console navigateur
4. **Styles non appliqués** : Vider le cache navigateur

### Support navigateurs
- Chrome/Edge 90+
- Firefox 88+ 
- Safari 14+
- Mobile browsers modernes

## 📞 Support

Pour toute question ou amélioration :
1. Vérifier la documentation ci-dessus
2. Consulter les commentaires dans le code
3. Tester dans différents navigateurs
4. Utiliser les outils de développement navigateur

## 📄 Licence

Ce projet est libre d'utilisation pour vos projets personnels et commerciaux.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2024  
**Compatibilité** : Navigateurs modernes