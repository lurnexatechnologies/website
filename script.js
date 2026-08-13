// =========================================================================
// LURNEXA TECHNOLOGIES - Main Application Script
// =========================================================================

// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
});

// Initialize EmailJS (with error handling)
(function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('vM1fT87RElwe-h5Eo');
        }
    } catch (e) {
        console.warn('EmailJS initialization skipped');
    }
})();

// ----- GLOBAL TOAST -----
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

function showToast(msg) {
    if (toastMsg) toastMsg.textContent = msg || 'Notification';
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// ----- NAVBAR & MOBILE MENU -----
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navLinksContainer = document.getElementById('navLinks');

if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinksContainer.classList.toggle('active-menu');
        const icon = mobileToggle.querySelector('i');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active-menu') && 
            !navLinksContainer.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            navLinksContainer.classList.remove('active-menu');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ----- PAGE ROUTING -----
const pages = {
    home: document.getElementById('home'),
    solutions: document.getElementById('solutions'),
    research: document.getElementById('research'),
    careers: document.getElementById('careers'),
    insights: document.getElementById('insights')
};

const navLinks = document.querySelectorAll('.nav-link');

function setActivePage(pageId, shouldUpdateHash = true) {
    // Hide all pages
    Object.values(pages).forEach(p => {
        if (p) {
            p.classList.remove('active-page');
            p.style.display = 'none';
        }
    });
    
    // Also hide dynamic page
    const dynamicPage = document.getElementById('dynamic-content-page');
    if (dynamicPage) {
        dynamicPage.classList.remove('active-page');
        dynamicPage.style.display = 'none';
    }
    
    if (pageId === 'dynamic-content-page' && dynamicPage) {
        dynamicPage.style.display = 'block';
        setTimeout(() => dynamicPage.classList.add('active-page'), 50);
    } else if (pages[pageId]) {
        pages[pageId].style.display = 'block';
        setTimeout(() => pages[pageId].classList.add('active-page'), 50);
        if (shouldUpdateHash) window.location.hash = pageId;
    } else {
        // Default to home
        if (pages['home']) {
            pages['home'].style.display = 'block';
            setTimeout(() => pages['home'].classList.add('active-page'), 50);
            if (shouldUpdateHash) window.location.hash = 'home';
        }
        pageId = 'home';
    }
    
    // Update nav active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-selected', 'false');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    if (navLinksContainer && navLinksContainer.classList.contains('active-menu')) {
        navLinksContainer.classList.remove('active-menu');
        if (mobileToggle) {
            mobileToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Refresh AOS instances for new page
    setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
    }, 150);
}

// Handle Routing from Hash
function handleRouting() {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'home') {
        setActivePage('home', false);
        return;
    }

    if (pages[hash]) {
        setActivePage(hash, false);
        return;
    }

    // Check if it's dynamic content
    const dynamicLinks = document.querySelectorAll('[data-content]');
    let foundDynamic = false;
    dynamicLinks.forEach(link => {
        if (link.getAttribute('data-content') === hash) {
            loadDynamicContent(hash);
            foundDynamic = true;
        }
    });

    if (!foundDynamic) {
        setActivePage('home', false);
    }
}

// Navigation Events
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        window.location.hash = pageId;
        setActivePage(pageId);
    });
});

// Logo events
document.getElementById('homeLogo')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActivePage('home');
});
document.getElementById('footerLogo')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActivePage('home');
});

