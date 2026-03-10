// Smooth scroll for anchor links (scroll-margin-top in CSS keeps section below header)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Dark / light toggle — sun icon = switch to light, moon icon = switch to dark
(function () {
  var STORAGE_KEY = 'portfolio-theme';
  var DARK = 'styles.css';
  var LIGHT = 'styles-light.css';
  var link = document.getElementById('theme-stylesheet');
  var btn = document.getElementById('theme-toggle');
  var iconSun = btn && btn.querySelector('.theme-toggle-sun');
  var iconMoon = btn && btn.querySelector('.theme-toggle-moon');

  if (!link || !btn) return;

  function isDark() { return link.href.split('/').pop().split('?')[0] === DARK; }

  function applyTheme(dark) {
    link.href = dark ? DARK : LIGHT;
    localStorage.setItem(STORAGE_KEY, dark ? DARK : LIGHT);
    if (iconSun) iconSun.hidden = !dark;   // show sun when dark (click to go light)
    if (iconMoon) iconMoon.hidden = dark;  // show moon when light (click to go dark)
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved && (saved.endsWith(DARK) || saved.endsWith(LIGHT))) {
    link.href = saved;
  }
  applyTheme(isDark());

  btn.addEventListener('click', function () {
    applyTheme(!isDark());
  });
})();

// Optional: subtle header background on scroll (dark theme only)
var header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', function () {
    var link = document.getElementById('theme-stylesheet');
    var isDark = link && link.href.split('/').pop().split('?')[0] === 'styles.css';
    if (isDark) {
      header.style.background = window.scrollY > 20 ? 'rgba(15, 18, 22, 0.95)' : 'rgba(15, 18, 22, 0.9)';
    } else {
      header.style.background = '';
    }
  }, { passive: true });
}

// --- Code rain effect in hero background ---
(function () {
  var canvas = document.getElementById('code-rain');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var chars = '01{}[]<>/;:=+-%!?#$&function()const var let if else return true false null'.split('');
  var fontSize = 14;
  var columns;
  var drops;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(15, 18, 22, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3b82f6';
    ctx.font = fontSize + 'px JetBrains Mono, monospace';

    for (var i = 0; i < drops.length; i++) {
      var char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- Typing effect on hero tagline ---
(function () {
  var el = document.getElementById('hero-tagline');
  if (!el) return;
  var text = 'IT and support \u2014 hardware, troubleshooting, scripting, and using AI to get things done';
  var i = 0;
  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 35 + Math.random() * 25);
    }
  }
  setTimeout(type, 500);
})();

// --- Scroll reveal ---
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function (el) { observer.observe(el); });
})();