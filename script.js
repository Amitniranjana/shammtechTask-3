// Navigation and scroll functionality

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.company-section');
const contentArea = document.getElementById('contentArea');
const scrollProgress = document.getElementById('scrollProgress');

// Mobile menu variables
let mobileMenuToggle = null;
let isMobileMenuOpen = false;

// Initialize mobile menu
function initMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    if (mobileMenuToggle) {
        mobileMenuToggle.remove();
        mobileMenuToggle = null;
    }

    if (window.innerWidth <= 768) {
        // Create hamburger button
        mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1002;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(mobileMenuToggle);
        sidebar.style.transform = 'translateX(-100%)';
        isMobileMenuOpen = false;

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // 🔐 Important
            toggleMobileMenu();
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) closeMobileMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (
                window.innerWidth <= 768 &&
                isMobileMenuOpen &&
                !sidebar.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)
            ) {
                closeMobileMenu();
            }
        });
    } else {
        sidebar.style.transform = 'translateX(0)';
    }
}


// Toggle mobile menu open/close
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    isMobileMenuOpen?closeMobileMenu():openMobileMenu();
}

// Open mobile menu
function openMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.transform = 'translateX(0)';
    sidebar.style.position = 'sticky';
    sidebar.style.top = '0px';
    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
    isMobileMenuOpen = true;
    console.log('Mobile menu opened');
}

// Close mobile menu
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.transform = 'translateX(-100%)';
    
    sidebar.style.position = 'absolute';
    sidebar.style.top = '0px';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    isMobileMenuOpen = false;
    console.log('Mobile menu closed');
}

// Smooth scroll to section on nav click
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
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
    scrollProgress.style.width = scrollPercentage + '%';
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

// Add smooth hover effects and animations to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate stats on scroll using IntersectionObserver
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

// Animate counter for stats
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

// Add loading animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    // Initialize mobile menu after load
    initMobileMenu();
});

// Add parallax effect to company logos on scroll
contentArea.addEventListener('scroll', () => {
    const logos = document.querySelectorAll('.company-logo');
    logos.forEach(logo => {
        const rect = logo.getBoundingClientRect();
        const speed = 0.5;
        const yPos = -(rect.top * speed);
        logo.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
    });
});

// Handle window resize for mobile menu
window.addEventListener('resize', () => {
    initMobileMenu();
});
