// ============================================================
// Simon Lind – Webbyrå | Main Script
// ============================================================

(function () {
  'use strict';

  // ---- Navbar scroll behaviour ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Hamburger menu ----
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    const setMenuState = (isOpen) => {
      navLinks.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      navToggle.classList.toggle('is-active', isOpen);
    };

    navToggle.addEventListener('click', () => {
      setMenuState(!navLinks.classList.contains('open'));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640 && navLinks.classList.contains('open')) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenuState(false);
      }
    });
  }

  // ---- Portfolio filters ----
  const filterBtns = document.querySelectorAll('.portfolio-filter');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioCards.forEach(card => {
          const match = filter === 'alla' || card.dataset.category === filter;
          card.setAttribute('aria-hidden', match ? 'false' : 'true');
        });
      });
    });
  }

  // ---- Cookie consent ----
  const COOKIE_KEY = 'sl_cookie_consent';

  function getConsent() {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function setConsent(prefs) {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({
        ...prefs,
        timestamp: new Date().toISOString()
      }));
    } catch (_) {}
    applyConsent(prefs);
  }

  function applyConsent(prefs) {
    // Enable / disable analytics based on consent
    if (prefs && prefs.analytics) {
      // Placeholder: initialise analytics here
      // e.g. window.gtag && gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  const banner = document.getElementById('cookie-banner');
  const modal  = document.getElementById('cookie-modal');

  function showBanner() {
    if (banner) { banner.style.display = 'block'; }
  }
  function hideBanner() {
    if (banner) { banner.style.display = 'none'; }
  }

  // Show banner if no consent recorded yet
  if (!getConsent()) {
    // Small delay so page loads visually first
    setTimeout(showBanner, 900);
  } else {
    applyConsent(getConsent());
  }

  // Accept all
  const btnAccept = document.getElementById('cookieAccept');
  if (btnAccept) {
    btnAccept.addEventListener('click', () => {
      setConsent({ necessary: true, analytics: true, marketing: true });
      hideBanner();
      if (modal) modal.classList.remove('open');
    });
  }

  // Only necessary
  const btnNecessary = document.getElementById('cookieNecessary');
  if (btnNecessary) {
    btnNecessary.addEventListener('click', () => {
      setConsent({ necessary: true, analytics: false, marketing: false });
      hideBanner();
    });
  }

  // Open settings modal
  const btnSettings = document.getElementById('cookieSettings');
  if (btnSettings && modal) {
    btnSettings.addEventListener('click', () => {
      modal.classList.add('open');
      hideBanner();
    });
  }

  // Close modal
  const btnModalClose = document.getElementById('cookieModalClose');
  if (btnModalClose && modal) {
    btnModalClose.addEventListener('click', () => modal.classList.remove('open'));
  }

  // Save preferences from modal
  const btnSavePrefs = document.getElementById('cookieSavePrefs');
  if (btnSavePrefs && modal) {
    btnSavePrefs.addEventListener('click', () => {
      const analyticsToggle  = document.getElementById('toggleAnalytics');
      const marketingToggle  = document.getElementById('toggleMarketing');
      setConsent({
        necessary: true,
        analytics:  analyticsToggle  ? analyticsToggle.checked  : false,
        marketing:  marketingToggle  ? marketingToggle.checked  : false
      });
      modal.classList.remove('open');
      hideBanner();
    });
  }

  // Accept all from modal
  const btnModalAcceptAll = document.getElementById('cookieModalAcceptAll');
  if (btnModalAcceptAll && modal) {
    btnModalAcceptAll.addEventListener('click', () => {
      setConsent({ necessary: true, analytics: true, marketing: true });
      modal.classList.remove('open');
      hideBanner();
    });
  }

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const success = document.getElementById('formSuccess');
      if (btn) { btn.disabled = true; btn.textContent = 'Skickar…'; }
      // Simulate async send
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = 'Skicka meddelande'; }
        if (success) { success.style.display = 'block'; }
        contactForm.reset();
        setTimeout(() => { if (success) success.style.display = 'none'; }, 6000);
      }, 1200);
    });
  }

  // ---- Intersection Observer – fade-in sections ----
  const style = document.createElement('style');
  style.textContent = `.reveal{opacity:0;transform:translateY(32px);transition:opacity 0.65s ease,transform 0.65s ease}.reveal.visible{opacity:1;transform:translateY(0)}`;
  document.head.appendChild(style);

  const revealEls = document.querySelectorAll(
    '.service-card, .package-card, .step, .testimonial-card, .value-item, .portfolio-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Smooth active nav link highlight ----
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#navLinks a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`#navLinks a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  }

})();
