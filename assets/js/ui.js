// Dark mode toggle
const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', function () {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('is-open')));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
}

// Reveal once as a section enters view. Without JavaScript, content stays visible.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = document.querySelectorAll('[data-reveal], .journal-story, .journal-gallery, .journal-map-section');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
  revealElements.forEach(function (element) {
    element.setAttribute('data-reveal', '');
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    }
  });
  motionPreference.addEventListener('change', function (event) {
    if (event.matches) {
      revealObserver.disconnect();
      revealElements.forEach(function (element) { element.classList.remove('reveal-pending'); });
    }
  });
}

const header = document.querySelector('.header');
if (header) {
  const updateHeader = function () { header.classList.toggle('is-scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}
document.querySelectorAll('.nav-links a').forEach(function (link) {
  if (link.pathname === window.location.pathname && !link.hash) link.setAttribute('aria-current', 'page');
});
