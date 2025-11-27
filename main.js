// Smooth Scroll for navigation links
const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    if (link.hash) {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Auto-update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Load projects dynamically (if projects.json exists)
async function loadProjects() {
  try {
    const res = await fetch('../data/projects.json');
    const projects = await res.json();

    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projects.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.warn('No projects.json found or error reading it.');
  }
}

// Call loader
loadProjects();
