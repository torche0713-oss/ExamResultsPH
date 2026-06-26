document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile Nav ───
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── Year ───
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Toast system ───
  function showToast(message, type) {
    type = type || 'info';
    const existing = document.querySelector('.toast-container');
    let container = existing;
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      Object.assign(container.style, {
        position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
        display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px'
      });
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    Object.assign(toast.style, {
      padding: '14px 20px', borderRadius: '10px', fontSize: '0.875rem',
      fontWeight: '500', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      transform: 'translateX(120%)', transition: 'transform 0.3s ease, opacity 0.3s ease',
      opacity: '0', cursor: 'pointer'
    });
    if (type === 'success') {
      toast.style.background = '#d1fae5'; toast.style.color = '#065f46';
      toast.style.borderLeft = '4px solid #059669';
    } else if (type === 'warning') {
      toast.style.background = '#fef3c7'; toast.style.color = '#92400e';
      toast.style.borderLeft = '4px solid #d97706';
    } else {
      toast.style.background = '#dbeafe'; toast.style.color = '#1e40af';
      toast.style.borderLeft = '4px solid #3b82f6';
    }
    toast.textContent = message;
    toast.addEventListener('click', () => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    });
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ─── Back to Top ───
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Countdown ───
  function initCountdown(targetDate, elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    const target = new Date(targetDate).getTime();
    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { el.innerHTML = '<span style="font-weight:600;color:#059669">✓ Results Released</span>'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.innerHTML = `
        <div class="countdown">
          <div class="countdown-item"><div class="countdown-num">${d}</div><div class="countdown-label">Days</div></div>
          <div class="countdown-item"><div class="countdown-num">${h}</div><div class="countdown-label">Hours</div></div>
          <div class="countdown-item"><div class="countdown-num">${m}</div><div class="countdown-label">Min</div></div>
          <div class="countdown-item"><div class="countdown-num">${s}</div><div class="countdown-label">Sec</div></div>
        </div>`;
    }
    tick();
    setInterval(tick, 1000);
  }
  initCountdown('2026-08-15T00:00:00', 'countdown-1');

  // ─── Tabs ───
  document.querySelectorAll('.tabs').forEach(tabs => {
    tabs.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const parent = tabs.closest('[data-tabs]') || tabs.parentElement;
        parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        const content = parent.querySelector(`.tab-content[data-tab-content="${target}"]`);
        if (content) content.classList.add('active');
      });
    });
  });

  // ─── FAQ Accordion ───
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question.open').forEach(q2 => q2.classList.remove('open'));
      if (!isOpen) {
        answer.classList.add('open');
        q.classList.add('open');
      }
    });
  });

  // ─── Pill Filters ───
  document.querySelectorAll('.pill-filters').forEach(group => {
    group.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const category = pill.textContent.trim();
        const cards = group.parentElement.querySelectorAll('.result-card, .card');
        cards.forEach(card => {
          if (category === 'All Exams' || category === 'All') {
            card.style.display = '';
            return;
          }
          const tag = card.querySelector('[class*="result-card-badge"]');
          const catTag = card.querySelector('[style*="border-radius:999px"]');
          const match = (tag && tag.textContent.includes(category)) ||
                        (catTag && catTag.textContent.includes(category));
          card.style.display = match ? '' : 'none';
        });
        updateEmptyState(group.parentElement);
      });
    });
  });

  function updateEmptyState(container) {
    const visible = [...container.querySelectorAll('.result-card, .card')].filter(c => c.style.display !== 'none');
    const empty = container.querySelector('#search-empty') || document.getElementById('search-empty');
    if (empty) empty.style.display = visible.length === 0 ? 'block' : 'none';
  }

  // ─── Live Search with Highlighting ───
  function initLiveSearch(inputSelector, itemSelector, getText) {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    const items = document.querySelectorAll(itemSelector);
    const container = input.closest('.container') || input.closest('section') || document.body;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      const qLower = q.toLowerCase();
      items.forEach(item => {
        const text = getText(item).toLowerCase();
        const match = !qLower || text.includes(qLower);
        item.style.display = match ? '' : 'none';

        // Highlight matches
        if (match && qLower && item.querySelectorAll('td, .result-card-name, .result-card-info').length > 0) {
          const textCells = item.querySelectorAll('td, .result-card-name, .result-card-info');
          textCells.forEach(cell => {
            if (!cell.querySelector('strong, .hl')) return;
            const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker);
            textNodes.forEach(node => {
              const parent = node.parentNode;
              if (parent && (parent.tagName === 'STRONG' || parent.classList.contains('hl'))) return;
              const idx = node.textContent.toLowerCase().indexOf(qLower);
              if (idx === -1) return;
              const span = document.createElement('span');
              span.className = 'hl';
              span.style.background = '#fef08a';
              span.style.padding = '0 2px';
              span.style.borderRadius = '2px';
              span.style.fontWeight = '600';
              const before = node.textContent.slice(0, idx);
              const matchText = node.textContent.slice(idx, idx + qLower.length);
              const after = node.textContent.slice(idx + qLower.length);
              const frag = document.createDocumentFragment();
              if (before) frag.appendChild(document.createTextNode(before));
              span.textContent = matchText;
              frag.appendChild(span);
              if (after) frag.appendChild(document.createTextNode(after));
              parent.replaceChild(frag, node);
            });
          });
        }
      });
      updateEmptyState(container);
    });
  }

  initLiveSearch('#live-search', '.result-card', el => el.textContent);
  initLiveSearch('#live-search', '.card.result-card', el => el.textContent);
  document.querySelectorAll('#table-search, .filter-bar').forEach(bar => {
    const inp = bar.querySelector('#live-search');
    if (inp) initLiveSearch('#' + inp.id, '.searchable-row', el => el.textContent);
  });

  // ─── Search page: read ?q= from URL ───
  (function initSearchFromURL() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      const input = document.querySelector('#live-search');
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event('input'));
      }
    }
  })();

  // ─── Generic filter (data-filter selects for card grids) ───
  document.querySelectorAll('.filter-select[data-filter]').forEach(sel => {
    sel.addEventListener('change', () => {
      const filterKey = sel.dataset.filter;
      const val = sel.value.toLowerCase();
      const cards = sel.closest('.container')?.querySelectorAll('.card.result-card, .card');
      if (!cards) return;
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !val || text.includes(val);
        card.style.display = match ? '' : 'none';
      });
      updateEmptyState(sel.closest('.container'));
    });
  });

  // ─── Select filters (exam page rows) ───
  document.querySelectorAll('.filter-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const col = parseInt(sel.dataset.col, 10);
      const val = sel.value.toLowerCase();
      const rows = document.querySelectorAll('.searchable-row');
      rows.forEach(row => {
        const cell = col ? row.querySelector(`td:nth-child(${col})`) : null;
        const match = !val || (cell && cell.textContent.toLowerCase().includes(val));
        row.style.display = (match && row.style.display !== 'none') ? '' : 'none';
      });
      const container = sel.closest('.container') || document.body;
      updateEmptyState(container);
    });
  });

  // ─── Combined filter (multiple selects) ───
  function filterTableRows() {
    const selects = document.querySelectorAll('.filter-select[data-col]');
    const rows = document.querySelectorAll('.searchable-row');
    rows.forEach(row => {
      let show = true;
      selects.forEach(sel => {
        const col = parseInt(sel.dataset.col, 10);
        const val = sel.value.toLowerCase();
        if (!val) return;
        const cell = row.querySelector(`td:nth-child(${col})`);
        if (cell && !cell.textContent.toLowerCase().includes(val)) show = false;
      });
      row.style.display = show ? '' : 'none';
    });
    const container = selects[0]?.closest('.container') || document.body;
    updateEmptyState(container);
  }
  document.querySelectorAll('.filter-select[data-col]').forEach(sel => {
    sel.addEventListener('change', filterTableRows);
  });

  // ─── Stat Counters (animated) ───
  function animateCounters() {
    document.querySelectorAll('.stat-value[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target) || el.dataset.animated) return;
      el.dataset.animated = 'true';
      const duration = 1500;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const statRow = document.querySelector('.stat-value[data-count]');
  if (statRow) observer.observe(statRow);

  // ─── Smooth scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Share buttons ───
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';
      if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
      else if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Failed to copy link', 'warning');
        });
        return;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });

  // ─── Set Alert (localStorage-based) ───
  document.querySelectorAll('.set-alert').forEach(btn => {
    btn.addEventListener('click', () => {
      const exam = btn.dataset.exam || document.title || 'this exam';
      const alerts = JSON.parse(localStorage.getItem('examAlerts') || '[]');
      if (!alerts.includes(exam)) {
        alerts.push(exam);
        localStorage.setItem('examAlerts', JSON.stringify(alerts));
        btn.textContent = '✓ Alert Set';
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline');
        showToast(`🔔 Alert set for "${exam}". You'll be notified when results are updated.`, 'success');
      } else {
        showToast(`Alert already active for "${exam}".`, 'info');
      }
    });
    // Restore state
    const exam = btn.dataset.exam || document.title;
    const alerts = JSON.parse(localStorage.getItem('examAlerts') || '[]');
    if (alerts.includes(exam)) {
      btn.textContent = '✓ Alert Set';
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    }
  });

  // ─── Download CSV from tables ───
  document.querySelectorAll('.download-csv').forEach(btn => {
    btn.addEventListener('click', () => {
      const table = btn.closest('section, .layout-two, .container')?.querySelector('table');
      if (!table) { showToast('No table found on this page.', 'warning'); return; }
      const rows = [...table.querySelectorAll('tr')];
      const csv = rows.map(row => {
        return [...row.querySelectorAll('td, th')]
          .map(cell => '"' + cell.textContent.replace(/"/g, '""').trim() + '"')
          .join(',');
      }).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exam-results.csv';
      link.click();
      URL.revokeObjectURL(link.href);
      showToast('CSV downloaded successfully!', 'success');
    });
  });

  // ─── Email subscription ───
  document.querySelectorAll('input[type="email"]').forEach(input => {
    const form = input.closest('form') || input.parentElement;
    const btn = form.querySelector('button, .btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast('Please enter a valid email address.', 'warning');
          return;
        }
        const subs = JSON.parse(localStorage.getItem('emailSubs') || '[]');
        if (!subs.includes(email)) {
          subs.push(email);
          localStorage.setItem('emailSubs', JSON.stringify(subs));
          showToast(`✅ Subscribed! We'll notify you at ${email}.`, 'success');
          input.value = '';
        } else {
          showToast('This email is already subscribed.', 'info');
        }
      });
    }
  });

  // ─── Oath-taking checklist ───
  document.querySelectorAll('.sidebar-panel input[type="checkbox"]').forEach(cb => {
    const key = 'checklist-' + cb.parentElement.textContent.trim().slice(0, 30).replace(/\s+/g, '-').toLowerCase();
    if (localStorage.getItem(key) === 'true') cb.checked = true;
    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked);
      const all = cb.closest('.sidebar-panel')?.querySelectorAll('input[type="checkbox"]');
      if (all) {
        const done = [...all].filter(c => c.checked).length;
        if (done === all.length) showToast('🎉 All tasks complete! Ready for your PRC license!', 'success');
      }
    });
  });

  // ─── Pill filter category cards on results hub ───
  document.querySelectorAll('.pill-filters .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.textContent.trim();
      const cards = pill.closest('.container')?.querySelectorAll('.feature-card');
      if (!cards) return;
      cards.forEach(card => {
        if (cat === 'All Exams' || cat === 'All') { card.style.display = ''; return; }
        const title = card.querySelector('h3')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        card.style.display = (title + desc).includes(cat) ? '' : 'none';
      });
    });
  });

  console.log('ExamSite — all functions enabled ✓');
});
