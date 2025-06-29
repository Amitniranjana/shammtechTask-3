// Navigation and scroll functionality
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.company-section');
const contentArea = document.getElementById('contentArea');
const scrollProgress = document.getElementById('scrollProgress');

// Mobile menu variables
let mobileMenuToggle = null;
let mobileMenuOverlay = null;
let isMobileMenuOpen = false;

// Initialize mobile menu
function initMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    // Remove existing elements if they exist
    if (mobileMenuToggle) {
        mobileMenuToggle.remove();
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.remove();
    }
    
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
        // Create mobile menu toggle button
        mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileMenuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1003;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create overlay for mobile menu
        mobileMenuOverlay = document.createElement('div');
        mobileMenuOverlay.className = 'mobile-menu-overlay';
        mobileMenuOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(2px);
        `;
        
        document.body.appendChild(mobileMenuToggle);
        document.body.appendChild(mobileMenuOverlay);
        
        // Set sidebar styles for mobile
        sidebar.style.cssText += `
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px;
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        `;
        
        isMobileMenuOpen = false;
        
        // Add click event listeners
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on nav items
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
        
    } else {
        // Desktop - reset sidebar styles
        sidebar.style.cssText = sidebar.style.cssText.replace(/position: fixed.*?overflow-scrolling: touch;/gs, '');
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.position = 'relative';
    }
}

function toggleMobileMenu() {
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    // Animate sidebar in
    sidebar.style.transform = 'translateX(0)';
    
    // Show overlay
    mobileMenuOverlay.style.opacity = '1';
    mobileMenuOverlay.style.visibility = 'visible';
    
    // Update button icon
    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
    mobileMenuToggle.style.transform = 'rotate(90deg)';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    isMobileMenuOpen = true;
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    // Animate sidebar out
    sidebar.style.transform = 'translateX(-100%)';
    
    // Hide overlay
    mobileMenuOverlay.style.opacity = '0';
    mobileMenuOverlay.style.visibility = 'hidden';
    
    // Update button icon
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.style.transform = 'rotate(0deg)';
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    isMobileMenuOpen = false;
}

// Smooth scroll to section on nav click
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) return;
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Smooth scroll to target section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Update active nav item and progress bar on scroll
let scrollTimeout;
contentArea.addEventListener('scroll', () => {
    // Throttle scroll events for better performance
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        updateScrollIndicators();
    }, 10);
});

function updateScrollIndicators() {
    const scrollTop = contentArea.scrollTop;
    const scrollHeight = contentArea.scrollHeight - contentArea.clientHeight;
    const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 100);
    
    // Update progress bar
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercentage + '%';
    }
    
    // Update active nav item based on scroll position
    let activeSection = null;
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const contentRect = contentArea.getBoundingClientRect();
        const sectionTop = rect.top - contentRect.top + scrollTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop - 150 && scrollTop < sectionTop + sectionHeight - 150) {
            activeSection = index;
        }
    });
    
    if (activeSection !== null && navItems[activeSection]) {
        navItems.forEach(item => item.classList.remove('active'));
        navItems[activeSection].classList.add('active');
    }
}

// Enhanced hover effects for service cards
function initServiceCardEffects() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
}

// Improved stats animation with intersection observer
function initStatsAnimation() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        animateStatNumber(stat);
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stats-section').forEach(section => {
        statsObserver.observe(section);
    });
}

function animateStatNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, numericValue);
        
        if (step >= steps || current >= numericValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            const suffix = finalValue.replace(/[\d.]/g, '');
            element.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

// Fixed parallax effect - only for content area logos, not sidebar
function initParallaxEffect() {
    let parallaxTimeout;
    
    contentArea.addEventListener('scroll', () => {
        if (parallaxTimeout) {
            clearTimeout(parallaxTimeout);
        }
        
        parallaxTimeout = setTimeout(() => {
            // Only apply parallax to logos that are NOT in the sidebar
            const contentLogos = contentArea.querySelectorAll('.company-logo:not(.sidebar .company-logo)');
            
            contentLogos.forEach(logo => {
                const rect = logo.getBoundingClientRect();
                const speed = 0.3;
                const yPos = -(rect.top * speed);
                
                // Use transform3d for better performance
                logo.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${yPos * 0.05}deg)`;
            });
        }, 10);
    });
}

// Enhanced loading animation
function initLoadingAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.opacity = '1';
            
            // Initialize all components after load
            initMobileMenu();
            initServiceCardEffects();
            initStatsAnimation();
            initParallaxEffect();
        }, 100);
    });
}

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        initMobileMenu();
        
        // Close mobile menu if window becomes desktop size
        if (window.innerWidth > 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250);
});

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingAnimation);
} else {
    initLoadingAnimation();
}
