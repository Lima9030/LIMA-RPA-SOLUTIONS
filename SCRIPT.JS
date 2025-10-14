// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Intersection Observer to reveal elements
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Fun counters
const counters = document.querySelectorAll('.stat .num');
const step = (el) => {
  const target = +el.dataset.target;
  const val = +el.textContent;
  const inc = Math.max(1, Math.ceil(target / 60));
  if (val < target) {
    el.textContent = String(val + inc);
    requestAnimationFrame(() => step(el));
  } else {
    el.textContent = String(target);
  }
};
const obs2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      step(el);
      obs2.unobserve(el);
    }
  });
}, {threshold: 0.6});
counters.forEach(el => obs2.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
