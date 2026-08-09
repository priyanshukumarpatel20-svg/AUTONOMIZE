/* ============================================================
   Autonomize dashboard — behaviour
   Sections: theme · navigation · card tilt · reveal · charts
             · heatmap · accordion · photo upload
   ============================================================ */

(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- brand logo: falls back to a lettermark if assets/logo.png is absent ---- */
  var brandMark = $('#brandMark');
  brandMark.addEventListener('error', function () {
    brandMark.hidden = true;
    $('.brand').classList.add('no-logo');
  });

  /* ==========================================================
     Seed data — illustrative figures for the static demo
     ========================================================== */

  var DATA = {
    score: 93,
    rings: [
      { pct: 72, label: 'Independent', color: 'var(--green)' },
      { pct: 28, label: 'AI-assisted', color: 'var(--amber)' },
      { pct: 29, label: 'On track',    color: 'var(--amber)' }
    ],
    week: [
      { d: 'M', v: 46, c: 'var(--green)' }, { d: 'T', v: 88, c: 'var(--amber)' },
      { d: 'W', v: 30, c: 'var(--green)' }, { d: 'T', v: 0,  c: 'var(--green)' },
      { d: 'F', v: 0,  c: 'var(--green)' }, { d: 'S', v: 0,  c: 'var(--green)' },
      { d: 'S', v: 0,  c: 'var(--green)' }
    ],
    chart: [
      { day: 'Jul 23', wrote: 310, pasted: 150 }, { day: 'Jul 24', wrote: 300, pasted: 110 },
      { day: 'Jul 25', wrote: 340, pasted: 170 }, { day: 'Jul 26', wrote: 350, pasted: 130 },
      { day: 'Jul 27', wrote: 360, pasted: 70  }, { day: 'Jul 28', wrote: 380, pasted: 160 },
      { day: 'Jul 29', wrote: 390, pasted: 140 }, { day: 'Jul 30', wrote: 890, pasted: 120 },
      { day: 'Jul 31', wrote: 430, pasted: 130 }, { day: 'Aug 1',  wrote: 900, pasted: 190 },
      { day: 'Aug 2',  wrote: 480, pasted: 55  }, { day: 'Aug 3',  wrote: 740, pasted: 150 },
      { day: 'Aug 4',  wrote: 500, pasted: 330 }, { day: 'Aug 5',  wrote: 500, pasted: 110 }
    ],
    sessions: [
      { site: 'docs.google.com', cat: 'Writing',     ago: '3d ago', mins: 22, score: 93,  tone: 'muted' },
      { site: 'docs.google.com', cat: 'Assessment',  ago: '4d ago', mins: 9,  score: 0,   tone: 'risk'  },
      { site: 'chatgpt.com',     cat: 'AI assistant',ago: '4d ago', mins: 27, score: null,tone: 'amber' },
      { site: 'docs.google.com', cat: 'Writing',     ago: '4d ago', mins: 22, score: 93,  tone: 'muted' },
      { site: 'github.com',      cat: 'Writing',     ago: '5d ago', mins: 17, score: 100, tone: 'muted' },
      { site: 'docs.google.com', cat: 'Writing',     ago: '6d ago', mins: 33, score: 86,  tone: 'muted' },
      { site: 'chatgpt.com',     cat: 'AI assistant',ago: '6d ago', mins: 12, score: null,tone: 'amber' }
    ],
    graded: [
      { site: 'docs.google.com', when: '2026-08-04', detail: '3 AI-linked pastes, 5 tab switches', score: 0 },
      { site: 'forms.gle',       when: '2026-08-01', detail: '1 AI-linked paste, 2 tab switches',  score: 42 }
    ]
  };

  /* ==========================================================
     Theme
     ========================================================== */

  var root = document.documentElement;
  var themeBtn = $('#themeToggle');

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeBtn.setAttribute('aria-label',
      next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  /* ==========================================================
     Navigation
     ========================================================== */

  var navToggle = $('#navToggle');
  var nav = $('#primaryNav');

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  $$('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      $$('.nav-link').forEach(function (l) {
        l.classList.remove('is-active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var topbar = $('.topbar');
  window.addEventListener('scroll', function () {
    topbar.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });

  $('#navAvatar').addEventListener('click', function () {
    $('#profileCard').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
  });

  /* ==========================================================
     Card tilt — cursor-tracked 3D, capped so it stays subtle
     ========================================================== */

  var MAX_TILT = 5;

  if (!REDUCED && window.matchMedia('(hover: hover)').matches) {
    $$('.card-tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width  - 0.5;
        var py = (e.clientY - r.top)  / r.height - 0.5;
        card.style.setProperty('--ry', (px *  MAX_TILT).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (py * -MAX_TILT).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ==========================================================
     Reveal on scroll
     ========================================================== */

  if (!REDUCED && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i, 3) * 60);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.06 });

    $$('.card').forEach(function (card) {
      card.classList.add('reveal');
      io.observe(card);
    });
  }

  /* ==========================================================
     Greeting
     ========================================================== */

  var h = new Date().getHours();
  $('#greeting').textContent =
    h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  /* ==========================================================
     Independence gauge
     ========================================================== */

  var GAUGE_R = 90, GAUGE_LEN = Math.PI * GAUGE_R;

  (function gauge() {
    var svg  = $('#gaugeSvg');
    var fill = $('#gaugeFill');
    var knob = $('#gaugeKnob');

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML =
      '<linearGradient id="gaugeGrad" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="210" y2="0">' +
        '<stop offset="0%" stop-color="#D69A3B"/>' +
        '<stop offset="55%" stop-color="#8FAE55"/>' +
        '<stop offset="100%" stop-color="#4C9A6A"/>' +
      '</linearGradient>';
    svg.insertBefore(defs, svg.firstChild);

    fill.style.strokeDasharray = GAUGE_LEN;
    fill.style.strokeDashoffset = GAUGE_LEN;

    var v = DATA.score;
    var theta = Math.PI * (1 - v / 100);
    svg.setAttribute('aria-label', 'Independence score ' + v + ' out of 100');

    requestAnimationFrame(function () {
      fill.style.strokeDashoffset = GAUGE_LEN * (1 - v / 100);
      knob.setAttribute('cx', (120 + GAUGE_R * Math.cos(theta)).toFixed(1));
      knob.setAttribute('cy', (140 - GAUGE_R * Math.sin(theta)).toFixed(1));
    });

    countTo($('#scoreValue'), v, 1200);
  })();

  function countTo(el, target, ms) {
    if (REDUCED) { el.textContent = target; return; }
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / ms, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ==========================================================
     Hero rings
     ========================================================== */

  (function rings() {
    var C = 2 * Math.PI * 24;
    $('#ringRow').innerHTML = DATA.rings.map(function (r) {
      return '<li class="ring-item">' +
        '<svg viewBox="0 0 58 58" role="img" aria-label="' + r.pct + ' per cent ' + r.label + '">' +
          '<circle class="ring-bg" cx="29" cy="29" r="24"/>' +
          '<circle class="ring-fg" cx="29" cy="29" r="24" stroke="' + r.color + '" ' +
            'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" ' +
            'transform="rotate(-90 29 29)"/>' +
          '<text class="ring-pct" x="29" y="33" text-anchor="middle" ' +
            'style="color:' + r.color + '">' + r.pct + '%</text>' +
        '</svg>' +
        '<span class="ring-label">' + r.label + '</span>' +
      '</li>';
    }).join('');

    requestAnimationFrame(function () {
      $$('#ringRow .ring-fg').forEach(function (c, i) {
        c.style.strokeDashoffset = C * (1 - DATA.rings[i].pct / 100);
      });
    });
  })();

  /* ==========================================================
     Weekly bars
     ========================================================== */

  (function weekBars() {
    $('#weekBars').innerHTML = DATA.week.map(function (d) {
      return '<li class="week-bar" title="' + d.d + ' — ' + d.v + '% of your busiest day">' +
               '<span style="height:0;background:' + d.c + '"></span>' +
             '</li>';
    }).join('');

    requestAnimationFrame(function () {
      $$('#weekBars span').forEach(function (s, i) {
        s.style.height = DATA.week[i].v + '%';
      });
    });
  })();

  /* ==========================================================
     Composition chart
     ========================================================== */

  (function chart() {
    var peak = DATA.chart.reduce(function (m, d) {
      return Math.max(m, d.wrote + d.pasted);
    }, 0);

    $('#chart').innerHTML = DATA.chart.map(function (d) {
      var total = d.wrote + d.pasted;
      return '<div class="chart-col" title="' + d.day + '">' +
        '<span class="chart-tip">' + d.day + ' · ' + d.wrote + ' written / ' + d.pasted + ' pasted</span>' +
        '<div class="bar-pasted" style="height:0" data-h="' + (d.pasted / peak * 100) + '"></div>' +
        '<div class="bar-wrote"  style="height:0" data-h="' + (d.wrote  / peak * 100) + '"></div>' +
      '</div>';
    }).join('');

    var axis = document.createElement('p');
    axis.className = 'chart-axis';
    axis.innerHTML = '<span>' + DATA.chart[0].day + '</span>' +
                     '<span>' + DATA.chart[DATA.chart.length - 1].day + '</span>';
    $('#chart').insertAdjacentElement('afterend', axis);

    requestAnimationFrame(function () {
      $$('#chart [data-h]').forEach(function (bar) {
        bar.style.height = bar.getAttribute('data-h') + '%';
      });
    });
  })();

  /* ==========================================================
     Session list
     ========================================================== */

  (function sessions() {
    var dotColor = { risk: 'var(--risk)', amber: 'var(--amber)', muted: 'var(--muted)' };

    $('#sessionList').innerHTML = DATA.sessions.map(function (s) {
      var score = s.score === null
        ? '<span class="session-score" style="color:var(--muted)">—</span>'
        : '<span class="session-score">' + s.score + '</span>';
      return '<li class="session-item">' +
        '<span class="session-dot" style="background:' + dotColor[s.tone] + '"></span>' +
        '<span class="session-body">' +
          '<span class="session-site">' + s.site + '</span>' +
          '<span class="session-meta">' + s.cat + ' · ' + s.ago + '</span>' +
        '</span>' +
        '<span class="session-time">' + s.mins + 'm</span>' +
        score +
      '</li>';
    }).join('');
  })();

  /* ==========================================================
     Graded sessions (dark panel)
     ========================================================== */

  (function graded() {
    $('#gradedList').innerHTML = DATA.graded.map(function (g) {
      return '<li class="graded-item">' +
        '<svg class="graded-flag" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M5 21V4"/><path d="M5 5h11l-2 3 2 3H5"/></svg>' +
        '<span class="graded-body">' +
          '<span class="graded-site">' + g.site + '</span>' +
          '<span class="graded-meta">' + g.when + ' · <em>' + g.detail + '</em></span>' +
        '</span>' +
        '<span class="graded-score">' + g.score + '</span>' +
      '</li>';
    }).join('');
  })();

  /* ==========================================================
     Activity heatmap — 20 weeks, deterministic seed
     ========================================================== */

  (function heatmap() {
    var seed = 20260805;
    function rand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    var WEEKS = 20, html = '';
    for (var w = 0; w < WEEKS; w++) {
      html += '<div class="heat-week">';
      for (var d = 0; d < 7; d++) {
        var r = rand();
        var level = r < 0.34 ? 0 : r < 0.56 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4;
        var flagged = (w === 19 && d === 3);
        html += '<span class="heat-cell l' + level + (flagged ? ' is-flagged' : '') + '" ' +
                'title="' + (level === 0 ? 'No activity' : level * 25 + ' minutes tracked') +
                (flagged ? ' · flagged graded session' : '') + '"></span>';
      }
      html += '</div>';
    }
    $('#heatmap').innerHTML = html;
  })();

  /* ==========================================================
     Accordion
     ========================================================== */

  $$('.acc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.parentElement;
      var open = item.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* ==========================================================
     Profile photo upload — click, keyboard and drag-and-drop.
     FileReader only; the image never leaves this browser.
     ========================================================== */

  (function uploader() {
    var MAX_BYTES = 2 * 1024 * 1024;
    var TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    var drop     = $('#dropzone');
    var input    = $('#fileInput');
    var preview  = $('#previewImg');
    var empty    = $('#uploaderEmpty');
    var errorBox = $('#uploadError');
    var changeBtn = $('#changeBtn');
    var removeBtn = $('#removeBtn');
    var navAvatar = $('#navAvatar');
    var navInitials = $('#navInitials');

    function fail(message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
    }

    function clearError() {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }

    function show(src) {
      preview.src = src;
      preview.hidden = false;
      empty.hidden = true;
      drop.classList.add('has-image');
      removeBtn.hidden = false;
      changeBtn.textContent = 'Change photo';

      navInitials.hidden = true;
      var img = navAvatar.querySelector('img') || new Image();
      img.src = src;
      img.alt = '';
      if (!img.parentNode) navAvatar.appendChild(img);
    }

    function reset() {
      if (preview.src.indexOf('blob:') === 0) URL.revokeObjectURL(preview.src);
      preview.removeAttribute('src');
      preview.hidden = true;
      empty.hidden = false;
      drop.classList.remove('has-image');
      removeBtn.hidden = true;
      changeBtn.textContent = 'Add photo';
      clearError();

      var img = navAvatar.querySelector('img');
      if (img) img.remove();
      navInitials.hidden = false;
    }

    function load(file) {
      if (!file) return;
      if (TYPES.indexOf(file.type) === -1) return fail('Choose a JPG, PNG or WebP image.');
      if (file.size > MAX_BYTES)          return fail('That image is over 2 MB. Pick a smaller one.');

      clearError();
      var reader = new FileReader();
      reader.onload = function (e) { show(e.target.result); };
      reader.onerror = function () { fail('That file could not be read. Try another image.'); };
      reader.readAsDataURL(file);
    }

    drop.addEventListener('click', function () { input.click(); });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });

    changeBtn.addEventListener('click', function (e) { e.stopPropagation(); input.click(); });
    removeBtn.addEventListener('click', function (e) { e.stopPropagation(); reset(); });

    input.addEventListener('change', function () {
      load(input.files[0]);
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (name) {
      drop.addEventListener(name, function (e) {
        e.preventDefault();
        drop.classList.add('is-over');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (name) {
      drop.addEventListener(name, function (e) {
        e.preventDefault();
        drop.classList.remove('is-over');
      });
    });

    drop.addEventListener('drop', function (e) {
      load(e.dataTransfer.files[0]);
    });
  })();

})();
