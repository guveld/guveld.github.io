/* ==============================
   PORTFOLIO SCRIPT
   Particle canvas, scroll FX, nav
   ============================== */

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 60;
  const COLORS = ['#6c63ff', '#a78bfa', '#38bdf8'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(1, 2.5),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.2, 0.8),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
  }

  function drawLine(p1, p2, dist) {
    const alpha = (1 - dist / 140) * 0.15;
    ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 140) drawLine(p, q, d);
      }
    });

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  tick();
})();

/* ── NAV SCROLL EFFECT ── */
(function initNav() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── HAMBURGER MENU ── */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const items = document.querySelectorAll(
    '.skill-card, .project-card, .timeline-item, .edu-card, .interest-card, .about-grid, .section-title, .stat-row'
  );

  items.forEach(el => el.classList.add('sr'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ── STAGGERED SKILL CARDS ── */
(function staggerCards() {
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
})();

/* ── ACTIVE NAV LINK HIGHLIGHTING ── */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.style.color = l.getAttribute('href') === `#${id}` ? '#e8eaf0' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();

/* ── CURSOR GLOW (desktop only) ── */
(function cursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── SMOOTH COUNTER ANIMATION ── */
(function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const end = parseFloat(raw);
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      if (isNaN(end)) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * end);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();
