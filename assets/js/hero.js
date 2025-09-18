/* ========================================
   HERO SECTION JAVASCRIPT
   Animations, interactions, and dynamic content
======================================== */

let heroInitialized = false;
let countingAnimationTriggered = false;

/**
 * Initialize hero section functionality
 */
function initHero() {
    if (heroInitialized) return;
    
    console.log('🚀 Initializing hero section...');
    
    setupStatCounters();
    setupParallaxEffect();
    setupHeroAnimations();
    setupCTAInteractions();
    setupScrollIndicator();
    setupFloatingCards();
    
    heroInitialized = true;
    console.log('✓ Hero section initialized');
}

/* ========================================
   STATISTICS COUNTER ANIMATION
======================================== */

/**
 * Setup animated counters for statistics
 */
function setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countingAnimationTriggered) {
                countingAnimationTriggered = true;
                animateCounters();
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe the stats container
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/**
 * Animate the stat counters
 */
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((statElement, index) => {
        const target = parseInt(statElement.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = Date.now();
        const startValue = 0;
        
        function updateCounter() {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            statElement.textContent = currentValue;
            
            // Add suffix for percentage
            if (target === 99) {
                statElement.textContent = currentValue + '%';
            }
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Final value with proper formatting
                if (target >= 1000) {
                    statElement.textContent = (target / 1000).toFixed(0) + 'K+';
                } else if (target === 99) {
                    statElement.textContent = target + '%';
                } else {
                    statElement.textContent = target + '+';
                }
                
                // Add completion animation
                statElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    statElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        // Start the animation with a slight delay for each counter
        setTimeout(updateCounter, index * 300);
    });
}

/* ========================================
   PARALLAX EFFECT
======================================== */

/**
 * Setup subtle parallax effect for hero background
 */
function setupParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Apply transform only if hero is visible
        if (scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/* ========================================
   HERO ANIMATIONS
======================================== */

/**
 * Setup additional hero animations and interactions
 */
function setupHeroAnimations() {
    // Add stagger animation to benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
        item.style.animationDelay = `${1.1 + (index * 0.2)}s`;
    });
    
    // Add hover animations to trust badges
    const trustBadge = document.querySelector('.trust-badge');
    if (trustBadge) {
        trustBadge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        trustBadge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    }
    
    // Animate trust indicators on scroll
    const trustItems = document.querySelectorAll('.trust-item');
    const trustObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    trustItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        trustObserver.observe(item);
    });
}

/* ========================================
   CTA INTERACTIONS
======================================== */

/**
 * Setup call-to-action button interactions
 */
function setupCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    
    ctaButtons.forEach(btn => {
        // Add ripple effect on click
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover sound effect (optional)
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   SCROLL INDICATOR
======================================== */

/**
 * Setup scroll indicator behavior
 */
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    let ticking = false;
    
    function updateScrollIndicator() {
        const scrollY = window.pageYOffset;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        
        if (scrollY > heroHeight * 0.3) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollIndicator);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add click handler for smooth scroll
    scrollIndicator.addEventListener('click', function() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

/* ========================================
   FLOATING CARDS INTERACTIONS
======================================== */

/**
 * Setup floating cards hover effects and animations
 */
function setupFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.zIndex = '20';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '10';
        });
        
        // Add click interaction
        card.addEventListener('click', function() {
            // Get the service type from the card content
            const cardContent = this.querySelector('h6').textContent;
            let targetSection = 'services';
            
            // Map card content to specific sections
            if (cardContent.includes('Consultation')) {
                targetSection = 'contact';
            } else if (cardContent.includes('Vaccination')) {
                targetSection = 'services';
            }
            
            // Smooth scroll to target section
            const target = document.getElementById(targetSection);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the navigation item
                if (typeof highlightNavItem === 'function') {
                    highlightNavItem(targetSection);
                }
            }
        });
        
        // Add entrance animation delay
        card.style.animationDelay = `${0.6 + (index * 0.1)}s`;
    });
}

/* ========================================
   RESPONSIVE BEHAVIOR
======================================== */

/**
 * Handle responsive changes for hero section
 */
function handleHeroResponsive() {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (!heroContent) return;
    
    window.addEventListener('responsiveChange', function(e) {
        const { isMobile, isTablet, isDesktop } = e.detail;
        
        if (isMobile) {
            // Adjust animations for mobile
            const floatingCards = document.querySelectorAll('.floating-card');
            floatingCards.forEach(card => {
                card.style.display = 'none';
            });
        } else {
            // Show floating cards on larger screens
            const floatingCards = document.querySelectorAll('.floating-card');
            floatingCards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    });
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */

/**
 * Get hero section statistics
 * @returns {Object} Hero statistics data
 */
function getHeroStats() {
    return {
        customers: 15000,
        yearsOfService: 28,
        satisfaction: 99
    };
}

/**
 * Update hero statistics
 * @param {Object} newStats - New statistics to display
 */
function updateHeroStats(newStats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statElement => {
        const currentTarget = parseInt(statElement.getAttribute('data-target'));
        let newTarget;
        
        if (currentTarget === 15000) {
            newTarget = newStats.customers || currentTarget;
        } else if (currentTarget === 28) {
            newTarget = newStats.yearsOfService || currentTarget;
        } else if (currentTarget === 99) {
            newTarget = newStats.satisfaction || currentTarget;
        }
        
        if (newTarget !== currentTarget) {
            statElement.setAttribute('data-target', newTarget);
        }
    });
}

/**
 * Trigger hero entrance animation manually
 */
function triggerHeroAnimation() {
    const heroElements = document.querySelectorAll('[data-aos]');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('aos-animate');
    });
}

/* ========================================
   INITIALIZATION
======================================== */

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initHero, 100);
    });
} else {
    setTimeout(initHero, 100);
}

// Handle responsive changes
handleHeroResponsive();

// Export functions for external use
window.heroFunctions = {
    getHeroStats,
    updateHeroStats,
    triggerHeroAnimation,
    animateCounters
};