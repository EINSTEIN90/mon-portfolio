/**
 * Contact.js - Gestion complète de la page contact
 * FAQ, formulaire avancé, brouillon, styles et soumission
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================
    // Initialisations globales
    // =========================
    initFAQ();
    initContactFormEnhancements();
    addContactStyles();

    // =========================
    // Soumission du formulaire
    // =========================
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // honeypot anti-bot
        if (form.website && form.website.value.trim() !== '') {
            return; 
        } 

        const payload = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            subject: form.subject.value.trim(),
            budget: form.budget ? form.budget.value.trim() : '',
            message: form.message.value.trim(),
            website: form.website ? form.website.value : ''
        };

        fetch('http://localhost:5000/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('Message envoyé ✅', 'success');
                form.reset();
                localStorage.removeItem('contact_form_draft');
            } else {
                showToast('Erreur: ' + (data.error || 'erreur inconnue'), 'error');
            }
        })
        .catch(err => {
            console.error('Erreur réseau:', err);
            showToast('Impossible d’envoyer le message ❌', 'error');
        });
    });
});

// ==========================================================================
// Gestion de la FAQ
// ==========================================================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const answer = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            // Fermer toutes les autres FAQ
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherTargetId = otherQuestion.getAttribute('data-target');
                    const otherAnswer = document.getElementById(otherTargetId);
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    if (otherAnswer && !otherAnswer.classList.contains('hidden')) {
                        otherAnswer.classList.add('hidden');
                        otherIcon.classList.remove('fa-minus', 'rotate-180');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });
            
            // Toggle la FAQ actuelle
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                answer.classList.add('fade-in-up');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus', 'rotate-180');
            } else {
                answer.classList.add('hidden');
                answer.classList.remove('fade-in-up');
                icon.classList.remove('fa-minus', 'rotate-180');
                icon.classList.add('fa-plus');
            }
        });
    });
}

// ==========================================================================
// Form enhancements: auto-resize, validation, draft
// ==========================================================================
function initContactFormEnhancements() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Auto-resize textarea
    const messageTextarea = form.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', autoResizeTextarea);
    }

    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });

    // Compteur de caractères
    addCharacterCounter();

    // Brouillon automatique
    initDraftSaving();
}

// ------------------------
// Auto-resize textarea
// ------------------------
function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// ------------------------
// Validation champs
// ------------------------
function handleInputChange(e) {
    const input = e.target;
    clearError({ target: input });

    if (input.type === 'email' && input.value) {
        validateEmailFormat(input);
    }

    if (input.name === 'phone' && input.value) {
        formatPhoneNumber(input);
    }
}

function handleInputFocus(e) {
    e.target.parentElement.classList.add('focused');
}

function handleInputBlur(e) {
    const input = e.target;
    input.parentElement.classList.remove('focused');

    if (input.hasAttribute('required') || input.value) {
        validateField({ target: input });
    }
}

// ------------------------
// Email validation
// ------------------------
function validateEmailFormat(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);

    return isValid;
}

// ------------------------
// Phone formatting
// ------------------------
function formatPhoneNumber(input) {
    let digits = input.value.replace(/\D/g, '');

    if (digits.startsWith('226')) {
        digits = digits.substring(3).match(/(\d{2})/g).join(' ');
        input.value = '+226 ' + digits;
    } else if (digits.startsWith('0')) {
        digits = digits.match(/(\d{2})/g).join(' ');
        input.value = digits;
    }
}

// ------------------------
// Character counter
// ------------------------
function addCharacterCounter() {
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (!messageTextarea) return;

    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'text-sm text-secondary mt-2 text-right';
    counter.id = 'char-counter';
    messageTextarea.parentElement.appendChild(counter);

    function updateCounter() {
        const length = messageTextarea.value.length;
        counter.textContent = `${length}/${maxLength} caractères`;

        counter.classList.toggle('text-secondary-yellow', length > maxLength * 0.9);
        counter.classList.toggle('text-red-500', length > maxLength);
        messageTextarea.classList.toggle('border-red-500', length > maxLength);
    }

    messageTextarea.addEventListener('input', updateCounter);
    messageTextarea.setAttribute('maxlength', maxLength);
    updateCounter();
}

// ------------------------
// Draft auto-save
// ------------------------
function initDraftSaving() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const DRAFT_KEY = 'contact_form_draft';
    loadDraft();

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveDraft, 1000));
    });

    function saveDraft() {
        const formData = new FormData(form);
        const draftData = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'website') draftData[key] = value;
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
        showDraftIndicator();
    }

    function loadDraft() {
        const draftData = localStorage.getItem(DRAFT_KEY);
        if (!draftData) return;
        try {
            const data = JSON.parse(draftData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && data[key]) {
                    input.value = data[key];
                    input.dispatchEvent(new Event('input'));
                }
            });
            showToast('Brouillon restauré', 'info');
        } catch (e) {
            console.error('Erreur chargement brouillon:', e);
        }
    }

    function showDraftIndicator() {
        let indicator = document.getElementById('draft-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'draft-indicator';
            indicator.className = 'fixed bottom-4 left-4 bg-secondary-olive text-primary px-3 py-2 rounded-lg text-sm opacity-0 transition-opacity';
            indicator.innerHTML = '<i class="fas fa-save mr-2"></i>Brouillon sauvegardé';
            document.body.appendChild(indicator);
        }
        indicator.classList.add('opacity-100');
        setTimeout(() => indicator.classList.remove('opacity-100'), 2000);
    }
}

// ------------------------
// Debounce util
// ------------------------
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================================================
// Styles spécifiques contact
// ==========================================================================
function addContactStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .focused label { color: var(--brand-primary) !important; }
        .valid { border-color: #10b981 !important; }
        .invalid { border-color: #ef4444 !important; }
        .rotate-180 { transform: rotate(180deg); }
        #draft-indicator { z-index: 1000; }
        @media (max-width: 767px) { #draft-indicator { bottom: 70px; } }
    `;
    document.head.appendChild(style);
}
