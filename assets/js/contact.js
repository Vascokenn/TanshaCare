/* ========================================
   CONTACT SECTION JAVASCRIPT - SIMPLE & FUNCTIONAL
======================================== */

function initContact() {
    console.log('📞 Contact section initialized');
    
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous validation states
        clearValidation();
        
        // Validate form
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message', 'privacy'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    if (!field) return true;
    
    let isValid = true;
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    switch(field.type) {
        case 'email':
            if (field.required && !value) {
                isValid = false;
            } else if (value && !isValidEmail(value)) {
                isValid = false;
            }
            break;
            
        case 'checkbox':
            if (field.required && !field.checked) {
                isValid = false;
            }
            break;
            
        default:
            if (field.required && !value) {
                isValid = false;
            }
    }
    
    // Apply validation classes
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearValidation() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('.is-valid, .is-invalid');
    
    fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
    
    // Clear message
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = '';
    formMessage.className = 'form-message mt-3';
}

function submitForm() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnSpinner.classList.remove('d-none');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        clearValidation();
        
        // Reset button
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnSpinner.classList.add('d-none');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 2000); // 2 second delay to simulate network request
}

function showMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = text;
    formMessage.className = `form-message mt-3 ${type}`;
}

// Add smooth animations on scroll
function addScrollAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    const formGroups = document.querySelectorAll('.contact-form .mb-3, .contact-form .mb-4');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state and observe
    [...contactItems, ...formGroups].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Remove auto-initialization here; let the component loader call initContact and addScrollAnimations after HTML injection

// Export for global access
window.ContactForm = {
    validate: validateForm,
    submit: submitForm,
    showMessage: showMessage
};