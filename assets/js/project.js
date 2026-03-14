const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderSidebar(projects, activeSlug) {
  const list = document.getElementById('project-list');
  if (!list) return;
  list.innerHTML = '';

  projects
    .filter(p => p.slug !== activeSlug)
    .forEach(project => {
      const link = document.createElement('a');
      link.className = 'project-item';
      link.href = `project.html?slug=${project.slug}`;
      link.innerHTML = `
        <div class="project-item-title">${project.title}</div>
        <div class="project-item-preview">${project.preview || ''}</div>
      `;
      list.appendChild(link);
    });
}

function renderProject(project) {
  const cover = document.getElementById('project-cover');
  const title = document.getElementById('project-title');
  const date = document.getElementById('project-date');
  const content = document.getElementById('project-content');
  const links = document.getElementById('project-links');

  if (cover) {
    cover.src = project.cover || 'assets/img/cover-placeholder.svg';
    cover.alt = project.title;
  }
  if (title) title.textContent = project.title;
  if (date) date.textContent = formatDate(project.date);
  if (content) content.textContent = project.content || project.preview || '';

  if (links) {
    links.innerHTML = '';
    (project.links || []).forEach(item => {
      if (!item || !item.url || !item.label) return;
      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = item.label;
      links.appendChild(link);
    });
  }
}

async function loadProject() {
  try {
    const res = await fetch('data/projects.json');
    const projects = await res.json();
    const slug = getSlugFromUrl();
    const active = projects.find(p => p.slug === slug) || projects[0];

    if (active) {
      renderProject(active);
      renderSidebar(projects, active.slug);
    }
  } catch (err) {
    console.error('Error loading project:', err);
  }
}

loadProject();
