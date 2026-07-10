// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});

// Initialize EmailJS
(function() {
    try {
        emailjs.init('vM1fT87RElwe-h5Eo');
    } catch (e) {
        console.warn('EmailJS not initialized - using simulation mode');
    }
})();

// ----- GLOBAL TOAST -----
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
function showToast(msg) {
    if (toastMsg) toastMsg.textContent = msg || 'System notification';
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}
window.showToast = showToast;

// ----- NAVBAR SCROLL & MOBILE MENU -----
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navLinksContainer = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active-menu');
        const icon = mobileToggle.querySelector('i');
        if (navLinksContainer.classList.contains('active-menu')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
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
    Object.values(pages).forEach(p => {
        if (p) {
            p.classList.remove('active-page');
            p.style.display = 'none'; // Ensure CSS display logic syncs
        }
    });
    
    if (pages[pageId]) {
        pages[pageId].style.display = 'block';
        setTimeout(() => pages[pageId].classList.add('active-page'), 50); // slight delay for animation
        if (shouldUpdateHash) window.location.hash = pageId;
    } else if (pageId === 'dynamic-content-page') {
        // Dynamic page handled separately but needs visibility
        if (pages['dynamic-content-page']) {
            pages['dynamic-content-page'].style.display = 'block';
            setTimeout(() => pages['dynamic-content-page'].classList.add('active-page'), 50);
        }
    } else {
        if(pages['home']) {
            pages['home'].style.display = 'block';
            setTimeout(() => pages['home'].classList.add('active-page'), 50);
            if (shouldUpdateHash) window.location.hash = 'home';
        }
        pageId = 'home';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    if (navLinksContainer && navLinksContainer.classList.contains('active-menu')) {
        navLinksContainer.classList.remove('active-menu');
        if(mobileToggle) mobileToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
    }

    // Refresh AOS instances for new page
    setTimeout(() => { AOS.refresh(); }, 150);
}

// Handle Routing from Hash
function handleRouting() {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'home') {
        setActivePage('home', false);
        return;
    }

    // Check if it's a main page
    if (pages[hash]) {
        setActivePage(hash, false);
        return;
    }

    // Check if it's dynamic content
    const dynamicLinks = document.querySelectorAll('[data-content]');
    let foundDynamic = false;
    dynamicLinks.forEach(link => {
        if (link.getAttribute('data-content') === hash) {
            link.click();
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
document.getElementById('homeLogo')?.addEventListener('click', () => {
    setActivePage('home');
});
document.getElementById('footerLogo')?.addEventListener('click', () => {
    setActivePage('home');
});

// Enhanced Footer & Generic Link Routing
document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    const toastTrigger = e.target.closest('[data-toast]');

    if (link) {
        e.preventDefault();
        const target = link.getAttribute('data-link');
        // Handle Solution-specific anchors
        if (target.startsWith('solution-')) {
            setActivePage('solutions');
            setTimeout(() => {
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add a temporary highlight effect
                    element.style.borderColor = 'var(--primary)';
                    setTimeout(() => element.style.borderColor = '', 2000);
                }
            }, 500); // Wait for page transition
        } else {
            setActivePage(target);
        }
    }
    const contentLink = e.target.closest('[data-content]');
    if (contentLink) {
        e.preventDefault();
        const contentKey = contentLink.getAttribute('data-content');
        
        // Dynamic content data
        const pageData = {
            'ai-analytics': {
                title: 'AI & Analytics',
                subtitle: 'Unlock the hidden potential of your organizational data.',
                body: `
                    <p class="mb-4">At Lurnexa Technologies, we build custom artificial intelligence models and analytics engines that seamlessly integrate into your workflow. From predictive capabilities to computer vision, our AI solutions are purely designed for massive scalability and accuracy.</p>
                    <p class="mb-4">In today’s hyper-competitive digital landscape, data is your most valuable asset. However, raw data without interpretation is essentially useless. Our expert data scientists and machine learning engineers specialize in translating complex, unstructured data lakes into coherent, actionable intelligence.</p>
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">Core AI Capabilities</h4>
                    <ul class="feature-list mb-6 space-y-2">
                        <li><i class="fas fa-check-circle text-primary"></i> <strong>Predictive Machine Learning Models:</strong> Forecast market trends, customer behavior, and supply chain disruptions with extremely high statistical confidence.</li>
                        <li><i class="fas fa-check-circle text-primary"></i> <strong>Natural Language Processing (NLP):</strong> Build intelligent document processing systems, advanced sentiment analysis, and conversational AI agents that actually understand context.</li>
                        <li><i class="fas fa-check-circle text-primary"></i> <strong>Computer Vision:</strong> Implement real-time object detection, quality control automation in manufacturing, and facial recognition for secure authentication protocols.</li>
                        <li><i class="fas fa-check-circle text-primary"></i> <strong>Real-time Visualization Dashboards:</strong> We construct beautiful, intuitive PowerBI and custom React-based dashboards that update the millisecond your data changes.</li>
                    </ul>
                    <p class="mb-4">Whether you are a Series A startup looking to integrate AI features quickly or an enterprise trying to modernize legacy systems, Lurnexa ensures the AI you deploy provides measurable Return on Investment.</p>
                `
            },
            'automation': {
                title: 'Intelligent Automation',
                subtitle: 'Eliminate repetitive tasks with smart systems.',
                body: `
                    <p class="mb-4">Our intelligent automation ecosystems combine standard Robotic Process Automation (RPA) with Deep Learning to autonomously manage complex back-office workflows. We meticulously orchestrate everything from supply chain logistics to automated customer feedback loops.</p>
                    <p class="mb-4">Historically, automation was rigid—if a process changed slightly, the automation broke. Intelligent Automation changes this paradigm entirely. By embedding cognitive capabilities into automated flows, our systems can read unstructured emails, make decisions based on historical precedent, and route exceptions only when human intervention is truly required.</p>
                    <div class="glass-card p-6 my-8 border-l-4 border-secondary bg-surface">
                        <h4 class="text-white font-bold mb-2">Automated Ecosystem Features</h4>
                        <ul class="feature-list space-y-2 mt-4 text-sm">
                            <li><i class="fas fa-robot text-secondary"></i> Optical Character Recognition (OCR) for invoice and receipt extraction.</li>
                            <li><i class="fas fa-network-wired text-secondary"></i> Seamless integration with strictly legacy systems (SAP, Oracle, Salesforce).</li>
                            <li><i class="fas fa-clock text-secondary"></i> 24/7 autonomous processing requiring zero human oversight.</li>
                        </ul>
                    </div>
                    <p><strong>The Result:</strong> Typical implementations yield a monumental 60% reduction in document processing time, near-zero human error rates, and immediate cost savings that scale exponentially as your transaction volume grows.</p>
                `
            },
            'data-engineering': {
                title: 'Data Engineering',
                subtitle: 'Robust pipelines for a data-driven world.',
                body: `
                    <p class="mb-4">Great AI requires immaculate data infrastructure. We construct incredibly resilient data pipelines, warehouses, and lakes precisely engineered to handle terabytes of streaming data with extremely low latency.</p>
                    <p class="mb-4">The modern data stack is highly fragmented and confusing. Our data engineers cut through the noise to build unified architectures using tools like Snowflake, dbt, Apache Kafka, and Airflow. We ensure that data flows seamlessly from production databases, third-party APIs, and user telemetry directly into your analytical models.</p>
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">The Data Foundation</h4>
                    <p class="mb-4">Our engineering process includes:</p>
                    <ul class="feature-list mb-6 space-y-3">
                        <li><i class="fas fa-database text-primary"></i> <strong>ETL / ELT Pipelines:</strong> Extracting data precisely, transforming it for business logic, and loading it flawlessly into highly optimized columnar databases.</li>
                        <li><i class="fas fa-shield-alt text-primary"></i> <strong>Data Governance & Security:</strong> Implementing strict role-based access controls (RBAC) and data masking to ensure compliance.</li>
                        <li><i class="fas fa-tachometer-alt text-primary"></i> <strong>Real-time Streaming:</strong> Transitioning your organization from batch processing to real-time event streaming for immediate analytical reactions.</li>
                    </ul>
                    <p>Stop fighting with broken data scripts. Let Lurnexa build a highly fault-tolerant architecture that lets your data scientists focus purely on finding insights.</p>
                `
            },
            'cloud-dev': {
                title: 'Cloud Development',
                subtitle: 'Massively scalable cloud-native applications.',
                body: `
                    <p class="mb-4">Modern businesses require zero-downtime architecture. Whether it is AWS, Azure, or Google Cloud, we containerize and orchestrate your entire software platform utilizing Kubernetes and strictly disciplined DevOps CI/CD pipelines.</p>
                    <p class="mb-4">We are experts at breaking down monolithic legacy applications into agile, independent microservices. By migrating to a Serverless or highly orchestrated container approach, we drastically reduce your monthly compute costs while simultaneously increasing your application's ability to handle massive, sudden influxes of traffic.</p>
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">Cloud Services Provided</h4>
                    <div class="grid grid-2 gap-4 my-6">
                        <div class="glass-card p-4 border border-gray-800">
                            <strong>Infrastructure as Code (IaC)</strong>
                            <p class="text-sm mt-2 text-gray-400">Total automation of environment provisioning using Terraform and CloudFormation.</p>
                        </div>
                        <div class="glass-card p-4 border border-gray-800">
                            <strong>Multi-region Deployments</strong>
                            <p class="text-sm mt-2 text-gray-400">High availability architectures ensuring your platform stays globally accessible.</p>
                        </div>
                        <div class="glass-card p-4 border border-gray-800">
                            <strong>FinOps & Cost Optimization</strong>
                            <p class="text-sm mt-2 text-gray-400">Intelligent right-sizing of instances reducing cloud spend averages by 35%.</p>
                        </div>
                        <div class="glass-card p-4 border border-gray-800">
                            <strong>DevSecOps</strong>
                            <p class="text-sm mt-2 text-gray-400">Embedding security compliance directly into every single step of the pipeline.</p>
                        </div>
                    </div>
                    <p>If you're looking to build something massive, you need a foundation that won't crack. Lurnexa builds cloud ecosystems that scale predictably and efficiently.</p>
                `
            },
            'about': {
                title: 'About Lurnexa',
                subtitle: 'We are builders, researchers, and innovators.',
                body: `
                    <p class="mb-4">Lurnexa Technologies was born out of a relentless desire to push the absolute boundaries of what is mechanically and computationally possible. We actively combine academic rigorousness with fierce startup speed.</p>
                    <p class="mb-4">What started as a highly specialized AI research lab has exploded into a full-scale digital innovation agency. We do not just consult; we design, architect, and deploy end-to-end ecosystems that drive profound transformation. Our global team consists of specialized Machine Learning engineers, award-winning UI/UX architects, and hardcore cloud orchestration experts.</p>
                    <p class="mb-4">Our core DNA is rooted in transparency, exceptional engineering quality, and delivering disproportionate ROI to our corporate partners.</p>
                    <div class="mt-10 p-8 rounded-2xl bg-gradient-to-r from-primary-dim to-transparent border border-primary">
                        <h4 class="text-white font-bold text-2xl mb-4">Our Mission Directive</h4>
                        <p class="text-lg italic text-gray-300">"To democratize elite, enterprise-grade artificial intelligence and highly performant software architecture for businesses of all scales, transforming visionary ideas into resilient mathematical realities."</p>
                    </div>
                `
            },
            'press': {
                title: 'Press & Media',
                subtitle: 'Lurnexa in the news and media assets.',
                body: `
                    <p class="mb-4">Lurnexa Technologies frequently releases whitepapers, open-source model updates, and breaking announcements regarding our latest deployments in manufacturing, healthcare, and fintech.</p>
                    <p class="mb-4">For all media inquiries, press asset kits, interview requests with our lead engineers, and official communications regarding Lurnexa Technologies, please contact our PR department directly.</p>
                    
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">Brand Assets</h4>
                    <p class="mb-6">If you are a partner or media outlet writing about Lurnexa, please adhere strictly to our brand guidelines. High-resolution SVG logos, standardized typography sheets, and official corporate color hex codes are compiled securely in our Media Toolkit.</p>
                    
                    <button class="btn-outline">Download Media Kit (.ZIP)</button>
                    
                    <h4 class="text-white font-bold text-xl mt-12 mb-4">Contact Public Relations</h4>
                    <p>Email: <strong>press@lurnexa.com</strong><br>Phone: <strong>+91 91335 21829</strong></p>
                `
            },
            'partners': {
                title: 'Global Partners',
                subtitle: 'Building the future alongside industry leaders.',
                body: `
                    <p class="mb-4">We strategically align with premier academic institutions, tier-1 cloud providers, and international global enterprises to co-develop proprietary technologies. At Lurnexa, we believe that extreme innovation occurs perfectly at the intersection of vastly different disciplines.</p>
                    
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">The Partnership Tiers</h4>
                    <ul class="space-y-4 mb-8">
                        <li class="glass-card p-6">
                            <h5 class="text-white font-bold text-lg mb-2">Technology Partners</h5>
                            <p class="text-sm text-gray-400">Collaborating with massive cloud infrastructure providers like AWS, NVIDIA, and Microsoft Azure to ensure our proprietary models run flawlessly on best-in-class hardware.</p>
                        </li>
                        <li class="glass-card p-6 border-l-4 border-primary">
                            <h5 class="text-white font-bold text-lg mb-2">Strategic Alliance Network</h5>
                            <p class="text-sm text-gray-400">Go-to-market partnerships with global consulting firms. We provide the hardcore engineering firepower, they provide industry-specific corporate distributions.</p>
                        </li>
                        <li class="glass-card p-6 border-l-4 border-secondary">
                            <h5 class="text-white font-bold text-lg mb-2">Academic Research Consortia</h5>
                            <p class="text-sm text-gray-400">Direct partnerships with leading computational universities allowing us to recruit elite talent and participate actively in foundational AI research.</p>
                        </li>
                    </ul>
                    
                    <p>Interested in exploring a strategic alignment with Lurnexa Technologies? Reach out to our partner network operators and let's build the future together.</p>
                `
            },
            'privacy': {
                title: 'Privacy Policy',
                subtitle: 'Your data security is our absolute priority.',
                body: `
                    <p class="mb-4">Last Updated: January 1st, 2026</p>
                    <p class="mb-4">Lurnexa Technologies operates under a fundamental premise: data sovereignty and security are non-negotiable. Our privacy commitments strictly adhere to global compliance frameworks including GDPR, HIPAA (for healthcare environments), and CCPA.</p>
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">1. Data Collection & Telemetry</h4>
                    <p class="mb-4">We collect telemetry data explicitly to improve model performance and system stability. This includes anonymized diagnostic crash reports and API latency tracking. <strong>We categorically do not sell personal data to any third-party data broker.</strong></p>
                    <h4 class="text-white font-bold text-xl mt-6 mb-4">2. Cryptographic Security Standards</h4>
                    <p class="mb-4">All data ingested by Lurnexa systems is encrypted in transit utilizing strict TLS 1.3 parameters. Furthermore, all Personally Identifiable Information (PII) is encrypted at rest using military-grade Advanced Encryption Standard (AES-256).</p>
                    <h4 class="text-white font-bold text-xl mt-6 mb-4">3. Data Retention & Erasure</h4>
                    <p class="mb-4">In full compliance to the standard "Right to be Forgotten", Lurnexa supports complete and instantaneous data erasure requests across all backups and active databases. Our retention policies automatically purge staging data within 30 days of standard processing cycles.</p>
                    <p class="mt-8 text-sm text-gray-500">For detailed inquiries regarding our DPA (Data Processing Agreements) or specific security architecture audits, please file a request via our Contact Portal.</p>
                `
            },
            'terms': {
                title: 'Terms of Service',
                subtitle: 'The legal framework of our software ecosystems.',
                body: `
                    <p class="mb-4">Last Updated: January 1st, 2026</p>
                    <p class="mb-4">These Terms of Service ("Terms") strictly govern your access to the Lurnexa APIs, web dashboards, consulting services, and licensed machine learning models (collectively, the "Services").</p>
                    
                    <h4 class="text-white font-bold text-xl mt-8 mb-4">Service Level Agreements (SLAs)</h4>
                    <p class="mb-4">Accessing Lurnexa API integrations and platforms is governed by our rigorous enterprise service level agreements. For guaranteed 99.99% uptime parameters, incident response clauses, and compensation models for critical downtime, please review the specific terms outlined closely in your individual Client Master Service Agreement.</p>
                    
                    <h4 class="text-white font-bold text-xl mt-6 mb-4">Acceptable Use & API Rate Limiting</h4>
                    <p class="mb-4">Our systems are vastly scalable but to protect our broader ecosystem, strict rate limits are automatically enforced on public APIs. Utilizing our models for generating explicitly malicious content, performing unchecked automated scraping, or reverse engineering our proprietary neural networks will result in an immediate, unappealable suspension of credentials.</p>
                    
                    <h4 class="text-white font-bold text-xl mt-6 mb-4">Intellectual Property</h4>
                    <p class="mb-4">Unless explicitly transferred via a dedicated custom software agreement, Lurnexa retains full overarching proprietary rights to the baseline machine learning models, UI frameworks, and infrastructure topologies utilized to construct your custom solutions.</p>
                `
            },
            'api': {
                title: 'API Documentation',
                subtitle: 'Developer-first integration points.',
                body: `
                    <p class="mb-4">Our infrastructure is built by engineers, for engineers. The Lurnexa API suite enables you to instantly deploy complex Natural Language workflows, anomaly detection algorithms, and real-time visualization streams directly into your existing corporate applications.</p>
                    
                    <div class="bg-black/50 p-6 rounded-2xl border border-gray-800 my-8">
                        <div class="flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
                            <span class="px-3 py-1 bg-secondary text-white text-xs font-bold rounded">POST</span>
                            <code class="text-primary font-mono text-sm">api.lurnexa.com/v2/models/predict</code>
                        </div>
                        <p class="text-sm text-gray-400 mb-4">Submits a JSON payload for immediate processing against your fine-tuned enterprise model. Returns a highly structured prediction containing probability confidence bounds.</p>
                        <pre class="bg-gray-900 p-4 rounded text-xs text-green-400 overflow-x-auto">
{
  "status": "success",
  "inference_time_ms": 42,
  "data": {
    "classification": "high_priority_anomaly",
    "confidence_score": 0.985
  }
}</pre>
                    </div>

                    <h4 class="text-white font-bold text-xl mt-8 mb-4">Authentication Protocols</h4>
                    <p class="mb-4">Our RESTful architecture and specific GraphQL endpoints require strict OAuth2.0 authentication utilizing rotating Bearer tokens.</p>
                    
                    <h4 class="text-white font-bold text-xl mt-6 mb-4">Developer Portal</h4>
                    <p class="mb-4">The full developer portal containing interactive Swagger UIs, comprehensive error code dictionaries, and highly optimized official SDKs for Python, Node.js, and Golang is available exclusively to active enterprise partners. Visit your client dashboard to generate API keys.</p>
                `
            }
        };

        const data = pageData[contentKey];
        if (data) {
            document.getElementById('dynamic-title').innerHTML = '<span class="text-gradient">' + data.title + '</span>';
            document.getElementById('dynamic-subtitle').innerHTML = data.subtitle;
            document.getElementById('dynamic-body').innerHTML = data.body;
            
            // Register page if not exist
            if (!pages['dynamic-content-page']) {
                pages['dynamic-content-page'] = document.getElementById('dynamic-content-page');
            }
            
            setActivePage('dynamic-content-page', false);
            window.location.hash = contentKey;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (toastTrigger) {
        e.preventDefault();
        showToast(toastTrigger.getAttribute('data-toast'));
    }
});

// Service cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.card-title');
        if (title) {
            showToast(`Exploring: ${title.innerText}`);
        }
    });
});


