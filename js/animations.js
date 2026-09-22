/**
 * REVIVE CLINIC — ANIMATIONS & INTERACTIVE PHYSICS
 * High-performance 60fps animations, 3D tilt, and scroll-driven reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initAnimatedCounters();
  init3DCardTilt();
  initAmbientParallax();
});

/**
 * Scroll Reveal Observer
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Animated Number Counters
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter], [data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetAttr = el.getAttribute('data-counter') || el.getAttribute('data-target');
        const targetValue = parseInt(targetAttr, 10);
        const originalText = el.textContent.trim();
        const suffix = el.getAttribute('data-suffix') || (originalText.endsWith('+') ? '+' : '');
        const duration = parseInt(el.getAttribute('data-duration') || '1600', 10);
        animateCounter(el, targetValue, duration, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));
}

function animateCounter(element, target, duration, suffix = '') {
  let startTimestamp = null;
  const startValue = 0;

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Smooth easeOutQuad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeProgress * (target - startValue) + startValue);
    
    element.textContent = current + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target + suffix;
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * 3D Card Tilt & Dynamic Glare (Desktop only)
 */
function init3DCardTilt() {
  const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isTouchDevice) return;

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    // Add glare element if not present
    if (!card.querySelector('.glare-effect')) {
      const glare = document.createElement('div');
      glare.className = 'glare-effect';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt degrees
      const maxRotate = 8;
      const rotateX = ((centerY - y) / centerY) * maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update glare position
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${xPercent}%`);
      card.style.setProperty('--mouse-y', `${yPercent}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Ambient Liquid Canvas Subtle Cursor Parallax
 */
function initAmbientParallax() {
  const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isTouchDevice) return;

  const ambientBg = document.querySelector('.ambient-bg');
  if (!ambientBg) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 44; // max ±22px
    mouseY = (e.clientY / window.innerHeight - 0.5) * 44;
  }, { passive: true });

  function render() {
    currentX += (mouseX - currentX) * 0.04;
    currentY += (mouseY - currentY) * 0.04;
    ambientBg.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
