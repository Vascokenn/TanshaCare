/* ========================================
   SERVICES SECTION JAVASCRIPT
   Interactive service cards, filtering, and animations
======================================== */

let servicesInitialized = false;
let serviceCards = [];
let currentFilter = 'all';

/**
 * Initialize services section functionality
 */
function initServices() {
    if (servicesInitialized) return;
    
    console.log('🏥 Initializing services section...');
    
    setupServiceCards();
    setupServiceFilters();
    setupServiceAnimations();
    setupServiceModals();
    setupServiceTracking();
    
    servicesInitialized = true;
    console.log('✓ Services section initialized');
}

/* ========================================
   SERVICE CARDS INTERACTIONS
======================================== */

/**
 * Setup service card interactions and hover effects
 */
function setupServiceCards() {
    serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Add entrance animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover interactions
        setupCardHover(card);
        
        // Click interactions
        setupCardClick(card);
        
        // Add accessibility improvements
        setupCardAccessibility(card);
    });
}

/**
 * Setup individual card hover effects
 * @param {HTMLElement} card - Service card element
 */
function setupCardHover(card) {
    const icon = card.querySelector('.service-icon i');
    const actionBtn = card.querySelector('.service-action .btn');
    
    card.addEventListener('mouseenter', function() {
        // Add ripple effect to icon
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // Enhance button appearance
        if (actionBtn) {
            actionBtn.style.transform = 'translateY(-2px)';
            actionBtn.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
        }
        
        // Add pulse animation to features
        const features = card.querySelectorAll('.service-features li');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(5px)';
            }, index * 50);
        });
    });
    
    card.addEventListener('mouseleave', function() {
        // Reset transformations
        if (icon) {
            icon.style.transform = '';
        }
        
        if (actionBtn) {
            actionBtn.style.transform = '';
            actionBtn.style.boxShadow = '';
        }
        
        // Reset features
        const features = card.querySelectorAll('.service-features li');
        features.forEach(feature => {
            feature.style.transform = '';
        });
    });
}

/**
 * Setup card click interactions
 * @param {HTMLElement} card - Service card element
 */
function setupCardClick(card) {
    const actionBtn = card.querySelector('.service-action .btn');
    
    // Card click handler
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking the action button
        if (e.target.closest('.service-action')) return;
        
        // Add click animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Get service category
        const category = this.getAttribute('data-category');
        
        // Track interaction
        trackServiceInteraction('card_click', category);
        
        // Show service details (could open modal or scroll to contact)
        showServiceDetails(category);
    });
    
    // Button click tracking
    if (actionBtn) {
        actionBtn.addEventListener('click', function(e) {
            const category = card.getAttribute('data-category');
            const action = this.textContent.trim();
            
            // Add button click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track button interaction
            trackServiceInteraction('button_click', category, action);
        });
    }
}

/**
 * Setup card accessibility features
 * @param {HTMLElement} card - Service card element
 */
function setupCardAccessibility(card) {
    // Add ARIA labels
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    
    const title = card.querySelector('.service-title').textContent;
    card.setAttribute('aria-label', `Learn more about ${title}`);
    
    // Keyboard navigation
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Focus styles
    card.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
}

/* ========================================
   SERVICE FILTERING SYSTEM
======================================== */

/**
 * Setup service filtering functionality
 */
function setupServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            applyServiceFilter(filter);
            
            // Track filter usage
            trackServiceInteraction('filter_click', filter);
        });
    });
}

/**
 * Apply filter to service cards
 * @param {string} filter - Filter category ('all' or specific category)
 */
