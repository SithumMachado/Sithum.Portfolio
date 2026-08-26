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

  // Theme Switcher Logic
const initThemeToggle = () => {
  // Check for saved user preference or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Create the toggle button element dynamically
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Toggle light/dark mode');
  toggleBtn.innerHTML = `
    <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  `;
  document.body.appendChild(toggleBtn);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toggleBtn.classList.add('visible');
    } else {
      toggleBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Handle click event to switch themes
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  });
};

// Call inside DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  // ... rest of your existing JS initialization ...
});

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