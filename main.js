/* ──────────────────────────────────────────
   Michael Winters Resume — Interactive JS
────────────────────────────────────────── */

// ── Navbar: scroll class & mobile hamburger ──────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


// ── Timeline accordion ────────────────────────────────────────────────────────
document.querySelectorAll('.timeline-item').forEach(item => {
  const header = item.querySelector('.timeline-header');

  function toggle() {
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.timeline-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.timeline-header').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle this one
    item.classList.toggle('open', !isOpen);
    header.setAttribute('aria-expanded', String(!isOpen));

    // Smooth scroll into view if opening
    if (!isOpen) {
      setTimeout(() => {
        const rect = item.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 90;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }, 60);
    }
  }

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

// Open the first timeline item by default after a short delay
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const first = document.querySelector('.timeline-item');
    if (first) {
      first.classList.add('open');
      first.querySelector('.timeline-header').setAttribute('aria-expanded', 'true');
    }
  }, 600);
});


// ── Scroll-in fade animations ─────────────────────────────────────────────────
const fadeTargets = [
  '.stat-card',
  '.timeline-item',
  '.skill-group',
  '.edu-card',
  '.community-card',
  '.pet-card',
  '.summary-text',
  '.section-heading',
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(fadeTargets.join(', ')).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});


// ── Active nav link highlighting on scroll ────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchorLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--gold-light)' : '';
        });
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(s => sectionObserver.observe(s));


// ── Keyboard shortcut: press "E" to expand/collapse all timeline items ────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'e' || e.key === 'E') {
    const allOpen = document.querySelectorAll('.timeline-item.open').length ===
                    document.querySelectorAll('.timeline-item').length;
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.classList.toggle('open', !allOpen);
      item.querySelector('.timeline-header').setAttribute('aria-expanded', String(!allOpen));
    });
  }
});


// ── Scroll progress bar ───────────────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


// ── Animated stat counters ────────────────────────────────────────────────────
function animateCounter(el) {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// ── Easter egg ────────────────────────────────────────────────────────────────
document.getElementById('ai-easter-egg').addEventListener('click', function () {
  this.textContent = 'Yes. That\'s the point.';
  this.style.color = 'rgba(255,255,255,.55)';
  this.style.cursor = 'default';
  this.removeEventListener('click', arguments.callee);
});
