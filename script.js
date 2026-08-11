/* ============================================================
   Autonomize dashboard — behaviour
   Sections: theme · navigation · card tilt · reveal · charts
             · calendar · accordion · photo upload
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
    coins: {
      /* every entry follows the stated rule, so the arithmetic can be checked:
         +10 for a session with nothing pasted, -1 per 100 characters pasted   */
      opening: 214,
      ledger: [
        { task: 'dijkstra.py',            site: 'github.com',      pasted: 0,   delta:  10 },
        { task: 'Compiler design notes',  site: 'docs.google.com', pasted: 0,   delta:  10 },
        { task: 'Lab report \u2014 unit 3',    site: 'overleaf.com',    pasted: 0,   delta:  10 },
        { task: 'Assignment 4 draft',     site: 'docs.google.com', pasted: 320, delta:  -3 },
        { task: 'Unit 3 summary',         site: 'chatgpt.com',     pasted: 610, delta:  -6 },
        { task: 'Quiz 2 (graded)',        site: 'forms.gle',       pasted: 780, delta: -12 }
      ],
      tiers: [
        { name: 'Bronze',   at: 0   },
        { name: 'Silver',   at: 100 },
        { name: 'Gold',     at: 250 },
        { name: 'Platinum', at: 500 }
      ]
    },
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

    /* ---- line view: smooth curves over a soft filled area ---- */
    var W = 760, H = 300, PL = 46, PR = 14, PT = 16, PB = 44;
    var PLOT_W = W - PL - PR, PLOT_H = H - PT - PB;

    function niceMax(v) {
      var step = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)) / 2;
      return Math.ceil(v / step) * step;
    }
    var TOP_V = niceMax(linePeak);

    function xAt(i) { return PL + i * (PLOT_W / (rows.length - 1)); }
    function yAt(v) { return PT + PLOT_H - (v / TOP_V) * PLOT_H; }

    function kfmt(v) { return v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : String(v); }

    /* Catmull-Rom through the points, converted to cubic beziers */
    function curve(key) {
      var p = rows.map(function (d, i) { return [xAt(i), yAt(d[key])]; });
      var out = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
      for (var i = 0; i < p.length - 1; i++) {
        var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        out += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
               ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
               ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
      }
      return out;
    }

    function area(key) {
      return curve(key) + 'L' + xAt(rows.length - 1).toFixed(1) + ',' + (PT + PLOT_H) +
             'L' + xAt(0).toFixed(1) + ',' + (PT + PLOT_H) + 'Z';
    }

    function dots(key, cls) {
      return rows.map(function (d, i) {
        return '<circle class="line-dot ' + cls + '" data-i="' + i + '" cx="' + xAt(i).toFixed(1) +
               '" cy="' + yAt(d[key]).toFixed(1) + '" r="0"/>';
      }).join('');
    }

    /* hover readout: nearest data point, crosshair, enlarged dots */
    function bindReadout() {
      var svg    = host.querySelector('.line-chart');
      var tip    = host.querySelector('.line-tip');
      var cursor = host.querySelector('.line-cursor');
      var step   = PLOT_W / (rows.length - 1);
      var hot    = -1;

      function clearHot() {
        $$('.line-dot.is-hot', host).forEach(function (c) { c.classList.remove('is-hot'); });
      }

      function hide() {
        hot = -1; clearHot();
        tip.hidden = true;
        cursor.classList.remove('is-on');
      }

      function move(e) {
        var box = svg.getBoundingClientRect();
        var x   = (e.clientX - box.left) / box.width * W;
        var i   = Math.round((x - PL) / step);
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
        tip.style.left = Math.max(86, Math.min(box.width - 86, left)) + 'px';
        tip.style.top  = (Math.min(yAt(d.wrote), yAt(d.pasted)) / H * box.height) + 'px';
      }

      svg.addEventListener('mousemove', move);
      svg.addEventListener('mouseleave', hide);
    }

    function drawLines() {
      host.style.display = 'block';

      var ticks = [0, 0.25, 0.5, 0.75, 1];
      var gridY = ticks.map(function (t) {
        var y = (PT + PLOT_H - t * PLOT_H).toFixed(1);
        return '<line class="line-grid" x1="' + PL + '" y1="' + y + '" x2="' + (W - PR) + '" y2="' + y + '"/>' +
               '<text class="line-axis" x="' + (PL - 10) + '" y="' + (+y + 4) + '" text-anchor="end">' +
                 kfmt(Math.round(TOP_V * t)) + '</text>';
      }).join('');

      var labels = rows.map(function (d, i) {
        if (i % 2 !== 0 && i !== rows.length - 1) return '';
        return '<text class="line-axis" x="' + xAt(i).toFixed(1) + '" y="' + (H - 16) +
               '" text-anchor="middle">' + d.day + '</text>';
      }).join('');

      host.innerHTML =
        '<svg class="line-chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" ' +
             'role="img" aria-label="Characters typed versus pasted, each day">' +
          '<defs>' +
            '<linearGradient id="fillManual" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#4C9A6A" stop-opacity=".26"/>' +
              '<stop offset="100%" stop-color="#4C9A6A" stop-opacity="0"/>' +
            '</linearGradient>' +
            '<linearGradient id="fillAi" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#CF5C48" stop-opacity=".22"/>' +
              '<stop offset="100%" stop-color="#CF5C48" stop-opacity="0"/>' +
            '</linearGradient>' +
          '</defs>' +
          gridY + labels +
          '<line class="line-cursor" y1="' + PT + '" y2="' + (PT + PLOT_H) + '" x1="0" x2="0"/>' +
          '<path class="line-area" d="' + area('wrote')  + '" fill="url(#fillManual)"/>' +
          '<path class="line-area" d="' + area('pasted') + '" fill="url(#fillAi)"/>' +
          '<path class="line-path line-ai"     d="' + curve('pasted') + '"/>' +
          '<path class="line-path line-manual" d="' + curve('wrote')  + '"/>' +
          dots('pasted', 'd-ai') +
          dots('wrote',  'd-manual') +
        '</svg>' +
        '<div class="line-tip" hidden></div>';

      $$('#chart .line-path').forEach(function (path) {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = REDUCED ? 0 : len;
        if (!REDUCED) requestAnimationFrame(function () { path.style.strokeDashoffset = 0; });
      });
      requestAnimationFrame(function () {
        $$('#chart .line-dot').forEach(function (c) { c.setAttribute('r', '3.6'); });
      });

      bindReadout();
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
     Autonomize Coins
     Earned for finishing work unaided; spent when text is pasted in.
     ========================================================== */

  (function coins() {
    var C = DATA.coins;

    var balance = C.ledger.reduce(function (t, e) { return t + e.delta; }, C.opening);
    var week    = C.ledger.reduce(function (t, e) { return t + e.delta; }, 0);

    /* current tier and distance to the next */
    var tier = C.tiers[0], next = null;
    C.tiers.forEach(function (t) { if (balance >= t.at) tier = t; });
    C.tiers.forEach(function (t) { if (next === null && t.at > balance) next = t; });

    $('#coinTier').textContent = tier.name;
    $('#coinNext').textContent = next
      ? (next.at - balance) + ' to ' + next.name
      : 'top tier';

    var span = next ? next.at - tier.at : 1;
    var into = next ? balance - tier.at : span;
    requestAnimationFrame(function () {
      $('#coinFill').style.width = Math.round(into / span * 100) + '%';
    });

    var delta = $('#coinDelta');
    delta.textContent = (week >= 0 ? '+' : '\u2212') + Math.abs(week) + ' this week';
    delta.className = 'coin-delta ' + (week >= 0 ? 'up' : 'down');

    $('#coinLedger').innerHTML = C.ledger.slice().reverse().map(function (e) {
      var up = e.delta >= 0;
      var why = e.pasted === 0
        ? 'nothing pasted'
        : e.pasted.toLocaleString() + ' characters pasted';
      return '<li class="coin-row">' +
        '<span class="coin-row-body">' +
          '<span class="coin-task">' + e.task + '</span>' +
          '<span class="coin-why">' + e.site + ' \u00b7 ' + why + '</span>' +
        '</span>' +
        '<span class="coin-amt ' + (up ? 'up' : 'down') + '">' +
          (up ? '+' : '\u2212') + Math.abs(e.delta) +
        '</span>' +
      '</li>';
    }).join('');

    countTo($('#coinBalance'), balance, 1200);
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
     Activity calendar — click a day for its typed/pasted detail
     ========================================================== */

  (function calendar() {
    var SITES = [
      { host: 'docs.google.com', cat: 'Writing',      cls: '' },
      { host: 'chatgpt.com',     cat: 'AI assistant', cls: 'c-ai' },
      { host: 'github.com',      cat: 'Writing',      cls: '' },
      { host: 'overleaf.com',    cat: 'Writing',      cls: '' },
      { host: 'forms.gle',       cat: 'Assessment',   cls: 'c-assessment' }
    ];
    var MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

    var grid    = $('#calGrid');
    var detail  = $('#calDetail');
    var label   = $('#calMonth');
    var today   = new Date();
    var view    = new Date(today.getFullYear(), today.getMonth(), 1);
    var picked  = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    /* deterministic per-date generator, so the same day always reads the same */
    function rng(y, m, d) {
      var seed = ((y * 10000 + (m + 1) * 100 + d) * 2654435761) % 2147483647;
      if (seed < 0) seed += 2147483647;
      return function () {
        seed = (seed * 1103515245 + 12345) % 2147483647;
        return seed / 2147483647;
      };
    }

    function sessionsFor(date) {
      var r = rng(date.getFullYear(), date.getMonth(), date.getDate());
      var dow = date.getDay();
      var roll = r();
      var count = (dow === 0 || dow === 6)
        ? (roll < 0.55 ? 0 : roll < 0.85 ? 1 : 2)
        : (roll < 0.18 ? 0 : roll < 0.45 ? 1 : roll < 0.8 ? 2 : 3);

      /* nothing recorded beyond today */
      if (date > today) count = 0;

      var out = [];
      for (var i = 0; i < count; i++) {
        var site = SITES[Math.floor(r() * SITES.length)];
        var typed  = Math.round(120 + r() * 900);
        var pasted = Math.round(r() * (site.cat === 'AI assistant' ? 620 : 260));
        var hour   = 8 + Math.floor(r() * 12);
        var mins   = Math.round(8 + r() * 70);
        out.push({
          host: site.host, cat: site.cat, cls: site.cls,
          typed: typed, pasted: pasted, mins: mins,
          start: (hour < 10 ? '0' : '') + hour + ':' + (r() < 0.5 ? '05' : '40')
        });
      }
      return out;
    }

    function totals(list) {
      return list.reduce(function (t, s) {
        t.typed += s.typed; t.pasted += s.pasted; t.mins += s.mins;
        t.flagged = t.flagged || (s.cat === 'Assessment' && s.pasted > 0);
        return t;
      }, { typed: 0, pasted: 0, mins: 0, flagged: false });
    }

    function level(chars) {
      if (chars === 0) return 0;
      if (chars < 700) return 1;
      if (chars < 1600) return 2;
      return 3;
    }

    function same(a, b) {
      return a.getFullYear() === b.getFullYear() &&
             a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function drawGrid() {
      var y = view.getFullYear(), m = view.getMonth();
      label.textContent = MONTHS[m] + ' ' + y;

      var first = new Date(y, m, 1).getDay();
      var days  = new Date(y, m + 1, 0).getDate();
      var html  = '';

      for (var p = 0; p < first; p++) html += '<span class="cal-day is-pad"></span>';

      for (var d = 1; d <= days; d++) {
        var date = new Date(y, m, d);
        var t    = totals(sessionsFor(date));
        var lv   = level(t.typed + t.pasted);
        var cls  = 'cal-day';
        if (same(date, picked)) cls += ' is-on';
        if (same(date, today))  cls += ' is-today';
        if (t.flagged)          cls += ' is-flagged';

        html += '<button type="button" class="' + cls + '" data-d="' + d + '" ' +
                'aria-label="' + MONTHS[m] + ' ' + d + ', ' +
                (t.typed + t.pasted) + ' characters">' +
                  d + '<i class="cal-dot k' + lv + '"></i>' +
                '</button>';
      }
      grid.innerHTML = html;
    }

    function drawDetail() {
      var list = sessionsFor(picked);
      var t    = totals(list);
      var all  = t.typed + t.pasted;
      var share = all ? Math.round(t.typed / all * 100) : 0;

      var head =
        '<div class="cal-detail-head">' +
          '<p class="cal-date">' + MONTHS[picked.getMonth()] + ' ' + picked.getDate() + '</p>' +
          '<p class="cal-share">' + (all ? share + '% yours \u00b7 ' + t.mins + 'm tracked' : 'nothing tracked') + '</p>' +
        '</div>';

      if (!list.length) {
        detail.innerHTML = head +
          '<p class="cal-empty">No activity recorded on this day. Days with tracked work show a ' +
          'coloured dot in the calendar.</p>';
        return;
      }

      var stats =
        '<div class="cal-totals">' +
          '<div class="cal-stat typed"><b>' + t.typed.toLocaleString() + '</b><span>characters typed</span></div>' +
          '<div class="cal-stat pasted"><b>' + t.pasted.toLocaleString() + '</b><span>characters pasted</span></div>' +
          '<div class="cal-stat"><b>' + list.length + '</b><span>' + (list.length === 1 ? 'session' : 'sessions') + '</span></div>' +
        '</div>' +
        '<div class="cal-split">' +
          '<i class="s-typed" style="flex-basis:' + share + '%"></i>' +
          '<i class="s-pasted" style="flex-basis:' + (100 - share) + '%"></i>' +
        '</div>';

      var rows = '<ul class="cal-sessions">' + list.map(function (s) {
        var tot = s.typed + s.pasted;
        var pct = tot ? Math.round(s.typed / tot * 100) : 0;
        return '<li class="cal-session">' +
          '<div class="cal-session-top">' +
            '<span class="cal-site">' + s.host + '</span>' +
            '<span class="cal-cat ' + s.cls + '">' + s.cat + '</span>' +
            '<span class="cal-when">' + s.start + ' \u00b7 ' + s.mins + 'm</span>' +
          '</div>' +
          '<div class="cal-session-nums">' +
            '<span class="n-typed">typed <b>' + s.typed.toLocaleString() + '</b></span>' +
            '<span class="n-pasted">pasted <b>' + s.pasted.toLocaleString() + '</b></span>' +
          '</div>' +
          '<div class="cal-session-bar">' +
            '<i class="s-typed" style="flex-basis:' + pct + '%;background:#4C9A6A"></i>' +
            '<i class="s-pasted" style="flex-basis:' + (100 - pct) + '%;background:#CF5C48"></i>' +
          '</div>' +
        '</li>';
      }).join('') + '</ul>';

      detail.innerHTML = head + stats + rows;
    }

    function render() { drawGrid(); drawDetail(); }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.cal-day');
      if (!btn || btn.classList.contains('is-pad')) return;
      picked = new Date(view.getFullYear(), view.getMonth(), +btn.getAttribute('data-d'));
      render();
    });

    $('#calPrev').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      drawGrid();
    });
    $('#calNext').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      drawGrid();
    });

    render();
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
     Photo upload — the header avatar is the drop target.
     FileReader only; the image never leaves this browser.
     ========================================================== */

  (function uploader() {
    var MAX_BYTES = 2 * 1024 * 1024;
    var TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    var wrap     = $('.avatar-wrap');
    var avatar   = $('#navAvatar');
    var initials = $('#navInitials');
    var input    = $('#fileInput');
    var msg      = $('#uploadError');
    var timer    = null;

    function flash(text) {
      msg.textContent = text;
      msg.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(function () { msg.hidden = true; }, 3600);
    }

    function show(src) {
      var img = avatar.querySelector('img') || new Image();
      img.src = src;
      img.alt = '';
      if (!img.parentNode) avatar.appendChild(img);
      initials.hidden = true;
      avatar.setAttribute('aria-label', 'Profile photo set. Click to change it.');
    }

    function load(file) {
      if (!file) return;
      if (TYPES.indexOf(file.type) === -1) return flash('Choose a JPG, PNG or WebP image.');
      if (file.size > MAX_BYTES)           return flash('That image is over 2 MB.');

      msg.hidden = true;
      var reader = new FileReader();
      reader.onload  = function (e) { show(e.target.result); };
      reader.onerror = function () { flash('That file could not be read.'); };
      reader.readAsDataURL(file);
    }

    avatar.addEventListener('click', function () { input.click(); });

    input.addEventListener('change', function () {
      load(input.files[0]);
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (n) {
      wrap.addEventListener(n, function (e) { e.preventDefault(); wrap.classList.add('is-over'); });
    });
    ['dragleave', 'dragend', 'drop'].forEach(function (n) {
      wrap.addEventListener(n, function (e) { e.preventDefault(); wrap.classList.remove('is-over'); });
    });
    wrap.addEventListener('drop', function (e) { load(e.dataTransfer.files[0]); });
  })();

})();
