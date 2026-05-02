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

  /* ══════════════════════════════════════════════════════
     PDF VIEWER — Documents Page
  ══════════════════════════════════════════════════════ */

  const pdfPanel     = document.getElementById('pdf-viewer-panel');
  const pdfBody      = document.getElementById('pdf-viewer-body');
  const pdfTitle     = document.getElementById('pdf-viewer-title');
  const pdfCloseBtn  = document.getElementById('pdf-close-btn');
  const pdfOpenNew   = document.getElementById('pdf-open-new');
  const pdfDownload  = document.getElementById('pdf-download');

  let activePdfUrl   = null;
  let activeDocCard  = null;

  function openPdfViewer(card) {
    const docId    = card.dataset.docId;
    const title    = card.dataset.docTitle || 'Document';
    const isPending = card.dataset.docPending === 'true';

    // Deactivate previous
    if (activeDocCard) activeDocCard.classList.remove('doc-card-active');
    activeDocCard = card;
    card.classList.add('doc-card-active');

    // Move panel right after this card's parent grid, then show
    const grid = card.closest('.doc-grid') || card.parentElement;
    grid.after(pdfPanel);

    pdfTitle.textContent = title;
    pdfPanel.classList.remove('visible');
    pdfBody.innerHTML = '';

    // Check if we have a real file stored for this doc
    const stored = getStoredDocs().find(d => d.id === docId);
    activePdfUrl  = stored ? stored.dataUrl : null;

    if (isPending || (!stored)) {
      // Show placeholder
      const adminLink = `<span style="color:var(--cyan);cursor:pointer;text-decoration:underline;" onclick="window.location.hash='admin'; document.querySelector('[data-page=admin]').click();">Upload Dashboard</span>`;
      pdfBody.innerHTML = `
        <div class="pdf-placeholder">
          <div class="pdf-placeholder-icon">📄</div>
          <h3>${isPending ? 'Document Not Yet Available' : 'No PDF Linked Yet'}</h3>
          <p>${isPending
            ? 'This document is pending submission and will be available soon.'
            : `No PDF file has been uploaded for "<strong>${title}</strong>" yet.`}
          </p>
          ${!isPending ? `<div class="upload-hint" onclick="(function(){document.querySelectorAll('[data-page=admin]')[0].click();})()">📂 Go to Upload Dashboard to add this PDF</div>` : ''}
        </div>`;
      pdfOpenNew.style.display  = 'none';
      pdfDownload.style.display = 'none';
    } else {
      // Render actual PDF in iframe
      pdfBody.innerHTML = `<iframe src="${activePdfUrl}" title="${title}"></iframe>`;
      pdfOpenNew.style.display  = '';
      pdfDownload.style.display = '';
    }

    // Reveal with animation
    setTimeout(() => pdfPanel.classList.add('visible'), 10);

    // Smooth scroll to viewer
    setTimeout(() => pdfPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closePdfViewer() {
    pdfPanel.classList.remove('visible');
    if (activeDocCard) { activeDocCard.classList.remove('doc-card-active'); activeDocCard = null; }
    activePdfUrl = null;
    setTimeout(() => { pdfBody.innerHTML = ''; }, 380);
  }

  pdfCloseBtn?.addEventListener('click', closePdfViewer);

  pdfOpenNew?.addEventListener('click', () => {
    if (activePdfUrl) window.open(activePdfUrl, '_blank');
  });

  pdfDownload?.addEventListener('click', () => {
    if (!activePdfUrl) return;
    const a = document.createElement('a');
    a.href = activePdfUrl;
    a.download = (pdfTitle.textContent || 'document') + '.pdf';
    a.click();
  });

  // Attach click listeners to all static doc cards
  function attachDocCardListeners() {
    document.querySelectorAll('.doc-card[data-doc-id]').forEach(card => {
      // Avoid double-attaching
      if (card.dataset.listenerAttached) return;
      card.dataset.listenerAttached = 'true';
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('doc-view-btn')) {
          openPdfViewer(card);
          return;
        }
        // Toggle: clicking same card closes it
        if (card.classList.contains('doc-card-active')) {
          closePdfViewer();
        } else {
          openPdfViewer(card);
        }
      });
    });
  }
  attachDocCardListeners();

  /* ── Document search ─────────────────────────────────── */
  const docSearchInput = document.getElementById('doc-search-input');
  docSearchInput?.addEventListener('input', () => {
    const q = docSearchInput.value.toLowerCase().trim();
    document.querySelectorAll('.doc-card[data-doc-id]').forEach(card => {
      const title    = (card.dataset.docTitle || '').toLowerCase();
      const meta     = (card.dataset.docMeta  || '').toLowerCase();
      const category = (card.dataset.docCategory || '').toLowerCase();
      const match    = !q || title.includes(q) || meta.includes(q) || category.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });

  /* ══════════════════════════════════════════════════════
     ADMIN / UPLOAD DASHBOARD
  ══════════════════════════════════════════════════════ */

  const LS_KEY = 'harp_uploaded_docs';

  function getStoredDocs() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }
  function saveStoredDocs(docs) {
    localStorage.setItem(LS_KEY, JSON.stringify(docs));
  }

  /* ── Toast helper ─────────────────────────────────── */
  function showToast(msg, icon = '✅', duration = 3000) {
    const toast   = document.getElementById('app-toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIco = document.getElementById('toast-icon');
    if (!toast) return;
    toastMsg.textContent = msg;
    toastIco.textContent = icon;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ── Admin stats update ───────────────────────────── */
  function refreshAdminStats() {
    const docs = getStoredDocs();
    const statTotal      = document.getElementById('stat-total');
    const statAvailable  = document.getElementById('stat-available');
    const statCategories = document.getElementById('stat-categories');
    const statSize       = document.getElementById('stat-size');
    if (!statTotal) return;
    statTotal.textContent      = docs.length;
    statAvailable.textContent  = docs.filter(d => d.status === 'ready').length;
    statCategories.textContent = new Set(docs.map(d => d.category)).size;
    const totalBytes = docs.reduce((s, d) => s + (d.size || 0), 0);
    statSize.textContent = totalBytes > 1048576
      ? (totalBytes / 1048576).toFixed(1) + ' MB'
      : (totalBytes / 1024).toFixed(0) + ' KB';
  }

  /* ── Render dash doc list ─────────────────────────── */
  function renderDashDocList(filter = 'all') {
    const container = document.getElementById('dash-doc-items');
    if (!container) return;
    const docs = getStoredDocs();
    const filtered = filter === 'all' ? docs : docs.filter(d => d.category === filter);
    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:48px 0; color:var(--muted);">
        <div style="font-size:3rem; margin-bottom:12px;">📭</div>
        <p>No documents${filter !== 'all' ? ' in this category' : ' uploaded yet'}.<br/>
        ${filter === 'all' ? 'Use the form to add your first document.' : ''}</p></div>`;
      return;
    }
    const catLabels = { group:'Group', paper:'Paper', report:'Report', presentation:'Slides', other:'Other' };
    container.innerHTML = filtered.map(doc => `
      <div class="dash-doc-item" data-doc-id="${doc.id}">
        <div class="dash-doc-file-icon">📄</div>
        <div class="dash-doc-info">
          <div class="dash-doc-name">${doc.title}</div>
          <div class="dash-doc-size">${doc.author || 'No author'} · ${formatSize(doc.size)}</div>
          ${doc.status === 'ready' ? '<div class="upload-progress-bar"><div class="upload-progress-fill" style="width:100%"></div></div>' : ''}
        </div>
        <div class="dash-doc-category">${catLabels[doc.category] || doc.category}</div>
        <div class="dash-doc-actions">
          <button class="dash-action-btn" title="View" data-action="view" data-id="${doc.id}">👁</button>
          <button class="dash-action-btn del-btn" title="Delete" data-action="delete" data-id="${doc.id}">🗑</button>
        </div>
      </div>`).join('');

    // Attach action listeners
    container.querySelectorAll('.dash-action-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id     = btn.dataset.id;
        if (action === 'delete') {
          const docs = getStoredDocs().filter(d => d.id !== id);
          saveStoredDocs(docs);
          renderDashDocList(getCurrentFilter());
          refreshAdminStats();
          renderUploadedDocsOnPublicPage();
          showToast('Document deleted', '🗑');
        } else if (action === 'view') {
          const doc = getStoredDocs().find(d => d.id === id);
          if (doc) window.open(doc.dataUrl, '_blank');
        }
      });
    });
  }

  function formatSize(bytes) {
    if (!bytes) return '—';
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  }

  function getCurrentFilter() {
    return document.querySelector('.dash-filter-btn.active')?.dataset.filter || 'all';
  }

  /* ── Category filter tabs ─────────────────────────── */
  document.getElementById('dash-filter-tabs')?.querySelectorAll('.dash-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dash-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDashDocList(btn.dataset.filter);
    });
  });

  /* ── Drop zone ───────────────────────────────────── */
  const dropZone  = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  if (dropZone) {
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault(); dropZone.classList.remove('drag-over');
      handleFiles(Array.from(e.dataTransfer.files));
    });
    fileInput?.addEventListener('change', () => handleFiles(Array.from(fileInput.files)));
  }

  let pendingFiles = [];

  function handleFiles(files) {
    pendingFiles = files.filter(f =>
      f.name.match(/\.(pdf|pptx|ppt|docx|doc)$/i)
    );
    if (pendingFiles.length === 0) { showToast('No supported files selected', '⚠️'); return; }

    // Pre-fill title if single file
    if (pendingFiles.length === 1) {
      const titleInput = document.getElementById('upload-title');
      if (titleInput && !titleInput.value) {
        titleInput.value = pendingFiles[0].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      }
    }

    // Show queue
    const queue = document.getElementById('upload-queue');
    if (queue) {
      queue.innerHTML = pendingFiles.map(f => `
        <div class="dash-doc-item" style="margin-bottom:8px;">
          <div class="dash-doc-file-icon">📄</div>
          <div class="dash-doc-info">
            <div class="dash-doc-name">${f.name}</div>
            <div class="dash-doc-size">${formatSize(f.size)}</div>
          </div>
          <div class="dash-doc-category">Queued</div>
        </div>`).join('');
    }
    showToast(`${pendingFiles.length} file(s) ready to upload`, '📂');
  }

  /* ── Upload submit ───────────────────────────────── */
  document.getElementById('upload-submit-btn')?.addEventListener('click', () => {
    const title    = document.getElementById('upload-title')?.value.trim();
    const author   = document.getElementById('upload-author')?.value.trim();
    const category = document.getElementById('upload-category')?.value || 'other';
    const status   = document.getElementById('upload-status')?.value  || 'ready';

    if (!title) { showToast('Please enter a document title', '⚠️'); return; }
    if (pendingFiles.length === 0) { showToast('Please select at least one file', '⚠️'); return; }

    const file = pendingFiles[0]; // process first file
    const reader = new FileReader();
    reader.onload = (e) => {
      const doc = {
        id       : 'upload_' + Date.now(),
        title,
        author,
        category,
        status,
        size     : file.size,
        fileName : file.name,
        dataUrl  : e.target.result,
        uploadedAt: new Date().toISOString()
      };
      const docs = getStoredDocs();
      docs.unshift(doc);
      saveStoredDocs(docs);
      renderDashDocList(getCurrentFilter());
      refreshAdminStats();
      renderUploadedDocsOnPublicPage();

      // Clear form
      clearUploadForm();
      showToast(`"${title}" uploaded successfully!`, '✅');
    };
    reader.readAsDataURL(file);
  });

  function clearUploadForm() {
    const titleInput  = document.getElementById('upload-title');
    const authorInput = document.getElementById('upload-author');
    if (titleInput)  titleInput.value  = '';
    if (authorInput) authorInput.value = '';
    if (fileInput)   fileInput.value   = '';
    pendingFiles = [];
    const queue = document.getElementById('upload-queue');
    if (queue) queue.innerHTML = '';
  }

  document.getElementById('upload-clear-btn')?.addEventListener('click', clearUploadForm);

  document.getElementById('clear-all-docs-btn')?.addEventListener('click', () => {
    if (!confirm('Delete ALL uploaded documents? This cannot be undone.')) return;
    saveStoredDocs([]);
    renderDashDocList();
    refreshAdminStats();
    renderUploadedDocsOnPublicPage();
    showToast('All documents cleared', '🗑');
  });

  /* ── Sync uploaded docs → public Documents page ───── */
  function renderUploadedDocsOnPublicPage() {
    const section = document.getElementById('doc-section-uploaded');
    const grid    = document.getElementById('doc-uploaded-grid');
    if (!section || !grid) return;
    const docs = getStoredDocs();
    if (docs.length === 0) { section.style.display = 'none'; grid.innerHTML = ''; return; }
    section.style.display = '';
    grid.innerHTML = docs.map(doc => `
      <div class="doc-card" data-doc-id="${doc.id}" data-doc-title="${escHtml(doc.title)}"
           data-doc-meta="${escHtml(doc.author || '')}" data-doc-category="${doc.category}">
        <div class="doc-icon pdf">📄</div>
        <div>
          <div class="doc-title">${escHtml(doc.title)}</div>
          <div class="doc-meta">${escHtml(doc.author || 'Team')} · ${formatSize(doc.size)}</div>
          <span class="doc-status ${doc.status}">${doc.status === 'ready' ? 'Available' : 'Pending'}</span>
          <div><button class="doc-view-btn" tabindex="-1">👁 View PDF</button></div>
        </div>
      </div>`).join('');
    // Re-attach listeners for dynamically added cards
    attachDocCardListeners();
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Init ────────────────────────────────────────── */
  renderDashDocList();
  refreshAdminStats();
  renderUploadedDocsOnPublicPage();
});
