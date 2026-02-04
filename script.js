/* ============================================
   FITO ARTIST PAGE - PREMIUM JAVASCRIPT
   Preloader, Animations, Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initRevealAnimations();
    initSmoothScroll();
    initCursorGlow();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    // Hide preloader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger hero animations after preloader
            triggerHeroAnimations();
        }, 1500); // Match preloader animation duration
    });
}

function triggerHeroAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, parseInt(delay));
    });
}

/* ============================================
   CURSOR GLOW (Desktop only)
   ============================================ */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');

    // Only on desktop
    if (window.innerWidth < 768 || !cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });

    // Smooth follow animation
    function animate() {
        const ease = 0.1;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;

        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Scroll handler for navbar background and scroll indicator
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide scroll indicator when scrolling
        if (scrollIndicator) {
            if (currentScroll > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS (for animate-on-scroll)
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay;
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   REVEAL ANIMATIONS (for sections)
   ============================================ */
function initRevealAnimations() {
    // Select elements that should reveal on scroll (not hero elements)
    const revealElements = document.querySelectorAll('.section .reveal-up, .section .animate-on-scroll');

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   MAGNETIC BUTTONS (Optional enhancement)
   ============================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/* ============================================
   UTILITY: Throttle function
   ============================================ */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log('%c🎵 FITO', 'font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cMusic that moves you.', 'font-size: 14px; color: #888;');
console.log('%cListen on Spotify: https://open.spotify.com/artist/49VK62ooP7k2DFtFg5Q4id', 'font-size: 12px; color: #1DB954;');
console.log('%cContact: info@fito.music', 'font-size: 12px; color: #8b5cf6;');
