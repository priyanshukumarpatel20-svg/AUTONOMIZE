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
     Double-click to zoom a card
     The card is scaled and translated to the centre of the
     viewport, with the scale capped so it always fits on screen.
     Everything else dims; the zoomed card keeps full brightness.
     ========================================================== */

  (function zoom() {
    var ZOOM = 1.3;
    var MARGIN = 24;
    var REST = 'Double-click to zoom';
    var SHUT = 'Double-click to close';

    var open = null;
    var frame = null;

    function place(card) {
      /* measure the card in its untransformed position */
      card.style.removeProperty('transform');
      var r  = card.getBoundingClientRect();
      var vw = document.documentElement.clientWidth;
      var vh = document.documentElement.clientHeight;

      /* never let the card grow past the viewport */
      var scale = Math.min(ZOOM, (vw - MARGIN * 2) / r.width, (vh - MARGIN * 2) / r.height);
      scale = Math.max(scale, 1);

      var dx = vw / 2 - (r.left + r.width  / 2);
      var dy = vh / 2 - (r.top  + r.height / 2);

      card.style.setProperty(
        'transform',
        'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')',
        'important'
      );
    }

    function reposition() {
      if (!open) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () { place(open); });
    }

    function close() {
      if (!open) return;
      open.style.removeProperty('transform');
      open.classList.remove('is-zoomed');
      open.querySelector('.zoom-hint').textContent = REST;
      var grid = open.closest('.grid');
      if (grid) grid.classList.remove('has-zoom');
      open = null;
      document.body.classList.remove('has-zoom');
    }

    $$('.card-tilt').forEach(function (card) {
      var hint = document.createElement('span');
      hint.className = 'zoom-hint';
      hint.textContent = REST;
      card.appendChild(hint);

      card.addEventListener('dblclick', function (e) {
        /* leave interactive controls alone */
        if (e.target.closest('button, input, a, .uploader, .seg')) return;

        if (open === card) { close(); return; }
        close();

        card.classList.add('is-zoomed');
        var grid = card.closest('.grid');
        if (grid) grid.classList.add('has-zoom');
        document.body.classList.add('has-zoom');
        hint.textContent = SHUT;
        open = card;
        place(card);
      });
    });

    /* clicking anywhere outside the zoomed card closes it */
    document.addEventListener('click', function (e) {
      if (open && !e.target.closest('.is-zoomed')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, { passive: true });
  })();

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
     Composition chart — bar view and two-line view
     ========================================================== */

  (function chart() {
    var host   = $('#chart');
    var legend = $('#chartLegend');
    var rows   = DATA.chart;
    var peak   = rows.reduce(function (m, d) { return Math.max(m, d.wrote + d.pasted); }, 0);
    var linePeak = rows.reduce(function (m, d) { return Math.max(m, d.wrote, d.pasted); }, 0);

    var axis = document.createElement('p');
    axis.className = 'chart-axis';
    axis.innerHTML = '<span>' + rows[0].day + '</span>' +
                     '<span>' + rows[rows.length - 1].day + '</span>';
    host.insertAdjacentElement('afterend', axis);

    /* ---- legend ---- */
    function drawLegend(view) {
      legend.innerHTML = view === 'bars'
        ? '<span class="legend-item"><i class="swatch swatch-green"></i>You wrote <strong>6.2k</strong></span>' +
          '<span class="legend-item"><i class="swatch swatch-amber"></i>Pasted in <strong>2.2k</strong></span>' +
          '<span class="legend-pct">73% yours</span>'
        : '<span class="legend-item"><i class="swatch swatch-line swatch-manual"></i>Written manually <strong>6.2k</strong></span>' +
          '<span class="legend-item"><i class="swatch swatch-line swatch-ai"></i>AI-copied / pasted <strong>2.2k</strong></span>' +
          '<span class="legend-pct">73% yours</span>';
    }

    /* ---- bar view ---- */
    function drawBars() {
      host.innerHTML = rows.map(function (d) {
        return '<div class="chart-col" title="' + d.day + '">' +
          '<span class="chart-tip">' + d.day + ' · ' + d.wrote + ' written / ' + d.pasted + ' pasted</span>' +
          '<div class="bar-pasted" style="height:0" data-h="' + (d.pasted / peak * 100).toFixed(2) + '"></div>' +
          '<div class="bar-wrote"  style="height:0" data-h="' + (d.wrote  / peak * 100).toFixed(2) + '"></div>' +
        '</div>';
      }).join('');
      host.style.display = 'grid';

      requestAnimationFrame(function () {
        $$('#chart [data-h]').forEach(function (bar) {
          bar.style.height = bar.getAttribute('data-h') + '%';
        });
      });
    }

    /* ---- line view ---- */
    var W = 700, H = 250, PAD_X = 12, TOP = 16, BOT = 232;

    function xAt(i) { return PAD_X + i * ((W - PAD_X * 2) / (rows.length - 1)); }
    function yAt(v) { return BOT - (v / linePeak) * (BOT - TOP); }

    function points(key) {
      return rows.map(function (d, i) { return xAt(i).toFixed(1) + ',' + yAt(d[key]).toFixed(1); }).join(' ');
    }

    function dots(key, cls) {
      return rows.map(function (d, i) {
        return '<circle class="line-dot ' + cls + '" data-i="' + i + '" cx="' + xAt(i).toFixed(1) +
               '" cy="' + yAt(d[key]).toFixed(1) + '" r="3.6"/>';
      }).join('');
    }

    /* hover readout: nearest data point, crosshair, enlarged dots */
    function bindReadout() {
      var svg    = host.querySelector('.line-chart');
      var tip    = host.querySelector('.line-tip');
      var cursor = host.querySelector('.line-cursor');
      var step   = (W - PAD_X * 2) / (rows.length - 1);
      var hot    = -1;

      function clearHot() {
        $$('.line-dot.is-hot', host).forEach(function (c) { c.classList.remove('is-hot'); });
      }

      function hide() {
        hot = -1;
        clearHot();
        tip.hidden = true;
        cursor.classList.remove('is-on');
      }

      function move(e) {
        var box = svg.getBoundingClientRect();
        var x   = (e.clientX - box.left) / box.width * W;
        var i   = Math.round((x - PAD_X) / step);
        i = Math.max(0, Math.min(rows.length - 1, i));
        if (i === hot) return;
        hot = i;

        var d = rows[i];
        clearHot();
        $$('.line-dot[data-i="' + i + '"]', host).forEach(function (c) { c.classList.add('is-hot'); });

        cursor.setAttribute('x1', xAt(i).toFixed(1));
        cursor.setAttribute('x2', xAt(i).toFixed(1));
        cursor.classList.add('is-on');

        tip.innerHTML =
          '<p class="line-tip-day">' + d.day + '</p>' +
          '<p class="line-tip-row"><span><i class="line-tip-dot t-manual"></i>Typed</span>' +
            '<strong>' + d.wrote.toLocaleString() + '</strong></p>' +
          '<p class="line-tip-row"><span><i class="line-tip-dot t-ai"></i>Pasted</span>' +
            '<strong>' + d.pasted.toLocaleString() + '</strong></p>';
        tip.hidden = false;

        var left = xAt(i) / W * box.width;
        tip.style.left = Math.max(84, Math.min(box.width - 84, left)) + 'px';
        tip.style.top  = (Math.min(yAt(d.wrote), yAt(d.pasted)) / H * box.height) + 'px';
      }

      svg.addEventListener('mousemove', move);
      svg.addEventListener('mouseleave', hide);
    }

    function drawLines() {
      host.style.display = 'block';
      var grid = [0, 0.5, 1].map(function (t) {
        var y = (TOP + (BOT - TOP) * t).toFixed(1);
        return '<line class="line-grid" x1="' + PAD_X + '" y1="' + y + '" x2="' + (W - PAD_X) + '" y2="' + y + '"/>';
      }).join('');

      host.innerHTML =
        '<svg class="line-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
             'aria-label="Characters written manually versus AI-copied, each day">' +
          grid +
          '<line class="line-cursor" y1="' + TOP + '" y2="' + BOT + '" x1="0" x2="0"/>' +
          '<polyline class="line-path line-ai"     points="' + points('pasted') + '"/>' +
          '<polyline class="line-path line-manual" points="' + points('wrote')  + '"/>' +
          dots('pasted', 'd-ai') +
          dots('wrote',  'd-manual') +
        '</svg>' +
        '<div class="line-tip" hidden></div>';

      bindReadout();

      /* draw-on animation */
      $$('#chart .line-path').forEach(function (path) {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = REDUCED ? 0 : len;
        if (!REDUCED) requestAnimationFrame(function () { path.style.strokeDashoffset = 0; });
      });
    }

    function render(view) {
      drawLegend(view);
      if (view === 'bars') drawBars(); else drawLines();
    }

    $$('.seg-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.seg-btn').forEach(function (b) {
          b.classList.remove('is-on');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        render(btn.getAttribute('data-view'));
      });
    });

    render('bars');
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
