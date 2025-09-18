/* ========================================
   PHARMACY LANDING PAGE - MAIN JAVASCRIPT
   Global functions and component loader
======================================== */

// Global variables
const PHARMACY_APP = {
    components: {},
    initialized: false,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
};

/* ========================================
   COMPONENT LOADER SYSTEM
======================================== */

/**
 * Load HTML component into specified container
 * @param {string} containerId - ID of container element
 * @param {string} componentPath - Path to component HTML file
 */
async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = html;
            
            // Mark component as loaded
            PHARMACY_APP.components[containerId] = {
                path: componentPath,
                loaded: true,
                timestamp: Date.now()
            };
            
            // Trigger component-specific initialization
            initializeComponent(containerId);
            
            console.log(`✓ Component loaded: ${containerId}`);
        } else {
            console.error(`Container not found: ${containerId}`);
        }
    } catch (error) {
        console.error(`Error loading component ${containerId}:`, error);
        
        // Fallback content
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="alert alert-warning">Component temporarily unavailable</div>`;
        }
    }
}

/**
 * Initialize component-specific functionality
 * @param {string} componentId - ID of the component
 */
function initializeComponent(componentId) {
    switch (componentId) {
        case 'header':
            if (typeof initHeader === 'function') {
                initHeader();
            }
            break;
        case 'hero':
            if (typeof initHero === 'function') {
                initHero();
            }
            break;
        case 'services':
            if (typeof initServices === 'function') {
                initServices();
            }
            break;
        case 'contact':
            if (typeof initContact === 'function') {
                initContact();
            }
            break;
        default:
            console.log(`No specific initialization for: ${componentId}`);
    }
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 */
function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold &&
        rect.left <= windowWidth * (1 - threshold) &&
        rect.right >= windowWidth * threshold
    );
}

/**
 * Smooth scroll to element
 * @param {string} targetId - ID of target element
 * @param {number} offset - Offset from top in pixels
 */
function smoothScrollTo(targetId, offset = 80) {
    const target = document.getElementById(targetId);
    if (target) {
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Add loading spinner to element
 * @param {HTMLElement} element - Element to add spinner to
 */
function addLoadingSpinner(element) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner d-flex justify-content-center align-items-center';
    spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    element.appendChild(spinner);
    return spinner;
}

/**
 * Remove loading spinner
 * @param {HTMLElement} spinner - Spinner element to remove
 */
function removeLoadingSpinner(spinner) {
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
}

/* ========================================
   RESPONSIVE UTILITIES
======================================== */

/**
 * Update device type flags based on window width
 */
function updateDeviceFlags() {
    const width = window.innerWidth;
    PHARMACY_APP.isMobile = width < 768;
    PHARMACY_APP.isTablet = width >= 768 && width < 1024;
    PHARMACY_APP.isDesktop = width >= 1024;
}

/**
 * Handle responsive changes
 */
function handleResponsiveChanges() {
    updateDeviceFlags();
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('responsiveChange', {
        detail: {
            isMobile: PHARMACY_APP.isMobile,
            isTablet: PHARMACY_APP.isTablet,
            isDesktop: PHARMACY_APP.isDesktop,
            width: window.innerWidth
        }
    }));
}

/* ========================================
   FORM UTILITIES
======================================== */

/**
 * Validate email address
 * @param {string} email - Email to validate
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic US format)
 * @param {string} phone - Phone number to validate
 */
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

/**
 * Show form success message
 * @param {HTMLElement} form - Form element
 * @param {string} message - Success message
 */
function showFormSuccess(form, message = 'Thank you! Your message has been sent.') {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show mt-3';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Remove existing alerts
    const existingAlerts = form.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Add new alert
    form.appendChild(alert);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert && alert.parentNode) {
                    alert.remove();
                }
            }, 150);
        }
    }, 5000);
}

/**
 * Show form error message
 * @param {HTMLElement} form - Form element
 * @param {string} message - Error message
 */
function showFormError(form, message = 'Sorry, there was an error sending your message. Please try again.') {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Remove existing alerts
    const existingAlerts = form.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Add new alert
    form.appendChild(alert);
}

/* ========================================
   INITIALIZATION
======================================== */

/**
 * Initialize the application
 */
function initializeApp() {
    if (PHARMACY_APP.initialized) {
        return;
    }
    
    console.log('🏥 Initializing Pharmacy Landing Page...');
    
    // Update device flags
    updateDeviceFlags();
    
    // Set up event listeners
    setupGlobalEventListeners();
    
    // Mark as initialized
    PHARMACY_APP.initialized = true;
    
    console.log('✓ Pharmacy app initialized successfully');
}

/**
 * Set up global event listeners
 */
function setupGlobalEventListeners() {
    // Window resize handler
    window.addEventListener('resize', throttle(handleResponsiveChanges, 250));
    
    // Smooth scroll for anchor links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target) {
            e.preventDefault();
            const targetId = target.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        }
    });
    
    // Loading states for forms
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending...
                `;
                submitButton.disabled = true;
                
                // Reset button after 3 seconds (fallback)
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        }
    });
    
    // Back to top functionality
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle';
    backToTopButton.style.cssText = `
        width: 50px;
        height: 50px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }, 100));
    
    // Back to top click handler
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   DOM READY & LOAD EVENTS
======================================== */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Additional setup when everything is loaded
window.addEventListener('load', function() {
    console.log('🎉 All resources loaded - Pharmacy app ready!');
    
    // Initialize animations if available
    if (typeof initAnimations === 'function') {
        initAnimations();
    }
});