// ----- CONTACT MODAL -----
const modal = document.getElementById('contactModal');
const connectBtns = document.querySelectorAll('#connectBtn');
const closeModal = document.getElementById('closeModal');

connectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    });
});

if(closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
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
            showToast('⚠️ Please fill all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('⚠️ Please enter a valid email address');
            return;
        }

        const btn = document.getElementById('sendMessageBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Transmitting... <i class="fas fa-spinner fa-spin"></i>';
        
        showToast('📨 Connecting to communications relay...');

        const serviceID = 'service_01jyn07';
        const templateID = 'template_qnnepfb';

        let finalMessage = message;
        if (company) {
            finalMessage = `Corporate Affiliation: ${company}\n\n${message}`;
        }

        const templateParams = {
            user_name: name,
            user_email: email,
            message: finalMessage
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                showToast('✅ Transmission successful! Response pending.');
                contactForm.reset();
                setTimeout(() => modal.classList.remove('active'), 1000);
            })
            .catch(function(error) {
                console.error('EmailJS error:', error);
                showToast('❌ Transmission failed. Recalibrating relay.');
            })
            .finally(function() {
                btn.innerHTML = originalText;
            });
    });
}

// Initial Setup
window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);
// If hash is already present on a fresh load, trigger it
if (window.location.hash) {
    handleRouting();
} else {
    setActivePage('home', false);
}

