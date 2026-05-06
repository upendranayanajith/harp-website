/* ============================================================
   HARP Website — main.js
   ============================================================ */

/* ── Supabase client ─────────────────────────────────────── */
const SUPABASE_URL = 'https://vamclbbpzbsedmfsekjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbWNsYmJwemJzZWRtZnNla2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTI0MDEsImV4cCI6MjA5MzYyODQwMX0.7a95kWAQ4EJzXEVmXzOq7OQN_qFTM4WxOBgtRkNwFi4';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {

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
    if (id === 'admin') {
      const pwd = prompt("Enter Admin Password:");
      if (pwd !== "admin123") {
        alert("Incorrect password. Access denied.");
        return;
      }
    }

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
  if (document.getElementById(`page-${hash}`)) {
    if (hash === 'admin') {
      const pwd = prompt("Enter admin password:");
      if (pwd === "admin123") {
        showPage('admin');
      } else {
        alert("Incorrect password. Access denied.");
        showPage('home');
      }
    } else {
      showPage(hash);
    }
  } else {
    showPage('home');
  }

  /* ── Contact form (EmailJS) ─────────────────────────── */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contact-name')?.value    || '';
    const email   = document.getElementById('contact-email')?.value   || '';
    const subject = document.getElementById('contact-subject')?.value || 'Contact via HARP';
    const body    = document.getElementById('contact-body')?.value    || '';

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    emailjs.send('service_cw76hux', 'template_8bbc2om', {
      name:    name,
      email:   email,
      subject: subject,
      message: body,
    })
    .then(() => {
      btn.textContent = 'Message Sent!';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 3000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      btn.textContent = 'Failed — Try Again';
      btn.disabled = false;
    });
  });

  /* ── Year in footer ──────────────────────────────────── */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  /* ── About Us headshot upload support ─────────────────── */
  const headshotInput = document.getElementById('headshot-file-input');
  let activeHeadshotMember = null;

  function updateAvatarNote(card, hasImage) {
    const note = card.querySelector('.member-avatar-note');
    if (!note) return;
    note.textContent = hasImage ? 'Headshot added — use the button below to change it.' : 'Headshot placeholder — replace with a photo later.';
  }

  function renderMemberAvatar(card, dataUrl) {
    const avatar = card.querySelector('.member-avatar');
    const name = card.querySelector('.member-name')?.textContent.trim() || 'Team member';
    if (!avatar) return;
    avatar.classList.remove('member-placeholder');
    avatar.innerHTML = `<img src="${dataUrl}" alt="Headshot of ${name}">`;
    const img = avatar.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        avatar.classList.add('member-placeholder');
        avatar.innerHTML = `<div class="placeholder-text">${card.dataset.memberId || ''}</div>`;
        updateAvatarNote(card, false);
      });
    }
    updateAvatarNote(card, true);
  }

  function loadSavedHeadshots() {
    document.querySelectorAll('.member-card[data-member-id]').forEach(card => {
      const id = card.dataset.memberId;
      const stored = id ? localStorage.getItem(`harp-headshot-${id}`) : null;
      if (stored) renderMemberAvatar(card, stored);
    });
  }

  document.querySelectorAll('.upload-headshot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeHeadshotMember = btn.dataset.member;
      if (!activeHeadshotMember) return;
      if (headshotInput) {
        headshotInput.value = '';
        headshotInput.click();
      }
    });
  });

  headshotInput?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeHeadshotMember) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') return;
      const card = document.querySelector(`.member-card[data-member-id="${activeHeadshotMember}"]`);
      if (!card) return;
      renderMemberAvatar(card, dataUrl);
      localStorage.setItem(`harp-headshot-${activeHeadshotMember}`, dataUrl);
    };
    reader.readAsDataURL(file);
  });

  loadSavedHeadshots();

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

  async function openPdfViewer(card) {
    const docId    = card.dataset.docId;
    const title    = card.dataset.docTitle || 'Document';
    const isPending = card.dataset.docPending === 'true';

    if (activeDocCard) activeDocCard.classList.remove('doc-card-active');
    activeDocCard = card;
    card.classList.add('doc-card-active');

    const grid = card.closest('.doc-grid') || card.parentElement;
    grid.after(pdfPanel);

    pdfTitle.textContent = title;
    pdfPanel.classList.remove('visible');
    pdfBody.innerHTML = '';

    const stored = cachedDocs.find(d => d.id === docId);
    activePdfUrl  = stored ? stored.publicUrl : null;

    if (isPending || (!stored)) {
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
      pdfBody.innerHTML = `<iframe src="${activePdfUrl}" title="${title}"></iframe>`;
      pdfOpenNew.style.display  = '';
      pdfDownload.style.display = '';
    }

    setTimeout(() => pdfPanel.classList.add('visible'), 10);
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

  function attachDocCardListeners() {
    document.querySelectorAll('.doc-card[data-doc-id]').forEach(card => {
      if (card.dataset.listenerAttached) return;
      card.dataset.listenerAttached = 'true';
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('doc-view-btn')) {
          openPdfViewer(card);
          return;
        }
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
     ADMIN / UPLOAD DASHBOARD — Supabase-backed
  ══════════════════════════════════════════════════════ */

  // In-memory caches populated from Supabase
  let cachedDocs   = [];
  let cachedSlides = [];

  function docPublicUrl(filePath) {
    return sb.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
  }
  function slidePublicUrl(filePath) {
    return sb.storage.from('slides').getPublicUrl(filePath).data.publicUrl;
  }

  async function loadDocs() {
    const { data, error } = await sb.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (error) { console.error('loadDocs:', error); return; }
    cachedDocs = (data || []).map(r => ({
      ...r,
      size    : r.file_size,
      fileName: r.file_name,
      publicUrl: docPublicUrl(r.file_path)
    }));
  }

  async function loadSlides() {
    const { data, error } = await sb.from('slides').select('*').order('uploaded_at', { ascending: false });
    if (error) { console.error('loadSlides:', error); return; }
    cachedSlides = (data || []).map(r => ({
      ...r,
      size    : r.file_size,
      fileName: r.file_name,
      publicUrl: slidePublicUrl(r.file_path)
    }));
  }

  /* ── Toast helper ─────────────────────────────────── */
  function showToast(msg, icon = '✅', duration = 3000) {
    const toast    = document.getElementById('app-toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIco = document.getElementById('toast-icon');
    if (!toast) return;
    toastMsg.textContent = msg;
    toastIco.textContent = icon;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  function formatSize(bytes) {
    if (!bytes) return '—';
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Admin stats ──────────────────────────────────── */
  function refreshAdminStats() {
    const all = [...cachedDocs, ...cachedSlides];
    const statTotal     = document.getElementById('stat-total');
    const statSlides    = document.getElementById('stat-slides');
    const statAvailable = document.getElementById('stat-available');
    const statSize      = document.getElementById('stat-size');
    if (!statTotal) return;
    statTotal.textContent     = cachedDocs.length;
    if (statSlides) statSlides.textContent = cachedSlides.length;
    statAvailable.textContent = all.filter(d => d.status === 'ready').length;
    const totalBytes = all.reduce((s, d) => s + (d.file_size || 0), 0);
    statSize.textContent = totalBytes > 1048576
      ? (totalBytes / 1048576).toFixed(1) + ' MB'
      : (totalBytes / 1024).toFixed(0) + ' KB';
  }

  /* ── Render dash doc list ─────────────────────────── */
  function getCurrentFilter() {
    return document.querySelector('.dash-filter-btn.active')?.dataset.filter || 'all';
  }

  function renderDashDocList(filter = 'all') {
    const container = document.getElementById('dash-doc-items');
    if (!container) return;
    const filtered = filter === 'all' ? cachedDocs : cachedDocs.filter(d => d.category === filter);
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
          <div class="dash-doc-name">${escHtml(doc.title)}</div>
          <div class="dash-doc-size">${escHtml(doc.author || 'No author')} · ${formatSize(doc.file_size)}</div>
          ${doc.status === 'ready' ? '<div class="upload-progress-bar"><div class="upload-progress-fill" style="width:100%"></div></div>' : ''}
        </div>
        <div class="dash-doc-category">${catLabels[doc.category] || doc.category}</div>
        <div class="dash-doc-actions">
          <button class="dash-action-btn" title="View"   data-action="view"   data-id="${doc.id}">👁</button>
          <button class="dash-action-btn del-btn" title="Delete" data-action="delete" data-id="${doc.id}">🗑</button>
        </div>
      </div>`).join('');

    container.querySelectorAll('.dash-action-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id     = btn.dataset.id;
        if (action === 'delete') {
          const doc = cachedDocs.find(d => d.id === id);
          if (doc?.file_path) await sb.storage.from('documents').remove([doc.file_path]);
          await sb.from('documents').delete().eq('id', id);
          await loadDocs();
          renderDashDocList(getCurrentFilter());
          refreshAdminStats();
          renderUploadedDocsOnPublicPage();
          showToast('Document deleted', '🗑');
        } else if (action === 'view') {
          const doc = cachedDocs.find(d => d.id === id);
          if (doc?.publicUrl) window.open(doc.publicUrl, '_blank');
        }
      });
    });
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
    // Click anywhere on drop zone (except the hidden input itself) to browse
    dropZone.addEventListener('click', (e) => {
      if (e.target !== fileInput) fileInput?.click();
    });
    fileInput?.addEventListener('change', () => handleFiles(Array.from(fileInput.files)));
  }

  let pendingFiles = [];

  function handleFiles(files) {
    pendingFiles = files.filter(f => f.name.match(/\.(pdf|pptx|ppt|docx|doc)$/i));
    if (pendingFiles.length === 0) { showToast('No supported files selected', '⚠️'); return; }

    if (pendingFiles.length === 1) {
      const titleInput = document.getElementById('upload-title');
      if (titleInput && !titleInput.value) {
        titleInput.value = pendingFiles[0].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      }
    }

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
  document.getElementById('upload-submit-btn')?.addEventListener('click', async () => {
    const title    = document.getElementById('upload-title')?.value.trim();
    const author   = document.getElementById('upload-author')?.value.trim();
    const category = document.getElementById('upload-category')?.value || 'other';
    const status   = document.getElementById('upload-status')?.value  || 'ready';

    if (!title)                  { showToast('Please enter a document title', '⚠️'); return; }
    if (pendingFiles.length === 0) { showToast('Please select at least one file', '⚠️'); return; }

    const file     = pendingFiles[0];
    const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const submitBtn = document.getElementById('upload-submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Uploading…'; }

    const { error: storageErr } = await sb.storage.from('documents').upload(filePath, file, { cacheControl: '3600' });
    if (storageErr) {
      showToast('Upload failed: ' + storageErr.message, '❌');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Document'; }
      return;
    }

    const { error: dbErr } = await sb.from('documents').insert({
      title, author, category, status,
      file_name : file.name,
      file_path : filePath,
      file_size : file.size
    });
    if (dbErr) {
      showToast('DB error: ' + dbErr.message, '❌');
      await sb.storage.from('documents').remove([filePath]);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Document'; }
      return;
    }

    await loadDocs();
    renderDashDocList(getCurrentFilter());
    refreshAdminStats();
    renderUploadedDocsOnPublicPage();
    clearUploadForm();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Document'; }
    showToast(`"${title}" uploaded successfully!`, '✅');
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

  document.getElementById('clear-all-docs-btn')?.addEventListener('click', async () => {
    if (!confirm('Delete ALL uploaded documents? This cannot be undone.')) return;
    const paths = cachedDocs.map(d => d.file_path).filter(Boolean);
    if (paths.length > 0) await sb.storage.from('documents').remove(paths);
    const ids = cachedDocs.map(d => d.id);
    if (ids.length > 0) await sb.from('documents').delete().in('id', ids);
    await loadDocs();
    renderDashDocList();
    refreshAdminStats();
    renderUploadedDocsOnPublicPage();
    showToast('All documents cleared', '🗑');
  });

  /* ── Sync uploaded docs → public Documents page ───── */
  async function renderUploadedDocsOnPublicPage() {
    const section = document.getElementById('doc-section-uploaded');
    const grid    = document.getElementById('doc-uploaded-grid');
    if (!section || !grid) return;
    if (cachedDocs.length === 0) { section.style.display = 'none'; grid.innerHTML = ''; return; }
    section.style.display = '';
    grid.innerHTML = cachedDocs.map(doc => `
      <div class="doc-card" data-doc-id="${doc.id}" data-doc-title="${escHtml(doc.title)}"
           data-doc-meta="${escHtml(doc.author || '')}" data-doc-category="${doc.category}">
        <div class="doc-icon pdf">📄</div>
        <div>
          <div class="doc-title">${escHtml(doc.title)}</div>
          <div class="doc-meta">${escHtml(doc.author || 'Team')} · ${formatSize(doc.file_size)}</div>
          <span class="doc-status ${doc.status}">${doc.status === 'ready' ? 'Available' : 'Pending'}</span>
          <div><button class="doc-view-btn" tabindex="-1">👁 View PDF</button></div>
        </div>
      </div>`).join('');
    attachDocCardListeners();
  }

  /* ══════════════════════════════════════════════════════
     SLIDES VIEWER — Presentations Page
  ══════════════════════════════════════════════════════ */

  const slidePanel      = document.getElementById('slide-viewer-panel');
  const slideBody       = document.getElementById('slide-viewer-body');
  const slideTitleEl    = document.getElementById('slide-viewer-title');
  const slideCloseBtn   = document.getElementById('slide-close-btn');
  const slideOpenNew    = document.getElementById('slide-open-new');
  const slideDownloadBtn= document.getElementById('slide-download');

  let activeSlideUrl    = null;
  let activeSlideCard   = null;

  async function openSlideViewer(card) {
    const slideId   = card.dataset.slideId;
    const title     = card.dataset.slideTitle || 'Presentation';
    const isPending = card.dataset.slidePending === 'true';

    if (activeSlideCard) activeSlideCard.classList.remove('doc-card-active');
    activeSlideCard = card;
    card.classList.add('doc-card-active');

    const grid = card.closest('.doc-grid') || card.parentElement;
    grid.after(slidePanel);

    slideTitleEl.textContent = title;
    slidePanel.classList.remove('visible');
    slideBody.innerHTML = '';

    const stored = cachedSlides.find(s => s.id === slideId);
    activeSlideUrl = stored ? stored.publicUrl : null;

    if (isPending || !stored) {
      slideBody.innerHTML = `
        <div class="pdf-placeholder">
          <div class="pdf-placeholder-icon">📊</div>
          <h3>${isPending ? 'Slides Not Yet Available' : 'No Slides Linked Yet'}</h3>
          <p>${isPending
            ? 'These slides are pending submission and will be available soon.'
            : `No file has been uploaded for "<strong>${title}</strong>" yet.`}
          </p>
          ${!isPending ? `<div class="upload-hint" onclick="(function(){document.querySelectorAll('[data-page=admin]')[0].click(); setTimeout(()=>{document.querySelector('[data-admin-tab=slides]')?.click();},200)})()">📊 Go to Upload Dashboard → Slides tab</div>` : ''}
        </div>`;
      slideOpenNew.style.display    = 'none';
      slideDownloadBtn.style.display = 'none';
    } else {
      slideBody.innerHTML = `<iframe src="${activeSlideUrl}" title="${title}"></iframe>`;
      slideOpenNew.style.display    = '';
      slideDownloadBtn.style.display = '';
    }

    setTimeout(() => slidePanel.classList.add('visible'), 10);
    setTimeout(() => slidePanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function closeSlideViewer() {
    slidePanel?.classList.remove('visible');
    if (activeSlideCard) { activeSlideCard.classList.remove('doc-card-active'); activeSlideCard = null; }
    activeSlideUrl = null;
    setTimeout(() => { if (slideBody) slideBody.innerHTML = ''; }, 380);
  }

  slideCloseBtn?.addEventListener('click', closeSlideViewer);
  slideOpenNew?.addEventListener('click', () => { if (activeSlideUrl) window.open(activeSlideUrl, '_blank'); });
  slideDownloadBtn?.addEventListener('click', () => {
    if (!activeSlideUrl) return;
    const a = document.createElement('a');
    a.href     = activeSlideUrl;
    a.download = (slideTitleEl?.textContent || 'presentation') + '.pdf';
    a.click();
  });

  function attachSlideCardListeners() {
    document.querySelectorAll('.doc-card[data-slide-id]').forEach(card => {
      if (card.dataset.slideListenerAttached) return;
      card.dataset.slideListenerAttached = 'true';
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('slide-view-btn') || e.target.classList.contains('doc-view-btn')) {
          openSlideViewer(card);
          return;
        }
        if (card.classList.contains('doc-card-active')) {
          closeSlideViewer();
        } else {
          openSlideViewer(card);
        }
      });
    });
  }
  attachSlideCardListeners();

  /* Slide search */
  const slideSearchInput = document.getElementById('slide-search-input');
  slideSearchInput?.addEventListener('input', () => {
    const q = slideSearchInput.value.toLowerCase().trim();
    document.querySelectorAll('.doc-card[data-slide-id]').forEach(card => {
      const title    = (card.dataset.slideTitle    || '').toLowerCase();
      const meta     = (card.dataset.slideMeta     || '').toLowerCase();
      const category = (card.dataset.slideCategory || '').toLowerCase();
      const match    = !q || title.includes(q) || meta.includes(q) || category.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });

  /* ══════════════════════════════════════════════════════
     SLIDES STORAGE + ADMIN UPLOAD — Supabase-backed
  ══════════════════════════════════════════════════════ */

  /* ── Admin tab switching ──────────────────────────── */
  document.getElementById('admin-tabs')?.querySelectorAll('[data-admin-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.adminTab;
      document.getElementById('admin-panel-documents').style.display = tab === 'documents' ? '' : 'none';
      document.getElementById('admin-panel-slides').style.display    = tab === 'slides'    ? '' : 'none';
    });
  });

  /* ── Render slides list in admin ──────────────────── */
  function getCurrentSlideFilter() {
    return document.querySelector('#slide-filter-tabs .dash-filter-btn.active')?.dataset.slideFilter || 'all';
  }

  function renderDashSlideList(filter = 'all') {
    const container = document.getElementById('dash-slide-items');
    if (!container) return;
    const filtered = filter === 'all' ? cachedSlides : cachedSlides.filter(s => s.category === filter);
    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:48px 0; color:var(--muted);">
        <div style="font-size:3rem; margin-bottom:12px;">📭</div>
        <p>No slides${filter !== 'all' ? ' in this category' : ' uploaded yet'}.</p></div>`;
      return;
    }
    const catLabels = { group:'Group', individual:'Individual', viva:'Viva', other:'Other' };
    container.innerHTML = filtered.map(s => `
      <div class="dash-doc-item" data-slide-id="${s.id}">
        <div class="dash-doc-file-icon" style="background:rgba(220,120,50,0.12);">📊</div>
        <div class="dash-doc-info">
          <div class="dash-doc-name">${escHtml(s.title)}</div>
          <div class="dash-doc-size">${escHtml(s.author || 'No author')} · ${formatSize(s.file_size)}</div>
          ${s.status === 'ready' ? '<div class="upload-progress-bar"><div class="upload-progress-fill" style="width:100%"></div></div>' : ''}
        </div>
        <div class="dash-doc-category">${catLabels[s.category] || s.category}</div>
        <div class="dash-doc-actions">
          <button class="dash-action-btn" title="View"   data-saction="view"   data-sid="${s.id}">👁</button>
          <button class="dash-action-btn del-btn" title="Delete" data-saction="delete" data-sid="${s.id}">🗑</button>
        </div>
      </div>`).join('');

    container.querySelectorAll('.dash-action-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const action = btn.dataset.saction;
        const id     = btn.dataset.sid;
        if (action === 'delete') {
          const slide = cachedSlides.find(s => s.id === id);
          if (slide?.file_path) await sb.storage.from('slides').remove([slide.file_path]);
          await sb.from('slides').delete().eq('id', id);
          await loadSlides();
          renderDashSlideList(getCurrentSlideFilter());
          refreshAdminStats();
          renderUploadedSlidesOnPublicPage();
          showToast('Slide deleted', '🗑');
        } else if (action === 'view') {
          const slide = cachedSlides.find(s => s.id === id);
          if (slide?.publicUrl) window.open(slide.publicUrl, '_blank');
        }
      });
    });
  }

  /* Category filter for slides tab */
  document.getElementById('slide-filter-tabs')?.querySelectorAll('.dash-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#slide-filter-tabs .dash-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDashSlideList(btn.dataset.slideFilter);
    });
  });

  /* ── Slide drop zone ──────────────────────────────── */
  const slideDropZone  = document.getElementById('slide-drop-zone');
  const slideFileInput = document.getElementById('slide-file-input');
  let pendingSlideFiles = [];

  if (slideDropZone) {
    slideDropZone.addEventListener('dragover', e => { e.preventDefault(); slideDropZone.classList.add('drag-over'); });
    slideDropZone.addEventListener('dragleave', () => slideDropZone.classList.remove('drag-over'));
    slideDropZone.addEventListener('drop', e => {
      e.preventDefault(); slideDropZone.classList.remove('drag-over');
      handleSlideFiles(Array.from(e.dataTransfer.files));
    });
    // Click anywhere on drop zone (except the hidden input itself) to browse
    slideDropZone.addEventListener('click', (e) => {
      if (e.target !== slideFileInput) slideFileInput?.click();
    });
    slideFileInput?.addEventListener('change', () => handleSlideFiles(Array.from(slideFileInput.files)));
  }

  function handleSlideFiles(files) {
    pendingSlideFiles = files.filter(f => f.name.match(/\.(pdf|pptx|ppt)$/i));
    if (pendingSlideFiles.length === 0) { showToast('No supported slide files selected', '⚠️'); return; }
    if (pendingSlideFiles.length === 1) {
      const titleIn = document.getElementById('slide-upload-title');
      if (titleIn && !titleIn.value)
        titleIn.value = pendingSlideFiles[0].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    }
    const queue = document.getElementById('slide-upload-queue');
    if (queue) {
      queue.innerHTML = pendingSlideFiles.map(f => `
        <div class="dash-doc-item" style="margin-bottom:8px;">
          <div class="dash-doc-file-icon" style="background:rgba(220,120,50,0.12);">📊</div>
          <div class="dash-doc-info">
            <div class="dash-doc-name">${f.name}</div>
            <div class="dash-doc-size">${formatSize(f.size)}</div>
          </div>
          <div class="dash-doc-category">Queued</div>
        </div>`).join('');
    }
    showToast(`${pendingSlideFiles.length} slide file(s) ready`, '📊');
  }

  /* ── Slide upload submit ──────────────────────────── */
  document.getElementById('slide-upload-submit-btn')?.addEventListener('click', async () => {
    const title    = document.getElementById('slide-upload-title')?.value.trim();
    const author   = document.getElementById('slide-upload-author')?.value.trim();
    const category = document.getElementById('slide-upload-category')?.value || 'other';
    const status   = document.getElementById('slide-upload-status')?.value   || 'ready';

    if (!title)                       { showToast('Please enter a presentation title', '⚠️'); return; }
    if (pendingSlideFiles.length === 0) { showToast('Please select a slide file', '⚠️'); return; }

    const file     = pendingSlideFiles[0];
    const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const submitBtn = document.getElementById('slide-upload-submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Uploading…'; }

    const { error: storageErr } = await sb.storage.from('slides').upload(filePath, file, { cacheControl: '3600' });
    if (storageErr) {
      showToast('Upload failed: ' + storageErr.message, '❌');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Slides'; }
      return;
    }

    const { error: dbErr } = await sb.from('slides').insert({
      title, author, category, status,
      file_name : file.name,
      file_path : filePath,
      file_size : file.size
    });
    if (dbErr) {
      showToast('DB error: ' + dbErr.message, '❌');
      await sb.storage.from('slides').remove([filePath]);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Slides'; }
      return;
    }

    await loadSlides();
    renderDashSlideList(getCurrentSlideFilter());
    refreshAdminStats();
    renderUploadedSlidesOnPublicPage();
    clearSlideUploadForm();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '⬆ Upload Slides'; }
    showToast(`"${title}" uploaded successfully!`, '✅');
  });

  function clearSlideUploadForm() {
    const titleIn  = document.getElementById('slide-upload-title');
    const authorIn = document.getElementById('slide-upload-author');
    if (titleIn)  titleIn.value  = '';
    if (authorIn) authorIn.value = '';
    if (slideFileInput) slideFileInput.value = '';
    pendingSlideFiles = [];
    const queue = document.getElementById('slide-upload-queue');
    if (queue) queue.innerHTML = '';
  }

  document.getElementById('slide-upload-clear-btn')?.addEventListener('click', clearSlideUploadForm);

  document.getElementById('clear-all-slides-btn')?.addEventListener('click', async () => {
    if (!confirm('Delete ALL uploaded slides? This cannot be undone.')) return;
    const paths = cachedSlides.map(s => s.file_path).filter(Boolean);
    if (paths.length > 0) await sb.storage.from('slides').remove(paths);
    const ids = cachedSlides.map(s => s.id);
    if (ids.length > 0) await sb.from('slides').delete().in('id', ids);
    await loadSlides();
    renderDashSlideList();
    refreshAdminStats();
    renderUploadedSlidesOnPublicPage();
    showToast('All slides cleared', '🗑');
  });

  /* ── Sync uploaded slides → public Presentations page */
  async function renderUploadedSlidesOnPublicPage() {
    const section = document.getElementById('slide-section-uploaded');
    const grid    = document.getElementById('slide-uploaded-grid');
    if (!section || !grid) return;
    if (cachedSlides.length === 0) { section.style.display = 'none'; grid.innerHTML = ''; return; }
    section.style.display = '';
    grid.innerHTML = cachedSlides.map(s => `
      <div class="doc-card" data-slide-id="${s.id}" data-slide-title="${escHtml(s.title)}"
           data-slide-meta="${escHtml(s.author || '')}" data-slide-category="${s.category}">
        <div class="doc-icon ppt">📊</div>
        <div>
          <div class="doc-title">${escHtml(s.title)}</div>
          <div class="doc-meta">${escHtml(s.author || 'Team')} · ${formatSize(s.file_size)}</div>
          <span class="doc-status ${s.status}">${s.status === 'ready' ? 'Available' : 'Pending'}</span>
          <div><button class="doc-view-btn slide-view-btn" tabindex="-1">🖥 View Slides</button></div>
        </div>
      </div>`).join('');
    attachSlideCardListeners();
  }

  /* ── Init: load from Supabase then render ─────────── */
  await Promise.all([loadDocs(), loadSlides()]);
  renderDashDocList();
  renderDashSlideList();
  refreshAdminStats();
  renderUploadedDocsOnPublicPage();
  renderUploadedSlidesOnPublicPage();
});
