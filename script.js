(function(){
  var ARC = 453.786, START = 140, SWEEP = 260;

  function tone(v){
    if(v < 50) return {c:'var(--red)',   t:'Needs attention'};
    if(v < 80) return {c:'var(--amber)', t:'Developing'};
    return       {c:'var(--green)',      t:'Strong'};
  }
  function hex(v){ return v < 50 ? '#E5484D' : v < 80 ? '#F5A623' : '#34C77B'; }

  /* ---- gauge ---- */
  var arc = document.getElementById('arc'),
      num = document.getElementById('num'),
      band = document.getElementById('band'),
      slider = document.getElementById('slider'),
      slabel = document.getElementById('slabel'),
      svg = document.getElementById('svg');

  function render(v){
    var s = tone(v);
    document.documentElement.style.setProperty('--band', s.c);
    arc.style.strokeDashoffset = ARC * (1 - v / 100);
    num.textContent = v;
    band.textContent = s.t;
    slabel.textContent = v;
    svg.setAttribute('aria-label', 'Critical thinking score ' + v + ' out of 100 — ' + s.t);
  }

  /* tick marks, emphasised at the two thresholds */
  var ticks = '';
  for(var v = 0; v <= 100; v += 10){
    var a = (START + SWEEP * v / 100) * Math.PI / 180,
        key = (v === 50 || v === 80),
        r1 = 114, r2 = key ? 126 : 121;
    ticks += '<line x1="' + (120 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (120 + r1 * Math.sin(a)).toFixed(1) +
             '" x2="' + (120 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (120 + r2 * Math.sin(a)).toFixed(1) +
             '" stroke="' + (key ? '#1E2761' : '#C3C8E4') + '" stroke-width="' + (key ? 2 : 1.4) + '" stroke-linecap="round"/>';
    if(key){
      var rl = 139;
      ticks += '<text x="' + (120 + rl * Math.cos(a)).toFixed(1) + '" y="' + (120 + rl * Math.sin(a) + 4).toFixed(1) +
               '" text-anchor="middle" font-size="11" font-family="Inter Tight,sans-serif" fill="#767CA0">' + v + '</text>';
    }
  }
  document.getElementById('ticks').innerHTML = ticks;

  slider.addEventListener('input', function(){ render(+slider.value); });
  render(0);
  setTimeout(function(){ render(+slider.value); }, 160);

  /* ---- weekly bars ---- */
  var weeks = [{w:'W1',v:44},{w:'W2',v:51},{w:'W3',v:47},{w:'W4',v:58},
               {w:'W5',v:66},{w:'W6',v:72},{w:'W7',v:79},{w:'W8',v:84}];
  var chart = document.getElementById('chart');
  weeks.forEach(function(d){
    var el = document.createElement('div');
    el.className = 'bar';
    el.title = d.w + ' — ' + d.v;
    el.innerHTML = '<u style="height:' + d.v + '%;background:' + hex(d.v) + '"></u><span>' + d.w + '</span>';
    chart.appendChild(el);
  });

  /* ---- session list ---- */
  var list = [
    {k:'DOC',  t:'Software Engineering — case study',  d:'22 Jul, 19:40', v:86},
    {k:'CODE', t:'DBMS lab — query optimisation',      d:'21 Jul, 16:05', v:74},
    {k:'DOC',  t:'Technical writing — abstract',       d:'19 Jul, 11:20', v:91},
    {k:'CODE', t:'DSA assignment — graph traversal',   d:'18 Jul, 22:15', v:43},
    {k:'DOC',  t:'Minor project — literature review',  d:'16 Jul, 14:00', v:68}
  ];
  document.getElementById('sessions').innerHTML = list.map(function(s){
    var c = hex(s.v);
    return '<div class="row"><div class="ic">' + s.k + '</div>' +
           '<div class="t"><b>' + s.t + '</b><small>' + s.d + '</small></div>' +
           '<div class="sc" style="color:' + c + ';background:' + c + '1F">' + s.v + '</div></div>';
  }).join('');

  /* ---- photo upload ---- */
  var drop = document.getElementById('drop'),
      pick = document.getElementById('pick'),
      shot = document.getElementById('shot');

  function load(file){
    if(!file || !/^image\//.test(file.type)) return;
    var r = new FileReader();
    r.onload = function(e){ shot.src = e.target.result; drop.classList.add('has'); };
    r.readAsDataURL(file);
  }
  drop.addEventListener('click', function(){ pick.click(); });
  drop.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick.click(); }
  });
  document.getElementById('swap').addEventListener('click', function(e){ e.stopPropagation(); pick.click(); });
  pick.addEventListener('change', function(){ load(pick.files[0]); });
  ['dragenter','dragover'].forEach(function(n){
    drop.addEventListener(n, function(e){ e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave','drop'].forEach(function(n){
    drop.addEventListener(n, function(e){ e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function(e){ load(e.dataTransfer.files[0]); });
})();
