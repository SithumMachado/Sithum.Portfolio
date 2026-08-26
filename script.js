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

  // Back to Top Button Functionality
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    // Smooth scroll back to top on click
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 1. Scroll-Driven Section Reveal Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(sec => {
    sec.classList.add('reveal-section');
    revealObserver.observe(sec);
  });

  // 2. Subtle 3D Mouse Parallax Tilt for Cards & Hero Badge
  const tiltElements = document.querySelectorAll('.hero-card, .bento-card, .film-card, .skill-box');
  
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate smooth tilt rotation values
      const rotateX = (-y / 15).toFixed(2);
      const rotateY = (x / 15).toFixed(2);
      
      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0px) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // Cinematic Typewriter Effect for Hero Heading
  const heroTitle = document.querySelector('.hero-intro h1');
  if (heroTitle) {
    // Keep your original text or target elements safely
    const originalHTML = heroTitle.innerHTML;
    // You can customize this to type out dynamically or parse text nodes
    const textToType = "Undergraduate CS Student, Developer, and Filmmaker.";
    
    // Optional: Only trigger if you want a clean text swap
    // Let's create a subtle glowing cursor animation injection instead:
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'terminal-cursor';
    heroTitle.appendChild(cursorSpan);
  }

  // Click Ripple Animation Effect
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Magnetic Physics for Primary Buttons
  const magneticBtns = document.querySelectorAll('.btn-primary');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button slightly toward the mouse
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Kinetic Velocity Text Warping
  let lastMouseX = 0;
  let lastMouseY = 0;
  let speedMultiplier = 0;

  window.addEventListener('mousemove', (e) => {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    speedMultiplier = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.05;
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    const mainTitle = document.querySelector('.hero-intro h1');
    if (mainTitle) {
      // Skew text dynamically based on physical mouse velocity
      const skewAngle = Math.max(-15, Math.min(15, deltaX * 0.15));
      mainTitle.style.transform = `skewX(${skewAngle}deg) scale(${1 + Math.min(speedMultiplier * 0.02, 0.1)})`;
      
      // Snap back smoothly when mouse stops
      clearTimeout(mainTitle.timer);
      mainTitle.timer = setTimeout(() => {
        mainTitle.style.transform = 'skewX(0deg) scale(1)';
      }, 150);
    }
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