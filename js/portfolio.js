/**
 * Portfolio.js - Gestion spécifique de la page projets
 * Filtres, animations et interactions avancées
 */

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilters();
    initLoadMore();
    addProjectData();
});

// ==========================================================================
// Système de filtres pour les projets
// ==========================================================================

function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrer les projets
            filterProjects(filter, projectCards);
        });
    });
}

function filterProjects(filter, projectCards) {
    projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
            // Réinitialiser l'animation
            setTimeout(() => {
                card.classList.remove('fade-in-up');
            }, 600);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Compter les projets visibles
    const visibleProjects = Array.from(projectCards).filter(card => 
        card.style.display !== 'none'
    ).length;
    
    console.log(`${visibleProjects} projet(s) affiché(s) pour le filtre: ${filter}`);
}

// ==========================================================================
// Bouton "Voir plus"
// ==========================================================================

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Simuler le chargement de nouveaux projets
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Chargement...';
        this.disabled = true;
        
        setTimeout(() => {
            loadMoreProjects();
            this.innerHTML = 'Voir plus de projets';
            this.disabled = false;
        }, 1500);
    });
}

function loadMoreProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Projets supplémentaires à charger (simulation)
    const additionalProjects = [
        {
            id: 'project7',
            title: 'Blog Personnel',
            description: 'Blog moderne avec système de commentaires et partage social',
            category: 'web',
            icon: 'fas fa-blog',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Markdown'],
            year: '2023'
        },
        {
            id: 'project8', 
            title: 'Calculator App',
            description: 'Calculatrice avancée avec historique et thèmes personnalisables',
            category: 'app',
            icon: 'fas fa-calculator',
            technologies: ['JavaScript', 'CSS Grid', 'Local Storage'],
            year: '2023'
        }
    ];
    
    additionalProjects.forEach(project => {
        const projectHTML = createProjectCard(project);
        projectsGrid.insertAdjacentHTML('beforeend', projectHTML);
    });
    
    // Réinitialiser les événements pour les nouvelles cartes
    const newCards = projectsGrid.querySelectorAll('.project-card:not([data-initialized])');
    newCards.forEach(card => {
        card.setAttribute('data-initialized', 'true');
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('onclick').match(/'([^']+)'/)[1];
            openProject(projectId);
        });
    });
    
    showToast('Nouveaux projets chargés !', 'success');
}