// ----- LOGO INTRO ANIMATION -----
document.addEventListener('DOMContentLoaded', () => {
    const isAnimated = sessionStorage.getItem('logoAnimated');
    const realLogo = document.getElementById('homeLogo');
    
    if (!isAnimated && realLogo) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'logo-intro-overlay';
        overlay.className = 'logo-intro-overlay';
        overlay.innerHTML = `
            <div class="logo-intro-content" id="logoIntroContent">
                <svg class="logo-intro-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <!-- Outer circle with gap at top-right -->
                    <path d="M 135 32 A 75 75 0 1 0 174 110" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
                    <!-- Dot at the top-right end of circle -->
                    <circle cx="148" cy="38" r="6" fill="currentColor" />
                    <!-- Monogram: LT (slanted/italic block style) -->
                    <g transform="skewX(-14) translate(15, 0)">
                        <!-- Letter L in dark slate -->
                        <path d="M 52 65 L 76 65 L 76 115 L 102 115 L 102 135 L 52 135 Z" fill="currentColor" />
                        <!-- Letter T in orange (overlapping L slightly) -->
                        <path d="M 94 85 L 172 85 L 172 105 L 143 105 L 143 145 L 123 145 L 123 105 L 94 105 Z" fill="#ff6a3d" />
                    </g>
                    <!-- Floating pixel squares drifting up-right -->
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
        
        // Hide the real logo
        realLogo.classList.add('logo-hidden');
        
        const introContent = document.getElementById('logoIntroContent');
        
        // Step 1: Fade in the centered scaled logo
        setTimeout(() => {
            introContent.classList.add('show');
        }, 100);
        
        // Step 2: Animate it to the real logo's position
        setTimeout(() => {
            const rect = realLogo.getBoundingClientRect();
            const contentRect = introContent.getBoundingClientRect();
            
            // Calculate starting viewport positions
            const currentLeft = contentRect.left;
            const currentTop = contentRect.top;
            
            // Set fixed positioning coordinates to animate from
            introContent.style.position = 'fixed';
            introContent.style.left = currentLeft + 'px';
            introContent.style.top = currentTop + 'px';
            introContent.style.margin = '0';
            introContent.style.transform = 'scale(2.5)';
            
            // Force a reflow so browser registers the starting fixed positions
            introContent.offsetHeight;
            
            // Transition to target rect position
            introContent.style.left = rect.left + 'px';
            introContent.style.top = rect.top + 'px';
            introContent.style.transform = 'scale(1)';
            introContent.style.transformOrigin = 'top left';
            
            // Fade out the overlay background
            overlay.style.backgroundColor = 'transparent';
            overlay.style.pointerEvents = 'none';
        }, 1500);
        
        // Step 3: Reveal the real header logo and clean up
        setTimeout(() => {
            realLogo.classList.remove('logo-hidden');
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 500);
            sessionStorage.setItem('logoAnimated', 'true');
        }, 2700);
    }
});