/* ========================================
   ABOUT SECTION JAVASCRIPT - SIMPLIFIED
======================================== */

function initAbout() {
    console.log('📋 About section initialized');
    
    // Add scroll animations to team cards
    const teamCards = document.querySelectorAll('.team-card');
    const certItems = document.querySelectorAll('.cert-item');
    const communityItems = document.querySelectorAll('.community-item');
    
    // Simple intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Set initial state and observe elements
    [...teamCards, ...certItems, ...communityItems].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add hover effects to highlight items
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Initialize when component is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAbout);
} else {
    initAbout();
}