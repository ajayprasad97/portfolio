function setupProjectFilters() {
  const filterRow = document.getElementById('filter-row');
  const grid = document.getElementById('projects-grid');
  if (!filterRow || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const buttons = Array.from(filterRow.querySelectorAll('.filter-btn'));

  function setActive(button) {
    buttons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
  }

  function applyFilter(tag) {
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').filter(Boolean);
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.getAttribute('data-filter');
      setActive(button);
      applyFilter(tag);
    });
  });
}

document.addEventListener('DOMContentLoaded', setupProjectFilters);
