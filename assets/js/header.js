/* ========================================
   HEADER COMPONENT JAVASCRIPT
   Navigation functionality and scroll effects
======================================== */

let headerInitialized = false;
let currentSection = 'hero';
let isScrolling = false;

/**
 * Initialize header functionality
 */
function initHeader() {
    if (headerInitialized) return;
    
    console.log('🔧 Initializing header component...');
    
    setupScrollEffects();
    setupNavigation();
    setupMobileMenu();
    setupActiveSection();
    
    headerInitialized = true;
    console.log('✓ Header component initialized');
}

/* ========================================
   SCROLL EFFECTS
======================================== */

/**
 * Setup navbar scroll effects
 */
function setupScrollEffects() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (Math.abs(scrollY - lastScrollY) > 10) {
            if (scrollY > lastScrollY && scrollY > 200) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = scrollY;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    // Throttled scroll listener
    window.addEventListener('scroll', requestTick);
    
    // Initial call
    updateNavbar();
}

/* ========================================
   NAVIGATION FUNCTIONALITY
======================================== */

/**
 * Setup smooth scrolling navigation
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const dropdownLinks = document.querySelectorAll('.dropdown-item[href^="#"]');
    
    // Combine all navigation links
    const allLinks = [...navLinks, ...dropdownLinks];
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Smooth scroll to target
                const headerHeight = document.getElementById('mainNavbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNavLink(this);
            }
        });
    });
}

/**
 * Update active navigation link
 * @param {HTMLElement} activeLink - The clicked link
 */
function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active', 'section-active');
    });
    
    // Add active class to clicked link
    if (activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active', 'section-active');
    }
}

/* ========================================
   MOBILE MENU FUNCTIONALITY
======================================== */

/**
 * Setup mobile menu behavior
 */
function setupMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Add click animation to toggler
    navbarToggler.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isNavbarElement = e.target.closest('.navbar');
        
        if (!isNavbarElement && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
    
    // Handle responsive changes
    window.addEventListener('responsiveChange', function(e) {
        if (e.detail.isDesktop && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
}

/* ========================================
   ACTIVE SECTION DETECTION
======================================== */

/**
 * Setup active section detection based on scroll position
 */
function setupActiveSection() {
    const sections = ['hero', 'services', 'about', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let ticking = false;
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 150; // Offset for header
        let activeSection = 'hero';
        
        // Find the current section
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            }
        });
        
        // Update active state only if changed
        if (currentSection !== activeSection) {
            currentSection = activeSection;
            
            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active', 'section-active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active', 'section-active');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking && !isScrolling) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
    }
    
    // Throttled scroll listener
    window.addEventListener('scroll', requestTick);
    
    // Initial call
    updateActiveSection();
}

/* ========================================
   DROPDOWN ENHANCEMENTS
======================================== */

/**
 * Setup dropdown menu enhancements
 */
function setupDropdownEnhancements() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.nextElementSibling;
        
        if (dropdownMenu) {
            // Add hover effects for desktop
            if (!PHARMACY_APP.isMobile) {
                dropdown.parentElement.addEventListener('mouseenter', function() {
                    const bsDropdown = new bootstrap.Dropdown(dropdown);
                    bsDropdown.show();
                });
                
                dropdown.parentElement.addEventListener('mouseleave', function() {
                    const bsDropdown = new bootstrap.Dropdown(dropdown);
                    bsDropdown.hide();
                });
            }
            
            // Add keyboard navigation
            dropdownMenu.addEventListener('keydown', function(e) {
                const items = this.querySelectorAll('.dropdown-item');
                const currentIndex = Array.from(items).findIndex(item => 
                    item === document.activeElement
                );
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % items.length;
                        items[nextIndex].focus();
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (currentIndex - 1 + items.length) % items.length;
                        items[prevIndex].focus();
                        break;
                        
                    case 'Escape':
                        e.preventDefault();
                        const bsDropdown = new bootstrap.Dropdown(dropdown);
                        bsDropdown.hide();
                        dropdown.focus();
                        break;
                }
            });
        }
    });
}

/* ========================================
   UTILITY FUNCTIONS
======================================== */

/**
 * Get current active section
 * @returns {string} Current active section ID
 */
function getCurrentSection() {
    return currentSection;
}

/**
 * Set scroll lock (useful for modals)
 * @param {boolean} lock - Whether to lock scrolling
 */
function setScrollLock(lock) {
    isScrolling = lock;
    document.body.style.overflow = lock ? 'hidden' : '';
}

/**
 * Highlight navigation item temporarily
 * @param {string} sectionId - Section to highlight
 */
function highlightNavItem(sectionId) {
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (navLink) {
        navLink.style.background = 'rgba(37, 99, 235, 0.1)';
        navLink.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            navLink.style.background = '';
            navLink.style.transform = '';
        }, 1000);
    }
}

/* ========================================
   INITIALIZATION CHECK
======================================== */

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for component to load
        setTimeout(initHeader, 100);
    });
} else {
    setTimeout(initHeader, 100);
}

// Export functions for external use
window.headerFunctions = {
    getCurrentSection,
    setScrollLock,
    highlightNavItem,
    updateActiveNavLink
};