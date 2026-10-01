/* Apex Sherpa. A working demo: real state and flows on example data. Every integration and every AI answer is a dead end. */
(function () {
  'use strict';

  var D = window.SHERPA_DATA;
  var PINE = '#1C3A28', MIST = '#ECECE4';

  /* ================= helpers ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function r1(n) { return Math.round(n * 10) / 10; }
  function f1(n) { return r1(n).toFixed(1); }
  function fh(n) { var v = r1(n); return v % 1 === 0 ? String(v) : v.toFixed(1); }
  function words(n) { return ['No', 'One', 'Two', 'Three', 'Four', 'Five'][n] || String(n); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function nowTime() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function greeting() { var h = new Date().getHours(); return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening'; }
  function monthTag() { return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][new Date().getMonth()] + ' ' + new Date().getFullYear(); }

  var ICON = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    chat: '<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
    clients: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.2c2.6.4 4.5 2.8 4.5 5.8"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5M12 6v2M12 16v2"/>',
    projects: '<path d="M3 7h7l2 2h9v10H3z"/>',
    support: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>',
    base: '<path d="M2 20h20M12 4L3.5 20M12 4l8.5 16M12 13l-3.5 7M12 13l3.5 7"/>',
    flag: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
    trailhead: '<path d="M12 3v18M12 5h6l2 2.5-2 2.5h-6M12 12H6l-2 2.5L6 17h6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    shrink: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>'
  };
  function icon(name, size, color, sw) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  var PEAK = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20 L9.5 7 L13.5 13.5 L16 10 L22 20 Z" fill="currentColor"/></svg>';

  /* ================= state ================= */
  var KEY = 'apex-sherpa-app-v1';
  function fresh() {
    return { name: 'Hunter', onboarded: false, step: 'name', summit: 20, why: 'Family', camps: {}, model: 'Claude', approvals: {}, trails: {}, perms: {}, added: [], undone: {}, reached: 0, summits: 0, lens: 'map', protect: 'Friday afternoons' };
  }
  var state = load();
  function load() {
    var s = fresh();
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) if (o.hasOwnProperty(k)) s[k] = o[k]; } } catch (e) { }
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

  var session = { snoozed: {}, pendingTool: {}, connecting: null, campLens: {}, openRow: null, logCamp: 'all', logQuery: '', logSel: null, chat: [], full: false, nameError: false, confirmReset: false, last: null };

  /* ================= derived data ================= */
  function camp(id) { for (var i = 0; i < D.CAMPS.length; i++) if (D.CAMPS[i].id === id) return D.CAMPS[i]; return null; }
  function isOn(id) { return !!state.camps[id]; }
  function toolOf(id) { return (state.camps[id] || {}).tool || camp(id).tools[0]; }
  function sourceOf(entry) {
    if (entry.camp === 'mail') { var t = toolOf('mail'); return t === 'Outlook' ? 'Outlook' : entry.src === 'cal' ? 'Google Calendar' : 'Gmail'; }
    return toolOf(entry.camp);
  }
  function trailHours(campId) {
    var h = 0; D.TRAILS.forEach(function (t) { if (t.camp === campId && state.trails[t.id] === 'taken') h += t.hours; }); return h;
  }
  function campHours(id) { return isOn(id) ? camp(id).hours + trailHours(id) : 0; }
  function elevation() { var e = 0; D.CAMPS.forEach(function (c) { e += campHours(c.id); }); return r1(e); }
  function toGo() { return r1(Math.max(0, state.summit - elevation())); }
  function weeks() { var e = elevation(); return [0.18, 0.41, 0.59, 0.73, 1].map(function (f) { return r1(e * f); }); }
  function delta() { var h = weeks(); return r1(h[4] - h[3]); }
  function level(c) { return Math.floor(c.memories / 500) + 1; }
  function toNext(c) { return level(c) * 500 - c.memories; }
  function openApprovals() { return D.APPROVALS.filter(function (a) { return isOn(a.camp) && !state.approvals[a.id]; }); }
  function nextTrail(campId) {
    for (var i = 0; i < D.TRAILS.length; i++) {
      var t = D.TRAILS[i];
      if ((!campId || t.camp === campId) && isOn(t.camp) && !state.trails[t.id] && !session.snoozed[t.id]) return t;
    }
    return null;
  }
  function unexplored() { return D.CAMPS.filter(function (c) { return !isOn(c.id); }); }
  function entries() {
    var list = state.added.slice().reverse().map(function (e) { return e; });
    D.LOG.forEach(function (e) { if (isOn(e.camp)) list.push(e); });
    return list.map(function (e) { var o = {}; for (var k in e) o[k] = e[k]; o.source = sourceOf(e); o.undone = !!state.undone[e.id]; return o; });
  }
  function todayMinutes() { return entries().filter(function (e) { return e.day === 'Today' && !e.undone; }).reduce(function (a, e) { return a + e.min; }, 0); }
  function initial() { return (state.name || '?').trim().charAt(0).toUpperCase() || '?'; }

  /* ================= routing ================= */
  var STEPS = [['name', 'You'], ['summit', 'Summit'], ['camps', 'Camps'], ['ai', 'Base Camp']];
  var KNOWN = ['home', 'map', 'approvals', 'log', 'camps', 'gear', 'report', 'summit'];
  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (!state.onboarded) { if (!/^start-(name|summit|camps|ai)$/.test(h)) h = 'start-' + state.step; }
    else if (!h || /^start-/.test(h)) h = 'home';
    var m = h.match(/^camp-([a-z]+)$/);
    if (m && !camp(m[1])) { h = 'camps'; m = null; }
    if (!m && !/^start-/.test(h) && KNOWN.indexOf(h) < 0) h = 'home';
    var name = m ? 'camp' : (/^start-/.test(h) ? 'start' : h);
    var section = { home: 'home', map: 'home', approvals: 'home', summit: 'home', camps: 'camps', camp: 'camps', log: 'log', report: 'log', gear: 'gear', start: 'start' }[name];
    return { hash: h, name: name, camp: m ? m[1] : null, step: name === 'start' ? h.slice(6) : null, section: section };
  }
  function go(h) { if (location.hash === '#' + h) render(); else location.hash = '#' + h; }

  /* ================= small components ================= */
  var deskMQ = window.matchMedia('(min-width: 1100px)');
  function desk() { return deskMQ.matches; }

  function logo(h) { return '<a href="#home" class="logo" aria-label="Apex home"><img src="assets/logo-green.svg" alt="Apex" height="' + h + '" width="' + Math.round(h * 3.35) + '"></a>'; }
  function elevPill() {
    return '<a href="#log" class="elev-pill" aria-label="Elevation ' + f1(elevation()) + ' of ' + state.summit + ' hours a week. Open the trail log.">' + PEAK + '<b>' + f1(elevation()) + '</b><span>/ ' + state.summit + ' h</span></a>';
  }
  function avatar() { return '<button type="button" class="avatar" data-action="account" aria-label="Account: ' + esc(state.name) + '" aria-haspopup="menu">' + esc(initial()) + '</button>'; }
  function chip(t) { return '<span class="chip">' + t + '</span>'; }
  function sherpaDisc(onPine, size) { return '<span class="disc ' + (onPine ? 'disc-mist' : 'disc-pine') + '" style="width:' + size + 'px;height:' + size + 'px"><img src="assets/' + (onPine ? 'icon.svg' : 'icon-white.svg') + '" alt="" style="width:' + Math.round(size * 0.5) + 'px;height:' + Math.round(size * 0.54) + 'px"></span>'; }
  function campDisc(c, size, dashed) { return '<span class="cdisc' + (dashed ? ' is-dashed' : '') + '" style="width:' + size + 'px;height:' + size + 'px">' + icon(c.icon, Math.round(size * 0.46), PINE, 1.8) + '</span>'; }

  function elevCard(compact) {
    var h = weeks(), e = elevation(), max = Math.max(state.summit, e) || 1;
    var W = 224, top = 10, base = compact ? 70 : 92, xs = [8, 60, 112, 164, 216];
    var ys = h.map(function (v) { return r1(base - v / max * (base - top)); });
    var pts = xs.map(function (x, i) { return x + ' ' + ys[i]; }).join(' L');
    var labels = compact ? '' : ['W1', 'W2', 'W3', 'W4', 'W5'].map(function (w, i) { return '<text x="' + xs[i] + '" y="' + (base + 18) + '" text-anchor="middle" class="t-soft' + (i === 4 ? ' t-strong' : '') + '">' + w + '</text>'; }).join('');
    return '<section class="elev" aria-label="Elevation ' + f1(e) + ' hours back a week, up ' + f1(delta()) + ' this week. Summit is ' + state.summit + '.">' +
      '<div class="elev-num"><span>' + f1(e) + '</span><small>h</small></div>' +
      '<div class="elev-row"><span>Elevation</span><b>+' + f1(delta()) + ' this week</b></div>' +
      '<svg class="elev-chart" viewBox="0 0 ' + W + ' ' + (base + (compact ? 6 : 24)) + '" aria-hidden="true">' +
      '<line x1="8" y1="' + base + '" x2="216" y2="' + base + '" class="ln-faint"/>' +
      '<line x1="8" y1="' + r1(base - state.summit / max * (base - top)) + '" x2="216" y2="' + r1(base - state.summit / max * (base - top)) + '" class="ln-summit"/>' +
      '<text x="216" y="' + r1(base - state.summit / max * (base - top) - 6) + '" text-anchor="end" class="t-strong">Summit ' + state.summit + '</text>' +
      (e > 0 ? '<path d="M8 ' + base + ' L' + pts + ' L216 ' + base + ' Z" class="area"/><path d="M' + pts + '" class="line"/><circle cx="216" cy="' + ys[4] + '" r="5" class="dot"/>' : '') +
      labels + '</svg></section>';
  }

  function approvalRows(list, onPine) {
    if (!list.length) return '';
    return '<div class="appr-list">' + list.map(function (a) {
      return '<div class="appr' + (onPine ? ' on-pine' : '') + '"><div class="appr-text"><b>' + esc(a.who) + '</b><span>' + esc(a.what) + '</span></div>' +
        '<button type="button" class="btn ' + (onPine ? 'ghost-mist' : 'ghost') + ' sm" data-action="approve" data-id="' + a.id + '">' + a.verb + '</button></div>';
    }).join('') + '</div>';
  }
  function approveAllLabel(n) { return n === 3 ? 'Approve all three' : n === 2 ? 'Approve both' : 'Approve it'; }

  function trailCard(t, onPine) {
    if (!t) return '';
    var c = camp(t.camp);
    return '<div class="trail' + (onPine ? ' on-pine' : '') + '">' +
      '<p class="trail-text">' + esc(t.text) + '</p>' +
      '<div class="trail-gain">+' + fh(t.hours) + ' h/wk</div>' +
      '<div class="trail-camp">' + esc(c.name) + ' · ' + esc(t.title) + '</div>' +
      '<div class="row gap8"><button type="button" class="btn ' + (onPine ? 'mist' : 'primary') + ' grow" data-action="take" data-id="' + t.id + '">Hand it over</button>' +
      '<button type="button" class="btn ' + (onPine ? 'ghost-mist' : 'ghost') + '" data-action="snooze" data-id="' + t.id + '">Not now</button></div></div>';
  }

  function logRows(list, compact) {
    return list.map(function (e) {
      return '<button type="button" class="log-row' + (session.logSel === e.id ? ' is-sel' : '') + (e.undone ? ' is-undone' : '') + '" data-action="log-open" data-id="' + e.id + '">' +
        '<span class="lr-time">' + e.time + '</span><span class="lr-text">' + esc(e.text) + '</span>' +
        (compact ? '' : '<span class="lr-camp">' + esc(camp(e.camp).name) + '</span>') +
        '<b class="lr-min">' + (e.undone ? 'Undone' : '+' + e.min + 'm') + '</b></button>';
    }).join('');
  }

  function viewPanel(scope, opts) {
    opts = opts || {};
    var lens = scope === 'home' ? state.lens : (session.campLens[scope] || 'brain');
    var full = session.full ? ' is-full' : '';
    var label = scope === 'home' ? 'Your mountain' : camp(scope).name;
    return '<section class="view' + full + (opts.ask ? ' has-ask' : '') + (opts.cls ? ' ' + opts.cls : '') + '" data-scope="' + scope + '" data-lens="' + lens + '" aria-label="' + esc(label) + ', ' + lens + ' view">' +
      '<div class="view-art"></div>' +
      '<div class="view-bar">' +
      '<div class="seg" role="group" aria-label="View"><button type="button" data-action="lens" data-lens="map" aria-pressed="' + (lens === 'map') + '">Map</button><button type="button" data-action="lens" data-lens="brain" aria-pressed="' + (lens === 'brain') + '">Brain</button></div>' +
      (opts.noExpand ? '' : '<button type="button" class="icon-btn" data-action="full" aria-label="' + (session.full ? 'Exit full screen' : 'Full screen') + '">' + icon(session.full ? 'shrink' : 'expand', 18, PINE, 2.2) + '</button>') +
      '</div>' +
      (opts.ask ? askBar(opts.ask, true) : '') +
      '</section>';
  }

  function askBar(placeholder, floating, id) {
    id = id || ('ask-' + (floating ? 'f' : 'p'));
    return '<form class="ask' + (floating ? ' is-floating' : '') + '" data-form="ask" role="search"><label class="sr" for="' + id + '">' + esc(placeholder) + '</label>' +
      '<input id="' + id + '" name="q" type="text" autocomplete="off" placeholder="' + esc(placeholder) + '">' +
      '<button type="submit" class="ask-go" aria-label="Ask">' + icon('arrow', 18, MIST, 2.5) + '</button></form>';
  }

  function connectBlock(c) {
    var tool = session.pendingTool[c.id] || c.tools[0];
    var busy = session.connecting === c.id;
    return '<div class="connect">' +
      '<div class="chips" role="radiogroup" aria-label="' + esc(c.name) + ' tool">' + c.tools.map(function (t) {
        return '<button type="button" class="chipbtn" role="radio" aria-checked="' + (t === tool) + '" data-action="pick-tool" data-camp="' + c.id + '" data-tool="' + esc(t) + '"' + (busy ? ' disabled' : '') + '>' + esc(t) + '</button>';
      }).join('') + '</div>' +
      '<button type="button" class="btn primary block" data-action="connect" data-camp="' + c.id + '"' + (busy ? ' disabled aria-busy="true"' : '') + '>' + (busy ? 'Connecting ' + esc(tool) + '…' : 'Connect ' + esc(tool)) + '</button>' +
      '<p class="fine">Demo. No account gets connected.</p></div>';
  }

  /* ================= onboarding ================= */
  function stepsNav(step) {
    var idx = STEPS.map(function (s) { return s[0]; }).indexOf(step);
    return STEPS.map(function (s, i) {
      if (i < idx) return '<span class="step is-done">' + icon('check', 14, PINE, 2.5) + s[1] + '</span>';
      if (i === idx) return '<span class="step is-on" aria-current="step">' + (i + 1) + ' · ' + s[1] + '</span>';
      return '<span class="step">' + (i + 1) + ' · ' + s[1] + '</span>';
    }).join('');
  }
  function startBody(step) {
    if (step === 'name') {
      return '<h1>What do we call you?</h1><p class="lede">I\'m Sherpa, your guide. You\'re the climber.</p>' +
        '<form class="name-form" data-form="name"><label class="sr" for="you-name">Your first name</label>' +
        '<input id="you-name" name="name" class="big-input" type="text" autocomplete="given-name" placeholder="Your first name" value="' + esc(state.name) + '">' +
        (session.nameError ? '<p class="err" role="alert">Add your first name so I know what to call you.</p>' : '') +
        '<button type="submit" class="btn primary lg">Next</button></form>';
    }
    if (step === 'summit') {
      return '<h1>Name your summit</h1><p class="lede">Hours back a week. That\'s your summit.</p>' +
        '<div class="stepper"><button type="button" class="round-btn" data-action="hours" data-d="-1" aria-label="Fewer hours">' + icon('minus', 20, PINE, 2.5) + '</button>' +
        '<output class="stepper-num" aria-live="polite">' + state.summit + '</output>' +
        '<button type="button" class="round-btn" data-action="hours" data-d="1" aria-label="More hours">' + icon('plus', 20, PINE, 2.5) + '</button><span class="stepper-unit">hours<br>a week</span></div>' +
        '<div class="chips" role="group" aria-label="Quick picks">' + [5, 10, 15, 20, 30].map(function (n) { return '<button type="button" class="chipbtn" aria-pressed="' + (state.summit === n) + '" data-action="set-hours" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div>' +
        '<div class="label">What for?</div><div class="chips" role="group" aria-label="What for">' + D.WHY.map(function (w) { return '<button type="button" class="chipbtn" aria-pressed="' + (state.why === w) + '" data-action="set-why" data-why="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</div>' +
        '<div class="row gap12"><button type="button" class="btn primary lg" data-action="step" data-to="camps">Plot my route</button><button type="button" class="btn text" data-action="step" data-to="name">Back</button></div>';
    }
    if (step === 'camps') {
      var core = D.CAMPS.filter(function (c) { return c.core; });
      var any = core.some(function (c) { return isOn(c.id); });
      var proj = r1(core.reduce(function (a, c) { return a + (isOn(c.id) ? c.hours : 0); }, 0));
      return '<h1>Make camp</h1><p class="lede">Connect your tools. Each one is a camp on the way up.</p>' +
        '<div class="camp-rows">' + core.map(function (c) {
          var on = isOn(c.id), open = session.openRow === c.id && !on;
          return '<div class="camp-row' + (open ? ' is-open' : '') + (on ? ' is-on' : '') + '">' +
            '<button type="button" class="camp-row-head" data-action="row" data-camp="' + c.id + '" aria-expanded="' + open + '"' + (on ? ' disabled' : '') + '>' +
            '<span class="tick' + (on ? ' is-on' : '') + '">' + (on ? icon('check', 12, MIST, 3) : '') + '</span>' +
            '<span class="grow col"><b>' + esc(c.name) + '</b><span class="soft">' + (on ? esc(toolOf(c.id)) : esc(c.tools.join(', '))) + '</span></span>' +
            '<span class="soft">' + (on ? 'Done' : c.est) + '</span></button>' +
            (open ? connectBlock(c) : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="proj"><span>Projected elevation</span><b>' + f1(proj) + ' h a week</b></div>' +
        '<div class="row gap12"><button type="button" class="btn primary lg" data-action="step" data-to="ai"' + (any ? '' : ' disabled') + '>Continue</button><button type="button" class="btn text" data-action="step" data-to="summit">Back</button></div>' +
        (any ? '' : '<p class="fine">Make at least one camp to continue.</p>');
    }
    // ai
    return '<h1>Pick your gear</h1><p class="lede">Base Camp runs on any AI. Switch any time. Your memories stay yours.</p>' +
      '<div class="tiles2" role="radiogroup" aria-label="AI model">' + D.MODELS.map(function (m) {
        return '<button type="button" class="tile-radio" role="radio" aria-checked="' + (state.model === m.id) + '" data-action="model" data-model="' + m.id + '"><b>' + m.id + '</b><span>' + m.by + '</span></button>';
      }).join('') + '</div>' +
      '<div class="row gap12"><button type="button" class="btn primary lg" data-action="finish">Start climbing</button><button type="button" class="btn text" data-action="step" data-to="camps">Back</button></div>';
  }
  function startArt(step) {
    if (step === 'name') {
      return '<section class="sherpa-intro">' + '<span class="intro-mark"><img src="assets/icon.svg" alt=""></span>' +
        '<div class="intro-name">Sherpa</div><div class="intro-sub">Your guide</div>' +
        '<p class="intro-quote">Tell me where you want to go. I\'ll get you there.</p></section>';
    }
    return '<section class="view is-static" data-scope="onboard" data-lens="map" aria-label="Your route"><div class="view-art"></div></section>';
  }
  function renderStart(r) {
    if (desk()) {
      return '<header class="d-head">' + logo(30) + '<nav class="d-steps" aria-label="Setup steps">' + stepsNav(r.step) + '</nav>' + chip('Example data') + '</header>' +
        '<main class="d-start" id="main"><div class="start-copy">' + startBody(r.step) + '</div><div class="start-art">' + startArt(r.step) + '</div></main>';
    }
    var n = STEPS.map(function (s) { return s[0]; }).indexOf(r.step) + 1;
    return '<header class="p-head">' + logo(24) + '<div class="row gap10">' + chip('Example data') + '<span class="step-count">' + n + ' of 4</span></div></header>' +
      '<main class="p-main p-start" id="main"><div class="p-start-art">' + startArt(r.step) + '</div>' + startBody(r.step) + '</main>';
  }

  /* ================= app screens ================= */
  function dHeader(r) {
    var nav = [['home', 'Map'], ['camps', 'Camps'], ['log', 'Trail log'], ['gear', 'Gear']].map(function (n) {
      var on = r.section === n[0];
      return '<a href="#' + n[0] + '" class="nav-link' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
    }).join('');
    return '<header class="d-head">' + logo(30) + '<nav class="d-nav" aria-label="Main">' + nav + '</nav><div class="row gap12">' + chip('Example data') + elevPill() + avatar() + '</div></header>';
  }
  function pHeader(r, back) {
    var left = back ? '<a href="#' + back[0] + '" class="back">' + icon('back', 16, PINE, 2.5) + back[1] + '</a>' : logo(24);
    return '<header class="p-head">' + left + '<div class="row gap10">' + elevPill() + avatar() + '</div></header>';
  }
  function pTabs(r) {
    var n = openApprovals().length;
    var tabs = [['home', 'Home'], ['map', 'Map'], ['approvals', 'Approvals'], ['log', 'Log']];
    var cur = r.name === 'camp' || r.name === 'camps' ? 'map' : r.name === 'report' ? 'log' : r.name;
    return '<nav class="p-tabs" aria-label="Main">' + tabs.map(function (t) {
      var on = cur === t[0];
      return '<a href="#' + t[0] + '" class="tab' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + t[1] + (t[0] === 'approvals' && n ? '<span class="tab-n">' + n + '</span>' : '') + '</a>';
    }).join('') + '</nav>';
  }

  function sherpaHead(sub) {
    return '<div class="sp-head">' + sherpaDisc(true, 44) + '<div class="grow col"><b>Sherpa</b><span>' + esc(sub) + '</span></div>' +
      '<button type="button" class="icon-btn on-pine" data-action="checkin" aria-label="Morning check-in">' + icon('phone', 18, MIST, 2) + '</button></div>';
  }
  function needsLine(n) { return n === 0 ? 'All clear. Nothing needs you.' : n === 1 ? 'One thing needs you.' : words(n) + ' things need you.'; }

  function homeSherpaPanel() {
    var list = openApprovals(), t = nextTrail(), recent = entries().filter(function (e) { return e.day === 'Today'; }).slice(0, 3);
    return '<aside class="d-right pine" aria-label="Sherpa">' + sherpaHead('Your guide') +
      '<p class="sp-say">' + greeting() + ', ' + esc(state.name) + '. ' + needsLine(list.length) + '</p>' +
      approvalRows(list, true) +
      (list.length > 1 ? '<button type="button" class="btn mist block" data-action="approve-all">' + approveAllLabel(list.length) + '</button>' : '') +
      (t ? '<div class="label on-pine">Next trail</div>' + trailCard(t, true) : (elevation() >= state.summit ? '' : '<div class="label on-pine">Next trail</div><p class="sp-note">' + (unexplored().length ? 'Explore a new camp to find more trails.' : 'No new trails this week.') + '</p>')) +
      '<div class="label on-pine">Trail log</div><div class="mini-log">' + recent.map(function (e) {
        return '<a href="#log" class="ml-row"><span class="ml-time">' + e.time + '</span><span class="grow">' + esc(e.text) + '</span><b>' + (e.undone ? 'Undone' : '+' + e.min + 'm') + '</b></a>';
      }).join('') + '</div><div class="ml-total"><span>Today so far</span><b>+' + todayMinutes() + ' min</b></div></aside>';
  }

  function campsList() {
    var on = D.CAMPS.filter(function (c) { return isOn(c.id); }), off = unexplored();
    return '<div class="label">Camps</div><div class="clist">' + on.map(function (c) {
      return '<a href="#camp-' + c.id + '" class="crow"><span class="dot"></span><span class="grow">' + esc(c.name) + '</span><span class="soft num">' + f1(campHours(c.id)) + ' h</span></a>';
    }).join('') + '</div>' +
      (off.length ? '<div class="label">Unexplored</div><div class="clist">' + off.map(function (c) {
        return '<div class="crow is-off"><span class="dot is-off"></span><span class="grow col"><b>' + esc(c.name) + '</b><span class="soft">+' + fh(c.hours) + ' h/wk</span></span><button type="button" class="btn ghost sm" data-action="explore" data-camp="' + c.id + '">Explore</button></div>';
      }).join('') + '</div>' : '') +
      '<div class="label">Protected</div><div class="protect">' + esc(state.protect) + '</div>';
  }

  function renderHome(r) {
    if (desk()) {
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left">' + elevCard() + campsList() + '</aside>' +
        '<div class="d-center">' + viewPanel('home', { ask: 'Ask Sherpa' }) + '</div>' + homeSherpaPanel() + '</main>';
    }
    var n = openApprovals().length, t = nextTrail();
    return pHeader(r) + '<main class="p-main" id="main">' + elevCard(true) +
      '<a href="#approvals" class="need"><span class="need-n">' + n + '</span><span class="grow">' + (n ? 'need you' : 'All clear') + '</span><span class="btn primary sm">' + (n ? 'Review' : 'Open') + '</span></a>' +
      viewPanel('home', { cls: 'is-preview', noExpand: true }) +
      '<a href="#map" class="link-row">Open the full map ' + icon('arrow', 16, PINE, 2.2) + '</a>' +
      (t ? '<div class="label">Next trail</div>' + trailCard(t, true) : '') +
      askBar('Ask Sherpa') +
      '<div class="p-camps">' + campsList() + '</div></main>' + pTabs(r);
  }

  function renderMap(r) {
    if (desk()) return renderHome(r);
    return pHeader(r) + '<main class="p-main p-map" id="main">' + viewPanel('home', { cls: 'is-tall', noExpand: true }) + '</main>' + pTabs(r);
  }

  function renderApprovals(r) {
    if (desk()) return renderHome(r);
    var list = openApprovals();
    return pHeader(r) + '<main class="p-main" id="main"><h1>' + (list.length ? list.length + ' need you' : 'All clear') + '</h1>' +
      (list.length ? approvalRows(list, false) : '<p class="lede">Nothing needs you. Sherpa will call if that changes.</p>') +
      (list.length > 1 ? '<button type="button" class="btn primary block lg" data-action="approve-all">' + approveAllLabel(list.length) + '</button>' : '') +
      '</main>' + pTabs(r);
  }

  function renderCamps(r) {
    var tiles = D.CAMPS.map(function (c) {
      var on = isOn(c.id);
      if (on) return '<a href="#camp-' + c.id + '" class="ctile">' + campDisc(c, 48) + '<b>' + esc(c.name) + '</b><span class="soft">' + esc(toolOf(c.id)) + '</span>' +
        '<span class="ctile-num">' + f1(campHours(c.id)) + ' h<small>/wk</small></span><span class="soft">Level ' + level(c) + ' · ' + c.memories.toLocaleString('en-US') + ' memories</span></a>';
      return '<div class="ctile is-off">' + campDisc(c, 48, true) + '<b>' + esc(c.name) + '</b><span class="soft">' + (c.core ? 'Not connected' : 'Unexplored') + '</span>' +
        '<span class="ctile-num">+' + fh(c.hours) + ' h<small>/wk</small></span><button type="button" class="btn ghost sm" data-action="explore" data-camp="' + c.id + '">' + (c.core ? 'Make camp' : 'Explore') + '</button></div>';
    }).join('');
    var body = '<h1>Camps</h1><div class="ctiles">' + tiles + '</div>';
    if (desk()) return dHeader(r) + '<main class="d-page" id="main">' + body + '</main>';
    return pHeader(r) + '<main class="p-main" id="main">' + body + '</main>' + pTabs(r);
  }

  function permGroup(c) {
    var p = state.perms[c.id] || 'ask';
    return '<div class="label">Sherpa may</div><div class="seg wide" role="radiogroup" aria-label="What Sherpa may do in ' + esc(c.name) + '">' +
      [['read', 'Read'], ['ask', 'Ask first'], ['act', 'Act alone']].map(function (o) {
        return '<button type="button" role="radio" aria-checked="' + (p === o[0]) + '" aria-pressed="' + (p === o[0]) + '" data-action="perm" data-camp="' + c.id + '" data-perm="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div>';
  }
  function campInfo(c) {
    var pct = Math.round((c.memories % 500) / 500 * 100);
    return '<h1 class="camp-h1">' + esc(c.name) + '</h1><div class="soft">Level ' + level(c) + ' camp · ' + c.memories.toLocaleString('en-US') + ' memories · ' + esc(toolOf(c.id)) + '</div>' +
      '<div class="label">Next level</div><div class="bar"><span style="width:' + pct + '%"></span></div><div class="soft sm">' + toNext(c) + ' to level ' + (level(c) + 1) + '</div>' +
      '<div class="label">This week</div><div class="row gap24"><div class="col"><span class="stat">+' + f1(campHours(c.id)) + ' h</span><span class="soft sm">back</span></div><div class="col"><span class="stat">' + entries().filter(function (e) { return e.camp === c.id && !e.undone; }).length * 4 + '</span><span class="soft sm">tasks handled</span></div></div>' +
      permGroup(c);
  }
  function campSherpa(c) {
    var t = nextTrail(c.id), waiting = openApprovals().filter(function (a) { return a.camp === c.id; }), today = entries().filter(function (e) { return e.camp === c.id && e.day === 'Today'; });
    return sherpaHead(t ? 'Found a new trail' : 'Your guide') +
      (t ? trailCard(t, true) : '<p class="sp-say">' + esc(c.name) + ' is running well. No new trails here this week.</p>') +
      (waiting.length ? '<div class="label on-pine">Waiting on you here</div>' + approvalRows(waiting, true) : '') +
      '<div class="label on-pine">Today in ' + esc(c.name) + '</div><div class="mini-log">' + (today.length ? today.map(function (e) {
        return '<div class="ml-row"><span class="grow">' + esc(e.text) + '</span><b>' + (e.undone ? 'Undone' : '+' + e.min + 'm') + '</b></div>';
      }).join('') : '<p class="sp-note">Nothing yet today.</p>') + '</div>';
  }
  function renderCamp(r) {
    var c = camp(r.camp);
    if (!isOn(c.id)) {
      var body = '<a href="#camps" class="back">' + icon('back', 16, PINE, 2.5) + 'Camps</a><h1 class="camp-h1">' + esc(c.name) + '</h1>' +
        '<p class="lede">' + (c.core ? 'Not connected yet.' : 'Unexplored.') + ' About +' + fh(c.hours) + ' h a week once camp is made.</p>' + connectBlock(c);
      if (desk()) return dHeader(r) + '<main class="d-page narrow" id="main">' + body + '</main>';
      return pHeader(r, ['camps', 'Camps']) + '<main class="p-main" id="main">' + body.replace(/<a href="#camps" class="back">.*?<\/a>/, '') + '</main>' + pTabs(r);
    }
    if (desk()) {
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left"><a href="#home" class="back">' + icon('back', 16, PINE, 2.5) + 'Back to the map</a>' + campInfo(c) + '</aside>' +
        '<div class="d-center">' + viewPanel(c.id, { ask: 'Ask about ' + c.name }) + '</div><aside class="d-right pine" aria-label="Sherpa">' + campSherpa(c) + '</aside></main>';
    }
    return pHeader(r, ['map', 'Map']) + '<main class="p-main" id="main">' + campInfo(c).replace('<div class="label">Sherpa may</div>', '<div class="p-view-slot"></div><div class="label">Sherpa may</div>') + '</main>' + pTabs(r);
  }

  function renderLog(r) {
    var all = entries(), cats = [['all', 'All camps', elevation()]].concat(D.CAMPS.filter(function (c) { return isOn(c.id); }).map(function (c) { return [c.id, c.name, campHours(c.id)]; }));
    var q = session.logQuery.toLowerCase();
    var shown = all.filter(function (e) { return (session.logCamp === 'all' || e.camp === session.logCamp) && (!q || (e.text + ' ' + camp(e.camp).name + ' ' + e.source).toLowerCase().indexOf(q) > -1); });
    function group(day) { var g = shown.filter(function (e) { return e.day === day; }); return g.length ? '<div class="label">' + day + '</div><div class="log-list">' + logRows(g, !desk()) + '</div>' : ''; }
    var lists = group('Today') + group('Yesterday') || '<p class="lede">Nothing matches.</p>';
    if (desk()) {
      var sel = all.filter(function (e) { return e.id === session.logSel; })[0] || shown[0] || all[0];
      if (sel) session.logSel = sel.id;
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left"><div class="hero-num">+' + f1(elevation()) + ' h</div><div class="soft">This week</div>' +
        '<div class="label">By camp</div><div class="filters" role="group" aria-label="Filter by camp">' + cats.map(function (k) {
          return '<button type="button" class="filter" aria-pressed="' + (session.logCamp === k[0]) + '" data-action="log-camp" data-camp="' + k[0] + '"><span>' + esc(k[1]) + '</span><span class="num">' + f1(k[2]) + '</span></button>';
        }).join('') + '</div><a href="#report" class="btn ghost block">Friday trail report</a></aside>' +
        '<section class="d-center card-pane"><form class="search" data-form="log-search" role="search"><label class="sr" for="log-q">Search the trail log</label><input id="log-q" type="search" placeholder="Search the trail log" value="' + esc(session.logQuery) + '"></form><div class="log-scroll">' + lists + '</div></section>' +
        '<aside class="d-right pine" aria-label="Receipt">' + (sel ? receipt(sel) : '') + '</aside></main>';
    }
    return pHeader(r) + '<main class="p-main" id="main"><h1>Trail log</h1><div class="row base gap8"><span class="stat">+' + f1(elevation()) + ' h</span><span class="soft">this week</span></div>' +
      '<div class="chips scroll-x" role="group" aria-label="Filter by camp">' + cats.map(function (k) {
        return '<button type="button" class="chipbtn" aria-pressed="' + (session.logCamp === k[0]) + '" data-action="log-camp" data-camp="' + k[0] + '">' + esc(k[0] === 'all' ? 'All' : camp(k[0]).short) + '</button>';
      }).join('') + '</div>' + lists + '<a href="#report" class="btn ghost block">Friday trail report</a></main>' + pTabs(r);
  }
  function receipt(e) {
    return '<h2 class="rc-title">' + esc(e.text) + '</h2><div class="rc-meta">' + esc(camp(e.camp).name) + ' · ' + e.day + ', ' + e.time + '</div>' +
      '<div class="rc-min">' + (e.undone ? 'Undone' : '+' + e.min + ' min') + '</div><div class="rc-sub">' + (e.undone ? 'Sherpa will ask first next time.' : 'Your usual time for this') + '</div>' +
      '<div class="label on-pine">Source</div><div class="rc-src">' + esc(e.source) + '</div>' +
      '<div class="rc-actions"><button type="button" class="btn mist block" data-action="open-source" data-src="' + esc(e.source) + '">Open in ' + esc(e.source) + '</button>' +
      (e.undone ? '' : '<button type="button" class="btn ghost-mist block" data-action="undo" data-id="' + e.id + '">Undo</button>') + '</div>';
  }

  function renderReport(r) {
    var on = D.CAMPS.filter(function (c) { return isOn(c.id); }), max = Math.max.apply(null, on.map(function (c) { return campHours(c.id); }).concat([1]));
    var t = nextTrail(), u = unexplored()[0];
    var next = t ? 'Hand me "' + t.title.toLowerCase() + '" for about +' + fh(t.hours) + ' h.' : u ? 'Explore ' + u.name + ' for about +' + fh(u.hours) + ' h.' : 'Hold the line. You are near the top.';
    var body = '<article class="report"><header class="rp-head">' + sherpaDisc(false, 44) + '<div class="grow col"><b>Sherpa</b><span class="soft">Friday trail report · Example data</span></div>' +
      '<a href="#log" class="icon-btn" aria-label="Close">' + icon('close', 16, PINE, 2.5) + '</a></header>' +
      '<div class="rp-hero"><span>' + f1(elevation()) + '</span><b>hours back</b></div><p class="soft">Up ' + f1(delta()) + '. ' + (toGo() > 0 ? fh(toGo()) + ' to the summit.' : 'Summit reached.') + '</p>' +
      '<div class="label">By camp</div><div class="bars">' + on.map(function (c) {
        return '<div class="bar-row"><span class="br-name">' + esc(c.name) + '</span><span class="br-track"><span style="width:' + Math.round(campHours(c.id) / max * 100) + '%"></span></span><b class="num">' + f1(campHours(c.id)) + '</b></div>';
      }).join('') + '</div>' +
      '<div class="label">The week</div><p>' + todayMinutes() + ' minutes back today. ' + (state.approvals.a1 ? 'Sarah has her follow-up.' : 'Halcyon signed.') + '</p>' +
      '<div class="label">Next week</div><p>' + esc(next) + '</p>' +
      '<div class="rp-actions">' + (t ? '<button type="button" class="btn primary block lg" data-action="take" data-id="' + t.id + '">Hand it over</button>' : u ? '<button type="button" class="btn primary block lg" data-action="explore" data-camp="' + u.id + '">Explore ' + esc(u.name) + '</button>' : '') +
      '<a href="#log" class="btn text block">Open trail log</a></div></article>';
    if (desk()) return dHeader(r) + '<main class="d-page center" id="main">' + body + '</main>';
    return pHeader(r) + '<main class="p-main" id="main">' + body + '</main>' + pTabs(r);
  }

  function renderGear(r) {
    var body = '<h1>Gear</h1>' +
      '<div class="label">Your AI</div><p class="soft">Base Camp runs on any model. Switch any time. Your memories stay yours.</p><div class="tiles2" role="radiogroup" aria-label="AI model">' + D.MODELS.map(function (m) {
        return '<button type="button" class="tile-radio" role="radio" aria-checked="' + (state.model === m.id) + '" data-action="model" data-model="' + m.id + '"><b>' + m.id + '</b><span>' + m.by + '</span></button>';
      }).join('') + '</div>' +
      '<div class="label">Your name</div><form class="row gap8" data-form="rename"><label class="sr" for="gear-name">Your first name</label><input id="gear-name" class="input grow" type="text" value="' + esc(state.name) + '" autocomplete="given-name"><button type="submit" class="btn ghost">Save</button></form>' +
      '<div class="label">Your summit</div><div class="row base gap8"><span class="stat">' + state.summit + ' h</span><span class="soft">a week, for ' + esc(state.why.toLowerCase()) + '</span></div><div class="chips">' + [-5, 5].map(function (d) { return '<button type="button" class="chipbtn" data-action="gear-summit" data-d="' + d + '">' + (d > 0 ? '+' : '') + d + ' h</button>'; }).join('') + '</div>' +
      '<div class="label">Protected time</div><div class="chips" role="group" aria-label="Protected time">' + ['Friday afternoons', 'Mornings until 10', 'Evenings after 6'].map(function (p) {
        return '<button type="button" class="chipbtn" aria-pressed="' + (state.protect === p) + '" data-action="protect" data-p="' + esc(p) + '">' + esc(p) + '</button>';
      }).join('') + '</div>' +
      '<div class="label">Demo</div>' + (session.confirmReset ?
        '<p>Start over? This clears your name, summit, camps and trail log on this device.</p><div class="row gap8"><button type="button" class="btn primary" data-action="reset">Start over</button><button type="button" class="btn ghost" data-action="reset-cancel">Keep my climb</button></div>' :
        '<button type="button" class="btn ghost" data-action="reset-ask">Start over</button>');
    if (desk()) return dHeader(r) + '<main class="d-page narrow" id="main">' + body + '</main>';
    return pHeader(r) + '<main class="p-main" id="main">' + body + '</main>' + pTabs(r);
  }

  var ROSETTE = 'M262.5 128.0 L261.1 131.2 L257.8 134.2 L254.5 137.0 L252.9 139.9 L253.8 143.0 L256.5 146.5 L259.2 150.1 L259.8 153.5 L257.8 156.3 L254.0 158.5 L250.1 160.6 L247.9 163.1 L248.2 166.3 L250.2 170.3 L252.0 174.4 L251.9 177.8 L249.4 180.2 L245.1 181.6 L240.9 182.8 L238.3 184.8 L237.9 188.0 L239.0 192.3 L239.9 196.6 L239.1 200.0 L236.1 201.8 L231.7 202.3 L227.3 202.6 L224.3 203.9 L223.3 207.0 L223.4 211.4 L223.4 215.9 L222.0 219.0 L218.7 220.1 L214.3 219.7 L209.9 219.1 L206.7 219.8 L205.0 222.6 L204.3 227.0 L203.3 231.3 L201.2 234.1 L197.8 234.5 L193.6 233.1 L189.4 231.6 L186.2 231.7 L183.9 234.1 L182.3 238.2 L180.5 242.2 L177.9 244.5 L174.4 244.2 L170.5 242.0 L166.8 239.6 L163.6 239.0 L160.9 240.9 L158.5 244.5 L155.8 248.1 L152.8 249.8 L149.5 248.8 L146.2 245.8 L143.0 242.8 L140.0 241.5 L137.0 242.8 L133.8 245.8 L130.5 248.8 L127.2 249.8 L124.2 248.1 L121.5 244.5 L119.1 240.9 L116.4 239.0 L113.2 239.6 L109.5 242.0 L105.6 244.2 L102.1 244.5 L99.5 242.2 L97.7 238.2 L96.1 234.1 L93.8 231.7 L90.6 231.6 L86.4 233.1 L82.2 234.5 L78.8 234.1 L76.7 231.3 L75.7 227.0 L75.0 222.6 L73.3 219.8 L70.1 219.1 L65.7 219.7 L61.3 220.1 L58.0 219.0 L56.6 215.9 L56.6 211.4 L56.7 207.0 L55.7 203.9 L52.7 202.6 L48.3 202.3 L43.9 201.8 L40.9 200.0 L40.1 196.6 L41.0 192.3 L42.1 188.0 L41.7 184.8 L39.1 182.8 L34.9 181.6 L30.6 180.2 L28.1 177.8 L28.0 174.4 L29.8 170.3 L31.8 166.3 L32.1 163.1 L29.9 160.6 L26.0 158.5 L22.2 156.3 L20.2 153.5 L20.8 150.1 L23.5 146.5 L26.2 143.0 L27.1 139.9 L25.5 137.0 L22.2 134.2 L18.9 131.2 L17.5 128.0 L18.9 124.8 L22.2 121.8 L25.5 119.0 L27.1 116.1 L26.2 113.0 L23.5 109.5 L20.8 105.9 L20.2 102.5 L22.2 99.7 L26.0 97.5 L29.9 95.4 L32.1 92.9 L31.8 89.7 L29.8 85.7 L28.0 81.6 L28.1 78.2 L30.6 75.8 L34.9 74.4 L39.1 73.2 L41.7 71.3 L42.1 68.0 L41.0 63.7 L40.1 59.4 L40.9 56.0 L43.9 54.2 L48.3 53.7 L52.7 53.4 L55.7 52.1 L56.7 49.0 L56.6 44.6 L56.6 40.1 L58.0 37.0 L61.3 35.9 L65.7 36.3 L70.1 36.9 L73.3 36.2 L75.0 33.4 L75.7 29.0 L76.7 24.7 L78.7 21.9 L82.2 21.5 L86.4 22.9 L90.6 24.4 L93.8 24.3 L96.1 21.9 L97.7 17.8 L99.5 13.8 L102.1 11.5 L105.6 11.8 L109.5 14.0 L113.2 16.4 L116.4 17.0 L119.1 15.1 L121.5 11.5 L124.2 7.9 L127.2 6.2 L130.5 7.2 L133.8 10.2 L137.0 13.2 L140.0 14.5 L143.0 13.2 L146.2 10.2 L149.5 7.2 L152.8 6.2 L155.8 7.9 L158.5 11.5 L160.9 15.1 L163.6 17.0 L166.8 16.4 L170.5 14.0 L174.4 11.8 L177.9 11.5 L180.5 13.8 L182.3 17.8 L183.9 21.9 L186.2 24.3 L189.4 24.4 L193.6 22.9 L197.8 21.5 L201.2 21.9 L203.3 24.7 L204.3 29.0 L205.0 33.4 L206.7 36.2 L209.9 36.9 L214.3 36.3 L218.7 35.9 L222.0 37.0 L223.4 40.1 L223.4 44.6 L223.3 49.0 L224.3 52.1 L227.3 53.4 L231.7 53.7 L236.1 54.2 L239.1 56.0 L239.9 59.4 L239.0 63.7 L237.9 68.0 L238.3 71.3 L240.9 73.2 L245.1 74.4 L249.4 75.8 L251.9 78.2 L252.0 81.6 L250.2 85.7 L248.2 89.7 L247.9 92.9 L250.1 95.4 L254.0 97.5 L257.8 99.7 L259.8 102.5 L259.2 105.9 L256.5 109.5 L253.8 113.0 L252.9 116.1 L254.5 119.0 L257.8 121.8 L261.1 124.8 Z';
  function award(hours, name, n) {
    return '<svg class="award" viewBox="0 0 280 340" role="img" aria-label="Summit award ' + n + ', awarded to ' + esc(name) + ': ' + hours + ' hours a week, ' + monthTag() + '">' +
      '<defs><path id="award-arc" d="M 56 128 A 84 84 0 0 1 224 128"/></defs>' +
      '<polygon points="92,186 134,196 98,326 76,306 52,320" fill="' + PINE + '"/><polygon points="146,196 188,186 228,320 204,306 182,326" fill="' + PINE + '"/>' +
      '<line x1="113" y1="191" x2="79" y2="300" stroke="' + MIST + '" stroke-opacity="0.5" stroke-width="1.5"/><line x1="167" y1="191" x2="201" y2="300" stroke="' + MIST + '" stroke-opacity="0.5" stroke-width="1.5"/>' +
      '<path d="' + ROSETTE + '" fill="' + PINE + '"/>' +
      '<circle cx="140" cy="128" r="104" fill="none" stroke="' + MIST + '" stroke-width="2"/><circle cx="140" cy="128" r="98" fill="none" stroke="' + MIST + '" stroke-opacity="0.45" stroke-width="1"/>' +
      '<text font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="2.5" fill="' + MIST + '"><textPath href="#award-arc" startOffset="50%" text-anchor="middle">AWARDED TO ' + esc(name.toUpperCase()) + '</textPath></text>' +
      '<image href="assets/icon-white.svg" x="124" y="62" width="32" height="35"/>' +
      '<text x="140" y="146" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="46" font-weight="900" letter-spacing="-2" fill="' + MIST + '">' + hours + ' H</text>' +
      '<text x="140" y="164" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="800" letter-spacing="2.5" fill="' + MIST + '">HOURS A WEEK</text>' +
      '<polygon points="14,174 266,174 254,188 266,202 14,202 26,188" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<text x="140" y="193" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="3" fill="' + PINE + '">SUMMIT ' + ('0' + n).slice(-2) + '</text>' +
      '<text x="140" y="222" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="700" letter-spacing="2.5" fill="' + MIST + '">' + monthTag() + '</text></svg>';
  }
  var nextPick = null;
  function renderSummit(r) {
    var reached = elevation() >= state.summit;
    var hrs = state.summit, n = Math.max(1, state.summits + (reached && state.reached !== state.summit ? 1 : 0));
    var opts = [[hrs + 5, 'The next ridge', 'Suggested'], [hrs + 10, 'The high pass', unexplored().length ? 'Needs new camps' : 'A long climb'], [hrs, 'Hold', 'Stay at ' + hrs]];
    if (!nextPick) nextPick = opts[0][0];
    var body = '<div class="summit-wrap">' + award(hrs, state.name, n) +
      (reached ? '<h1>You made the summit</h1><p class="lede">' + hrs + ' hours a week, back for ' + esc(state.why.toLowerCase()) + '.</p>' +
        '<div class="label">Your next summit</div><div class="tiles3" role="radiogroup" aria-label="Next summit">' + opts.map(function (o, i) {
          var val = i === 2 ? 'hold' : o[0];
          return '<button type="button" class="tile-radio" role="radio" aria-checked="' + (String(nextPick) === String(val)) + '" data-action="next-pick" data-v="' + val + '"><b>' + (i === 2 ? 'Hold' : o[0] + ' h') + '</b><span>' + o[1] + '</span><small>' + o[2] + '</small></button>';
        }).join('') + '</div>' +
        '<div class="row gap12 center"><button type="button" class="btn primary lg" data-action="next-set">' + (nextPick === 'hold' ? 'Hold at ' + hrs : 'Set ' + nextPick + ' hours') + '</button><button type="button" class="btn ghost lg" data-action="share">Share the award</button></div>'
        : '<h1>Not there yet</h1><p class="lede">' + fh(toGo()) + ' hours to go. Hand Sherpa more trails or explore a new camp.</p><a href="#home" class="btn primary lg">Back to the climb</a>') +
      '</div>';
    if (desk()) return dHeader(r) + '<main class="d-page summit" id="main"><img class="tex" src="assets/texture-mist.svg" alt="">' + body + '</main>';
    return pHeader(r) + '<main class="p-main summit" id="main"><img class="tex" src="assets/texture-mist.svg" alt="">' + body + '</main>' + pTabs(r);
  }

  /* ================= map ================= */
  var GEO = {
    land: {
      img: 'assets/terrain.svg', w: 1440, h: 1000, crop: [92, 88, 827, 857],
      pts: { trailhead: [120, 800], mail: [250, 650], chat: [470, 712], clients: [700, 600], money: [440, 500], base: [640, 410], summit: [560, 150], projects: [170, 420], support: [840, 720], sherpa: [577, 556] },
      side: { mail: 'top', chat: 'bottom', clients: 'right', money: 'left', base: 'left', summit: 'left', projects: 'top', support: 'bottom' },
      setup: 'M120 800 C125 792 137 767 150 752 C163 737 183 725 200 708 C217 691 230 653 250 650 C270 647 293 679 318 688 C343 697 373 700 398 704 C423 708 443 714 470 712 C497 710 533 704 560 694 C587 684 609 668 632 652 C655 636 701 614 700 600 C699 586 653 575 624 566 C595 557 559 559 528 548 C497 537 445 516 440 500 C435 484 474 461 496 452 C518 443 548 451 572 444 C596 437 616 425 640 410',
      climb: 'M640 410 C664 395 704 374 716 356 C728 338 723 317 712 300 C701 283 668 270 650 254 C632 238 619 221 604 204 C589 187 567 159 560 150'
    },
    port: {
      img: 'assets/terrain-portrait.svg', w: 350, h: 685, crop: [0, 0, 350, 685],
      pts: { trailhead: [94, 649], mail: [249, 589], chat: [109, 519], clients: [269, 449], money: [89, 379], base: [219, 299], summit: [174, 69], projects: [304, 629], support: [299, 169], sherpa: [179, 408] },
      side: { mail: 'top', chat: 'left', clients: 'bottom', money: 'left', base: 'left', summit: 'right', projects: 'left', support: 'bottom' },
      setup: 'M95 650 C101 646 112 634 130 628 C148 622 180 621 200 615 C220 609 250 599 250 590 C250 581 218 568 200 560 C182 552 155 547 140 540 C125 533 105 529 110 520 C115 511 148 496 170 488 C192 480 223 476 240 470 C257 464 273 458 270 450 C267 442 242 428 220 420 C198 412 162 407 140 400 C118 393 92 389 90 380 C88 371 114 354 130 345 C146 336 170 332 185 325 C200 318 208 310 220 300',
      climb: 'M220 300 C232 290 253 278 258 268 C263 258 258 247 250 238 C242 229 222 221 210 212 C201 205 189 201 183 193 C182 191 180 189 180 186 C178 174 198 154 200 140 C202 126 194 117 190 105 C186 93 178 76 175 70'
    }
  };
  var measure = null;
  function pathTool(d) {
    if (!measure) {
      var holder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      holder.setAttribute('width', '0'); holder.setAttribute('height', '0'); holder.setAttribute('aria-hidden', 'true');
      holder.style.position = 'absolute'; holder.style.left = '-9999px';
      measure = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      holder.appendChild(measure); document.body.appendChild(holder);
    }
    measure.setAttribute('d', d);
    return { len: measure.getTotalLength(), at: function (l) { var p = measure.getPointAtLength(l); return [p.x, p.y]; } };
  }
  function halo(x, y, txt, k, o) {
    o = o || {};
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + r1((o.size || 12) * k) + '" font-weight="' + (o.weight || 800) + '" letter-spacing="' + r1((o.ls == null ? 0.7 : o.ls) * k) + '" fill="' + (o.fill || PINE) + '" ' + (o.opacity ? 'fill-opacity="' + o.opacity + '" ' : '') +
      'stroke="' + MIST + '" stroke-width="' + r1(5 * k) + '" stroke-linejoin="round" paint-order="stroke" class="lbl">' + esc(txt) + '</text>';
  }
  function labelAt(p, side, rpx, k, lines) {
    var out = '', gap = (rpx + 8) * k, x = p[0], y = p[1], anchor = 'middle', lh = 15 * k, y0;
    if (side === 'right') { x += gap; anchor = 'start'; y0 = y + 4 * k - (lines.length - 1) * lh / 2; }
    else if (side === 'left') { x -= gap; anchor = 'end'; y0 = y + 4 * k - (lines.length - 1) * lh / 2; }
    else if (side === 'top') { y0 = y - gap - (lines.length - 1) * lh; }
    else { y0 = y + gap + 10 * k; }
    lines.forEach(function (l, i) { out += halo(x, y0 + i * lh, l.t, k, { anchor: anchor, size: l.size || 12, weight: l.w || 800, opacity: l.o, ls: l.ls }); });
    return out;
  }
  function focusBox(g, id, W, H) {
    var p = typeof id === 'string' ? g.pts[id] : id, vw = g === GEO.land ? 520 : 280, vh = vw * H / W;
    if (vh > g.h) { vh = g.h; vw = vh * W / H; }
    var x = clamp(p[0] - vw / 2, 0, g.w - vw), y = clamp(p[1] - vh / 2, 0, g.h - vh);
    return [r1(x), r1(y), r1(vw), r1(vh)];
  }
  function drawMap(host, opts) {
    var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
    var g = H / W > 1.15 || W < 480 ? GEO.port : GEO.land;
    var onb = !state.onboarded, e = elevation(), s = [];
    var ct = pathTool(g.climb), frac = onb ? 0 : clamp(e / state.summit, 0, 1);
    var you = onb ? g.pts.trailhead : (frac > 0 ? ct.at(ct.len * frac) : g.pts.base);
    var vb = opts.focus ? focusBox(g, opts.focus, W, H) : opts.center === 'you' ? focusBox(g, you, W, H) : g.crop;
    var k = 1 / Math.max(W / vb[2], H / vb[3]);
    s.push('<svg class="map-svg" xmlns="http://www.w3.org/2000/svg" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid slice" width="' + W + '" height="' + H + '">');
    s.push('<image href="' + g.img + '" x="0" y="0" width="' + g.w + '" height="' + g.h + '" preserveAspectRatio="none"/>');
    var dim = function (id) { return opts.focus && opts.focus !== id ? ' opacity="0.3"' : ''; };
    // the setup trail
    s.push('<path d="' + g.setup + '" fill="none" stroke="' + PINE + '"' + (onb ? ' stroke-opacity="0.55" stroke-width="' + r1(2.5 * k) + '" stroke-dasharray="0 ' + r1(8 * k) + '"' : ' stroke-width="' + r1(3.5 * k) + '"') + ' stroke-linecap="round" stroke-linejoin="round"' + (opts.focus ? ' opacity="0.45"' : '') + '/>');
    // the climb: dotted ahead, solid walked
    s.push('<path d="' + g.climb + '" fill="none" stroke="' + PINE + '" stroke-width="' + r1(2.5 * k) + '" stroke-dasharray="0 ' + r1(8 * k) + '" stroke-linecap="round"' + (opts.focus ? ' opacity="0.45"' : '') + '/>');
    if (frac > 0) s.push('<path d="' + g.climb + '" fill="none" stroke="' + PINE + '" stroke-width="' + r1(3.5 * k) + '" stroke-dasharray="' + r1(ct.len * frac) + ' ' + r1(ct.len * 2) + '" stroke-linecap="round"' + (opts.focus ? ' opacity="0.45"' : '') + '/>');
    // waypoints
    if (!opts.focus) [0.25, 0.5, 0.75].forEach(function (f) {
      var p = ct.at(ct.len * f);
      s.push('<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(5 * k) + '" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>');
      if (onb || Math.abs(f - frac) > 0.1) s.push(halo(p[0] + 10 * k, p[1] + 4 * k, fh(state.summit * f) + ' h', k, { anchor: 'start', size: 12, weight: 700, ls: 0 }));
    });
    // trailhead
    var th = g.pts.trailhead;
    s.push('<g' + dim('x') + ' class="mk" data-action="toast" data-msg="The trailhead. Where your climb started." role="button" tabindex="0" aria-label="Trailhead"><circle cx="' + th[0] + '" cy="' + th[1] + '" r="' + r1(18 * k) + '" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>' + iconAt('trailhead', th, 18 * k, PINE) + '</g>');
    // camps
    D.CAMPS.forEach(function (c) {
      var p = g.pts[c.id], on = isOn(c.id), big = opts.focus === c.id;
      var rpx = big ? 30 : c.core ? 24 : 21, rr = rpx * k;
      var action = onb ? (c.core ? 'row' : 'toast') : on ? 'open-camp' : 'explore';
      var lines = [{ t: c.name.toUpperCase() }];
      if (big) { lines = [{ t: c.name.toUpperCase(), size: 15 }, { t: 'LEVEL ' + level(c) + ' · ' + c.memories.toLocaleString('en-US') + ' MEMORIES', size: 11, w: 700 }, { t: '+' + f1(campHours(c.id)) + ' H A WEEK', size: 11, w: 700 }]; }
      else if (!on) lines.push({ t: '+' + fh(c.hours) + ' H', size: 11, w: 600, o: 0.72 });
      s.push('<g class="mk" data-action="' + action + '" data-camp="' + c.id + '" data-msg="Projects and Support open up after Base Camp." role="button" tabindex="0" aria-label="' + esc(c.name) + (on ? ' camp' : ', not connected') + '"' + dim(c.id) + '>' +
        (big ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r1(rr + 9 * k) + '" fill="none" stroke="' + PINE + '" stroke-opacity="0.72" stroke-width="' + r1(1 * k) + '"/>' : '') +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r1(rr) + '" fill="' + MIST + '" stroke="' + PINE + '"' + (on ? '' : ' stroke-opacity="0.72" stroke-dasharray="' + r1(4 * k) + ' ' + r1(4 * k) + '"') + ' stroke-width="' + r1(2 * k) + '"/>' +
        iconAt(c.icon, p, (big ? 26 : 22) * k, on ? PINE : 'rgba(28,58,40,0.72)') +
        labelAt(p, g.side[c.id], rpx, k, lines) + '</g>');
    });
    // base camp
    var b = g.pts.base;
    s.push('<g class="mk" data-action="' + (onb ? 'toast' : 'go') + '" data-to="gear" data-msg="Base Camp is where you pick your AI. Last step." role="button" tabindex="0" aria-label="Base Camp, ' + esc(state.model) + '"' + dim('base') + '><circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + r1(24 * k) + '" fill="' + MIST + '" stroke="' + PINE + '"' + (onb ? ' stroke-dasharray="' + r1(4 * k) + ' ' + r1(4 * k) + '" stroke-opacity="0.72"' : '') + ' stroke-width="' + r1(2 * k) + '"/>' + iconAt('base', b, 22 * k, PINE) +
      labelAt(b, g.side.base, 24, k, onb ? [{ t: 'BASE CAMP' }] : [{ t: 'BASE CAMP' }, { t: state.model.toUpperCase(), size: 11, w: 600, o: 0.72 }]) + '</g>');
    // summit
    var sm = g.pts.summit;
    s.push('<g class="mk" data-action="summit" role="button" tabindex="0" aria-label="Summit, ' + state.summit + ' hours a week"' + dim('summit') + '><circle cx="' + sm[0] + '" cy="' + sm[1] + '" r="' + r1(24 * k) + '" fill="' + (e >= state.summit && !onb ? PINE : MIST) + '" stroke="' + PINE + '" stroke-dasharray="' + (e >= state.summit && !onb ? '0' : r1(4 * k) + ' ' + r1(4 * k)) + '" stroke-width="' + r1(2 * k) + '"/>' + iconAt('flag', sm, 22 * k, e >= state.summit && !onb ? MIST : PINE) +
      labelAt(sm, g.side.summit, 24, k, [{ t: 'SUMMIT · ' + state.summit + ' H', size: 13 }, { t: state.why.toUpperCase(), size: 11, w: 600, o: 0.72 }]) + '</g>');
    // the climber
    if (!onb) {
      var yr = 19 * k, img = 18 * k, txt = f1(e) + ' h', pw = (44 + txt.length * 10) * k, ph = 32 * k;
      var fitsR = you[0] + yr + 8 * k + pw < vb[0] + vb[2] - 8 * k, fitsL = you[0] - yr - 8 * k - pw > vb[0] + 8 * k;
      var right = g === GEO.port ? !fitsL : fitsR, px = right ? you[0] + yr + 8 * k : you[0] - yr - 8 * k - pw, py = you[1] - ph / 2;
      s.push('<g class="mk" data-action="go" data-to="log" role="button" tabindex="0" aria-label="You, ' + f1(e) + ' hours a week"' + dim('you') + '>' +
        '<circle cx="' + r1(you[0]) + '" cy="' + r1(you[1]) + '" r="' + r1(yr) + '" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>' +
        '<image href="assets/climber.svg" x="' + r1(you[0] - img / 2) + '" y="' + r1(you[1] - img / 2 - 1 * k) + '" width="' + r1(img) + '" height="' + r1(img * 1.09) + '"/>' +
        '<rect x="' + r1(px) + '" y="' + r1(py) + '" width="' + r1(pw) + '" height="' + r1(ph) + '" rx="' + r1(ph / 2) + '" fill="' + PINE + '"/>' +
        '<text x="' + r1(px + 12 * k) + '" y="' + r1(py + ph / 2 + 4 * k) + '" font-size="' + r1(10.5 * k) + '" font-weight="700" letter-spacing="' + r1(0.7 * k) + '" fill="' + MIST + '" fill-opacity="0.72">YOU</text>' +
        '<text x="' + r1(px + 40 * k) + '" y="' + r1(py + ph / 2 + 5.5 * k) + '" font-size="' + r1(16 * k) + '" font-weight="800" fill="' + MIST + '">' + txt + '</text></g>');
      // Sherpa, out working
      var sp = g.pts.sherpa;
      s.push('<g class="mk" data-action="toast" data-msg="Sherpa is in Clients, filing call notes." role="button" tabindex="0" aria-label="Sherpa"' + dim('sherpa') + '><circle cx="' + sp[0] + '" cy="' + sp[1] + '" r="' + r1(16 * k) + '" fill="' + PINE + '" stroke="' + MIST + '" stroke-width="' + r1(2 * k) + '"/>' +
        '<image href="assets/icon-white.svg" x="' + r1(sp[0] - 8 * k) + '" y="' + r1(sp[1] - 9 * k) + '" width="' + r1(16 * k) + '" height="' + r1(17 * k) + '"/></g>');
    }
    s.push('</svg>');
    host.innerHTML = s.join('');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', opts.focus ? camp(opts.focus).name + ' on the mountain map.' : 'Mountain map. ' + (onb ? 'Setting up.' : 'You are at ' + f1(e) + ' hours a week of a ' + state.summit + ' hour summit.'));
  }
  function iconAt(name, p, size, color) {
    var sc = size / 24;
    return '<g transform="translate(' + r1(p[0] - size / 2) + ' ' + r1(p[1] - size / 2) + ') scale(' + (Math.round(sc * 1000) / 1000) + ')" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</g>';
  }

  /* ================= brain ================= */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function seedOf(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function makeCluster(r, cx, cy, n, sigma) {
    var nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: cx + gauss(r) * sigma, y: cy + gauss(r) * sigma * 0.85, z: r() });
    var edges = [];
    nodes.forEach(function (a, i) {
      var d = nodes.map(function (b, j) { return [j, (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)]; }).filter(function (q) { return q[0] !== i; }).sort(function (p, q) { return p[1] - q[1]; });
      for (var m = 0; m < Math.min(2, d.length); m++) if (d[m][0] > i || m === 0) edges.push([i, d[m][0]]);
    });
    return { nodes: nodes, edges: edges };
  }
  var brainCache = {};
  function shape(key, n, sigma) {
    if (brainCache['s-' + key]) return brainCache['s-' + key];
    var g = makeCluster(rng(seedOf(key)), 0, 0, n, sigma);
    brainCache['s-' + key] = g; return g;
  }
  function place(sh, cx, cy) { return sh.nodes.map(function (p) { return { x: cx + p.x, y: cy + p.y, z: p.z }; }); }
  function wholeLayout(portrait) {
    var key = 'whole' + (portrait ? 'P' : 'L');
    if (brainCache[key]) return brainCache[key];
    var Rx = portrait ? 190 : 300, Ry = portrait ? 330 : 258;
    var cl = D.CAMPS.map(function (c, i) {
      var a = (-90 + i * 60) * Math.PI / 180, cx = Math.cos(a) * Rx, cy = Math.sin(a) * Ry;
      var n = clamp(Math.round(Math.sqrt(c.memories) * 1.6), 18, 80);
      var sh = shape('w-' + c.id, n, 24 + Math.sqrt(n) * 4.2);
      return { camp: c, cx: cx, cy: cy, a: a, nodes: place(sh, cx, cy), edges: sh.edges };
    });
    brainCache[key] = cl; return cl;
  }
  function campLayout(c, portrait) {
    var key = 'c-' + c.id + (portrait ? 'P' : 'L');
    if (brainCache[key]) return brainCache[key];
    var Rx = portrait ? 165 : 240, Ry = portrait ? 290 : 205, gs = c.groups.length;
    var groups = c.groups.map(function (g, i) {
      var a = (-90 + i * 360 / gs) * Math.PI / 180, cx = Math.cos(a) * Rx, cy = Math.sin(a) * Ry;
      var n = clamp(Math.round(Math.sqrt(g[1]) * 2.6), 10, 48);
      var sh = shape('g-' + c.id + '-' + i, n, 18 + Math.sqrt(n) * 3.6);
      return { name: g[0], count: g[1], cx: cx, cy: cy, a: a, nodes: place(sh, cx, cy), edges: sh.edges };
    });
    var named = c.named.map(function (m) {
      var g = groups[m[1]], tx = g.cx - Math.cos(g.a) * 30, ty = g.cy - Math.sin(g.a) * 30;
      var best = g.nodes.slice().sort(function (p, q) { return Math.hypot(p.x - tx, p.y - ty) - Math.hypot(q.x - tx, q.y - ty); })[0];
      return { name: m[0], group: g.name, x: best.x, y: best.y };
    });
    brainCache[key] = { groups: groups, named: named }; return brainCache[key];
  }
  function nodesSvg(nodes, edges, k, op) {
    var s = '';
    edges.forEach(function (e) { var a = nodes[e[0]], b = nodes[e[1]]; s += '<line x1="' + r1(a.x) + '" y1="' + r1(a.y) + '" x2="' + r1(b.x) + '" y2="' + r1(b.y) + '"/>'; });
    var g = '<g stroke="' + PINE + '" stroke-opacity="' + (0.2 * op) + '" stroke-width="' + r1(1 * k) + '">' + s + '</g><g fill="' + PINE + '">';
    nodes.forEach(function (n) { g += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="' + r1((1.6 + n.z * 2.6) * k) + '" fill-opacity="' + r1((0.3 + n.z * 0.6) * op * 100) / 100 + '"/>'; });
    return g + '</g>';
  }
  function drawBrain(host, opts) {
    var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
    var s = [], vb, k, portrait = H / W > 1.15 || W < 480;
    if (!opts.camp) {
      vb = portrait ? [-330, -490, 660, 980] : [-480, -430, 960, 860]; k = 1 / Math.min(W / vb[2], H / vb[3]);
      s.push('<svg class="brain-svg" xmlns="http://www.w3.org/2000/svg" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" width="' + W + '" height="' + H + '">');
      var cl = wholeLayout(portrait), off = portrait ? 100 : 120;
      cl.forEach(function (c) { if (isOn(c.camp.id)) s.push('<line x1="0" y1="0" x2="' + r1(c.cx) + '" y2="' + r1(c.cy) + '" stroke="' + PINE + '" stroke-opacity="0.45" stroke-width="' + r1(1.5 * k) + '"/>'); });
      cl.forEach(function (c) {
        var on = isOn(c.camp.id), lx = c.cx + Math.cos(c.a) * off, ly = c.cy + Math.sin(c.a) * (off - 10);
        if (on) {
          s.push('<g class="mk" data-action="open-camp" data-camp="' + c.camp.id + '" role="button" tabindex="0" aria-label="' + esc(c.camp.name) + ' camp, ' + c.camp.memories + ' memories">' +
            '<circle cx="' + r1(c.cx) + '" cy="' + r1(c.cy) + '" r="115" fill="' + MIST + '" fill-opacity="0"/>' + nodesSvg(c.nodes, c.edges, k, 1) +
            '<circle cx="' + r1(c.cx) + '" cy="' + r1(c.cy) + '" r="' + r1(9 * k) + '" fill="' + PINE + '"/>' +
            halo(lx, ly - 2 * k, c.camp.name.toUpperCase(), k, { size: 12 }) + halo(lx, ly + 13 * k, c.camp.memories.toLocaleString('en-US') + ' memories', k, { size: 11, weight: 600, ls: 0, opacity: 0.72 }) + '</g>');
        } else {
          s.push('<g class="mk" data-action="explore" data-camp="' + c.camp.id + '" role="button" tabindex="0" aria-label="' + esc(c.camp.name) + ', not connected">' +
            '<circle cx="' + r1(c.cx) + '" cy="' + r1(c.cy) + '" r="70" fill="' + MIST + '" stroke="' + PINE + '" stroke-opacity="0.6" stroke-width="' + r1(1.5 * k) + '" stroke-dasharray="' + r1(5 * k) + ' ' + r1(5 * k) + '"/>' +
            iconAt(c.camp.icon, [c.cx, c.cy], 26 * k, 'rgba(28,58,40,0.72)') +
            halo(c.cx, c.cy + 70 + 18 * k, c.camp.name.toUpperCase(), k, { size: 12, opacity: 0.72 }) + halo(c.cx, c.cy + 70 + 33 * k, '+' + fh(c.camp.hours) + ' h a week', k, { size: 11, weight: 600, ls: 0, opacity: 0.72 }) + '</g>');
        }
      });
      s.push('<g class="mk" data-action="toast" data-msg="Sherpa holds every camp\'s memory in one place. Any AI can use it." role="button" tabindex="0" aria-label="Sherpa"><circle cx="0" cy="0" r="' + r1(30 * k) + '" fill="' + PINE + '"/><image href="assets/icon-white.svg" x="' + r1(-15 * k) + '" y="' + r1(-17 * k) + '" width="' + r1(30 * k) + '" height="' + r1(32 * k) + '"/>' +
        halo(0, 30 * k + 20 * k, 'SHERPA', k, { size: 12 }) + '</g>');
    } else {
      var c = camp(opts.camp), L = campLayout(c, portrait), goff = portrait ? 78 : 92;
      vb = portrait ? [-300, -430, 600, 860] : [-440, -380, 880, 760]; k = 1 / Math.min(W / vb[2], H / vb[3]);
      s.push('<svg class="brain-svg" xmlns="http://www.w3.org/2000/svg" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" width="' + W + '" height="' + H + '">');
      L.groups.forEach(function (g) { s.push('<line x1="0" y1="0" x2="' + r1(g.cx) + '" y2="' + r1(g.cy) + '" stroke="' + PINE + '" stroke-opacity="0.35" stroke-width="' + r1(1.2 * k) + '"/>'); });
      L.groups.forEach(function (g) {
        var lx = g.cx + Math.cos(g.a) * goff, ly = g.cy + Math.sin(g.a) * (goff - 10) + 4 * k;
        s.push('<g class="mk" data-action="toast" data-msg="' + esc(g.count + ' ' + g.name.toLowerCase() + ' remembered in ' + c.name + '.') + '" role="button" tabindex="0" aria-label="' + esc(g.name + ', ' + g.count) + '">' +
          '<circle cx="' + r1(g.cx) + '" cy="' + r1(g.cy) + '" r="80" fill="' + MIST + '" fill-opacity="0"/>' + nodesSvg(g.nodes, g.edges, k, 1) + '<circle cx="' + r1(g.cx) + '" cy="' + r1(g.cy) + '" r="' + r1(6 * k) + '" fill="' + PINE + '"/>' +
          halo(lx, ly, g.name.toUpperCase() + ' ' + g.count, k, { size: 11.5 }) + '</g>');
      });
      if (L.named.length > 1) {
        var d = 'M' + L.named.map(function (m) { return r1(m.x) + ' ' + r1(m.y); }).join(' L');
        s.push('<path d="' + d + '" fill="none" stroke="' + PINE + '" stroke-width="' + r1(1.6 * k) + '" stroke-linejoin="round"/>');
      }
      L.named.forEach(function (m) {
        s.push('<g class="mk" data-action="memory" data-name="' + esc(m.name) + '" data-group="' + esc(m.group) + '" data-camp="' + c.id + '" role="button" tabindex="0" aria-label="Memory: ' + esc(m.name) + '">' +
          '<circle cx="' + r1(m.x) + '" cy="' + r1(m.y) + '" r="' + r1(6.5 * k) + '" fill="' + PINE + '" stroke="' + MIST + '" stroke-width="' + r1(2 * k) + '"/>' +
          halo(m.x + (m.x >= 0 ? 10 : -10) * k, m.y - 8 * k, m.name, k, { anchor: m.x >= 0 ? 'start' : 'end', size: 13, weight: 700, ls: 0 }) + '</g>');
      });
      s.push('<circle cx="0" cy="0" r="' + r1(28 * k) + '" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>' + iconAt(c.icon, [0, 0], 26 * k, PINE));
    }
    s.push('</svg>');
    host.innerHTML = s.join('');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', opts.camp ? camp(opts.camp).name + ' brain: ' + camp(opts.camp).groups.map(function (g) { return g[1] + ' ' + g[0].toLowerCase(); }).join(', ') + '.' : 'Brain of your business: every connected camp around Sherpa.');
  }

  function drawView(view) {
    var art = $('.view-art', view); if (!art) return;
    var scope = view.getAttribute('data-scope'), lens = view.getAttribute('data-lens');
    if (scope === 'onboard') return drawMap(art, {});
    if (scope === 'home') return lens === 'brain' ? drawBrain(art, {}) : drawMap(art, view.classList.contains('is-preview') ? { center: 'you' } : {});
    return lens === 'brain' ? drawBrain(art, { camp: scope }) : drawMap(art, { focus: scope });
  }
  var ro = window.ResizeObserver ? new ResizeObserver(function (list) {
    list.forEach(function (en) { var v = en.target.closest('.view'); if (v && en.contentRect.width) { cancelAnimationFrame(v._raf); v._raf = requestAnimationFrame(function () { drawView(v); }); } });
  }) : null;
  function mountViews() {
    $$('.view').forEach(function (v) { drawView(v); if (ro) ro.observe($('.view-art', v)); });
  }

  /* ================= overlays ================= */
  function sheet(html, opts) {
    closeSheet();
    opts = opts || {};
    var wrap = document.createElement('div');
    wrap.className = 'scrim' + (opts.pine ? ' is-pine' : '');
    wrap.innerHTML = '<div class="sheet' + (opts.pine ? ' pine' : '') + (opts.cls ? ' ' + opts.cls : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.label || 'Dialog') + '">' +
      '<button type="button" class="icon-btn sheet-x' + (opts.pine ? ' on-pine' : '') + '" data-action="close-sheet" aria-label="Close">' + icon('close', 16, opts.pine ? MIST : PINE, 2.5) + '</button>' + html + '</div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) closeSheet(); });
    session.lastFocus = document.activeElement;
    var f = $('input, button:not(.sheet-x)', wrap) || $('.sheet-x', wrap); if (f) f.focus();
    return wrap;
  }
  function closeSheet() { var s = $('.scrim'); if (s) { s.remove(); if (session.lastFocus && session.lastFocus.focus && document.body.contains(session.lastFocus)) session.lastFocus.focus(); } }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('show'); }, 3000);
  }

  function exploreSheet(id) {
    var c = camp(id);
    sheet('<div class="sheet-head">' + campDisc(c, 48, true) + '<div class="col"><h2>' + esc(c.name) + '</h2><span class="soft">About +' + fh(c.hours) + ' h a week</span></div></div>' + connectBlock(c), { label: 'Make camp: ' + c.name });
  }
  function accountMenu() {
    sheet('<div class="sheet-head">' + '<span class="avatar big">' + esc(initial()) + '</span><div class="col"><h2>' + esc(state.name) + '</h2><span class="soft">Climbing to ' + state.summit + ' h a week</span></div></div>' +
      '<div class="menu"><a href="#gear" data-action="close-sheet-go" data-to="gear">Gear</a><a href="#report" data-action="close-sheet-go" data-to="report">Friday trail report</a><a href="#camps" data-action="close-sheet-go" data-to="camps">Camps</a></div>', { label: 'Account', cls: 'small' });
  }
  function checkin() {
    var list = openApprovals();
    sheet('<div class="ck"><div class="ck-rings">' + sherpaDisc(true, 96) + '</div><h2 class="ck-title">' + greeting() + ', ' + esc(state.name) + '</h2><p class="ck-sub">Sherpa · Check-in</p>' +
      '<div class="ck-card"><div class="row between base"><span class="ck-num">' + f1(elevation()) + ' h</span><span class="ck-soft">' + (toGo() > 0 ? fh(toGo()) + ' to the summit' : 'Summit reached') + '</span></div>' +
      (list.length ? list.map(function (a) { return '<p>' + esc(a.who) + ': ' + esc(a.what.toLowerCase()) + '.</p>'; }).join('') : '<p>Nothing needs you today.</p>') + '</div>' +
      '<div class="row gap12 ck-actions"><button type="button" class="btn ghost-mist grow lg" data-action="checkin-text">Text me instead</button><button type="button" class="btn mist grow lg" data-action="checkin-answer">Answer</button></div></div>', { pine: true, label: 'Check-in', cls: 'full' });
  }
  function memorySheet(name, group, campId) {
    var c = camp(campId);
    sheet('<div class="sheet-head"><span class="mem-dot"></span><div class="col"><h2>' + esc(name) + '</h2><span class="soft">' + esc(group) + ' · ' + esc(c.name) + ' · Example memory</span></div></div>' +
      '<p>Linked to ' + c.named.filter(function (m) { return m[0] !== name; }).slice(0, 3).map(function (m) { return esc(m[0]); }).join(', ') + '.</p><p class="soft">Last touched today. Source: ' + esc(toolOf(campId)) + '.</p>' +
      '<button type="button" class="btn ghost block" data-action="open-source" data-src="' + esc(toolOf(campId)) + '">Open in ' + esc(toolOf(campId)) + '</button>', { label: 'Memory: ' + name, cls: 'small' });
  }
  function receiptSheet(id) {
    var e = entries().filter(function (x) { return x.id === id; })[0]; if (!e) return;
    sheet(receipt(e), { pine: true, label: 'Receipt', cls: 'receipt' });
  }
  function chatSheet() {
    sheet('<h2 class="chat-title">Ask Sherpa</h2><div class="chat" aria-live="polite">' + session.chat.map(function (m) { return '<div class="msg ' + m.who + '">' + esc(m.text) + '</div>'; }).join('') + '</div>' + askBar('Ask Sherpa', false, 'ask-s'), { label: 'Ask Sherpa', cls: 'chat-sheet' });
    var c = $('.chat'); if (c) c.scrollTop = c.scrollHeight;
  }
  function answer(q) {
    var t = q.toLowerCase(), n = openApprovals();
    if (/elev|hour|summit|how far|progress|time back/.test(t)) {
      var tr = nextTrail();
      return 'You\'re at ' + f1(elevation()) + ' h a week. ' + (toGo() > 0 ? fh(toGo()) + ' to the summit.' : 'You made the summit.') + (tr ? ' Biggest open trail: ' + tr.title.toLowerCase() + ', +' + fh(tr.hours) + ' h.' : '');
    }
    if (/need|approv|waiting|pending|inbox/.test(t)) return n.length ? words(n.length) + ' things need you: ' + n.map(function (a) { return a.who + ' (' + a.what.toLowerCase() + ')'; }).join(', ') + '.' : 'Nothing needs you right now.';
    if (/today|log|did you|done/.test(t)) { var es = entries().filter(function (e) { return e.day === 'Today' && !e.undone; }); return 'Today I saved you ' + todayMinutes() + ' minutes. ' + es.slice(0, 2).map(function (e) { return e.text; }).join('. ') + '.'; }
    if (/camp|tool|connect/.test(t)) { var u = unexplored(); return u.length ? 'You have ' + (D.CAMPS.length - u.length) + ' camps. ' + u[0].name + ' is next, about +' + fh(u[0].hours) + ' h.' : 'Every camp is made.'; }
    return 'I can\'t reach your tools in this demo, so I can\'t answer that yet. Once they\'re connected, I\'ll answer from them.';
  }

  /* ================= actions ================= */
  function afterGain(before, msg) {
    var e = elevation();
    if (state.onboarded && before < state.summit && e >= state.summit && state.reached !== state.summit) { nextPick = null; save(); toast(msg); go('summit'); return; }
    toast(msg);
    render();
  }
  function connectCamp(id) {
    var c = camp(id), tool = session.pendingTool[id] || c.tools[0];
    session.connecting = id; refreshConnect();
    setTimeout(function () {
      var before = elevation();
      session.connecting = null;
      state.camps[id] = { tool: tool, at: Date.now() };
      if (session.openRow === id) session.openRow = null;
      save(); closeSheet();
      var msg = c.name + ' camp made with ' + tool + '. +' + fh(c.hours) + ' h a week.';
      if (!state.onboarded) { toast(msg); render(); return; }
      afterGain(before, msg);
    }, 1100);
  }
  function refreshConnect() {
    var sc = $('.scrim');
    if (sc && session.connecting) { var c = camp(session.connecting); var box = $('.connect', sc); if (box) box.outerHTML = connectBlock(c); return; }
    render();
  }

  var handlers = {
    'step': function (el) { state.step = el.dataset.to; save(); go('start-' + el.dataset.to); },
    'hours': function (el) { state.summit = clamp(state.summit + Number(el.dataset.d), 1, 60); save(); render(); },
    'set-hours': function (el) { state.summit = Number(el.dataset.n); save(); render(); },
    'set-why': function (el) { state.why = el.dataset.why; save(); render(); },
    'row': function (el) { var id = el.dataset.camp; if (!state.onboarded && parse().step !== 'camps') return; session.openRow = session.openRow === id ? null : id; render(); },
    'pick-tool': function (el) { session.pendingTool[el.dataset.camp] = el.dataset.tool; var sc = $('.scrim'); if (sc) { var box = $('.connect', sc); if (box) { box.outerHTML = connectBlock(camp(el.dataset.camp)); return; } } render(); },
    'connect': function (el) { if (session.connecting) return; connectCamp(el.dataset.camp); },
    'model': function (el) { state.model = el.dataset.model; save(); if (state.onboarded) toast('Base Camp now runs on ' + state.model + '. Your memories came with you.'); render(); },
    'finish': function () { state.onboarded = true; state.step = 'done'; save(); toast('Base Camp made. The climb starts now.'); go('home'); },
    'lens': function (el) {
      var v = el.closest('.view'), scope = v.dataset.scope, lens = el.dataset.lens;
      if (scope === 'home') { state.lens = lens; save(); } else session.campLens[scope] = lens;
      v.dataset.lens = lens; $$('[data-action="lens"]', v).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lens === lens)); });
      v.setAttribute('aria-label', (scope === 'home' ? 'Your mountain' : camp(scope).name) + ', ' + lens + ' view');
      drawView(v);
    },
    'full': function () { session.full = !session.full; render(); },
    'open-camp': function (el) { if (session.full) session.full = false; go('camp-' + el.dataset.camp); },
    'explore': function (el) { if (!state.onboarded) return; exploreSheet(el.dataset.camp); },
    'go': function (el) { go(el.dataset.to); },
    'toast': function (el) { toast(el.dataset.msg); },
    'summit': function () { if (!state.onboarded) { toast('Your summit: ' + state.summit + ' h a week, for ' + state.why.toLowerCase() + '.'); return; } if (elevation() >= state.summit) go('summit'); else toast('Summit: ' + state.summit + ' h a week. ' + fh(toGo()) + ' to go.'); },
    'approve': function (el) { var a = D.APPROVALS.filter(function (x) { return x.id === el.dataset.id; })[0]; doApprove([a]); },
    'approve-all': function () { doApprove(openApprovals()); },
    'take': function (el) {
      var t = D.TRAILS.filter(function (x) { return x.id === el.dataset.id; })[0], before = elevation();
      state.trails[t.id] = 'taken';
      state.added.push({ id: 'n' + Date.now(), day: 'Today', time: nowTime(), text: 'Took over: ' + t.title.toLowerCase(), camp: t.camp, min: Math.round(t.hours * 60 / 5), src: 'tool' });
      save();
      var e = elevation();
      afterGain(before, 'Elevation +' + fh(t.hours) + ' h. ' + (e >= state.summit ? 'Summit in reach.' : fh(r1(state.summit - e)) + ' to the summit.'));
    },
    'snooze': function (el) { session.snoozed[el.dataset.id] = true; toast("Okay. I'll ask again next week."); render(); },
    'perm': function (el) { state.perms[el.dataset.camp] = el.dataset.perm; save(); toast({ read: 'Sherpa will only read in ' + camp(el.dataset.camp).name + '.', ask: 'Sherpa will ask before acting in ' + camp(el.dataset.camp).name + '.', act: 'Sherpa will act alone in ' + camp(el.dataset.camp).name + ' and log every step.' }[el.dataset.perm]); render(); },
    'log-camp': function (el) { session.logCamp = el.dataset.camp; session.logSel = null; render(); },
    'log-open': function (el) { if (desk()) { session.logSel = el.dataset.id; render(); } else receiptSheet(el.dataset.id); },
    'undo': function (el) { state.undone[el.dataset.id] = true; save(); closeSheet(); toast('Undone. Sherpa will ask first next time.'); render(); },
    'open-source': function (el) { toast(el.dataset.src + ' opens here once it\'s really connected.'); },
    'account': function () { accountMenu(); },
    'close-sheet': function () { closeSheet(); },
    'close-sheet-go': function (el) { closeSheet(); go(el.dataset.to); },
    'checkin': function () { checkin(); },
    'checkin-text': function () { closeSheet(); toast("Okay. I'll text you the short version."); },
    'checkin-answer': function () { closeSheet(); go(desk() ? 'home' : 'approvals'); },
    'memory': function (el) { memorySheet(el.dataset.name, el.dataset.group, el.dataset.camp); },
    'protect': function (el) { state.protect = el.dataset.p; save(); toast('Protected: ' + state.protect.toLowerCase() + '.'); render(); },
    'gear-summit': function (el) { state.summit = clamp(state.summit + Number(el.dataset.d), 1, 60); save(); render(); },
    'reset-ask': function () { session.confirmReset = true; render(); },
    'reset-cancel': function () { session.confirmReset = false; render(); },
    'reset': function () { try { localStorage.removeItem(KEY); } catch (e) { } state = fresh(); session.confirmReset = false; session.chat = []; session.snoozed = {}; session.campLens = {}; brainCache = {}; go('start-name'); toast('Fresh start.'); },
    'next-pick': function (el) { nextPick = el.dataset.v === 'hold' ? 'hold' : Number(el.dataset.v); render(); },
    'next-set': function () {
      state.summits = (state.summits || 0) + 1; state.reached = state.summit;
      if (nextPick !== 'hold') state.summit = nextPick;
      nextPick = null; save();
      toast(state.reached === state.summit ? 'Holding at ' + state.summit + '. Enjoy the view.' : 'New summit: ' + state.summit + ' h a week. The climb continues.');
      go('home');
    },
    'share': function () { toast('Your award gets a share link here.'); }
  };
  function doApprove(list) {
    list.forEach(function (a) {
      state.approvals[a.id] = true;
      state.added.push({ id: 'n' + Date.now() + a.id, day: 'Today', time: nowTime(), text: a.log, camp: a.camp, min: a.min, src: a.src });
    });
    save();
    var n = openApprovals().length;
    toast(list.length === 1 ? list[0].who + ': done. +' + list[0].min + ' min today.' : 'All clear. +' + list.reduce(function (s, a) { return s + a.min; }, 0) + ' min today.');
    render();
    if (n === 0 && !desk() && parse().name === 'approvals') { /* stays on the clear state */ }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    var fn = handlers[el.dataset.action]; if (!fn) return;
    if (el.tagName === 'A') e.preventDefault();
    fn(el, e);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if ($('.scrim')) closeSheet(); else if (session.full) { session.full = false; render(); } }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g.mk[role="button"]')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f.dataset.form; if (!kind) return;
    e.preventDefault();
    if (kind === 'name') {
      var v = f.elements.name.value.trim();
      if (!v) { session.nameError = true; render(); var i = $('#you-name'); if (i) i.focus(); return; }
      session.nameError = false; state.name = v.slice(0, 24); state.step = 'summit'; save(); go('start-summit');
    } else if (kind === 'rename') {
      var n = $('#gear-name').value.trim(); if (n) { state.name = n.slice(0, 24); save(); toast('Got it, ' + state.name + '.'); render(); }
    } else if (kind === 'ask') {
      var q = f.elements.q.value.trim(); if (!q) { chatSheet(); return; }
      session.chat.push({ who: 'me', text: q }); session.chat.push({ who: 'sherpa', text: answer(q) });
      chatSheet();
    } else if (kind === 'log-search') { /* live search below */ }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'log-q') {
      session.logQuery = e.target.value; var pos = e.target.selectionStart;
      render(); var i = $('#log-q'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (er) { } }
    }
  });

  /* ================= render ================= */
  var app;
  function render() {
    var r = parse();
    if (location.hash !== '#' + r.hash) { window.history.replaceState(null, '', '#' + r.hash); }
    if (r.name !== 'camp' || session.last !== r.hash) { if (r.name === 'camp' && session.last !== r.hash) session.campLens[r.camp] = 'brain'; }
    if (session.last && session.last !== r.hash && session.full) session.full = false;
    var html =
      r.name === 'start' ? renderStart(r) :
        r.name === 'home' ? renderHome(r) :
          r.name === 'map' ? renderMap(r) :
            r.name === 'approvals' ? renderApprovals(r) :
              r.name === 'camps' ? renderCamps(r) :
                r.name === 'camp' ? renderCamp(r) :
                  r.name === 'log' ? renderLog(r) :
                    r.name === 'report' ? renderReport(r) :
                      r.name === 'gear' ? renderGear(r) :
                        renderSummit(r);
    var changed = session.last !== r.hash;
    app.className = 'app ' + (desk() ? 'is-desk' : 'is-phone') + ' r-' + r.name;
    app.innerHTML = html;
    if (r.name === 'camp' && !desk() && isOn(r.camp)) { var slot = $('.p-view-slot'); if (slot) slot.outerHTML = viewPanel(r.camp, { cls: 'is-preview' }) + '<div class="sp-card pine">' + campSherpa(camp(r.camp)) + '</div>'; }
    mountViews();
    document.title = titleFor(r) + ' · Apex Sherpa';
    session.last = r.hash;
    if (changed) { window.scrollTo(0, 0); var m = $('#main'); if (m) m.scrollTop = 0; }
  }
  function titleFor(r) {
    return { start: 'Setup', home: 'Home', map: 'Map', approvals: 'Approvals', camps: 'Camps', camp: r.camp ? camp(r.camp).name : 'Camp', log: 'Trail log', report: 'Friday trail report', gear: 'Gear', summit: 'Summit' }[r.name];
  }

  function boot() {
    app = $('#app');
    window.addEventListener('hashchange', render);
    if (deskMQ.addEventListener) deskMQ.addEventListener('change', render); else if (deskMQ.addListener) deskMQ.addListener(render);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
