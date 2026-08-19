/* ============================================================
   PORTFOLIO.EXE — script.js
   Diego Alonso Nizama Villar
   ============================================================ */

'use strict';

// ── Utility ─────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Navbar active link on scroll ─────────────────────────────
(function initNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function onScroll() {
    const scrollY = window.scrollY + 80;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Sticky navbar shadow on scroll ───────────────────────────
(function initNavbarShadow() {
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 0 var(--pixel-shadow), 0 6px 18px rgba(0,0,0,0.12)'
      : '0 3px 0 var(--pixel-shadow)';
  }, { passive: true });
})();

// ── Mobile hamburger menu ─────────────────────────────────────
(function initHamburger() {
  const btn = $('#hamburger-btn');
  const links = $('#nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── Win98 window buttons ─────────────────────────────────────
(function initWindowButtons() {
  $$('.win98-btn.close').forEach(btn => {
    btn.addEventListener('click', () => {
      const win = btn.closest('.win98-window');
      if (win) {
        win.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        win.style.opacity = '0';
        win.style.transform = 'scale(0.9)';
        setTimeout(() => win.remove(), 220);
      }
    });
  });

  $$('.win98-btn.minimize').forEach(btn => {
    btn.addEventListener('click', () => {
      const win = btn.closest('.win98-window');
      const body = win?.querySelector('.win98-body');
      if (body) {
        const isHidden = body.style.display === 'none';
        body.style.transition = 'opacity 0.15s ease';
        body.style.opacity = isHidden ? '1' : '0';
        setTimeout(() => {
          body.style.display = isHidden ? '' : 'none';
          body.style.opacity = '1';
        }, 150);
      }
    });
  });

  const okBtn = $('#ok-btn');
  if (okBtn) {
    okBtn.addEventListener('click', () => {
      showToast('¡Hola! 👋 Gracias por visitar mi portfolio');
    });
  }
})();

// ── Intersection Observer for fade-in animations ─────────────
(function initFadeIn() {
  const targets = $$('.project-card, .tech-item, .stat-card, .contact-item, .about-window, .section-header');
  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

// ── Tech bars animation ───────────────────────────────────────
(function initTechBars() {
  const bars = $$('.tech-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = `${width}%`;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ── Typewriter effect for hero title ─────────────────────────
(function initTypewriter() {
  const titleEl = $('#hero-title');
  if (!titleEl) return;

  const fullText = 'Ingeniero de Sistemas Computacionales';
  const cursor = titleEl.querySelector('.title-cursor');
  const textNode = document.createTextNode('');
  titleEl.innerHTML = '';
  titleEl.appendChild(cursor.cloneNode(true));
  titleEl.appendChild(textNode);

  let i = 0;
  const interval = setInterval(() => {
    if (i < fullText.length) {
      textNode.textContent += fullText[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, 55);
})();

// ── Win98 windows — make draggable ────────────────────────────
(function initDraggable() {
  $$('.win98-window').forEach(win => {
    const titlebar = win.querySelector('.win98-titlebar');
    if (!titlebar) return;

    let isDragging = false;
    let startX, startY, winX, winY;

    titlebar.style.cursor = 'move';

    titlebar.addEventListener('mousedown', e => {
      if (e.target.closest('.win98-controls')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      winX = rect.left;
      winY = rect.top;
      win.style.position = 'fixed';
      win.style.left = winX + 'px';
      win.style.top = winY + 'px';
      win.style.right = 'auto';
      win.style.bottom = 'auto';
      win.style.zIndex = '100';
      win.style.animation = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = (winX + dx) + 'px';
      win.style.top = (winY + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });
})();

// ── Contact form ──────────────────────────────────────────────
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = $('#contact-name')?.value.trim();
    const email = $('#contact-email')?.value.trim();
    const phone = $('#contact-phone')?.value.trim();
    const subject = $('#contact-subject')?.value.trim() || 'Contacto desde Portafolio';
    const message = $('#contact-message')?.value.trim();

    if (!name || !email || !phone || !message) {
      showToast('⚠ Por favor completa todos los campos requeridos (incluyendo el teléfono).', 'warn');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠ Ingresa un correo electrónico válido.', 'warn');
      return;
    }

    const btn = $('#submit-btn');
    const originalBtnHtml = btn.innerHTML;
    btn.textContent = '⏳ Enviando...';
    btn.disabled = true;

    // URL de tu Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycby0UDHH3-DWilzJ4Nonx8RaMmx92MZYqpWUwwH2vP3eHkRrsyacAx3dt0gVWyDAzbYY/exec';

    try {
      // Petición a Google Scripts enviando un JSON como texto plano para evitar bloqueos CORS
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          nombre: name,
          email: email,
          telefono: phone,
          asunto: subject,
          mensaje: message
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        form.reset();
        showToast('✓ ¡Mensaje enviado! Te responderé pronto 🚀');
      } else {
        throw new Error(result.message || 'Error desconocido');
      }
      
    } catch (error) {
      console.error('Error enviando formulario:', error);
      showToast('❌ Hubo un error al enviar el mensaje. Intenta de nuevo.', 'warn');
    } finally {
      btn.innerHTML = originalBtnHtml;
      btn.disabled = false;
    }
  });
})();

// ── Toast notification ─────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.style.background = type === 'warn' ? '#c8960a' : 'var(--green-dark)';
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ── Konami code easter egg ─────────────────────────────────────
(function initEasterEgg() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let pos = 0;

  document.addEventListener('keydown', e => {
    if (e.keyCode === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        triggerEasterEgg();
      }
    } else {
      pos = 0;
    }
  });

  function triggerEasterEgg() {
    showToast('🎮 ¡KONAMI CODE! +30 vidas de desarrollador activadas');
    document.body.style.transition = 'filter 0.5s';
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 2000);
  }
})();

// ── Pixel cursor trail ─────────────────────────────────────────
(function initCursorTrail() {
  const colors = ['#2d5a27', '#c8960a', '#4caf50', '#e74c3c'];
  let lastTime = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTime < 50) return;
    lastTime = now;

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX - 3}px;
      top: ${e.clientY - 3}px;
      width: 6px;
      height: 6px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events: none;
      z-index: 9998;
      image-rendering: pixelated;
      opacity: 1;
      transition: opacity 0.5s ease;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
    });
    setTimeout(() => dot.remove(), 520);
  });
})();

// ── Current year in footer ─────────────────────────────────────
(function setYear() {
  const footerText = $('.footer-text strong')?.closest('.footer-text');
  if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2024', new Date().getFullYear());
  }
})();
