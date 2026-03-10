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