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

// Resume multi-format download (PDF, TXT, HTML) — single source: Braison_Swilling_Resume.md
(function () {
  var RESUME_MD_URL = '../Braison_Swilling_Resume.md';
  var FILENAME = 'Braison_Swilling_Resume';
  var statusEl = document.getElementById('resume-dl-status');

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function getResumeMd() {
    function tryFetch(url) {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('not found');
        return r.text();
      });
    }
    return tryFetch(RESUME_MD_URL).catch(function () {
      return tryFetch('Braison_Swilling_Resume.md');
    });
  }

  document.querySelectorAll('.resume-dl').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var format = this.getAttribute('data-format');
      if (!format) return;

      setStatus('Loading…');

      getResumeMd()
        .then(function (md) {
          if (format === 'txt') {
            var blob = new Blob([md], { type: 'text/plain;charset=utf-8' });
            downloadBlob(blob, FILENAME + '.txt');
            setStatus('Downloaded TXT.');
          } else if (format === 'html') {
            var html = (typeof marked !== 'undefined' ? marked.parse(md) : md.replace(/\n/g, '<br>'));
            var doc = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + FILENAME + '</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.5;} h1{font-size:1.5rem;} h2{margin-top:1.5rem;border-bottom:1px solid #ccc;} h3{margin-top:1rem;} ul{padding-left:1.25rem;} hr{border:none;border-top:1px solid #ddd;margin:1rem 0;}</style></head><body>' + html + '</body></html>';
            var blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
            downloadBlob(blob, FILENAME + '.html');
            setStatus('Downloaded HTML.');
          } else if (format === 'pdf' && typeof html2pdf !== 'undefined') {
            var html = (typeof marked !== 'undefined' ? marked.parse(md) : md.replace(/\n/g, '<br>'));
            var wrap = document.createElement('div');
            wrap.className = 'resume-pdf-container';
            wrap.innerHTML = html;
            document.body.appendChild(wrap);
            setStatus('Creating PDF…');
            html2pdf().from(wrap).set({
              margin: 10,
              filename: FILENAME + '.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save().then(function () {
              document.body.removeChild(wrap);
              setStatus('Downloaded PDF.');
            }).catch(function () {
              document.body.removeChild(wrap);
              setStatus('PDF failed. Try TXT or MD.');
            });
          } else {
            setStatus('PDF library not loaded. Try TXT or MD.');
          }
        })
        .catch(function () {
          setStatus('Could not load resume. Use MD link or ensure the file is available.');
        });
    });
  });
})();
