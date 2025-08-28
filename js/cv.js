/**
 * CV.js - Gestion spécifique de la page CV
 * Téléchargement PDF, impression et interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initCVFeatures();
    initPrintOptimization();
    initDownloadPDF();
});

// ==========================================================================
// Fonctionnalités principales du CV
// ==========================================================================

function initCVFeatures() {
    // Animation des barres de compétences lors du scroll
    initSkillsStarsAnimation();
    
    // Navigation fluide vers les sections
    initSectionNavigation();
    
    // Gestion de l'impression
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
}

function initSkillsStarsAnimation() {
    const skillStars = document.querySelectorAll('.fas.fa-star');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const starsContainer = entry.target;
                const stars = starsContainer.querySelectorAll('.fas.fa-star');
                
                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.transform = 'scale(1.2)';
                        star.style.color = star.classList.contains('text-brand-primary') ? 
                            'var(--brand-primary)' : 'var(--text-secondary)';
                        
                        setTimeout(() => {
                            star.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 100);
                });
                
                observer.unobserve(starsContainer);
            }
        });
    }, { threshold: 0.5 });
    
    // Observer les conteneurs de compétences
    const skillsContainers = document.querySelectorAll('.space-y-3');
    skillsContainers.forEach(container => observer.observe(container));
}

function initSectionNavigation() {
    // Créer une navigation flottante pour les sections (optionnel)
    const sections = [
        { id: 'profil', name: 'Profil' },
        { id: 'competences', name: 'Compétences' },
        { id: 'experience', name: 'Expérience' },
        { id: 'formation', name: 'Formation' },
        { id: 'projets', name: 'Projets' }
    ];
    
    // Cette fonctionnalité peut être activée si souhaité
    // createFloatingNavigation(sections);
}

// ==========================================================================
// Optimisation pour l'impression
// ==========================================================================

function initPrintOptimization() {
    // Optimiser les couleurs pour l'impression
    const printButton = document.querySelector('button[onclick="window.print()"]');
    
    if (printButton) {
        printButton.addEventListener('click', function() {
            // Pré-traitement avant impression
            optimizeForPrint();
            
            // Lancer l'impression avec un léger délai
            setTimeout(() => {
                window.print();
            }, 100);
        });
    }
}

function handleBeforePrint() {
    // Ajustements spécifiques avant impression
    document.body.classList.add('printing');
    
    // Forcer l'affichage de tous les éléments cachés en mobile
    const mobileHidden = document.querySelectorAll('.md\\:hidden');
    mobileHidden.forEach(el => {
        el.style.display = 'none';
    });
    
    // Optimiser les images pour l'impression
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
    
    console.log('🖨️ Préparation pour l\'impression');
}

function handleAfterPrint() {
    // Restaurer l'affichage normal
    document.body.classList.remove('printing');
    
    // Restaurer l'affichage mobile
    const mobileHidden = document.querySelectorAll('.md\\:hidden');
    mobileHidden.forEach(el => {
        el.style.display = '';
    });
    
    console.log('✅ Impression terminée');
}

function optimizeForPrint() {
    // Convertir les couleurs de fond foncées pour l'impression
    const darkElements = document.querySelectorAll('.bg-page, .bg-card');
    darkElements.forEach(el => {
        el.style.backgroundColor = 'white';
        el.style.color = 'black';
    });
    
    // Assurer la lisibilité des liens
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = '#0066cc';
        link.style.textDecoration = 'underline';
    });
}

// ==========================================================================
// Téléchargement PDF
// ==========================================================================

function initDownloadPDF() {
    const downloadBtn = document.getElementById('download-pdf');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generatePDF();
        });
    }
}

function generatePDF() {
    // Afficher un indicateur de chargement
    showToast('Génération du PDF en cours...', 'info');
    
    // Simuler la génération du PDF
    // Dans un vrai projet, vous utiliseriez une bibliothèque comme jsPDF ou html2pdf
    setTimeout(() => {
        // Simulation du téléchargement
        const link = document.createElement('a');
        link.href = '#'; // Ici vous mettriez l'URL du PDF généré
        link.download = 'CV_Jean_Developpeur.pdf';
        
        // Dans la réalité, vous utiliseriez quelque chose comme :
        // generatePDFWithLibrary().then(pdfBlob => {
        //     const url = URL.createObjectURL(pdfBlob);
        //     link.href = url;
        //     link.click();
        //     URL.revokeObjectURL(url);
        // });
        
        showToast('PDF prêt ! (Fonctionnalité à implémenter)', 'success');
    }, 2000);
}

// Exemple d'implémentation avec html2pdf (à installer séparément)
function generatePDFWithLibrary() {
    // Cette fonction nécessite d'inclure la bibliothèque html2pdf
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    
    const element = document.querySelector('.cv-container');
    const opt = {
        margin: 1,
        filename: 'CV_Jean_Developpeur.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Retourner la promesse pour la gestion asynchrone
    return html2pdf().set(opt).from(element).save();
}

// ==========================================================================
// Fonctionnalités avancées
// ==========================================================================

function createFloatingNavigation(sections) {
    const nav = document.createElement('nav');
    nav.className = 'fixed right-4 top-1/2 transform -translate-y-1/2 bg-card rounded-lg p-4 shadow-lg border border-border-light no-print z-40';
    nav.style.display = 'none'; // Masqué par défaut
    
    const navList = document.createElement('ul');
    navList.className = 'space-y-2';
    
    sections.forEach(section => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${section.id}`;
        a.textContent = section.name;
        a.className = 'block text-sm text-secondary hover:text-brand-primary transition-colors';
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById(section.id);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        li.appendChild(a);
        navList.appendChild(li);
    });
    
    nav.appendChild(navList);
    document.body.appendChild(nav);
    
    // Afficher/masquer selon le scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        nav.style.display = 'block';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            nav.style.display = 'none';
        }, 3000);
    });
}

// ==========================================================================
// Animations et effets visuels
// ==========================================================================

function addCVAnimations() {
    // Animation d'apparition progressive des sections
    const sections = document.querySelectorAll('.cv-container > div');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ==========================================================================
// Outils de partage du CV
// ==========================================================================

function initSharingTools() {
    // Créer des boutons de partage (LinkedIn, email, etc.)
    const shareContainer = document.createElement('div');
    shareContainer.className = 'fixed bottom-4 right-4 no-print';
    shareContainer.innerHTML = `
        <div class="flex space-x-2">
            <button onclick="shareOnLinkedIn()" class="social-link" title="Partager sur LinkedIn">
                <i class="fab fa-linkedin"></i>
            </button>
            <button onclick="shareByEmail()" class="social-link" title="Partager par email">
                <i class="fas fa-envelope"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(shareContainer);
}

function shareOnLinkedIn() {
    const url = window.location.href;
    const title = 'CV - Jean Développeur';
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

function shareByEmail() {
    const subject = 'CV - Jean Développeur';
    const body = `Bonjour,\n\nJe vous partage mon CV en ligne : ${window.location.href}\n\nCordialement,\nJean Développeur`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
}

// Initialiser les fonctionnalités avancées
document.addEventListener('DOMContentLoaded', function() {
    addCVAnimations();
    // initSharingTools(); // Décommenter si souhaité
});

// ==========================================================================
// Styles CSS additionnels pour le CV
// ==========================================================================

function addCVStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .printing {
            font-size: 12px !important;
        }
        
        .printing .text-4xl {
            font-size: 24px !important;
        }
        
        .printing .text-2xl {
            font-size: 18px !important;
        }
        
        .printing .text-xl {
            font-size: 16px !important;
        }
        
        .tech-tag {
            font-size: 10px !important;
            padding: 2px 6px !important;
        }
        
        @media print {
            .tech-tag {
                background: #f0f0f0 !important;
                color: #333 !important;
                border: 1px solid #ccc !important;
            }
            
            .fas, .fab {
                color: #333 !important;
            }
            
            a {
                color: #0066cc !important;
                text-decoration: underline !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialiser les styles
document.addEventListener('DOMContentLoaded', addCVStyles);