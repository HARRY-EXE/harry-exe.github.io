// Replace the existing projects array and createProjectCards function with:
async function loadProjects() {
    try {
        const response = await fetch('projects/projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

async function createProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    const projects = await loadProjects();
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        // Create links HTML based on available URLs
        const linksHTML = [];
        if (project.github) {
            linksHTML.push(`
                <a href="${project.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
            `);
        }
        if (project.website) {
            linksHTML.push(`
                <a href="${project.website}" target="_blank">
                    <i class="fas fa-globe"></i> Website
                </a>
            `);
        }
        
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${linksHTML.join('')}
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

// Update the initialization to handle async loading
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize loading sequence
    const splashScreen = document.getElementById('splash-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        loadingProgress.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 500);

    // Initialize rest of your site
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    await createProjectCards();
    initializeScrollIndicator();
    
    // Set initial theme to light
    document.documentElement.setAttribute('data-theme', 'light');
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Set initial icon to moon for light theme
    themeIcon.className = 'fas fa-moon';
    
    // Add transition end listener to prevent transition glitches
    document.documentElement.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'background-color') {
            document.documentElement.classList.remove('transitioning');
        }
    });
    
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.add('transitioning');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        requestAnimationFrame(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme', newTheme);
        });
    });
    
    // Apply saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

let isScrolling = false;
let lastScrollTime = 0;
const scrollCooldown = 700;

function initializeScrollIndicator() {
    const sections = document.querySelectorAll('section');
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    
    // Only add scroll indicator on desktop
    if (window.innerWidth > 768) {
        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            dot.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth' });
            });
            scrollIndicator.appendChild(dot);
        });
        
        document.body.appendChild(scrollIndicator);
        
        const dots = scrollIndicator.querySelectorAll('.scroll-dot');
        dots[0].classList.add('active');
        
        // Update dots on scroll
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                updateScrollIndicator(sections, dots);
            });
        }, { passive: true });
    }

    // Different scroll behavior for mobile and desktop
    if (isMobileDevice()) {
        // Remove scroll snapping on mobile
        document.body.style.overflow = 'auto';
        sections.forEach(section => {
            section.style.scrollSnapAlign = 'none';
            section.style.scrollSnapStop = 'none';
        });
    } else {
        // Desktop scroll handling
        document.addEventListener('wheel', (e) => handleScroll(e, sections), { passive: false });
        document.addEventListener('keydown', handleKeyboardNavigation);
    }
}

function updateScrollIndicator(sections, dots) {
    const currentScroll = window.pageYOffset;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }
    });
}

function handleScroll(e, sections) {
    if (isMobileDevice()) return; // Don't handle scroll on mobile
    
    e.preventDefault();
    
    const currentTime = Date.now();
    if (isScrolling || currentTime - lastScrollTime < scrollCooldown) return;
    
    const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('section');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    isScrolling = true;
    lastScrollTime = currentTime;
    
    if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.deltaY < 0 && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, scrollCooldown);
}

// Add keyboard navigation handler
function handleKeyboardNavigation(e) {
    if (isMobileDevice()) return;
    
    const sections = document.querySelectorAll('section');
    const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('section');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Add helper function to detect mobile devices
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// Keep the smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
  
