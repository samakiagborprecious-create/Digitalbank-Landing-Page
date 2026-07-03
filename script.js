document.addEventListener('DOMContentLoaded', () => {

  
  const header = document.getElementById('siteHeader');

  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

 
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const primaryNav = document.getElementById('primaryNav');
  const navBackdrop = document.getElementById('navBackdrop');

  const openNav = () => {
    primaryNav.classList.add('is-open');
    navBackdrop.classList.add('is-visible');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock background scroll
  };

  const closeNav = () => {
    primaryNav.classList.remove('is-open');
    navBackdrop.classList.remove('is-visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = primaryNav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  navBackdrop.addEventListener('click', closeNav);

  // Close the menu whenever a nav link is tapped (mobile UX)
  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      closeNav();
      hamburgerBtn.focus();
    }
  });

  // If the viewport is resized past the mobile breakpoint, reset menu state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeNav();
  });

  const revealTargets = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------
     4. FAQ ACCORDION — single-open accordion with animated height
  --------------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close every other panel first (accordion behaviour)
      accordionItems.forEach(other => {
        if (other !== item) {
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      // Toggle the clicked one
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
    });
  });

  
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => statObserver.observe(el));
  } else {
    statNumbers.forEach(animateCount);
  }


  const balanceEl = document.getElementById('balanceFigure');

  if (balanceEl) {
    const targetBalance = 8420.55;
    const duration = 1600;
    const start = performance.now();

    const formatCurrency = (num) =>
      `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      balanceEl.textContent = formatCurrency(targetBalance * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
		  
        setInterval(() => {
          const drift = targetBalance + (Math.random() * 6 - 3);
          balanceEl.textContent = formatCurrency(drift);
        }, 4000);
      }
    };
    requestAnimationFrame(tick);
  }

  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  const heroForm = document.getElementById('heroForm');

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('heroEmail');
    const isValid = emailInput.checkValidity();

    if (!isValid) {
      emailInput.reportValidity();
      return;
    }

    const originalPlaceholder = emailInput.placeholder;
    emailInput.value = '';
    emailInput.placeholder = 'Check your inbox to confirm ✓';
    setTimeout(() => { emailInput.placeholder = originalPlaceholder; }, 3500);
  });
  
  document.getElementById('year').textContent = new Date().getFullYear();

});