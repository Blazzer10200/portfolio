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
  var text = 'IT support, scripting, and making AI actually useful';
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

// --- Scroll reveal + staggered pills ---
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // stagger skill pills inside this section
        var pills = entry.target.querySelectorAll('.skill-pills .pill');
        pills.forEach(function (pill, i) {
          pill.style.transitionDelay = (i * 0.04) + 's';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function (el) { observer.observe(el); });
})();

// --- Subtle parallax on hero ---
(function () {
  var hero = document.querySelector('.hero');
  var canvas = document.getElementById('code-rain');
  if (!hero || !canvas) return;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var heroH = hero.offsetHeight;
    if (scrollY > heroH) return;
    canvas.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
  }, { passive: true });
})();

// --- Download Resume as PDF ---
(function () {
  var btn = document.getElementById('download-pdf');
  if (!btn) return;

  btn.addEventListener('click', function () {
    // Build a clean HTML string for the PDF instead of capturing the page
    var name = 'Braison Swilling';
    var subtitle = 'Desktop Support / IT Specialist | Pine Bluff, AR';
    var email = 'braison.swilling@outlook.com';
    var phone = '(870) 267-3299';

    // Pull text from each section
    var aboutCards = document.querySelectorAll('#about .job');
    var aboutHTML = '';
    aboutCards.forEach(function (card) {
      var h3 = card.querySelector('h3');
      var p = card.querySelector('p');
      if (h3 && p) {
        aboutHTML += '<h3 style="margin:12px 0 4px;font-size:13px;color:#1a1d21;">' + h3.textContent + '</h3>';
        aboutHTML += '<p style="margin:0 0 8px;font-size:11px;color:#333;line-height:1.5;">' + p.innerHTML + '</p>';
      }
    });

    // Skills
    var skillGroups = document.querySelectorAll('#skills .skill-group');
    var skillsHTML = '';
    skillGroups.forEach(function (group) {
      var title = group.querySelector('.skill-group-title');
      var pills = group.querySelectorAll('.pill');
      if (title && pills.length) {
        skillsHTML += '<h3 style="margin:10px 0 4px;font-size:12px;color:#1a1d21;">' + title.textContent.trim() + '</h3>';
        var items = [];
        pills.forEach(function (p) { items.push(p.textContent); });
        skillsHTML += '<p style="margin:0 0 6px;font-size:11px;color:#333;">' + items.join(' · ') + '</p>';
      }
    });

    // Experience
    var jobs = document.querySelectorAll('#experience .job');
    var expHTML = '';
    jobs.forEach(function (job) {
      var h3 = job.querySelector('h3');
      var role = job.querySelector('.job-role');
      var date = job.querySelector('.job-date');
      var p = job.querySelector('p');
      var header = '';
      if (h3) header += '<strong>' + h3.textContent + '</strong>';
      if (role) header += ' - ' + role.textContent;
      if (date) header += ' <span style="color:#666;float:right;">' + date.textContent + '</span>';
      expHTML += '<p style="margin:10px 0 2px;font-size:12px;">' + header + '</p>';
      if (p) expHTML += '<p style="margin:0 0 8px;font-size:11px;color:#333;line-height:1.5;">' + p.textContent + '</p>';
    });

    var eduNote = document.querySelector('.education-note');
    if (eduNote) {
      expHTML += '<p style="margin:10px 0 0;font-size:11px;color:#555;">' + eduNote.textContent + '</p>';
    }

    // Projects
    var projectJob = document.querySelector('#projects > .job');
    var projectSteps = document.querySelectorAll('#projects .skill-group');
    var projectsHTML = '';
    if (projectJob) {
      var ph3 = projectJob.querySelector('h3');
      var prole = projectJob.querySelector('.job-role');
      var pp = projectJob.querySelector('p');
      if (ph3) projectsHTML += '<h3 style="margin:8px 0 4px;font-size:13px;color:#1a1d21;">' + ph3.textContent + (prole ? ' <span style="color:#3b82f6;font-size:11px;">(' + prole.textContent + ')</span>' : '') + '</h3>';
      if (pp) projectsHTML += '<p style="margin:0 0 8px;font-size:11px;color:#333;line-height:1.5;">' + pp.textContent + '</p>';
    }
    projectSteps.forEach(function (step) {
      var title = step.querySelector('.skill-group-title');
      var desc = step.querySelector('.workflow-desc');
      if (title && desc) {
        projectsHTML += '<p style="margin:6px 0 2px;font-size:11px;"><strong>' + title.textContent.trim() + ':</strong> ' + desc.textContent + '</p>';
      }
    });

    // Build full PDF content
    var content = document.createElement('div');
    content.innerHTML = '' +
      '<div style="font-family:Arial,sans-serif;color:#1a1d21;padding:20px 30px;max-width:700px;margin:0 auto;">' +
        '<h1 style="margin:0 0 2px;font-size:22px;">' + name + '</h1>' +
        '<p style="margin:0 0 4px;font-size:12px;color:#555;">' + subtitle + '</p>' +
        '<p style="margin:0 0 16px;font-size:11px;color:#3b82f6;">' + email + ' | ' + phone + '</p>' +
        '<hr style="border:none;border-top:1px solid #ddd;margin:0 0 14px;">' +
        '<h2 style="font-size:14px;color:#3b82f6;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">About</h2>' +
        aboutHTML +
        '<hr style="border:none;border-top:1px solid #ddd;margin:14px 0;">' +
        '<h2 style="font-size:14px;color:#3b82f6;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Skills</h2>' +
        skillsHTML +
        '<hr style="border:none;border-top:1px solid #ddd;margin:14px 0;">' +
        '<h2 style="font-size:14px;color:#3b82f6;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Projects</h2>' +
        projectsHTML +
        '<hr style="border:none;border-top:1px solid #ddd;margin:14px 0;">' +
        '<h2 style="font-size:14px;color:#3b82f6;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Experience</h2>' +
        expHTML +
      '</div>';

    var opt = {
      margin: [10, 0, 10, 0],
      filename: 'Braison_Swilling_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  });
})();