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
            transition: all 0.3s ease;
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
            background: rgba(0, 0, 0, 0.3);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(mobileMenuToggle);
        document.body.appendChild(mobileMenuOverlay);
        
        // Set sidebar styles for mobile - add only mobile specific styles
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.height = '100vh';
        sidebar.style.width = '280px';
        sidebar.style.zIndex = '1001';
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.transition = 'transform 0.3s ease';
        sidebar.style.overflowY = 'auto';
        sidebar.style.webkitOverflowScrolling = 'touch';
        
        // Add background if not present
        if (!sidebar.style.backgroundColor && !getComputedStyle(sidebar).backgroundColor.includes('rgb')) {
            sidebar.style.backgroundColor = '#ffffff';
        }
        sidebar.style.boxShadow = '2px 0 10px rgba(0,0,0,0.1)';
        sidebar.classList.add('mobile-sidebar-active');
        
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
        
    } else {
        // Desktop - reset only mobile specific styles
        sidebar.style.position = '';
        sidebar.style.top = '';
        sidebar.style.left = '';
        sidebar.style.height = '';
        sidebar.style.width = '';
        sidebar.style.zIndex = '';
        sidebar.style.transform = '';
        sidebar.style.transition = '';
        sidebar.style.overflowY = '';
        sidebar.style.webkitOverflowScrolling = '';
        sidebar.style.boxShadow = '';
        sidebar.classList.remove('mobile-sidebar-active');
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
    
    // Show sidebar at current scroll position
    sidebar.style.transform = 'translateX(0)';
    
    // Show overlay
    mobileMenuOverlay.style.opacity = '1';
    mobileMenuOverlay.style.visibility = 'visible';
    
    // Update button icon
    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
    mobileMenuToggle.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    
    isMobileMenuOpen = true;
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    // Hide sidebar
    sidebar.style.transform = 'translateX(-100%)';
    
    // Hide overlay
    mobileMenuOverlay.style.opacity = '0';
    mobileMenuOverlay.style.visibility = 'hidden';
    
    // Update button icon
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    
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
contentArea.addEventListener('scroll', () => {
    const scrollTop = contentArea.scrollTop;
    const scrollHeight = contentArea.scrollHeight - contentArea.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Update progress bar
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercentage + '%';
    }
    
    // Update active nav item based on scroll position
    let activeSection = null;
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop - 100 && scrollTop < sectionTop + sectionHeight - 100) {
            activeSection = index;
        }
    });
    
    if (activeSection !== null) {
        navItems.forEach(item => item.classList.remove('active'));
        navItems[activeSection].classList.add('active');
    }
});

// Add smooth hover effects and animations
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                animateCounter(stat, 0, numericValue, finalValue);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.stats-section').forEach(section => {
    statsObserver.observe(section);
});

function animateCounter(element, start, end, finalText) {
    const duration = 2000;
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            const suffix = finalText.replace(/[\d.]/g, '');
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize mobile menu after load
    initMobileMenu();
});

// FIXED: Apply parallax effect only to content logos, not sidebar logos
contentArea.addEventListener('scroll', () => {
    // Only select logos that are inside contentArea, not in sidebar
    const contentLogos = contentArea.querySelectorAll('.company-logo');
    contentLogos.forEach(logo => {
        const rect = logo.getBoundingClientRect();
        const speed = 0.5;
        const yPos = -(rect.top * speed);
        logo.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    initMobileMenu();
});
