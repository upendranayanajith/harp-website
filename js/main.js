/* ============================================================
   HARP Website — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 40);
    backTop?.classList.toggle('visible', y > 400);
    updateActiveNav();
  }, { passive: true });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile nav toggle ───────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => navLinks?.classList.remove('open'))
  );

  /* ── Active nav highlight (scroll spy) ──────────────── */
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id][data-spy]');
    const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  /* ── Scroll reveal ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ── Animated counters ───────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimal = el.dataset.decimal === 'true';
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = prefix + (decimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterIO.observe(el));

  /* ── Progress bar animate ────────────────────────────── */
  const progressBars = document.querySelectorAll('.progress-fill[data-width]');
  const progressIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        progressIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(b => progressIO.observe(b));

  /* ── Tab system ──────────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      group.querySelector(`.tab-panel[data-panel="${target}"]`)?.classList.add('active');
    });
  });

  /* ── Accordion ───────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Page navigation (single-page app) ──────────────── */
  const pages = document.querySelectorAll('.page');
  const navPageLinks = document.querySelectorAll('[data-page]');

  function showPage(id) {
    pages.forEach(p => p.classList.toggle('page-active', p.id === `page-${id}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({}, '', `#${id}`);
    // re-run reveals for new page
    setTimeout(() => {
      const newReveals = document.querySelectorAll(`#page-${id} .reveal:not(.visible)`);
      newReveals.forEach(el => io.observe(el));
    }, 50);
    updatePageNav(id);
  }

  function updatePageNav(id) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === id);
    });
  }

  navPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.slice(1) || 'home';
  if (document.getElementById(`page-${hash}`)) showPage(hash);
  else showPage('home');

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message sent ✓';
      btn.style.background = '#22c55e';
      form.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; btn.style.background = ''; }, 3000);
    }, 1200);
  });

  /* ── Year in footer ──────────────────────────────────── */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  /* ── Accuracy bar chart animation ────────────────────── */
  function animateAccBars(container) {
    container.querySelectorAll('.acc-chart-bar[data-acc-width]').forEach(bar => {
      const w = bar.dataset.accWidth;
      setTimeout(() => { bar.style.width = w + '%'; }, 80);
    });
  }
  // Trigger when Survey tab is clicked
  document.querySelectorAll('.tab-btn[data-tab="survey"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const chart = document.querySelector('.acc-chart');
        if (chart) animateAccBars(chart.closest('.tab-panel') || chart.parentElement);
      }, 350);
    });
  });
  // Also trigger via IntersectionObserver if already visible
  const accChartCard = document.getElementById('acc-chart-card');
  if (accChartCard) {
    const accIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateAccBars(e.target); accIO.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    accIO.observe(accChartCard);
  }
});
