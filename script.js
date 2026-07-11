document.addEventListener('DOMContentLoaded', function () {
  const counts = document.querySelectorAll('.count');
  if (!counts.length) return;

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

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
      });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const setActive = () => {
      const y = window.scrollY + (window.innerHeight/3);
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const top = window.scrollY + r.top;
        const id = sec.getAttribute('id');
        const link = document.querySelector('.nav-links a[href="#'+id+'"]');
        if (!link) return;
        if (y >= top && y < top + sec.offsetHeight) link.classList.add('active'); else link.classList.remove('active');
      });
    };
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });

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
