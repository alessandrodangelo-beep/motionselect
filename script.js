/* MotionSelect — script.js final MVP */
(function () {
  'use strict';

  const nav = document.getElementById('navWrap');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const hero = document.getElementById('hero');
  const yr = document.getElementById('yr');

  if (yr) yr.textContent = new Date().getFullYear();

  function syncNav() {
    if (!nav) return;
    const threshold = hero ? hero.getBoundingClientRect().bottom : 0;
    nav.classList.toggle('scrolled', window.scrollY > 24 || threshold < 64);
  }
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (nav && !nav.contains(event.target)) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function showSelectorRequired() {
    const card = document.querySelector('.hero-selector');
    if (!card) return;
    let warning = card.querySelector('.hero-selector-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.className = 'hero-selector-warning';
      warning.setAttribute('role', 'alert');
      warning.textContent = 'Select at least one item before continuing.';
      const summary = card.querySelector('.hero-selector-summary');
      if (summary) card.insertBefore(warning, summary);
      else card.appendChild(warning);
    }
    card.classList.add('is-required');
    warning.classList.add('is-visible');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const firstChoice = card.querySelector('[data-ms-group]');
    if (firstChoice) setTimeout(() => firstChoice.focus({ preventScroll: true }), 360);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      if (id === '#request' && window.MotionSelectHeroSelection && !window.MotionSelectHeroSelection.hasSelection) {
        event.preventDefault();
        showSelectorRequired();
        return;
      }

      event.preventDefault();
      const offset = (nav ? nav.offsetHeight : 0) + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }
})();