// ----- DYNAMIC CONTENT DATA -----
const pageData = {
    'about': {
        title: 'About Lurnexa',
        subtitle: 'We are builders, researchers, and innovators.',
        body: `
            <p class="mb-4">Lurnexa Technologies was founded with a clear purpose: to push the boundaries of what AI and software can achieve for businesses of all sizes.</p>
            <p class="mb-4">What started as a specialized AI research initiative has grown into a full-service digital innovation company. We design, architect, and deploy end-to-end systems that drive real transformation. Our team includes Machine Learning engineers, UI/UX designers, and cloud infrastructure specialists.</p>
            <p class="mb-4">Our approach is rooted in transparency, engineering quality, and delivering measurable ROI to our partners.</p>
            <div class="mt-10 p-8 rounded-2xl border border-primary" style="background: var(--primary-dim); border-radius: 1rem;">
                <h4 class="text-white font-bold text-2xl mb-4">Our Mission</h4>
                <p class="text-lg italic text-gray-400">"To make enterprise-grade AI and high-performance software accessible to businesses of all scales, turning visionary ideas into production realities."</p>
            </div>
        `
    },
    'privacy': {
        title: 'Privacy Policy',
        subtitle: 'Your data security is our priority.',
        body: `
            <p class="mb-4">Last Updated: January 1st, 2026</p>
            <p class="mb-4">Lurnexa Technologies is committed to protecting your data. Our privacy practices adhere to applicable compliance frameworks including GDPR and relevant Indian data protection regulations.</p>
            <h4 class="text-white font-bold text-xl mt-8 mb-4">1. Data Collection</h4>
            <p class="mb-4">We collect data to improve our services and system stability. This includes anonymized diagnostic reports and API performance metrics. <strong>We do not sell personal data to third parties.</strong></p>
            <h4 class="text-white font-bold text-xl mt-6 mb-4">2. Security Standards</h4>
            <p class="mb-4">All data transmitted to Lurnexa systems is encrypted using TLS 1.3. Personally Identifiable Information (PII) is encrypted at rest using AES-256.</p>
            <h4 class="text-white font-bold text-xl mt-6 mb-4">3. Data Retention & Erasure</h4>
            <p class="mb-4">We support data erasure requests in compliance with applicable privacy regulations. Our retention policies automatically purge staging data within 30 days of processing.</p>
            <p class="mt-8 text-sm text-gray-500">For inquiries about our data practices, please contact us via the Contact form.</p>
        `
    },
    'terms': {
        title: 'Terms of Service',
        subtitle: 'The legal framework governing our services.',
        body: `
            <p class="mb-4">Last Updated: January 1st, 2026</p>
            <p class="mb-4">These Terms of Service govern your access to Lurnexa APIs, web platforms, consulting services, and licensed software (the "Services").</p>
            
            <h4 class="text-white font-bold text-xl mt-8 mb-4">Service Level Agreements</h4>
            <p class="mb-4">Access to Lurnexa platforms is governed by service level agreements. For uptime guarantees and incident response terms, please refer to your Client Master Service Agreement.</p>
            
            <h4 class="text-white font-bold text-xl mt-6 mb-4">Acceptable Use</h4>
            <p class="mb-4">Our systems enforce rate limits on public APIs. Using our services to generate malicious content, perform automated scraping, or reverse-engineer our software will result in immediate suspension.</p>
            
            <h4 class="text-white font-bold text-xl mt-6 mb-4">Intellectual Property</h4>
            <p class="mb-4">Unless explicitly transferred via a custom agreement, Lurnexa retains proprietary rights to baseline models, frameworks, and infrastructure used to build your solutions.</p>
        `
    },
    'refund': {
        title: 'Refund & Cancellation Policy',
        subtitle: 'Transparent commercial terms for our clients.',
        body: `
            <p class="mb-4">Last Updated: January 1st, 2026</p>
            <p class="mb-4">At Lurnexa Technologies, we strive to deliver quality engineering solutions. Our refund and cancellation terms govern all custom development agreements, API subscriptions, and consulting services.</p>
            
            <h4 class="text-white font-bold text-xl mt-8 mb-4">1. Project Cancellations</h4>
            <p class="mb-4">Clients may request cancellation in writing within 7 business days of signing a service agreement, prior to development execution. Initial setup and scoping fees are non-refundable once development begins.</p>
            
            <h4 class="text-white font-bold text-xl mt-6 mb-4">2. Subscription Refunds</h4>
            <p class="mb-4">SaaS and API subscription fees are billed monthly or annually. Refunds for recurring billing are evaluated on a pro-rata basis if services experience outages exceeding SLA commitments.</p>
            
            <h4 class="text-white font-bold text-xl mt-6 mb-4">3. Dispute Resolution</h4>
            <p class="mb-4">For billing questions or account reviews, please reach out at <strong>lurnexasolution@gmail.com</strong>.</p>
        `
    }
};

// Load dynamic content
function loadDynamicContent(contentKey) {
    const data = pageData[contentKey];
    if (data) {
        document.getElementById('dynamic-title').innerHTML = '<span class="text-gradient">' + data.title + '</span>';
        document.getElementById('dynamic-subtitle').textContent = data.subtitle;
        document.getElementById('dynamic-body').innerHTML = data.body;
        
        setActivePage('dynamic-content-page', false);
        window.location.hash = contentKey;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ----- DELEGATED EVENT HANDLING -----
document.addEventListener('click', (e) => {
    // Handle data-link navigation
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const target = link.getAttribute('data-link');
        if (target.startsWith('solution-')) {
            setActivePage('solutions');
            setTimeout(() => {
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.borderColor = 'var(--primary)';
                    setTimeout(() => element.style.borderColor = '', 2000);
                }
            }, 500);
        } else {
            setActivePage(target);
        }
    }

    // Handle data-content (dynamic pages)
    const contentLink = e.target.closest('[data-content]');
    if (contentLink) {
        e.preventDefault();
        const contentKey = contentLink.getAttribute('data-content');
        loadDynamicContent(contentKey);
    }

    // Handle data-action buttons
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
        e.preventDefault();
        const action = actionBtn.getAttribute('data-action');
        if (action === 'open-contact') {
            if (modal) modal.classList.add('active');
        } else if (action === 'goto-solutions') {
            setActivePage('solutions');
        }
    }
});


