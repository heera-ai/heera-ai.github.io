/**
 * Personal Portfolio - Main JavaScript
 * Handles dynamic content loading, animations, and interactivity
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    dataPath: './data/profile.json',
    postsPath: './data/posts.json',
    typewriterSpeed: 80,
    typewriterPause: 2000,
};

// ===================================
// Data Loading
// ===================================
let profileData = null;

async function loadProfileData() {
    try {
        const response = await fetch(CONFIG.dataPath);
        if (!response.ok) throw new Error('Failed to load profile data');
        profileData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading profile data:', error);
        // Show error message to user
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #ef4444; font-family: monospace;">
                <p>Error loading profile data. Please check the console.</p>
            </div>
        `;
    }
}

// ===================================
// App Initialization
// ===================================
async function initializeApp() {
    populateHeroSection();
    populateAboutSection();
    populateExperience();
    populateEducation();
    populateProjects();
    await populateBlog();
    populateSkills();
    populateCertifications();
    populateContact();
    populateFooter();

    initNavigation();
    initCursorGlow();
    initScrollAnimations();
    initTypewriter();
    initProjectFilters();
    initBlogModal();
}

// ===================================
// Hero Section
// ===================================
function populateHeroSection() {
    const { personal, social, stats } = profileData;

    // Name and description
    document.getElementById('heroName').textContent = personal.name;
    document.getElementById('heroDescription').textContent = personal.tagline;
    document.getElementById('avatarImage').src = personal.avatar;
    document.getElementById('avatarImage').alt = personal.name;

    // Stats
    const statsContainer = document.getElementById('heroStats');
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${stats.yearsExperience}</div>
            <div class="stat-label">Years Experience</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.projectsCompleted}</div>
            <div class="stat-label">Projects</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.modelsDeployed}</div>
            <div class="stat-label">Models Deployed</div>
        </div>
    `;

    // Social links
    const socialContainer = document.getElementById('heroSocial');
    socialContainer.innerHTML = '';

    if (social.github) {
        socialContainer.innerHTML += `
            <a href="${social.github}" target="_blank" class="social-link" aria-label="GitHub">
                <i class="fab fa-github"></i>
            </a>
        `;
    }
    if (social.linkedin) {
        socialContainer.innerHTML += `
            <a href="${social.linkedin}" target="_blank" class="social-link" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
        `;
    }
    if (social.youtube) {
        socialContainer.innerHTML += `
            <a href="${social.youtube}" target="_blank" class="social-link" aria-label="YouTube">
                <i class="fab fa-youtube"></i>
            </a>
        `;
    }
    if (social.twitter) {
        socialContainer.innerHTML += `
            <a href="${social.twitter}" target="_blank" class="social-link" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
            </a>
        `;
    }
    if (personal.website) {
        socialContainer.innerHTML += `
            <a href="${personal.website}" target="_blank" class="social-link" aria-label="Website">
                <i class="fas fa-globe"></i>
            </a>
        `;
    }
}

// ===================================
// About Section
// ===================================
function populateAboutSection() {
    const { personal, achievements, interests } = profileData;

    document.getElementById('aboutBio').textContent = personal.bio;
    document.getElementById('aboutLocation').textContent = personal.location;
    document.getElementById('aboutTitle').textContent = personal.title;

    // Achievements
    const achievementsContainer = document.getElementById('aboutAchievements');
    achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement-card fade-in">
            <div class="achievement-icon">${achievement.icon}</div>
            <h4 class="achievement-title">${achievement.title}</h4>
            <p class="achievement-desc">${achievement.description}</p>
        </div>
    `).join('');

    // Interests
    const interestsContainer = document.getElementById('interestsCloud');
    interestsContainer.innerHTML = interests.map(interest => `
        <span class="interest-tag">${interest}</span>
    `).join('');
}

// ===================================
// Experience Section
// ===================================
function populateExperience() {
    const { experience } = profileData;

    const timelineContainer = document.getElementById('experienceTimeline');
    timelineContainer.innerHTML = experience.map(exp => `
        <div class="timeline-item fade-in">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div>
                        <h3 class="timeline-role">${exp.role}</h3>
                        <p class="timeline-company">${exp.company}</p>
                    </div>
                    <span class="timeline-period">${exp.period}</span>
                </div>
                <p class="timeline-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${exp.location}
                </p>
                <p class="timeline-description">${exp.description}</p>
                <ul class="timeline-highlights">
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
                <div class="timeline-tech">
                    ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ===================================
// Education Section
// ===================================
function populateEducation() {
    const { education } = profileData;

    const educationContainer = document.getElementById('educationGrid');
    educationContainer.innerHTML = education.map(edu => `
        <div class="education-card fade-in">
            <div class="education-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <h3 class="education-degree">${edu.degree}</h3>
            <p class="education-institution">${edu.institution}</p>
            <div class="education-meta">
                <span><i class="fas fa-calendar"></i> ${edu.period}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${edu.location}</span>
            </div>
            <p class="education-desc">${edu.description}</p>
            <ul class="education-achievements">
                ${edu.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// ===================================
// Projects Section
// ===================================
function populateProjects(filter = 'all') {
    const { projects } = profileData;

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.featured);

    const projectsContainer = document.getElementById('projectsGrid');
    projectsContainer.innerHTML = filteredProjects.map(project => `
        <div class="project-card fade-in" data-featured="${project.featured}">
            <div class="project-image">
                <i class="fas fa-code-branch"></i>
            </div>
            <div class="project-content">
                <h3 class="project-name">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                            <span>Code</span>
                        </a>
                    ` : ''}
                    ${project.demo ? `
                        <a href="${project.demo}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize scroll animations for new elements
    initScrollAnimations();
}

// ===================================
// Skills Section
// ===================================
function populateSkills() {
    const { skills } = profileData;

    const skillCategories = [
        { key: 'languages', title: 'Languages', icon: 'fa-code' },
        { key: 'ml_frameworks', title: 'ML Frameworks', icon: 'fa-brain' },
        { key: 'ai_tools', title: 'AI Tools', icon: 'fa-robot' },
        { key: 'data_tools', title: 'Data Tools', icon: 'fa-database' },
        { key: 'cloud', title: 'Cloud & DevOps', icon: 'fa-cloud' },
        { key: 'databases', title: 'Databases', icon: 'fa-server' },
    ];

    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = skillCategories.map(category => `
        <div class="skill-category fade-in">
            <div class="skill-category-header">
                <div class="skill-category-icon">
                    <i class="fas ${category.icon}"></i>
                </div>
                <h3 class="skill-category-title">${category.title}</h3>
            </div>
            <div class="skill-list">
                ${skills[category.key].map(skill => `
                    <span class="skill-item">${skill}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===================================
// Certifications Section
// ===================================
function populateCertifications() {
    const { certifications } = profileData;

    const certificationsContainer = document.getElementById('certificationsGrid');
    certificationsContainer.innerHTML = certifications.map(cert => `
        <div class="certification-card fade-in">
            <div class="certification-icon">
                <i class="fas fa-certificate"></i>
            </div>
            <div class="certification-info">
                <h4 class="certification-name">${cert.name}</h4>
                <p class="certification-issuer">${cert.issuer}</p>
                <p class="certification-year">${cert.year}</p>
            </div>
        </div>
    `).join('');
}

// ===================================
// Contact Section
// ===================================
function populateContact() {
    const { personal, social } = profileData;

    const contactContainer = document.getElementById('contactLinks');
    contactContainer.innerHTML = '';

    if (social.github) {
        contactContainer.innerHTML += `
            <a href="${social.github}" target="_blank" class="contact-link" aria-label="GitHub">
                <i class="fab fa-github"></i>
            </a>
        `;
    }
    if (social.linkedin) {
        contactContainer.innerHTML += `
            <a href="${social.linkedin}" target="_blank" class="contact-link" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
        `;
    }
    if (social.youtube) {
        contactContainer.innerHTML += `
            <a href="${social.youtube}" target="_blank" class="contact-link" aria-label="YouTube">
                <i class="fab fa-youtube"></i>
            </a>
        `;
    }
    if (social.twitter) {
        contactContainer.innerHTML += `
            <a href="${social.twitter}" target="_blank" class="contact-link" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
            </a>
        `;
    }

    const emailLink = document.getElementById('emailLink');
    const emailText = document.getElementById('emailText');
    emailLink.href = `mailto:${personal.email}`;
    emailText.textContent = personal.email;
}

// ===================================
// Footer
// ===================================
function populateFooter() {
    const { personal } = profileData;

    document.getElementById('footerName').textContent = personal.name;
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===================================
// Cursor Glow Effect
// ===================================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');

    if (window.innerWidth <= 768) return;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '0.5';
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Typewriter Effect
// ===================================
function initTypewriter() {
    const { personal } = profileData;
    const typewriterElement = document.getElementById('typewriter');

    const titles = [
        personal.title,
        'AI Engineer',
        'ML Enthusiast',
        'Problem Solver',
        'Data Storyteller'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = CONFIG.typewriterSpeed;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typeSpeed = CONFIG.typewriterPause;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// ===================================
// Project Filters
// ===================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            populateProjects(filter);
        });
    });
}

// ===================================
// Blog Section
// ===================================
let blogPostsData = [];

async function populateBlog() {
    const blogGrid = document.getElementById('blogGrid');

    try {
        // Load blog posts from JSON
        const response = await fetch(CONFIG.postsPath);
        if (!response.ok) throw new Error('Failed to load blog posts');
        blogPostsData = await response.json();

        // Sort by date (newest first)
        blogPostsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render blog cards
        blogGrid.innerHTML = blogPostsData.map(post => `
            <div class="blog-card fade-in" data-post-id="${post.id}">
                <div class="blog-card-header">
                    <div class="blog-card-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                </div>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <div class="blog-card-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize scroll animations
        initScrollAnimations();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogGrid.innerHTML = '<p style="color: var(--text-tertiary); text-align: center;">Blog posts coming soon...</p>';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ===================================
// Blog Modal
// ===================================
function initBlogModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.id = 'blogModal';
    modal.innerHTML = `
        <div class="blog-modal-overlay"></div>
        <div class="blog-modal-content">
            <div class="blog-modal-header">
                <div>
                    <h2 class="blog-modal-title" id="modalTitle"></h2>
                    <div class="blog-modal-meta" id="modalMeta"></div>
                </div>
                <button class="blog-modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="blog-modal-body">
                <div class="markdown-content" id="modalBody"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event listeners
    const overlay = modal.querySelector('.blog-modal-overlay');
    const closeBtn = document.getElementById('modalClose');

    overlay.addEventListener('click', closeBlogModal);
    closeBtn.addEventListener('click', closeBlogModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBlogModal();
    });

    // Blog card click handlers
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.blog-card');
        if (card) {
            const postId = parseInt(card.dataset.postId);
            openBlogPost(postId);
        }
    });
}

function openBlogPost(postId) {
    const post = blogPostsData.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('blogModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = post.title;
    modalMeta.innerHTML = `
        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
        <span><i class="fas fa-tags"></i> ${post.tags.join(', ')}</span>
    `;

    // Parse markdown to HTML
    if (typeof marked !== 'undefined') {
        modalBody.innerHTML = marked.parse(post.body);
    } else {
        modalBody.innerHTML = `<pre>${post.body}</pre>`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', loadProfileData);