function applyServiceFilter(filter) {
    currentFilter = filter;
    
    serviceCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            // Show card with animation
            setTimeout(() => {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                card.style.display = 'block';
            }, index * 50);
        } else {
            // Hide card
            card.classList.add('filtered-out');
            card.classList.remove('filtered-in');
            setTimeout(() => {
                if (card.classList.contains('filtered-out')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Update results count
    updateFilterResults(filter);
}

/**
 * Update filter results display
 * @param {string} filter - Current filter
 */
function updateFilterResults(filter) {
    const totalCards = serviceCards.length;
    const visibleCards = filter === 'all' ? totalCards : 
        document.querySelectorAll(`[data-category="${filter}"]`).length;
    
    // You could add a results counter here if needed
    console.log(`Showing ${visibleCards} of ${totalCards} services`);
}

/* ========================================
   SERVICE ANIMATIONS
======================================== */

/**
 * Setup scroll-triggered animations for services
 */
function setupServiceAnimations() {
    // Intersection Observer for service cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe all service cards
    serviceCards.forEach(card => {
        card.classList.add('animate-ready');
        observer.observe(card);
    });
    
    // Observe other elements
    const emergencyNotice = document.querySelector('.emergency-notice');
    const insuranceInfo = document.querySelector('.insurance-info');
    const serviceFilters = document.querySelector('.service-filters');
    
    [emergencyNotice, insuranceInfo, serviceFilters].forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });
    
    // Add CSS for animation states
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   SERVICE DETAILS MODAL/INTERACTION
======================================== */

/**
 * Setup service detail modals or interactions
 */
function setupServiceModals() {
    // This could be expanded to show detailed service information
    // For now, we'll handle redirections based on service type
}

/**
 * Show service details based on category
 * @param {string} category - Service category
 */
function showServiceDetails(category) {
    const serviceActions = {
        'prescription': () => {
            // Scroll to contact form or open prescription form
            scrollToSection('contact');
            highlightContactForm();
        },
        'consultation': () => {
            // Scroll to contact section
            scrollToSection('contact');
            highlightConsultationBooking();
        },
        'delivery': () => {
            // Show delivery information or contact
            scrollToSection('contact');
            showDeliveryInfo();
        },
        'vaccination': () => {
            // Show vaccination booking
            showVaccinationBooking();
        },
        'screening': () => {
            // Show screening information
            showScreeningInfo();
        },
        'supplies': () => {
            // Show supplies catalog
            showSuppliesCatalog();
        }
    };
    
    const action = serviceActions[category];
    if (action) {
        action();
    }
}

/**
 * Scroll to specific section
 * @param {string} sectionId - Section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Highlight contact form for specific services
 */
function highlightContactForm() {
    // This would highlight the contact form when implemented
    console.log('Highlighting contact form for prescription services');
}

/**
 * Highlight consultation booking
 */
function highlightConsultationBooking() {
    console.log('Highlighting consultation booking');
}

/**
 * Show delivery information
 */
function showDeliveryInfo() {
    // Could show a modal with delivery zones, times, etc.
    alert('Delivery available within 10 miles. Same-day delivery for orders placed before 2 PM.');
}

/**
 * Show vaccination booking interface
 */
function showVaccinationBooking() {
    // Could open a booking modal or redirect
    alert('Vaccination booking: Call (555) 123-4567 or visit our pharmacy. Most vaccines available without appointment.');
}

/**
 * Show screening information
 */
function showScreeningInfo() {
    alert('Health screenings available Monday-Friday 9 AM-5 PM. No appointment needed for basic screenings.');
}

/**
 * Show supplies catalog
 */
function showSuppliesCatalog() {
    alert('Browse our medical supplies in-store or call (555) 123-4567 for availability and pricing.');
}

/* ========================================
   SERVICE TRACKING & ANALYTICS
======================================== */

/**
 * Setup service interaction tracking
 */
function setupServiceTracking() {
    // Track when services section comes into view
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackServiceInteraction('section_view', 'services');
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(servicesSection);
    }
}

/**
 * Track service interactions for analytics
 * @param {string} action - Type of interaction
 * @param {string} category - Service category
 * @param {string} details - Additional details
 */
function trackServiceInteraction(action, category, details = '') {
    // In a real application, this would send to analytics
    const eventData = {
        action,
        category,
        details,
        timestamp: Date.now(),
        section: 'services'
    };
    
    console.log('Service interaction tracked:', eventData);
    
    // Could integrate with Google Analytics, etc.
    // gtag('event', action, { category, details });
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */

/**
 * Get all visible service cards
 * @returns {NodeList} Currently visible service cards
 */
function getVisibleServiceCards() {
    return document.querySelectorAll('.service-card:not(.filtered-out)');
}

/**
 * Get service card by category
 * @param {string} category - Service category
 * @returns {HTMLElement} Service card element
 */
function getServiceCard(category) {
    return document.querySelector(`[data-category="${category}"]`);
}

/**
 * Highlight specific service card
 * @param {string} category - Service category to highlight
 */
function highlightServiceCard(category) {
    const card = getServiceCard(category);
    if (card) {
        // Scroll to card
        card.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add highlight effect
        card.style.boxShadow = '0 0 0 3px var(--primary-color)';
        card.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.transform = '';
        }, 2000);
    }
}

/**
 * Update service information dynamically
 * @param {string} category - Service category
 * @param {Object} updates - Updates to apply
 */
function updateServiceInfo(category, updates) {
    const card = getServiceCard(category);
    if (!card) return;
    
    if (updates.title) {
        const titleElement = card.querySelector('.service-title');
        if (titleElement) titleElement.textContent = updates.title;
    }
    
    if (updates.description) {
        const descElement = card.querySelector('.service-description');
        if (descElement) descElement.textContent = updates.description;
    }
    
    if (updates.features) {
        const featuresElement = card.querySelector('.service-features');
        if (featuresElement) {
            featuresElement.innerHTML = updates.features.map(feature => 
                `<li><i class="bi bi-check-circle text-success"></i> ${feature}</li>`
            ).join('');
        }
    }
}

/* ========================================
   RESPONSIVE BEHAVIOR
======================================== */

/**
 * Handle responsive changes for services section
 */
function handleServicesResponsive() {
    window.addEventListener('responsiveChange', function(e) {
        const { isMobile, isTablet } = e.detail;
        
        if (isMobile) {
            // Adjust service cards for mobile
            serviceCards.forEach(card => {
                card.style.marginBottom = '1rem';
            });
            
            // Stack filter buttons vertically
            const filterButtons = document.querySelector('.filter-buttons');
            if (filterButtons) {
                filterButtons.style.flexDirection = 'column';
            }
        } else {
            // Reset for larger screens
            serviceCards.forEach(card => {
                card.style.marginBottom = '';
            });
            
            const filterButtons = document.querySelector('.filter-buttons');
            if (filterButtons) {
                filterButtons.style.flexDirection = 'row';
            }
        }
    });
}

/* ========================================
   INITIALIZATION
======================================== */

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initServices, 100);
    });
} else {
    setTimeout(initServices, 100);
}

// Handle responsive changes
handleServicesResponsive();

// Export functions for external use
window.servicesFunctions = {
    highlightServiceCard,
    applyServiceFilter,
    updateServiceInfo,
    getServiceCard,
    getVisibleServiceCards,
    trackServiceInteraction
};