function createProjectCard(project) {
    return `
        <div class="project-card group cursor-pointer fade-in-up" data-category="${project.category}" onclick="openProject('${project.id}')">
            <div class="aspect-video bg-secondary-olive rounded-lg mb-6 relative overflow-hidden">
                <div class="w-full h-full bg-gradient-to-br from-brand-primary/20 to-secondary-olive flex items-center justify-center">
                    <i class="${project.icon} text-4xl text-brand-primary"></i>
                </div>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <i class="fas fa-eye text-2xl text-white"></i>
                </div>
            </div>
            <h3 class="heading-5 mb-3">${project.title}</h3>
            <p class="body-small text-secondary mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="flex items-center justify-between">
                <span class="caption text-brand-primary">${project.year}</span>
                <div class="flex space-x-2">
                    <a href="#" class="text-secondary hover:text-brand-primary transition-colors" onclick="event.stopPropagation()">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="#" class="text-secondary hover:text-brand-primary transition-colors" onclick="event.stopPropagation()">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
// Données des projets supplémentaires
// ==========================================================================

function addProjectData() {
    // Étendre les données de projets existantes dans main.js
    if (window.PortfolioJS) {
        // Ajouter de nouveaux projets aux données existantes
        const additionalProjectsData = {
            project4: {
                title: 'API REST Complète',
                description: 'API RESTful robuste avec authentification JWT, gestion des utilisateurs, et documentation interactive Swagger. Architecture scalable avec middleware de validation et gestion d\'erreurs centralisée.',
                icon: 'fas fa-server',
                technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger', 'Bcrypt'],
                features: [
                    'Authentification JWT sécurisée',
                    'CRUD complet pour tous les modèles',
                    'Validation des données avec Joi',
                    'Documentation Swagger interactive',
                    'Gestion des erreurs centralisée',
                    'Tests unitaires et d\'intégration'
                ],
                liveUrl: 'https://api-demo.example.com',
                githubUrl: 'https://github.com/user/api-rest'
            },
            project5: {
                title: 'Site Vitrine Professionnel',
                description: 'Site corporate moderne avec CMS intégré, système multilingue et optimisation SEO avancée. Interface d\'administration pour la gestion de contenu et analytics intégrés.',
                icon: 'fas fa-globe',
                technologies: ['HTML5', 'SASS', 'JavaScript', 'CMS', 'i18n', 'SEO'],
                features: [
                    'Design responsive et moderne',
                    'CMS intégré pour la gestion de contenu',
                    'Système multilingue (FR/EN)',
                    'Optimisation SEO avancée',
                    'Analytics et tracking intégrés',
                    'Formulaires de contact sécurisés'
                ],
                liveUrl: 'https://site-demo.example.com',
                githubUrl: 'https://github.com/user/site-vitrine'
            },
            project6: {
                title: 'PWA Mobile-First',
                description: 'Application web progressive avec fonctionnalités offline, notifications push et installation sur l\'écran d\'accueil. Optimisée pour mobile avec service worker avancé.',
                icon: 'fas fa-mobile',
                technologies: ['PWA', 'Service Worker', 'IndexedDB', 'Push API', 'Manifest', 'Workbox'],
                features: [
                    'Fonctionnement offline complet',
                    'Notifications push personnalisées',
                    'Installation sur écran d\'accueil',
                    'Synchronisation en arrière-plan',
                    'Cache intelligent des ressources',
                    'Interface native mobile'
                ],
                liveUrl: 'https://pwa-demo.example.com',
                githubUrl: 'https://github.com/user/pwa-app'
            },
            project7: {
                title: 'Blog Personnel',
                description: 'Blog moderne avec système de commentaires, partage social et recherche avancée. Interface d\'administration pour la gestion des articles et statistiques détaillées.',
                icon: 'fas fa-blog',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Markdown', 'LocalStorage', 'Social APIs'],
                features: [
                    'Éditeur Markdown intégré',
                    'Système de commentaires',
                    'Partage sur réseaux sociaux',
                    'Recherche full-text',
                    'Catégories et tags',
                    'Mode sombre/clair'
                ],
                liveUrl: 'https://blog-demo.example.com',
                githubUrl: 'https://github.com/user/blog'
            },
            project8: {
                title: 'Calculator App',
                description: 'Calculatrice scientifique avancée avec historique des calculs, thèmes personnalisables et raccourcis clavier. Interface intuitive et fonctionnalités étendues.',
                icon: 'fas fa-calculator',
                technologies: ['JavaScript', 'CSS Grid', 'Local Storage', 'PWA', 'Keyboard Events'],
                features: [
                    'Calculs scientifiques avancés',
                    'Historique persistent',
                    'Thèmes personnalisables',
                    'Raccourcis clavier',
                    'Mode développeur',
                    'Export des résultats'
                ],
                liveUrl: 'https://calc-demo.example.com',
                githubUrl: 'https://github.com/user/calculator'
            }
        };
        
        // Étendre la fonction getProjectData
        const originalGetProjectData = window.getProjectData;
        window.getProjectData = function(projectId) {
            return originalGetProjectData(projectId) || additionalProjectsData[projectId] || null;
        };
    }
}

// ==========================================================================
// Styles CSS pour les boutons de filtre
// ==========================================================================

// Ajouter les styles des boutons de filtre via JavaScript
function addFilterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .filter-btn {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-medium);
            border-radius: 2rem;
            padding: 0.75em 1.5em;
            font-family: 'Inter', Arial, sans-serif;
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .filter-btn:hover {
            color: var(--brand-primary);
            border-color: var(--brand-primary);
            transform: translateY(-1px);
        }
        
        .filter-btn.active {
            background: var(--brand-primary);
            color: var(--text-inverse);
            border-color: var(--brand-primary);
        }
        
        .filter-btn:active {
            transform: translateY(0);
        }
        
        @media (max-width: 767px) {
            .filter-btn {
                font-size: 0.8rem;
                padding: 0.6em 1.2em;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialiser les styles au chargement
document.addEventListener('DOMContentLoaded', addFilterStyles);