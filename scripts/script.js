// Project data
const projects = [
    {
        title: "HARRYv6",
        description: "A free tool for cracking public files, featuring Facebook automation (auto like and comment), multiple cracking methods, and an optimized file maker. Regular updates ensure continued functionality.",
        technologies: ["Python"],
        github: "https://github.com/HARRY-EXE/HARRYv6",
    },
    {
        title: "FILE MAKER",
        description: "A free tool designed for rapid creation of both simple and unlimited types of Facebook files, optimized for efficient cracking processes. Enables fast and unlimited creation of Facebook files.",
        technologies: ["Python"],
        github: "https://github.com/HARRY-EXE/FILE",
    },
    {
        title: "LIVE UID CHECKER",
        description: "A high-speed tool for professionals to verify the status of cloned or cracked IDs, distinguishing between active and inactive ones swiftly. Perfect for professional-grade efficiency.",
        technologies: ["HTML", "CSS", "JavaScript"],
        github: "#",
    }
];

// Function to create project cards
function createProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    createProjectCards();
    initializeScrollIndicator();
});

let isScrolling = false;
let lastScrollTime = 0;
const scrollCooldown = 700;

function initializeScrollIndicator() {
    const sections = document.querySelectorAll('section');
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    
    // Create dots for each section
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        scrollIndicator.appendChild(dot);
    });
    
    document.body.appendChild(scrollIndicator);
    
    // Initialize first dot as active
    const dots = scrollIndicator.querySelectorAll('.scroll-dot');
    dots[0].classList.add('active');
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            updateScrollIndicator(sections, dots);
        });
    }, { passive: true });
    
    // Add wheel event listener for smooth scrolling
    document.addEventListener('wheel', (e) => handleScroll(e, sections), { passive: false });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentSection = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('section');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
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

// Keep the smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
  
