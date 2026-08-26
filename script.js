document.addEventListener('DOMContentLoaded', function () {
  const counts = document.querySelectorAll('.count');
  if (counts.length) {
    const animateCount = (el) => {
      const target = Number(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = Math.min(1500, 80 * target + 400); // dynamic duration
      const start = performance.now();
      const from = 0;

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.floor(progress * (target - from) + from);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    // use IntersectionObserver to animate when visible
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // mark parent stat visible for CSS entrance
          const parentStat = el.closest('.stat');
          if (parentStat) parentStat.classList.add('visible');
          animateCount(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counts.forEach(c => {
      c.textContent = '0';
      io.observe(c);
    });
  }

  const cardDots = document.querySelectorAll('.hero-card, .info-card, .project-card, .contact-card, .experience-card, .highlight-card, .stat');
  cardDots.forEach(card => {
    if (card.querySelector('.card-live-dot')) return;
    const dot = document.createElement('span');
    dot.className = 'card-live-dot';
    dot.setAttribute('aria-hidden', 'true');
    card.appendChild(dot);
  });

  // Mobile nav toggle & auto-close on link click
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close mobile menu automatically when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Theme Toggle Functionality
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  if (sections.length) {
    const setActive = () => {
      const y = window.scrollY + (window.innerHeight / 3);
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const top = window.scrollY + r.top;
        const id = sec.getAttribute('id');
        const link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (y >= top && y < top + sec.offsetHeight) link.classList.add('active'); else link.classList.remove('active');
      });
    };
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
  }

  const interactiveCards = document.querySelectorAll('.hero-card, .info-card, .project-card, .contact-card, .experience-card, .highlight-card, .stat, .badge');
  if (interactiveCards.length) {
    const moveCards = (clientX, clientY) => {
      interactiveCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const dx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const intensity = Math.max(0, 1 - Math.min(distance, 1.4));
        card.style.setProperty('--cursor-x', (dx * 6 * intensity).toFixed(2));
        card.style.setProperty('--cursor-y', (dy * 6 * intensity).toFixed(2));
      });
    };

    document.addEventListener('mousemove', (event) => {
      moveCards(event.clientX, event.clientY);
    });

    document.addEventListener('mouseleave', () => {
      interactiveCards.forEach(card => {
        card.style.setProperty('--cursor-x', '0');
        card.style.setProperty('--cursor-y', '0');
      });
    });
  }
});