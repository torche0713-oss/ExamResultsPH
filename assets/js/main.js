document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile Nav Toggle ───
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

  // ─── Current year in footer ───
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) { el.innerHTML = '<span style="font-weight:600">Released</span>'; return; }
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

  // ─── Tab System ───
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
      });
    });
  });

  // ─── Live Search / Filter (results & search pages) ───
  function initLiveSearch(inputSelector, itemSelector, getText) {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    const items = document.querySelectorAll(itemSelector);

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      items.forEach(item => {
        const text = getText(item).toLowerCase();
        const match = !q || text.includes(q);
        item.style.display = match ? '' : 'none';
        if (match && q) {
          const prev = item.querySelector('.hl');
          if (prev) {
            const parent = prev.parentNode;
            parent.replaceChild(document.createTextNode(prev.textContent), prev);
            parent.normalize();
          }
        }
      });
      // Show empty state
      const visible = [...items].filter(i => i.style.display !== 'none');
      const empty = document.getElementById('search-empty');
      if (empty) {
        empty.style.display = visible.length === 0 ? 'block' : 'none';
      }
    });
  }

  initLiveSearch('#live-search', '.result-card', el => el.textContent);
  initLiveSearch('#table-search', '.searchable-row', el => el.textContent);

  // ─── Select filter ───
  document.querySelectorAll('.filter-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const col = sel.dataset.col;
      const val = sel.value.toLowerCase();
      const rows = document.querySelectorAll('.searchable-row');
      rows.forEach(row => {
        const cell = row.querySelector(`td:nth-child(${col})`);
        if (cell) {
          const match = !val || cell.textContent.toLowerCase().includes(val);
          row.style.display = match ? '' : 'none';
        }
      });
    });
  });

  // ─── Animate stat counters ───
  function animateCounters() {
    document.querySelectorAll('.stat-value[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
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

  // ─── Smooth scroll for anchor links ───
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
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = orig, 2000);
        });
        return;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });

  // ─── Set alert button (placeholder) ───
  document.querySelectorAll('.set-alert').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Alert feature coming soon! You will be notified when this exam result is released.');
    });
  });

  // ─── Download CSV (placeholder) ───
  document.querySelectorAll('.download-csv').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('CSV download will be available soon for researchers and schools.');
    });
  });

  console.log('ExamSite loaded ✓');
});
