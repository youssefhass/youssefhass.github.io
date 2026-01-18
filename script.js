// ===== Theme Toggle =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', newTheme);
    }

    localStorage.setItem('theme', newTheme);
}

// Initialize theme immediately to prevent flash
initTheme();

// ===== Section Loader =====
const sections = [
    { id: 'about-container', file: 'sections/about.html' },
    { id: 'projects-container', file: 'sections/projects.html' },
    { id: 'skills-container', file: 'sections/skills.html' },
    { id: 'blog-container', file: 'sections/blog.html' },
    { id: 'contact-container', file: 'sections/contact.html' }
];

async function loadSections() {
    const loadPromises = sections.map(async (section) => {
        try {
            const response = await fetch(section.file);
            if (response.ok) {
                const html = await response.text();
                const container = document.getElementById(section.id);
                if (container) {
                    container.innerHTML = html;
                }
            }
        } catch (error) {
            console.error(`Error loading ${section.file}:`, error);
        }
    });

    await Promise.all(loadPromises);
    initializeAfterLoad();
}

function initializeAfterLoad() {
    // ===== DOM Elements =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contactForm');
    const themeToggle = document.getElementById('theme-toggle');

    // ===== Theme Toggle =====
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ===== Mobile Navigation Toggle =====
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== Navbar Scroll Effect =====
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background change
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===== Active Navigation Link on Scroll =====
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    allSections.forEach(section => {
        observer.observe(section);
    });

    // ===== Scroll Animations =====
    const fadeElements = document.querySelectorAll('.project-card, .skill-category, .volunteer-card, .about-stats .stat');

    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const fadeObserver = new IntersectionObserver(fadeObserverCallback, fadeObserverOptions);

    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        fadeObserver.observe(element);
    });

    // ===== Smooth Scroll for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Contact Form Handler =====
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Create mailto link
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            // Open email client
            window.location.href = `mailto:youssefhass@gmail.com?subject=${subject}&body=${body}`;

            // Show success feedback
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Opening Email Client...';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                contactForm.reset();
            }, 2000);
        });
    }

    // ===== Typing Effect for Hero (Optional Enhancement) =====
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typing after a delay
        setTimeout(typeWriter, 800);
    }

    // ===== Add parallax effect to hero blob =====
    const heroBlob = document.querySelector('.hero-blob');
    if (heroBlob) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            heroBlob.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        });
    }

    // ===== Console Welcome Message =====
    console.log('%c Welcome to Youssef Hassan\'s Portfolio! ', 'background: #3d32c2; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c Senior Data Engineer | MBCS ', 'color: #17bbfc; font-size: 12px;');
}

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', loadSections);
