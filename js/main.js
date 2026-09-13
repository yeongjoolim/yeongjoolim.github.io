// ========================================
// Multi-Language Support
// ========================================
let translations = {};
let currentLang = 'ja'; // Default language

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('js/translations.json');
        translations = await response.json();
        
        // Check for saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        }
        
        // Initialize language
        setLanguage(currentLang);
        updateActiveLangButton(currentLang);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Set language
function setLanguage(lang) {
    if (!translations[lang]) {
        console.error('Language not found:', lang);
        return;
    }
    
    currentLang = lang;
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let translation = translations[lang];
        
        // Navigate through nested keys
        for (let key of keys) {
            translation = translation[key];
            if (!translation) break;
        }
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update page title based on language
    updatePageTitle(lang);
    
    // Update form messages language
    updateFormLanguage(lang);
}

// Update page title
function updatePageTitle(lang) {
    const titles = {
        'ja': '准教授プロフィール | 研究者ページ',
        'en': 'Associate Professor Profile | Researcher Page',
        'ko': '부교수 프로필 | 연구자 페이지'
    };
    document.title = titles[lang] || titles['ja'];
}

// Update active language button
function updateActiveLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// Update form messages based on language
function updateFormLanguage(lang) {
    window.currentFormLang = lang;
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    // Load translations
    loadTranslations();
    
    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            updateActiveLangButton(lang);
        });
    });
});

// ========================================
// Navigation Menu Toggle
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ========================================
// Smooth Scrolling with Offset
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Navbar height offset
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Contact Form Handling
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Get current language for messages
            const lang = currentLang || 'ja';
            
            // Validate form
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                const errorMsg = translations[lang]?.contact?.errorMessage || 'すべての項目を入力してください。';
                showMessage(errorMsg, 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                const emailErrorMsg = translations[lang]?.contact?.emailError || '有効なメールアドレスを入力してください。';
                showMessage(emailErrorMsg, 'error');
                return;
            }
            
            // Simulate form submission
            console.log('Form submitted:', formData);
            
            // Show success message
            const successMsg = translations[lang]?.contact?.successMessage || 'お問い合わせありがとうございます。後ほどご連絡いたします。';
            showMessage(successMsg, 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// ========================================
// Show Message Function
// ========================================
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginTop = '1rem';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    // Insert message after form
    contactForm.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.5s ease';
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 500);
    }, 5000);
}

// ========================================
// Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.content-card, .research-card, .course-card, .timeline-item');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ========================================
// Update Last Updated Date
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        
        // Use appropriate locale based on current language
        const updateLastUpdated = () => {
            const lang = currentLang || 'ja';
            const locales = {
                'ja': 'ja-JP',
                'en': 'en-US',
                'ko': 'ko-KR'
            };
            lastUpdatedElement.textContent = currentDate.toLocaleDateString(locales[lang] || 'ja-JP', options);
        };
        
        // Update initially
        updateLastUpdated();
        
        // Update when language changes
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                setTimeout(updateLastUpdated, 100);
            });
        });
    }
});

// ========================================
// Keyword Click Animation
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const keywords = document.querySelectorAll('.keyword');
    
    keywords.forEach(keyword => {
        keyword.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .nav-link.active {
        font-weight: 600;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ========================================
// Navbar Background on Scroll
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.98)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'var(--primary-color)';
        navbar.style.backdropFilter = 'none';
    }
});

// ========================================
// Print Friendly View
// ========================================
window.addEventListener('beforeprint', function() {
    document.querySelectorAll('.hamburger').forEach(el => el.style.display = 'none');
    document.querySelector('.nav-menu').style.display = 'flex';
});

window.addEventListener('afterprint', function() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.hamburger').forEach(el => el.style.display = 'flex');
        if (!document.querySelector('.nav-menu').classList.contains('active')) {
            document.querySelector('.nav-menu').style.display = '';
        }
    }
});