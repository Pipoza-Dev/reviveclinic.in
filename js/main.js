/**
 * REVIVE CLINIC — CORE APPLICATION ENGINE
 * Handles navigation drawer, sticky header, theme switching (dark/light),
 * and subtle tactile click & navigation audio feedback on user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initThemeToggle();
  initInteractiveSound();
  initCleanUrls();
  initImageLightbox();
});

/**
 * Sticky Liquid Navbar Scroll Effect
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Slide-over Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    playNavSound();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Close when clicking any drawer link
  drawer.querySelectorAll('.mobile-drawer-links a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
      playNavSound();
    });
  });
}

/**
 * Theme Mode Switcher (Dark & Light Pearl)
 * Supports multiple toggle buttons across header and drawer.
 */
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-toggle-btn');
  if (!themeButtons.length) return;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('revive-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeButtons.forEach(btn => updateThemeIcon(btn, savedTheme));

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('revive-theme', newTheme);
      themeButtons.forEach(b => updateThemeIcon(b, newTheme));
      playClickSound();
    });
  });
}

function updateThemeIcon(btn, theme) {
  if (theme === 'light') {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.setAttribute('title', 'Switch to Deep Emerald Night Theme');
    btn.setAttribute('aria-label', 'Switch to Deep Emerald Night Theme');
  } else {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    btn.setAttribute('title', 'Switch to Luminous Pearl Day Theme');
    btn.setAttribute('aria-label', 'Switch to Luminous Pearl Day Theme');
  }
}

/**
 * Pure Web Audio API Interactive Sound System
 * No periodic background sounds. Only fires on user click or navigation.
 */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Tactile micro-click sound for buttons, icons and toggles
 */
function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Organic frequency drop from 740Hz to 480Hz
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.045);

    // Subtle gain envelope (soft, unobtrusive click)
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (err) {
    // Graceful fallback if audio is blocked
  }
}

/**
 * Serene transition sound for navigation and page links
 */
function playNavSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Harmonic upward transition from 528Hz to 660Hz (healing harmonic fifth)
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (err) {
    // Graceful fallback
  }
}

/**
 * Bind audio feedback to all interactive controls and links
 */
function initInteractiveSound() {
  // Click sound on buttons and icon buttons
  document.querySelectorAll('.btn, .icon-btn, .dock-btn').forEach(el => {
    el.addEventListener('click', () => {
      playClickSound();
    });
  });

  // Navigation transition sound on menu and page links
  document.querySelectorAll('.nav-links a, .mobile-drawer-links a, .footer-nav-list a, .brand-link').forEach(el => {
    el.addEventListener('click', () => {
      playNavSound();
    });
  });
}

/**
 * Clean URLs: Remove .html from URL bar and handle extensionless links seamlessly
 */
function initCleanUrls() {
  // 1. Remove .html from browser address bar if present
  if (window.location.pathname.endsWith('.html')) {
    const cleanPath = window.location.pathname.replace(/\.html$/, '');
    try {
      window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    } catch (e) {
      // Ignore security restriction if run via raw file:// protocol
    }
  }

  // 2. Client-side navigation handler for local preview (e.g. file://) where web server rewriting isn't active
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('//')) return;

    const cleanPages = ['therapies', 'dr-amarkant-gaur', 'athletes', 'clinic-tour', 'contact', 'index'];
    const parts = href.split(/[?#]/);
    const basePath = parts[0].replace(/^\.\//, '').replace(/^\//, '');

    if (cleanPages.includes(basePath)) {
      link.addEventListener('click', (e) => {
        if (window.location.protocol === 'file:') {
          e.preventDefault();
          const target = (basePath === 'index' ? 'index.html' : basePath + '.html') + (href.includes('#') ? '#' + href.split('#')[1] : '');
          window.location.href = target;
        }
      });
    }
  });
}

/**
 * Interactive Image Lightbox Pop-up Modal System
 * Displays a liquid-glass lightbox when clicking pictures of persons or any image.
 */
function initImageLightbox() {
  let modal = document.getElementById('imageLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imageLightboxModal';
    modal.className = 'image-lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image preview');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="lightbox-backdrop" title="Click to close preview"></div>
      <div class="lightbox-container">
        <button type="button" class="lightbox-close-btn" aria-label="Close image preview">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <figure class="lightbox-figure">
          <div class="lightbox-img-frame">
            <img class="lightbox-img" src="" alt="" />
          </div>
          <figcaption class="lightbox-caption"></figcaption>
        </figure>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = modal.querySelector('.lightbox-img');
  const lightboxCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close-btn');
  const backdrop = modal.querySelector('.lightbox-backdrop');

  const openLightbox = (src, alt, caption) => {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Revive Image Preview';
    if (caption && caption.trim()) {
      lightboxCaption.textContent = caption;
      lightboxCaption.style.display = 'block';
    } else {
      lightboxCaption.textContent = '';
      lightboxCaption.style.display = 'none';
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playClickSound();
  };

  const closeLightbox = () => {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playClickSound();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Selector targeting all content images, portrait photos, athletes, QR code, gallery, logos
  const targetImages = document.querySelectorAll(
    'img.zoomable-img, img.hero-doctor-img, img.doctor-portrait-img, img.athlete-photo, .gallery-main img, img.insta-qr-img, .brand-logo-img, .treatment-gallery img, .clinic-tour-gallery img, .tour-gallery img, .stat-card img'
  );

  targetImages.forEach(img => {
    img.classList.add('zoomable-img');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View full size image: ${img.alt || 'Photo'}`);

    const handleTrigger = (e) => {
      e.preventDefault();
      // Extract best caption
      let caption = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
      if (!caption || caption.length < 3) {
        const card = img.closest('.doctor-portrait-box, .athlete-card, .tour-card, .doctor-portrait-card');
        if (card) {
          const heading = card.querySelector('h3, h4, .doctor-role, .athlete-title');
          if (heading) caption = heading.textContent.trim();
        }
      }
      openLightbox(img.currentSrc || img.src, img.alt, caption);
    };

    img.addEventListener('click', handleTrigger);
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleTrigger(e);
      }
    });
  });
}
