/**
 * Portfolio Vanilla JavaScript
 * Gestion des interactions, animations et fonctionnalités
 */

// ==========================================================================
// Variables globales
// ==========================================================================

let isMenuOpen = false;
let currentProject = null;

// ==========================================================================
// Initialisation
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Navigation mobile
    initMobileMenu();
    
    // Smooth scroll pour les ancres
    initSmoothScroll();
    
    // Animation des éléments au scroll
    initScrollAnimations();
    
    // Animation des barres de compétences
    initSkillsAnimation();
    
    // Initialisation des modals
    initModals();
    
    // Formulaires
    initForms();
    
    // Lazy loading des images
    initLazyLoading();
    
    console.log('🚀 Portfolio initialisé avec succès');
}

// ==========================================================================
// Navigation Mobile
// ==========================================================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuBtn?.querySelector('i');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('fade-in-up');
            menuIcon.className = 'fas fa-times text-xl';
            document.body.style.overflow = 'hidden'; // Empêche le scroll
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('fade-in-up');
            menuIcon.className = 'fas fa-bars text-xl';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fas fa-bars text-xl';
            document.body.style.overflow = 'auto';
        });
    });
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================

function initSmoothScroll() {
    // Gestion des liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensation navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// Animations au scroll
// ==========================================================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Éléments à animer
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-item, .team-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
// Animation des barres de compétences
// ==========================================================================

function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset pour l'animation
                progressBar.style.width = '0%';
                
                // Animation avec délai
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ==========================================================================
// Gestion des modals (projets)
// ==========================================================================

function initModals() {
    // Créer le modal container si il n'existe pas
    if (!document.getElementById('project-modal')) {
        createModalContainer();
    }
}

function createModalContainer() {
    const modalHTML = `
        <div id="project-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
            <div class="bg-card max-w-4xl w-full mx-4 rounded-lg max-h-screen overflow-y-auto">
                <div class="relative">
                    <button id="close-modal" class="absolute top-4 right-4 text-brand-primary hover:text-brand-hover text-2xl z-10">
                        <i class="fas fa-times"></i>
                    </button>
                    <div id="modal-content" class="p-8"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Event listeners pour fermer le modal
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('close-modal');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function openProject(projectId) {
    const projectData = getProjectData(projectId);
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!projectData) {
        console.error('Projet non trouvé:', projectId);
        return;
    }
    
    modalContent.innerHTML = `
        <div class="mb-6">
            <div class="aspect-video bg-secondary-olive rounded-lg mb-6 relative overflow-hidden">
                <div class="w-full h-full bg-gradient-to-br from-brand-primary/20 to-secondary-olive flex items-center justify-center">
                    <i class="${projectData.icon} text-6xl text-brand-primary"></i>
                </div>
            </div>
            
            <h2 class="heading-2 mb-4">${projectData.title}</h2>
            <p class="body-medium text-secondary mb-6">${projectData.description}</p>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 class="heading-5 mb-3">Technologies utilisées</h3>
                    <div class="flex flex-wrap gap-2">
                        ${projectData.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 class="heading-5 mb-3">Fonctionnalités</h3>
                    <ul class="space-y-1">
                        ${projectData.features.map(feature => `<li class="body-small">• ${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="${projectData.liveUrl}" target="_blank" class="btn-primary">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    Voir le projet
                </a>
                <a href="${projectData.githubUrl}" target="_blank" class="btn-secondary">
                    <i class="fab fa-github mr-2"></i>
                    Code source
                </a>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    currentProject = projectId;
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentProject = null;
}

// ==========================================================================
// Données des projets (à personnaliser)
// ==========================================================================

function getProjectData(projectId) {
    const projects = {
        project1: {
            title: 'Application E-commerce',
            description: 'Une application e-commerce moderne avec panier dynamique, gestion des utilisateurs et système de paiement intégré. Design responsive et optimisé pour tous les appareils.',
            icon: 'fas fa-shopping-cart',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Responsive Design'],
            features: [
                'Catalogue produits interactif',
                'Panier d\'achat dynamique',
                'Filtres et recherche',
                'Interface utilisateur intuitive',
                'Optimisation mobile'
            ],
            liveUrl: '#',
            githubUrl: '#'
        },
        project2: {
            title: 'Portfolio Responsive',
            description: 'Site portfolio personnel avec animations fluides, design moderne et optimisation SEO. Entièrement responsive et optimisé pour les performances.',
            icon: 'fas fa-mobile-alt',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Animation CSS', 'SEO'],
            features: [
                'Design responsive adaptatif',
                'Animations CSS avancées',
                'Optimisation SEO',
                'Performance optimisée',
                'Navigation fluide'
            ],
            liveUrl: '#',
            githubUrl: '#'
        },
        project3: {
            title: 'Dashboard Analytics',
            description: 'Interface d\'administration avec graphiques interactifs, gestion des données en temps réel et tableau de bord personnalisable.',
            icon: 'fas fa-chart-bar',
            technologies: ['JavaScript', 'Chart.js', 'API REST', 'CSS Grid', 'JSON'],
            features: [
                'Graphiques interactifs',
                'Données en temps réel',
                'Interface d\'administration',
                'Tableaux dynamiques',
                'Export de données'
            ],
            liveUrl: '#',
            githubUrl: '#'
        }
    };
    
    return projects[projectId] || null;
}

// ==========================================================================
// Gestion des formulaires
// ==========================================================================

function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validation en temps réel
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formType = form.dataset.type || 'contact';
    
    // Validation complète
    if (!validateForm(form)) {
        showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
        return;
    }
    
    // Protection anti-spam (honeypot)
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value !== '') {
        console.log('Spam détecté');
        return;
    }
    
    // Simulation d'envoi
    submitForm(formData, formType);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const fieldType = field.type;
    
    // Supprimer les erreurs précédentes
    clearError({ target: field });
    
    // Validation selon le type
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (fieldType === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Adresse email invalide';
    } else if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Le nom doit contenir au moins 2 caractères';
    } else if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Le message doit contenir au moins 10 caractères';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('border-red-500');
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error text-red-500 text-sm mt-1 block';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(formData, formType) {
    // Simulation d'envoi avec délai
    showToast('Envoi en cours...', 'info');
    
    setTimeout(() => {
        // Ici vous intégreriez votre service d'envoi d'email
        // Par exemple: EmailJS, Formspree, ou votre propre API
        
        console.log('Données du formulaire:', Object.fromEntries(formData));
        
        showToast('Message envoyé avec succès !', 'success');
        
        // Reset du formulaire
        const form = document.querySelector(`form[data-type="${formType}"]`);
        if (form) {
            form.reset();
        }
    }, 2000);
}

// ==========================================================================
// Système de Toast/Notifications
// ==========================================================================

function showToast(message, type = 'info') {
    // Créer le toast container s'il n'existe pas
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
    
    // Créer le toast
    const toast = document.createElement('div');
    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    }[type] || 'bg-blue-600';
    
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-suppression
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, 5000);
}

// ==========================================================================
// Lazy Loading des images
// ==========================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('opacity-0');
                img.classList.add('opacity-100');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        imageObserver.observe(img);
    });
}

// ==========================================================================
// Fonctions utilitaires
// ==========================================================================

// Fonction pour obtenir l'élément actuel dans la navigation
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialiser la navigation active
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Fonction de debug pour le développement
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`🔧 ${message}`, data);
    }
}

// Export des fonctions principales pour usage externe
window.PortfolioJS = {
    openProject,
    closeModal,
    showToast,
    validateForm
};