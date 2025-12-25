/* ============================================
   FALCO HQ - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initThemeToggle();
    initCursorGlow();
    initNavbar();
    initMobileMenu();
    initCounterAnimation();
    initScrollReveal();
    initSmoothScroll();
    initFormHandling();
    initServiceCards();
});

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });
}

/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    if (!cursorGlow || window.innerWidth < 768) {
        if (cursorGlow) cursorGlow.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // Hide cursor glow when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '0.15';
    });
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            // Add '+' suffix for certain stats
            if (target === 150) {
                element.textContent = target + '+';
            } else if (target === 98) {
                element.textContent = target + '%';
            } else if (target === 24) {
                element.textContent = target + '/7';
            }
        }
    };
    
    updateCounter();
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.service-card, .process-step, .section-header, .about-content, .about-visual, .contact-info, .contact-form'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const delay = entry.target.classList.contains('service-card') 
                    ? index * 100 
                    : 0;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   FORM HANDLING WITH EMAILJS
   ============================================ */
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    // Initialize EmailJS with your public key
    emailjs.init('0mxEIvtIrHG4A_Q5a');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get form data - matches EmailJS template variables
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            title: form.querySelector('#service').value || 'Not specified',
            message: form.querySelector('#message').value
        };
        
        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
        `;
        submitBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            await emailjs.send('service_kbz1hhk', 'template_y2zyplf', formData);
            
            // Show success state
            submitBtn.innerHTML = `
                <span>Message Sent!</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            
            // Reset form
            form.reset();
            
            // Show success notification
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            console.error('Error details:', error.text || error.message || error);
            
            // Show error state
            submitBtn.innerHTML = `
                <span>Failed to Send</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            
            showNotification('Failed to send: ' + (error.text || error.message || 'Unknown error'), 'error');
        }
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });
    
    // Add floating label effect
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ============================================
   SERVICE CARDS INTERACTION
   ============================================ */
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ============================================
   PARALLAX EFFECT FOR ORBS
   ============================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    
    if (orb1) {
        orb1.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
    }
    
    if (orb2) {
        orb2.style.transform = `translate(${scrolled * -0.05}px, ${scrolled * -0.15}px)`;
    }
});

/* ============================================
   TYPING EFFECT FOR HERO (Optional)
   ============================================ */
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;
    
    const words = ['Digital Dominance', 'Brand Excellence', 'AI Innovation'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

/* ============================================
   PRELOADER (Optional)
   ============================================ */
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
