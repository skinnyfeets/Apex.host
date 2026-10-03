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
    chev: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    target: '<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    docs: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    marketing: '<path d="M3 10v4h3l7 4V6l-7 4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    social: '<path d="M12 20s-7-4.3-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.7 12 20 12 20z"/>',
    team: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17c.6-2 2.2-3 4-3s3.4 1 4 3"/>',
    store: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
  };
  function icon(name, size, color, sw) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  var PEAK = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20 L9.5 7 L13.5 13.5 L16 10 L22 20 Z" fill="currentColor"/></svg>';

  /* ================= state ================= */
  var KEY = 'apex-sherpa-app-v3';
  function fresh() {
    return { name: '', photo: '', onboarded: false, step: 'welcome', summit: 20, why: 'Family', camps: {}, models: ['Claude'], approvals: {}, rejected: {}, trails: {}, perms: {}, undone: {}, reached: 0, summits: 0, lens: 'map', baseAt: 0, done: [], nextAt: 0, cursor: 0, mapN: 1 };
  }
  var state = load();
  function load() {
    var s = fresh();
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) if (o.hasOwnProperty(k)) s[k] = o[k]; } } catch (e) { }
    for (var id in s.camps) { var cm = s.camps[id]; if (cm && !cm.tools) cm.tools = cm.tool ? [cm.tool] : []; }
    if (!s.models || !s.models.length) s.models = [s.model || 'Claude'];
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }

  var session = { snoozed: {}, pendingTool: {}, connecting: null, openRow: null, logCamp: 'all', logQuery: '', logSel: null, chat: [], full: false, nameError: false, confirmReset: false, last: null, mapVB: {}, cam: {}, busy: 0, noClick: 0, dirty: false, apprOpen: {} };

  /* ================= derived data ================= */
  function camp(id) { for (var i = 0; i < D.CAMPS.length; i++) if (D.CAMPS[i].id === id) return D.CAMPS[i]; return null; }
  function isOn(id) { return !!state.camps[id]; }
  // Every camp can hold several connectors (Gmail and Outlook, Slack and Teams), and Base Camp several AIs.
  function toolsOf(id) { var cm = state.camps[id]; return cm && cm.tools ? cm.tools : []; }
  function toolOf(id) { return toolsOf(id)[0] || camp(id).tools[0]; }
  function toolsLabel(id) { return toolsOf(id).join(' + ') || camp(id).tools[0]; }
  function modelsLabel() { return state.models.join(' + '); }
  function sourceOf(entry) {
    if (entry.camp === 'mail') { var g = toolsOf('mail').indexOf('Gmail') > -1 || !toolsOf('mail').length; return entry.src === 'cal' ? (g ? 'Google Calendar' : 'Outlook') : (g ? 'Gmail' : toolOf('mail')); }
    return toolOf(entry.camp);
  }
  function trailHours(campId) {
    var h = 0; D.TRAILS.forEach(function (t) { if (t.camp === campId && state.trails[t.id] === 'taken') h += t.hours; }); return h;
  }
  /* Time saved. Nothing counts until Base Camp. After that only finished tasks count, each one the time it
     would otherwise have taken you. Elevation is the time saved in the last seven days. */
  var DAY = 864e5, WEEK = 7 * DAY;
  function startOfDay(t) { var d = new Date(t || Date.now()); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  function liveDone() { return (state.done || []).filter(function (d) { return !state.undone[d.id]; }); }
  function weekDone(campId) { var since = Date.now() - WEEK; return liveDone().filter(function (d) { return d.ts >= since && (!campId || d.camp === campId); }); }
  function savedMin(campId) { return weekDone(campId).reduce(function (a, d) { return a + d.min; }, 0); }
  function campHours(id) { return r1(savedMin(id) / 60); }
  function elevation() { return r1(savedMin() / 60); }
  function toGo() { return r1(Math.max(0, state.summit - elevation())); }
  function todayMinutes() { var a = startOfDay(); return liveDone().filter(function (d) { return d.ts >= a; }).reduce(function (s, d) { return s + d.min; }, 0); }
  // Past Base Camp: the AI is picked and time saved counts.
  function climbing() { return !!state.baseAt; }
  function madeCount() { return D.CAMPS.filter(function (c) { return isOn(c.id); }).length; }
  function madeNames() { return D.CAMPS.filter(function (c) { return isOn(c.id); }).map(function (c) { return c.name; }); }
  function listing(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function openApprovals() { return climbing() ? D.APPROVALS.filter(function (a) { return isOn(a.camp) && !state.approvals[a.id] && !state.rejected[a.id]; }) : []; }
  function apprOf(id) { return D.APPROVALS.filter(function (a) { return a.id === id; })[0]; }
  function unexplored() { return D.CAMPS.filter(function (c) { return !isOn(c.id); }); }
  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function dayOf(ts) { var a = startOfDay(); return ts >= a ? 'Today' : ts >= a - DAY ? 'Yesterday' : WEEKDAYS[new Date(ts).getDay()]; }
  function timeOf(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function entries() {
    return (state.done || []).slice().sort(function (a, b) { return b.ts - a.ts; }).map(function (e) {
      var o = {}; for (var k in e) o[k] = e[k];
      o.day = dayOf(e.ts); o.time = timeOf(e.ts); o.source = sourceOf(e); o.undone = !!state.undone[e.id]; return o;
    });
  }
  function initial() { return (state.name || '?').trim().charAt(0).toUpperCase() || '?'; }

  /* Sherpa at work. After Base Camp it finishes real tasks in your connected camps and on the trails you've
     handed over, at a demo pace. Each task is logged with the time it would have taken you, and that logged time
     is the only thing that counts as time saved. No estimates. More camps and trails give Sherpa more to do. */
  var PACE = 12000;
  function workQueue() {
    var list = D.TASKS.filter(function (t) { return isOn(t.camp); });
    D.TRAILS.forEach(function (t) { if (state.trails[t.id] === 'taken') list.push({ text: t.done, camp: t.camp, min: t.min, src: 'tool' }); });
    return list;
  }
  function workGap() { var taken = D.TRAILS.filter(function (t) { return state.trails[t.id] === 'taken'; }).length; return PACE * 2 / (1 + Math.min(4, madeCount() + taken / 2)); }
  function work(now) {
    if (!state.onboarded || !state.baseAt || !state.introSeen) return 0;
    if (!state.nextAt) state.nextAt = state.baseAt + 4000;
    if (now - state.nextAt > PACE * 3) state.nextAt = now - PACE * 2; // away a while: catch up a little, never a flood
    var n = 0;
    while (now >= state.nextAt && n < 3) {
      var list = workQueue();
      if (!list.length) { state.nextAt = now + PACE; break; }
      var t = list[state.cursor % list.length];
      state.cursor++;
      state.done.push({ id: 'd' + state.nextAt + '-' + state.cursor, ts: state.nextAt, text: t.text, camp: t.camp, min: t.min, src: t.src || 'tool' });
      state.nextAt += Math.round(workGap() * (0.75 + Math.random() * 0.5));
      n++;
    }
    return n;
  }
  function soon() { var t = Date.now() + 3000; if (!state.nextAt || state.nextAt > t) state.nextAt = t; }

  /* ================= routing ================= */
  
  var KNOWN = ['home', 'map', 'approvals', 'log', 'camps', 'gear', 'report', 'summit'];
  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (!state.onboarded) { if (!/^start-(welcome|name|summit|coords|trailhead)$/.test(h)) h = 'start-' + state.step; }
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
  function face() { return state.photo ? '<img src="' + state.photo + '" alt="">' : esc(initial()); }
  function avatar() { return '<button type="button" class="avatar' + (state.photo ? ' has-photo' : '') + '" data-action="go" data-to="gear" aria-label="Settings">' + face() + '</button>'; }
  function chip(t) { return '<span class="chip">' + t + '</span>'; }
  // Sherpa's mark is a big S, so it never reads as the Apex logo.
  function sherpaDisc(onPine, size) { return '<span class="disc ' + (onPine ? 'disc-mist' : 'disc-pine') + '" style="width:' + size + 'px;height:' + size + 'px"><span class="s-mark" style="font-size:' + Math.round(size * 0.56) + 'px">S</span></span>'; }
  function campDisc(c, size, dashed) { return '<span class="cdisc' + (dashed ? ' is-dashed' : '') + '" style="width:' + size + 'px;height:' + size + 'px">' + icon(c.icon, Math.round(size * 0.46), PINE, 1.8) + '</span>'; }

  function elevCard(compact) {
    if (!climbing()) return '<section class="elev" aria-label="Time saved: none yet. Your summit is ' + state.summit + ' hours a week.">' +
      '<div class="elev-num"><span>0</span><small>h saved</small></div>' +
      '<div class="elev-row"><span>Summit · ' + state.summit + ' h a week, for ' + esc(state.why.toLowerCase()) + '</span></div>' +
      '<p class="elev-note">Time saved starts when Sherpa is at work, after Base Camp. Only tasks Sherpa actually finishes count.</p></section>';
    // Past Base Camp: a training-log style week. Time saved against the summit, the numbers behind it, and
    // a bar for each of the last seven days. Every figure comes from tasks Sherpa actually finished.
    var e = elevation(), pct = clamp(Math.round(e / state.summit * 100), 0, 100), tm = todayMinutes(), wk = weekDone();
    return '<section class="elev wk" aria-label="Last 7 days: ' + f1(e) + ' hours saved of a ' + state.summit + ' hour summit.">' +
      '<div class="row between base"><span class="wk-k">Last 7 days</span><a href="#log" class="wk-link">Trail log ' + icon('arrow', 13, MIST, 2.4) + '</a></div>' +
      '<div class="elev-num"><span>' + f1(e) + '</span><small>h saved</small></div>' +
      '<div class="wk-goal"><span class="wk-track"><span style="width:' + pct + '%"></span></span><span class="wk-pct">' + pct + '% of ' + state.summit + ' h</span></div>' +
      '<div class="wk-stats">' + statCell('Today', tm >= 60 ? fh(tm / 60) + ' h' : tm + ' min') + statCell('Tasks', wk.length) + statCell('Camps', madeCount()) + statCell('Streak', streak() + (streak() === 1 ? ' day' : ' days')) + '</div>' +
      daysChart(null, true) + '</section>';
  }
  function statCell(k, v) { return '<div class="sc"><span>' + k + '</span><b>' + v + '</b></div>'; }
  // Minutes saved on each of the last seven days, oldest first.
  function lastDays(campId) {
    var out = [], a0 = startOfDay();
    for (var i = 6; i >= 0; i--) {
      var a = a0 - i * DAY, b = a + DAY;
      out.push({ d: new Date(a), today: i === 0, min: liveDone().filter(function (x) { return x.ts >= a && x.ts < b && (!campId || x.camp === campId); }).reduce(function (s2, x) { return s2 + x.min; }, 0) });
    }
    return out;
  }
  function daysChart(campId, onPine) {
    var days = lastDays(campId), max = Math.max.apply(null, days.map(function (d) { return d.min; }).concat([1]));
    return '<div class="days' + (onPine ? ' on-pine' : '') + '" aria-hidden="true">' + days.map(function (d) {
      return '<div class="day' + (d.today ? ' is-today' : '') + '"><span class="day-bar"><span style="height:' + (d.min ? Math.max(6, Math.round(d.min / max * 100)) : 0) + '%"></span></span><span class="day-k">' + 'SMTWTFS'.charAt(d.d.getDay()) + '</span></div>';
    }).join('') + '</div>';
  }
  // Days in a row, up to today, on which Sherpa finished something.
  function streak() {
    var n = 0, a = startOfDay();
    while (liveDone().some(function (x) { return x.ts >= a && x.ts < a + DAY; })) { n++; a -= DAY; }
    return n;
  }
  function madeOn(id) { var at = state.camps[id] && state.camps[id].at; return at > 1e11 ? new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''; }
  function lastTask(id) { return entries().filter(function (e2) { return e2.camp === id && !e2.undone; })[0]; }
  // A camp you've made, logged like a hike: what it is, when you made it, and what Sherpa has done there.
  function campCard(c) {
    var last = lastTask(c.id), wait = openApprovals().filter(function (a2) { return a2.camp === c.id; }).length, when = madeOn(c.id);
    return '<a href="#camp-' + c.id + '" class="act">' +
      '<div class="act-head">' + campIco(c) + '<div class="grow col"><b>' + esc(c.name) + '</b><span>' + esc(toolsLabel(c.id)) + (when ? ' · made ' + when : '') + '</span></div>' + (wait ? '<span class="act-need">' + wait + ' need' + (wait === 1 ? 's' : '') + ' you</span>' : '') + icon('arrow', 16, PINE, 2.2) + '</div>' +
      '<div class="act-stats">' + statCell('Time saved', climbing() ? f1(campHours(c.id)) + ' h' : '–') + statCell('Tasks', climbing() ? weekDone(c.id).length : '–') + statCell('Memories', c.memories.toLocaleString('en-US')) + '</div>' +
      '<div class="act-last">' + (last ? '<span class="soft">Latest</span> ' + esc(last.text) + ' <span class="soft">· ' + last.day.toLowerCase() + ' ' + last.time + '</span>' : climbing() ? 'Sherpa is getting started here.' : 'Sherpa starts here once Base Camp is made.') + '</div></a>';
  }

  function approvalRows(list, onPine) {
    if (!list.length) return '';
    return '<div class="appr-list">' + list.map(function (a) {
      var open = !!session.apprOpen[a.id], c = camp(a.camp);
      return '<div class="appr' + (onPine ? ' on-pine' : '') + (open ? ' is-open' : '') + '"><div class="appr-top">' +
        '<button type="button" class="appr-text" data-action="appr-open" data-id="' + a.id + '" aria-expanded="' + open + '"><b>' + esc(a.who) + '</b><span>' + esc(a.what) + '</span></button>' +
        '<span class="appr-chev" aria-hidden="true">' + icon('chev', 16, onPine ? MIST : PINE, 2.2) + '</span>' +
        '<button type="button" class="btn ' + (onPine ? 'ghost-mist' : 'ghost') + ' sm" data-action="approve" data-id="' + a.id + '">' + a.verb + '</button></div>' +
        (open ? '<div class="appr-more"><div class="appr-kind">' + esc(a.kind) + '</div><p>' + esc(a.detail) + '</p><div class="appr-meta">' + esc(c.name) + ' · ' + esc(toolsLabel(a.camp)) + ' · saves about ' + a.min + ' min</div>' +
          '<div class="appr-acts"><button type="button" class="btn ' + (onPine ? 'ghost-mist' : 'ghost') + ' sm" data-action="reject" data-id="' + a.id + '">Reject</button>' +
          '<button type="button" class="btn ' + (onPine ? 'ghost-mist' : 'ghost') + ' sm" data-action="appr-chat" data-id="' + a.id + '">' + icon('chat', 14, onPine ? MIST : PINE, 2) + 'Chat about it</button></div></div>' : '') +
        '</div>';
    }).join('') + '</div>';
  }
  function approveAllLabel(n) { return n === 3 ? 'Approve all three' : n === 2 ? 'Approve both' : 'Approve it'; }


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
    var home = scope === 'home', lens = home ? state.lens : 'brain';
    var full = session.full ? ' is-full' : '';
    var label = home ? 'Your mountain, ' + lens + ' view' : camp(scope).name + ' brain';
    return '<section class="view' + full + (opts.ask ? ' has-ask' : '') + (opts.cls ? ' ' + opts.cls : '') + '" data-scope="' + scope + '" data-lens="' + lens + '" aria-label="' + esc(label) + '">' +
      '<div class="view-art"></div>' +
      '<div class="view-bar">' +
      (home ? '<div class="seg" role="group" aria-label="View"><button type="button" data-action="lens" data-lens="map" aria-pressed="' + (lens === 'map') + '">Map</button><button type="button" data-action="lens" data-lens="brain" aria-pressed="' + (lens === 'brain') + '">Brain</button></div>' : '') +
      (opts.noExpand ? '' : '<button type="button" class="icon-btn" data-action="full" aria-label="' + (session.full ? 'Exit full screen' : 'Full screen') + '">' + icon(session.full ? 'shrink' : 'expand', 18, PINE, 2.2) + '</button>') +
      '</div>' +
      '<div class="view-ctl" role="group" aria-label="Move around"><button type="button" data-action="zoom" data-f="1.5" aria-label="Zoom in">' + icon('plus', 18, PINE, 2.2) + '</button>' +
      '<button type="button" data-action="zoom" data-f="0.667" aria-label="Zoom out">' + icon('minus', 18, PINE, 2.2) + '</button>' +
      '<button type="button" data-action="recenter" aria-label="Reset the view">' + icon('target', 18, PINE, 2) + '</button></div>' +
      (home ? '<button type="button" class="key-btn" data-action="map-key" aria-expanded="' + keyOpen() + '">Map key</button>' + (keyOpen() ? mapKey() : '') : '') +
      (opts.ask ? askBar(opts.ask, true) : '') +
      '</section>';
  }

  // What everything on the map means, in a line each. Open at first on a big screen; on a phone it would hide
  // most of the map, so it waits for a tap.
  function keyOpen() { return desk() ? state.mapKey !== false : state.mapKey === true; }
  function mapKey() {
    var k = function (ico, t) { return '<li><span class="k-ico">' + ico + '</span><span>' + t + '</span></li>'; };
    return '<div class="map-key" role="note" aria-label="Map key"><div class="row between"><b>Map key</b><button type="button" class="icon-btn sm" data-action="map-key" aria-label="Hide the map key">' + icon('close', 12, PINE, 2.5) + '</button></div><ul>' +
      k('<span class="k-dot"></span>', '<b>Connected camp.</b> A tool Sherpa works in.') +
      k('<span class="k-dot is-dashed"></span>', '<b>Dashed camp.</b> Not connected yet. Tap to connect.') +
      k(icon('base', 14, PINE, 1.8), '<b>Base Camp.</b> The AI that runs Sherpa.') +
      k('<img src="assets/icon.svg" alt="" width="12" height="13">', '<b>Summit.</b> Your goal, ' + state.summit + ' h a week.') +
      k('<svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true"><path d="M7 18 L1.4 9.8 A6.5 6.5 0 1 1 12.6 9.8 Z" fill="' + PINE + '"/><circle cx="7" cy="6.6" r="3.2" fill="' + MIST + '"/></svg>', climbing() ? '<b>You.</b> Time saved this week, from finished tasks.' : '<b>You.</b> You climb once Sherpa is at work.') +
      '</ul></div>';
  }

  function askBar(placeholder, floating, id) {
    id = id || ('ask-' + (floating ? 'f' : 'p'));
    return '<form class="ask' + (floating ? ' is-floating' : '') + '" data-form="ask" role="search"><label class="sr" for="' + id + '">' + esc(placeholder) + '</label>' +
      '<input id="' + id + '" name="q" type="text" autocomplete="off" placeholder="' + esc(placeholder) + '">' +
      '<button type="submit" class="ask-go" aria-label="Ask">' + icon('arrow', 18, MIST, 2.5) + '</button></form>';
  }

  function campDoes(c) {
    var ex = D.TRAILS.filter(function (t) { return t.camp === c.id; }).slice(0, 3);
    return ex.length ? '<div class="label">What Sherpa can do here</div><ul class="does">' + ex.map(function (t) { return '<li>' + esc(t.title) + '</li>'; }).join('') + '</ul>' : '';
  }
  // Each camp lists its usual tools plus Other. In the demo, Other is an empty placeholder: more connectors
  // would be listed there.
  function connectBlock(c) {
    var have = toolsOf(c.id), left = c.tools.filter(function (t) { return have.indexOf(t) < 0; }), pend = session.pendingTool[c.id];
    var other = pend === 'Other' || !left.length, tool = other ? 'Other' : left.indexOf(pend) > -1 ? pend : left[0], busy = session.connecting === c.id;
    return '<div class="connect">' +
      '<div class="chips" role="radiogroup" aria-label="' + esc(c.name) + ' connector">' + c.tools.concat(['Other']).map(function (t) {
        var on = have.indexOf(t) > -1;
        return '<button type="button" class="chipbtn' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + (!on && t === tool) + '" data-action="pick-tool" data-camp="' + c.id + '" data-tool="' + esc(t) + '"' + (busy || on ? ' disabled' : '') + '>' + (on ? '✓ ' : '') + esc(t) + '</button>';
      }).join('') + '</div>' +
      (other ? '<div class="other-box" role="note">Other ' + esc(c.name) + ' connectors will be listed here.</div>' :
        '<button type="button" class="btn primary block" data-action="connect" data-camp="' + c.id + '"' + (busy ? ' disabled aria-busy="true"' : '') + '>' + (busy ? 'Connecting ' + esc(tool) + '…' : (have.length ? 'Add ' : 'Connect ') + esc(tool)) + '</button>') +
      '<p class="fine">' + (have.length ? 'Add every tool you use here. ' : 'You can add more than one. ') + 'Demo. No account gets connected.</p></div>';
  }

  /* ================= onboarding ================= */
  // Welcome, your name, your summit, your coordinates, then the trailhead. Camps and Base Camp come after,
  // on the mountain itself.
  function photoPick(size) {
    return '<label class="photo-pick"><input id="photo-in" type="file" accept="image/*" class="sr">' +
      '<span class="avatar" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.4) + 'px">' + (state.photo ? '<img src="' + state.photo + '" alt="">' : state.name ? esc(initial()) : icon('camera', Math.round(size * 0.36), PINE, 2)) + '</span>' +
      '<span class="photo-pick-t">' + (state.photo ? 'Change photo' : 'Add a photo') + '</span></label>';
  }
  function guideLine(t) { return '<div class="guide-line">' + sherpaDisc(false, 40) + '<p>' + t + '</p></div>'; }
  function startBody(step) {
    if (step === 'name') {
      return guideLine('I\'m Sherpa, your guide. I\'ll get you set up and do the work that wins your time back.') + '<h1>What\'s your name?</h1>' +
        '<form class="name-form" data-form="name">' + photoPick(72) + '<label class="sr" for="you-name">Your first name</label>' +
        '<input id="you-name" name="name" class="big-input" type="text" autocomplete="given-name" placeholder="Your first name" value="' + esc(state.name) + '">' +
        (session.nameError ? '<p class="err" role="alert">Add your first name to keep going.</p>' : '') +
        '<div class="row gap12"><button type="submit" class="btn primary lg">Next</button><button type="button" class="btn text" data-action="step" data-to="welcome">Back</button></div></form>';
    }
    if (step === 'summit') {
      return guideLine('Nice to meet you, ' + esc(state.name) + '. Now pick your summit: the hours I\'ll win back for you each week.') + '<h1>How much time would you like to save each week?</h1>' +
        '<div class="stepper"><button type="button" class="round-btn" data-action="hours" data-d="-1" aria-label="Fewer hours">' + icon('minus', 20, PINE, 2.5) + '</button>' +
        '<output class="stepper-num" aria-live="polite">' + state.summit + '</output>' +
        '<button type="button" class="round-btn" data-action="hours" data-d="1" aria-label="More hours">' + icon('plus', 20, PINE, 2.5) + '</button><span class="stepper-unit">hours<br>a week</span></div>' +
        '<div class="chips" role="group" aria-label="Quick picks">' + [5, 10, 15, 20, 30].map(function (n) { return '<button type="button" class="chipbtn" aria-pressed="' + (state.summit === n) + '" data-action="set-hours" data-n="' + n + '">' + n + ' h</button>'; }).join('') + '</div>' +
        '<h2 class="start-h2">What do you want the extra time for?</h2><div class="chips" role="group" aria-label="What for">' + D.WHY.map(function (w) { return '<button type="button" class="chipbtn" aria-pressed="' + (state.why === w) + '" data-action="set-why" data-why="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</div>' +
        '<div class="row gap12"><button type="button" class="btn primary lg" data-action="step" data-to="coords">Next</button><button type="button" class="btn text" data-action="step" data-to="name">Back</button></div>';
    }
    // how the climb works: the whole idea, in Sherpa's words, before the map
    var how = [
      ['base', 'Make Base Camp', 'Pick the AI that runs me: Claude, GPT, Gemini or Llama. One is enough for now.'],
      ['mail', 'Make your first camp', 'Connect a tool you already use, like Gmail or Slack. Each tool is a camp, and I get to work in it.'],
      ['check', 'Climb on real work', 'Every task I finish goes in your trail log with the time it would have taken you. Only finished work counts.'],
      ['flag', 'Reach your summit', state.summit + ' hours a week, for ' + esc(state.why.toLowerCase()) + '.'],
      ['docs', 'Read your trail report', 'Every evening I tell you what I did, the time it saved and what\'s next.']
    ];
    return guideLine('That\'s your goal set, ' + esc(state.name) + '. Here\'s how we get there. I\'ll walk you through each step.') + '<h1>How the climb works</h1>' +
      '<ol class="how">' + how.map(function (h, i) {
        return '<li><span class="how-ico">' + icon(h[0], 18, PINE, 1.9) + '</span><div class="col"><b>' + (i + 1) + '. ' + h[1] + '</b><span>' + h[2] + '</span></div></li>';
      }).join('') + '</ol>' +
      '<div class="row gap12"><button type="button" class="btn primary lg" data-action="start-climb">Start the climb</button><button type="button" class="btn text" data-action="step" data-to="summit">Back</button></div>';
  }
  function renderStart(r) {
    var step = r.step === 'trailhead' ? 'coords' : r.step;
    if (step === 'welcome') {
      return '<main class="hello" id="main"><h1>Are you ready to reach the summit?</h1>' +
        '<p class="lede">Sherpa is your guide. It connects to the tools you already use, does the busywork in them and gives you the hours back.</p>' +
        '<button type="button" class="btn primary lg" data-action="step" data-to="name">Let’s go</button></main>';
    }
    var art = step === 'coords' ? '<section class="view is-static" data-scope="onboard" data-lens="map" aria-label="Your route"><div class="view-art"></div></section>' : '';
    if (desk()) {
      return '<header class="d-head">' + logo(30) + '</header>' +
        '<main class="d-start' + (art ? '' : ' one') + '" id="main"><div class="start-copy">' + startBody(step) + '</div>' + (art ? '<div class="start-art">' + art + '</div>' : '') + '</main>';
    }
    return '<header class="p-head">' + logo(24) + '</header>' +
      '<main class="p-main p-start" id="main">' + (art ? '<div class="p-start-art">' + art + '</div>' : '') + startBody(step) + '</main>';
  }

  /* ================= app screens ================= */
  function dHeader(r) {
    var nav = [['home', 'Map'], ['camps', 'Camps'], ['log', 'Trail log']].map(function (n) {
      var on = r.section === n[0];
      return '<a href="#' + n[0] + '" class="nav-link' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
    }).join('');
    return '<header class="d-head">' + logo(30) + '<nav class="d-nav" aria-label="Main">' + nav + '</nav><div class="row gap12">' + elevPill() +
      '<a href="#gear" class="icon-btn' + (r.section === 'gear' ? ' is-on' : '') + '" aria-label="Settings"' + (r.section === 'gear' ? ' aria-current="page"' : '') + '>' + icon('gear', 20, PINE, 2) + '</a>' + avatar() + '</div></header>';
  }
  function pHeader(r, back) {
    var left = back ? '<a href="#' + back[0] + '" class="back">' + icon('back', 16, PINE, 2.5) + back[1] + '</a>' : logo(24);
    return '<header class="p-head">' + left + '<div class="row gap10">' + elevPill() + avatar() + '</div></header>';
  }
  function pTabs(r) {
    var n = openApprovals().length;
    var tabs = [['home', 'Home'], ['map', 'Map'], ['camps', 'Camps'], ['approvals', 'Approvals'], ['log', 'Log']];
    var cur = r.name === 'camp' ? 'camps' : r.name === 'report' ? 'log' : r.name;
    return '<nav class="p-tabs" aria-label="Main">' + tabs.map(function (t) {
      var on = cur === t[0];
      return '<a href="#' + t[0] + '" class="tab' + (on ? ' is-on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + t[1] + (t[0] === 'approvals' && n ? '<span class="tab-n">' + n + '</span>' : '') + '</a>';
    }).join('') + '</nav>';
  }

  function today() { return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
  function sherpaHead(sub) {
    return '<div class="sp-head">' + sherpaDisc(true, 44) + '<div class="grow col"><b>Sherpa</b><span>' + esc(sub) + '</span></div>' +
      '<button type="button" class="icon-btn on-pine" data-action="checkin" aria-label="Morning check-in">' + icon('phone', 18, MIST, 2) + '</button></div>';
  }
  function needsLine(n) { return n === 0 ? 'All clear. Nothing needs you.' : n === 1 ? 'One thing needs you.' : words(n) + ' things need you.'; }

  function homeSherpaPanel() {
    var list = openApprovals(), recent = entries().filter(function (e) { return e.day === 'Today'; }).slice(0, 3);
    if (!climbing()) return '<aside class="d-right pine" aria-label="Sherpa">' + sherpaHead('Your guide') + guide() + '</aside>';
    return '<aside class="d-right pine" aria-label="Sherpa">' + sherpaHead(guiding() ? 'Your guide' : today()) + guide() +
      (guiding() && !list.length ? '' : '<p class="sp-say">' + (guiding() ? '' : greeting() + ', ' + esc(state.name) + '. ') + needsLine(list.length) + '</p>') +
      approvalRows(list, true) +
      (list.length > 1 ? '<button type="button" class="btn mist block" data-action="approve-all">' + approveAllLabel(list.length) + '</button>' : '') +
      '<div class="label on-pine">Trail log</div><div class="mini-log">' + (recent.length ? recent.map(function (e) {
        return '<a href="#log" class="ml-row"><span class="ml-time">' + e.time + '</span><span class="grow">' + esc(e.text) + '</span><b>' + (e.undone ? 'Undone' : '+' + e.min + 'm') + '</b></a>';
      }).join('') : '<p class="sp-note">Sherpa is getting started. Every task it finishes lands here.</p>') + '</div><div class="ml-total"><span>Today so far</span><b>+' + todayMinutes() + ' min</b></div></aside>';
  }

  /* ================= Sherpa, the guide ================= */
  // Sherpa walks you up one step at a time: your summit, Base Camp (the AI), a first camp (any one), the first
  // task it finishes, then your first trail report. Once all five are done the guide steps aside.
  function guideSteps() {
    return [
      { id: 'summit', t: 'Set your summit', done: true },
      { id: 'base', t: 'Make Base Camp', done: climbing() },
      { id: 'camp', t: 'Make your first camp', done: madeCount() > 0 },
      { id: 'work', t: 'Sherpa finishes a task', done: climbing() && madeCount() > 0 && liveDone().length > 0 },
      { id: 'report', t: 'Read your trail report', done: climbing() && !!state.reportRead }
    ];
  }
  function guiding() { return guideSteps().some(function (g) { return !g.done; }); }
  // Just the checklist. The step you're on is a link straight to doing it.
  function guide() {
    if (!guiding()) return '';
    var steps = guideSteps(), cur = steps.filter(function (g) { return !g.done; })[0], k = steps.indexOf(cur);
    var go = { camp: 'href="#camps"', base: 'href="#home" data-action="basecamp"', work: 'href="#log"', report: reportReady() ? 'href="#report"' : 'href="#log"' }[cur.id];
    return '<div class="guide"><div class="label on-pine">Getting set up · ' + k + ' of ' + steps.length + ' done</div><ol class="g-steps">' + steps.map(function (g, i) {
      var inner = '<span class="g-dot">' + (g.done ? icon('check', 12, PINE, 3) : i + 1) + '</span>' + g.t;
      if (g !== cur) return '<li class="' + (g.done ? 'is-done' : '') + '">' + inner + '</li>';
      return '<li class="is-now" aria-current="step"><a class="g-go" ' + go + '>' + inner + '<span class="grow"></span>' + icon('arrow', 16, MIST, 2.2) + '</a></li>';
    }).join('') + '</ol></div>';
  }
  function campIco(c, off) { return '<span class="crow-ico' + (off ? ' is-off' : '') + '">' + icon(c.icon, 16, PINE, 1.9) + '</span>'; }
  // Your camps, with the time each has actually saved this week, then the ones you can still connect.
  function campsList() {
    var on = D.CAMPS.filter(function (c) { return isOn(c.id); }), off = unexplored();
    return (on.length ? '<div class="label">Your camps</div><div class="acts">' + on.map(campCard).join('') + '</div>' : '') +
      (off.length ? '<div class="label">Not connected yet</div><div class="clist">' + off.map(function (c) {
        return '<div class="crow is-off">' + campIco(c, true) + '<span class="grow col"><b>' + esc(c.name) + '</b><span class="soft">' + esc(c.tools.join(', ')) + '</span></span><button type="button" class="btn ghost sm" data-action="explore" data-camp="' + c.id + '">Connect</button></div>';
      }).join('') + '</div>' : '');
  }

  // A trail report is ready every evening at 5. In the demo a day of work runs in minutes, so one is also
  // ready once Sherpa has finished eight more tasks since you last read one (four, for the very first).
  var REPORT_HOUR = 17, REPORT_TASKS = 8, FIRST_REPORT_TASKS = 4;
  function reportReady() {
    if (!climbing()) return false;
    var r = state.reportRead || { at: state.baseAt, n: 0 }, n = liveDone().length, eve = startOfDay() + REPORT_HOUR * 3600000;
    return n > r.n && (n - r.n >= (state.reportRead ? REPORT_TASKS : FIRST_REPORT_TASKS) || (Date.now() >= eve && r.at < eve));
  }
  function markReportRead() { state.reportRead = { at: Date.now(), n: liveDone().length }; session.reportShown = false; save(); }
  function reportPop() {
    if (!reportReady()) return '';
    var tm = todayMinutes(), isNew = !session.reportShown; session.reportShown = true;
    return '<div class="rp-pop' + (isNew ? ' is-new' : '') + '" role="status"><a href="#report" class="rp-pop-main">' + sherpaDisc(true, 40) +
      '<span class="grow col"><b>Your trail report</b><span>Ready. ' + (tm >= 60 ? f1(tm / 60) + ' h' : tm + ' min') + ' saved today.</span></span><span class="btn mist sm">Read</span></a>' +
      '<button type="button" class="icon-btn on-pine" data-action="report-later" aria-label="Dismiss the trail report">' + icon('close', 14, MIST, 2.5) + '</button></div>';
  }
  function renderHome(r) {
    if (desk()) {
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left">' + (guiding() ? '' : reportPop()) + elevCard() + campsLink() + '</aside>' +
        '<div class="d-center">' + viewPanel('home', { ask: 'Ask Sherpa' }) + '</div>' + homeSherpaPanel() + '</main>';
    }
    var n = openApprovals().length;
    if (!climbing()) return pHeader(r) + '<main class="p-main" id="main"><div class="sp-card pine">' + sherpaHead('Your guide') + guide() + '</div>' + elevCard(true) +
      viewPanel('home', { cls: 'is-preview', noExpand: true }) + '<a href="#map" class="link-row">Open the full map ' + icon('arrow', 16, PINE, 2.2) + '</a>' +
      campsLink() + '</main>' + pTabs(r);
    return pHeader(r) + '<main class="p-main" id="main">' + (guiding() ? '<div class="sp-card pine">' + sherpaHead('Your guide') + guide() + '</div>' : reportPop()) + elevCard(true) +
      '<a href="#approvals" class="need"><span class="need-n">' + n + '</span><span class="grow">' + (n ? 'need you' : 'All clear') + '</span><span class="btn primary sm">' + (n ? 'Review' : 'Open') + '</span></a>' +
      viewPanel('home', { cls: 'is-preview', noExpand: true }) +
      '<a href="#map" class="link-row">Open the full map ' + icon('arrow', 16, PINE, 2.2) + '</a>' +
      askBar('Ask Sherpa') +
      campsLink() + '</main>' + pTabs(r);
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

  // Your camps, logged like hikes, then the ones still to connect.
  function renderCamps(r) {
    var body = '<h1>Camps</h1><p class="lede">Each camp is a tool you already use. Connect any of them' + (climbing() ? ' and Sherpa starts working there.' : '. Sherpa works in them once Base Camp is made.') + '</p>' + campsList();
    if (desk()) return dHeader(r) + '<main class="d-page camps-page" id="main">' + body + '</main>';
    return pHeader(r) + '<main class="p-main camps-page" id="main">' + body + '</main>' + pTabs(r);
  }
  // On Home, one line that leads to the Camps page.
  function campsLink() {
    var n = madeCount(), names = madeNames();
    return '<a href="#camps" class="camps-link">' + (n ? '<span class="cl-icos">' + D.CAMPS.filter(function (c) { return isOn(c.id); }).slice(0, 4).map(function (c) { return campIco(c); }).join('') + '</span>' : '') +
      '<span class="grow col"><b>Your camps</b><span>' + (n ? esc(listing(names.length > 2 ? [names[0], names[1], (names.length - 2) + ' more'] : names)) : 'Connect your first camp') + '</span></span>' + icon('arrow', 18, PINE, 2.2) + '</a>';
  }

  function permGroup(c) {
    var p = state.perms[c.id] || 'ask';
    return '<div class="label">Sherpa may</div><div class="seg wide" role="radiogroup" aria-label="What Sherpa may do in ' + esc(c.name) + '">' +
      [['read', 'Read'], ['ask', 'Ask first'], ['act', 'Act alone']].map(function (o) {
        return '<button type="button" role="radio" aria-checked="' + (p === o[0]) + '" aria-pressed="' + (p === o[0]) + '" data-action="perm" data-camp="' + c.id + '" data-perm="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div>';
  }
  function campInfo(c) {
    var have = toolsOf(c.id);
    var wk = weekDone(c.id), min = wk.reduce(function (a2, d) { return a2 + d.min; }, 0), when = madeOn(c.id);
    // the kinds of work Sherpa did here, most time saved first: the camp's "splits"
    var kinds = {}; wk.forEach(function (d) { var k = kinds[d.text] || (kinds[d.text] = { text: d.text, n: 0, min: 0 }); k.n++; k.min += d.min; });
    kinds = Object.keys(kinds).map(function (k) { return kinds[k]; }).sort(function (a2, b2) { return b2.min - a2.min; }).slice(0, 5);
    return '<h1 class="camp-h1">' + esc(c.name) + '</h1><div class="soft">' + esc(toolsLabel(c.id)) + (when ? ' · camp made ' + when : '') + '</div>' +
      '<div class="label">Last 7 days</div><div class="act-stats big">' +
      statCell('Time saved', f1(min / 60) + ' h') + statCell('Tasks', wk.length) + statCell('Per task', wk.length ? Math.round(min / wk.length) + ' min' : '–') +
      statCell('Needs you', openApprovals().filter(function (a2) { return a2.camp === c.id; }).length) + statCell('Connectors', toolsOf(c.id).length) + statCell('Memories', c.memories.toLocaleString('en-US')) + '</div>' +
      daysChart(c.id, false) +
      '<div class="label">Top work</div>' + (kinds.length ? '<div class="splits">' + kinds.map(function (k) {
        return '<div class="split"><span class="grow">' + esc(k.text) + '</span><span class="soft num">' + k.n + '×</span><b class="num">' + k.min + ' min</b></div>';
      }).join('') + '</div>' : '<p class="soft">' + (climbing() ? 'Nothing finished here yet. Sherpa is on it.' : 'Sherpa starts here once Base Camp is made.') + '</p>') +
      '<div class="label">Connectors</div><div class="conn-list">' + have.map(function (t) {
        return '<div class="conn-row"><span class="conn-dot" aria-hidden="true"></span><b class="grow">' + esc(t) + '</b>' + (have.length > 1 ? '<button type="button" class="btn text sm" data-action="disconnect" data-camp="' + c.id + '" data-tool="' + esc(t) + '" aria-label="Remove ' + esc(t) + '">Remove</button>' : '<span class="soft sm">Connected</span>') + '</div>';
      }).join('') + '</div>' +
      connectBlock(c) +
      permGroup(c);
  }
  function campSherpa(c) {
    var waiting = openApprovals().filter(function (a) { return a.camp === c.id; }), done = entries().filter(function (e) { return e.camp === c.id && e.day === 'Today'; });
    return sherpaHead(today()) +
      '<p class="sp-say">' + (climbing() ? esc(c.name) + ' is running well.' : 'I start working here once Base Camp is made.') + '</p>' +
      (waiting.length ? '<div class="label on-pine">Waiting on you here</div>' + approvalRows(waiting, true) : '') +
      '<div class="label on-pine">Today in ' + esc(c.name) + '</div><div class="mini-log">' + (done.length ? done.map(function (e) {
        return '<div class="ml-row"><span class="grow">' + esc(e.text) + '</span><b>' + (e.undone ? 'Undone' : '+' + e.min + 'm') + '</b></div>';
      }).join('') : '<p class="sp-note">Nothing yet today.</p>') + '</div>';
  }
  function renderCamp(r) {
    var c = camp(r.camp);
    if (!isOn(c.id)) {
      var body = '<a href="#camps" class="back">' + icon('back', 16, PINE, 2.5) + 'Camps</a><h1 class="camp-h1">' + esc(c.name) + '</h1>' +
        '<p class="lede">Not connected yet. Connect ' + esc(c.tools.join(' or ')) + ' and Sherpa ' + (climbing() ? 'starts working here.' : 'works here once Base Camp is made.') + '</p>' + campDoes(c) + connectBlock(c);
      if (desk()) return dHeader(r) + '<main class="d-page narrow" id="main">' + body + '</main>';
      return pHeader(r, ['camps', 'Camps']) + '<main class="p-main" id="main">' + body.replace(/<a href="#camps" class="back">.*?<\/a>/, '') + '</main>' + pTabs(r);
    }
    if (desk()) {
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left"><a href="#camps" class="back">' + icon('back', 16, PINE, 2.5) + 'Camps</a>' + campInfo(c) + '</aside>' +
        '<div class="d-center">' + viewPanel(c.id, { ask: 'Ask about ' + c.name }) + '</div><aside class="d-right pine" aria-label="Sherpa">' + campSherpa(c) + '</aside></main>';
    }
    return pHeader(r, ['camps', 'Camps']) + '<main class="p-main" id="main">' + campInfo(c).replace('<div class="label">Sherpa may</div>', '<div class="p-view-slot"></div><div class="label">Sherpa may</div>') + '</main>' + pTabs(r);
  }

  function renderLog(r) {
    var all = entries(), cats = [['all', 'All camps', elevation()]].concat(D.CAMPS.filter(function (c) { return isOn(c.id); }).map(function (c) { return [c.id, c.name, campHours(c.id)]; }));
    var q = session.logQuery.toLowerCase();
    var shown = all.filter(function (e) { return (session.logCamp === 'all' || e.camp === session.logCamp) && (!q || (e.text + ' ' + camp(e.camp).name + ' ' + e.source).toLowerCase().indexOf(q) > -1); });
    function group(day) { var g = shown.filter(function (e) { return e.day === day; }); return g.length ? '<div class="label">' + day + '</div><div class="log-list">' + logRows(g, !desk()) + '</div>' : ''; }
    var days = []; shown.forEach(function (e) { if (days.indexOf(e.day) < 0) days.push(e.day); });
    var lists = days.map(group).join('') || (all.length ? '<p class="lede">Nothing matches.</p>' : '<p class="lede">Nothing yet. Every task Sherpa finishes for you lands here, with the time it saved.</p>');
    if (desk()) {
      var sel = all.filter(function (e) { return e.id === session.logSel; })[0] || shown[0] || all[0];
      if (sel) session.logSel = sel.id;
      return dHeader(r) + '<main class="d-grid" id="main"><aside class="d-left"><div class="hero-num">+' + f1(elevation()) + ' h</div><div class="soft">This week</div>' +
        '<div class="label">By camp</div><div class="filters" role="group" aria-label="Filter by camp">' + cats.map(function (k) {
          return '<button type="button" class="filter" aria-pressed="' + (session.logCamp === k[0]) + '" data-action="log-camp" data-camp="' + k[0] + '"><span>' + esc(k[1]) + '</span><span class="num">' + f1(k[2]) + '</span></button>';
        }).join('') + '</div><a href="#report" class="btn ghost block">Trail report</a></aside>' +
        '<section class="d-center card-pane"><form class="search" data-form="log-search" role="search"><label class="sr" for="log-q">Search the trail log</label><input id="log-q" type="search" placeholder="Search the trail log" value="' + esc(session.logQuery) + '"></form><div class="log-scroll">' + lists + '</div></section>' +
        '<aside class="d-right pine" aria-label="Receipt">' + (sel ? receipt(sel) : '') + '</aside></main>';
    }
    return pHeader(r) + '<main class="p-main" id="main"><h1>Trail log</h1><div class="row base gap8"><span class="stat">+' + f1(elevation()) + ' h</span><span class="soft">this week</span></div>' +
      '<div class="chips scroll-x" role="group" aria-label="Filter by camp">' + cats.map(function (k) {
        return '<button type="button" class="chipbtn" aria-pressed="' + (session.logCamp === k[0]) + '" data-action="log-camp" data-camp="' + k[0] + '">' + esc(k[0] === 'all' ? 'All' : camp(k[0]).short) + '</button>';
      }).join('') + '</div>' + lists + '<a href="#report" class="btn ghost block">Trail report</a></main>' + pTabs(r);
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
    var u = unexplored()[0];
    var next = u ? 'Connect ' + u.name + ' and I\'ll start working there too.' : !climbing() ? 'Make Base Camp to start the climb.' : 'Hold the line. You are near the top.';
    // A new report every evening: what Sherpa did today, where the week stands, and the one thing to do next.
    markReportRead();
    var a0 = startOfDay(), today = liveDone().filter(function (d) { return d.ts >= a0; }), tm = todayMinutes(), n = openApprovals().length;
    function minToday(id) { return today.filter(function (d) { return d.camp === id; }).reduce(function (s, d) { return s + d.min; }, 0); }
    var maxT = Math.max.apply(null, on.map(function (c) { return minToday(c.id); }).concat([1]));
    var body = '<article class="report"><header class="rp-head">' + sherpaDisc(false, 44) + '<div class="grow col"><b>Trail report</b><span class="soft">' + WEEKDAYS[new Date().getDay()] + '. A new one every evening.</span></div>' +
      '<a href="#log" class="icon-btn" aria-label="Close">' + icon('close', 16, PINE, 2.5) + '</a></header>' +
      '<div class="rp-hero"><span>' + (tm >= 60 ? f1(tm / 60) : tm) + '</span><b>' + (tm >= 60 ? 'hours' : 'minutes') + ' saved today</b></div><p class="soft">' + f1(elevation()) + ' h this week. ' + (toGo() > 0 ? fh(toGo()) + ' h to the summit.' : 'Summit reached.') + '</p>' +
      (on.length && tm ? '<div class="label">Today by camp</div><div class="bars">' + on.filter(function (c) { return minToday(c.id); }).map(function (c) {
        return '<div class="bar-row"><span class="br-name">' + esc(c.name) + '</span><span class="br-track"><span style="width:' + Math.round(minToday(c.id) / maxT * 100) + '%"></span></span><b class="num">' + minToday(c.id) + ' min</b></div>';
      }).join('') + '</div>' : '') +
      '<div class="label">Today</div><p>' + (today.length === 1 ? 'One task done.' : today.length + ' tasks done.') + (state.approvals.a1 ? ' Sarah has her follow-up.' : '') + (n ? ' ' + needsLine(n) : '') + '</p>' +
      '<div class="label">Tomorrow</div><p>' + esc(next) + '</p>' +
      '<div class="rp-actions">' + (!climbing() ? '<button type="button" class="btn primary block lg" data-action="basecamp">Make Base Camp</button>' : u ? '<button type="button" class="btn primary block lg" data-action="explore" data-camp="' + u.id + '">Connect ' + esc(u.name) + '</button>' : '') +
      '<a href="#log" class="btn text block">Open trail log</a></div></article>';
    if (desk()) return dHeader(r) + '<main class="d-page center" id="main">' + body + '</main>';
    return pHeader(r) + '<main class="p-main" id="main">' + body + '</main>' + pTabs(r);
  }

  function renderGear(r) {
    var body = '<h1>Settings</h1>' +
      '<div class="label">Your AIs</div><p class="soft">Base Camp runs on as many as you like. Your memories work with all of them.</p><div class="tiles2" role="group" aria-label="AI models">' + D.MODELS.map(function (m) {
        return '<button type="button" class="tile-radio" role="checkbox" aria-checked="' + (state.models.indexOf(m.id) > -1) + '" data-action="model" data-model="' + m.id + '"><b>' + m.id + '</b><span>' + m.by + '</span></button>';
      }).join('') + '</div>' +
      '<div class="label">Your photo</div><div class="row gap12 base">' + photoPick(56) + (state.photo ? '<button type="button" class="btn text" data-action="photo-remove">Remove</button>' : '') + '</div>' +
      '<div class="label">Your name</div><form class="row gap8" data-form="rename"><label class="sr" for="gear-name">Your first name</label><input id="gear-name" class="input grow" type="text" value="' + esc(state.name) + '" autocomplete="given-name"><button type="submit" class="btn ghost">Save</button></form>' +
      '<div class="label">Your summit</div><div class="row base gap8"><span class="stat">' + state.summit + ' h</span><span class="soft">a week, for ' + esc(state.why.toLowerCase()) + '</span></div><div class="chips">' + [-5, 5].map(function (d) { return '<button type="button" class="chipbtn" data-action="gear-summit" data-d="' + d + '">' + (d > 0 ? '+' : '') + d + ' h</button>'; }).join('') + '</div>' +
      '<div class="label">Demo</div><button type="button" class="btn ghost" data-action="intro-replay">Watch the intro again</button>' + (session.confirmReset ?
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
      '<text x="140" y="164" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="800" letter-spacing="2.5" fill="' + MIST + '">SAVED A WEEK</text>' +
      '<polygon points="14,174 266,174 254,188 266,202 14,202 26,188" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<text x="140" y="193" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="3" fill="' + PINE + '">SUMMIT ' + ('0' + n).slice(-2) + '</text>' +
      '<text x="140" y="222" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="700" letter-spacing="2.5" fill="' + MIST + '">' + monthTag() + '</text></svg>';
  }
  var nextPick = null;
  function renderSummit(r) {
    var reached = elevation() >= state.summit;
    var hrs = state.summit, n = Math.max(1, state.summits + (reached && state.reached !== state.summit ? 1 : 0));
    var opts = [[hrs + 5, 'The next ridge'], [hrs + 10, 'The high pass'], [hrs, 'Stay here']];
    if (!nextPick) nextPick = opts[0][0];
    var body = '<div class="summit-wrap">' + award(hrs, state.name, n) +
      (reached ? '<h1>You made the summit</h1><p class="lede">' + hrs + ' hours saved a week, for ' + esc(state.why.toLowerCase()) + '.</p>' +
        '<div class="label">Your next summit</div><div class="tiles3" role="radiogroup" aria-label="Next summit">' + opts.map(function (o, i) {
          var val = i === 2 ? 'hold' : o[0];
          return '<button type="button" class="tile-radio" role="radio" aria-checked="' + (String(nextPick) === String(val)) + '" data-action="next-pick" data-v="' + val + '"><b>' + (i === 2 ? 'Hold' : o[0] + ' h') + '</b><span>' + (i === 2 ? 'at ' + hrs + ' h saved' : 'saved a week') + '</span><small>' + o[1] + '</small></button>';
        }).join('') + '</div>' +
        '<div class="row gap12 center"><button type="button" class="btn primary lg" data-action="next-set">' + (nextPick === 'hold' ? 'Hold at ' + hrs + ' h' : 'Climb to ' + nextPick + ' h') + '</button><button type="button" class="btn ghost lg" data-action="share">Share the award</button></div>'
        : '<h1>Not there yet</h1><p class="lede">' + fh(toGo()) + ' hours to go. Every task Sherpa finishes gets you closer. Connect more camps to climb faster.</p><a href="#home" class="btn primary lg">Back to the climb</a>') +
      '</div>';
    if (desk()) return dHeader(r) + '<main class="d-page summit" id="main"><img class="tex" src="assets/texture-mist.svg" alt="">' + body + '</main>';
    return pHeader(r) + '<main class="p-main summit" id="main"><img class="tex" src="assets/texture-mist.svg" alt="">' + body + '</main>' + pTabs(r);
  }

  /* ================= the mountain ================= */
  // Every mountain is generated from its number: the same layout each time you open it, a new one after
  // every summit. One trail runs from the trailhead up to Base Camp. Every camp is scattered below Base Camp on its
  // own winding trail, so any one of them is enough. The summit route above Base Camp stays clear.
  var MW = 3000, MH = 3000, worlds = {};
  var MS = { 1: [['L', 'B']], 2: [['B', 'R']], 3: [['L', 'R']], 4: [['T', 'R']], 5: [['L', 'T'], ['B', 'R']], 6: [['T', 'B']], 7: [['L', 'T']],
    8: [['L', 'T']], 9: [['T', 'B']], 10: [['T', 'R'], ['L', 'B']], 11: [['T', 'R']], 12: [['L', 'R']], 13: [['B', 'R']], 14: [['L', 'B']] };
  // A smooth path through points (Catmull-Rom as cubic curves).
  function curve(pts) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      out.push('C' + r1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + r1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + r1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + r1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + r1(p2[0]) + ' ' + r1(p2[1]));
    }
    return out;
  }
  // A point nudged sideways between each pair, so trails wind like real ones. Waypoint i ends up at index 2i.
  function wind(pts, r, amt) {
    var out = [pts[0]];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, off = (r() - 0.5) * 2 * amt * Math.min(1, len / 300);
      out.push([(a[0] + b[0]) / 2 - dy / len * off, (a[1] + b[1]) / 2 + dx / len * off], b);
    }
    return out;
  }
  function world(n) {
    if (worlds[n]) return worlds[n];
    var r = rng(seedOf('apex-mountain-' + n)), cx = MW / 2, side = r() < 0.5 ? -1 : 1;
    var summit = [cx + (r() - 0.5) * 640, 250 + r() * 120];
    var base = [cx + (r() - 0.5) * 360, 1880 + r() * 120];
    // The trailhead sits below everything else on the map: the lowest point of the climb.
    var trailhead = [cx + side * (260 + r() * 220), base[1] + 1650];
    var pts = {}, sides = {}, spur = {};
    // The approach: one trail from the trailhead up to Base Camp.
    var setupPts = [trailhead, [cx + (r() - 0.5) * 160, (trailhead[1] + base[1]) / 2], base];
    var setupSegs = curve(wind(setupPts, r, 80));
    // The summit route: long switchbacks from Base Camp to the top, with nothing else on it.
    var climbPts = [base], legs = 6;
    for (var i = 1; i < legs; i++) { var t = i / legs; climbPts.push([base[0] + (summit[0] - base[0]) * t + (i % 2 ? 1 : -1) * (210 + r() * 230) * (1 - t * 0.5), base[1] + (summit[1] - base[1]) * t]); }
    climbPts.push(summit);
    var climb = 'M' + r1(base[0]) + ' ' + r1(base[1]) + curve(wind(climbPts, r, 90)).join('');
    // The camps: scattered below Base Camp, each on its own trail out of it, so no two camps share a trail and
    // any one can be made without the others. Nothing sits above Base Camp: that's the summit route. The spread
    // leaves a gap for the approach from the trailhead.
    function ang(p) { return Math.atan2(p[1] - base[1], p[0] - base[0]); }
    // Each camp takes the open spot, out of many tried, that's furthest from everything already on the map:
    // other camps, their trails, the trailhead and the approach. That spreads them out like places on a real
    // map, near and far, never tidy. Everyday camps look a little closer in.
    var order = D.CAMPS.slice();
    for (i = order.length - 1; i > 0; i--) { var j0 = Math.floor(r() * (i + 1)), tmp = order[i]; order[i] = order[j0]; order[j0] = tmp; }
    function segDist(p, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
    var placed = [];
    order.forEach(function (c) {
      var best = null, bestScore = -1;
      for (var tries = 0; tries < 80; tries++) {
        var p = [base[0] + (r() * 2 - 1) * (c.core ? 1000 : 1600), base[1] + 260 + r() * (c.core ? 700 : 1080)], a = ang(p);
        var d = Math.hypot(p[0] - base[0], p[1] - base[1]);
        if (d < 420 || a < 0.2 || a > Math.PI - 0.2 || Math.hypot(p[0] - trailhead[0], p[1] - trailhead[1]) < 460 || segDist(trailhead, base, p) < 320 || p[1] > trailhead[1] - 220) continue;
        var score = Math.min(Math.hypot(p[0] - trailhead[0], p[1] - trailhead[1]) / 560, segDist(p, trailhead, setupPts[1]) / 200, segDist(p, setupPts[1], base) / 200, segDist(trailhead, base, p) / 320, segDist(setupPts[1], base, p) / 200);
        placed.forEach(function (q) {
          score = Math.min(score, Math.hypot(p[0] - q.p[0], p[1] - q.p[1]) / 480, segDist(p, base, q.p) / 170, segDist(q.p, base, p) / 170, Math.abs(a - q.a) / 0.12);
        });
        if (score > bestScore) { bestScore = score; best = p; }
      }
      pts[c.id] = best; placed.push({ c: c, a: ang(best), p: best });
      var cs = Math.cos(ang(best));
      sides[c.id] = cs < -0.25 ? 'left' : cs > 0.25 ? 'right' : 'bottom';
    });
    // Trails wind more the further they get from Base Camp, where there's room, and never climb above it.
    placed.forEach(function (q) {
      var gap = Math.PI;
      placed.forEach(function (o) { if (o !== q) gap = Math.min(gap, Math.abs(o.a - q.a)); });
      var p = q.p, dx = p[0] - base[0], dy = p[1] - base[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
      var legs = 3 + Math.floor(len / 320), way = [base];
      for (var j = 1; j < legs; j++) {
        var t = j / legs, amp = Math.min(110, 0.35 * t * len * gap) * (j % 2 ? 1 : -1) * (0.5 + r() * 0.5);
        way.push([base[0] + dx * t + nx * amp, Math.max(base[1] + 30, base[1] + dy * t + ny * amp)]);
      }
      way.push(p);
      spur[q.c.id] = 'M' + r1(base[0]) + ' ' + r1(base[1]) + curve(way).join('');
    });
    var all = [trailhead, base, summit].concat(D.CAMPS.map(function (c) { return pts[c.id]; }));
    var minX = Math.min.apply(null, all.map(function (p) { return p[0]; })) - 260, maxX = Math.max.apply(null, all.map(function (p) { return p[0]; })) + 260;
    var maxY = Math.max.apply(null, all.map(function (p) { return p[1]; })) + 150;
    var crop = [minX, summit[1] - 240, maxX - minX, maxY - (summit[1] - 240)];
    // Before Base Camp: the trailhead, Base Camp and every camp around it, all in one view.
    var low = [trailhead, base].concat(D.CAMPS.map(function (c) { return pts[c.id]; }));
    var lx = Math.min.apply(null, low.map(function (p) { return p[0]; })) - 300, ly = Math.min.apply(null, low.map(function (p) { return p[1]; })) - 160;
    var approach = [lx, ly, Math.max.apply(null, low.map(function (p) { return p[0]; })) + 300 - lx, Math.max.apply(null, low.map(function (p) { return p[1]; })) + 160 - ly];

    // The terrain: a height map with the summit as the highest point and a gentle hollow around Base Camp,
    // drawn as contour lines that run well past the mountain on every side.
    var peaks = [[summit[0], summit[1] + 160, 1, 900, 1750], [base[0], base[1] + 220, -0.1, 760, 420]];
    for (i = 0; i < 14; i++) peaks.push([r() * MW, 300 + r() * (MH - 600), 0.15 + r() * 0.32, 180 + r() * 360, 180 + r() * 420]);
    for (i = 0; i < 30; i++) { var ang = r() * Math.PI * 2, dist = 1900 + r() * 2900; peaks.push([MW / 2 + Math.cos(ang) * dist, MH / 2 + Math.sin(ang) * dist, 0.25 + r() * 0.4, 260 + r() * 420, 260 + r() * 460]); }
    peaks.push([summit[0] - 620 - r() * 200, summit[1] + 700 + r() * 300, 0.45, 360, 620], [summit[0] + 620 + r() * 200, summit[1] + 820 + r() * 300, 0.4, 380, 600]);
    var nz = r() * 1000;
    function height(x, y) {
      var h = 0.55 * (1 - clamp(y, -300, MH + 300) / MH) * Math.exp(-Math.pow(Math.max(0, Math.abs(x - MW / 2) - 2200) / 1600, 2));
      for (var q = 0; q < peaks.length; q++) { var pk = peaks[q], dx = (x - pk[0]) / pk[3], dy = (y - pk[1]) / pk[4]; h += pk[2] * Math.exp(-(dx * dx + dy * dy)); }
      return h + 0.035 * Math.sin(x * 0.006 + nz) * Math.cos(y * 0.005 - nz) + 0.02 * Math.sin(x * 0.015 + y * 0.011 + nz * 2);
    }
    var cell = 34, gx = -2700, gy = -2700, gw = Math.round((MW + 5400) / cell) + 1, gh = Math.round((MH + 5400) / cell) + 1, f = new Float32Array(gw * gh), lo = 1e9, hi = -1e9;
    for (var j = 0; j < gh; j++) for (i = 0; i < gw; i++) { var v = height(gx + i * cell, gy + j * cell); f[j * gw + i] = v; if (v < lo) lo = v; if (v > hi) hi = v; }
    var LV = 42, thin = [], thick = [];
    for (var L = 1; L < LV; L++) {
      var lv = lo + (hi - lo) * L / LV, out = L % 5 ? thin : thick;
      for (j = 0; j < gh - 1; j++) for (i = 0; i < gw - 1; i++) {
        var a = f[j * gw + i], b = f[j * gw + i + 1], c2 = f[(j + 1) * gw + i + 1], d = f[(j + 1) * gw + i];
        var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c2 > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (!idx || idx === 15) continue;
        var x0 = gx + i * cell, yy = gy + j * cell, E = {};
        MS[idx].forEach(function (seg) {
          seg.forEach(function (e) {
            if (E[e]) return;
            E[e] = e === 'T' ? [x0 + cell * (lv - a) / (b - a), yy] : e === 'R' ? [x0 + cell, yy + cell * (lv - b) / (c2 - b)] : e === 'B' ? [x0 + cell * (lv - d) / (c2 - d), yy + cell] : [x0, yy + cell * (lv - a) / (d - a)];
          });
          out.push('M' + Math.round(E[seg[0]][0]) + ' ' + Math.round(E[seg[0]][1]) + 'L' + Math.round(E[seg[1]][0]) + ' ' + Math.round(E[seg[1]][1]));
        });
      }
    }
    var terrain = '<rect x="-6000" y="-6000" width="' + (MW + 12000) + '" height="' + (MH + 12000) + '" fill="' + MIST + '"/>' +
      '<path d="' + thin.join('') + '" fill="none" stroke="' + PINE + '" stroke-opacity="0.13" stroke-width="1" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + thick.join('') + '" fill="none" stroke="' + PINE + '" stroke-opacity="0.26" stroke-width="1.2" vector-effect="non-scaling-stroke"/>';
    worlds[n] = { n: n, pts: pts, sides: sides, trailhead: trailhead, base: base, summit: summit, setupPts: setupPts, setupSegs: setupSegs, climb: climb, spur: spur, crop: crop, approach: approach, terrain: terrain };
    return worlds[n];
  }

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
    var len = measure.getTotalLength();
    return { len: len, at: function (l) { measure.setAttribute('d', d); var p = measure.getPointAtLength(l); return [p.x, p.y]; } };
  }
  function halo(x, y, txt, k, o) {
    o = o || {};
    return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + r1((o.size || 12) * k) + '" font-weight="' + (o.weight || 800) + '" letter-spacing="' + r1((o.ls == null ? 0.7 : o.ls) * k) + '" fill="' + (o.fill || PINE) + '" ' + (o.opacity ? 'fill-opacity="' + o.opacity + '" ' : '') +
      'stroke="' + MIST + '" stroke-width="' + r1(5 * k) + '" stroke-linejoin="round" paint-order="stroke" class="lbl">' + esc(txt) + '</text>';
  }
  // A label beside a marker. If it would run off the edge of the view it moves to the other side, or below,
  // so names never get cut off on a narrow screen.
  var labelVB = null;
  function labelAt(p, side, rpx, k, lines) {
    var out = '', gap = (rpx + 8) * k, x = p[0], y = p[1], anchor = 'middle', lh = 15 * k, y0;
    if (labelVB) {
      var wide = Math.max.apply(null, lines.map(function (l) { return l.t.length * ((l.size || 12) * 0.72 + (l.ls == null ? 0.7 : l.ls)) * k; })), L = labelVB[0] + 6 * k, R = labelVB[0] + labelVB[2] - 6 * k;
      var fitsR = x + gap + wide <= R, fitsL = x - gap - wide >= L;
      if (side === 'right' && !fitsR) side = fitsL ? 'left' : 'bottom';
      else if (side === 'left' && !fitsL) side = fitsR ? 'right' : 'bottom';
      if (side === 'top' || side === 'bottom') x = clamp(x, L + wide / 2, Math.max(L + wide / 2, R - wide / 2));
    }
    if (side === 'right') { x += gap; anchor = 'start'; y0 = y + 4 * k - (lines.length - 1) * lh / 2; }
    else if (side === 'left') { x -= gap; anchor = 'end'; y0 = y + 4 * k - (lines.length - 1) * lh / 2; }
    else if (side === 'top') { y0 = y - gap - (lines.length - 1) * lh; }
    else { y0 = y + gap + 10 * k; }
    lines.forEach(function (l, i) { out += halo(x, y0 + i * lh, l.t, k, { anchor: anchor, size: l.size || 12, weight: l.w || 800, opacity: l.o, ls: l.ls }); });
    return out;
  }
  // The visible part of the map, kept to the frame's shape, between a close-up and the whole mountain.
  // The land you can move around in: the mountain plus wide country on every side.
  var MAPBOX = { x: -2400, y: -2400, w: MW + 4800, h: MH + 4800 };
  function fitVB(vb, W, H) { var a = W / H, w = vb[2], h = vb[3], cx = vb[0] + w / 2, cy = vb[1] + h / 2; if (w / h > a) h = w / a; else w = h * a; return [cx - w / 2, cy - h / 2, w, h]; }
  function clampVB(vb, g, W, H) {
    var a = W / H, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2;
    var gx = g.x || 0, gy = g.y || 0, maxW = Math.min(g.w, g.h * a), w = clamp(vb[2], Math.min(maxW, 320), maxW), h = w / a;
    var x = w >= g.w ? gx + (g.w - w) / 2 : clamp(cx - w / 2, gx, gx + g.w - w);
    var y = h >= g.h ? gy + (g.h - h) / 2 : clamp(cy - h / 2, gy, gy + g.h - h);
    return [x, y, w, h];
  }
  function focusOn(p, W, H, vw) { vw = vw || 900; var vh = vw * H / W; return [p[0] - vw / 2, p[1] - vh / 2, vw, vh]; }
  function drawMap(host, opts) {
    var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
    var w = world(state.mapN || 1), pre = !climbing(), e = elevation(), still = !!opts.still;
    var ct = pathTool(w.climb), frac = pre ? 0 : clamp(e / state.summit, 0, 1);
    // Past Base Camp you start a little way up the summit trail, so your pin never hides Base Camp itself.
    var start = Math.min(ct.len * 0.05, 170), you;
    if (still) you = w.trailhead;
    else if (pre) you = w.trailhead;
    else you = ct.at(Math.max(ct.len * frac, start));
    var baseSide = ct.at(start)[0] < w.base[0] ? 'right' : 'left';
    var vb;
    if (opts.live) {
      var key = (opts.key || 'home') + '-' + w.n;
      // Full screen shows the whole mountain. Before Base Camp the map opens on the way up to it, so every
      // camp is in view; after, it opens on you, like a game camera.
      var base = clampVB(fitVB(opts.key === 'full' ? w.crop : pre ? w.approach : focusOn(you, W, H, opts.key === 'pv' ? 1300 : 1600), W, H), MAPBOX, W, H);
      vb = session.mapVB[key] ? clampVB(session.mapVB[key], MAPBOX, W, H) : base;
      session.mapVB[key] = vb;
      host._map = { key: key, g: MAPBOX, base: base, opts: opts };
    } else {
      vb = clampVB(fitVB(w.crop, W, H), MAPBOX, W, H);
      host._map = null;
    }
    labelVB = vb;
    // Zoomed far out, markers shrink a little and the estimates hide, so the whole mountain stays readable.
    var zf = clamp(vb[2] / 1300, 1, 6), dense = zf > 1.6, far = zf > 2.7;
    var k = 1 / Math.max(W / vb[2], H / vb[3]) * (still ? 0.55 : 1 / Math.sqrt(zf)), vbs = vb.map(r1).join(' ');
    // The contours are drawn once per mountain and kept; moving around only changes what part is in view.
    var ter = $('svg.map-terrain', host);
    if (!ter || ter.getAttribute('data-n') !== String(w.n)) {
      host.innerHTML = '<svg class="map-terrain" data-n="' + w.n + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + w.terrain + '</svg><div class="map-over"></div>';
      ter = $('svg.map-terrain', host);
    }
    ter.setAttribute('viewBox', vbs); ter.setAttribute('width', W); ter.setAttribute('height', H);
    function mk(action, extra, label) { return still ? '<g aria-hidden="true">' : '<g class="mk" data-action="' + action + '"' + (extra || '') + ' role="button" tabindex="0" aria-label="' + esc(label) + '">'; }
    var s = ['<svg class="map-svg" xmlns="http://www.w3.org/2000/svg" viewBox="' + vbs + '" preserveAspectRatio="xMidYMid slice" width="' + W + '" height="' + H + '">'];
    var dotted = ' stroke-opacity="0.9" stroke-width="' + r1(3.2 * k) + '" stroke-dasharray="0 ' + r1(8 * k) + '"', solid = ' stroke-width="' + r1(3.5 * k) + '"', ends = ' stroke-linecap="round" stroke-linejoin="round"';
    var setup = 'M' + r1(w.trailhead[0]) + ' ' + r1(w.trailhead[1]) + w.setupSegs.join('');
    // the trail to Base Camp: solid once you're there
    s.push('<path d="' + setup + '" fill="none" stroke="' + PINE + '"' + (pre || still ? dotted : solid) + ends + '/>');
    // a trail from Base Camp to each camp
    D.CAMPS.forEach(function (c) { if (w.spur[c.id]) s.push('<path d="' + w.spur[c.id] + '" fill="none" stroke="' + PINE + '"' + (isOn(c.id) && !still ? solid : dotted) + ends + '/>'); });
    // the climb: dotted ahead, solid walked
    s.push('<path d="' + w.climb + '" fill="none" stroke="' + PINE + '"' + dotted + ends + '/>');
    if (frac > 0) s.push('<path d="' + w.climb + '" fill="none" stroke="' + PINE + '" stroke-width="' + r1(3.5 * k) + '" stroke-dasharray="' + r1(ct.len * frac) + ' ' + r1(ct.len * 2) + '"' + ends + '/>');
    // hour markers on the climb
    if (!still) [0.25, 0.5, 0.75].forEach(function (fq) {
      var p = ct.at(ct.len * fq);
      s.push('<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(5 * k) + '" fill="' + MIST + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>');
      if (pre || Math.abs(fq - frac) > 0.08) s.push(halo(p[0] + 10 * k, p[1] + 4 * k, fh(state.summit * fq) + ' h', k, { anchor: 'start', size: 12, weight: 700, ls: 0 }));
    });
    // trailhead
    var th = w.trailhead;
    s.push(mk('toast', ' data-msg="The trailhead. Where your climb starts."', 'Trailhead') + '<circle cx="' + r1(th[0]) + '" cy="' + r1(th[1]) + '" r="' + r1(22 * k) + '" fill="' + PINE + '" stroke="' + PINE + '" stroke-width="' + r1(2 * k) + '"/>' + iconAt('trailhead', th, 20 * k, MIST) +
      labelAt(th, th[0] < MW / 2 ? 'left' : 'right', 22, k, [{ t: 'TRAILHEAD', size: 12 }]) + '</g>');
    // camps
    D.CAMPS.forEach(function (c) {
      var p = w.pts[c.id], on = isOn(c.id) && !still, rpx = c.core ? 24 : 22, lines = [{ t: c.name.toUpperCase() }];
      if (!on && !dense && !still) lines.push({ t: 'CONNECT', size: 11, w: 600, o: 0.72 });
      s.push(mk(on ? 'open-camp' : 'explore', ' data-camp="' + c.id + '"', c.name + (on ? ' camp' : ', not connected')) +
        '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(rpx * k) + '" fill="' + (on ? PINE : MIST) + '" stroke="' + PINE + '"' + (on ? '' : ' stroke-dasharray="' + r1(5 * k) + ' ' + r1(3.5 * k) + '"') + ' stroke-width="' + r1(2.5 * k) + '"/>' +
        iconAt(c.icon, p, 22 * k, on ? MIST : PINE) + (still || far ? '' : labelAt(p, w.sides[c.id], rpx, k, lines)) + '</g>');
    });
    // base camp
    var b = w.base;
    s.push(mk(pre ? 'basecamp' : 'go', ' data-to="gear"', 'Base Camp' + (pre ? ', not made yet' : ', ' + modelsLabel())) + '<circle cx="' + r1(b[0]) + '" cy="' + r1(b[1]) + '" r="' + r1(24 * k) + '" fill="' + (pre || still ? MIST : PINE) + '" stroke="' + PINE + '"' + (pre || still ? ' stroke-dasharray="' + r1(5 * k) + ' ' + r1(3.5 * k) + '"' : '') + ' stroke-width="' + r1(2.5 * k) + '"/>' + iconAt('base', b, 22 * k, pre || still ? PINE : MIST) +
      labelAt(b, pre || still ? (b[0] < MW / 2 ? 'left' : 'right') : baseSide, 24, k, pre || still ? [{ t: 'BASE CAMP' }] : [{ t: 'BASE CAMP' }, { t: modelsLabel().toUpperCase(), size: 11, w: 600, o: 0.72 }]) + '</g>');
    // summit: the Apex mark
    var sm = w.summit, top = !pre && !still && e >= state.summit;
    s.push(mk('summit', '', 'Summit, ' + state.summit + ' hours a week') + '<circle cx="' + r1(sm[0]) + '" cy="' + r1(sm[1]) + '" r="' + r1(26 * k) + '" fill="' + (top ? PINE : MIST) + '" stroke="' + PINE + '" stroke-dasharray="' + (top ? '0' : r1(4 * k) + ' ' + r1(4 * k)) + '" stroke-width="' + r1(2 * k) + '"/>' +
      '<image href="assets/' + (top ? 'icon-white.svg' : 'icon.svg') + '" x="' + r1(sm[0] - 11 * k) + '" y="' + r1(sm[1] - 12.5 * k) + '" width="' + r1(22 * k) + '" height="' + r1(23.8 * k) + '"/>' +
      labelAt(sm, sm[0] < MW / 2 ? 'right' : 'left', 26, k, [{ t: 'SUMMIT · ' + state.summit + ' H', size: 13 }, { t: state.why.toUpperCase() + ((state.mapN || 1) > 1 ? ' · MOUNTAIN ' + state.mapN : ''), size: 11, w: 600, o: 0.72 }]) + '</g>');
    // you: a map pin whose tip marks your spot, with your photo (or the climber) in its head. At the trailhead
    // it stands on top of the trailhead marker.
    if (!still) {
      if (pre) you = [you[0], you[1] - 20 * k];
      var R = 24 * k, ir = 18 * k, hx = you[0], hy = you[1] - 40 * k, txt = pre ? 'You' : f1(e) + ' h', pw = (22 + txt.length * 9.6) * k, ph = 32 * k;
      var fitsR = hx + R + 8 * k + pw < vb[0] + vb[2] - 8 * k, px = fitsR ? hx + R + 8 * k : hx - R - 8 * k - pw, py = hy - ph / 2;
      s.push('<g class="mk you-pin" data-action="go" data-to="log" role="button" tabindex="0" aria-label="You, ' + (pre ? 'at the trailhead' : f1(e) + ' hours saved this week') + '">' +
        '<path d="M' + r1(you[0]) + ' ' + r1(you[1]) + ' L' + r1(hx - 0.8 * R) + ' ' + r1(hy + 0.6 * R) + ' A' + r1(R) + ' ' + r1(R) + ' 0 1 1 ' + r1(hx + 0.8 * R) + ' ' + r1(hy + 0.6 * R) + ' Z" fill="' + PINE + '"/>' +
        '<circle cx="' + r1(hx) + '" cy="' + r1(hy) + '" r="' + r1(ir) + '" fill="' + MIST + '"/>' +
        (state.photo ? '<defs><clipPath id="you-clip"><circle cx="' + r1(hx) + '" cy="' + r1(hy) + '" r="' + r1(ir) + '"/></clipPath></defs><image href="' + state.photo + '" x="' + r1(hx - ir) + '" y="' + r1(hy - ir) + '" width="' + r1(ir * 2) + '" height="' + r1(ir * 2) + '" preserveAspectRatio="xMidYMid slice" clip-path="url(#you-clip)"/>'
          : '<image href="assets/climber.svg" x="' + r1(hx - 8.5 * k) + '" y="' + r1(hy - 9.3 * k) + '" width="' + r1(17 * k) + '" height="' + r1(18.6 * k) + '"/>') +
        '<rect x="' + r1(px) + '" y="' + r1(py) + '" width="' + r1(pw) + '" height="' + r1(ph) + '" rx="' + r1(ph / 2) + '" fill="' + PINE + '"/>' +
        '<text x="' + r1(px + pw / 2) + '" y="' + r1(py + ph / 2 + 5.5 * k) + '" text-anchor="middle" font-size="' + r1(16 * k) + '" font-weight="800" fill="' + MIST + '">' + txt + '</text></g>');
    }
    s.push('</svg>');
    $('.map-over', host).innerHTML = s.join('');
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', 'Mountain map. ' + (still ? 'Your route.' : pre ? 'At the trailhead. Base Camp is next.' : 'You have saved ' + f1(e) + ' hours this week of a ' + state.summit + ' hour summit.') + (opts.live ? ' Drag to move around, pinch or scroll to zoom.' : ''));
  }
  function iconAt(name, p, size, color) {
    var sc = size / 24;
    return '<g transform="translate(' + r1(p[0] - size / 2) + ' ' + r1(p[1] - size / 2) + ') scale(' + (Math.round(sc * 1000) / 1000) + ')" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</g>';
  }

  /* ================= brain, in 3D ================= */
  // Every camp's memory is a cluster of nodes around Sherpa. Inside a camp, the clusters are the kinds of
  // things it remembers, and the named memories are tied together. Drag to turn it, pinch or scroll to zoom.
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function seedOf(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function gauss(r) { var u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function d3(a, b) { return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z); }
  // Points spread evenly over a sphere.
  // On a tall screen the sphere stretches upward, so the brain uses the height it's given.
  function sphere(n, turn, tall) {
    var out = [], ga = Math.PI * (3 - Math.sqrt(5)), ys = tall ? 1.45 : 0.9;
    for (var i = 0; i < n; i++) { var y = 1 - (i + 0.5) / n * 2, rr = Math.sqrt(1 - y * y), th = ga * i + turn; out.push([Math.cos(th) * rr, y * ys, Math.sin(th) * rr]); }
    return out;
  }
  // A cloud of nodes, each tied to its two nearest neighbours.
  function blob(r, c, n, sigma) {
    var nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: c[0] + gauss(r) * sigma, y: c[1] + gauss(r) * sigma * 0.9, z: c[2] + gauss(r) * sigma, s: r() });
    var edges = [];
    nodes.forEach(function (a, i) {
      var d = nodes.map(function (b, j) { return [j, d3(a, b)]; }).filter(function (q) { return q[0] !== i; }).sort(function (p, q) { return p[1] - q[1]; });
      for (var m = 0; m < Math.min(2, d.length); m++) if (d[m][0] > i || m === 0) edges.push([i, d[m][0]]);
    });
    return { nodes: nodes, edges: edges };
  }
  var brainCache = {};
  function scene(campId, tall) {
    var key = (campId || 'whole') + (tall ? 'T' : ''); if (brainCache[key]) return brainCache[key];
    var out;
    if (!campId) {
      var dirs = sphere(D.CAMPS.length, 0.5, tall);
      out = { R: 330, E: 345, hubs: D.CAMPS.map(function (c, i) {
        var p = dirs[i].map(function (v) { return v * 245; }), n = clamp(Math.round(Math.sqrt(c.memories) * 1.6), 18, 80);
        var b = blob(rng(seedOf('w-' + c.id)), p, n, 18 + Math.sqrt(n) * 3.2);
        return { camp: c, x: p[0], y: p[1], z: p[2], nodes: b.nodes, edges: b.edges, r: 40 + Math.sqrt(n) * 4 };
      }) };
    } else {
      var c = camp(campId), gd = sphere(c.groups.length, 1.1, tall);
      var hubs = c.groups.map(function (g, i) {
        var p = gd[i].map(function (v) { return v * 205; }), n = clamp(Math.round(Math.sqrt(g[1]) * 2.6), 10, 48);
        var b = blob(rng(seedOf('g-' + c.id + '-' + i)), p, n, 14 + Math.sqrt(n) * 3);
        return { group: g, x: p[0], y: p[1], z: p[2], nodes: b.nodes, edges: b.edges, r: 32 + Math.sqrt(n) * 3.5 };
      });
      var named = c.named.map(function (m) {
        var h = hubs[m[1]], t = { x: h.x * 0.82, y: h.y * 0.82, z: h.z * 0.82 };
        return { name: m[0], group: h.group[0], n: h.nodes.slice().sort(function (p, q) { return d3(p, t) - d3(q, t); })[0] };
      });
      out = { R: 280, E: 285, hubs: hubs, named: named };
    }
    brainCache[key] = out; return out;
  }
  function pine(a) { return 'rgba(28,58,40,' + Math.round(a * 100) / 100 + ')'; }

  function drawBrain(host, opts) {
    var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
    var tall = H / W > 1.3, c = opts.camp ? camp(opts.camp) : null, key = c ? c.id : 'whole', sc = scene(opts.camp, tall);
    var cam = session.cam[key] || (session.cam[key] = { yaw: 0.55, pitch: -0.3, zoom: 1 });
    var dpr = Math.min(window.devicePixelRatio || 1, 2), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var small = Math.min(W, H) < 330, core = Math.round(clamp(Math.min(W, H) * 0.15, 40, 60));
    var html = '';
    if (!c) {
      sc.hubs.forEach(function (h, i) {
        var hc = h.camp;
        html += isOn(hc.id)
          ? '<button type="button" class="bl" data-i="' + i + '" data-action="open-camp" data-camp="' + hc.id + '"><b>' + esc(hc.name) + '</b>' + (small ? '' : '<small>' + hc.memories.toLocaleString('en-US') + ' memories</small>') + '</button>'
          : '<button type="button" class="bl is-off" data-i="' + i + '" data-action="explore" data-camp="' + hc.id + '" aria-label="' + esc(hc.name) + ', not connected"><span class="bl-ico">' + icon(hc.icon, 20, PINE, 1.8) + '</span><b>' + esc(hc.name) + '</b>' + (small ? '' : '<small>Not connected</small>') + '</button>';
      });
      html += '<button type="button" class="bl-core is-you' + (state.photo ? ' has-photo' : '') + '" style="width:' + core + 'px;height:' + core + 'px;font-size:' + Math.round(core * 0.4) + 'px" data-action="toast" data-msg="Everything Sherpa knows about your business, in one place. Any AI can use it." aria-label="You, ' + esc(state.name) + '">' + face() + '</button>';
    } else {
      sc.hubs.forEach(function (h, i) {
        html += '<button type="button" class="bl" data-i="' + i + '" data-action="toast" data-msg="' + esc(h.group[1] + ' ' + h.group[0].toLowerCase() + ' remembered in ' + c.name + '.') + '"><b>' + esc(h.group[0]) + '</b>' + (small ? '' : '<small>' + h.group[1] + '</small>') + '</button>';
      });
      sc.named.forEach(function (m, i) {
        html += '<button type="button" class="bl is-mem" data-m="' + i + '" data-action="memory" data-name="' + esc(m.name) + '" data-group="' + esc(m.group) + '" data-camp="' + c.id + '"><b>' + esc(m.name) + '</b></button>';
      });
      html += '<span class="bl-core is-camp" style="width:' + core + 'px;height:' + core + 'px" aria-hidden="true">' + icon(c.icon, Math.round(core * 0.46), PINE, 1.8) + '</span>';
    }
    host.innerHTML = '<canvas class="brain-cv" width="' + Math.round(W * dpr) + '" height="' + Math.round(H * dpr) + '" aria-hidden="true"></canvas><div class="brain-lbls">' + html + '</div>';
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', (c ? c.name + ' brain: ' + c.groups.map(function (g) { return g[1] + ' ' + g[0].toLowerCase(); }).join(', ') : 'Brain of your business: every connected camp around Sherpa') + '. Drag to turn it, pinch or scroll to zoom.');
    var cv = host.firstChild, g = cv.getContext('2d'), L = host.lastChild;
    var hubEls = [], memEls = [], coreEl = $('.bl-core', L);
    $$('.bl[data-i]', L).forEach(function (el) { hubEls[+el.dataset.i] = el; });
    $$('.bl[data-m]', L).forEach(function (el) { memEls[+el.dataset.m] = el; });
    var DIST = 1000, unit = Math.min(W * 0.43, (tall ? H / 1.5 : H) * 0.48) / sc.E, sz = clamp(Math.min(W, H) / 480, 0.75, 1.3);
    var ox = W / 2, oy = H / 2, need = true, last = 0, idle = 0, boxes = [];
    coreEl.style.transform = 'translate(' + r1(ox - core / 2) + 'px,' + r1(oy - core / 2) + 'px)';
    function on(h) { return c ? true : isOn(h.camp.id); }
    function A(z) { return clamp(0.95 - (z + sc.R) / (2 * sc.R) * 0.7, 0.18, 0.95); }
    function paint() {
      var cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch), U = unit * cam.zoom, zs = Math.sqrt(cam.zoom);
      function P(q) { var x = q.x * cy - q.z * sy, z1 = q.x * sy + q.z * cy, y = q.y * cp - z1 * sp, z = q.y * sp + z1 * cp, f = DIST / (DIST + z); q._x = ox + x * U * f; q._y = oy + y * U * f; q._z = z; q._f = f; }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.lineCap = 'round';
      sc.hubs.forEach(function (h) { P(h); if (on(h)) h.nodes.forEach(P); });
      // spokes from Sherpa to every connected camp
      g.lineWidth = 1.4;
      sc.hubs.forEach(function (h) { if (!on(h)) return; g.strokeStyle = pine(A(h._z) * 0.5); g.beginPath(); g.moveTo(ox, oy); g.lineTo(h._x, h._y); g.stroke(); });
      // camps not made yet: a dashed ring
      g.setLineDash([4, 5]); g.lineWidth = 1.5;
      sc.hubs.forEach(function (h) { if (on(h)) return; g.strokeStyle = pine(A(h._z) * 0.9); g.beginPath(); g.arc(h._x, h._y, 24 * sz * h._f * zs, 0, 7); g.stroke(); });
      g.setLineDash([]);
      // memory links
      g.lineWidth = 1;
      sc.hubs.forEach(function (h) { if (!on(h)) return; h.edges.forEach(function (e) { var a = h.nodes[e[0]], b = h.nodes[e[1]]; g.strokeStyle = pine(A((a._z + b._z) / 2) * 0.3); g.beginPath(); g.moveTo(a._x, a._y); g.lineTo(b._x, b._y); g.stroke(); }); });
      // memories, far to near
      var dots = [];
      sc.hubs.forEach(function (h) { if (!on(h)) return; dots.push(h); h.nodes.forEach(function (n) { dots.push(n); }); });
      dots.sort(function (a, b) { return b._z - a._z; });
      dots.forEach(function (n) { var hub = !!n.nodes, r = (hub ? 6 : 1.2 + n.s * 2.4) * sz * n._f * zs; g.fillStyle = pine(hub ? Math.min(1, A(n._z) + 0.2) : A(n._z)); g.beginPath(); g.arc(n._x, n._y, Math.max(0.7, r), 0, 7); g.fill(); });
      // named memories inside a camp, tied together
      if (c && sc.named.length) {
        g.strokeStyle = pine(0.85); g.lineWidth = 1.6; g.beginPath();
        sc.named.forEach(function (m, i) { var q = m.n; if (i) g.lineTo(q._x, q._y); else g.moveTo(q._x, q._y); }); g.stroke();
        g.fillStyle = PINE; g.strokeStyle = MIST; g.lineWidth = 2;
        sc.named.forEach(function (m) { var q = m.n; g.beginPath(); g.arc(q._x, q._y, 6 * sz * zs, 0, 7); g.fill(); g.stroke(); });
      }
      place(U);
    }
    // Labels follow their clusters. Nearer ones win; one that would sit on another fades out until it's clear.
    function place(U) {
      boxes.length = 0;
      var items = [], act = document.activeElement;
      hubEls.forEach(function (el, i) { if (el) items.push({ el: el, h: sc.hubs[i], z: sc.hubs[i]._z }); });
      memEls.forEach(function (el, i) { if (el) items.push({ el: el, m: sc.named[i], z: -1e4 }); });
      items.sort(function (a, b) { return a.z - b.z; });
      var cr = core / 2 + 4;
      items.forEach(function (it) {
        var el = it.el, w = el._w || (el._w = el.offsetWidth), hh = el._h || (el._h = el.offsetHeight), x, y;
        if (it.m) { var q = it.m.n, right = q._x >= ox; x = right ? q._x + 10 : q._x - 10 - w; y = q._y - hh / 2; }
        else if (!on(it.h)) { x = it.h._x - w / 2; y = it.h._y - 20; }
        else {
          var h = it.h, vx = h._x - ox, vy = h._y - oy, len = Math.hypot(vx, vy);
          if (len < 24) { vx = 0; vy = 1; len = 1; }
          var push = h.r * U * h._f * 0.8 + 10;
          x = h._x + vx / len * push - w / 2; y = h._y + vy / len * push - hh / 2;
        }
        x = clamp(x, 4, W - w - 4); y = clamp(y, 4, H - hh - 4);
        var box = [x, y, x + w, y + hh];
        var hit = el !== act && (boxes.some(function (b) { return b[0] < box[2] && box[0] < b[2] && b[1] < box[3] && box[1] < b[3]; }) || (box[0] < ox + cr && ox - cr < box[2] && box[1] < oy + cr && oy - cr < box[3]));
        el.style.transform = 'translate(' + r1(x) + 'px,' + r1(y) + 'px)';
        el.style.opacity = hit ? '0' : String(it.h ? Math.round(clamp(1.3 - (it.h._z + sc.R) / (2 * sc.R), 0.5, 1) * 100) / 100 : 1);
        el.style.pointerEvents = hit ? 'none' : '';
        if (!hit) boxes.push(box);
      });
    }
    function frame(t) {
      if (!cv.isConnected) return;
      var dt = last ? Math.min(64, t - last) : 16; last = t;
      if (!reduce && !host._held && Date.now() > idle) { cam.yaw += dt * 0.00018; need = true; }
      if (need) { need = false; paint(); }
      requestAnimationFrame(frame);
    }
    host._brain = {
      cam: cam,
      poke: function () { need = true; idle = Date.now() + 3000; },
      hold: function (v) { host._held = v; if (!v) idle = Date.now() + 3000; },
      reset: function () { cam.yaw = 0.55; cam.pitch = -0.3; cam.zoom = 1; need = true; idle = Date.now() + 1500; },
      hit: function (x, y) {
        var best = null, bd = 1e9;
        sc.hubs.forEach(function (h, i) { if (!on(h) || !hubEls[i]) return; var d = Math.hypot(h._x - x, h._y - y), r = Math.max(28, h.r * unit * cam.zoom * h._f); if (d < r && d < bd) { bd = d; best = hubEls[i]; } });
        return best;
      }
    };
    paint();
    requestAnimationFrame(frame);
  }

  function drawView(view) {
    var art = $('.view-art', view); if (!art) return;
    var scope = view.getAttribute('data-scope'), lens = view.getAttribute('data-lens');
    gestures(art);
    if (scope === 'onboard') { art._mode = null; art._map = art._brain = null; art.classList.remove('is-live'); return drawMap(art, { still: true }); }
    art.classList.add('is-live');
    if (scope !== 'home' || lens === 'brain') { art._mode = 'brain'; art._map = null; return drawBrain(art, { camp: scope === 'home' ? null : scope }); }
    art._mode = 'map'; art._brain = null;
    // The snapshot, the map and full screen each keep their own place, so moving around one doesn't move the others.
    if (view.classList.contains('is-intro')) return lens === 'brain' ? drawBrain(art, {}) : drawMap(art, { live: true, key: 'intro' });
    var full = view.classList.contains('is-full'), pv = view.classList.contains('is-preview') && !full;
    drawMap(art, { live: true, key: pv ? 'pv' : full ? 'full' : 'home', center: pv ? 'you' : null });
  }
  var ro = window.ResizeObserver ? new ResizeObserver(function (list) {
    list.forEach(function (en) { var v = en.target.closest('.view'); if (v && en.contentRect.width) { cancelAnimationFrame(v._raf); v._raf = requestAnimationFrame(function () { drawView(v); }); } });
  }) : null;
  function mountViews() {
    $$('.view').forEach(function (v) { drawView(v); if (ro) ro.observe($('.view-art', v)); });
  }

  /* ================= moving around ================= */
  // One finger or the mouse drags (moves the map, turns the brain). Two fingers pinch, the wheel zooms.
  function setVB(art, vb) {
    var m = art._map; if (!m) return;
    vb = clampVB(vb, m.g, art.clientWidth, art.clientHeight); session.mapVB[m.key] = vb;
    var vbs = vb.map(r1).join(' '); $$('svg.map-terrain, svg.map-svg', art).forEach(function (sv) { sv.setAttribute('viewBox', vbs); });
  }
  function redrawMap(art, wait) { clearTimeout(art._rt); art._rt = setTimeout(function () { if (art.isConnected && art._map) drawMap(art, art._map.opts); }, wait || 0); }
  function zoomMap(art, f, x, y) {
    var m = art._map; if (!m) return;
    var W = art.clientWidth, H = art.clientHeight; x = x == null ? W / 2 : x; y = y == null ? H / 2 : y;
    var vb = session.mapVB[m.key] || m.base, nw = vb[2] / f, nh = vb[3] / f, mx = vb[0] + x / W * vb[2], my = vb[1] + y / H * vb[3];
    setVB(art, [mx - x / W * nw, my - y / H * nh, nw, nh]); redrawMap(art, 160);
  }
  function zoomBrain(art, f) { var b = art._brain; if (!b) return; b.cam.zoom = clamp(b.cam.zoom * f, 0.6, 2.6); b.poke(); }
  function gestures(art) {
    if (art._gest) return; art._gest = true;
    var ptrs = {}, s = null, moved = false, lastPt = null;
    function ids() { return Object.keys(ptrs); }
    function local(e) { var r = art.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function pinch() { var p = ids().map(function (k) { return ptrs[k]; }); return { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; }
    function begin() {
      var two = ids().length > 1, first = ptrs[ids()[0]];
      if (art._mode === 'map' && art._map) s = { vb: (session.mapVB[art._map.key] || art._map.base).slice(), pt: first, p: two ? pinch() : null };
      else if (art._mode === 'brain' && art._brain) s = { yaw: art._brain.cam.yaw, pitch: art._brain.cam.pitch, zoom: art._brain.cam.zoom, pt: first, p: two ? pinch() : null };
      else s = null;
    }
    art.addEventListener('pointerdown', function (e) {
      if (!art._mode || (e.button && e.button !== 0)) return;
      if (!ids().length) moved = false;
      ptrs[e.pointerId] = local(e); session.busy = Date.now() + 2500; begin();
      if (art._brain) art._brain.hold(true);
    });
    art.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId] || !s) return;
      ptrs[e.pointerId] = local(e); session.busy = Date.now() + 2500;
      var W = art.clientWidth, H = art.clientHeight, n = ids().length;
      if (n === 1) {
        var p = ptrs[e.pointerId], dx = p.x - s.pt.x, dy = p.y - s.pt.y;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
        if (!moved) { moved = true; try { art.setPointerCapture(e.pointerId); } catch (er) { } }
        if (art._mode === 'map') setVB(art, [s.vb[0] - dx * s.vb[2] / W, s.vb[1] - dy * s.vb[3] / H, s.vb[2], s.vb[3]]);
        else if (art._brain) { var c = art._brain.cam; c.yaw = s.yaw + dx * 0.008; c.pitch = clamp(s.pitch + dy * 0.006, -1.2, 1.2); art._brain.poke(); }
      } else if (n === 2 && s.p) {
        moved = true;
        var q = pinch(), f = q.d / s.p.d;
        if (art._mode === 'map') { var nw = s.vb[2] / f, nh = s.vb[3] / f, mx = s.vb[0] + s.p.x / W * s.vb[2], my = s.vb[1] + s.p.y / H * s.vb[3]; setVB(art, [mx - q.x / W * nw, my - q.y / H * nh, nw, nh]); }
        else if (art._brain) { art._brain.cam.zoom = clamp(s.zoom * f, 0.6, 2.6); art._brain.poke(); }
      }
    });
    function end(e) {
      if (!ptrs[e.pointerId]) return;
      lastPt = ptrs[e.pointerId]; delete ptrs[e.pointerId];
      session.busy = Date.now() + 1500;
      if (ids().length) { begin(); return; }
      s = null;
      if (art._brain) art._brain.hold(false);
      if (moved) { session.noClick = Date.now() + 350; if (art._mode === 'map') redrawMap(art, 0); }
      else if (e.type === 'pointerup' && art._mode === 'brain' && art._brain && !e.target.closest('.bl, .bl-core')) { var el = art._brain.hit(lastPt.x, lastPt.y); if (el) el.click(); }
    }
    art.addEventListener('pointerup', end); art.addEventListener('pointercancel', end);
    art.addEventListener('wheel', function (e) {
      if (!art._mode) return;
      e.preventDefault(); session.busy = Date.now() + 1500;
      var f = Math.exp(-e.deltaY * 0.0015);
      if (art._mode === 'map') { var p = local(e); zoomMap(art, f, p.x, p.y); } else zoomBrain(art, f);
    }, { passive: false });
  }

  /* ================= the intro ================= */
  // The first time you reach the map, Sherpa flies you over it like the start of a game: the trailhead, Base
  // Camp (pick your AI right there), each everyday camp (connect it now or later), a look at the Brain view, then
  // the summit. Next moves
  // on; Skip ends it. It can be replayed from Settings.
  function introSteps() {
    var w = world(state.mapN || 1);
    return [{ id: 'trailhead', p: w.trailhead, vw: 1000 }, { id: 'base', p: w.base, vw: 1300 }]
      .concat(D.CAMPS.filter(function (c) { return c.core; }).map(function (c) { return { id: 'camp', camp: c, p: w.pts[c.id], vw: 1100 }; }))
      .concat([{ id: 'brain' }, { id: 'summit', p: w.summit, vw: 1200 }]);
  }
  function introSay(st) {
    if (st.id === 'trailhead') return 'This is the trailhead, ' + state.name + '. You\'re starting here.';
    if (st.id === 'base') return climbing() ? 'This is Base Camp, running on ' + modelsLabel() + '. Every climb starts here.' : 'Let\'s start climbing by setting up Base Camp. Which AI do you use? Pick one for now. You can add more later.';
    if (st.id === 'camp') {
      var c = st.camp, ex = D.TRAILS.filter(function (t) { return t.camp === c.id; })[0];
      return isOn(c.id) ? c.name + ' is connected with ' + toolsLabel(c.id) + '.' : 'This is ' + c.name + '. Here I can ' + (ex ? ex.title.charAt(0).toLowerCase() + ex.title.slice(1) : 'take work off your plate') + ', and more. Connect it now, or later?';
    }
    if (st.id === 'brain') return 'This is the Brain view: another way to view your AI brain. Switch between Map and Brain any time.';
    return 'Every hour I save you is an hour of elevation gained. Make it to the summit and you\'ve won back ' + state.summit + ' hours of freedom, every week.';
  }
  // The choices under Sherpa's line: an AI for Base Camp, a tool for a camp.
  function introActs(st) {
    if (st.id === 'base' && !climbing()) return D.MODELS.map(function (m) { return '<button type="button" class="chipbtn on-pine" data-action="intro-ai" data-model="' + m.id + '">' + m.id + '</button>'; }).join('');
    if (st.id === 'camp' && !isOn(st.camp.id)) return st.camp.tools.concat(['Other']).map(function (t) { return '<button type="button" class="chipbtn on-pine" data-action="intro-tool" data-camp="' + st.camp.id + '" data-tool="' + esc(t) + '">' + esc(t) + '</button>'; }).join('');
    return '';
  }
  function renderIntro() {
    var n = introSteps().length;
    return '<main class="intro" id="main"><section class="view is-full is-intro" data-scope="home" data-lens="map" aria-label="Your mountain"><div class="view-art"></div></section>' +
      '<div class="intro-card pine" role="dialog" aria-label="Sherpa intro">' + sherpaDisc(true, 48) +
      '<div class="grow col"><b>Sherpa</b><p class="intro-say" aria-live="polite"></p><div class="chips intro-acts" role="group" aria-label="Choose"></div>' +
      '<div class="row between intro-foot"><span class="intro-dots" aria-hidden="true">' + new Array(n + 1).join('<i></i>') + '</span>' +
      '<span class="row gap8"><button type="button" class="btn ghost-mist sm" data-action="intro-skip">Skip</button><button type="button" class="btn mist sm" data-action="intro-next">Next</button></span></div></div></div></main>';
  }
  var intro = { i: 0, typing: 0, text: '' };
  function introType(text) {
    var say = $('.intro-say'); if (!say) return;
    intro.text = text; clearInterval(intro.typing); say.textContent = '';
    var c = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { say.textContent = text; return; }
    intro.typing = setInterval(function () { c += 2; say.textContent = text.slice(0, c); if (c >= text.length) clearInterval(intro.typing); }, 26);
  }
  function introButtons(st) {
    var steps = introSteps(), nx = $('[data-action="intro-next"]'), acts = $('.intro-acts'), last = intro.i === steps.length - 1;
    var choice = introActs(st);
    if (acts) { acts.innerHTML = choice; acts.hidden = !choice; }
    // A camp can wait: Later moves on. Base Camp needs an AI before the climb can start, but Skip still works.
    if (nx) { nx.textContent = last ? 'Start the climb' : choice && st.id === 'camp' ? 'Later' : 'Next'; nx.hidden = !!choice && st.id === 'base'; }
  }
  function introShow(i) {
    var steps = introSteps(), st = steps[i]; if (!st || !$('.intro-say')) return;
    intro.i = i;
    $$('.intro-dots i').forEach(function (d, k) { d.className = k <= i ? 'on' : ''; });
    introType(introSay(st)); introButtons(st);
    var v = $('.view.is-intro'), art = v && $('.view-art', v); if (!art) return;
    if (st.id === 'brain') { cancelAnimationFrame(session.flyRaf); v.dataset.lens = 'brain'; art._mode = 'brain'; art._map = null; drawBrain(art, {}); return; }
    // coming back from the brain: put the map back where the camera left it
    if (v.dataset.lens === 'brain') { v.dataset.lens = 'map'; art._mode = 'map'; art._brain = null; art.innerHTML = ''; drawMap(art, { live: true, key: 'intro' }); }
    fly(st.p, st.vw, i ? 2000 : 1600);
  }
  function introRedraw() { var art = $('.view.is-intro .view-art'); if (art && art._map) drawMap(art, art._map.opts); }
  // Glide the camera to a point: it lifts out a little mid-flight, like a drone, then settles in.
  function fly(p, vw, ms) {
    var v = $('.view.is-intro'), art = v && $('.view-art', v), m = art && art._map; if (!m) return;
    var W = art.clientWidth, H = art.clientHeight, from = (session.mapVB[m.key] || m.base).slice(), to = fitVB(focusOn(p, W, H, vw), W, H);
    to[1] += to[3] * 0.14; // the caption sits low, so the target sits a little above centre
    var fc = [from[0] + from[2] / 2, from[1] + from[3] / 2], tc = [to[0] + to[2] / 2, to[1] + to[3] / 2], lift = Math.min(1.2, Math.hypot(tc[0] - fc[0], tc[1] - fc[1]) / Math.max(to[2], from[2]));
    var t0 = performance.now(), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    cancelAnimationFrame(session.flyRaf);
    function step(now) {
      if (!art.isConnected) return;
      var t = reduce ? 1 : clamp((now - t0) / ms, 0, 1), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      var w = from[2] * Math.pow(to[2] / from[2], e) * (1 + lift * Math.sin(Math.PI * e)), h = w * H / W;
      var cx = fc[0] + (tc[0] - fc[0]) * e, cy = fc[1] + (tc[1] - fc[1]) * e;
      session.mapVB[m.key] = [cx - w / 2, cy - h / 2, w, h];
      drawMap(art, m.opts);
      if (t < 1) session.flyRaf = requestAnimationFrame(step);
    }
    session.flyRaf = requestAnimationFrame(step);
  }
  function introEnd() {
    clearInterval(intro.typing); cancelAnimationFrame(session.flyRaf); clearTimeout(intro.next);
    state.introSeen = true; if (climbing()) state.nextAt = Date.now() + 3000;
    delete session.mapVB.intro; save(); go('home');
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
  function closeSheet() { var s = $('.scrim'); if (s) { s.remove(); if (session.lastFocus && session.lastFocus.focus && document.body.contains(session.lastFocus)) session.lastFocus.focus(); if (session.dirty) liveRender(); } }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('show'); }, 3000);
  }

  function exploreSheet(id) {
    var c = camp(id);
    sheet('<div class="sheet-head">' + campDisc(c, 48, true) + '<div class="col"><h2>' + esc(c.name) + '</h2><span class="soft">' + esc(c.tools.join(', ')) + '</span></div></div>' + campDoes(c) + connectBlock(c), { label: 'Connect ' + c.name });
  }
  function baseSheet() {
    var n = madeCount();
    sheet('<div class="sheet-head"><span class="cdisc" style="width:48px;height:48px">' + icon('base', 22, PINE, 1.8) + '</span><div class="col"><h2>Base Camp</h2><span class="soft">Pick the AI that runs Sherpa. You can add more later.</span></div></div>' +
      (true ? '<div class="tiles2" role="group" aria-label="AI models">' + D.MODELS.map(function (m) {
        return '<button type="button" class="tile-radio" role="checkbox" aria-checked="' + (state.models.indexOf(m.id) > -1) + '" data-action="model" data-model="' + m.id + '"><b>' + m.id + '</b><span>' + m.by + '</span></button>';
      }).join('') + '</div><button type="button" class="btn primary block lg" data-action="make-base">Make Base Camp</button><p class="fine">' + (n ? 'Sherpa starts working in ' + esc(listing(madeNames())) + ' right away.' : 'Then connect a camp and Sherpa gets to work there.') + ' Every task it finishes counts toward your summit.</p>' : ''), { label: 'Base Camp' });
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
    var a = session.chatAbout && openApprovals().filter(function (x) { return x.id === session.chatAbout; })[0];
    sheet((a ? '<h2 class="chat-title">' + esc(a.who) + '</h2><div class="soft">' + esc(a.what) + '</div><div class="appr-more chat-draft"><div class="appr-kind">' + esc(a.kind) + '</div><p>' + esc(a.detail) + '</p></div>' : '<h2 class="chat-title">Ask Sherpa</h2>') + '<div class="chat" aria-live="polite">' + session.chat.map(function (m) { return '<div class="msg ' + m.who + '">' + esc(m.text) + '</div>'; }).join('') + '</div>' +
      (a ? '<div class="chat-acts"><button type="button" class="btn primary sm" data-action="approve" data-id="' + a.id + '">' + esc(a.verb) + '</button><button type="button" class="btn ghost sm" data-action="reject" data-id="' + a.id + '">Reject</button></div>' : '') +
      askBar(a ? 'Ask, or say what to change' : 'Ask Sherpa', false, 'ask-s'), { label: a ? 'Chat about ' + a.who : 'Ask Sherpa', cls: 'chat-sheet' });
    var c = $('.chat'); if (c) c.scrollTop = c.scrollHeight;
  }
  function answer(q) {
    var t = q.toLowerCase(), n = openApprovals();
    var a = session.chatAbout && n.filter(function (x) { return x.id === session.chatAbout; })[0];
    if (a) {
      if (/^(no\b|nope|reject|don'?t|do not|drop|cancel|skip)/.test(t)) { session.chatAct = { kind: 'reject', a: a }; return 'Done. ' + a.no; }
      if (/^(yes|yep|ok|okay|sure|go ahead|do it|send|approve|confirm|looks good)/.test(t)) { session.chatAct = { kind: 'approve', a: a }; return 'Done. ' + a.log + '.'; }
      if (/why|how come|reason|where/.test(t)) return a.why;
      if (/change|edit|shorter|longer|tone|reword|rewrite|instead|add|remove|make it|warmer|formal|friendlier|move/.test(t)) return 'Got it. I\'ll make that change and bring it back to you before anything goes out.';
      return 'Tell me what to change, or ' + a.verb.toLowerCase() + ' it as it is.';
    }
    if (/elev|hour|summit|how far|progress|time back/.test(t)) {
      return 'I\'ve saved you ' + f1(elevation()) + ' h this week, counted from the tasks I finished. ' + (toGo() > 0 ? fh(toGo()) + ' to the summit.' : 'You made the summit.');
    }
    if (/need|approv|waiting|pending|inbox/.test(t)) return n.length ? words(n.length) + ' things need you: ' + n.map(function (a) { return a.who + ' (' + a.what.toLowerCase() + ')'; }).join(', ') + '.' : 'Nothing needs you right now.';
    if (/today|log|did you|done/.test(t)) { var es = entries().filter(function (e) { return e.day === 'Today' && !e.undone; }); return es.length ? 'Today I saved you ' + todayMinutes() + ' minutes. ' + es.slice(0, 2).map(function (e) { return e.text; }).join('. ') + '.' : 'Nothing finished yet today. I\'m on it.'; }
    if (/camp|tool|connect/.test(t)) { var u = unexplored(); return u.length ? 'You have ' + (D.CAMPS.length - u.length) + ' camps. Connect ' + u[0].name + ' next and I\'ll work there too.' : 'Every camp is made.'; }
    return 'I can\'t reach your tools in this demo, so I can\'t answer that yet. Once they\'re connected, I\'ll answer from them.';
  }

  /* ================= actions ================= */
  function crossSummit(before) {
    var e = elevation();
    if (state.onboarded && before < state.summit && e >= state.summit && state.reached !== state.summit) { nextPick = null; save(); toast('You made the summit.'); go('summit'); return true; }
    return false;
  }
  function afterGain(before, msg) { if (crossSummit(before)) return; toast(msg); render(); }
  function connectCamp(id) {
    var c = camp(id), left = c.tools.filter(function (t) { return toolsOf(id).indexOf(t) < 0; });
    var tool = left.indexOf(session.pendingTool[id]) > -1 ? session.pendingTool[id] : left[0];
    if (!tool) return;
    session.connecting = id; refreshConnect();
    setTimeout(function () {
      var before = elevation();
      session.connecting = null;
      var adding = isOn(id);
      if (adding) state.camps[id].tools.push(tool); else state.camps[id] = { tools: [tool], at: Date.now() };
      if (session.openRow === id) session.openRow = null;
      delete session.pendingTool[id];
      save(); closeSheet();
      if (adding) { soon(); toast(tool + ' added. Sherpa now works across ' + toolsLabel(id) + '.'); render(); return; }
      if (!state.onboarded) { toast(c.name + ' camp made with ' + tool + '.'); render(); return; }
      soon();
      var msg = c.name + ' camp made with ' + tool + '.' + (climbing() ? ' Sherpa starts working there now.' : ' Make Base Camp and Sherpa gets to work.');
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
    'pick-tool': function (el) { session.pendingTool[el.dataset.camp] = el.dataset.tool; var sc = $('.scrim'); if (sc) { var box = $('.connect', sc); if (box) { box.outerHTML = connectBlock(camp(el.dataset.camp)); return; } } render(); },
    'connect': function (el) { if (session.connecting) return; connectCamp(el.dataset.camp); },
    'model': function (el) {
      var id = el.dataset.model, i = state.models.indexOf(id);
      if (i > -1) { if (state.models.length === 1) { toast('Keep at least one AI at Base Camp.'); return; } state.models.splice(i, 1); }
      else state.models.push(id);
      save();
      $$('.scrim [data-action="model"]').forEach(function (b) { b.setAttribute('aria-checked', String(state.models.indexOf(b.dataset.model) > -1)); });
      if (climbing()) toast('Base Camp runs on ' + modelsLabel() + '. Your memories work with all of them.');
      render();
    },
    'start-climb': function () { state.onboarded = true; state.step = 'done'; state.introSeen = false; save(); go('home'); },
    'intro-next': function () {
      var say = $('.intro-say');
      if (say && say.textContent.length < intro.text.length) { clearInterval(intro.typing); say.textContent = intro.text; return; }
      clearTimeout(intro.next);
      if (intro.i < introSteps().length - 1) introShow(intro.i + 1); else introEnd();
    },
    'intro-skip': function () { introEnd(); },
    'intro-ai': function (el) {
      state.models = [el.dataset.model]; state.baseAt = Date.now(); state.done = []; state.cursor = 0; save();
      var st = introSteps()[intro.i]; introButtons(st); introRedraw();
      introType('Base Camp is up, running on ' + el.dataset.model + '. Now let\'s give me some work to do.');
      clearTimeout(intro.next); intro.next = setTimeout(function () { if ($('.intro-say')) introShow(intro.i + 1); }, 2600);
    },
    'intro-tool': function (el) {
      var id = el.dataset.camp;
      if (el.dataset.tool === 'Other') { introType('Other ' + camp(id).name + ' connectors will be listed here. Pick one above, or connect it later.'); return; } state.camps[id] = { tools: [el.dataset.tool], at: Date.now() }; save();
      var st = introSteps()[intro.i]; introButtons(st); introRedraw();
      introType(el.dataset.tool + ' is connected. ' + camp(id).name + ' camp is made.');
      clearTimeout(intro.next); intro.next = setTimeout(function () { if ($('.intro-say')) introShow(intro.i + 1); }, 1800);
    },
    'intro-replay': function () { state.introSeen = false; save(); go('home'); },
    'basecamp': function () { baseSheet(); },
    'map-key': function () { state.mapKey = !keyOpen(); save(); render(); },
    'appr-open': function (el) { session.apprOpen[el.dataset.id] = !session.apprOpen[el.dataset.id]; render(); },
    'make-base': function () {
      state.baseAt = Date.now(); state.nextAt = state.baseAt + 4000; state.done = []; state.cursor = 0; save(); session.mapVB = {};
      closeSheet(); toast(madeCount() ? 'Base Camp made. Sherpa is getting to work.' : 'Base Camp made. Now connect your first camp.'); render();
    },
    'photo-remove': function () { state.photo = ''; save(); render(); },
    'lens': function (el) {
      var v = el.closest('.view'), scope = v.dataset.scope, lens = el.dataset.lens;
      if (scope !== 'home') return;
      state.lens = lens; save();
      v.dataset.lens = lens; $$('[data-action="lens"]', v).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lens === lens)); });
      v.setAttribute('aria-label', 'Your mountain, ' + lens + ' view');
      drawView(v);
    },
    'full': function () { session.full = !session.full; render(); },
    'open-camp': function (el) { if (session.full) session.full = false; go('camp-' + el.dataset.camp); },
    'explore': function (el) {
      if (!state.onboarded) return;
      var c = camp(el.dataset.camp);
      exploreSheet(c.id);
    },
    'go': function (el) { go(el.dataset.to); },
    'toast': function (el) { toast(el.dataset.msg); },
    'summit': function () { if (!state.onboarded) { toast('Your summit: ' + state.summit + ' h a week, for ' + state.why.toLowerCase() + '.'); return; } if (elevation() >= state.summit) go('summit'); else toast('Summit: ' + state.summit + ' h a week. ' + fh(toGo()) + ' to go.'); },
    'approve': function (el) {
      var a = apprOf(el.dataset.id), inChat = !!el.closest('.chat-sheet');
      if (inChat) session.chat.push({ who: 'sherpa', text: 'Done. ' + a.log + '.' });
      doApprove([a]); if (inChat && location.hash !== '#summit') chatSheet();
    },
    'reject': function (el) {
      var a = apprOf(el.dataset.id), inChat = !!el.closest('.chat-sheet');
      if (inChat) session.chat.push({ who: 'sherpa', text: 'Done. ' + a.no });
      doReject(a, inChat); if (inChat) chatSheet();
    },
    'appr-chat': function (el) {
      var a = apprOf(el.dataset.id);
      if (session.chatAbout !== a.id) { session.chat = []; session.chatAbout = a.id; session.chat.push({ who: 'sherpa', text: a.why + ' ' + a.verb + ' it, reject it, or tell me what to change.' }); }
      chatSheet();
    },
    'approve-all': function () { doApprove(openApprovals()); },

    'report-later': function () { markReportRead(); render(); },
    'disconnect': function (el) {
      var cm = state.camps[el.dataset.camp]; if (!cm || cm.tools.length < 2) return;
      cm.tools = cm.tools.filter(function (t) { return t !== el.dataset.tool; }); save();
      toast(el.dataset.tool + ' removed from ' + camp(el.dataset.camp).name + '.'); render();
    },
    'perm': function (el) { state.perms[el.dataset.camp] = el.dataset.perm; save(); toast({ read: 'Sherpa will only read in ' + camp(el.dataset.camp).name + '.', ask: 'Sherpa will ask before acting in ' + camp(el.dataset.camp).name + '.', act: 'Sherpa will act alone in ' + camp(el.dataset.camp).name + ' and log every step.' }[el.dataset.perm]); render(); },
    'log-camp': function (el) { session.logCamp = el.dataset.camp; session.logSel = null; render(); },
    'log-open': function (el) { if (desk()) { session.logSel = el.dataset.id; render(); } else receiptSheet(el.dataset.id); },
    'undo': function (el) { state.undone[el.dataset.id] = true; save(); closeSheet(); toast('Undone. Sherpa will ask first next time.'); render(); },
    'open-source': function (el) { toast(el.dataset.src + ' opens here once it\'s really connected.'); },
    'close-sheet': function () { closeSheet(); },
    'close-sheet-go': function (el) { closeSheet(); go(el.dataset.to); },
    'checkin': function () { checkin(); },
    'checkin-text': function () { closeSheet(); toast("Okay. I'll text you the short version."); },
    'checkin-answer': function () { closeSheet(); go(desk() ? 'home' : 'approvals'); },
    'memory': function (el) { memorySheet(el.dataset.name, el.dataset.group, el.dataset.camp); },
    'gear-summit': function (el) { state.summit = clamp(state.summit + Number(el.dataset.d), 1, 60); save(); render(); },
    'reset-ask': function () { session.confirmReset = true; render(); },
    'reset-cancel': function () { session.confirmReset = false; render(); },
    'reset': function () { try { localStorage.removeItem(KEY); } catch (e) { } state = fresh(); session.confirmReset = false; session.chat = []; session.chatAbout = null; session.snoozed = {}; session.cam = {}; session.mapVB = {}; brainCache = {}; go('start-welcome'); },
    'next-pick': function (el) { nextPick = el.dataset.v === 'hold' ? 'hold' : Number(el.dataset.v); render(); },
    'next-set': function () {
      state.summits = (state.summits || 0) + 1; state.reached = state.summit;
      if (nextPick !== 'hold') { state.summit = nextPick; state.mapN = (state.mapN || 1) + 1; }
      nextPick = null; save();
      toast(state.reached === state.summit ? 'Holding at ' + state.summit + '. Enjoy the view.' : 'A new mountain. Summit ' + state.summit + ' h a week.');
      go('home');
    },
    'share': function () { toast('Your award gets a share link here.'); },
    'zoom': function (el) { var art = $('.view-art', el.closest('.view')); if (!art) return; if (art._mode === 'map') zoomMap(art, Number(el.dataset.f)); else zoomBrain(art, Number(el.dataset.f)); },
    'recenter': function (el) {
      var art = $('.view-art', el.closest('.view')); if (!art) return;
      if (art._mode === 'map' && art._map) { delete session.mapVB[art._map.key]; drawMap(art, art._map.opts); } else if (art._brain) art._brain.reset();
    }
  };
  // Rejecting saves no time and nothing goes out. Sherpa remembers it, so the next one is closer.
  function doReject(a, quiet) {
    state.rejected[a.id] = true; session.apprOpen[a.id] = false; save();
    if (!quiet) toast('Rejected. ' + a.no);
    render();
  }
  function doApprove(list) {
    var before = elevation(), now = Date.now();
    list.forEach(function (a, i) {
      state.approvals[a.id] = true;
      state.done.push({ id: 'a' + now + a.id, ts: now + i, text: a.log, camp: a.camp, min: a.min, src: a.src });
    });
    save();
    if (crossSummit(before)) return;
    toast(list.length === 1 ? list[0].who + ': done. +' + list[0].min + ' min saved.' : 'All clear. +' + list.reduce(function (s, a) { return s + a.min; }, 0) + ' min saved.');
    render();
  }

  document.addEventListener('click', function (e) {
    if (Date.now() < session.noClick && e.target.closest('.view-art')) { e.preventDefault(); return; }
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
      // asking from anywhere but an open chat starts a fresh conversation, not one about an approval
      if (!f.closest('.chat-sheet') && session.chatAbout) { session.chatAbout = null; session.chat = []; }
      var q = f.elements.q.value.trim(); if (!q) { chatSheet(); return; }
      session.chat.push({ who: 'me', text: q }); session.chat.push({ who: 'sherpa', text: answer(q) });
      var act = session.chatAct; session.chatAct = null;
      if (act) { if (act.kind === 'reject') doReject(act.a, true); else doApprove([act.a]); }
      if (location.hash !== '#summit') chatSheet();
    } else if (kind === 'log-search') { /* live search below */ }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'photo-in' || !e.target.files || !e.target.files[0]) return;
    var file = e.target.files[0], url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var S = 192, c = document.createElement('canvas'), m = Math.min(img.width, img.height);
      c.width = c.height = S;
      var cx2 = c.getContext('2d'); cx2.fillStyle = MIST; cx2.fillRect(0, 0, S, S);
      cx2.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
      URL.revokeObjectURL(url);
      try { state.photo = c.toDataURL('image/jpeg', 0.85); save(); } catch (er) { toast('That photo didn\'t work. Try another.'); }
      render();
    };
    img.onerror = function () { URL.revokeObjectURL(url); toast('That photo didn\'t work. Try another.'); };
    img.src = url;
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
    if (session.last && session.last !== r.hash && session.full) session.full = false;
    var introNow = state.onboarded && !state.introSeen && (r.name === 'home' || r.name === 'map');
    var html =
      introNow ? renderIntro() :
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
    app.className = 'app ' + (desk() ? 'is-desk' : 'is-phone') + ' r-' + (introNow ? 'intro' : r.name);
    app.innerHTML = html;
    if (r.name === 'camp' && !desk() && isOn(r.camp)) { var slot = $('.p-view-slot'); if (slot) slot.outerHTML = viewPanel(r.camp, { cls: 'is-preview' }) + '<div class="sp-card pine">' + campSherpa(camp(r.camp)) + '</div>'; }
    mountViews();
    if (introNow) { delete session.mapVB.intro; var v = $('.view.is-intro .view-art'); if (v) drawMap(v, { live: true, key: 'intro' }); introShow(0); }
    document.title = titleFor(r) + ' · Apex Sherpa';
    session.last = r.hash;
    if (changed) { window.scrollTo(0, 0); var m = $('#main'); if (m) m.scrollTop = 0; }
  }
  // New finished work shows up on its own, but never mid-gesture, mid-typing or under an open sheet.
  function liveRender() {
    var a = document.activeElement, typing = a && /^(INPUT|TEXTAREA)$/.test(a.tagName), keys = false;
    try { keys = a && a !== document.body && app.contains(a) && a.matches(':focus-visible'); } catch (e) { }
    if ($('.scrim') || $('.view.is-intro') || Date.now() < session.busy || typing || keys) { session.dirty = true; return; }
    session.dirty = false; render();
  }
  function tick() {
    var before = elevation(), n = work(Date.now());
    if (n) { save(); if (state.done.length === n) toast('Sherpa finished its first task. Time saved starts now.'); if (crossSummit(before)) return; }
    if (n || session.dirty) liveRender();
  }
  function titleFor(r) {
    return { start: 'Setup', home: 'Home', map: 'Map', approvals: 'Approvals', camps: 'Camps', camp: r.camp ? camp(r.camp).name : 'Camp', log: 'Trail log', report: 'Trail report', gear: 'Settings', summit: 'Summit' }[r.name];
  }

  function boot() {
    app = $('#app');
    window.addEventListener('hashchange', render);
    if (deskMQ.addEventListener) deskMQ.addEventListener('change', render); else if (deskMQ.addListener) deskMQ.addListener(render);
    render();
    setInterval(tick, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
