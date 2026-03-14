// Toggle mobile navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Smooth Scroll for navigation links
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
    if(navLinks.classList.contains('open')) navLinks.classList.remove('open');
  });
});

// Auto-update footer year if exists
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Fetch and render projects with animation
async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    const projects = await res.json();

    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projects.forEach((project, index) => {
      const projectUrl = project.slug ? `project.html?slug=${project.slug}` : project.link || '#';
      const card = document.createElement('div');
      card.classList.add('project-card', 'reveal');
      card.style.transitionDelay = `${index * 0.2}s`;

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.preview || project.description || ''}</p>
        <a href="${projectUrl}" class="btn">View Project</a>
      `;

      container.appendChild(card);
    });

    // Scroll reveal observer
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealElements.forEach(el => observer.observe(el));

  } catch (err) {
    console.error('Error loading projects:', err);
  }
}

// Initialize
loadProjects();