// ----- CONTACT MODAL -----
const modal = document.getElementById('contactModal');
const connectBtns = document.querySelectorAll('#connectBtn, #footerContactLink');
const closeModalBtn = document.getElementById('closeModal');

connectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
            modal.classList.add('active');
            // Focus first input for accessibility
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    });
});

function closeModal() {
    if (modal) modal.classList.remove('active');
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close modal on backdrop click
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});


// ----- CONTACT FORM -----
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const company = document.getElementById('companyInput').value.trim();
        const message = document.getElementById('messageInput').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address');
            return;
        }

        const btn = document.getElementById('sendMessageBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        
        showToast('Sending your message...');

        const serviceID = 'service_01jyn07';
        const templateID = 'template_qnnepfb';

        let finalMessage = message;
        if (company) {
            finalMessage = `Company: ${company}\n\n${message}`;
        }

        const templateParams = {
            user_name: name,
            user_email: email,
            message: finalMessage
        };

        if (typeof emailjs !== 'undefined') {
            emailjs.send(serviceID, templateID, templateParams)
                .then(function() {
                    showToast('Message sent successfully!');
                    contactForm.reset();
                    setTimeout(() => closeModal(), 1000);
                })
                .catch(function(error) {
                    console.error('EmailJS error:', error);
                    showToast('Failed to send. Please try again.');
                })
                .finally(function() {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        } else {
            // Fallback if EmailJS not loaded
            setTimeout(() => {
                showToast('Message sent successfully!');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                setTimeout(() => closeModal(), 1000);
            }, 1500);
        }
    });
}

// ----- NEWSLETTER FORM -----
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thanks for subscribing!');
        newsletterForm.reset();
    });
}

// ----- INITIAL ROUTING -----
window.addEventListener('hashchange', handleRouting);

// Single initialization on page load
document.addEventListener('DOMContentLoaded', () => {
    handleRouting();
});

// Handle case where DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    handleRouting();
}

// ----- LOGO INTRO ANIMATION -----
document.addEventListener('DOMContentLoaded', () => {
    const isAnimated = sessionStorage.getItem('logoAnimated');
    const realLogo = document.getElementById('homeLogo');
    
    if (!isAnimated && realLogo) {
        const overlay = document.createElement('div');
        overlay.id = 'logo-intro-overlay';
        overlay.className = 'logo-intro-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="logo-intro-content" id="logoIntroContent">
                <svg class="logo-intro-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <path d="M 135 32 A 75 75 0 1 0 174 110" fill="none" stroke="#1f2736" stroke-width="12" stroke-linecap="round" />
                    <circle cx="148" cy="38" r="6" fill="#1f2736" />
                    <g transform="skewX(-14) translate(15, 0)">
                        <path d="M 52 65 L 76 65 L 76 115 L 102 115 L 102 135 L 52 135 Z" fill="#1f2736" />
                        <path d="M 94 85 L 172 85 L 172 105 L 143 105 L 143 145 L 123 145 L 123 105 L 94 105 Z" fill="#ff6a3d" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round" />
                    </g>
                    <rect x="145" y="48" width="16" height="16" rx="2" fill="#ff6a3d" />
                    <rect x="162" y="22" width="12" height="12" rx="2" fill="#ff6a3d" />
                    <rect x="178" y="42" width="11" height="11" rx="2" fill="#ff6a3d" />
                    <rect x="135" y="16" width="9" height="9" rx="1.5" fill="#ff6a3d" />
                    <rect x="150" y="5" width="7" height="7" rx="1" fill="#ff6a3d" />
                    <rect x="175" y="62" width="8" height="8" rx="1" fill="#ff6a3d" />
                </svg>
                <div class="logo-intro-text">Lurnexa<span class="text-gradient">Tech</span></div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        realLogo.classList.add('logo-hidden');
        
        const introContent = document.getElementById('logoIntroContent');
        
        setTimeout(() => {
            introContent.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            const rect = realLogo.getBoundingClientRect();
            const contentRect = introContent.getBoundingClientRect();
            
            introContent.style.position = 'fixed';
            introContent.style.left = contentRect.left + 'px';
            introContent.style.top = contentRect.top + 'px';
            introContent.style.margin = '0';
            introContent.style.transform = 'scale(2.5)';
            
            introContent.offsetHeight; // Force reflow
            
            introContent.style.left = rect.left + 'px';
            introContent.style.top = rect.top + 'px';
            introContent.style.transform = 'scale(1)';
            introContent.style.transformOrigin = 'top left';
            
            overlay.style.backgroundColor = 'transparent';
            overlay.style.pointerEvents = 'none';
        }, 1500);
        
        setTimeout(() => {
            realLogo.classList.remove('logo-hidden');
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
            sessionStorage.setItem('logoAnimated', 'true');
        }, 2700);
    }
});